import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useGame } from './src/game/useGame';
import { Config } from './src/config';
import { Rules } from './src/core/rules';
import MapScreen from './src/screens/MapScreen';
import ArScreen from './src/screens/ArScreen';
import OnboardScreen from './src/screens/OnboardScreen';
import { useAppFonts } from './src/ui/useAppFonts';
import { C, F } from './src/ui/theme';
import { Glass } from './src/ui/components';
import Preview from './src/ui/Preview';
import HomeScreen, { HomeOptions, densityToPerSqKm } from './src/screens/HomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import SplashScreen from './src/screens/SplashScreen';
import DeadScreen from './src/screens/DeadScreen';
import ResultScreen from './src/screens/ResultScreen';
import { recordRun } from './src/services/profile';

/**
 * 디자인 토큰·공용 컴포넌트를 눈으로 확인하는 화면.
 * 화면 리디자인이 끝나면 false로 되돌리거나 이 분기를 지운다.
 */
const SHOW_UI_PREVIEW = Config.uiPreview;

/** 실행 화면을 보여주는 시간(ms) — 서체가 준비된 뒤부터 센다 */
const SPLASH_MS = 1400;

/**
 * 세션 재시작 = GameRoot 리마운트. 온보딩(안전 수칙)은 앱 실행당 1회.
 * 홈 화면 설정은 App이 들고 있다 — 런이 끝나고 "다시 달리기"를 눌러도
 * 이름·밀도 같은 설정이 초기화되지 않게 하려는 것이다.
 */
export default function App() {
  const [runKey, setRunKey] = useState(0);
  const [onboarded, setOnboarded] = useState(false);
  const [opts, setOpts] = useState<HomeOptions>({
    playerName: '러너',
    density: 'normal',
    realRoads: Config.useOverpass,
    testMode: Config.testMode,
  });
  /** 리마운트 직후 바로 런을 시작할지 ("다시 달리기") */
  const [autoStart, setAutoStart] = useState(false);
  const fontsReady = useAppFonts();
  /** 실행 화면(Splash)이 지나갔는지 — 앱 실행당 1회 */
  const [splashDone, setSplashDone] = useState(false);

  // 서체가 준비된 뒤부터 세어야 로고가 시스템 폰트로 한 번 번쩍이지 않는다
  useEffect(() => {
    if (!fontsReady) return;
    const t = setTimeout(() => setSplashDone(true), SPLASH_MS);
    return () => clearTimeout(t);
  }, [fontsReady]);

  const restart = (auto: boolean) => {
    setAutoStart(auto);
    setRunKey(k => k + 1);
  };

  // 서체가 늦게 뜨면 화면이 한 번 바뀌어 보인다. 로드될 때까지 빈 배경만 보여준다.
  if (!fontsReady) {
    return (
      <>
        <StatusBar style="light" />
        <View style={{ flex: 1, backgroundColor: C.bg }} />
      </>
    );
  }

  if (SHOW_UI_PREVIEW) {
    return (
      <>
        <StatusBar style="light" />
        <Preview />
      </>
    );
  }

  if (!splashDone) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen holdMs={SPLASH_MS} />
      </>
    );
  }

  if (!onboarded) {
    return (
      <>
        <StatusBar style="light" />
        <OnboardScreen onDone={() => setOnboarded(true)} />
      </>
    );
  }
  return (
    <GameRoot
      key={runKey}
      opts={opts}
      onOptsChange={setOpts}
      autoStart={autoStart}
      onRestart={restart}
    />
  );
}

