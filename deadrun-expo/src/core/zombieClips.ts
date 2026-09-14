/**
 * 좀비 모션 클립 — glTF의 애니메이션 클립을 데이터로 흉내낸 것.
 *
 * 모델이 박스 6개뿐이라 본·스키닝이 없어 glTF의 이점이 거의 없다(마인크래프트도
 * 같은 이유로 코드 기반이다). 대신 "모션은 데이터, 재생은 공용 코드"라는 구조만
 * 가져와서 렌더 루프에서 수식을 걷어냈다. 나중에 진짜 .glb로 갈아탈 때도
 * 재생부만 AnimationMixer로 바꾸면 된다.
 *
 * 값은 회전은 도(deg), 위치는 미터(m). 시간은 초.
 * 트랙 이름은 모델 부위와 1:1로 대응한다.
 *
 * ※ 좀비는 항상 플레이어를 정면으로 바라보기 때문에, 다리를 앞뒤로 흔드는
 *   동작은 시선 축과 겹쳐 화면에서 거의 안 보인다. 그래서 정면에서 보이는
 *   roll(좌우 기울기) · rootY(상하 반동) · yaw(어깨 회전)를 함께 넣는다.
 */

export type Keyframe = readonly [t: number, v: number];

export interface Clip {
  /** 한 바퀴 길이(초) */
  duration: number;
  loop: boolean;
  /**
   * 같은 그룹끼리 전환하면 걸음 위상을 이어받는다.
   * (Unity Mecanim의 sync group과 같은 개념)
   * 없으면 전환 시 0초부터 시작한다.
   */
  sync?: string;
  /**
   * 이 클립으로 넘어올 때 섞는 시간(초). 생략하면 0.2.
   * 짧은 클립에 긴 페이드를 주면 동작이 다 끝나도록 섞이기만 해서 진폭이 죽는다.
   * 반대로 중립 자세에서 시작하는 클립(피격·사망)은 섞을 게 없으니 짧게 둬야
   * 타격감이 산다.
   */
  fadeIn?: number;
  tracks: Readonly<Record<string, readonly Keyframe[]>>;
}

/** 한 프레임의 자세. 트랙 이름 → 값 */
export type Pose = Record<string, number>;

/** 트랙 이름 목록 — 재생기가 포즈를 0으로 초기화할 때 쓴다 */
export const TRACKS = [
  'legL', 'legR',   // 엉덩이 피벗 앞뒤 스윙 (deg)
  'armL', 'armR',   // 어깨 앞뒤(위아래) 스윙 (deg)
  'armSway',        // 팔 좌우 벌림 — 정면에서 보이는 흔들림 (deg)
  'rootY',          // 몸 전체 상하 반동 (m) — .env 배율이 곱해진다
  'fallY',          // 쓰러질 때 내려앉는 양 (m) — 배율 없이 그대로 적용
  'pitch',          // 앞뒤 젖힘 (deg, +가 앞으로)
  'roll',           // 좌우 기울기 (deg)
  'yaw',            // 어깨 좌우 회전 (deg)
  'head',           // 고개 끄덕임 (deg)
] as const;

