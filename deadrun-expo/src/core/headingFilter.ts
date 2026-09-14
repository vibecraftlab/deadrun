/**
 * 방위(나침반) 상보 필터 — 지도의 방향 부채꼴과 AR 카메라가 함께 쓴다.
 *
 *  나침반 원값을 그대로 쓰면 실내에서 심하게 떤다. 모니터·금속 책상 같은
 *  자기 간섭 때문인데, 지도에서는 부채꼴이 초당 14회씩 방향을 바꾸고
 *  AR에서는 화면 전체가 흔들린다(세로 화면은 헤딩 1°가 약 37px).
 *
 *  해결은 두 센서를 합치는 것이다.
 *   · 자이로 융합값(DeviceMotion.rotation.alpha) — 순간 변화에 강하지만
 *     시간이 지나면 기준이 서서히 어긋난다(드리프트).
 *   · 나침반 — 절대 방위는 맞지만 순간값이 시끄럽다.
 *  자이로로 즉시 따라가고, 어긋난 만큼만 나침반이 천천히 당겨 잡는다.
 *  네이버 지도류가 부드러운 것도 같은 이유다.
 *
 *  ※ 처음에는 "자이로는 조용하다"고 보고 자이로 변화량을 그대로 더했다.
 *    실기기에서는 그게 틀렸다 — 폰을 완전히 고정해도 alpha가 0.3° 안팎으로 떤다.
 *    계측(폰 고정, 센서 20Hz·렌더 60Hz, AR 기준 1° = 가로 38px):
 *      · 있는 그대로          프레임당 25.7px, 초당 17.4회 방향 전환
 *      · 자이로 잡음만 제거     프레임당  2.1px
 *    흔들림의 92%가 자이로였다. 나침반은 데드밴드와 느린 추종으로 이중으로
 *    막아뒀는데 자이로만 무방비였던 셈이라, 아래 ①②를 자이로 쪽에도 넣었다.
 *
 *    적용 후 (데드밴드 0.5° · 저역 18/s):
 *      · 폰 고정     프레임당 22.2px → 2.4px  (나침반만 남은 바닥값 2.3px)
 *      · 30°/s 회전  프레임당 72.5px → 28.6px (센서 20Hz 계단이 사라진 값 28px)
 *    회전 추종 지연은 오히려 줄었다 — 계단의 과/부족 진동이 없어졌기 때문이다.
 */

/** 각도차를 -π~π로 정규화 */
const wrap = (a: number): number => Math.atan2(Math.sin(a), Math.cos(a));

export interface HeadingFilterOptions {
  /** 나침반이 자이로 드리프트를 당겨오는 속도(1/s). 낮을수록 안정적 */
  compassTrust: number;
  /** 이 각도(rad) 안의 나침반 오차는 무시 — 정지 중 미세 떨림 제거 */
  deadband: number;
  /** 자이로 yaw 부호. W3C alpha는 나침반과 반대로 증가해 보통 -1 */
  gyroSign: number;
  /** 자이로를 못 쓰는 기기에서 나침반만 평활할 때의 강도(1/s) */
  fallbackSmooth: number;
  /**
   * 자이로 변화량의 데드밴드(rad) — 백래시(기어 유격) 방식이다.
   *
   *  변화량을 바로 더하지 않고 유격에 쌓아두고, 유격을 넘어선 만큼만 내보낸다.
   *  정지 중 잡음은 오갈 뿐 유격을 못 넘어 완전히 걸러지고,
   *  실제로 돌리면 유격만큼만 늦을 뿐 회전량은 하나도 잃지 않는다.
   *  (변화량의 누적은 '지금 잡음 - 처음 잡음'으로 상쇄되므로 발산하지 않는다)
   */
  gyroDeadband: number;
  /**
   * 데드밴드를 통과한 자이로 변화량을 풀어놓는 속도(1/s).
   * 센서는 20Hz, 화면은 60Hz라 변화량을 한 프레임에 다 넣으면 계단처럼 튄다.
   * 여러 프레임에 나눠 넣어 그 계단을 없앤다. 낮출수록 부드럽고 반응이 늦다.
   */
  gyroSmooth: number;
}

export class HeadingFilter {
  private fused: number | null = null;
  private compass = 0;
  private gyro = 0;
  private gyroPrev: number | null = null;
  private hasGyro = false;
  /** 데드밴드 유격에 쌓여 아직 못 나간 자이로 변화량 (rad) */
  private slack = 0;
  /** 데드밴드를 통과했지만 아직 화면에 반영하지 않은 회전량 (rad) */
  private pending = 0;

  constructor(private readonly o: HeadingFilterOptions) {}

  /** 나침반 값 갱신 (rad, 북 기준 시계방향) */
  setCompass(rad: number) {
    this.compass = rad;
    if (this.fused === null) this.fused = rad; // 첫 값은 그대로 채택
  }

  /** 자이로 융합 yaw 갱신 (rad). 기기가 지원할 때만 호출된다 */
  setGyro(rad: number) {
    this.gyro = rad;
    this.hasGyro = true;
  }

  /** 경과 시간만큼 진행시키고 방위(rad)를 돌려준다 */
  update(dt: number): number {
    if (this.fused === null) return this.compass;

    if (this.hasGyro && this.gyroPrev !== null) {
      // 새 자이로 표본이 없는 프레임에서는 변화량이 0이다 — 아래 ②는 그래도 계속 돈다
      const raw = this.o.gyroSign * wrap(this.gyro - this.gyroPrev);

      // ① 데드밴드(백래시) — 유격을 넘어선 만큼만 내보낸다
      const band = this.o.gyroDeadband;
      this.slack += raw;
      let passed = 0;
      if (this.slack > band) { passed = this.slack - band; this.slack = band; }
      else if (this.slack < -band) { passed = this.slack + band; this.slack = -band; }

      // ② 저역 필터 — 통과분을 한 프레임에 다 넣지 않고 나눠 넣는다
      this.pending += passed;
      const step = this.pending * (1 - Math.exp(-this.o.gyroSmooth * dt));
      this.pending -= step;
      this.fused += step;

      // ③ 나침반과 벌어진 만큼만, 데드밴드를 넘을 때 천천히 교정
      const err = wrap(this.compass - this.fused);
      if (Math.abs(err) > this.o.deadband)
        this.fused += err * (1 - Math.exp(-this.o.compassTrust * dt));
    } else {
      // 자이로 미지원 → 나침반 평활로 대체
      this.fused += wrap(this.compass - this.fused) * (1 - Math.exp(-this.o.fallbackSmooth * dt));
    }
    if (this.hasGyro) this.gyroPrev = this.gyro;
    return this.fused;
  }

  /** 현재 방위(rad) */
  get value(): number {
    return this.fused ?? this.compass;
  }

  /** 현재 방위(도, 0~360) */
  get degrees(): number {
    return ((this.value * 180) / Math.PI + 360) % 360;
  }
}
