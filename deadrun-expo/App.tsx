import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useGame } from './src/game/useGame';
import type { ZoneView } from './src/game/game';
import { Config } from './src/config';
import { Rules } from './src/core/rules';
import MapScreen from './src/screens/MapScreen';
import ArScreen from './src/screens/ArScreen';
import OnboardScreen from './src/screens/OnboardScreen';
import { useAppFonts } from './src/ui/useAppFonts';
import { C, F, useSafePad } from './src/ui/theme';
import { Glass } from './src/ui/components';
import Preview from './src/ui/Preview';
import HomeScreen, { HomeOptions, densityToPerSqKm } from './src/screens/HomeScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import SplashScreen from './src/screens/SplashScreen';
import DeadScreen from './src/screens/DeadScreen';
import ResultScreen from './src/screens/ResultScreen';
import { weeklyChaseKmh } from './src/services/profile';
import { addRun, RunRecord } from './src/services/runRecords';
import StatsScreen from './src/screens/StatsScreen';
import RunDetailScreen from './src/screens/RunDetailScreen';
import ChaseScreen from './src/screens/ChaseScreen';
import BadgesScreen from './src/screens/BadgesScreen';

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
  /*
    안드로이드는 앱이 내비게이션 바(제스처 바·3버튼) 아래까지 그려진다.
    SafeAreaProvider 가 그 높이를 알려주고, 화면들은 useSafePad() 로 받아
    하단 버튼이 바에 깔리지 않게 띄운다.
  */
  return (
    <SafeAreaProvider>
      <AppRoot />
    </SafeAreaProvider>
  );
}

