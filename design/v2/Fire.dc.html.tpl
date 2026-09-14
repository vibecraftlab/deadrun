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
<!--CSS-->
  </style>
</helmet>

<div style="width: 390px; height: 844px; background: #000; overflow: hidden; position: relative">
  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121A2A"/><stop offset="1" stop-color="#080C14"/></linearGradient>
      <linearGradient id="asphalt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#10141C"/><stop offset="1" stop-color="#05070B"/></linearGradient>
      <radialGradient id="flash" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#FFF4C8" stop-opacity="0.85"/><stop offset="0.35" stop-color="#FFC53D" stop-opacity="0.4"/><stop offset="1" stop-color="#FFC53D" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="noise" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.72" stop-color="#FFC53D" stop-opacity="0"/><stop offset="0.93" stop-color="#FFC53D" stop-opacity="0.12"/><stop offset="1" stop-color="#FFC53D" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="blood" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#FF2E5B" stop-opacity="0.7"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="390" height="430" fill="url(#sky)"/>
    <rect x="0" y="430" width="390" height="414" fill="url(#asphalt)"/>
    <g fill="#0A0E16">
      <path d="M0 128 L62 128 L62 438 L0 438 Z"/><path d="M62 196 L114 196 L114 438 L62 438 Z"/>
      <path d="M240 272 L284 272 L284 438 L240 438 Z"/><path d="M284 180 L334 180 L334 438 L284 438 Z"/>
      <path d="M334 102 L390 102 L390 438 L334 438 Z"/>
    </g>
    <g stroke="#2FD9FF" stroke-opacity="0.10" stroke-width="1">
      <line x1="0" y1="646" x2="390" y2="646"/><line x1="0" y1="534" x2="390" y2="534"/>
      <line x1="0" y1="497" x2="390" y2="497"/><line x1="0" y1="478" x2="390" y2="478"/>
      <line x1="195" y1="430" x2="-975" y2="800"/><line x1="195" y1="430" x2="1365" y2="800"/>
    </g>

    <!-- 소음 파동 120m -->
    <circle cx="195" cy="540" r="280" fill="url(#noise)"/>
    <g fill="none" stroke="#FFC53D" stroke-opacity="0.28">
      <ellipse cx="195" cy="560" rx="120" ry="34"/><ellipse cx="195" cy="560" rx="200" ry="56"/><ellipse cx="195" cy="560" rx="286" ry="80"/>
    </g>

    <!-- 피격된 좀비: 쓰러지는 중 -->
    <g transform="translate(142 528) rotate(-26)"><!--ZOMBIE:runner:chase:front:1.55:0--></g>
    <ellipse cx="142" cy="500" rx="84" ry="84" fill="url(#blood)"/>
    <g stroke="#FF2E5B" stroke-width="3" stroke-linecap="round" opacity="0.95">
      <path d="M142,482 L120,454"/><path d="M142,482 L164,458"/><path d="M142,482 L110,490"/>
      <path d="M142,482 L176,494"/><path d="M142,482 L132,448"/><path d="M142,482 L158,510"/>
    </g>
    <g fill="#FF2E5B">
      <circle cx="112" cy="446" r="3.4"/><circle cx="170" cy="452" r="3"/><circle cx="100" cy="494" r="2.8"/>
      <circle cx="184" cy="498" r="3.2"/><circle cx="128" cy="440" r="2.4"/>
    </g>

    <!-- 총구 섬광 -->
    <circle cx="195" cy="752" r="74" fill="url(#flash)"/>
  </svg>

  <!--STATBAR:2.63|9.8|0.0|64|3|11|3-->

  <!-- 명중 표시 -->
  <div style="position: absolute; top: 330px; left: 46px; width: 192px; text-align: center">
    <div style="color: #FF2E5B; font-size: 30px; font-weight: 800; letter-spacing: -1px; text-shadow: 0 2px 14px rgba(255,46,91,0.7)">처치</div>
    <div style="color: #fff; font-size: 13px; font-weight: 700; margin-top: 2px">RUNNER · 1발</div>
  </div>

  <!-- 조준 링: 명중 순간 붉게 -->
  <div style="position: absolute; top: 422px; left: 195px; width: 96px; height: 96px; margin-left: -48px; margin-top: -48px">
    <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
      <circle cx="48" cy="48" r="38" stroke="#FF2E5B" stroke-opacity="0.5" stroke-width="2"/>
      <g stroke="#FF2E5B" stroke-width="4" stroke-linecap="round">
        <path d="M10 26V13a3 3 0 0 1 3-3h13"/><path d="M70 10h13a3 3 0 0 1 3 3v13"/>
        <path d="M86 70v13a3 3 0 0 1-3 3H70"/><path d="M26 86H13a3 3 0 0 1-3-3V70"/>
      </g>
      <circle cx="48" cy="48" r="3" fill="#fff"/>
    </svg>
  </div>

  <!-- 소음 경고 -->
  <div style="position: absolute; top: 560px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 9px;
      background: rgba(255,197,61,0.14); border: 1px solid rgba(255,197,61,0.5); border-radius: 20px; padding: 7px 15px">
      <div style="width: 7px; height: 7px; border-radius: 4px; background: #FFC53D; box-shadow: 0 0 9px #FFC53D"></div>
      <span style="color: #FFC53D; font-size: 12.5px; font-weight: 800">총성 · 반경 120m 좀비가 몰려온다</span>
    </div>
  </div>

  <div style="position: absolute; top: 604px; left: 0; right: 0; text-align: center">
    <span style="color: rgba(255,255,255,0.5); font-size: 11.5px; font-weight: 600">주변 개체 7마리가 소리를 들었다</span>
  </div>

  <!-- 탄약 소모 -->
  <div class="glass" style="position: absolute; top: 176px; right: 12px; border-radius: 16px; padding: 8px 13px">
    <div style="color: #FFC53D; font-size: 15px; font-weight: 800; font-variant-numeric: tabular-nums">−1</div>
  </div>

  <div style="position: absolute; bottom: 38px; left: 16px; right: 16px">
    <div style="height: 62px; border-radius: 31px; background: linear-gradient(180deg, rgba(62,78,126,0.92), rgba(24,32,58,0.94));
      border: 1px solid rgba(255,255,255,0.16); box-shadow: 0 8px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22);
      display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 10px">
      <!--ICON:map--><span style="color: #fff; font-size: 15px; font-weight: 700">지도 뷰</span>
    </div>
  </div>
</div>
</x-dc>
</body>
</html>
