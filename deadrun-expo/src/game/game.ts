import { Vec2, LatLon, dist, sub } from '../core/geo';
import { RoadGraph, RoadWay } from '../core/roadGraph';
import { ZombieSimulation, Zombie } from '../core/zombies';
import { LocationFilter, FilteredPose } from '../core/locationFilter';
import { Rules } from '../core/rules';
import { Config } from '../config';
import { generateSyntheticMap } from '../core/syntheticMap';
import { fetchRoads, fetchBuildings } from '../services/overpass';
import { loadMapPack } from '../services/mapPack';
import { LocationSource, GpsSource } from '../services/locationSource';

export type GameState = 'idle' | 'loading' | 'playing' | 'dead';
export type ThreatLevel = 'none' | 'alert' | 'chased' | 'imminent';

export interface GameConfig {
  center: LatLon;          // 지도 중심 (GPS 모드에선 현재 위치로 대체)
  radiusMeters: number;
  useOverpass: boolean;
  zombiesPerSqKm: number;
  maxZombies: number;
  playerName: string;      // 감지 알림에 표시되는 사용자 이름
  /** 테스트 스폰: 켜면 필드 전체 스폰 대신 내 주변에 몇 마리만 배치한다 */
  testMode: boolean;
  testZombieCount: number;
  testSpawnDistanceM: number;
  chaseSpeedKmh: Record<string, number>;   // 타입별 추격 속도 (.env)
  wanderSpeedKmh: Record<string, number>;  // 타입별 배회 속도 (.env)
  roadHalfWidthM: number;                  // 도로 폭 절반 (.env)
  constrainToRoad: boolean;                // 도로 밖 이동 제한 (.env)
  godMode: boolean;              // 무적 모드 (.env)
  attackRangeM: number;          // 좀비 공격 사거리 (.env)
  maxChasers: number;            // 동시 추격 상한 (.env)
  relentlessChase: boolean;      // 감지 후 포기하지 않음 (.env)
  detectRangeMult: number;       // 감지 범위 배수 (.env)
  detectRangeMaxM: number;       // 감지 반경 상한 m (.env)
  useFov: boolean;               // 시야각 기반 감지 (.env)
  detectAlwaysM: number;         // 근접 무조건 감지 거리 (.env)
  useLineOfSight: boolean;       // 시야 차단 (.env)
  losCorridorM: number;          // 시야 인정 도로 폭 (.env)
  renderSmoothing: number;       // 렌더 보간 강도 (.env)
  escapeDistanceM: number;       // 추격 이탈 거리 (.env)
}

export interface ZombieView {
  id: number;
  x: number;
  y: number;
  state: string;
  color: string;
  stealth: boolean;
  layer: number;
  name: string;
  hp: number;
  maxHp: number;
  distM: number;
  pathIdx: number;
  hitSeq: number;   // 피격 모션 트리거 (값이 바뀌면 한 번 재생)
  deadSec: number;  // 죽은 뒤 경과 시간 (0이면 살아 있음)
  heading: number;  // 바라보는 방향 (rad, 북 기준 시계방향)
  fovDeg: number;   // 시야각 (360 = 전방위)
  detectR: number;  // 실제 적용된 감지 반경(m)
}

/** 로딩 화면 한 줄 */
export interface LoadStep {
  key: string;
  label: string;
  /** 실제 수치 — 끝난 뒤에만 채운다 */
  detail: string;
  state: 'pending' | 'active' | 'done';
}

export interface Snapshot {
  state: GameState;
  loadStatus: string;
  loadPercent: number;
  loadSteps: LoadStep[];
  mapSource: string;
  pose: FilteredPose;
  ammo: number;
  kills: number;
  /** 종류별 처치 수 — 런 결과 화면의 처치 내역 */
  killsByType: Record<string, number>;
  /** 거리 적립으로 받은 보급 횟수 */
  supplies: number;
  distanceM: number;
  sessionSec: number;
  alive: number;
  chasing: number;
  nearestChaserM: number;
  threat: ThreatLevel;
  scanCooldown: number;
  scanRevealActive: boolean;
  invulnSec: number;
  hp: number;
  maxHp: number;
  godMode: boolean;
  deathCause: string;
  zombies: ZombieView[];
  rawEnu: Vec2 | null;
  /** 화면 표시용 보간 위치 (지도 카메라·플레이어 마커) */
  renderPos: Vec2;
  buildingsVersion: number;  // 건물 로드 완료 시 증가
}

