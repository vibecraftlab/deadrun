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
    body { margin: 0; background: #181b20;
      font-family: -apple-system, "Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
    a { color: #3d8bff; text-decoration: none; }
    a:hover { color: #6ba7ff; }
    .z { position: absolute; transform: translate(-50%, -50%); }
  </style>
</helmet>

<div style="width: 390px; height: 844px; background: #181b20; overflow: hidden; position: relative">

  <!-- 지도 SVG — 화면 좌표 1px = 0.46m (viewSpan 180m / 390px) -->
  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <!-- 지상 도로 #6b6f7a (3.5m) / 고가 #c9ae45 (5m) / 지하 #3a3a52 (5m) -->
    <g stroke-linecap="round" fill="none">
      <path d="M-20 250 L410 214" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M-20 470 L410 452" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M-20 700 L410 676" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M76 -20 L58 864" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M196 -20 L188 864" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M318 -20 L332 864" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M-20 90 L410 132" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M58 864 L410 560" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M-20 596 L188 470" stroke="#3a3a52" stroke-width="10.8"/>
      <path d="M-20 352 L410 316" stroke="#c9ae45" stroke-width="10.8"/>
    </g>

    <!-- 레이더 링 r=150m -->
    <circle cx="195" cy="422" r="325" fill="#4dc3ff0d" stroke="#4dc3ff55" stroke-width="4.3"/>

    <!-- 레이어 불일치 표시 (지하 좀비) -->
    <circle cx="92" cy="600" r="21.7" fill="none" stroke="#ffffff88" stroke-width="2.6" stroke-dasharray="6.5,4.3"/>

    <!-- 원시 GPS 점 -->
    <circle cx="203" cy="414" r="5.4" fill="#ffffff66"/>

    <!-- 방향 콘 (coneL = 42.9px) -->
    <g transform="translate(195, 422) rotate(28)">
      <path d="M0,0 L-25.7,-42.9 A42.9,42.9 0 0 1 25.7,-42.9 Z" fill="#3d8bff3d"/>
    </g>

    <!-- 플레이어 -->
    <circle cx="195" cy="422" r="12.7" fill="#3d8bff" stroke="#ffffff" stroke-width="4.3"/>
  </svg>

  <!-- 좀비 픽셀 마커 (1px = 1m, aggro는 ×1.25) -->
  <div class="z" style="left: 128px; top: 300px"><!--SPRITE:Walker:aggro:33--></div>
  <div class="z" style="left: 300px; top: 196px"><!--SPRITE:Walker:base:26--></div>
  <div class="z" style="left: 252px; top: 528px"><!--SPRITE:Runner:aggro:33--></div>
  <div class="z" style="left: 92px; top: 600px"><!--SPRITE:Stalker:base:26--></div>
  <div class="z" style="left: 322px; top: 700px"><!--SPRITE:Brute:base:30--></div>
  <div class="z" style="left: 58px; top: 148px"><!--SPRITE:Walker:base:26--></div>
  <div class="z" style="left: 344px; top: 404px"><!--SPRITE:Runner:base:26--></div>

  <!-- 추격 경고 -->
  <div style="position: absolute; top: 10px; left: 0; right: 0; text-align: center">
    <span style="color: #ff5f4d; font-weight: 700; font-size: 15px">!! 추격당하는 중 (2) — 38m !!</span>
  </div>

  <!-- HUD -->
  <div style="position: absolute; top: 54px; left: 12px; right: 90px; background: #000000aa; border-radius: 10px; padding: 10px">
    <div style="color: #dfe3e8; font-size: 12.5px; line-height: 19px">지도: OSM 실도로 (412 ways)</div>
    <div style="color: #dfe3e8; font-size: 12.5px; line-height: 19px">속도 11.4km/h · 레이어 지상 · 거리 1284m</div>
    <div style="color: #dfe3e8; font-size: 12.5px; line-height: 19px">탄약 7/30 · 처치 4 · 좀비 96 · 추격 2</div>
    <div style="color: #7fd8a0; font-size: 12.5px; line-height: 19px; font-weight: 700">HP 64/100</div>
  </div>

  <!-- 근접 비네트: nearestChaserM 38m → opacity 0.128. HUD·경고 위에 올라간다 -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #ff0000; opacity: 0.128"></div>

  <!-- 우측 액션 버튼 (66×56, gap 10) -->
  <div style="position: absolute; right: 10px; top: 120px; display: flex; flex-direction: column; gap: 10px">
    <div style="width: 66px; height: 56px; border-radius: 12px; background: #2a3140dd; border: 1px solid #4a5468; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.35">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">AR</div>
      <div style="color: #9aa4b5; font-size: 10px">정지 필요</div>
    </div>
    <div style="width: 66px; height: 56px; border-radius: 12px; background: #2a3140dd; border: 1px solid #4a5468; display: flex; flex-direction: column; align-items: center; justify-content: center">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">스캔</div>
      <div style="color: #9aa4b5; font-size: 10px">400m·소음</div>
    </div>
    <div style="width: 66px; height: 56px; border-radius: 12px; background: #2a3140dd; border: 1px solid #4a5468; display: flex; flex-direction: column; align-items: center; justify-content: center">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">근접</div>
      <div style="color: #9aa4b5; font-size: 10px">3m</div>
    </div>
    <div style="width: 66px; height: 56px; border-radius: 12px; background: #2a3140dd; border: 1px solid #4a5468; display: flex; flex-direction: column; align-items: center; justify-content: center">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">사격</div>
      <div style="color: #9aa4b5; font-size: 10px">25m·소음</div>
    </div>
    <div style="width: 66px; height: 56px; border-radius: 12px; background: #2a3140dd; border: 1px solid #4a5468; display: flex; flex-direction: column; align-items: center; justify-content: center">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">⤢</div>
      <div style="color: #9aa4b5; font-size: 10px">180m</div>
    </div>
  </div>

  <!-- 가상 모드 조이스틱 -->
  <div style="position: absolute; left: 14px; bottom: 26px; display: flex; flex-direction: column; align-items: center; gap: 10px">
    <div style="background: #2a3140dd; border-radius: 10px; padding: 6px 16px; border: 1px solid #4a5468; text-align: center">
      <div style="color: #ffffff; font-weight: 700; font-size: 14px">조깅</div>
      <div style="color: #9aa4b5; font-size: 10px">12km/h</div>
    </div>
    <div style="width: 150px; height: 150px; position: relative">
      <div style="position: absolute; top: 0; left: 51px; width: 48px; height: 48px; border-radius: 24px; background: #3a4356dd; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 17px">▲</div>
      <div style="position: absolute; top: 51px; left: 0; width: 48px; height: 48px; border-radius: 24px; background: #3a4356dd; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 17px">◀</div>
      <div style="position: absolute; top: 51px; left: 102px; width: 48px; height: 48px; border-radius: 24px; background: #3a4356dd; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 17px">▶</div>
      <div style="position: absolute; top: 102px; left: 51px; width: 48px; height: 48px; border-radius: 24px; background: #3a4356dd; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 17px">▼</div>
    </div>
  </div>

</div>
</x-dc>
</body>
</html>
