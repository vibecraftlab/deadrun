/**
 * deadrun-mapkit 관리자 서버
 *
 *   npm run admin        →  http://localhost:8787
 *
 * 브라우저에서 범위를 고르고 버튼을 눌러 지도를 굽는다.
 * 같은 서버가 구운 결과(out/)를 그대로 서빙하므로, 앱의
 * EXPO_PUBLIC_MAP_PACK_URL 에 이 주소를 넣으면 바로 시험할 수 있다.
 */
import fs from 'fs';
import http from 'http';
import path from 'path';
import { URL } from 'url';
import { DEFAULT_ZOOM, tilesForBBox, tileSideMeters } from './src/tiles';
import { getJob, listJobs, scanTiles, startJob, stopJob } from './src/jobs';
import { tileToGeoJson, tileSummary } from './src/preview';
import { BBox } from './src/osm';

const PORT = Number(process.env.PORT ?? 8787);
const OUT_DIR = path.resolve(process.env.OUT_DIR ?? 'out');

/** 실측 밀도 (도로+건물, KB/km²) — plan 추정에 쓴다 */
const DENSITY = { urban: 18.1, town: 4.1, rural: 1.7 };

const PRESETS: { id: string; label: string; bbox: BBox; note: string }[] = [
  { id: 'gangnam', label: '강남 일대 (시험용)', note: '10~20장 · 몇 분', bbox: { west: 126.99, south: 37.48, east: 127.08, north: 37.54 } },
  { id: 'seoul', label: '서울', note: '약 300장 · 1~2시간', bbox: { west: 126.76, south: 37.42, east: 127.18, north: 37.70 } },
  { id: 'sudogwon', label: '수도권', note: '약 1,200장 · 4~6시간', bbox: { west: 126.60, south: 37.00, east: 127.50, north: 37.90 } },
  { id: 'busan', label: '부산·울산·경남', note: '', bbox: { west: 127.65, south: 34.65, east: 129.40, north: 35.70 } },
  { id: 'jeju', label: '제주', note: '', bbox: { west: 126.15, south: 33.15, east: 126.99, north: 33.60 } },
  { id: 'korea', label: '대한민국 전국', note: '약 5,000장 · 15~20시간', bbox: { west: 125.0, south: 33.0, east: 129.7, north: 38.65 } },
  { id: 'world', label: '전 세계', note: '⚠ 현실적으로 불가 — 눌러서 규모만 확인해보세요', bbox: { west: -180, south: -60, east: 180, north: 75 } },
];

// ── 유틸 ────────────────────────────────────────────────────
const json = (res: http.ServerResponse, code: number, body: unknown) => {
  const s = JSON.stringify(body);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(s);
};

const readBody = (req: http.IncomingMessage): Promise<Record<string, unknown>> =>
  new Promise(resolve => {
    let raw = '';
    req.on('data', c => { raw += c; });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { resolve({}); } });
  });

function estimate(bbox: BBox, zoom: number) {
  const tiles = tilesForBBox(bbox, zoom);
  if (tiles.length === 0) return { tiles: 0, km2: 0, est: { urban: 0, town: 0, rural: 0 } };
  const mid = tiles[Math.floor(tiles.length / 2)];
  const side = tileSideMeters(mid) / 1000;
  const km2 = side * side;
  const kb = (d: number) => tiles.length * km2 * d;
  return {
    tiles: tiles.length,
    sideKm: side,
    km2,
    est: { urban: kb(DENSITY.urban), town: kb(DENSITY.town), rural: kb(DENSITY.rural) },
  };
}

