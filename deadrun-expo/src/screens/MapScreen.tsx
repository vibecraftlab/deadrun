import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, PanResponder } from 'react-native';
import Svg, {
  Circle, Path, G, Defs, LinearGradient as SvgGrad, RadialGradient, Stop, Rect, Ellipse,
  Text as SvgText,
} from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import ZombieSprite from '../components/ZombieSprite';
import { Game, Snapshot } from '../game/game';
import { RoadGraph } from '../core/roadGraph';
import { Vec2 } from '../core/geo';
import { Rules } from '../core/rules';
import { Config } from '../config';
import { useHeading } from '../hooks/useHeading';
import { A, C, F, R as RAD, T, useSafePad } from '../ui/theme';
import { Glass, StatBar } from '../ui/components';

/**
 * 좀비 레이어 — 좀비 데이터는 시뮬 틱(10Hz)에서만 바뀌므로 memo로 감싸
 * 렌더 전용 프레임(30Hz)과 지도 팬 중에는 재렌더를 건너뛴다.
 */
const ZombieLayer = memo(function ZombieLayer({
  zombies, playerLayer, scanRevealActive, viewSpanM, coneL, blink, onShoot,
}: {
  zombies: Snapshot['zombies']; playerLayer: number; scanRevealActive: boolean;
  viewSpanM: number; coneL: number; blink: boolean; onShoot: (id: number) => void;
}) {
  const hitR = Math.max(10, viewSpanM * 0.045);
  return (
    <G>
      {zombies.map(z => {
        if (z.state === 'dead') return null; // 쓰러지는 중인 시체는 지도에 그리지 않는다
        if (z.stealth && !scanRevealActive && !blink) return null;
        const aggro = z.state === 'chase';
        return (
          <G key={z.id} onPress={() => onShoot(z.id)}>
            {/* 터치 히트 영역 (아이콘보다 넓게) */}
            <Circle cx={z.x} cy={-z.y} r={hitR} fill="rgba(0,0,0,0.01)" />
            {/* 인지 범위 — 실제 감지 반경·시야각 그대로 붉게 표시.
                이 안에 들어가면 발견되고, 추격 중이면 더 진하게 */}
            <FacingCone x={z.x} y={z.y} headingDeg={(z.heading * 180) / Math.PI}
              len={z.detectR} fovDeg={z.fovDeg}
              color={aggro ? '#ff2b2b3a' : '#e3323220'} />
            {z.layer !== playerLayer && (
              <Circle cx={z.x} cy={-z.y} r={10} fill="none"
                stroke="#ffffff88" strokeWidth={1.2} strokeDasharray="3,2" />
            )}
            <ZombieSprite x={z.x} y={z.y} name={z.name} state={z.state} heading={z.heading} />
          </G>
        );
      })}
    </G>
  );
});

/**
 * 시야 콘 — 좀비의 감지 조건(바라보는 방향 ± 시야각/2)을 그대로 그린다.
 * fovDeg 360이면 원(전방위 감지, 스토커). 플레이어 콘도 같은 함수를 쓴다.
 */
function FacingCone({ x, y, headingDeg, len, color, fovDeg = 74 }: {
  x: number; y: number; headingDeg: number; len: number; color: string; fovDeg?: number;
}) {
  if (fovDeg >= 360) return <Circle cx={x} cy={-y} r={len} fill={color} />;
  const half = (Math.min(fovDeg, 350) / 2) * (Math.PI / 180);
  const ex = Math.sin(half) * len;
  const ey = -Math.cos(half) * len;
  const largeArc = half > Math.PI / 2 ? 1 : 0;
  return (
    <G transform={`translate(${x}, ${-y}) rotate(${headingDeg})`}>
      <Path d={`M0,0 L${-ex.toFixed(2)},${ey.toFixed(2)} A${len},${len} 0 ${largeArc} 1 ${ex.toFixed(2)},${ey.toFixed(2)} Z`}
        fill={color} />
    </G>
  );
}

