/**
 * AR 좀비 퍼펫 — 디자인 아트 조각을 관절로 이어 붙여, 걸을 때 팔다리가 실제로 움직이게 한다.
 *
 *  통짜 그림 한 장(zombieArt.ts)은 지도와 실행 화면이 쓰고, AR은 이 조각 버전을 쓴다.
 *  움직임 값은 새로 만들지 않는다 — 이미 있는 모션 클립(zombieClips.ts)의
 *  legL·legR·armL·armR 트랙을 그대로 각도로 쓴다. 박스 모델 시절에 만든
 *  데이터가 그대로 살아 있는 셈이다.
 *
 *  조각과 관절 좌표는 `npm run gen:zombies` 가 굽는다.
 */
import { M_PER_UNIT } from './zombieArtSpec';
import { PART_PNG } from './zombiePartPngs';
import { PartName, rig, VIEW_GAIN } from './zombieRig';
import PIVOT_DATA from './zombiePivots.json';

interface Box { x: number; y: number; w: number; h: number }
const DATA = PIVOT_DATA as {
  pivots: Record<string, Record<string, { x: number; y: number }>>;
  boxes: Record<string, Record<string, Box>>;
};

export interface PuppetPart {
  name: PartName;
  /** PNG 모듈 id */
  png: number;
  /** 판 크기(m) */
  w: number;
  h: number;
  /**
   * 회전축 위치(m) — 발밑(0,0) 기준. 회전하지 않는 조각이면 null.
   * 이 자리에 빈 그룹을 두고 판을 그 밑에 달면 관절이 된다.
   */
  pivot: { x: number; y: number } | null;
  /** 판 중심이 회전축(회전축이 없으면 발밑)에서 얼마나 떨어져 있나 (m) */
  offset: { x: number; y: number };
}

/** 클립 트랙 이름 → 조각. 먼 쪽 팔다리가 반대 위상을 받는다 */
const TRACK: Record<PartName, 'legL' | 'legR' | 'armL' | 'armR' | null> = {
  legNear: 'legL', legFar: 'legR',
  armNear: 'armL', armFar: 'armR',
  body: null,
};

/**
 * 한 좀비의 조각 목록. 그리는 순서대로(뒤 → 앞) 돌려준다.
 * 같은 (타입·상태·방향)이면 결과가 같으므로 호출부에서 캐시해 쓴다.
 */
export function puppetParts(type: string, state: string, view: string): PuppetPart[] {
  const pivots = DATA.pivots[`${type}-${view}`] ?? {};
  const boxes = DATA.boxes[`${type}-${state}-${view}`] ?? {};
  const out: PuppetPart[] = [];

  for (const def of rig(type, view)) {
    const box = boxes[def.name];
    const png = PART_PNG[`${type}-${state}-${view}-${def.name}`];
    if (!box || png === undefined) continue;

    // 아트 좌표는 y가 아래로 +, 세계 좌표는 위로 + 라 부호를 뒤집는다
    const centerX = (box.x + box.w / 2) * M_PER_UNIT;
    const centerY = -(box.y + box.h / 2) * M_PER_UNIT;
    const p = pivots[def.name];
    const pivot = p ? { x: p.x * M_PER_UNIT, y: -p.y * M_PER_UNIT } : null;

    out.push({
      name: def.name,
      png,
      w: box.w * M_PER_UNIT,
      h: box.h * M_PER_UNIT,
      pivot,
      offset: pivot
        ? { x: centerX - pivot.x, y: centerY - pivot.y }
        : { x: centerX, y: centerY },
    });
  }
  return out;
}

export interface JointPose {
  /** 관절 회전(rad). 화면에서 시계방향이 +가 되도록 부호를 맞춰 둔다 */
  rotation: number;
  /** 회전축을 위로 들어 올리는 양(m) — 정면·뒷모습에서 발을 떼는 느낌을 준다 */
  lift: number;
}

const DEG = Math.PI / 180;

/**
 * 클립이 낸 포즈를 조각 회전으로 바꾼다.
 *
 *  측면은 앞뒤 스윙이 그대로 보이지만, 정면·뒷모습에서 같은 각도로 돌리면
 *  다리가 좌우로 벌어지는 가위질이 된다. 그래서 각도를 줄이고
 *  앞으로 나온 다리를 살짝 들어 올려 걷는 것처럼 읽히게 한다.
 */
export function jointPose(part: PartName, view: string, pose: Record<string, number>): JointPose {
  const track = TRACK[part];
  if (!track) return { rotation: 0, lift: 0 };
  const gain = VIEW_GAIN[view] ?? VIEW_GAIN.side;
  const swing = pose[track] ?? 0;

  // 아트의 측면은 왼쪽을 본다 — 앞으로(왼쪽으로) 내미는 스윙이 화면에서는 반시계다
  let rot = -swing * DEG * gain.swing;

  // 정면·뒷모습에서는 팔을 좌우로도 벌린다 (클립의 armSway)
  if (gain.swing < 1 && (part === 'armNear' || part === 'armFar')) {
    const sway = (pose.armSway ?? 0) * DEG * 0.5;
    rot += part === 'armNear' ? sway : -sway;
  }

  return { rotation: rot, lift: gain.lift * Math.max(0, swing) / 20 };
}
