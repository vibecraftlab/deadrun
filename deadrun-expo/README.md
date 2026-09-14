# DEADRUN — Expo 프로토타입 (L1 유사 AR)

GPS 좀비 서바이벌 러닝 게임의 **React Native / Expo 구현체**.
Unity P0 프로토타입(`../deadrun-proto`)의 코어 로직을 TypeScript로 포팅하고,
**expo-camera + expo-sensors + three.js(expo-gl)** 로 유사 AR 전투 뷰를 구현했다.

> 기획서: 구글 드라이브 `obsidian/projects/zombie-runner/wiki/`
> 플랫폼 결정(ADR-001)은 여전히 Unity — 이 프로젝트는 "Expo로 어디까지 되는가" 검증용 병행 실험.

## 실행 (Expo Go — dev build 불필요)

```bash
npm install
npx expo start
```

폰에 **Expo Go** 앱 설치 → 터미널의 QR 코드 스캔. (전부 Expo SDK 내장 모듈이라 Expo Go에서 바로 실행됨)

## 플레이 모드

| 모드 | 설명 |
|---|---|
| **실내 가상 모드** (기본) | 여의도공원 OSM 실도로 위를 화면 조이스틱으로 이동. 소파에서 전체 루프 테스트 가능. 가상 GPS에 4m 노이즈 주입 → 필터 스택 검증 |
| **GPS 런** (실외) | 현재 위치 주변 실제 도로 로드, 진짜 달리면서 플레이 |

- Overpass(OSM) 로드 실패/오프라인 시 합성 격자 도시로 자동 폴백
- 좀비 4종 (워커/러너/스토커/브루트) — GDD §4.2 수치, 도로 그래프 A* 추격
- 포착 8m·3초 → **화면 연타 QTE** 탈출 (세션당 1회, 브루트는 즉사)
- 탄약은 이동 거리 500m마다 보급 (달려야 산다)
- 위협 단계별 **햅틱 경고** (경계/추격/포착임박 — 원 컨셉 #4)
- 지도 뷰: 정지 상태(<1km/h)에서만 **AR 버튼** 활성 (안전 필러)

## AR 전투 뷰 (L1 유사 AR)

- **배경**: expo-camera 실시간 영상
- **시점**: 나침반(`watchHeadingAsync`) = yaw, DeviceMotion = pitch
- **렌더**: expo-gl 투명 컨텍스트 위 three.js — 좀비가 실거리·실방위에 3D로 서서 걸어옴 (걸음 바운스 + 추격 기울기, 스토커 깜빡임)
- **조작**: 화면 탭 = 사격(소음→120m 어그로), 근접 버튼 = 4m 참격
- 이동 감지(3km/h, 2초) 시 자동으로 지도 뷰 복귀

### 한계 (L1이라서)

SLAM 앵커가 없어 좀비가 지면에 "붙어" 있지 않고 방위·거리 기반으로만 배치됨 → 폰을 흔들면 미세하게 떠다님. 오클루전/조명 추정 없음. **진짜 AR로 올리려면**:

```bash
npx expo install @reactvision/react-viro
npx expo prebuild && eas build --profile development
```

→ `ArScreen.tsx`만 ViroARSceneNavigator 기반으로 교체하면 됨 (게임 코어는 무수정).

## 구조

```
src/
├─ core/        # 순수 TS, React 비의존 — Unity Core의 1:1 포팅
│   geo, roadGraph(공간해시), astar, zombies(상태기계), locationFilter, syntheticMap, rules
├─ services/    # overpass(OSM fetch), locationSource(GPS/가상)
├─ game/        # game.ts(오케스트레이션), useGame(훅: 10Hz 틱+햅틱)
└─ screens/     # MapScreen(SVG 탑다운), ArScreen(camera+GL+three)
```

## 검증

```bash
npx tsc --noEmit             # 타입 체크
npx tsx scripts/smoke.ts     # 코어 헤드리스 테스트 14항목 (Unity 버전과 동일 시나리오)
npx expo export --platform android   # 번들 빌드 확인
```

## Unity 버전과의 비교 목적

| 관점 | Unity (`deadrun-proto`) | Expo (이 프로젝트) |
|---|---|---|
| AR 사다리 | AR Foundation → SLAM/오클루전/VPS 가능 | L1 유사 AR까지, 이후 ViroReact 의존 |
| 좀비 시뮬 성능 | C# 200개 60fps | JS 10Hz 틱 120개 (충분하나 상한 낮음) |
| 개발 이터레이션 | 에디터 재생 | Expo Go 핫리로드 (폰에서 즉시) |
| 지도 렌더 | 커스텀 메시 | react-native-svg |
