import React, { useEffect, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, Animated, Easing, useWindowDimensions,
} from 'react-native';
import Svg, { Defs, Ellipse, Line, G, RadialGradient, Rect, Stop, LinearGradient as SvgGrad } from 'react-native-svg';
import { A, C, F, T, useSafePad } from '../ui/theme';
import { GROUND_FRAC, SPRITE_BOX, sprite } from '../components/zombieArt';

/**
 * 실행 화면 (design/v2 Splash).
 *
 *  앱이 열리자마자 잠깐 보이는 브랜드 화면이다. 여기서 하는 일은 없다 —
 *  실제 구역 로딩은 런을 시작한 뒤 LoadingScreen이 맡는다.
 *  막대는 이 화면이 떠 있는 시간을 그대로 보여준다(가짜 수치를 넣지 않는다).
 */

// 디자인 원본과 같은 배치 — 멀리 둘은 실루엣(dark), 정면 하나만 추격 색
const WALKER = sprite('walker', 'dark', 'side');
const STALKER = sprite('stalker', 'dark', 'back');
const RUNNER = sprite('runner', 'chase', 'front');

/** 디자인 캔버스 기준 크기 — 실제 화면 크기로 비례 배치한다 */
const DW = 390;
const DH = 844;

export default function SplashScreen({ holdMs = 1200 }: { holdMs?: number }) {
  const { width, height } = useWindowDimensions();
  const safe = useSafePad();
  const kx = width / DW;
  const ky = height / DH;
  const prog = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(prog, {
      toValue: 1, duration: holdMs, easing: Easing.out(Easing.cubic), useNativeDriver: false,
    }).start();
  }, [prog, holdMs]);

  const horizon = 556 * ky;

  return (
    <View style={s.root}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="sGlow" cx="50%" cy="46%" r="58%">
            <Stop offset="0" stopColor={C.glowTop} stopOpacity="1" />
            <Stop offset="1" stopColor={C.bg} stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="sRim" cx="50%" cy="50%" r="50%">
            <Stop offset="0" stopColor={C.red} stopOpacity="0.2" />
            <Stop offset="1" stopColor={C.red} stopOpacity="0" />
          </RadialGradient>
          <SvgGrad id="sFloor" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#0E1730" />
            <Stop offset="1" stopColor={C.bg} />
          </SvgGrad>
        </Defs>

        <Rect width={width} height={height} fill={C.bg} />
        <Ellipse cx={width / 2} cy={390 * ky} rx={width * 0.77} ry={300 * ky} fill="url(#sGlow)" />

        {/* 바닥 — 소실점에서 뻗는 원근선 */}
        <Rect x={0} y={horizon} width={width} height={height - horizon} fill="url(#sFloor)" />
        <G stroke="#1B2745" strokeWidth={2} opacity={0.7}>
          {[-1.58, -0.73, 0.73, 1.58].map((k, i) => (
            <Line key={i} x1={width / 2} y1={horizon} x2={width / 2 + width * k} y2={height} />
          ))}
        </G>
        <G stroke="#1B2745" strokeWidth={2} opacity={0.5}>
          {[640, 712, 812].map(y => (
            <Line key={y} x1={0} y1={y * ky} x2={width} y2={y * ky} />
          ))}
        </G>

        {/* 앞쪽만 붉게 — 여기부터 위험하다는 신호 */}
        <Ellipse cx={width / 2} cy={612 * ky} rx={width * 0.53} ry={150 * ky} fill="url(#sRim)" />
      </Svg>

      {/* 실루엣 — 멀리 둘, 정면에 하나 */}
      <ZombieImg src={WALKER} cx={84 * kx} groundY={618 * ky} h={104} opacity={0.55} />
      <ZombieImg src={STALKER} cx={308 * kx} groundY={606 * ky} h={94} opacity={0.45} />
      <ZombieImg src={RUNNER} cx={width / 2} groundY={676 * ky} h={168} opacity={0.95} />

      <View style={[s.head, { top: 236 * ky }]}>
        <Text style={s.title}>DEADRUN</Text>
        <View style={s.tagWrap}>
          <View style={s.tagDot} />
          <Text style={s.tagText}>진짜로 달려야 산다</Text>
        </View>
      </View>

      <View style={[s.footer, { bottom: 84 + safe.navBar }]}>
        <Text style={[T.eyebrow, { textAlign: 'center' }]}>시작 준비</Text>
        <View style={s.track}>
          <Animated.View
            style={[s.fill, {
              width: prog.interpolate({ inputRange: [0, 1], outputRange: ['4%', '100%'] }),
            }]}
          />
        </View>
        <Text style={s.caption}>실외에서 하늘이 보이는 곳을 권합니다</Text>
      </View>
    </View>
  );
}

/** 스프라이트 상자 안에서 발이 어디인지 알고 있으므로, 지면선에 맞춰 세운다 */
function ZombieImg({
  src, cx, groundY, h, opacity,
}: { src: number; cx: number; groundY: number; h: number; opacity: number }) {
  const w = h * (SPRITE_BOX.w / SPRITE_BOX.h);
  return (
    <Image
      source={src}
      style={[s.z, { left: cx - w / 2, top: groundY - h * GROUND_FRAC, width: w, height: h, opacity }]}
      resizeMode="contain"
    />
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  z: { position: 'absolute' },

  head: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  title: {
    fontFamily: F.eb, fontSize: 62, lineHeight: 66, letterSpacing: -1.5, color: C.white,
    textShadowColor: 'rgba(47,217,255,0.34)', textShadowRadius: 44, textShadowOffset: { width: 0, height: 0 },
  },
  tagWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16,
    backgroundColor: 'rgba(255,46,91,0.14)',
    borderWidth: 1, borderColor: 'rgba(255,46,91,0.42)',
    borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14,
  },
  tagDot: {
    width: 6, height: 6, borderRadius: 3, backgroundColor: C.red,
    shadowColor: C.red, shadowOpacity: 0.9, shadowRadius: 8, shadowOffset: { width: 0, height: 0 },
  },
  tagText: { fontFamily: F.b, fontSize: 12, color: C.redSoft, letterSpacing: 1.5 },

  footer: { position: 'absolute', bottom: 84, left: 44, right: 44 },
  track: {
    height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 12, overflow: 'hidden',
  },
  fill: {
    height: 6, borderRadius: 3, backgroundColor: C.cyan,
    shadowColor: C.cyan, shadowOpacity: 0.6, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
  },
  caption: { fontFamily: F.sb, fontSize: 11, color: A.t42, textAlign: 'center', marginTop: 11 },
});
