/** 코어 로직 헤드리스 스모크 테스트: npx tsx scripts/smoke.ts */
import { generateTestGrid } from './testMap';
import { RoadGraph, RoadWay } from '../src/core/roadGraph';
import { findPath } from '../src/core/astar';
import { ZombieSimulation, Zombie, ZombieTypes } from '../src/core/zombies';
import { LocationFilter } from '../src/core/locationFilter';
import { dist, v, fromEnu, Vec2 } from '../src/core/geo';
import { ZoneIndex, isSafeAt, pointInPolygon } from '../src/core/safeZones';
import { pickView } from '../src/components/zombieArtSpec';
import { HeadingFilter } from '../src/core/headingFilter';
import {
  ADAPTIVE, RunRecord, adaptiveChaseKmh, personalBests, recentAvgKmh,
  weekStreak, weeks,
} from '../src/core/runStats';
import { Config } from '../src/config';

let fail = 0;
const check = (cond: boolean, name: string) => {
  console.log((cond ? '[PASS] ' : '[FAIL] ') + name);
  if (!cond) fail++;
};

const g = RoadGraph.build(generateTestGrid(600));
console.log(`그래프: 노드 ${g.nodes.length}, 엣지 ${g.edges.length}`);
check(g.nodes.length > 100 && g.edges.length > 200, '그래프 빌드');

const a = g.nearestNode(v(-500, -500));
const b = g.nearestNode(v(500, 500));
const path = findPath(g, a, b);
check(!!path && path.length > 5, `A* 경로탐색 (${path?.length ?? 0} 노드)`);

const snap = g.snapToEdge(v(103, 250), 20);
check(!!snap && Math.abs(snap.snapped.x - 100) < 1, '도로 스냅');

const bridgeSnap = g.snapToEdge(v(0, 205), 10);
check(!!bridgeSnap && g.edges[bridgeSnap.edgeIdx].layer === 1, '육교 레이어 판정');

const sim = new ZombieSimulation(g, 42);
sim.useFov = false; // 시야각은 전용 테스트에서 검증 — 여기서는 공격 로직만
const playerPos = g.nodes[g.nearestNode(v(0, 0))];
sim.spawnInitial(100, playerPos);
check(sim.zombies.length >= 90, `스폰 (${sim.zombies.length}/100)`);
check(sim.zombies.every(z => dist(z.pos, playerPos) >= 80), '스폰 금지 반경 80m');

let hits = 0;
sim.onAttack = () => { hits++; };
const runner = new Zombie(999, ZombieTypes[1], v(playerPos.x + 20, playerPos.y), 0);
sim.zombies.push(runner);
let t = 0;
while (t < 60 && hits === 0) { sim.tick(0.1, playerPos, 0); t += 0.1; }
check(hits > 0 && runner.state === 'chase', `러너 감지→추격→근접 공격 (${t.toFixed(1)}s)`);

// 계속 서 있으면 반복 타격 (공격 쿨다운 1.2s)
for (let i = 0; i < 50; i++) sim.tick(0.1, playerPos, 0);
check(hits >= 3, `반복 공격 (${hits}회 피격)`);

// 겹침 방지: 붙어 서도 최소 간격 유지 (AR에서 카메라 안으로 들어가지 않도록)
const standoffNow = dist(runner.pos, playerPos);
check(standoffNow >= 0.35 && standoffNow <= 0.6,
  `공격 중 최소 간격 유지 (${standoffNow.toFixed(2)}m)`);

// 도주: 워커 15m 뒤, 플레이어 15km/h 동쪽
const sim2 = new ZombieSimulation(g, 7);
const walker = new Zombie(1, ZombieTypes[0], v(-415, 0), 0);
sim2.zombies.push(walker);
let caught = false;
sim2.onAttack = () => { caught = true; };
let p2 = v(-400, 0);
for (t = 0; t < 120 && p2.x < 550; t += 0.1) {
  p2 = v(p2.x + (15 / 3.6) * 0.1, 0);
  sim2.tick(0.1, p2, 0);
}
check(!caught, '15km/h 도주 시 워커에게 안 잡힘');

// 집요한 추격(relentless): 멀리 도망가도 추격 상태 유지 / 기본값은 이탈
{
  const mk = (relentless: boolean) => {
    const sm = new ZombieSimulation(g, 11);
    sm.useFov = false; // 이탈 규칙만 검증
    sm.escapeDistance = 100;
    sm.relentless = relentless;
    sm.deAggroHoldSec = Config.deAggroHoldSec;
    const z = new Zombie(1, ZombieTypes[0], v(30, 0), 0); // 워커, 감지범위 40m
    sm.zombies.push(z);
    let pp = v(0, 0);
    for (let i = 0; i < 20; i++) sm.tick(0.1, pp, 0); // 감지 → 추격
    const detected = z.state;
    // 플레이어가 멀리 이동(감지범위 2배 밖) 후 해제 유예를 넘겨 경과
    pp = v(-400, 0);
    const frames = Math.ceil((Config.deAggroHoldSec + 10) / 0.1);
    for (let i = 0; i < frames; i++) sm.tick(0.1, pp, 0);
    return { detected, after: z.state };
  };
  const relent = mk(true);
  const normal = mk(false);
  check(relent.detected === 'chase' && relent.after === 'chase',
    `집요한 추격 — 멀어져도 추격 유지 (${relent.after})`);
  check(normal.after !== 'chase',
    `기본 모드 — 거리 벌리면 추격 이탈 (${normal.after})`);
}

// 동시 추격 상한: 상한을 올리면 감지한 좀비가 모두 달려든다
{
  const sm = new ZombieSimulation(g, 12);
  sm.maxChasers = 40;
  sm.relentless = true;
  sm.useFov = false; // 추격 상한만 검증
  for (let i = 0; i < 12; i++)
    sm.zombies.push(new Zombie(100 + i, ZombieTypes[0], v(20 + i * 0.5, i * 0.5), 0));
  for (let i = 0; i < 20; i++) sm.tick(0.1, v(0, 0), 0);
  check(sm.countChasing() >= 10, `추격 상한 확장 — ${sm.countChasing()}/12마리 동시 추격`);
}

// 추격 진행성: 감지 후 매 순간 플레이어에게 "가까워지기만" 해야 한다 (되돌아가기 금지)
{
  const sm = new ZombieSimulation(g, 21);
  sm.relentless = true;
  sm.useFov = false; // 경로 추종만 검증
  // 격자 노드(0,100,200…) 사이 중간 지점 + 워커 감지범위(40m) 안쪽
  const z = new Zombie(1, ZombieTypes[0], v(35, 0), 0);
  sm.zombies.push(z);
  const pp = v(0, 0);
  for (let i = 0; i < 10; i++) sm.tick(0.1, pp, 0); // 감지 → chase
  check(z.state === 'chase', `중간 지점 좀비 감지 (${z.state})`);

  let prevD = dist(z.pos, pp);
  const startD = prevD;
  let backsteps = 0, worstBack = 0;
  for (let i = 0; i < 900; i++) { // 90초
    sm.tick(0.1, pp, 0);
    const dNow = dist(z.pos, pp);
    if (dNow > prevD + 0.05) { backsteps++; worstBack = Math.max(worstBack, dNow - prevD); }
    prevD = dNow;
  }
  const endD = dist(z.pos, pp);
  console.log(`  추격 거리: ${startD.toFixed(0)}m → ${endD.toFixed(0)}m, 후퇴 프레임 ${backsteps}`);
  check(endD < 2, `추격 완주 — 플레이어까지 도달 (${endD.toFixed(1)}m)`);
  check(backsteps < 20, `되돌아가기 없음 (후퇴 프레임 ${backsteps})`);
}

