import React from 'react';
import {
  View, Text, Pressable, StyleSheet, ViewStyle, TextStyle, StyleProp,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import { A, C, F, GLASS, R, SHADOW, T } from './theme';

/**
 * design/v2 의 공용 조각을 RN으로 옮긴 것.
 *
 *  웹의 backdrop-filter·linear-gradient·box-shadow는 RN에 없다.
 *   · blur  → expo-blur 의 BlurView
 *   · gradient → expo-linear-gradient
 *   · inset 하이라이트 → 위쪽에 얇은 반투명 선을 한 겹 덧댄다
 */

/** 글래스 카드 — 화면의 거의 모든 패널이 이것이다 */
export function Glass({
  children, style, radius = R.xl, borderColor, intensity = GLASS.blur,
}: {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  radius?: number;
  /** 강조 카드는 테두리 색을 바꾼다 (예: 보급 = 앰버) */
  borderColor?: string;
  intensity?: number;
}) {
  return (
    <View style={[{ borderRadius: radius }, SHADOW.card, style]}>
      <BlurView
        intensity={intensity}
        tint="dark"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, overflow: 'hidden', backgroundColor: GLASS.bg },
        ]}
      />
      {/* 테두리 + 위쪽 안쪽 하이라이트 (CSS inset shadow 대체) */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { borderRadius: radius, borderWidth: 1, borderColor: borderColor ?? GLASS.border },
        ]}
      />
      <View
        pointerEvents="none"
        style={{
          position: 'absolute', top: 1, left: radius * 0.6, right: radius * 0.6,
          height: 1, backgroundColor: A.t15,
        }}
      />
      {children}
    </View>
  );
}

/** 주 버튼 — 시안 그라데이션 */
export function Cta({
  label, onPress, icon, disabled, style,
}: {
  label: string;
  onPress?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[{ opacity: disabled ? 0.45 : 1 }, style]}>
      <LinearGradient
        colors={[C.cyanLight, C.cyanDeep]}
        style={[s.cta, SHADOW.button]}
      >
        <View pointerEvents="none" style={s.ctaHighlight} />
        {icon}
        <Text style={s.ctaLabel}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

/**
 * 광고 보상 버튼 — 앰버 그라데이션 (design/v2 Dead·Result).
 *
 *  광고 SDK는 아직 붙지 않았다. onPress를 주지 않으면 눌리지 않고 흐리게 보인다 —
 *  "되는 것처럼 보이는데 안 되는" 상태를 만들지 않으려는 것이다.
 */
export function AdButton({
  label, sub, onPress, style,
}: {
  label: string;
  sub?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const ready = !!onPress;
  return (
    <Pressable onPress={onPress} disabled={!ready} style={[{ opacity: ready ? 1 : 0.55 }, style]}>
      <LinearGradient
        colors={['rgba(255,197,61,0.97)', 'rgba(214,152,16,0.97)']}
        style={[s.ad, SHADOW.button]}
      >
        <View pointerEvents="none" style={s.ctaHighlight} />
        <View style={s.adRow}>
          <Svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke={C.amberDeep}
            strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <Path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
          </Svg>
          <Text style={s.adLabel}>{label}</Text>
        </View>
        {!!sub && <Text style={s.adSub}>{sub}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

/** 보조 버튼 — 테두리만 */
export function GhostButton({
  label, onPress, style,
}: { label: string; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable onPress={onPress} style={[s.ghost, style]}>
      <Text style={s.ghostLabel}>{label}</Text>
    </Pressable>
  );
}

/** 섹션 머리말 */
export const Eyebrow = ({ children, style }: { children: string; style?: StyleProp<TextStyle> }) => (
  <Text style={[T.eyebrow, style]}>{children}</Text>
);

/** 진행 막대 — 목표 달성률·로딩에 쓴다 */
export function Bar({
  pct, height = 6, color = C.cyan, trackColor = A.t09,
}: { pct: number; height?: number; color?: string; trackColor?: string }) {
  const w = Math.max(0, Math.min(100, pct));
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: trackColor, overflow: 'hidden' }}>
      <LinearGradient
        colors={[color, C.cyanLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: `${w}%`, height, borderRadius: height / 2 }}
      />
    </View>
  );
}

/** 칸 표시 — HP·탄약을 5칸으로 (ui.mjs 의 pips) */
export function Pips({ on, total = 5, color }: { on: number; total?: number; color: string }) {
  return (
    <View style={s.pips}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[s.pip, { backgroundColor: i < on ? color : A.t15 }]}
        />
      ))}
    </View>
  );
}

