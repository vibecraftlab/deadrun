import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Image } from 'react-native';
import { A, C, F, PAD, R , useSafePad } from '../ui/theme';
import { Eyebrow, Glass } from '../ui/components';
import {
  killTotals, loadRuns, personalBests, totalDistanceM, weekStreak,
} from '../services/runRecords';
import { loadProfile } from '../services/profile';
import { ZombieTypes } from '../core/zombies';
import { artType, sprite } from '../components/zombieArt';

/**
 * 기록과 도감 (design/v2 Badges · 16).
 *
 *  달성은 **거리와 꾸준함으로만** 준다. 처치 수로 순위를 매기지 않는다 —
 *  한자리를 맴돌며 좀비만 잡는 게 최적 전략이 되면 그건 운동이 아니다
 *  (design/v2 Training "하지 않을 것").
 */

const mmss = (sec: number) => {
  const m = Math.floor(sec / 60);
  return `${String(m).padStart(2, '0')}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
};
const md = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
};

export default function BadgesScreen({ onBack }: { onBack: () => void }) {
  const safe = useSafePad();
  const runs = useMemo(() => loadRuns(), []);
  const profile = useMemo(() => loadProfile(), []);
  const pb = useMemo(() => personalBests(runs), [runs]);
  const kills = useMemo(() => killTotals(runs), [runs]);
  const totalKm = totalDistanceM(runs) / 1000;
  const streak = useMemo(
    () => weekStreak(runs, profile.weeklyGoalKm), [runs, profile.weeklyGoalKm]);
  const totalKills = Object.values(kills).reduce((a, b) => a + b, 0);

  const records: { label: string; value: string; at: string }[] = [
    {
      label: '가장 멀리 달린 런',
      value: pb.longestRunM ? `${(pb.longestRunM.value / 1000).toFixed(2)}km` : '—',
      at: pb.longestRunM ? md(pb.longestRunM.at) : '',
    },
    {
      label: '1km 최고',
      value: pb.fastestKmSec ? mmss(pb.fastestKmSec.value) : '—',
      at: pb.fastestKmSec ? md(pb.fastestKmSec.at) : '',
    },
    {
      label: '가장 오래 버틴 추격',
      value: pb.longestChaseSec ? mmss(pb.longestChaseSec.value) : '—',
      at: pb.longestChaseSec ? md(pb.longestChaseSec.at) : '',
    },
    {
      label: '한 런 최다 처치',
      value: pb.mostKills ? String(pb.mostKills.value) : '—',
      at: pb.mostKills ? md(pb.mostKills.at) : '',
    },
  ];

  // 달성 — 거리와 꾸준함만
  const badges = [
    { n: 4, unit: '주 연속', got: streak >= 4 },
    { n: 8, unit: '주 연속', got: streak >= 8 },
    { n: 100, unit: 'km 돌파', got: totalKm >= 100 },
    { n: 200, unit: 'km 돌파', got: totalKm >= 200 },
    { n: 500, unit: 'km 돌파', got: totalKm >= 500 },
  ];

  return (
    <View style={s.root}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Eyebrow>누적 {totalKm.toFixed(1)}km · {runs.length}회</Eyebrow>
          <Text style={s.title}>기록과 도감</Text>
        </View>
        <Pressable onPress={onBack} style={s.close} hitSlop={10}>
          <Text style={s.closeTxt}>닫기</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[s.content, { paddingBottom: safe.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {/* 개인 기록 */}
        <Eyebrow>개인 기록</Eyebrow>
        <Glass style={[s.card, { marginTop: 9 }]} radius={R.xl}>
          {records.map((r, i) => (
            <View key={r.label} style={[s.prRow, i > 0 && s.prDivider]}>
              <Text style={s.prLabel}>{r.label}</Text>
              <Text style={s.prValue}>{r.value}</Text>
              <Text style={s.prDate}>{r.at}</Text>
            </View>
          ))}
        </Glass>

        {/* 좀비 도감 */}
        <View style={[s.rowBase, { marginTop: 18 }]}>
          <Eyebrow>좀비 도감</Eyebrow>
          <Text style={s.mut}>누적 처치 {totalKills}</Text>
        </View>
        <Glass style={[s.card, { marginTop: 9 }]} radius={R.xl}>
          {ZombieTypes.map((t, i) => {
            const n = kills[t.name] ?? 0;
            const seen = n > 0;
            return (
              <View key={t.name} style={[s.zRow, i > 0 && s.prDivider]}>
                <Image
                  source={sprite(artType(t.name), seen ? 'roam' : 'dark', 'side')}
                  style={[s.zImg, !seen && { opacity: 0.25 }]}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={[s.zName, !seen && { color: A.t42 }]}>
                    {seen ? t.name : '???'}
                  </Text>
                  <Text style={s.zSpec}>
                    {seen
                      ? `${t.speedKmh}km/h · HP ${t.hp} · 피해 ${t.attackDmg}`
                      : '아직 처치한 적이 없다'}
                  </Text>
                </View>
                <Text style={[s.zNum, !seen && { color: A.t16 }]}>{n}</Text>
              </View>
            );
          })}
        </Glass>

        {/* 달성 */}
        <Eyebrow style={{ marginTop: 18 }}>달성</Eyebrow>
        <Text style={s.badgeNote}>
          거리와 꾸준함으로만 준다. 처치 수로는 순위를 매기지 않는다.
        </Text>
        <View style={s.badgeWrap}>
          {badges.map(b => (
            <Glass
              key={`${b.n}${b.unit}`}
              style={s.badge}
              radius={R.lg}
              borderColor={b.got ? 'rgba(47,217,255,0.4)' : undefined}
            >
              <Text style={[s.badgeNum, !b.got && { color: A.t16 }]}>{b.n}</Text>
              <Text style={[s.badgeUnit, !b.got && { color: A.t16 }]}>{b.unit}</Text>
            </Glass>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  head: {
    paddingTop: PAD.top, paddingHorizontal: PAD.screen,
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
  },
  title: { fontFamily: F.eb, fontSize: 27, letterSpacing: -0.8, color: C.white, marginTop: 6 },
  close: { paddingVertical: 6, paddingLeft: 8 },
  closeTxt: { fontFamily: F.b, fontSize: 12.5, color: A.t50 },

  content: { paddingTop: 16, paddingHorizontal: PAD.screen },
  card: { paddingVertical: 4, paddingHorizontal: 16 },
  rowBase: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  mut: { fontFamily: F.b, fontSize: 10.5, color: A.t42 },

  prRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  prDivider: { borderTopWidth: 1, borderTopColor: A.t07 },
  prLabel: { fontFamily: F.sb, fontSize: 11.5, color: A.t50, flex: 1 },
  prValue: { fontFamily: F.eb, fontSize: 15, color: C.white, fontVariant: ['tabular-nums'] },
  prDate: { fontFamily: F.sb, fontSize: 10, color: A.t34, width: 42, textAlign: 'right' },

  zRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 11 },
  zImg: { width: 34, height: 33 },
  zName: { fontFamily: F.eb, fontSize: 13, color: C.white },
  zSpec: { fontFamily: F.sb, fontSize: 10.5, color: A.t42, marginTop: 2 },
  zNum: {
    fontFamily: F.eb, fontSize: 16, color: C.cyan, minWidth: 30,
    textAlign: 'right', fontVariant: ['tabular-nums'],
  },

  badgeNote: { fontFamily: F.r, fontSize: 10.5, lineHeight: 15, color: A.t34, marginTop: 5 },
  badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 10 },
  badge: { width: 74, paddingVertical: 13, alignItems: 'center' },
  badgeNum: { fontFamily: F.eb, fontSize: 19, color: C.cyan, fontVariant: ['tabular-nums'] },
  badgeUnit: { fontFamily: F.b, fontSize: 9.5, color: A.t50, marginTop: 2 },
});
