import { RoadWay } from '../src/core/roadGraph';

/**
 * 테스트 전용 격자 지형.
 *
 * 예전에는 이것이 게임의 오프라인 폴백("합성 격자 도시")이기도 했으나
 * 2026-09-16에 게임에서는 걷어냈다. 지금 남은 쓰임은 하나뿐이다 —
 * 그래프 빌드·A*·도로 스냅을 검증할 **결정론적 기준 지형**.
 *
 * 실제 OSM 데이터로는 같은 검사를 재현할 수 없다(지역·시점마다 달라진다).
 * 그래서 앱 소스가 아니라 테스트 하네스 쪽에 둔다.
 *
 * 구성: 100m 격자 + 대각 공원길 + 고가 육교(레이어 +1, 레이어 판정 검사용)
 */
export function generateTestGrid(halfSize = 600): RoadWay[] {
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
