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
    body { margin: 0; background: #14171c;
      font-family: -apple-system, "Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
    a { color: #3d8bff; text-decoration: none; }
    a:hover { color: #6ba7ff; }
    .item { background: #1e242e; border-radius: 12px; padding: 14px 16px; display: flex; gap: 13px; align-items: flex-start; }
    .ico { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ititle { color: #dfe3e8; font-size: 14px; font-weight: 700; }
    .ibody { color: #9aa4b5; font-size: 12px; line-height: 18px; margin-top: 4px; }
    .tag { font-size: 10.5px; font-weight: 700; letter-spacing: 0.5px; padding: 2px 7px; border-radius: 5px; }
  </style>
</helmet>

<div style="width: 390px; height: 844px; background: #14171c; overflow: hidden; position: relative; padding: 72px 24px 30px; display: flex; flex-direction: column">

  <div style="color: #ff4b3a; font-size: 19px; font-weight: 900; letter-spacing: 4px">DEADRUN</div>
  <div style="color: #dfe3e8; font-size: 26px; font-weight: 800; margin-top: 14px">달리기 전에</div>
  <div style="color: #9aa4b5; font-size: 13px; line-height: 19px; margin-top: 7px">이 게임은 실제로 밖에서 달린다. 시작 전에 두 가지 권한과 세 가지 수칙을 확인한다.</div>

  <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 26px">

    <div class="item">
      <div class="ico" style="background: #1b3358">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#3d8bff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>
        </svg>
      </div>
      <div style="flex-grow: 1">
        <div style="display: flex; align-items: center; gap: 8px">
          <div class="ititle">위치 권한</div>
          <div class="tag" style="background: #1b3358; color: #6ba7ff">필수</div>
        </div>
        <div class="ibody">주변 실제 도로를 불러오고, 달린 거리로 보급을 지급한다. 반경 1km가 플레이 구역이 된다.</div>
      </div>
    </div>

    <div class="item">
      <div class="ico" style="background: #2a3140">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#9aa4b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 8.5h3.2l1.6-2.3h8.4l1.6 2.3H21v10H3z"/><circle cx="12" cy="13" r="3.4"/>
        </svg>
      </div>
      <div style="flex-grow: 1">
        <div style="display: flex; align-items: center; gap: 8px">
          <div class="ititle">카메라 권한</div>
          <div class="tag" style="background: #2a3140; color: #9aa4b5">나중에 가능</div>
        </div>
        <div class="ibody">AR 전투 뷰에서만 쓴다. 거부해도 지도 뷰로 끝까지 플레이할 수 있다.</div>
      </div>
    </div>

    <div class="item" style="background: #3a1010; border: 1px solid #ff5f4d; align-items: flex-start">
      <div class="ico" style="background: #5a1a1a">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#ff8a7a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3.5 22 20H2z"/><path d="M12 10v4.2"/><path d="M12 17.2h.01"/>
        </svg>
      </div>
      <div style="flex-grow: 1">
        <div class="ititle" style="color: #ffd9d4">안전 수칙</div>
        <div style="display: flex; flex-direction: column; gap: 7px; margin-top: 9px">
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #ff8a7a; flex-shrink: 0"></div>
            <div style="color: #ffd9d4; font-size: 12px; line-height: 18px">차도와 교차로에서는 화면을 보지 않는다.</div>
          </div>
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #ff8a7a; flex-shrink: 0"></div>
            <div style="color: #ffd9d4; font-size: 12px; line-height: 18px">AR 전투는 멈춰 선 상태에서만 열린다. 달리기 시작하면 2초 뒤 자동으로 닫힌다.</div>
          </div>
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #ff8a7a; flex-shrink: 0"></div>
            <div style="color: #ffd9d4; font-size: 12px; line-height: 18px">차량 속도가 감지되면 게임 판정이 멈춘다. 탈것으로 이동하지 않는다.</div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div style="margin-top: auto; display: flex; flex-direction: column; gap: 14px">
    <div style="display: flex; align-items: center; gap: 11px">
      <div style="width: 24px; height: 24px; border-radius: 6px; background: #3d8bff; display: flex; align-items: center; justify-content: center; flex-shrink: 0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4.5 12.5 10 18 19.5 6.5"/>
        </svg>
      </div>
      <div style="color: #dfe3e8; font-size: 13px">위 안전 수칙을 확인했습니다</div>
    </div>

    <div style="background: #3d8bff; border-radius: 12px; padding: 16px; text-align: center">
      <div style="color: #ffffff; font-weight: 800; font-size: 16px">확인하고 시작</div>
    </div>

    <div style="color: #6d7687; font-size: 12px; line-height: 18px; text-align: center">실내 가상 모드는 권한 없이 조이스틱으로 테스트할 수 있다.</div>
  </div>

</div>
</x-dc>
</body>
</html>
