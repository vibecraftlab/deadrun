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

<div style="width: 390px; height: 844px; background: #070A14; overflow: hidden; position: relative">
  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <defs>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0B1020"/><stop offset="0.45" stop-color="#131A2F"/><stop offset="1" stop-color="#0A0E1C"/>
      </linearGradient>
      <linearGradient id="horizon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#070A14" stop-opacity="1"/><stop offset="1" stop-color="#070A14" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="playerGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#FF2E5B" stop-opacity="0.4"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="playerDot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7FEBFF"/><stop offset="1" stop-color="#1BA8D8"/>
      </linearGradient>
    </defs>
    <rect width="390" height="844" fill="url(#ground)"/>
    <g transform="translate(195 470) scale(1 0.66) rotate(-14) translate(-195 -470)"><!--OSMMAP--></g>
    <rect x="0" y="0" width="390" height="230" fill="url(#horizon)"/>

    <circle cx="195" cy="470" r="86" fill="url(#playerGlow)"/>
    <ellipse cx="195" cy="482" rx="26" ry="8" fill="#000" opacity="0.4"/>
    <circle cx="195" cy="470" r="15" fill="url(#playerDot)" stroke="#fff" stroke-width="3.5"/>

    <!-- 붙어 있는 브루트: 공격 사거리 0.5m -->
    <g transform="translate(214 486)"><!--ZOMBIE:brute:chase:side:0.94:1--></g>
    <g transform="translate(132 392)"><!--ZOMBIE:runner:chase:side:0.86:1--></g>
    <g transform="translate(286 566)"><!--ZOMBIE:walker:chase:side:0.8:1--></g>
  </svg>

  <!--STATBAR:2.63|9.8|3.2|28|2|02|1-->

  <!-- 추격 경고 -->
  <div style="position: absolute; top: 176px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 8px;
      background: linear-gradient(180deg, rgba(255,46,91,0.96), rgba(196,20,58,0.96));
      border: 1px solid rgba(255,255,255,0.24); border-radius: 20px; padding: 7px 15px 7px 11px;
      box-shadow: 0 8px 22px rgba(255,46,91,0.45), inset 0 1px 0 rgba(255,255,255,0.3)">
      <!--ICON:warn--><span style="color: #fff; font-size: 13.5px; font-weight: 800">추격 3 · 2m</span>
    </div>
  </div>

  <!-- 피격 수치 -->
  <div style="position: absolute; top: 330px; left: 0; right: 0; text-align: center">
    <div style="color: #FF2E5B; font-size: 46px; font-weight: 800; letter-spacing: -1.5px; text-shadow: 0 3px 22px rgba(255,46,91,0.65)">−30</div>
    <div style="color: #fff; font-size: 13px; font-weight: 700; margin-top: 2px">BRUTE에게 피격</div>
  </div>

  <!-- 위험 안내 -->
  <div style="position: absolute; bottom: 214px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 9px;
      background: rgba(255,46,91,0.14); border: 1px solid rgba(255,46,91,0.48); border-radius: 20px; padding: 8px 16px">
      <div style="width: 7px; height: 7px; border-radius: 4px; background: #FF2E5B; box-shadow: 0 0 9px #FF2E5B"></div>
      <span style="color: #FF7D9B; font-size: 12.5px; font-weight: 800">1.2초마다 맞는다 · 지금 달려서 벗어나야 한다</span>
    </div>
  </div>

  <div style="position: absolute; right: 16px; top: 300px; display: flex; flex-direction: column; gap: 32px">
    <div class="rbtn" style="opacity: 0.4"><!--ICON:scan--><div class="rbtn-cap">41s</div></div>
    <div class="rbtn"><!--ICON:fire--><div class="rbtn-cap">사격</div></div>
  </div>

  <div style="position: absolute; bottom: 38px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="position: relative; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center">
      <div style="position: absolute; width: 84px; height: 84px; border-radius: 42px; border: 2px solid rgba(47,217,255,0.2)"></div>
      <div style="width: 72px; height: 72px; border-radius: 36px; opacity: 0.4;
        background: linear-gradient(180deg,#5FE4FF,#0E96D2); border: 2px solid rgba(255,255,255,0.5);
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px">
        <!--ICON:ar--><span style="color: #062330; font-size: 9px; font-weight: 800; letter-spacing: 0.6px">정지 필요</span>
      </div>
    </div>
  </div>

  <!-- 피격 플래시 -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #C40F0F; opacity: 0.42"></div>
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 10px solid rgba(255,46,91,0.55)"></div>
</div>
</x-dc>
</body>
</html>
