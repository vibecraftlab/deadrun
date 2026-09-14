/**
 * 슬리피맵 타일 좌표 (Web Mercator, XYZ) — 지도 서비스가 공통으로 쓰는 격자.
 *
 *  줌 z에서 세상은 2^z × 2^z 칸으로 나뉜다. 위경도를 넣으면 타일 번호가
 *  "계산으로" 나오므로 색인을 뒤질 필요가 없다. 이것이 타일 방식이 빠른 첫 번째 이유다.
 *
 *  이 프로젝트의 저장 단위는 z13(서울 위도에서 약 3.9km)이다.
 *   z12 7.8km  타일이 커서 불필요한 데이터를 많이 받음
 *   z13 3.9km  ← 기본. 플레이 반경 1km면 보통 1~4장이면 충분
 *   z14 1.9km  세밀하지만 전국 파일 수가 2만 개를 넘어 git이 무거워짐
 */
import { LatLon } from './geo';

export const DEFAULT_ZOOM = 13;

export interface TileId { z: number; x: number; y: number }

export const tileKey = (t: TileId): string => `${t.z}/${t.x}/${t.y}`;

export function lonLatToTile(lat: number, lon: number, z: number): TileId {
  const n = 2 ** z;
  const s = Math.sin((lat * Math.PI) / 180);
  return {
    z,
    x: Math.floor(((lon + 180) / 360) * n),
    y: Math.floor(((1 - Math.log((1 + s) / (1 - s)) / (2 * Math.PI)) / 2) * n),
  };
}

export const tileWest = (t: TileId): number => (t.x / 2 ** t.z) * 360 - 180;
export const tileEast = (t: TileId): number => ((t.x + 1) / 2 ** t.z) * 360 - 180;

const tileLat = (yy: number, z: number): number => {
  const a = Math.PI - (2 * Math.PI * yy) / 2 ** z;
  return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(a) - Math.exp(-a)));
};
export const tileNorth = (t: TileId): number => tileLat(t.y, t.z);
export const tileSouth = (t: TileId): number => tileLat(t.y + 1, t.z);

export function tileCenter(t: TileId): LatLon {
  return { lat: (tileNorth(t) + tileSouth(t)) / 2, lon: (tileWest(t) + tileEast(t)) / 2 };
}

/** 타일 한 변의 실제 길이(m) — 위도에 따라 달라진다 */
export function tileSideMeters(t: TileId): number {
  const c = tileCenter(t);
  return (2 * Math.PI * 6378137 * Math.cos((c.lat * Math.PI) / 180)) / 2 ** t.z;
}

/** 사각형 범위를 덮는 타일 목록 */
export function tilesForBBox(
  bbox: { west: number; south: number; east: number; north: number }, z: number,
): TileId[] {
  const a = lonLatToTile(bbox.north, bbox.west, z);
  const b = lonLatToTile(bbox.south, bbox.east, z);
  const out: TileId[] = [];
  for (let x = Math.min(a.x, b.x); x <= Math.max(a.x, b.x); x++)
    for (let y = Math.min(a.y, b.y); y <= Math.max(a.y, b.y); y++) out.push({ z, x, y });
  return out;
}

/**
 * 중심에서 반경 radiusM을 덮는 타일 목록.
 * 플레이어가 타일 경계에 서 있으면 이웃 타일의 도로도 필요하므로 넉넉히 잡는다.
 */
export function tilesAround(center: LatLon, radiusM: number, z: number): TileId[] {
  const latPad = (radiusM / 6378137) * (180 / Math.PI);
  const lonPad = latPad / Math.cos((center.lat * Math.PI) / 180);
  return tilesForBBox({
    west: center.lon - lonPad, east: center.lon + lonPad,
    south: center.lat - latPad, north: center.lat + latPad,
  }, z);
}