/**
 * 도로 렌더 — 엣지마다 <Line>을 만들면 도심 1km 반경에서 수천 개의 네이티브 뷰가 생겨
 * 줌·팬 때마다 전부 레이아웃되면서 제스처가 느려진다. 레이어별로 하나의 <Path>에
 * 서브패스(M…L…)로 합쳐 네이티브 뷰를 3개로 줄인다.
 */
/**
 * 건물 레이어 — 건물 1,000개를 각각 <Path>로 만들면 네이티브 뷰가 폭증한다.
 * 도로와 마찬가지로 서브패스로 합쳐 하나의 <Path>로 그린다.
 * version이 바뀔 때만 다시 만든다(로드 완료 시 1회).
 */
const Buildings = memo(function Buildings({ polys, safe }: {
  polys: Vec2[][];
  /** polys 와 같은 순서 — 안전 구역인가. 없으면 전부 일반 건물로 그린다 */
  safe: boolean[] | null;
  version: number;
}) {
  // 일반/안전 두 벌로 나눠 서브패스를 합친다 — 색이 둘뿐이라 Path도 둘이면 된다
  const [dNormal, dSafe] = useMemo(() => {
    const normal: string[] = [];
    const green: string[] = [];
    for (let i = 0; i < polys.length; i++) {
      const p = polys[i];
      if (p.length < 3) continue;
      const into = safe?.[i] ? green : normal;
      into.push(`M${p[0].x.toFixed(1)} ${(-p[0].y).toFixed(1)}`);
      for (let j = 1; j < p.length; j++)
        into.push(`L${p[j].x.toFixed(1)} ${(-p[j].y).toFixed(1)}`);
      into.push('Z');
    }
    return [normal.join(''), green.join('')];
  }, [polys, safe]);
  if (!dNormal && !dSafe) return null;
  return (
    <>
      {!!dNormal && <Path d={dNormal} fill="#151C30" stroke="#1E2740" strokeWidth={0.6} />}
      {/* 안전 구역 — 좀비가 들어오지 못하는 건물 */}
      {!!dSafe && (
        <Path d={dSafe} fill={C.green} fillOpacity={0.22}
          stroke={C.green} strokeOpacity={0.75} strokeWidth={1.1} />
      )}
    </>
  );
}, (a, b) => a.version === b.version);

/**
 * 건물 이름 — 내 주변 몇 개만 띄운다.
 *
 *  구운 타일에는 이름 있는 건물이 반경 1km에 500개쯤 들어 있다. 전부 뿌리면
 *  글자 범벅이 되고, 좀비·추격 정보라는 화면의 주인공이 묻힌다.
 *  러너에게 쓸모 있는 것은 "지금 내 옆 건물이 무엇인가"라는 방향 감각이므로
 *  가까운 것 몇 개로 충분하다.
 *
 *  겹침은 거리순으로 골라 최소 간격을 두는 것으로 처리한다 —
 *  제대로 된 충돌 회피는 이 개수에서는 과하다.
 */