// 움직이는 플레이어 추격: 러너(24km/h)가 조깅(10km/h)하는 플레이어를 따라잡는가
{
  const sm = new ZombieSimulation(g, 26);
  sm.chaseSpeedKmh = { Runner: 24 }; // 러너 24km/h
  sm.detectRangeMult = 1.5;
  const z = new Zombie(1, ZombieTypes[1], v(0, 40), 0); // 러너, 감지 90m
  z.facing = Math.PI;
  sm.zombies.push(z);
  let pp = v(0, 0);
  for (let i = 0; i < 10; i++) sm.tick(0.1, pp, 0);
  check(z.state === 'chase', `달리기 추격 — 감지 (${z.state})`);

  const d0 = dist(z.pos, pp);
  // 플레이어가 격자 도로를 따라 동쪽으로 10km/h 주행
  for (let i = 0; i < 600; i++) {
    pp = v(pp.x + (10 / 3.6) * 0.1, 0);
    sm.tick(0.1, pp, 0);
  }
  const d1 = dist(z.pos, pp);
  console.log(`  이동 중 추격: 시작 ${d0.toFixed(0)}m → 60초 후 ${d1.toFixed(0)}m`);
  check(d1 < 10, `달리는 플레이어를 따라잡음 (${d1.toFixed(1)}m)`);
}

// 시작 직후 감지 없음: 자기 감지 반경 안에 스폰되지 않아야 한다
{
  const sm = new ZombieSimulation(g, 27);
  sm.detectRangeMult = 1.5;
  const pp = v(0, 0);
  sm.spawnInitial(120, pp);
  let insideDetect = 0;
  for (const z of sm.zombies)
    if (dist(z.pos, pp) <= z.type.detectRange * 1.5) insideDetect++;
  check(insideDetect === 0, `스폰 시 감지 반경 안 좀비 0마리 (${insideDetect})`);
  sm.tick(0.1, pp, 0);
  check(sm.countChasing() === 0, `시작 직후 추격 0마리 (${sm.countChasing()})`);
}

// 실전 설정 회귀: "레이더에 보이는 좀비는 결국 전부 나를 쫓아온다"
// (감지 반경이 레이더보다 좁으면 보이는데도 영영 감지 못 하는 좀비가 생긴다)
{
  const sm = new ZombieSimulation(g, 1234);
  // .env 기본값과 동일한 개별 속도 지정
  sm.chaseSpeedKmh = { Walker: 8, Runner: 16, Stalker: 12, Brute: 10 };
  sm.wanderSpeedKmh = { Walker: 4, Runner: 5, Stalker: 4, Brute: 3 };
  sm.detectRangeMult = 3;
  sm.detectRangeMaxM = 150;   // 레이더 범위와 동일
  sm.detectAlwaysM = 20;
  sm.useFov = true;
  sm.maxChasers = 40;
  sm.relentless = true;

  const startPos = g.nodes[g.nearestNode(v(0, 0))];
  sm.spawnInitial(220, startPos);
  check(sm.countChasing() === 0, `스폰 직후 추격 0마리 (${sm.countChasing()})`);

  let gaveUp = 0;
  let chaseTicks = 0, awayTicks = 0;
  let worstRun = 0;
  const curRun = new Map<number, number>();
  const prev = new Map<number, string>();
  const prevD = new Map<number, number>();
  const reached = new Set<number>();
  let pp = startPos;
  for (let i = 0; i < 1500; i++) { // 150초: 30초 대기 → 60초 조깅 → 60초 대기
    if (i >= 300 && i < 900) pp = v(pp.x + (10 / 3.6) * 0.1, pp.y);
    sm.tick(0.1, pp, 0);
    for (const z of sm.zombies) {
      const d = dist(z.pos, pp);
      if (prev.get(z.id) === 'chase' && z.state !== 'chase' && z.state !== 'dead') gaveUp++;
      if (z.state === 'chase') {
        if (d < 2) reached.add(z.id);
        if (prev.get(z.id) === 'chase') {
          chaseTicks++;
          const delta = d - (prevD.get(z.id) ?? d);
          if (delta > 0.02) {
            awayTicks++;
            const run = (curRun.get(z.id) ?? 0) + delta;
            curRun.set(z.id, run);
            worstRun = Math.max(worstRun, run);
          } else {
            curRun.set(z.id, 0);
          }
        }
      }
      prev.set(z.id, z.state);
      prevD.set(z.id, d);
    }
  }
  const visible = sm.zombies.filter(z => z.state !== 'dead' && dist(z.pos, pp) < 150).length;
  const chasing = sm.countChasing();
  const awayPct = (awayTicks / Math.max(1, chaseTicks)) * 100;
  // 시야 차단이 켜져 있으므로 "보이는 좀비 전부"가 아니라
  // "직선이 뚫려 있고 인지 반경 안인 좀비 전부"가 추격해야 한다.
  const shouldChase = sm.zombies.filter(z =>
    z.state !== 'dead'
    && dist(z.pos, pp) <= sm.detectRangeOf(z.type)
    && g.hasLineOfSight(z.pos, pp, sm.losCorridorM));
  const missed = shouldChase.filter(z => z.state !== 'chase').length;
  console.log(`  150초 후: 레이더 내 ${visible} / 추격 ${chasing} / 포기 ${gaveUp}회 / ` +
    `도달 ${reached.size}마리 / 후퇴 프레임 ${awayPct.toFixed(1)}% / 최악 연속후퇴 ${worstRun.toFixed(0)}m`);
  check(missed === 0,
    `시야가 뚫린 좀비는 빠짐없이 추격 (미추격 ${missed}/${shouldChase.length})`);
  check(gaveUp === 0, `한 번 감지 후 포기 0회 (${gaveUp})`);
  check(reached.size >= chasing - 2, `추격한 좀비 대부분이 플레이어에 도달 (${reached.size}/${chasing})`);
  // 교차로를 돌아가느라 잠시 멀어지는 것은 정상이다(100m 격자에서 반 블록 = 최대 50m).
  // 경로 오버슈트 버그는 "플레이어를 지나쳐 갔다가 되돌아오는" 것이라 64m를 넘었고,
  // 특정 개체가 추격 시간의 33%를 후퇴에 쓰는 형태로 나타났다. 두 지표로 함께 감시한다.
  check(worstRun < 45, `한 번에 멀어지는 거리 45m 미만 (${worstRun.toFixed(0)}m, 버그 시절 64m)`);
  check(awayPct < 8, `추격 중 후퇴 프레임 8% 미만 (${awayPct.toFixed(1)}%, 버그 시절 10%)`);
}

