// 러닝 기록 화면 생성 — 차트 좌표를 손으로 찍지 않으려고 스크립트로 만든다.
//   Stats.dc.html.tpl      주간 기록 홈
//   RunDetail.dc.html.tpl  런 상세 (경로 + 속도 그래프 + 추격 구간)
//   Chase.dc.html.tpl      추격 훈련 리포트
// node gen-records.mjs
import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const head = readFileSync(join(HERE, '_head.txt'), 'utf8');
const tail = readFileSync(join(HERE, '_tail.txt'), 'utf8');

// dataviz 검증 통과 (dark, surface #0E1426): 추격 / 평시
const CHASE = '#FF2E5B', CALM = '#1795C2';
const INK = 'rgba(255,255,255,0.82)', MUTED = 'rgba(255,255,255,0.42)', GRID = 'rgba(255,255,255,0.07)';

const wrap = (body) => head + body + '\n' + tail;

// ── 1. 주간 기록 홈 ──────────────────────────────────────────────
const WEEK = [
  { d: '월', km: 4.2 }, { d: '화', km: 0 }, { d: '수', km: 5.1 }, { d: '목', km: 0 },
  { d: '금', km: 3.4 }, { d: '토', km: 2.63 }, { d: '일', km: 0 },
];
const GOAL = 20, total = WEEK.reduce((a, b) => a + b.km, 0);

function weekBars() {
  const W = 326, H = 96, max = 6;
  const bw = 26, gap = (W - bw * 7) / 6;
  const bars = WEEK.map((v, i) => {
    const x = i * (bw + gap);
    const h = Math.max(v.km > 0 ? 4 : 0, (v.km / max) * H);
    if (v.km === 0) {
      return `<rect x="${x.toFixed(1)}" y="${H - 4}" width="${bw}" height="4" rx="2" fill="rgba(255,255,255,0.08)"/>`;
    }
    return `<rect x="${x.toFixed(1)}" y="${(H - h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="4" fill="${CALM}"/>`
      + `<text x="${(x + bw / 2).toFixed(1)}" y="${(H - h - 7).toFixed(1)}" text-anchor="middle" fill="${INK}"
          font-size="9.5" font-weight="800" font-family="Outfit, sans-serif">${v.km}</text>`;
  }).join('');
  const labels = WEEK.map((v, i) =>
    `<text x="${(i * (bw + gap) + bw / 2).toFixed(1)}" y="${H + 15}" text-anchor="middle" fill="${MUTED}"
       font-size="10" font-weight="700" font-family="Outfit, sans-serif">${v.d}</text>`).join('');
  return `<svg width="${W}" height="${H + 22}" viewBox="0 0 ${W} ${H + 22}">
    <line x1="0" y1="${H}" x2="${W}" y2="${H}" stroke="${GRID}"/>
    ${bars}${labels}</svg>`;
}