/** 게임 오케스트레이션 (React 비의존 뮤터블 코어). Unity의 GameBootstrap 대응 */
export class Game {
  state: GameState = 'idle';
  loadStatus = '';
  /** 리소스 내려받기 진행률 0~100. -1이면 진행률을 알 수 없는 구간 */
  loadPercent = -1;
  /**
   * 로딩 화면 체크리스트 (design/v2 Loading).
   * 진행 중인 항목만 active, 끝난 것은 done. 아직 없는 시스템은 계속 pending으로 둔다.
   */
  loadSteps: LoadStep[] = [];
  mapSource = '';
  graph: RoadGraph | null = null;

  private sim: ZombieSimulation | null = null;
  private filter: LocationFilter | null = null;
  private source: LocationSource | null = null;
  private pose: FilteredPose = {
    posFiltered: { x: 0, y: 0 }, posSnapped: { x: 0, y: 0 },
    snapped: false, layer: 0, speedKmh: 0, vehicleSuspect: false, locked: false,
  };
  private lastSampleTime = -Infinity;
  /**
   * 화면 표시 전용 위치 — 필터 출력을 지수 보간으로 따라간다.
   * 1Hz 측정 보정이 들어올 때의 계단식 점프를 렌더에서만 흡수하고,
   * 좀비 감지·공격 판정은 그대로 pose.posSnapped(필터 출력)를 쓴다.
   */
  private renderPos: Vec2 = { x: 0, y: 0 };
  /** 건물 외곽선 (표시 전용). 게임 시작 뒤 백그라운드로 채워진다 */
  buildings: Vec2[][] = [];
  /** 건물이 새로 들어왔을 때만 올라간다 — 지도 레이어 재렌더 트리거 */
  buildingsVersion = 0;
  /** OSM 실데이터를 쓰는 중인지 — 저작자 표시(ODbL) 노출 조건 */
  usingOsm = false;
  private renderInit = false;
  /** 시뮬 틱 카운터 — 렌더 전용 프레임에서는 좀비 뷰 배열을 재사용해 재렌더를 막는다 */
  /** 렌더 보간 강도 — 낮을수록 부드럽고 반응이 느리다 (.env) */
  private renderSmoothing = 8;
  private simVersion = 0;
  private zombieViewCache: ZombieView[] = [];
  private zombieViewVersion = -1;

  private ammo: number = Rules.ammoStart;
  private kills = 0;
  private killsByType: Record<string, number> = {};
  private distanceM = 0;
  private supplyAcc = 0;
  private supplies = 0;
  private sessionSec = 0;
  private hp: number = Rules.playerMaxHp;
  private godMode = false;
  private scanCooldown = 0;
  private scanReveal = 0;
  private gunCd = 0;

  private deathCause = '';

  onThreatChange: ((level: ThreatLevel) => void) | null = null;
  onSupply: (() => void) | null = null;
  /** 감지 알림 등 토스트 메시지 (진동은 useGame에서) */
  onNotify: ((msg: string) => void) | null = null;
  /** 좀비에게 맞았을 때 (데미지, 좀비 이름) — 화면 붉은 플래시/진동용 */
  onPlayerHit: ((dmg: number, zombieName: string) => void) | null = null;
  /** 사격 연출용 — 발사할 때마다 명중 여부와 맞은 지점(ENU)을 알린다 */
  onShot: ((fx: { hit: boolean; x: number; y: number; name?: string }) => void) | null = null;
  private lastThreat: ThreatLevel = 'none';
  private playerName = '러너';

