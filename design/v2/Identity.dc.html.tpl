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
    body { margin: 0; background: #070A14;
      font-family: "Outfit", -apple-system, "Segoe UI", "Malgun Gothic", "Apple SD Gothic Neo", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased; }
    * { box-sizing: border-box; }
    a { color: #2FD9FF; text-decoration: none; }
    a:hover { color: #8BE9FF; }
    .eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: rgba(255,255,255,0.42); }
    .chip { width: 100%; height: 46px; border-radius: 12px; }
    .cname { color: #FFFFFF; font-size: 10.5px; font-weight: 700; margin-top: 7px; }
    .hex { color: rgba(255,255,255,0.38); font-size: 9.5px; margin-top: 2px; }
    .card { background: rgba(255,255,255,0.035); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; }
    .ico { width: 54px; height: 54px; border-radius: 16px; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.09); display: flex; align-items: center; justify-content: center; }
  </style>
</helmet>

<div style="width: 820px; height: 844px; background: #070A14; display: flex; flex-direction: row; overflow: hidden">

  <!-- ── 스플래시 (실제 크기 390×844) ── -->
  <div style="width: 390px; height: 844px; position: relative; flex-shrink: 0; overflow: hidden; background: #070A14">
    <svg width="390" height="844" viewBox="0 0 390 844" style="position: absolute; top: 0; left: 0">
      <defs>
        <radialGradient id="splashGlow" cx="0.5" cy="0.46" r="0.58">
          <stop offset="0" stop-color="#16385A" stop-opacity="1"/><stop offset="1" stop-color="#070A14" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="rim" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#FF2E5B" stop-opacity="0.20"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0E1730"/><stop offset="1" stop-color="#070A14"/>
        </linearGradient>
      </defs>
      <rect width="390" height="844" fill="#070A14"/>
      <ellipse cx="195" cy="390" rx="300" ry="300" fill="url(#splashGlow)"/>
      <rect x="0" y="556" width="390" height="288" fill="url(#floor)"/>

      <!-- 원근 도로 -->
      <g stroke="#1B2745" stroke-width="2" opacity="0.7">
        <line x1="195" y1="556" x2="-420" y2="844"/><line x1="195" y1="556" x2="-90" y2="844"/>
        <line x1="195" y1="556" x2="480" y2="844"/><line x1="195" y1="556" x2="810" y2="844"/>
      </g>
      <g stroke="#1B2745" stroke-width="2" opacity="0.5">
        <line x1="0" y1="640" x2="390" y2="640"/><line x1="0" y1="712" x2="390" y2="712"/><line x1="0" y1="812" x2="390" y2="812"/>
      </g>

      <ellipse cx="195" cy="612" rx="205" ry="150" fill="url(#rim)"/>

      <!-- 실루엣 군집 -->
      <g transform="translate(96 604)"><!--ZOMBIE:walker:dark:side:0.78:1--></g>
      <g transform="translate(300 596)"><!--ZOMBIE:stalker:dark:back:0.72:0--></g>
      <g transform="translate(195 650)"><!--ZOMBIE:runner:chase:front:1.26:0--></g>
    </svg>

    <div style="position: absolute; top: 236px; left: 0; right: 0; text-align: center">
      <div style="color: #FFFFFF; font-size: 62px; font-weight: 800; letter-spacing: -1.5px; line-height: 60px;
        text-shadow: 0 0 44px rgba(47,217,255,0.34)">DEADRUN</div>
      <div style="display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
        background: rgba(255,46,91,0.14); border: 1px solid rgba(255,46,91,0.42); border-radius: 20px; padding: 6px 14px">
        <div style="width: 6px; height: 6px; border-radius: 3px; background: #FF2E5B; box-shadow: 0 0 8px #FF2E5B"></div>
        <span style="color: #FF7D9B; font-size: 12px; font-weight: 700; letter-spacing: 1.5px">진짜로 달려야 산다</span>
      </div>
    </div>

    <div style="position: absolute; bottom: 84px; left: 44px; right: 44px">
      <div class="eyebrow" style="text-align: center">구역 로딩</div>
      <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.08); margin-top: 12px; overflow: hidden">
        <div style="width: 68%; height: 6px; border-radius: 3px; background: linear-gradient(90deg, #2FD9FF 0%, #5FE4FF 100%); box-shadow: 0 0 12px rgba(47,217,255,0.6)"></div>
      </div>
      <div style="color: rgba(255,255,255,0.42); font-size: 11px; font-weight: 600; text-align: center; margin-top: 11px">도로망 412 · 개체 96</div>
    </div>
  </div>

  <!-- ── 아이덴티티 패널 ── -->
  <div style="width: 430px; height: 844px; padding: 28px 26px; display: flex; flex-direction: column; gap: 20px; border-left: 1px solid rgba(255,255,255,0.07)">

    <div>
      <div style="color: #FFFFFF; font-size: 19px; font-weight: 800; letter-spacing: -0.3px">감염된 도시, 밤</div>
      <div style="color: rgba(255,255,255,0.55); font-size: 11.5px; line-height: 17.5px; margin-top: 7px">지도는 구워둔 OSM 타일의 실제 도형이다. 서울 골목과 건물 299채가 그대로 들어가 있고, 거기에 기울기와 두께를 줘 입체로 본다. 패널은 유리, 버튼은 떠 있는 원형. 레트로 요소는 없고 색은 역할당 하나씩만 쓴다.</div>
    </div>

    <div>
      <div class="eyebrow">앱 아이콘</div>
      <div style="display: flex; flex-direction: row; align-items: flex-end; gap: 16px; margin-top: 12px">
        <div>
          <svg width="92" height="92" viewBox="0 0 92 92" style="display: block; border-radius: 21px; box-shadow: 0 10px 24px rgba(0,0,0,0.5)">
            <defs>
              <linearGradient id="icbg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stop-color="#16233F"/><stop offset="1" stop-color="#070A14"/>
              </linearGradient>
              <radialGradient id="icglow" cx="0.5" cy="0.56" r="0.5">
                <stop offset="0" stop-color="#FF2E5B" stop-opacity="0.5"/><stop offset="1" stop-color="#FF2E5B" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <rect width="92" height="92" fill="url(#icbg)"/>
            <circle cx="46" cy="52" r="34" fill="url(#icglow)"/>
            <g fill="none" stroke="#2FD9FF" stroke-opacity="0.45" stroke-width="2"><circle cx="46" cy="52" r="30"/></g>
            <g transform="translate(46 76)"><!--ZOMBIE:runner:chase:front:1.0:0--></g>
          </svg>
          <div class="hex" style="text-align: center">iOS 1024</div>
        </div>
        <div>
          <svg width="64" height="64" viewBox="0 0 92 92" style="display: block; border-radius: 32px; box-shadow: 0 8px 18px rgba(0,0,0,0.5)">
            <rect width="92" height="92" fill="url(#icbg)"/>
            <circle cx="46" cy="52" r="34" fill="url(#icglow)"/>
            <g transform="translate(46 78)"><!--ZOMBIE:runner:chase:front:1.08:0--></g>
          </svg>
          <div class="hex" style="text-align: center">적응형</div>
        </div>
        <div>
          <svg width="46" height="46" viewBox="0 0 92 92" style="display: block; border-radius: 11px">
            <rect width="92" height="92" fill="#FFFFFF"/>
            <g transform="translate(46 76)"><!--ZOMBIE:runner:mono:side:1.02:1--></g>
          </svg>
          <div class="hex" style="text-align: center">단색</div>
        </div>
      </div>
    </div>

    <div>
      <div class="eyebrow">팔레트 — 구조 3 + 역할 4</div>
      <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 9px; margin-top: 12px">
        <div><div class="chip" style="background: #070A14; border: 1px solid rgba(255,255,255,0.12)"></div><div class="cname">배경</div><div class="hex">070A14</div></div>
        <div><div class="chip" style="background: #131A2F"></div><div class="cname">지면</div><div class="hex">131A2F</div></div>
        <div><div class="chip" style="background: #2C3A64"></div><div class="cname">도로</div><div class="hex">2C3A64</div></div>
        <div><div class="chip" style="background: #2FD9FF"></div><div class="cname">플레이어</div><div class="hex">2FD9FF</div></div>
        <div><div class="chip" style="background: #FF2E5B"></div><div class="cname">위험</div><div class="hex">FF2E5B</div></div>
        <div><div class="chip" style="background: #7CFF5B"></div><div class="cname">감염</div><div class="hex">7CFF5B</div></div>
        <div><div class="chip" style="background: #FFC53D"></div><div class="cname">탄약·보상</div><div class="hex">FFC53D</div></div>
        <div><div class="chip" style="background: rgba(255,255,255,0.10); border: 1px solid rgba(255,255,255,0.12)"></div><div class="cname">유리 패널</div><div class="hex">white 10%</div></div>
      </div>
      <div style="color: rgba(255,255,255,0.45); font-size: 10.5px; line-height: 16px; margin-top: 11px">역할 색은 네 개뿐이다. 지금 앱 코드에는 고유 색상이 60개 있고 그중 붉은 계열만 10개다.</div>
    </div>

    <div>
      <div class="eyebrow">타이포 — Outfit</div>
      <div style="margin-top: 10px; display: flex; flex-direction: row; align-items: flex-end; gap: 18px">
        <div>
          <div style="color: #FFFFFF; font-size: 38px; font-weight: 800; letter-spacing: -1px; line-height: 38px; font-variant-numeric: tabular-nums">2.41</div>
          <div class="hex" style="margin-top: 4px">숫자 800 · tabular</div>
        </div>
        <div>
          <div style="color: rgba(255,255,255,0.48); font-size: 11px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase">주행 · 평균 · 현재</div>
          <div class="hex" style="margin-top: 6px">라벨 700 · 자간 1.8 · 대문자</div>
        </div>
      </div>
    </div>

    <div style="margin-top: auto">
      <div class="eyebrow">아이콘 — 벡터, 24px 그리드</div>
      <div style="display: flex; flex-direction: row; gap: 11px; margin-top: 12px">
        <div class="ico">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#2FD9FF" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="2.4" fill="#2FD9FF" stroke="none"/>
            <path d="M7.2 16.8a6.8 6.8 0 0 1 0-9.6"/><path d="M16.8 7.2a6.8 6.8 0 0 1 0 9.6"/>
            <path d="M4.1 19.9a11.2 11.2 0 0 1 0-15.8" opacity="0.55"/><path d="M19.9 4.1a11.2 11.2 0 0 1 0 15.8" opacity="0.55"/>
          </svg>
        </div>
        <div class="ico">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#FFC53D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.2" fill="#FFC53D" stroke="none"/>
            <path d="M12 1.8v3.4M12 18.8v3.4M1.8 12h3.4M18.8 12h3.4"/>
          </svg>
        </div>

        <div class="ico">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none">
            <path d="M12 3.2 22.3 20.6H1.7L12 3.2Z" fill="#FF2E5B"/>
            <rect x="10.9" y="9" width="2.2" height="6" rx="1.1" fill="#FFFFFF"/>
            <circle cx="12" cy="17.4" r="1.3" fill="#FFFFFF"/>
          </svg>
        </div>
        <div class="ico">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21.2s7.4-6.6 7.4-11.6a7.4 7.4 0 1 0-14.8 0c0 5 7.4 11.6 7.4 11.6Z"/>
            <circle cx="12" cy="9.6" r="2.7"/>
          </svg>
        </div>
        <div class="ico">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="#2FD9FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 8.4V5.6A2.6 2.6 0 0 1 5.6 3h2.8M15.6 3h2.8A2.6 2.6 0 0 1 21 5.6v2.8M21 15.6v2.8a2.6 2.6 0 0 1-2.6 2.6h-2.8M8.4 21H5.6A2.6 2.6 0 0 1 3 18.4v-2.8"/>
            <circle cx="12" cy="12" r="3.4"/>
          </svg>
        </div>
      </div>
      <div style="color: rgba(255,255,255,0.45); font-size: 10.5px; line-height: 16px; margin-top: 12px">이모지는 한 개도 쓰지 않았다. 앱에 이미 react-native-svg가 있어서 아이콘은 SVG 컴포넌트로 넣는 게 PNG보다 낫다. 크기와 색이 자유롭고 용량도 작다. PNG가 반드시 필요한 건 앱 아이콘과 스플래시뿐이고 그건 내가 굽는다.</div>
    </div>

  </div>
</div>
</x-dc>
</body>
</html>
