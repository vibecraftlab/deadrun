/**
 * OSM 수신 — Overpass API.
 *
 *  Overpass는 무료 공용 서버라 슬롯이 차면 504를 던진다. 버그가 아니라 정책이다.
 *  (실측 2026-09-14: overpass-api.de 3회 중 1회 504, maps.mail.ru 3/3 성공)
 *  죽은 미러를 목록에 두면 미러마다 타임아웃을 통째로 버리므로 살아 있는 것만 둔다.
 *
 *  ※ OSM 데이터는 ODbL 라이선스다. 구운 결과물을 배포할 때
 *    "© OpenStreetMap contributors" 표기가 필요하다.
 */
import { LatLon, Vec2, toEnu } from './geo';
import { HIGHWAY_KINDS, RoadWay, SPAWN_ALLOWED } from './format';

/*
  미러 순서가 중요하다 — 앞의 것부터 두드리기 때문이다.

   계측 (2026-09-15, 굽기와 같은 크기의 질의):
     overpass-api.de   HTTP 200 · 9.8초 · 82KB     ← 실제로 데이터를 준다
     maps.mail.ru      HTTP 504 · 34초             ← 작은 질의만 받고 실제 작업은 못 버틴다

   mail.ru 는 /status 로는 "Rate limit: 0"(제한 없음)이라고 답하고 작은 질의도 200을 준다.
   그래서 살아 있는 것처럼 보이지만 굽기 크기에서는 504다. 예전에 이걸 1순위에 두는 바람에
   모든 질의가 죽은 미러를 먼저 기다렸다. 지금은 뒤로 뺐다 — 지우지는 않는다.
   overpass-api.de 가 점검으로 내려갈 때 작은 질의라도 받아줄 여지는 있다.
*/
export const DEFAULT_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

export interface BBox { west: number; south: number; east: number; north: number }

interface El {
  type: string;
  geometry?: { lat: number; lon: number }[];
  tags?: Record<string, string>;
}

export interface FetchOptions {
  endpoints?: string[];
  /** 미러 하나를 기다리는 시간(ms). 이걸 넘기면 다음 미러로 넘어간다 */
  timeoutMs?: number;
  /** 미러가 모두 실패했을 때 재시도 횟수 (Overpass 504는 대개 잠시 뒤 풀린다) */
  retries?: number;
  retryDelayMs?: number;
  log?: (msg: string) => void;
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

/**
 * /status 본문에서 "몇 초 뒤에 슬롯이 나는가"를 읽는다.
 *
 *  네트워크와 분리해 둔다 — 틀리기 쉬운 것은 이 파싱이고, 테스트할 수 있어야 한다.
 *  (test/roundtrip.ts 에서 실제 응답 형식 두 가지로 검증한다)
 *
 * @returns 기다릴 초. 지금 슬롯이 있으면 0, 알 수 없으면 null
 */
export function parseSlotWait(statusText: string): number | null {
  if (/slots? available now/i.test(statusText)) return 0;
  const waits = [...statusText.matchAll(/in (\d+) seconds/gi)].map(m => Number(m[1]));
  if (waits.length === 0) return null;
  return Math.min(...waits);
}

/**
 * 429를 받았을 때 슬롯이 언제 나는지 서버에 물어본다.
 *
 *  Overpass 는 동시 질의 수를 제한한다(overpass-api.de 는 2개). 한도를 넘으면 429인데,
 *  이때 그냥 몇 초 뒤 다시 던지면 또 429다. /status 가 **언제 슬롯이 나는지** 알려주므로
 *  그만큼 기다린다.
 *
 *  응답 예:
 *    Rate limit: 2
 *    Slot available after: 2026-09-15T05:12:34Z, in 42 seconds.
 *  슬롯이 남아 있을 때는:
 *    2 slots available now.
 *
 * @returns 기다려야 할 초. 알 수 없으면 null
 */
async function slotWaitSec(endpoint: string, log?: (m: string) => void): Promise<number | null> {
  try {
    const base = endpoint.replace(/\/interpreter$/, '');
    const r = await fetch(`${base}/status`, { headers: { 'User-Agent': USER_AGENT } });
    if (!r.ok) return null;
    const sec = parseSlotWait(await r.text());
    if (sec !== null && sec > 0) log?.(`    슬롯 대기 ${sec}초 (서버가 알려준 값)`);
    return sec;
  } catch {
    return null;
  }
}

const USER_AGENT = 'deadrun-mapkit/0.1 (personal game prototype)';

/** 이 상태 코드는 다시 던져도 소용없다 — 질의 자체가 잘못된 것이다 */
const FATAL = new Set([400, 401, 403]);

async function query(q: string, opt: FetchOptions): Promise<El[]> {
  const endpoints = opt.endpoints ?? DEFAULT_ENDPOINTS;
  /*
    미러 하나를 기다리는 시간.

     예전 기본값은 90초였다. 죽은 미러가 목록 앞에 있으면 질의 하나에
     3회 × 미러 2개 × 90초 = 9분까지 갔고, 타일 한 장은 질의를 2번 하므로 18분이었다.
     실측으로 굽기 크기의 정상 응답이 10초 안쪽이고 mail.ru 의 504 판정이 34초이므로,
     45초면 정상 응답을 놓치지 않으면서 죽은 미러를 빨리 포기한다.
  */
  const timeoutMs = opt.timeoutMs ?? 45_000;
  const retries = opt.retries ?? 2;
  let lastErr = '';

  for (let attempt = 0; attempt <= retries; attempt++) {
    for (const ep of endpoints) {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      const t0 = Date.now();
      try {
        const res = await fetch(ep, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            // 식별 불가한 UA는 overpass-api.de가 406으로 거부한다 (사용 정책)
            'User-Agent': USER_AGENT,
            Accept: 'application/json',
          },
          body: 'data=' + encodeURIComponent(q),
          signal: ctrl.signal,
        });
        if (res.ok) {
          const j = (await res.json()) as { elements?: El[] };
          return j.elements ?? [];
        }

        // 질의가 잘못된 것은 다시 던져도 같은 결과다 — 즉시 포기한다
        if (FATAL.has(res.status)) {
          const body = (await res.text()).slice(0, 300).replace(/\s+/g, ' ');
          throw new Error(`HTTP ${res.status} (재시도 무의미) ${body}`);
        }

        // 429 = 동시 질의 한도. 서버가 알려주는 만큼 기다렸다 같은 미러로 다시 간다.
        if (res.status === 429) {
          clearTimeout(timer);
          const sec = await slotWaitSec(ep, opt.log);
          if (sec !== null && sec <= 120) {
            await sleep((sec + 2) * 1000);
            const retry = await fetch(ep, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': USER_AGENT, Accept: 'application/json',
              },
              body: 'data=' + encodeURIComponent(q),
            });
            if (retry.ok) {
              const j = (await retry.json()) as { elements?: El[] };
              return j.elements ?? [];
            }
            throw new Error(`HTTP ${retry.status} (슬롯 대기 후에도)`);
          }
        }
        throw new Error(`HTTP ${res.status}`);
      } catch (e) {
        const why = String(e);
        lastErr = `${ep}: ${why}`;
        opt.log?.(`    미러 실패 ${((Date.now() - t0) / 1000).toFixed(1)}초 · ${lastErr}`);
        if (/재시도 무의미/.test(why)) throw new Error('Overpass 질의 거부: ' + lastErr);
      } finally {
        clearTimeout(timer);
      }
    }
    if (attempt < retries) {
      const wait = (opt.retryDelayMs ?? 5000) * (attempt + 1);
      opt.log?.(`    ${wait / 1000}초 뒤 재시도 (${attempt + 1}/${retries})`);
      await sleep(wait);
    }
  }
  throw new Error('Overpass 수신 실패: ' + lastErr);
}