// 8주 히트맵 — 단일 색조, 값이 클수록 밝다
const HEAT = [
  [0,1,0,2,1,0,0],[1,0,2,0,1,3,0],[0,2,0,1,0,2,1],[2,0,1,0,3,1,0],
  [0,1,2,0,1,0,2],[1,0,3,0,2,1,0],[0,2,0,1,0,3,1],[2,0,3,0,2,2,0],
];
const RAMP = ['rgba(255,255,255,0.05)', '#10394A', '#155A76', '#2FA9D6'];
function heatmap() {
  const c = 13, g = 4, W = 8 * (c + g) - g, H = 7 * (c + g) - g;
  const cells = HEAT.map((wk, x) => wk.map((v, y) =>
    `<rect x="${x * (c + g)}" y="${y * (c + g)}" width="${c}" height="${c}" rx="3" fill="${RAMP[v]}"/>`).join('')).join('');
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${cells}</svg>`;
}

const statsBody = `
<div style="width:390px;height:844px;background:#070A14;overflow:hidden;position:relative;display:flex;flex-direction:column">
  <div style="padding:62px 22px 0;flex-shrink:0">
    <div style="display:flex;align-items:flex-end;justify-content:space-between">
      <div>
        <div class="eyebrow">9월 2주차</div>
        <div style="color:#fff;font-size:27px;font-weight:800;letter-spacing:-0.8px;margin-top:6px">내 기록</div>
      </div>
      <div style="display:flex;align-items:center;gap:7px;background:rgba(255,46,91,0.12);border:1px solid rgba(255,46,91,0.34);
        border-radius:16px;padding:7px 13px">
        <div style="color:#FF7D9B;font-size:18px;font-weight:800;font-variant-numeric:tabular-nums">7</div>
        <div style="color:rgba(255,255,255,0.5);font-size:10.5px;font-weight:700;line-height:12px">주 연속<br>달성</div>
      </div>
    </div>
  </div>

  <div style="padding:16px 22px 0;flex-grow:1;overflow:hidden">

    <div class="glass" style="border-radius:22px;padding:17px">
      <div style="display:flex;align-items:baseline;justify-content:space-between">
        <div class="eyebrow">이번 주 거리</div>
        <div style="color:${MUTED};font-size:10.5px;font-weight:700">목표 ${GOAL}km</div>
      </div>
      <div style="display:flex;align-items:flex-end;gap:7px;margin-top:6px">
        <div style="color:#fff;font-size:36px;font-weight:800;letter-spacing:-1.2px;font-variant-numeric:tabular-nums">${total.toFixed(2)}</div>
        <div style="color:rgba(255,255,255,0.45);font-size:13px;font-weight:600;margin-bottom:7px">km</div>
        <div style="margin-left:auto;margin-bottom:8px;color:#7CFF5B;font-size:11.5px;font-weight:800">지난주 +2.1</div>
      </div>
      <div style="height:5px;border-radius:3px;background:rgba(255,255,255,0.08);margin-top:9px;overflow:hidden">
        <div style="width:${((total / GOAL) * 100).toFixed(0)}%;height:5px;border-radius:3px;background:${CALM}"></div>
      </div>
      <div style="margin-top:14px">${weekBars()}</div>
    </div>

    <div style="display:flex;gap:10px;margin-top:11px">
      <div class="glass" style="flex-grow:1;flex-basis:0;border-radius:18px;padding:14px">
        <div class="eyebrow" style="color:#FF7D9B">고강도 시간</div>
        <div style="color:#fff;font-size:24px;font-weight:800;margin-top:5px;font-variant-numeric:tabular-nums">23:40</div>
        <div style="color:${MUTED};font-size:10.5px;font-weight:600;margin-top:3px">좀비에게 쫓긴 시간</div>
      </div>
      <div class="glass" style="flex-grow:1;flex-basis:0;border-radius:18px;padding:14px">
        <div class="eyebrow">총 시간</div>
        <div style="color:#fff;font-size:24px;font-weight:800;margin-top:5px;font-variant-numeric:tabular-nums">1:34</div>
        <div style="color:${MUTED};font-size:10.5px;font-weight:600;margin-top:3px">주간 누적</div>
      </div>
    </div>

    <div class="glass" style="border-radius:20px;padding:15px 16px;margin-top:11px">
      <div style="display:flex;align-items:baseline;justify-content:space-between">
        <div class="eyebrow">최근 8주</div>
        <div style="color:${MUTED};font-size:10px;font-weight:700">하루 거리</div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;margin-top:11px">
        ${heatmap()}
        <div style="display:flex;flex-direction:column;gap:5px">
          ${RAMP.map((c, i) => `<div style="display:flex;align-items:center;gap:6px">
            <div style="width:10px;height:10px;border-radius:3px;background:${c}"></div>
            <span style="color:${MUTED};font-size:9.5px;font-weight:700">${['쉼', '~3km', '~6km', '6km+'][i]}</span></div>`).join('')}
        </div>
      </div>
    </div>

    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-top:16px">
      <div class="eyebrow">최근 런</div>
      <div style="color:${CALM};font-size:11px;font-weight:800">전체 보기</div>
    </div>
    <div class="glass" style="border-radius:18px;padding:13px 15px;margin-top:9px;display:flex;align-items:center;gap:12px">
      <div style="width:38px;height:38px;border-radius:12px;background:rgba(23,149,194,0.16);display:flex;align-items:center;justify-content:center;flex-shrink:0">
        <span style="color:${CALM};font-size:13px;font-weight:800">토</span>
      </div>
      <div style="flex-grow:1">
        <div style="color:#fff;font-size:13.5px;font-weight:800">2.63km · 14:22</div>
        <div style="color:${MUTED};font-size:11px;font-weight:600;margin-top:2px">추격 3회 · 처치 9 · 사망</div>
      </div>
      <div style="color:${MUTED};font-size:16px">&rsaquo;</div>
    </div>
  </div>
</div>`;

// ── 2. 런 상세 ──────────────────────────────────────────────────
// 거리 0~2.63km 동안의 속도. 추격 구간에서 확 올라간다.
const SPD = [
  9.2, 9.6, 9.4, 9.8, 9.5, 9.3, 13.8, 14.6, 15.1, 14.2, 12.4, 9.6, 9.2, 8.9,
  9.1, 9.4, 14.2, 15.4, 15.8, 14.8, 11.2, 9.0, 8.6, 8.8, 9.2, 9.5, 13.4, 14.9, 15.6, 12.2,
];
const BANDS = [[6, 10], [16, 20], [26, 29]]; // 추격 구간 인덱스
function paceChart(W = 326, H = 118) {
  const lo = 7, hi = 17;
  const px = i => (i / (SPD.length - 1)) * W;
  const py = v => H - ((v - lo) / (hi - lo)) * H;
  const line = SPD.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join('');
  const bands = BANDS.map(([a, b]) =>
    `<rect x="${px(a).toFixed(1)}" y="0" width="${(px(b) - px(a)).toFixed(1)}" height="${H}"
       fill="${CHASE}" fill-opacity="0.14"/>`).join('');
  const grid = [10, 13, 16].map(v =>
    `<line x1="0" y1="${py(v).toFixed(1)}" x2="${W}" y2="${py(v).toFixed(1)}" stroke="${GRID}"/>
     <text x="2" y="${(py(v) - 4).toFixed(1)}" fill="${MUTED}" font-size="9" font-weight="700"
       font-family="Outfit, sans-serif">${v}</text>`).join('');
  // 추격 구간 위 직접 라벨
  const tags = BANDS.map(([a, b], i) => {
    const cx = (px(a) + px(b)) / 2;
    return `<text x="${cx.toFixed(1)}" y="12" text-anchor="middle" fill="${CHASE}" font-size="9"
      font-weight="800" font-family="Outfit, sans-serif">추격 ${i + 1}</text>`;
  }).join('');
  return `<svg width="${W}" height="${H + 16}" viewBox="0 0 ${W} ${H + 16}">
    ${bands}${grid}
    <path d="${line}" fill="none" stroke="${CALM}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${tags}
    <text x="0" y="${H + 14}" fill="${MUTED}" font-size="9" font-weight="700" font-family="Outfit, sans-serif">0km</text>
    <text x="${W}" y="${H + 14}" text-anchor="end" fill="${MUTED}" font-size="9" font-weight="700" font-family="Outfit, sans-serif">2.63km</text>
  </svg>`;
}

const LAPS = [
  { k: '1km', t: '5:48', spd: 10.3, chase: 1 },
  { k: '2km', t: '5:21', spd: 11.2, chase: 1 },
  { k: '0.63km', t: '3:13', spd: 11.7, chase: 1 },
];

const runBody = `
<div style="width:390px;height:844px;background:#070A14;overflow:hidden;position:relative;display:flex;flex-direction:column">

  <!-- 경로 지도 -->
  <div style="height:300px;flex-shrink:0;position:relative;overflow:hidden">
    <svg width="390" height="300" viewBox="0 0 390 300" style="position:absolute;top:0;left:0">
      <defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#070A14" stop-opacity="0.9"/><stop offset="0.45" stop-color="#070A14" stop-opacity="0"/>
      </linearGradient></defs>
      <rect width="390" height="300" fill="#0B1020"/>
      <g opacity="0.55" transform="translate(195 150) scale(0.52) translate(-330 -590)"><!--OSMMAP--></g>
      <!-- 달린 경로: 평시는 청색, 추격 구간은 붉은색 -->
      <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
        <path d="M58,238 L96,214 L128,196 L150,170" stroke="${CALM}"/>
        <path d="M150,170 L176,146 L206,134" stroke="${CHASE}"/>
        <path d="M206,134 L238,128 L266,140 L282,162" stroke="${CALM}"/>
        <path d="M282,162 L296,190 L288,216" stroke="${CHASE}"/>
        <path d="M288,216 L268,238 L238,246 L210,240" stroke="${CALM}"/>
        <path d="M210,240 L182,230 L164,208" stroke="${CHASE}"/>
      </g>
      <circle cx="58" cy="238" r="6" fill="${CALM}" stroke="#fff" stroke-width="2"/>
      <circle cx="164" cy="208" r="6" fill="${CHASE}" stroke="#fff" stroke-width="2"/>
      <rect width="390" height="300" fill="url(#fade)"/>
    </svg>
    <div style="position:absolute;top:58px;left:16px">
      <div class="eyebrow">9월 14일 토요일 · 구역 C-7</div>
      <div style="color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.6px;margin-top:5px">저녁 런</div>
    </div>
    <div style="position:absolute;bottom:12px;left:16px;display:flex;gap:14px">
      <div style="display:flex;align-items:center;gap:6px">
        <div style="width:16px;height:3px;border-radius:2px;background:${CALM}"></div>
        <span style="color:${MUTED};font-size:10px;font-weight:700">평시</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <div style="width:16px;height:3px;border-radius:2px;background:${CHASE}"></div>
        <span style="color:${MUTED};font-size:10px;font-weight:700">추격 중</span>
      </div>
    </div>
  </div>

  <div style="padding:14px 22px 26px;flex-grow:1;overflow:hidden">
    <div class="glass" style="border-radius:20px;padding:16px">
      <div style="display:flex">
        <div style="flex-grow:1;flex-basis:0"><div class="eyebrow">거리</div>
          <div style="color:#fff;font-size:24px;font-weight:800;margin-top:4px;font-variant-numeric:tabular-nums">2.63<span style="font-size:11px;color:${MUTED}">km</span></div></div>
        <div style="flex-grow:1;flex-basis:0"><div class="eyebrow">시간</div>
          <div style="color:#fff;font-size:24px;font-weight:800;margin-top:4px;font-variant-numeric:tabular-nums">14:22</div></div>
        <div style="flex-grow:1;flex-basis:0"><div class="eyebrow">평균</div>
          <div style="color:#fff;font-size:24px;font-weight:800;margin-top:4px;font-variant-numeric:tabular-nums">11.0<span style="font-size:11px;color:${MUTED}">km/h</span></div></div>
      </div>
    </div>

    <div class="glass" style="border-radius:20px;padding:15px 16px;margin-top:11px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">
        <div class="eyebrow">거리별 속도</div>
        <div style="color:${CHASE};font-size:10.5px;font-weight:800">붉은 구간 = 쫓기던 중</div>
      </div>
      ${paceChart()}
    </div>

    <div class="glass" style="border-radius:20px;padding:15px 16px;margin-top:11px">
      <div class="eyebrow" style="margin-bottom:11px">구간 기록</div>
      ${LAPS.map(l => `<div style="display:flex;align-items:center;gap:11px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="color:${MUTED};font-size:11.5px;font-weight:700;width:46px">${l.k}</span>
        <div style="flex-grow:1;height:6px;border-radius:3px;background:rgba(255,255,255,0.07)">
          <div style="width:${((l.spd - 9) / 3.2 * 100).toFixed(0)}%;height:6px;border-radius:3px;background:${CALM}"></div>
        </div>
        <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums;width:40px;text-align:right">${l.t}</span>
        <span style="color:${CHASE};font-size:10.5px;font-weight:800;width:34px;text-align:right">추격${l.chase}</span>
      </div>`).join('')}
      <div style="color:${MUTED};font-size:10.5px;line-height:16px;margin-top:10px">
        구간마다 추격이 한 번씩 있었다. 쫓길 때마다 속도가 평소의 1.5배까지 올라갔다.
      </div>
    </div>
  </div>
</div>`;

// ── 3. 추격 훈련 리포트 ─────────────────────────────────────────
const WEEKS = ['7/21', '7/28', '8/4', '8/11', '8/18', '8/25', '9/1', '9/8'];
const CHASE_SPD = [12.8, 13.1, 13.4, 13.2, 13.9, 14.2, 14.4, 14.9];
const CALM_SPD = [8.4, 8.6, 8.7, 8.9, 9.1, 9.2, 9.5, 9.8];
const HIGH_MIN = [9, 12, 14, 13, 17, 19, 21, 24];

function twoSeries(W = 326, H = 130) {
  const lo = 7, hi = 16;
  const px = i => 16 + (i / (WEEKS.length - 1)) * (W - 22);
  const py = v => H - ((v - lo) / (hi - lo)) * H;
  const path = (arr) => arr.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(v).toFixed(1)}`).join('');
  const dots = (arr, c) => arr.map((v, i) =>
    `<circle cx="${px(i).toFixed(1)}" cy="${py(v).toFixed(1)}" r="3" fill="${c}" stroke="#0E1426" stroke-width="2"/>`).join('');
  const grid = [8, 10, 12, 14, 16].map(v =>
    `<line x1="16" y1="${py(v).toFixed(1)}" x2="${W}" y2="${py(v).toFixed(1)}" stroke="${GRID}"/>
     <text x="0" y="${(py(v) + 3).toFixed(1)}" fill="${MUTED}" font-size="8.5" font-weight="700" font-family="Outfit, sans-serif">${v}</text>`).join('');
  const last = WEEKS.length - 1;
  return `<svg width="${W}" height="${H + 18}" viewBox="0 0 ${W} ${H + 18}">
    ${grid}
    <path d="${path(CHASE_SPD)}" fill="none" stroke="${CHASE}" stroke-width="2" stroke-linejoin="round"/>
    <path d="${path(CALM_SPD)}" fill="none" stroke="${CALM}" stroke-width="2" stroke-linejoin="round"/>
    ${dots(CHASE_SPD, CHASE)}${dots(CALM_SPD, CALM)}
    <text x="${(px(last) - 4).toFixed(1)}" y="${(py(CHASE_SPD[last]) - 8).toFixed(1)}" text-anchor="end" fill="${CHASE}"
      font-size="10" font-weight="800" font-family="Outfit, sans-serif">추격 ${CHASE_SPD[last]}</text>
    <text x="${(px(last) - 4).toFixed(1)}" y="${(py(CALM_SPD[last]) + 15).toFixed(1)}" text-anchor="end" fill="${CALM}"
      font-size="10" font-weight="800" font-family="Outfit, sans-serif">평시 ${CALM_SPD[last]}</text>
    <text x="16" y="${H + 15}" fill="${MUTED}" font-size="8.5" font-weight="700" font-family="Outfit, sans-serif">${WEEKS[0]}</text>
    <text x="${W}" y="${H + 15}" text-anchor="end" fill="${MUTED}" font-size="8.5" font-weight="700" font-family="Outfit, sans-serif">${WEEKS[last]}</text>
  </svg>`;
}

