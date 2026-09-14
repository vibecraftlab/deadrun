// 픽셀 아트 공용 모듈.
//  - 좀비 스프라이트: deadrun-expo/src/components/zombieSprites.ts 를 직접 읽는다 (복사본 없음)
//  - UI 아이콘: 16×16 1비트 픽셀맵. 이모지를 대체할 아이콘 세트의 원본.
//    확정되면 같은 맵을 scripts/genZombiePngs.ts 와 같은 방식으로 PNG로 굽는다.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const SPRITE_SRC = join(HERE, '..', 'deadrun-expo', 'src', 'components', 'zombieSprites.ts');

function parsePalette(body) {
  const pal = {};
  for (const m of body.matchAll(/(\w+)\s*:\s*'(#[0-9a-fA-F]{3,8})'/g)) pal[m[1]] = m[2];
  return pal;
}

export function loadZombieSprites() {
  const src = readFileSync(SPRITE_SRC, 'utf8');
  const aggroBlock = src.match(/AGGRO_PALETTE[^=]*=\s*\{([^}]*)\}/);
  if (!aggroBlock) throw new Error('AGGRO_PALETTE를 찾지 못했습니다: ' + SPRITE_SRC);

  const sprites = {};
  const re = /(\w+)\s*:\s*\{\s*palette\s*:\s*\{([^}]*)\}\s*,\s*rows\s*:\s*\[([\s\S]*?)\]\s*,?\s*\}/g;
  for (const m of src.matchAll(re)) {
    const rows = [...m[3].matchAll(/'([.A-Z]*)'/g)].map(r => r[1]);
    if (rows.length === 0) continue;
    const w = rows[0].length;
    if (rows.some(r => r.length !== w)) throw new Error(`${m[1]}: 행 길이가 서로 다릅니다`);
    sprites[m[1]] = { palette: parsePalette(m[2]), rows };
  }
  const missing = ['Walker', 'Runner', 'Stalker', 'Brute'].filter(k => !sprites[k]);
  if (missing.length) throw new Error('픽셀맵 파싱 실패 — 누락: ' + missing.join(', '));
  return { aggro: parsePalette(aggroBlock[1]), sprites };
}

// 생존자 — 아직 앱에 없는 신규 제안. 좀비와 같은 12×12 / B·D·E·H 문법.
export const SURVIVOR_SPRITES = {
  Runner_P: {
    palette: { B: '#3d8bff', D: '#255a9e', E: '#dfe3e8', H: '#7fb0ff' },
    rows: [
      '....BBBB....', '...BEEEEB...', '...BBBBBB...', '....BDDB....',
      '..HBBBBBBH..', '..HBBDDBBH..', '..HBBBBBBH..', '...BBDDBB...',
      '....BBBB....', '....B..B....', '...BB..BB...', '...BB..BB...',
    ],
  },
  Scout_P: {
    palette: { B: '#4dc3ff', D: '#2b7ba6', E: '#dfe3e8', H: '#9ee0ff' },
    rows: [
      '...BBBBBB...', '..HBEEEEBH..', '...BBBBBB...', '....BDDB....',
      '...BBBBBB...', '..BBBDDBBB..', '..HBBBBBBH..', '...BDDDDB...',
      '....BBBB....', '....B..B....', '...BB...B...', '..BB....BB..',
    ],
  },
  Medic_P: {
    palette: { B: '#7fd8a0', D: '#3f8a60', E: '#dfe3e8', H: '#b8f0cc' },
    rows: [
      '....BBBB....', '...BEEEEB...', '...BBBBBB...', '....BDDB....',
      '..HBBBBBBH..', '..HBBDDBBH..', '..HBBDDBBH..', '...BBBBBB...',
      '....BBBB....', '....B..B....', '...BB..BB...', '...BB..BB...',
    ],
  },
};

