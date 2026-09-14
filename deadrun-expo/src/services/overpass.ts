import { LatLon, Vec2, toEnu } from '../core/geo';
import { RoadWay } from '../core/roadGraph';
import { Config } from '../config';

/**
 * OSM 데이터 수신 (Overpass API).
 *
 *  ※ 데이터 출처 표기 의무: OSM은 ODbL 라이선스라 화면에 저작자 표시가 필요하다.
 *     MapScreen 하단의 "© OpenStreetMap contributors"가 그 표기다. 지우지 말 것.
 *
 *  ※ 미러 목록(.env)은 죽은 서버를 넣어두면 그 서버마다 타임아웃을 통째로 버린다.
 *     느려지면 실측으로 점검할 것. 2026-09-14 기준 maps.mail.ru가 가장 안정적.
 */
const ENDPOINTS = Config.overpassEndpoints;

const SPAWN_ALLOWED = new Set([
  'residential', 'living_street', 'pedestrian', 'footway', 'path',
  'track', 'service', 'unclassified', 'steps', 'cycleway',
]);

const HIGHWAY_RE =
  '^(residential|living_street|pedestrian|footway|path|track|service|unclassified|tertiary|secondary|primary|steps|cycleway)$';

interface OverpassWay {
  type: string;
  geometry?: { lat: number; lon: number }[];
  tags?: Record<string, string>;
}

/** 미러를 앞에서부터 시도하고, 전부 실패하면 throw */
async function runQuery(query: string, timeoutMs: number): Promise<OverpassWay[]> {
  const errors: string[] = [];
  for (const endpoint of ENDPOINTS) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // overpass-api.de는 식별 불가한 UA를 406으로 거부함 (사용 정책)
          'User-Agent': 'DEADRUN-prototype/0.1 (personal game prototype)',
          'Accept': 'application/json',
        },
        body: 'data=' + encodeURIComponent(query),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      return (json.elements ?? []) as OverpassWay[];
    } catch (e: unknown) {
      const msg = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
      errors.push(`${endpoint} → ${msg}`);
      console.warn(`[DEADRUN] Overpass 미러 실패: ${endpoint} (${msg})`);
    } finally {
      clearTimeout(timer);
    }
  }
  throw new Error('모든 Overpass 미러 실패:\n' + errors.join('\n'));
}

/** 보행 가능 도로망 (architecture §3.2). 전 미러 실패 시 throw → 합성 폴백 */
export async function fetchRoads(
  center: LatLon, radiusMeters: number, timeoutMs = Config.overpassTimeoutMs,
): Promise<RoadWay[]> {
  const query =
    '[out:json][timeout:10];' +
    `(way["highway"~"${HIGHWAY_RE}"](around:${Math.round(radiusMeters)},${center.lat},${center.lon}););` +
    'out geom tags;';

  const ways: RoadWay[] = [];
  for (const el of await runQuery(query, timeoutMs)) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 2) continue;
    const tags = el.tags ?? {};
    const highway: string = tags.highway ?? 'unknown';
    let layer = 0;
    if (tags.bridge === 'yes') layer = 1;
    if (tags.tunnel === 'yes') layer = -1;
    const l = parseInt(tags.layer, 10);
    if (!isNaN(l)) layer = Math.max(-1, Math.min(1, l)); // 3레이어 모델 (ADR-004)
    ways.push({
      highway,
      layer,
      spawnAllowed: SPAWN_ALLOWED.has(highway) && layer === 0,
      points: el.geometry.map(g => toEnu(center, { lat: g.lat, lon: g.lon })),
    });
  }
  if (ways.length === 0) throw new Error('도로 데이터 없음');
  return ways;
}

/**
 * 건물 외곽선. 도로보다 배가 무거우므로(실측 804KB·9.9초) 게임 시작을 막지 않고
 * 뒤에서 받아 화면에만 덧입힌다. 실패해도 게임에는 지장이 없다.
 */
export async function fetchBuildings(
  center: LatLon, radiusMeters: number, timeoutMs = Config.buildingTimeoutMs,
): Promise<Vec2[][] > {
  const query =
    '[out:json][timeout:20];' +
    `(way["building"](around:${Math.round(radiusMeters)},${center.lat},${center.lon}););` +
    'out geom;';

  const out: Vec2[][] = [];
  for (const el of await runQuery(query, timeoutMs)) {
    if (el.type !== 'way' || !el.geometry || el.geometry.length < 3) continue;
    out.push(el.geometry.map(g => toEnu(center, { lat: g.lat, lon: g.lon })));
    if (out.length >= Config.maxBuildings) break; // 렌더 부하 상한
  }
  return out;
}
