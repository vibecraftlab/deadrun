import { Vec2, LatLon, dist, sub } from '../core/geo';
import { RoadGraph, RoadWay } from '../core/roadGraph';
import { ZombieSimulation, Zombie } from '../core/zombies';
import { LocationFilter, FilteredPose } from '../core/locationFilter';
import { Rules } from '../core/rules';
import { Config } from '../config';
import { fetchRoads, fetchBuildings } from '../services/overpass';
import { loadMapPack } from '../services/mapPack';
import { LocationSource, GpsSource } from '../services/locationSource';
import { ZoneIndex } from '../core/safeZones';
import { RunRecord, Split } from '../core/runStats';

export type GameState = 'idle' | 'loading' | 'playing' | 'dead';
export type ThreatLevel = 'none' | 'alert' | 'chased' | 'imminent';
/** 지금 서 있는 곳 — 길 위 / 안전 구역(녹색 건물) / 그 밖의 건물 */
export type ZoneKind = 'none' | 'safe' | 'unsafe';

/** 구역 상태 (화면 표시용) */
export interface ZoneView {
  kind: ZoneKind;
  /** 이 구역에 들어와 있은 시간(초) */
  sec: number;
  /** 좀비 공격이 막히는 중인가 */
  shielded: boolean;
  /** 보호가 풀리기까지 남은 시간(초). 무제한이면 -1, 이미 풀렸으면 0 */
  shieldLeftSec: number;
  /** 들어와 있는 건물 이름 (OSM에 있으면) */
  name?: string;
}

export interface GameConfig {
  center: LatLon;          // 지도 중심 (GPS 모드에선 현재 위치로 대체)
  radiusMeters: number;
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
  zombieMinSepM: number;         // 플레이어와 겹치지 않게 둘 최소 간격 (.env)
  safeZoneRatio: number;         // 안전 구역 비율 0~1 (.env)
  safeZoneMaxSec: number;        // 안전 구역 보호 지속 상한 초, 0=무제한 (.env)
  unsafeBreachSec: number;       // 비안전 건물에서 좀비가 들어오기까지 초 (.env)
  zoneGraceSec: number;          // 구역 진입·이탈 유예 초 (.env)
  maxChasers: number;            // 동시 추격 상한 (.env)
  relentlessChase: boolean;      // 감지 후 포기하지 않음 (.env)
  deAggroHoldSec: number;        // 인지 범위 밖에서 이만큼 버티면 추격 해제 (.env)
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
  /** 좀비에게 쫓긴 시간(초) — 고강도 구간 */
  chaseSec: number;
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
  /** 안전 구역 상태 */
  zone: ZoneView;
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
  /**
   * 건물 이름 — buildings 와 같은 순서. 이름이 없으면 undefined.
   * 지도에서 내 주변 몇 개만 라벨로 띄운다 (전부 뿌리면 글자 범벅이 된다).
   */
  buildingNames: (string | undefined)[] = [];
  /** 건물이 새로 들어왔을 때만 올라간다 — 지도 레이어 재렌더 트리거 */
  buildingsVersion = 0;

  /*
    안전 구역 — 건물이 처음으로 게임 로직이 된 자리다 (core/safeZones.ts).

     · 안전 구역(녹색)      : 좀비가 못 들어온다. safeZoneMaxSec 까지 보호.
     · 그 밖의 건물         : unsafeBuildingBreachSec(기본 3분) 뒤 좀비가 밀고 들어온다.
     · 길 위                : 보호 없음.

    판정 좌표는 pose.posSnapped 가 **아니라** pose.posFiltered 다.
    스냅은 GPS를 도로로 12m까지 끌어당기므로(locationFilter SNAP_MAX), 그걸 쓰면
    도로변 건물 안에 서 있어도 좌표가 길 위로 나와 "들어왔다"가 판정되지 않는다.
  */
  /** 건물 구역 색인 — 건물이 로드된 뒤에 만들어진다 */
  zoneIndex: ZoneIndex | null = null;
  /** 색인이 새로 만들어질 때 올라간다 — 지도 건물 레이어 재렌더 트리거 */
  zoneVersion = 0;
  private zoneOrigin: LatLon | null = null;
  private zoneKind: ZoneKind = 'none';
  private zoneIdx = -1;
  private zoneSec = 0;
  /** 유예 중인 후보 구역 (히스테리시스) */
  private zoneCandIdx = -2;
  private zoneCandSec = 0;
  private zoneShielded = false;
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

