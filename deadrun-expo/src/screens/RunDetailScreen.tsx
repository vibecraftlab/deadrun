import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Svg, { Line, Polyline, Rect, Text as SvgText } from 'react-native-svg';
import { A, C, F, PAD, R, T , useSafePad } from '../ui/theme';
import { Divider, Eyebrow, Glass } from '../ui/components';
import { RunRecord, avgKmh, calmKmh, chaseKmh } from '../services/runRecords';

/**
 * 런 상세 (design/v2 RunDetail · 14).
 *
 *  거리별 속도 그래프에서 **붉은 구간이 쫓기던 중**이다.
 *  페이스가 왜 올랐는지 아는 것이 이 앱의 차별점이라 그 구간을 그림으로 보여준다.
 */

const mmss = (sec: number) => {
  const m = Math.floor(sec / 60);
  return `${String(m).padStart(2, '0')}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
};

const dateLabel = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const dow = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  const h = d.getHours();
  const part = h < 6 ? '새벽' : h < 11 ? '아침' : h < 17 ? '낮' : h < 21 ? '저녁' : '밤';
  return {
    head: `${d.getMonth() + 1}월 ${d.getDate()}일 ${dow}요일`,
    title: `${part} 런`,
  };
};

export default function RunDetailScreen({ run, onBack }: { run: RunRecord; onBack: () => void }) {
  const safe = useSafePad();
  const label = dateLabel(run.startedAt) as { head: string; title: string };
  const splits = run.splits;
  // 구간 속도(km/h) — 1km를 sec 초에 달렸으니 3600/sec
  const paces = splits.map(sp => (sp.sec > 0 ? 3600 / sp.sec : 0));
  const maxPace = Math.max(16, ...paces);
  const minPace = Math.min(8, ...paces.filter(p => p > 0));

  const W = 326, H = 118;
  const px = (i: number) => (splits.length <= 1 ? 0 : (i / (splits.length - 1)) * W);
  const py = (v: number) => H - ((v - minPace) / Math.max(1, maxPace - minPace)) * (H - 14) - 7;

  return (
    <View style={s.root}>
      <View style={s.head}>
        <View style={{ flex: 1 }}>
          <Eyebrow>{label.head}</Eyebrow>
          <Text style={s.title}>{label.title}</Text>
        </View>
        <Pressable onPress={onBack} style={s.close} hitSlop={10}>
          <Text style={s.closeTxt}>닫기</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[s.content, { paddingBottom: safe.bottom + 24 }]} showsVerticalScrollIndicator={false}>
        <Glass style={s.card} radius={R.xl}>
          <View style={s.statRow}>
            <View style={s.cell}>
              <Text style={T.statLabel}>거리</Text>
              <Text style={s.val}>
                {(run.distanceM / 1000).toFixed(2)}<Text style={s.unit}>km</Text>
              </Text>
            </View>
            <Divider />
            <View style={s.cell}>
              <Text style={T.statLabel}>시간</Text>
              <Text style={s.val}>{mmss(run.durationSec)}</Text>
            </View>
            <Divider />
            <View style={s.cell}>
              <Text style={T.statLabel}>평균</Text>
              <Text style={s.val}>
                {avgKmh(run).toFixed(1)}<Text style={s.unit}>km/h</Text>
              </Text>
            </View>
          </View>
        </Glass>

        {/* 추격 / 평시 속도 대비 — 이 앱만 줄 수 있는 숫자 */}
        <View style={s.pair}>
          <Glass style={s.half} radius={R.lg} borderColor="rgba(255,46,91,0.34)">
            <Eyebrow style={{ color: C.redSoft }}>추격 중</Eyebrow>
            <Text style={[s.mid, { color: C.redSoft }]}>{chaseKmh(run).toFixed(1)}</Text>
            <Text style={s.sub}>km/h · {mmss(run.chaseSec)} 동안</Text>
          </Glass>
          <Glass style={s.half} radius={R.lg}>
            <Eyebrow>평시</Eyebrow>
            <Text style={s.mid}>{calmKmh(run).toFixed(1)}</Text>
            <Text style={s.sub}>km/h · 추격 {run.chaseCount}회</Text>
          </Glass>
        </View>

        {/* 거리별 속도 */}
        <Glass style={[s.card, { marginTop: 11, padding: 15 }]} radius={R.lg}>
          <View style={s.rowBase}>
            <Eyebrow>거리별 속도</Eyebrow>
            <Text style={[s.mut, { color: C.redSoft }]}>붉은 구간 = 쫓기던 중</Text>
          </View>

          {splits.length < 2 ? (
            <Text style={[s.sub, { marginTop: 10 }]}>
              1km를 채운 구간이 {splits.length}개라 그래프를 그리지 않았습니다.
            </Text>
          ) : (
            <View style={{ marginTop: 12 }}>
              <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
                {/* 쫓기던 구간을 먼저 깔아 배경으로 */}
                {splits.map((sp, i) => {
                  if (sp.chasedSec <= 0 || sp.sec <= 0) return null;
                  const frac = Math.min(1, sp.chasedSec / sp.sec);
                  const w = (W / splits.length) * frac;
                  return (
                    <Rect key={i} x={(W / splits.length) * i} y={0} width={w} height={H}
                      fill={C.red} fillOpacity={0.14} />
                  );
                })}
                {[minPace, (minPace + maxPace) / 2, maxPace].map(v => (
                  <Line key={v} x1={0} y1={py(v)} x2={W} y2={py(v)}
                    stroke="rgba(255,255,255,0.07)" />
                ))}
                <Polyline
                  points={paces.map((v, i) => `${px(i)},${py(v)}`).join(' ')}
                  fill="none" stroke={C.cyan} strokeWidth={2.5}
                  strokeLinejoin="round" strokeLinecap="round"
                />
                {[minPace, maxPace].map(v => (
                  <SvgText key={v} x={2} y={py(v) - 3} fill="rgba(255,255,255,0.42)"
                    fontSize={9} fontWeight="700" fontFamily={F.b}>
                    {v.toFixed(0)}
                  </SvgText>
                ))}
              </Svg>
              <View style={s.axis}>
                <Text style={s.mut}>0km</Text>
                <Text style={s.mut}>{(run.distanceM / 1000).toFixed(2)}km</Text>
              </View>
            </View>
          )}
        </Glass>

        {/* 구간 기록 */}
        {splits.length > 0 && (
          <Glass style={[s.card, { marginTop: 11, padding: 15 }]} radius={R.lg}>
            <Eyebrow>구간 기록</Eyebrow>
            <View style={{ marginTop: 10, gap: 8 }}>
              {splits.map(sp => {
                const chased = sp.sec > 0 ? sp.chasedSec / sp.sec : 0;
                return (
                  <View key={sp.km} style={s.splitRow}>
                    <Text style={s.splitKm}>{sp.km}km</Text>
                    <View style={s.splitTrack}>
                      <View style={[s.splitFill, { width: `${Math.round(chased * 100)}%` }]} />
                    </View>
                    <Text style={s.splitSec}>{mmss(sp.sec)}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={[s.sub, { marginTop: 10 }]}>
              막대는 그 1km 중 쫓기던 비율이다.
            </Text>
          </Glass>
        )}

        {/* 처치 내역 */}
        {run.kills > 0 && (
          <Glass style={[s.card, { marginTop: 11, padding: 15 }]} radius={R.lg}>
            <Eyebrow>처치 {run.kills}</Eyebrow>
            <Text style={[s.sub, { marginTop: 8 }]}>
              {Object.entries(run.killsByType)
                .sort((a, b) => b[1] - a[1])
                .map(([k, n]) => `${k} ${n}`).join(' · ')}
            </Text>
          </Glass>
        )}

        {!!run.deathCause && (
          <Text style={s.death}>{run.deathCause}</Text>
        )}
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
  card: { padding: 17 },
  rowBase: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  mut: { fontFamily: F.b, fontSize: 10.5, color: A.t42 },

  statRow: { flexDirection: 'row', alignItems: 'stretch' },
  cell: { flexGrow: 1, flexBasis: 0, alignItems: 'center' },
  val: {
    fontFamily: F.eb, fontSize: 24, color: C.white, marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  unit: { fontFamily: F.sb, fontSize: 11, color: A.t45 },

  pair: { flexDirection: 'row', gap: 10, marginTop: 11 },
  half: { flexGrow: 1, flexBasis: 0, padding: 14 },
  mid: {
    fontFamily: F.eb, fontSize: 24, color: C.white, marginTop: 5,
    fontVariant: ['tabular-nums'],
  },
  sub: { fontFamily: F.sb, fontSize: 10.5, color: A.t42, marginTop: 3, lineHeight: 15 },

  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },

  splitRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  splitKm: { fontFamily: F.b, fontSize: 11.5, color: A.t62, width: 34 },
  splitTrack: { flexGrow: 1, height: 6, borderRadius: 3, backgroundColor: A.t09, overflow: 'hidden' },
  splitFill: { height: 6, borderRadius: 3, backgroundColor: C.red },
  splitSec: {
    fontFamily: F.b, fontSize: 11.5, color: C.white, minWidth: 42,
    textAlign: 'right', fontVariant: ['tabular-nums'],
  },

  death: { fontFamily: F.sb, fontSize: 12, color: C.redSoft, textAlign: 'center', marginTop: 16 },
});
