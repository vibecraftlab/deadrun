import { LatLon, Vec2, fromEnu } from './geo';

/*
  안전 구역 / 비안전 구역
  ───────────────────────────────────────────────────────────────
  건물은 지금까지 순수 렌더 대상이었다. 여기서 처음으로 게임 로직이 된다.

   · 안전 구역(녹색)  — 좀비가 들어오지 못한다
   · 그 밖의 건물     — 들어가면 잠시 안전하지만, 시간이 지나면 좀비가 밀고 들어온다

  "어느 건물이 안전한가"를 정할 데이터가 없다. OSM 용도 태그는 앱까지 내려오지
  않고(overpass.ts가 좌표만 남긴다), 구운 팩(.drmp v2)에도 이름밖에 없다.
  그래서 프로토타입 단계에서는 **좌표 해시**로 일정 비율을 안전으로 찍는다.

  해시 입력이 ENU(놀이 원점 기준 미터)가 아니라 **위경도**인 것이 중요하다.
  ENU는 그 런의 시작 위치에 따라 달라지므로, ENU로 해시하면 어제 안전했던
  건물이 오늘 다른 데서 출발했다는 이유로 위험해진다. 위경도로 해시하면
  같은 건물은 언제 어디서 시작하든 늘 같은 판정을 받는다.
*/

/** 해시 좌표 양자화 — 1e-5도 ≈ 1.1m. 폴리곤이 미세하게 달라도 같은 건물로 묶인다 */
const QUANT = 1e5;

/** 32비트 정수 해시 (murmur3 finalizer 계열) — 두 좌표를 섞어 고르게 흩뜨린다 */
function hash32(a: number, b: number): number {
  let h = Math.imul(a | 0, 0x27d4eb2d) ^ Math.imul(b | 0, 0x165667b1);
  h = (h ^ (h >>> 15)) >>> 0;
  h = Math.imul(h, 0x2545f491) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  h = Math.imul(h, 0x3b9ac9ff) >>> 0;
  return (h ^ (h >>> 16)) >>> 0;
}

/** 다각형 중심 (꼭짓점 평균 — 무게중심은 아니지만 해시 키로는 충분하다) */
export function polygonCenter(poly: Vec2[]): Vec2 {
  let sx = 0, sy = 0;
  for (const p of poly) { sx += p.x; sy += p.y; }
  return { x: sx / poly.length, y: sy / poly.length };
}

/**
 * 이 위경도의 건물이 안전 구역인가.
 * ratio 0.15 면 대략 15%가 안전으로 찍힌다. 같은 입력은 언제나 같은 결과다.
 */
export function isSafeAt(at: LatLon, ratio: number): boolean {
  if (ratio <= 0) return false;
  if (ratio >= 1) return true;
  const h = hash32(Math.round(at.lat * QUANT), Math.round(at.lon * QUANT));
  return h / 0x100000000 < ratio;
}

/**
 * 점이 다각형 안에 있는가 — 반직선 교차(ray casting).
 * 경계선 위는 구현 정의(들쭉날쭉)지만, GPS 오차가 m 단위라 경계 판정은 의미가 없다.
 */
export function pointInPolygon(p: Vec2, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    // 두 꼭짓점이 p.y를 사이에 두고 있고, 그 높이에서의 교점이 p.x 오른쪽이면 한 번 교차
    if ((a.y > p.y) !== (b.y > p.y)) {
      const t = (p.y - a.y) / (b.y - a.y);
      if (p.x < a.x + t * (b.x - a.x)) inside = !inside;
    }
  }
  return inside;
}

interface Box { minX: number; minY: number; maxX: number; maxY: number }

/**
 * 건물 구역 색인.
 *
 *  건물이 최대 1,500개(Config.maxBuildings)인데 매 틱 전부 점-다각형 검사를 돌리면
 *  10Hz × 1,500 = 초당 15,000회다. 균등 격자로 후보를 먼저 걸러 보통 한두 개로 줄인다.
 */
export class ZoneIndex {
  /** buildings 와 같은 순서 — 이 건물이 안전 구역인가 */
  readonly safe: boolean[] = [];
  private readonly polys: Vec2[][];
  private readonly boxes: Box[] = [];
  private readonly cell: number;
  private readonly grid = new Map<number, number[]>();

  /**
   * @param buildings 건물 외곽선 (ENU)
   * @param origin    ENU 원점 — 해시를 위경도로 되돌리는 데 쓴다
   * @param ratio     안전 구역 비율 0~1
   * @param cellSize  격자 한 칸 크기(m)
   */
  constructor(buildings: Vec2[][], origin: LatLon, ratio: number, cellSize = 60) {
    this.polys = buildings;
    this.cell = cellSize;

    for (let i = 0; i < buildings.length; i++) {
      const poly = buildings[i];
      if (poly.length < 3) {
        this.safe.push(false);
        this.boxes.push({ minX: 1, minY: 1, maxX: -1, maxY: -1 }); // 빈 상자 = 절대 안 걸림
        continue;
      }
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of poly) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      }
      this.boxes.push({ minX, minY, maxX, maxY });
      this.safe.push(isSafeAt(fromEnu(origin, polygonCenter(poly)), ratio));

      for (let cx = Math.floor(minX / this.cell); cx <= Math.floor(maxX / this.cell); cx++) {
        for (let cy = Math.floor(minY / this.cell); cy <= Math.floor(maxY / this.cell); cy++) {
          const k = this.key(cx, cy);
          const bucket = this.grid.get(k);
          if (bucket) bucket.push(i); else this.grid.set(k, [i]);
        }
      }
    }
  }

  /** 격자 좌표를 하나의 수 키로 — 좌표가 음수라 비트 연산 대신 큰 소수를 쓴다 */
  private key(cx: number, cy: number): number {
    return cx * 73856093 + cy * 19349663;
  }

  get count(): number { return this.polys.length; }
  get safeCount(): number { return this.safe.reduce((n, s) => n + (s ? 1 : 0), 0); }

  /** 이 점을 품은 건물의 index. 없으면 -1 (겹치면 먼저 찾은 것) */
  buildingAt(p: Vec2): number {
    const bucket = this.grid.get(this.key(
      Math.floor(p.x / this.cell), Math.floor(p.y / this.cell),
    ));
    if (!bucket) return -1;
    for (const i of bucket) {
      const b = this.boxes[i];
      if (p.x < b.minX || p.x > b.maxX || p.y < b.minY || p.y > b.maxY) continue;
      if (pointInPolygon(p, this.polys[i])) return i;
    }
    return -1;
  }
}
