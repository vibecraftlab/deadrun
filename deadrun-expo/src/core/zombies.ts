import { Vec2, dist, sub, norm, add, mul } from './geo';
import { RoadGraph } from './roadGraph';
import { findPath, toPolyline } from './astar';
import { Rules } from './rules';

/** 좀비 타입 정의 — GDD §4.2 수치 그대로 */
export interface ZombieTypeDef {
  name: string;
  speedKmh: number;
  wanderSpeedKmh: number;
  detectRange: number;
  /** 시야각(도, 전체 폭). 360이면 전방위 감지 */
  fovDeg: number;
  hp: number;
  attackDmg: number;   // 플레이어 타격 데미지
  stealth: boolean;         // 스토커: 레이더 깜빡임
  fatigueAfterSec: number;  // 러너: N초 후 지침 (0 = 없음)
  fatigueSpeedKmh: number;
  color: string;
}

// 시야각: 워커/브루트는 좁고, 러너는 넓다. 스토커는 GDD §4.2 "후방 감지 특화" → 전방위(360).
export const ZombieTypes: ZombieTypeDef[] = [
  { name: 'Walker',  speedKmh: 3,  wanderSpeedKmh: 3, detectRange: 40, fovDeg: 120, hp: 2, attackDmg: 10, stealth: false, fatigueAfterSec: 0,  fatigueSpeedKmh: 0, color: '#59bf59' },
  { name: 'Runner',  speedKmh: 12, wanderSpeedKmh: 3, detectRange: 60, fovDeg: 150, hp: 3, attackDmg: 8,  stealth: false, fatigueAfterSec: 45, fatigueSpeedKmh: 5, color: '#ff991a' },
  { name: 'Stalker', speedKmh: 7,  wanderSpeedKmh: 3, detectRange: 90, fovDeg: 360, hp: 2, attackDmg: 14, stealth: true,  fatigueAfterSec: 0,  fatigueSpeedKmh: 0, color: '#994dcc' },
  { name: 'Brute',   speedKmh: 5,  wanderSpeedKmh: 3, detectRange: 50, fovDeg: 100, hp: 8, attackDmg: 30, stealth: false, fatigueAfterSec: 0,  fatigueSpeedKmh: 0, color: '#b32020' },
];

export function rollType(rng: () => number): ZombieTypeDef {
  const r = rng();
  if (r < 0.6) return ZombieTypes[0];
  if (r < 0.8) return ZombieTypes[1];
  if (r < 0.95) return ZombieTypes[2];
  return ZombieTypes[3];
}

export type ZombieState = 'idle' | 'chase' | 'search' | 'stunned' | 'dead';

export class Zombie {
  /** 맞았지만 살아남은 횟수 — 늘어날 때마다 피격 모션을 한 번 재생한다 */
  hitSeq = 0;
  /** 죽은 뒤 경과 시간(초) — 쓰러지는 모션을 보여줄 동안만 화면에 남긴다 */
  deadSec = 0;
  id: number;
  type: ZombieTypeDef;
  pos: Vec2;
  homePos: Vec2;            // 자율 배회의 홈 구역 중심 (스폰 지점)
  state: ZombieState = 'idle';
  hp: number;
  layer: number;
  /** 바라보는 방향 (rad, 북 기준 시계방향) — 실제 이동 방향을 따라간다. 감지 판정의 기준 */
  facing = 0;

  path: Vec2[] | null = null;
  pathIdx = 0;
  repathTimer = 0;
  lastGoal: Vec2 = { x: 0, y: 0 };

  chaseClock = 0;
  deAggroTimer = 0;
  searchTimer = 0;
  searchCenter: Vec2 = { x: 0, y: 0 };
  attackTimer = 0;   // 공격 쿨다운
  stunTimer = 0;
  layerSnapTimer = 0;

  constructor(id: number, type: ZombieTypeDef, pos: Vec2, layer: number) {
    this.id = id;
    this.type = type;
    this.pos = pos;
    this.homePos = pos;
    this.layer = layer;
    this.hp = type.hp;
  }

  get isFatigued(): boolean {
    return this.type.fatigueAfterSec > 0 && this.chaseClock > this.type.fatigueAfterSec;
  }

