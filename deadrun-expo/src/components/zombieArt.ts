/**
 * 디자인 좀비 아트(design/v2 zombie.mjs)를 구운 스프라이트 — 지도와 AR이 함께 쓴다.
 *
 *  PNG는 `npm run gen:zombies` 로 생성한다. 아트를 고치려면 design/v2/zombie.mjs 를
 *  고치고 다시 굽는다. 규격(상자·이름·크기 환산)은 zombieArtSpec.ts 에 있다 —
 *  굽는 스크립트가 PNG 없이도 읽을 수 있어야 하기 때문이다.
 */
import { SpriteState, SpriteType, SpriteView } from './zombieArtSpec';

export * from './zombieArtSpec';

/** Metro 정적 번들링 때문에 require 경로는 리터럴이어야 한다 */
const PNG: Record<string, number> = {
  'walker-roam-front': require('../../assets/zombies/png/zombie-walker-roam-front.png'),
  'walker-roam-side': require('../../assets/zombies/png/zombie-walker-roam-side.png'),
  'walker-roam-back': require('../../assets/zombies/png/zombie-walker-roam-back.png'),
  'walker-chase-front': require('../../assets/zombies/png/zombie-walker-chase-front.png'),
  'walker-chase-side': require('../../assets/zombies/png/zombie-walker-chase-side.png'),
  'walker-chase-back': require('../../assets/zombies/png/zombie-walker-chase-back.png'),
  'walker-dark-front': require('../../assets/zombies/png/zombie-walker-dark-front.png'),
  'walker-dark-side': require('../../assets/zombies/png/zombie-walker-dark-side.png'),
  'walker-dark-back': require('../../assets/zombies/png/zombie-walker-dark-back.png'),

  'runner-roam-front': require('../../assets/zombies/png/zombie-runner-roam-front.png'),
  'runner-roam-side': require('../../assets/zombies/png/zombie-runner-roam-side.png'),
  'runner-roam-back': require('../../assets/zombies/png/zombie-runner-roam-back.png'),
  'runner-chase-front': require('../../assets/zombies/png/zombie-runner-chase-front.png'),
  'runner-chase-side': require('../../assets/zombies/png/zombie-runner-chase-side.png'),
  'runner-chase-back': require('../../assets/zombies/png/zombie-runner-chase-back.png'),
  'runner-dark-front': require('../../assets/zombies/png/zombie-runner-dark-front.png'),
  'runner-dark-side': require('../../assets/zombies/png/zombie-runner-dark-side.png'),
  'runner-dark-back': require('../../assets/zombies/png/zombie-runner-dark-back.png'),

  'stalker-roam-front': require('../../assets/zombies/png/zombie-stalker-roam-front.png'),
  'stalker-roam-side': require('../../assets/zombies/png/zombie-stalker-roam-side.png'),
  'stalker-roam-back': require('../../assets/zombies/png/zombie-stalker-roam-back.png'),
  'stalker-chase-front': require('../../assets/zombies/png/zombie-stalker-chase-front.png'),
  'stalker-chase-side': require('../../assets/zombies/png/zombie-stalker-chase-side.png'),
  'stalker-chase-back': require('../../assets/zombies/png/zombie-stalker-chase-back.png'),
  'stalker-dark-front': require('../../assets/zombies/png/zombie-stalker-dark-front.png'),
  'stalker-dark-side': require('../../assets/zombies/png/zombie-stalker-dark-side.png'),
  'stalker-dark-back': require('../../assets/zombies/png/zombie-stalker-dark-back.png'),

  'brute-roam-front': require('../../assets/zombies/png/zombie-brute-roam-front.png'),
  'brute-roam-side': require('../../assets/zombies/png/zombie-brute-roam-side.png'),
  'brute-roam-back': require('../../assets/zombies/png/zombie-brute-roam-back.png'),
  'brute-chase-front': require('../../assets/zombies/png/zombie-brute-chase-front.png'),
  'brute-chase-side': require('../../assets/zombies/png/zombie-brute-chase-side.png'),
  'brute-chase-back': require('../../assets/zombies/png/zombie-brute-chase-back.png'),
  'brute-dark-front': require('../../assets/zombies/png/zombie-brute-dark-front.png'),
  'brute-dark-side': require('../../assets/zombies/png/zombie-brute-dark-side.png'),
  'brute-dark-back': require('../../assets/zombies/png/zombie-brute-dark-back.png'),
};

export const sprite = (type: SpriteType, state: SpriteState, view: SpriteView): number =>
  PNG[`${type}-${state}-${view}`];
