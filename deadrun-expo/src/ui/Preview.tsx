import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { A, C, F, PAD, R, T } from './theme';
import { Bar, Cta, Divider, Eyebrow, GhostButton, Glass, Pips, StatBar } from './components';
import LoadingScreen from '../screens/LoadingScreen';
import type { LoadStep } from '../game/game';

/**
 * 디자인 토큰·공용 컴포넌트 확인용 화면.
 * 화면을 새로 만들기 전에 여기서 조각이 제대로 보이는지 본다.
 * (App에서 임시로 띄워 쓰고, 화면 작업이 끝나면 지워도 된다)
 */
/** 로딩 화면을 실제 단계 데이터로 미리 본다 */
const DEMO_STEPS: LoadStep[] = [
  { key: 'gps', label: 'GPS 신호 잡기', detail: '정확도 8m', state: 'done' },
  { key: 'map', label: '지도 내려받기', detail: '타일 4장 · 612KB', state: 'done' },
  { key: 'graph', label: '도로 그래프 구축', detail: '3,117 ways · 노드 13,010', state: 'done' },
  { key: 'spawn', label: '개체 배치', detail: '', state: 'active' },
  { key: 'supply', label: '보급 총기 배치', detail: '준비 중', state: 'pending' },
];

export default function Preview() {
  const [showLoading, setShowLoading] = React.useState(false);
  if (showLoading) {
    return (
      <View style={{ flex: 1 }}>
        <LoadingScreen steps={DEMO_STEPS} status="지도 4/4 내려받는 중 (131KB / 175KB)"
          percent={72} source="100.127.61.52:8787" />
        <View style={{ position: 'absolute', top: 44, right: 16 }}>
          <GhostButton label="닫기" onPress={() => setShowLoading(false)} />
        </View>
      </View>
    );
  }
  return (
    <ScrollView style={s.root} contentContainerStyle={s.content}>
      <Text style={T.title}>DEADRUN</Text>
      <Text style={[T.cardBody, { marginTop: 2 }]}>디자인 토큰 · 공용 컴포넌트</Text>

      <Eyebrow style={s.sec}>화면</Eyebrow>
      <GhostButton label="구역 스캔 화면 보기" onPress={() => setShowLoading(true)} style={{ marginTop: 8 }} />
      <Text style={[T.cardBody, { marginTop: 8 }]}>
        홈 · 온보딩 · 지도는 EXPO_PUBLIC_UI_PREVIEW=false 로 두고 게임을 켜면 보입니다.
      </Text>

      <Eyebrow style={s.sec}>상단 스탯 바</Eyebrow>
      <StatBar distKm={1.26} avgKmh={8.4} curKmh={11.2} hp={100} ammo={6} style={s.statbarLocal} />
      <StatBar distKm={2.81} avgKmh={9.1} curKmh={14.6} hp={22} ammo={1} style={s.statbarLocal} />

      <Eyebrow style={s.sec}>글래스 카드</Eyebrow>
      <Glass style={s.card}>
        <Eyebrow>오늘 목표</Eyebrow>
        <View style={s.goalRow}>
          <Text style={s.goalNum}>3.0</Text>
          <Text style={s.goalUnit}>km 완주</Text>
        </View>
        <Bar pct={42} />
        <Text style={[T.cardBody, { marginTop: 8 }]}>1.26km 달림 · 보상 탄약 +10</Text>
      </Glass>

      <Glass style={[s.card, s.rowCard]} radius={R.lg}>
        <View style={{ flex: 1 }}>
          <Text style={T.cardTitle}>실외 GPS 모드</Text>
          <Text style={[T.cardBody, { marginTop: 2 }]}>현재 위치 주변 실제 도로에서 달린다</Text>
        </View>
      </Glass>

      <Glass style={[s.card, s.rowCard]} radius={R.lg} borderColor="rgba(255,197,61,0.34)">
        <View style={{ flex: 1 }}>
          <Text style={[T.cardTitle, { color: C.amber }]}>광고 보고 탄약 +10으로 시작</Text>
          <Text style={[T.cardBody, { marginTop: 2 }]}>하루 3회 중 2회 남음</Text>
        </View>
      </Glass>

      <Eyebrow style={s.sec}>칸 표시 · 구분선</Eyebrow>
      <Glass style={s.card}>
        <Pips on={5} color={C.red} />
        <Pips on={3} color={C.amber} />
        <Pips on={1} color={C.cyan} />
        <View style={s.dividerRow}>
          <Text style={T.statSub}>왼쪽</Text>
          <Divider />
          <Text style={T.statSub}>오른쪽</Text>
        </View>
      </Glass>

      <Eyebrow style={s.sec}>버튼</Eyebrow>
      <Cta label="런 시작" style={{ marginTop: 8 }} />
      <GhostButton label="지난 기록" style={{ marginTop: 10 }} />
      <Cta label="비활성" disabled style={{ marginTop: 10 }} />

      <Eyebrow style={s.sec}>색</Eyebrow>
      <View style={s.swatches}>
        {([
          ['cyan', C.cyan], ['red', C.red], ['amber', C.amber],
          ['green', C.green], ['redSoft', C.redSoft], ['cyanDeep', C.cyanDeep],
        ] as const).map(([name, col]) => (
          <View key={name} style={s.swatch}>
            <View style={[s.swatchBox, { backgroundColor: col }]} />
            <Text style={s.swatchName}>{name}</Text>
            <Text style={s.swatchHex}>{col}</Text>
          </View>
        ))}
      </View>

      <Eyebrow style={s.sec}>서체 (Outfit)</Eyebrow>
      <Glass style={s.card}>
        {([
          ['Regular 400', F.r], ['Medium 500', F.m], ['SemiBold 600', F.sb],
          ['Bold 700', F.b], ['ExtraBold 800', F.eb],
        ] as const).map(([label, fam]) => (
          <Text key={label} style={{ fontFamily: fam, fontSize: 17, color: C.white, marginTop: 6 }}>
            {label} — 달려야 산다 0123
          </Text>
        ))}
      </Glass>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingTop: PAD.top, paddingHorizontal: PAD.screen, paddingBottom: PAD.bottom },
  sec: { marginTop: 26, marginBottom: 4 },
  statbarLocal: { position: 'relative', top: 0, left: 0, right: 0, marginTop: 10 },
  card: { padding: 16, marginTop: 10 },
  rowCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 15 },
  goalRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 7, marginBottom: 10 },
  goalNum: { fontFamily: F.eb, fontSize: 34, letterSpacing: -1, color: C.white },
  goalUnit: { fontFamily: F.sb, fontSize: 13, color: A.t45, marginBottom: 6 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14, height: 30 },
  swatches: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  swatch: { width: 100 },
  swatchBox: { height: 40, borderRadius: R.sm, borderWidth: 1, borderColor: A.t10 },
  swatchName: { fontFamily: F.b, fontSize: 11, color: C.white, marginTop: 5 },
  swatchHex: { fontFamily: F.r, fontSize: 10, color: A.t45 },
});
