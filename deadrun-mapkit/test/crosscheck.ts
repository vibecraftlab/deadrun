/**
 * 툴킷과 앱의 포맷 구현이 정말 같은 바이트를 만드는가.
 *
 *  deadrun-mapkit/src/format.ts 와 deadrun-expo/src/core/mapPack.ts 는
 *  **바이트 단위로 같아야** 한다. 한쪽만 고치면 앱이 타일을 통째로 잘못 읽는데,
 *  헤더 크기가 어긋나 조용히 깨졌던 전례가 있다. 사람 눈으로 두 파일을 비교하는 대신
 *  둘 다 돌려서 결과를 맞춰본다.
 *
 *  npx tsx test/crosscheck.ts
 */
import { decodePack, encodePack, RoadWay } from '../src/format';
import {
  decodeMapPack, encodeMapPack, VERSION as APP_VERSION,
} from '../../deadrun-expo/src/core/mapPack';

let fail = 0;
const check = (cond: boolean, name: string) => {
  console.log((cond ? '[PASS] ' : '[FAIL] ') + name);
  if (!cond) fail++;
};

const origin = { lat: 37.5608, lon: 126.8393 };
const t = { z: 13, x: 6982, y: 3172 };

const ways: RoadWay[] = [
  { highway: 'footway', layer: 0, spawnAllowed: true, points: [{ x: 0, y: 0 }, { x: 40, y: 12.5 }] },
  { highway: 'primary', layer: 1, spawnAllowed: false, points: [{ x: -80, y: 3 }, { x: 5, y: -9 }, { x: 60, y: 44 }] },
  { highway: 'steps', layer: -1, spawnAllowed: true, points: [{ x: 7, y: 7 }, { x: 9, y: 11 }] },
];
const sq = (x: number, y: number) => [
  { x, y }, { x: x + 10, y }, { x: x + 10, y: y + 10 }, { x, y: y + 10 }, { x, y },
];
const buildings = [sq(0, 0), sq(50, 0), sq(100, 0), sq(150, 0)];
const buildingNames = ['서울갈산초등학교', undefined, '101동', '101동'];

check(APP_VERSION === 2, `앱 VERSION = 2 (${APP_VERSION})`);

const a = encodePack(origin, ways, buildings, { tile: t, buildingNames });
const b = encodeMapPack(origin, ways, buildings, { tile: t, buildingNames });

check(a.byteLength === b.byteLength, `같은 길이 (${a.byteLength} vs ${b.byteLength}B)`);
let diff = -1;
for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] !== b[i]) { diff = i; break; }
check(diff === -1, diff === -1 ? '바이트가 완전히 같다' : `${diff}번째 바이트가 다르다 (${a[diff]} vs ${b[diff]})`);

// 서로 교차로 읽어도 같은 결과여야 한다
const byApp = decodeMapPack(a);
const byKit = decodePack(b);
check(byApp.ways.length === byKit.ways.length && byApp.ways.length === ways.length,
  `도로 수 일치 (${byApp.ways.length})`);
check(byApp.buildings.length === byKit.buildings.length,
  `건물 수 일치 (${byApp.buildings.length})`);
check(JSON.stringify(byApp.buildingNames) === JSON.stringify(byKit.buildingNames),
  `건물 이름 일치 (${JSON.stringify(byApp.buildingNames)})`);
check(byApp.ways[1].layer === 1 && byKit.ways[1].layer === 1, '고가 레이어 보존');
check(byApp.ways[2].highway === 'steps' && byKit.ways[2].highway === 'steps', '도로 종류 보존');

// v1 파일(이름 없음)도 양쪽 다 읽을 수 있어야 한다 — 이미 구워둔 타일을 버리지 않는다
const v1 = encodePack(origin, ways, buildings, { tile: t });
v1[4] = 1;                                  // 버전만 1로 되돌린다
const v1kit = decodePack(v1);
const v1app = decodeMapPack(v1);
check(v1kit.buildings.length === buildings.length && v1app.buildings.length === buildings.length,
  'v1 팩도 양쪽에서 읽힌다');
check(v1kit.buildingNames.every(n => n === undefined)
  && v1app.buildingNames.every(n => n === undefined), 'v1 팩은 이름이 전부 비어 있다');

console.log(fail === 0 ? '\n=== 전체 통과 ===' : `\n=== 실패 ${fail}건 ===`);
process.exit(fail === 0 ? 0 : 1);
