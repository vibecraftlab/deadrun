import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop, LinearGradient as SvgGrad } from 'react-native-svg';
import { A, C, F, PAD, R, T } from '../ui/theme';
import { AdButton, Divider, GhostButton, Glass } from '../ui/components';
import type { Snapshot } from '../game/game';

/**
 * 사망 화면 (design/v2 Dead).
 *
 *  "광고 보고 부활"은 아직 없는 시스템이다 — 자리만 두고 눌리지 않게 했다.
 *  숫자는 전부 이번 런의 실제 기록이다.
 */

const mmss = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export default function DeadScreen({
  snap, onResult,
}: {
  snap: Snapshot;
  onResult: () => void;
}) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={s.root}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGrad id="dbg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={C.bgCard} />
            <Stop offset="1" stopColor={C.bgDeep} />
          </SvgGrad>
          <RadialGradient id="dred" cx="50%" cy="45%" r="62%">
            <Stop offset="0" stopColor={C.red} stopOpacity="0.26" />
            <Stop offset="1" stopColor={C.red} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Rect width={width} height={height} fill="url(#dbg)" />
        <Rect width={width} height={height} fill="url(#dred)" />
      </Svg>

      <View style={[s.head, { top: height * 0.2 }]}>
        <Text style={s.title}>사 망</Text>
        <Text style={s.cause}>{snap.deathCause || '좀비에게 붙잡혔습니다'}</Text>
      </View>

      <Glass style={[s.stats, { top: height * 0.37 }]} radius={R.xl}>
        <View style={s.statRow}>
          <View style={s.statCell}>
            <Text style={T.statLabel}>생존</Text>
            <Text style={s.statVal}>{mmss(snap.sessionSec)}</Text>
          </View>
          <Divider />
          <View style={s.statCell}>
            <Text style={T.statLabel}>주행</Text>
            <Text style={s.statVal}>
              {(snap.distanceM / 1000).toFixed(2)}<Text style={s.statUnit}>km</Text>
            </Text>
          </View>
          <Divider />
          <View style={s.statCell}>
            <Text style={T.statLabel}>처치</Text>
            <Text style={s.statVal}>{String(snap.kills).padStart(2, '0')}</Text>
          </View>
        </View>
      </Glass>

      <View style={s.footer}>
        <AdButton
          label="광고 보고 그 자리에서 부활"
          sub="준비 중 — 아직 동작하지 않습니다"
        />
        <GhostButton label="결과 보기" onPress={onResult} style={{ marginTop: 11 }} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  head: { position: 'absolute', left: 26, right: 26, alignItems: 'center' },
  title: {
    fontFamily: F.eb, fontSize: 52, letterSpacing: 8, color: C.red,
    textShadowColor: 'rgba(255,46,91,0.5)', textShadowRadius: 28, textShadowOffset: { width: 0, height: 4 },
  },
  cause: { fontFamily: F.sb, fontSize: 14, color: A.t62, marginTop: 12, textAlign: 'center' },

  stats: { position: 'absolute', left: 26, right: 26, padding: 18 },
  statRow: { flexDirection: 'row', alignItems: 'stretch' },
  statCell: { flexGrow: 1, flexBasis: 0, alignItems: 'center' },
  statVal: {
    fontFamily: F.eb, fontSize: 24, color: C.white, marginTop: 4,
    fontVariant: ['tabular-nums'],
  },
  statUnit: { fontFamily: F.sb, fontSize: 11, color: A.t45 },

  footer: { position: 'absolute', left: 26, right: 26, bottom: PAD.bottom + 14 },
});
