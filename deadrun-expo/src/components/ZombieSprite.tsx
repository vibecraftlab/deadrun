import React from 'react';
import { G, Image as SvgImage } from 'react-native-svg';
import {
  artState, artType, GROUND_FRAC, MAP_HEIGHT_M, MAP_WIDTH_M, sprite,
} from './zombieArt';

/**
 * 지도용 좀비 — 디자인 아트(design/v2)를 구운 PNG 한 장으로 그린다.
 *
 *  좀비당 노드 1개다. 벡터 그대로 그리면 마리당 path 20~30개라
 *  수십 마리가 뜨는 지도에서는 감당이 안 된다.
 *
 *  위에서 내려다보는 지도라 정면/뒷모습은 뜻이 없다. 측면만 쓰고,
 *  동쪽으로 가면 오른쪽을 보도록 뒤집는다 (아트의 side 는 왼쪽을 본다).
 *  발밑 글로우 원이 곧 좀비의 실제 위치다.
 */

interface Props {
  /** ENU 미터 */
  x: number;
  y: number;
  /** 시뮬 타입 이름 (Walker | Runner | Stalker | Brute) */
  name: string;
  /** 시뮬 상태 — chase 면 붉은 아트 */
  state: string;
  /** 바라보는 방위 (rad, 북 기준 시계방향) */
  heading: number;
}

export default function ZombieSprite({ x, y, name, state, heading }: Props) {
  const aggro = state === 'chase';
  const scale = aggro ? 1.12 : 1;
  const w = MAP_WIDTH_M * scale;
  const h = MAP_HEIGHT_M * scale;

  // SVG는 y가 아래로 증가한다. 발이 (x, y)에 닿게 상자를 위로 올린다.
  const left = x - w / 2;
  const top = -y - h * GROUND_FRAC;

  const img = (
    <SvgImage
      x={left}
      y={top}
      width={w}
      height={h}
      href={sprite(artType(name), artState(state), 'side')}
      preserveAspectRatio="xMidYMid meet"
    />
  );

  // 동쪽(sin > 0)으로 향하면 오른쪽을 보게 뒤집는다
  if (Math.sin(heading) > 0) {
    return <G transform={`translate(${x * 2} 0) scale(-1 1)`}>{img}</G>;
  }
  return img;
}