function highMinBars(W = 326, H = 74) {
  const max = 26, bw = 28, gap = (W - bw * 8) / 7;
  return `<svg width="${W}" height="${H + 16}" viewBox="0 0 ${W} ${H + 16}">
    ${HIGH_MIN.map((v, i) => {
      const x = i * (bw + gap), h = (v / max) * H;
      const c = i === HIGH_MIN.length - 1 ? CHASE : 'rgba(255,46,91,0.4)';
      return `<rect x="${x.toFixed(1)}" y="${(H - h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="4" fill="${c}"/>`;
    }).join('')}
    <text x="${(7 * (bw + gap) + bw / 2).toFixed(1)}" y="${H + 14}" text-anchor="middle" fill="${CHASE}"
      font-size="9.5" font-weight="800" font-family="Outfit, sans-serif">24분</text>
  </svg>`;
}

const chaseBody = `
<div style="width:390px;height:844px;background:#070A14;overflow:hidden;position:relative;display:flex;flex-direction:column">
  <div style="padding:62px 22px 0;flex-shrink:0">
    <div class="eyebrow">최근 8주</div>
    <div style="color:#fff;font-size:27px;font-weight:800;letter-spacing:-0.8px;margin-top:6px">추격이 만든 훈련</div>
    <div style="color:${MUTED};font-size:12px;line-height:18px;margin-top:8px">
      좀비에게 쫓기는 구간이 곧 고강도 인터벌이다. 따로 계획하지 않아도 매주 쌓인다.
    </div>
  </div>

  <div style="padding:16px 22px 26px;flex-grow:1;overflow:hidden">

    <div class="glass" style="border-radius:20px;padding:16px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:6px">
        <div class="eyebrow">주간 평균 속도 <span style="color:rgba(255,255,255,0.3)">km/h</span></div>
      </div>
      <div style="display:flex;gap:14px;margin-bottom:8px">
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:14px;height:3px;border-radius:2px;background:${CHASE}"></div>
          <span style="color:${MUTED};font-size:10px;font-weight:700">추격 중</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <div style="width:14px;height:3px;border-radius:2px;background:${CALM}"></div>
          <span style="color:${MUTED};font-size:10px;font-weight:700">평시</span>
        </div>
      </div>
      ${twoSeries()}
      <div style="color:${MUTED};font-size:11px;line-height:17px;margin-top:8px">
        8주 동안 평시 속도가 8.4에서 9.8로 올랐다. 추격 중 속도가 먼저 오르고 평시가 따라온다.
      </div>
    </div>

    <div class="glass" style="border-radius:20px;padding:16px;margin-top:11px">
      <div style="display:flex;align-items:baseline;justify-content:space-between">
        <div class="eyebrow" style="color:#FF7D9B">주간 고강도 시간</div>
        <div style="color:#7CFF5B;font-size:10.5px;font-weight:800">8주 만에 2.6배</div>
      </div>
      <div style="margin-top:10px">${highMinBars()}</div>
      <div style="color:${MUTED};font-size:11px;line-height:17px;margin-top:6px">
        세계보건기구 권고는 주 75분 고강도다. 지금 24분이니 아직 3분의 1이다.
      </div>
    </div>

    <div class="glass" style="border-radius:20px;padding:16px;margin-top:11px;border-color:rgba(47,217,255,0.26)">
      <div class="eyebrow" style="color:#2FD9FF">다음 주 난이도</div>
      <div style="display:flex;align-items:center;gap:13px;margin-top:11px">
        <div style="flex-grow:1">
          <div style="color:#fff;font-size:14px;font-weight:800">러너 속도 12.0 → 12.6 km/h</div>
          <div style="color:${MUTED};font-size:11px;line-height:17px;margin-top:4px">
            최근 4주 평균 속도가 올라서 좀비도 같이 빨라진다. 항상 아슬아슬하게 도망칠 수 있는 선을 유지한다.
          </div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;margin-top:12px">
        <div style="flex-grow:1;height:6px;border-radius:3px;background:rgba(255,255,255,0.08);position:relative">
          <div style="width:62%;height:6px;border-radius:3px;background:${CALM}"></div>
          <div style="position:absolute;left:68%;top:-4px;width:3px;height:14px;border-radius:2px;background:${CHASE}"></div>
        </div>
        <span style="color:${MUTED};font-size:10px;font-weight:700">내 속도 · 좀비</span>
      </div>
    </div>
  </div>
</div>`;

writeFileSync(join(HERE, 'Stats.dc.html.tpl'), wrap(statsBody));
writeFileSync(join(HERE, 'RunDetail.dc.html.tpl'), wrap(runBody));
writeFileSync(join(HERE, 'Chase.dc.html.tpl'), wrap(chaseBody));
console.log('Stats · RunDetail · Chase 씀');
