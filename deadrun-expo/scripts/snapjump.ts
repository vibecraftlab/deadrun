/// <reference types="node" />
/**
 * 표시 위치를 도로에 붙였을 때 화면이 얼마나 튀는가 — 계측.
 *
 *  예전에 "스냅된 값을 그리면 한 번에 30m씩 순간이동한다"는 이유로 표시에서 뺐다.
 *  그 뒤에 들러붙기(SNAP_STICKY)가 들어왔으므로 지금도 그런지 다시 잰다.
 *
 *  npx tsx scripts/snapjump.ts
 */
import { generateTestGrid } from './testMap';
import { RoadGraph } from '../src/core/roadGraph';
import { LocationFilter } from '../src/core/locationFilter';
import { Vec2, dist, v } from '../src/core/geo';
import { Config } from '../src/config';

const grid = RoadGraph.build(generateTestGrid(600));

/**
 * 최악 사례 — 인도와 차도가 나란히 붙어 있는 길.
 *  한국 도심에서 가장 흔한 배치다. 두 선 사이에서 GPS가 흔들리면
 *  스냅이 이쪽저쪽으로 갈아타며 화면이 튄다.
 */
function parallelRoads(gapM: number): RoadGraph {
  const line = (y: number) => ({
    highway: 'footway', layer: 0, spawnAllowed: true,
    points: Array.from({ length: 41 }, (_, i) => v(i * 25, y)),
  });
  return RoadGraph.build([line(0), line(gapM)]);
}

let seed = 7;
const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(1 - rng())) * Math.sin(2 * Math.PI * rng());

/** 화면 표시용 지수 보간 — game.ts renderStep 과 같은 식 */
const lerpTo = (cur: Vec2, target: Vec2, k: number): Vec2 => ({
  x: cur.x + (target.x - cur.x) * k,
  y: cur.y + (target.y - cur.y) * k,
});

interface Result {
  label: string;
  /** 프레임당 화면 점 이동량 (m) */
  p95: number;
  max: number;
  /** 보간 전 목표값의 프레임당 도약 (m) */
  jumpP95: number;
  jumpMax: number;
  /** 5m 넘게 도약한 프레임 수 */
  big: number;
  /** 실제 위치에서 화면 점이 떨어진 거리 (m) */
  errP50: number;
  errP95: number;
  /** 스냅이 붙은 프레임 비율 */
  snapRate: number;
}

/**
 * @param mode raw = 지금 방식(필터 위치) · snap = 스냅 위치 · guard = 스냅 + 안전장치
 * @param noiseM GPS 잡음 σ(m)
 */
