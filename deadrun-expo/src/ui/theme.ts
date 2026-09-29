/**
 * DEADRUN 디자인 토큰 — design/v2 기준.
 *
 *  ⚠ 여기 없는 색·크기를 새로 쓰기 전에, 기존 토큰으로 안 되는 이유부터 확인할 것.
 *    (design/v2 의 note-tokens 지침)
 *
 *  값은 design/v2/ui.mjs 와 각 화면 템플릿에서 실제로 쓰인 것을 옮겼다.
 *  디자인을 고치면 여기부터 맞춘다 — 화면마다 흩어놓지 않는다.
 */
import type { TextStyle, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** 키 이름은 유지하면서 값이 RN 스타일로 유효한지 검사받게 하는 도우미 */
const text = <K extends Record<string, TextStyle>>(o: K): K => o;
const view = <K extends Record<string, ViewStyle>>(o: K): K => o;

export const C = {
  /** 바탕 — 거의 검정에 가까운 남색 */
  bg: '#070A14',
  bgDeep: '#0A0E1C',
  bgCard: '#0B1020',

  /** 주 강조 — 시안. 플레이어·진행·긍정 */
  cyan: '#2FD9FF',
  cyanLight: '#5FE4FF',
  cyanPale: '#7FEBFF',
  cyanDeep: '#0E96D2',
  cyanDark: '#1BA8D8',
  /** 시안 배경 위에 올리는 글자색 (버튼 라벨) */
  onCyan: '#062330',

  /** 위험 — 피격·HP·좀비 추격 */
  red: '#FF2E5B',
  redSoft: '#FF7D9B',
  redDeep: '#C4143A',
  redZombie: '#E33232',

  /** 자원 — 탄약·보급·광고 보상 */
  amber: '#FFC53D',
  amberDeep: '#231A02',

  /** 생존·회복 */
  green: '#7CFF5B',

  /** 홈 상단 글로우 */
  glowTop: '#16385A',

  white: '#FFFFFF',
} as const;

/** 흰색 투명도 단계 — 글자 위계를 색이 아니라 투명도로 만든다 */
export const A = {
  t100: 'rgba(255,255,255,1)',
  t62: 'rgba(255,255,255,0.62)',
  t52: 'rgba(255,255,255,0.52)',
  t50: 'rgba(255,255,255,0.50)',
  t48: 'rgba(255,255,255,0.48)',
  t45: 'rgba(255,255,255,0.45)',
  t42: 'rgba(255,255,255,0.42)',
  t34: 'rgba(255,255,255,0.34)',
  t16: 'rgba(255,255,255,0.16)',
  t15: 'rgba(255,255,255,0.15)',
  t14: 'rgba(255,255,255,0.14)',
  t10: 'rgba(255,255,255,0.10)',
  t09: 'rgba(255,255,255,0.09)',
  t07: 'rgba(255,255,255,0.07)',
  t06: 'rgba(255,255,255,0.06)',
} as const;

/** 글래스 카드 — 반투명 + 블러 + 안쪽 하이라이트 */
export const GLASS = {
  bg: 'rgba(11,16,32,0.74)',
  border: A.t10,
  /** expo-blur 강도 (0~100) */
  blur: 24,
} as const;

/** 모서리 반경 — 카드 크기에 따라 셋 중 하나만 쓴다 */
export const R = {
  sm: 9,
  md: 16,
  lg: 18,
  xl: 22,
  pill: 999,
} as const;

/**
 * 서체 — Outfit.
 * 웹폰트라 로드 전에는 시스템 폰트로 보인다. App에서 useAppFonts()로 기다린다.
 */
export const F = {
  r: 'Outfit_400Regular',
  m: 'Outfit_500Medium',
  sb: 'Outfit_600SemiBold',
  b: 'Outfit_700Bold',
  eb: 'Outfit_800ExtraBold',
} as const;

/** 자주 쓰는 글자 스타일 — ui.mjs 의 .stat-lbl / .stat-val / .eyebrow 대응 */
export const T = text({
  /** 통계 라벨 — 아주 작고 넓은 자간의 대문자 */
  statLabel: {
    fontFamily: F.b, fontSize: 8.5, letterSpacing: 1.4,
    color: A.t48, textTransform: 'uppercase',
  },
  /** 통계 숫자 — 화면에서 가장 큰 숫자 */
  statValue: {
    fontFamily: F.eb, fontSize: 27, lineHeight: 29, letterSpacing: -0.8,
    color: C.white, fontVariant: ['tabular-nums'],
  },
  statUnit: { fontFamily: F.sb, fontSize: 11, color: A.t45 },
  statSub: {
    fontFamily: F.sb, fontSize: 9.5, color: A.t52,
    fontVariant: ['tabular-nums'],
  },
  /** 섹션 머리말 */
  eyebrow: {
    fontFamily: F.b, fontSize: 9, letterSpacing: 1.8,
    color: A.t42, textTransform: 'uppercase',
  },
  /** 카드 제목 */
  cardTitle: { fontFamily: F.b, fontSize: 14, color: C.white },
  /** 카드 설명 */
  cardBody: { fontFamily: F.r, fontSize: 11, color: A.t45, lineHeight: 16 },
  /** 화면 제목 */
  title: { fontFamily: F.eb, fontSize: 30, letterSpacing: -1, color: C.white },
});

/** 그림자 — 글래스 카드가 떠 보이게 */
export const SHADOW = view({
  card: {
    shadowColor: '#000', shadowOpacity: 0.55, shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 }, elevation: 8,
  },
  button: {
    shadowColor: '#000', shadowOpacity: 0.5, shadowRadius: 13,
    shadowOffset: { width: 0, height: 8 }, elevation: 6,
  },
});

/** 화면 공통 여백 */
export const PAD = { screen: 22, top: 62, bottom: 30 } as const;

/**
 * 시스템 바를 피한 화면 여백.
 *
 *  안드로이드는 앱이 내비게이션 바(제스처 바 또는 3버튼) 아래까지 그려진다.
 *  PAD 의 고정값만 쓰면 하단 버튼이 그 바에 깔려 눌리지 않는다.
 *  기기가 알려주는 실제 여백과 디자인 값 중 큰 쪽을 쓴다 —
 *  바가 없는 기기에서는 디자인대로, 있는 기기에서는 그만큼 더 띄운다.
 */
export function useSafePad() {
  const insets = useSafeAreaInsets();
  return {
    top: Math.max(PAD.top, insets.top + 18),
    bottom: Math.max(PAD.bottom, insets.bottom + 12),
    /** 바로 그 바만큼만 — 이미 자체 여백이 있는 곳에 더해 쓴다 */
    navBar: insets.bottom,
    left: insets.left,
    right: insets.right,
  };
}
