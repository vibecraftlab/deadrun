import { useEffect, useRef, useState, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { Game, GameConfig, Snapshot } from './game';
import { Config } from '../config';

const SIM_STEP_SEC = 0.1;                       // 시뮬 10Hz (A* · 좀비 200+)
const RENDER_MS = Math.max(16, Config.renderIntervalMs); // 화면 갱신 (기본 33ms ≈ 30fps)

export interface Toast { id: number; msg: string }

export function useGame() {
  const gameRef = useRef<Game>(new Game());
  const [snap, setSnap] = useState<Snapshot>(() => gameRef.current.snapshot());
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hitCount, setHitCount] = useState(0); // 피격 시마다 증가 → App이 붉은 플래시 트리거
  // 마지막 피격 내용 — AR 화면의 −N 데미지 표시에 쓴다 (design/v2 Hit)
  const [lastHit, setLastHit] = useState<{ dmg: number; from: string }>({ dmg: 0, from: '' });
  const hapticLoop = useRef<ReturnType<typeof setInterval> | null>(null);
  const toastId = useRef(0);

  useEffect(() => {
    const game = gameRef.current;

    // 피격: 강진동 + 플래시 트리거 (원 컨셉 "공격당할 때 화면 붉게")
    game.onPlayerHit = (dmg, from) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setLastHit({ dmg, from });
      setHitCount(c => c + 1);
    };

    // 감지 알림: 진동 + 토스트 (원 컨셉 #3)
    game.onNotify = msg => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      const id = ++toastId.current;
      setToasts(t => [...t.slice(-3), { id, msg }]); // 최대 4개 유지
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
    };

    // 위협 단계별 햅틱 (원 컨셉 #4 — 진동 경고)
    game.onThreatChange = level => {
      if (hapticLoop.current) { clearInterval(hapticLoop.current); hapticLoop.current = null; }
      if (level === 'alert') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      else if (level === 'chased') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        hapticLoop.current = setInterval(
          () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 1200);
      } else if (level === 'imminent') {
        hapticLoop.current = setInterval(
          () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy), 350);
      }
    };
    game.onSupply = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // 시뮬은 10Hz(A*·좀비 200+ 부하), 화면은 30Hz로 분리.
    // 렌더 보간을 30Hz로 돌려 위치·카메라가 부드럽게 따라가게 한다.
    let last = Date.now();
    let simAcc = 0;
    const iv = setInterval(() => {
      const now = Date.now();
      const dt = Math.min(0.5, (now - last) / 1000);
      last = now;

      simAcc += dt;
      if (simAcc >= SIM_STEP_SEC) {
        game.tick(simAcc);
        simAcc = 0;
      }
      game.renderStep(dt);
      setSnap(game.snapshot());
    }, RENDER_MS);

    return () => {
      clearInterval(iv);
      if (hapticLoop.current) clearInterval(hapticLoop.current);
      game.dispose();
    };
  }, []);

  const start = useCallback(async (cfg: GameConfig) => {
    setError(null);
    try {
      await gameRef.current.init(cfg);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
      gameRef.current.state = 'idle';
    }
  }, []);

  return { game: gameRef.current, snap, error, start, toasts, hitCount, lastHit };
}