const BuildingLabels = memo(function BuildingLabels({
  polys, names, center, radiusM, max, minGapM, fontM,
}: {
  polys: Vec2[][];
  names: (string | undefined)[];
  center: Vec2;
  radiusM: number;
  max: number;
  /** 라벨끼리 이만큼은 떨어뜨린다 (m) */
  minGapM: number;
  /** 글자 크기 (m 단위 — 지도와 같이 확대·축소된다) */
  fontM: number;
  version: number;
}) {
  const picked = useMemo(() => {
    const cand: { name: string; at: Vec2; d: number }[] = [];
    for (let i = 0; i < polys.length; i++) {
      const name = names[i];
      if (!name) continue;
      const poly = polys[i];
      if (poly.length < 3) continue;
      // 외곽선의 평균점 — 정확한 무게중심까지 갈 필요는 없다
      let sx = 0, sy = 0;
      for (const q of poly) { sx += q.x; sy += q.y; }
      const at = { x: sx / poly.length, y: sy / poly.length };
      const d = Math.hypot(at.x - center.x, at.y - center.y);
      if (d <= radiusM) cand.push({ name, at, d });
    }
    cand.sort((a, b) => a.d - b.d);

    const out: typeof cand = [];
    for (const c of cand) {
      if (out.length >= max) break;
      if (out.some(o => Math.hypot(o.at.x - c.at.x, o.at.y - c.at.y) < minGapM)) continue;
      out.push(c);
    }
    return out;
  }, [polys, names, center.x, center.y, radiusM, max, minGapM]);

  if (picked.length === 0) return null;
  return (
    <G>
      {picked.map(b => (
        <SvgText
          key={`${b.name}-${b.at.x.toFixed(0)}-${b.at.y.toFixed(0)}`}
          x={b.at.x}
          y={-b.at.y}
          textAnchor="middle"
          fontSize={fontM}
          fontFamily={F.sb}
          fill="rgba(255,255,255,0.5)"
        >
          {b.name}
        </SvgText>
      ))}
    </G>
  );
}, (a, b) => a.version === b.version
  && Math.hypot(a.center.x - b.center.x, a.center.y - b.center.y) < 15
  && a.radiusM === b.radiusM && a.fontM === b.fontM);

/**
 * 도로 — 보도와 차도를 나눠 그린다 (design/v2 osm-export.ts 의 3단 위계).
 *
 *  굽힌 지도(.drmp)에 highway 종류가 이미 들어 있는데 그동안 그래프를 만들며 버리고 있었다.
 *  간선은 굵고 밝게, 이면도로는 얇게, **보행로는 초록 점선**이다 —
 *  보행로는 좀비가 스폰되는 길이라 눈에 띄어야 한다.
 *  고가는 앰버로 따로 표시한다(레이어가 달라 총이 안 닿는다).
 *
 *  선 굵기는 미터 단위다. 지도가 확대·축소돼도 실제 도로 폭처럼 보이게 하려는 것이다.
 */
const Roads = memo(function Roads({ graph }: { graph: RoadGraph }) {
  const paths = useMemo(() => {
    const seg = (e: typeof graph.edges[number]) => {
      const a = graph.nodes[e.a], b = graph.nodes[e.b];
      return `M${a.x.toFixed(1)} ${(-a.y).toFixed(1)}L${b.x.toFixed(1)} ${(-b.y).toFixed(1)}`;
    };
    const arterial: string[] = [], local: string[] = [], walk: string[] = [];
    const under: string[] = [], elevated: string[] = [];
    for (const e of graph.edges) {
      if (e.layer === 1) { elevated.push(seg(e)); continue; }
      if (e.layer === -1) { under.push(seg(e)); continue; }
      (e.cls === 'arterial' ? arterial : e.cls === 'walk' ? walk : local).push(seg(e));
    }
    const join = (a: string[]) => a.join('');
    // 그리는 순서 = 아래에서 위로. 케이싱을 먼저 깔고 윗면을 덮는다
    return [
      { d: join(under), color: '#2C3450', w: 5 },
      { d: join(local), color: '#0D1428', w: 7 },
      { d: join(arterial), color: '#0D1428', w: 13 },
      { d: join(local), color: '#2A3760', w: 5 },
      { d: join(arterial), color: '#38497C', w: 10 },
      { d: join(arterial), color: '#546AB0', w: 1, dash: '6,7', opacity: 0.6 },
      // 보행로 — 좀비가 스폰되는 길
      { d: join(walk), color: C.green, w: 1.6, dash: '3,4', opacity: 0.45 },
      { d: join(elevated), color: '#0A0F1F', w: 12 },
      { d: join(elevated), color: C.amber, w: 8, opacity: 0.55 },
    ].filter(p => p.d.length > 0);
  }, [graph]);

  return (
    <G>
      {paths.map((p, i) => (
        <Path key={i} d={p.d} stroke={p.color} strokeWidth={p.w}
          strokeDasharray={p.dash} strokeOpacity={p.opacity ?? 1}
          strokeLinecap="round" strokeLinejoin="round" fill="none" />
      ))}
    </G>
  );
});

