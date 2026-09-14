/**
 * .drmp 지도 팩 포맷
 *
 * ⚠ 이 파일은 deadrun-mapkit/src/format.ts 와 **바이트 단위로 같아야 한다.**
 *   한쪽만 고치면 앱이 타일을 통째로 잘못 읽는다(헤더 크기가 어긋났던 전례 있음).
 *   포맷을 바꿀 때는 반드시 두 파일을 함께 고치고 VERSION 을 올릴 것. — 타일 하나를 담는 바이너리.
 *
 *  ── 왜 JSON이 아닌가 ────────────────────────────────────────
 *  Overpass가 주는 JSON은 반경 1km 도로+건물이 1,256KB다. 같은 내용을 이 포맷으로
 *  담으면 55KB로, 23배 작다. 모바일에서 파싱 시간도 JSON.parse 대비 훨씬 짧다
 *  (실측: 디코드 4ms · 그래프 빌드 11ms).
 *
 *  ── 좌표를 작게 담는 법 ─────────────────────────────────────
 *  점 하나를 double 두 개로 두면 16바이트다. 대신
 *   · 좌표를 타일 남서쪽 모서리 기준 ENU 미터로 바꾸고
 *   · 0.25m 단위 정수로 양자화한 뒤
 *   · 각 way의 첫 점만 int32, 이후는 직전 점과의 차분을 int16
 *  으로 담으면 점당 4바이트가 된다. 양자화 오차는 최대 12.5cm인데, 도로 그래프가
 *  어차피 0.5m 격자로 노드를 병합하므로 게임 판정에 영향이 없다.
 *
 *  ── 레이아웃 ────────────────────────────────────────────────
 *   헤더 40B
 *     0  magic 'DRMP'      u32   0x504d5244
 *     4  version           u8    = 1
 *     5  flags             u8
 *     6  quantMm           u16   좌표 1단위의 mm (기본 250)
 *     8  originLat         f64   타일 기준점 위도
 *    16  originLon         f64   타일 기준점 경도
 *    24  roadCount         u32
 *    28  buildingCount     u32
 *    32  tileZ u8, 예약 u8 ×3, tileX u16, tileY u16  (어느 타일인지 자체 기록)
 *   레코드 (도로 → 건물)
 *     u8  kind   도로 종류 인덱스 / 건물 = 255
 *     i8  layer  -1 지하 · 0 지상 · 1 고가
 *     u16 pointCount
 *     i32 x0, i32 y0
 *     (n-1) × (i16 dx, i16 dy)
 */
import { LatLon, Vec2, toEnu, fromEnu } from './geo';
import { TileId } from './tiles';

export const MAGIC = 0x504d5244;
export const VERSION = 1;
const HEADER = 40;
const BUILDING_KIND = 255;

/** 도로 종류 — 인덱스로 저장하므로 순서를 바꾸면 기존 팩을 읽을 수 없다 */
export const HIGHWAY_KINDS = [
  'residential', 'living_street', 'pedestrian', 'footway', 'path', 'track',
  'service', 'unclassified', 'tertiary', 'secondary', 'primary', 'steps', 'cycleway',
] as const;
export type HighwayKind = (typeof HIGHWAY_KINDS)[number];

/** 좀비 스폰 허용 도로 — 차도를 빼는 것은 안전 설계다 */
export const SPAWN_ALLOWED = new Set<string>([
  'residential', 'living_street', 'pedestrian', 'footway', 'path',
  'track', 'service', 'unclassified', 'steps', 'cycleway',
]);

export interface RoadWay {
  highway: string;
  layer: number;
  spawnAllowed: boolean;
  points: Vec2[];
}

export interface MapPack {
  origin: LatLon;
  tile?: TileId;
  ways: RoadWay[];
  buildings: Vec2[][];
}

interface Rec { kind: number; layer: number; points: Vec2[] }

