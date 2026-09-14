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

<div style="width: 390px; height: 844px; position: relative; overflow: hidden; background: #070A14">
  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <defs>
      <radialGradient id="splashGlow" cx="0.5" cy="0.46" r="0.58">
        <stop offset="0" stop-color="#16385A" stop-opacity="1"/><stop offset="1" stop-color="#070A14" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="rim" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#FF2E5B" stop-opacity="0.20"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0E1730"/><stop offset="1" stop-color="#070A14"/>
      </linearGradient>
    </defs>
    <rect width="390" height="844" fill="#070A14"/>
    <ellipse cx="195" cy="390" rx="300" ry="300" fill="url(#splashGlow)"/>
    <rect x="0" y="556" width="390" height="288" fill="url(#floor)"/>
    <g stroke="#1B2745" stroke-width="2" opacity="0.7">
      <line x1="195" y1="556" x2="-420" y2="844"/><line x1="195" y1="556" x2="-90" y2="844"/>
      <line x1="195" y1="556" x2="480" y2="844"/><line x1="195" y1="556" x2="810" y2="844"/>
    </g>
    <g stroke="#1B2745" stroke-width="2" opacity="0.5">
      <line x1="0" y1="640" x2="390" y2="640"/><line x1="0" y1="712" x2="390" y2="712"/><line x1="0" y1="812" x2="390" y2="812"/>
    </g>
    <ellipse cx="195" cy="612" rx="205" ry="150" fill="url(#rim)"/>

    <g transform="translate(84 600)"><!--ZOMBIE:walker:dark:side:0.76:1--></g>
    <g transform="translate(308 592)"><!--ZOMBIE:stalker:dark:back:0.7:0--></g>
    <g transform="translate(195 652)"><!--ZOMBIE:runner:chase:front:1.3:0--></g>
  </svg>

  <div style="position: absolute; top: 236px; left: 0; right: 0; text-align: center">
    <div style="color: #fff; font-size: 62px; font-weight: 800; letter-spacing: -1.5px; line-height: 60px;
      text-shadow: 0 0 44px rgba(47,217,255,0.34)">DEADRUN</div>
    <div style="display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
      background: rgba(255,46,91,0.14); border: 1px solid rgba(255,46,91,0.42); border-radius: 20px; padding: 6px 14px">
      <div style="width: 6px; height: 6px; border-radius: 3px; background: #FF2E5B; box-shadow: 0 0 8px #FF2E5B"></div>
      <span style="color: #FF7D9B; font-size: 12px; font-weight: 700; letter-spacing: 1.5px">진짜로 달려야 산다</span>
    </div>
  </div>

  <div style="position: absolute; bottom: 84px; left: 44px; right: 44px">
    <div class="eyebrow" style="text-align: center">구역 로딩</div>
    <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08); margin-top: 12px; overflow: hidden">
      <div style="width: 68%; height: 6px; border-radius: 3px; background: linear-gradient(90deg,#2FD9FF,#5FE4FF); box-shadow: 0 0 12px rgba(47,217,255,0.6)"></div>
    </div>
    <div style="color: rgba(255,255,255,0.42); font-size: 11px; font-weight: 600; text-align: center; margin-top: 11px">도로망 412 · 개체 96</div>
  </div>
</div>
</x-dc>
</body>
</html>