function outputSummary(version: string) {
  const files = scanTiles(OUT_DIR, version);
  const manifestPath = path.join(OUT_DIR, 'latest.json');
  let manifest: unknown = null;
  if (fs.existsSync(manifestPath)) {
    try { manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch { /* 깨진 경우 무시 */ }
  }
  const versions = fs.existsSync(OUT_DIR)
    ? fs.readdirSync(OUT_DIR).filter(d => {
        const p = path.join(OUT_DIR, d);
        return fs.statSync(p).isDirectory();
      })
    : [];
  return {
    outDir: OUT_DIR,
    versions,
    version,
    tileCount: files.length,
    totalBytes: files.reduce((s, f) => s + f.bytes, 0),
    manifest,
    tiles: files.slice(0, 3000).map(f => ({ t: `${f.tile.z}/${f.tile.x}/${f.tile.y}`, b: f.bytes })),
  };
}

// ── 라우팅 ──────────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
  const u = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const p = u.pathname;

  try {
    if (p === '/' || p === '/index.html') {
      const html = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(html);
    }

    if (p === '/api/presets') return json(res, 200, { presets: PRESETS, defaultZoom: DEFAULT_ZOOM });

    if (p === '/api/plan' && req.method === 'POST') {
      const b = await readBody(req);
      const bbox = b.bbox as BBox;
      const zoom = Number(b.zoom ?? DEFAULT_ZOOM);
      if (!bbox) return json(res, 400, { error: '범위가 없습니다' });
      return json(res, 200, estimate(bbox, zoom));
    }

    if (p === '/api/bake' && req.method === 'POST') {
      const b = await readBody(req);
      const bbox = b.bbox as BBox;
      const zoom = Number(b.zoom ?? DEFAULT_ZOOM);
      const version = String(b.version ?? 'v1').replace(/[^a-zA-Z0-9._-]/g, '') || 'v1';
      const tiles = tilesForBBox(bbox, zoom);
      if (tiles.length === 0) return json(res, 400, { error: '범위에 타일이 없습니다' });
      if (tiles.length > 30000) return json(res, 400, { error: `타일 ${tiles.length}장은 너무 많습니다. 범위를 좁히세요.` });
      const job = startJob({
        tiles, bbox, zoom, version, outDir: OUT_DIR,
        includeBuildings: b.buildings !== false,
        resume: b.resume !== false,
        // 타일 사이 대기. overpass-api.de 는 동시 질의 슬롯이 2개뿐이라
        // 짧게 두면 429가 난다 (실측: 몇 초 안에 3번 두드리면 세 번째가 429).
        delayMs: Number(b.delayMs ?? 1200),
      });
      return json(res, 200, { jobId: job.id });
    }

    if (p.startsWith('/api/job/')) {
      const [, , , id, action] = p.split('/');
      if (action === 'stop' && req.method === 'POST') { stopJob(id); return json(res, 200, { ok: true }); }
      const job = getJob(id);
      if (!job) return json(res, 404, { error: '작업을 찾을 수 없습니다' });
      return json(res, 200, job);
    }

    if (p === '/api/jobs') return json(res, 200, { jobs: listJobs().slice(0, 20) });

    if (p === '/api/output') {
      return json(res, 200, outputSummary(String(u.searchParams.get('version') ?? 'v1')));
    }

    // 미리보기: /api/geojson/v1/13/6982/3172
    if (p.startsWith('/api/geojson/')) {
      const [, , , version, z, x, y] = p.split('/');
      return json(res, 200, tileToGeoJson(OUT_DIR, version, { z: +z, x: +x, y: +y }));
    }
    if (p.startsWith('/api/tileinfo/')) {
      const [, , , version, z, x, y] = p.split('/');
      return json(res, 200, tileSummary(OUT_DIR, version, { z: +z, x: +x, y: +y }));
    }

    // 구운 결과를 그대로 서빙 — 앱이 이 주소를 바라보면 된다
    const rel = decodeURIComponent(p).replace(/^\/+/, '');
    const file = path.join(OUT_DIR, rel);
    if (file.startsWith(OUT_DIR) && fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, {
        'Content-Type': file.endsWith('.json') ? 'application/json; charset=utf-8' : 'application/octet-stream',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store',
      });
      return fs.createReadStream(file).pipe(res);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('not found');
  } catch (e) {
    json(res, 500, { error: (e as Error).message });
  }
});

// 포트가 이미 쓰이면 스택 트레이스를 쏟지 말고 무엇을 해야 하는지 알려준다
server.on('error', (e: NodeJS.ErrnoException) => {
  if (e.code === 'EADDRINUSE') {
    console.error('');
    console.error(`  포트 ${PORT}이(가) 이미 사용 중입니다.`);
    console.error('  이미 관리자 서버가 떠 있을 가능성이 높습니다 — 브라우저에서 먼저 확인하세요:');
    console.error(`    http://localhost:${PORT}`);
    console.error('');
    console.error('  그래도 새로 띄우려면 둘 중 하나:');
    console.error(`    · 기존 것 종료 (PowerShell):`);
    console.error(`        Get-NetTCPConnection -LocalPort ${PORT} | Select -Expand OwningProcess | ForEach { Stop-Process -Id $_ -Force }`);
    console.error(`    · 다른 포트로 실행:`);
    console.error(`        PORT=${PORT + 1} npm run admin`);
    console.error('');
    process.exit(1);
  }
  console.error('서버 오류:', e.message);
  process.exit(1);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  deadrun-mapkit 관리자');
  console.log(`  브라우저에서 열기:  http://localhost:${PORT}`);
  console.log(`  출력 폴더:          ${OUT_DIR}`);
  console.log('');
  console.log('  앱과 연결하려면 deadrun-expo/.env 에:');
  console.log(`    EXPO_PUBLIC_MAP_PACK_URL=http://<이 PC의 IP>:${PORT}`);
  console.log('');
});
