import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, PanResponder, Animated, Easing } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GLView, ExpoWebGLRenderingContext } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';
import * as Location from 'expo-location';
import { DeviceMotion } from 'expo-sensors';
import * as Haptics from 'expo-haptics';
import { Game, Snapshot, ZombieView } from '../game/game';
import { Rules } from '../core/rules';
import { Config } from '../config';
import { HeadingFilter } from '../core/headingFilter';
import { ClipPlayer } from '../core/zombieClips';
import { artState, artType, pickView } from '../components/zombieArt';
import { jointPose, PuppetPart, puppetParts } from '../components/zombiePuppet';
import type { PartName } from '../components/zombieRig';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { A, C, F, R } from '../ui/theme';
import { Glass, StatBar } from '../ui/components';

/** AR 최소 렌더 거리 — 이보다 가까운 좀비도 이 거리에 서 있는 것처럼 그린다 */
const MIN_AR_DIST = Config.arMinDistanceM;
/** 나침반·자이로 평활 강도 (1/s). 낮을수록 부드럽고 반응이 늦다 */
const SENSOR_SMOOTH = Config.arSensorSmoothing;
/** 좀비 위치 보간 강도 (1/s) */
const ZOMBIE_SMOOTH = Config.arZombieSmoothing;
/** 레이어 높이차(m). 0이면 모든 좀비를 같은 높이에 고정 */
const LAYER_H = Config.arLayerHeightM;
/** 걷기 상하 흔들림(m). 0이면 높이 완전 고정 */
const BOB_M = Config.arBobM;
/** 시야 밖 좀비 유지 시간(s) — 레이더 경계에서 사라졌다 나타나는 깜빡임 방지 */
const KEEP_S = Config.arKeepMs / 1000;
const DEG = Math.PI / 180;
const CORPSE_S = Rules.corpseSec;

/**
 * L1 유사 AR 뷰: 카메라 영상 배경 + 나침반/자이로 시점 + three.js 좀비 오버레이.
 * SLAM 앵커는 없음(드리프트 존재) — ViroReact(dev build)로 업그레이드 시 이 화면만 교체.
 * GDD FR-402: 정지 상태 전용, 이동 감지 시 자동 이탈.
 */

interface Props {
  game: Game;
  snap: Snapshot;
  onExit: () => void;
}