function run(
  mode: 'raw' | 'snap' | 'guard', noiseM: number, g: RoadGraph, seconds = 180,
): Result {
  seed = 7;
  const filter = new LocationFilter(g);
  let truth = g.nodes[g.nearestNode(v(0, 0))];
  filter.reset(truth);

  const FPS = 30;
  const smooth = Config.renderSmoothing;
  let render: Vec2 = truth;
  let init = false;
  const steps: number[] = [];
  const errs: number[] = [];
  /** 보간 전, 목표값 자체가 한 프레임에 얼마나 뛰는가 — 예전의 "순간이동 30m"이 이 값이다 */
  const jumps: number[] = [];
  let prevTarget: Vec2 | null = null;
  let snapped = 0, frames = 0;

  for (let t = 0; t < seconds; t++) {
    // 10km/h 로 동쪽으로 직진 (테스트 격자 도로를 따라간다)
    truth = v(truth.x + 10 / 3.6, truth.y);
    const raw = v(truth.x + gauss() * noiseM, truth.y + gauss() * noiseM);
    let pose = filter.update(raw, 1);

    for (let f = 0; f < FPS; f++) {
      if (f > 0) pose = filter.predict(1 / FPS);

      let target = pose.posFiltered;
      if (mode !== 'raw' && pose.snapped) {
        if (mode === 'snap') {
          target = pose.posSnapped;
        } else {
          // 안전장치: 끌어당기는 양이 작을 때만 믿는다.
          // 멀리 끌어야 하는 상황은 애초에 어느 도로인지 확신할 수 없는 상황이다.
          const pull = dist(pose.posFiltered, pose.posSnapped);
          if (pull <= GUARD_MAX_PULL) target = pose.posSnapped;
        }
      }
      if (mode !== 'raw' && pose.snapped) snapped++;
      frames++;

      if (prevTarget && t > 10) jumps.push(dist(prevTarget, target));
      prevTarget = target;

      if (!init || dist(render, target) > 50) {
        render = target; init = true;
      } else {
        const prev = render;
        render = lerpTo(render, target, 1 - Math.exp(-smooth / FPS));
        if (t > 10) steps.push(dist(prev, render));
      }
      if (t > 10) errs.push(dist(render, truth));
    }
  }

  const p = (a: number[], q: number) => {
    const s = [...a].sort((x, y) => x - y);
    return s[Math.floor(s.length * q)] ?? 0;
  };
  return {
    label: mode,
    p95: p(steps, 0.95), max: Math.max(...steps),
    jumpP95: p(jumps, 0.95), jumpMax: Math.max(...jumps),
    big: jumps.filter(j => j > 5).length,
    errP50: p(errs, 0.5), errP95: p(errs, 0.95),
    snapRate: frames > 0 ? snapped / frames : 0,
  };
}

/** 안전장치: 이 거리 이상 끌어당겨야 하면 스냅을 쓰지 않는다 (m) */
const GUARD_MAX_PULL = 15;

console.log(`테스트 격자 도로망 · 10km/h 직진 · 렌더 30fps · 보간 ${Config.renderSmoothing}/s`);
console.log(`안전장치 최대 끌어당김 ${GUARD_MAX_PULL}m\n`);
console.log('GPS잡음  방식          목표 도약(최대)  5m↑도약  화면 이동(최대)  오차(중앙)  스냅률');
console.log('─'.repeat(88));
for (const noise of [4, 8, 15]) {
  for (const mode of ['raw', 'snap', 'guard'] as const) {
    const r = run(mode, noise, grid);
    const name = mode === 'raw' ? '현행(필터)' : mode === 'snap' ? '스냅 그대로' : '스냅+안전장치';
    console.log(
      `σ${String(noise).padStart(2)}m   ${name.padEnd(15)}`
      + `${r.jumpMax.toFixed(1)}m`.padStart(11)
      + `${r.big}`.padStart(9)
      + `${r.max.toFixed(1)}m`.padStart(16)
      + `${r.errP50.toFixed(1)}m`.padStart(12)
      + `${(r.snapRate * 100).toFixed(0)}%`.padStart(8));
  }
  console.log('');
}

// ── 최악 사례: 인도와 차도가 나란히 ────────────────────────────
for (const gap of [8, 15, 30]) {
  console.log(`
── 나란한 두 길 ${gap}m 간격 (인도 위를 걷는 상황) ──`);
  console.log('GPS잡음  방식          목표 도약(최대)  5m↑도약  화면 이동(최대)  오차(중앙)  스냅률');
  const road = parallelRoads(gap);
  for (const noise of [4, 8]) {
    for (const mode of ['raw', 'snap'] as const) {
      const r = run(mode, noise, road);
      const name = mode === 'raw' ? '현행(필터)' : '스냅 그대로';
      console.log(
        `σ${String(noise).padStart(2)}m   ${name.padEnd(15)}`
        + `${r.jumpMax.toFixed(1)}m`.padStart(11)
        + `${r.big}`.padStart(9)
        + `${r.max.toFixed(1)}m`.padStart(16)
        + `${r.errP50.toFixed(1)}m`.padStart(12)
        + `${(r.snapRate * 100).toFixed(0)}%`.padStart(8));
    }
  }
}
