import { Vec2, dist, sqrDist, dot, sub, add, mul, lerp } from './geo';

export interface RoadWay {
  points: Vec2[];
  highway: string;
  layer: number;        // -1 지하 / 0 지상 / +1 고가
  spawnAllowed: boolean;
}

export interface Edge {
  a: number;
  b: number;
  len: number;
  layer: number;
  spawnAllowed: boolean;
}

const NODE_QUANT = 0.5; // 0.5m 격자로 노드 병합
const CELL = 50;        // 공간 해시 셀 (m)

export class RoadGraph {
  nodes: Vec2[] = [];
  edges: Edge[] = [];
  nodeEdges: number[][] = [];

  private nodeKey = new Map<string, number>();
  private cells = new Map<string, number[]>();
  private spawnEdges: number[] = [];
  private spawnTotalLen = 0;

  static build(ways: RoadWay[]): RoadGraph {
    const g = new RoadGraph();
    for (const w of ways) {
      if (w.points.length < 2) continue;
      let prev = g.getOrAddNode(w.points[0]);
      for (let i = 1; i < w.points.length; i++) {
        const cur = g.getOrAddNode(w.points[i]);
        if (cur !== prev) g.addEdge(prev, cur, w.layer, w.spawnAllowed);
        prev = cur;
      }
    }
    return g;
  }

  private getOrAddNode(p: Vec2): number {
    const key = `${Math.round(p.x / NODE_QUANT)},${Math.round(p.y / NODE_QUANT)}`;
    const found = this.nodeKey.get(key);
    if (found !== undefined) return found;
    const id = this.nodes.length;
    this.nodes.push(p);
    this.nodeEdges.push([]);
    this.nodeKey.set(key, id);
    return id;
  }

  private addEdge(a: number, b: number, layer: number, spawnAllowed: boolean) {
    const e: Edge = { a, b, len: dist(this.nodes[a], this.nodes[b]), layer, spawnAllowed };
    const idx = this.edges.length;
    this.edges.push(e);
    this.nodeEdges[a].push(idx);
    this.nodeEdges[b].push(idx);
    this.insertToCells(idx);
    if (spawnAllowed && e.len > 1) {
      this.spawnEdges.push(idx);
      this.spawnTotalLen += e.len;
    }
  }

  private insertToCells(edgeIdx: number) {
    const e = this.edges[edgeIdx];
    const a = this.nodes[e.a], b = this.nodes[e.b];
    const x0 = Math.floor(Math.min(a.x, b.x) / CELL), x1 = Math.floor(Math.max(a.x, b.x) / CELL);
    const y0 = Math.floor(Math.min(a.y, b.y) / CELL), y1 = Math.floor(Math.max(a.y, b.y) / CELL);
    for (let x = x0; x <= x1; x++)
      for (let y = y0; y <= y1; y++) {
        const key = `${x},${y}`;
        let list = this.cells.get(key);
        if (!list) { list = []; this.cells.set(key, list); }
        list.push(edgeIdx);
      }
  }

  /** p를 maxDist 이내 가장 가까운 엣지 위 점으로 투영 */
  snapToEdge(p: Vec2, maxDist: number): { snapped: Vec2; edgeIdx: number } | null {
    let best = maxDist * maxDist;
    let bestSnap: Vec2 | null = null;
    let bestEdge = -1;
    const cx = Math.floor(p.x / CELL), cy = Math.floor(p.y / CELL);
    const r = Math.ceil(maxDist / CELL);
    for (let x = cx - r; x <= cx + r; x++)
      for (let y = cy - r; y <= cy + r; y++) {
        const list = this.cells.get(`${x},${y}`);
        if (!list) continue;
        for (const ei of list) {
          const proj = this.projectOnEdge(p, ei);
          const d2 = sqrDist(p, proj);
          if (d2 < best) { best = d2; bestSnap = proj; bestEdge = ei; }
        }
      }
    return bestSnap ? { snapped: bestSnap, edgeIdx: bestEdge } : null;
  }

