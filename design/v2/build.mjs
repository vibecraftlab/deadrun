// v2 아트 디렉션 빌드.
//   <!--OSMMAP-->                            실제 .drmp 타일에서 뽑은 OSM 도형 (osm-export.ts 생성)
//   <!--ZOMBIE:type:state:view:scale:flip-->  타입 walker|runner|stalker|brute
//                                            상태 roam|chase|dark|mono · 방향 front|side|back
//   <!--STATBAR:주행|평균|현재|HP|HP칸|탄약|탄약칸-->  상단 스탯 바
//   <!--ICON:name-->                          공용 아이콘
//   <!--GUNPICKUP:scale-->                    지도 위 총기 보급 마커
//   <!--CSS-->                                공용 스타일
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { zombie } from './zombie.mjs';
import { CSS, statbar, icon, gunPickup } from './ui.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

function substitute(src) {
  let out = src;

  if (out.includes('<!--OSMMAP-->')) {
    const p = join(HERE, 'osm-map.svg.html');
    if (!existsSync(p)) {
      throw new Error('osm-map.svg.html 이 없습니다. deadrun-mapkit 에서 npx tsx ../design/v2/osm-export.ts 를 먼저 실행하세요.');
    }
    out = out.replaceAll('<!--OSMMAP-->', readFileSync(p, 'utf8'));
  }

  out = out.replaceAll('<!--CSS-->', CSS);
  out = out.replace(/<!--ZOMBIE:([a-z]+):([a-z]+):([a-z]+):([\d.]+):([01])-->/g,
    (_m, type, state, view, scale, flip) =>
      zombie(type, state, { view, scale: Number(scale), flip: flip === '1' }));
  out = out.replace(/<!--STATBAR:([^>]+?)-->/g, (_m, args) => statbar(args.split('|')));
  out = out.replace(/<!--ICON:([a-z]+)-->/g, (_m, n) => icon(n));
  out = out.replace(/<!--GUNPICKUP:([\d.]+)-->/g, (_m, s) => gunPickup(Number(s)));

  const left = out.match(/<!--(?:OSMMAP|ZOMBIE|STATBAR|ICON|GUNPICKUP|CSS)[^>]*-->/);
  if (left) throw new Error('치환되지 않은 자리표시자: ' + left[0]);
  return out;
}

let n = 0;
for (const f of readdirSync(HERE).filter(f => f.endsWith('.dc.html.tpl'))) {
  const out = substitute(readFileSync(join(HERE, f), 'utf8'));
  writeFileSync(join(HERE, f.replace(/\.tpl$/, '')), out);
  n++;
  console.log('built', f.replace(/\.tpl$/, ''), `(${(out.length / 1024).toFixed(1)}KB)`);
}
console.log(`\n${n}개 아트보드`);
