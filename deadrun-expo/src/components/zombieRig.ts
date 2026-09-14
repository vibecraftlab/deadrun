/**
 * 좀비 관절 표 — 디자인 아트(design/v2 zombie.mjs)의 그림 조각을 팔·다리로 묶는다.
 *
 *  디자인 아트는 평평한 <path> 목록이지만, 팔다리마다 **자기 관절 좌표에서 시작한다**.
 *  (예: 워커 측면의 먼 다리는 "M3,-29" 로 시작하는데 그게 곧 엉덩이 위치다)
 *  그래서 "몇 번째 요소부터 몇 번째까지가 어느 팔다리인가"만 적어두면
 *  회전축은 그 묶음 첫 요소의 시작 좌표에서 그대로 읽어낼 수 있다.
 *
 *  ⚠ 이 표는 요소 순서에 기댄다. design/v2/zombie.mjs 의 그림을 고치면 여기도 맞춰야 한다.
 *    굽는 스크립트가 요소 개수를 검사해서, 어긋나면 조용히 틀리는 대신 실패한다.
 */

/** 그리는 순서 = 뒤에서 앞으로. 이름은 클립 트랙 이름과 맞춘다 */
export type PartName = 'legFar' | 'legNear' | 'armFar' | 'armNear' | 'body';

export interface PartDef {
  name: PartName;
  /** 이 조각에 들어가는 요소 번호 (그리는 순서대로) */
  els: number[];
  /** 회전축을 어느 요소의 시작 좌표에서 읽을지. 없으면 회전하지 않는 조각 */
  pivotEl?: number;
}

/** 측면 — 네 타입이 전부 같은 구성이다 (요소 16개) */
const SIDE: PartDef[] = [
  { name: 'legFar', els: [0, 1], pivotEl: 0 },
  { name: 'armFar', els: [2, 3], pivotEl: 2 },
  { name: 'legNear', els: [4, 5], pivotEl: 4 },
  { name: 'body', els: [6, 7, 8, 14, 15] },          // 몸통 + 목 + 머리
  { name: 'armNear', els: [9, 10, 11, 12, 13], pivotEl: 9 },
];

/** 뒷모습 — 네 타입 전부 같다 (요소 12개) */
const BACK: PartDef[] = [
  { name: 'legFar', els: [0, 2], pivotEl: 0 },       // 왼다리 + 왼발
  { name: 'legNear', els: [1, 3], pivotEl: 1 },      // 오른다리 + 오른발
  { name: 'body', els: [4, 5, 10, 11] },             // 몸통 + 척추선 + 목 + 머리
  { name: 'armFar', els: [6, 8], pivotEl: 6 },
  { name: 'armNear', els: [7, 9], pivotEl: 7 },
];

/** 정면 — 팔 끝(손가락) 개수가 타입마다 달라 따로 적는다 */
const FRONT: Record<string, PartDef[]> = {
  // 요소 18개
  walker: [
    { name: 'legFar', els: [0, 2], pivotEl: 0 },
    { name: 'legNear', els: [1, 3], pivotEl: 1 },
    { name: 'body', els: [4, 5, 16, 17] },
    { name: 'armFar', els: [6, 8, 10, 12, 13], pivotEl: 6 },
    { name: 'armNear', els: [7, 9, 11, 14, 15], pivotEl: 7 },
  ],
  // 요소 17개 — 러너는 왼팔만 손이 원이고 오른팔은 팔뚝+손가락 둘이다
  runner: [
    { name: 'legFar', els: [0, 2], pivotEl: 0 },
    { name: 'legNear', els: [1, 3], pivotEl: 1 },
    { name: 'body', els: [4, 5, 15, 16] },
    { name: 'armFar', els: [6, 7, 8, 9, 10], pivotEl: 6 },
    { name: 'armNear', els: [11, 12, 13, 14], pivotEl: 11 },
  ],
  // 요소 16개
  stalker: [
    { name: 'legFar', els: [0, 2], pivotEl: 0 },
    { name: 'legNear', els: [1, 3], pivotEl: 1 },
    { name: 'body', els: [4, 5, 14, 15] },
    { name: 'armFar', els: [6, 8, 10, 11], pivotEl: 6 },
    { name: 'armNear', els: [7, 9, 12, 13], pivotEl: 7 },
  ],
  // 요소 16개
  brute: [
    { name: 'legFar', els: [0, 2], pivotEl: 0 },
    { name: 'legNear', els: [1, 3], pivotEl: 1 },
    { name: 'body', els: [4, 5, 14, 15] },
    { name: 'armFar', els: [6, 8, 10, 11], pivotEl: 6 },
    { name: 'armNear', els: [7, 9, 12, 13], pivotEl: 7 },
  ],
};

/** 검사용 — 뷰별로 나와야 하는 요소 개수 */
export const EXPECTED_ELS: Record<string, Record<string, number>> = {
  side: { walker: 16, runner: 16, stalker: 16, brute: 16 },
  back: { walker: 12, runner: 12, stalker: 12, brute: 12 },
  front: { walker: 18, runner: 17, stalker: 16, brute: 16 },
};

export function rig(type: string, view: string): PartDef[] {
  if (view === 'side') return SIDE;
  if (view === 'back') return BACK;
  return FRONT[type] ?? FRONT.walker;
}

/** 굽힌 조각 파일 이름 */
export const partFile = (type: string, state: string, view: string, part: string) =>
  `zombie-${type}-${state}-${view}-${part}.png`;

/**
 * 뷰마다 팔다리 스윙이 화면에 얼마나 드러나는지.
 *
 *  측면은 앞뒤로 흔드는 게 그대로 보인다(1.0).
 *  정면·뒷모습에서 같은 각도로 돌리면 다리가 좌우로 벌어지는 가위질처럼 보인다 —
 *  각도를 줄이고 대신 위아래로 살짝 들어 올려 걷는 것처럼 읽히게 한다.
 */
export const VIEW_GAIN: Record<string, { swing: number; lift: number }> = {
  side: { swing: 1, lift: 0 },
  front: { swing: 0.32, lift: 0.055 },
  back: { swing: 0.32, lift: 0.055 },
};
