/**
 * 런 기록 계산 — 주 단위 집계·연속 기록·개인 기록·적응형 난이도.
 *
 *  저장은 services/runRecords.ts 가 맡고, 여기에는 **플랫폼에 기대지 않는 계산만** 둔다.
 *  헤드리스 테스트(scripts/smoke.ts)가 이 파일을 직접 돌린다.
 *
 *  설계 근거는 design/v2 Training("기록 설계") 과 note-records 에 있다. 요지는 셋이다.
 *   ① **기본 단위는 하루가 아니라 주다.** 러너가 그만두는 이유는 기록이 나빠서가 아니라
 *      한 주를 통째로 거르기 때문이다. 연속 기록도 주 단위로만 끊는다.
 *   ② **추격 구간이 곧 고강도 인터벌이다.** 이 앱만 줄 수 있는 숫자라 따로 센다.
 *   ③ **기록이 난이도를 만든다.** 최근 4주 평균 속도로 좀비 속도를 조정한다.
 */

/** 1km 구간 기록 */
export interface Split {
  /** 몇 번째 킬로미터인가 (1부터) */
  km: number;
  /** 그 구간에 걸린 시간(초) */
  sec: number;
  /** 그중 쫓기던 시간(초) */
  chasedSec: number;
}

export interface RunRecord {
  /** 시작 시각 (ISO). 정렬·주차 계산의 기준 */
  startedAt: string;
  distanceM: number;
  durationSec: number;
  /** 좀비에게 쫓긴 시간(초) — 고강도 구간 */
  chaseSec: number;
  /** 쫓기며 달린 거리(m) */
  chaseDistanceM: number;
  /** 추격당한 횟수 (끊겼다 다시 붙으면 따로 센다) */
  chaseCount: number;
  /** 한 번에 가장 오래 쫓긴 시간(초) */
  longestChaseSec: number;
  kills: number;
  killsByType: Record<string, number>;
  supplies: number;
  /** 사망 원인. 빈 문자열이면 스스로 끝낸 런 */
  deathCause: string;
  splits: Split[];
}

// ── 주 단위 계산 ────────────────────────────────────────────────
//
//  한 주는 월요일에 시작한다. 주차 키는 그 주 월요일의 YYYY-MM-DD 다.

/** 그 날짜가 속한 주의 월요일 */
export function weekStart(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const dow = (x.getDay() + 6) % 7; // 월=0 … 일=6
  x.setDate(x.getDate() - dow);
  return x;
}

const ymd = (d: Date): string => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

export const weekKey = (d: Date): string => ymd(weekStart(d));

export interface WeekSummary {
  /** 그 주 월요일 (YYYY-MM-DD) */
  key: string;
  distanceM: number;
  durationSec: number;
  chaseSec: number;
  chaseDistanceM: number;
  runs: number;
  /** 월~일 하루별 거리(m) */
  daily: number[];
}

const emptyWeek = (key: string): WeekSummary => ({
  key, distanceM: 0, durationSec: 0, chaseSec: 0, chaseDistanceM: 0, runs: 0,
  daily: [0, 0, 0, 0, 0, 0, 0],
});

/** 최근 n주 요약 — 오래된 주가 앞이고, 기록이 없는 주도 0으로 채워 돌려준다 */
export function weeks(runs: RunRecord[], n: number, now = new Date()): WeekSummary[] {
  const thisMonday = weekStart(now);
  const out: WeekSummary[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(thisMonday);
    m.setDate(m.getDate() - i * 7);
    out.push(emptyWeek(ymd(m)));
  }
  const byKey = new Map(out.map(w => [w.key, w]));

  for (const r of runs) {
    const d = new Date(r.startedAt);
    if (isNaN(d.getTime())) continue;
    const w = byKey.get(weekKey(d));
    if (!w) continue;
    w.distanceM += r.distanceM;
    w.durationSec += r.durationSec;
    w.chaseSec += r.chaseSec;
    w.chaseDistanceM += r.chaseDistanceM;
    w.runs++;
    w.daily[(d.getDay() + 6) % 7] += r.distanceM;
  }
  return out;
}

/**
 * 연속 달성 주 수.
 *
 *  목표를 채운 주가 몇 주 이어졌는가. **이번 주는 아직 진행 중이라 세지 않는다** —
 *  수요일에 "연속 0주"라고 겁주지 않기 위해서다. 이번 주를 이미 채웠다면 거기에 더한다.
 */
export function weekStreak(runs: RunRecord[], goalKm: number, now = new Date()): number {
  if (goalKm <= 0) return 0;
  const ws = weeks(runs, 60, now);
  const cur = ws[ws.length - 1];
  let streak = cur.distanceM / 1000 >= goalKm ? 1 : 0;
  for (let i = ws.length - 2; i >= 0; i--) {
    if (ws[i].distanceM / 1000 >= goalKm) streak++;
    else break;
  }
  return streak;
}

// ── 개인 기록 · 도감 ────────────────────────────────────────────

export interface PersonalBests {
  /** 가장 멀리 달린 런 */
  longestRunM: { value: number; at: string } | null;
  /** 1km 최고 기록(초) */
  fastestKmSec: { value: number; at: string } | null;
  /** 한 번에 가장 오래 버틴 추격(초) */
  longestChaseSec: { value: number; at: string } | null;
  /** 한 런 최다 처치 */
  mostKills: { value: number; at: string } | null;
}

