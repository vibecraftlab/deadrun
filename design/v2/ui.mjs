// 화면들이 공유하는 UI 조각. build.mjs 가 자리표시자로 끼워 넣는다.

export const CSS = `
    body { margin: 0; background: #070A14;
      font-family: "Outfit", -apple-system, "Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
    a { color: #2FD9FF; text-decoration: none; }
    a:hover { color: #8BE9FF; }
    .glass { background: rgba(11,16,32,0.74); border: 1px solid rgba(255,255,255,0.10);
      box-shadow: 0 10px 30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.15);
      backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
    .stat-lbl { font-size: 8.5px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase;
      color: rgba(255,255,255,0.48); }
    .stat-val { font-size: 27px; font-weight: 800; color: #fff; line-height: 29px; letter-spacing: -0.8px;
      font-variant-numeric: tabular-nums; }
    .stat-unit { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.45); margin-left: 1px; }
    .stat-sub { font-size: 9.5px; font-weight: 600; color: rgba(255,255,255,0.52); margin-top: 3px;
      font-variant-numeric: tabular-nums; }
    .divider { width: 1px; align-self: stretch; margin: 4px 0;
      background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.14) 50%, rgba(255,255,255,0) 100%); }
    .rbtn { width: 58px; height: 58px; border-radius: 29px;
      background: linear-gradient(180deg, rgba(62,78,126,0.92) 0%, rgba(24,32,58,0.94) 100%);
      border: 1px solid rgba(255,255,255,0.16);
      box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22);
      display: flex; align-items: center; justify-content: center; position: relative; }
    .rbtn-cap { position: absolute; bottom: -16px; left: 0; right: 0; text-align: center;
      font-size: 9px; font-weight: 700; color: rgba(255,255,255,0.62); letter-spacing: 0.4px; }
    .cta { border-radius: 16px; padding: 17px; text-align: center; font-size: 16px; font-weight: 800; color: #062330;
      background: linear-gradient(180deg, #5FE4FF 0%, #0E96D2 100%);
      border: 1px solid rgba(255,255,255,0.42);
      box-shadow: 0 10px 26px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.45); }
    .ghost { border-radius: 16px; padding: 15px; text-align: center; font-size: 14.5px; font-weight: 700; color: #fff;
      background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.14); }
    .eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase;
      color: rgba(255,255,255,0.42); }
`;

const pips = (on, total, color) => {
  let out = '';
  for (let i = 0; i < total; i++) {
    out += `<div style="flex-grow: 1; height: 3.5px; border-radius: 2px; background: ${i < on ? color : 'rgba(255,255,255,0.15)'}"></div>`;
  }
  return `<div style="display: flex; gap: 2.5px; margin-top: 8px; padding: 0 10px">${out}</div>`;
};

/** 상단 스탯 바 — 주행거리(밑에 평균·현재 속도) · 목숨 · 탄약 */
export function statbar([dist, avg, cur, hp, hpOn, ammo, ammoOn]) {
  const hpColor = Number(hp) <= 30 ? '#FF2E5B' : '#FFFFFF';
  return `<div class="glass" style="position: absolute; top: 58px; left: 12px; right: 12px; border-radius: 22px; padding: 11px 6px 12px">
    <div style="display: flex; flex-direction: row; align-items: stretch">
      <div style="flex-grow: 1.25; flex-basis: 0; text-align: center; padding: 0 4px">
        <div class="stat-lbl" style="color: #2FD9FF">주행</div>
        <div class="stat-val" style="margin-top: 4px">${dist}<span class="stat-unit">km</span></div>
        <div class="stat-sub">평균 ${avg} · 현재 ${cur}<span style="color: rgba(255,255,255,0.34)"> km/h</span></div>
      </div>
      <div class="divider"></div>
      <div style="flex-grow: 1; flex-basis: 0; text-align: center; padding: 0 4px">
        <div class="stat-lbl" style="color: #FF7D9B">목숨</div>
        <div class="stat-val" style="margin-top: 4px; color: ${hpColor}">${hp}</div>
        ${pips(Number(hpOn), 5, '#FF2E5B')}
      </div>
      <div class="divider"></div>
      <div style="flex-grow: 1; flex-basis: 0; text-align: center; padding: 0 4px">
        <div class="stat-lbl" style="color: #FFC53D">탄약</div>
        <div class="stat-val" style="margin-top: 4px">${ammo}</div>
        ${pips(Number(ammoOn), 5, '#FFC53D')}
      </div>
    </div>
  </div>`;
}