  get currentSpeedMs(): number {
    if (this.state === 'chase')
      return (this.isFatigued ? this.type.fatigueSpeedKmh : this.type.speedKmh) / 3.6;
    return this.type.wanderSpeedKmh / 3.6;
  }

  get pathFinished(): boolean {
    return !this.path || this.pathIdx >= this.path.length;
  }

  clearPath() { this.path = null; this.pathIdx = 0; }

  /** 이동한 방향으로 시선을 돌린다 (제자리면 이전 방향 유지) */
  faceTowards(from: Vec2, to: Vec2) {
    const dx = to.x - from.x, dy = to.y - from.y;
    if (Math.abs(dx) > 1e-4 || Math.abs(dy) > 1e-4) this.facing = Math.atan2(dx, dy);
  }

  moveAlongPath(d: number) {
    const startPos = this.pos;
    while (d > 0 && !this.pathFinished) {
      const target = this.path![this.pathIdx];
      const segLen = dist(this.pos, target);
      if (segLen < 1e-6) { this.pathIdx++; continue; }
      if (d >= segLen) {
        this.pos = target;
        d -= segLen;
        this.pathIdx++;
      } else {
        this.pos = add(this.pos, mul(norm(sub(target, this.pos)), d));
        d = 0;
      }
    }
    this.faceTowards(startPos, this.pos);
  }
}

/** 좀비 전체 시뮬레이션 — 상태기계는 GDD §4.3 (Unity 프로토타입과 동일 로직) */
export class ZombieSimulation {
  zombies: Zombie[] = [];
  graph: RoadGraph;
  playerInvulnTimer = 0;
  /**
   * 타입별 속도(km/h)를 .env에서 직접 지정한다. 배수 방식은 폐기.
   * 키는 타입 이름(Walker/Runner/Stalker/Brute).
   */
  chaseSpeedKmh: Record<string, number> = {};
  wanderSpeedKmh: Record<string, number> = {};
  /** 좀비를 도로 폭 안으로 제한 (건물 안으로 들어가지 않게) */
  roadHalfWidthM = 5;
  constrainToRoad = true;
  /** 공격 사거리(m) — .env EXPO_PUBLIC_ATTACK_RANGE_M */
  attackRange: number = Rules.attackRange;
  /** 동시 추격 상한 — 초과분은 감지해도 추격에 들어가지 못한다 */
  maxChasers: number = Rules.maxChasers;
  /** 집요한 추격: 한 번 감지하면 거리를 벌려도 추격을 포기하지 않는다 */
  relentless = false;
  /**
   * 감지 범위 배수 — 타입별 기본 감지범위(워커 40 / 러너 60 / 스토커 90 / 브루트 50m)는
   * 레이더 표시 범위(150m)보다 훨씬 짧다. 그래서 지도에 보이는 좀비 대부분이 아직
   * 플레이어를 못 본 상태로 배회한다. 이 배수를 올리면 "보이는 좀비 = 쫓아오는 좀비"가 된다.
   */
  detectRangeMult = 1;
  /** 감지 반경 상한(m) — 배수를 적용한 뒤 이 값으로 자른다. 어떤 좀비도 이보다 멀리 못 본다 */
  detectRangeMaxM = 999;
  /** 시야각 판정 사용 여부 (끄면 전방위 감지) */
  useFov = true;
  /**
   * 근접 무조건 감지 거리(m). 이 안에 들어오면 좀비가 어느 쪽을 보고 있든 발견한다.
   * 시야각만으로 판정하면 배회하는 좀비의 시선과 내 위치가 맞아떨어지는 순간이 드물어
   * "코앞인데도 못 본 채 지나가는" 상황이 생긴다(계측: 150초에 감지 4회).
   */
  detectAlwaysM = 20;
  /**
   * 시야 차단 판정. 켜면 좀비와 플레이어 사이 직선이 도로를 벗어날 때 감지되지 않는다.
   * 도로 외 영역이 건물인 세계(합성 지도)에서는 이게 논리적으로 맞고,
   * 부작용으로 "감지 = 직선이 뚫려 있음"이 보장되어 좀비가 뒤로 돌아갈 이유가 사라진다.
   */
  useLineOfSight = true;
  /** 시야로 인정할 도로 중심선 이탈 허용 폭(m) */
  losCorridorM = 8;
  /**
   * 이탈 거리(m). 추격 중 이 거리를 넘어 3초 유지하면 놓친다.
   * 0이면 "자신의 인지 범위를 벗어나면 놓친다"는 뜻이 되어 좀비마다 값이 달라진다.
   */
  escapeDistance = 0;

