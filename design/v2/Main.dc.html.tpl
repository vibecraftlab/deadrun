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
<!--CSS-->  </style>
</helmet>

<div style="width: 390px; height: 844px; background: #070A14; overflow: hidden; position: relative">

  <!-- ── 지도: 살짝 기울인 스타일라이즈드 시티 ── -->
  <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
    <defs>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#0B1020"/><stop offset="0.45" stop-color="#131A2F"/><stop offset="1" stop-color="#0A0E1C"/>
      </linearGradient>
      <linearGradient id="horizon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#070A14" stop-opacity="1"/><stop offset="1" stop-color="#070A14" stop-opacity="0"/>
      </linearGradient>
      <radialGradient id="playerGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="#2FD9FF" stop-opacity="0.34"/><stop offset="1" stop-color="#2FD9FF" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="playerDot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#7FEBFF"/><stop offset="1" stop-color="#1BA8D8"/>
      </linearGradient>
      <radialGradient id="dangerWash" cx="0.5" cy="0.42" r="0.62">
        <stop offset="0.5" stop-color="#FF2E5B" stop-opacity="0"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0.20"/>
      </radialGradient>
    </defs>

    <rect width="390" height="844" fill="url(#ground)"/>

    <!-- 실제 OSM 도형 (deadrun-mapkit 이 구운 .drmp 타일에서 뽑음).
         기울여서 원근을 흉내내고 위쪽은 안개로 지운다 -->
    <g transform="translate(195 470) scale(1 0.66) rotate(-14) translate(-195 -470)">
      <!--OSMMAP-->
    </g>

    <!-- 지평선 안개 -->
    <rect x="0" y="0" width="390" height="230" fill="url(#horizon)"/>

    <!-- 레이더 링 -->
    <g fill="none" stroke="#2FD9FF">
      <circle cx="195" cy="470" r="104" stroke-opacity="0.22" stroke-width="1.5" stroke-dasharray="2 7"/>
      <circle cx="195" cy="470" r="168" stroke-opacity="0.13" stroke-width="1.5" stroke-dasharray="2 7"/>
    </g>

    <!-- 플레이어 -->
    <circle cx="195" cy="470" r="76" fill="url(#playerGlow)"/>
    <path d="M195,470 L152,398 A84,84 0 0 1 238,398 Z" fill="#2FD9FF" fill-opacity="0.16"/>
    <ellipse cx="195" cy="482" rx="26" ry="8" fill="#000000" opacity="0.4"/>
    <circle cx="195" cy="470" r="15" fill="url(#playerDot)" stroke="#FFFFFF" stroke-width="3.5"/>
    <circle cx="195" cy="470" r="5" fill="#0A1A26" opacity="0.5"/>

    <!-- 좀비 인지 범위: 바라보는 방향 ± 시야각/2, 실제 감지 반경.
         레이더 바깥 링 168px = 150m 기준이므로 1m ≈ 1.12px -->
    <g transform="translate(132 376) rotate(146)"><path d="M0,0 L-64.7,-17.3 A67,67 0 0 1 64.7,-17.3 Z" fill="#ff2b2b3a"/><path d="M0,0 L-64.7,-17.3 A67,67 0 0 1 64.7,-17.3 Z" fill="none" stroke="#ff2b2b66" stroke-width="1"/></g>
    <g transform="translate(288 570) rotate(300)"><path d="M0,0 L-39.0,-22.5 A45,45 0 0 1 39.0,-22.5 Z" fill="#e3323220"/><path d="M0,0 L-39.0,-22.5 A45,45 0 0 1 39.0,-22.5 Z" fill="none" stroke="#e3323238" stroke-width="1"/></g>
    <g><circle cx="80" cy="630" r="101" fill="#e3323220"/><circle cx="80" cy="630" r="101" fill="none" stroke="#e3323238" stroke-width="1" stroke-dasharray="3 5"/></g>
    <g transform="translate(316 264) rotate(200)"><path d="M0,0 L-42.9,-36.0 A56,56 0 0 1 42.9,-36.0 Z" fill="#e3323220"/><path d="M0,0 L-42.9,-36.0 A56,56 0 0 1 42.9,-36.0 Z" fill="none" stroke="#e3323238" stroke-width="1"/></g>

    <!-- ── 좀비 마커: 접지 글로우 + 실루엣. 플레이어 쪽을 향한다 ── -->
    <g transform="translate(132 376)"><!--ZOMBIE:runner:chase:side:1.02:1--></g>
    <g transform="translate(288 570)"><!--ZOMBIE:walker:roam:side:0.82:0--></g>
    <g transform="translate(80 630)"><!--ZOMBIE:stalker:roam:side:0.68:1--></g>
    <g transform="translate(316 264)"><!--ZOMBIE:brute:roam:side:0.92:0--></g>

    <!-- 위험 비네트 -->
    <rect width="390" height="844" fill="url(#dangerWash)"/>
  </svg>

  <!-- ── 상단 스탯 바 ── -->
  <!--STATBAR:2.41|9.8|11.4|64|3|07|2-->

  <!-- 추격 경고 칩 -->
  <div style="position: absolute; top: 166px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 8px;
      background: linear-gradient(180deg, rgba(255,46,91,0.96) 0%, rgba(196,20,58,0.96) 100%);
      border: 1px solid rgba(255,255,255,0.24); border-radius: 20px; padding: 7px 15px 7px 11px;
      box-shadow: 0 8px 22px rgba(255,46,91,0.38), inset 0 1px 0 rgba(255,255,255,0.3)">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.2 22.3 20.6H1.7L12 3.2Z" fill="#FFFFFF"/>
        <rect x="10.9" y="9" width="2.2" height="6" rx="1.1" fill="#C4143A"/>
        <circle cx="12" cy="17.4" r="1.3" fill="#C4143A"/>
      </svg>
      <span style="color: #FFFFFF; font-size: 13.5px; font-weight: 700; letter-spacing: 0.2px">추격 2 · 18m</span>
    </div>
  </div>

  <!-- 우측 원형 액션 -->
  <div style="position: absolute; right: 16px; top: 300px; display: flex; flex-direction: column; gap: 32px">
    <div class="rbtn">
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#2FD9FF" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="2.4" fill="#2FD9FF" stroke="none"/>
        <path d="M7.2 16.8a6.8 6.8 0 0 1 0-9.6"/><path d="M16.8 7.2a6.8 6.8 0 0 1 0 9.6"/>
        <path d="M4.1 19.9a11.2 11.2 0 0 1 0-15.8" opacity="0.55"/><path d="M19.9 4.1a11.2 11.2 0 0 1 0 15.8" opacity="0.55"/>
      </svg>
      <div class="rbtn-cap">스캔</div>
    </div>
    <div class="rbtn">
      <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#FFC53D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2" fill="#FFC53D" stroke="none"/>
        <path d="M12 1.8v3.4M12 18.8v3.4M1.8 12h3.4M18.8 12h3.4"/>
      </svg>
      <div class="rbtn-cap">사격</div>
    </div>
  </div>
  </div>

  <!-- 좌하단 현재 위치 -->
  <div style="position: absolute; left: 16px; bottom: 132px">
    <div class="rbtn" style="width: 48px; height: 48px; border-radius: 24px">
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="5.6"/><circle cx="12" cy="12" r="1.9" fill="#FFFFFF" stroke="none"/>
        <path d="M12 1.6v3.2M12 19.2v3.2M1.6 12h3.2M19.2 12h3.2"/>
      </svg>
    </div>
  </div>

  <!-- 우하단 주변 개체 트래커 — 점은 상태, 글자는 타입 -->
  <div class="glass" style="position: absolute; right: 16px; bottom: 128px; border-radius: 18px; padding: 9px 12px">
    <div class="stat-lbl" style="margin-bottom: 8px">주변</div>
    <div style="display: flex; flex-direction: column; gap: 8px">
      <div style="display: flex; flex-direction: row; align-items: center; gap: 7px">
        <div style="width: 7px; height: 7px; border-radius: 4px; background: #FF2E5B; box-shadow: 0 0 8px #FF2E5B"></div>
        <span style="color: #FFFFFF; font-size: 11px; font-weight: 700; min-width: 34px">러너</span>
        <span style="color: #FF7D9B; font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums">18m</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 7px">
        <div style="width: 7px; height: 7px; border-radius: 4px; background: #7CFF5B"></div>
        <span style="color: rgba(255,255,255,0.72); font-size: 11px; font-weight: 700; min-width: 34px">워커</span>
        <span style="color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums">44m</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 7px">
        <div style="width: 7px; height: 7px; border-radius: 4px; background: #7CFF5B"></div>
        <span style="color: rgba(255,255,255,0.72); font-size: 11px; font-weight: 700; min-width: 34px">브루트</span>
        <span style="color: rgba(255,255,255,0.5); font-size: 11px; font-weight: 700; font-variant-numeric: tabular-nums">96m</span>
      </div>
    </div>
    <div style="display: flex; flex-direction: row; align-items: center; gap: 10px; margin-top: 9px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.10)">
      <div style="display: flex; flex-direction: row; align-items: center; gap: 5px">
        <div style="width: 6px; height: 6px; border-radius: 3px; background: #FF2E5B"></div>
        <span style="color: rgba(255,255,255,0.5); font-size: 9.5px; font-weight: 600">추격</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 5px">
        <div style="width: 6px; height: 6px; border-radius: 3px; background: #7CFF5B"></div>
        <span style="color: rgba(255,255,255,0.5); font-size: 9.5px; font-weight: 600">배회</span>
      </div>
    </div>
  </div>

  <!-- 하단 주 액션: AR 진입 -->
  <div style="position: absolute; bottom: 38px; left: 0; right: 0; display: flex; justify-content: center">
    <div style="position: relative; width: 84px; height: 84px; display: flex; align-items: center; justify-content: center">
      <div style="position: absolute; width: 84px; height: 84px; border-radius: 42px; border: 2px solid rgba(47,217,255,0.35)"></div>
      <div style="width: 72px; height: 72px; border-radius: 36px;
        background: linear-gradient(180deg, #5FE4FF 0%, #0E96D2 100%);
        border: 2px solid rgba(255,255,255,0.5);
        box-shadow: 0 0 0 7px rgba(47,217,255,0.14), 0 14px 30px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.5);
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px">
        <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#062330" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 8.4V5.6A2.6 2.6 0 0 1 5.6 3h2.8M15.6 3h2.8A2.6 2.6 0 0 1 21 5.6v2.8M21 15.6v2.8a2.6 2.6 0 0 1-2.6 2.6h-2.8M8.4 21H5.6A2.6 2.6 0 0 1 3 18.4v-2.8"/>
          <circle cx="12" cy="12" r="3.4"/>
        </svg>
        <span style="color: #062330; font-size: 9px; font-weight: 800; letter-spacing: 0.6px">AR</span>
      </div>
    </div>
  </div>

</div>
</x-dc>
</body>
</html>