  /**
   * 도로 폭 안으로 위치를 제한한다. 도로 외 영역은 건물이므로 들어갈 수 없다.
   * halfWidthM 안이면 그대로 두고, 벗어나면 도로 가장자리로 끌어당긴다.
   * 근처에 도로가 아예 없으면 null (이동 불가).
   */
  clampToRoad(p: Vec2, halfWidthM: number, searchM = 60): Vec2 | null {
    const snap = this.snapToEdge(p, searchM);
    if (!snap) return null;
    const off = dist(p, snap.snapped);
    if (off <= halfWidthM) return p;
    const t = halfWidthM / off;
    return {
      x: snap.snapped.x + (p.x - snap.snapped.x) * t,
      y: snap.snapped.y + (p.y - snap.snapped.y) * t,
    };
  }

  /** 특정 엣지 위로의 투영점과 거리 (스냅 히스테리시스에서 "현재 붙어 있는 도로"를 평가할 때 사용) */
  projectOnto(p: Vec2, edgeIdx: number): { point: Vec2; dist: number } | null {
    if (edgeIdx < 0 || edgeIdx >= this.edges.length) return null;
    const point = this.projectOnEdge(p, edgeIdx);
    return { point, dist: dist(p, point) };
  }

  private projectOnEdge(p: Vec2, edgeIdx: number): Vec2 {
    const e = this.edges[edgeIdx];
    const a = this.nodes[e.a], b = this.nodes[e.b];
    const ab = sub(b, a);
    const l2 = ab.x * ab.x + ab.y * ab.y;
    if (l2 < 1e-9) return a;
    let t = dot(sub(p, a), ab) / l2;
    t = Math.max(0, Math.min(1, t));
    return add(a, mul(ab, t));
  }

  /**
   * 두 점 사이 직선이 도로 위에 계속 머무는지 검사한다(시야 차단 판정).
   * 도로망만 통행 가능한 세계에서는 길 밖 = 건물이므로, 직선이 도로를 벗어나면 안 보인다.
   * corridorM: 도로 중심선으로부터 이 거리 안이면 "길 위"로 본다.
   */
  hasLineOfSight(a: Vec2, b: Vec2, corridorM = 8, stepM = 8): boolean {
    const d = dist(a, b);
    if (d < 1e-3) return true;
    const steps = Math.max(1, Math.ceil(d / stepM));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      if (!this.snapToEdge(p, corridorM)) return false;
    }
    return true;
  }

  nearestNode(p: Vec2, maxSnapDist = 60): number {
    const snap = this.snapToEdge(p, maxSnapDist);
    if (snap) {
      const e = this.edges[snap.edgeIdx];
      return sqrDist(p, this.nodes[e.a]) < sqrDist(p, this.nodes[e.b]) ? e.a : e.b;
    }
    let bestId = -1, best = Infinity;
    for (let i = 0; i < this.nodes.length; i++) {
      const d2 = sqrDist(p, this.nodes[i]);
      if (d2 < best) { best = d2; bestId = i; }
    }
    return bestId;
  }

  /** 스폰 허용 엣지에서 길이 가중 랜덤 지점 (FR-205) */
  randomSpawnPoint(rng: () => number): { pos: Vec2; edgeIdx: number } | null {
    if (this.spawnEdges.length === 0) return null;
    const pick = rng() * this.spawnTotalLen;
    let acc = 0;
    for (const ei of this.spawnEdges) {
      acc += this.edges[ei].len;
      if (acc >= pick) {
        const e = this.edges[ei];
        return { pos: lerp(this.nodes[e.a], this.nodes[e.b], rng()), edgeIdx: ei };
      }
    }
    const ei = this.spawnEdges[this.spawnEdges.length - 1];
    return { pos: this.nodes[this.edges[ei].a], edgeIdx: ei };
  }
}