// 시야 차단: 건물(도로 밖)이 가로막으면 감지되지 않는다
{
  const sm = new ZombieSimulation(g, 28);
  sm.useLineOfSight = true;
  sm.useFov = false;         // 시야 차단만 격리 검증
  sm.detectRangeMult = 3;
  sm.detectRangeMaxM = 150;

  // 격자: 도로는 x=0,±100… / y=0,±100…  블록 안(예: 25,25)은 건물
  const onSameStreet = new Zombie(1, ZombieTypes[0], v(100, 0), 0);  // 플레이어와 같은 y=0 도로
  const acrossBlock = new Zombie(2, ZombieTypes[0], v(0, 50), 0);    // x=0 도로, 대각선은 블록 관통
  const player = v(50, 0);

  check(g.hasLineOfSight(v(100, 0), player, 8) === true, '같은 도로 위 — 시야 뚫림');
  check(g.hasLineOfSight(v(0, 50), player, 8) === false, '블록 너머 대각선 — 시야 차단');
  check(sm.canDetect(onSameStreet, player, dist(onSameStreet.pos, player), true) === true,
    '같은 도로의 좀비 → 감지');
  check(sm.canDetect(acrossBlock, player, dist(acrossBlock.pos, player), true) === false,
    '건물 너머 좀비 → 미감지');

  // 끄면 건물 너머도 감지된다 (기존 동작)
  sm.useLineOfSight = false;
  check(sm.canDetect(acrossBlock, player, dist(acrossBlock.pos, player), true) === true,
    '시야 차단 OFF → 건물 너머도 감지');
}

// 시야각 감지 판정 (배회로 방향이 바뀌지 않도록 canDetect를 직접 검사)
{
  const sm = new ZombieSimulation(g, 24);
  sm.useFov = true;
  sm.detectRangeMult = 1;
  const player = v(0, 0);
  const probe = (typeIdx: number, facing: number, pos = v(0, 30)) => {
    const z = new Zombie(1, ZombieTypes[typeIdx], pos, 0);
    z.facing = facing;
    return sm.canDetect(z, player, dist(pos, player), true);
  };
  // 좀비는 플레이어의 북쪽 30m → 플레이어는 좀비 기준 남쪽(bearing π)
  check(probe(0, Math.PI) === true, '워커: 정면(시야 120°) → 감지');
  check(probe(0, Math.PI / 2) === false, '워커: 90° 옆 → 미감지');
  check(probe(0, 0) === false, '워커: 등 뒤 → 미감지');
  check(probe(2, 0) === true, '스토커: 전방위(360°) → 등 뒤도 감지');
  check(probe(0, Math.PI, v(0, 200)) === false, '감지 반경 밖(200m) → 미감지');
  // 상한(DETECT_RANGE_MAX_M): 스토커 기본 90m를 60m로 자른다
  sm.detectRangeMaxM = 60;
  check(sm.detectRangeOf(ZombieTypes[2]) === 60, '감지 반경 상한 적용 (스토커 90m → 60m)');
  check(probe(2, 0, v(0, 75)) === false, '상한 밖(75m) → 스토커도 미감지');
  check(probe(2, 0, v(0, 50)) === true, '상한 안(50m) → 감지');
  sm.detectRangeMaxM = 999;
  // 코앞이면 방향 무관
  check(probe(0, 0, v(0, 0.5)) === true, '코앞(0.5m) → 방향 무관하게 감지');
}

// 이탈: 감지 후에는 시야와 무관하게 쫓아오고, 이탈 거리를 넘어야 놓친다
{
  const sm = new ZombieSimulation(g, 25);
  sm.useFov = true;
  sm.escapeDistance = 200;
  const z = new Zombie(1, ZombieTypes[0], v(0, 30), 0);
  z.facing = Math.PI; // 플레이어를 봄
  sm.zombies.push(z);
  for (let i = 0; i < 10; i++) sm.tick(0.1, v(0, 0), 0);
  check(z.state === 'chase', '감지 성립');

  // 이탈 거리 안(150m)에서는 시야 밖으로 벗어나도 추격 유지
  for (let i = 0; i < 100; i++) sm.tick(0.1, v(0, 150), 0);
  check(z.state === 'chase', `이탈 거리 안 → 추격 유지 (${z.state})`);

  // 이탈 거리 밖(400m)에서 해제 유예를 넘기면 놓침
  const outFrames = Math.ceil((Config.deAggroHoldSec + 5) / 0.1);
  for (let i = 0; i < outFrames; i++) sm.tick(0.1, v(0, 400), 0);
  check(z.state !== 'chase', `이탈 거리 밖 ${Config.deAggroHoldSec}초 → 놓침 (${z.state})`);
}

// 감지 범위 배수: 레이더(150m)에 보이는 좀비가 전부 추격에 들어가는가
{
  const mk = (mult: number) => {
    const sm = new ZombieSimulation(g, 23);
    sm.relentless = true;
    sm.maxChasers = 40;
    sm.useFov = false; // 시야각은 별도 테스트 — 여기서는 반경 배수만 검증
    sm.detectRangeMult = mult;
    // 레이더 범위 안(60~145m)에 워커 8마리 — 기본 감지범위 40m로는 아무도 못 본다
    for (let i = 0; i < 8; i++)
      sm.zombies.push(new Zombie(200 + i, ZombieTypes[0], v(60 + i * 12, 0), 0));
    for (let i = 0; i < 30; i++) sm.tick(0.1, v(0, 0), 0);
    return sm.countChasing();
  };
  const base = mk(1);
  const wide = mk(4);
  console.log(`  레이더 내 워커 8마리 중 추격: 배수1 → ${base}마리, 배수4 → ${wide}마리`);
  check(base <= 1, `기본 감지범위에서는 대부분 못 봄 (${base}/8)`);
  check(wide === 8, `감지 배수 4 — 레이더에 보이면 전부 추격 (${wide}/8)`);
}

// A* 실패 시 매 틱 재탐색하지 않는다 (연결 안 된 그래프에서 CPU 폭주 방지)
{
  const isolated: RoadWay[] = [
    { points: [v(0, 0), v(50, 0)], highway: 'residential', layer: 0, spawnAllowed: true },
    { points: [v(500, 500), v(550, 500)], highway: 'residential', layer: 0, spawnAllowed: true },
  ];
  const g2 = RoadGraph.build(isolated);
  let calls = 0;
  const origFind = (g2 as any).__probe;
  void origFind;
  const sm = new ZombieSimulation(g2, 22);
  sm.relentless = true;
  const z = new Zombie(1, ZombieTypes[2], v(520, 500), 0); // 스토커(감지 90m)… 다른 컴포넌트
  sm.zombies.push(z);
  // 같은 컴포넌트가 아니어서 A*가 실패하는 상황을 60초간 돌린다
  const t0 = Date.now();
  for (let i = 0; i < 600; i++) sm.tick(0.1, v(25, 0), 0);
  const elapsed = Date.now() - t0;
  void calls;
  console.log(`  연결 안 된 그래프에서 60초 시뮬: ${elapsed}ms`);
  check(elapsed < 1500, `A* 실패 시 재탐색 폭주 없음 (${elapsed}ms)`);
}

