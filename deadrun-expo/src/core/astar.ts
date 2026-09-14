import { RoadGraph } from './roadGraph';
import { Vec2, dist } from './geo';

const MAX_EXPANSIONS = 40000;

/** 도로 그래프 위 A*. 노드 경로 반환, 실패 시 null (ADR-003: 클라이언트 경로탐색) */
export function findPath(g: RoadGraph, start: number, goal: number): number[] | null {
  if (start < 0 || goal < 0) return null;
  if (start === goal) return [start];

  // 소형 이진 최소 힙
  const heapF: number[] = [];
  const heapN: number[] = [];
  const push = (f: number, n: number) => {
    heapF.push(f); heapN.push(n);
    let i = heapF.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (heapF[p] <= heapF[i]) break;
      [heapF[p], heapF[i]] = [heapF[i], heapF[p]];
      [heapN[p], heapN[i]] = [heapN[i], heapN[p]];
      i = p;
    }
  };
  const pop = (): number => {
    const top = heapN[0];
    const last = heapF.length - 1;
    heapF[0] = heapF[last]; heapN[0] = heapN[last];
    heapF.pop(); heapN.pop();
    let i = 0;
    for (;;) {
      const l = i * 2 + 1, r = i * 2 + 2;
      let s = i;
      if (l < heapF.length && heapF[l] < heapF[s]) s = l;
      if (r < heapF.length && heapF[r] < heapF[s]) s = r;
      if (s === i) break;
      [heapF[s], heapF[i]] = [heapF[i], heapF[s]];
      [heapN[s], heapN[i]] = [heapN[i], heapN[s]];
      i = s;
    }
    return top;
  };

  const gScore = new Map<number, number>();
  const cameFrom = new Map<number, number>();
  const closed = new Set<number>();

  gScore.set(start, 0);
  push(dist(g.nodes[start], g.nodes[goal]), start);

  let expansions = 0;
  while (heapF.length > 0 && expansions++ < MAX_EXPANSIONS) {
    const cur = pop();
    if (cur === goal) {
      const path = [goal];
      let c = cur;
      while (cameFrom.has(c)) { c = cameFrom.get(c)!; path.push(c); }
      path.reverse();
      return path;
    }
    if (closed.has(cur)) continue;
    closed.add(cur);

    for (const ei of g.nodeEdges[cur]) {
      const e = g.edges[ei];
      const nxt = e.a === cur ? e.b : e.a;
      if (closed.has(nxt)) continue;
      const tentative = gScore.get(cur)! + e.len;
      const old = gScore.get(nxt);
      if (old === undefined || tentative < old) {
        gScore.set(nxt, tentative);
        cameFrom.set(nxt, cur);
        push(tentative + dist(g.nodes[nxt], g.nodes[goal]), nxt);
      }
    }
  }
  return null;
}

export function toPolyline(g: RoadGraph, nodePath: number[] | null, exactGoal?: Vec2): Vec2[] | null {
  if (!nodePath) return null;
  const pts = nodePath.map(n => g.nodes[n]);
  if (exactGoal) pts.push(exactGoal);
  return pts;
}
