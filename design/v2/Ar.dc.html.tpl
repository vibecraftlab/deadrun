<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap">
  <style>
<!--CSS-->  </style>
</helmet>

<div style="width: 390px; height: 844px; background: #000000; overflow: hidden; position: relative">

  <!-- ── 카메라 프리뷰 자리 (야간 가로 스탠드인) ── -->
  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#121A2A"/><stop offset="1" stop-color="#080C14"/>
      </linearGradient>
      <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#10141C"/><stop offset="1" stop-color="#05070B"/>
      </linearGradient>
      <radialGradient id="lamp" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#FFC53D" stop-opacity="0.26"/><stop offset="1" stop-color="#FFC53D" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="zGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#FF2E5B" stop-opacity="0.55"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="zGlowG" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#7CFF5B" stop-opacity="0.4"/><stop offset="1" stop-color="#7CFF5B" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="edgeR" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0" stop-color="#FF2E5B" stop-opacity="0.75"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <rect x="0" y="0" width="390" height="430" fill="url(#sky)"/>
    <rect x="0" y="430" width="390" height="414" fill="url(#asphalt)"/>

    <g fill="#0A0E16">
      <path d="M0 128 L62 128 L62 438 L0 438 Z"/>
      <path d="M62 196 L114 196 L114 438 L62 438 Z"/>
      <path d="M114 258 L156 258 L156 438 L114 438 Z"/>
      <path d="M240 272 L284 272 L284 438 L240 438 Z"/>
      <path d="M284 180 L334 180 L334 438 L284 438 Z"/>
      <path d="M334 102 L390 102 L390 438 L334 438 Z"/>
    </g>
    <g fill="#FFC53D" opacity="0.13">
      <rect x="13" y="158" width="10" height="14" rx="1"/><rect x="33" y="158" width="10" height="14" rx="1"/>
      <rect x="13" y="206" width="10" height="14" rx="1"/><rect x="42" y="242" width="10" height="14" rx="1"/>
      <rect x="74" y="226" width="9" height="13" rx="1"/><rect x="93" y="268" width="9" height="13" rx="1"/>
      <rect x="348" y="132" width="10" height="14" rx="1"/><rect x="368" y="132" width="10" height="14" rx="1"/>
      <rect x="348" y="188" width="10" height="14" rx="1"/><rect x="298" y="212" width="9" height="13" rx="1"/>
      <rect x="316" y="254" width="9" height="13" rx="1"/><rect x="252" y="304" width="9" height="13" rx="1"/>
    </g>
    <ellipse cx="328" cy="368" rx="122" ry="122" fill="url(#lamp)"/>

    <!-- 지면 격자: 5m 간격, 카메라 높이 1.6m -->
    <g stroke="#2FD9FF" stroke-opacity="0.10" stroke-width="1">
      <line x1="0" y1="646" x2="390" y2="646"/><line x1="0" y1="534" x2="390" y2="534"/>
      <line x1="0" y1="497" x2="390" y2="497"/><line x1="0" y1="478" x2="390" y2="478"/>
      <line x1="0" y1="467" x2="390" y2="467"/><line x1="0" y1="459" x2="390" y2="459"/>
      <line x1="195" y1="430" x2="-3315" y2="800"/><line x1="195" y1="430" x2="-975" y2="800"/>
      <line x1="195" y1="430" x2="1365" y2="800"/><line x1="195" y1="430" x2="3705" y2="800"/>
    </g>

    <!-- 등지고 배회 중 — 뒷모습이 보인다 -->
    <ellipse cx="312" cy="456" rx="42" ry="42" fill="url(#zGlowG)"/>
    <g transform="translate(312 468)"><!--ZOMBIE:walker:roam:back:0.62:0--></g>

    <!-- 옆으로 지나간다 — 측면 -->
    <ellipse cx="56" cy="450" rx="34" ry="34" fill="url(#zGlowG)"/>
    <g transform="translate(56 458)"><!--ZOMBIE:stalker:roam:side:0.46:0--></g>

    <!-- 나를 향해 걸어온다 — 정면 -->
    <ellipse cx="128" cy="470" rx="96" ry="96" fill="url(#zGlow)"/>
    <g transform="translate(128 496)"><!--ZOMBIE:runner:chase:front:1.5:0--></g>

    <!-- 화면 밖 추격자: 우측 에지 -->
    <rect x="330" y="548" width="60" height="164" fill="url(#edgeR)"/>
    <rect x="384" y="548" width="5" height="164" rx="2.5" fill="#FF2E5B"/>
  </svg>

  <!-- ── 상단 스탯 바 (지도 뷰와 동일) ── -->
  <!--STATBAR:2.41|9.8|0.0|64|3|07|2-->

  <!-- 정지 고정 칩 -->
  <div style="position: absolute; top: 168px; left: 0; right: 0; display: flex; justify-content: center">
    <div class="glass" style="border-radius: 16px; padding: 6px 13px; display: flex; flex-direction: row; align-items: center; gap: 7px">
      <div style="width: 7px; height: 7px; border-radius: 4px; background: #2FD9FF; box-shadow: 0 0 8px #2FD9FF"></div>
      <span style="color: #FFFFFF; font-size: 11.5px; font-weight: 700">정지 고정 · AR 유지 중</span>
    </div>
  </div>

  <!-- 조준 링 -->
  <div style="position: absolute; top: 422px; left: 195px; width: 96px; height: 96px; margin-left: -48px; margin-top: -48px">
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <circle cx="48" cy="48" r="38" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="2"/>
      <g stroke="#FF2E5B" stroke-width="3.5" stroke-linecap="round">
        <path d="M14 30V17a3 3 0 0 1 3-3h13"/><path d="M66 14h13a3 3 0 0 1 3 3v13"/>
        <path d="M82 66v13a3 3 0 0 1-3 3H66"/><path d="M30 82H17a3 3 0 0 1-3-3V66"/>
      </g>
      <circle cx="48" cy="48" r="3" fill="#FFFFFF"/>
    </svg>
  </div>

  <!-- 조준 대상 카드 -->
  <div class="glass" style="position: absolute; top: 528px; left: 50%; margin-left: -104px; width: 208px; border-radius: 18px; padding: 10px 13px; border-left: 3px solid #FF2E5B">
    <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between">
      <div>
        <div style="color: #FFFFFF; font-size: 14px; font-weight: 800; letter-spacing: 0.3px">RUNNER</div>
        <div style="color: rgba(255,255,255,0.55); font-size: 11px; font-weight: 600; margin-top: 1px">18m · 12km/h</div>
      </div>
      <div style="display: flex; flex-direction: row; gap: 4px">
        <div style="width: 9px; height: 9px; border-radius: 5px; background: #FF2E5B"></div>
        <div style="width: 9px; height: 9px; border-radius: 5px; background: #FF2E5B"></div>
        <div style="width: 9px; height: 9px; border-radius: 5px; background: rgba(255,255,255,0.2)"></div>
      </div>
    </div>
  </div>

  <!-- 탭 안내 -->
  <div style="position: absolute; top: 586px; left: 0; right: 0; text-align: center">
    <span style="color: rgba(255,255,255,0.55); font-size: 11px; font-weight: 600">화면 탭 — 사격 · 소음 120m</span>
  </div>

  <!-- 하단 조작 — 사격은 화면 탭이므로 버튼은 이탈 하나뿐이다 -->
  <div style="position: absolute; bottom: 38px; left: 16px; right: 16px">
    <div style="height: 62px; border-radius: 31px;
      background: linear-gradient(180deg, rgba(62,78,126,0.92) 0%, rgba(24,32,58,0.94) 100%);
      border: 1px solid rgba(255,255,255,0.16);
      box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22);
      display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 10px">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6.4 10.2 3.2 13.8 5 21 2.4v15.2L13.8 20.2 10.2 18.4 3 21.6V6.4Z"/>
        <path d="M10.2 3.2v15.2M13.8 5v15.2"/>
      </svg>
      <span style="color: #FFFFFF; font-size: 15px; font-weight: 700">지도 뷰</span>
    </div>
  </div>

</div>
</x-dc>
</body>
</html>
