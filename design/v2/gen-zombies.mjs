// 좀비 종합 시트 생성 — 4종 × 3방향 × 2상태 + 수치표 + 감지 부채꼴 비교.
// node gen-zombies.mjs → Zombies.dc.html.tpl
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { zombie } from './zombie.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));

// core/zombies.ts · core/rules.ts 의 실제 수치
const DATA = [
  { key: 'walker',  ko: '워커',   en: 'WALKER',  speed: 3,  detect: 40, fov: 120, hp: 2, dmg: 10, spawn: 60,
    trait: '없음', note: '기본 개체. 느리지만 60%를 차지해 도시의 밀도를 만든다. 곧게 서서 두 팔을 앞으로 뻗는다.' },
  { key: 'runner',  ko: '러너',   en: 'RUNNER',  speed: 12, detect: 60, fov: 150, hp: 3, dmg: 8,  spawn: 20,
    trait: '45초 후 지침 → 5km/h', note: '상체를 깊게 숙인 질주 자세. 평균 러닝 속도보다 빠르니 버텨서 지치게 만드는 게 답이다.' },
  { key: 'stalker', ko: '스토커', en: 'STALKER', speed: 7,  detect: 90, fov: 360, hp: 2, dmg: 14, spawn: 15,
    trait: '스텔스 · 전방위 감지', note: '낮게 웅크려 긴 팔로 땅을 짚고 기어온다. 시야각이 360도라 등 뒤로 돌아가도 소용없다.' },
  { key: 'brute',   ko: '브루트', en: 'BRUTE',   speed: 5,  detect: 50, fov: 100, hp: 8, dmg: 30, spawn: 5,
    trait: '근접 면역', note: '거대한 상체에 머리가 어깨에 파묻혔다. 한 방에 30을 깎아 네 번이면 죽는다. 총이 아니면 도주뿐.' },
];

const VIEWS = [['front', '정면'], ['side', '측면'], ['back', '뒷모습']];
const CW = 108, CH = 132;

function cell(t, state, view, label) {
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:${CW}px;height:${CH}px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="${CW}" height="${CH}" viewBox="${-CW / 2} ${-CH + 16} ${CW} ${CH}">${zombie(t, state, { view, scale: 0.92 })}</svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">${label}</div>
  </div>`;
}

const stat = (k, v, c = '#fff') =>
  `<div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">${k}</span>
     <span style="color:${c};font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">${v}</span>
   </div>`;

const rows = DATA.map(d => `
  <div style="display:flex;flex-direction:row;gap:16px;align-items:flex-start;padding:16px 0;border-top:1px solid rgba(255,255,255,0.07)">
    <div style="width:250px;flex-shrink:0">
      <div style="display:flex;align-items:baseline;gap:8px">
        <div style="color:#fff;font-size:19px;font-weight:800;letter-spacing:-0.3px">${d.en}</div>
        <div style="color:rgba(255,255,255,0.45);font-size:12px;font-weight:700">${d.ko}</div>
        <div style="margin-left:auto;background:rgba(255,255,255,0.07);border-radius:6px;padding:2px 7px;
          color:rgba(255,255,255,0.5);font-size:10px;font-weight:800">${d.spawn}%</div>
      </div>
      <div style="color:rgba(255,255,255,0.5);font-size:11px;line-height:16.5px;margin-top:7px">${d.note}</div>
      <div style="margin-top:10px">
        ${stat('추격 속도', `${d.speed} km/h`, d.speed >= 12 ? '#FF7D9B' : '#fff')}
        ${stat('배회 속도', '3 km/h')}
        ${stat('감지 거리', `${d.detect} m`, d.detect >= 90 ? '#2FD9FF' : '#fff')}
        ${stat('시야각', d.fov >= 360 ? '360° 전방위' : `${d.fov}°`, d.fov >= 360 ? '#2FD9FF' : '#fff')}
        ${stat('체력', d.hp, d.hp >= 8 ? '#FF7D9B' : '#fff')}
        ${stat('공격력', d.dmg, d.dmg >= 30 ? '#FF2E5B' : '#fff')}
        ${stat('특성', d.trait, d.trait === '없음' ? 'rgba(255,255,255,0.35)' : '#FFC53D')}
      </div>
    </div>
    <div>
      <div style="color:#FF7D9B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">추격</div>
      <div style="display:flex;gap:9px">${VIEWS.map(([v, kv]) => cell(d.key, 'chase', v, kv)).join('')}</div>
    </div>
    <div>
      <div style="color:#7CFF5B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">배회</div>
      <div style="display:flex;gap:9px">${VIEWS.map(([v, kv]) => cell(d.key, 'roam', v, kv)).join('')}</div>
    </div>
  </div>`).join('');

// ── 감지 부채꼴 비교 ──
const PXM = 1.5; // 1m = 1.5px
function coneSvg(d) {
  const r = d.detect * PXM;
  const col = '#e3323220', edge = '#e3323238';
  let shape;
  if (d.fov >= 360) {
    shape = `<circle cx="0" cy="0" r="${r}" fill="${col}"/><circle cx="0" cy="0" r="${r}" fill="none" stroke="${edge}" stroke-width="1.2" stroke-dasharray="3 5"/>`;
  } else {
    const half = (d.fov / 2) * Math.PI / 180;
    const ex = r * Math.sin(half), ey = -r * Math.cos(half);
    const large = d.fov > 180 ? 1 : 0;
    const path = `M0,0 L${(-ex).toFixed(1)},${ey.toFixed(1)} A${r},${r} 0 ${large} 1 ${ex.toFixed(1)},${ey.toFixed(1)} Z`;
    shape = `<path d="${path}" fill="${col}"/><path d="${path}" fill="none" stroke="${edge}" stroke-width="1.2"/>`;
  }
  const W = 250, H = 232;
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:7px">
    <div style="width:${W}px;height:${H}px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden">
      <svg width="${W}" height="${H}" viewBox="${-W / 2} ${-H + 62} ${W} ${H}">
        <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
          ${[25, 50, 75, 100].map(m => `<circle cx="0" cy="0" r="${m * PXM}" fill="none"/>`).join('')}
        </g>
        <g transform="translate(0 0)">${shape}</g>
        <g transform="translate(0 0)">${zombie(d.key, 'roam', { view: 'front', scale: 0.62 })}</g>
        <text x="0" y="${(-d.detect * PXM - 8).toFixed(0)}" text-anchor="middle" fill="#E35B5B" font-size="11"
          font-weight="800" font-family="Outfit, sans-serif">${d.detect}m</text>
      </svg>
    </div>
    <div style="color:#fff;font-size:12px;font-weight:800">${d.ko}</div>
    <div style="color:rgba(255,255,255,0.4);font-size:10.5px;font-weight:600">${d.fov >= 360 ? '전방위' : d.fov + '°'} · ${d.detect}m</div>
  </div>`;
}