export const CLIPS: Readonly<Record<string, Clip>> = {
  /** 대기 — 멈춰 서서 미세하게 흔들린다 */
  idle: {
    fadeIn: 0.28,
    duration: 2.6,
    loop: true,
    tracks: {
      legL: [[0, 2], [1.3, -2], [2.6, 2]],
      legR: [[0, -2], [1.3, 2], [2.6, -2]],
      armL: [[0, -4], [1.3, 2], [2.6, -4]],
      armR: [[0, 2], [1.3, -4], [2.6, 2]],
      rootY: [[0, 0], [1.3, 0.012], [2.6, 0]],
      roll: [[0, -1.6], [1.3, 1.6], [2.6, -1.6]],
      head: [[0, 3], [0.9, -2], [1.8, 4], [2.6, 3]],
    },
  },

  /** 배회 — 느릿하게 끌듯이 걷는다 */
  walk: {
    fadeIn: 0.2,
    duration: 1.05,
    loop: true,
    sync: 'gait',
    tracks: {
      legL: [[0, -20], [0.52, 20], [1.05, -20]],
      legR: [[0, 20], [0.52, -20], [1.05, 20]],
      armL: [[0, 6], [0.52, -7], [1.05, 6]],
      armR: [[0, -7], [0.52, 6], [1.05, -7]],
      armSway: [[0, -5], [0.52, 5], [1.05, -5]],
      // 한 걸음마다 한 번 = 한 바퀴에 두 번 튄다
      rootY: [[0, 0], [0.26, 0.038], [0.52, 0], [0.78, 0.038], [1.05, 0]],
      roll: [[0, -3.5], [0.52, 3.5], [1.05, -3.5]],
      yaw: [[0, 4], [0.52, -4], [1.05, 4]],
      head: [[0, 6], [0.52, 3], [1.05, 6]],
    },
  },

  /** 추격 — 보폭·반동을 키우고 주기를 줄인다 */
  run: {
    fadeIn: 0.18,
    duration: 0.6,
    loop: true,
    sync: 'gait',
    tracks: {
      legL: [[0, -38], [0.3, 38], [0.6, -38]],
      legR: [[0, 38], [0.3, -38], [0.6, 38]],
      armL: [[0, 12], [0.3, -14], [0.6, 12]],
      armR: [[0, -14], [0.3, 12], [0.6, -14]],
      armSway: [[0, -9], [0.3, 9], [0.6, -9]],
      rootY: [[0, 0], [0.15, 0.075], [0.3, 0], [0.45, 0.075], [0.6, 0]],
      roll: [[0, -5.5], [0.3, 5.5], [0.6, -5.5]],
      yaw: [[0, 7], [0.3, -7], [0.6, 7]],
      head: [[0, 10], [0.3, 6], [0.6, 10]],
    },
  },

  /**
   * 피격 — 맞았지만 죽지 않았을 때 한 번 움찔한다.
   * 근접 공격은 1 대미지라 워커(hp2)·브루트(hp8)는 버틴다.
   */
  hit: {
    fadeIn: 0.05,
    duration: 0.34,
    loop: false,
    tracks: {
      pitch: [[0, 0], [0.08, -15], [0.2, 4], [0.34, 0]],
      roll: [[0, 0], [0.08, 7], [0.2, -3], [0.34, 0]],
      armL: [[0, 0], [0.08, -26], [0.34, 0]],
      armR: [[0, 0], [0.08, -20], [0.34, 0]],
      head: [[0, 0], [0.08, -14], [0.34, 0]],
      rootY: [[0, 0], [0.08, -0.03], [0.34, 0]],
    },
  },

  /** 사망 — 뒤로 젖혀지며 쓰러진다. 마지막 자세에서 멈춘다(loop 없음) */
  death: {
    fadeIn: 0.06,
    duration: 1.0,
    loop: false,
    tracks: {
      pitch: [[0, 0], [0.12, -22], [0.55, -78], [1.0, -90]],
      fallY: [[0, 0], [0.12, 0.04], [0.55, -0.45], [1.0, -0.62]],
      roll: [[0, 0], [0.3, 12], [1.0, 16]],
      armL: [[0, 0], [0.2, -46], [0.6, -18], [1.0, -10]],
      armR: [[0, 0], [0.24, -38], [0.6, -14], [1.0, -8]],
      armSway: [[0, 0], [0.3, 16], [1.0, 10]],
      legL: [[0, 0], [0.35, 24], [1.0, 14]],
      legR: [[0, 0], [0.35, -18], [1.0, -10]],
      head: [[0, 0], [0.3, 18], [1.0, 12]],
    },
  },

  /** 공격 — 뻗은 팔을 내리쳤다 올린다 (+각도가 아래 방향) */
  attack: {
    fadeIn: 0.12,
    duration: 0.78,
    loop: true,
    tracks: {
      armL: [[0, -18], [0.26, 52], [0.5, 30], [0.78, -18]],
      armR: [[0, -12], [0.32, 52], [0.56, 30], [0.78, -12]],
      armSway: [[0, -4], [0.39, 4], [0.78, -4]],
      legL: [[0, -6], [0.39, 6], [0.78, -6]],
      legR: [[0, 6], [0.39, -6], [0.78, 6]],
      rootY: [[0, 0], [0.26, 0.03], [0.5, 0], [0.78, 0]],
      roll: [[0, 2.5], [0.39, -2.5], [0.78, 2.5]],
      head: [[0, -4], [0.26, 8], [0.78, -4]],
    },
  },
};