  /** 로딩 체크리스트 한 줄을 갱신한다 */
  private step(key: string, state: LoadStep['state'], detail = '') {
    const s = this.loadSteps.find(x => x.key === key);
    if (!s) return;
    s.state = state;
    if (detail) s.detail = detail;
    // 새 배열로 갈아끼워야 화면이 재렌더된다
    this.loadSteps = [...this.loadSteps];
  }

  async init(cfg: GameConfig): Promise<void> {
    this.state = 'loading';
    this.loadStatus = '위치 소스 준비 중...';
    this.loadSteps = [
      { key: 'gps', label: 'GPS 신호 잡기', detail: '', state: 'active' },
      { key: 'map', label: '지도 내려받기', detail: '', state: 'pending' },
      { key: 'graph', label: '도로 그래프 구축', detail: '', state: 'pending' },
      { key: 'spawn', label: '개체 배치', detail: '', state: 'pending' },
      // 보급 총기는 아직 없는 시스템 — 자리만 둔다 (design/v2 Loading)
      { key: 'supply', label: '보급 총기 배치', detail: '준비 중', state: 'pending' },
    ];

    // 위치는 언제나 실기기 GPS에서 받는다 (가상 이동 소스는 폐기)
    this.source = new GpsSource();
    const origin = cfg.center;
    await this.source.start(origin); // 권한 요청 포함
    this.loadStatus = 'GPS 첫 신호 대기 중...';
    if (!await this.waitFirstFix(20000))
      throw new Error('GPS 신호를 받지 못했습니다. 실외에서 하늘이 보이는 곳으로 이동한 뒤 다시 시도하세요.');
    this.step('gps', 'done', `정확도 ${(this.source.latest?.accuracy ?? 0).toFixed(0)}m`);
    this.step('map', 'active');

    let ways: RoadWay[] | null = null;

    // ① 구운 지도 팩 — 한 번 받으면 캐시되어 다음부터는 오프라인에서도 즉시 뜬다.
    //    (실측: 디코드+그래프 빌드 10ms. Overpass는 잘 될 때 2.4초, 안 되면 40초)
    //    Overpass 사용 여부와 무관하게 먼저 시도한다 — 둘은 별개의 데이터 출처다.
    if (Config.mapPackUrl) {
      this.loadStatus = '지도 파일 확인 중...';
      try {
        const loaded = await loadMapPack(origin, cfg.radiusMeters, (msg, pct) => {
          this.loadStatus = msg;
          this.loadPercent = pct ?? -1;
        });
        if (loaded) {
          ways = loaded.ways;
          this.buildings = loaded.buildings;
          this.buildingsVersion++;
          this.usingOsm = true;
          this.mapSource = loaded.source;
          this.step('map', 'done', loaded.source);
        }
      } catch (e) {
        console.warn('[DEADRUN] 지도 파일 실패:', e);
      }
    }

    // ② 팩이 없고 Overpass가 켜져 있을 때만 실시간 조회
    if (!ways && cfg.useOverpass && Config.useOverpassApi) {
      this.loadStatus = 'OSM 서버에서 도로 받는 중... (느릴 수 있음)';
      try {
        ways = await fetchRoads(origin, cfg.radiusMeters);
        this.mapSource = `OSM 실도로 (${ways.length} ways)`;
        this.usingOsm = true;
        this.step('map', 'done', `Overpass · ${ways.length} ways`);
      } catch (e) {
        console.warn('[DEADRUN] Overpass 실패 → 합성 폴백:', e);
      }
    }
    if (!ways) { this.loadStatus = '지도를 못 받아 합성 도시를 만듭니다...'; this.step('map', 'done', '합성 격자 도시'); }
    if (!ways) {
      ways = generateSyntheticMap(Math.min(cfg.radiusMeters, 600));
      this.mapSource = '합성 격자 도시 (오프라인 폴백)';
    }

    // 건물은 도로보다 배로 무겁다(실측 804KB·9.9초). 로딩을 막지 않고 뒤에서 받는다.
    // 건물 보충은 Overpass를 쓴다. 팩에 이미 건물이 있거나 Overpass를 껐으면 하지 않는다.
    if (this.usingOsm && Config.fetchBuildings && Config.useOverpassApi
        && this.buildings.length === 0)
      this.loadBuildingsInBackground(origin, cfg.radiusMeters);

    this.loadPercent = -1;
    this.loadStatus = `도로 ${ways.length.toLocaleString()}개로 지도 만드는 중...`;
    this.step('graph', 'active');
    this.graph = RoadGraph.build(ways);
    this.step('graph', 'done', `${ways.length.toLocaleString()} ways · 노드 ${this.graph.nodes.length.toLocaleString()}`);
    this.step('spawn', 'active');
    this.filter = new LocationFilter(this.graph);

    const start: Vec2 = this.source.latest?.enu ?? { x: 0, y: 0 };
    this.filter.reset(start);
    this.pose = this.filter.update(start, 1);

    this.playerName = cfg.playerName || '러너';
    this.sim = new ZombieSimulation(this.graph);
    this.sim.chaseSpeedKmh = cfg.chaseSpeedKmh;
    this.sim.wanderSpeedKmh = cfg.wanderSpeedKmh;
    this.sim.roadHalfWidthM = Math.max(1, cfg.roadHalfWidthM);
    this.sim.constrainToRoad = cfg.constrainToRoad;
    this.godMode = cfg.godMode;
    this.sim.attackRange = Math.max(0.2, cfg.attackRangeM || Rules.attackRange);
    this.sim.maxChasers = Math.max(1, cfg.maxChasers || Rules.maxChasers);
    this.sim.relentless = cfg.relentlessChase;
    this.sim.detectRangeMult = Math.max(0.1, cfg.detectRangeMult || 1);
    this.sim.detectRangeMaxM = Math.max(5, cfg.detectRangeMaxM || 999);
    this.sim.useFov = cfg.useFov;
    this.sim.detectAlwaysM = Math.max(0, cfg.detectAlwaysM);
    this.sim.useLineOfSight = cfg.useLineOfSight;
    this.sim.losCorridorM = Math.max(2, cfg.losCorridorM);
    this.renderSmoothing = Math.max(1, cfg.renderSmoothing || 8);
    this.sim.escapeDistance = Math.max(0, cfg.escapeDistanceM);
    this.hp = Rules.playerMaxHp;
    this.sim.onAttack = z => this.handleAttack(z);
    this.sim.onKilled = z => {
      this.kills++;
      const n = z.type.name;
      this.killsByType[n] = (this.killsByType[n] ?? 0) + 1;
    };
    this.sim.onDetect = z =>
      this.onNotify?.(`좀비 ${z.type.name}#${z.id}가 사용자 ${this.playerName}을(를) 감지했습니다`);

    if (cfg.testMode) {
      // 테스트: 필드 전체에 뿌리지 않고 내 주변에 몇 마리만 — 전부 나를 보고 출발한다
      this.sim.spawnNearPlayer(cfg.testZombieCount, start, cfg.testSpawnDistanceM);
      this.mapSource += ` · 테스트 ${cfg.testZombieCount}마리`;
    } else {
      const areaKm2 = Math.PI * (cfg.radiusMeters / 1000) ** 2;
      const count = Math.min(cfg.maxZombies, Math.max(10, Math.round(areaKm2 * cfg.zombiesPerSqKm)));
      this.sim.spawnInitial(count, start);
    }
    this.step('spawn', 'done', `${this.sim.zombies.length.toLocaleString()}마리`);

    this.state = 'playing';
  }