const body = `
<div style="width:1360px;height:1660px;background:#070A14;padding:30px;overflow:hidden;display:flex;flex-direction:column">

  <div style="display:flex;align-items:flex-end;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px">
    <div>
      <div style="display:flex;align-items:baseline;gap:13px">
        <div style="color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.8px">좀비 4종</div>
        <div style="color:rgba(255,255,255,0.45);font-size:14px;font-weight:600">타입 × 상태 × 방향</div>
      </div>
      <div style="color:rgba(255,255,255,0.42);font-size:12px;margin-top:7px">
        수치는 core/zombies.ts · core/rules.ts 그대로. 형태가 곧 타입이고, 색은 상태만 나타낸다.
      </div>
    </div>
    <div style="display:flex;gap:18px">
      <div style="display:flex;align-items:center;gap:7px">
        <div style="width:9px;height:9px;border-radius:5px;background:#FF2E5B;box-shadow:0 0 9px #FF2E5B"></div>
        <span style="color:rgba(255,255,255,0.6);font-size:11.5px;font-weight:700">추격</span>
      </div>
      <div style="display:flex;align-items:center;gap:7px">
        <div style="width:9px;height:9px;border-radius:5px;background:#7CFF5B"></div>
        <span style="color:rgba(255,255,255,0.6);font-size:11.5px;font-weight:700">배회</span>
      </div>
    </div>
  </div>

  ${rows}

  <div style="margin-top:22px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1)">
    <div style="display:flex;align-items:baseline;gap:12px">
      <div style="color:#fff;font-size:18px;font-weight:800">인지 범위</div>
      <div style="color:rgba(255,255,255,0.45);font-size:12px">바라보는 방향 ± 시야각/2, 감지 거리까지. 이 안에 들어가면 발견된다.</div>
    </div>
    <div style="display:flex;gap:16px;margin-top:14px">
      ${DATA.map(coneSvg).join('')}
      <div style="flex-grow:1;padding-left:8px">
        <div class="eyebrow">지도 표기</div>
        <div style="color:rgba(255,255,255,0.55);font-size:11.5px;line-height:18px;margin-top:9px">
          플레이어의 파란 부채꼴과 같은 방식으로 좀비 부채꼴을 붉게 그린다. 배회 중이면 옅게, 추격 중이면 진하게 칠한다.
        </div>
        <div style="display:flex;flex-direction:column;gap:9px;margin-top:14px">
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:26px;height:14px;border-radius:3px;background:#3d8bff3d;border:1px solid #3d8bff66"></div>
            <span style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700">플레이어 · #3d8bff3d</span>
          </div>
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:26px;height:14px;border-radius:3px;background:#e3323220;border:1px solid #e3323238"></div>
            <span style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700">좀비 배회 · #e3323220</span>
          </div>
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:26px;height:14px;border-radius:3px;background:#ff2b2b3a;border:1px solid #ff2b2b66"></div>
            <span style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700">좀비 추격 · #ff2b2b3a</span>
          </div>
        </div>
        <div style="color:rgba(255,255,255,0.32);font-size:10.5px;line-height:16px;margin-top:14px">
          스토커는 시야각이 360도라 부채꼴이 아니라 원으로 그린다. 레이더에서는 0.5초 주기로 깜빡여 위치를 확신할 수 없다.
        </div>
      </div>
    </div>
  </div>
</div>`;

const head = readFileSync(join(HERE, '_head.txt'), 'utf8');
const tail = readFileSync(join(HERE, '_tail.txt'), 'utf8');
writeFileSync(join(HERE, 'Zombies.dc.html.tpl'), head + body + '\n' + tail);
console.log('Zombies.dc.html.tpl 씀');
