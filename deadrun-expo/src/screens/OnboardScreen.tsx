import React, { useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, ScrollView, useWindowDimensions,
} from 'react-native';
import Svg, { Circle, Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { A, C, F, PAD, R, T, useSafePad } from '../ui/theme';
import { Cta, Glass } from '../ui/components';

/**
 * 안전 온보딩 (design/v2 Onboard).
 * GDD §9 안전 설계 — 첫 화면에서 안전 고지 + 확인 후 진행.
 *
 *  ※ 디자인 원본 맨 아래에는 "실내 가상 모드는 조이스틱으로 테스트" 문구가 있으나,
 *    조이스틱 모드는 이미 제거됐다(2026-09-11). 현재 동작에 맞는 문구로 바꿨다.
 */

const RULES = [
  '차도와 교차로에서는 화면을 보지 않습니다.',
  'AR 전투는 멈춰 선 상태에서만 열립니다. 달리기 시작하면 2초 뒤 자동으로 닫힙니다.',
  '차량 속도가 감지되면 게임 판정이 멈춥니다. 탈것으로 이동하지 않습니다.',
];

export default function OnboardScreen({ onDone }: { onDone: () => void }) {
  const { width } = useWindowDimensions();
  const safe = useSafePad();
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={s.root}>
      <Svg width={width} height={260} style={s.glow}>
        <Defs>
          <RadialGradient id="og" cx="50%" cy="15%" r="80%">
            <Stop offset="0" stopColor={C.glowTop} stopOpacity="0.7" />
            <Stop offset="1" stopColor={C.bg} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={260} fill="url(#og)" />
      </Svg>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>달리기 전에</Text>
        <Text style={s.lead}>
          이 게임은 실제로 밖에서 달립니다. 권한 두 가지와 안전 수칙 세 가지를 확인해 주세요.
        </Text>

        {/* 위치 권한 */}
        <Glass style={s.item} radius={R.lg}>
          <View style={[s.ico, { backgroundColor: 'rgba(47,217,255,0.13)' }]}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"
              stroke={C.cyan} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M12 21.2s7.4-6.6 7.4-11.6a7.4 7.4 0 1 0-14.8 0c0 5 7.4 11.6 7.4 11.6Z" />
              <Circle cx={12} cy={9.6} r={2.7} />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <View style={s.titleRow}>
              <Text style={T.cardTitle}>위치 권한</Text>
              <View style={[s.tag, { backgroundColor: 'rgba(47,217,255,0.15)' }]}>
                <Text style={[s.tagText, { color: C.cyan }]}>필수</Text>
              </View>
            </View>
            <Text style={s.body}>
              주변 실제 도로를 불러오고 달린 거리를 잽니다. 반경 1km가 플레이 구역이 됩니다.
            </Text>
          </View>
        </Glass>

        {/* 카메라 권한 */}
        <Glass style={s.item} radius={R.lg}>
          <View style={[s.ico, { backgroundColor: A.t07 }]}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none"
              stroke={A.t62} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M3 8.5h3.2l1.6-2.3h8.4l1.6 2.3H21v10H3z" />
              <Circle cx={12} cy={13} r={3.4} />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <View style={s.titleRow}>
              <Text style={T.cardTitle}>카메라 권한</Text>
              <View style={[s.tag, { backgroundColor: A.t09 }]}>
                <Text style={[s.tagText, { color: A.t62 }]}>나중에 가능</Text>
              </View>
            </View>
            <Text style={s.body}>
              AR 전투 뷰에서만 씁니다. 거부해도 지도 뷰로 끝까지 플레이할 수 있습니다.
            </Text>
          </View>
        </Glass>

        {/* 안전 수칙 — 글래스가 아니라 붉은 경고 패널 */}
        <View style={[s.item, s.danger]}>
          <View style={[s.ico, { backgroundColor: 'rgba(255,46,91,0.16)' }]}>
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path d="M12 3.2 22.3 20.6H1.7L12 3.2Z" fill={C.red} />
              <Rect x={10.9} y={9} width={2.2} height={6} rx={1.1} fill="#0B0F1A" />
              <Circle cx={12} cy={17.4} r={1.3} fill="#0B0F1A" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[T.cardTitle, { color: C.redSoft }]}>안전 수칙</Text>
            <View style={s.rules}>
              {RULES.map(r => (
                <View key={r} style={s.ruleRow}>
                  <View style={s.bullet} />
                  <Text style={s.ruleText}>{r}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[s.footer, { paddingBottom: safe.bottom }]}>
        <Pressable style={s.checkRow} onPress={() => setAgreed(a => !a)}>
          <View style={[s.checkbox, agreed && s.checkboxOn]}>
            {agreed && (
              <Svg width={15} height={15} viewBox="0 0 24 24" fill="none"
                stroke={C.onCyan} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round">
                <Path d="M4.5 12.5 10 18 19.5 6.5" />
              </Svg>
            )}
          </View>
          <Text style={s.checkText}>위 안전 수칙을 확인했습니다</Text>
        </Pressable>

        <Cta label="확인하고 시작" onPress={onDone} disabled={!agreed} style={{ marginTop: 13 }} />

        <Text style={s.note}>
          위치 권한을 허용해야 시작할 수 있습니다. 실외에서 하늘이 보이는 곳을 권합니다.
        </Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  glow: { position: 'absolute', top: 0, left: 0 },
  content: { paddingTop: 66, paddingHorizontal: PAD.screen, paddingBottom: 24 },

  title: { fontFamily: F.eb, fontSize: 27, letterSpacing: -0.8, color: C.white },
  lead: { fontFamily: F.r, fontSize: 12.5, lineHeight: 19, color: A.t50, marginTop: 8 },

  item: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 14, marginTop: 11,
  },
  danger: {
    backgroundColor: 'rgba(255,46,91,0.09)',
    borderWidth: 1, borderColor: 'rgba(255,46,91,0.34)', borderRadius: R.lg,
  },
  ico: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tag: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 },
  tagText: { fontFamily: F.b, fontSize: 10.5, letterSpacing: 0.3 },
  body: { fontFamily: F.r, fontSize: 11.5, lineHeight: 17, color: A.t50, marginTop: 4 },

  rules: { gap: 8, marginTop: 10 },
  ruleRow: { flexDirection: 'row', gap: 9, alignItems: 'flex-start' },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: C.red, marginTop: 6 },
  ruleText: { fontFamily: F.r, fontSize: 11.5, lineHeight: 17, color: 'rgba(255,255,255,0.78)', flex: 1 },

  footer: { paddingHorizontal: PAD.screen, paddingTop: 6 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  checkbox: {
    width: 26, height: 26, borderRadius: 8, borderWidth: 1.5, borderColor: A.t16,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: C.cyan, borderColor: C.cyan },
  checkText: { fontFamily: F.sb, fontSize: 13, color: 'rgba(255,255,255,0.82)' },
  note: { fontFamily: F.r, fontSize: 11.5, lineHeight: 17, color: A.t34, textAlign: 'center', marginTop: 13 },
});