// 소음 어그로
const sim3 = new ZombieSimulation(g, 3);
const idler = new Zombie(2, ZombieTypes[0], v(100, 100), 0);
sim3.zombies.push(idler);
sim3.emitNoise(v(0, 100), 120);
check(idler.state === 'search', '총성 어그로 → search');

// 브루트 — HP 8이라 총 8발이 필요하다
const sim4 = new ZombieSimulation(g, 4);
const brute = new Zombie(3, ZombieTypes[3], v(0, 0), 0);
sim4.zombies.push(brute);
for (let i = 0; i < 8; i++) sim4.damage(brute, 1);
check(brute.state === 'dead', '브루트 총기 8발 처치');

// ── 좀비 스프라이트 방향 고르기 ────────────────────────────────
// AR에서 좀비가 거꾸로/엉뚱한 쪽을 보고 서던 사고가 있었다. 순수 함수라 여기서 잡는다.
{
  const D = Math.PI / 180;
  // 플레이어는 원점, 좀비는 북쪽 10m (월드 x=0, z=-10) → 좀비에서 본 플레이어 방위 = 180도
  const toPlayer = Math.atan2(-0, -10);
  const view = (headingDeg: number) => pickView(headingDeg * D, toPlayer);

  check(view(180).view === 'front', '나를 마주보면 정면 그림');
  check(view(0).view === 'back', '등지면 뒷모습 그림');
  // 북쪽 좀비가 동쪽으로 가면 내 시야에서 오른쪽으로 지나간다.
  // 아트의 side 는 왼쪽을 보므로 뒤집어야 한다.
  const east = view(90);
  check(east.view === 'side' && east.flip, '오른쪽으로 지나가면 측면 + 좌우 반전');
  const west = view(270);
  check(west.view === 'side' && !west.flip, '왼쪽으로 지나가면 측면 그대로');
}

// 필터: 1Hz 측정 + 프레임 예측, 노이즈 4m
const filter = new LocationFilter(g);
let truePos = g.nodes[g.nearestNode(v(0, 0))];
filter.reset(truePos);
let rawErr = 0, filtErr = 0, speedSum = 0, n = 0;
let seed = 1;
const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const gauss = () => Math.sqrt(-2 * Math.log(1 - rng())) * Math.sin(2 * Math.PI * rng());
for (t = 0; t < 120; t += 1) {
  truePos = v(truePos.x + 10 / 3.6, truePos.y);
  const raw = v(truePos.x + gauss() * 4, truePos.y + gauss() * 4);
  const pose = filter.update(raw, 1);
  if (t > 20) {
    rawErr += dist(raw, truePos);
    filtErr += dist(pose.posFiltered, truePos);
    speedSum += pose.speedKmh;
    n++;
  }
  for (let f = 0; f < 30; f++) filter.predict(1 / 30);
}
console.log(`  오차: 원시 ${(rawErr / n).toFixed(2)}m → 필터 ${(filtErr / n).toFixed(2)}m | 속도 ${(speedSum / n).toFixed(1)}km/h (실제 10)`);
check(filtErr < rawErr, '필터 노이즈 저감');
check(speedSum / n > 5 && speedSum / n < 20, '속도 추정 정상');

// 직진 중 속도 벡터 방향 안정성 (가속도 제한 효과) — 실제 진행 방향은 동쪽(90°)
{
  const f = new LocationFilter(g);
  let tp = g.nodes[g.nearestNode(v(0, 0))];
  f.reset(tp);
  let maxSwing = 0;
  let prevPose = f.update(tp, 1, 4, true);
  for (t = 0; t < 40; t += 1) {
    tp = v(tp.x + 10 / 3.6, tp.y);
    const pose = f.update(v(tp.x + gauss() * 4, tp.y + gauss() * 4), 1, 4, true);
    if (t > 8) {
      // 연속 프레임 간 렌더 위치 이동량의 변동 = 체감 튐
      const step = dist(pose.posFiltered, prevPose.posFiltered);
      maxSwing = Math.max(maxSwing, Math.abs(step - 10 / 3.6));
    }
    prevPose = pose;
  }
  console.log(`  직진 시 최대 스텝 편차: ${maxSwing.toFixed(2)}m (이상적 0)`);
  check(maxSwing < 3.0, `가속도 제한 — 직진 중 위치 튐 억제 (${maxSwing.toFixed(2)}m)`);
}

// 테스트 스폰: 내 주변 N마리가 전부 나를 향해 온다 (실외 GPS 테스트용)
{
  const sm = new ZombieSimulation(g, 77);
  sm.relentless = true;
  sm.maxChasers = 40;
  sm.detectRangeMult = 1;
  sm.detectRangeMaxM = 90;
  sm.chaseSpeedKmh = { Walker: 8, Runner: 16, Stalker: 12, Brute: 10 };
  sm.wanderSpeedKmh = { Walker: 4, Runner: 5, Stalker: 4, Brute: 3 };

  const me = g.nodes[g.nearestNode(v(0, 0))];
  sm.spawnNearPlayer(3, me, 50);
  check(sm.zombies.length === 3, `테스트 스폰 마릿수 (${sm.zombies.length}/3)`);

  const d0 = sm.zombies.map(z => dist(z.pos, me));
  check(d0.every(d => d > 5 && d < 120), `스폰 거리 합리적 (${d0.map(d => d.toFixed(0)).join(', ')}m)`);

  // 방위가 분산되어 사방에서 오는가
  const bearings = sm.zombies.map(z => Math.atan2(z.pos.x - me.x, z.pos.y - me.y));
  let minGap = 360;
  for (let i = 0; i < bearings.length; i++)
    for (let j = i + 1; j < bearings.length; j++) {
      const gap = Math.abs((((bearings[i] - bearings[j]) * 180) / Math.PI + 540) % 360 - 180);
      minGap = Math.min(minGap, gap);
    }
  check(minGap > 40, `방위 분산 — 최소 간격 ${minGap.toFixed(0)}°`);

  // 10초 안에 전부 추격 상태가 되고, 60초 안에 전부 도달하는가
  for (let i = 0; i < 100; i++) sm.tick(0.1, me, 0);
  check(sm.countChasing() === 3, `10초 내 전원 추격 (${sm.countChasing()}/3)`);

  for (let i = 0; i < 600; i++) sm.tick(0.1, me, 0);
  const dEnd = sm.zombies.map(z => dist(z.pos, me));
  const arrived = dEnd.filter(d => d < 3).length;
  console.log(`  테스트 스폰: 시작 ${d0.map(d => d.toFixed(0)).join('/')}m → 60초 후 ${dEnd.map(d => d.toFixed(1)).join('/')}m`);
  check(arrived === 3, `60초 내 전원 도달 (${arrived}/3)`);
}

