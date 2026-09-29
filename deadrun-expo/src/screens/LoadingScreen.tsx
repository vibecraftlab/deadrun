import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, useWindowDimensions } from 'react-native';
import Svg, { Circle, Defs, Line, Path, RadialGradient, Stop, LinearGradient as SvgGrad } from 'react-native-svg';
import { A, C, F, useSafePad } from '../ui/theme';
import { Bar } from '../ui/components';
import type { LoadStep } from '../game/game';

/**
 * 구역 스캔 화면 (design/v2 Loading).
 *
 *  레이더가 도는 동안 실제 로딩 단계가 하나씩 체크된다.
 *  체크리스트 수치는 게임이 채운 실제 값이다 — 꾸며낸 숫자가 아니다.
 */

export default function LoadingScreen({
  steps, status, percent, source,
}: {
  steps: LoadStep[];
  status: string;
  /** 0~100. 음수면 진행률을 알 수 없는 구간이라 막대를 숨긴다 */
  percent: number;
  /** 어디서 받아오는 중인지 (주소) */
  source?: string;
}) {
  const { width, height } = useWindowDimensions();
  const safe = useSafePad();
  const cx = width / 2;
  const cy = height * 0.5;
  const spin = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true }),
    ).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 900, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ]),
    ).start();
  }, [spin, pulse]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  // 스윕 부채꼴 — 위쪽에서 시작해 시계방향 40도
  const rr = Math.min(width, height) * 0.42;
  const sweep = `M0,0 L0,${-rr} A${rr},${rr} 0 0 1 ${rr * Math.sin(0.7)},${-rr * Math.cos(0.7)} Z`;

  const doneCount = steps.filter(s => s.state === 'done').length;
  const realSteps = steps.filter(s => s.key !== 'supply');
  const stepPct = realSteps.length
    ? (realSteps.filter(s => s.state === 'done').length / realSteps.length) * 100
    : 0;

  return (
    <View style={s.root}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="lg" cx="50%" cy="50%" r="60%">
            <Stop offset="0" stopColor="#12304E" stopOpacity="0.9" />
            <Stop offset="1" stopColor={C.bg} stopOpacity="0" />
          </RadialGradient>
          <SvgGrad id="sweep" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={C.cyan} stopOpacity="0" />
            <Stop offset="1" stopColor={C.cyan} stopOpacity="0.5" />
          </SvgGrad>
        </Defs>
        <Circle cx={cx} cy={cy} r={Math.max(width, height)} fill="url(#lg)" />

        {/* 거리 링 */}
        {[0.44, 0.72, 1].map((k, i) => (
          <Circle key={i} cx={cx} cy={cy} r={rr * k} fill="none" stroke={C.cyan} strokeOpacity={0.2} />
        ))}

        {/* 중심 = 나 */}
        <Circle cx={cx} cy={cy} r={9} fill={C.cyan} />
        <Circle cx={cx} cy={cy} r={18} fill="none" stroke={C.cyan} strokeOpacity={0.45} strokeWidth={2} />
      </Svg>

      {/*
        회전하는 스윕.
        react-native-svg의 <G>는 style을 받지 않아 SVG 안에서 애니메이션할 수 없다.
        스윕만 따로 떼어 Animated.View로 감싸 돌린다 (네이티브 드라이버로 돈다).
      */}
      <Animated.View
        pointerEvents="none"
        style={[
          s.sweepLayer,
          { left: cx - rr, top: cy - rr, width: rr * 2, height: rr * 2, transform: [{ rotate }] },
        ]}
      >
        <Svg width={rr * 2} height={rr * 2}>
          <Defs>
            <SvgGrad id="sweep2" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={C.cyan} stopOpacity="0" />
              <Stop offset="1" stopColor={C.cyan} stopOpacity="0.5" />
            </SvgGrad>
          </Defs>
          <Path d={sweep} fill="url(#sweep2)" translateX={rr} translateY={rr} />
          <Line x1={rr} y1={rr} x2={rr} y2={0} stroke={C.cyan} strokeOpacity={0.75} strokeWidth={2} />
        </Svg>
      </Animated.View>

      <View style={[s.head, { top: height * 0.17 }]}>
        <Text style={s.title}>구역 스캔 중</Text>
        <Text style={s.sub}>{status || '반경 1km 도로망을 불러오고 개체를 배치합니다'}</Text>
        {!!source && <Text style={s.source}>{source}</Text>}
      </View>

      <View style={s.panel}>
        {steps.map(step => (
          <View key={step.key} style={s.stepRow}>
            <StepDot state={step.state} pulse={pulse} />
            <Text
              style={[
                s.stepLabel,
                step.state === 'done' && s.stepLabelDone,
                step.state === 'active' && s.stepLabelActive,
              ]}
              numberOfLines={1}
            >
              {step.label}
              {!!step.detail && <Text style={s.stepDetail}>{`  ${step.detail}`}</Text>}
            </Text>
          </View>
        ))}

        <View style={s.barWrap}>
          <Bar pct={percent >= 0 ? percent : stepPct} />
        </View>
        <Text style={s.barCaption}>
          {percent >= 0
            ? `${Math.round(percent)}%`
            : `${doneCount} / ${steps.length} 단계`}
        </Text>
      </View>

      <View style={[s.footer, { bottom: 52 + safe.navBar }]}>
        <Text style={s.footerText}>
          달리기 전에 주변을 한 번 둘러보세요.{'\n'}차도와 교차로에서는 화면을 보지 않습니다.
        </Text>
      </View>
    </View>
  );
}

