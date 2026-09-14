/**
 * 지도 팩 굽기 — Overpass에서 받아 .drmp 바이너리로 저장한다.
 *
 *   npx tsx scripts/bakeMap.ts --lat 37.5609 --lon 126.8394 --radius 1500 --name mapo
 *   npx tsx scripts/bakeMap.ts --lat 37.5609 --lon 126.8394 --radius 1500 --name mapo --version v2
 *
 * 결과: dist-maps/<version>/<name>.drmp  +  dist-maps/latest.json
 *
 * 이 폴더를 그대로 정적 호스팅(S3 / R2 / GitHub Pages)에 올리면 끝이다.
 * 서버 코드는 필요 없다.
 *
 * ※ 이미 올린 버전 폴더는 절대 덮어쓰지 말 것.
 *   기기에 캐시된 팩과 섞여 반쯤 옛 데이터를 읽는 사고가 난다. 새 버전을 파서 올린다.
 * ※ OSM 데이터는 ODbL 라이선스다. 앱 화면의 "© OpenStreetMap contributors" 표기 필수.
 */
import fs from 'fs';
import path from 'path';
import { LatLon, Vec2, toEnu } from '../src/core/geo';
import { RoadWay } from '../src/core/roadGraph';
import { encodeMapPack, decodeMapPack, HIGHWAY_KINDS } from '../src/core/mapPack';
import { RoadGraph } from '../src/core/roadGraph';

const arg = (k: string, d?: string) => {
  const i = process.argv.indexOf('--' + k);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d;
};

const lat = Number(arg('lat', '37.56089822070307'));
const lon = Number(arg('lon', '126.83936366854338'));
const radius = Number(arg('radius', '1500'));
const name = arg('name', 'map')!;
const version = arg('version', 'v1')!;
const outDir = path.resolve(arg('out', 'dist-maps')!);

const ENDPOINTS = [
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
  'https://overpass-api.de/api/interpreter',
];
const HW_RE = `^(${HIGHWAY_KINDS.join('|')})$`;

interface El { type: string; geometry?: { lat: number; lon: number }[]; tags?: Record<string, string> }

async function query(q: string): Promise<El[]> {
  let lastErr = '';
  for (const ep of ENDPOINTS) {
    try {
      process.stdout.write(`  ${ep.replace(/https:\/\/|\/api.*|\/osm.*/g, '')} ... `);
      const t0 = Date.now();
      const res = await fetch(ep, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'DEADRUN-bake/0.1 (personal game prototype)',
          Accept: 'application/json',
        },
        body: 'data=' + encodeURIComponent(q),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = (await res.json()) as { elements?: El[] };
      console.log(`${((Date.now() - t0) / 1000).toFixed(1)}초`);
      return j.elements ?? [];
    } catch (e) {
      lastErr = String(e);
      console.log('실패');
    }
  }
  throw new Error('모든 미러 실패: ' + lastErr);
}

async function main() {
  const origin: LatLon = { lat, lon };
  console.log(`굽는 중: ${lat.toFixed(5)}, ${lon.toFixed(5)} 반경 ${radius}m → ${version}/${name}.drmp\n`);

  console.log('도로 수신');
  const roadEls = await query(
    `[out:json][timeout:60];(way["highway"~"${HW_RE}"](around:${radius},${lat},${lon}););out geom tags;`);

  console.log('건물 수신');
  let buildEls: El[] = [];
  try {
    buildEls = await query(
      `[out:json][timeout:90];(way["building"](around:${radius},${lat},${lon}););out geom;`);
  } catch {
    console.log('  건물 수신 실패 — 도로만으로 굽습니다');
  }

  const ways: RoadWay[] = [];
  for (const el of roadEls) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 2) continue;
    const t = el.tags ?? {};
    let layer = 0;
    if (t.bridge === 'yes') layer = 1;
    if (t.tunnel === 'yes') layer = -1;
    const l = parseInt(t.layer, 10);
    if (!isNaN(l)) layer = Math.max(-1, Math.min(1, l));
    ways.push({
      highway: t.highway ?? 'unclassified',
      layer,
      spawnAllowed: false, // 디코드 시 종류로 다시 계산된다
      points: el.geometry.map(g => toEnu(origin, g)),
    });
  }
  const buildings: Vec2[][] = [];
  for (const el of buildEls) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 3) continue;
    buildings.push(el.geometry.map(g => toEnu(origin, g)));
  }

  const bin = encodeMapPack(origin, ways, buildings);

  // 구운 직후 바로 읽어서 게임 로직이 도는지 확인한다 (깨진 팩을 올리지 않기 위해)
  const back = decodeMapPack(bin, origin);
  const g = RoadGraph.build(back.ways);
  const layers = { [-1]: 0, 0: 0, 1: 0 } as Record<number, number>;
  for (const e of g.edges) layers[e.layer]++;
  if (g.nodes.length < 10 || g.edges.length < 10) throw new Error('그래프가 비었습니다 — 팩 생성 중단');

  const dir = path.join(outDir, version);
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${name}.drmp`);
  fs.writeFileSync(file, bin);

  const manifest = {
    version,
    packs: [{
      name, file: `${version}/${name}.drmp`,
      lat, lon, radius,
      bytes: bin.byteLength,
      builtAt: new Date().toISOString(),
    }],
    attribution: '© OpenStreetMap contributors',
    license: 'ODbL 1.0',
  };
  fs.writeFileSync(path.join(outDir, 'latest.json'), JSON.stringify(manifest, null, 2));

  const kb = (n: number) => (n / 1024).toFixed(0);
  console.log(`\n도로 ${ways.length}개 · 건물 ${buildings.length}개`);
  console.log(`검증: 노드 ${g.nodes.length} · 엣지 ${g.edges.length} (지하 ${layers[-1]} / 지상 ${layers[0]} / 고가 ${layers[1]})`);
  console.log(`\n${file}  ${kb(bin.byteLength)} KB`);
  console.log(`${path.join(outDir, 'latest.json')}`);
  console.log(`\n이 폴더(${outDir})를 정적 호스팅에 그대로 올리면 됩니다.`);
}

main().catch(e => { console.error('\n실패:', e.message); process.exit(1); });