// 도로 밖 이동 제한: 좀비가 블록(건물) 안으로 들어갈 수 없다
{
  const HALF = 5;
  // 격자 도로는 x=0,±100…, y=0,±100…  → (50,50)은 블록 한가운데
  const inBlock = v(50, 50);
  const clamped = g.clampToRoad(inBlock, HALF);
  check(clamped !== null, '블록 안에서도 근처 도로를 찾는다');
  if (clamped) {
    const snapChk = g.snapToEdge(clamped, 60);
    const offRoad = snapChk ? dist(clamped, snapChk.snapped) : 999;
    check(offRoad <= HALF + 0.01, `도로 폭 안으로 제한됨 (도로에서 ${offRoad.toFixed(1)}m)`);
  }
  // 도로 위 지점은 그대로 통과
  const onRoad = v(50, 0);
  const keep = g.clampToRoad(onRoad, HALF);
  check(!!keep && dist(keep, onRoad) < 0.01, '도로 위 지점은 그대로 유지');

  // 블록을 향해 계속 이동시켜도 도로를 벗어나지 않는다
  // (VirtualSource.tick과 동일한 로직: 이동 → clampToRoad)
  let p = v(0, 0);
  let maxOff = 0;
  const stepM = (12 / 3.6) * 0.1; // 12km/h, 0.1초
  for (let i = 0; i < 300; i++) {
    const next = v(p.x + 0.707 * stepM, p.y + 0.707 * stepM); // 대각선 = 블록 방향
    const c = g.clampToRoad(next, HALF);
    if (c) p = c;
    const s2 = g.snapToEdge(p, 60);
    if (s2) maxOff = Math.max(maxOff, dist(p, s2.snapped));
  }
  check(maxOff <= HALF + 0.5, `30초 대각 이동 — 도로 이탈 최대 ${maxOff.toFixed(1)}m`);
}

// 도로 스냅 점프: 블록을 대각선으로 가로질러도 위치가 순간이동하지 않는다
// (스냅에 기억이 없으면 매 프레임 최근접 도로가 뒤집히며 수십 m씩 텔레포트한다)
{
  const f = new LocationFilter(g);
  f.reset(v(0, 0));
  let tp = v(0, 0);
  const sp = 12 / 3.6;
  const dir = { x: Math.sin((35 * Math.PI) / 180), y: Math.cos((35 * Math.PI) / 180) };
  let prevSnap: { x: number; y: number } | null = null;
  let maxSnapJump = 0, maxFiltJump = 0;
  let prevFilt: { x: number; y: number } | null = null;
  for (t = 0; t < 60; t += 1) {
    tp = v(tp.x + dir.x * sp, tp.y + dir.y * sp);
    const pose = f.update(v(tp.x + gauss() * 4, tp.y + gauss() * 4), 1, 4, true);
    if (prevSnap) maxSnapJump = Math.max(maxSnapJump, dist(pose.posSnapped, prevSnap));
    if (prevFilt) maxFiltJump = Math.max(maxFiltJump, dist(pose.posFiltered, prevFilt));
    prevSnap = pose.posSnapped;
    prevFilt = pose.posFiltered;
  }
  console.log(`  블록 대각 횡단: 필터 최대 ${maxFiltJump.toFixed(1)}m/s / 스냅 최대 ${maxSnapJump.toFixed(1)}m/s`);
  check(maxFiltJump < 10, `필터 출력은 순간이동 없음 (${maxFiltJump.toFixed(1)}m/s)`);
  // 스냅은 도로 전환 시 어느 정도 뛰지만, 히스테리시스+보정거리 제한으로 20m 이내여야 한다
  check(maxSnapJump < 20, `스냅 점프 억제 (${maxSnapJump.toFixed(1)}m/s, 수정 전 30.7m)`);
}

// 정지 잠금: ① 이동(10km/h) 중에는 잠금 없음 ② 정지하면 휴리스틱으로 잠금
let lockedWhileMoving = false;
let stopLockAt = -1;
{
  const f2 = new LocationFilter(g);
  let tp = g.nodes[g.nearestNode(v(0, 0))];
  f2.reset(tp);
  for (t = 0; t < 30; t += 1) {
    tp = v(tp.x + 10 / 3.6, tp.y);
    const pose = f2.update(v(tp.x + gauss() * 4, tp.y + gauss() * 4), 1);
    if (t > 5 && pose.locked) lockedWhileMoving = true;
  }
  for (t = 0; t < 15; t += 1) {
    const pose = f2.update(v(tp.x + gauss() * 4, tp.y + gauss() * 4), 1);
    if (pose.locked && stopLockAt < 0) stopLockAt = t;
  }
}
check(!lockedWhileMoving, '이동(10km/h) 중 잠금 오발동 없음');
check(stopLockAt >= 0 && stopLockAt <= 12, `정지 후 잠금 진입 (${stopLockAt}s)`);

// movingHint: false → 2샘플 내 잠금, true → 즉시 해제
{
  const f3 = new LocationFilter(g);
  const tp = g.nodes[g.nearestNode(v(0, 0))];
  f3.reset(tp);
  let hintLockAt = -1;
  for (t = 0; t < 6; t += 1) {
    const pose = f3.update(v(tp.x + gauss() * 4, tp.y + gauss() * 4), 1, 4, false);
    if (pose.locked && hintLockAt < 0) hintLockAt = t;
  }
  check(hintLockAt >= 0 && hintLockAt <= 3, `이동 힌트 false → 즉시 정지 잠금 (${hintLockAt}s)`);
  const poseMoving = f3.update(v(tp.x + 5, tp.y), 1, 4, true);
  check(!poseMoving.locked, '이동 힌트 true → 즉시 잠금 해제');
}

// ── 추격 해제: 인지 범위 밖에서 1분 버티면 풀린다 ──────────────
//
//  따돌릴 수 없는 추격은 러닝 게임의 인터벌 구조와 맞지 않는다.
//  다만 경계에서 GPS가 몇 m씩 흔들리면 추격이 붙었다 풀렸다 하므로 유예를 둔다.
{
  const gd = RoadGraph.build(generateTestGrid(600));
  const sim = new ZombieSimulation(gd, 99);
  sim.relentless = false;
  sim.deAggroHoldSec = Config.deAggroHoldSec;
  sim.escapeDistance = 0;               // 0 = 자기 인지 범위를 벗어나면 놓친다

  const walker = new Zombie(1, ZombieTypes[0], v(0, 0), 0);
  walker.state = 'chase';               // 이미 나를 쫓는 중
  sim.zombies.push(walker);

  const detect = ZombieTypes[0].detectRange;   // 워커 40m
  const far = v(detect * 3, 0);                // 인지 범위 밖으로 확실히 나간다

  // ① 범위 밖으로 나가자마자 풀리지는 않는다
  for (let t = 0; t < Config.deAggroHoldSec - 5; t += 0.5) sim.tick(0.5, far, 0);
  check(walker.state === 'chase',
    `범위를 벗어나도 ${Config.deAggroHoldSec}초 전에는 안 풀린다 (${Config.deAggroHoldSec - 5}초 경과, 상태 ${walker.state})`);

  // ② 유예를 넘기면 풀린다
  for (let t = 0; t < 10; t += 0.5) sim.tick(0.5, far, 0);
  check(walker.state !== 'chase',
    `${Config.deAggroHoldSec}초를 넘기면 추격이 풀린다 (상태 ${walker.state})`);

  // ③ 중간에 다시 범위 안으로 들어오면 타이머가 초기화된다
  //    (경계에서 GPS가 흔들릴 때 조금씩 쌓여 풀려버리면 안 된다)
  const w2 = new Zombie(2, ZombieTypes[0], v(0, 0), 0);
  w2.state = 'chase';
  const sim2 = new ZombieSimulation(gd, 98);
  sim2.relentless = false;
  sim2.deAggroHoldSec = Config.deAggroHoldSec;
  sim2.escapeDistance = 0;
  sim2.zombies.push(w2);
  const near = v(detect * 0.5, 0);
  for (let cycle = 0; cycle < 4; cycle++) {
    // 범위 밖 · 범위 안을 번갈아 — 매번 유예의 절반씩만 버틴다
    for (let t = 0; t < Config.deAggroHoldSec * 0.5; t += 0.5) sim2.tick(0.5, far, 0);
    for (let t = 0; t < 2; t += 0.5) sim2.tick(0.5, near, 0);
  }
  check(w2.state === 'chase',
    `범위를 들락날락하면 타이머가 초기화돼 안 풀린다 (상태 ${w2.state})`);

  // ④ relentless 를 켜면 아무리 도망쳐도 안 풀린다 (설정이 여전히 먹는지)
  const w3 = new Zombie(3, ZombieTypes[0], v(0, 0), 0);
  w3.state = 'chase';
  const sim3 = new ZombieSimulation(gd, 97);
  sim3.relentless = true;
  sim3.deAggroHoldSec = Config.deAggroHoldSec;
  sim3.zombies.push(w3);
  for (let t = 0; t < Config.deAggroHoldSec * 3; t += 0.5) sim3.tick(0.5, far, 0);
  check(w3.state === 'chase', 'relentless=true 면 끝까지 쫓아온다');
}

