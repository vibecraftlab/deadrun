// 좀비 캐릭터 아트.
// 미리보기: node zlab/preview.mjs → chrome --headless --screenshot → 눈으로 확인 → 고침
//
// 구성 원칙
//  · 사지는 둥근 캡 스트로크. 채운 외곽선보다 형태를 통제하기 쉽다.
//  · 역광은 선을 덧그리지 않고 drop-shadow 필터로 준다. 실루엣을 저절로 따라가서
//    머리띠처럼 떠 보이지 않는다.
//  · 머리를 어깨보다 한참 앞으로 내밀어 굽은 등을 만든다. 좀비로 읽히는 1번 단서.
//  · 팔다리는 길고 몸통은 홀쭉하게. 통통하면 귀여워진다.
//  · 지면 y=0, 위가 음수. 진행 방향은 왼쪽.

const SKIN = { base: '#8C9179', dark: '#5A5F4C', deep: '#3E4234' };
const MOUTH = '#171A12';

// 색은 상태만 나타낸다. 축을 섞지 않는다.
const STATES = {
  roam:  { id: 'r', rim: '#7CFF5B', eye: '#DFFFCF', glow: '#7CFF5B', gop: 0.22,
           shirt: '#3E4864', shirtDark: '#262D42', pants: '#333A4E' },
  chase: { id: 'c', rim: '#FF2E5B', eye: '#FFE3EA', glow: '#FF2E5B', gop: 0.34,
           shirt: '#4A3240', shirtDark: '#2C1E28', pants: '#362C3C' },
  // 화면 배경용
  dark:  { id: 'd', rim: null, eye: '#7CFF5B', glow: null, gop: 0, flat: '#121A2E' },
  mono:  { id: 'm', rim: null, eye: '#FFFFFF', glow: null, gop: 0, flat: '#000000' },
};

// 타입은 형태로 구분한다. 실루엣만 보고 무엇인지 알아야 한다.
//   워커  기준
//   러너  앞으로 더 기울고 가늘고 길다 — 12km/h
//   스토커 낮게 웅크리고 옆으로 퍼졌다 — 감지 90m, 레이더에서 깜빡인다
//   브루트 크고 두껍다 — HP 8, 한 방 30
const TYPES = {
  walker:  { id: 'w', t: '',                            disc: 1.0 },
  runner:  { id: 'n', t: 'rotate(-9) scale(0.94 1.08)', disc: 0.95 },
  stalker: { id: 's', t: 'scale(1.16 0.78)',            disc: 1.1 },
  brute:   { id: 'b', t: 'scale(1.3 1.2)',              disc: 1.3 },
};