  /**
   * 감지 판정: ① 같은 레이어 ② 감지 반경 안 ③ 시야각 안.
   * 한 번 추격에 들어가면 시야각은 더 보지 않는다(이미 위치를 알고 쫓는 중) —
   * 이탈은 오직 거리(escapeDistance)로만 결정된다.
   */
  /** 실제 적용할 추격 속도(m/s) — .env 지정값 우선, 없으면 타입 기본값. 러너 지침 반영 */
  chaseSpeedMs(z: Zombie): number {
    const base = this.chaseSpeedKmh[z.type.name] ?? z.type.speedKmh;
    if (z.type.fatigueAfterSec > 0 && z.chaseClock > z.type.fatigueAfterSec)
      return (z.type.fatigueSpeedKmh / z.type.speedKmh) * base / 3.6; // 지침 비율 유지
    return base / 3.6;
  }

  /** 실제 적용할 배회 속도(m/s) */
  wanderSpeedMs(z: Zombie): number {
    return (this.wanderSpeedKmh[z.type.name] ?? z.type.wanderSpeedKmh) / 3.6;
  }

  /** 좀비 위치를 도로 폭 안으로 제한 */
  private clampZombie(z: Zombie) {
    if (!this.constrainToRoad) return;
    const c = this.graph.clampToRoad(z.pos, this.roadHalfWidthM);
    if (c) z.pos = c;
  }

  /** 실제 적용되는 감지 반경(m) — 타입 기본값 × 배수, 상한으로 절단 */
  detectRangeOf(type: ZombieTypeDef): number {
    return Math.min(type.detectRange * this.detectRangeMult, this.detectRangeMaxM);
  }

  canDetect(z: Zombie, playerPos: Vec2, d: number, layerMatch: boolean): boolean {
    if (!layerMatch) return false;
    if (d > this.detectRangeOf(z.type)) return false;
    if (d <= 3) return true; // 몸이 닿을 거리면 무조건

    // 시야 차단: 사이에 건물(도로 밖 영역)이 있으면 보이지 않는다.
    // 이 검사를 통과했다는 것은 곧 "직선으로 갈 수 있다"는 뜻이기도 하다.
    if (this.useLineOfSight
        && !this.graph.hasLineOfSight(z.pos, playerPos, this.losCorridorM)) return false;

    if (!this.useFov || z.type.fovDeg >= 360) return true;
    if (d <= this.detectAlwaysM) return true; // 가까우면 방향 무관하게 알아챈다
    const bearing = Math.atan2(playerPos.x - z.pos.x, playerPos.y - z.pos.y);
    const relDeg = Math.abs((((bearing - z.facing) * 180) / Math.PI + 540) % 360 - 180);
    return relDeg <= z.type.fovDeg / 2;
  }

  onKilled: ((z: Zombie) => void) | null = null;
  /** 좀비가 플레이어를 감지해 추격을 시작한 순간 (알림/진동용) */
  onDetect: ((z: Zombie) => void) | null = null;
  /** 좀비가 근접 범위에서 플레이어를 타격한 순간 (데미지/화면 플래시용) */
  onAttack: ((z: Zombie) => void) | null = null;

  private rng: () => number;
  private nextId = 0;

