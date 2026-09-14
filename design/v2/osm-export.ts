/**
 * 구워둔 .drmp 타일에서 실제 OSM 도형을 뽑아 SVG 조각으로 내보낸다.
 * 목업이 가짜 격자가 아니라 진짜 서울 골목을 그리게 하려는 것.
 *
 *   cd deadrun-mapkit && npx tsx ../design/v2/osm-export.ts
 *
 * 결과: design/v2/osm-map.svg.html  (build.mjs 가 <!--OSMMAP--> 자리에 끼워 넣는다)
 */
import * as fs from 'fs';
import * as path from 'path';
import { decodePack } from '../../deadrun-mapkit/src/format';

const TILE = path.join(__dirname, '..', '..', 'deadrun-mapkit', 'out', 'v1', '13', '6982', '3173.drmp');
const OUT = path.join(__dirname, 'osm-map.svg.html');

// 틸트 적용 후에도 프레임이 채워지도록 넉넉히 그린다
const W = 660, H = 1180, OFF_X = -135, OFF_Y = -178;
const SPAN_M = 300; // 가로가 덮는 실제 거리

// 도로 3단 위계
const ARTERIAL = new Set(['primary', 'secondary', 'tertiary']);
const WALK = new Set(['footway', 'path', 'steps', 'cycleway', 'pedestrian', 'track']);

const pack = decodePack(new Uint8Array(fs.readFileSync(TILE)));
console.log(`도로 ${pack.ways.length} · 건물 ${pack.buildings.length}`);

// 도로 점이 가장 빽빽한 지점을 중심으로 잡는다
const CELL = 60;
const bins = new Map<string, number>();
for (const w of pack.ways) {
  for (const p of w.points) {
    const k = `${Math.floor(p.x / CELL)},${Math.floor(p.y / CELL)}`;
    bins.set(k, (bins.get(k) ?? 0) + 1);
  }
}
let bestKey = '0,0', bestN = -1;
for (const [k, n] of bins) if (n > bestN) { bestN = n; bestKey = k; }
const [bx, by] = bestKey.split(',').map(Number);
const cx = (bx + 0.5) * CELL, cy = (by + 0.5) * CELL;
console.log(`중심 ENU (${cx.toFixed(0)}, ${cy.toFixed(0)}) · 밀도 ${bestN}`);

const scale = W / SPAN_M;              // px per meter
const halfW = SPAN_M / 2, halfH = (H / scale) / 2;
const toX = (x: number) => (x - cx + halfW) * scale;
const toY = (y: number) => (cy - y + halfH) * scale;   // 북쪽이 위
const inside = (x: number, y: number) =>
  x > cx - halfW - 40 && x < cx + halfW + 40 && y > cy - halfH - 40 && y < cy + halfH + 40;

const esc = (n: number) => Math.round(n * 10) / 10;

function polyline(pts: { x: number; y: number }[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${esc(toX(p.x))},${esc(toY(p.y))}`).join('');
}

const arterial: string[] = [], local: string[] = [], walk: string[] = [], elevated: string[] = [];
for (const w of pack.ways) {
  if (!w.points.some(p => inside(p.x, p.y))) continue;
  const d = polyline(w.points);
  if (w.layer > 0) elevated.push(d);
  else if (ARTERIAL.has(w.highway)) arterial.push(d);
  else if (WALK.has(w.highway)) walk.push(d);
  else local.push(d);
}

const bldg: string[] = [];
for (const ring of pack.buildings) {
  if (ring.length < 3) continue;
  if (!ring.some(p => inside(p.x, p.y))) continue;
  bldg.push(polyline(ring) + 'Z');
}

console.log(`창 안: 간선 ${arterial.length} · 생활 ${local.length} · 보행 ${walk.length} · 고가 ${elevated.length} · 건물 ${bldg.length}`);

const join = (arr: string[]) => arr.join(' ');

const svg = `<g transform="translate(${OFF_X} ${OFF_Y})">
  <!-- 건물: 아래 몸통 + 4px 올린 윗면으로 두께 -->
  <g fill="#161F3A"><path d="${join(bldg)}"/></g>
  <g fill="#222E55" transform="translate(0 -4)"><path d="${join(bldg)}"/></g>

  <!-- 도로 바닥(케이싱) -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${join(local)}" stroke="#0D1428" stroke-width="13"/>
    <path d="${join(arterial)}" stroke="#0D1428" stroke-width="24"/>
  </g>
  <!-- 도로 윗면 -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${join(local)}" stroke="#2A3760" stroke-width="9"/>
    <path d="${join(arterial)}" stroke="#38497C" stroke-width="19"/>
  </g>
  <!-- 간선 중앙선 -->
  <g fill="none" stroke="#546AB0" stroke-width="1.6" stroke-dasharray="11 13" opacity="0.6" stroke-linecap="round">
    <path d="${join(arterial)}"/>
  </g>
  <!-- 보행로: 좀비가 스폰되는 길 -->
  <g fill="none" stroke="#7CFF5B" stroke-width="2.4" stroke-dasharray="5 7" opacity="0.30" stroke-linecap="round">
    <path d="${join(walk)}"/>
  </g>
  <!-- 고가 -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="${join(elevated)}" stroke="#0A0F1F" stroke-width="22"/>
    <path d="${join(elevated)}" stroke="#4A3F7A" stroke-width="16"/>
  </g>
</g>`;

fs.writeFileSync(OUT, svg);
console.log(`씀: ${OUT} (${(svg.length / 1024).toFixed(0)}KB)`);
