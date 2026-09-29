import { Directory, File, Paths } from 'expo-file-system';
import { LatLon, Vec2, dist, toEnu } from '../core/geo';
import { decodeMapPack, RoadWay } from '../core/mapPack';
import { DEFAULT_ZOOM, TileId, tileKey, tilesAround } from '../core/tiles';
import { Config } from '../config';

/**
 * 구운 지도 팩을 정적 호스팅에서 받아 기기에 캐시한다.
 *
 *  서버가 아니라 파일 저장소면 된다(S3 / R2 / GitHub Pages / 로컬 mapkit 서버).
 *  한 번 받으면 기기에 남으므로 두 번째 실행부터는 네트워크가 없어도 플레이된다.
 *
 *  실패해도 예외를 던지지 않고 null을 돌려준다 —
 *  호출부(game.init)가 Overpass로 넘어가고, 그것도 실패하면 게임을 시작하지 않는다.
 *
 *  ── 매니페스트 두 가지를 모두 읽는다 ─────────────────────────
 *   · 타일형 (deadrun-mapkit) : { zoom, tilePath, tiles: { "13/6982/3172": 1234 } }
 *   · 단일팩형 (scripts/bakeMap.ts) : { packs: [{ name, file, lat, lon, radius }] }
 */

export interface PackEntry {
  name: string;
  file: string;
  lat: number;
  lon: number;
  radius: number;
  bytes?: number;
}

interface Manifest {
  version?: string;
  /** 타일형 */
  zoom?: number;
  tilePath?: string;
  tiles?: Record<string, number>;
  /** 단일팩형 */
  packs?: PackEntry[];
  attribution?: string;
}

/**
 * 로딩 화면 보고. percent는 0~100이며, 알 수 없는 구간에서는 생략한다.
 * 매니페스트가 타일마다 정확한 바이트 수를 알려주므로 받기 전에 전체량을 알 수 있다.
 */
export type ProgressFn = (msg: string, percent?: number) => void;

const kb = (n: number) => (n < 1024 ? `${n}B` : `${Math.round(n / 1024)}KB`);

export interface LoadedMap {
  ways: RoadWay[];
  buildings: Vec2[][];
  /** buildings 와 같은 순서·길이. 이름 없는 건물은 undefined */
  buildingNames: (string | undefined)[];
  /** 어디서 왔는지 — 화면 표시용 */
  source: string;
}

const MANIFEST_CACHE = 'latest.json';
const mapsDir = () => new Directory(Paths.document, 'maps');

/** 실패 원인을 알아볼 수 있게 문자열로 만든다 (빈 메시지 방지) */
const why = (e: unknown): string => {
  if (e instanceof Error) return `${e.name}: ${e.message || '(메시지 없음)'}`;
  const s = String(e);
  return s && s !== '[object Object]' ? s : '알 수 없는 오류';
};


/**
 * 기기에 파일 쓰기 (중간 디렉터리 생성 포함).
 *
 *  Directory.create()는 기본값이 `idempotent: false`라 폴더가 이미 있으면 예외를 던진다.
 *  두 번째 실행부터 무조건 실패하므로 반드시 idempotent를 켜야 한다.
 */
function writeFile(rel: string, data: Uint8Array | string) {
  const f = new File(mapsDir(), rel);
  new Directory(f.parentDirectory).create({ intermediates: true, idempotent: true });
  f.write(data as never);
}

/** 캐시 쓰기는 실패해도 무시한다 — 받아온 데이터까지 버릴 이유는 없다 */
function cacheQuietly(rel: string, data: Uint8Array | string) {
  try {
    writeFile(rel, data);
  } catch (e) {
    console.warn(`[DEADRUN] 캐시 저장 실패(무시): ${rel} — ${why(e)}`);
  }
}

/**
 * 타일 한 장을 파일로 내려받으며 진행률을 보고한다.
 *
 *  fetch().arrayBuffer()는 다 받아야 크기를 알 수 있어 진행률을 낼 수 없다.
 *  createDownloadTask는 쓰는 도중 bytesWritten을 알려주므로 퍼센트가 나온다.
 *  구형 런타임에서 이 API가 없으면 fetch로 되돌아간다(진행률만 포기).
 */
