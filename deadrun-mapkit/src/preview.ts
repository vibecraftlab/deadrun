/**
 * 구운 타일을 웹 지도에서 눈으로 확인하기 위한 변환.
 * .drmp 안의 ENU 미터 좌표를 다시 위경도로 바꿔 GeoJSON으로 내보낸다.
 */
import fs from 'fs';
import path from 'path';
import { fromEnu } from './geo';
import { decodePack } from './format';
import { TileId } from './tiles';

export interface GeoJson {
  type: 'FeatureCollection';
  features: {
    type: 'Feature';
    geometry: { type: 'LineString' | 'Polygon'; coordinates: number[][] | number[][][] };
    properties: Record<string, string | number | boolean>;
  }[];
}

export function tileToGeoJson(outDir: string, version: string, t: TileId): GeoJson {
  const file = path.join(outDir, version, String(t.z), String(t.x), `${t.y}.drmp`);
  if (!fs.existsSync(file)) throw new Error('타일 파일이 없습니다');
  const pack = decodePack(new Uint8Array(fs.readFileSync(file)));
  const ll = (p: { x: number; y: number }) => {
    const g = fromEnu(pack.origin, p);
    return [g.lon, g.lat];
  };

  const features: GeoJson['features'] = [];
  for (const w of pack.ways) {
    features.push({
      type: 'Feature',
      geometry: { type: 'LineString', coordinates: w.points.map(ll) },
      properties: { kind: 'road', highway: w.highway, layer: w.layer, spawn: w.spawnAllowed },
    });
  }
  for (const b of pack.buildings) {
    const ring = b.map(ll);
    // GeoJSON 폴리곤은 첫 점과 끝 점이 같아야 한다
    if (ring.length > 0 && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1]))
      ring.push(ring[0]);
    features.push({
      type: 'Feature',
      geometry: { type: 'Polygon', coordinates: [ring] },
      properties: { kind: 'building' },
    });
  }
  return { type: 'FeatureCollection', features };
}

/** 타일 하나의 요약 정보 (미리보기 패널용) */
export function tileSummary(outDir: string, version: string, t: TileId) {
  const file = path.join(outDir, version, String(t.z), String(t.x), `${t.y}.drmp`);
  const pack = decodePack(new Uint8Array(fs.readFileSync(file)));
  const layers: Record<string, number> = { '-1': 0, '0': 0, '1': 0 };
  for (const w of pack.ways) layers[String(w.layer)]++;
  return {
    tile: `${t.z}/${t.x}/${t.y}`,
    bytes: fs.statSync(file).size,
    origin: pack.origin,
    roads: pack.ways.length,
    buildings: pack.buildings.length,
    points: pack.ways.reduce((s, w) => s + w.points.length, 0)
      + pack.buildings.reduce((s, b) => s + b.length, 0),
    layers,
    spawnable: pack.ways.filter(w => w.spawnAllowed).length,
  };
}
