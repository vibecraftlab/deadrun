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
      background-size: 25.66px 25.66px; }
    .card { background: #1e242e; border: 1px solid #3a4356; border-radius: 12px; }
    .eyebrow { color: #6d7687; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
    .stat { display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-bottom: 1px solid #262d38; }
    .k { color: #9aa4b5; font-size: 12.5px; }
    .v { color: #dfe3e8; font-size: 13px; font-weight: 700; }
    .chip { width: 20px; height: 20px; border-radius: 5px; border: 1px solid #00000055; }
    .hex { color: #6d7687; font-size: 10.5px; }
    .newbadge { display: inline-block; background: #3a1010; border: 1px solid #ff5f4d; color: #ffd9d4;
      font-size: 10.5px; font-weight: 700; letter-spacing: 1px; padding: 3px 8px; border-radius: 6px; }
  </style>
</helmet>

<div style="width: 1560px; height: 900px; background: #14171c; padding: 28px; overflow: hidden; display: flex; flex-direction: column; gap: 22px">

  <!-- 헤더 -->
  <div style="display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 1px solid #3a4356; padding-bottom: 18px">
    <div>
      <div style="display: flex; align-items: baseline; gap: 14px">
        <div style="color: #3d8bff; font-size: 30px; font-weight: 900; letter-spacing: 5px">SURVIVOR</div>
        <div style="color: #dfe3e8; font-size: 20px; font-weight: 700">생존자 캐릭터 제안</div>
        <span class="newbadge">신규 — 현재 코드에 없음</span>
      </div>
      <div style="color: #9aa4b5; font-size: 13px; margin-top: 7px">지금 플레이어는 지도 위 파란 점(<span style="color:#3d8bff">#3d8bff</span>) + 방향 콘뿐이다. 좀비와 같은 12×12 픽셀 문법으로 캐릭터를 세운다.</div>
    </div>
    <div style="text-align: right">
      <div class="eyebrow">색 분리 원칙</div>
      <div style="color: #dfe3e8; font-size: 13px; margin-top: 8px; line-height: 19px">좀비 = 녹색·보라·적색 계열<br>생존자 = 청록 계열 (기존 액션 컬러 확장)</div>
    </div>
  </div>

  <!-- 3종 클래스 -->
  <div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; height: 442px">

    <!-- RUNNER -->
    <div class="card" style="display: flex; overflow: hidden">
      <div class="checker" style="width: 216px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-right: 1px solid #3a4356">
        <!--SPRITE:Runner_P:base:154-->
      </div>
      <div style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; flex-grow: 1">
        <div>
          <div style="color: #3d8bff; font-size: 21px; font-weight: 900; letter-spacing: 1.5px">RUNNER</div>
          <div style="color: #9aa4b5; font-size: 12.5px; margin-top: 3px">러너 · 기본 클래스</div>
        </div>
        <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">가벼운 차림에 백팩 하나. 특수 능력 없이 기준선을 잡는 기본형이다.</div>
        <div>
          <div class="stat"><span class="k">최대 HP</span><span class="v">100</span></div>
          <div class="stat"><span class="k">스캔 쿨다운</span><span class="v">60초</span></div>
          <div class="stat"><span class="k">시작 탄약</span><span class="v">10</span></div>
        </div>
        <div style="margin-top: auto; display: flex; gap: 10px">
          <div style="text-align: center"><div class="chip" style="background:#3d8bff"></div><div class="hex" style="margin-top:4px">B</div></div>
          <div style="text-align: center"><div class="chip" style="background:#255a9e"></div><div class="hex" style="margin-top:4px">D</div></div>
          <div style="text-align: center"><div class="chip" style="background:#dfe3e8"></div><div class="hex" style="margin-top:4px">E</div></div>
          <div style="text-align: center"><div class="chip" style="background:#7fb0ff"></div><div class="hex" style="margin-top:4px">H</div></div>
        </div>
      </div>
    </div>

    <!-- SCOUT -->
    <div class="card" style="display: flex; overflow: hidden">
      <div class="checker" style="width: 216px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-right: 1px solid #3a4356">
        <!--SPRITE:Scout_P:base:154-->
      </div>
      <div style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; flex-grow: 1">
        <div>
          <div style="color: #4dc3ff; font-size: 21px; font-weight: 900; letter-spacing: 1.5px">SCOUT</div>
          <div style="color: #9aa4b5; font-size: 12.5px; margin-top: 3px">정찰 · 정보 우위</div>
        </div>
        <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">헤드셋과 넓은 어깨 실루엣. 스토커의 깜빡임을 이겨내는 카운터 클래스다.</div>
        <div>
          <div class="stat"><span class="k">최대 HP</span><span class="v">100</span></div>
          <div class="stat"><span class="k">스캔 쿨다운</span><span class="v" style="color:#4dc3ff">45초</span></div>
          <div class="stat"><span class="k">스캔 노출 시간</span><span class="v" style="color:#4dc3ff">6초</span></div>
        </div>
        <div style="margin-top: auto; display: flex; gap: 10px">
          <div style="text-align: center"><div class="chip" style="background:#4dc3ff"></div><div class="hex" style="margin-top:4px">B</div></div>
          <div style="text-align: center"><div class="chip" style="background:#2b7ba6"></div><div class="hex" style="margin-top:4px">D</div></div>
          <div style="text-align: center"><div class="chip" style="background:#dfe3e8"></div><div class="hex" style="margin-top:4px">E</div></div>
          <div style="text-align: center"><div class="chip" style="background:#9ee0ff"></div><div class="hex" style="margin-top:4px">H</div></div>
        </div>
      </div>
    </div>

    <!-- MEDIC -->
    <div class="card" style="display: flex; overflow: hidden">
      <div class="checker" style="width: 216px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; border-right: 1px solid #3a4356">
        <!--SPRITE:Medic_P:base:154-->
      </div>
      <div style="padding: 16px 18px; display: flex; flex-direction: column; gap: 12px; flex-grow: 1">
        <div>
          <div style="color: #7fd8a0; font-size: 21px; font-weight: 900; letter-spacing: 1.5px">MEDIC</div>
          <div style="color: #9aa4b5; font-size: 12.5px; margin-top: 3px">위생 · 생존 지속</div>
        </div>
        <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">가슴에 십자 표식. 브루트의 30 공격을 네 번이 아니라 다섯 번 버틴다.</div>
        <div>
          <div class="stat"><span class="k">최대 HP</span><span class="v" style="color:#7fd8a0">130</span></div>
          <div class="stat"><span class="k">스캔 쿨다운</span><span class="v">60초</span></div>
          <div class="stat"><span class="k">시작 탄약</span><span class="v" style="color:#ff6b5c">6</span></div>
        </div>
        <div style="margin-top: auto; display: flex; gap: 10px">
          <div style="text-align: center"><div class="chip" style="background:#7fd8a0"></div><div class="hex" style="margin-top:4px">B</div></div>
          <div style="text-align: center"><div class="chip" style="background:#3f8a60"></div><div class="hex" style="margin-top:4px">D</div></div>
          <div style="text-align: center"><div class="chip" style="background:#dfe3e8"></div><div class="hex" style="margin-top:4px">E</div></div>
          <div style="text-align: center"><div class="chip" style="background:#b8f0cc"></div><div class="hex" style="margin-top:4px">H</div></div>
        </div>
      </div>
    </div>

  </div>

  <!-- 하단: 마커 비교 · 적용 범위 -->
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; flex-grow: 1">

    <div class="card" style="padding: 18px 20px; display: flex; flex-direction: column; gap: 14px">
      <div class="eyebrow">지도 마커 — 현재 / 제안</div>
      <div style="display: flex; align-items: center; gap: 40px; flex-grow: 1">
        <div style="text-align: center">
          <svg width="120" height="120" viewBox="0 0 120 120" style="display: block">
            <rect x="0" y="0" width="120" height="120" fill="#181b20" rx="8"/>
            <g transform="translate(60, 66) rotate(28)">
              <path d="M0,0 L-25.7,-42.9 A42.9,42.9 0 0 1 25.7,-42.9 Z" fill="#3d8bff3d"/>
            </g>
            <circle cx="60" cy="66" r="12.7" fill="#3d8bff" stroke="#ffffff" stroke-width="4.3"/>
          </svg>
          <div class="hex" style="margin-top: 8px">현재 — 점 + 방향 콘</div>
        </div>
        <div style="color: #6d7687; font-size: 24px">&rarr;</div>
        <div style="text-align: center">
          <svg width="120" height="120" viewBox="0 0 120 120" style="display: block">
            <rect x="0" y="0" width="120" height="120" fill="#181b20" rx="8"/>
            <g transform="translate(60, 66) rotate(28)">
              <path d="M0,0 L-25.7,-42.9 A42.9,42.9 0 0 1 25.7,-42.9 Z" fill="#3d8bff3d"/>
            </g>
          </svg>
          <div style="position: relative; margin-top: -78px; margin-bottom: 46px; display: flex; justify-content: center"><!--SPRITE:Runner_P:base:26--></div>
          <div class="hex">제안 — 픽셀 캐릭터 + 방향 콘</div>
        </div>
      </div>
      <div style="color: #9aa4b5; font-size: 12px; line-height: 17px">캐릭터도 지도에서 12m라 좀비와 크기가 같다. 청록 계열로 묶어 색만으로 아군을 구분하고, 방향 콘은 그대로 둔다.</div>
    </div>

    <div class="card" style="padding: 18px 20px; display: flex; flex-direction: column; gap: 14px">
      <div class="eyebrow">적용 범위와 미결 사항</div>
      <div style="display: flex; flex-direction: column; gap: 9px; flex-grow: 1">
        <div style="display: flex; gap: 10px; align-items: baseline">
          <div style="width: 7px; height: 7px; border-radius: 4px; background: #7fd8a0; flex-shrink: 0"></div>
          <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">지도 마커 · 시작 화면 클래스 선택 · 사망 화면 요약에 바로 쓸 수 있다.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: baseline">
          <div style="width: 7px; height: 7px; border-radius: 4px; background: #ffb84d; flex-shrink: 0"></div>
          <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">AR 뷰는 1인칭이라 자기 캐릭터가 보이지 않는다. 손·무기만 별도 에셋으로 정해야 한다.</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: baseline">
          <div style="width: 7px; height: 7px; border-radius: 4px; background: #ff5f4d; flex-shrink: 0"></div>
          <div style="color: #dfe3e8; font-size: 12.5px; line-height: 18px">클래스별 수치는 균형 미검증 제안이다. 지금은 전역 상수인 playerMaxHp 100 · scanCooldownSec 60 · scanRevealSec 4 · ammoStart 10을 클래스별로 분기해야 한다.</div>
        </div>
      </div>
      <div style="color: #6d7687; font-size: 11.5px; line-height: 17px; border-top: 1px solid #262d38; padding-top: 12px">픽셀맵은 zombieSprites.ts와 같은 B·D·E·H 문법으로 그렸다. survivorSprites.ts를 새로 만들고 같은 생성 스크립트를 재사용하면 된다.</div>
    </div>

  </div>

</div>
</x-dc>
</body>
</html>
