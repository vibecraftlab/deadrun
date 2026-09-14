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
      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1020"/><stop offset="1" stop-color="#0A0E1C"/></linearGradient>
      <radialGradient id="red" cx="0.5" cy="0.45" r="0.62">
        <stop offset="0" stop-color="#FF2E5B" stop-opacity="0.26"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="390" height="844" fill="url(#g1)"/>
    <g opacity="0.3" transform="translate(195 470) scale(1 0.66) rotate(-14) translate(-195 -470)"><!--OSMMAP--></g>
    <rect width="390" height="844" fill="url(#red)"/>
    <g transform="translate(112 560)"><!--ZOMBIE:brute:chase:side:0.9:0--></g>
    <g transform="translate(286 592)"><!--ZOMBIE:walker:chase:side:0.72:1--></g>
  </svg>
  <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(4,6,12,0.78)"></div>

  <div style="position: absolute; top: 168px; left: 26px; right: 26px; text-align: center">
    <div style="color: #FF2E5B; font-size: 52px; font-weight: 800; letter-spacing: 8px; text-indent: 8px; text-shadow: 0 4px 28px rgba(255,46,91,0.5)">사 망</div>
    <div style="color: rgba(255,255,255,0.68); font-size: 14px; font-weight: 600; margin-top: 12px">Brute의 공격으로 사망</div>
  </div>

  <div class="glass" style="position: absolute; top: 310px; left: 26px; right: 26px; border-radius: 22px; padding: 18px">
    <div style="display: flex; flex-direction: row">
      <div style="flex-grow: 1; flex-basis: 0; text-align: center">
        <div class="stat-lbl">생존</div>
        <div style="color: #fff; font-size: 24px; font-weight: 800; margin-top: 4px; font-variant-numeric: tabular-nums">14:22</div>
      </div>
      <div class="divider"></div>
      <div style="flex-grow: 1; flex-basis: 0; text-align: center">
        <div class="stat-lbl">주행</div>
        <div style="color: #fff; font-size: 24px; font-weight: 800; margin-top: 4px; font-variant-numeric: tabular-nums">2.63<span style="font-size:11px;color:rgba(255,255,255,0.45)">km</span></div>
      </div>
      <div class="divider"></div>
      <div style="flex-grow: 1; flex-basis: 0; text-align: center">
        <div class="stat-lbl">처치</div>
        <div style="color: #fff; font-size: 24px; font-weight: 800; margin-top: 4px; font-variant-numeric: tabular-nums">09</div>
      </div>
    </div>
  </div>

  <div style="position: absolute; bottom: 44px; left: 26px; right: 26px; display: flex; flex-direction: column; gap: 11px">
    <div style="border-radius: 18px; padding: 15px; background: linear-gradient(180deg, rgba(255,197,61,0.97), rgba(214,152,16,0.97));
      border: 1px solid rgba(255,255,255,0.34); box-shadow: 0 10px 26px rgba(255,197,61,0.28), inset 0 2px 0 rgba(255,255,255,0.4)">
      <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 9px">
        <!--ICON:gift--><span style="color: #231A02; font-size: 16px; font-weight: 800">광고 보고 그 자리에서 부활</span>
      </div>
      <div style="color: rgba(35,26,2,0.66); font-size: 11px; font-weight: 700; text-align: center; margin-top: 4px">HP 50 회복 · 무적 8초 · 런당 1회</div>
    </div>
    <div class="ghost">결과 보기</div>
  </div>
</div>
</x-dc>
</body>
</html>
