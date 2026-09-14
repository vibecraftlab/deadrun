/**
 * 구운 좀비 스프라이트의 규격 — 굽는 쪽(scripts/genZombieSprites.ts)과
 * 쓰는 쪽(zombieArt.ts)이 같은 값을 봐야 해서 따로 뒀다.
 *
 *  이 파일은 PNG를 require 하지 않는다. 굽기 전에는 PNG가 없기 때문이다.
 */

/** 굽는 viewBox — 지면이 y=0, 위가 음수. 네 타입이 같은 상자를 써야 크기 비교가 산다 */
export const SPRITE_BOX = { x: -48, y: -76, w: 96, h: 92 } as const;

export const SPRITE_TYPES = ['walker', 'runner', 'stalker', 'brute'] as const;
/** roam=배회(초록 림) · chase=추격(빨강 림) · dark=실루엣(실행 화면용) */
export const SPRITE_STATES = ['roam', 'chase', 'dark'] as const;
export const SPRITE_VIEWS = ['front', 'side', 'back'] as const;

export type SpriteType = typeof SPRITE_TYPES[number];
export type SpriteState = typeof SPRITE_STATES[number];
export type SpriteView = typeof SPRITE_VIEWS[number];

export const spriteFile = (type: string, state: string, view: string) =>
  `zombie-${type}-${state}-${view}.png`;

/**
 * 아트 1단위가 몇 미터인가. 워커 키가 66단위이므로 1.78m에 맞춘 값이다.
 * 브루트는 같은 배율에서 더 넓고 약간 더 크게 나온다 — 디자인 의도 그대로다.
 */
export const M_PER_UNIT = 0.027;

/** AR 빌보드 판 크기 — 지면(y=0)이 텍스처의 어디인지까지 반영한 값 */
export const PLANE = {
  wM: SPRITE_BOX.w * M_PER_UNIT,
  hM: SPRITE_BOX.h * M_PER_UNIT,
  /** 판 중심을 지면에서 얼마나 띄워야 발이 땅에 닿는가 */
  centerYM: (-SPRITE_BOX.y - SPRITE_BOX.h / 2) * M_PER_UNIT,
} as const;

/** 지도에서 좀비 한 마리가 차지할 높이(m) — 실제 키가 아니라 눈에 보이라고 키운 값 */
export const MAP_HEIGHT_M = 13;
export const MAP_WIDTH_M = (SPRITE_BOX.w / SPRITE_BOX.h) * MAP_HEIGHT_M;
/** 스프라이트 상자 안에서 지면이 위에서 몇 %인가 (발 위치 맞추기) */
export const GROUND_FRAC = -SPRITE_BOX.y / SPRITE_BOX.h;

/** 시뮬의 타입 이름('Walker')을 아트 이름('walker')으로 */
export const artType = (name: string): SpriteType => {
  const k = name.toLowerCase();
  return (SPRITE_TYPES as readonly string[]).includes(k) ? (k as SpriteType) : 'walker';
};

/** 시뮬 상태를 아트 상태로 — 추격만 붉고 나머지는 배회 색이다 */
export const artState = (state: string): SpriteState =>
  state === 'chase' ? 'chase' : 'roam';

/**
 * 보는 사람 기준으로 어느 방향 그림을 쓸지 고른다.
 *
 *  design 의 side 는 왼쪽을 본다. 좀비가 화면에서 오른쪽을 보고 있으면 뒤집는다.
 *
 * @param headingRad  좀비가 바라보는 방위 (북 기준 시계방향)
 * @param bearingRad  좀비에서 보는 사람을 향한 방위 (북 기준 시계방향)
 */
export function pickView(headingRad: number, bearingRad: number): { view: SpriteView; flip: boolean } {
  // rel > 0 = 보는 사람이 좀비의 오른쪽에 있다
  const rel = ((bearingRad - headingRad) * 180 / Math.PI + 540) % 360 - 180;
  const a = Math.abs(rel);
  if (a <= 55) return { view: 'front', flip: false };
  if (a >= 125) return { view: 'back', flip: false };
  return { view: 'side', flip: rel > 0 };
}