// ── 표시 위치를 도로에 붙이는 것이 이득인가 ────────────────────
//
//  도심에서 GPS 오차는 10~20m인데 보행로에서 건물까지가 중앙값 19m다.
//  필터 위치를 그대로 그리면 걷는 중에 건물 안에 찍힌다.
//  도로에 붙이면 길 위에 남지만, 예전에 "한 번에 30m 순간이동"으로 되돌린 이력이 있다.
//  자세한 계측은 scripts/snapjump.ts. 여기서는 그 결론이 뒤집히지 않았는지만 지킨다.
{
  const g2 = RoadGraph.build(generateTestGrid(600));
  const f2 = new LocationFilter(g2);
  let truth = g2.nodes[g2.nearestNode(v(0, 0))];
  f2.reset(truth);

  let sd = 12345;
  const rnd2 = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const gs = () => Math.sqrt(-2 * Math.log(1 - rnd2())) * Math.sin(2 * Math.PI * rnd2());

  const FPS = 30;
  const smoothK = 1 - Math.exp(-Config.renderSmoothing / FPS);
  let render = truth;
  const steps: number[] = [];
  let errSnap = 0, errFilt = 0, samples = 0;

  for (let sec = 0; sec < 150; sec++) {
    truth = v(truth.x + 10 / 3.6, truth.y);           // 10km/h 직진
    let pose = f2.update(v(truth.x + gs() * 8, truth.y + gs() * 8), 1);  // GPS σ8m
    for (let fr = 0; fr < FPS; fr++) {
      if (fr > 0) pose = f2.predict(1 / FPS);
      // game.ts renderStep 과 같은 선택
      const target = pose.snapped ? pose.posSnapped : pose.posFiltered;
      const prev = render;
      render = v(
        render.x + (target.x - render.x) * smoothK,
        render.y + (target.y - render.y) * smoothK,
      );
      if (sec > 10) {
        steps.push(dist(prev, render));
        errSnap += dist(render, truth);
        errFilt += dist(pose.posFiltered, truth);
        samples++;
      }
    }
  }

  const sorted = [...steps].sort((a, b) => a - b);
  const stepMax = sorted[sorted.length - 1];
  const snapErr = errSnap / samples;
  const filtErr = errFilt / samples;
  console.log(`  표시 위치: 스냅 ${snapErr.toFixed(2)}m vs 필터 ${filtErr.toFixed(2)}m `
    + `| 프레임당 최대 이동 ${stepMax.toFixed(2)}m`);
  check(snapErr < filtErr, `도로에 붙이면 실제 위치에 더 가깝다 (${snapErr.toFixed(2)} < ${filtErr.toFixed(2)}m)`);
  // 예전에 되돌린 이유가 순간이동이었다. 보간이 흡수하는지 지킨다.
  check(stepMax < 3, `순간이동 없음 — 프레임당 ${stepMax.toFixed(2)}m < 3m`);
}

