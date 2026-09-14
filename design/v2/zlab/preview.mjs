import { writeFileSync } from 'node:fs';
import { zombie } from '../zombie.mjs';

const cell = (label, inner, w, h, bg) => `
<div style="display:flex;flex-direction:column;align-items:center;gap:5px">
  <div style="width:${w}px;height:${h}px;background:${bg};border-radius:10px;display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
    <svg width="${w}" height="${h}" viewBox="${-w/2} ${-h+20} ${w} ${h}">${inner}</svg>
  </div>
  <div style="color:#8A93A8;font:600 10.5px system-ui">${label}</div>
</div>`;

const TY = [['walker','워커'],['runner','러너'],['stalker','스토커'],['brute','브루트']];
const VW = [['front','정면'],['side','측면'],['back','뒷모습']];

const grid = TY.map(([t, kt]) =>
  `<div style="display:flex;gap:10px">` +
  VW.map(([v, kv]) =>
    cell(`${kt} ${kv}`, zombie(t, 'chase', { view: v, scale: 1.25 }), 150, 168, '#131A2F')
  ).join('') + `</div>`
).join('');

writeFileSync(new URL('preview.html', import.meta.url), `<!doctype html><meta charset="utf-8">
<body style="margin:0;background:#0B1020;padding:18px;display:grid;grid-template-columns:repeat(2,max-content);gap:18px">
${grid}
</body>`);
console.log('preview.html');