const ICONS = {
  scan: `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#2FD9FF" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="2.4" fill="#2FD9FF" stroke="none"/>
      <path d="M7.2 16.8a6.8 6.8 0 0 1 0-9.6"/><path d="M16.8 7.2a6.8 6.8 0 0 1 0 9.6"/>
      <path d="M4.1 19.9a11.2 11.2 0 0 1 0-15.8" opacity="0.55"/><path d="M19.9 4.1a11.2 11.2 0 0 1 0 15.8" opacity="0.55"/></svg>`,
  fire: `<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#FFC53D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2" fill="#FFC53D" stroke="none"/>
      <path d="M12 1.8v3.4M12 18.8v3.4M1.8 12h3.4M18.8 12h3.4"/></svg>`,
  ar: `<svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#062330" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 8.4V5.6A2.6 2.6 0 0 1 5.6 3h2.8M15.6 3h2.8A2.6 2.6 0 0 1 21 5.6v2.8M21 15.6v2.8a2.6 2.6 0 0 1-2.6 2.6h-2.8M8.4 21H5.6A2.6 2.6 0 0 1 3 18.4v-2.8"/>
      <circle cx="12" cy="12" r="3.4"/></svg>`,
  recenter: `<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="5.6"/><circle cx="12" cy="12" r="1.9" fill="#fff" stroke="none"/>
      <path d="M12 1.6v3.2M12 19.2v3.2M1.6 12h3.2M19.2 12h3.2"/></svg>`,
  map: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6.4 10.2 3.2 13.8 5 21 2.4v15.2L13.8 20.2 10.2 18.4 3 21.6V6.4Z"/><path d="M10.2 3.2v15.2M13.8 5v15.2"/></svg>`,
  warn: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 3.2 22.3 20.6H1.7L12 3.2Z" fill="#fff"/>
      <rect x="10.9" y="9" width="2.2" height="6" rx="1.1" fill="#C4143A"/><circle cx="12" cy="17.4" r="1.3" fill="#C4143A"/></svg>`,
  play: `<svg width="19" height="19" viewBox="0 0 24 24" fill="#062330"><path d="M7 4.5 19.5 12 7 19.5Z"/></svg>`,
  gift: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#062330" stroke-width="2" stroke-linejoin="round">
      <rect x="3" y="9.5" width="18" height="11.5" rx="2"/><path d="M2 6.5h20v3.5H2z"/><path d="M12 6.5V21"/>
      <path d="M12 6.5S10.5 3 8 3a2.5 2.5 0 0 0 0 5h4Zm0 0S13.5 3 16 3a2.5 2.5 0 0 1 0 5h-4Z"/></svg>`,
};
export const icon = (n) => ICONS[n] ?? (() => { throw new Error('아이콘 없음: ' + n); })();

/** 지도 위 총기 보급 마커 */
export function gunPickup(scale = 1) {
  return `<g transform="scale(${scale})">
    <ellipse rx="22" ry="7.5" fill="#FFC53D" opacity="0.30"/>
    <ellipse rx="11" ry="3.8" fill="#FFC53D" opacity="0.55"/>
    <g transform="translate(0 -26)">
      <circle r="15" fill="#1A1508" opacity="0.85"/>
      <circle r="15" fill="none" stroke="#FFC53D" stroke-width="2"/>
      <g transform="translate(-9 -6) scale(0.78)" fill="#FFC53D">
        <path d="M1 3h18v5h-4l-1.5 3H9l-1-3H5.5L5 16H1.5L2.5 8H1Z"/>
        <rect x="14" y="0.6" width="3" height="2.6" rx="0.8"/>
      </g>
    </g>
    <g transform="translate(0 -46)">
      <path d="M0,7 L-5,0 L5,0 Z" fill="#FFC53D"/>
      <rect x="-14" y="-14" width="28" height="15" rx="7.5" fill="#FFC53D"/>
      <text x="0" y="-3" text-anchor="middle" font-size="10" font-weight="800" fill="#231A02"
        font-family="Outfit, sans-serif">+5</text>
    </g>
  </g>`;
}