export function personalBests(runs: RunRecord[]): PersonalBests {
  const best = <T>(pick: (r: RunRecord) => number | null) => {
    let v: { value: number; at: string } | null = null;
    for (const r of runs) {
      const x = pick(r);
      if (x === null || x <= 0) continue;
      if (!v || x > v.value) v = { value: x, at: r.startedAt };
    }
    return v;
  };
  // 1km 기록만 "작을수록 좋다"
  let fastest: { value: number; at: string } | null = null;
  for (const r of runs) {
    for (const s of r.splits) {
      if (s.sec <= 0) continue;
      if (!fastest || s.sec < fastest.value) fastest = { value: s.sec, at: r.startedAt };
    }
  }
  return {
    longestRunM: best(r => r.distanceM),
    fastestKmSec: fastest,
    longestChaseSec: best(r => r.longestChaseSec),
    mostKills: best(r => r.kills),
  };
}

/** 종류별 누적 처치 — 좀비 도감 */
export function killTotals(runs: RunRecord[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const r of runs)
    for (const [k, n] of Object.entries(r.killsByType ?? {})) out[k] = (out[k] ?? 0) + n;
  return out;
}

export const totalDistanceM = (runs: RunRecord[]) =>
  runs.reduce((s, r) => s + r.distanceM, 0);

// ── 기록이 난이도를 만든다 ──────────────────────────────────────

/** km/h. 0으로 나누지 않게 */
const kmh = (m: number, sec: number) => (sec > 0 ? (m / sec) * 3.6 : 0);

export const avgKmh = (r: RunRecord) => kmh(r.distanceM, r.durationSec);
/** 쫓기는 동안의 평균 속도 — 고강도 구간 */
export const chaseKmh = (r: RunRecord) => kmh(r.chaseDistanceM, r.chaseSec);
/** 쫓기지 않을 때의 평균 속도 — 평시 */
export const calmKmh = (r: RunRecord) =>
  kmh(r.distanceM - r.chaseDistanceM, r.durationSec - r.chaseSec);

/** 최근 n주 평균 속도(km/h). 기록이 없으면 0 */
export function recentAvgKmh(runs: RunRecord[], nWeeks = 4, now = new Date()): number {
  const from = weekStart(now);
  from.setDate(from.getDate() - (nWeeks - 1) * 7);
  let m = 0, sec = 0;
  for (const r of runs) {
    const d = new Date(r.startedAt);
    if (isNaN(d.getTime()) || d < from) continue;
    m += r.distanceM;
    sec += r.durationSec;
  }
  return kmh(m, sec);
}

/** 적응형 난이도 설정 — design/v2 Training §3 의 규칙 */
export const ADAPTIVE = {
  /** 러너 좀비 속도 = 내 4주 평균 × 이 배수 */
  multiplier: 1.25,
  /** 기준으로 삼는 기간(주) */
  weeks: 4,
  /** 주당 변화폭 상한 — 갑자기 빨라지거나 느려지지 않게 */
  maxStepPct: 0.05,
  /**
   * 하한(km/h). **긴장을 위한 값이 아니라 쓰레기 값을 막는 값이다.**
   *
   *  처음에 9로 뒀다가 계측해보고 내렸다 — 9는 평균 4km/h인 사람에게 2.25배 빠른 좀비를,
   *  3km/h인 사람에게 3배 빠른 좀비를 붙인다. "한동안 쉬었다 오면 좀비도 느려져서
   *  복귀가 무섭지 않다"(design/v2 Training §3)는 의도와 정반대다.
   *  5km/h는 빠르게 걷는 속도라, 이보다 느린 좀비는 위협이 아예 안 된다 —
   *  딱 그 선까지만 막는다. 그 위로는 ×1.25 규칙이 알아서 한다.
   */
  floorKmh: 5,
  /** 상한 — 사람이 따돌릴 가망이 없는 속도까지는 올리지 않는다 */
  ceilKmh: 20,
} as const;

/**
 * 이번 주에 쓸 러너 좀비 속도(km/h).
 *
 *  "항상 아슬아슬하게 도망칠 수 있는 선"을 유지하는 것이 목적이다.
 *  기록이 없으면 `fallback`(설정값)을 그대로 쓴다 — 처음 켠 사람에게 임의의 수를 들이밀지 않는다.
 *
 * @param prevKmh 지난주에 쓰던 값. 주면 ±5% 안에서만 움직인다
 */
export function adaptiveChaseKmh(
  runs: RunRecord[], fallback: number, prevKmh?: number, now = new Date(),
): number {
  const avg = recentAvgKmh(runs, ADAPTIVE.weeks, now);
  if (avg <= 0) return fallback;

  let next = avg * ADAPTIVE.multiplier;
  if (prevKmh && prevKmh > 0) {
    const lo = prevKmh * (1 - ADAPTIVE.maxStepPct);
    const hi = prevKmh * (1 + ADAPTIVE.maxStepPct);
    next = Math.min(hi, Math.max(lo, next));
  }
  return Math.min(ADAPTIVE.ceilKmh, Math.max(ADAPTIVE.floorKmh, Math.round(next * 10) / 10));
}
