/**
 * OSM 수신 — Overpass API.
 *
 *  Overpass는 무료 공용 서버라 슬롯이 차면 504를 던진다. 버그가 아니라 정책이다.
 *  (실측 2026-09-14: overpass-api.de 3회 중 1회 504, maps.mail.ru 3/3 성공)
 *  죽은 미러를 목록에 두면 미러마다 타임아웃을 통째로 버리므로 살아 있는 것만 둔다.
 *
 *  ※ OSM 데이터는 ODbL 라이선스다. 구운 결과물을 배포할 때
 *    "© OpenStreetMap contributors" 표기가 필요하다.
 */
import { LatLon, Vec2, toEnu } from './geo';
import { HIGHWAY_KINDS, RoadWay, SPAWN_ALLOWED } from './format';

export const DEFAULT_ENDPOINTS = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];

export interface BBox { west: number; south: number; east: number; north: number }

interface El {
  type: string;
  geometry?: { lat: number; lon: number }[];
  tags?: Record<string, string>;
}

export interface FetchOptions {
  endpoints?: string[];
  timeoutMs?: number;
  /** 미러가 모두 실패했을 때 재시도 횟수 (Overpass 504는 대개 잠시 뒤 풀린다) */
  retries?: number;
  retryDelayMs?: number;
  log?: (msg: string) => void;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function query(q: string, opt: FetchOptions): Promise<El[]> {
  const endpoints = opt.endpoints ?? DEFAULT_ENDPOINTS;
  const timeoutMs = opt.timeoutMs ?? 90_000;
  const retries = opt.retries ?? 2;
  let lastErr = '';

  for (let attempt = 0; attempt <= retries; attempt++) {
    for (const ep of endpoints) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      try {
        const res = await fetch(ep, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 식별 불가한 UA는 overpass-api.de가 406으로 거부한다 (사용 정책)
            'User-Agent': 'deadrun-mapkit/0.1 (personal game prototype)',
            Accept: 'application/json',
          },
          body: 'data=' + encodeURIComponent(q),
          signal: ctrl.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const j = (await res.json()) as { elements?: El[] };
        return j.elements ?? [];
      } catch (e) {
        lastErr = `${ep}: ${String(e)}`;
        opt.log?.(`    미러 실패 ${lastErr}`);
      } finally {
        clearTimeout(timer);
      }
    }
    if (attempt < retries) {
      const wait = (opt.retryDelayMs ?? 5000) * (attempt + 1);
      opt.log?.(`    ${wait / 1000}초 뒤 재시도 (${attempt + 1}/${retries})`);
      await sleep(wait);
    }
  }
  throw new Error('Overpass 수신 실패: ' + lastErr);
}

const HW_RE = `^(${HIGHWAY_KINDS.join('|')})$`;
const bboxStr = (b: BBox) => `${b.south},${b.west},${b.north},${b.east}`;

/** 사각 범위의 보행 가능 도로 */
export async function fetchRoads(
  bbox: BBox, origin: LatLon, opt: FetchOptions = {},
): Promise<RoadWay[]> {
  const els = await query(
    `[out:json][timeout:180];(way["highway"~"${HW_RE}"](${bboxStr(bbox)}););out geom tags;`, opt);
  const ways: RoadWay[] = [];
  for (const el of els) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 2) continue;
    const t = el.tags ?? {};
    let layer = 0;
    if (t.bridge === 'yes') layer = 1;
    if (t.tunnel === 'yes') layer = -1;
    const l = parseInt(t.layer ?? '', 10);
    if (!isNaN(l)) layer = Math.max(-1, Math.min(1, l)); // 3레이어 모델
    const highway = t.highway ?? 'unclassified';
    ways.push({
      highway, layer,
      spawnAllowed: SPAWN_ALLOWED.has(highway) && layer === 0,
      points: el.geometry.map(g => toEnu(origin, g)),
    });
  }
  return ways;
}

/** 사각 범위의 건물 외곽선 */
export async function fetchBuildings(
  bbox: BBox, origin: LatLon, opt: FetchOptions = {},
): Promise<Vec2[][]> {
  const els = await query(
    `[out:json][timeout:180];(way["building"](${bboxStr(bbox)}););out geom;`, opt);
  const out: Vec2[][] = [];
  for (const el of els) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 3) continue;
    out.push(el.geometry.map(g => toEnu(origin, g)));
  }
  return out;
}
