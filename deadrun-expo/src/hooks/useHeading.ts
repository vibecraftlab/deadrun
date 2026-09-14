import { useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { DeviceMotion } from 'expo-sensors';
import { HeadingFilter } from '../core/headingFilter';
import { Config } from '../config';

/**
 * 나침반 + 자이로를 합친 방위(도)를 돌려준다.
 * 지도의 방향 부채꼴처럼 화면에 그대로 그리는 곳에서 쓴다.
 * (AR은 매 프레임 GL 루프에서 직접 돌려야 해서 HeadingFilter를 따로 쓴다)
 */
export function useHeading(): number {
  const [deg, setDeg] = useState(0);
  const filter = useRef<HeadingFilter | null>(null);

  useEffect(() => {
    const f = new HeadingFilter({
      compassTrust: Config.arCompassTrust,
      deadband: (Config.arHeadingDeadbandDeg * Math.PI) / 180,
      gyroSign: Config.arGyroYawSign,
      fallbackSmooth: Config.arSensorSmoothing,
      gyroDeadband: (Config.arGyroDeadbandDeg * Math.PI) / 180,
      gyroSmooth: Config.arGyroSmoothing,
    });
    filter.current = f;

    let headingSub: Location.LocationSubscription | null = null;
    Location.watchHeadingAsync(h => {
      const d = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
      f.setCompass((d * Math.PI) / 180);
    }).then(s => { headingSub = s; }).catch(() => {});

    DeviceMotion.setUpdateInterval(50);
    const motionSub = DeviceMotion.addListener(m => {
      if (m.rotation && typeof m.rotation.alpha === 'number') f.setGyro(m.rotation.alpha);
    });

    let last = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const dt = Math.min(0.25, Math.max(0.001, (now - last) / 1000));
      last = now;
      f.update(dt);
      const next = f.degrees;
      // 0.15° 미만 변화는 화면에서 구분되지 않으므로 재렌더를 건너뛴다
      setDeg(prev => (Math.abs(((next - prev + 540) % 360) - 180) > 0.15 ? next : prev));
    }, Config.renderIntervalMs);

    return () => {
      headingSub?.remove();
      motionSub.remove();
      clearInterval(timer);
    };
  }, []);

  return deg;
}
