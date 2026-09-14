/** 포맷·타일·클라이언트 자체 검증: npm test */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { LatLon, fromEnu, toEnu } from '../src/geo';
import { decodePack, encodePack, RoadWay } from '../src/format';
import {
  DEFAULT_ZOOM, lonLatToTile, tileCenter, tileSideMeters, tilesAround, tilesForBBox,
} from '../src/tiles';
import { MapClient, TileStorage } from '../src/client';

let fail = 0;
const check = (ok: boolean, name: string) => {
  console.log((ok ? '[PASS] ' : '[FAIL] ') + name);
  if (!ok) fail++;
};

// ── 타일 좌표 ──────────────────────────────────────────────
const SEOUL: LatLon = { lat: 37.56089822070307, lon: 126.83936366854338 };
const t = lonLatToTile(SEOUL.lat, SEOUL.lon, 13);
check(t.x === 6982 && t.y === 3172, `z13 타일 좌표 ${t.x}/${t.y}`);
const side = tileSideMeters(t);
check(side > 3500 && side < 4200, `타일 한 변 ${(side / 1000).toFixed(2)}km`);
const c = tileCenter(t);
check(Math.abs(c.lat - SEOUL.lat) < 0.02 && Math.abs(c.lon - SEOUL.lon) < 0.03, '타일 중심 계산');
const around = tilesAround(SEOUL, 1000, 13);
check(around.length >= 1 && around.length <= 4, `반경 1km 커버 타일 ${around.length}개`);
check(tilesForBBox({ west: 126.8, south: 37.5, east: 126.9, north: 37.6 }, 13).length > 0, 'bbox 타일 열거');

// ── 포맷 왕복 ──────────────────────────────────────────────
const origin = tileCenter(t);
const mkWay = (n: number, dx: number, layer: number): RoadWay => ({
  highway: 'residential', layer, spawnAllowed: layer === 0,
  points: Array.from({ length: n }, (_, i) => ({ x: dx + i * 12.37, y: i * -7.11 })),
});
const ways = [mkWay(20, 0, 0), mkWay(5, 300, 1), mkWay(8, -450, -1)];
const builds = [[{ x: 10, y: 10 }, { x: 30, y: 10 }, { x: 30, y: 28 }, { x: 10, y: 28 }]];
const bin = encodePack(origin, ways, builds, { tile: t });
const back = decodePack(bin);

check(back.ways.length === 3 && back.buildings.length === 1, '왕복: 개수 보존');
check(back.tile?.x === t.x && back.tile?.y === t.y, '왕복: 타일 정보 보존');
check(back.ways.map(w => w.layer).join() === '0,1,-1', '왕복: 레이어 보존');
check(back.ways[0].spawnAllowed && !back.ways[1].spawnAllowed, '왕복: 스폰 규칙 재계산');
let maxErr = 0;
for (let i = 0; i < ways.length; i++)
  for (let k = 0; k < ways[i].points.length; k++)
    maxErr = Math.max(maxErr, Math.hypot(
      back.ways[i].points[k].x - ways[i].points[k].x,
      back.ways[i].points[k].y - ways[i].points[k].y));
check(maxErr <= 0.18, `왕복: 좌표 오차 최대 ${(maxErr * 100).toFixed(1)}cm (양자화 한계 12.5cm×√2)`);

const perPoint = bin.byteLength / (ways.reduce((s, w) => s + w.points.length, 0) + 4);
check(perPoint < 7, `점당 ${perPoint.toFixed(1)}바이트 (double 16B 대비)`);

// ── 재투영 ────────────────────────────────────────────────
const play = fromEnu(origin, { x: 800, y: -600 });
const moved = decodePack(bin, play);
const shift = toEnu(play, origin);
let rErr = 0;
for (let i = 0; i < ways.length; i++)
  for (let k = 0; k < ways[i].points.length; k++)
    rErr = Math.max(rErr, Math.hypot(
      moved.ways[i].points[k].x - (back.ways[i].points[k].x + shift.x),
      moved.ways[i].points[k].y - (back.ways[i].points[k].y + shift.y)));