  /** GPS 첫 신호 대기. 가장 오래 걸리는 구간이라 남은 시간을 화면에 보여준다 */
  private waitFirstFix(timeoutMs: number): Promise<boolean> {
    return new Promise(resolve => {
      const t0 = Date.now();
      const iv = setInterval(() => {
        const left = Math.ceil((timeoutMs - (Date.now() - t0)) / 1000);
        if (this.source?.latest) { clearInterval(iv); resolve(true); }
        else if (left <= 0) { clearInterval(iv); resolve(false); }
        else this.loadStatus = `GPS 신호 기다리는 중... ${left}초`;
      }, 250);
    });
  }

  /** 메인 틱 — useGame 훅이 ~10Hz로 호출 */
  tick(dt: number) {
    if (this.state === 'playing') {
      this.sessionSec += dt;

      const sample = this.source?.latest;
      const prev = this.pose.posFiltered;
      if (sample && this.filter && sample.time !== this.lastSampleTime) {
        const measDt = !isFinite(this.lastSampleTime)
          ? 1
          : Math.min(5, Math.max(0.05, sample.time - this.lastSampleTime));
        this.lastSampleTime = sample.time;
        // 실 GPS만 쓰므로 이동/정지는 필터의 휴리스틱이 판정한다
        this.pose = this.filter.update(sample.enu, measDt, sample.accuracy);
      } else if (this.filter) {
        this.pose = this.filter.predict(dt);
      }

      // 거리 적립 → 보급 (GDD §5.3)
      if (this.pose.speedKmh > 1 && this.pose.speedKmh < Rules.vehicleSpeedKmh) {
        const step = dist(prev, this.pose.posFiltered);
        if (step < 30) {
          this.distanceM += step;
          this.supplyAcc += step;
          if (this.supplyAcc >= Rules.supplyIntervalMeters) {
            this.supplyAcc -= Rules.supplyIntervalMeters;
            this.ammo = Math.min(Rules.ammoMax, this.ammo + Rules.supplyAmmo);
            this.supplies++;
            this.onSupply?.();
          }
        }
      }

      this.sim?.tick(dt, this.pose.posSnapped, this.pose.layer);
      this.gunCd -= dt;
      this.scanCooldown -= dt;
      this.scanReveal -= dt;

      const threat = this.threatLevel();
      if (threat !== this.lastThreat) {
        this.lastThreat = threat;
        this.onThreatChange?.(threat);
      }
      this.simVersion++;
    }
  }