export function encodeMapPack(
  origin: LatLon, ways: RoadWay[], buildings: Vec2[][],
  opts: { quantMm?: number; tile?: TileId } = {},
): Uint8Array {
  const quantMm = opts.quantMm ?? 250;
  const q = quantMm / 1000;
  const recs: Rec[] = [
    ...ways.map(w => ({
      kind: Math.max(0, HIGHWAY_KINDS.indexOf(w.highway as HighwayKind)),
      layer: w.layer, points: w.points,
    })),
    ...buildings.map(p => ({ kind: BUILDING_KIND, layer: 0, points: p })),
  ].filter(r => r.points.length >= 2);

  let size = HEADER;
  for (const r of recs) size += 12 + (r.points.length - 1) * 4;
  const ab = new ArrayBuffer(size);
  const dv = new DataView(ab);

  dv.setUint32(0, MAGIC, true);
  dv.setUint8(4, VERSION);
  dv.setUint8(5, 0);
  dv.setUint16(6, quantMm, true);
  dv.setFloat64(8, origin.lat, true);
  dv.setFloat64(16, origin.lon, true);
  dv.setUint32(24, recs.filter(r => r.kind !== BUILDING_KIND).length, true);
  dv.setUint32(28, recs.filter(r => r.kind === BUILDING_KIND).length, true);
  if (opts.tile) {
    dv.setUint8(32, opts.tile.z);
    dv.setUint16(36, opts.tile.x, true);
    dv.setUint16(38, opts.tile.y, true);
  }

  const clamp16 = (v: number) => Math.max(-32768, Math.min(32767, v));
  let o = HEADER;
  for (const r of recs) {
    dv.setUint8(o, r.kind); o += 1;
    dv.setInt8(o, r.layer); o += 1;
    dv.setUint16(o, r.points.length, true); o += 2;
    let px = Math.round(r.points[0].x / q);
    let py = Math.round(r.points[0].y / q);
    dv.setInt32(o, px, true); o += 4;
    dv.setInt32(o, py, true); o += 4;
    for (let i = 1; i < r.points.length; i++) {
      const cx = Math.round(r.points[i].x / q);
      const cy = Math.round(r.points[i].y / q);
      dv.setInt16(o, clamp16(cx - px), true); o += 2;
      dv.setInt16(o, clamp16(cy - py), true); o += 2;
      px = cx; py = cy;
    }
  }
  return new Uint8Array(ab);
}

/**
 * 팩을 읽는다. playOrigin을 주면 그 원점 기준 ENU로 재투영한다.
 * 타일마다 기준점이 다르므로, 여러 타일을 합칠 때 반드시 같은 playOrigin을 넘겨야 한다.
 */
export function decodeMapPack(data: Uint8Array, playOrigin?: LatLon): MapPack {
  if (data.byteLength < HEADER) throw new Error('지도 팩이 너무 짧습니다');
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  if (dv.getUint32(0, true) !== MAGIC) throw new Error('지도 팩 형식이 아닙니다');
  const version = dv.getUint8(4);
  if (version !== VERSION) throw new Error(`지원하지 않는 팩 버전 ${version} (이 도구는 ${VERSION})`);

  const q = dv.getUint16(6, true) / 1000;
  const origin: LatLon = { lat: dv.getFloat64(8, true), lon: dv.getFloat64(16, true) };
  const nRoad = dv.getUint32(24, true);
  const nBuild = dv.getUint32(28, true);
  const z = dv.getUint8(32);
  const tile: TileId | undefined = z > 0
    ? { z, x: dv.getUint16(36, true), y: dv.getUint16(38, true) } : undefined;

  const same = !playOrigin || (playOrigin.lat === origin.lat && playOrigin.lon === origin.lon);
  const reproject = same
    ? (p: Vec2) => p
    : (p: Vec2) => toEnu(playOrigin!, fromEnu(origin, p));

  const ways: RoadWay[] = [];
  const buildings: Vec2[][] = [];
  const total = nRoad + nBuild;
  let o = HEADER;
  let read = 0;
  for (let r = 0; r < total; r++) {
    if (o + 12 > data.byteLength) break;
    const kind = dv.getUint8(o); o += 1;
    const layer = dv.getInt8(o); o += 1;
    const n = dv.getUint16(o, true); o += 2;
    let px = dv.getInt32(o, true); o += 4;
    let py = dv.getInt32(o, true); o += 4;
    if (o + (n - 1) * 4 > data.byteLength) break; // 레코드가 통째로 안 들어옴
    const pts: Vec2[] = new Array(n);
    pts[0] = reproject({ x: px * q, y: py * q });
    for (let i = 1; i < n; i++) {
      px += dv.getInt16(o, true); o += 2;
      py += dv.getInt16(o, true); o += 2;
      pts[i] = reproject({ x: px * q, y: py * q });
    }
    if (kind === BUILDING_KIND) buildings.push(pts);
    else {
      const highway = HIGHWAY_KINDS[kind] ?? 'unclassified';
      ways.push({ highway, layer, spawnAllowed: SPAWN_ALLOWED.has(highway) && layer === 0, points: pts });
    }
    read++;
  }
  // 다운로드가 끊겼거나 파일이 손상된 경우를 조용히 넘기면 깨진 지도로 플레이하게 된다
  if (read !== total)
    throw new Error(`지도 팩이 잘렸습니다 (${read}/${total} 레코드) — 다시 받아야 합니다`);

  return { origin, tile, ways, buildings };
}