check(rErr < 0.5, `재투영(1km 이동) 오차 최대 ${(rErr * 100).toFixed(1)}cm`);

// ── 손상 방어 ─────────────────────────────────────────────
const mustThrow = (data: Uint8Array, label: string) => {
  try { decodePack(data); check(false, `${label} → 예외 없음 (위험)`); }
  catch { check(true, `${label} → 거부`); }
};
mustThrow(new Uint8Array(4), '빈 파일');
mustThrow((() => { const b = bin.slice(); b[0] = 0; return b; })(), '매직 불일치');
mustThrow(bin.slice(0, bin.byteLength - 40), '중간에 잘림');
mustThrow((() => { const b = bin.slice(); b[4] = 99; return b; })(), '미래 버전');

// ── 클라이언트 (메모리 저장소 + 가짜 서버) ───────────────────
(async () => {
  const disk = new Map<string, Uint8Array>();
  const storage: TileStorage = {
    has: async k => disk.has(k),
    read: async k => disk.get(k)!,
    write: async (k, d) => { disk.set(k, d); },
    remove: async k => { disk.delete(k); },
  };
  const manifest = {
    version: 'v1', zoom: 13, tilePath: 'v1/{z}/{x}/{y}.drmp',
    attribution: '© OpenStreetMap contributors',
    tiles: { [`13/${t.x}/${t.y}`]: bin.byteLength },
  };
  let hits = 0;
  const fakeFetch = (async (url: string) => {
    hits++;
    const u = String(url);
    if (u.endsWith('latest.json'))
      return { ok: true, arrayBuffer: async () => new TextEncoder().encode(JSON.stringify(manifest)).buffer };
    if (u.endsWith(`v1/13/${t.x}/${t.y}.drmp`))
      return { ok: true, arrayBuffer: async () => bin.buffer.slice(bin.byteOffset, bin.byteOffset + bin.byteLength) };
    return { ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) };
  }) as unknown as typeof fetch;

  const client = new MapClient({ baseUrl: 'https://example.test/maps', storage, fetchImpl: fakeFetch });
  const r1 = await client.loadAround(SEOUL, 500);
  check(r1.ways.length === 3, `1회차: 도로 ${r1.ways.length}개 수신`);
  check(r1.downloaded >= 1, `1회차: 다운로드 ${r1.downloaded}개`);
  check(r1.attribution.includes('OpenStreetMap'), '저작자 표시 전달');

  const hitsAfterFirst = hits;
  const client2 = new MapClient({ baseUrl: 'https://example.test/maps', storage, fetchImpl: fakeFetch });
  const r2 = await client2.loadAround(SEOUL, 500);
  check(r2.fromCache >= 1 && r2.downloaded === 0, `2회차: 전부 캐시 (${r2.fromCache}개)`);
  check(hits - hitsAfterFirst <= 1, '2회차: 타일 재요청 없음 (매니페스트만)');

  // 없는 타일을 요청하지 않는가
  const far: LatLon = { lat: 35.1578, lon: 129.0593 }; // 부산 — 매니페스트에 없음
  const before = hits;
  const r3 = await client2.loadAround(far, 500);
  check(r3.ways.length === 0 && hits === before, '매니페스트에 없는 타일은 요청조차 안 함');

  // 깨진 캐시는 지우고 넘어가는가
  disk.set(`v1/13/${t.x}/${t.y}.drmp`, bin.slice(0, 100));
  const r4 = await client2.loadAround(SEOUL, 500);
  check(!disk.has(`v1/13/${t.x}/${t.y}.drmp`) || r4.ways.length > 0, '깨진 캐시 삭제');

  console.log(fail === 0 ? '\n=== 전체 통과 ===' : `\n=== 실패 ${fail}건 ===`);
  process.exit(fail === 0 ? 0 : 1);
})();