const HW_RE = `^(${HIGHWAY_KINDS.join('|')})$`;
const bboxStr = (b: BBox) => `${b.south},${b.west},${b.north},${b.east}`;

/** 사각 범위의 보행 가능 도로 */
export async function fetchRoads(
  bbox: BBox, origin: LatLon, opt: FetchOptions = {},
): Promise<RoadWay[]> {
  const els = await query(
    `[out:json][timeout:180];(way["highway"~"${HW_RE}"](${bboxStr(bbox)}););out geom tags;`, opt);
  const ways: RoadWay[] = [];
  for (const el of els) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 2) continue;
    const t = el.tags ?? {};
    let layer = 0;
    if (t.bridge === 'yes') layer = 1;
    if (t.tunnel === 'yes') layer = -1;
    const l = parseInt(t.layer ?? '', 10);
    if (!isNaN(l)) layer = Math.max(-1, Math.min(1, l)); // 3레이어 모델
    const highway = t.highway ?? 'unclassified';
    ways.push({
      highway, layer,
      spawnAllowed: SPAWN_ALLOWED.has(highway) && layer === 0,
      points: el.geometry.map(g => toEnu(origin, g)),
    });
  }
  return ways;
}

/** 사각 범위의 건물 외곽선 */
/**
 * 건물 이름을 지도에 쓸 만하게 다듬는다.
 *
 *  OSM 한국 데이터는 "명덕외국어고등학교 (Myung Duk Foreign Language High School)" 처럼
 *  영문 번역을 괄호로 덧붙인 경우가 많다. 화면에 띄울 라벨로는 앞부분만 필요하다.
 *  괄호 안이 사실상 ASCII 일 때만 떼어낸다 — "제1동(별관)" 같은 것은 그대로 둔다.
 */
export function tidyName(raw: string): string {
  const m = raw.match(/^(.+?)\s*\(([^)]+)\)\s*$/);
  if (m) {
    const inner = m[2];
    const ascii = [...inner].filter(c => c.charCodeAt(0) < 128).length;
    if (ascii / inner.length > 0.8 && m[1].trim().length > 0) return m[1].trim();
  }
  return raw.trim();
}

export interface BuildingData {
  polys: Vec2[][];
  /** polys 와 같은 순서·길이 */
  names: (string | undefined)[];
}

export async function fetchBuildings(
  bbox: BBox, origin: LatLon, opt: FetchOptions = {},
): Promise<BuildingData> {
  // out geom tags — 좌표와 함께 이름 태그도 받는다
  const els = await query(
    `[out:json][timeout:180];(way["building"](${bboxStr(bbox)}););out geom tags;`, opt);
  const polys: Vec2[][] = [];
  const names: (string | undefined)[] = [];
  for (const el of els) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 3) continue;
    polys.push(el.geometry.map(g => toEnu(origin, g)));
    const n = el.tags?.name;
    names.push(n ? tidyName(n) : undefined);
  }
  return { polys, names };
}
