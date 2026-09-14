// DEADRUN 디자인 캔버스 빌드
// 템플릿(*.dc.html.tpl)의 자리표시자를 SVG로 치환한다.
// 좀비 픽셀맵은 복사해 두지 않고 앱 소스에서 직접 읽는다 (sprites.mjs).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { substitute, loadZombieSprites } from './sprites.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

const files = readdirSync(HERE).filter(f => f.endsWith('.dc.html.tpl'));
let n = 0;
for (const f of files) {
  const out = substitute(readFileSync(join(HERE, f), 'utf8'));
  writeFileSync(join(HERE, f.replace(/\.tpl$/, '')), out);
  n++;
  console.log('built', f.replace(/\.tpl$/, ''), `(${out.length} bytes)`);
}
const { sprites } = loadZombieSprites();
console.log(`\n${n}개 아트보드 · 좀비 픽셀맵 ${Object.keys(sprites).length}종을 zombieSprites.ts에서 읽음`);
