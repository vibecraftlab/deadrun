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

<div style="width: 390px; height: 844px; background: #04060C; overflow: hidden; position: relative; display: flex; flex-direction: column">

  <!-- 광고 재생 영역 -->
  <div style="height: 560px; flex-shrink: 0; position: relative; background: #0C1020; overflow: hidden">
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      border-bottom: 1px dashed rgba(255,255,255,0.22);
      background: repeating-linear-gradient(135deg, rgba(255,255,255,0.022) 0 14px, rgba(255,255,255,0) 14px 28px);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px">
      <div style="width: 62px; height: 62px; border-radius: 31px; border: 2px solid rgba(255,255,255,0.24); display: flex; align-items: center; justify-content: center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><path d="M7 4.5 19.5 12 7 19.5Z"/></svg>
      </div>
      <div style="color: rgba(255,255,255,0.5); font-size: 13px; font-weight: 700; letter-spacing: 1.5px">보상형 전면 광고</div>
      <div style="color: rgba(255,255,255,0.3); font-size: 11px; font-weight: 600">AdMob Rewarded · 15~30초 · 건너뛰기 불가</div>
    </div>

    <!-- 광고 상단 오버레이 -->
    <div style="position: absolute; top: 58px; left: 16px; right: 16px; display: flex; flex-direction: row; align-items: center; justify-content: space-between">
      <div class="glass" style="border-radius: 14px; padding: 6px 12px">
        <span style="color: #fff; font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums">12초 후 보상</span>
      </div>
      <div class="glass" style="width: 32px; height: 32px; border-radius: 16px; display: flex; align-items: center; justify-content: center; opacity: 0.4">
        <svg width="14" height="14" viewBox="0 0 24 24" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>
      </div>
    </div>

    <div style="position: absolute; bottom: 14px; left: 16px; right: 16px">
      <div style="height: 4px; border-radius: 2px; background: rgba(255,255,255,0.14); overflow: hidden">
        <div style="width: 46%; height: 4px; border-radius: 2px; background: #FFC53D"></div>
      </div>
    </div>
  </div>

  <!-- 보상 안내 -->
  <div style="flex-grow: 1; padding: 24px 26px 30px; display: flex; flex-direction: column">
    <div style="color: #fff; font-size: 22px; font-weight: 800; letter-spacing: -0.5px">끝까지 보면 그 자리에서 부활</div>
    <div style="color: rgba(255,255,255,0.5); font-size: 12.5px; line-height: 18px; margin-top: 8px">쓰러진 위치에서 다시 시작합니다. 주변 좀비는 추격을 잠시 놓칩니다.</div>

    <div style="display: flex; flex-direction: row; gap: 9px; margin-top: 18px">
      <div class="glass" style="flex-grow: 1; flex-basis: 0; border-radius: 16px; padding: 12px; text-align: center">
        <div class="stat-lbl" style="color: #FF7D9B">HP</div>
        <div style="color: #fff; font-size: 21px; font-weight: 800; margin-top: 3px">+50</div>
      </div>
      <div class="glass" style="flex-grow: 1; flex-basis: 0; border-radius: 16px; padding: 12px; text-align: center">
        <div class="stat-lbl" style="color: #2FD9FF">무적</div>
        <div style="color: #fff; font-size: 21px; font-weight: 800; margin-top: 3px">8초</div>
      </div>
      <div class="glass" style="flex-grow: 1; flex-basis: 0; border-radius: 16px; padding: 12px; text-align: center">
        <div class="stat-lbl" style="color: #FFC53D">탄약</div>
        <div style="color: #fff; font-size: 21px; font-weight: 800; margin-top: 3px">+5</div>
      </div>
    </div>

    <div style="color: rgba(255,255,255,0.32); font-size: 11px; line-height: 16px; margin-top: 16px">
      런당 1회만 가능합니다. 기록은 부활 여부와 함께 저장되고, 리더보드에서는 무부활 기록과 따로 집계합니다.
    </div>

    <div style="margin-top: auto; display: flex; flex-direction: column; gap: 10px">
      <div class="ghost">광고 그만 보고 결과로</div>
    </div>
  </div>
</div>
</x-dc>
</body>
</html>