export default function ArScreen({ game, snap, onExit }: Props) {
  const [permission, requestPermission] = useCameraPermissions();
  // 센서 원값(Raw)과 화면에 쓰는 평활값을 분리한다.
  // 나침반·자이로는 원값이 매 샘플 몇 도씩 떨리는데, 그대로 카메라에 넣으면
  // 시야 전체가 흔들려 좀비가 "타다닥" 튀는 것처럼 보인다.
  const pitchRawRef = useRef(0);   // 자이로 원값 (rad, 위 = +)
  // 방위 필터는 지도와 같은 모듈을 쓴다 (src/core/headingFilter.ts)
  const headRef = useRef(new HeadingFilter({
    compassTrust: Config.arCompassTrust,
    deadband: (Config.arHeadingDeadbandDeg * Math.PI) / 180,
    gyroSign: Config.arGyroYawSign,
    fallbackSmooth: Config.arSensorSmoothing,
    gyroDeadband: (Config.arGyroDeadbandDeg * Math.PI) / 180,
    gyroSmooth: Config.arGyroSmoothing,
  }));
  const headingRef = useRef(0);    // 화면에 쓰는 최종 방위
  const pitchRef = useRef(0);      // 평활된 피치
  const touchYawRef = useRef(0);   // 드래그 룩 보정 (라디안)
  const touchPitchRef = useRef(0);
  const zombiesRef = useRef<ZombieView[]>([]);
  const glDone = useRef(false);
  const moveTimer = useRef(0);
  /** GL 씬에 피격 구를 띄우는 함수 (onContextCreate에서 채워진다) */
  const impactRef = useRef<((x: number, y: number, z: number) => void) | null>(null);
  /** 총구 화염 밝기 0→1 */
  const muzzle = useRef(new Animated.Value(0)).current;
  const [hitMark, setHitMark] = useState(0); // 명중 시 증가 → 조준선 히트마커 트리거
  /** 총성 소음 파동 0→1 (design/v2 Fire) */
  const noise = useRef(new Animated.Value(0)).current;
  /** 처치 표시 — seq가 오를 때마다 한 번 재생 */
  const [killFx, setKillFx] = useState({ seq: 0, name: '' });

  zombiesRef.current = snap.zombies;
  const getYaw = () => headingRef.current + touchYawRef.current;

  // 나침반 + 자이로 (나침반은 위치 권한 필요 — 실패 시 드래그 룩으로 대체)
  useEffect(() => {
    let headingSub: Location.LocationSubscription | null = null;
    (async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status !== 'granted') await Location.requestForegroundPermissionsAsync();
        headingSub = await Location.watchHeadingAsync(h => {
          const deg = h.trueHeading >= 0 ? h.trueHeading : h.magHeading;
          headRef.current.setCompass((deg * Math.PI) / 180);
        });
      } catch {
        // 나침반 불가 → touchYaw만으로 조작
      }
    })();

    DeviceMotion.setUpdateInterval(50);
    const motionSub = DeviceMotion.addListener(m => {
      if (m.rotation) {
        // 세로 파지 기준: beta ≈ π/2 가 수평 응시 → pitch = beta − π/2
        pitchRawRef.current = Math.max(-1.3, Math.min(1.3, m.rotation.beta - Math.PI / 2));
        // alpha = 자이로·가속도까지 융합된 yaw. 나침반보다 훨씬 안정적이라
        // 짧은 시간의 움직임은 이 값으로 따라가고, 장기 방위만 나침반으로 맞춘다.
        if (typeof m.rotation.alpha === 'number') headRef.current.setGyro(m.rotation.alpha);
      }
    });
    return () => {
      headingSub?.remove();
      motionSub.remove();
    };
  }, []);

  /** 사격 + 연출. 총구 화염은 명중 여부와 무관하게, 피격 표시는 맞았을 때만 */
  const fire = useCallback(() => {
    game.onShot = fx => {
      if (!fx.hit) return;
      const p = game.playerRenderPos();
      impactRef.current?.(fx.x - p.x, 1.2, -(fx.y - p.y));
      setHitMark(n => n + 1);
      // 총 한 발 = 즉사(rules.ts)이므로 명중은 곧 처치다
      setKillFx(k => ({ seq: k.seq + 1, name: fx.name ?? '' }));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };
    if (!game.gun(getYaw())) return;
    muzzle.setValue(1);
    Animated.timing(muzzle, { toValue: 0, duration: 110, useNativeDriver: true }).start();
    // 소음은 명중과 무관하게 퍼진다 — 빗나가도 좀비는 소리를 듣는다
    noise.setValue(0);
    Animated.timing(noise, {
      toValue: 1, duration: 900, easing: Easing.out(Easing.quad), useNativeDriver: true,
    }).start();
  }, [game, muzzle, noise]);

  // 터치: 제자리 탭 = 사격, 드래그 = 시점 회전 (센서 없이도 좀비를 찾을 수 있게)
  const lookStart = useRef({ yaw: 0, pitch: 0, moved: false });
  const lookResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      lookStart.current = { yaw: touchYawRef.current, pitch: touchPitchRef.current, moved: false };
    },
    onPanResponderMove: (_e, g) => {
      if (Math.abs(g.dx) + Math.abs(g.dy) > 8) lookStart.current.moved = true;
      if (lookStart.current.moved) {
        touchYawRef.current = lookStart.current.yaw - g.dx * 0.005;   // 드래그 방향으로 세계가 따라옴
        touchPitchRef.current = Math.max(-1.0, Math.min(1.0, lookStart.current.pitch + g.dy * 0.004));
      }
    },
    onPanResponderRelease: () => {
      if (!lookStart.current.moved) fire(); // 탭 = 사격
    },
  }), []);

  // 이동 시 자동 이탈 (안전 필러: 이동 중 화면 주시 금지)
  useEffect(() => {
    const iv = setInterval(() => {
      if (snap.pose.speedKmh > 3) {
        moveTimer.current += 0.5;
        if (moveTimer.current >= 2) onExit();
      } else moveTimer.current = 0;
    }, 500);
    return () => clearInterval(iv);
  });

  const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
    if (glDone.current) return;
    glDone.current = true;

    const renderer = new Renderer({ gl, alpha: true });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setClearColor(0x000000, 0); // 투명 — 뒤의 카메라 영상이 보임

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      62, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 500);
    camera.position.set(0, 1.6, 0);
    camera.rotation.order = 'YXZ';

    /*
      지면 거리 링 — 예전에는 GridHelper(100, 20) 사각 격자였다.

       두 가지가 문제였다.
        · 50m 지점에서 선 간격이 6.8px까지 좁아져 앨리어싱이 생겼다.
        · 세계 기준 격자라 방위가 1° 흔들리면 격자 전체가 38px 미끄러진다.
          카메라 떨림이 화면 전체의 일렁임으로 증폭돼 보였다.

       동심원은 내 발밑이 중심이라 방위가 흔들려도 제자리에서 돌 뿐 —
       원을 제 중심으로 돌리면 같은 원이므로 아예 보이지 않는다.
       지도의 레이더 링과도 같은 언어가 된다 (design/v2).
    */
    const ringMats: THREE.Material[] = [];
    for (const [radius, opacity] of [[5, 0.3], [10, 0.24], [20, 0.18], [35, 0.13], [50, 0.09]]) {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
      }
      const mat = new THREE.LineBasicMaterial({ color: 0x2fd9ff, transparent: true, opacity });
      ringMats.push(mat);
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }

    const meshes = new Map<number, {
      g: THREE.Group; lastSeen: number; clip: ClipPlayer; hitSeq: number;
    }>();

    /*
      좀비는 디자인 아트(design/v2)를 구운 PNG를 빌보드 판에 붙여 그린다.

       예전에는 박스 6개로 마인크래프트 형태를 조립했는데, 지도에 뜨는 좀비와
       AR에 뜨는 좀비가 서로 다른 그림이라 같은 개체로 안 보였다.
       이제 둘 다 같은 PNG를 쓴다.

       판은 언제나 카메라를 향하므로(빌보드) 방향 표현은 그림 자체가 맡는다 —
       나를 보고 있으면 정면, 등지면 뒷모습, 지나가면 측면 그림으로 바꿔 끼운다.
    */
    const texLoader = new TextureLoader();
    const texCache = new Map<string, THREE.Texture>();
    const texOf = (key: string, png: number) => {
      let tex = texCache.get(key);
      if (!tex) {
        tex = texLoader.load(png);
        // 스프라이트는 판 크기에 맞춰 축소만 되므로 밉맵이 필요 없다
        tex.generateMipmaps = false;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        texCache.set(key, tex);
      }
      return tex;
    };


    /** 피격 표시 — 맞은 지점에 붉은 구를 띄웠다가 부풀리며 사라지게 한다 */
    const hitGeo = new THREE.SphereGeometry(0.45, 10, 8);
    const impacts: { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; t: number }[] = [];
    const spawnImpact = (wx: number, wy: number, wz: number) => {
      const mat = new THREE.MeshBasicMaterial({ color: 0xff2b2b, transparent: true, opacity: 0.95 });
      const m = new THREE.Mesh(hitGeo, mat);
      m.position.set(wx, wy, wz);
      scene.add(m);
      impacts.push({ mesh: m, mat, t: 0 });
    };
    impactRef.current = spawnImpact;

    /*
      좀비 한 마리 = 조각 5개(먼 다리·먼 팔·가까운 다리·몸통·가까운 팔)를 관절로 이은 퍼펫.

       조각마다 [관절 그룹] → [판] 구조다. 관절 그룹을 회전축 자리에 두고 판을 그 밑에
       매달면, 관절 그룹을 돌리는 것만으로 어깨·엉덩이를 축으로 팔다리가 돈다.
       돌리는 각도는 이미 있는 모션 클립(zombieClips.ts)의 트랙을 그대로 쓴다.
    */
    const partGeo = new Map<string, THREE.PlaneGeometry>();
    const geoOf = (w: number, h: number) => {
      const k = `${w.toFixed(4)}x${h.toFixed(4)}`;
      let g = partGeo.get(k);
      if (!g) { g = new THREE.PlaneGeometry(w, h); partGeo.set(k, g); }
      return g;
    };

    interface Joint {
      name: PartName;
      group: THREE.Group;   // 회전축 — 이걸 돌린다
      mesh: THREE.Mesh;
      mat: THREE.MeshBasicMaterial;
      baseY: number;        // 회전축의 원래 높이 (들어 올릴 때 기준)
    }

    /** (타입·상태·방향)이 바뀌면 조각을 통째로 다시 만든다 */
    const buildPuppet = (root: THREE.Group, key: string, parts: PuppetPart[]): Joint[] => {
      for (const old of [...root.children]) {
        root.remove(old);
        const m = (old.children[0] as THREE.Mesh | undefined)?.material as THREE.Material | undefined;
        m?.dispose();
      }
      const joints: Joint[] = [];
      parts.forEach((part, i) => {
        const mat = new THREE.MeshBasicMaterial({
          transparent: true,
          depthWrite: false,       // 반투명 판끼리 서로를 잘라먹지 않게
          side: THREE.DoubleSide,  // 뒤집을 때 scale.x = -1 이라 뒷면이 된다
          map: texOf(`${key}-${part.name}`, part.png),
        });
        const mesh = new THREE.Mesh(geoOf(part.w, part.h), mat);
        mesh.position.set(part.offset.x, part.offset.y, i * 0.012); // 앞 조각일수록 카메라 쪽
        mesh.renderOrder = i;
        const group = new THREE.Group();
        group.position.set(part.pivot?.x ?? 0, part.pivot?.y ?? 0, 0);
        group.add(mesh);
        root.add(group);
        joints.push({ name: part.name, group, mesh, mat, baseY: group.position.y });
      });
      return joints;
    };

    const makeZombie = (): THREE.Group => {
      const g = new THREE.Group();
      // 방위(Y)를 먼저 적용하고 그 다음 앞뒤 기울기(X)를 얹는다.
      g.rotation.order = 'YXZ';

      // 바깥 g는 월드 위치와 카메라 바라보기만 맡고, 클립 동작은 root에 건다.
      // 이렇게 나눠야 높이 고정과 걷기 반동이 서로 간섭하지 않는다.
      const root = new THREE.Group();
      g.add(root);
      g.userData = { root, joints: [] as Joint[], texKey: '' };
      scene.add(g);
      return g;
    };

    /** 각도 보간 — ±π 경계를 넘어갈 때 한 바퀴 도는 것을 막는다 */
    const lerpAngle = (from: number, to: number, k: number) => {
      const d = Math.atan2(Math.sin(to - from), Math.cos(to - from));
      return from + d * k;
    };

    let lastT = Date.now() / 1000;
    const render = () => {
      requestAnimationFrame(render);
      const t = Date.now() / 1000;
      const dt = Math.min(0.1, Math.max(0.001, t - lastT));
      lastT = t;

      // 방위: 나침반+자이로 상보 필터 (지도와 동일 모듈)
      const kHead = 1 - Math.exp(-SENSOR_SMOOTH * dt);
      headingRef.current = headRef.current.update(dt);
      pitchRef.current += (pitchRawRef.current - pitchRef.current) * kHead;

      camera.rotation.y = -(headingRef.current + touchYawRef.current);
      camera.rotation.x = Math.max(-1.3, Math.min(1.3, pitchRef.current + touchPitchRef.current));

      // 스냅된 좌표를 쓰면 도로가 바뀔 때 모든 좀비가 한꺼번에 점프한다
      const p = game.playerRenderPos();
      const playerLayer = game.playerLayer();
      const seen = new Set<number>();

      for (const zv of zombiesRef.current) {
        seen.add(zv.id);
        let wx = zv.x - p.x;                   // 동 = +x
        let wz = -(zv.y - p.y);                // 북 = -z

        // 최소 렌더 거리: 공격 사거리(0.5m)까지 붙으면 카메라 안으로 들어가 형체가 안 보인다.
        // 방위는 유지한 채 거리만 밀어내 전신이 보이게 하고, 가까울수록 크기로 위협을 표현.
        const dTrue = Math.hypot(wx, wz);
        let closeScale = 1;
        if (dTrue > 0.01 && dTrue < MIN_AR_DIST) {
          const k = MIN_AR_DIST / dTrue;
          wx *= k;
          wz *= k;
          closeScale = 1 + (1 - dTrue / MIN_AR_DIST) * 0.35;
        }

        const aggro = zv.state === 'chase';
        const dying = zv.state === 'dead';
        // 레이어 높이차. 0이면 고정 — 플레이어 레이어는 GPS 맵매칭으로 정해져서
        // 육교·지하 경계에서 흔들리는데, 그때마다 좀비 전체가 위아래로 튄다.
        const layerY = (zv.layer - playerLayer) * LAYER_H;
        const target = new THREE.Vector3(wx, layerY, wz);

        let entry = meshes.get(zv.id);
        if (!entry) {
          // 새 메시는 원점(플레이어 발밑)에서 시작하므로 보간하면 화면을 가로질러 날아온다.
          // 레이더 경계를 들락거릴 때 튀어 보이던 원인. 첫 프레임은 목표 위치에 바로 세운다.
          // 같은 클립을 쓰는 좀비들이 한 몸처럼 움직이지 않도록 시작 위상을 흩뜨린다
          entry = { g: makeZombie(), lastSeen: t, clip: new ClipPlayer('idle', zv.id * 0.37), hitSeq: zv.hitSeq };
          entry.g.position.copy(target);
          meshes.set(zv.id, entry);
        }
        entry.lastSeen = t;
        const mesh = entry.g;
        mesh.visible = true;

        // 프레임률 독립 보간 — 고정 계수는 프레임이 흔들리면 이동량도 흔들린다
        mesh.position.lerp(target, 1 - Math.exp(-ZOMBIE_SMOOTH * dt));
        mesh.scale.setScalar(closeScale);
        /*
          빌보드 — 판의 앞면(+Z)이 카메라(원점)를 향하도록 Y축만 돌린다.
          기울이지 않는다. 판을 X나 Z로 기울이면 그림이 사다리꼴로 눌린다.

           ※ lookAt()을 쓰지 않는 이유: lookAt은 쿼터니언을 오일러로 분해하는데
             플레이어 뒤쪽(방위 91~269°)에서 (x=180°, z=180°)라는 등가 표현이 나온다.
             예전 박스 모델에서 그 위에 rotation.x를 덮어써 좀비가 거꾸로 섰던 적이 있다.
        */
        const flat = Math.hypot(mesh.position.x, mesh.position.z);
        if (flat > 0.01) {
          mesh.rotation.y = Math.atan2(-mesh.position.x, -mesh.position.z);
        }

        /*
          어느 방향 그림을 쓸지 — 좀비가 나를 보면 정면, 등지면 뒷모습.
          판은 늘 카메라를 향하므로 좀비가 어디를 보는지는 그림으로만 드러난다.

          좀비에서 플레이어를 향한 방위(북 기준 시계방향):
          동 = +x, 북 = -z 이므로 동 성분 = -x, 북 성분 = +z 다.
        */
        const bearingToPlayer = Math.atan2(-mesh.position.x, mesh.position.z);
        const { view, flip } = pickView(zv.heading, bearingToPlayer);
        const type = artType(zv.name);
        const artSt = artState(zv.state);
        const texKey = `${type}-${artSt}-${view}`;
        const root = mesh.userData.root as THREE.Group;
        if (mesh.userData.texKey !== texKey) {
          mesh.userData.texKey = texKey;
          mesh.userData.joints = buildPuppet(root, texKey, puppetParts(type, artSt, view));
        }
        const joints = mesh.userData.joints as Joint[];
        // 아트의 측면은 왼쪽을 본다. 오른쪽을 보고 있으면 퍼펫째로 뒤집는다
        // (뒤집으면 회전 방향도 같이 뒤집혀서 스윙 부호를 따로 손댈 필요가 없다)
        root.scale.x = flip ? -1 : 1;

        // 상태에 맞는 모션 클립 선택 (수식은 zombieClips.ts에 데이터로 있다).
        // 우선순위: 사망 > 피격(끝날 때까지 유지) > 공격 > 추격 > 배회
        const gotHit = zv.hitSeq !== entry.hitSeq;
        entry.hitSeq = zv.hitSeq;
        if (dying) {
          entry.clip.play('death');
        } else if (gotHit) {
          entry.clip.play('hit');
        } else if (entry.clip.current === 'hit' && !entry.clip.finished) {
          // 움찔하는 중 — 끝날 때까지 다른 클립으로 넘어가지 않는다
        } else {
          entry.clip.play(
            zv.distM <= 2.2 ? 'attack'
              : aggro ? 'run'
                : zv.state === 'idle' ? 'idle' : 'walk');
        }
        /*
          클립(zombieClips.ts)의 트랙을 퍼펫에 그대로 먹인다.
           · rootY / fallY — 걸음 반동과 쓰러지며 내려앉는 양 (몸 전체)
           · roll + pitch  — 좌우 기울기. 납작한 판은 카메라 쪽으로 넘어질 수 없으므로
                             앞으로 젖히는 pitch까지 더해 옆으로 넘어가게 한다.
           · legL/legR/armL/armR — 각 관절 회전 (아래 관절 반복문)
        */
        const pose = entry.clip.update(dt);
        root.position.y = pose.rootY * BOB_M + pose.fallY;
        root.rotation.z = (pose.roll + pose.pitch) * DEG;

        // 관절 — 어깨·엉덩이를 축으로 팔다리를 돌린다
        for (const j of joints) {
          const jp = jointPose(j.name, view, pose);
          j.group.rotation.z = jp.rotation;
          j.group.position.y = j.baseY + jp.lift;
        }

        // 스토커: 예전에는 0.5초마다 통째로 숨겨서 깜빡임처럼 보였다.
        // 위협 표현은 남기되 서서히 흐려지는 방식으로 바꾼다.
        const alpha = dying
          // 시체는 마지막 0.45초 동안 서서히 사라진다
          ? Math.min(1, Math.max(0, CORPSE_S - zv.deadSec) / 0.45)
          : zv.stealth ? 0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * 3)) : 1;
        for (const j of joints) j.mat.opacity = alpha;
      }

      // 죽거나 범위 밖 좀비 정리.
      // 레이더 경계에서는 스냅샷에 들락날락하므로 곧바로 지우지 않고 잠시 숨겨만 둔다.
      for (const [id, entry] of meshes) {
        if (seen.has(id)) continue;
        if (t - entry.lastSeen < KEEP_S) { entry.g.visible = false; continue; }
        scene.remove(entry.g);
        for (const j of (entry.g.userData.joints ?? []) as Joint[]) j.mat.dispose();
        meshes.delete(id);
      }

      // 피격 표시: 0.45초 동안 부풀면서 투명해진다
      for (let i = impacts.length - 1; i >= 0; i--) {
        const fx = impacts[i];
        fx.t += dt;
        const k = fx.t / 0.45;
        if (k >= 1) {
          scene.remove(fx.mesh);
          fx.mat.dispose();
          impacts.splice(i, 1);
          continue;
        }
        fx.mesh.scale.setScalar(0.6 + k * 2.2);
        fx.mat.opacity = 0.95 * (1 - k);
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  if (!permission?.granted) {
    return (
      <View style={[st.root, st.center]}>
        <Text style={st.permText}>AR 전투 뷰는 카메라 권한이 필요합니다</Text>
        <Pressable style={st.permBtn} onPress={requestPermission}>
          <Text style={st.permBtnText}>카메라 권한 허용</Text>
        </Pressable>
        <Pressable onPress={onExit}><Text style={st.exitLink}>← 지도로 돌아가기</Text></Pressable>
      </View>
    );
  }

  const yaw = getYaw();
  const p0 = game.playerRenderPos();
  // 조준선 안에 든 좀비를 사거리 제한 없이 먼저 찾는다.
  // 사거리 밖이라 안 맞는 것과 애초에 못 겨눈 것은 화면에서 구분돼야 한다.
  const aimedAny = game.aimedZombie(yaw, Rules.radarRange, Config.aimAngleDeg);
  const aimDist = aimedAny ? Math.hypot(aimedAny.pos.x - p0.x, aimedAny.pos.y - p0.y) : 0;
  const inRange = !!aimedAny && aimDist <= Config.gunRangeM;
  // 조준선이 실제 사격 판정과 같은 조건(사거리·각도)을 쓰므로,
  // 붉게 변했다는 것은 지금 쏘면 맞는다는 뜻이다.
  const onTarget = inRange;
  const outOfRange = !!aimedAny && !inRange;

  // 가장 가까운 좀비 방향 안내 텍스트
  let hint: string | null = null;
  if (snap.zombies.length > 0) {
    let best = snap.zombies[0], bestD = Infinity;
    for (const z of snap.zombies) {
      if (z.distM < bestD) { bestD = z.distM; best = z; }
    }
    const bearing = Math.atan2(best.x - p0.x, best.y - p0.y);
    const rel = ((bearing - yaw) * 180 / Math.PI + 540) % 360 - 180;
    hint = Math.abs(rel) < 20
      ? `🎯 정면 ${best.name} ${best.distM.toFixed(0)}m`
      : `${rel < 0 ? '◀ 왼쪽' : '오른쪽 ▶'}으로 ${Math.abs(rel).toFixed(0)}° — ${best.name} ${best.distM.toFixed(0)}m`;
  } else {
    hint = '주변 150m 내 좀비 없음 — 지도에서 위치를 확인하세요';
  }

  // 화면 밖 추격자 → 좌/우 에지 인디케이터 (측면별 최근접 1개)
  let edgeL: { dist: number; color: string } | null = null;
  let edgeR: { dist: number; color: string } | null = null;
  for (const z of snap.zombies) {
    if (z.state !== 'chase') continue;
    const bearing = Math.atan2(z.x - p0.x, z.y - p0.y);
    const rel = ((bearing - yaw) * 180 / Math.PI + 540) % 360 - 180;
    if (Math.abs(rel) <= 30) continue; // 시야 안은 본체가 보임
    if (rel < 0) {
      if (!edgeL || z.distM < edgeL.dist) edgeL = { dist: z.distM, color: z.color };
    } else {
      if (!edgeR || z.distM < edgeR.dist) edgeR = { dist: z.distM, color: z.color };
    }
  }

  return (
    <View style={st.root}>
      <CameraView style={StyleSheet.absoluteFill} facing="back" />
      <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />

      {/* 탭 = 사격, 드래그 = 시점 회전 */}
      <View style={StyleSheet.absoluteFill} {...lookResponder.panHandlers} />

      {/* 총성 소음 파동 — 쏘면 120m 안의 좀비가 소리를 듣고 몰려온다 (design/v2 Fire) */}
      <Animated.View
        pointerEvents="none"
        style={[st.noiseWrap, {
          opacity: noise.interpolate({ inputRange: [0, 0.12, 1], outputRange: [0, 0.6, 0] }),
          transform: [{ scale: noise.interpolate({ inputRange: [0, 1], outputRange: [0.3, 1.5] }) }],
        }]}
      >
        <View style={[st.noiseRing, { width: 240, height: 68 }]} />
        <View style={[st.noiseRing, { width: 400, height: 112 }]} />
        <View style={[st.noiseRing, { width: 572, height: 160 }]} />
      </Animated.View>

      {/* 총구 화염 — 화면 아래 중앙에서 번쩍인다 */}
      <Animated.View pointerEvents="none" style={[st.muzzleWrap, {
        opacity: muzzle,
        transform: [{ scale: muzzle.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1.15] }) }],
      }]}>
        <View style={st.muzzleCore} />
        <View style={st.muzzleGlow} />
      </Animated.View>

      {/* 발사 순간 화면 전체가 살짝 밝아진다 */}
      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, {
        backgroundColor: '#FFF3C4',
        opacity: muzzle.interpolate({ inputRange: [0, 1], outputRange: [0, 0.16] }),
      }]} />

      {/* 상단 스탯 바 — 지도 뷰와 같은 자리 (design/v2) */}
      <StatBar
        style={st.statBar}
        distKm={snap.distanceM / 1000}
        avgKmh={snap.sessionSec > 0 ? (snap.distanceM / snap.sessionSec) * 3.6 : 0}
        curKmh={snap.pose.speedKmh}
        hp={snap.hp}
        hpMax={snap.maxHp}
        ammo={snap.ammo}
        ammoMax={Rules.ammoMax}
      />

      {/* 스탯 바 아래 한 줄 — 추격 중이면 경고, 아니면 정지 고정 상태 */}
      {snap.chasing > 0 ? (
        <View pointerEvents="none" style={st.chipWrap}>
          <LinearGradient colors={[C.red, C.redDeep]} style={st.chip}>
            <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
              <Path d="M12 3.2 22.3 20.6H1.7L12 3.2Z" fill={C.white} />
              <Rect x={10.9} y={9} width={2.2} height={6} rx={1.1} fill={C.redDeep} />
              <Circle cx={12} cy={17.4} r={1.3} fill={C.redDeep} />
            </Svg>
            <Text style={st.chipText}>
              추격 {snap.chasing} · {isFinite(snap.nearestChaserM) ? `${snap.nearestChaserM.toFixed(0)}m` : '—'}
            </Text>
          </LinearGradient>
        </View>
      ) : snap.pose.locked ? (
        <View pointerEvents="none" style={st.chipWrap}>
          <Glass style={st.stopChip} radius={16}>
            <View style={st.stopDot} />
            <Text style={st.stopTxt}>정지 고정 · AR 유지 중</Text>
          </Glass>
        </View>
      ) : null}

      {/* 처치 표시 (design/v2 Fire) */}
      <KillBanner seq={killFx.seq} name={killFx.name} />

      {/* 화면 밖 추격자 에지 인디케이터 */}
      {edgeL && (
        <View pointerEvents="none" style={st.edgeLWrap}>
          <View style={[st.edgeGlow, { backgroundColor: edgeL.color }]} />
          <View style={[st.edgeBar, { backgroundColor: edgeL.color }]} />
          <Text style={[st.edgeLabel, { left: 12 }]}>{edgeL.dist.toFixed(0)}m</Text>
        </View>
      )}
      {edgeR && (
        <View pointerEvents="none" style={st.edgeRWrap}>
          <View style={[st.edgeGlow, { backgroundColor: edgeR.color }]} />
          <View style={[st.edgeBar, st.edgeBarR, { backgroundColor: edgeR.color }]} />
          <Text style={[st.edgeLabel, { right: 12 }]}>{edgeR.dist.toFixed(0)}m</Text>
        </View>
      )}

      {/*
        조준 링 — 코너 브래킷 네 개 (design/v2 Ar).
        사격 판정과 같은 조건을 쓰므로, 붉어졌다는 것은 지금 쏘면 맞는다는 뜻이다.
        겨눴지만 사거리 밖이면 앰버 — "못 겨눔"과 "안 닿음"을 구분해서 보여준다.
      */}
      <View pointerEvents="none" style={st.ringWrap}>
        <Svg width={96} height={96} viewBox="0 0 96 96" fill="none">
          <Circle cx={48} cy={48} r={38} stroke={C.white} strokeOpacity={0.25} strokeWidth={2} />
          <G stroke={onTarget ? C.red : outOfRange ? C.amber : A.t42} strokeWidth={3.5} strokeLinecap="round">
            <Path d="M14 30V17a3 3 0 0 1 3-3h13" />
            <Path d="M66 14h13a3 3 0 0 1 3 3v13" />
            <Path d="M82 66v13a3 3 0 0 1-3 3H66" />
            <Path d="M30 82H17a3 3 0 0 1-3-3V66" />
          </G>
          <Circle cx={48} cy={48} r={3} fill={onTarget ? C.red : C.white} />
        </Svg>
      </View>

      {/* 명중 히트마커 */}
      <HitMarker seq={hitMark} />

      {/* 조준 대상 카드 — 사거리 밖이면 왜 안 맞는지까지 적는다 */}
      {aimedAny && (
        <View pointerEvents="none" style={st.aimCardWrap}>
          <Glass
            style={[st.aimCard, { borderLeftColor: onTarget ? C.red : C.amber }]}
            radius={18}
          >
            <View style={{ flex: 1 }}>
              <Text style={st.aimName}>{aimedAny.type.name.toUpperCase()}</Text>
              <Text style={st.aimSub}>
                {outOfRange
                  ? `사거리 밖 ${aimDist.toFixed(0)}m / ${Config.gunRangeM}m`
                  : `${aimDist.toFixed(0)}m · ${aimedAny.type.speedKmh}km/h`}
              </Text>
            </View>
            <View style={st.hpDots}>
              {Array.from({ length: aimedAny.type.hp }).map((_, i) => (
                <View key={i} style={[st.hpDot, { backgroundColor: i < aimedAny.hp ? C.red : A.t16 }]} />
              ))}
            </View>
          </Glass>
        </View>
      )}

      {/* 탭 안내 */}
      <View pointerEvents="none" style={st.tapHintWrap}>
        <Text style={st.tapHint}>화면 탭 — 사격 · 소음 120m</Text>
      </View>

      {/* 방향 안내 — 가장 가까운 좀비가 어느 쪽인지 */}
      {hint && (
        <View pointerEvents="none" style={st.hintWrap}>
          <Text style={st.hintText}>{hint}</Text>
        </View>
      )}

      {/* 초근접 — 화면 테두리가 붉어진다 */}
      {snap.nearestChaserM < 30 && (
        <View pointerEvents="none" style={[StyleSheet.absoluteFill, {
          borderWidth: 8,
          borderColor: `rgba(255,46,91,${Math.min(0.6, (30 - snap.nearestChaserM) / 30)})`,
        }]} />
      )}

      {/* 하단 조작 — 사격은 화면 탭이므로 버튼은 이탈 하나뿐이다 (design/v2 Ar) */}
      <View style={st.bottomBar}>
        <Pressable onPress={onExit} style={{ flex: 1 }}>
          <LinearGradient colors={['rgba(62,78,126,0.92)', 'rgba(24,32,58,0.94)']} style={st.pillBtn}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={C.white}
              strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M3 6.4 10.2 3.2 13.8 5 21 2.4v15.2L13.8 20.2 10.2 18.4 3 21.6V6.4Z" />
              <Path d="M10.2 3.2v15.2M13.8 5v15.2" />
            </Svg>
            <Text style={st.pillText}>지도 뷰</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

