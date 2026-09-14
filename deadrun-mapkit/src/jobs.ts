/**
 * 굽기 작업 관리 — 웹 UI가 진행 상황을 폴링할 수 있게 상태를 들고 있는다.
 *
 * 타일 하나마다 Overpass 요청이 나가므로 수천 장이면 몇 시간이 걸린다.
 * 브라우저를 닫아도 서버가 계속 굽고, 다시 열면 진행 상황이 보인다.
 */
import { bakeTile, ManifestWriter, scanTiles } from './bake';
import { BBox } from './osm';
import { TileId } from './tiles';

export type JobStatus = 'running' | 'done' | 'stopped' | 'error';

export interface Job {
  id: string;
  status: JobStatus;
  bbox: BBox;
  zoom: number;
  version: string;
  outDir: string;
  includeBuildings: boolean;
  total: number;
  done: number;
  made: number;      // 파일이 생긴 타일
  empty: number;     // 데이터가 없어 건너뛴 타일 (바다·산속)
  cached: number;    // 이미 있어서 건너뛴 타일
  failed: number;
  bytes: number;
  current: string;
  startedAt: number;
  finishedAt?: number;
  error?: string;
  log: string[];
}

const jobs = new Map<string, Job>();
const stopFlags = new Set<string>();

export const getJob = (id: string) => jobs.get(id);
export const listJobs = () => [...jobs.values()].sort((a, b) => b.startedAt - a.startedAt);
export const stopJob = (id: string) => { stopFlags.add(id); };

function push(job: Job, line: string) {
  job.log.push(line);
  if (job.log.length > 300) job.log.splice(0, job.log.length - 300);
}

export function startJob(opts: {
  tiles: TileId[];
  bbox: BBox;
  zoom: number;
  version: string;
  outDir: string;
  includeBuildings: boolean;
  resume: boolean;
  delayMs: number;
}): Job {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const job: Job = {
    id, status: 'running',
    bbox: opts.bbox, zoom: opts.zoom, version: opts.version, outDir: opts.outDir,
    includeBuildings: opts.includeBuildings,
    total: opts.tiles.length,
    done: 0, made: 0, empty: 0, cached: 0, failed: 0, bytes: 0,
    current: '', startedAt: Date.now(), log: [],
  };
  jobs.set(id, job);

  (async () => {
    // 타일 하나를 굽자마자 목차에 반영한다. 목차에 없는 타일은 앱이 요청하지 않으므로,
    // 늦게 갱신하면 이미 만들어진 파일이 있어도 쓰이지 않는다.
    const manifest = new ManifestWriter(opts.outDir, opts.version, opts.zoom, opts.bbox);
    push(job, `타일 ${opts.tiles.length}장 · z${opts.zoom} · ${opts.version} · 건물 ${opts.includeBuildings ? '포함' : '제외'}`);
    if (manifest.count > 0) push(job, `기존 목차에 ${manifest.count}장이 이미 있습니다`);
    manifest.write();

    for (let i = 0; i < opts.tiles.length; i++) {
      if (stopFlags.has(id)) {
        job.status = 'stopped';
        push(job, '사용자가 중지했습니다. 같은 설정으로 다시 시작하면 이어서 굽습니다.');
        break;
      }
      const t = opts.tiles[i];
      job.current = `${t.z}/${t.x}/${t.y}`;
      try {
        const r = await bakeTile(t, {
          outDir: opts.outDir, version: opts.version,
          includeBuildings: opts.includeBuildings,
          resume: opts.resume,
          log: msg => push(job, '  ' + msg.trim()),
        });
        if (r.skipped === 'empty') job.empty++;
        else if (r.skipped === 'cached') { job.cached++; job.bytes += r.bytes; manifest.add(t, r.bytes); }
        else {
          job.made++;
          job.bytes += r.bytes;
          manifest.add(t, r.bytes);
          push(job, `${job.current}  도로 ${r.roads} · 건물 ${r.buildings} → ${(r.bytes / 1024).toFixed(0)}KB`);
        }
        // 이 타일을 바로 목차에 반영 (쓰기는 임시파일→이름변경이라 중간 상태가 노출되지 않는다)
        if (r.bytes > 0) manifest.write();
      } catch (e) {
        job.failed++;
        push(job, `${job.current}  실패: ${(e as Error).message}`);
      }
      job.done++;

      if (opts.delayMs > 0 && i < opts.tiles.length - 1)
        await new Promise(r => setTimeout(r, opts.delayMs));
    }

    manifest.write();
    stopFlags.delete(id);
    if (job.status === 'running') job.status = 'done';
    job.finishedAt = Date.now();
    job.current = '';
    push(job, `완료 — 파일 ${job.made}장 · 빈 타일 ${job.empty} · 건너뜀 ${job.cached} · 실패 ${job.failed}`);
  })().catch(e => {
    job.status = 'error';
    job.error = String(e);
    job.finishedAt = Date.now();
    push(job, '오류: ' + String(e));
  });

  return job;
}

export { scanTiles };