  /**
   * 렌더 전용 스텝 — 시뮬(10Hz)과 분리해 화면 갱신 주기(30Hz)로 호출한다.
   * 판정 위치(pose.posSnapped)는 건드리지 않고 표시 위치만 부드럽게 따라가게 한다.
   */
  /** 건물 외곽선을 뒤에서 받아 채운다. 실패해도 게임에는 영향이 없다. */
  private loadBuildingsInBackground(origin: LatLon, radius: number) {
    fetchBuildings(origin, radius)
      .then(list => {
        this.buildings = list;
        this.buildingsVersion++;
        console.log(`[DEADRUN] 건물 ${list.length}개 로드`);
        this.mapSource += ` · 건물 ${list.length.toLocaleString()}`;
      })
      .catch(e => console.warn('[DEADRUN] 건물 로드 실패(무시):', e));
  }

  renderStep(dt: number) {
    if (this.state !== 'playing' && this.state !== 'dead') return;
    // 표시는 스냅 이전의 필터 위치를 따라간다.
    // 스냅된 값을 그리면 도로가 바뀔 때마다 화면이 순간이동한다(계측: 한 번에 30m).
    // 스냅은 레이어 판정과 좀비 타게팅에만 쓴다.
    const target = this.pose.posFiltered;
    if (!this.renderInit || dist(this.renderPos, target) > 50) {
      this.renderPos = target;
      this.renderInit = true;
      return;
    }
    const k = 1 - Math.exp(-this.renderSmoothing * dt);
    this.renderPos = {
      x: this.renderPos.x + (target.x - this.renderPos.x) * k,
      y: this.renderPos.y + (target.y - this.renderPos.y) * k,
    };
  }

  private threatLevel(): ThreatLevel {
    const n = this.nearestChaserDist();
    if (n < 15) return 'imminent';
    if (n < Infinity) return 'chased';
    // 경계: 60m 내 비추격 좀비
    for (const z of this.sim?.zombies ?? [])
      if (z.state !== 'dead' && dist(z.pos, this.pose.posSnapped) < 60) return 'alert';
    return 'none';
  }

  nearestChaserDist(): number {
    let best = Infinity;
    for (const z of this.sim?.zombies ?? []) {
      if (z.state !== 'chase') continue;
      best = Math.min(best, dist(z.pos, this.pose.posSnapped));
    }
    return best;
  }

