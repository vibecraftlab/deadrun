/**
 * 타일 굽기 — 범위를 z13 격자로 나누고 타일마다 .drmp를 만든다.
 *
 *  타일 경계에서 도로가 끊기면 그 지점에서 길찾기가 막힌다. 그래서 타일마다
 *  가장자리를 조금 넘겨(overlapM) 받는다. 겹치는 도로는 이웃 타일에도 들어가지만,
 *  읽는 쪽에서 도로 그래프가 0.5m 격자로 노드를 병합하므로 자동으로 이어진다.
 */
import fs from 'fs';
import path from 'path';
import { LatLon } from './geo';
import { encodePack, RoadWay } from './format';
import { fetchBuildings, fetchRoads, FetchOptions, BBox } from './osm';
import {
  TileId, tileCenter, tileEast, tileNorth, tileSouth, tileWest, tileSideMeters,
} from './tiles';

export interface BakeOptions extends FetchOptions {
  outDir: string;
  version: string;
  includeBuildings?: boolean;
  /** 타일 경계를 넘겨 받는 여유 폭(m). 경계에서 길이 끊기는 것을 막는다 */
  overlapM?: number;
  /** 이미 만들어진 타일은 건너뛴다 — 중단 후 이어서 굽기 */
  resume?: boolean;
  /** 타일 사이 대기(ms). 공용 Overpass에 대한 예의이자 504 회피 */
  politeDelayMs?: number;
}

export interface TileResult {
  tile: TileId;
  file: string;
  bytes: number;
  roads: number;
  buildings: number;
  skipped?: 'empty' | 'cached';
}

const padTile = (t: TileId) => path.join(String(t.z), String(t.x), `${t.y}.drmp`);

export function tileBBox(t: TileId, padM: number): BBox {
  const latPad = (padM / 6378137) * (180 / Math.PI);
  const c = tileCenter(t);
  const lonPad = latPad / Math.cos((c.lat * Math.PI) / 180);
  return {
    west: tileWest(t) - lonPad, east: tileEast(t) + lonPad,
    south: tileSouth(t) - latPad, north: tileNorth(t) + latPad,
  };
}

/** 타일 하나를 굽는다. 데이터가 없으면 파일을 만들지 않는다(바다·산속) */
export async function bakeTile(t: TileId, opt: BakeOptions): Promise<TileResult> {
  const rel = padTile(t);
  const file = path.join(opt.outDir, opt.version, rel);
  if (opt.resume && fs.existsSync(file)) {
    const bytes = fs.statSync(file).size;
    return { tile: t, file: rel, bytes, roads: -1, buildings: -1, skipped: 'cached' };
  }

  // 기준점은 타일 중심. 좌표가 원점 주변에 모여 차분 인코딩이 가장 짧아진다.
  const origin: LatLon = tileCenter(t);
  const bbox = tileBBox(t, opt.overlapM ?? 60);

  const ways: RoadWay[] = await fetchRoads(bbox, origin, opt);
  let builds: { x: number; y: number }[][] = [];
  if (opt.includeBuildings !== false && ways.length > 0) {
    try {
      builds = await fetchBuildings(bbox, origin, opt);
    } catch (e) {
      opt.log?.(`    건물 실패(도로만 저장): ${String(e)}`);
    }
  }

  if (ways.length === 0) return { tile: t, file: rel, bytes: 0, roads: 0, buildings: 0, skipped: 'empty' };

  const bin = encodePack(origin, ways, builds, { tile: t });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, bin);
  return { tile: t, file: rel, bytes: bin.byteLength, roads: ways.length, buildings: builds.length };
}

export interface Manifest {
  format: 'drmp';
  formatVersion: number;
  version: string;
  zoom: number;
  tilePath: string;
  builtAt: string;
  tileCount: number;
  totalBytes: number;
  bbox: BBox;
  attribution: string;
  license: string;
  /** 실제로 데이터가 있는 타일만. 없는 타일은 받을 필요가 없다 */
  tiles: Record<string, number>;
}

