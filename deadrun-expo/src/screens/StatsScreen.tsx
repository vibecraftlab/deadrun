import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Svg, { Line, Rect, Text as SvgText } from 'react-native-svg';
import { A, C, F, PAD, R, T , useSafePad } from '../ui/theme';
import { Eyebrow, Glass } from '../ui/components';
import {
  RunRecord, WeekSummary, loadRuns, weekStreak, weeks,
} from '../services/runRecords';
import { loadProfile } from '../services/profile';

/**
 * 내 기록 (design/v2 Stats · 13).
 *
 *  기본 단위는 주다. 하루 목표는 못 지킨 날마다 실패를 만들지만
 *  주 목표는 남은 날로 만회할 수 있다 (design/v2 Training §1).
 *  숫자는 전부 실제 런 기록에서 계산한다 — 꾸며낸 값이 없다.
 */

const DOW = ['월', '화', '수', '목', '금', '토', '일'];

const hhmm = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}` : `${m}분`;
};
const mmss = (sec: number) => {
  const m = Math.floor(sec / 60);
  return `${String(m).padStart(2, '0')}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
};

/** 하루 거리를 4단계 색으로 — 히트맵 */
const heatColor = (km: number) =>
  km <= 0 ? 'rgba(255,255,255,0.05)'
    : km < 3 ? '#10394A'
      : km < 6 ? '#155A76' : '#2FA9D6';

