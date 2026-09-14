/** 좌표 변환 — deadrun-expo/src/core/geo.ts와 같은 사양 (툴킷 독립성을 위해 복사) */

export interface Vec2 { x: number; y: number }
export interface LatLon { lat: number; lon: number }

export const R = 6378137.0;
export const D2R = Math.PI / 180;

/** origin 기준 ENU 미터 (x=동, y=북). 수 km 범위에서 equirectangular 근사면 충분 */
export function toEnu(origin: LatLon, p: LatLon): Vec2 {
  return {
    x: (p.lon - origin.lon) * D2R * R * Math.cos(origin.lat * D2R),
    y: (p.lat - origin.lat) * D2R * R,
  };
}

export function fromEnu(origin: LatLon, e: Vec2): LatLon {
  return {
    lat: origin.lat + e.y / R / D2R,
    lon: origin.lon + e.x / (R * Math.cos(origin.lat * D2R)) / D2R,
  };
}

export const distM = (a: LatLon, b: LatLon): number => {
  const e = toEnu(a, b);
  return Math.hypot(e.x, e.y);
};