  // ── 전투 ──

  /** aimYawRad: 조준 방위(북 기준 시계방향, rad). null이면 최근접 자동 타게팅. 총은 1발 = 즉사 */
  gun(aimYawRad: number | null): boolean {
    if (this.state !== 'playing' || this.gunCd > 0 || this.ammo <= 0 || !this.sim) return false;
    this.gunCd = 0.4;
    this.ammo--;
    const t = aimYawRad === null
      ? this.nearestZombie(Config.gunRangeM)
      : this.aimedZombie(aimYawRad, Config.gunRangeM, Config.aimAngleDeg);
    if (t) this.sim.damage(t, 999);
    this.onShot?.(t ? { hit: true, x: t.pos.x, y: t.pos.y, name: t.type.name } : { hit: false, x: 0, y: 0 });
    this.sim.emitNoise(this.pose.posSnapped, Rules.gunNoiseRadius); // 총성 어그로
    return true;
  }

  /** 지도에서 좀비를 직접 터치해 사격 (탄약 필요, 1발 즉사, 소음 발생) */
  tapShoot(zombieId: number): boolean {
    if (this.state !== 'playing' || !this.sim) return false;
    if (this.ammo <= 0) {
      this.onNotify?.('탄약이 없습니다! (500m 이동마다 보급)');
      return false;
    }
    if (this.gunCd > 0) return false;
    const z = this.sim.zombies.find(zz => zz.id === zombieId);
    if (!z || z.state === 'dead') return false;
    this.gunCd = 0.25;
    this.ammo--;
    this.sim.damage(z, 999);
    this.onShot?.({ hit: true, x: z.pos.x, y: z.pos.y, name: z.type.name });
    this.sim.emitNoise(this.pose.posSnapped, Rules.gunNoiseRadius);
    return true;
  }

  scan(): boolean {
    if (this.state !== 'playing' || this.scanCooldown > 0 || !this.sim) return false;
    this.scanCooldown = Rules.scanCooldownSec;
    this.scanReveal = Rules.scanRevealSec;
    this.sim.emitNoise(this.pose.posSnapped, Rules.scanNoiseRadius);
    return true;
  }

  nearestZombie(range: number): Zombie | null {
    let best: Zombie | null = null;
    let bestD = range;
    for (const z of this.sim?.zombies ?? []) {
      if (z.state === 'dead' || z.layer !== this.pose.layer) continue;
      const d = dist(z.pos, this.pose.posSnapped);
      if (d <= bestD) { bestD = d; best = z; }
    }
    return best;
  }

  /**
   * 조준선에 걸린 좀비. 기준점은 화면에 그리는 위치(renderPos)여야 한다.
   *
   *  판정에 posSnapped를 쓰면 도로 스냅이 2m만 어긋나도 10m 앞 좀비의 조준각이
   *  11°나 틀어져(한도 ±8°) 화면 정중앙에 보이는데도 판정이 빗나간다.
   *  플레이어는 화면을 보고 조준하므로 판정도 화면 좌표로 해야 한다.
   */
  aimedZombie(aimYawRad: number, range: number, maxAngleDeg: number): Zombie | null {
    let best: Zombie | null = null;
    let bestAng = maxAngleDeg;
    const origin = this.playerRenderPos();
    for (const z of this.sim?.zombies ?? []) {
      if (z.state === 'dead' || z.layer !== this.pose.layer) continue;
      const rel = sub(z.pos, origin);
      const d = Math.hypot(rel.x, rel.y);
      // 0.4m 간격으로 붙어 때리는 좀비도 쏠 수 있어야 한다
      if (d > range || d < 0.15) continue;
      const bearing = Math.atan2(rel.x, rel.y); // 북 기준 시계방향
      let diff = ((bearing - aimYawRad) * 180 / Math.PI + 540) % 360 - 180;
      diff = Math.abs(diff);
      if (diff < bestAng) { bestAng = diff; best = z; }
    }
    return best;
  }

  // ── 피격 ──

