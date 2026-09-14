/// <reference types="node" />
/**
 * 디자인 좀비 아트 → 팔다리 조각 PNG + 관절 좌표: npm run gen:zombies 가 함께 돌린다.
 *
 *  AR에서 좀비가 걸을 때 실제로 팔다리가 움직이게 하려고, 통짜 그림 대신
 *  조각을 따로 굽는다. 조각은 전부 **같은 상자(SPRITE_BOX)** 에 그리므로
 *  앱에서는 판 위치를 계산할 필요 없이 회전축만 알면 된다.
 *
 *  조각 나누는 기준은 src/components/zombieRig.ts 의 표다.
 */
import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { Resvg } from '@resvg/resvg-js';
import { SPRITE_BOX, SPRITE_TYPES, SPRITE_VIEWS } from '../src/components/zombieArtSpec';
import { EXPECTED_ELS, partFile, rig } from '../src/components/zombieRig';

const ART = path.join(__dirname, '..', '..', 'design', 'v2', 'zombie.mjs');
const OUT = path.join(__dirname, '..', 'assets', 'zombies', 'png');
const PIVOTS = path.join(__dirname, '..', 'src', 'components', 'zombiePivots.json');
const REQUIRES = path.join(__dirname, '..', 'src', 'components', 'zombiePartPngs.ts');

/** 조각은 통짜보다 작게 나와도 되지만, 붙였을 때 어긋나면 안 되니 같은 상자에 굽는다 */
const OUT_W = 420;
/** 움직이는 상태만 조각으로 굽는다 (dark 실루엣은 실행 화면 정지 그림이라 통짜면 된다) */
const PART_STATES = ['roam', 'chase'] as const;
/**
 * 잘라낼 때 사방으로 더 두는 여백(아트 단위).
 * 디자인의 림 글로우는 feDropShadow stdDeviation 2.6 이라 3σ ≈ 8 단위까지 번진다.
 */
const RIM_PAD = 9;

/** 최상위 <path>/<g>/<circle>/<ellipse> 요소를 순서대로 뽑는다 */
function topLevel(svg: string): string[] {
  const out: string[] = [];
  let i = 0, depth = 0, start = -1;
  while (i < svg.length) {
    if (svg[i] !== '<') { i++; continue; }
    const end = svg.indexOf('>', i);
    if (end < 0) break;
    const isClose = svg[i + 1] === '/';
    const selfClose = svg[end - 1] === '/';
    if (!isClose) {
      if (depth === 0) start = i;
      if (selfClose) { if (depth === 0) { out.push(svg.slice(start, end + 1)); start = -1; } }
      else depth++;
    } else {
      depth--;
      if (depth === 0 && start >= 0) { out.push(svg.slice(start, end + 1)); start = -1; }
    }
    i = end + 1;
  }
  return out;
}

