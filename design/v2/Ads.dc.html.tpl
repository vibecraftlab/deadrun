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
    .card { background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; }
    .slot { border-radius: 14px; padding: 14px 16px; }
    .tag { font-size: 10px; font-weight: 800; letter-spacing: 0.6px; padding: 3px 8px; border-radius: 6px; }
  </style>
</helmet>

<div style="width: 1180px; height: 880px; background: #070A14; padding: 30px; overflow: hidden; display: flex; flex-direction: column; gap: 18px">

  <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px">
    <div style="display: flex; align-items: baseline; gap: 13px">
      <div style="color: #fff; font-size: 28px; font-weight: 800; letter-spacing: -0.8px">광고 배치</div>
      <div style="color: rgba(255,255,255,0.45); font-size: 14px; font-weight: 600">보상형 3곳 · 게시형 2곳</div>
    </div>
    <div style="color: rgba(255,255,255,0.42); font-size: 12px; margin-top: 7px">
      원칙 하나만 지킨다. <span style="color:#FF7D9B;font-weight:700">달리는 동안에는 광고를 띄우지 않는다.</span>
      실외에서 뛰는 사람의 화면을 가리는 건 재미 문제가 아니라 안전 문제다.
    </div>
  </div>

  <div style="display: flex; flex-direction: row; gap: 18px; flex-grow: 1">

    <!-- 보상형 -->
    <div class="card" style="flex-grow: 1.2; flex-basis: 0; padding: 20px; border-color: rgba(255,197,61,0.26)">
      <div style="display: flex; align-items: center; gap: 9px">
        <div class="tag" style="background: rgba(255,197,61,0.16); color: #FFC53D">보상형</div>
        <div style="color: #fff; font-size: 15px; font-weight: 800">사용자가 스스로 누른다</div>
      </div>
      <div style="color: rgba(255,255,255,0.45); font-size: 11.5px; line-height: 17px; margin-top: 9px">
        AdMob Rewarded. 15~30초, 건너뛰기 불가. 끝까지 봐야 보상이 나간다. 매출의 대부분이 여기서 나온다.
      </div>

      <div style="display: flex; flex-direction: column; gap: 11px; margin-top: 16px">
        <div class="slot" style="background: rgba(255,197,61,0.08); border: 1px solid rgba(255,197,61,0.24)">
          <div style="display: flex; align-items: baseline; justify-content: space-between">
            <div style="color: #FFC53D; font-size: 13.5px; font-weight: 800">사망 → 그 자리 부활</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 10.5px; font-weight: 700">런당 1회</div>
          </div>
          <div style="color: rgba(255,255,255,0.55); font-size: 11px; line-height: 16px; margin-top: 5px">
            HP 50 · 무적 8초 · 탄약 5. 가장 강한 동기가 걸리는 순간이다. 기록은 부활 여부를 따로 표시한다.
          </div>
        </div>

        <div class="slot" style="background: rgba(255,197,61,0.06); border: 1px solid rgba(255,197,61,0.18)">
          <div style="display: flex; align-items: baseline; justify-content: space-between">
            <div style="color: #FFC53D; font-size: 13.5px; font-weight: 800">결과 → 보상 2배</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 10.5px; font-weight: 700">런당 1회</div>
          </div>
          <div style="color: rgba(255,255,255,0.55); font-size: 11px; line-height: 16px; margin-top: 5px">
            런이 끝난 뒤라 안전하다. 다음 런 시작 탄약과 누적 거리 보너스를 두 배로 준다.
          </div>
        </div>

        <div class="slot" style="background: rgba(255,197,61,0.06); border: 1px solid rgba(255,197,61,0.18)">
          <div style="display: flex; align-items: baseline; justify-content: space-between">
            <div style="color: #FFC53D; font-size: 13.5px; font-weight: 800">홈 → 탄약 +10으로 시작</div>
            <div style="color: rgba(255,255,255,0.4); font-size: 10.5px; font-weight: 700">하루 3회</div>
          </div>
          <div style="color: rgba(255,255,255,0.55); font-size: 11px; line-height: 16px; margin-top: 5px">
            출발 전이라 부담이 없다. 하루 상한을 둬서 광고로 난이도를 사는 느낌이 되지 않게 한다.
          </div>
        </div>
      </div>
    </div>

    <!-- 게시형 -->
    <div class="card" style="flex-grow: 1; flex-basis: 0; padding: 20px">
      <div style="display: flex; align-items: center; gap: 9px">
        <div class="tag" style="background: rgba(255,255,255,0.09); color: rgba(255,255,255,0.7)">게시형</div>
        <div style="color: #fff; font-size: 15px; font-weight: 800">가만히 떠 있는다</div>
      </div>
      <div style="color: rgba(255,255,255,0.45); font-size: 11.5px; line-height: 17px; margin-top: 9px">
        배너와 전면. 수익은 작지만 이탈도 만든다. 손이 멈춰 있는 화면에만 붙인다.
      </div>

      <div style="display: flex; flex-direction: column; gap: 11px; margin-top: 16px">
        <div class="slot" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1)">
          <div style="color: #fff; font-size: 13.5px; font-weight: 800">결과 화면 하단 배너</div>
          <div style="color: rgba(255,255,255,0.5); font-size: 11px; line-height: 16px; margin-top: 5px">
            320×50 앵커 배너. 런이 끝나고 기록을 들여다보는 동안만 뜬다.
          </div>
        </div>

        <div class="slot" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1)">
          <div style="color: #fff; font-size: 13.5px; font-weight: 800">3번째 런 종료 후 전면</div>
          <div style="color: rgba(255,255,255,0.5); font-size: 11px; line-height: 16px; margin-top: 5px">
            결과 화면을 닫고 홈으로 갈 때 한 번. 세션당 최대 1회, 최소 간격 5분.
          </div>
        </div>
      </div>

      <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.08)">
        <div class="eyebrow" style="color: #FF7D9B">절대 넣지 않는 곳</div>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 11px">
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #FF2E5B; flex-shrink: 0"></div>
            <div style="color: rgba(255,255,255,0.6); font-size: 11.5px; line-height: 17px">지도 뷰 — 달리는 중이다. 화면을 가리면 사고가 난다.</div>
          </div>
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #FF2E5B; flex-shrink: 0"></div>
            <div style="color: rgba(255,255,255,0.6); font-size: 11.5px; line-height: 17px">AR 전투 뷰 — 카메라 위에 광고를 얹지 않는다.</div>
          </div>
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #FF2E5B; flex-shrink: 0"></div>
            <div style="color: rgba(255,255,255,0.6); font-size: 11.5px; line-height: 17px">로딩 — 시작 직전 기대감을 끊는다. 이탈률이 가장 높은 자리다.</div>
          </div>
          <div style="display: flex; gap: 9px; align-items: baseline">
            <div style="width: 5px; height: 5px; border-radius: 3px; background: #FF2E5B; flex-shrink: 0"></div>
            <div style="color: rgba(255,255,255,0.6); font-size: 11.5px; line-height: 17px">온보딩 — 안전 수칙 옆에 광고가 있으면 수칙을 안 읽는다.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 플로우 상의 위치 -->
  <div class="card" style="padding: 16px 20px">
    <div class="eyebrow" style="margin-bottom: 13px">플로우 상의 위치</div>
    <div style="display: flex; flex-direction: row; align-items: center; gap: 6px">
      <div style="flex-grow: 1; text-align: center; padding: 9px 6px; border-radius: 10px; background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55); font-size: 11px; font-weight: 700">스플래시</div>
      <div style="color: rgba(255,255,255,0.22); font-size: 12px">&rarr;</div>
      <div style="flex-grow: 1; text-align: center; padding: 9px 6px; border-radius: 10px; background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.55); font-size: 11px; font-weight: 700">온보딩</div>
      <div style="color: rgba(255,255,255,0.22); font-size: 12px">&rarr;</div>
      <div style="flex-grow: 1; text-align: center; padding: 9px 6px; border-radius: 10px; background: rgba(255,197,61,0.14); border: 1px solid rgba(255,197,61,0.34); color: #FFC53D; font-size: 11px; font-weight: 800">홈 · 보상형</div>
      <div style="color: rgba(255,255,255,0.22); font-size: 12px">&rarr;</div>
      <div style="flex-grow: 1; text-align: center; padding: 9px 6px; border-radius: 10px; background: rgba(255,46,91,0.10); border: 1px solid rgba(255,46,91,0.3); color: #FF7D9B; font-size: 11px; font-weight: 800">로딩 · 금지</div>
      <div style="color: rgba(255,255,255,0.22); font-size: 12px">&rarr;</div>
      <div style="flex-grow: 1.3; text-align: center; padding: 9px 6px; border-radius: 10px; background: rgba(255,46,91,0.10); border: 1px solid rgba(255,46,91,0.3); color: #FF7D9B; font-size: 11px; font-weight: 800">지도 · AR · 금지</div>
      <div style="color: rgba(255,255,255,0.22); font-size: 12px">&rarr;</div>
      <div style="flex-grow: 1; text-align: center; padding: 9px 6px; border-radius: 10px; background: rgba(255,197,61,0.14); border: 1px solid rgba(255,197,61,0.34); color: #FFC53D; font-size: 11px; font-weight: 800">사망 · 보상형</div>
      <div style="color: rgba(255,255,255,0.22); font-size: 12px">&rarr;</div>
      <div style="flex-grow: 1.2; text-align: center; padding: 9px 6px; border-radius: 10px; background: rgba(255,197,61,0.14); border: 1px solid rgba(255,197,61,0.34); color: #FFC53D; font-size: 11px; font-weight: 800">결과 · 보상형+배너</div>
    </div>
  </div>
</div>
</x-dc>
</body>
</html>
