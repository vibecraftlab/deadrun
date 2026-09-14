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
    .item { border-radius: 18px; padding: 15px 16px; display: flex; flex-direction: row; gap: 13px; align-items: flex-start; }
    .ico { width: 38px; height: 38px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ititle { color: #fff; font-size: 14.5px; font-weight: 800; }
    .ibody { color: rgba(255,255,255,0.5); font-size: 11.5px; line-height: 17px; margin-top: 4px; }
    .tag { font-size: 10px; font-weight: 800; letter-spacing: 0.5px; padding: 3px 8px; border-radius: 7px; }
  </style>
</helmet>

<div style="width: 390px; height: 844px; background: #070A14; overflow: hidden; position: relative; padding: 66px 22px 30px; display: flex; flex-direction: column">

  <svg width="390" height="260" viewBox="0 0 390 260" style="position: absolute; top: 0; left: 0">
    <defs><radialGradient id="og" cx="0.5" cy="0.15" r="0.8">
      <stop offset="0" stop-color="#16385A" stop-opacity="0.7"/><stop offset="1" stop-color="#070A14" stop-opacity="0"/>
    </radialGradient></defs>
    <rect width="390" height="260" fill="url(#og)"/>
  </svg>

  <div style="position: relative">
    <div style="color: #fff; font-size: 27px; font-weight: 800; letter-spacing: -0.8px">달리기 전에</div>
    <div style="color: rgba(255,255,255,0.5); font-size: 12.5px; line-height: 19px; margin-top: 8px">이 게임은 실제로 밖에서 달립니다. 권한 두 가지와 안전 수칙 세 가지를 확인해 주세요.</div>
  </div>

  <div style="display: flex; flex-direction: column; gap: 11px; margin-top: 24px">

    <div class="item glass">
      <div class="ico" style="background: rgba(47,217,255,0.13)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2FD9FF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21.2s7.4-6.6 7.4-11.6a7.4 7.4 0 1 0-14.8 0c0 5 7.4 11.6 7.4 11.6Z"/><circle cx="12" cy="9.6" r="2.7"/></svg>
      </div>
      <div style="flex-grow: 1">
        <div style="display: flex; align-items: center; gap: 8px">
          <div class="ititle">위치 권한</div>
          <div class="tag" style="background: rgba(47,217,255,0.15); color: #2FD9FF">필수</div>
        </div>
        <div class="ibody">주변 실제 도로를 불러오고 달린 거리를 잽니다. 반경 1km가 플레이 구역이 됩니다.</div>
      </div>
    </div>

    <div class="item glass">
      <div class="ico" style="background: rgba(255,255,255,0.07)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.62)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 8.5h3.2l1.6-2.3h8.4l1.6 2.3H21v10H3z"/><circle cx="12" cy="13" r="3.4"/></svg>
      </div>
      <div style="flex-grow: 1">
        <div style="display: flex; align-items: center; gap: 8px">
          <div class="ititle">카메라 권한</div>
          <div class="tag" style="background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.62)">나중에 가능</div>
        </div>
        <div class="ibody">AR 전투 뷰에서만 씁니다. 거부해도 지도 뷰로 끝까지 플레이할 수 있습니다.</div>
      </div>
    </div>

    <div class="item" style="background: rgba(255,46,91,0.09); border: 1px solid rgba(255,46,91,0.34)">
      <div class="ico" style="background: rgba(255,46,91,0.16)">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3.2 22.3 20.6H1.7L12 3.2Z" fill="#FF2E5B"/>
          <rect x="10.9" y="9" width="2.2" height="6" rx="1.1" fill="#0B0F1A"/><circle cx="12" cy="17.4" r="1.3" fill="#0B0F1A"/></svg>
      </div>
      <div style="flex-grow: 1">
        <div class="ititle" style="color: #FF7D9B">안전 수칙</div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px">
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #FF2E5B; flex-shrink: 0"></div>
            <div style="color: rgba(255,255,255,0.78); font-size: 11.5px; line-height: 17px">차도와 교차로에서는 화면을 보지 않습니다.</div>
          </div>
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #FF2E5B; flex-shrink: 0"></div>
            <div style="color: rgba(255,255,255,0.78); font-size: 11.5px; line-height: 17px">AR 전투는 멈춰 선 상태에서만 열립니다. 달리기 시작하면 2초 뒤 자동으로 닫힙니다.</div>
          </div>
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #FF2E5B; flex-shrink: 0"></div>
            <div style="color: rgba(255,255,255,0.78); font-size: 11.5px; line-height: 17px">차량 속도가 감지되면 게임 판정이 멈춥니다. 탈것으로 이동하지 않습니다.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div style="margin-top: auto; display: flex; flex-direction: column; gap: 13px">
    <div style="display: flex; align-items: center; gap: 11px">
      <div style="width: 26px; height: 26px; border-radius: 8px; background: #2FD9FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#062330" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 6.5"/></svg>
      </div>
      <div style="color: rgba(255,255,255,0.82); font-size: 13px; font-weight: 600">위 안전 수칙을 확인했습니다</div>
    </div>
    <div class="cta">확인하고 시작</div>
    <div style="color: rgba(255,255,255,0.34); font-size: 11.5px; line-height: 17px; text-align: center">실내 가상 모드는 권한 없이 조이스틱으로 테스트할 수 있습니다.</div>
  </div>
</div>
</x-dc>
</body>
</html>
