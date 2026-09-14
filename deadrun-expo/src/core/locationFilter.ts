import { Vec2, dist, add, sub, mul, len, norm } from './geo';
import { RoadGraph } from './roadGraph';
import { Rules } from './rules';

export interface FilteredPose {
  posFiltered: Vec2;
  posSnapped: Vec2;
  snapped: boolean;
  layer: number;
  speedKmh: number;
  vehicleSuspect: boolean;
  locked: boolean; // 정지 잠금 상태 (지도앱식 고정)
}

/**
 * GPS 필터 스택 (상용 지도앱 보정 기법 적용):
 *  ① 정확도 게이트 — accuracy 나쁜 샘플은 측정 보정에서 제외
 *  ② 알파-베타 필터 + 정확도 적응 게인 — 부정확한 샘플일수록 덜 믿음
 *  ③ 정지 잠금(stationary lock) — 서 있으면 위치를 아예 고정 (지도앱이 안 떠는 핵심 비결)
 *  ④ 도로 스냅(map matching) — 그래프 위로 투영
 *  ⑤ 속도 밴드
 * 규약: 새 GPS 샘플(≈1Hz)일 때만 update(), 사이 프레임은 predict().
 */
export class LocationFilter {
  private graph: RoadGraph | null;
  private pos: Vec2 = { x: 0, y: 0 };
  private vel: Vec2 = { x: 0, y: 0 };
  private init = false;
  private speedEma = 0;
  private vehicleTimer = 0;
  private predictedSinceUpdate = 0;

  // 정지 잠금 상태
  private locked = false;
  private lockPos: Vec2 = { x: 0, y: 0 };
  private lockCandidate = 0;   // 연속 저속 샘플 수
  private unlockCandidate = 0; // 연속 이탈 샘플 수
  private rawHistory: { p: Vec2; t: number }[] = []; // 변위 기반 정지 판정용
  private clock = 0;
  /** 현재 붙어 있는 도로 엣지 (스냅 히스테리시스용). -1 = 도로에서 떨어짐 */
  private snapEdgeIdx = -1;

  // 알파-베타 게인: 위치 튐(α)은 낮추고, 속도 획득(β)은 실주행을 따라갈 만큼 유지.
  // 노이즈로 인한 속도 급변은 아래 가속도 제한이 따로 막는다.
  private static ALPHA = 0.3;
  private static BETA = 0.1;
  private static GATE_JUMP = 100;
  private static GATE_ACCURACY = 35;   // ①: 이보다 부정확한 샘플은 버림
  /**
   * 스냅 최대 보정 거리(m). 스냅은 GPS 오차(수 m)를 도로로 끌어당기는 장치이지,
   * 실제로 길 밖에 있는 사람을 도로로 순간이동시키는 장치가 아니다.
   * 20m는 과했다 — 블록 안을 지날 때 20m씩 끌려가며 위치가 튀었다.
   */
  private static SNAP_MAX = 12;
  /**
   * 스냅 히스테리시스(m). 지금 붙어 있는 도로보다 다른 도로가 이만큼 더 가까워야 갈아탄다.
   *
   * 없으면 매 프레임 "가장 가까운 도로"를 새로 고르기 때문에, 블록 안이나 도로 사이를
   * 지날 때 어느 쪽이 가까운지가 뒤집히며 위치가 순간이동한다.
   * (계측: 필터는 2.3m 이동했는데 스냅 출력은 30.7m 점프 — 블록을 가로질러 건너뜀)
   */
  private static SNAP_STICKY = 12;
  private static SPEED_TAU = 3;
  private static MAX_SPEED_MS = 40;
  /** 보행자 가속 한계(m/s²) — 노이즈가 속도 추정을 흔드는 것을 물리적으로 제한 */
  private static MAX_ACCEL_MS2 = 1.5;
  private static LOCK_SPEED_KMH = 1.5; // ③: 이 속도 미만이 3샘플 연속이면 잠금
  private static LOCK_AFTER = 3;
  private static UNLOCK_AFTER = 2;     // 이탈 샘플 2연속이면 해제

  constructor(graph: RoadGraph | null) {
    this.graph = graph;
  }

