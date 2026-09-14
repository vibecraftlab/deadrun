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

<div style="width:1360px;height:1660px;background:#070A14;padding:30px;overflow:hidden;display:flex;flex-direction:column">

  <div style="display:flex;align-items:flex-end;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:16px">
    <div>
      <div style="display:flex;align-items:baseline;gap:13px">
        <div style="color:#fff;font-size:28px;font-weight:800;letter-spacing:-0.8px">좀비 4종</div>
        <div style="color:rgba(255,255,255,0.45);font-size:14px;font-weight:600">타입 × 상태 × 방향</div>
      </div>
      <div style="color:rgba(255,255,255,0.42);font-size:12px;margin-top:7px">
        수치는 core/zombies.ts · core/rules.ts 그대로. 형태가 곧 타입이고, 색은 상태만 나타낸다.
      </div>
    </div>
    <div style="display:flex;gap:18px">
      <div style="display:flex;align-items:center;gap:7px">
        <div style="width:9px;height:9px;border-radius:5px;background:#FF2E5B;box-shadow:0 0 9px #FF2E5B"></div>
        <span style="color:rgba(255,255,255,0.6);font-size:11.5px;font-weight:700">추격</span>
      </div>
      <div style="display:flex;align-items:center;gap:7px">
        <div style="width:9px;height:9px;border-radius:5px;background:#7CFF5B"></div>
        <span style="color:rgba(255,255,255,0.6);font-size:11.5px;font-weight:700">배회</span>
      </div>
    </div>
  </div>

  
  <div style="display:flex;flex-direction:row;gap:16px;align-items:flex-start;padding:16px 0;border-top:1px solid rgba(255,255,255,0.07)">
    <div style="width:250px;flex-shrink:0">
      <div style="display:flex;align-items:baseline;gap:8px">
        <div style="color:#fff;font-size:19px;font-weight:800;letter-spacing:-0.3px">WALKER</div>
        <div style="color:rgba(255,255,255,0.45);font-size:12px;font-weight:700">워커</div>
        <div style="margin-left:auto;background:rgba(255,255,255,0.07);border-radius:6px;padding:2px 7px;
          color:rgba(255,255,255,0.5);font-size:10px;font-weight:800">60%</div>
      </div>
      <div style="color:rgba(255,255,255,0.5);font-size:11px;line-height:16.5px;margin-top:7px">기본 개체. 느리지만 60%를 차지해 도시의 밀도를 만든다. 곧게 서서 두 팔을 앞으로 뻗는다.</div>
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">추격 속도</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">3 km/h</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">배회 속도</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">3 km/h</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">감지 거리</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">40 m</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">시야각</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">120°</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">체력</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">2</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">공격력</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">10</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">특성</span>
     <span style="color:rgba(255,255,255,0.35);font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">없음</span>
   </div>
      </div>
    </div>
    <div>
      <div style="color:#FF7D9B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">추격</div>
      <div style="display:flex;gap:9px"><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="29.0" ry="9.5" fill="#FF2E5B" opacity="0.34"/><ellipse rx="14.0" ry="4.6" fill="#FF2E5B" opacity="0.646"/><filter id="zwcf092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zwcf092)">
    <path d="M-4,-28 Q-7,-18 -6.5,-10 Q-6,-5 -7,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-28 Q8,-19 8,-11 Q8,-6 9,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-7,-2.5 Q-11,-1.6 -13,-2.8" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9,-2.5 Q13,-1.6 15,-2.8" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-30 Q-13,-40 -9,-47 Q0,-50.5 9,-47 Q13,-40 11,-30 L8.5,-23 L6,-29 L3,-21.5 L0,-28.5 L-3,-22 L-6,-29 L-8.5,-23 Z" fill="#3B4258"/>
    <path d="M4,-48 Q11,-44 11.5,-33 L10.5,-26 L8,-30 Z" fill="#262C3E"/>
    <path d="M-9.5,-45 Q-16,-42 -17,-36" stroke="#3B4258" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.5,-45 Q16,-42 17,-36" stroke="#3B4258" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-17,-36 L-17.5,-33" stroke="#8C9179" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M17,-36 L17.5,-33" stroke="#8C9179" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-17.5" cy="-32" r="5.4" fill="#8C9179"/>
    <circle cx="17.5" cy="-32" r="5.4" fill="#8C9179"/>
    <path d="M-21,-34.5 L-24,-33" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-21.5,-32 L-25,-31.5" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21,-34.5 L24,-33" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5,-32 L25,-31.5" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-46 Q0.5,-49.5 1,-51.5" stroke="#3E4234" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(1.5 -56.5) scale(1.02)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#FFE3EA"/>
      <circle cx="4" cy="-4" r="1.15" fill="#FFE3EA"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">정면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="29.0" ry="9.5" fill="#FF2E5B" opacity="0.34"/><ellipse rx="14.0" ry="4.6" fill="#FF2E5B" opacity="0.646"/><filter id="zwcs092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zwcs092)">
    <path d="M3,-29 Q10,-22 13,-14 Q15,-9 18,-4.5" stroke="#2E3444" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18,-4.5 Q20.5,-3 22,-4" stroke="#2E3444" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1,-46 Q7,-38 7.5,-30" stroke="#262C3E" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.5,-30 Q8.5,-25 7,-20" stroke="#3E4234" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-2.5,-29 Q-8,-21 -8.5,-13 Q-9,-7 -10,-3.5" stroke="#2E3444" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-3.5 Q-14,-2.6 -17,-3.6" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-8,-32 Q-10.5,-41 -6.5,-48 Q-1,-51 3.5,-47.5 Q5,-40 4,-31 L2.4,-24 L0.6,-29.5 L-1.6,-22 L-3.8,-28.5 L-6,-23 Z" fill="#3B4258"/>
    <path d="M1.2,-47 Q3.4,-40 2.6,-31 L1.8,-27 L0.8,-30 Z" fill="#262C3E"/>
    <path d="M-6.4,-47.6 Q-3.4,-44.8 -0.6,-46.4" stroke="#262C3E" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-4.5,-46.5 Q-15,-48.5 -23,-45.5" stroke="#3B4258" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-23,-45.5 Q-30,-43.5 -34,-44.5" stroke="#8C9179" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-34,-44.5 L-39.5,-47" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-34.5,-43.4 L-40.5,-43.8" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-34,-42.2 L-39,-40.2" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-4,-47.5 Q-8.5,-50 -12,-51" stroke="#3E4234" stroke-width="5.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(-12.5 -55.5) scale(1)">
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.5,-1.2 3.6,-0.4 L-3.6,-1.3 Q-7.4,-2.4 -7.6,-5.8 Q-7.8,-9.2 -0.5,-10.4 Z" fill="#8C9179"/>
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.3,-2.2 5.1,-1.1 Q4.4,-4.8 1.9,-7.5 Z" fill="#5A5F4C"/>
    <path d="M-7.2,-1 Q-4.2,0 -1.4,-0.6 Q-1,4.6 -3.8,5.4 Q-6.8,5.2 -7.2,-1 Z" fill="#171A12"/>
    <path d="M-8,0.4 Q-7,7 -3,6.8 Q0.8,6.4 2.2,2 Q-2.6,3.8 -8,0.4 Z" fill="#5A5F4C"/>
    <path d="M-7.4,-4.6 Q-4.6,-5.8 -2.6,-4.4 Q-3.6,-1.2 -6.2,-1.4 Q-7.8,-2.4 -7.4,-4.6 Z" fill="#171A12"/>
    <path d="M-1.4,-4.4 Q0.4,-5.2 1.9,-4.2 Q1.2,-1.8 -0.6,-1.8 Q-1.7,-2.6 -1.4,-4.4 Z" fill="#171A12"/>
    <circle cx="-5" cy="-3.4" r="1.05" fill="#FFE3EA"/>
    <circle cx="0.3" cy="-3.2" r="0.78" fill="#FFE3EA" opacity="0.8"/>
  </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">측면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="29.0" ry="9.5" fill="#FF2E5B" opacity="0.34"/><ellipse rx="14.0" ry="4.6" fill="#FF2E5B" opacity="0.646"/><filter id="zwcb092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zwcb092)">
    <path d="M-4,-28 Q-7,-18 -6.5,-10 Q-6,-5 -7,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-28 Q8,-19 8,-11 Q8,-6 9,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-7,-2.5 Q-10,-1.6 -12,-2.4" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9,-2.5 Q12,-1.6 14,-2.4" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-30 Q-13,-40 -9,-47.5 Q0,-51 9,-47.5 Q13,-40 11,-30 L8.5,-24 L5.5,-29.5 L2.5,-22.5 L-0.5,-29 L-3.5,-23 L-6.5,-29.5 L-8.5,-24 Z" fill="#262C3E"/>
    <path d="M0,-47 L0.5,-31" stroke="#3B4258" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-45 Q-16,-39 -16.5,-30" stroke="#262C3E" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-45 Q16,-39 16.5,-30" stroke="#262C3E" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-16.5,-30 Q-16.5,-25 -15.5,-21" stroke="#3E4234" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16.5,-30 Q16.5,-25 15.5,-21" stroke="#3E4234" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-46.5 Q0,-49.5 0,-51.5" stroke="#3E4234" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -56.5) scale(1.02)">
      <ellipse cx="0" cy="-4.2" rx="8.2" ry="9.3" fill="#8C9179"/>
      <path d="M-8.2,-5.6 Q-7.4,-13.4 0,-13.5 Q7.4,-13.4 8.2,-5.6 Q4,-9.2 0,-8.6 Q-4,-9.2 -8.2,-5.6 Z" fill="#5A5F4C"/>
      <path d="M-8,-2.4 Q-4,1.4 0,1.6 Q4,1.4 8,-2.4 Q6.6,3.6 0,5 Q-6.6,3.6 -8,-2.4 Z" fill="#5A5F4C"/>
      <path d="M2.6,-7.4 Q5.8,-8.2 6.8,-5.2 Q4.6,-3.2 2.2,-4.2 Z" fill="#3E4234"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">뒷모습</div>
  </div></div>
    </div>
    <div>
      <div style="color:#7CFF5B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">배회</div>
      <div style="display:flex;gap:9px"><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="29.0" ry="9.5" fill="#7CFF5B" opacity="0.22"/><ellipse rx="14.0" ry="4.6" fill="#7CFF5B" opacity="0.418"/><filter id="zwrf092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zwrf092)">
    <path d="M-4,-28 Q-7,-18 -6.5,-10 Q-6,-5 -7,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-28 Q8,-19 8,-11 Q8,-6 9,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-7,-2.5 Q-11,-1.6 -13,-2.8" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9,-2.5 Q13,-1.6 15,-2.8" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-30 Q-13,-40 -9,-47 Q0,-50.5 9,-47 Q13,-40 11,-30 L8.5,-23 L6,-29 L3,-21.5 L0,-28.5 L-3,-22 L-6,-29 L-8.5,-23 Z" fill="#3B4258"/>
    <path d="M4,-48 Q11,-44 11.5,-33 L10.5,-26 L8,-30 Z" fill="#262C3E"/>
    <path d="M-9.5,-45 Q-16,-42 -17,-36" stroke="#3B4258" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.5,-45 Q16,-42 17,-36" stroke="#3B4258" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-17,-36 L-17.5,-33" stroke="#8C9179" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M17,-36 L17.5,-33" stroke="#8C9179" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-17.5" cy="-32" r="5.4" fill="#8C9179"/>
    <circle cx="17.5" cy="-32" r="5.4" fill="#8C9179"/>
    <path d="M-21,-34.5 L-24,-33" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-21.5,-32 L-25,-31.5" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21,-34.5 L24,-33" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5,-32 L25,-31.5" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-46 Q0.5,-49.5 1,-51.5" stroke="#3E4234" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(1.5 -56.5) scale(1.02)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#DFFFCF"/>
      <circle cx="4" cy="-4" r="1.15" fill="#DFFFCF"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">정면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="29.0" ry="9.5" fill="#7CFF5B" opacity="0.22"/><ellipse rx="14.0" ry="4.6" fill="#7CFF5B" opacity="0.418"/><filter id="zwrs092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zwrs092)">
    <path d="M3,-29 Q10,-22 13,-14 Q15,-9 18,-4.5" stroke="#2E3444" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18,-4.5 Q20.5,-3 22,-4" stroke="#2E3444" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1,-46 Q7,-38 7.5,-30" stroke="#262C3E" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M7.5,-30 Q8.5,-25 7,-20" stroke="#3E4234" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-2.5,-29 Q-8,-21 -8.5,-13 Q-9,-7 -10,-3.5" stroke="#2E3444" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-3.5 Q-14,-2.6 -17,-3.6" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-8,-32 Q-10.5,-41 -6.5,-48 Q-1,-51 3.5,-47.5 Q5,-40 4,-31 L2.4,-24 L0.6,-29.5 L-1.6,-22 L-3.8,-28.5 L-6,-23 Z" fill="#3B4258"/>
    <path d="M1.2,-47 Q3.4,-40 2.6,-31 L1.8,-27 L0.8,-30 Z" fill="#262C3E"/>
    <path d="M-6.4,-47.6 Q-3.4,-44.8 -0.6,-46.4" stroke="#262C3E" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-4.5,-46.5 Q-15,-48.5 -23,-45.5" stroke="#3B4258" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-23,-45.5 Q-30,-43.5 -34,-44.5" stroke="#8C9179" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-34,-44.5 L-39.5,-47" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-34.5,-43.4 L-40.5,-43.8" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-34,-42.2 L-39,-40.2" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-4,-47.5 Q-8.5,-50 -12,-51" stroke="#3E4234" stroke-width="5.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(-12.5 -55.5) scale(1)">
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.5,-1.2 3.6,-0.4 L-3.6,-1.3 Q-7.4,-2.4 -7.6,-5.8 Q-7.8,-9.2 -0.5,-10.4 Z" fill="#8C9179"/>
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.3,-2.2 5.1,-1.1 Q4.4,-4.8 1.9,-7.5 Z" fill="#5A5F4C"/>
    <path d="M-7.2,-1 Q-4.2,0 -1.4,-0.6 Q-1,4.6 -3.8,5.4 Q-6.8,5.2 -7.2,-1 Z" fill="#171A12"/>
    <path d="M-8,0.4 Q-7,7 -3,6.8 Q0.8,6.4 2.2,2 Q-2.6,3.8 -8,0.4 Z" fill="#5A5F4C"/>
    <path d="M-7.4,-4.6 Q-4.6,-5.8 -2.6,-4.4 Q-3.6,-1.2 -6.2,-1.4 Q-7.8,-2.4 -7.4,-4.6 Z" fill="#171A12"/>
    <path d="M-1.4,-4.4 Q0.4,-5.2 1.9,-4.2 Q1.2,-1.8 -0.6,-1.8 Q-1.7,-2.6 -1.4,-4.4 Z" fill="#171A12"/>
    <circle cx="-5" cy="-3.4" r="1.05" fill="#DFFFCF"/>
    <circle cx="0.3" cy="-3.2" r="0.78" fill="#DFFFCF" opacity="0.8"/>
  </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">측면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="29.0" ry="9.5" fill="#7CFF5B" opacity="0.22"/><ellipse rx="14.0" ry="4.6" fill="#7CFF5B" opacity="0.418"/><filter id="zwrb092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zwrb092)">
    <path d="M-4,-28 Q-7,-18 -6.5,-10 Q-6,-5 -7,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-28 Q8,-19 8,-11 Q8,-6 9,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-7,-2.5 Q-10,-1.6 -12,-2.4" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9,-2.5 Q12,-1.6 14,-2.4" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-30 Q-13,-40 -9,-47.5 Q0,-51 9,-47.5 Q13,-40 11,-30 L8.5,-24 L5.5,-29.5 L2.5,-22.5 L-0.5,-29 L-3.5,-23 L-6.5,-29.5 L-8.5,-24 Z" fill="#262C3E"/>
    <path d="M0,-47 L0.5,-31" stroke="#3B4258" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-45 Q-16,-39 -16.5,-30" stroke="#262C3E" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-45 Q16,-39 16.5,-30" stroke="#262C3E" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-16.5,-30 Q-16.5,-25 -15.5,-21" stroke="#3E4234" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16.5,-30 Q16.5,-25 15.5,-21" stroke="#3E4234" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-46.5 Q0,-49.5 0,-51.5" stroke="#3E4234" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -56.5) scale(1.02)">
      <ellipse cx="0" cy="-4.2" rx="8.2" ry="9.3" fill="#8C9179"/>
      <path d="M-8.2,-5.6 Q-7.4,-13.4 0,-13.5 Q7.4,-13.4 8.2,-5.6 Q4,-9.2 0,-8.6 Q-4,-9.2 -8.2,-5.6 Z" fill="#5A5F4C"/>
      <path d="M-8,-2.4 Q-4,1.4 0,1.6 Q4,1.4 8,-2.4 Q6.6,3.6 0,5 Q-6.6,3.6 -8,-2.4 Z" fill="#5A5F4C"/>
      <path d="M2.6,-7.4 Q5.8,-8.2 6.8,-5.2 Q4.6,-3.2 2.2,-4.2 Z" fill="#3E4234"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">뒷모습</div>
  </div></div>
    </div>
  </div>
  <div style="display:flex;flex-direction:row;gap:16px;align-items:flex-start;padding:16px 0;border-top:1px solid rgba(255,255,255,0.07)">
    <div style="width:250px;flex-shrink:0">
      <div style="display:flex;align-items:baseline;gap:8px">
        <div style="color:#fff;font-size:19px;font-weight:800;letter-spacing:-0.3px">RUNNER</div>
        <div style="color:rgba(255,255,255,0.45);font-size:12px;font-weight:700">러너</div>
        <div style="margin-left:auto;background:rgba(255,255,255,0.07);border-radius:6px;padding:2px 7px;
          color:rgba(255,255,255,0.5);font-size:10px;font-weight:800">20%</div>
      </div>
      <div style="color:rgba(255,255,255,0.5);font-size:11px;line-height:16.5px;margin-top:7px">상체를 깊게 숙인 질주 자세. 평균 러닝 속도보다 빠르니 버텨서 지치게 만드는 게 답이다.</div>
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">추격 속도</span>
     <span style="color:#FF7D9B;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">12 km/h</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">배회 속도</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">3 km/h</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">감지 거리</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">60 m</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">시야각</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">150°</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">체력</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">3</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">공격력</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">8</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">특성</span>
     <span style="color:#FFC53D;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">45초 후 지침 → 5km/h</span>
   </div>
      </div>
    </div>
    <div>
      <div style="color:#FF7D9B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">추격</div>
      <div style="display:flex;gap:9px"><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="27.5" ry="9.0" fill="#FF2E5B" opacity="0.34"/><ellipse rx="13.3" ry="4.4" fill="#FF2E5B" opacity="0.646"/><filter id="zncf092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zncf092)">
    <path d="M-4,-29 Q-9,-21 -11,-13 Q-12,-8 -14,-5" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-29 Q8,-21 9,-14 Q9.5,-9 10,-5" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-14,-5 Q-18,-4 -20,-5.6" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-5 Q14,-4 16,-5.6" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-31 Q-13.5,-41 -9,-49 Q0,-52.5 9,-49 Q13.5,-41 11,-31 L8,-24 L5,-30 L2,-22 L-1,-29 L-4,-22.5 L-7,-30 L-9,-24 Z" fill="#4E3A2A"/>
    <path d="M4,-50 Q11.5,-45 12,-34 L10.5,-27 L8,-31 Z" fill="#32251A"/>
    <path d="M-10,-47 Q-19,-44 -21,-37" stroke="#4E3A2A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-21.5" cy="-32.5" r="6.2" fill="#8C9179"/>
    <path d="M-25.5,-35.5 L-29,-34" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-26,-32.5 L-30,-32" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-25,-29.5 L-28.5,-27.5" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-47 Q19,-43 22,-36" stroke="#32251A" stroke-width="6.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22,-36 Q24,-31 22.5,-27" stroke="#3E4234" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24.5,-24.5 L26.5,-21" stroke="#3E4234" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5,-24 L21.5,-20.5" stroke="#3E4234" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-48 Q0.5,-51 1,-52.5" stroke="#3E4234" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(1.5 -57) scale(0.97)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#FFE3EA"/>
      <circle cx="4" cy="-4" r="1.15" fill="#FFE3EA"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">정면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="27.5" ry="9.0" fill="#FF2E5B" opacity="0.34"/><ellipse rx="13.3" ry="4.4" fill="#FF2E5B" opacity="0.646"/><filter id="zncs092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zncs092)">
    <path d="M2,-30 Q11,-26 15,-18 Q17,-13 21,-10" stroke="#35302A" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21,-10 Q24,-9 26,-10.5" stroke="#35302A" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1,-46 Q9,-42 12,-35" stroke="#32251A" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12,-35 Q15,-31 15,-26" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-3,-30 Q-11,-25 -13,-17 Q-14,-11 -17,-7" stroke="#35302A" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-17,-7 Q-21,-6 -24,-7.4" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-9,-33 Q-13,-42 -8,-49 Q-1,-52 4,-48 Q5.5,-40 4,-31.5 L2,-25 L0,-30.5 L-2.5,-23.5 L-5,-30 L-7.5,-24.5 Z" fill="#4E3A2A"/>
    <path d="M1.5,-48.5 Q4.5,-41 3,-31.5 L2,-27 L1,-30.5 Z" fill="#32251A"/>
    <path d="M-6.5,-49 Q-3,-46 0,-47.6" stroke="#32251A" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-6,-47.5 Q-17,-51 -26,-49" stroke="#4E3A2A" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-26,-49 Q-33,-48 -37,-50" stroke="#8C9179" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-37,-50 L-42,-53" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-37.5,-48.8 L-43,-49.6" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-37,-47.6 L-41.5,-45.8" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-5,-48.5 Q-10,-52 -14,-53.5" stroke="#3E4234" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(-15 -57.5) scale(0.95)">
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.5,-1.2 3.6,-0.4 L-3.6,-1.3 Q-7.4,-2.4 -7.6,-5.8 Q-7.8,-9.2 -0.5,-10.4 Z" fill="#8C9179"/>
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.3,-2.2 5.1,-1.1 Q4.4,-4.8 1.9,-7.5 Z" fill="#5A5F4C"/>
    <path d="M-7.2,-1 Q-4.2,0 -1.4,-0.6 Q-1,4.6 -3.8,5.4 Q-6.8,5.2 -7.2,-1 Z" fill="#171A12"/>
    <path d="M-8,0.4 Q-7,7 -3,6.8 Q0.8,6.4 2.2,2 Q-2.6,3.8 -8,0.4 Z" fill="#5A5F4C"/>
    <path d="M-7.4,-4.6 Q-4.6,-5.8 -2.6,-4.4 Q-3.6,-1.2 -6.2,-1.4 Q-7.8,-2.4 -7.4,-4.6 Z" fill="#171A12"/>
    <path d="M-1.4,-4.4 Q0.4,-5.2 1.9,-4.2 Q1.2,-1.8 -0.6,-1.8 Q-1.7,-2.6 -1.4,-4.4 Z" fill="#171A12"/>
    <circle cx="-5" cy="-3.4" r="1.05" fill="#FFE3EA"/>
    <circle cx="0.3" cy="-3.2" r="0.78" fill="#FFE3EA" opacity="0.8"/>
  </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">측면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="27.5" ry="9.0" fill="#FF2E5B" opacity="0.34"/><ellipse rx="13.3" ry="4.4" fill="#FF2E5B" opacity="0.646"/><filter id="zncb092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zncb092)">
    <path d="M-4,-29 Q-8,-21 -9,-13 Q-9.5,-8 -11,-5" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-29 Q10,-23 13,-16 Q15,-11 18,-8" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-5 Q-14,-4 -16,-5.4" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18,-8 Q21,-7 23,-8.6" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-31 Q-13.5,-41 -9,-49 Q0,-52.5 9,-49 Q13.5,-41 11,-31 L8,-25 L5,-30.5 L2,-23 L-1,-29.5 L-4,-23 L-7,-30.5 L-9,-25 Z" fill="#32251A"/>
    <path d="M0,-49 L0.5,-32" stroke="#4E3A2A" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-47 Q-15,-40 -13,-33" stroke="#32251A" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-47 Q16,-42 16,-35" stroke="#32251A" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-33 Q-12,-29 -13,-26" stroke="#3E4234" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16,-35 Q16,-31 15,-28" stroke="#3E4234" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-48.5 Q0,-51 0,-52.5" stroke="#3E4234" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -57) scale(0.97)">
      <ellipse cx="0" cy="-4.2" rx="8.2" ry="9.3" fill="#8C9179"/>
      <path d="M-8.2,-5.6 Q-7.4,-13.4 0,-13.5 Q7.4,-13.4 8.2,-5.6 Q4,-9.2 0,-8.6 Q-4,-9.2 -8.2,-5.6 Z" fill="#5A5F4C"/>
      <path d="M-8,-2.4 Q-4,1.4 0,1.6 Q4,1.4 8,-2.4 Q6.6,3.6 0,5 Q-6.6,3.6 -8,-2.4 Z" fill="#5A5F4C"/>
      <path d="M2.6,-7.4 Q5.8,-8.2 6.8,-5.2 Q4.6,-3.2 2.2,-4.2 Z" fill="#3E4234"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">뒷모습</div>
  </div></div>
    </div>
    <div>
      <div style="color:#7CFF5B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">배회</div>
      <div style="display:flex;gap:9px"><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="27.5" ry="9.0" fill="#7CFF5B" opacity="0.22"/><ellipse rx="13.3" ry="4.4" fill="#7CFF5B" opacity="0.418"/><filter id="znrf092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#znrf092)">
    <path d="M-4,-29 Q-9,-21 -11,-13 Q-12,-8 -14,-5" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-29 Q8,-21 9,-14 Q9.5,-9 10,-5" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-14,-5 Q-18,-4 -20,-5.6" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-5 Q14,-4 16,-5.6" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-31 Q-13.5,-41 -9,-49 Q0,-52.5 9,-49 Q13.5,-41 11,-31 L8,-24 L5,-30 L2,-22 L-1,-29 L-4,-22.5 L-7,-30 L-9,-24 Z" fill="#4E3A2A"/>
    <path d="M4,-50 Q11.5,-45 12,-34 L10.5,-27 L8,-31 Z" fill="#32251A"/>
    <path d="M-10,-47 Q-19,-44 -21,-37" stroke="#4E3A2A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-21.5" cy="-32.5" r="6.2" fill="#8C9179"/>
    <path d="M-25.5,-35.5 L-29,-34" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-26,-32.5 L-30,-32" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-25,-29.5 L-28.5,-27.5" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-47 Q19,-43 22,-36" stroke="#32251A" stroke-width="6.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22,-36 Q24,-31 22.5,-27" stroke="#3E4234" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24.5,-24.5 L26.5,-21" stroke="#3E4234" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5,-24 L21.5,-20.5" stroke="#3E4234" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-48 Q0.5,-51 1,-52.5" stroke="#3E4234" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(1.5 -57) scale(0.97)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#DFFFCF"/>
      <circle cx="4" cy="-4" r="1.15" fill="#DFFFCF"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">정면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="27.5" ry="9.0" fill="#7CFF5B" opacity="0.22"/><ellipse rx="13.3" ry="4.4" fill="#7CFF5B" opacity="0.418"/><filter id="znrs092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#znrs092)">
    <path d="M2,-30 Q11,-26 15,-18 Q17,-13 21,-10" stroke="#35302A" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21,-10 Q24,-9 26,-10.5" stroke="#35302A" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M1,-46 Q9,-42 12,-35" stroke="#32251A" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12,-35 Q15,-31 15,-26" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-3,-30 Q-11,-25 -13,-17 Q-14,-11 -17,-7" stroke="#35302A" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-17,-7 Q-21,-6 -24,-7.4" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-9,-33 Q-13,-42 -8,-49 Q-1,-52 4,-48 Q5.5,-40 4,-31.5 L2,-25 L0,-30.5 L-2.5,-23.5 L-5,-30 L-7.5,-24.5 Z" fill="#4E3A2A"/>
    <path d="M1.5,-48.5 Q4.5,-41 3,-31.5 L2,-27 L1,-30.5 Z" fill="#32251A"/>
    <path d="M-6.5,-49 Q-3,-46 0,-47.6" stroke="#32251A" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-6,-47.5 Q-17,-51 -26,-49" stroke="#4E3A2A" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-26,-49 Q-33,-48 -37,-50" stroke="#8C9179" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-37,-50 L-42,-53" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-37.5,-48.8 L-43,-49.6" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-37,-47.6 L-41.5,-45.8" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-5,-48.5 Q-10,-52 -14,-53.5" stroke="#3E4234" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(-15 -57.5) scale(0.95)">
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.5,-1.2 3.6,-0.4 L-3.6,-1.3 Q-7.4,-2.4 -7.6,-5.8 Q-7.8,-9.2 -0.5,-10.4 Z" fill="#8C9179"/>
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.3,-2.2 5.1,-1.1 Q4.4,-4.8 1.9,-7.5 Z" fill="#5A5F4C"/>
    <path d="M-7.2,-1 Q-4.2,0 -1.4,-0.6 Q-1,4.6 -3.8,5.4 Q-6.8,5.2 -7.2,-1 Z" fill="#171A12"/>
    <path d="M-8,0.4 Q-7,7 -3,6.8 Q0.8,6.4 2.2,2 Q-2.6,3.8 -8,0.4 Z" fill="#5A5F4C"/>
    <path d="M-7.4,-4.6 Q-4.6,-5.8 -2.6,-4.4 Q-3.6,-1.2 -6.2,-1.4 Q-7.8,-2.4 -7.4,-4.6 Z" fill="#171A12"/>
    <path d="M-1.4,-4.4 Q0.4,-5.2 1.9,-4.2 Q1.2,-1.8 -0.6,-1.8 Q-1.7,-2.6 -1.4,-4.4 Z" fill="#171A12"/>
    <circle cx="-5" cy="-3.4" r="1.05" fill="#DFFFCF"/>
    <circle cx="0.3" cy="-3.2" r="0.78" fill="#DFFFCF" opacity="0.8"/>
  </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">측면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="27.5" ry="9.0" fill="#7CFF5B" opacity="0.22"/><ellipse rx="13.3" ry="4.4" fill="#7CFF5B" opacity="0.418"/><filter id="znrb092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#znrb092)">
    <path d="M-4,-29 Q-8,-21 -9,-13 Q-9.5,-8 -11,-5" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-29 Q10,-23 13,-16 Q15,-11 18,-8" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-5 Q-14,-4 -16,-5.4" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M18,-8 Q21,-7 23,-8.6" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-31 Q-13.5,-41 -9,-49 Q0,-52.5 9,-49 Q13.5,-41 11,-31 L8,-25 L5,-30.5 L2,-23 L-1,-29.5 L-4,-23 L-7,-30.5 L-9,-25 Z" fill="#32251A"/>
    <path d="M0,-49 L0.5,-32" stroke="#4E3A2A" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-47 Q-15,-40 -13,-33" stroke="#32251A" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-47 Q16,-42 16,-35" stroke="#32251A" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-33 Q-12,-29 -13,-26" stroke="#3E4234" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M16,-35 Q16,-31 15,-28" stroke="#3E4234" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-48.5 Q0,-51 0,-52.5" stroke="#3E4234" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -57) scale(0.97)">
      <ellipse cx="0" cy="-4.2" rx="8.2" ry="9.3" fill="#8C9179"/>
      <path d="M-8.2,-5.6 Q-7.4,-13.4 0,-13.5 Q7.4,-13.4 8.2,-5.6 Q4,-9.2 0,-8.6 Q-4,-9.2 -8.2,-5.6 Z" fill="#5A5F4C"/>
      <path d="M-8,-2.4 Q-4,1.4 0,1.6 Q4,1.4 8,-2.4 Q6.6,3.6 0,5 Q-6.6,3.6 -8,-2.4 Z" fill="#5A5F4C"/>
      <path d="M2.6,-7.4 Q5.8,-8.2 6.8,-5.2 Q4.6,-3.2 2.2,-4.2 Z" fill="#3E4234"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">뒷모습</div>
  </div></div>
    </div>
  </div>
  <div style="display:flex;flex-direction:row;gap:16px;align-items:flex-start;padding:16px 0;border-top:1px solid rgba(255,255,255,0.07)">
    <div style="width:250px;flex-shrink:0">
      <div style="display:flex;align-items:baseline;gap:8px">
        <div style="color:#fff;font-size:19px;font-weight:800;letter-spacing:-0.3px">STALKER</div>
        <div style="color:rgba(255,255,255,0.45);font-size:12px;font-weight:700">스토커</div>
        <div style="margin-left:auto;background:rgba(255,255,255,0.07);border-radius:6px;padding:2px 7px;
          color:rgba(255,255,255,0.5);font-size:10px;font-weight:800">15%</div>
      </div>
      <div style="color:rgba(255,255,255,0.5);font-size:11px;line-height:16.5px;margin-top:7px">낮게 웅크려 긴 팔로 땅을 짚고 기어온다. 시야각이 360도라 등 뒤로 돌아가도 소용없다.</div>
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">추격 속도</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">7 km/h</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">배회 속도</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">3 km/h</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">감지 거리</span>
     <span style="color:#2FD9FF;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">90 m</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">시야각</span>
     <span style="color:#2FD9FF;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">360° 전방위</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">체력</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">2</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">공격력</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">14</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">특성</span>
     <span style="color:#FFC53D;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">스텔스 · 전방위 감지</span>
   </div>
      </div>
    </div>
    <div>
      <div style="color:#FF7D9B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">추격</div>
      <div style="display:flex;gap:9px"><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="33.3" ry="10.9" fill="#FF2E5B" opacity="0.34"/><ellipse rx="16.1" ry="5.3" fill="#FF2E5B" opacity="0.646"/><filter id="zscf092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zscf092)">
    <path d="M-7,-16 Q-13,-11 -15,-5 Q-16,-3 -18,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-16 Q14,-11 16,-5 Q17,-3 19,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-18,-2 Q-22,-1.4 -24,-3" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19,-2 Q23,-1.4 25,-3" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-17 Q-17,-27 -9,-33 Q0,-36 9,-33 Q17,-27 13,-17 L10,-11 L7,-16 L3.5,-9.5 L0,-15.5 L-3.5,-10 L-7,-16 L-10,-11 Z" fill="#2F3A36"/>
    <path d="M5,-34 Q15,-28 13.5,-19 L11,-12 L8.5,-16 Z" fill="#1E2523"/>
    <path d="M-11,-31 Q-23,-26 -27,-16" stroke="#2F3A36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11,-31 Q23,-26 27,-16" stroke="#2F3A36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-27,-16 Q-30,-11 -30,-6" stroke="#8C9179" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27,-16 Q30,-11 30,-6" stroke="#8C9179" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-32,-5 L-34,-1.5" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-29.5,-4.5 L-30,-0.8" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32,-5 L34,-1.5" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.5,-4.5 L30,-0.8" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-32 Q0,-35 0,-37" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -41.5) scale(0.9)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#FFE3EA"/>
      <circle cx="4" cy="-4" r="1.15" fill="#FFE3EA"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">정면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="33.3" ry="10.9" fill="#FF2E5B" opacity="0.34"/><ellipse rx="16.1" ry="5.3" fill="#FF2E5B" opacity="0.646"/><filter id="zscs092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zscs092)">
    <path d="M6,-16 Q13,-13 16,-7 Q17,-4 19,-2" stroke="#262E2B" stroke-width="6.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19,-2 Q22,-1.4 24,-2.6" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4,-22 Q12,-17 15,-10" stroke="#1E2523" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-10 Q17,-6 16,-3" stroke="#3E4234" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-1,-17 Q-8,-13 -10,-7 Q-11,-4 -13,-2" stroke="#262E2B" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-2 Q-17,-1.4 -20,-2.8" stroke="#262E2B" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-19 Q-16,-27 -10,-33 Q0,-37 8,-31 Q10,-24 8,-17 L6,-12 L4,-16.5 L1.5,-11 L-1,-16 L-4,-11.5 L-7,-16 Z" fill="#2F3A36"/>
    <path d="M4,-33 Q9.5,-28 8.5,-18 L7,-13 L5.5,-16 Z" fill="#1E2523"/>
    <path d="M-9,-32.5 Q-11,-36 -8,-38" stroke="#1E2523" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-8,-31 Q-20,-30 -28,-22" stroke="#2F3A36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-28,-22 Q-34,-16 -37,-9" stroke="#8C9179" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-37,-9 L-42,-7" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-37.5,-8 L-41.5,-4.5" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-36,-7.5 L-38.5,-3" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-8,-32 Q-16,-33 -22,-32" stroke="#3E4234" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(-25 -33) scale(0.86)">
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.5,-1.2 3.6,-0.4 L-3.6,-1.3 Q-7.4,-2.4 -7.6,-5.8 Q-7.8,-9.2 -0.5,-10.4 Z" fill="#8C9179"/>
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.3,-2.2 5.1,-1.1 Q4.4,-4.8 1.9,-7.5 Z" fill="#5A5F4C"/>
    <path d="M-7.2,-1 Q-4.2,0 -1.4,-0.6 Q-1,4.6 -3.8,5.4 Q-6.8,5.2 -7.2,-1 Z" fill="#171A12"/>
    <path d="M-8,0.4 Q-7,7 -3,6.8 Q0.8,6.4 2.2,2 Q-2.6,3.8 -8,0.4 Z" fill="#5A5F4C"/>
    <path d="M-7.4,-4.6 Q-4.6,-5.8 -2.6,-4.4 Q-3.6,-1.2 -6.2,-1.4 Q-7.8,-2.4 -7.4,-4.6 Z" fill="#171A12"/>
    <path d="M-1.4,-4.4 Q0.4,-5.2 1.9,-4.2 Q1.2,-1.8 -0.6,-1.8 Q-1.7,-2.6 -1.4,-4.4 Z" fill="#171A12"/>
    <circle cx="-5" cy="-3.4" r="1.05" fill="#FFE3EA"/>
    <circle cx="0.3" cy="-3.2" r="0.78" fill="#FFE3EA" opacity="0.8"/>
  </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">측면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="33.3" ry="10.9" fill="#FF2E5B" opacity="0.34"/><ellipse rx="16.1" ry="5.3" fill="#FF2E5B" opacity="0.646"/><filter id="zscb092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zscb092)">
    <path d="M-7,-16 Q-13,-11 -15,-5 Q-16,-3 -18,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-16 Q14,-11 16,-5 Q17,-3 19,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-18,-2 Q-21,-1.4 -23,-2.6" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19,-2 Q22,-1.4 24,-2.6" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-17 Q-18,-28 -9,-34 Q0,-37.5 9,-34 Q18,-28 13,-17 L10,-12 L7,-17 L3.5,-10.5 L0,-16.5 L-3.5,-11 L-7,-17 L-10,-12 Z" fill="#1E2523"/>
    <path d="M0,-34 L0,-18" stroke="#2F3A36" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-32 Q-23,-27 -28,-17" stroke="#1E2523" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11,-32 Q23,-27 28,-17" stroke="#1E2523" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-28,-17 Q-31,-12 -31,-7" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28,-17 Q31,-12 31,-7" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-33 Q0,-36 0,-37.5" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -42) scale(0.9)">
      <ellipse cx="0" cy="-4.2" rx="8.2" ry="9.3" fill="#8C9179"/>
      <path d="M-8.2,-5.6 Q-7.4,-13.4 0,-13.5 Q7.4,-13.4 8.2,-5.6 Q4,-9.2 0,-8.6 Q-4,-9.2 -8.2,-5.6 Z" fill="#5A5F4C"/>
      <path d="M-8,-2.4 Q-4,1.4 0,1.6 Q4,1.4 8,-2.4 Q6.6,3.6 0,5 Q-6.6,3.6 -8,-2.4 Z" fill="#5A5F4C"/>
      <path d="M2.6,-7.4 Q5.8,-8.2 6.8,-5.2 Q4.6,-3.2 2.2,-4.2 Z" fill="#3E4234"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">뒷모습</div>
  </div></div>
    </div>
    <div>
      <div style="color:#7CFF5B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">배회</div>
      <div style="display:flex;gap:9px"><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="33.3" ry="10.9" fill="#7CFF5B" opacity="0.22"/><ellipse rx="16.1" ry="5.3" fill="#7CFF5B" opacity="0.418"/><filter id="zsrf092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zsrf092)">
    <path d="M-7,-16 Q-13,-11 -15,-5 Q-16,-3 -18,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-16 Q14,-11 16,-5 Q17,-3 19,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-18,-2 Q-22,-1.4 -24,-3" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19,-2 Q23,-1.4 25,-3" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-17 Q-17,-27 -9,-33 Q0,-36 9,-33 Q17,-27 13,-17 L10,-11 L7,-16 L3.5,-9.5 L0,-15.5 L-3.5,-10 L-7,-16 L-10,-11 Z" fill="#2F3A36"/>
    <path d="M5,-34 Q15,-28 13.5,-19 L11,-12 L8.5,-16 Z" fill="#1E2523"/>
    <path d="M-11,-31 Q-23,-26 -27,-16" stroke="#2F3A36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11,-31 Q23,-26 27,-16" stroke="#2F3A36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-27,-16 Q-30,-11 -30,-6" stroke="#8C9179" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27,-16 Q30,-11 30,-6" stroke="#8C9179" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-32,-5 L-34,-1.5" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-29.5,-4.5 L-30,-0.8" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32,-5 L34,-1.5" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.5,-4.5 L30,-0.8" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-32 Q0,-35 0,-37" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -41.5) scale(0.9)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#DFFFCF"/>
      <circle cx="4" cy="-4" r="1.15" fill="#DFFFCF"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">정면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="33.3" ry="10.9" fill="#7CFF5B" opacity="0.22"/><ellipse rx="16.1" ry="5.3" fill="#7CFF5B" opacity="0.418"/><filter id="zsrs092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zsrs092)">
    <path d="M6,-16 Q13,-13 16,-7 Q17,-4 19,-2" stroke="#262E2B" stroke-width="6.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19,-2 Q22,-1.4 24,-2.6" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4,-22 Q12,-17 15,-10" stroke="#1E2523" stroke-width="5.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-10 Q17,-6 16,-3" stroke="#3E4234" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-1,-17 Q-8,-13 -10,-7 Q-11,-4 -13,-2" stroke="#262E2B" stroke-width="6.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-2 Q-17,-1.4 -20,-2.8" stroke="#262E2B" stroke-width="5.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-10,-19 Q-16,-27 -10,-33 Q0,-37 8,-31 Q10,-24 8,-17 L6,-12 L4,-16.5 L1.5,-11 L-1,-16 L-4,-11.5 L-7,-16 Z" fill="#2F3A36"/>
    <path d="M4,-33 Q9.5,-28 8.5,-18 L7,-13 L5.5,-16 Z" fill="#1E2523"/>
    <path d="M-9,-32.5 Q-11,-36 -8,-38" stroke="#1E2523" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-8,-31 Q-20,-30 -28,-22" stroke="#2F3A36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-28,-22 Q-34,-16 -37,-9" stroke="#8C9179" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-37,-9 L-42,-7" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-37.5,-8 L-41.5,-4.5" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-36,-7.5 L-38.5,-3" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-8,-32 Q-16,-33 -22,-32" stroke="#3E4234" stroke-width="4.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(-25 -33) scale(0.86)">
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.5,-1.2 3.6,-0.4 L-3.6,-1.3 Q-7.4,-2.4 -7.6,-5.8 Q-7.8,-9.2 -0.5,-10.4 Z" fill="#8C9179"/>
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.3,-2.2 5.1,-1.1 Q4.4,-4.8 1.9,-7.5 Z" fill="#5A5F4C"/>
    <path d="M-7.2,-1 Q-4.2,0 -1.4,-0.6 Q-1,4.6 -3.8,5.4 Q-6.8,5.2 -7.2,-1 Z" fill="#171A12"/>
    <path d="M-8,0.4 Q-7,7 -3,6.8 Q0.8,6.4 2.2,2 Q-2.6,3.8 -8,0.4 Z" fill="#5A5F4C"/>
    <path d="M-7.4,-4.6 Q-4.6,-5.8 -2.6,-4.4 Q-3.6,-1.2 -6.2,-1.4 Q-7.8,-2.4 -7.4,-4.6 Z" fill="#171A12"/>
    <path d="M-1.4,-4.4 Q0.4,-5.2 1.9,-4.2 Q1.2,-1.8 -0.6,-1.8 Q-1.7,-2.6 -1.4,-4.4 Z" fill="#171A12"/>
    <circle cx="-5" cy="-3.4" r="1.05" fill="#DFFFCF"/>
    <circle cx="0.3" cy="-3.2" r="0.78" fill="#DFFFCF" opacity="0.8"/>
  </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">측면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="33.3" ry="10.9" fill="#7CFF5B" opacity="0.22"/><ellipse rx="16.1" ry="5.3" fill="#7CFF5B" opacity="0.418"/><filter id="zsrb092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zsrb092)">
    <path d="M-7,-16 Q-13,-11 -15,-5 Q-16,-3 -18,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-16 Q14,-11 16,-5 Q17,-3 19,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-18,-2 Q-21,-1.4 -23,-2.6" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19,-2 Q22,-1.4 24,-2.6" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-17 Q-18,-28 -9,-34 Q0,-37.5 9,-34 Q18,-28 13,-17 L10,-12 L7,-17 L3.5,-10.5 L0,-16.5 L-3.5,-11 L-7,-17 L-10,-12 Z" fill="#1E2523"/>
    <path d="M0,-34 L0,-18" stroke="#2F3A36" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-32 Q-23,-27 -28,-17" stroke="#1E2523" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11,-32 Q23,-27 28,-17" stroke="#1E2523" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-28,-17 Q-31,-12 -31,-7" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28,-17 Q31,-12 31,-7" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-33 Q0,-36 0,-37.5" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -42) scale(0.9)">
      <ellipse cx="0" cy="-4.2" rx="8.2" ry="9.3" fill="#8C9179"/>
      <path d="M-8.2,-5.6 Q-7.4,-13.4 0,-13.5 Q7.4,-13.4 8.2,-5.6 Q4,-9.2 0,-8.6 Q-4,-9.2 -8.2,-5.6 Z" fill="#5A5F4C"/>
      <path d="M-8,-2.4 Q-4,1.4 0,1.6 Q4,1.4 8,-2.4 Q6.6,3.6 0,5 Q-6.6,3.6 -8,-2.4 Z" fill="#5A5F4C"/>
      <path d="M2.6,-7.4 Q5.8,-8.2 6.8,-5.2 Q4.6,-3.2 2.2,-4.2 Z" fill="#3E4234"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">뒷모습</div>
  </div></div>
    </div>
  </div>
  <div style="display:flex;flex-direction:row;gap:16px;align-items:flex-start;padding:16px 0;border-top:1px solid rgba(255,255,255,0.07)">
    <div style="width:250px;flex-shrink:0">
      <div style="display:flex;align-items:baseline;gap:8px">
        <div style="color:#fff;font-size:19px;font-weight:800;letter-spacing:-0.3px">BRUTE</div>
        <div style="color:rgba(255,255,255,0.45);font-size:12px;font-weight:700">브루트</div>
        <div style="margin-left:auto;background:rgba(255,255,255,0.07);border-radius:6px;padding:2px 7px;
          color:rgba(255,255,255,0.5);font-size:10px;font-weight:800">5%</div>
      </div>
      <div style="color:rgba(255,255,255,0.5);font-size:11px;line-height:16.5px;margin-top:7px">거대한 상체에 머리가 어깨에 파묻혔다. 한 방에 30을 깎아 네 번이면 죽는다. 총이 아니면 도주뿐.</div>
      <div style="margin-top:10px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">추격 속도</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">5 km/h</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">배회 속도</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">3 km/h</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">감지 거리</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">50 m</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">시야각</span>
     <span style="color:#fff;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">100°</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">체력</span>
     <span style="color:#FF7D9B;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">8</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">공격력</span>
     <span style="color:#FF2E5B;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">30</span>
   </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.07)">
     <span style="color:rgba(255,255,255,0.45);font-size:10.5px;font-weight:600">특성</span>
     <span style="color:#FFC53D;font-size:12px;font-weight:800;font-variant-numeric:tabular-nums">근접 면역</span>
   </div>
      </div>
    </div>
    <div>
      <div style="color:#FF7D9B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">추격</div>
      <div style="display:flex;gap:9px"><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="39.2" ry="12.8" fill="#FF2E5B" opacity="0.34"/><ellipse rx="18.9" ry="6.2" fill="#FF2E5B" opacity="0.646"/><filter id="zbcf092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zbcf092)">
    <path d="M-7,-32 Q-12,-22 -12,-13 Q-12,-8 -14,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-32 Q13,-22 13,-13 Q13,-8 15,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-14,-4 Q-19,-2.6 -22,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-4 Q20,-2.6 23,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-19,-33 Q-23,-46 -13,-55 Q0,-59.5 13,-55 Q23,-46 19,-33 L15,-25 L11,-32 L6,-23 L0,-30.5 L-6,-23 L-11,-32 L-15,-25 Z" fill="#48302B"/>
    <path d="M7,-56 Q21,-47 18,-34 L15,-26 L12,-32 Z" fill="#2E1D1A"/>
    <path d="M-17,-51 Q-28,-44 -29,-33" stroke="#48302B" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17,-51 Q28,-44 29,-33" stroke="#48302B" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-29,-33 Q-29.5,-27 -28,-22" stroke="#8C9179" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M29,-33 Q29.5,-27 28,-22" stroke="#8C9179" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-31,-19 L-33,-15" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-27.5,-18.5 L-28,-14" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M31,-19 L33,-15" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.5,-18.5 L28,-14" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-54 Q0,-56.5 0,-58" stroke="#3E4234" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -62) scale(0.84)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#FFE3EA"/>
      <circle cx="4" cy="-4" r="1.15" fill="#FFE3EA"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">정면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="39.2" ry="12.8" fill="#FF2E5B" opacity="0.34"/><ellipse rx="18.9" ry="6.2" fill="#FF2E5B" opacity="0.646"/><filter id="zbcs092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zbcs092)">
    <path d="M5,-32 Q13,-24 16,-14 Q17,-8 20,-4" stroke="#332622" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20,-4 Q24,-2.6 27,-4" stroke="#332622" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4,-52 Q14,-44 15,-32" stroke="#2E1D1A" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-32 Q16,-25 14,-19" stroke="#3E4234" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-4,-32 Q-11,-24 -11,-14 Q-11,-8 -13,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-4 Q-18,-2.6 -22,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-34 Q-17,-46 -10,-55 Q0,-59 9,-55 Q15,-46 12,-34 L9,-26 L6,-32 L2,-24 L-2,-31 L-6,-24.5 L-10,-31 Z" fill="#48302B"/>
    <path d="M4,-56 Q14,-49 12.5,-35 L10,-27 L7.5,-32 Z" fill="#2E1D1A"/>
    <path d="M-11,-53 Q-6,-49 -2,-51.5" stroke="#2E1D1A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-9,-52 Q-22,-49 -29,-40" stroke="#48302B" stroke-width="9.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-29,-40 Q-34,-33 -33,-25" stroke="#8C9179" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-36,-22 L-40,-20" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-33.5,-21 L-35,-16.5" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-31,-21.5 L-30.5,-17" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-6,-53 Q-10,-55 -13,-56" stroke="#3E4234" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(-15 -58.5) scale(0.82)">
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.5,-1.2 3.6,-0.4 L-3.6,-1.3 Q-7.4,-2.4 -7.6,-5.8 Q-7.8,-9.2 -0.5,-10.4 Z" fill="#8C9179"/>
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.3,-2.2 5.1,-1.1 Q4.4,-4.8 1.9,-7.5 Z" fill="#5A5F4C"/>
    <path d="M-7.2,-1 Q-4.2,0 -1.4,-0.6 Q-1,4.6 -3.8,5.4 Q-6.8,5.2 -7.2,-1 Z" fill="#171A12"/>
    <path d="M-8,0.4 Q-7,7 -3,6.8 Q0.8,6.4 2.2,2 Q-2.6,3.8 -8,0.4 Z" fill="#5A5F4C"/>
    <path d="M-7.4,-4.6 Q-4.6,-5.8 -2.6,-4.4 Q-3.6,-1.2 -6.2,-1.4 Q-7.8,-2.4 -7.4,-4.6 Z" fill="#171A12"/>
    <path d="M-1.4,-4.4 Q0.4,-5.2 1.9,-4.2 Q1.2,-1.8 -0.6,-1.8 Q-1.7,-2.6 -1.4,-4.4 Z" fill="#171A12"/>
    <circle cx="-5" cy="-3.4" r="1.05" fill="#FFE3EA"/>
    <circle cx="0.3" cy="-3.2" r="0.78" fill="#FFE3EA" opacity="0.8"/>
  </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">측면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="39.2" ry="12.8" fill="#FF2E5B" opacity="0.34"/><ellipse rx="18.9" ry="6.2" fill="#FF2E5B" opacity="0.646"/><filter id="zbcb092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#FF2E5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zbcb092)">
    <path d="M-7,-32 Q-12,-22 -12,-13 Q-12,-8 -14,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-32 Q13,-22 13,-13 Q13,-8 15,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-14,-4 Q-18,-2.6 -21,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-4 Q19,-2.6 22,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-19,-33 Q-24,-47 -13,-56 Q0,-60.5 13,-56 Q24,-47 19,-33 L15,-26 L11,-32.5 L6,-24 L0,-31 L-6,-24 L-11,-32.5 L-15,-26 Z" fill="#2E1D1A"/>
    <path d="M0,-56 L0,-34" stroke="#48302B" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-17,-52 Q-29,-45 -30,-34" stroke="#2E1D1A" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17,-52 Q29,-45 30,-34" stroke="#2E1D1A" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-30,-34 Q-30.5,-28 -29,-23" stroke="#3E4234" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30,-34 Q30.5,-28 29,-23" stroke="#3E4234" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-55 Q0,-57.5 0,-59" stroke="#3E4234" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -63) scale(0.84)">
      <ellipse cx="0" cy="-4.2" rx="8.2" ry="9.3" fill="#8C9179"/>
      <path d="M-8.2,-5.6 Q-7.4,-13.4 0,-13.5 Q7.4,-13.4 8.2,-5.6 Q4,-9.2 0,-8.6 Q-4,-9.2 -8.2,-5.6 Z" fill="#5A5F4C"/>
      <path d="M-8,-2.4 Q-4,1.4 0,1.6 Q4,1.4 8,-2.4 Q6.6,3.6 0,5 Q-6.6,3.6 -8,-2.4 Z" fill="#5A5F4C"/>
      <path d="M2.6,-7.4 Q5.8,-8.2 6.8,-5.2 Q4.6,-3.2 2.2,-4.2 Z" fill="#3E4234"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">뒷모습</div>
  </div></div>
    </div>
    <div>
      <div style="color:#7CFF5B;font-size:9px;font-weight:800;letter-spacing:1.6px;margin-bottom:8px">배회</div>
      <div style="display:flex;gap:9px"><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="39.2" ry="12.8" fill="#7CFF5B" opacity="0.22"/><ellipse rx="18.9" ry="6.2" fill="#7CFF5B" opacity="0.418"/><filter id="zbrf092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zbrf092)">
    <path d="M-7,-32 Q-12,-22 -12,-13 Q-12,-8 -14,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-32 Q13,-22 13,-13 Q13,-8 15,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-14,-4 Q-19,-2.6 -22,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-4 Q20,-2.6 23,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-19,-33 Q-23,-46 -13,-55 Q0,-59.5 13,-55 Q23,-46 19,-33 L15,-25 L11,-32 L6,-23 L0,-30.5 L-6,-23 L-11,-32 L-15,-25 Z" fill="#48302B"/>
    <path d="M7,-56 Q21,-47 18,-34 L15,-26 L12,-32 Z" fill="#2E1D1A"/>
    <path d="M-17,-51 Q-28,-44 -29,-33" stroke="#48302B" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17,-51 Q28,-44 29,-33" stroke="#48302B" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-29,-33 Q-29.5,-27 -28,-22" stroke="#8C9179" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M29,-33 Q29.5,-27 28,-22" stroke="#8C9179" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-31,-19 L-33,-15" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-27.5,-18.5 L-28,-14" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M31,-19 L33,-15" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.5,-18.5 L28,-14" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-54 Q0,-56.5 0,-58" stroke="#3E4234" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -62) scale(0.84)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#DFFFCF"/>
      <circle cx="4" cy="-4" r="1.15" fill="#DFFFCF"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">정면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="39.2" ry="12.8" fill="#7CFF5B" opacity="0.22"/><ellipse rx="18.9" ry="6.2" fill="#7CFF5B" opacity="0.418"/><filter id="zbrs092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zbrs092)">
    <path d="M5,-32 Q13,-24 16,-14 Q17,-8 20,-4" stroke="#332622" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M20,-4 Q24,-2.6 27,-4" stroke="#332622" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4,-52 Q14,-44 15,-32" stroke="#2E1D1A" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-32 Q16,-25 14,-19" stroke="#3E4234" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-4,-32 Q-11,-24 -11,-14 Q-11,-8 -13,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-4 Q-18,-2.6 -22,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-34 Q-17,-46 -10,-55 Q0,-59 9,-55 Q15,-46 12,-34 L9,-26 L6,-32 L2,-24 L-2,-31 L-6,-24.5 L-10,-31 Z" fill="#48302B"/>
    <path d="M4,-56 Q14,-49 12.5,-35 L10,-27 L7.5,-32 Z" fill="#2E1D1A"/>
    <path d="M-11,-53 Q-6,-49 -2,-51.5" stroke="#2E1D1A" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-9,-52 Q-22,-49 -29,-40" stroke="#48302B" stroke-width="9.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-29,-40 Q-34,-33 -33,-25" stroke="#8C9179" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-36,-22 L-40,-20" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-33.5,-21 L-35,-16.5" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-31,-21.5 L-30.5,-17" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-6,-53 Q-10,-55 -13,-56" stroke="#3E4234" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(-15 -58.5) scale(0.82)">
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.5,-1.2 3.6,-0.4 L-3.6,-1.3 Q-7.4,-2.4 -7.6,-5.8 Q-7.8,-9.2 -0.5,-10.4 Z" fill="#8C9179"/>
    <path d="M-0.5,-10.4 Q6,-9.2 6.3,-4.2 Q6.3,-2.2 5.1,-1.1 Q4.4,-4.8 1.9,-7.5 Z" fill="#5A5F4C"/>
    <path d="M-7.2,-1 Q-4.2,0 -1.4,-0.6 Q-1,4.6 -3.8,5.4 Q-6.8,5.2 -7.2,-1 Z" fill="#171A12"/>
    <path d="M-8,0.4 Q-7,7 -3,6.8 Q0.8,6.4 2.2,2 Q-2.6,3.8 -8,0.4 Z" fill="#5A5F4C"/>
    <path d="M-7.4,-4.6 Q-4.6,-5.8 -2.6,-4.4 Q-3.6,-1.2 -6.2,-1.4 Q-7.8,-2.4 -7.4,-4.6 Z" fill="#171A12"/>
    <path d="M-1.4,-4.4 Q0.4,-5.2 1.9,-4.2 Q1.2,-1.8 -0.6,-1.8 Q-1.7,-2.6 -1.4,-4.4 Z" fill="#171A12"/>
    <circle cx="-5" cy="-3.4" r="1.05" fill="#DFFFCF"/>
    <circle cx="0.3" cy="-3.2" r="0.78" fill="#DFFFCF" opacity="0.8"/>
  </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">측면</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:5px">
    <div style="width:108px;height:132px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:10px;
      display:flex;align-items:flex-end;justify-content:center;overflow:hidden">
      <svg width="108" height="132" viewBox="-54 -116 108 132"><g transform="scale(0.92)"><ellipse rx="39.2" ry="12.8" fill="#7CFF5B" opacity="0.22"/><ellipse rx="18.9" ry="6.2" fill="#7CFF5B" opacity="0.418"/><filter id="zbrb092" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zbrb092)">
    <path d="M-7,-32 Q-12,-22 -12,-13 Q-12,-8 -14,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-32 Q13,-22 13,-13 Q13,-8 15,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-14,-4 Q-18,-2.6 -21,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-4 Q19,-2.6 22,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-19,-33 Q-24,-47 -13,-56 Q0,-60.5 13,-56 Q24,-47 19,-33 L15,-26 L11,-32.5 L6,-24 L0,-31 L-6,-24 L-11,-32.5 L-15,-26 Z" fill="#2E1D1A"/>
    <path d="M0,-56 L0,-34" stroke="#48302B" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-17,-52 Q-29,-45 -30,-34" stroke="#2E1D1A" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17,-52 Q29,-45 30,-34" stroke="#2E1D1A" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-30,-34 Q-30.5,-28 -29,-23" stroke="#3E4234" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M30,-34 Q30.5,-28 29,-23" stroke="#3E4234" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-55 Q0,-57.5 0,-59" stroke="#3E4234" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -63) scale(0.84)">
      <ellipse cx="0" cy="-4.2" rx="8.2" ry="9.3" fill="#8C9179"/>
      <path d="M-8.2,-5.6 Q-7.4,-13.4 0,-13.5 Q7.4,-13.4 8.2,-5.6 Q4,-9.2 0,-8.6 Q-4,-9.2 -8.2,-5.6 Z" fill="#5A5F4C"/>
      <path d="M-8,-2.4 Q-4,1.4 0,1.6 Q4,1.4 8,-2.4 Q6.6,3.6 0,5 Q-6.6,3.6 -8,-2.4 Z" fill="#5A5F4C"/>
      <path d="M2.6,-7.4 Q5.8,-8.2 6.8,-5.2 Q4.6,-3.2 2.2,-4.2 Z" fill="#3E4234"/>
    </g></g></g></svg>
    </div>
    <div style="color:rgba(255,255,255,0.38);font-size:9.5px;font-weight:700">뒷모습</div>
  </div></div>
    </div>
  </div>

  <div style="margin-top:22px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.1)">
    <div style="display:flex;align-items:baseline;gap:12px">
      <div style="color:#fff;font-size:18px;font-weight:800">인지 범위</div>
      <div style="color:rgba(255,255,255,0.45);font-size:12px">바라보는 방향 ± 시야각/2, 감지 거리까지. 이 안에 들어가면 발견된다.</div>
    </div>
    <div style="display:flex;gap:16px;margin-top:14px">
      <div style="display:flex;flex-direction:column;align-items:center;gap:7px">
    <div style="width:250px;height:232px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden">
      <svg width="250" height="232" viewBox="-125 -170 250 232">
        <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
          <circle cx="0" cy="0" r="37.5" fill="none"/><circle cx="0" cy="0" r="75" fill="none"/><circle cx="0" cy="0" r="112.5" fill="none"/><circle cx="0" cy="0" r="150" fill="none"/>
        </g>
        <g transform="translate(0 0)"><path d="M0,0 L-52.0,-30.0 A60,60 0 0 1 52.0,-30.0 Z" fill="#e3323220"/><path d="M0,0 L-52.0,-30.0 A60,60 0 0 1 52.0,-30.0 Z" fill="none" stroke="#e3323238" stroke-width="1.2"/></g>
        <g transform="translate(0 0)"><g transform="scale(0.62)"><ellipse rx="29.0" ry="9.5" fill="#7CFF5B" opacity="0.22"/><ellipse rx="14.0" ry="4.6" fill="#7CFF5B" opacity="0.418"/><filter id="zwrf062" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zwrf062)">
    <path d="M-4,-28 Q-7,-18 -6.5,-10 Q-6,-5 -7,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-28 Q8,-19 8,-11 Q8,-6 9,-2.5" stroke="#2E3444" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-7,-2.5 Q-11,-1.6 -13,-2.8" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9,-2.5 Q13,-1.6 15,-2.8" stroke="#2E3444" stroke-width="6.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-30 Q-13,-40 -9,-47 Q0,-50.5 9,-47 Q13,-40 11,-30 L8.5,-23 L6,-29 L3,-21.5 L0,-28.5 L-3,-22 L-6,-29 L-8.5,-23 Z" fill="#3B4258"/>
    <path d="M4,-48 Q11,-44 11.5,-33 L10.5,-26 L8,-30 Z" fill="#262C3E"/>
    <path d="M-9.5,-45 Q-16,-42 -17,-36" stroke="#3B4258" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M9.5,-45 Q16,-42 17,-36" stroke="#3B4258" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-17,-36 L-17.5,-33" stroke="#8C9179" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M17,-36 L17.5,-33" stroke="#8C9179" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-17.5" cy="-32" r="5.4" fill="#8C9179"/>
    <circle cx="17.5" cy="-32" r="5.4" fill="#8C9179"/>
    <path d="M-21,-34.5 L-24,-33" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-21.5,-32 L-25,-31.5" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M21,-34.5 L24,-33" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5,-32 L25,-31.5" stroke="#8C9179" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-46 Q0.5,-49.5 1,-51.5" stroke="#3E4234" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(1.5 -56.5) scale(1.02)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#DFFFCF"/>
      <circle cx="4" cy="-4" r="1.15" fill="#DFFFCF"/>
    </g></g></g></g>
        <text x="0" y="-68" text-anchor="middle" fill="#E35B5B" font-size="11"
          font-weight="800" font-family="Outfit, sans-serif">40m</text>
      </svg>
    </div>
    <div style="color:#fff;font-size:12px;font-weight:800">워커</div>
    <div style="color:rgba(255,255,255,0.4);font-size:10.5px;font-weight:600">120° · 40m</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:7px">
    <div style="width:250px;height:232px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden">
      <svg width="250" height="232" viewBox="-125 -170 250 232">
        <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
          <circle cx="0" cy="0" r="37.5" fill="none"/><circle cx="0" cy="0" r="75" fill="none"/><circle cx="0" cy="0" r="112.5" fill="none"/><circle cx="0" cy="0" r="150" fill="none"/>
        </g>
        <g transform="translate(0 0)"><path d="M0,0 L-86.9,-23.3 A90,90 0 0 1 86.9,-23.3 Z" fill="#e3323220"/><path d="M0,0 L-86.9,-23.3 A90,90 0 0 1 86.9,-23.3 Z" fill="none" stroke="#e3323238" stroke-width="1.2"/></g>
        <g transform="translate(0 0)"><g transform="scale(0.62)"><ellipse rx="27.5" ry="9.0" fill="#7CFF5B" opacity="0.22"/><ellipse rx="13.3" ry="4.4" fill="#7CFF5B" opacity="0.418"/><filter id="znrf062" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#znrf062)">
    <path d="M-4,-29 Q-9,-21 -11,-13 Q-12,-8 -14,-5" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M5,-29 Q8,-21 9,-14 Q9.5,-9 10,-5" stroke="#35302A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-14,-5 Q-18,-4 -20,-5.6" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-5 Q14,-4 16,-5.6" stroke="#35302A" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-11,-31 Q-13.5,-41 -9,-49 Q0,-52.5 9,-49 Q13.5,-41 11,-31 L8,-24 L5,-30 L2,-22 L-1,-29 L-4,-22.5 L-7,-30 L-9,-24 Z" fill="#4E3A2A"/>
    <path d="M4,-50 Q11.5,-45 12,-34 L10.5,-27 L8,-31 Z" fill="#32251A"/>
    <path d="M-10,-47 Q-19,-44 -21,-37" stroke="#4E3A2A" stroke-width="7.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-21.5" cy="-32.5" r="6.2" fill="#8C9179"/>
    <path d="M-25.5,-35.5 L-29,-34" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-26,-32.5 L-30,-32" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-25,-29.5 L-28.5,-27.5" stroke="#8C9179" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M10,-47 Q19,-43 22,-36" stroke="#32251A" stroke-width="6.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M22,-36 Q24,-31 22.5,-27" stroke="#3E4234" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24.5,-24.5 L26.5,-21" stroke="#3E4234" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M21.5,-24 L21.5,-20.5" stroke="#3E4234" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-48 Q0.5,-51 1,-52.5" stroke="#3E4234" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(1.5 -57) scale(0.97)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#DFFFCF"/>
      <circle cx="4" cy="-4" r="1.15" fill="#DFFFCF"/>
    </g></g></g></g>
        <text x="0" y="-98" text-anchor="middle" fill="#E35B5B" font-size="11"
          font-weight="800" font-family="Outfit, sans-serif">60m</text>
      </svg>
    </div>
    <div style="color:#fff;font-size:12px;font-weight:800">러너</div>
    <div style="color:rgba(255,255,255,0.4);font-size:10.5px;font-weight:600">150° · 60m</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:7px">
    <div style="width:250px;height:232px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden">
      <svg width="250" height="232" viewBox="-125 -170 250 232">
        <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
          <circle cx="0" cy="0" r="37.5" fill="none"/><circle cx="0" cy="0" r="75" fill="none"/><circle cx="0" cy="0" r="112.5" fill="none"/><circle cx="0" cy="0" r="150" fill="none"/>
        </g>
        <g transform="translate(0 0)"><circle cx="0" cy="0" r="135" fill="#e3323220"/><circle cx="0" cy="0" r="135" fill="none" stroke="#e3323238" stroke-width="1.2" stroke-dasharray="3 5"/></g>
        <g transform="translate(0 0)"><g transform="scale(0.62)"><ellipse rx="33.3" ry="10.9" fill="#7CFF5B" opacity="0.22"/><ellipse rx="16.1" ry="5.3" fill="#7CFF5B" opacity="0.418"/><filter id="zsrf062" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zsrf062)">
    <path d="M-7,-16 Q-13,-11 -15,-5 Q-16,-3 -18,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-16 Q14,-11 16,-5 Q17,-3 19,-2" stroke="#262E2B" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-18,-2 Q-22,-1.4 -24,-3" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M19,-2 Q23,-1.4 25,-3" stroke="#262E2B" stroke-width="5.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-13,-17 Q-17,-27 -9,-33 Q0,-36 9,-33 Q17,-27 13,-17 L10,-11 L7,-16 L3.5,-9.5 L0,-15.5 L-3.5,-10 L-7,-16 L-10,-11 Z" fill="#2F3A36"/>
    <path d="M5,-34 Q15,-28 13.5,-19 L11,-12 L8.5,-16 Z" fill="#1E2523"/>
    <path d="M-11,-31 Q-23,-26 -27,-16" stroke="#2F3A36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M11,-31 Q23,-26 27,-16" stroke="#2F3A36" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-27,-16 Q-30,-11 -30,-6" stroke="#8C9179" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M27,-16 Q30,-11 30,-6" stroke="#8C9179" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-32,-5 L-34,-1.5" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-29.5,-4.5 L-30,-0.8" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M32,-5 L34,-1.5" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M29.5,-4.5 L30,-0.8" stroke="#8C9179" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-32 Q0,-35 0,-37" stroke="#3E4234" stroke-width="4.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -41.5) scale(0.9)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#DFFFCF"/>
      <circle cx="4" cy="-4" r="1.15" fill="#DFFFCF"/>
    </g></g></g></g>
        <text x="0" y="-143" text-anchor="middle" fill="#E35B5B" font-size="11"
          font-weight="800" font-family="Outfit, sans-serif">90m</text>
      </svg>
    </div>
    <div style="color:#fff;font-size:12px;font-weight:800">스토커</div>
    <div style="color:rgba(255,255,255,0.4);font-size:10.5px;font-weight:600">전방위 · 90m</div>
  </div><div style="display:flex;flex-direction:column;align-items:center;gap:7px">
    <div style="width:250px;height:232px;background:#0E1426;border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden">
      <svg width="250" height="232" viewBox="-125 -170 250 232">
        <g stroke="rgba(255,255,255,0.05)" stroke-width="1">
          <circle cx="0" cy="0" r="37.5" fill="none"/><circle cx="0" cy="0" r="75" fill="none"/><circle cx="0" cy="0" r="112.5" fill="none"/><circle cx="0" cy="0" r="150" fill="none"/>
        </g>
        <g transform="translate(0 0)"><path d="M0,0 L-57.5,-48.2 A75,75 0 0 1 57.5,-48.2 Z" fill="#e3323220"/><path d="M0,0 L-57.5,-48.2 A75,75 0 0 1 57.5,-48.2 Z" fill="none" stroke="#e3323238" stroke-width="1.2"/></g>
        <g transform="translate(0 0)"><g transform="scale(0.62)"><ellipse rx="39.2" ry="12.8" fill="#7CFF5B" opacity="0.22"/><ellipse rx="18.9" ry="6.2" fill="#7CFF5B" opacity="0.418"/><filter id="zbrf062" x="-50%" y="-25%" width="200%" height="150%">
         <feDropShadow dx="0" dy="0" stdDeviation="2.6" flood-color="#7CFF5B" flood-opacity="0.38"/>
       </filter><g filter="url(#zbrf062)">
    <path d="M-7,-32 Q-12,-22 -12,-13 Q-12,-8 -14,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8,-32 Q13,-22 13,-13 Q13,-8 15,-4" stroke="#332622" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-14,-4 Q-19,-2.6 -22,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15,-4 Q20,-2.6 23,-4" stroke="#332622" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-19,-33 Q-23,-46 -13,-55 Q0,-59.5 13,-55 Q23,-46 19,-33 L15,-25 L11,-32 L6,-23 L0,-30.5 L-6,-23 L-11,-32 L-15,-25 Z" fill="#48302B"/>
    <path d="M7,-56 Q21,-47 18,-34 L15,-26 L12,-32 Z" fill="#2E1D1A"/>
    <path d="M-17,-51 Q-28,-44 -29,-33" stroke="#48302B" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M17,-51 Q28,-44 29,-33" stroke="#48302B" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-29,-33 Q-29.5,-27 -28,-22" stroke="#8C9179" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M29,-33 Q29.5,-27 28,-22" stroke="#8C9179" stroke-width="8.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-31,-19 L-33,-15" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-27.5,-18.5 L-28,-14" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M31,-19 L33,-15" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M27.5,-18.5 L28,-14" stroke="#8C9179" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M0,-54 Q0,-56.5 0,-58" stroke="#3E4234" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g transform="translate(0 -62) scale(0.84)">
      <path d="M-8.2,-8.4 Q0,-11.4 8.2,-8.4 Q9.8,-3.2 6.4,1.2 Q0,3.4 -6.4,1.2 Q-9.8,-3.2 -8.2,-8.4 Z" fill="#8C9179"/>
      <path d="M3.8,-10 Q9,-7 7.6,-1.2 Q5.8,1.6 3,2.4 Q6,-3.4 3.8,-10 Z" fill="#5A5F4C"/>
      <path d="M-4.4,0.2 Q0,1.4 4.4,0.2 Q3.8,6.4 0,6.8 Q-3.8,6.4 -4.4,0.2 Z" fill="#171A12"/>
      <path d="M-5.4,1.6 Q-4.2,7.4 0,7.8 Q4.2,7.4 5.4,1.6 Q0,4.2 -5.4,1.6 Z" fill="#5A5F4C"/>
      <path d="M-6.4,-5.4 Q-3.6,-6.6 -1.4,-5.2 Q-2.6,-1.8 -5.2,-2 Q-6.8,-3 -6.4,-5.4 Z" fill="#171A12"/>
      <path d="M6.4,-5.4 Q3.6,-6.6 1.4,-5.2 Q2.6,-1.8 5.2,-2 Q6.8,-3 6.4,-5.4 Z" fill="#171A12"/>
      <circle cx="-4" cy="-4" r="1.15" fill="#DFFFCF"/>
      <circle cx="4" cy="-4" r="1.15" fill="#DFFFCF"/>
    </g></g></g></g>
        <text x="0" y="-83" text-anchor="middle" fill="#E35B5B" font-size="11"
          font-weight="800" font-family="Outfit, sans-serif">50m</text>
      </svg>
    </div>
    <div style="color:#fff;font-size:12px;font-weight:800">브루트</div>
    <div style="color:rgba(255,255,255,0.4);font-size:10.5px;font-weight:600">100° · 50m</div>
  </div>
      <div style="flex-grow:1;padding-left:8px">
        <div class="eyebrow">지도 표기</div>
        <div style="color:rgba(255,255,255,0.55);font-size:11.5px;line-height:18px;margin-top:9px">
          플레이어의 파란 부채꼴과 같은 방식으로 좀비 부채꼴을 붉게 그린다. 배회 중이면 옅게, 추격 중이면 진하게 칠한다.
        </div>
        <div style="display:flex;flex-direction:column;gap:9px;margin-top:14px">
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:26px;height:14px;border-radius:3px;background:#3d8bff3d;border:1px solid #3d8bff66"></div>
            <span style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700">플레이어 · #3d8bff3d</span>
          </div>
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:26px;height:14px;border-radius:3px;background:#e3323220;border:1px solid #e3323238"></div>
            <span style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700">좀비 배회 · #e3323220</span>
          </div>
          <div style="display:flex;align-items:center;gap:9px">
            <div style="width:26px;height:14px;border-radius:3px;background:#ff2b2b3a;border:1px solid #ff2b2b66"></div>
            <span style="color:rgba(255,255,255,0.6);font-size:11px;font-weight:700">좀비 추격 · #ff2b2b3a</span>
          </div>
        </div>
        <div style="color:rgba(255,255,255,0.32);font-size:10.5px;line-height:16px;margin-top:14px">
          스토커는 시야각이 360도라 부채꼴이 아니라 원으로 그린다. 레이더에서는 0.5초 주기로 깜빡여 위치를 확신할 수 없다.
        </div>
      </div>
    </div>
  </div>
</div>
</x-dc>
</body>
</html>
