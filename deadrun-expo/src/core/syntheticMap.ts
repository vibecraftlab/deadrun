import { RoadWay } from './roadGraph';

/** 오프라인 폴백용 합성 도시: 100m 격자 + 대각 공원길 + 고가 육교(레이어 +1) */
export function generateSyntheticMap(halfSize = 600): RoadWay[] {
  const ways: RoadWay[] = [];
  const step = 100;
  const n = Math.floor(halfSize / step);

  for (let i = -n; i <= n; i++) {
    const wV: RoadWay = { points: [], highway: 'residential', layer: 0, spawnAllowed: true };
    const wH: RoadWay = { points: [], highway: 'residential', layer: 0, spawnAllowed: true };
    for (let j = -n; j <= n; j++) {
      wV.points.push({ x: i * step, y: j * step });
      wH.points.push({ x: j * step, y: i * step });
    }
    ways.push(wV, wH);
  }

  const park: RoadWay = { points: [], highway: 'footway', layer: 0, spawnAllowed: true };
  for (let i = -n; i <= n; i++) park.points.push({ x: i * step, y: i * step });
  ways.push(park);

  // 고가 육교: 양끝 램프가 지상 격자 노드에 접속 (레이어 판정 테스트용)
  ways.push({
    points: [
      { x: -200, y: 200 },
      { x: -180, y: 205 },
      { x: 180, y: 205 },
      { x: 200, y: 200 },
    ],
    highway: 'footway',
    layer: 1,
    spawnAllowed: false,
  });

  return ways;
}