// ── 런 기록 집계 · 적응형 난이도 ───────────────────────────────
//
//  기록 화면 네 개와 좀비 속도가 전부 이 계산에 달려 있다.
//  특히 "주 단위"와 "연속 기록" 규칙은 design/v2 Training 의 설계 근거라 못 박아 둔다.
{
  const NOW = new Date(2026, 8, 16); // 2026-09-16 (수)
  const day = (offset: number, km: number, chaseSec = 0): RunRecord => {
    const d = new Date(NOW);
    d.setDate(d.getDate() - offset);
    return {
      startedAt: d.toISOString(),
      distanceM: km * 1000,
      durationSec: (km / 10) * 3600,          // 10km/h 로 달린 셈
      chaseSec,
      chaseDistanceM: (chaseSec / 3600) * 15000, // 쫓길 때는 15km/h
      chaseCount: chaseSec > 0 ? 1 : 0,
      longestChaseSec: chaseSec,
      kills: 3,
      killsByType: { Walker: 2, Runner: 1 },
      supplies: 1,
      deathCause: '',
      splits: [{ km: 1, sec: 360, chasedSec: 60 }],
    };
  };

  // 주는 월요일에 시작한다. 2026-09-16(수) 기준 이번 주 = 09-14(월)~
  const w = weeks([day(0, 3), day(1, 2), day(7, 5)], 2, NOW);
  check(w.length === 2, '최근 n주는 기록이 없는 주도 채워 돌려준다');
  check(Math.abs(w[1].distanceM / 1000 - 5) < 1e-6, `이번 주 합계 5km (${w[1].distanceM / 1000})`);
  check(Math.abs(w[0].distanceM / 1000 - 5) < 1e-6, '지난주 합계 5km');
  // 월=0 … 수=2
  check(Math.abs(w[1].daily[2] / 1000 - 3) < 1e-6, '요일별 배분 — 수요일 3km');
  check(Math.abs(w[1].daily[1] / 1000 - 2) < 1e-6, '요일별 배분 — 화요일 2km');

  // 연속 기록: 진행 중인 이번 주는 목표를 채웠을 때만 센다.
  // 수요일에 "연속 0주"라고 겁주지 않기 위한 규칙이다.
  const goal = 20;
  const full = (weekOffset: number) => day(weekOffset * 7 + 1, goal);
  check(weekStreak([full(1), full(2), full(3)], goal, NOW) === 3,
    '지난 3주 달성 → 연속 3주 (이번 주는 아직 진행 중이라 안 센다)');
  check(weekStreak([full(1), full(3)], goal, NOW) === 1,
    '중간에 거른 주가 있으면 거기서 끊긴다');
  check(weekStreak([day(0, goal), full(1)], goal, NOW) === 2,
    '이번 주를 이미 채웠으면 거기에 더한다');
  check(weekStreak([day(0, 1), full(1)], goal, NOW) === 1,
    '이번 주가 모자라도 지난주까지의 연속은 살아 있다');

  // 적응형 난이도 — 기록이 난이도를 만든다 (Training §3)
  const fallback = 16;
  check(adaptiveChaseKmh([], fallback, undefined, NOW) === fallback,
    '기록이 없으면 설정값을 그대로 쓴다');

  const steady = [day(1, 10), day(8, 10), day(15, 10)]; // 전부 10km/h
  const avg = recentAvgKmh(steady, ADAPTIVE.weeks, NOW);
  check(Math.abs(avg - 10) < 0.01, `최근 4주 평균 10km/h (${avg.toFixed(2)})`);
  const target = adaptiveChaseKmh(steady, fallback, undefined, NOW);
  check(Math.abs(target - 10 * ADAPTIVE.multiplier) < 0.05,
    `내 평균 × ${ADAPTIVE.multiplier} = ${target}km/h`);

  // 주당 변화폭은 ±5%로 묶는다 — 갑자기 빨라지거나 느려지지 않게
  const capped = adaptiveChaseKmh(steady, fallback, 10, NOW);
  check(capped <= 10 * (1 + ADAPTIVE.maxStepPct) + 1e-6,
    `한 주에 ${Math.round(ADAPTIVE.maxStepPct * 100)}% 넘게 오르지 않는다 (10 → ${capped})`);
  // day() 헬퍼는 언제나 10km/h라 느린 사람을 만들려면 시간을 직접 늘려야 한다
  const slowRun = day(1, 3);
  slowRun.durationSec = (3 / 4) * 3600;   // 4km/h — 빠르게 걷는 정도
  const floored = adaptiveChaseKmh([slowRun], fallback, undefined, NOW);
  check(floored >= ADAPTIVE.floorKmh,
    `아무리 느려도 하한 ${ADAPTIVE.floorKmh}km/h 아래로 안 간다 (${floored})`);
  // 하한이 느린 사람을 벌주면 안 된다 — "복귀가 무섭지 않다"가 설계 의도다.
  // 4km/h(빠른 걷기)로 달려도 좀비가 내 속도의 1.5배를 넘지 않아야 한다.
  const walkPace = day(1, 3);
  walkPace.durationSec = (3 / 4) * 3600;            // 4km/h
  const forWalker = adaptiveChaseKmh([walkPace], fallback, undefined, NOW);
  check(forWalker <= 4 * 1.5,
    `느린 사용자에게 과한 좀비를 붙이지 않는다 (4km/h → ${forWalker}km/h, 내 속도의 ${(forWalker / 4).toFixed(2)}배)`);

  // 개인 기록 — 1km 기록만 "작을수록 좋다"
  const a = day(1, 5); a.splits = [{ km: 1, sec: 300, chasedSec: 0 }];
  const b = day(2, 3); b.splits = [{ km: 1, sec: 278, chasedSec: 10 }];
  const pb = personalBests([a, b]);
  check(pb.fastestKmSec?.value === 278, `1km 최고는 가장 짧은 시간 (${pb.fastestKmSec?.value}초)`);
  check(pb.longestRunM?.value === 5000, '가장 멀리 달린 런은 가장 긴 거리');
}

// ── AR 카메라 흔들림: 자이로 데드밴드 + 저역 필터 ──────────────
//
//  폰을 고정해도 DeviceMotion.rotation.alpha 가 0.3° 안팎으로 떤다.
//  예전에는 그 변화량을 그대로 방위에 더해서 화면 전체가 흔들렸다
//  (계측: 프레임당 22px, 초당 17회 방향 전환. AR에서 1° = 가로 38px).
//  여기서는 실제 설정값으로 두 가지를 확인한다.
//   ① 고정된 폰에서 흔들림이 충분히 작은가
//   ② 데드밴드가 진짜 회전을 먹어버리지는 않는가
{
  const DEG = 180 / Math.PI;
  const SENSOR_HZ = 20, RENDER_HZ = 60, SECONDS = 20;
  const opts = {
    compassTrust: Config.arCompassTrust,
    deadband: (Config.arHeadingDeadbandDeg * Math.PI) / 180,
    gyroSign: Config.arGyroYawSign,
    fallbackSmooth: Config.arSensorSmoothing,
    gyroDeadband: (Config.arGyroDeadbandDeg * Math.PI) / 180,
    gyroSmooth: Config.arGyroSmoothing,
  };

  // 재현 가능한 잡음
  let seed = 12345;
  const rnd = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  const gauss = (sigma: number) => {
    const u = Math.max(1e-9, rnd()), v = rnd();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) * sigma;
  };

  /** @param turnRate 실제 회전 속도(도/s) */
  const measure = (turnRate: number) => {
    seed = 12345;
    const f = new HeadingFilter(opts);
    const dt = 1 / RENDER_HZ, sensorDt = 1 / SENSOR_HZ;
    let acc = 0, time = 0, last = 0;
    const steps: number[] = [];
    f.setCompass(0); f.setGyro(0); f.update(dt);
    for (let i = 0; i < SECONDS * RENDER_HZ; i++) {
      time += dt;
      const truth = (turnRate / DEG) * time;
      acc += dt;
      if (acc >= sensorDt) {
        acc -= sensorDt;
        // W3C alpha는 나침반과 반대로 증가한다 (gyroSign이 그 부호다)
        f.setGyro(opts.gyroSign * truth + gauss(0.3) / DEG);
        f.setCompass(truth + gauss(3) / DEG);
      }
      const out = f.update(dt);
      if (i > RENDER_HZ) steps.push(Math.abs((out - last) * DEG));
      last = out;
    }
    const sorted = [...steps].sort((a, b) => a - b);
    return { p95: sorted[(sorted.length * 0.95) | 0], end: last * DEG };
  };

  const still = measure(0);
  const px = still.p95 * ((390 * 3) / (2 * Math.atan(Math.tan(31 / DEG) * (390 / 844)) * DEG));
  console.log(`  고정된 폰: 프레임당 ${still.p95.toFixed(3)}° (화면 ${px.toFixed(1)}px)`);
  check(px < 6, `고정 시 카메라 흔들림 억제 (${px.toFixed(1)}px < 6px)`);

  // 데드밴드는 회전을 늦출 뿐 잃어버리면 안 된다.
  // 30°/s로 20초 = 600°. 유격(0.5°)과 필터 지연만큼만 모자라야 한다.
  const turn = measure(30);
  const lost = 600 - turn.end;
  console.log(`  30°/s 20초 회전: 실제 600° → 출력 ${turn.end.toFixed(1)}° (부족 ${lost.toFixed(2)}°)`);
  check(Math.abs(lost) < 3, `데드밴드가 회전량을 먹지 않음 (부족 ${lost.toFixed(2)}° < 3°)`);
}