/** 세로 구분선 — 가운데만 진한 그라데이션 */
export const Divider = () => (
  <LinearGradient
    colors={['rgba(255,255,255,0)', A.t14, 'rgba(255,255,255,0)']}
    style={s.divider}
  />
);

/**
 * 상단 스탯 바 — 지도·보급·AR·사격·피격 다섯 화면이 같은 자리에 쓴다.
 * 화면이 바뀌어도 눈이 같은 곳을 보게 하려는 것이다 (design/v2 note-flow).
 */
export function StatBar({
  distKm, avgKmh, curKmh, hp, hpMax = 100, ammo, ammoMax = 30, style,
}: {
  distKm: number;
  avgKmh: number;
  curKmh: number;
  hp: number;
  hpMax?: number;
  ammo: number;
  ammoMax?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const hpPips = Math.ceil((hp / hpMax) * 5);
  const ammoPips = Math.ceil((ammo / ammoMax) * 5);
  const hpColor = hp <= hpMax * 0.3 ? C.red : C.white;
  return (
    <Glass style={[s.statBar, style]} radius={R.xl}>
      <View style={s.statRow}>
        <View style={[s.statCell, { flexGrow: 1.25 }]}>
          <Text style={[T.statLabel, { color: C.cyan }]}>주행</Text>
          <Text style={[T.statValue, s.statValueGap]}>
            {distKm.toFixed(1)}<Text style={T.statUnit}>km</Text>
          </Text>
          <Text style={[T.statSub, s.statSubGap]}>
            평균 {avgKmh.toFixed(1)} · 현재 {curKmh.toFixed(1)}
            <Text style={{ color: A.t34 }}> km/h</Text>
          </Text>
        </View>

        <Divider />

        <View style={s.statCell}>
          <Text style={[T.statLabel, { color: C.redSoft }]}>목숨</Text>
          <Text style={[T.statValue, s.statValueGap, { color: hpColor }]}>{Math.max(0, Math.round(hp))}</Text>
          <Pips on={hpPips} color={C.red} />
        </View>

        <Divider />

        <View style={s.statCell}>
          <Text style={[T.statLabel, { color: C.amber }]}>탄약</Text>
          <Text style={[T.statValue, s.statValueGap]}>{ammo}</Text>
          <Pips on={ammoPips} color={C.amber} />
        </View>
      </View>
    </Glass>
  );
}

const s = StyleSheet.create({
  cta: {
    borderRadius: R.md, paddingVertical: 17, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    borderWidth: 1, borderColor: A.t42, overflow: 'hidden',
  },
  ctaHighlight: {
    position: 'absolute', top: 1, left: 10, right: 10, height: 2,
    backgroundColor: 'rgba(255,255,255,0.45)', borderRadius: 1,
  },
  ctaLabel: { fontFamily: F.eb, fontSize: 16, color: C.onCyan },
  ad: {
    borderRadius: R.lg, paddingVertical: 15, paddingHorizontal: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.34)', overflow: 'hidden',
  },
  adRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9 },
  adLabel: { fontFamily: F.eb, fontSize: 15.5, color: C.amberDeep },
  adSub: {
    fontFamily: F.b, fontSize: 11, color: 'rgba(35,26,2,0.66)',
    textAlign: 'center', marginTop: 4,
  },
  ghost: {
    borderRadius: R.md, paddingVertical: 15, alignItems: 'center',
    backgroundColor: A.t06, borderWidth: 1, borderColor: A.t14,
  },
  ghostLabel: { fontFamily: F.b, fontSize: 14.5, color: C.white },
  pips: { flexDirection: 'row', gap: 2.5, marginTop: 8, paddingHorizontal: 10 },
  pip: { flexGrow: 1, height: 3.5, borderRadius: 2 },
  divider: { width: 1, alignSelf: 'stretch', marginVertical: 4 },
  statBar: { paddingTop: 11, paddingBottom: 12, paddingHorizontal: 6 },
  statRow: { flexDirection: 'row', alignItems: 'stretch' },
  statCell: { flexGrow: 1, flexBasis: 0, alignItems: 'center', paddingHorizontal: 4 },
  statValueGap: { marginTop: 4 },
  statSubGap: { marginTop: 3 },
});
