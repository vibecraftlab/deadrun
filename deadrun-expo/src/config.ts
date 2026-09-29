/**
 * 외부 설정 단일 진입점 — 값은 전부 .env(EXPO_PUBLIC_*)에서 오고, 없으면 안전한 기본값.
 * 주의: Expo는 `process.env.EXPO_PUBLIC_X` 리터럴 접근만 번들 타임에 인라인함
 * (동적 키 접근 불가). 값 변경 후 Metro 재시작(-c) 필요.
 */

const num = (v: string | undefined, fallback: number): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const list = (v: string | undefined, fallback: string[]): string[] => {
  const items = (v ?? '').split(',').map(s => s.trim()).filter(Boolean);
  return items.length > 0 ? items : fallback;
};

const bool = (v: string | undefined, fallback: boolean): boolean => {
  const s = (v ?? '').trim().toLowerCase();
  if (s === 'true' || s === '1' || s === 'yes' || s === 'on') return true;
  if (s === 'false' || s === '0' || s === 'no' || s === 'off') return false;
  return fallback;
};

export const Config = {
  /** 디자인 토큰·공용 컴포넌트 확인 화면을 띄운다 (개발용) */
  uiPreview: bool(process.env.EXPO_PUBLIC_UI_PREVIEW, false),
  /**
   * Overpass 실시간 조회 사용 여부.
   * false로 두면 OSM 서버를 전혀 부르지 않고 구운 지도 파일만 쓴다.
   * 이 경우 팩을 못 받으면 게임이 시작되지 않는다 (합성 폴백은 2026-09-16 폐기).
   */
  useOverpassApi: bool(process.env.EXPO_PUBLIC_USE_OVERPASS_API, true),
  /**
   * 구운 지도 팩을 올려둔 정적 호스팅 주소 (끝 슬래시 없이).
   * 비워두면 팩을 쓰지 않고 예전처럼 Overpass로 간다.
   * 예: https://cdn.example.com/deadrun-maps
   */
  mapPackUrl: (process.env.EXPO_PUBLIC_MAP_PACK_URL ?? '').trim(),
  /** 매니페스트(latest.json) 수신 제한 시간(ms). 실패하면 캐시된 팩을 쓴다 */
  mapPackTimeoutMs: num(process.env.EXPO_PUBLIC_MAP_PACK_TIMEOUT_MS, 8000),

  // .env가 없을 때의 기본 미러. 죽은 서버를 두면 요청마다 타임아웃을 통째로 버리므로
  // 실측으로 살아 있는 것만 남긴다 (2026-09-14 확인).
  overpassEndpoints: list(process.env.EXPO_PUBLIC_OVERPASS_ENDPOINTS, [
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
    'https://overpass-api.de/api/interpreter',
  ]),
  overpassTimeoutMs: num(process.env.EXPO_PUBLIC_OVERPASS_TIMEOUT_MS, 12000),
  /** 건물 외곽선을 함께 받을지 — 도로보다 배로 무거워 게임 시작 뒤 따로 받는다 */
  fetchBuildings: bool(process.env.EXPO_PUBLIC_FETCH_BUILDINGS, true),
  /** 건물 요청 제한 시간(ms) — 백그라운드라 도로보다 넉넉히 준다 */
  buildingTimeoutMs: num(process.env.EXPO_PUBLIC_BUILDING_TIMEOUT_MS, 25000),
  /** 그릴 건물 수 상한 — 초과분은 버린다 (렌더 부하 보호) */
  maxBuildings: num(process.env.EXPO_PUBLIC_MAX_BUILDINGS, 1500),

  // ── 안전 구역 (2026-09-16) ──
  /** 안전 구역(녹색 건물) 비율 0~1. 좌표 해시로 결정론적으로 찍는다. 0이면 기능 off */
  safeZoneRatio: num(process.env.EXPO_PUBLIC_SAFE_ZONE_RATIO, 0.15),
  /**
   * 안전 구역 안에서 보호받는 최대 시간(초). 0이면 무제한.
   * 무제한으로 두면 "녹색 건물에 서서 버티기"가 최적 전략이 된다 (ADR-018과 충돌).
   */
  safeZoneMaxSec: num(process.env.EXPO_PUBLIC_SAFE_ZONE_MAX_SEC, 300),
  /** 안전 구역이 아닌 건물에 들어갔을 때, 좀비가 밀고 들어오기까지의 시간(초) */
  unsafeBuildingBreachSec: num(process.env.EXPO_PUBLIC_UNSAFE_BREACH_SEC, 180),
  /**
   * 구역 진입·이탈 판정 유예(초). GPS 오차가 ±5~15m라 경계에 서 있으면
   * 들락날락하며 보호가 깜빡인다. 이만큼 연속으로 유지돼야 구역이 바뀐다.
   */
  zoneGraceSec: num(process.env.EXPO_PUBLIC_ZONE_GRACE_SEC, 3),
  defaultLat: num(process.env.EXPO_PUBLIC_DEFAULT_LAT, 37.5266),
  defaultLon: num(process.env.EXPO_PUBLIC_DEFAULT_LON, 126.9244),
  playRadiusM: num(process.env.EXPO_PUBLIC_PLAY_RADIUS_M, 1000),
  zombiesPerSqKm: num(process.env.EXPO_PUBLIC_ZOMBIES_PER_SQKM, 40),
  maxZombies: num(process.env.EXPO_PUBLIC_MAX_ZOMBIES, 120),
  // ── 좀비 속도 (km/h 직접 지정. 배수 방식 폐기) ──
  chaseSpeedWalker: num(process.env.EXPO_PUBLIC_SPEED_CHASE_WALKER, 8),
  chaseSpeedRunner: num(process.env.EXPO_PUBLIC_SPEED_CHASE_RUNNER, 16),
  chaseSpeedStalker: num(process.env.EXPO_PUBLIC_SPEED_CHASE_STALKER, 12),
  chaseSpeedBrute: num(process.env.EXPO_PUBLIC_SPEED_CHASE_BRUTE, 10),
  wanderSpeedWalker: num(process.env.EXPO_PUBLIC_SPEED_WANDER_WALKER, 4),
  wanderSpeedRunner: num(process.env.EXPO_PUBLIC_SPEED_WANDER_RUNNER, 5),
  wanderSpeedStalker: num(process.env.EXPO_PUBLIC_SPEED_WANDER_STALKER, 4),
  wanderSpeedBrute: num(process.env.EXPO_PUBLIC_SPEED_WANDER_BRUTE, 3),

  /** 도로 폭 절반(m) — 이 범위를 벗어나면 건물로 취급해 진입 불가 */
  roadHalfWidthM: num(process.env.EXPO_PUBLIC_ROAD_HALF_WIDTH_M, 5),
  /** 도로 밖 이동 제한 사용 여부 */
  constrainToRoad: bool(process.env.EXPO_PUBLIC_CONSTRAIN_TO_ROAD, true),
  /** 원시 GPS 디버그 마커(흰 점) 표시 — 1초마다 튀는 게 정상이라 기본 off */
  showRawGps: bool(process.env.EXPO_PUBLIC_SHOW_RAW_GPS, false),
  /** 무적 모드 — 좀비 공격을 받아도 HP가 닳지 않고 사망하지 않는다 (테스트용) */
  godMode: bool(process.env.EXPO_PUBLIC_GOD_MODE, false),
  /** 총 사거리(m) — 이 거리 안이어야 조준선이 붉어지고 명중한다 */
  gunRangeM: num(process.env.EXPO_PUBLIC_GUN_RANGE_M, 25),
  /** 조준 허용 각도(도) — 화면 중앙에서 이 각도 안에 들어오면 조준된 것 */
  aimAngleDeg: num(process.env.EXPO_PUBLIC_AIM_ANGLE_DEG, 8),
  /** 좀비 공격 사거리(m) */
  attackRangeM: num(process.env.EXPO_PUBLIC_ATTACK_RANGE_M, 0.5),
  /** AR 뷰 최소 렌더 거리(m) — 이보다 가까운 좀비도 이 거리에 서 있는 것처럼 그린다 */
  arMinDistanceM: num(process.env.EXPO_PUBLIC_AR_MIN_DISTANCE_M, 4),
  /**
   * AR 표시 최소 분리 거리(m) — 좀비가 실제로 0m까지 붙어도 화면에서는
   * 이보다 가까이 그리지 않는다. 카메라 원점에 겹쳐 그려지면 형체가 사라진다.
   */
  arMinSeparationM: num(process.env.EXPO_PUBLIC_AR_MIN_SEPARATION_M, 0.7),
  /**
   * AR 눈높이 정렬 반경(m) — 이 안의 좀비는 화면 중앙(조준선) 높이로 끌어올린다.
   * 코앞의 좀비가 발밑에 깔려 보이지 않게 하려는 것. 이 거리의 2배에서 0으로 풀린다.
   */
  arEyeLevelRadiusM: num(process.env.EXPO_PUBLIC_AR_EYE_LEVEL_RADIUS_M, 2),
  /** AR 카메라(눈) 높이(m) — 좀비 눈높이 정렬의 기준 */
  arEyeHeightM: num(process.env.EXPO_PUBLIC_AR_EYE_HEIGHT_M, 1.6),
  /**
   * 좀비가 플레이어에게 붙을 수 있는 최소 거리(m) — 시뮬 차원의 겹침 방지.
   * 공격 사거리보다 반드시 작게 잡힌다(game.init에서 강제) — 안 그러면 영원히 못 때린다.
   */
  zombieMinSeparationM: num(process.env.EXPO_PUBLIC_ZOMBIE_MIN_SEPARATION_M, 0.4),
  /** AR 나침반·자이로 평활 강도(1/s) — 낮을수록 화면 흔들림이 적고 반응이 늦다 */
  arSensorSmoothing: num(process.env.EXPO_PUBLIC_AR_SENSOR_SMOOTHING, 6),
  /** AR 좀비 위치 보간 강도(1/s) */
  arZombieSmoothing: num(process.env.EXPO_PUBLIC_AR_ZOMBIE_SMOOTHING, 8),
  /** AR 나침반이 자이로 드리프트를 보정하는 속도(1/s) — 낮을수록 안정적 */
  arCompassTrust: num(process.env.EXPO_PUBLIC_AR_COMPASS_TRUST, 0.6),
  /** AR 나침반 보정 데드밴드(도) — 이 안의 오차는 무시해 미세 떨림을 없앤다 */
  arHeadingDeadbandDeg: num(process.env.EXPO_PUBLIC_AR_HEADING_DEADBAND_DEG, 2),
  /** AR 자이로 yaw 부호 — 돌렸을 때 화면이 반대로 돌면 1로 바꾼다 */
  arGyroYawSign: num(process.env.EXPO_PUBLIC_AR_GYRO_YAW_SIGN, -1),
  /**
   * 자이로 변화량 데드밴드(도) — 정지 중 자이로 잡음을 걸러낸다.
   * 계측(잡음 σ0.3°): 0° → 프레임당 22.2px, 0.5° → 2.4px. 회전 추종 손해는 없다.
   */
  arGyroDeadbandDeg: num(process.env.EXPO_PUBLIC_AR_GYRO_DEADBAND_DEG, 0.5),
  /**
   * 자이로 변화량 저역 필터 강도(1/s) — 센서 20Hz / 화면 60Hz 계단을 없앤다.
   * 계측(30°/s 회전): 없음 → 프레임당 72.5px 계단, 18/s → 28.6px (이상값 28px).
   */
  arGyroSmoothing: num(process.env.EXPO_PUBLIC_AR_GYRO_SMOOTHING, 18),
  /** AR 레이어 높이차(m) — 지상/육교/지하를 높이로 표현. 0이면 전부 같은 높이 */
  arLayerHeightM: num(process.env.EXPO_PUBLIC_AR_LAYER_HEIGHT_M, 0),
  /** AR 걷기 반동 배율 — 클립의 상하 반동에 곱한다. 0이면 높이 완전 고정 */
  arBobM: num(process.env.EXPO_PUBLIC_AR_BOB_M, 1),
  /** AR에서 시야 밖으로 나간 좀비를 유지하는 시간(ms) — 경계 깜빡임 방지 */
  arKeepMs: num(process.env.EXPO_PUBLIC_AR_KEEP_MS, 2000),
  /** 동시 추격 상한 (GDD 기본 5 — 크게 잡으면 감지한 좀비가 전부 몰려온다) */
  maxChasers: num(process.env.EXPO_PUBLIC_MAX_CHASERS, 40),
  /** 집요한 추격 — 한 번 감지하면 거리를 벌려도 포기하지 않는다 */
  /**
   * 감지하면 절대 포기하지 않는다. 켜면 아래 해제 유예가 무의미해진다.
   * 기본값을 false 로 둔다 — 따돌릴 수 없는 추격은 러닝 게임의 인터벌 구조와 맞지 않는다.
   */
  relentlessChase: bool(process.env.EXPO_PUBLIC_RELENTLESS_CHASE, false),
  /** 인지 범위를 벗어난 뒤 추격이 풀리기까지 버텨야 하는 시간(초) */
  deAggroHoldSec: num(process.env.EXPO_PUBLIC_DEAGGRO_HOLD_SEC, 60),
  /**
   * 감지 범위 배수. 기본 감지범위(40~90m)는 레이더 표시 범위(150m)보다 짧아서
   * 지도에 보이는 좀비 상당수가 아직 못 본 상태로 배회한다.
   * 4 이상이면 레이더에 보이는 좀비는 전부 달려온다.
   */
  detectRangeMult: num(process.env.EXPO_PUBLIC_DETECT_RANGE_MULT, 1),
  /** 감지 반경 상한(m) — 배수 적용 후 이 값으로 자른다 */
  detectRangeMaxM: num(process.env.EXPO_PUBLIC_DETECT_RANGE_MAX_M, 60),
  /** 시야각 기반 감지 — 좀비가 바라보는 쪽에 있을 때만 발견된다 (끄면 전방위) */
  useFov: bool(process.env.EXPO_PUBLIC_USE_FOV, true),
  /** 근접 무조건 감지 거리(m) — 이 안에서는 좀비가 어느 쪽을 보든 발견한다 */
  detectAlwaysM: num(process.env.EXPO_PUBLIC_DETECT_ALWAYS_M, 20),
  /** 시야 차단 — 사이에 건물(도로 밖)이 있으면 감지되지 않는다 */
  useLineOfSight: bool(process.env.EXPO_PUBLIC_USE_LINE_OF_SIGHT, true),
  /** 시야로 인정할 도로 이탈 허용 폭(m) */
  losCorridorM: num(process.env.EXPO_PUBLIC_LOS_CORRIDOR_M, 8),
  /** 추격 이탈 거리(m) — 이 거리를 넘어 3초 유지하면 좀비가 놓친다 */
  escapeDistanceM: num(process.env.EXPO_PUBLIC_ESCAPE_DISTANCE_M, 300),
  /** 화면 갱신 주기(ms) — 시뮬은 100ms 고정, 렌더 보간만 이 주기로 진행 */
  renderIntervalMs: num(process.env.EXPO_PUBLIC_RENDER_INTERVAL_MS, 33),
  /** 렌더 보간 강도 — 낮을수록 부드럽고 반응이 느리다 */
  renderSmoothing: num(process.env.EXPO_PUBLIC_RENDER_SMOOTHING, 3),
  /** 테스트 스폰 모드 기본값 — 필드 전체 대신 내 주변에 몇 마리만 배치 */
  testMode: bool(process.env.EXPO_PUBLIC_TEST_MODE, true),
  /** 테스트 스폰 마릿수 */
  testZombieCount: num(process.env.EXPO_PUBLIC_TEST_ZOMBIE_COUNT, 3),
  /** 테스트 스폰 거리(m) — 내 주변 이 거리에 고르게 배치 */
  testSpawnDistanceM: num(process.env.EXPO_PUBLIC_TEST_SPAWN_DISTANCE_M, 50),
} as const;
