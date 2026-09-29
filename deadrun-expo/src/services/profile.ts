import { Directory, File, Paths } from 'expo-file-system';
import { adaptiveChaseKmh, loadRuns, weekKey } from './runRecords';

/**
 * 러너 설정 — 기록 자체는 여기 없다.
 *
 *  거리·횟수 같은 값은 전부 런 기록(runRecords.ts)에서 계산한다.
 *  같은 사실을 두 곳에 두면 반드시 어긋나기 때문이다.
 *  여기 남는 것은 "사용자가 정하는 값"과 "주마다 한 번 굳혀야 하는 값"뿐이다.
 */

const FILE = 'profile.json';

export interface Profile {
  /**
   * 주간 거리 목표(km). 하루가 아니라 주다 —
   * 하루 목표는 못 지킨 날마다 실패를 만들지만 주 목표는 남은 날로 만회할 수 있다
   * (design/v2 Training §1).
   */
  weeklyGoalKm: number;
  /**
   * 이번 주에 쓰기로 굳힌 러너 좀비 속도(km/h).
   * 런마다 다시 계산하면 한 주 안에서도 난이도가 출렁인다 — 주에 한 번만 정한다.
   */
  chaseKmh: number;
  /** 위 값을 정한 주 (그 주 월요일). 주가 바뀌면 다시 계산한다 */
  chaseKmhWeek: string;
}

const EMPTY: Profile = { weeklyGoalKm: 20, chaseKmh: 0, chaseKmhWeek: '' };

const file = () => new File(Paths.document, FILE);

export function loadProfile(): Profile {
  try {
    const f = file();
    if (!f.exists) return { ...EMPTY };
    return { ...EMPTY, ...(JSON.parse(f.textSync()) as Partial<Profile>) };
  } catch {
    return { ...EMPTY };
  }
}

export function saveProfile(p: Profile): void {
  try {
    new Directory(Paths.document).create({ intermediates: true, idempotent: true });
    file().write(JSON.stringify(p));
  } catch {
    // 저장 실패가 게임을 막을 이유는 없다
  }
}

/**
 * 이번 주에 쓸 러너 좀비 속도(km/h) — "기록이 난이도를 만든다" (design/v2 Training §3).
 *
 *  최근 4주 평균 속도 × 1.25 를 목표로 하되 주당 ±5% 안에서만 움직인다.
 *  기록이 없으면 설정값(fallback)을 그대로 쓴다 — 처음 켠 사람에게 임의의 수를 들이밀지 않는다.
 *  한 주 안에서는 값을 굳혀 둔다.
 */
export function weeklyChaseKmh(fallback: number, now = new Date()): number {
  const p = loadProfile();
  const key = weekKey(now);
  if (p.chaseKmhWeek === key && p.chaseKmh > 0) return p.chaseKmh;

  const next = adaptiveChaseKmh(loadRuns(), fallback, p.chaseKmh || undefined, now);
  saveProfile({ ...p, chaseKmh: next, chaseKmhWeek: key });
  return next;
}