/** UI 아이콘 — 16×16, X = 켜짐. 단색이라 방향별 테마 색을 그대로 입힌다. */
export const ICONS = {
  // 방향 표시 (위쪽 기준. 좌우는 CSS transform 으로 돌린다)
  arrow: [
    '................', '................', '................', '.......XX.......',
    '......XXXX......', '......XXXX......', '.....XXXXXX.....', '.....XXXXXX.....',
    '....XXXXXXXX....', '....XXXXXXXX....', '...XXXXXXXXXX...', '...XXXXXXXXXX...',
    '..XXXXXXXXXXXX..', '..XXXXXXXXXXXX..', '................', '................',
  ],
  // 스캔 — 동심원
  scan: [
    '................', '................', '.....XXXXXX.....', '...XX......XX...',
    '..X..........X..', '..X...XXXX...X..', '.X...XX..XX...X.', '.X...X.XX.X...X.',
    '.X...X.XX.X...X.', '.X...XX..XX...X.', '..X...XXXX...X..', '..X..........X..',
    '...XX......XX...', '.....XXXXXX.....', '................', '................',
  ],
  // 경고 — 속을 파낸 느낌표
  warn: [
    '................', '.......XX.......', '.......XX.......', '......XXXX......',
    '......X..X......', '.....XX..XX.....', '.....XX..XX.....', '....XXX..XXX....',
    '....XXX..XXX....', '...XXXX..XXXX...', '...XXXXXXXXXX...', '..XXXXX..XXXXX..',
    '..XXXXX..XXXXX..', '.XXXXXXXXXXXXXX.', '.XXXXXXXXXXXXXX.', '................',
  ],
  // 위치 핀
  pin: [
    '................', '.....XXXXXX.....', '...XXXXXXXXXX...', '..XXXX....XXXX..',
    '..XXX......XXX..', '..XXX......XXX..', '..XXXX....XXXX..', '...XXXXXXXXXX...',
    '....XXXXXXXX....', '.....XXXXXX.....', '......XXXX......', '......XXXX......',
    '.......XX.......', '.......XX.......', '................', '................',
  ],
  // 탄약
  ammo: [
    '................', '................', '......XXXX......', '.....XXXXXX.....',
    '.....XXXXXX.....', '....XXXXXXXX....', '....XXXXXXXX....', '....XX....XX....',
    '....XXXXXXXX....', '....XXXXXXXX....', '....XX....XX....', '....XXXXXXXX....',
    '....XXXXXXXX....', '....XXXXXXXX....', '................', '................',
  ],
  // 현재 위치 복귀 — 조준 원
  recenter: [
    '................', '.......XX.......', '.....XXXXXX.....', '....XX.XX.XX....',
    '...XX..XX..XX...', '...X...XX...X...', '.XXX...XX...XXX.', '.XXX...XX...XXX.',
    '...X...XX...X...', '...XX..XX..XX...', '....XX.XX.XX....', '.....XXXXXX.....',
    '.......XX.......', '................', '................', '................',
  ],
};

for (const [k, rows] of Object.entries(ICONS)) {
  if (rows.length !== 16 || rows.some(r => r.length !== 16)) {
    throw new Error(`아이콘 ${k}: 16×16이 아닙니다 (${rows.length}행)`);
  }
}

/** 행 단위 런렝스로 rect를 합쳐 SVG로 만든다. */
function gridSvg(rows, colorAt, size) {
  const w = rows[0].length, h = rows.length;
  const rects = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === '.') { x++; continue; }
      let run = 1;
      while (x + run < row.length && row[x + run] === c) run++;
      rects.push(`<rect x="${x}" y="${y}" width="${run}" height="1" fill="${colorAt(c)}"/>`);
      x += run;
    }
  });
  const scale = size / Math.max(w, h);
  return `<svg viewBox="0 0 ${w} ${h}" width="${Math.round(w * scale)}" height="${Math.round(h * scale)}"`
    + ` shape-rendering="crispEdges" style="display:block;overflow:visible">${rects.join('')}</svg>`;
}

export function makeRenderers() {
  const { aggro, sprites: zs } = loadZombieSprites();
  const sprites = { ...zs, ...SURVIVOR_SPRITES };

  const zombie = (key, useAggro, size, override) => {
    const def = sprites[key];
    if (!def) throw new Error('알 수 없는 좀비: ' + key);
    const pal = override || (useAggro ? aggro : def.palette);
    return gridSvg(def.rows, c => pal[c] || '#ff00ff', size);
  };

  const icon = (name, color, size) => {
    const rows = ICONS[name];
    if (!rows) throw new Error('알 수 없는 아이콘: ' + name);
    return gridSvg(rows, () => color, size);
  };

  return { zombie, icon, sprites, aggro };
}

/**
 * 템플릿의 자리표시자를 치환한다.
 *   <!--SPRITE:Walker:aggro:120-->
 *   <!--SPRITE:Walker:base:120:#121212,#121212,#FF5B04,#121212-->   B/D/E/H 순서로 색 덮어쓰기
 *   <!--ICON:arrow:#39FF88:32-->
 */
export function substitute(src) {
  const { zombie, icon } = makeRenderers();
  return src
    .replace(/<!--SPRITE:([A-Za-z_]+):(base|aggro):(\d+)(?::([^>]+?))?-->/g,
      (_m, key, variant, size, override) => {
        let pal = null;
        if (override) {
          const parts = override.split(',').map(s => s.trim());
          if (parts.length !== 4) throw new Error(`${key}: 색 덮어쓰기는 B,D,E,H 4개여야 합니다`);
          pal = { B: parts[0], D: parts[1], E: parts[2], H: parts[3] };
        }
        return zombie(key, variant === 'aggro', Number(size), pal);
      })
    .replace(/<!--ICON:([a-z]+):(#[0-9a-fA-F]{3,8}):(\d+)-->/g,
      (_m, name, color, size) => icon(name, color, Number(size)));
}