  constructor(graph: RoadGraph, seed = 0) {
    this.graph = graph;
    // 간단한 시드 가능 PRNG (mulberry32)
    let s = seed || (Date.now() & 0xffffffff);
    this.rng = () => {
      s |= 0; s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  spawnInitial(count: number, playerPos: Vec2) {
    let attempts = 0;
    while (this.zombies.length < count && attempts++ < count * 20) {
      const sp = this.graph.randomSpawnPoint(this.rng);
      if (!sp) break;
      const d = dist(sp.pos, playerPos);
      if (d < Rules.minSpawnDistFromPlayer) continue;
      const type = rollType(this.rng);
      // 자기 감지 반경 안에 스폰하면 시작하자마자 감지 알림이 터진다.
      // (스토커는 전방위 360°라 방향과 무관하게 즉시 발견) → 반경 밖에만 배치.
      if (d <= this.detectRangeOf(type) * 1.1) continue;
      if (d < Rules.radarRange && this.rng() < 0.5) continue; // 레이더 밖 우선
      this.zombies.push(new Zombie(this.nextId++, type, sp.pos, this.graph.edges[sp.edgeIdx].layer));
    }
  }

  /**
   * 테스트 스폰: 플레이어 주변에 정확히 count 마리를 배치하고 전부 플레이어를 보게 한다.
   * 실외 GPS 테스트에서 "몇 마리가 나한테 다가오는지"만 보고 싶을 때 쓴다.
   * 도로 위 지점 중 목표 거리에 가장 가까운 곳을 고르고, 방위는 고르게 분산시킨다.
   */
  spawnNearPlayer(count: number, playerPos: Vec2, distanceM: number) {
    for (let i = 0; i < count; i++) {
      // 마리수만큼 방위를 균등 분할 (사방에서 다가오도록)
      const bearing = (i / count) * Math.PI * 2 + this.rng() * 0.4;
      const type = rollType(this.rng);
      // 타입마다 감지 반경이 다르다(워커 40m). 요청 거리가 그보다 멀면
      // 자기 시야 밖에 놓이게 되어 영영 나를 못 본다 → 반경 안쪽으로 당긴다.
      const d = Math.min(distanceM, this.detectRangeOf(type) * 0.7);
      const ideal = {
        x: playerPos.x + Math.sin(bearing) * d,
        y: playerPos.y + Math.cos(bearing) * d,
      };
      // 그 방향에서 가장 가까운 도로 위 지점
      const snap = this.graph.snapToEdge(ideal, d * 0.6)
        ?? this.graph.snapToEdge(ideal, d * 1.5);
      const pos = snap ? snap.snapped : ideal;
      const layer = snap ? this.graph.edges[snap.edgeIdx].layer : 0;
      const z = new Zombie(this.nextId++, type, pos, layer);
      // 플레이어를 바라보게 해서 시야각 판정을 바로 통과시킨다
      z.facing = Math.atan2(playerPos.x - pos.x, playerPos.y - pos.y);
      this.zombies.push(z);
    }
  }

  tick(dt: number, playerPos: Vec2, playerLayer: number) {
    if (this.playerInvulnTimer > 0) this.playerInvulnTimer -= dt;

    let chasers = 0;
    for (const z of this.zombies)
      if (z.state === 'chase') chasers++;

    for (const z of this.zombies) {
      if (z.state === 'dead') { z.deadSec += dt; continue; }

      const d = dist(z.pos, playerPos);
      const layerMatch = z.layer === playerLayer;

      z.layerSnapTimer -= dt;
      if (z.layerSnapTimer <= 0) {
        z.layerSnapTimer = 1 + this.rng() * 0.5;
        const snap = this.graph.snapToEdge(z.pos, 15);
        if (snap) z.layer = this.graph.edges[snap.edgeIdx].layer;
      }

      switch (z.state) {
        case 'stunned':
          z.stunTimer -= dt;
          if (z.stunTimer <= 0) z.state = 'chase';
          break;

        case 'idle':
        case 'search': {
          if (this.canDetect(z, playerPos, d, layerMatch) && chasers < this.maxChasers) {
            z.state = 'chase';
            z.chaseClock = 0;
            z.deAggroTimer = 0;
            z.clearPath();
            chasers++;
            this.onDetect?.(z);
            break;
          }
          if (z.state === 'search') {
            z.searchTimer -= dt;
            if (z.searchTimer <= 0) { z.state = 'idle'; z.clearPath(); }
          }
          this.tickWander(z, dt);
          break;
        }

        case 'chase': {
          z.chaseClock += dt;
          this.tickChase(z, dt, playerPos, d);

          // 이탈은 오직 거리로 판정한다. 감지 후에는 시야각과 무관하게 계속 쫓아오고,
          // 이탈 거리를 넘어 3초 유지해야 놓친다 (GPS 노이즈로 깜빡이지 않도록 유예).
          const escapeAt = this.escapeDistance > 0
            ? this.escapeDistance
            : this.detectRangeOf(z.type); // 0 = 자신의 인지 범위를 벗어나면 놓침
          if (!this.relentless && d > escapeAt) {
            z.deAggroTimer += dt;
            if (z.deAggroTimer >= 3) {
              z.state = 'search';
              z.searchTimer = Rules.searchDurationSec;
              z.searchCenter = playerPos;
              z.clearPath();
              z.attackTimer = 0;
              break;
            }
          } else z.deAggroTimer = 0;

          // 근접 공격: 사거리 내에서 쿨다운마다 타격 (붙잡기/QTE 대체)
          if (layerMatch && d <= this.attackRange) {
            z.attackTimer -= dt;
            if (z.attackTimer <= 0) {
              z.attackTimer = Rules.attackCooldownSec;
              this.onAttack?.(z);
            }
          } else {
            z.attackTimer = Math.min(z.attackTimer, 0.4); // 범위 이탈 시 첫 타격 딜레이만 유지
          }
          break;
        }
      }
    }
  }

  /**
   * A*는 `nearestNode(z.pos)`에서 출발하는데, 그 노드가 좀비 **뒤쪽**일 수 있다.
   * 그대로 두면 좀비가 먼저 뒤로 걸어갔다가 방향을 튼다. 플레이어가 달리는 동안에는
   * 경로 재계산이 잦아 이 되돌아가기가 누적돼 추격이 사실상 정지한다(계측: 34m→163m).
   * 이미 지나친 첫 웨이포인트는 건너뛴다.
   */
  private trimLeadingWaypoint(z: Zombie) {
    const p = z.path;
    if (!p || p.length < 2) return;
    if (dist(z.pos, p[1]) < dist(p[0], p[1])) z.pathIdx = 1;
  }

  /**
   * 경로 끝단 오버슈트 제거.
   *
   * A*는 교차점(노드) 단위로만 경로를 낸다. 플레이어가 두 교차점 사이에 서 있으면
   * 경로는 플레이어를 **지나쳐** 다음 교차점까지 갔다가 되돌아오는 모양이 된다.
   * 그래서 추격 중인 좀비가 눈앞에서 방향을 틀어 딴 데로 걸어가는 것처럼 보인다.
   * (계측: 추격 시간의 33%를 멀어지는 데 소비, 한 번에 64m 후퇴)
   *
   * 폴리라인 각 구간에 플레이어를 투영해 가장 가까운 구간을 찾고, 그 지점에서 경로를 끝낸다.
   */
  private truncateAtPlayer(nodePath: Vec2[], playerPos: Vec2): Vec2[] {
    if (nodePath.length < 2) return [...nodePath, playerPos];
    let bestSeg = nodePath.length - 2;
    let bestD = Infinity;
    for (let i = 0; i < nodePath.length - 1; i++) {
      const a = nodePath[i], b = nodePath[i + 1];
      const abx = b.x - a.x, aby = b.y - a.y;
      const len2 = abx * abx + aby * aby;
      let t = len2 < 1e-9 ? 0 : ((playerPos.x - a.x) * abx + (playerPos.y - a.y) * aby) / len2;
      t = Math.max(0, Math.min(1, t));
      const px = a.x + abx * t, py = a.y + aby * t;
      const d = Math.hypot(playerPos.x - px, playerPos.y - py);
      if (d < bestD) { bestD = d; bestSeg = i; }
    }
    // 가장 가까운 구간의 시작 노드까지만 남기고, 마지막은 플레이어 위치로 직행
    return [...nodePath.slice(0, bestSeg + 1), playerPos];
  }

  private tickChase(z: Zombie, dt: number, playerPos: Vec2, d: number) {
    z.repathTimer -= dt;
    const goalMoved = dist(z.lastGoal, playerPos) > 20;
    // 플레이어가 달리면 경로가 금방 낡는다 → 재계산 주기를 짧게 (1.5~2.5초).
    // 목표가 20m 넘게 움직였으면 경로가 안 끝났어도 즉시 다시 잡는다.
    if (!z.path || z.repathTimer <= 0 || goalMoved) {
      z.repathTimer = 1.5 + this.rng();
      const start = this.graph.nearestNode(z.pos, 40);
      const goal = this.graph.nearestNode(playerPos, 40);
      const nodePath = toPolyline(this.graph, findPath(this.graph, start, goal));
      z.path = nodePath ? this.truncateAtPlayer(nodePath, playerPos) : null;
      z.pathIdx = 0;
      this.trimLeadingWaypoint(z);
      z.lastGoal = playerPos;
    }
    const speed = this.chaseSpeedMs(z);
    if (z.path && !z.pathFinished) z.moveAlongPath(speed * dt);
    else if (d > Rules.attackStandoff) {
      // 경로가 없거나(연결 안 된 그래프) 경로를 다 쓴 경우 — 직선으로 접근
      const before = z.pos;
      z.pos = add(z.pos, mul(norm(sub(playerPos, z.pos)),
        Math.min(speed * dt, d - Rules.attackStandoff)));
      z.faceTowards(before, z.pos);
    } else {
      z.faceTowards(z.pos, playerPos); // 붙어 서 있을 때도 플레이어를 응시
    }

    // 경로 종점이 플레이어 위치라 그대로 두면 겹쳐 선다 → 최소 간격 유지
    const dNow = dist(z.pos, playerPos);
    if (dNow < Rules.attackStandoff && dNow > 1e-3)
      z.pos = add(playerPos, mul(norm(sub(z.pos, playerPos)), Rules.attackStandoff));

    this.clampZombie(z); // 건물 안으로 들어가지 않게
  }

  private tickWander(z: Zombie, dt: number) {
    if (z.pathFinished) {
      // idle은 홈 구역(스폰 지점 반경 150m) 안에서만 자율 배회 — 구역을 벗어나 흩어지지 않음
      const center = z.state === 'search' ? z.searchCenter : z.homePos;
      const target = this.pickWanderTarget(center, z.state === 'search' ? 80 : 150);
      const start = this.graph.nearestNode(z.pos, 40);
      const goal = this.graph.nearestNode(target, 60);
      z.path = toPolyline(this.graph, findPath(this.graph, start, goal));
      z.pathIdx = 0;
      if (!z.path) return;
      this.trimLeadingWaypoint(z);
    }
    z.moveAlongPath(this.wanderSpeedMs(z) * dt);
    this.clampZombie(z);
  }

  private pickWanderTarget(center: Vec2, range: number): Vec2 {
    for (let i = 0; i < 10; i++) {
      const sp = this.graph.randomSpawnPoint(this.rng);
      if (!sp) break;
      if (dist(sp.pos, center) <= range) return sp.pos;
    }
    const ang = this.rng() * Math.PI * 2;
    return add(center, mul({ x: Math.cos(ang), y: Math.sin(ang) }, range * 0.5));
  }

  /** 소음 (총성/스캔): 반경 내 비추격 좀비가 조사하러 이동 (FR-307) */
  emitNoise(pos: Vec2, radius: number) {
    for (const z of this.zombies) {
      if (z.state !== 'idle' && z.state !== 'search') continue;
      if (dist(z.pos, pos) > radius) continue;
      z.state = 'search';
      z.searchTimer = Rules.searchDurationSec;
      z.searchCenter = pos;
      z.clearPath();
    }
  }

  damage(z: Zombie, dmg: number): boolean {
    if (z.state === 'dead') return false;
    z.hp -= dmg;
    if (z.hp <= 0) {
      z.state = 'dead';
      z.deadSec = 0;
      this.onKilled?.(z);
      return true;
    }
    z.hitSeq++; // 살아남음 → 움찔하는 모션
    return false;
  }

  countAlive(): number {
    return this.zombies.filter(z => z.state !== 'dead').length;
  }

  countChasing(): number {
    return this.zombies.filter(z => z.state === 'chase').length;
  }
}
