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
      <radialGradient id="lg" cx="0.5" cy="0.5" r="0.6">
        <stop offset="0" stop-color="#12304E" stop-opacity="0.9"/><stop offset="1" stop-color="#070A14" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#2FD9FF" stop-opacity="0"/><stop offset="1" stop-color="#2FD9FF" stop-opacity="0.5"/>
      </linearGradient>
    </defs>
    <rect width="390" height="844" fill="url(#lg)"/>
    <g opacity="0.34" transform="translate(195 422) scale(0.62) translate(-330 -590)"><!--OSMMAP--></g>
    <g fill="none" stroke="#2FD9FF" stroke-opacity="0.2">
      <circle cx="195" cy="422" r="74"/><circle cx="195" cy="422" r="122"/><circle cx="195" cy="422" r="170"/>
    </g>
    <path d="M195,422 L195,252 A170,170 0 0 1 315,302 Z" fill="url(#sweep)"/>
    <line x1="195" y1="422" x2="195" y2="252" stroke="#2FD9FF" stroke-opacity="0.75" stroke-width="2"/>
    <circle cx="195" cy="422" r="9" fill="#2FD9FF"/>
    <circle cx="195" cy="422" r="18" fill="none" stroke="#2FD9FF" stroke-opacity="0.45" stroke-width="2"/>
    <circle cx="262" cy="356" r="4" fill="#7CFF5B"/><circle cx="140" cy="490" r="4" fill="#7CFF5B"/>
    <circle cx="248" cy="510" r="4" fill="#FF2E5B"/><circle cx="112" cy="352" r="4" fill="#7CFF5B"/>
  </svg>

  <div style="position: absolute; top: 150px; left: 0; right: 0; text-align: center">
    <div style="color: #fff; font-size: 26px; font-weight: 800; letter-spacing: -0.5px">구역 스캔 중</div>
    <div style="color: rgba(255,255,255,0.5); font-size: 12.5px; font-weight: 600; margin-top: 8px">반경 1km 도로망을 불러오고 개체를 배치합니다</div>
  </div>

  <div style="position: absolute; bottom: 150px; left: 34px; right: 34px">
    <div style="display: flex; flex-direction: column; gap: 11px">
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
        <div style="width: 18px; height: 18px; border-radius: 9px; background: #2FD9FF; display: flex; align-items: center; justify-content: center">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#062330" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 6.5"/></svg>
        </div>
        <span style="color: rgba(255,255,255,0.82); font-size: 13px; font-weight: 600">지도 팩 내려받기 · 12타일</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
        <div style="width: 18px; height: 18px; border-radius: 9px; background: #2FD9FF; display: flex; align-items: center; justify-content: center">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#062330" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5 10 18 19.5 6.5"/></svg>
        </div>
        <span style="color: rgba(255,255,255,0.82); font-size: 13px; font-weight: 600">도로 그래프 구축 · 412 ways</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
        <div style="width: 18px; height: 18px; border-radius: 9px; border: 2px solid #2FD9FF"></div>
        <span style="color: #fff; font-size: 13px; font-weight: 700">개체 배치 · 96 / 120</span>
      </div>
      <div style="display: flex; flex-direction: row; align-items: center; gap: 10px">
        <div style="width: 18px; height: 18px; border-radius: 9px; border: 2px solid rgba(255,255,255,0.18)"></div>
        <span style="color: rgba(255,255,255,0.38); font-size: 13px; font-weight: 600">보급 총기 배치</span>
      </div>
    </div>

    <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08); margin-top: 22px; overflow: hidden">
      <div style="width: 72%; height: 6px; border-radius: 3px; background: linear-gradient(90deg,#2FD9FF,#5FE4FF); box-shadow: 0 0 12px rgba(47,217,255,0.6)"></div>
    </div>
  </div>

  <div style="position: absolute; bottom: 52px; left: 34px; right: 34px; text-align: center">
    <div style="color: rgba(255,255,255,0.34); font-size: 11.5px; line-height: 17px">달리기 전에 주변을 한 번 둘러보세요.<br>차도와 교차로에서는 화면을 보지 않습니다.</div>
  </div>
</div>
</x-dc>
</body>
</html>
