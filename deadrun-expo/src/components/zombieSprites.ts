/**
 * 좀비 픽셀맵 — 이제 앱은 이 그림을 그리지 않는다.
 *
 *  앱의 좀비는 design/v2 의 벡터 아트를 구운 스프라이트로 바뀌었다
 *  (src/components/zombieArt.ts). 이 파일이 남아 있는 이유는 하나다:
 *  design/build.mjs (v1 캔버스)가 이 픽셀맵을 직접 읽어 시트를 그린다.
 *  지우면 그 빌드가 깨진다.
 */
export interface SpriteDef {
  rows: string[];
  palette: Record<string, string>;
}

export const AGGRO_PALETTE: Record<string, string> = {
  B: '#e33232',
  D: '#8f1a1a',
  E: '#fff200',
  H: '#c22525',
};

export const ZOMBIE_SPRITES: Record<string, SpriteDef> = {
  /** 워커: 정면, 양팔을 수평으로 뻗은 클래식 좀비 */
  Walker: {
    palette: { B: '#3ddc6a', D: '#1e7a3c', E: '#d81f1f', H: '#2eb956' },
    rows: [
      '....BBBB....',
      '...BBBBBB...',
      '...BEBBEB...',
      '...BBBBBB...',
      '....BDDB....',
      'BB.BBBBBB.BB',
      'HB.BBDDBB.BH',
      '...BBBBBB...',
      '...BDBBDB...',
      '....BBBB....',
      '....B..B....',
      '...BB..BB...',
    ],
  },
  /** 러너: 상체를 기울이고 한 팔을 앞으로 뻗은 질주 자세 */
  Runner: {
    palette: { B: '#9be24f', D: '#4f8a1f', E: '#d81f1f', H: '#7cc93b' },
    rows: [
      '.....BBBB...',
      '....BBBBBB..',
      '....BEBBEB..',
      '.....BBBB...',
      '..B...BDB...',
      '..BB.BBBBBBH',
      '...B.BBDDB..',
      '.....BBBB...',
      '....BBDBB...',
      '....BB.BB...',
      '...BB...BB..',
      '..BB.....BB.',
    ],
  },
  /** 스토커: 낮게 웅크린 넓은 실루엣, 보라색 발광 눈 */
  Stalker: {
    palette: { B: '#5f8f77', D: '#31584a', E: '#b74ddb', H: '#4a7a63' },
    rows: [
      '............',
      '...BBBBBB...',
      '..BBBBBBBB..',
      '.BBEBBBBEBB.',
      '.BBBBDDBBBB.',
      '.BB.BBBB.BB.',
      '.HB.BDDB.BH.',
      '....BBBB....',
      '....BDDB....',
      '...BB..BB...',
      '..BB....BB..',
      '............',
    ],
  },
  /** 브루트: 작은 머리 + 거대한 어깨/주먹, 14×14로 한 덩치 큼 */
  Brute: {
    palette: { B: '#b32020', D: '#6b1010', E: '#ffb300', H: '#8f1a1a' },
    rows: [
      '.....BBBB.....',
      '.....BEEB.....',
      '..BBBBBBBBBB..',
      '.BBBBBBBBBBBB.',
      '.BBBBBDDBBBBB.',
      '.BBB.BBBB.BBB.',
      '.HBB.BDDB.BBH.',
      '.BBB.BBBB.BBB.',
      '....BBBBBB....',
      '....BBDDBB....',
      '....BBBBBB....',
      '....BB..BB....',
      '...BBB..BBB...',
      '...BBB..BBB...',
    ],
  },
};

