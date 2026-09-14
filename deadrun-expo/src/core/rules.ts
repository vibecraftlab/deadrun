/** 게임 룰 튜닝값 — GDD 근거 수치 (Unity 프로토타입 Rules와 동일) */
export const Rules = {
  attackRange: 0.5,       // 좀비 공격 사거리 (m) — .env로 덮어쓸 수 있음
  attackStandoff: 0.4,    // 플레이어에게 겹쳐 서지 않도록 유지하는 최소 간격 (공격 사거리 안쪽)
  attackCooldownSec: 1.2, // 좀비 개체별 공격 주기
  playerMaxHp: 100,
  stunSec: 2,
  maxChasers: 5,
  deAggroDistMult: 2,
  deAggroHoldSec: 20,
  searchDurationSec: 30,
  radarRange: 150,
  scanRange: 400,
  scanRevealSec: 4,
  scanCooldownSec: 60,
  scanNoiseRadius: 150,
  gunNoiseRadius: 120,
  minSpawnDistFromPlayer: 80,
  supplyIntervalMeters: 500,
  supplyAmmo: 5,
  ammoMax: 30,
  ammoStart: 10,
  /** 죽은 좀비를 화면에 남겨두는 시간(초) — 쓰러지는 모션이 끝날 때까지 */
  corpseSec: 1.4,
  gunRange: 25,
  vehicleSpeedKmh: 25,
  vehicleHoldSec: 30,
} as const;