function GameRoot({
  opts, onOptsChange, autoStart, onRestart,
}: {
  opts: HomeOptions;
  onOptsChange: (o: HomeOptions) => void;
  autoStart: boolean;
  onRestart: (auto: boolean) => void;
}) {
  const { game, snap, error, start, toasts, hitCount, lastHit } = useGame();
  const [screen, setScreen] = useState<'map' | 'ar'>('map');
  const [starting, setStarting] = useState(false);
  /** 사망 화면에서 "결과 보기"를 누르면 런 결과로 넘어간다 */
  const [showResult, setShowResult] = useState(false);

  // 피격 붉은 플래시: hitCount가 오를 때마다 0.45 → 0으로 페이드
  const flashAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (hitCount === 0) return;
    flashAnim.setValue(0.45);
    Animated.timing(flashAnim, { toValue: 0, duration: 450, useNativeDriver: true }).start();
  }, [hitCount, flashAnim]);

  // 사망 = 런 종료. 달린 거리를 기기에 누적한다 (홈 화면의 누적·오늘 거리)
  const recorded = useRef(false);
  useEffect(() => {
    if (snap.state !== 'dead' || recorded.current) return;
    recorded.current = true;
    recordRun(snap.distanceM);
  }, [snap.state, snap.distanceM]);

  const begin = async () => {
    setStarting(true);
    try {
      // 지도 중심은 언제나 실제 현재 위치
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('위치 권한이 필요합니다');
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const center = { lat: loc.coords.latitude, lon: loc.coords.longitude };
      await start({
        center,
        radiusMeters: Config.playRadiusM,
        useOverpass: opts.realRoads,
        zombiesPerSqKm: densityToPerSqKm(opts.density),
        maxZombies: Config.maxZombies,
        testMode: opts.testMode,
        testZombieCount: Config.testZombieCount,
        testSpawnDistanceM: Config.testSpawnDistanceM,
        playerName: opts.playerName.trim() || '러너',
        chaseSpeedKmh: {
          Walker: Config.chaseSpeedWalker,
          Runner: Config.chaseSpeedRunner,
          Stalker: Config.chaseSpeedStalker,
          Brute: Config.chaseSpeedBrute,
        },
        wanderSpeedKmh: {
          Walker: Config.wanderSpeedWalker,
          Runner: Config.wanderSpeedRunner,
          Stalker: Config.wanderSpeedStalker,
          Brute: Config.wanderSpeedBrute,
        },
        roadHalfWidthM: Config.roadHalfWidthM,
        constrainToRoad: Config.constrainToRoad,
        godMode: Config.godMode,
        attackRangeM: Config.attackRangeM,
        maxChasers: Config.maxChasers,
        relentlessChase: Config.relentlessChase,
        detectRangeMult: Config.detectRangeMult,
        detectRangeMaxM: Config.detectRangeMaxM,
        useFov: Config.useFov,
        detectAlwaysM: Config.detectAlwaysM,
        useLineOfSight: Config.useLineOfSight,
        losCorridorM: Config.losCorridorM,
        renderSmoothing: Config.renderSmoothing,
        escapeDistanceM: Config.escapeDistanceM,
      });
    } finally {
      setStarting(false);
    }
  };

  // "다시 달리기" — 리마운트 직후 한 번만 자동 시작한다
  const autoStarted = useRef(false);
  useEffect(() => {
    if (!autoStart || autoStarted.current) return;
    autoStarted.current = true;
    begin();
  }, [autoStart]);

  // ── 사망 · 런 결과 ──
  if (snap.state === 'dead') {
    return (
      <>
        <StatusBar style="light" />
        {showResult ? (
          <ResultScreen
            snap={snap}
            onRestart={() => onRestart(true)}
            onHome={() => onRestart(false)}
          />
        ) : (
          <DeadScreen snap={snap} onResult={() => setShowResult(true)} />
        )}
      </>
    );
  }

  // ── 시작 · 로딩 화면 ──
  if (snap.state === 'idle' || snap.state === 'loading') {
    const busy = snap.state === 'loading' || starting;
    return (
      <>
        <StatusBar style="light" />
        {busy ? (
          <LoadingScreen
            steps={snap.loadSteps}
            status={snap.loadStatus}
            percent={snap.loadPercent}
            source={Config.mapPackUrl.replace(/^https?:\/\//, '') || undefined}
          />
        ) : (
          <HomeScreen options={opts} onChange={onOptsChange} onStart={begin} error={error} />
        )}
      </>
    );
  }

  // ── 플레이 화면 ──
  // 붙잡혀서 계속 맞고 있는 상태 — 디자인의 "지금 달려서 벗어나야 한다" 경고 조건
  // 공격 사거리는 .env로 덮어쓸 수 있으므로 시뮬이 실제로 쓰는 값(Config)을 기준으로 삼는다
  const grabbed = snap.chasing > 0 && snap.nearestChaserM <= Config.attackRangeM + 1.5;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="light" />
      {screen === 'map' ? (
        <MapScreen game={game} snap={snap} onEnterAr={() => setScreen('ar')} />
      ) : (
        <ArScreen game={game} snap={snap} onExit={() => setScreen('map')} />
      )}

      {/* 감지 알림 토스트 (원 컨셉 #3: "좀비{name}가 사용자 {이름}를 감지했습니다") */}
      <View pointerEvents="none" style={s.toastWrap}>
        {toasts.map(t => (
          <Glass key={t.id} style={s.toast} radius={14} borderColor="rgba(255,46,91,0.4)">
            <Text style={s.toastText}>{t.msg}</Text>
          </Glass>
        ))}
      </View>

      {/* 피격 수치 — 맞을 때마다 −N이 떴다 위로 사라진다 (design/v2 Hit) */}
      <HitNumber seq={hitCount} dmg={lastHit.dmg} from={lastHit.from} />

      {/* 붙잡힘 경고 — 왜 계속 맞는지, 뭘 해야 하는지 (design/v2 Hit) */}
      {grabbed && (
        <View pointerEvents="none" style={s.dangerWrap}>
          <Glass style={s.dangerChip} radius={18} borderColor="rgba(255,46,91,0.45)">
            <Text style={s.dangerText}>
              {Rules.attackCooldownSec}초마다 맞는다 · 지금 달려서 벗어나야 한다
            </Text>
          </Glass>
        </View>
      )}

      {/* 피격 붉은 플래시 (맞을 때마다 번쩍) */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: '#C40F0F', opacity: flashAnim }]} />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, {
          borderWidth: 10, borderColor: 'rgba(255,46,91,0.55)',
          opacity: flashAnim.interpolate({ inputRange: [0, 0.45], outputRange: [0, 1] }),
        }]} />
    </View>
  );
}