  /**
   * accuracyM: GPS가 보고한 수평 정확도(m). 클수록 덜 믿는다.
   * movingHint: 상위 레이어가 이동 여부를 확실히 아는 경우 전달 (향후 걸음 감지 연동용).
   *   현재 GPS 전용 구성에서는 넘기지 않으며, 필터가 순변위 휴리스틱으로 판정한다.
   *   true = 잠금 금지·즉시 해제 / false = 빠른 잠금 / undefined = 휴리스틱 판정
   */
  update(raw: Vec2, dt: number, accuracyM = 10, movingHint?: boolean): FilteredPose {
    if (!this.init) {
      this.pos = raw;
      this.vel = { x: 0, y: 0 };
      this.init = true;
      return this.buildPose(0);
    }
    if (dt <= 0) dt = 1e-3;

    const remain = Math.max(0, dt - this.predictedSinceUpdate);
    this.predictedSinceUpdate = 0;

    // ① 정확도 게이트: 신뢰 못 할 샘플은 관성만 유지
    if (accuracyM > LocationFilter.GATE_ACCURACY || dist(raw, this.pos) >= LocationFilter.GATE_JUMP) {
      if (!this.locked) this.pos = add(this.pos, mul(this.vel, remain));
      return this.buildPose(dt);
    }

    // ③ 정지 잠금 중: 잠금 위치를 유지하고 이탈 여부만 감시
    if (this.locked) {
      if (movingHint === true) {
        // 확실한 이동 신호 → 즉시 해제
        this.locked = false;
        this.unlockCandidate = 0;
        this.lockCandidate = 0;
        this.vel = mul(norm(sub(raw, this.lockPos)), 1.0);
        this.pos = this.lockPos;
      } else {
        const escape = Math.max(accuracyM * 0.8, 6);
        if (dist(raw, this.lockPos) > escape) {
          this.unlockCandidate++;
          if (this.unlockCandidate >= LocationFilter.UNLOCK_AFTER) {
            this.locked = false;
            this.unlockCandidate = 0;
            this.lockCandidate = 0;
            this.vel = mul(norm(sub(raw, this.lockPos)), 1.0); // 1m/s 시드
            this.pos = this.lockPos;
          }
        } else {
          this.unlockCandidate = 0;
        }
      }
      if (this.locked) {
        this.pos = this.lockPos;
        this.vel = { x: 0, y: 0 };
        this.speedEma = 0;
        return this.buildPose(dt);
      }
    }

    // ② 적응 게인: 정확도가 나쁠수록 측정을 덜 반영 (칼만의 R 스케일링에 해당)
    const trust = accuracyM <= 5 ? 1 : Math.max(0.2, 5 / accuracyM);
    const alpha = LocationFilter.ALPHA * trust;
    const beta = LocationFilter.BETA * trust;

    const predicted = add(this.pos, mul(this.vel, remain));
    const residual = sub(raw, predicted);
    this.pos = add(predicted, mul(residual, alpha));

    // 속도 갱신 + 가속도 제한 (노이즈로 인한 방향 흔들림 억제)
    const prevVel = this.vel;
    let nextVel = add(prevVel, mul(residual, beta / dt));
    const dv = sub(nextVel, prevVel);
    const dvMax = LocationFilter.MAX_ACCEL_MS2 * dt;
    if (len(dv) > dvMax) nextVel = add(prevVel, mul(norm(dv), dvMax));
    this.vel = nextVel;
    if (len(this.vel) > LocationFilter.MAX_SPEED_MS)
      this.vel = mul(norm(this.vel), LocationFilter.MAX_SPEED_MS);

    // 정지 데드밴드: 노이즈 킥으로 생긴 저속 표류를 적극적으로 0에 수렴
    if (len(this.vel) < 1.0) this.vel = mul(this.vel, 0.45);

    const pose = this.buildPose(dt);

    if (movingHint === true) {
      // 확실히 이동 중 — 잠금 후보 리셋
      this.lockCandidate = 0;
      this.rawHistory = [];
      return pose;
    }

    // ③-a 잠금 진입: 연속 저속 샘플 (movingHint=false면 2샘플로 단축)
    const lockAfter = movingHint === false ? 2 : LocationFilter.LOCK_AFTER;
    const lockSpeed = movingHint === false ? 6 : LocationFilter.LOCK_SPEED_KMH;
    if (pose.speedKmh < lockSpeed) {
      this.lockCandidate++;
      if (this.lockCandidate >= lockAfter) this.engageLock();
    } else {
      this.lockCandidate = 0;
    }

    // ③-b 잠금 진입(변위 기반): 이동 여부를 모를 때(GPS 모드)만 사용.
    // 최근 4초 원시 샘플이 한 덩어리면 속도 추정이 노이즈로 높아도 강제 잠금.
    // 저속 보행과의 오판 가능성은 있으나, 오판 시에도 이탈 감시로 수 초 내 해제됨.
    if (!this.locked && movingHint === undefined && pose.speedKmh < 6) {
      this.clock += dt;
      this.rawHistory.push({ p: raw, t: this.clock });
      while (this.rawHistory.length > 0 && this.clock - this.rawHistory[0].t > 4.5)
        this.rawHistory.shift();
      if (this.rawHistory.length >= 4 && this.clock - this.rawHistory[0].t >= 3) {
        const first = this.rawHistory[0].p;
        const last = this.rawHistory[this.rawHistory.length - 1].p;
        // ① 순변위: 실제로 걷고 있으면 창(≈4초) 동안 최소 수 m는 전진한다
        const netMoved = dist(first, last);
        // ② 산포: 노이즈만 있으면 샘플들이 중심 주변에 모인다
        let cx = 0, cy = 0;
        for (const h of this.rawHistory) { cx += h.p.x; cy += h.p.y; }
        cx /= this.rawHistory.length; cy /= this.rawHistory.length;
        const spreadOk = this.rawHistory.every(
          h => dist(h.p, { x: cx, y: cy }) < Math.max(accuracyM * 1.6, 7));
        if (netMoved < Math.max(accuracyM * 1.5, 6) && spreadOk) this.engageLock();
      }
    }
    return pose;
  }

