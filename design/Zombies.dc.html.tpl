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
    .checker { background-color: #191d24;
      background-image: conic-gradient(#1c212a 25%, #171b22 0 50%, #1c212a 0 75%, #171b22 0);
      background-size: 29.34px 29.34px; }
    .card { background: #1e242e; border: 1px solid #3a4356; border-radius: 12px; }
    .eyebrow { color: #6d7687; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
    .stat { display: flex; justify-content: space-between; align-items: baseline; padding: 6px 0; border-bottom: 1px solid #262d38; }
    .k { color: #9aa4b5; font-size: 12.5px; }
    .v { color: #dfe3e8; font-size: 13px; font-weight: 700; }
    .sw { display: flex; align-items: center; gap: 7px; }
    .chip { width: 22px; height: 22px; border-radius: 5px; border: 1px solid #00000055; }
    .hex { color: #6d7687; font-size: 10.5px; letter-spacing: 0.2px; }
  </style>
</helmet>

<div style="width: 1560px; height: 1160px; background: #14171c; padding: 28px; overflow: hidden; display: flex; flex-direction: column; gap: 22px">

  <!-- 헤더 -->
  <div style="display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 1px solid #3a4356; padding-bottom: 18px">
    <div>
      <div style="display: flex; align-items: baseline; gap: 14px">
        <div style="color: #ff4b3a; font-size: 30px; font-weight: 900; letter-spacing: 5px">DEADRUN</div>
        <div style="color: #dfe3e8; font-size: 20px; font-weight: 700">좀비 캐릭터 디자인 시트</div>
      </div>
      <div style="color: #9aa4b5; font-size: 13px; margin-top: 7px">픽셀맵 원본 <span style="color:#dfe3e8">src/components/zombieSprites.ts</span> 그대로 확대 · 수치는 GDD §4.2 / core/zombies.ts</div>
    </div>
    <div style="text-align: right">
      <div class="eyebrow">스폰 분포</div>
      <div style="display: flex; align-items: center; gap: 4px; margin-top: 8px">
        <div style="width: 216px; height: 12px; background: #59bf59; border-radius: 6px 0 0 6px"></div>
        <div style="width: 72px; height: 12px; background: #ff991a"></div>
        <div style="width: 54px; height: 12px; background: #994dcc"></div>
        <div style="width: 18px; height: 12px; background: #b32020; border-radius: 0 6px 6px 0"></div>
      </div>
      <div style="color: #6d7687; font-size: 11.5px; margin-top: 6px">Walker 60% · Runner 20% · Stalker 15% · Brute 5%</div>
    </div>
  </div>

  <!-- 4종 카드 -->
  <div style="display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 24px; flex-grow: 1">

    <!-- WALKER -->
    <div class="card" style="display: flex; flex-direction: column; overflow: hidden">
      <div class="checker" style="height: 200px; display: flex; align-items: center; justify-content: center; position: relative; border-bottom: 1px solid #3a4356">
        <!--SPRITE:Walker:base:176-->
        <div style="position: absolute; top: 12px; left: 14px" class="eyebrow">12 × 12</div>
        <div style="position: absolute; top: 12px; right: 14px; display: flex; align-items: center; gap: 6px">
          <div style="width: 9px; height: 9px; border-radius: 5px; background: #59bf59"></div>
          <div class="hex">#59bf59 마커</div>
        </div>
      </div>
      <div style="padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; flex-grow: 1">
        <div>
          <div style="color: #3ddc6a; font-size: 22px; font-weight: 900; letter-spacing: 1.5px">WALKER</div>
          <div style="color: #9aa4b5; font-size: 13px; margin-top: 3px">워커 · 기본 개체</div>
        </div>
        <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">정면을 향해 양팔을 수평으로 뻗은 클래식 실루엣. 느리지만 60%를 차지해 도시의 기본 밀도를 만든다.</div>
        <div>
          <div class="stat"><span class="k">추격 속도</span><span class="v">3 km/h</span></div>
          <div class="stat"><span class="k">배회 속도</span><span class="v">3 km/h</span></div>
          <div class="stat"><span class="k">감지 범위</span><span class="v">40 m</span></div>
          <div class="stat"><span class="k">체력</span><span class="v">2</span></div>
          <div class="stat"><span class="k">공격력</span><span class="v">10</span></div>
          <div class="stat"><span class="k">특성</span><span class="v" style="color:#6d7687">없음</span></div>
        </div>
        <div style="margin-top: auto">
          <div class="eyebrow" style="margin-bottom: 9px">팔레트</div>
          <div style="display: flex; flex-direction: column; gap: 7px">
            <div class="sw"><div class="chip" style="background:#3ddc6a"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">B 몸</div><div class="hex">#3ddc6a</div></div></div>
            <div class="sw"><div class="chip" style="background:#1e7a3c"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">D 음영</div><div class="hex">#1e7a3c</div></div></div>
            <div class="sw"><div class="chip" style="background:#d81f1f"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">E 눈</div><div class="hex">#d81f1f</div></div></div>
            <div class="sw"><div class="chip" style="background:#2eb956"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">H 손</div><div class="hex">#2eb956</div></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- RUNNER -->
    <div class="card" style="display: flex; flex-direction: column; overflow: hidden">
      <div class="checker" style="height: 200px; display: flex; align-items: center; justify-content: center; position: relative; border-bottom: 1px solid #3a4356">
        <!--SPRITE:Runner:base:176-->
        <div style="position: absolute; top: 12px; left: 14px" class="eyebrow">12 × 12</div>
        <div style="position: absolute; top: 12px; right: 14px; display: flex; align-items: center; gap: 6px">
          <div style="width: 9px; height: 9px; border-radius: 5px; background: #ff991a"></div>
          <div class="hex">#ff991a 마커</div>
        </div>
      </div>
      <div style="padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; flex-grow: 1">
        <div>
          <div style="color: #9be24f; font-size: 22px; font-weight: 900; letter-spacing: 1.5px">RUNNER</div>
          <div style="color: #9aa4b5; font-size: 13px; margin-top: 3px">러너 · 추격 압박</div>
        </div>
        <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">상체를 기울이고 한 팔을 앞으로 뻗은 질주 자세. 45초 뒤 지쳐 5km/h로 떨어지므로 버티면 살아남는다.</div>
        <div>
          <div class="stat"><span class="k">추격 속도</span><span class="v" style="color:#ff991a">12 km/h</span></div>
          <div class="stat"><span class="k">배회 속도</span><span class="v">3 km/h</span></div>
          <div class="stat"><span class="k">감지 범위</span><span class="v">60 m</span></div>
          <div class="stat"><span class="k">체력</span><span class="v">3</span></div>
          <div class="stat"><span class="k">공격력</span><span class="v">8</span></div>
          <div class="stat"><span class="k">특성</span><span class="v">45초 후 지침 → 5 km/h</span></div>
        </div>
        <div style="margin-top: auto">
          <div class="eyebrow" style="margin-bottom: 9px">팔레트</div>
          <div style="display: flex; flex-direction: column; gap: 7px">
            <div class="sw"><div class="chip" style="background:#9be24f"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">B 몸</div><div class="hex">#9be24f</div></div></div>
            <div class="sw"><div class="chip" style="background:#4f8a1f"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">D 음영</div><div class="hex">#4f8a1f</div></div></div>
            <div class="sw"><div class="chip" style="background:#d81f1f"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">E 눈</div><div class="hex">#d81f1f</div></div></div>
            <div class="sw"><div class="chip" style="background:#7cc93b"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">H 손</div><div class="hex">#7cc93b</div></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- STALKER -->
    <div class="card" style="display: flex; flex-direction: column; overflow: hidden">
      <div class="checker" style="height: 200px; display: flex; align-items: center; justify-content: center; position: relative; border-bottom: 1px solid #3a4356">
        <!--SPRITE:Stalker:base:176-->
        <div style="position: absolute; top: 12px; left: 14px" class="eyebrow">12 × 12</div>
        <div style="position: absolute; top: 12px; right: 14px; display: flex; align-items: center; gap: 6px">
          <div style="width: 9px; height: 9px; border-radius: 5px; background: #994dcc"></div>
          <div class="hex">#994dcc 마커</div>
        </div>
      </div>
      <div style="padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; flex-grow: 1">
        <div>
          <div style="color: #b74ddb; font-size: 22px; font-weight: 900; letter-spacing: 1.5px">STALKER</div>
          <div style="color: #9aa4b5; font-size: 13px; margin-top: 3px">스토커 · 정보 교란</div>
        </div>
        <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">낮게 웅크린 넓은 실루엣에 보라색 발광 눈. 레이더에서 0.5초 주기로 깜빡여 위치를 확신할 수 없다.</div>
        <div>
          <div class="stat"><span class="k">추격 속도</span><span class="v">7 km/h</span></div>
          <div class="stat"><span class="k">배회 속도</span><span class="v">3 km/h</span></div>
          <div class="stat"><span class="k">감지 범위</span><span class="v" style="color:#b74ddb">90 m</span></div>
          <div class="stat"><span class="k">체력</span><span class="v">2</span></div>
          <div class="stat"><span class="k">공격력</span><span class="v" style="color:#b74ddb">14</span></div>
          <div class="stat"><span class="k">특성</span><span class="v">스텔스 — 레이더 깜빡임</span></div>
        </div>
        <div style="margin-top: auto">
          <div class="eyebrow" style="margin-bottom: 9px">팔레트</div>
          <div style="display: flex; flex-direction: column; gap: 7px">
            <div class="sw"><div class="chip" style="background:#5f8f77"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">B 몸</div><div class="hex">#5f8f77</div></div></div>
            <div class="sw"><div class="chip" style="background:#31584a"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">D 음영</div><div class="hex">#31584a</div></div></div>
            <div class="sw"><div class="chip" style="background:#b74ddb"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">E 눈</div><div class="hex">#b74ddb</div></div></div>
            <div class="sw"><div class="chip" style="background:#4a7a63"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">H 손</div><div class="hex">#4a7a63</div></div></div>
          </div>
        </div>
      </div>
    </div>

    <!-- BRUTE -->
    <div class="card" style="display: flex; flex-direction: column; overflow: hidden">
      <div class="checker" style="height: 200px; display: flex; align-items: center; justify-content: center; position: relative; border-bottom: 1px solid #3a4356">
        <!--SPRITE:Brute:base:205-->
        <div style="position: absolute; top: 12px; left: 14px" class="eyebrow">14 × 14</div>
        <div style="position: absolute; top: 12px; right: 14px; display: flex; align-items: center; gap: 6px">
          <div style="width: 9px; height: 9px; border-radius: 5px; background: #b32020"></div>
          <div class="hex">#b32020 마커</div>
        </div>
      </div>
      <div style="padding: 16px 18px; display: flex; flex-direction: column; gap: 14px; flex-grow: 1">
        <div>
          <div style="color: #ffb300; font-size: 22px; font-weight: 900; letter-spacing: 1.5px">BRUTE</div>
          <div style="color: #9aa4b5; font-size: 13px; margin-top: 3px">브루트 · 회피 강제</div>
        </div>
        <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">작은 머리에 거대한 어깨와 주먹, 혼자만 14×14로 한 덩치 크다. 근접이 통하지 않고 한 방에 30을 깎아 총이나 도주뿐.</div>
        <div>
          <div class="stat"><span class="k">추격 속도</span><span class="v">5 km/h</span></div>
          <div class="stat"><span class="k">배회 속도</span><span class="v">3 km/h</span></div>
          <div class="stat"><span class="k">감지 범위</span><span class="v">50 m</span></div>
          <div class="stat"><span class="k">체력</span><span class="v" style="color:#ff4b3a">8</span></div>
          <div class="stat"><span class="k">공격력</span><span class="v" style="color:#ff4b3a">30</span></div>
          <div class="stat"><span class="k">특성</span><span class="v" style="color:#ff4b3a">근접 면역</span></div>
        </div>
        <div style="margin-top: auto">
          <div class="eyebrow" style="margin-bottom: 9px">팔레트</div>
          <div style="display: flex; flex-direction: column; gap: 7px">
            <div class="sw"><div class="chip" style="background:#b32020"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">B 몸</div><div class="hex">#b32020</div></div></div>
            <div class="sw"><div class="chip" style="background:#6b1010"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">D 음영</div><div class="hex">#6b1010</div></div></div>
            <div class="sw"><div class="chip" style="background:#ffb300"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">E 눈</div><div class="hex">#ffb300</div></div></div>
            <div class="sw"><div class="chip" style="background:#8f1a1a"></div><div><div style="color:#dfe3e8;font-size:11.5px;font-weight:700">H 손</div><div class="hex">#8f1a1a</div></div></div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <!-- 하단: 추격 팔레트 · 실측 크기 · 픽셀 문법 -->
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; height: 236px">

    <div class="card" style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px">
      <div class="eyebrow">추격 상태 — 공통 팔레트 치환</div>
      <div style="display: flex; align-items: center; gap: 12px; flex-grow: 1">
        <div class="checker" style="border-radius: 8px; padding: 8px"><!--SPRITE:Walker:aggro:72--></div>
        <div class="checker" style="border-radius: 8px; padding: 8px"><!--SPRITE:Runner:aggro:72--></div>
        <div class="checker" style="border-radius: 8px; padding: 8px"><!--SPRITE:Stalker:aggro:72--></div>
        <div class="checker" style="border-radius: 8px; padding: 8px"><!--SPRITE:Brute:aggro:84--></div>
      </div>
      <div style="display: flex; gap: 14px">
        <div class="sw"><div class="chip" style="background:#e33232"></div><div class="hex">B #e33232</div></div>
        <div class="sw"><div class="chip" style="background:#8f1a1a"></div><div class="hex">D #8f1a1a</div></div>
        <div class="sw"><div class="chip" style="background:#fff200"></div><div class="hex">E #fff200</div></div>
        <div class="sw"><div class="chip" style="background:#c22525"></div><div class="hex">H #c22525</div></div>
      </div>
      <div style="color: #9aa4b5; font-size: 12px; line-height: 17px">추격 상태에서 타입 팔레트를 통째로 덮어써, 색만 보고도 위험을 판단할 수 있게 한다. 노란 눈(#fff200)이 유일한 경보 신호. 공격력은 플레이어 최대 HP 100 기준 — 브루트 4방, 워커 10방이면 죽는다.</div>
    </div>

    <div class="card" style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px">
      <div class="eyebrow">지도 실측 크기 — 1픽셀 = 1m</div>
      <div style="display: flex; align-items: flex-end; gap: 22px; flex-grow: 1; padding-bottom: 4px">
        <div style="text-align: center"><!--SPRITE:Walker:base:26--><div class="hex" style="margin-top:8px">12m</div></div>
        <div style="text-align: center"><!--SPRITE:Runner:base:26--><div class="hex" style="margin-top:8px">12m</div></div>
        <div style="text-align: center"><!--SPRITE:Stalker:base:26--><div class="hex" style="margin-top:8px">12m</div></div>
        <div style="text-align: center"><!--SPRITE:Brute:base:30--><div class="hex" style="margin-top:8px">14m</div></div>
        <div style="width: 1px; height: 44px; background: #3a4356"></div>
        <div style="text-align: center"><!--SPRITE:Runner:aggro:33--><div class="hex" style="margin-top:8px">추격 ×1.25</div></div>
      </div>
      <div style="color: #9aa4b5; font-size: 12px; line-height: 17px">기본 확대(viewSpan 180m)에서 화면에 찍히는 실제 크기. 이 크기에서 네 실루엣이 서로 구분되는지가 픽셀맵 수정의 유일한 합격 기준이다.</div>
    </div>

    <div class="card" style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px">
      <div class="eyebrow">픽셀맵 문법 · 파이프라인</div>
      <div style="display: flex; flex-direction: column; gap: 6px; flex-grow: 1">
        <div class="stat" style="padding: 5px 0"><span class="k">B</span><span class="v">몸통</span></div>
        <div class="stat" style="padding: 5px 0"><span class="k">D</span><span class="v">음영</span></div>
        <div class="stat" style="padding: 5px 0"><span class="k">E</span><span class="v">눈</span></div>
        <div class="stat" style="padding: 5px 0"><span class="k">H</span><span class="v">손 · 하이라이트</span></div>
        <div class="stat" style="padding: 5px 0; border-bottom: none"><span class="k">.</span><span class="v" style="color:#6d7687">투명</span></div>
      </div>
      <div style="color: #9aa4b5; font-size: 12px; line-height: 17px; white-space: pre-line">zombieSprites.ts 픽셀맵 수정
→ npm run gen:zombies
→ assets/zombies/png 재생성 (개당 약 0.5KB)</div>
    </div>

  </div>

</div>
</x-dc>
</body>
</html>