  /*
    런 기록 누적기 — 기록 화면(design/v2 Stats·RunDetail·Chase)의 원천이다.
    쫓기는 동안을 따로 재는 것이 핵심이다. 그 구간이 곧 고강도 인터벌이고,
    이 앱만 줄 수 있는 숫자다 (note-records).
  */
  /** 런이 시작된 시각 */
  private startedAt = new Date().toISOString();
  /** 쫓긴 시간(초)과 그동안 달린 거리(m) */
  private chaseSec = 0;
  private chaseDistanceM = 0;
  /** 추격당한 횟수 — 끊겼다 다시 붙으면 따로 센다 */
  private chaseCount = 0;
  /** 지금 이어지고 있는 추격의 길이(초) */
  private curChaseSec = 0;
  private longestChaseSec = 0;
  /** 1km 구간 기록 */
  private splits: Split[] = [];
  /** 이번 킬로미터에 쌓인 거리·시간 */
  private splitM = 0;
  private splitSec = 0;
  private splitChasedSec = 0;
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

  /** 안전 구역 설정 — .env에서 받아 init이 채운다 */
  private safeZoneRatio = 0;
  private safeZoneMaxSec = 0;
  private unsafeBreachSec = 0;
  private zoneGraceSec = 0;

  /** 건물이 들어온(또는 바뀐) 뒤 구역 색인을 다시 만든다 */
  private rebuildZoneIndex() {
    if (!this.zoneOrigin || this.buildings.length === 0) return;
    this.zoneIndex = new ZoneIndex(this.buildings, this.zoneOrigin, this.safeZoneRatio);
    this.zoneVersion++;
  }

  /**
   * 지금 서 있는 구역을 판정하고 보호 상태를 갱신한다.
   *
   * 경계에서 GPS가 흔들리면 보호가 깜빡이므로, 다른 구역이 zoneGraceSec 동안
   * 연속으로 잡혀야 실제로 갈아탄다. 같은 구역에 머무는 동안에는 체류 시간이 쌓인다.
   */
  private updateZone(dt: number) {
    if (!this.zoneIndex) {
      this.zoneKind = 'none';
      this.zoneIdx = -1;
      this.zoneShielded = false;
      return;
    }
    // 스냅 전 좌표라야 건물 안에 있다는 사실이 남는다 (위 주석 참고)
    const at = this.zoneIndex.buildingAt(this.pose.posFiltered);

    if (at === this.zoneIdx) {
      this.zoneCandIdx = -2;
      this.zoneCandSec = 0;
      this.zoneSec += dt;
    } else {
      if (at === this.zoneCandIdx) this.zoneCandSec += dt;
      else { this.zoneCandIdx = at; this.zoneCandSec = 0; }

      if (this.zoneCandSec >= this.zoneGraceSec) {
        this.zoneIdx = at;
        this.zoneKind = at < 0 ? 'none' : (this.zoneIndex.safe[at] ? 'safe' : 'unsafe');
        this.zoneSec = this.zoneCandSec;  // 유예 동안 서 있던 시간도 체류로 친다
        this.zoneCandIdx = -2;
        this.zoneCandSec = 0;
      } else {
        this.zoneSec += dt; // 아직 갈아타지 않았으므로 현재 구역이 계속된다
      }
    }

    const limit = this.zoneShieldLimitSec();
    this.zoneShielded = this.zoneKind !== 'none' && (limit <= 0 || this.zoneSec < limit);

    if (this.sim) {
      this.sim.playerShielded = this.zoneShielded;
      // 보호가 풀린 건물 안 — 좀비가 도로를 벗어나 밀고 들어온다.
      // 길 위에서는 절대 켜지 않는다(길에서 건물을 통과해 달려오면 안 된다).
      this.sim.allowBreach = this.zoneKind !== 'none' && !this.zoneShielded;
    }
  }

  /** 현재 구역의 보호 지속 한도(초). 0이면 무제한 */
  private zoneShieldLimitSec(): number {
    if (this.zoneKind === 'safe') return this.safeZoneMaxSec;
    if (this.zoneKind === 'unsafe') return this.unsafeBreachSec;
    return 0;
  }

