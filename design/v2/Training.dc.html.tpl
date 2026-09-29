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
    .h3 { color: #fff; font-size: 15px; font-weight: 800; }
    .p { color: rgba(255,255,255,0.55); font-size: 11.5px; line-height: 17.5px; }
    .num { color: #2FD9FF; font-size: 26px; font-weight: 800; letter-spacing: -0.6px; font-variant-numeric: tabular-nums; }
  </style>
</helmet>

<div style="width: 1240px; height: 900px; background: #070A14; padding: 30px; overflow: hidden; display: flex; flex-direction: column; gap: 18px">

  <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 16px">
    <div style="display: flex; align-items: baseline; gap: 13px">
      <div style="color: #fff; font-size: 28px; font-weight: 800; letter-spacing: -0.8px">기록 설계</div>
      <div style="color: rgba(255,255,255,0.45); font-size: 14px; font-weight: 600">운동 앱이 먼저, 게임은 그 수단</div>
    </div>
    <div style="color: rgba(255,255,255,0.42); font-size: 12px; margin-top: 7px">
      좀비는 사람을 뛰게 만드는 장치다. 그래서 기록도 게임 점수가 아니라 러닝 습관을 기준으로 짠다.
    </div>
  </div>

  <div style="display: flex; flex-direction: row; gap: 16px; flex-grow: 1">

    <!-- 왜 주 단위인가 -->
    <div class="card" style="flex-grow: 1; flex-basis: 0; padding: 20px">
      <div class="eyebrow">1 · 기본 단위는 주</div>
      <div class="h3" style="margin-top: 9px">하루가 아니라 한 주를 본다</div>
      <div class="p" style="margin-top: 9px">
        러너가 실패하는 이유는 기록이 나빠서가 아니라 한 주를 통째로 거르기 때문이다.
        하루 목표는 못 지킨 날마다 실패를 만들지만, 주 목표는 남은 날로 만회할 수 있다.
      </div>
      <div style="display: flex; gap: 10px; margin-top: 16px">
        <div style="flex-grow: 1; flex-basis: 0; padding: 13px; border-radius: 14px; background: rgba(255,255,255,0.04)">
          <div class="num">20<span style="font-size:12px;color:rgba(255,255,255,0.4)">km</span></div>
          <div style="color: rgba(255,255,255,0.45); font-size: 10.5px; font-weight: 700; margin-top: 4px">주간 거리 목표</div>
        </div>
        <div style="flex-grow: 1; flex-basis: 0; padding: 13px; border-radius: 14px; background: rgba(255,46,91,0.09); border: 1px solid rgba(255,46,91,0.26)">
          <div class="num" style="color: #FF7D9B">7<span style="font-size:12px;color:rgba(255,255,255,0.4)">주</span></div>
          <div style="color: rgba(255,255,255,0.45); font-size: 10.5px; font-weight: 700; margin-top: 4px">연속 달성</div>
        </div>
      </div>
      <div class="p" style="margin-top: 14px">
        연속 기록은 주 단위로만 끊는다. 하루 쉰다고 끊기면 무서워서 무리하게 되고, 무리하면 다친다.
      </div>
    </div>

    <!-- 이 앱만의 지표 -->
    <div class="card" style="flex-grow: 1.15; flex-basis: 0; padding: 20px; border-color: rgba(255,46,91,0.26)">
      <div class="eyebrow" style="color: #FF7D9B">2 · 이 앱만 줄 수 있는 것</div>
      <div class="h3" style="margin-top: 9px">추격 구간 = 고강도 인터벌</div>
      <div class="p" style="margin-top: 9px">
        인터벌 훈련은 효과가 크지만 혼자 하기 어렵다. 언제 빨리 뛰고 언제 쉴지를 스스로 정해야 하고, 대개 지키지 못한다.
        좀비는 그 결정을 대신 해준다. 쫓기면 전력으로 뛰고, 따돌리면 회복한다.
      </div>
      <div style="display: flex; flex-direction: column; gap: 9px; margin-top: 15px">
        <div style="display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 12px; background: rgba(255,46,91,0.08)">
          <div style="width: 6px; height: 6px; border-radius: 3px; background: #FF2E5B; flex-shrink: 0"></div>
          <div style="flex-grow: 1; color: rgba(255,255,255,0.72); font-size: 11.5px; font-weight: 700">추격 중 평균 속도</div>
          <div style="color: #FF7D9B; font-size: 13px; font-weight: 800">14.9 km/h</div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 12px; background: rgba(23,149,194,0.09)">
          <div style="width: 6px; height: 6px; border-radius: 3px; background: #1795C2; flex-shrink: 0"></div>
          <div style="flex-grow: 1; color: rgba(255,255,255,0.72); font-size: 11.5px; font-weight: 700">평시 평균 속도</div>
          <div style="color: #2FD9FF; font-size: 13px; font-weight: 800">9.8 km/h</div>
        </div>
        <div style="display: flex; align-items: center; gap: 10px; padding: 11px 13px; border-radius: 12px; background: rgba(255,255,255,0.04)">
          <div style="width: 6px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.4); flex-shrink: 0"></div>
          <div style="flex-grow: 1; color: rgba(255,255,255,0.72); font-size: 11.5px; font-weight: 700">주간 고강도 시간</div>
          <div style="color: #fff; font-size: 13px; font-weight: 800">24분 / 권고 75분</div>
        </div>
      </div>
      <div class="p" style="margin-top: 14px">
        Strava나 나이키가 못 주는 숫자다. 그들은 페이스가 왜 올랐는지 모른다. 우리는 안다. 좀비가 쫓아왔기 때문이다.
      </div>
    </div>

    <!-- 기록이 난이도를 만든다 -->
    <div class="card" style="flex-grow: 1; flex-basis: 0; padding: 20px; border-color: rgba(47,217,255,0.26)">
      <div class="eyebrow" style="color: #2FD9FF">3 · 기록이 난이도를 만든다</div>
      <div class="h3" style="margin-top: 9px">기록이 장식이 아니게 하는 법</div>
      <div class="p" style="margin-top: 9px">
        러너 좀비는 지금 12km/h 고정이다. 느린 사람은 계속 죽고 빠른 사람은 심심하다.
        최근 4주 평균 속도를 기준으로 좀비 속도를 매주 조정하면, 누구에게나 아슬아슬한 선이 유지된다.
      </div>
      <div style="margin-top: 15px; padding: 14px; border-radius: 14px; background: rgba(47,217,255,0.07); border: 1px solid rgba(47,217,255,0.2)">
        <div style="color: rgba(255,255,255,0.5); font-size: 10.5px; font-weight: 700; letter-spacing: 0.5px">규칙</div>
        <div style="color: #fff; font-size: 12.5px; font-weight: 700; line-height: 19px; margin-top: 7px">
          러너 속도 = 내 4주 평균 × 1.25<br>
          <span style="color: rgba(255,255,255,0.5); font-weight: 600">주당 변화폭은 ±5%로 묶는다</span>
        </div>
      </div>
      <div class="p" style="margin-top: 14px">
        속도가 늘면 좀비도 빨라지니 기록을 올릴 이유가 생긴다. 반대로 한동안 쉬었다 오면 좀비도 느려져서 복귀가 무섭지 않다.
      </div>
    </div>
  </div>

  <!-- 하지 않을 것 -->
  <div class="card" style="padding: 18px 20px; border-color: rgba(255,46,91,0.22)">
    <div class="eyebrow" style="color: #FF7D9B">하지 않을 것</div>
    <div style="display: flex; flex-direction: row; gap: 24px; margin-top: 13px">
      <div style="flex-grow: 1; flex-basis: 0">
        <div style="color: #fff; font-size: 12.5px; font-weight: 800">처치 수로 순위를 매기지 않는다</div>
        <div class="p" style="margin-top: 5px">한자리를 맴돌며 좀비만 잡는 게 최적 전략이 된다. 그건 운동이 아니다. 달성과 순위는 거리와 꾸준함으로만 준다.</div>
      </div>
      <div style="width: 1px; background: rgba(255,255,255,0.1)"></div>
      <div style="flex-grow: 1; flex-basis: 0">
        <div style="color: #fff; font-size: 12.5px; font-weight: 800">매일 목표를 강요하지 않는다</div>
        <div class="p" style="margin-top: 5px">회복일이 필요하다. 주 3~4회가 건강한 리듬이고, 히트맵의 빈칸은 실패가 아니라 정상이다.</div>
      </div>
      <div style="width: 1px; background: rgba(255,255,255,0.1)"></div>
      <div style="flex-grow: 1; flex-basis: 0">
        <div style="color: #fff; font-size: 12.5px; font-weight: 800">준비운동 구간에는 좀비를 두지 않는다</div>
        <div class="p" style="margin-top: 5px">첫 400m와 마지막 400m는 개체가 스폰되지 않는다. 몸을 덥히고 식히는 시간이다. 시작하자마자 전력으로 뛰면 다친다.</div>
      </div>
      <div style="width: 1px; background: rgba(255,255,255,0.1)"></div>
      <div style="flex-grow: 1; flex-basis: 0">
        <div style="color: #fff; font-size: 12.5px; font-weight: 800">부활 기록을 섞지 않는다</div>
        <div class="p" style="margin-top: 5px">광고를 보고 부활한 런은 따로 표시한다. 광고로 기록을 사는 구조가 되면 기록을 아무도 믿지 않는다.</div>
      </div>
    </div>
  </div>
</div>
</x-dc>
</body>
</html>
