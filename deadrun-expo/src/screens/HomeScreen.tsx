import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, TextInput, ScrollView, useWindowDimensions,
} from 'react-native';
import Svg, { Defs, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import * as Location from 'expo-location';
import { A, C, F, PAD, R, T, useSafePad } from '../ui/theme';
import { Bar, Cta, Eyebrow, GhostButton, Glass } from '../ui/components';
import { Config } from '../config';
import { loadProfile, Profile } from '../services/profile';
import { loadRuns, totalDistanceM, weekStreak, weeks } from '../services/runRecords';

/**
 * 홈 화면 (design/v2 Home).
 *
 *  숫자는 전부 실제 값이다. 누적·오늘 거리는 기기에 저장된 기록(profile.ts)에서 읽고,
 *  아직 없는 시스템(광고 보상)은 비활성으로 표시만 한다 — 꾸며낸 값을 넣지 않는다.
 */

export interface HomeOptions {
  playerName: string;
  /** 좀비 밀도 단계 */
  density: 'low' | 'normal' | 'high';
  /** 테스트 스폰 — 주변에 몇 마리만 */
  testMode: boolean;
}

const DENSITY_MULT = { low: 0.5, normal: 1, high: 2 } as const;
export const densityToPerSqKm = (d: HomeOptions['density']) =>
  Math.round(Config.zombiesPerSqKm * DENSITY_MULT[d]);

export default function HomeScreen({
  options, onChange, onStart, onOpenStats, error,
}: {
  options: HomeOptions;
  onChange: (o: HomeOptions) => void;
  onStart: () => void;
  onOpenStats: () => void;
  error?: string | null;
}) {
  const { width } = useWindowDimensions();
  const safe = useSafePad();
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const [place, setPlace] = useState<string>('');

  // 지역 이름 — 있으면 좋고 없어도 그만이라 실패를 조용히 넘긴다
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getLastKnownPositionAsync();
        if (!loc) return;
        const [g] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude, longitude: loc.coords.longitude,
        });
        if (g) setPlace([g.district ?? g.subregion, g.street].filter(Boolean).join(' · '));
      } catch { /* 위치 이름은 없어도 된다 */ }
    })();
    setProfile(loadProfile());
  }, []);

  /*
    기본 단위는 하루가 아니라 주다 (design/v2 Training §1).
    하루 목표는 못 지킨 날마다 실패를 만들지만, 주 목표는 남은 날로 만회할 수 있다.
  */
  const runs = useMemo(() => loadRuns(), []);
  const week = useMemo(() => weeks(runs, 1)[0], [runs]);
  const streak = useMemo(
    () => weekStreak(runs, profile.weeklyGoalKm), [runs, profile.weeklyGoalKm]);
  const weekKm = week.distanceM / 1000;
  const goalPct = profile.weeklyGoalKm > 0
    ? Math.min(100, (weekKm / profile.weeklyGoalKm) * 100) : 0;
  const leftKm = Math.max(0, profile.weeklyGoalKm - weekKm);
  /** WHO 권고는 주 75분 고강도다 */
  const intensityPct = Math.round((week.chaseSec / (75 * 60)) * 100);
  const set = (patch: Partial<HomeOptions>) => onChange({ ...options, ...patch });

  return (
    <View style={s.root}>
      {/* 상단 글로우 */}
      <Svg width={width} height={300} style={s.glow}>
        <Defs>
          <RadialGradient id="hg" cx="50%" cy="20%" r="75%">
            <Stop offset="0" stopColor={C.glowTop} stopOpacity="0.85" />
            <Stop offset="1" stopColor={C.bg} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={300} fill="url(#hg)" />
      </Svg>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* 제목 + 누적 */}
        <View style={s.headRow}>
          <View style={{ flex: 1 }}>
            <Text style={T.title}>DEADRUN</Text>
            <Text style={s.place} numberOfLines={1}>
              {place || '현재 위치 주변에서 달립니다'}
            </Text>
          </View>
          <Glass style={s.totalCard} radius={R.md}>
            <Eyebrow>누적</Eyebrow>
            <Text style={s.totalNum}>
              {(totalDistanceM(runs) / 1000).toFixed(1)}<Text style={s.totalUnit}>km</Text>
            </Text>
          </Glass>
        </View>

        {/* 이번 주 목표 — 연속 기록도 주 단위로만 끊는다 */}
        <Glass style={s.goalCard}>
          <Eyebrow>{streak > 0 ? `이번 주 · ${streak}주 연속 달성 중` : '이번 주'}</Eyebrow>
          <View style={s.goalRow}>
            <Text style={s.goalNum}>{weekKm.toFixed(2)}</Text>
            <Text style={s.goalUnit}>/ {profile.weeklyGoalKm}km</Text>
            {leftKm > 0
              ? <Text style={s.goalLeft}>{leftKm.toFixed(2)}km 남음</Text>
              : <Text style={[s.goalLeft, { color: C.cyan }]}>목표 달성</Text>}
          </View>
          <Bar pct={goalPct} />
          <Text style={[T.cardBody, { marginTop: 8 }]}>
            {week.chaseSec > 0
              ? `고강도 ${Math.floor(week.chaseSec / 60)}분 ${Math.floor(week.chaseSec % 60)}초 · 주 권고 75분의 ${intensityPct}%`
              : '쫓기는 구간이 곧 고강도 인터벌이다 — 아직 이번 주 기록이 없다'}
          </Text>
        </Glass>

        {/* 러너 이름 */}
        <Glass style={s.rowCard} radius={R.lg}>
          <View style={{ flex: 1 }}>
            <Text style={T.cardTitle}>러너 이름</Text>
            <Text style={[T.cardBody, { marginTop: 2 }]}>좀비 감지 알림에 표시됩니다</Text>
          </View>
          <TextInput
            style={s.nameInput}
            value={options.playerName}
            onChangeText={t => set({ playerName: t })}
            placeholder="러너"
            placeholderTextColor={A.t34}
            maxLength={12}
          />
        </Glass>

        {/* 개체 밀도 */}
        <Glass style={s.rowCard} radius={R.lg}>
          <View style={{ flex: 1 }}>
            <Text style={T.cardTitle}>개체 밀도</Text>
            <Text style={[T.cardBody, { marginTop: 2 }]}>
              1km²당 {densityToPerSqKm(options.density)}마리 · 최대 {Config.maxZombies}
            </Text>
          </View>
          <View style={s.segs}>
            {([['low', '낮음'], ['normal', '보통'], ['high', '높음']] as const).map(([k, label]) => (
              <Pressable
                key={k}
                onPress={() => set({ density: k })}
                style={[s.seg, options.density === k && s.segOn]}
              >
                <Text style={[s.segLabel, options.density === k && s.segLabelOn]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        </Glass>

        {/* 테스트 스폰 */}
        <Glass style={s.rowCard} radius={R.lg}>
          <View style={{ flex: 1 }}>
            <Text style={T.cardTitle}>테스트 모드</Text>
            <Text style={[T.cardBody, { marginTop: 2 }]}>
              주변 {Config.testSpawnDistanceM}m에 {Config.testZombieCount}마리만 두고 전부 나를 향해 온다
            </Text>
          </View>
          <Toggle on={options.testMode} onPress={() => set({ testMode: !options.testMode })} />
        </Glass>

        {/* 광고 보상 — 아직 없는 시스템, 표시만 */}
        <Glass style={[s.rowCard, s.adCard]} radius={R.lg} borderColor="rgba(255,197,61,0.34)">
          <View style={s.adIcon}>
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none"
              stroke={C.amber} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </Svg>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[T.cardTitle, { color: C.amber }]}>광고 보고 탄약 +10으로 시작</Text>
            <Text style={[T.cardBody, { marginTop: 2 }]}>준비 중 — 아직 동작하지 않습니다</Text>
          </View>
        </Glass>

        {Config.godMode && (
          <Glass style={[s.rowCard, { paddingVertical: 10 }]} radius={R.lg} borderColor="rgba(255,46,91,0.3)">
            <Text style={[T.cardBody, { color: C.redSoft }]}>
              무적 모드 켜짐 — .env EXPO_PUBLIC_GOD_MODE
            </Text>
          </Glass>
        )}

        {!!error && <Text style={s.error}>{error}</Text>}
      </ScrollView>

      <View style={[s.footer, { bottom: safe.bottom }]}>
        <Cta label="런 시작" onPress={onStart} />
        <GhostButton label="내 기록 보기" onPress={onOpenStats} style={{ marginTop: 10 }} />
      </View>
    </View>
  );
}

/** 켜짐/꺼짐 스위치 — 디자인의 알약 모양 */
function Toggle({ on, onPress }: { on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.toggle, on && s.toggleOn]}>
      <View style={[s.knob, on && s.knobOn]} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  glow: { position: 'absolute', top: 0, left: 0 },
  content: { paddingTop: PAD.top, paddingHorizontal: PAD.screen, paddingBottom: 190 },

  headRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  place: { fontFamily: F.sb, fontSize: 12, color: A.t50, marginTop: 2 },
  totalCard: { paddingVertical: 8, paddingHorizontal: 12, alignItems: 'flex-end' },
  totalNum: {
    fontFamily: F.eb, fontSize: 17, color: C.cyan, marginTop: 2,
    fontVariant: ['tabular-nums'],
  },
  totalUnit: { fontFamily: F.sb, fontSize: 10, color: A.t45 },

  goalCard: { padding: 16, marginTop: 22 },
  goalRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 7, marginBottom: 10 },
  goalNum: { fontFamily: F.eb, fontSize: 34, letterSpacing: -1, color: C.white },
  goalUnit: { fontFamily: F.sb, fontSize: 13, color: A.t45, marginBottom: 6 },
  goalLeft: {
    marginLeft: 'auto', marginBottom: 7,
    fontFamily: F.eb, fontSize: 11.5, color: C.green,
  },

  rowCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 13, paddingHorizontal: 15, marginTop: 10,
  },
  adCard: { alignItems: 'center' },
  adIcon: {
    width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,197,61,0.13)',
  },

  nameInput: {
    fontFamily: F.b, fontSize: 14, color: C.white, textAlign: 'right',
    minWidth: 90, paddingVertical: 6, paddingHorizontal: 10,
    backgroundColor: A.t06, borderRadius: R.sm, borderWidth: 1, borderColor: A.t10,
  },

  toggle: {
    width: 46, height: 27, borderRadius: 14, backgroundColor: A.t15,
    justifyContent: 'center', paddingHorizontal: 2.5,
  },
  toggleOn: { backgroundColor: C.cyan },
  knob: { width: 22, height: 22, borderRadius: 11, backgroundColor: A.t62 },
  knobOn: { backgroundColor: C.white, marginLeft: 19 },

  segs: { flexDirection: 'row', gap: 5 },
  seg: { paddingVertical: 5, paddingHorizontal: 10, borderRadius: R.sm, backgroundColor: A.t07 },
  segOn: { backgroundColor: C.cyan },
  segLabel: { fontFamily: F.b, fontSize: 11, color: A.t50 },
  segLabelOn: { fontFamily: F.eb, color: C.onCyan },

  error: { fontFamily: F.sb, fontSize: 12.5, color: C.redSoft, marginTop: 14, lineHeight: 18 },

  footer: { position: 'absolute', left: PAD.screen, right: PAD.screen },
});
