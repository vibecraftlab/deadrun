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

  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <g stroke-linecap="round" fill="none">
      <path d="M-20 250 L410 214" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M-20 470 L410 452" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M196 -20 L188 864" stroke="#6b6f7a" stroke-width="7.6"/>
      <path d="M318 -20 L332 864" stroke="#6b6f7a" stroke-width="7.6"/>
    </g>
    <circle cx="195" cy="422" r="12.7" fill="#3d8bff" stroke="#ffffff" stroke-width="4.3"/>
  </svg>
  <div class="z" style="left: 214px; top: 404px"><!--SPRITE:Brute:aggro:38--></div>

  <!-- 사망 오버레이 -->
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 24px">
    <div style="color: #ff4b3a; font-size: 46px; font-weight: 900; letter-spacing: 10px">사 망</div>
    <div style="color: #dfe3e8; font-size: 15px">Brute의 공격으로 사망</div>
    <div style="color: #9aa4b5; font-size: 14px; margin-bottom: 12px">생존 14분 22초 · 2103m · 처치 9</div>
    <div style="background: #3d8bff; border-radius: 12px; padding: 16px; margin-top: 8px">
      <div style="color: #ffffff; font-weight: 800; font-size: 16px">다시 시작</div>
    </div>
  </div>

</div>
</x-dc>
</body>
</html>
