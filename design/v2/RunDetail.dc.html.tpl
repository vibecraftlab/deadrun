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

<div style="width:390px;height:844px;background:#070A14;overflow:hidden;position:relative;display:flex;flex-direction:column">

  <!-- 경로 지도 -->
  <div style="height:300px;flex-shrink:0;position:relative;overflow:hidden">
    <svg width="390" height="300" viewBox="0 0 390 300" style="position:absolute;top:0;left:0">
      <defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#070A14" stop-opacity="0.9"/><stop offset="0.45" stop-color="#070A14" stop-opacity="0"/>
      </linearGradient></defs>
      <rect width="390" height="300" fill="#0B1020"/>
      <g opacity="0.55" transform="translate(195 150) scale(0.52) translate(-330 -590)"><!--OSMMAP--></g>
      <!-- 달린 경로: 평시는 청색, 추격 구간은 붉은색 -->
      <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
        <path d="M58,238 L96,214 L128,196 L150,170" stroke="#1795C2"/>
        <path d="M150,170 L176,146 L206,134" stroke="#FF2E5B"/>
        <path d="M206,134 L238,128 L266,140 L282,162" stroke="#1795C2"/>
        <path d="M282,162 L296,190 L288,216" stroke="#FF2E5B"/>
        <path d="M288,216 L268,238 L238,246 L210,240" stroke="#1795C2"/>
        <path d="M210,240 L182,230 L164,208" stroke="#FF2E5B"/>
      </g>
      <circle cx="58" cy="238" r="6" fill="#1795C2" stroke="#fff" stroke-width="2"/>
      <circle cx="164" cy="208" r="6" fill="#FF2E5B" stroke="#fff" stroke-width="2"/>
      <rect width="390" height="300" fill="url(#fade)"/>
    </svg>
    <div style="position:absolute;top:58px;left:16px">
      <div class="eyebrow">9월 14일 토요일 · 구역 C-7</div>
      <div style="color:#fff;font-size:24px;font-weight:800;letter-spacing:-0.6px;margin-top:5px">저녁 런</div>
    </div>
    <div style="position:absolute;bottom:12px;left:16px;display:flex;gap:14px">
      <div style="display:flex;align-items:center;gap:6px">
        <div style="width:16px;height:3px;border-radius:2px;background:#1795C2"></div>
        <span style="color:rgba(255,255,255,0.42);font-size:10px;font-weight:700">평시</span>
      </div>
      <div style="display:flex;align-items:center;gap:6px">
        <div style="width:16px;height:3px;border-radius:2px;background:#FF2E5B"></div>
        <span style="color:rgba(255,255,255,0.42);font-size:10px;font-weight:700">추격 중</span>
      </div>
    </div>
  </div>

  <div style="padding:14px 22px 26px;flex-grow:1;overflow:hidden">
    <div class="glass" style="border-radius:20px;padding:16px">
      <div style="display:flex">
        <div style="flex-grow:1;flex-basis:0"><div class="eyebrow">거리</div>
          <div style="color:#fff;font-size:24px;font-weight:800;margin-top:4px;font-variant-numeric:tabular-nums">2.63<span style="font-size:11px;color:rgba(255,255,255,0.42)">km</span></div></div>
        <div style="flex-grow:1;flex-basis:0"><div class="eyebrow">시간</div>
          <div style="color:#fff;font-size:24px;font-weight:800;margin-top:4px;font-variant-numeric:tabular-nums">14:22</div></div>
        <div style="flex-grow:1;flex-basis:0"><div class="eyebrow">평균</div>
          <div style="color:#fff;font-size:24px;font-weight:800;margin-top:4px;font-variant-numeric:tabular-nums">11.0<span style="font-size:11px;color:rgba(255,255,255,0.42)">km/h</span></div></div>
      </div>
    </div>

    <div class="glass" style="border-radius:20px;padding:15px 16px;margin-top:11px">
      <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:10px">
        <div class="eyebrow">거리별 속도</div>
        <div style="color:#FF2E5B;font-size:10.5px;font-weight:800">붉은 구간 = 쫓기던 중</div>
      </div>
      <svg width="326" height="134" viewBox="0 0 326 134">
    <rect x="67.4" y="0" width="45.0" height="118"
       fill="#FF2E5B" fill-opacity="0.14"/><rect x="179.9" y="0" width="45.0" height="118"
       fill="#FF2E5B" fill-opacity="0.14"/><rect x="292.3" y="0" width="33.7" height="118"
       fill="#FF2E5B" fill-opacity="0.14"/><line x1="0" y1="82.6" x2="326" y2="82.6" stroke="rgba(255,255,255,0.07)"/>
     <text x="2" y="78.6" fill="rgba(255,255,255,0.42)" font-size="9" font-weight="700"
       font-family="Outfit, sans-serif">10</text><line x1="0" y1="47.2" x2="326" y2="47.2" stroke="rgba(255,255,255,0.07)"/>
     <text x="2" y="43.2" fill="rgba(255,255,255,0.42)" font-size="9" font-weight="700"
       font-family="Outfit, sans-serif">13</text><line x1="0" y1="11.8" x2="326" y2="11.8" stroke="rgba(255,255,255,0.07)"/>
     <text x="2" y="7.8" fill="rgba(255,255,255,0.42)" font-size="9" font-weight="700"
       font-family="Outfit, sans-serif">16</text>
    <path d="M0.0,92.0L11.2,87.3L22.5,89.7L33.7,85.0L45.0,88.5L56.2,90.9L67.4,37.8L78.7,28.3L89.9,22.4L101.2,33.0L112.4,54.3L123.7,87.3L134.9,92.0L146.1,95.6L157.4,93.2L168.6,89.7L179.9,33.0L191.1,18.9L202.3,14.2L213.6,26.0L224.8,68.4L236.1,94.4L247.3,99.1L258.6,96.8L269.8,92.0L281.0,88.5L292.3,42.5L303.5,24.8L314.8,16.5L326.0,56.6" fill="none" stroke="#1795C2" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    <text x="89.9" y="12" text-anchor="middle" fill="#FF2E5B" font-size="9"
      font-weight="800" font-family="Outfit, sans-serif">추격 1</text><text x="202.3" y="12" text-anchor="middle" fill="#FF2E5B" font-size="9"
      font-weight="800" font-family="Outfit, sans-serif">추격 2</text><text x="309.1" y="12" text-anchor="middle" fill="#FF2E5B" font-size="9"
      font-weight="800" font-family="Outfit, sans-serif">추격 3</text>
    <text x="0" y="132" fill="rgba(255,255,255,0.42)" font-size="9" font-weight="700" font-family="Outfit, sans-serif">0km</text>
    <text x="326" y="132" text-anchor="end" fill="rgba(255,255,255,0.42)" font-size="9" font-weight="700" font-family="Outfit, sans-serif">2.63km</text>
  </svg>
    </div>

    <div class="glass" style="border-radius:20px;padding:15px 16px;margin-top:11px">
      <div class="eyebrow" style="margin-bottom:11px">구간 기록</div>
      <div style="display:flex;align-items:center;gap:11px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="color:rgba(255,255,255,0.42);font-size:11.5px;font-weight:700;width:46px">1km</span>
        <div style="flex-grow:1;height:6px;border-radius:3px;background:rgba(255,255,255,0.07)">
          <div style="width:41%;height:6px;border-radius:3px;background:#1795C2"></div>
        </div>
        <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums;width:40px;text-align:right">5:48</span>
        <span style="color:#FF2E5B;font-size:10.5px;font-weight:800;width:34px;text-align:right">추격1</span>
      </div><div style="display:flex;align-items:center;gap:11px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="color:rgba(255,255,255,0.42);font-size:11.5px;font-weight:700;width:46px">2km</span>
        <div style="flex-grow:1;height:6px;border-radius:3px;background:rgba(255,255,255,0.07)">
          <div style="width:69%;height:6px;border-radius:3px;background:#1795C2"></div>
        </div>
        <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums;width:40px;text-align:right">5:21</span>
        <span style="color:#FF2E5B;font-size:10.5px;font-weight:800;width:34px;text-align:right">추격1</span>
      </div><div style="display:flex;align-items:center;gap:11px;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.06)">
        <span style="color:rgba(255,255,255,0.42);font-size:11.5px;font-weight:700;width:46px">0.63km</span>
        <div style="flex-grow:1;height:6px;border-radius:3px;background:rgba(255,255,255,0.07)">
          <div style="width:84%;height:6px;border-radius:3px;background:#1795C2"></div>
        </div>
        <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums;width:40px;text-align:right">3:13</span>
        <span style="color:#FF2E5B;font-size:10.5px;font-weight:800;width:34px;text-align:right">추격1</span>
      </div>
      <div style="color:rgba(255,255,255,0.42);font-size:10.5px;line-height:16px;margin-top:10px">
        구간마다 추격이 한 번씩 있었다. 쫓길 때마다 속도가 평소의 1.5배까지 올라갔다.
      </div>
    </div>
  </div>
</div>
</x-dc>
</body>
</html>
