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
    .pr { display: flex; align-items: center; gap: 12px; padding: 11px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
    .prk { color: rgba(255,255,255,0.5); font-size: 11.5px; font-weight: 600; flex-grow: 1; }
    .prv { color: #fff; font-size: 15px; font-weight: 800; font-variant-numeric: tabular-nums; }
    .prd { color: rgba(255,255,255,0.3); font-size: 10px; font-weight: 600; width: 42px; text-align: right; }
  </style>
</helmet>

<div style="width: 390px; height: 844px; background: #070A14; overflow: hidden; position: relative; display: flex; flex-direction: column">
  <div style="padding: 62px 22px 0; flex-shrink: 0">
    <div class="eyebrow">누적 128.4km · 42회</div>
    <div style="color: #fff; font-size: 27px; font-weight: 800; letter-spacing: -0.8px; margin-top: 6px">기록과 도감</div>
  </div>

  <div style="padding: 16px 22px 26px; flex-grow: 1; overflow: hidden">

    <div class="glass" style="border-radius: 20px; padding: 16px">
      <div class="eyebrow" style="margin-bottom: 4px">개인 기록</div>
      <div class="pr"><span class="prk">가장 멀리 달린 런</span><span class="prv">6.82<span style="font-size:10px;color:rgba(255,255,255,0.4)">km</span></span><span class="prd">8/25</span></div>
      <div class="pr"><span class="prk">1km 최고</span><span class="prv">4:38</span><span class="prd">9/08</span></div>
      <div class="pr"><span class="prk">가장 오래 버틴 추격</span><span class="prv" style="color:#FF7D9B">3:12</span><span class="prd">9/01</span></div>
      <div class="pr" style="border-bottom:none"><span class="prk">한 런 최다 처치</span><span class="prv">17</span><span class="prd">8/18</span></div>
    </div>

    <div class="glass" style="border-radius: 20px; padding: 16px; margin-top: 11px">
      <div style="display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 13px">
        <div class="eyebrow">좀비 도감</div>
        <div style="color: rgba(255,255,255,0.35); font-size: 10.5px; font-weight: 700">누적 처치 213</div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 12px">

        <div style="display: flex; align-items: center; gap: 12px">
          <div style="width: 56px; height: 62px; background: #0E1426; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; display: flex; align-items: flex-end; justify-content: center; overflow: hidden; flex-shrink: 0">
            <svg width="56" height="62" viewBox="-28 -50 56 62"><!--ZOMBIE:walker:roam:front:0.42:0--></svg>
          </div>
          <div style="flex-grow: 1">
            <div style="display: flex; align-items: baseline; justify-content: space-between">
              <span style="color: #fff; font-size: 13px; font-weight: 800">워커</span>
              <span style="color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 800; font-variant-numeric: tabular-nums">142</span>
            </div>
            <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.07); margin-top: 6px">
              <div style="width: 100%; height: 6px; border-radius: 3px; background: #1795C2"></div>
            </div>
            <div style="color: rgba(255,255,255,0.32); font-size: 10px; font-weight: 600; margin-top: 4px">3km/h · 가장 흔하다</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px">
          <div style="width: 56px; height: 62px; background: #0E1426; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; display: flex; align-items: flex-end; justify-content: center; overflow: hidden; flex-shrink: 0">
            <svg width="56" height="62" viewBox="-28 -50 56 62"><!--ZOMBIE:runner:roam:front:0.42:0--></svg>
          </div>
          <div style="flex-grow: 1">
            <div style="display: flex; align-items: baseline; justify-content: space-between">
              <span style="color: #fff; font-size: 13px; font-weight: 800">러너</span>
              <span style="color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 800; font-variant-numeric: tabular-nums">48</span>
            </div>
            <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.07); margin-top: 6px">
              <div style="width: 34%; height: 6px; border-radius: 3px; background: #1795C2"></div>
            </div>
            <div style="color: rgba(255,255,255,0.32); font-size: 10px; font-weight: 600; margin-top: 4px">12km/h · 고강도 시간의 대부분</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px">
          <div style="width: 56px; height: 62px; background: #0E1426; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; display: flex; align-items: flex-end; justify-content: center; overflow: hidden; flex-shrink: 0">
            <svg width="56" height="62" viewBox="-28 -50 56 62"><!--ZOMBIE:stalker:roam:front:0.42:0--></svg>
          </div>
          <div style="flex-grow: 1">
            <div style="display: flex; align-items: baseline; justify-content: space-between">
              <span style="color: #fff; font-size: 13px; font-weight: 800">스토커</span>
              <span style="color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 800; font-variant-numeric: tabular-nums">19</span>
            </div>
            <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.07); margin-top: 6px">
              <div style="width: 13%; height: 6px; border-radius: 3px; background: #1795C2"></div>
            </div>
            <div style="color: rgba(255,255,255,0.32); font-size: 10px; font-weight: 600; margin-top: 4px">7km/h · 전방위 감지</div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 12px">
          <div style="width: 56px; height: 62px; background: #0E1426; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; display: flex; align-items: flex-end; justify-content: center; overflow: hidden; flex-shrink: 0">
            <svg width="56" height="62" viewBox="-28 -50 56 62"><!--ZOMBIE:brute:roam:front:0.4:0--></svg>
          </div>
          <div style="flex-grow: 1">
            <div style="display: flex; align-items: baseline; justify-content: space-between">
              <span style="color: #fff; font-size: 13px; font-weight: 800">브루트</span>
              <span style="color: rgba(255,255,255,0.6); font-size: 12px; font-weight: 800; font-variant-numeric: tabular-nums">4</span>
            </div>
            <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.07); margin-top: 6px">
              <div style="width: 3%; height: 6px; border-radius: 3px; background: #1795C2"></div>
            </div>
            <div style="color: rgba(255,255,255,0.32); font-size: 10px; font-weight: 600; margin-top: 4px">5km/h · 한 방에 30</div>
          </div>
        </div>
      </div>
    </div>

    <div class="glass" style="border-radius: 20px; padding: 16px; margin-top: 11px">
      <div class="eyebrow" style="margin-bottom: 13px">달성</div>
      <div style="display: flex; gap: 10px">
        <div style="flex-grow: 1; flex-basis: 0; text-align: center; padding: 12px 6px; border-radius: 14px; background: rgba(255,197,61,0.10); border: 1px solid rgba(255,197,61,0.3)">
          <div style="color: #FFC53D; font-size: 20px; font-weight: 800">7</div>
          <div style="color: rgba(255,255,255,0.5); font-size: 9.5px; font-weight: 700; margin-top: 3px">주 연속</div>
        </div>
        <div style="flex-grow: 1; flex-basis: 0; text-align: center; padding: 12px 6px; border-radius: 14px; background: rgba(23,149,194,0.10); border: 1px solid rgba(23,149,194,0.3)">
          <div style="color: #2FD9FF; font-size: 20px; font-weight: 800">100</div>
          <div style="color: rgba(255,255,255,0.5); font-size: 9.5px; font-weight: 700; margin-top: 3px">km 돌파</div>
        </div>
        <div style="flex-grow: 1; flex-basis: 0; text-align: center; padding: 12px 6px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09)">
          <div style="color: rgba(255,255,255,0.3); font-size: 20px; font-weight: 800">200</div>
          <div style="color: rgba(255,255,255,0.28); font-size: 9.5px; font-weight: 700; margin-top: 3px">km 돌파</div>
        </div>
        <div style="flex-grow: 1; flex-basis: 0; text-align: center; padding: 12px 6px; border-radius: 14px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09)">
          <div style="color: rgba(255,255,255,0.3); font-size: 20px; font-weight: 800">75</div>
          <div style="color: rgba(255,255,255,0.28); font-size: 9.5px; font-weight: 700; margin-top: 3px">주 고강도</div>
        </div>
      </div>
      <div style="color: rgba(255,255,255,0.32); font-size: 10.5px; line-height: 16px; margin-top: 12px">
        달성은 전부 거리와 꾸준함으로만 준다. 처치 수로는 주지 않는다. 좀비를 잡으려고 한자리를 맴돌면 운동이 되지 않는다.
      </div>
    </div>
  </div>
</div>
</x-dc>
</body>
</html>