async function downloadTile(
  url: string, rel: string, expect: number | undefined, onBytes: (n: number) => void,
): Promise<Uint8Array> {
  const dest = new File(mapsDir(), rel);
  new Directory(dest.parentDirectory).create({ intermediates: true, idempotent: true });
  try {
    const task = File.createDownloadTask(url, dest, {
      onProgress: ({ bytesWritten }: { bytesWritten: number }) => onBytes(bytesWritten),
    });
    await task.downloadAsync();
    const data = await dest.bytes();
    // 404 응답이 파일로 저장되는 경우도 여기서 걸린다
    if (expect !== undefined && data.byteLength !== expect) {
      try { dest.delete(); } catch { /* 무시 */ }
      throw new Error(`크기 불일치 ${data.byteLength}/${expect}`);
    }
    return data;
  } catch (e) {
    if (e instanceof Error && /createDownloadTask|not a function/i.test(e.message)) {
      // 진행률 없는 폴백
      const data = await httpGet(url, Config.mapPackTimeoutMs);
      if (expect !== undefined && data.byteLength !== expect)
        throw new Error(`크기 불일치 ${data.byteLength}/${expect}`);
      cacheQuietly(rel, data);
      onBytes(data.byteLength);
      return data;
    }
    throw e;
  }
}

async function httpGet(url: string, timeoutMs: number): Promise<Uint8Array> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return new Uint8Array(await res.arrayBuffer());
  } finally {
    clearTimeout(timer);
  }
}

/** 매니페스트를 받아오고, 실패하면 마지막으로 캐시된 것을 쓴다 */
async function loadManifest(baseUrl: string, onProgress?: ProgressFn): Promise<Manifest | null> {
  const cache = new File(mapsDir(), MANIFEST_CACHE);
  const url = `${baseUrl}/latest.json`;
  onProgress?.('지도 목차 확인 중...');
  try {
    const raw = await httpGet(url, Config.mapPackTimeoutMs);
    const text = new TextDecoder().decode(raw);
    const json = JSON.parse(text) as Manifest;
    cacheQuietly(MANIFEST_CACHE, text);
    return json;
  } catch (e) {
    console.warn(`[DEADRUN] 지도 목차 수신 실패 (${url}) — ${why(e)}`);
    try {
      if (cache.exists) {
        console.log('[DEADRUN] 기기에 저장된 목차를 사용합니다');
        onProgress?.('저장된 지도 목차 사용 (오프라인)');
        return JSON.parse(cache.textSync()) as Manifest;
      }
    } catch { /* 캐시도 없음 */ }
    return null;
  }
}

/** 타일형 매니페스트: 주변 타일을 모아 하나로 합친다 */
async function loadTiles(
  base: string, m: Manifest, playOrigin: LatLon, radiusM: number, onProgress?: ProgressFn,
): Promise<LoadedMap | null> {
  const zoom = m.zoom ?? DEFAULT_ZOOM;
  const version = m.version ?? 'v1';
  const want = tilesAround(playOrigin, radiusM, zoom);

  // 목차에 있는 타일만 대상으로 한다 (바다·산속은 애초에 파일이 없다).
  // 크기를 미리 알 수 있으므로 받기 전에 전체량이 확정된다 → 정확한 퍼센트.
  const plan = want
    .filter(t => !m.tiles || tileKey(t) in m.tiles)
    .map(t => {
      const rel = `${version}/${t.z}/${t.x}/${t.y}.drmp`;
      return {
        t, rel,
        size: m.tiles?.[tileKey(t)] ?? 0,
        cached: new File(mapsDir(), rel).exists,
      };
    });

  if (plan.length === 0) {
    console.warn(`[DEADRUN] 현재 위치를 덮는 타일이 없습니다 (z${zoom}, 후보 ${want.length}장)`);
    return null;
  }

  const totalBytes = plan.reduce((a, b) => a + b.size, 0);
  const needBytes = plan.filter(p => !p.cached).reduce((a, b) => a + b.size, 0);
  let doneBytes = 0;
  const pct = (extra = 0) =>
    totalBytes > 0 ? Math.min(100, ((doneBytes + extra) / totalBytes) * 100) : 0;

  onProgress?.(
    needBytes > 0
      ? `지도 ${plan.length}장 · ${kb(needBytes)} 받는 중`
      : `저장된 지도 ${plan.length}장 여는 중`,
    0);

  const ways: RoadWay[] = [];
  const buildings: Vec2[][] = [];
  const buildingNames: (string | undefined)[] = [];
  let got = 0, cached = 0, downloaded = 0;

  for (let i = 0; i < plan.length; i++) {
    const { t, rel, size, cached: isCached } = plan[i];
    const head = `지도 ${i + 1}/${plan.length}`;
    let data: Uint8Array | null = null;

    if (isCached) {
      onProgress?.(`${head} — 저장된 파일`, pct());
      try {
        data = await new File(mapsDir(), rel).bytes();
      } catch {
        data = null; // 캐시가 깨졌으면 아래에서 다시 받는다
      }
    }

    if (!data) {
      const path = (m.tilePath ?? '{z}/{x}/{y}.drmp')
        .replace('{z}', String(t.z)).replace('{x}', String(t.x)).replace('{y}', String(t.y));
      try {
        onProgress?.(`${head} 내려받는 중 (${kb(size)})`, pct());
        data = await downloadTile(`${base}/${path}`, rel, size || undefined, written => {
          onProgress?.(`${head} 내려받는 중 (${kb(written)} / ${kb(size)})`, pct(written));
        });
        downloaded++;
      } catch (e) {
        console.warn(`[DEADRUN] 타일 ${tileKey(t)} 실패 — ${why(e)}`);
        doneBytes += size;
        continue;
      }
    } else {
      cached++;
    }

    try {
      // 모든 타일을 같은 원점으로 재투영해야 좌표계가 하나로 맞는다
      const pack = decodeMapPack(data, playOrigin);
      ways.push(...pack.ways);
      buildings.push(...pack.buildings);
      buildingNames.push(...pack.buildingNames);
      got++;
    } catch (e) {
      console.warn(`[DEADRUN] 타일 ${tileKey(t)} 해독 실패 — ${why(e)}`);
      // 깨진 캐시는 지워야 다음 실행에서 다시 받는다
      try { new File(mapsDir(), rel).delete(); } catch { /* 무시 */ }
    }
    doneBytes += size;
    onProgress?.(`${head} 완료`, pct());
  }

  if (got === 0) {
    console.warn('[DEADRUN] 읽을 수 있는 타일이 없습니다');
    return null;
  }
  console.log(`[DEADRUN] 지도 타일 ${got}장 (캐시 ${cached}) — 도로 ${ways.length} · 건물 ${buildings.length}`);
  onProgress?.(`지도 ${got}장 · 도로 ${ways.length.toLocaleString()}개`, 100);
  return {
    ways, buildings, buildingNames,
    source: `지도 타일 ${got}장 · ${kb(totalBytes)} (내려받음 ${downloaded})`,
  };
}

