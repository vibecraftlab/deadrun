import * as Location from 'expo-location';
import { LatLon, Vec2, toEnu } from '../core/geo';

export interface LocationSample {
  enu: Vec2;          // origin 기준 ENU 미터
  accuracy: number;
  time: number;       // 초 단위 타임스탬프 (샘플 dedupe 용)
}

export interface LocationSource {
  readonly name: string;
  start(origin: LatLon): Promise<void>;
  stop(): void;
  latest: LocationSample | null;
}

/** 실기기 GPS (expo-location, 1Hz) */
export class GpsSource implements LocationSource {
  readonly name = 'GPS';
  latest: LocationSample | null = null;
  private sub: Location.LocationSubscription | null = null;
  private origin: LatLon = { lat: 0, lon: 0 };

  async start(origin: LatLon) {
    this.origin = origin;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') throw new Error('위치 권한이 거부되었습니다');
    this.sub = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.BestForNavigation, timeInterval: 1000, distanceInterval: 0 },
      loc => {
        this.latest = {
          enu: toEnu(this.origin, { lat: loc.coords.latitude, lon: loc.coords.longitude }),
          accuracy: loc.coords.accuracy ?? 99,
          time: loc.timestamp / 1000,
        };
      },
    );
  }

  stop() {
    this.sub?.remove();
    this.sub = null;
  }
}
