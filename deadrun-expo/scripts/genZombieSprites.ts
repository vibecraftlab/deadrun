/// <reference types="node" />
/**
 * 디자인 좀비 아트 → 앱 렌더용 PNG 스프라이트: npm run gen:zombies
 *
 *  원본은 design/v2/zombie.mjs 의 벡터 아트다 (4종 × 3방향 × 상태별 색).
 *  앱은 이것을 PNG로 구워서 쓴다 — 지도에는 수십 마리가 동시에 뜨고 AR에서는
 *  three.js 텍스처로 올라가는데, 좀비 한 마리가 path 20~30개라
 *  벡터 그대로 매 프레임 그리면 둘 다 감당이 안 된다.
 *  (같은 이유로 예전 픽셀 아트도 PNG로 구웠다 — 렌더 비용 ~1/100)
 *
 *  아트를 고치려면 design/v2/zombie.mjs 를 고치고 이 스크립트를 다시 돌린다.
 *  design 저장소가 없으면 스킵한다 — 구워진 PNG는 저장소에 함께 들어간다.
 */
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { Resvg } from '@resvg/resvg-js';
import { SPRITE_BOX, SPRITE_STATES, SPRITE_TYPES, SPRITE_VIEWS, spriteFile } from '../src/components/zombieArtSpec';

const ART = path.join(__dirname, '..', '..', 'design', 'v2', 'zombie.mjs');
const OUT = path.join(__dirname, '..', 'assets', 'zombies', 'png');

/** 출력 가로 픽셀 — AR에서 코앞의 좀비가 화면 절반을 채워도 뭉개지지 않을 정도 */
const OUT_W = 480;

async function main() {
  if (!fs.existsSync(ART)) {
    console.error(`디자인 아트를 찾지 못했습니다: ${ART}`);
    console.error('design 저장소가 함께 있어야 스프라이트를 다시 구울 수 있습니다.');
    process.exit(1);
  }

  const mod = await import(pathToFileURL(ART).href) as {
    zombie: (type: string, state: string, opt: { view: string; scale?: number }) => string;
  };

  fs.mkdirSync(OUT, { recursive: true });
  const { x, y, w, h } = SPRITE_BOX;
  let count = 0;
  let bytes = 0;

  for (const type of SPRITE_TYPES) {
    for (const state of SPRITE_STATES) {
      for (const view of SPRITE_VIEWS) {
        const svg =
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" ` +
          `width="${w}" height="${h}">${mod.zombie(type, state, { view })}</svg>`;
        const png = new Resvg(svg, { fitTo: { mode: 'width', value: OUT_W } }).render().asPng();
        const file = path.join(OUT, spriteFile(type, state, view));
        fs.writeFileSync(file, png);
        count++;
        bytes += png.length;
      }
    }
  }
  console.log(`${count}개 생성 · 합계 ${(bytes / 1024).toFixed(0)}KB · ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