/** 단일팩형 매니페스트 (구버전 scripts/bakeMap.ts 산출물) */
async function loadSinglePack(
  base: string, m: Manifest, playOrigin: LatLon, onProgress?: ProgressFn,
): Promise<LoadedMap | null> {
  let best: PackEntry | null = null;
  let bestD = Infinity;
  for (const p of m.packs ?? []) {
    const d = dist({ x: 0, y: 0 }, toEnu(playOrigin, { lat: p.lat, lon: p.lon }));
    if (d + Config.playRadiusM > p.radius) continue;
    if (d < bestD) { bestD = d; best = p; }
  }
  if (!best) {
    console.warn('[DEADRUN] 현재 위치를 덮는 지도 팩이 없습니다');
    return null;
  }
  const local = new File(mapsDir(), best.file);
  try {
    let data: Uint8Array;
    if (local.exists) { onProgress?.('저장된 지도 파일 사용'); data = await local.bytes(); }
    else {
      onProgress?.(`지도 파일 내려받는 중${best.bytes ? ` (${kb(best.bytes)})` : ''}`);
      data = await httpGet(`${base}/${best.file}`, Config.mapPackTimeoutMs);
      cacheQuietly(best.file, data);
    }
    if (best.bytes && data.byteLength !== best.bytes)
      throw new Error(`크기 불일치 ${data.byteLength}/${best.bytes}`);
    const pack = decodeMapPack(data, playOrigin);
    console.log(`[DEADRUN] 지도 팩 ${best.name} — 도로 ${pack.ways.length} · 건물 ${pack.buildings.length}`);
    return {
      ways: pack.ways, buildings: pack.buildings, buildingNames: pack.buildingNames,
      source: `지도 팩 ${best.name}`,
    };
  } catch (e) {
    console.warn(`[DEADRUN] 지도 팩 로드 실패 — ${why(e)}`);
    try { if (local.exists) local.delete(); } catch { /* 무시 */ }
    return null;
  }
}

/**
 * 지도를 읽는다. 캐시에 있으면 네트워크를 쓰지 않는다.
 * @param playOrigin 현재 GPS 위치 — 팩 좌표를 이 원점 기준으로 재투영한다
 * @param radiusM    덮어야 할 반경(m)
 */
export async function loadMapPack(
  playOrigin: LatLon, radiusM: number, onProgress?: ProgressFn,
): Promise<LoadedMap | null> {
  const base = Config.mapPackUrl.replace(/\/+$/, '');
  if (!base) return null;

  const m = await loadManifest(base, onProgress);
  if (!m) return null;

  if (m.tiles && Object.keys(m.tiles).length > 0)
    return loadTiles(base, m, playOrigin, radiusM, onProgress);
  if (m.packs && m.packs.length > 0) return loadSinglePack(base, m, playOrigin, onProgress);

  console.warn('[DEADRUN] 지도 목차에 tiles/packs가 없습니다 — 형식을 확인하세요');
  return null;
}
