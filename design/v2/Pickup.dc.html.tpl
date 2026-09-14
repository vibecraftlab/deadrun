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
      <radialGradient id="goldWash" cx="0.5" cy="0.44" r="0.55">
        <stop offset="0" stop-color="#FFC53D" stop-opacity="0.22"/><stop offset="1" stop-color="#FFC53D" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="playerGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#2FD9FF" stop-opacity="0.34"/><stop offset="1" stop-color="#2FD9FF" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="playerDot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7FEBFF"/><stop offset="1" stop-color="#1BA8D8"/>
      </linearGradient>
    </defs>
    <rect width="390" height="844" fill="url(#ground)"/>
    <g transform="translate(195 470) scale(1 0.66) rotate(-14) translate(-195 -470)"><!--OSMMAP--></g>
    <rect x="0" y="0" width="390" height="230" fill="url(#horizon)"/>
    <rect width="390" height="844" fill="url(#goldWash)"/>

    <circle cx="195" cy="470" r="76" fill="url(#playerGlow)"/>
    <path d="M195,470 L152,398 A84,84 0 0 1 238,398 Z" fill="#2FD9FF" fill-opacity="0.16"/>
    <ellipse cx="195" cy="482" rx="26" ry="8" fill="#000" opacity="0.4"/>
    <circle cx="195" cy="470" r="15" fill="url(#playerDot)" stroke="#fff" stroke-width="3.5"/>

    <!-- 수거 반경 15m -->
    <circle cx="195" cy="404" r="34" fill="#FFC53D" fill-opacity="0.10" stroke="#FFC53D" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="4 5"/>
    <g transform="translate(195 404)"><!--GUNPICKUP:1.15--></g>

    <g transform="translate(312 590) scale(0.62)" opacity="0.75"><!--GUNPICKUP:1--></g>
    <g transform="translate(74 268) scale(0.5)" opacity="0.6"><!--GUNPICKUP:1--></g>

    <g transform="translate(318 300)"><!--ZOMBIE:walker:roam:side:0.7:0--></g>
  </svg>

  <!--STATBAR:2.63|9.8|10.2|64|3|12|3-->

  <!-- 획득 배너 -->
  <div style="position: absolute; top: 176px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px;
      background: linear-gradient(180deg, rgba(255,197,61,0.96), rgba(214,152,16,0.96));
      border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; padding: 8px 16px 8px 12px;
      box-shadow: 0 8px 24px rgba(255,197,61,0.34), inset 0 1px 0 rgba(255,255,255,0.36)">
      <svg width="19" height="19" viewBox="0 0 22 18" fill="#231A02">
        <path d="M1 3h18v5h-4l-1.5 3H9l-1-3H5.5L5 16H1.5L2.5 8H1Z"/><rect x="14" y="0.6" width="3" height="2.6" rx="0.8"/>
      </svg>
      <span style="color: #231A02; font-size: 14px; font-weight: 800">탄약 +5 획득 · 권총 탄창</span>
    </div>
  </div>

  <!-- 수거 안내 -->
  <div class="glass" style="position: absolute; top: 330px; left: 50%; margin-left: -86px; width: 172px; border-radius: 16px; padding: 9px 12px; text-align: center; border-color: rgba(255,197,61,0.4)">
    <div class="stat-lbl" style="color: #FFC53D">보급 상자</div>
    <div style="color: #fff; font-size: 13px; font-weight: 700; margin-top: 4px">15m 안에서 자동 수거</div>
  </div>

  <div style="position: absolute; right: 16px; top: 300px; display: flex; flex-direction: column; gap: 32px">
    <div class="rbtn"><!--ICON:scan--><div class="rbtn-cap">스캔</div></div>
    <div class="rbtn"><!--ICON:fire--><div class="rbtn-cap">사격</div></div>
  </div>

  <div style="position: absolute; left: 16px; bottom: 132px">
    <div class="rbtn" style="width: 48px; height: 48px; border-radius: 24px"><!--ICON:recenter--></div>
  </div>

  <!-- 남은 보급 트래커 -->
  <div class="glass" style="position: absolute; right: 16px; bottom: 128px; border-radius: 18px; padding: 9px 12px">
    <div class="stat-lbl" style="margin-bottom: 8px">보급</div>
    <div style="display: flex; flex-direction: column; gap: 8px">
      <div style="display: flex; flex-direction: row; align-items: center; gap: 7px">
        <div style="width: 7px; height: 7px; border-radius: 4px; background: #FFC53D; box-shadow: 0 0 8px #FFC53D"></div>
        <span style="color: #fff; font-size: 11px; font-weight: 700; min-width: 34px">권총</span>
        <span style="color: #FFC53D; font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums">0m</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 7px">
        <div style="width: 7px; height: 7px; border-radius: 4px; background: rgba(255,197,61,0.5)"></div>
        <span style="color: rgba(255,255,255,0.72); font-size: 11px; font-weight: 600; min-width: 34px">탄창</span>
        <span style="color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums">180m</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 7px">
        <div style="width: 7px; height: 7px; border-radius: 4px; background: rgba(255,197,61,0.5)"></div>
        <span style="color: rgba(255,255,255,0.72); font-size: 11px; font-weight: 600; min-width: 34px">탄창</span>
        <span style="color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums">340m</span>
      </div>
    </div>
  </div>

  <div style="position: absolute; bottom: 38px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="position: relative; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center">
      <div style="position: absolute; width: 84px; height: 84px; border-radius: 42px; border: 2px solid rgba(47,217,255,0.35)"></div>
      <div style="width: 72px; height: 72px; border-radius: 36px;
        background: linear-gradient(180deg,#5FE4FF,#0E96D2); border: 2px solid rgba(255,255,255,0.5);
        box-shadow: 0 0 0 7px rgba(47,217,255,0.14), 0 14px 30px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.5);
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px">
        <!--ICON:ar--><span style="color: #062330; font-size: 9px; font-weight: 800; letter-spacing: 0.6px">AR</span>
      </div>
    </div>
  </div>
</div>
</x-dc>
</body>
</html>