// ── 안전 구역 / 비안전 구역 ────────────────────────────────────
//
//  건물이 처음으로 게임 로직이 된 자리다. 지금까지는 렌더 대상일 뿐이었다.
{
  const sq = (cx: number, cy: number, r: number): Vec2[] => [
    v(cx - r, cy - r), v(cx + r, cy - r), v(cx + r, cy + r), v(cx - r, cy + r),
  ];

  // 점-다각형: 볼록/오목 둘 다
  check(pointInPolygon(v(0, 0), sq(0, 0, 10)), '사각형 안의 점');
  check(!pointInPolygon(v(11, 0), sq(0, 0, 10)), '사각형 밖의 점');
  check(!pointInPolygon(v(0, 40), sq(0, 0, 10)), '한참 밖의 점');
  // ㄷ자 — 오목 다각형의 파인 부분은 바깥이다 (반직선 교차가 맞게 도는지)
  const uShape: Vec2[] = [
    v(0, 0), v(30, 0), v(30, 30), v(20, 30), v(20, 10), v(10, 10), v(10, 30), v(0, 30),
  ];
  check(pointInPolygon(v(5, 20), uShape), 'ㄷ자 왼쪽 기둥 안');
  check(!pointInPolygon(v(15, 20), uShape), 'ㄷ자 파인 곳은 바깥');

  // 안전 판정은 결정론적이다 — 같은 건물은 언제 물어도 같은 답
  const at = { lat: 37.5266, lon: 126.9244 };
  const once = isSafeAt(at, 0.15);
  let stable = true;
  for (let i = 0; i < 50; i++) if (isSafeAt(at, 0.15) !== once) stable = false;
  check(stable, '같은 좌표는 언제나 같은 판정');

  // 비율이 대략 맞는가 — 1,000개를 흩뿌려 센다
  let safeN = 0;
  for (let i = 0; i < 1000; i++)
    if (isSafeAt({ lat: 37.5 + i * 0.0007, lon: 126.9 + (i % 37) * 0.0011 }, 0.15)) safeN++;
  console.log(`  안전 구역 비율: 1000개 중 ${safeN}개 (목표 150)`);
  check(safeN > 105 && safeN < 200, `안전 비율이 설정값 근처 (${safeN}/1000, 목표 150)`);
  check(!isSafeAt(at, 0), '비율 0이면 안전 구역이 없다');
  check(isSafeAt(at, 1), '비율 1이면 전부 안전 구역');

  // 색인: 건물을 실제로 찾아내는가
  const origin = { lat: 37.5266, lon: 126.9244 };
  const polys = [sq(0, 0, 10), sq(100, 0, 10), sq(0, 100, 10), sq(-250, 300, 15)];
  const idx = new ZoneIndex(polys, origin, 1, 60);   // 전부 안전으로
  check(idx.buildingAt(v(0, 0)) === 0, '색인: 첫 건물 안');
  check(idx.buildingAt(v(100, 0)) === 1, '색인: 격자 칸이 다른 건물 안');
  check(idx.buildingAt(v(-250, 300)) === 3, '색인: 멀리 떨어진 건물 안');
  check(idx.buildingAt(v(50, 50)) === -1, '색인: 건물 사이 빈 곳');
  check(idx.buildingAt(v(9999, 9999)) === -1, '색인: 색인 범위 밖');
  check(idx.safeCount === 4, '색인: 비율 1이면 전부 안전');
  check(new ZoneIndex(polys, origin, 0, 60).safeCount === 0, '색인: 비율 0이면 전부 일반');

  // 같은 건물이라도 런의 원점이 다르면 ENU 좌표가 달라진다.
  // 그래도 안전 판정은 같아야 한다 — 해시를 위경도로 되돌려 하기 때문이다.
  // 원점을 동쪽으로 100m 옮기고, 건물 ENU 좌표도 같이 100m 밀어 본다.
  const origin2 = fromEnu(origin, v(100, 0));
  const shifted = polys.map(p => p.map(q => v(q.x - 100, q.y)));
  const idxA = new ZoneIndex(polys, origin, 0.5, 60);
  const idxB = new ZoneIndex(shifted, origin2, 0.5, 60);
  const sameAll = idxA.safe.every((s, i) => s === idxB.safe[i]);
  check(sameAll, '원점이 달라도 같은 건물은 같은 판정 (위경도 해시)');
}

// ── 좀비가 플레이어와 겹치지 않는다 ────────────────────────────
//
//  예전에는 좀비가 플레이어 좌표에 정확히 올라탈 수 있었다. 그러면
//  좀비→플레이어 방위가 정의되지 않아 AR이 카메라 원점에 그렸다
//  ("좀비가 내 밑에 있다"). 시뮬 차원에서 간격을 유지한다.
{
  const gsep = RoadGraph.build(generateTestGrid(600));
  const sim = new ZombieSimulation(gsep, 7);
  sim.constrainToRoad = false;   // 도로 클램프와 분리해서 간격만 본다
  sim.minPlayerSepM = 0.4;
  sim.detectRangeMult = 10;      // 곧장 추격에 들어가게

  const player = v(0, 0);
  const zs = [
    new Zombie(1, ZombieTypes[0], v(0, 0), 0),      // 완전히 겹친 상태로 시작
    new Zombie(2, ZombieTypes[1], v(0.05, 0), 0),   // 거의 겹침
    new Zombie(3, ZombieTypes[3], v(3, 0), 0),      // 달려와서 붙는다
  ];
  sim.zombies = zs;

  let minSeen = Infinity;
  for (let i = 0; i < 400; i++) {
    sim.tick(0.1, player, 0);
    for (const z of zs) minSeen = Math.min(minSeen, dist(z.pos, player));
  }
  console.log(`  400틱 중 최소 간격: ${minSeen.toFixed(3)}m (설정 0.4m)`);
  check(minSeen > 0.39, `좀비가 플레이어와 겹치지 않는다 (${minSeen.toFixed(3)}m ≥ 0.4m)`);

  // 간격이 공격 사거리보다 작아야 여전히 때릴 수 있다
  const sim2 = new ZombieSimulation(gsep, 7);
  sim2.constrainToRoad = false;
  sim2.minPlayerSepM = 0.4;
  sim2.attackRange = 0.5;
  sim2.detectRangeMult = 10;
  let hits = 0;
  sim2.onAttack = () => { hits++; };
  sim2.zombies = [new Zombie(1, ZombieTypes[0], v(2, 0), 0)];
  for (let i = 0; i < 300; i++) sim2.tick(0.1, player, 0);
  check(hits > 0, `간격을 두고도 공격은 닿는다 (${hits}회 타격)`);

  // 보호 중이면 사거리 안이어도 한 대도 못 때린다
  const sim3 = new ZombieSimulation(gsep, 7);
  sim3.constrainToRoad = false;
  sim3.minPlayerSepM = 0.4;
  sim3.attackRange = 0.5;
  sim3.detectRangeMult = 10;
  sim3.playerShielded = true;
  let blocked = 0;
  sim3.onAttack = () => { blocked++; };
  sim3.zombies = [new Zombie(1, ZombieTypes[0], v(2, 0), 0)];
  for (let i = 0; i < 300; i++) sim3.tick(0.1, player, 0);
  check(blocked === 0, `보호 구역 안에서는 공격이 닿지 않는다 (${blocked}회)`);
}

console.log(fail === 0 ? '\n=== 전체 통과 ===' : `\n=== 실패 ${fail}건 ===`);
process.exit(fail);
