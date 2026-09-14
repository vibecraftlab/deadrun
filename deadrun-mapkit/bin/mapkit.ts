/**
 * deadrun-mapkit CLI
 *
 *   npm run mapkit -- bake --bbox 126.80,37.53,126.90,37.59 --out out --version v1
 *   npm run mapkit -- bake --center 37.5609,126.8394 --radius 3000
 *   npm run mapkit -- plan  --bbox 125.0,33.0,129.7,38.65      (굽기 전 규모 확인)
 *   npm run mapkit -- info  out/v1/13/6982/3172.drmp
 *   npm run mapkit -- serve out                                (로컬 확인용 정적 서버)
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { decodePack } from '../src/format';
import { bakeTile, ManifestWriter } from '../src/bake';
import { BBox } from '../src/osm';
import {
  DEFAULT_ZOOM, TileId, tilesForBBox, tilesAround, tileSideMeters, tileCenter,
} from '../src/tiles';

const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (k: string, d?: string): string | undefined => {
  const i = argv.indexOf('--' + k);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d;
};
const has = (k: string) => argv.includes('--' + k);
const kb = (n: number) => (n / 1024).toFixed(0);
const mb = (n: number) => (n / 1024 / 1024).toFixed(1);

function resolveTiles(zoom: number): { tiles: TileId[]; bbox: BBox } {
  const bboxArg = flag('bbox');
  if (bboxArg) {
    const [west, south, east, north] = bboxArg.split(',').map(Number);
    const bbox = { west, south, east, north };
    return { tiles: tilesForBBox(bbox, zoom), bbox };
  }
  const center = flag('center');
  if (!center) throw new Error('--bbox 또는 --center 가 필요합니다');
  const [lat, lon] = center.split(',').map(Number);
  const radius = Number(flag('radius', '3000'));
  const tiles = tilesAround({ lat, lon }, radius, zoom);
  const latPad = (radius / 6378137) * (180 / Math.PI);
  const lonPad = latPad / Math.cos((lat * Math.PI) / 180);
  return {
    tiles,
    bbox: { west: lon - lonPad, east: lon + lonPad, south: lat - latPad, north: lat + latPad },
  };
}

async function cmdPlan() {
  const zoom = Number(flag('zoom', String(DEFAULT_ZOOM)));
  const { tiles, bbox } = resolveTiles(zoom);
  const side = tileSideMeters(tiles[0]) / 1000;
  const km2 = side * side;
  console.log(`범위 ${bbox.west.toFixed(3)},${bbox.south.toFixed(3)} ~ ${bbox.east.toFixed(3)},${bbox.north.toFixed(3)}`);
  console.log(`줌 z${zoom} · 타일 ${side.toFixed(2)}km (${km2.toFixed(1)}km²) · ${tiles.length}개\n`);
  // 실측 밀도 (도로+건물): 도심 18.1 / 소도시 4.1 / 농촌산간 1.7 KB/km²
  for (const [label, d] of [['전부 도심이면', 18.1], ['전부 소도시면', 4.1], ['전부 농촌·산간이면', 1.7]] as const) {
    console.log(`  ${label.padEnd(18)} ${mb(tiles.length * km2 * d * 1024)} MB`);
  }
  console.log('\n실제로는 바다·산속 타일이 비어 파일이 생기지 않으므로 이보다 작습니다.');
  console.log('GitHub 한도: 파일당 100MB · Pages 사이트 1GB 권장 · 월 100GB 대역폭(소프트)');
}

async function cmdBake() {
  const zoom = Number(flag('zoom', String(DEFAULT_ZOOM)));
  const outDir = path.resolve(flag('out', 'out')!);
  const version = flag('version', 'v1')!;
  const { tiles, bbox } = resolveTiles(zoom);

  console.log(`굽기: z${zoom} 타일 ${tiles.length}개 → ${outDir}/${version}`);
  console.log(`건물 ${has('no-buildings') ? '제외' : '포함'} · ${has('resume') ? '이어서' : '새로'}\n`);

  // 타일 하나 구울 때마다 목차를 갱신한다 (목차에 없는 타일은 앱이 요청하지 않는다)
  const manifest = new ManifestWriter(outDir, version, zoom, bbox);
  if (manifest.count > 0) console.log(`기존 목차에 ${manifest.count}장이 이미 있습니다
`);
  manifest.write();
  let empty = 0, cached = 0, failed = 0;
  const politeDelay = Number(flag('delay', '400'));

  for (let i = 0; i < tiles.length; i++) {
    const t = tiles[i];
    const head = `[${String(i + 1).padStart(String(tiles.length).length)}/${tiles.length}] ${t.z}/${t.x}/${t.y}`;
    try {
      const r = await bakeTile(t, {
        outDir, version,
        includeBuildings: !has('no-buildings'),
        resume: has('resume'),
        log: msg => console.log(msg),
      });
      if (r.bytes > 0) { manifest.add(t, r.bytes); manifest.write(); }
      if (r.skipped === 'empty') { empty++; console.log(`${head}  (데이터 없음)`); }
      else if (r.skipped === 'cached') { cached++; console.log(`${head}  (이미 있음 ${kb(r.bytes)}KB)`); }
      else console.log(`${head}  도로 ${r.roads} · 건물 ${r.buildings} → ${kb(r.bytes)}KB`);
    } catch (e) {
      failed++;
      console.log(`${head}  실패: ${(e as Error).message}`);
    }
    if (politeDelay > 0 && i < tiles.length - 1) await new Promise(r => setTimeout(r, politeDelay));
  }

  const m = manifest.write();
  console.log(`\n완료: 타일 ${m.tileCount}개 · ${mb(m.totalBytes)} MB`);
  console.log(`빈 타일 ${empty} · 건너뜀 ${cached} · 실패 ${failed}`);
  if (failed > 0) console.log('실패분은 --resume 으로 다시 돌리면 이어서 굽습니다.');
  console.log(`\n매니페스트: ${path.join(outDir, 'latest.json')}`);
  console.log(`이 폴더를 정적 호스팅에 그대로 올리세요. ${m.attribution} 표기 필수.`);
}

function cmdInfo() {
  const file = argv[1];
  if (!file) throw new Error('파일 경로가 필요합니다');
  const p = decodePack(new Uint8Array(fs.readFileSync(file)));
  const layers: Record<number, number> = { [-1]: 0, 0: 0, 1: 0 };
  for (const w of p.ways) layers[w.layer] = (layers[w.layer] ?? 0) + 1;
  const pts = p.ways.reduce((s, w) => s + w.points.length, 0)
    + p.buildings.reduce((s, b) => s + b.length, 0);
  console.log(`${file}  ${kb(fs.statSync(file).size)} KB`);
  console.log(`타일 ${p.tile ? `${p.tile.z}/${p.tile.x}/${p.tile.y}` : '(기록 없음)'}`);
  console.log(`기준점 ${p.origin.lat.toFixed(5)}, ${p.origin.lon.toFixed(5)}`);
  console.log(`도로 ${p.ways.length} · 건물 ${p.buildings.length} · 좌표점 ${pts.toLocaleString()}`);
  console.log(`레이어 지하 ${layers[-1]} / 지상 ${layers[0]} / 고가 ${layers[1]}`);
  console.log(`스폰 가능 도로 ${p.ways.filter(w => w.spawnAllowed).length}`);
}

function cmdServe() {
  const dir = path.resolve(argv[1] ?? 'out');
  const port = Number(flag('port', '8787'));
  http.createServer((req, res) => {
    const rel = decodeURIComponent((req.url ?? '/').split('?')[0]).replace(/^\/+/, '');
    const file = path.join(dir, rel);
    if (!file.startsWith(dir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404); res.end('not found'); return;
    }
    res.writeHead(200, {
      'Content-Type': file.endsWith('.json') ? 'application/json' : 'application/octet-stream',
      'Access-Control-Allow-Origin': '*',
    });
    fs.createReadStream(file).pipe(res);
  }).listen(port, () => {
    console.log(`http://localhost:${port}/  →  ${dir}`);
    console.log('앱 .env 의 EXPO_PUBLIC_MAP_PACK_URL 에 이 주소를 넣어 시험하세요.');
  });
}

(async () => {
  try {
    if (cmd === 'bake') await cmdBake();
    else if (cmd === 'plan') await cmdPlan();
    else if (cmd === 'info') cmdInfo();
    else if (cmd === 'serve') cmdServe();
    else {
      console.log(fs.readFileSync(path.join(__dirname, 'mapkit.ts'), 'utf8')
        .split('\n').slice(1, 9).join('\n').replace(/^ \* ?/gm, ''));
    }
  } catch (e) {
    console.error('오류:', (e as Error).message);
    process.exit(1);
  }
})();
