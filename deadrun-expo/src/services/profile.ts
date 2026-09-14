import { Directory, File, Paths } from 'expo-file-system';

/**
 * 러너 기록 — 홈 화면의 누적 거리·오늘 목표가 가짜 숫자가 되지 않게 저장한다.
 *
 *  기기에만 남는다(서버 없음). 파일이 깨지거나 없으면 0부터 시작한다.
 *  디자인(design/v2 Home)의 "누적 128.4km", "오늘 목표 3.0km"를 실제 값으로 채우기 위한 최소 기능이다.
 */

const FILE = 'profile.json';

export interface Profile {
  /** 총 누적 거리(km) */
  totalKm: number;
  /** 완료한 런 수 */
  runs: number;
  /** 마지막 런 거리(km) */
  lastRunKm: number;
  /** 오늘 달린 거리(km) — 날짜가 바뀌면 0으로 돌아간다 */
  todayKm: number;
  /** todayKm 이 어느 날짜 것인지 (YYYY-MM-DD) */
  todayDate: string;
  /** 하루 목표(km) */
  goalKm: number;
}

const EMPTY: Profile = {
  totalKm: 0, runs: 0, lastRunKm: 0,
  todayKm: 0, todayDate: '', goalKm: 3,
};

const today = (): string => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const file = () => new File(Paths.document, FILE);

export function loadProfile(): Profile {
  try {
    const f = file();
    if (!f.exists) return { ...EMPTY, todayDate: today() };
    const p = { ...EMPTY, ...(JSON.parse(f.textSync()) as Partial<Profile>) };
    // 날짜가 바뀌었으면 오늘 기록만 초기화 (누적은 유지)
    if (p.todayDate !== today()) { p.todayKm = 0; p.todayDate = today(); }
    return p;
  } catch {
    return { ...EMPTY, todayDate: today() };
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

/** 런이 끝났을 때 호출 — 거리(m)를 받아 누적에 더한다 */
export function recordRun(distanceM: number): Profile {
  const km = distanceM / 1000;
  const p = loadProfile();
  const next: Profile = {
    ...p,
    totalKm: p.totalKm + km,
    runs: p.runs + 1,
    lastRunKm: km,
    todayKm: p.todayKm + km,
    todayDate: today(),
  };
  saveProfile(next);
  return next;
}