/** 명중 시 조준선에 잠깐 뜨는 X자 히트마커 */
function HitMarker({ seq }: { seq: number }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (seq === 0) return;
    a.setValue(1);
    Animated.timing(a, { toValue: 0, duration: 320, easing: Easing.out(Easing.quad), useNativeDriver: true })
      .start();
  }, [seq, a]);
  return (
    <Animated.View pointerEvents="none" style={[st.hitWrap, {
      opacity: a,
      transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [1.6, 0.9] }) }],
    }]}>
      {[45, -45].map(deg => (
        <View key={deg} style={[st.hitBar, { transform: [{ rotate: `${deg}deg` }] }]} />
      ))}
    </Animated.View>
  );
}

/** 처치 표시 — 맞춘 직후 크게 떴다 사라진다 (design/v2 Fire) */
function KillBanner({ seq, name }: { seq: number; name: string }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (seq === 0) return;
    a.setValue(1);
    Animated.timing(a, { toValue: 0, duration: 950, easing: Easing.in(Easing.quad), useNativeDriver: true })
      .start();
  }, [seq, a]);
  if (!name) return null;
  return (
    <Animated.View pointerEvents="none" style={[st.killWrap, {
      opacity: a,
      transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [1.3, 1] }) }],
    }]}>
      <Text style={st.killTitle}>처치</Text>
      <Text style={st.killSub}>{name.toUpperCase()} · 1발</Text>
    </Animated.View>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  center: { alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 34 },
  permText: { fontFamily: F.sb, fontSize: 14.5, color: C.white, textAlign: 'center', lineHeight: 21 },
  permBtn: {
    backgroundColor: C.cyan, borderRadius: R.md, paddingVertical: 14, paddingHorizontal: 26,
  },
  permBtnText: { fontFamily: F.eb, fontSize: 14.5, color: C.onCyan },
  exitLink: { fontFamily: F.sb, fontSize: 13, color: A.t50, marginTop: 6 },

  // 상단 — 지도 뷰와 같은 좌표 (design/v2 statbar: top 58 / left·right 12)
  statBar: { position: 'absolute', top: 58, left: 12, right: 12 },
  chipWrap: { position: 'absolute', top: 168, left: 0, right: 0, alignItems: 'center' },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 20, paddingVertical: 7, paddingLeft: 11, paddingRight: 15,
    borderWidth: 1, borderColor: A.t16,
    shadowColor: C.red, shadowOpacity: 0.38, shadowRadius: 11,
    shadowOffset: { width: 0, height: 8 }, elevation: 8,
  },
  chipText: { fontFamily: F.b, fontSize: 13.5, color: C.white, letterSpacing: 0.2 },
  stopChip: { flexDirection: 'row', alignItems: 'center', gap: 7, paddingVertical: 6, paddingHorizontal: 13 },
  stopDot: {
    width: 7, height: 7, borderRadius: 4, backgroundColor: C.cyan,
    shadowColor: C.cyan, shadowOpacity: 0.9, shadowRadius: 6, shadowOffset: { width: 0, height: 0 },
  },
  stopTxt: { fontFamily: F.b, fontSize: 11.5, color: C.white },

  // 총성 파동 · 총구 화염
  noiseWrap: {
    position: 'absolute', top: '58%', left: 0, right: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  noiseRing: {
    position: 'absolute', borderWidth: 2, borderColor: C.amber, borderRadius: R.pill, opacity: 0.55,
  },
  muzzleWrap: {
    position: 'absolute', bottom: 96, left: 0, right: 0, alignItems: 'center', justifyContent: 'center',
  },
  muzzleCore: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#FFF3C4' },
  muzzleGlow: {
    position: 'absolute', width: 128, height: 128, borderRadius: 64,
    backgroundColor: 'rgba(255,155,47,0.33)',
  },

  // 조준 — 화면 정중앙이 총알이 나가는 지점
  ringWrap: {
    position: 'absolute', top: '50%', left: '50%', width: 96, height: 96,
    marginLeft: -48, marginTop: -48, alignItems: 'center', justifyContent: 'center',
  },
  hitWrap: {
    position: 'absolute', top: '50%', left: '50%', width: 34, height: 34,
    marginLeft: -17, marginTop: -17, alignItems: 'center', justifyContent: 'center',
  },
  hitBar: { position: 'absolute', width: 26, height: 3, borderRadius: 2, backgroundColor: C.red },

  // 처치 표시 — 조준 링 위쪽
  killWrap: { position: 'absolute', top: '38%', left: 0, right: 0, alignItems: 'center' },
  killTitle: {
    fontFamily: F.eb, fontSize: 30, letterSpacing: -1, color: C.red,
    textShadowColor: 'rgba(255,46,91,0.7)', textShadowRadius: 14, textShadowOffset: { width: 0, height: 2 },
  },
  killSub: { fontFamily: F.b, fontSize: 13, color: C.white, marginTop: 2 },

  // 조준 대상 카드 — 링 아래, 탭 안내 위
  aimCardWrap: { position: 'absolute', top: '50%', marginTop: 58, left: 0, right: 0, alignItems: 'center' },
  aimCard: {
    width: 214, flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 10, paddingHorizontal: 13,
    borderLeftWidth: 3, borderLeftColor: C.red,
  },
  aimName: { fontFamily: F.eb, fontSize: 14, letterSpacing: 0.3, color: C.white },
  aimSub: { fontFamily: F.sb, fontSize: 11, color: A.t52, marginTop: 1 },
  hpDots: { flexDirection: 'row', gap: 4 },
  hpDot: { width: 9, height: 9, borderRadius: 5 },

  tapHintWrap: { position: 'absolute', top: '50%', marginTop: 126, left: 0, right: 0, alignItems: 'center' },
  tapHint: { fontFamily: F.sb, fontSize: 11, color: A.t52 },
  hintWrap: { position: 'absolute', top: 212, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 24 },
  hintText: { fontFamily: F.sb, fontSize: 11.5, color: A.t50, textAlign: 'center' },

  // 화면 밖 추격자 에지
  edgeLWrap: { position: 'absolute', left: 0, top: '38%', height: 190, width: 30 },
  edgeRWrap: { position: 'absolute', right: 0, top: '58%', height: 164, width: 30 },
  edgeGlow: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, opacity: 0.22 },
  edgeBar: { position: 'absolute', top: 0, bottom: 0, left: 0, width: 5, borderRadius: 2.5 },
  edgeBarR: { left: undefined, right: 0 },
  edgeLabel: {
    position: 'absolute', top: -16, fontFamily: F.b, fontSize: 11,
    color: C.redSoft, letterSpacing: 0.4,
  },

  // 하단 조작 — 디자인의 알약 버튼
  bottomBar: { position: 'absolute', bottom: 38, left: 16, right: 16, flexDirection: 'row', gap: 10 },
  pillBtn: {
    height: 62, borderRadius: 31,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9,
    borderWidth: 1, borderColor: A.t16,
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  pillText: { fontFamily: F.b, fontSize: 15, color: C.white },
});