interface Props {
  game: Game;
  snap: Snapshot;
  onEnterAr: () => void;
}

export default function MapScreen({ game, snap, onEnterAr }: Props) {
  const { width, height } = useWindowDimensions();
  const safe = useSafePad();
  const [viewSpanM, setViewSpanM] = useState(180); // 화면 가로가 커버하는 미터 (기본 확대)
  const spanRef = useRef(viewSpanM);
  spanRef.current = viewSpanM;
  const p = snap.renderPos; // 렌더 보간 위치 (판정은 pose.posSnapped)
  const blink = Math.floor(Date.now() / 500) % 2 === 0; // 스토커 깜빡임
  const handleShoot = useCallback((id: number) => {
    if (game.tapShoot(id)) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [game]);

  // 팬(드래그 이동) 오프셋: 0이 아니면 플레이어 추적을 멈추고 그 지점을 봄
  const [panOff, setPanOff] = useState({ x: 0, y: 0 });
  const panOffRef = useRef(panOff);
  panOffRef.current = panOff;

  // 제스처: 한 손가락 드래그 = 지도 이동, 두 손가락 = 핀치 줌
  const gest = useRef({
    pinchActive: false, startDist: 0, startSpan: 180,
    dragStart: { x: 0, y: 0 }, usedPinch: false,
  });
  const widthRef = useRef(width);
  widthRef.current = width;
  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (e, g) =>
      e.nativeEvent.touches.length === 2 || Math.abs(g.dx) + Math.abs(g.dy) > 10,
    onPanResponderGrant: () => {
      gest.current.dragStart = panOffRef.current;
      gest.current.pinchActive = false;
      gest.current.usedPinch = false;
    },
    onPanResponderMove: (e, g) => {
      const t = e.nativeEvent.touches;
      if (t.length === 2) {
        gest.current.usedPinch = true;
        const d = Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY);
        if (!gest.current.pinchActive) {
          gest.current.pinchActive = true;
          gest.current.startDist = d;
          gest.current.startSpan = spanRef.current;
        } else if (d > 10) {
          const next = gest.current.startSpan * (gest.current.startDist / d);
          setViewSpanM(Math.max(60, Math.min(900, next)));
        }
      } else if (t.length === 1 && !gest.current.usedPinch) {
        // 드래그: 콘텐츠가 손가락을 따라오도록 뷰 중심을 반대로 이동
        const mpp = spanRef.current / widthRef.current; // meters per px
        setPanOff({
          x: gest.current.dragStart.x - g.dx * mpp,
          y: gest.current.dragStart.y + g.dy * mpp,
        });
      }
    },
    onPanResponderRelease: () => { gest.current.pinchActive = false; },
    onPanResponderTerminate: () => { gest.current.pinchActive = false; },
  }), []);
  const isPanned = Math.abs(panOff.x) > 1 || Math.abs(panOff.y) > 1;

  // 나침반 + 자이로 상보 필터 (네이버식 방향 콘).
  // 예전에는 "4° 넘게 변하면 원시 나침반 값으로 점프" 방식이라, 실내 자기 간섭에서
  // 부채꼴이 초당 14.5회 방향을 바꿨다(계측: 프레임의 44%가 3° 이상 변화).
  const headingDeg = useHeading();
  const effHeading = headingDeg; // 방향 콘은 나침반 기준
  const coneL = viewSpanM * 0.11;


  // AR 진입: 정지 잠금 상태이거나 2km/h 미만 (필터 노이즈 여유분 포함)
  const canAr = snap.pose.locked || snap.pose.speedKmh < 2;

  // 가까운 좀비 3마리 — 우하단 트래커
  const nearby = useMemo(() =>
    [...snap.zombies]
      .filter(z => z.state !== 'dead')
      .sort((a, b) => a.distM - b.distM)
      .slice(0, 3),
    [snap.zombies]);

  // 근접 위험 — 가까울수록 가장자리가 붉어진다
  const danger = snap.nearestChaserM < 60
    ? Math.min(0.34, ((60 - snap.nearestChaserM) / 60) * 0.34) : 0;

  return (
    <View style={s.root} {...panResponder.panHandlers}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}
        viewBox={`${p.x + panOff.x - viewSpanM / 2} ${-(p.y + panOff.y) - (height / width) * viewSpanM / 2} ${viewSpanM} ${(height / width) * viewSpanM}`}>
        <Defs>
          <RadialGradient id="playerGlow" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={C.cyan} stopOpacity="0.34" />
            <Stop offset="1" stopColor={C.cyan} stopOpacity="0" />
          </RadialGradient>
          <SvgGrad id="playerDot" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={C.cyanPale} />
            <Stop offset="1" stopColor={C.cyanDark} />
          </SvgGrad>
        </Defs>

        {/* 건물이 맨 아래, 그 위에 도로 */}
        {game.buildings.length > 0 && (
          <Buildings
            polys={game.buildings}
            safe={game.zoneIndex?.safe ?? null}
            // 안전 구역 색인은 건물 뒤에 만들어지므로 둘 다 재렌더 조건에 넣는다
            version={snap.buildingsVersion * 1000 + game.zoneVersion}
          />
        )}
        {game.graph && <Roads graph={game.graph} />}

        {/* 건물 이름 — 가까운 것 몇 개만 (방향 감각용) */}
        {game.buildings.length > 0 && (
          <BuildingLabels
            polys={game.buildings}
            names={game.buildingNames}
            center={p}
            radiusM={viewSpanM * 0.42}
            max={6}
            minGapM={viewSpanM * 0.13}
            fontM={viewSpanM * 0.022}
            version={snap.buildingsVersion}
          />
        )}

        {/* 레이더 링 — 점선 두 겹 (design/v2) */}
        <Circle cx={p.x} cy={-p.y} r={Rules.radarRange * 0.62} fill="none"
          stroke={C.cyan} strokeOpacity={0.22} strokeWidth={viewSpanM * 0.004}
          strokeDasharray={`${viewSpanM * 0.006},${viewSpanM * 0.02}`} />
        <Circle cx={p.x} cy={-p.y} r={Rules.radarRange} fill="none"
          stroke={C.cyan} strokeOpacity={0.13} strokeWidth={viewSpanM * 0.004}
          strokeDasharray={`${viewSpanM * 0.006},${viewSpanM * 0.02}`} />

        {/* 좀비: 인지 부채꼴 + 픽셀 아트. 탄약이 있으면 터치 = 사격(1발 즉사, 소음!) */}
        <ZombieLayer
          zombies={snap.zombies}
          playerLayer={snap.pose.layer}
          scanRevealActive={snap.scanRevealActive}
          viewSpanM={viewSpanM}
          coneL={coneL}
          blink={blink}
          onShoot={handleShoot} />

        {/* 원시 GPS 디버그 점 (.env EXPO_PUBLIC_SHOW_RAW_GPS) */}
        {snap.rawEnu && Config.showRawGps && (
          <Circle cx={snap.rawEnu.x} cy={-snap.rawEnu.y} r={2.5} fill="#ffffff66" />
        )}

        {/* 플레이어 — 글로우 · 방향 부채꼴 · 접지 그림자 · 시안 점 */}
        <Circle cx={p.x} cy={-p.y} r={viewSpanM * 0.195} fill="url(#playerGlow)" />
        <FacingCone x={p.x} y={p.y} headingDeg={effHeading} len={coneL} color={`${C.cyan}29`} />
        <Ellipse cx={p.x} cy={-p.y + viewSpanM * 0.031} rx={viewSpanM * 0.067} ry={viewSpanM * 0.021}
          fill="#000" opacity={0.4} />
        <Circle cx={p.x} cy={-p.y} r={viewSpanM * 0.038} fill="url(#playerDot)"
          stroke={C.white} strokeWidth={viewSpanM * 0.009} />
      </Svg>

      {/* 근접 위험 비네트 — 위아래 가장자리만 물들인다 */}
      {danger > 0 && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[`rgba(255,46,91,${danger})`, 'rgba(255,46,91,0)']}
            style={s.vignetteTop} />
          <LinearGradient
            colors={['rgba(255,46,91,0)', `rgba(255,46,91,${danger})`]}
            style={s.vignetteBottom} />
        </View>
      )}

      {/* 상단 스탯 바 — 지도·AR·사격·피격이 같은 자리에 쓴다 */}
      <StatBar
        style={s.statBar}
        distKm={snap.distanceM / 1000}
        avgKmh={snap.sessionSec > 0 ? (snap.distanceM / snap.sessionSec) * 3.6 : 0}
        curKmh={snap.pose.speedKmh}
        hp={snap.hp}
        hpMax={snap.maxHp}
        ammo={snap.ammo}
        ammoMax={Rules.ammoMax}
      />

      {/* 추격 경고 칩 */}
      {snap.chasing > 0 && (
        <View style={s.chipWrap} pointerEvents="none">
          <LinearGradient colors={[C.red, C.redDeep]} style={s.chip}>
            <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
              <Path d="M12 3.2 22.3 20.6H1.7L12 3.2Z" fill={C.white} />
              <Rect x={10.9} y={9} width={2.2} height={6} rx={1.1} fill={C.redDeep} />
              <Circle cx={12} cy={17.4} r={1.3} fill={C.redDeep} />
            </Svg>
            <Text style={s.chipText}>추격 {snap.chasing} · {snap.nearestChaserM.toFixed(0)}m</Text>
          </LinearGradient>
        </View>
      )}

      {/* 상태 한 줄 — 디자인엔 없지만 실외 테스트에 필요하다 */}
      <View style={s.statusLine} pointerEvents="none">
        <Text style={s.statusText} numberOfLines={1}>
          {snap.mapSource}
          {snap.pose.locked ? ' · 정지 고정' : ''}
          {snap.pose.layer !== 0 ? (snap.pose.layer > 0 ? ' · 고가' : ' · 지하') : ''}
          {snap.godMode ? ' · 무적' : ''}
        </Text>
        {snap.pose.vehicleSuspect && (
          <Text style={[s.statusText, { color: C.amber }]}>차량 속도 감지 — 판정 정지 권고</Text>
        )}
      </View>

      {/* 우측 원형 액션 */}
      <View style={s.actions}>
        <RoundBtn caption="스캔" disabled={snap.scanCooldown > 0} onPress={() => game.scan()}
          badge={snap.scanCooldown > 0 ? `${snap.scanCooldown.toFixed(0)}s` : undefined}>
          <Svg width={25} height={25} viewBox="0 0 24 24" fill="none" stroke={C.cyan} strokeWidth={2} strokeLinecap="round">
            <Circle cx={12} cy={12} r={2.4} fill={C.cyan} stroke="none" />
            <Path d="M7.2 16.8a6.8 6.8 0 0 1 0-9.6" />
            <Path d="M16.8 7.2a6.8 6.8 0 0 1 0 9.6" />
            <Path d="M4.1 19.9a11.2 11.2 0 0 1 0-15.8" opacity={0.55} />
            <Path d="M19.9 4.1a11.2 11.2 0 0 1 0 15.8" opacity={0.55} />
          </Svg>
        </RoundBtn>

        <RoundBtn caption="사격" disabled={snap.ammo <= 0} onPress={() => game.gun(null)}>
          <Svg width={25} height={25} viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Circle cx={12} cy={12} r={8} />
            <Circle cx={12} cy={12} r={2.2} fill={C.amber} stroke="none" />
            <Path d="M12 1.8v3.4M12 18.8v3.4M1.8 12h3.4M18.8 12h3.4" />
          </Svg>
        </RoundBtn>
      </View>

      {/* 좌하단 현재 위치 */}
      <Pressable style={[s.locBtn, { bottom: 132 + safe.navBar }]} onPress={() => setPanOff({ x: 0, y: 0 })}>
        <Svg width={21} height={21} viewBox="0 0 24 24" fill="none"
          stroke={isPanned ? C.cyan : C.white} strokeWidth={2} strokeLinecap="round">
          <Circle cx={12} cy={12} r={5.6} />
          <Circle cx={12} cy={12} r={1.9} fill={isPanned ? C.cyan : C.white} stroke="none" />
          <Path d="M12 1.6v3.2M12 19.2v3.2M1.6 12h3.2M19.2 12h3.2" />
        </Svg>
      </Pressable>

      {/* 줌 — 디자인엔 핀치만 있으나 한 손 조작을 위해 남긴다 */}
      <Pressable
        style={[s.zoomPill, { bottom: 190 + safe.navBar }]}
        onPress={() => setViewSpanM(v => (v < 150 ? 180 : v < 250 ? 350 : v < 500 ? 600 : 120))}
      >
        <Text style={s.zoomText}>{viewSpanM.toFixed(0)}m</Text>
      </Pressable>

      {/* 우하단 주변 개체 트래커 — 점은 상태, 글자는 타입 */}
      {nearby.length > 0 && (
        <Glass style={[s.tracker, { bottom: 128 + safe.navBar }]} radius={RAD.lg}>
          <Text style={[T.statLabel, { marginBottom: 8 }]}>주변</Text>
          {nearby.map(z => {
            const aggro = z.state === 'chase';
            return (
              <View key={z.id} style={s.trackRow}>
                <View style={[s.trackDot, { backgroundColor: aggro ? C.red : C.green }]} />
                <Text style={[s.trackName, aggro && { color: C.white }]} numberOfLines={1}>{z.name}</Text>
                <Text style={[s.trackDist, aggro && { color: C.redSoft }]}>{z.distM.toFixed(0)}m</Text>
              </View>
            );
          })}
          <View style={s.trackLegend}>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: C.red }]} />
              <Text style={s.legendText}>추격</Text>
            </View>
            <View style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: C.green }]} />
              <Text style={s.legendText}>배회</Text>
            </View>
          </View>
        </Glass>
      )}

      {/* 하단 주 액션 — AR 진입 */}
      <View style={[s.arWrap, { bottom: 38 + safe.navBar }]} pointerEvents="box-none">
        <Pressable onPress={onEnterAr} disabled={!canAr} style={[s.arRing, !canAr && { opacity: 0.4 }]}>
          <LinearGradient colors={[C.cyanLight, C.cyanDeep]} style={s.arBtn}>
            <Svg width={27} height={27} viewBox="0 0 24 24" fill="none"
              stroke={C.onCyan} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M3 8.4V5.6A2.6 2.6 0 0 1 5.6 3h2.8M15.6 3h2.8A2.6 2.6 0 0 1 21 5.6v2.8M21 15.6v2.8a2.6 2.6 0 0 1-2.6 2.6h-2.8M8.4 21H5.6A2.6 2.6 0 0 1 3 18.4v-2.8" />
              <Circle cx={12} cy={12} r={3.4} />
            </Svg>
            <Text style={s.arLabel}>AR</Text>
          </LinearGradient>
        </Pressable>
        {!canAr && <Text style={s.arHint}>멈춰야 열립니다</Text>}
      </View>

      {/* OSM 데이터 출처 표기 — ODbL 라이선스상 의무. 지우지 말 것 */}
      {game.usingOsm && (
        <View pointerEvents="none" style={[s.attrib, { bottom: 8 + safe.navBar }]}>
          <Text style={s.attribTxt}>© OpenStreetMap contributors</Text>
        </View>
      )}
    </View>
  );
}