/** 단계 표시 — 완료는 채운 원에 체크, 진행 중은 테두리가 숨쉬고, 대기는 흐린 테두리 */
function StepDot({ state, pulse }: { state: LoadStep['state']; pulse: Animated.Value }) {
  if (state === 'done') {
    return (
      <View style={[s.dot, s.dotDone]}>
        <Svg width={11} height={11} viewBox="0 0 24 24" fill="none"
          stroke={C.onCyan} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4.5 12.5 10 18 19.5 6.5" />
        </Svg>
      </View>
    );
  }
  if (state === 'active') {
    return (
      <Animated.View
        style={[
          s.dot, s.dotActive,
          { opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 1] }) },
        ]}
      />
    );
  }
  return <View style={[s.dot, s.dotPending]} />;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  sweepLayer: { position: 'absolute' },
  head: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 24 },
  title: { fontFamily: F.eb, fontSize: 26, letterSpacing: -0.5, color: C.white },
  sub: { fontFamily: F.sb, fontSize: 12.5, color: A.t50, marginTop: 8, textAlign: 'center', lineHeight: 18 },
  source: { fontFamily: F.r, fontSize: 11, color: A.t34, marginTop: 6 },

  panel: { position: 'absolute', bottom: 150, left: 34, right: 34 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 11 },
  dot: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: C.cyan },
  dotActive: { borderWidth: 2, borderColor: C.cyan },
  dotPending: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.18)' },
  stepLabel: { fontFamily: F.sb, fontSize: 13, color: A.t34, flex: 1 },
  stepLabelDone: { color: A.t62 },
  stepLabelActive: { fontFamily: F.b, color: C.white },
  stepDetail: { fontFamily: F.r, fontSize: 11.5, color: A.t34 },

  barWrap: { marginTop: 22 },
  barCaption: {
    fontFamily: F.b, fontSize: 11.5, color: C.cyan, marginTop: 7,
    textAlign: 'right', fontVariant: ['tabular-nums'],
  },

  footer: { position: 'absolute', bottom: 52, left: 34, right: 34 },
  footerText: { fontFamily: F.r, fontSize: 11.5, lineHeight: 17, color: A.t34, textAlign: 'center' },
});