/** 피격 수치 — 화면 위쪽에 −N이 떴다 올라가며 사라진다 (design/v2 Hit) */
function HitNumber({ seq, dmg, from }: { seq: number; dmg: number; from: string }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (seq === 0) return;
    a.setValue(1);
    Animated.timing(a, {
      toValue: 0, duration: 1100, easing: Easing.in(Easing.quad), useNativeDriver: true,
    }).start();
  }, [seq, a]);
  if (seq === 0 || dmg <= 0) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[s.hitNumWrap, {
        opacity: a,
        transform: [
          { scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.1] }) },
          { translateY: a.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) },
        ],
      }]}
    >
      <Text style={s.hitNum}>−{dmg}</Text>
      <Text style={s.hitFrom}>{from.toUpperCase()}에게 피격</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  toastWrap: { position: 'absolute', bottom: 132, left: 16, right: 16, gap: 7 },
  toast: { paddingVertical: 9, paddingHorizontal: 14 },
  toastText: { fontFamily: F.sb, fontSize: 12.5, color: C.redSoft, lineHeight: 18 },

  hitNumWrap: { position: 'absolute', top: 330, left: 0, right: 0, alignItems: 'center' },
  hitNum: {
    fontFamily: F.eb, fontSize: 46, letterSpacing: -1.5, color: C.red,
    fontVariant: ['tabular-nums'],
    textShadowColor: 'rgba(255,46,91,0.65)', textShadowRadius: 22, textShadowOffset: { width: 0, height: 3 },
  },
  hitFrom: { fontFamily: F.b, fontSize: 13, color: C.white, marginTop: 2 },

  dangerWrap: { position: 'absolute', bottom: 214, left: 16, right: 16, alignItems: 'center' },
  dangerChip: { paddingVertical: 8, paddingHorizontal: 14 },
  dangerText: { fontFamily: F.eb, fontSize: 12.5, color: C.redSoft, textAlign: 'center' },
});