export default function StatsScreen({
  onBack, onOpenRun, onOpenChase, onOpenBadges,
}: {
  onBack: () => void;
  onOpenRun: (r: RunRecord) => void;
  onOpenChase: () => void;
  onOpenBadges: () => void;
}) {
  const safe = useSafePad();
  const runs = useMemo(() => loadRuns(), []);
  const profile = useMemo(() => loadProfile(), []);
  const w8 = useMemo(() => weeks(runs, 8), [runs]);
  const cur = w8[w8.length - 1];
  const prev = w8[w8.length - 2] ?? cur;
  const streak = useMemo(
    () => weekStreak(runs, profile.weeklyGoalKm), [runs, profile.weeklyGoalKm]);

  const curKm = cur.distanceM / 1000;
  const goalPct = profile.weeklyGoalKm > 0
    ? Math.min(100, (curKm / profile.weeklyGoalKm) * 100) : 0;
  const deltaKm = (cur.distanceM - prev.distanceM) / 1000;

  const recent = useMemo(() => [...runs].reverse().slice(0, 5), [runs]);

  return (
    <View style={s.root}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Eyebrow>{monthWeekLabel(cur)}</Eyebrow>
          <Text style={s.title}>내 기록</Text>
        </View>
        {streak > 0 && (
          <View style={s.streak}>
            <Text style={s.streakNum}>{streak}</Text>
            <Text style={s.streakLabel}>주 연속{'\n'}달성</Text>
          </View>
        )}
        <Pressable onPress={onBack} style={s.close} hitSlop={10}>
          <Text style={s.closeTxt}>닫기</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[s.content, { paddingBottom: safe.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        {/* 이번 주 거리 + 요일별 막대 */}
        <Glass style={s.card} radius={R.xl}>
          <View style={s.rowBase}>
            <Eyebrow>이번 주 거리</Eyebrow>
            <Text style={s.mut}>목표 {profile.weeklyGoalKm}km</Text>
          </View>
          <View style={s.bigRow}>
            <Text style={s.big}>{curKm.toFixed(2)}</Text>
            <Text style={s.bigUnit}>km</Text>
            {runs.length > 0 && (
              <Text style={[s.delta, { color: deltaKm >= 0 ? C.green : C.redSoft }]}>
                지난주 {deltaKm >= 0 ? '+' : ''}{deltaKm.toFixed(1)}
              </Text>
            )}
          </View>
          <View style={s.track}>
            <View style={[s.fill, { width: `${goalPct}%` }]} />
          </View>
          <WeekBars daily={cur.daily} />
        </Glass>

        {/* 고강도 / 총 시간 */}
        <View style={s.pair}>
          <Glass style={s.half} radius={R.lg}>
            <Eyebrow style={{ color: C.redSoft }}>고강도 시간</Eyebrow>
            <Text style={s.mid}>{mmss(cur.chaseSec)}</Text>
            <Text style={s.sub}>좀비에게 쫓긴 시간</Text>
          </Glass>
          <Glass style={s.half} radius={R.lg}>
            <Eyebrow>총 시간</Eyebrow>
            <Text style={s.mid}>{hhmm(cur.durationSec)}</Text>
            <Text style={s.sub}>주간 누적</Text>
          </Glass>
        </View>

        {/* 최근 8주 히트맵 */}
        <Glass style={[s.card, { marginTop: 11, padding: 15 }]} radius={R.lg}>
          <View style={s.rowBase}>
            <Eyebrow>최근 8주</Eyebrow>
            <Text style={s.mut}>하루 거리</Text>
          </View>
          <View style={s.heatRow}>
            <Svg width={132} height={115} viewBox="0 0 132 115">
              {w8.map((w, wi) =>
                w.daily.map((m, di) => (
                  <Rect
                    key={`${wi}-${di}`}
                    x={wi * 17} y={di * 17} width={13} height={13} rx={3}
                    fill={heatColor(m / 1000)}
                  />
                )))}
            </Svg>
            <View style={{ gap: 5 }}>
              {([['쉼', 0], ['~3km', 1], ['~6km', 4], ['6km+', 8]] as const).map(([label, km]) => (
                <View key={label} style={s.legendRow}>
                  <View style={[s.legendDot, { backgroundColor: heatColor(km) }]} />
                  <Text style={s.legendTxt}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        </Glass>

        {/* 추격 훈련 · 도감으로 */}
        <View style={s.pair}>
          <Pressable style={{ flex: 1 }} onPress={onOpenChase}>
            <Glass style={s.linkCard} radius={R.lg}>
              <Text style={s.linkTitle}>추격이 만든 훈련</Text>
              <Text style={s.sub}>8주 추세와 다음 난이도</Text>
            </Glass>
          </Pressable>
          <Pressable style={{ flex: 1 }} onPress={onOpenBadges}>
            <Glass style={s.linkCard} radius={R.lg}>
              <Text style={s.linkTitle}>기록과 도감</Text>
              <Text style={s.sub}>개인 기록 · 좀비 도감</Text>
            </Glass>
          </Pressable>
        </View>

        {/* 최근 런 */}
        <View style={[s.rowBase, { marginTop: 16 }]}>
          <Eyebrow>최근 런</Eyebrow>
        </View>
        {recent.length === 0 ? (
          <Glass style={[s.card, { marginTop: 9, padding: 16 }]} radius={R.lg}>
            <Text style={s.sub}>아직 기록이 없습니다. 한 번 달리면 여기에 쌓입니다.</Text>
          </Glass>
        ) : recent.map(r => (
          <Pressable key={r.startedAt} onPress={() => onOpenRun(r)}>
            <Glass style={s.runRow} radius={R.lg}>
              <View style={s.runDay}>
                <Text style={s.runDayTxt}>{DOW[(new Date(r.startedAt).getDay() + 6) % 7]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.runTitle}>
                  {(r.distanceM / 1000).toFixed(2)}km · {mmss(r.durationSec)}
                </Text>
                <Text style={s.sub}>
                  추격 {r.chaseCount}회 · 처치 {r.kills}
                  {r.deathCause ? ' · 사망' : ''}
                </Text>
              </View>
              <Text style={s.chev}>›</Text>
            </Glass>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

/** 요일별 막대 — 값이 있는 날만 막대, 쉰 날은 바닥에 얇은 선 */
function WeekBars({ daily }: { daily: number[] }) {
  const max = Math.max(1, ...daily.map(m => m / 1000));
  const W = 326, H = 118, base = 96, bw = 26, gap = 50;
  return (
    <View style={{ marginTop: 14 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Line x1={0} y1={base} x2={W} y2={base} stroke="rgba(255,255,255,0.07)" />
        {daily.map((m, i) => {
          const km = m / 1000;
          const x = i * gap;
          if (km <= 0) {
            return <Rect key={i} x={x} y={base - 4} width={bw} height={4} rx={2} fill={A.t07} />;
          }
          const h = Math.max(6, (km / max) * (base - 18));
          return (
            <React.Fragment key={i}>
              <Rect x={x} y={base - h} width={bw} height={h} rx={4} fill="#1795C2" />
              <SvgText
                x={x + bw / 2} y={base - h - 7} textAnchor="middle"
                fill="rgba(255,255,255,0.82)" fontSize={9.5} fontWeight="800" fontFamily={F.eb}
              >
                {km >= 10 ? km.toFixed(0) : km.toFixed(1)}
              </SvgText>
            </React.Fragment>
          );
        })}
        {DOW.map((d, i) => (
          <SvgText
            key={d} x={i * gap + bw / 2} y={111} textAnchor="middle"
            fill="rgba(255,255,255,0.42)" fontSize={10} fontWeight="700" fontFamily={F.b}
          >
            {d}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

/** "9월 2주차" — 그 주가 속한 달의 몇 번째 주인가 */
function monthWeekLabel(w: WeekSummary): string {
  const d = new Date(w.key);
  if (isNaN(d.getTime())) return '이번 주';
  return `${d.getMonth() + 1}월 ${Math.ceil(d.getDate() / 7)}주차`;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  head: {
    paddingTop: PAD.top, paddingHorizontal: PAD.screen,
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
  },
  title: { fontFamily: F.eb, fontSize: 27, letterSpacing: -0.8, color: C.white, marginTop: 6 },
  streak: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: 'rgba(255,46,91,0.12)',
    borderWidth: 1, borderColor: 'rgba(255,46,91,0.34)',
    borderRadius: 16, paddingVertical: 7, paddingHorizontal: 13,
  },
  streakNum: { fontFamily: F.eb, fontSize: 18, color: C.redSoft, fontVariant: ['tabular-nums'] },
  streakLabel: { fontFamily: F.b, fontSize: 10.5, lineHeight: 12, color: A.t50 },
  close: { paddingVertical: 6, paddingLeft: 8 },
  closeTxt: { fontFamily: F.b, fontSize: 12.5, color: A.t50 },

  content: { paddingTop: 16, paddingHorizontal: PAD.screen },
  card: { padding: 17 },
  rowBase: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  mut: { fontFamily: F.b, fontSize: 10.5, color: A.t42 },

  bigRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 7, marginTop: 6 },
  big: {
    fontFamily: F.eb, fontSize: 36, letterSpacing: -1.2, color: C.white,
    fontVariant: ['tabular-nums'],
  },
  bigUnit: { fontFamily: F.sb, fontSize: 13, color: A.t45, marginBottom: 7 },
  delta: { marginLeft: 'auto', marginBottom: 8, fontFamily: F.eb, fontSize: 11.5 },
  track: {
    height: 5, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: 9, overflow: 'hidden',
  },
  fill: { height: 5, borderRadius: 3, backgroundColor: '#1795C2' },

  pair: { flexDirection: 'row', gap: 10, marginTop: 11 },
  half: { flexGrow: 1, flexBasis: 0, padding: 14 },
  mid: {
    fontFamily: F.eb, fontSize: 24, color: C.white, marginTop: 5,
    fontVariant: ['tabular-nums'],
  },
  sub: { fontFamily: F.sb, fontSize: 10.5, color: A.t42, marginTop: 3, lineHeight: 15 },

  heatRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 11 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  legendTxt: { fontFamily: F.b, fontSize: 9.5, color: A.t42 },

  linkCard: { padding: 14, minHeight: 68, justifyContent: 'center' },
  linkTitle: { fontFamily: F.b, fontSize: 13, color: C.white },

  runRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13, paddingHorizontal: 15, marginTop: 9,
  },
  runDay: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: 'rgba(23,149,194,0.16)',
    alignItems: 'center', justifyContent: 'center',
  },
  runDayTxt: { fontFamily: F.eb, fontSize: 13, color: '#1795C2' },
  runTitle: { fontFamily: F.eb, fontSize: 13.5, color: C.white },
  chev: { fontFamily: F.r, fontSize: 16, color: A.t42 },
});