  private handleAttack(z: Zombie) {
    if (this.state !== 'playing') return;
    // 무적 모드: 피격 피드백(붉은 플래시·진동)은 그대로 두되 HP는 닳지 않는다
    if (!this.godMode) this.hp = Math.max(0, this.hp - z.type.attackDmg);
    this.onPlayerHit?.(z.type.attackDmg, z.type.name);
    if (!this.godMode && this.hp <= 0) this.die(`${z.type.name}의 공격으로 사망`);
  }

  private die(cause: string) {
    this.deathCause = cause;
    this.state = 'dead';
    this.source?.stop();
  }

  dispose() {
    this.source?.stop();
  }

  /** 판정용 위치 — 도로에 스냅된 값 (좀비 타게팅·레이어) */
  playerPos(): Vec2 { return this.pose.posSnapped; }
  /**
   * 화면 표시용 위치 — 스냅 이전 필터 위치를 보간한 값.
   * AR에서 좀비의 상대 위치를 이 값으로 계산해야 한다. 스냅된 값을 쓰면
   * 도로가 바뀌는 순간 모든 좀비가 한꺼번에 수 m씩 점프한다.
   */
  playerRenderPos(): Vec2 { return this.renderInit ? this.renderPos : this.pose.posSnapped; }
  playerLayer(): number { return this.pose.layer; }

  snapshot(): Snapshot {
    // 좀비 상태는 시뮬 틱에서만 바뀐다 → 렌더 전용 프레임에서는 같은 배열을 그대로 넘겨
    // React가 좀비 레이어 재렌더를 건너뛸 수 있게 한다.
    if (this.zombieViewVersion !== this.simVersion) {
      const zombies: ZombieView[] = [];
      for (const z of this.sim?.zombies ?? []) {
        // 죽은 좀비도 쓰러지는 모션이 끝날 때까지는 화면에 남긴다
        if (z.state === 'dead' && z.deadSec > Rules.corpseSec) continue;
        const d = dist(z.pos, this.pose.posSnapped);
        const revealed = this.scanReveal > 0 && d <= Rules.scanRange;
        if (!revealed && d > Rules.radarRange) continue;
        zombies.push({
          id: z.id, x: z.pos.x, y: z.pos.y, state: z.state, color: z.type.color,
          stealth: z.type.stealth, layer: z.layer, name: z.type.name,
          hp: z.hp, maxHp: z.type.hp, distM: d, pathIdx: z.pathIdx,
          hitSeq: z.hitSeq, deadSec: z.state === 'dead' ? z.deadSec : 0,
          heading: z.facing,
          fovDeg: this.sim?.useFov ? z.type.fovDeg : 360,
          detectR: this.sim?.detectRangeOf(z.type) ?? z.type.detectRange,
        });
      }
      this.zombieViewCache = zombies;
      this.zombieViewVersion = this.simVersion;
    }
    const zombies = this.zombieViewCache;
    return {
      state: this.state,
      buildingsVersion: this.buildingsVersion,
      loadStatus: this.loadStatus,
      loadPercent: this.loadPercent,
      loadSteps: this.loadSteps,
      mapSource: this.mapSource,
      pose: this.pose,
      ammo: this.ammo,
      kills: this.kills,
      killsByType: this.killsByType,
      supplies: this.supplies,
      distanceM: this.distanceM,
      sessionSec: this.sessionSec,
      alive: this.sim?.countAlive() ?? 0,
      chasing: this.sim?.countChasing() ?? 0,
      nearestChaserM: this.nearestChaserDist(),
      threat: this.lastThreat,
      scanCooldown: Math.max(0, this.scanCooldown),
      scanRevealActive: this.scanReveal > 0,
      invulnSec: Math.max(0, this.sim?.playerInvulnTimer ?? 0),
      hp: this.hp,
      maxHp: Rules.playerMaxHp,
      godMode: this.godMode,
      deathCause: this.deathCause,
      zombies,
      rawEnu: this.source?.latest?.enu ?? null,
      renderPos: this.renderInit ? this.renderPos : this.pose.posSnapped,
    };
  }
}