function AppRoot() {
  const [runKey, setRunKey] = useState(0);
  const [onboarded, setOnboarded] = useState(false);
  const [opts, setOpts] = useState<HomeOptions>({
    playerName: '러너',
    density: 'normal',
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
  const safe = useSafePad();
  const { game, snap, error, start, toasts, hitCount, lastHit } = useGame();
  const [screen, setScreen] = useState<'map' | 'ar'>('map');
  const [starting, setStarting] = useState(false);
  /** 홈에서 들어가는 기록 화면 묶음 */
  const [records, setRecords] = useState<'none' | 'stats' | 'chase' | 'badges'>('none');
  const [openRun, setOpenRun] = useState<RunRecord | null>(null);
  /** 사망 화면에서 "결과 보기"를 누르면 런 결과로 넘어간다 */
  const [showResult, setShowResult] = useState(false);

  // 피격 붉은 플래시: hitCount가 오를 때마다 0.45 → 0으로 페이드
  const flashAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (hitCount === 0) return;
    flashAnim.setValue(0.45);
    Animated.timing(flashAnim, { toValue: 0, duration: 450, useNativeDriver: true }).start();
  }, [hitCount, flashAnim]);

  // 사망 = 런 종료. 이번 런을 통째로 기록한다 (기록 화면 네 개의 원천)
  const recorded = useRef(false);
  useEffect(() => {
    if (snap.state !== 'dead' || recorded.current) return;
    recorded.current = true;
    addRun(game.runRecord());
  }, [snap.state, game]);

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
        zombiesPerSqKm: densityToPerSqKm(opts.density),
        maxZombies: Config.maxZombies,
        testMode: opts.testMode,
        testZombieCount: Config.testZombieCount,
        testSpawnDistanceM: Config.testSpawnDistanceM,
        playerName: opts.playerName.trim() || '러너',
        chaseSpeedKmh: {
          Walker: Config.chaseSpeedWalker,
          // 기록이 난이도를 만든다 — 최근 4주 평균 속도에 맞춰 매주 조정한다
          // (design/v2 Training §3). 기록이 없으면 설정값 그대로다.
          Runner: weeklyChaseKmh(Config.chaseSpeedRunner),
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
        zombieMinSepM: Config.zombieMinSeparationM,
        safeZoneRatio: Config.safeZoneRatio,
        safeZoneMaxSec: Config.safeZoneMaxSec,
        unsafeBreachSec: Config.unsafeBuildingBreachSec,
        zoneGraceSec: Config.zoneGraceSec,
        maxChasers: Config.maxChasers,
        relentlessChase: Config.relentlessChase,
        deAggroHoldSec: Config.deAggroHoldSec,
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

  // ── 기록 화면 (홈에서 들어간다) ──
  if (records !== 'none' || openRun) {
    return (
      <>
        <StatusBar style="light" />
        {openRun ? (
          <RunDetailScreen run={openRun} onBack={() => setOpenRun(null)} />
        ) : records === 'chase' ? (
          <ChaseScreen onBack={() => setRecords('stats')} />
        ) : records === 'badges' ? (
          <BadgesScreen onBack={() => setRecords('stats')} />
        ) : (
          <StatsScreen
            onBack={() => setRecords('none')}
            onOpenRun={setOpenRun}
            onOpenChase={() => setRecords('chase')}
            onOpenBadges={() => setRecords('badges')}
          />
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
          <HomeScreen
            options={opts}
            onChange={onOptsChange}
            onStart={begin}
            onOpenStats={() => setRecords('stats')}
            error={error}
          />
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
      <View pointerEvents="none" style={[s.toastWrap, { bottom: 132 + safe.navBar }]}>
        {toasts.map(t => (
          <Glass key={t.id} style={s.toast} radius={14} borderColor="rgba(255,46,91,0.4)">
            <Text style={s.toastText}>{t.msg}</Text>
          </Glass>
        ))}
      </View>

      {/* 피격 수치 — 맞을 때마다 −N이 떴다 위로 사라진다 (design/v2 Hit) */}
      <HitNumber seq={hitCount} dmg={lastHit.dmg} from={lastHit.from} />

      {/* 안전 구역 상태 — 지도·AR 어느 쪽에서든 같이 보여야 한다 */}
      <ZoneChip zone={snap.zone} bottom={(grabbed ? 270 : 214) + safe.navBar} />

      {/* 붙잡힘 경고 — 왜 계속 맞는지, 뭘 해야 하는지 (design/v2 Hit) */}
      {grabbed && (
        <View pointerEvents="none" style={[s.dangerWrap, { bottom: 214 + safe.navBar }]}>
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

/**
 * 안전 구역 표시.
 *
 *  세 상태를 구분해 보여준다.
 *   · 안전 구역(녹색)     — 좀비가 들어오지 못한다. 상한이 있으면 남은 시간을 센다.
 *   · 그 밖의 건물(앰버)  — 아직 안전하지만 카운트다운이 돈다.
 *   · 보호가 풀림(적색)   — 좀비가 들어올 수 있다. 나가야 한다.
 *
 *  남은 시간을 굳이 보여주는 이유는, 숨는 것이 "얼마나" 벌어주는지 알아야
 *  언제 다시 달릴지 판단할 수 있기 때문이다.
 */
function ZoneChip({ zone, bottom }: { zone: ZoneView; bottom: number }) {
  if (zone.kind === 'none') return null;

  const mmss = (s: number) => {
    const t = Math.max(0, Math.ceil(s));
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  };
  const where = zone.name ? `${zone.name} · ` : '';

  const [tint, text] = !zone.shielded
    ? [C.red, `${where}좀비가 들어올 수 있다 · 지금 나가야 한다`]
    : zone.kind === 'safe'
      ? [C.green, zone.shieldLeftSec < 0
        ? `${where}안전 구역 · 좀비가 들어올 수 없다`
        : `${where}안전 구역 · ${mmss(zone.shieldLeftSec)} 뒤 보호 해제`]
      : [C.amber, `${where}${mmss(zone.shieldLeftSec)} 뒤 좀비가 들어온다`];

  return (
    <View pointerEvents="none" style={[s.dangerWrap, { bottom }]}>
      <Glass style={s.dangerChip} radius={18} borderColor={tint + '73'}>
        <Text style={[s.dangerText, { color: tint }]}>{text}</Text>
      </Glass>
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
