import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Svg, { Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { A, C, F, PAD, R , useSafePad } from '../ui/theme';
import { Eyebrow, Glass } from '../ui/components';
import {
  ADAPTIVE, adaptiveChaseKmh, loadRuns, recentAvgKmh, weekKey, weeks,
} from '../services/runRecords';
import { loadProfile } from '../services/profile';
import { Config } from '../config';

/**
 * 추격이 만든 훈련 (design/v2 Chase · 15).
 *
 *  좀비에게 쫓기는 구간이 곧 고강도 인터벌이다. 인터벌 훈련은 효과가 크지만
 *  혼자 지키기 가장 어렵다 — 언제 빨리 뛰고 언제 쉴지를 스스로 정해야 하기 때문이다.
 *  좀비가 그 결정을 대신 해준다. 그래서 이 화면은 **추격 중 속도와 평시 속도를 나눠** 보여준다.
 *
 *  Strava나 나이키는 페이스가 왜 올랐는지 모른다. 우리는 안다 (design/v2 Training §2).
 */

/** WHO 권고 주간 고강도 시간(분) */
const WHO_MIN = 75;

export default function ChaseScreen({ onBack }: { onBack: () => void }) {
  const safe = useSafePad();
  const runs = useMemo(() => loadRuns(), []);
  const w8 = useMemo(() => weeks(runs, 8), [runs]);

  // 주별 추격/평시 평균 속도 — 그 주의 거리·시간을 합쳐서 낸다
  const series = useMemo(() => w8.map(w => {
    const calmM = w.distanceM - w.chaseDistanceM;
    const calmSec = w.durationSec - w.chaseSec;
    return {
      key: w.key,
      chase: w.chaseSec > 0 ? (w.chaseDistanceM / w.chaseSec) * 3.6 : 0,
      calm: calmSec > 0 ? (calmM / calmSec) * 3.6 : 0,
      chaseMin: w.chaseSec / 60,
      hasData: w.runs > 0,
    };
  }), [w8]);

  const withData = series.filter(x => x.hasData && x.chase > 0);
  const first = withData[0];
  const last = withData[withData.length - 1];

  const prof = useMemo(() => loadProfile(), []);
  const avg4 = useMemo(() => recentAvgKmh(runs, ADAPTIVE.weeks), [runs]);
  const nextKmh = useMemo(() => {
    // 다음 주 값을 미리 보여주는 것이므로 저장하지 않고 계산만 한다
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return adaptiveChaseKmh(runs, Config.chaseSpeedRunner, prof.chaseKmh || undefined, nextWeek);
  }, [runs, prof.chaseKmh]);
  const curKmh = prof.chaseKmhWeek === weekKey(new Date()) && prof.chaseKmh > 0
    ? prof.chaseKmh : Config.chaseSpeedRunner;

  const thisWeekMin = series[series.length - 1].chaseMin;

  return (
    <View style={s.root}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Eyebrow>최근 8주</Eyebrow>
          <Text style={s.title}>추격이 만든 훈련</Text>
        </View>
        <Pressable onPress={onBack} style={s.close} hitSlop={10}>
          <Text style={s.closeTxt}>닫기</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[s.content, { paddingBottom: safe.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Text style={s.lead}>
          좀비에게 쫓기는 구간이 곧 고강도 인터벌이다. 따로 계획하지 않아도 매주 쌓인다.
        </Text>

        {withData.length === 0 ? (
          <Glass style={[s.card, { marginTop: 14 }]} radius={R.lg}>
            <Text style={s.sub}>
              아직 추격 기록이 없습니다. 한 번 쫓겨 보면 여기에 추세가 그려집니다.
            </Text>
          </Glass>
        ) : (
          <>
            {/* 주간 평균 속도 — 추격 vs 평시 */}
            <Glass style={[s.card, { marginTop: 14 }]} radius={R.xl}>
              <View style={s.rowBase}>
                <Eyebrow>주간 평균 속도</Eyebrow>
                <Text style={s.mut}>km/h</Text>
              </View>
              <SpeedChart series={series} />
              <View style={s.legend}>
                <View style={s.legendItem}>
                  <View style={[s.dot, { backgroundColor: C.red }]} />
                  <Text style={s.legendTxt}>추격 중 {last.chase.toFixed(1)}</Text>
                </View>
                <View style={s.legendItem}>
                  <View style={[s.dot, { backgroundColor: '#1795C2' }]} />
                  <Text style={s.legendTxt}>평시 {last.calm.toFixed(1)}</Text>
                </View>
              </View>
              {withData.length >= 2 && first.calm > 0 && (
                <Text style={[s.sub, { marginTop: 10 }]}>
                  {withData.length}주 동안 평시 속도가 {first.calm.toFixed(1)}에서{' '}
                  {last.calm.toFixed(1)}로 {last.calm >= first.calm ? '올랐다' : '내렸다'}.
                  추격 중 속도가 먼저 오르고 평시가 따라온다.
                </Text>
              )}
            </Glass>

            {/* 주간 고강도 시간 */}
            <Glass style={[s.card, { marginTop: 11 }]} radius={R.xl}>
              <View style={s.rowBase}>
                <Eyebrow style={{ color: C.redSoft }}>주간 고강도 시간</Eyebrow>
                <Text style={s.mut}>분</Text>
              </View>
              <IntensityChart series={series} />
              <Text style={[s.sub, { marginTop: 10 }]}>
                세계보건기구 권고는 주 {WHO_MIN}분 고강도다. 이번 주는{' '}
                {thisWeekMin.toFixed(0)}분이니 {Math.round((thisWeekMin / WHO_MIN) * 100)}% 다.
              </Text>
            </Glass>
          </>
        )}

        {/* 다음 주 난이도 — 기록이 난이도를 만든다 */}
        <Glass style={[s.card, { marginTop: 11 }]} radius={R.xl}
          borderColor="rgba(255,46,91,0.34)">
          <Eyebrow style={{ color: C.redSoft }}>다음 주 난이도</Eyebrow>
          <Text style={s.nextSpeed}>
            러너 속도 {curKmh.toFixed(1)} <Text style={s.arrow}>→</Text> {nextKmh.toFixed(1)}
            <Text style={s.unit}> km/h</Text>
          </Text>
          <Text style={[s.sub, { marginTop: 6 }]}>
            {avg4 > 0
              ? `최근 ${ADAPTIVE.weeks}주 평균 속도 ${avg4.toFixed(1)}km/h × ${ADAPTIVE.multiplier}. `
              : '아직 기록이 없어 기본값을 쓴다. '}
            항상 아슬아슬하게 도망칠 수 있는 선을 유지한다 — 주당 변화폭은 ±
            {Math.round(ADAPTIVE.maxStepPct * 100)}%로 묶는다.
          </Text>
        </Glass>

        <Text style={s.foot}>
          속도가 늘면 좀비도 빨라지니 기록을 올릴 이유가 생긴다.{'\n'}
          한동안 쉬었다 오면 좀비도 느려져서 복귀가 무섭지 않다.
        </Text>
      </ScrollView>
    </View>
  );
}

const W = 326, H = 118;

/** 추격·평시 속도 두 줄 */
function SpeedChart({ series }: { series: { chase: number; calm: number; hasData: boolean }[] }) {
  const vals = series.flatMap(x => [x.chase, x.calm]).filter(v => v > 0);
  const lo = Math.floor(Math.min(8, ...vals));
  const hi = Math.ceil(Math.max(16, ...vals));
  const px = (i: number) => (i / Math.max(1, series.length - 1)) * (W - 8) + 4;
  const py = (v: number) => H - 16 - ((v - lo) / Math.max(1, hi - lo)) * (H - 30);
  const line = (pick: (x: typeof series[number]) => number) =>
    series.map((x, i) => (pick(x) > 0 ? `${px(i)},${py(pick(x))}` : null))
      .filter(Boolean).join(' ');

  return (
    <View style={{ marginTop: 12 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {[lo, (lo + hi) / 2, hi].map(v => (
          <React.Fragment key={v}>
            <Line x1={0} y1={py(v)} x2={W} y2={py(v)} stroke="rgba(255,255,255,0.07)" />
            <SvgText x={2} y={py(v) - 3} fill="rgba(255,255,255,0.32)"
              fontSize={9} fontWeight="700" fontFamily={F.b}>{v.toFixed(0)}</SvgText>
          </React.Fragment>
        ))}
        <Polyline points={line(x => x.calm)} fill="none" stroke="#1795C2"
          strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
        <Polyline points={line(x => x.chase)} fill="none" stroke={C.red}
          strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
      </Svg>
    </View>
  );
}

/** 주간 고강도 분 막대 + WHO 권고선 */
function IntensityChart({ series }: { series: { chaseMin: number }[] }) {
  const max = Math.max(WHO_MIN, ...series.map(x => x.chaseMin));
  const bw = 26, gap = (W - bw) / Math.max(1, series.length - 1);
  const base = H - 18;
  const h = (v: number) => (v / max) * (base - 12);
  return (
    <View style={{ marginTop: 12 }}>
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Line x1={0} y1={base} x2={W} y2={base} stroke="rgba(255,255,255,0.07)" />
        {/* WHO 권고선 */}
        <Line x1={0} y1={base - h(WHO_MIN)} x2={W} y2={base - h(WHO_MIN)}
          stroke={A.t16} strokeWidth={1} strokeDasharray="4,4" />
        <SvgText x={W} y={base - h(WHO_MIN) - 4} textAnchor="end"
          fill="rgba(255,255,255,0.32)" fontSize={9} fontWeight="700" fontFamily={F.b}>
          권고 {WHO_MIN}분
        </SvgText>
        {series.map((x, i) => {
          const bh = Math.max(x.chaseMin > 0 ? 4 : 3, h(x.chaseMin));
          return (
            <Rect key={i} x={i * gap} y={base - bh} width={bw} height={bh} rx={4}
              fill={x.chaseMin > 0 ? C.red : A.t07} fillOpacity={x.chaseMin > 0 ? 0.85 : 1} />
          );
        })}
        <SvgText x={W - bw / 2} y={base + 13} textAnchor="middle"
          fill="rgba(255,255,255,0.42)" fontSize={9.5} fontWeight="800" fontFamily={F.eb}>
          {series[series.length - 1].chaseMin.toFixed(0)}분
        </SvgText>
      </Svg>
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

  content: { paddingTop: 14, paddingHorizontal: PAD.screen },
  lead: { fontFamily: F.sb, fontSize: 11.5, lineHeight: 17.5, color: A.t52 },
  card: { padding: 16 },
  rowBase: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  mut: { fontFamily: F.b, fontSize: 10.5, color: A.t42 },
  sub: { fontFamily: F.sb, fontSize: 10.5, lineHeight: 16, color: A.t42 },

  legend: { flexDirection: 'row', gap: 14, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  legendTxt: { fontFamily: F.b, fontSize: 10.5, color: A.t62 },

  nextSpeed: {
    fontFamily: F.eb, fontSize: 21, color: C.white, marginTop: 6,
    fontVariant: ['tabular-nums'],
  },
  arrow: { color: A.t42 },
  unit: { fontFamily: F.sb, fontSize: 12, color: A.t45 },

  foot: {
    fontFamily: F.r, fontSize: 11, lineHeight: 17, color: A.t34,
    textAlign: 'center', marginTop: 18,
  },
});