  private engageLock() {
    this.locked = true;
    this.lockPos = this.pos;
    this.vel = { x: 0, y: 0 };
    this.speedEma = 0;
    this.unlockCandidate = 0;
    this.lockCandidate = 0;
    this.rawHistory = [];
  }

  predict(dt: number): FilteredPose {
    if (!this.init) return this.buildPose(0);
    if (!this.locked) {
      this.pos = add(this.pos, mul(this.vel, dt));
      this.predictedSinceUpdate += dt;
    }
    return this.buildPose(dt);
  }

  private buildPose(dt: number): FilteredPose {
    if (dt > 0 && !this.locked) {
      const instSpeed = len(this.vel) * 3.6;
      const k = Math.min(1, dt / LocationFilter.SPEED_TAU);
      this.speedEma += (instSpeed - this.speedEma) * k;
      if (this.speedEma > Rules.vehicleSpeedKmh) this.vehicleTimer += dt;
      else this.vehicleTimer = 0;
    }

    const pose: FilteredPose = {
      posFiltered: this.pos,
      posSnapped: this.pos,
      snapped: false,
      layer: 0,
      speedKmh: this.locked ? 0 : this.speedEma,
      vehicleSuspect: this.vehicleTimer >= Rules.vehicleHoldSec,
      locked: this.locked,
    };
    if (this.graph) {
      // 지금 붙어 있는 도로를 먼저 평가하고, 다른 도로가 충분히 더 가까울 때만 갈아탄다.
      const cur = this.snapEdgeIdx >= 0
        ? this.graph.projectOnto(this.pos, this.snapEdgeIdx)
        : null;
      const curOk = cur !== null && cur.dist <= LocationFilter.SNAP_MAX;
      const best = this.graph.snapToEdge(this.pos, LocationFilter.SNAP_MAX);

      let chosen: { point: Vec2; edgeIdx: number } | null = null;
      if (curOk && best) {
        const bestD = dist(this.pos, best.snapped);
        chosen = bestD < cur!.dist - LocationFilter.SNAP_STICKY
          ? { point: best.snapped, edgeIdx: best.edgeIdx }
          : { point: cur!.point, edgeIdx: this.snapEdgeIdx };
      } else if (curOk) {
        chosen = { point: cur!.point, edgeIdx: this.snapEdgeIdx };
      } else if (best) {
        chosen = { point: best.snapped, edgeIdx: best.edgeIdx };
      }

      if (chosen) {
        pose.posSnapped = chosen.point;
        pose.snapped = true;
        pose.layer = this.graph.edges[chosen.edgeIdx].layer;
        this.snapEdgeIdx = chosen.edgeIdx;
      } else {
        this.snapEdgeIdx = -1;
      }
    }
    return pose;
  }

  reset(pos: Vec2) {
    this.pos = pos;
    this.vel = { x: 0, y: 0 };
    this.init = true;
    this.speedEma = 0;
    this.vehicleTimer = 0;
    this.predictedSinceUpdate = 0;
    this.locked = false;
    this.lockCandidate = 0;
    this.unlockCandidate = 0;
    this.snapEdgeIdx = -1;
    this.rawHistory = [];
  }
}