/** 왼쪽을 향한 3/4 옆모습. 보폭과 팔 뻗음을 과장해야 작게 줄여도 읽힌다. */
function figure(p) {
  const f = p.flat;
  const skin = f ?? SKIN.base;
  const skinDark = f ?? SKIN.dark;
  const skinDeep = f ?? SKIN.deep;
  const shirt = f ?? p.shirt;
  const shirtDark = f ?? p.shirtDark;
  const pants = f ?? p.pants;
  const mouth = f ?? MOUTH;

  return `
    <!-- ── 몸통 뒤 사지 ── -->
    <!-- 끌리는 뒷다리: 발끝만 닿는다 -->
    <path d="M3,-29 Q10,-22 13,-14 Q15,-9 18,-4.5" stroke="${pants}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18,-4.5 Q20.5,-3 22,-4" stroke="${pants}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <!-- 늘어뜨린 뒷팔 -->
    <path d="M1,-46 Q7,-38 7.5,-30" stroke="${shirtDark}" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M7.5,-30 Q8.5,-25 7,-20" stroke="${skinDeep}" stroke-width="5" fill="none" stroke-linecap="round"/>

    <!-- ── 앞다리 ── -->
    <path d="M-2.5,-29 Q-8,-21 -8.5,-13 Q-9,-7 -10,-3.5" stroke="${pants}" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-3.5 Q-14,-2.6 -17,-3.6" stroke="${pants}" stroke-width="6.5" fill="none" stroke-linecap="round"/>

    <!-- ── 몸통: 홀쭉하게, 앞으로 기울고, 옷자락이 찢겼다 ── -->
    <path d="M-8,-32 Q-10.5,-41 -6.5,-48 Q-1,-51 3.5,-47.5 Q5,-40 4,-31
             L2.4,-24 L0.6,-29.5 L-1.6,-22 L-3.8,-28.5 L-6,-23 Z"
          fill="${shirt}"/>
    <!-- 옆구리 그늘 -->
    <path d="M1.2,-47 Q3.4,-40 2.6,-31 L1.8,-27 L0.8,-30 Z" fill="${shirtDark}"/>
    <!-- 어깨 찢김 -->
    <path d="M-6.4,-47.6 Q-3.4,-44.8 -0.6,-46.4" stroke="${shirtDark}" stroke-width="2.4" fill="none" stroke-linecap="round"/>

    <!-- ── 앞으로 뻗은 팔: 길게 ── -->
    <path d="M-4.5,-46.5 Q-15,-48.5 -23,-45.5" stroke="${shirt}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M-23,-45.5 Q-30,-43.5 -34,-44.5" stroke="${skin}" stroke-width="5.6" fill="none" stroke-linecap="round"/>
    <path d="M-34,-44.5 L-39.5,-47" stroke="${skin}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M-34.5,-43.4 L-40.5,-43.8" stroke="${skin}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M-34,-42.2 L-39,-40.2" stroke="${skin}" stroke-width="2.4" fill="none" stroke-linecap="round"/>

    <!-- ── 목: 어깨보다 한참 앞으로 ── -->
    <path d="M-4,-47.5 Q-8.5,-50 -12,-51" stroke="${skinDeep}" stroke-width="5.8" fill="none" stroke-linecap="round"/>

    <!-- ── 머리: 작고 갸름하게. 턱을 가슴 쪽으로 떨궜다 ── -->
    <path d="M-10,-60.6 Q-4.2,-59.4 -3.9,-54.8 Q-3.7,-51.8 -6.6,-51
             L-13.8,-51.9 Q-17.6,-53 -17.8,-56.4 Q-18,-59.8 -10,-60.6 Z" fill="${skin}"/>
    <!-- 뒤통수 그늘 -->
    <path d="M-10,-60.6 Q-4.2,-59.4 -3.9,-54.8 Q-3.9,-52.8 -5.1,-51.7 Q-5.8,-55.4 -8.3,-58.1 Z" fill="${skinDark}"/>
    <!-- 벌어진 입: 좁고 아래로 -->
    <path d="M-17.6,-51.6 Q-14.6,-50.6 -11.8,-51.2 Q-11.4,-46 -14.2,-45.2 Q-17.2,-45.4 -17.6,-51.6 Z" fill="${mouth}"/>
    <!-- 아래턱 -->
    <path d="M-18.4,-50.2 Q-17.4,-43.6 -13.4,-43.8 Q-9.6,-44.2 -8.2,-48.6
             Q-13,-46.8 -18.4,-50.2 Z" fill="${skinDark}"/>
  `;
}

export function zombie(type, state, scale = 1, flip = false) {
  const v = STATES[state];
  const t = TYPES[type];
  if (!v) throw new Error('알 수 없는 상태: ' + state);
  if (!t) throw new Error('알 수 없는 타입: ' + type);
  const uid = `z${t.id}${v.id}${String(scale).replace('.', '')}${flip ? 'f' : ''}`;

  const parts = [];
  if (v.glow) {
    const d = t.disc;
    parts.push(`<ellipse rx="${(29 * d).toFixed(1)}" ry="${(9.5 * d).toFixed(1)}" fill="${v.glow}" opacity="${v.gop}"/>`);
    parts.push(`<ellipse rx="${(14 * d).toFixed(1)}" ry="${(4.6 * d).toFixed(1)}" fill="${v.glow}" opacity="${Math.min(0.7, v.gop * 1.9)}"/>`);
  }

  const filt = v.rim
    ? `<filter id="${uid}" x="-45%" y="-25%" width="190%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="${v.rim}" flood-opacity="0.38"/>
       </filter>` : '';

  const eyes = [
    `<ellipse cx="-15.4" cy="-55.2" rx="2.5" ry="2.2" transform="rotate(-6 -15.4 -55.2)" fill="${MOUTH}" opacity="0.95"/>`,
    `<ellipse cx="-9.4" cy="-55" rx="1.9" ry="1.7" transform="rotate(-6 -9.4 -55)" fill="${MOUTH}" opacity="0.95"/>`,
    `<circle cx="-15.5" cy="-55.3" r="0.85" fill="${v.eye}"/>`,
    `<circle cx="-9.6" cy="-55.1" r="0.6" fill="${v.eye}" opacity="0.75"/>`,
  ].join('');

  const shaped = t.t ? `<g transform="${t.t}">${figure(v)}${eyes}</g>` : `${figure(v)}${eyes}`;
  const drawn = v.rim ? `${filt}<g filter="url(#${uid})">${shaped}</g>` : shaped;

  parts.push(flip ? `<g transform="scale(-1 1)">${drawn}</g>` : drawn);
  return `<g transform="scale(${scale})">${parts.join('')}</g>`;
}

export { STATES, TYPES };
