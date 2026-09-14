/**
 * 참조 클라이언트 — 앱이 지도를 "어떻게 받아서 어떻게 쓰는지"의 본체.
 *
 *  ── 원리 ────────────────────────────────────────────────────
 *   ① 내 위치 → 타일 번호를 계산한다 (검색이 아니라 산수다)
 *   ② 저장소에 그 타일이 있으면 네트워크를 쓰지 않는다
 *   ③ 없으면 https://…/v1/13/6982/3172.drmp 를 받아 저장한다 (그냥 정적 파일)
 *   ④ 받은 타일들을 "지금 내 위치" 기준 좌표로 재투영해 하나로 합친다
 *
 *  플랫폼(파일 저장 방식)에 의존하지 않도록 저장소를 인터페이스로 분리했다.
 *  앱에서는 expo-file-system, 테스트에서는 메모리·디스크를 끼우면 된다.
 */
import { LatLon } from './geo';
import { decodePack, MapPack, RoadWay } from './format';
import { DEFAULT_ZOOM, TileId, tileKey, tilesAround } from './tiles';

/** 기기에 파일을 남기는 방법. 앱이 자기 방식대로 구현해 넣는다 */
export interface TileStorage {
  has(key: string): Promise<boolean>;
  read(key: string): Promise<Uint8Array>;
  write(key: string, data: Uint8Array): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface ClientManifest {
  version: string;
  zoom: number;
  tilePath: string;
  attribution: string;
  tiles: Record<string, number>;
}

export interface MapClientOptions {
  /** 정적 호스팅 주소 (끝 슬래시 없이). 예: https://user.github.io/deadrun-maps */
  baseUrl: string;
  storage: TileStorage;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
  log?: (msg: string) => void;
}

export interface LoadResult {
  ways: RoadWay[];
  buildings: { x: number; y: number }[][];
  tiles: TileId[];
  fromCache: number;
  downloaded: number;
  attribution: string;
}

export class MapClient {
  private manifest: ClientManifest | null = null;

  constructor(private readonly o: MapClientOptions) {}

  private get base() { return this.o.baseUrl.replace(/\/+$/, ''); }
  private get f() { return this.o.fetchImpl ?? fetch; }

  private async get(url: string): Promise<Uint8Array> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.o.timeoutMs ?? 20_000);
    try {
      const res = await this.f(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return new Uint8Array(await res.arrayBuffer());
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * 매니페스트를 받아둔다. 어떤 타일이 존재하는지 알려주므로,
   * 바다나 산속처럼 데이터가 없는 타일을 헛되이 요청하지 않게 된다.
   * 네트워크가 없으면 마지막으로 저장해둔 것을 쓴다.
   */
  async loadManifest(): Promise<ClientManifest | null> {
    if (this.manifest) return this.manifest;
    const KEY = 'latest.json';
    try {
      const raw = await this.get(`${this.base}/${KEY}`);
      await this.o.storage.write(KEY, raw);
      this.manifest = JSON.parse(new TextDecoder().decode(raw)) as ClientManifest;
    } catch (e) {
      this.o.log?.(`매니페스트 수신 실패, 캐시 확인: ${String(e)}`);
      try {
        if (await this.o.storage.has(KEY))
          this.manifest = JSON.parse(new TextDecoder().decode(await this.o.storage.read(KEY)));
      } catch { /* 캐시도 없음 */ }
    }
    return this.manifest;
  }

  private tileUrl(t: TileId): string {
    const p = (this.manifest?.tilePath ?? 'v1/{z}/{x}/{y}.drmp')
      .replace('{z}', String(t.z)).replace('{x}', String(t.x)).replace('{y}', String(t.y));
    return `${this.base}/${p}`;
  }

  private storeKey(t: TileId): string {
    return `${this.manifest?.version ?? 'v1'}/${t.z}/${t.x}/${t.y}.drmp`;
  }

  /** 타일 하나를 확보한다 (캐시 우선). 없거나 깨졌으면 null */
  private async ensureTile(t: TileId): Promise<{ data: Uint8Array; cached: boolean } | null> {
    const key = this.storeKey(t);
    try {
      if (await this.o.storage.has(key)) return { data: await this.o.storage.read(key), cached: true };
    } catch { /* 캐시 읽기 실패 → 다시 받는다 */ }

    // 매니페스트가 "없는 타일"이라고 말하면 요청하지 않는다
    const known = this.manifest?.tiles;
    if (known && !(tileKey(t) in known)) return null;

    try {
      const data = await this.get(this.tileUrl(t));
      const expect = known?.[tileKey(t)];
      if (expect && data.byteLength !== expect)
        throw new Error(`크기 불일치 ${data.byteLength}/${expect}`);
      await this.o.storage.write(key, data);
      return { data, cached: false };
    } catch (e) {
      this.o.log?.(`타일 ${tileKey(t)} 실패: ${String(e)}`);
      return null;
    }
  }

  /**
   * 현재 위치 주변을 덮는 타일들을 모아 하나의 지도로 돌려준다.
   * 모든 타일을 같은 playOrigin으로 재투영하므로 좌표계가 하나로 맞춰진다.
   */
  async loadAround(playOrigin: LatLon, radiusM: number): Promise<LoadResult> {
    await this.loadManifest();
    const zoom = this.manifest?.zoom ?? DEFAULT_ZOOM;
    const want = tilesAround(playOrigin, radiusM, zoom);

    const ways: RoadWay[] = [];
    const buildings: { x: number; y: number }[][] = [];
    const got: TileId[] = [];
    let fromCache = 0, downloaded = 0;

    for (const t of want) {
      const r = await this.ensureTile(t);
      if (!r) continue;
      let pack: MapPack;
      try {
        pack = decodePack(r.data, playOrigin);
      } catch (e) {
        // 깨진 캐시는 지워야 다음 실행에서 다시 받는다
        this.o.log?.(`타일 ${tileKey(t)} 디코드 실패: ${String(e)}`);
        try { await this.o.storage.remove(this.storeKey(t)); } catch { /* 무시 */ }
        continue;
      }
      ways.push(...pack.ways);
      buildings.push(...pack.buildings);
      got.push(t);
      if (r.cached) fromCache++; else downloaded++;
    }

    return {
      ways, buildings, tiles: got, fromCache, downloaded,
      attribution: this.manifest?.attribution ?? '© OpenStreetMap contributors',
    };
  }
}