  /** 화면 표시용 구역 상태 */
  private zoneView(): ZoneView {
    const limit = this.zoneShieldLimitSec();
    return {
      kind: this.zoneKind,
      sec: this.zoneKind === 'none' ? 0 : this.zoneSec,
      shielded: this.zoneShielded,
      shieldLeftSec: this.zoneKind === 'none' ? 0
        : limit <= 0 ? -1
          : Math.max(0, limit - this.zoneSec),
      name: this.zoneIdx >= 0 ? this.buildingNames[this.zoneIdx] : undefined,
    };
  }

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
    this.startedAt = new Date().toISOString();
    this.safeZoneRatio = Math.max(0, Math.min(1, cfg.safeZoneRatio));
    this.safeZoneMaxSec = Math.max(0, cfg.safeZoneMaxSec);
    this.unsafeBreachSec = Math.max(0, cfg.unsafeBreachSec);
    this.zoneGraceSec = Math.max(0, cfg.zoneGraceSec);
    this.zoneKind = 'none';
    this.zoneIdx = -1;
    this.zoneSec = 0;
    this.zoneShielded = false;
    this.zoneIndex = null;
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
    // 건물 ENU 좌표를 위경도로 되돌려 해시하는 기준점 (안전 구역이 런마다 바뀌지 않게)
    this.zoneOrigin = origin;
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
          this.buildingNames = loaded.buildingNames;
          this.buildingsVersion++;
          this.rebuildZoneIndex();
          this.usingOsm = true;
          this.mapSource = loaded.source;
          this.step('map', 'done', loaded.source);
        }
      } catch (e) {
        console.warn('[DEADRUN] 지도 파일 실패:', e);
      }
    }

    // ② 팩이 없고 Overpass가 켜져 있을 때만 실시간 조회
    let roadError: unknown = null;
    if (!ways && Config.useOverpassApi) {
      this.loadStatus = 'OSM 서버에서 도로 받는 중... (느릴 수 있음)';
      try {
        ways = await fetchRoads(origin, cfg.radiusMeters);
        this.mapSource = `OSM 실도로 (${ways.length} ways)`;
        this.usingOsm = true;
        this.step('map', 'done', `Overpass · ${ways.length} ways`);
      } catch (e) {
        roadError = e;
        console.warn('[DEADRUN] Overpass 실패:', e);
      }
    }

    /*
      실제 도로를 못 받으면 여기서 끝난다.
      예전에는 합성 격자 도시로 폴백했으나 2026-09-16에 걷어냈다 — 가짜 지형에서
      달리는 것은 이 앱이 하려는 일(실외 러닝)이 아니고, 폴백이 조용히 끼어들면
      "왜 내 동네가 아니지"를 디버깅하기 어려웠다. 이제 실패는 실패로 드러낸다.
    */
    if (!ways || ways.length === 0) {
      this.step('map', 'done', '실패');
      throw new Error(
        Config.useOverpassApi
          ? '지도를 받지 못했습니다. 네트워크를 확인하고 다시 시도하세요.'
            + (roadError ? `\n(${String((roadError as Error)?.message ?? roadError)})` : '')
          : '지도 파일을 받지 못했고 OSM 실시간 조회가 꺼져 있습니다. '
            + 'EXPO_PUBLIC_MAP_PACK_URL 을 확인하세요.',
      );
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
    /*
      겹침 방지 간격은 반드시 공격 사거리보다 **작아야** 한다.
      크거나 같으면 좀비가 영원히 사거리 안으로 못 들어와 한 대도 때리지 못한다
      (.env 로 둘 다 조절할 수 있으므로 조합을 코드에서 막는다).
    */
    this.sim.minPlayerSepM = Math.min(
      Math.max(0, cfg.zombieMinSepM),
      this.sim.attackRange * 0.8,
    );
    this.sim.maxChasers = Math.max(1, cfg.maxChasers || Rules.maxChasers);
    this.sim.relentless = cfg.relentlessChase;
    this.sim.deAggroHoldSec = Math.max(0, cfg.deAggroHoldSec);
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

      // 쫓기는 중인가 — 이 구간이 고강도 인터벌로 기록된다
      const chasedNow = (this.sim?.countChasing() ?? 0) > 0;
      if (chasedNow) {
        if (this.curChaseSec === 0) this.chaseCount++;  // 새로 붙었다
        this.curChaseSec += dt;
        this.chaseSec += dt;
        this.splitChasedSec += dt;
        this.longestChaseSec = Math.max(this.longestChaseSec, this.curChaseSec);
      } else {
        this.curChaseSec = 0;
      }
      this.splitSec += dt;

      // 거리 적립 → 보급 (GDD §5.3)
      if (this.pose.speedKmh > 1 && this.pose.speedKmh < Rules.vehicleSpeedKmh) {
        const step = dist(prev, this.pose.posFiltered);
        if (step < 30) {
          this.distanceM += step;
          if (chasedNow) this.chaseDistanceM += step;

          // 1km를 채울 때마다 구간 하나를 닫는다
          this.splitM += step;
          while (this.splitM >= 1000) {
            this.splitM -= 1000;
            this.splits.push({
              km: this.splits.length + 1,
              sec: Math.round(this.splitSec),
              chasedSec: Math.round(this.splitChasedSec),
            });
            this.splitSec = 0;
            this.splitChasedSec = 0;
          }
          this.supplyAcc += step;
          if (this.supplyAcc >= Rules.supplyIntervalMeters) {
            this.supplyAcc -= Rules.supplyIntervalMeters;
            this.ammo = Math.min(Rules.ammoMax, this.ammo + Rules.supplyAmmo);
            this.supplies++;
            this.onSupply?.();
          }
        }
      }

      // 구역 판정을 시뮬보다 **먼저** — 이번 틱의 공격이 보호 상태를 반영해야 한다
      this.updateZone(dt);
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
        // 실시간 Overpass 경로에는 이름이 없다 (구운 타일에만 들어 있다)
        this.buildingNames = list.map(() => undefined);
        this.buildingsVersion++;
        this.rebuildZoneIndex();
        console.log(`[DEADRUN] 건물 ${list.length}개 로드`
          + ` · 안전 구역 ${this.zoneIndex?.safeCount ?? 0}개`);
        this.mapSource += ` · 건물 ${list.length.toLocaleString()}`;
      })
      .catch(e => console.warn('[DEADRUN] 건물 로드 실패(무시):', e));
  }

  renderStep(dt: number) {
    if (this.state !== 'playing' && this.state !== 'dead') return;
    /*
      표시 위치도 도로에 붙인다 (scripts/snapjump.ts 로 계측하고 바꿨다).

       예전에는 필터 위치를 그대로 그렸다. 스냅된 값을 그리면 도로가 바뀔 때마다
       화면이 한 번에 30m씩 순간이동했기 때문이다. 그 뒤 맵매칭에 들러붙기
       (SNAP_STICKY = 12m, 다른 도로가 그만큼 더 가까워야 갈아탄다)가 들어와서
       다시 쟀더니 상황이 달라져 있었다.

        · 목표값 도약 최대 30m → 13m. 게다가 그 도약은 도로를 갈아타서가 아니라
          스냅이 붙었다 떨어지는 순간이다(12m = SNAP_MAX). 5,100프레임 중 19번, 0.4%.
        · 아래 지수 보간이 그 도약을 흡수해 화면 이동은 프레임당 최대 1.2m 다
          (기존 0.4m). 지도 축척에서 2~3px이라 순간이동으로 보이지 않는다.
        · 대신 실제 위치와의 오차가 중앙값 4.5m → 3.1m 로 줄었다.

       도심에서는 GPS 오차가 10~20m라 필터 위치만으로는 건물 안에 찍힌다(보행로에서
       건물까지 중앙값 19m). 도로에 붙이면 길 위에 남는다.

       ※ 12m 안에 도로가 없으면 붙이지 않는다 — 그때는 필터 위치를 그대로 쓴다.
         멀리 끌어당겨야 하는 상황은 어느 도로인지 확신할 수 없는 상황이라,
         SNAP_MAX 자체가 안전장치 역할을 한다.
       ※ 좀비 감지·조준 판정은 예전부터 posSnapped 를 썼다. 이 변경으로
         화면에 보이는 위치와 판정 위치가 같아진다.
    */
    const target = this.pose.snapped ? this.pose.posSnapped : this.pose.posFiltered;
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

  /**
   * 이번 런의 기록. 사망(또는 종료) 후 한 번 읽어 저장한다.
   * 1km를 못 채운 마지막 토막은 버린다 — 구간 기록은 1km 단위라야 비교가 된다.
   */
  runRecord(): RunRecord {
    return {
      startedAt: this.startedAt,
      distanceM: this.distanceM,
      durationSec: this.sessionSec,
      chaseSec: this.chaseSec,
      chaseDistanceM: this.chaseDistanceM,
      chaseCount: this.chaseCount,
      longestChaseSec: this.longestChaseSec,
      kills: this.kills,
      killsByType: { ...this.killsByType },
      supplies: this.supplies,
      deathCause: this.deathCause,
      splits: [...this.splits],
    };
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
      chaseSec: this.chaseSec,
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
      zone: this.zoneView(),
    };
  }
}
