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

<div style="width: 390px; height: 844px; background: #070A14; overflow: hidden; position: relative; padding: 62px 22px 30px; display: flex; flex-direction: column">

  <svg width="390" height="300" viewBox="0 0 390 300" style="position: absolute; top: 0; left: 0">
    <defs><radialGradient id="hg" cx="0.5" cy="0.2" r="0.75">
      <stop offset="0" stop-color="#16385A" stop-opacity="0.85"/><stop offset="1" stop-color="#070A14" stop-opacity="0"/>
    </radialGradient></defs>
    <rect width="390" height="300" fill="url(#hg)"/>
  </svg>

  <div style="display: flex; flex-direction: row; align-items: center; justify-content: space-between; position: relative">
    <div>
      <div style="color: #fff; font-size: 30px; font-weight: 800; letter-spacing: -1px">DEADRUN</div>
      <div style="color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600; margin-top: 2px">구역 C-7 · 여의도</div>
    </div>
    <div class="glass" style="border-radius: 16px; padding: 8px 12px; text-align: right">
      <div class="stat-lbl">누적</div>
      <div style="color: #2FD9FF; font-size: 17px; font-weight: 800; margin-top: 2px; font-variant-numeric: tabular-nums">128.4<span style="font-size:10px;color:rgba(255,255,255,0.45)">km</span></div>
    </div>
  </div>

  <div class="glass" style="border-radius: 22px; padding: 16px; margin-top: 22px; position: relative">
    <div class="eyebrow">오늘 목표</div>
    <div style="display: flex; flex-direction: row; align-items: flex-end; gap: 6px; margin-top: 7px">
      <div style="color: #fff; font-size: 34px; font-weight: 800; letter-spacing: -1px; font-variant-numeric: tabular-nums">3.0</div>
      <div style="color: rgba(255,255,255,0.45); font-size: 13px; font-weight: 600; margin-bottom: 6px">km 완주</div>
    </div>
    <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.09); margin-top: 10px; overflow: hidden">
      <div style="width: 42%; height: 6px; border-radius: 3px; background: linear-gradient(90deg,#2FD9FF,#5FE4FF)"></div>
    </div>
    <div style="color: rgba(255,255,255,0.45); font-size: 11px; font-weight: 600; margin-top: 8px">1.26km 달림 · 보상 탄약 +10</div>
  </div>

  <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 18px">
    <div class="glass" style="border-radius: 18px; padding: 13px 15px; display: flex; flex-direction: row; align-items: center; justify-content: space-between">
      <div>
        <div style="color: #fff; font-size: 14px; font-weight: 700">실외 GPS 모드</div>
        <div style="color: rgba(255,255,255,0.45); font-size: 11px; margin-top: 2px">현재 위치 주변 실제 도로에서 달린다</div>
      </div>
      <div style="width: 46px; height: 27px; border-radius: 14px; background: #2FD9FF; position: relative; flex-shrink: 0">
        <div style="position: absolute; top: 2.5px; left: 21.5px; width: 22px; height: 22px; border-radius: 11px; background: #fff"></div>
      </div>
    </div>
    <div class="glass" style="border-radius: 18px; padding: 13px 15px; display: flex; flex-direction: row; align-items: center; justify-content: space-between">
      <div>
        <div style="color: #fff; font-size: 14px; font-weight: 700">개체 밀도</div>
        <div style="color: rgba(255,255,255,0.45); font-size: 11px; margin-top: 2px">1km²당 40마리 · 최대 120</div>
      </div>
      <div style="display: flex; flex-direction: row; gap: 5px">
        <div style="padding: 5px 10px; border-radius: 9px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 700">낮음</div>
        <div style="padding: 5px 10px; border-radius: 9px; background: #2FD9FF; color: #062330; font-size: 11px; font-weight: 800">보통</div>
        <div style="padding: 5px 10px; border-radius: 9px; background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 700">높음</div>
      </div>
    </div>
  </div>

  <div class="glass" style="border-radius: 18px; padding: 13px 15px; margin-top: 10px; display: flex; flex-direction: row; align-items: center; gap: 12px; border-color: rgba(255,197,61,0.34)">
    <div style="width: 38px; height: 38px; border-radius: 12px; background: rgba(255,197,61,0.13); display: flex; align-items: center; justify-content: center; flex-shrink: 0"><!--ICON:gift--></div>
    <div style="flex-grow: 1">
      <div style="color: #FFC53D; font-size: 13px; font-weight: 800">광고 보고 탄약 +10으로 시작</div>
      <div style="color: rgba(255,255,255,0.45); font-size: 11px; margin-top: 2px">하루 3회 중 2회 남음</div>
    </div>
  </div>

  <div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px">
    <div class="cta" style="display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 9px"><!--ICON:play--><span>런 시작</span></div>
    <div class="ghost">지난 기록</div>
  </div>
</div>
</x-dc>
</body>
</html>
