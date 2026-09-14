/** 순수 TS 코어 — React/Expo 비의존 (Unity 프로토타입 Core의 포팅) */

export interface Vec2 { x: number; y: number }
export interface LatLon { lat: number; lon: number }

export const v = (x: number, y: number): Vec2 => ({ x, y });
export const add = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (a: Vec2, s: number): Vec2 => ({ x: a.x * s, y: a.y * s });
export const len = (a: Vec2): number => Math.hypot(a.x, a.y);
export const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.y - b.y);
export const sqrDist = (a: Vec2, b: Vec2): number => (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
export const dot = (a: Vec2, b: Vec2): number => a.x * b.x + a.y * b.y;
export const norm = (a: Vec2): Vec2 => {
  const l = len(a);
  return l < 1e-9 ? { x: 0, y: 0 } : { x: a.x / l, y: a.y / l };
};
export const lerp = (a: Vec2, b: Vec2, t: number): Vec2 => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

const R = 6378137.0;
const D2R = Math.PI / 180;

/** origin 기준 ENU 미터 좌표 (x=동, y=북). 반경 ~2km에서 equirectangular 근사면 충분 */
export function toEnu(origin: LatLon, p: LatLon): Vec2 {
  return {
    x: (p.lon - origin.lon) * D2R * R * Math.cos(origin.lat * D2R),
    y: (p.lat - origin.lat) * D2R * R,
  };
}

export function fromEnu(origin: LatLon, e: Vec2): LatLon {
  return {
    lat: origin.lat + (e.y / R) / D2R,
    lon: origin.lon + (e.x / (R * Math.cos(origin.lat * D2R))) / D2R,
  };
}
