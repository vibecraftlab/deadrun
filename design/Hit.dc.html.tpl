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

  <!-- 지도 -->
  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <g stroke-linecap="round" fill="none">
      <path d="M-20 250 L410 214" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M-20 470 L410 452" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M-20 700 L410 676" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M76 -20 L58 864" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M196 -20 L188 864" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M318 -20 L332 864" stroke="#6b6f7a" stroke-width="7.6"/>
    </g>
    <circle cx="195" cy="422" r="325" fill="#4dc3ff0d" stroke="#4dc3ff55" stroke-width="4.3"/>
    <g transform="translate(195, 422) rotate(200)">
      <path d="M0,0 L-25.7,-42.9 A42.9,42.9 0 0 1 25.7,-42.9 Z" fill="#3d8bff3d"/>
    </g>
    <circle cx="195" cy="422" r="12.7" fill="#3d8bff" stroke="#ffffff" stroke-width="4.3"/>
  </svg>

  <!-- 공격 사거리 3m = 6.5px — 브루트가 바로 붙어 있다 -->
  <div class="z" style="left: 206px; top: 414px"><!--SPRITE:Brute:aggro:38--></div>
  <div class="z" style="left: 128px; top: 330px"><!--SPRITE:Runner:aggro:33--></div>
  <div class="z" style="left: 288px; top: 512px"><!--SPRITE:Walker:aggro:33--></div>

  <!-- HUD -->
  <div style="position: absolute; top: 54px; left: 12px; right: 90px; background: #000000aa; border-radius: 10px; padding: 10px">
    <div style="color: #dfe3e8; font-size: 12.5px; line-height: 19px">지도: OSM 실도로 (412 ways)</div>
    <div style="color: #dfe3e8; font-size: 12.5px; line-height: 19px">속도 3.2km/h · 레이어 지상 · 거리 2103m</div>
    <div style="color: #dfe3e8; font-size: 12.5px; line-height: 19px">탄약 2/30 · 처치 9 · 좀비 88 · 추격 3</div>
    <div style="color: #ff5f4d; font-size: 12.5px; line-height: 19px; font-weight: 700">HP 28/100</div>
  </div>

  <!-- 추격 경고 -->
  <div style="position: absolute; top: 10px; left: 0; right: 0; text-align: center">
    <span style="color: #ff5f4d; font-weight: 700; font-size: 15px">!! 추격당하는 중 (3) — 2m !!</span>
  </div>

  <!-- 근접 비네트: 2m → opacity 0.338 -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #ff0000; opacity: 0.338"></div>

  <!-- 우측 액션 버튼 -->
  <div style="position: absolute; right: 10px; top: 120px; display: flex; flex-direction: column; gap: 10px">
    <div style="width: 66px; height: 56px; border-radius: 12px; background: #2a3140dd; border: 1px solid #4a5468; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.35">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">AR</div>
      <div style="color: #9aa4b5; font-size: 10px">정지 필요</div>
    </div>
    <div style="width: 66px; height: 56px; border-radius: 12px; background: #2a3140dd; border: 1px solid #4a5468; display: flex; flex-direction: column; align-items: center; justify-content: center; opacity: 0.35">
      <div style="color: #ffffff; font-weight: 700; font-size: 15px">스캔</div>
      <div style="color: #9aa4b5; font-size: 10px">41s</div>
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

  <!-- 조이스틱 -->
  <div style="position: absolute; left: 14px; bottom: 26px; display: flex; flex-direction: column; align-items: center; gap: 10px">
    <div style="background: #2a3140dd; border-radius: 10px; padding: 6px 16px; border: 1px solid #4a5468; text-align: center">
      <div style="color: #ffffff; font-weight: 700; font-size: 14px">걷기</div>
      <div style="color: #9aa4b5; font-size: 10px">5km/h</div>
    </div>
    <div style="width: 150px; height: 150px; position: relative">
      <div style="position: absolute; top: 0; left: 51px; width: 48px; height: 48px; border-radius: 24px; background: #3a4356dd; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 17px">▲</div>
      <div style="position: absolute; top: 51px; left: 0; width: 48px; height: 48px; border-radius: 24px; background: #3a4356dd; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 17px">◀</div>
      <div style="position: absolute; top: 51px; left: 102px; width: 48px; height: 48px; border-radius: 24px; background: #3a4356dd; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 17px">▶</div>
      <div style="position: absolute; top: 102px; left: 51px; width: 48px; height: 48px; border-radius: 24px; background: #3a4356dd; display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 17px">▼</div>
    </div>
  </div>

  <!-- 감지 토스트 -->
  <div style="position: absolute; bottom: 110px; left: 16px; right: 16px">
    <div style="background: #3a1010ee; border: 1px solid #ff5f4d; border-radius: 10px; padding: 9px 14px">
      <div style="color: #ffd9d4; font-size: 13.5px; font-weight: 600">⚠️ 좀비Walker가 사용자 러너를 감지했습니다</div>
    </div>
  </div>

  <!-- 피격 플래시: #c40f0f, 0.55에서 450ms 동안 0으로 -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: #c40f0f; opacity: 0.55"></div>

</div>
</x-dc>
</body>
</html>
