<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <style>
    body { margin: 0; background: #000000;
      font-family: -apple-system, "Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
    a { color: #3d8bff; text-decoration: none; }
    a:hover { color: #6ba7ff; }
    .pill { flex-grow: 1; flex-basis: 0; background: #000000aa; border-radius: 10px; padding: 7px 10px; text-align: center; }
    .plabel { color: #9aa4b5; font-size: 10px; letter-spacing: 0.5px; }
    .pval { color: #ffffff; font-size: 21px; font-weight: 800; line-height: 25px; }
    .punit { color: #6d7687; font-size: 13px; font-weight: 700; }
  </style>
</helmet>

<div style="width: 390px; height: 844px; background: #000000; overflow: hidden; position: relative">

  <!-- 카메라 프리뷰 — 실제 앱은 후면 카메라 영상. 여기서는 야간 가로 스탠드인 -->
  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#141b26"/><stop offset="1" stop-color="#0b0f15"/>
      </linearGradient>
      <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#14171c"/><stop offset="1" stop-color="#08090b"/>
      </linearGradient>
      <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#ffb84d" stop-opacity="0.30"/>
        <stop offset="1" stop-color="#ffb84d" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <rect x="0" y="0" width="390" height="422" fill="url(#sky)"/>
    <rect x="0" y="422" width="390" height="422" fill="url(#road)"/>
    <g fill="#0e1218">
      <path d="M0 120 L58 120 L58 430 L0 430 Z"/>
      <path d="M58 190 L108 190 L108 430 L58 430 Z"/>
      <path d="M108 250 L150 250 L150 430 L108 430 Z"/>
      <path d="M244 268 L286 268 L286 430 L244 430 Z"/>
      <path d="M286 176 L336 176 L336 430 L286 430 Z"/>
      <path d="M336 96 L390 96 L390 430 L336 430 Z"/>
    </g>
    <g fill="#ffb84d" opacity="0.16">
      <rect x="12" y="150" width="9" height="13"/><rect x="30" y="150" width="9" height="13"/>
      <rect x="12" y="196" width="9" height="13"/><rect x="40" y="230" width="9" height="13"/>
      <rect x="70" y="216" width="8" height="12"/><rect x="88" y="258" width="8" height="12"/>
      <rect x="350" y="126" width="9" height="13"/><rect x="368" y="126" width="9" height="13"/>
      <rect x="350" y="180" width="9" height="13"/><rect x="300" y="206" width="8" height="12"/>
      <rect x="318" y="248" width="8" height="12"/><rect x="256" y="296" width="8" height="12"/>
    </g>
    <ellipse cx="330" cy="360" rx="120" ry="120" fill="url(#lamp)"/>

    <!-- three.js GridHelper(100, 20) — 5m 간격, 카메라 높이 1.6m, 초점거리 702px -->
    <g stroke="#223344" stroke-opacity="0.25" stroke-width="1">
      <line x1="0" y1="646.6" x2="390" y2="646.6"/>
      <line x1="0" y1="534.3" x2="390" y2="534.3"/>
      <line x1="0" y1="496.9" x2="390" y2="496.9"/>
      <line x1="0" y1="478.2" x2="390" y2="478.2"/>
      <line x1="0" y1="466.9" x2="390" y2="466.9"/>
      <line x1="0" y1="459.4" x2="390" y2="459.4"/>
      <line x1="0" y1="454.1" x2="390" y2="454.1"/>
      <line x1="0" y1="450.1" x2="390" y2="450.1"/>
      <line x1="0" y1="447.0" x2="390" y2="447.0"/>
      <line x1="0" y1="444.5" x2="390" y2="444.5"/>
      <line x1="195" y1="422" x2="-5655" y2="796"/>
      <line x1="195" y1="422" x2="-3315" y2="796"/>
      <line x1="195" y1="422" x2="-975" y2="796"/>
      <line x1="195" y1="422" x2="1365" y2="796"/>
      <line x1="195" y1="422" x2="3705" y2="796"/>
      <line x1="195" y1="422" x2="6045" y2="796"/>
    </g>
    <line x1="195" y1="422" x2="195" y2="796" stroke="#335566" stroke-opacity="0.25" stroke-width="1"/>

    <!-- 좀비 메시: 몸통 원기둥 r 0.32/0.42 h 1.35 y 0.85, 머리 구 r 0.28 y 1.75 -->
    <g transform="translate(181, 444) scale(13.5)">
      <ellipse cx="0" cy="-0.175" rx="0.42" ry="0.12" fill="{{farColor}}"/>
      <path d="M-0.32,-1.525 L0.32,-1.525 L0.42,-0.175 L-0.42,-0.175 Z" fill="{{farColor}}"/>
      <circle cx="0" cy="-1.75" r="0.28" fill="{{farColor}}"/>
      <circle cx="-0.1" cy="-1.8" r="0.045" fill="#ff2b2b"/>
      <circle cx="0.1" cy="-1.8" r="0.045" fill="#ff2b2b"/>
    </g>
    <g transform="translate(319, 455) scale(20.6)">
      <ellipse cx="0" cy="-0.175" rx="0.42" ry="0.12" fill="{{midColor}}"/>
      <path d="M-0.32,-1.525 L0.32,-1.525 L0.42,-0.175 L-0.42,-0.175 Z" fill="{{midColor}}"/>
      <circle cx="0" cy="-1.75" r="0.28" fill="{{midColor}}"/>
      <circle cx="-0.1" cy="-1.8" r="0.045" fill="#ff2b2b"/>
      <circle cx="0.1" cy="-1.8" r="0.045" fill="#ff2b2b"/>
    </g>
    <g transform="translate(117, 484) scale(39.0)">
      <ellipse cx="0" cy="-0.175" rx="0.42" ry="0.12" fill="{{nearColor}}"/>
      <path d="M-0.32,-1.525 L0.32,-1.525 L0.42,-0.175 L-0.42,-0.175 Z" fill="{{nearColor}}"/>
      <circle cx="0" cy="-1.75" r="0.28" fill="{{nearColor}}"/>
      <circle cx="-0.1" cy="-1.8" r="0.045" fill="#ff2b2b"/>
      <circle cx="0.1" cy="-1.8" r="0.045" fill="#ff2b2b"/>
    </g>
  </svg>

  <!-- 조준선 28×2 -->
  <div style="position: absolute; top: 422px; left: 195px; width: 28px; height: 28px; margin-left: -14px; margin-top: -14px">
    <div style="position: absolute; top: 13px; left: 0; width: 28px; height: 2px; background: #ffffffcc"></div>
    <div style="position: absolute; top: 0; left: 13px; width: 2px; height: 28px; background: #ffffffcc"></div>
  </div>

  <!-- 화면 밖 추격자 에지 인디케이터 (좌 38% h190 / 우 58% h150, 폭 30) -->
  <sc-if value="{{showEdges}}" hint-placeholder-val="{{ true }}">
    <div style="position: absolute; left: 0; top: 320.7px; width: 30px; height: 190px">
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #ff991a; opacity: 0.22"></div>
      <div style="position: absolute; top: 0; bottom: 0; left: 0; width: 4px; border-radius: 2px; background: #ff991a"></div>
      <div style="position: absolute; top: -16px; left: 12px; color: #ffd9d4; font-size: 11px; font-weight: 700; letter-spacing: 0.5px">18m</div>
    </div>
    <div style="position: absolute; right: 0; top: 489.5px; width: 30px; height: 150px">
      <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #994dcc; opacity: 0.22"></div>
      <div style="position: absolute; top: 0; bottom: 0; right: 0; width: 4px; border-radius: 2px; background: #994dcc"></div>
      <div style="position: absolute; top: -16px; right: 12px; color: #ffd9d4; font-size: 11px; font-weight: 700; letter-spacing: 0.5px">44m</div>
    </div>
  </sc-if>

  <!-- 조준 대상 카드 (top 55%) -->
  <div style="position: absolute; top: 464.2px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="background: #000000cc; border-radius: 10px; border-left: 3px solid #e33232; padding: 8px 14px; display: flex; flex-direction: row; align-items: center; gap: 12px">
      <div>
        <div style="color: #ffffff; font-size: 13px; font-weight: 800; letter-spacing: 1px">{{aimName}}</div>
        <div style="color: #9aa4b5; font-size: 11px; margin-top: 2px">{{aimSub}}</div>
      </div>
      <div style="display: flex; flex-direction: row; gap: 4px">
        <sc-for list="{{hpDots}}" as="d" hint-placeholder-count="3">
          <div style="width: 9px; height: 9px; border-radius: 5px; background: {{d.c}}"></div>
        </sc-for>
      </div>
    </div>
  </div>

  <!-- 탭 안내 칩 (조준선 아래 44px) -->
  <div style="position: absolute; top: 466px; left: 0; right: 0; text-align: center">
    <span style="color: #9aa4b5; font-size: 11px; background: #000000aa; padding: 3px 9px; border-radius: 6px">탭 — 사격(소음 120m) · 드래그 — 둘러보기</span>
  </div>

  <!-- 상단 상태 필 (top 54) -->
  <div style="position: absolute; top: 54px; left: 12px; right: 12px; display: flex; flex-direction: row; gap: 8px">
    <div class="pill">
      <div class="plabel">HP</div>
      <div class="pval" style="color: {{hpColor}}">{{hp}}<span class="punit">/100</span></div>
    </div>
    <div class="pill">
      <div class="plabel">탄약</div>
      <div class="pval">{{ammo}}<span class="punit">/30</span></div>
    </div>
    <div class="pill" style="background: {{chaseBg}}; border: {{chaseBorder}}">
      <div class="plabel" style="color: {{chaseLabelColor}}">추격</div>
      <div class="pval" style="color: {{chaseValColor}}">{{chasing}}</div>
    </div>
    <div class="pill">
      <div class="plabel">최근접</div>
      <div class="pval">{{nearest}}<span class="punit">{{nearestUnit}}</span></div>
    </div>
  </div>

  <!-- 방향 안내 (top 122) -->
  <div style="position: absolute; top: 122px; left: 0; right: 0; text-align: center">
    <span style="color: #7fd8a0; font-size: 13px; font-weight: 700; background: #000000aa; padding: 3px 10px; border-radius: 6px">{{hintText}}</span>
  </div>

  <!-- 정지 고정 칩 (bottom 102) -->
  <div style="position: absolute; bottom: 102px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="background: #14332099; border: 1px solid #7fd8a0; border-radius: 8px; padding: 5px 12px; display: flex; flex-direction: row; align-items: center; gap: 7px">
      <div style="width: 7px; height: 7px; border-radius: 4px; background: #7fd8a0"></div>
      <div style="color: #7fd8a0; font-size: 11.5px; font-weight: 700">정지 고정 — AR 유지 중</div>
    </div>
  </div>

  <!-- 근접 경고 테두리 6px -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 6px solid {{edgeColor}}"></div>

  <!-- 감지 토스트 (bottom 110) -->
  <sc-if value="{{showToast}}" hint-placeholder-val="{{ true }}">
    <div style="position: absolute; bottom: 110px; left: 16px; right: 16px">
      <div style="background: #3a1010ee; border: 1px solid #ff5f4d; border-radius: 10px; padding: 9px 14px">
        <div style="color: #ffd9d4; font-size: 13.5px; font-weight: 600">⚠️ 좀비Runner가 사용자 러너를 감지했습니다</div>
      </div>
    </div>
  </sc-if>

  <!-- 하단 바 (bottom 30) -->
  <div style="position: absolute; bottom: 30px; left: 12px; right: 12px; display: flex; flex-direction: row; gap: 10px">
    <div style="flex-grow: 1; height: 56px; background: #2a3140dd; border: 1px solid #4a5468; border-radius: 12px; display: flex; align-items: center; justify-content: center">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">근접 공격 · 3m</div>
    </div>
    <div style="width: 116px; height: 56px; background: #40566edd; border: 1px solid #4a5468; border-radius: 12px; display: flex; align-items: center; justify-content: center">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">지도 뷰</div>
    </div>
  </div>

</div>
</x-dc>

<script data-dc-script data-props='{"$preview":{"width":390,"height":844},"threat":{"editor":"enum","options":["idle","chase","critical"],"default":"chase","section":"HUD 상태"}}'>
class Component extends DCLogic {
  renderVals() {
    const dots = (max, left) =>
      Array.from({ length: max }, (_, i) => ({ c: i < left ? '#ff6b5c' : '#4a5468' }));
    const calm = { chaseBg: '#000000aa', chaseBorder: 'none', chaseLabelColor: '#9aa4b5', chaseValColor: '#ffffff' };
    const alarm = { chaseBg: '#3a1010cc', chaseBorder: '1px solid #ff5f4d', chaseLabelColor: '#ffd9d4', chaseValColor: '#ff6b5c' };

    const table = {
      idle: {
        farColor: '#3ddc6a', midColor: '#3ddc6a', nearColor: '#3ddc6a',
        edgeColor: 'rgba(255,40,40,0)', showEdges: false, showToast: false,
        hp: '100', hpColor: '#ffffff', ammo: '10', chasing: '0',
        nearest: '—', nearestUnit: '',
        aimName: 'WALKER', aimSub: '34m · 3km/h', hpDots: dots(2, 2),
        hintText: '🎯 정면 Walker 34m', ...calm,
      },
      chase: {
        farColor: '#3ddc6a', midColor: '#3ddc6a', nearColor: '#e33232',
        edgeColor: 'rgba(255,40,40,0.4)', showEdges: true, showToast: true,
        hp: '64', hpColor: '#ffffff', ammo: '7', chasing: '2',
        nearest: '18', nearestUnit: 'm',
        aimName: 'RUNNER', aimSub: '18m · 12km/h', hpDots: dots(3, 2),
        hintText: '◀ 왼쪽으로 34° — Runner 18m', ...alarm,
      },
      critical: {
        farColor: '#3ddc6a', midColor: '#e33232', nearColor: '#e33232',
        edgeColor: 'rgba(255,40,40,0.8)', showEdges: true, showToast: true,
        hp: '22', hpColor: '#ff6b5c', ammo: '2', chasing: '4',
        nearest: '6', nearestUnit: 'm',
        aimName: 'BRUTE', aimSub: '6m · 5km/h', hpDots: dots(8, 8),
        hintText: '🎯 정면 Brute 6m', ...alarm,
      },
    };
    return table[this.props.threat] || table.chase;
  }
}
</script>
</body>
</html>
