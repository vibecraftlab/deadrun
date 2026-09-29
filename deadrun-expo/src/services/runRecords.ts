import { Directory, File, Paths } from 'expo-file-system';
import { RunRecord } from '../core/runStats';

/**
 * 런 기록 저장 — 기기에만 남는다(서버 없음).
 *
 *  집계·연속 기록·적응형 난이도 계산은 전부 core/runStats.ts 에 있다.
 *  여기는 파일을 읽고 쓰는 일만 한다. 파일이 깨지면 빈 기록으로 시작한다 — 게임을 막지 않는다.
 */

export * from '../core/runStats';

const FILE = 'runs.json';
/** 오래된 기록까지 다 들고 있을 이유가 없다. 8주 히트맵 + 개인 기록에 넉넉한 양 */
const MAX_RUNS = 400;

const file = () => new File(Paths.document, FILE);

export function loadRuns(): RunRecord[] {
  try {
    const f = file();
    if (!f.exists) return [];
    const raw = JSON.parse(f.textSync());
    if (!Array.isArray(raw)) return [];
    // 오래된 것부터 정렬해 둔다 — 이후 계산이 전부 시간순을 가정한다
    return (raw as RunRecord[]).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  } catch {
    return [];
  }
}

export function addRun(r: RunRecord): RunRecord[] {
  const runs = [...loadRuns(), r].slice(-MAX_RUNS);
  try {
    new Directory(Paths.document).create({ intermediates: true, idempotent: true });
    file().write(JSON.stringify(runs));
  } catch {
    // 저장 실패가 게임을 막을 이유는 없다
  }
  return runs;
}