/** 출력 폴더를 훑어 실제 존재하는 타일 목록을 만든다 */
export function scanTiles(outDir: string, version: string): TileResult[] {
  const root = path.join(outDir, version);
  const out: TileResult[] = [];
  if (!fs.existsSync(root)) return out;
  for (const zd of fs.readdirSync(root)) {
    const zp = path.join(root, zd);
    if (!fs.statSync(zp).isDirectory()) continue;
    for (const xd of fs.readdirSync(zp)) {
      const xp = path.join(zp, xd);
      if (!fs.statSync(xp).isDirectory()) continue;
      for (const yf of fs.readdirSync(xp)) {
        if (!yf.endsWith('.drmp')) continue;
        const tile = { z: Number(zd), x: Number(xd), y: Number(yf.replace('.drmp', '')) };
        if (isNaN(tile.z) || isNaN(tile.x) || isNaN(tile.y)) continue;
        out.push({
          tile, file: `${zd}/${xd}/${yf}`,
          bytes: fs.statSync(path.join(xp, yf)).size,
          roads: -1, buildings: -1,
        });
      }
    }
  }
  return out;
}

/**
 * 매니페스트를 타일 하나 구울 때마다 갱신하기 위한 누적기.
 *
 *  매번 출력 폴더를 다시 훑으면 타일 수의 제곱으로 느려진다(전국 5,000장이면 치명적).
 *  시작할 때 한 번만 훑어 메모리에 들고, 이후에는 항목만 갱신해 바로 쓴다.
 *
 *  쓰기는 임시 파일에 쓴 뒤 이름을 바꾸는 방식이다. 앱이 굽는 도중에
 *  latest.json 을 받아가면 반쯤 쓰인 JSON을 읽을 수 있기 때문이다.
 */
export class ManifestWriter {
  private tiles = new Map<string, number>();

  constructor(
    private readonly outDir: string,
    private readonly version: string,
    private readonly zoom: number,
    private readonly bbox: BBox,
  ) {
    for (const r of scanTiles(outDir, version))
      if (r.bytes > 0) this.tiles.set(`${r.tile.z}/${r.tile.x}/${r.tile.y}`, r.bytes);
  }

  add(t: TileId, bytes: number) {
    if (bytes > 0) this.tiles.set(`${t.z}/${t.x}/${t.y}`, bytes);
  }

  get count(): number { return this.tiles.size; }
  get bytes(): number { let s = 0; for (const v of this.tiles.values()) s += v; return s; }

  build(): Manifest {
    return {
      format: 'drmp',
      formatVersion: 1,
      version: this.version,
      zoom: this.zoom,
      tilePath: `${this.version}/{z}/{x}/{y}.drmp`,
      builtAt: new Date().toISOString(),
      tileCount: this.tiles.size,
      totalBytes: this.bytes,
      bbox: this.bbox,
      attribution: '© OpenStreetMap contributors',
      license: 'ODbL 1.0',
      tiles: Object.fromEntries([...this.tiles].sort(([a], [b]) => (a < b ? -1 : 1))),
    };
  }

  /** 임시 파일 → 이름 바꾸기. 읽는 쪽이 잘린 JSON을 보지 않게 한다 */
  write(): Manifest {
    const m = this.build();
    fs.mkdirSync(this.outDir, { recursive: true });
    const target = path.join(this.outDir, 'latest.json');
    const tmp = target + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(m, null, 2));
    fs.renameSync(tmp, target);
    return m;
  }
}

export function writeManifest(
  outDir: string, version: string, zoom: number, bbox: BBox, results: TileResult[],
): Manifest {
  const tiles: Record<string, number> = {};
  let total = 0;
  for (const r of results) {
    if (r.bytes <= 0) continue;
    tiles[`${r.tile.z}/${r.tile.x}/${r.tile.y}`] = r.bytes;
    total += r.bytes;
  }
  const manifest: Manifest = {
    format: 'drmp',
    formatVersion: 1,
    version,
    zoom,
    tilePath: `${version}/{z}/{x}/{y}.drmp`,
    builtAt: new Date().toISOString(),
    tileCount: Object.keys(tiles).length,
    totalBytes: total,
    bbox,
    attribution: '© OpenStreetMap contributors',
    license: 'ODbL 1.0',
    tiles,
  };
  fs.mkdirSync(outDir, { recursive: true });
  const target = path.join(outDir, 'latest.json');
  fs.writeFileSync(target + '.tmp', JSON.stringify(manifest, null, 2));
  fs.renameSync(target + '.tmp', target);
  return manifest;
}