/** 우측 원형 버튼 (design/v2 의 .rbtn) */
function RoundBtn({ children, caption, badge, disabled, onPress }: {
  children: React.ReactNode; caption: string; badge?: string;
  disabled?: boolean; onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={s.rbtnWrap}>
      <LinearGradient
        colors={['rgba(62,78,126,0.92)', 'rgba(24,32,58,0.94)']}
        style={[s.rbtn, disabled && { opacity: 0.45 }]}
      >
        {children}
      </LinearGradient>
      <Text style={s.rbtnCap}>{badge ?? caption}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // 스탯 바 — design/v2 의 좌표(top 58 / 좌우 12). AR 뷰도 같은 자리를 쓴다.
  statBar: { position: 'absolute', top: 58, left: 12, right: 12 },

  // 근접 위험 — 위아래 가장자리만 붉게 (화면 전체를 덮으면 지도가 안 보인다)
  vignetteTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 180 },
  vignetteBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 220 },

  // 추격 경고 칩 — 스탯 바 바로 아래
  chipWrap: { position: 'absolute', top: 166, left: 0, right: 0, alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 20, paddingVertical: 7, paddingLeft: 11, paddingRight: 15,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.24)',
    shadowColor: C.red, shadowOpacity: 0.38, shadowRadius: 11,
    shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  chipText: { fontFamily: F.b, fontSize: 13.5, color: C.white, letterSpacing: 0.2 },

  // 상태 한 줄 — 실외 테스트용 정보
  statusLine: { position: 'absolute', top: 212, left: 16, right: 92 },
  statusText: { fontFamily: F.r, fontSize: 10.5, color: A.t42, lineHeight: 15 },

  // 우측 원형 액션
  actions: { position: 'absolute', right: 16, top: 300, gap: 32 },
  rbtnWrap: { alignItems: 'center' },
  rbtn: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: A.t16,
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
  rbtnCap: {
    position: 'absolute', bottom: -16, fontFamily: F.b, fontSize: 9,
    color: A.t62, letterSpacing: 0.4,
  },

  // 좌하단 현재 위치
  locBtn: {
    position: 'absolute', left: 16, bottom: 132,
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(24,32,58,0.92)',
    borderWidth: 1, borderColor: A.t16,
  },

  // 줌
  zoomPill: {
    position: 'absolute', left: 16, bottom: 190,
    paddingVertical: 6, paddingHorizontal: 12, borderRadius: 14,
    backgroundColor: 'rgba(24,32,58,0.92)',
    borderWidth: 1, borderColor: A.t16,
  },
  zoomText: { fontFamily: F.b, fontSize: 11, color: A.t62, fontVariant: ['tabular-nums'] },

  // 우하단 주변 트래커
  tracker: { position: 'absolute', right: 16, bottom: 128, paddingVertical: 9, paddingHorizontal: 12 },
  trackRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  trackDot: { width: 7, height: 7, borderRadius: 4 },
  trackName: { fontFamily: F.b, fontSize: 11, color: A.t62, minWidth: 34 },
  trackDist: { fontFamily: F.b, fontSize: 11, color: A.t50, fontVariant: ['tabular-nums'] },
  trackLegend: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 1, paddingTop: 8,
    borderTopWidth: 1, borderTopColor: A.t10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontFamily: F.sb, fontSize: 9.5, color: A.t50 },

  // 하단 AR 진입
  arWrap: { position: 'absolute', bottom: 38, left: 0, right: 0, alignItems: 'center' },
  arRing: {
    width: 84, height: 84, borderRadius: 42,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(47,217,255,0.35)',
  },
  arBtn: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center', gap: 1,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
    shadowColor: '#000', shadowOpacity: 0.6, shadowRadius: 15,
    shadowOffset: { width: 0, height: 14 }, elevation: 12,
  },
  arLabel: { fontFamily: F.eb, fontSize: 9, color: C.onCyan, letterSpacing: 0.6 },
  arHint: { fontFamily: F.sb, fontSize: 10, color: A.t42, marginTop: 6 },

  // OSM 저작자 표기 (ODbL 의무)
  attrib: { position: 'absolute', left: 16, bottom: 8 },
  attribTxt: { fontFamily: F.r, fontSize: 9.5, color: A.t34 },
});