/** 키프레임 사이를 부드럽게(smoothstep) 보간 */
export function sampleTrack(kfs: readonly Keyframe[], t: number): number {
  if (kfs.length === 0) return 0;
  if (t <= kfs[0][0]) return kfs[0][1];
  const last = kfs[kfs.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 1; i < kfs.length; i++) {
    if (t > kfs[i][0]) continue;
    const [t0, v0] = kfs[i - 1];
    const [t1, v1] = kfs[i];
    const k = t1 === t0 ? 0 : (t - t0) / (t1 - t0);
    return v0 + (v1 - v0) * (k * k * (3 - 2 * k));
  }
  return last[1];
}

/** 클립을 특정 시각에서 샘플링해 out에 채운다 (할당 없이 재사용) */
export function sampleClip(clip: Clip, time: number, out: Pose): Pose {
  const t = clip.loop
    ? ((time % clip.duration) + clip.duration) % clip.duration
    : Math.min(Math.max(time, 0), clip.duration);
  for (const name of TRACKS) out[name] = 0;
  for (const name in clip.tracks) out[name] = sampleTrack(clip.tracks[name], t);
  return out;
}

/**
 * 클립 재생기 — AnimationMixer의 clipAction + crossFadeTo에 해당한다.
 * 클립이 바뀌면 직전 자세를 붙잡아 두고 fadeSec 동안 섞어서 동작이 튀지 않게 한다.
 */
export class ClipPlayer {
  private name = 'idle';
  private time = 0;
  private fadeT = 0;
  private fadeSec = 0.2;
  private readonly from: Pose = {};
  private readonly cur: Pose = {};
  private readonly out: Pose = {};

  constructor(startName = 'idle', startOffset = 0) {
    this.name = startName;
    this.time = startOffset;
    for (const k of TRACKS) { this.from[k] = 0; this.cur[k] = 0; this.out[k] = 0; }
  }

  get current(): string { return this.name; }
  /** loop가 아닌 클립이 끝까지 재생됐는지 (피격 모션 복귀 판단용) */
  get finished(): boolean {
    const c = CLIPS[this.name];
    return !c.loop && this.time >= c.duration;
  }

  /** 재생할 클립을 지정한다. 같은 이름이면 아무 일도 하지 않는다. */
  play(name: string) {
    const next = CLIPS[name];
    if (name === this.name || !next) return;
    const prev = CLIPS[this.name];
    for (const k of TRACKS) this.from[k] = this.out[k];
    this.name = name;
    this.fadeSec = next.fadeIn ?? 0.2;

    // 걷기↔추격처럼 같은 보행 주기끼리는 위상을 이어받는다.
    // 0으로 되돌리면 디딘 다리가 순간적으로 반대로 바뀌어 크게 튄다.
    if (prev.sync && prev.sync === next.sync) {
      const phase = ((this.time % prev.duration) + prev.duration) % prev.duration / prev.duration;
      this.time = phase * next.duration;
    } else {
      this.time = 0;
    }
    this.fadeT = 0;
  }

  update(dt: number): Pose {
    this.time += dt;
    sampleClip(CLIPS[this.name], this.time, this.cur);
    if (this.fadeT < this.fadeSec) {
      this.fadeT = Math.min(this.fadeSec, this.fadeT + dt);
      // 선형으로 섞으면 전환이 시작·끝나는 순간 속도가 튄다. 양 끝 기울기가 0인
      // smoothstep을 써야 앞뒤 동작과 매끄럽게 이어진다.
      const x = this.fadeT / this.fadeSec;
      const k = x * x * (3 - 2 * x);
      for (const n of TRACKS) this.out[n] = this.from[n] + (this.cur[n] - this.from[n]) * k;
    } else {
      for (const n of TRACKS) this.out[n] = this.cur[n];
    }
    return this.out;
  }
}