/** 요소의 시작 좌표 = 그 팔다리의 회전축 */
function startPoint(el: string): { x: number; y: number } {
  const m = el.match(/\sd="M\s*(-?[\d.]+)[ ,](-?[\d.]+)/);
  if (!m) throw new Error(`시작 좌표를 못 찾음: ${el.slice(0, 60)}`);
  return { x: Number(m[1]), y: Number(m[2]) };
}

const { w: bw } = SPRITE_BOX;
const wrap = (inner: string, box: { x: number; y: number; w: number; h: number }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.x} ${box.y} ${box.w} ${box.h}"`
  + ` width="${box.w}" height="${box.h}">${inner}</svg>`;

async function main() {
  if (!fs.existsSync(ART)) {
    console.error(`디자인 아트를 찾지 못했습니다: ${ART}`);
    process.exit(1);
  }
  const mod = await import(pathToFileURL(ART).href) as {
    zombie: (t: string, s: string, o: { view: string }) => string;
  };

  fs.mkdirSync(OUT, { recursive: true });
  const pivots: Record<string, Record<string, { x: number; y: number }>> = {};
  /** 조각마다 잘라낸 상자 (아트 좌표) — 앱이 판 크기와 위치를 여기서 얻는다 */
  const boxes: Record<string, Record<string, { x: number; y: number; w: number; h: number }>> = {};
  let count = 0, bytes = 0;

  for (const type of SPRITE_TYPES) {
    for (const view of SPRITE_VIEWS) {
      // 상태에 상관없이 형태는 같다 — 요소 구조는 그림자 필터가 없는 dark 로 확인한다
      const bare = mod.zombie(type, 'dark', { view })
        .replace(/^<g transform="scale\(1\)">/, '').replace(/<\/g>$/, '');
      const els = topLevel(bare);
      const want = EXPECTED_ELS[view][type];
      if (els.length !== want) {
        console.error(`${type}.${view}: 요소가 ${els.length}개입니다 (표는 ${want}개 기준).`);
        console.error('design/v2/zombie.mjs 의 그림이 바뀌었습니다 — src/components/zombieRig.ts 를 맞춰야 합니다.');
        process.exit(1);
      }

      // 회전축은 형태에서 읽으므로 상태와 무관하다
      const parts = rig(type, view);
      const key = `${type}-${view}`;
      pivots[key] = {};
      for (const p of parts) {
        if (p.pivotEl === undefined) continue;
        pivots[key][p.name] = startPoint(els[p.pivotEl]);
      }

      for (const state of PART_STATES) {
        // 상태별 색·림이 들어간 실제 그림을 다시 뽑아 같은 순서로 쪼갠다
        const full = mod.zombie(type, state, { view });
        const glow = [...full.matchAll(/<ellipse[^>]*\/>/g)].map(m => m[0]).join('');
        const filt = full.match(/<filter[\s\S]*?<\/filter>/)?.[0] ?? '';
        const filtId = filt.match(/id="([^"]+)"/)?.[1];
        const bodyInner = full
          .replace(/^<g transform="scale\(1\)">/, '').replace(/<\/g>$/, '')
          .replace(/<ellipse[^>]*\/>/g, '')
          .replace(/<filter[\s\S]*?<\/filter>/, '')
          .replace(new RegExp(`^<g filter="url\\(#${filtId}\\)">`), '')
          .replace(/<\/g>$/, '');
        const sels = topLevel(bodyInner);
        if (sels.length !== want) {
          console.error(`${type}.${state}.${view}: 상태별 요소가 ${sels.length}개 (기대 ${want}개)`);
          process.exit(1);
        }

        for (const p of parts) {
          // 발밑 글로우는 지면 표시라 몸통 조각에만 넣는다
          const inner =
            (p.name === 'body' ? glow : '') +
            filt +
            (filtId ? `<g filter="url(#${filtId})">` : '') +
            p.els.map(i => sels[i]).join('') +
            (filtId ? '</g>' : '');
          // ① 외곽선이 어디까지인지 먼저 잰다
          const bb = new Resvg(wrap(inner, SPRITE_BOX), { fitTo: { mode: 'original' } }).getBBox();
          if (!bb) { console.error(`빈 조각: ${type}.${state}.${view}.${p.name}`); process.exit(1); }
          // ② 그 상자에 여백을 둘러 다시 굽는다.
          //    getBBox 는 그림자(림 글로우)가 번지는 범위를 못 세기 때문이다 —
          //    여백 없이 자르면 글로우가 모서리에서 잘려 네모난 이음매가 보인다.
          const box = {
            x: bb.x - RIM_PAD, y: bb.y - RIM_PAD,
            w: bb.width + RIM_PAD * 2, h: bb.height + RIM_PAD * 2,
          };
          // 배율은 상자 전체를 구울 때와 똑같이 유지한다 (조각마다 크기가 달라지면 안 된다)
          const png = new Resvg(wrap(inner, box), { fitTo: { mode: 'zoom', value: OUT_W / bw } })
            .render().asPng();
          fs.writeFileSync(path.join(OUT, partFile(type, state, view, p.name)), png);
          (boxes[`${type}-${state}-${view}`] ??= {})[p.name] =
            { x: +box.x.toFixed(2), y: +box.y.toFixed(2), w: +box.w.toFixed(2), h: +box.h.toFixed(2) };
          count++; bytes += png.length;
        }
      }
    }
  }

  fs.writeFileSync(PIVOTS, JSON.stringify({ pivots, boxes }, null, 2) + '\n');
  // Metro 는 require 경로가 리터럴이어야 하므로 목록을 직접 써 준다.
  // 손으로 120줄을 적으면 오타가 나고, 조각이 늘면 또 틀어진다.
  const lines: string[] = [];
  for (const type of SPRITE_TYPES)
    for (const state of PART_STATES)
      for (const view of SPRITE_VIEWS)
        for (const p of rig(type, view))
          lines.push(`  '${type}-${state}-${view}-${p.name}': `
            + `require('../../assets/zombies/png/${partFile(type, state, view, p.name)}'),`);

  fs.writeFileSync(REQUIRES,
    '/**\n'
    + ' * 좀비 조각 PNG 목록 — `npm run gen:zombies` 가 만든다. 직접 고치지 말 것.\n'
    + ' * (Metro 정적 번들링 때문에 require 경로가 리터럴이어야 해서 생성한다)\n'
    + ' */\n\n'
    + 'export const PART_PNG: Record<string, number> = {\n' + lines.join('\n') + '\n};\n');

  console.log(`조각 ${count}개 · 합계 ${(bytes / 1024 / 1024).toFixed(2)}MB`);
  console.log(`require 목록: ${path.relative(process.cwd(), REQUIRES)}`);
  console.log(`관절 좌표: ${path.relative(process.cwd(), PIVOTS)}`);
}

main().catch(e => { console.error(e); process.exit(1); });
