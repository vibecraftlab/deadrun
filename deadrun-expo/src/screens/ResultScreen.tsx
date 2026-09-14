import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { A, C, F, PAD, R, T } from '../ui/theme';
import { AdButton, Cta, Eyebrow, GhostButton, Glass } from '../ui/components';
import type { Snapshot } from '../game/game';

/**
 * 런 결과 화면 (design/v2 Result).
 *
 *  이번 런의 실제 기록만 보여준다. 처치 내역은 게임이 종류별로 센 값이고,
 *  배너 광고·보상 2배는 아직 없는 시스템이라 자리만 둔다.
 */

const mmss = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const todayLabel = () => {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
};

export default function ResultScreen({
  snap, onRestart, onHome,
}: {
  snap: Snapshot;
  onRestart: () => void;
  onHome: () => void;
}) {
  const avgKmh = snap.sessionSec > 0 ? (snap.distanceM / snap.sessionSec) * 3.6 : 0;

  // 많이 잡은 순서. 한 마리도 못 잡았으면 목록 자체를 숨긴다.
  const breakdown = useMemo(() => {
    const rows = Object.entries(snap.killsByType).sort((a, b) => b[1] - a[1]);
    const max = rows.length ? rows[0][1] : 0;
    return rows.map(([name, n]) => ({ name, n, pct: max > 0 ? (n / max) * 100 : 0 }));
  }, [snap.killsByType]);

  return (
    <View style={s.root}>
      <View style={s.head}>
        <Eyebrow>{todayLabel()}</Eyebrow>
        <Text style={s.title}>런 결과</Text>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Glass style={s.card} radius={R.xl}>
          <View style={s.row}>
            <View style={s.half}>
              <Text style={[T.statLabel, { color: C.cyan }]}>주행</Text>
              <Text style={s.big}>
                {(snap.distanceM / 1000).toFixed(2)}<Text style={s.bigUnit}>km</Text>
              </Text>
            </View>
            <View style={s.half}>
              <Text style={T.statLabel}>평균 속도</Text>
              <Text style={s.big}>
                {avgKmh.toFixed(1)}<Text style={s.bigUnit}>km/h</Text>
              </Text>
            </View>
          </View>

          <View style={s.hr} />

          <View style={s.row}>
            <View style={s.third}>
              <Text style={T.statLabel}>생존</Text>
              <Text style={s.mid}>{mmss(snap.sessionSec)}</Text>
            </View>
            <View style={s.third}>
              <Text style={T.statLabel}>처치</Text>
              <Text style={s.mid}>{String(snap.kills).padStart(2, '0')}</Text>
            </View>
            <View style={s.third}>
              <Text style={T.statLabel}>보급</Text>
              <Text style={[s.mid, { color: C.amber }]}>{snap.supplies}</Text>
            </View>
          </View>
        </Glass>

        {breakdown.length > 0 && (
          <Glass style={[s.card, { marginTop: 12, paddingVertical: 15, paddingHorizontal: 16 }]} radius={R.lg}>
            <Eyebrow style={{ marginBottom: 11 }}>처치 내역</Eyebrow>
            <View style={{ gap: 9 }}>
              {breakdown.map(b => (
                <View key={b.name} style={s.brRow}>
                  <Text style={s.brName}>{b.name}</Text>
                  <View style={s.brTrack}>
                    <View style={[s.brFill, { width: `${b.pct}%` }]} />
                  </View>
                  <Text style={s.brNum}>{b.n}</Text>
                </View>
              ))}
            </View>
          </Glass>
        )}

        {/* 배너 광고 자리 — 런이 끝난 뒤에만 노출한다 */}
        <View style={s.adSlot}>
          <Text style={s.adSlotTitle}>배너 광고 320×50</Text>
          <Text style={s.adSlotSub}>준비 중 — 런이 끝난 뒤에만 노출한다</Text>
        </View>
      </ScrollView>

      <View style={s.footer}>
        <AdButton label="광고 보고 보상 2배" sub="준비 중 — 아직 동작하지 않습니다" />
        <Cta label="다시 달리기" onPress={onRestart} style={{ marginTop: 10 }} />
        <GhostButton label="홈으로" onPress={onHome} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  head: { paddingTop: PAD.top, paddingHorizontal: PAD.screen },
  title: { fontFamily: F.eb, fontSize: 28, letterSpacing: -0.8, color: C.white, marginTop: 8 },

  content: { paddingTop: 18, paddingHorizontal: PAD.screen, paddingBottom: 24 },
  card: { padding: 18 },
  row: { flexDirection: 'row' },
  half: { flexGrow: 1, flexBasis: 0 },
  third: { flexGrow: 1, flexBasis: 0 },
  big: {
    fontFamily: F.eb, fontSize: 32, letterSpacing: -1, color: C.white, marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  bigUnit: { fontFamily: F.sb, fontSize: 12, color: A.t45 },
  mid: { fontFamily: F.b, fontSize: 19, color: C.white, marginTop: 3, fontVariant: ['tabular-nums'] },
  hr: { height: 1, backgroundColor: A.t09, marginVertical: 16 },

  brRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brName: { fontFamily: F.b, fontSize: 12.5, color: C.white, width: 56 },
  brTrack: { flexGrow: 1, height: 6, borderRadius: 3, backgroundColor: A.t09, overflow: 'hidden' },
  brFill: { height: 6, borderRadius: 3, backgroundColor: C.cyan },
  brNum: {
    fontFamily: F.b, fontSize: 12.5, color: A.t62, minWidth: 16,
    textAlign: 'right', fontVariant: ['tabular-nums'],
  },

  adSlot: {
    marginTop: 12, height: 64, borderRadius: 14,
    borderWidth: 1, borderColor: A.t16, borderStyle: 'dashed',
    backgroundColor: 'rgba(255,255,255,0.035)',
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  adSlotTitle: { fontFamily: F.b, fontSize: 11, color: A.t42, letterSpacing: 1.4 },
  adSlotSub: { fontFamily: F.sb, fontSize: 10, color: A.t34 },

  footer: { paddingHorizontal: PAD.screen, paddingBottom: PAD.bottom, paddingTop: 4 },
});
