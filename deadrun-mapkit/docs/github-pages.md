# GitHub Pages로 전국 지도 배포하기

정적 파일만 올리면 되므로 **서버가 필요 없다.** GitHub Pages는 무료이고 CDN도 붙는다.

## 먼저 — 전국이 GitHub에 들어가는가

실측한 데이터 밀도다. (반경 2km 표본, 도로+건물)

| 지역 | 도로만 | 도로+건물 |
|---|---|---|
| 서울 도심(마포) | 6.6 KB/km² | 18.1 KB/km² |
| 부산 도심(서면) | 5.9 | 12.7 |
| 지방 소도시(안동) | 2.6 | 4.1 |
| 농촌(전북 임실) | 1.6 | 2.3 |
| 산간(강원 평창) | 0.6 | 1.1 |

국토 10만 km²를 도시 5% · 소도시 10% · 농촌산간 85%로 가중하면

- **도로만 약 148 MB**
- **도로+건물 약 270 MB**

### GitHub 한도와 대조

| 항목 | 한도 | 우리 상황 |
|---|---|---|
| 파일 하나 | **100 MB** (초과 시 push 거부) | 최대 타일 313 KB — 여유 |
| 저장소 권장 | 1 GB 미만 | 270 MB — 여유 |
| Pages 사이트 | **1 GB** | 270 MB — 여유 |
| Pages 대역폭 | 월 100 GB (소프트) | 사용자당 ~1 MB → 월 10만 세션 |
| 파일 개수 | 명시 한도 없음 | 약 5,000개 — git 동작은 느려지지만 가능 |

**전국이 들어간다.** 건물까지 넣어도 한도의 4분의 1 수준이다.

---

## 절차

### 1. 굽기

전국을 한 번에 구우면 Overpass 요청이 수천 건이라 며칠이 걸리고 서버에도 부담이다.
**권역별로 나눠서, 이어서 굽는 방식**을 권한다.

```bash
# 규모 먼저 확인 (네트워크 안 씀)
npm run mapkit -- plan --bbox 126.76,37.42,127.18,37.70     # 서울

# 서울부터
npm run mapkit -- bake --bbox 126.76,37.42,127.18,37.70 \
  --out out --version v1 --resume

# 수도권 확장
npm run mapkit -- bake --bbox 126.60,37.20,127.30,37.80 \
  --out out --version v1 --resume

# 부산
npm run mapkit -- bake --bbox 128.90,35.05,129.30,35.30 \
  --out out --version v1 --resume
```

- `--resume` — 이미 구운 타일은 건너뛴다. 중단됐다 다시 돌려도 이어서 간다
- `--no-buildings` — 도로만. 용량이 절반 가까이 준다
- `--delay 400` — 타일 사이 대기(ms). 공용 Overpass에 대한 예의이자 504 회피

권역을 나눠 굽더라도 **같은 `--out`, 같은 `--version`** 을 쓰면 매니페스트가 누적된다.

### 2. 저장소 만들기

지도 전용 저장소를 따로 파는 게 좋다. 게임 코드 저장소가 무거워지지 않는다.

```bash
gh repo create deadrun-maps --public
cd out
git init -b gh-pages
git add .
git commit -m "지도 타일 v1 — © OpenStreetMap contributors (ODbL)"
git remote add origin https://github.com/<사용자명>/deadrun-maps.git
git push -u origin gh-pages
```

### 3. Pages 켜기

저장소 **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `(root)`**

몇 분 뒤 이 주소로 열린다.

```
https://<사용자명>.github.io/deadrun-maps/latest.json
```

### 4. 앱에 연결

`deadrun-expo/.env`

```
EXPO_PUBLIC_MAP_PACK_URL=https://<사용자명>.github.io/deadrun-maps
```

`npx expo start -c` 로 재시작하면 타일을 받기 시작한다.

---

## 갱신할 때 — 여기가 가장 중요하다

### 버전 폴더를 절대 덮어쓰지 말 것

```bash
npm run mapkit -- bake --bbox ... --version v2 --out out
```

새 버전은 `out/v2/...`로 들어가고 `latest.json`이 v2를 가리킨다.
기기에 캐시된 v1 파일과 **경로가 달라서 섞이지 않는다.**

같은 경로를 덮어쓰면 기기는 "이미 받았다"고 판단해 옛 파일을 계속 쓰거나,
반쯤 갱신된 지도로 플레이하게 된다.

### 저장소가 커지는 문제

git은 버전마다 새 바이너리를 전부 기록한다. v1·v2·v3를 쌓으면 저장소가 배로 늘어난다.
**히스토리 없이 덮어쓰는 방식**을 권한다.

```bash
cd out
rm -rf .git
git init -b gh-pages
git add .
git commit -m "지도 타일 v2 — © OpenStreetMap contributors"
git remote add origin https://github.com/<사용자명>/deadrun-maps.git
git push -f origin gh-pages
```

옛 버전 폴더를 `out/`에 남겨두면 URL은 살아 있으므로, 구버전 앱도 계속 동작한다.
더 이상 쓰는 사용자가 없으면 폴더째 지우면 된다.

---

## 다른 선택지

| 방식 | 장점 | 단점 |
|---|---|---|
| **GitHub Pages** | 무료·CDN·설정 간단 | 대역폭 소프트 한도, 상업용엔 부적절 |
| Cloudflare R2 | 대역폭 무료, 용량 무제한급 | 계정·설정 필요 |
| AWS S3 + CloudFront | 대규모에 적합 | 비용 발생 |
| GitHub Releases | 파일당 2GB, 대역폭 넉넉 | 타일별 접근이 불편 |

프로토타입~소규모 운영은 **Pages로 충분하다.** 사용자가 늘면 같은 `out/` 폴더를
R2나 S3에 그대로 복사하고 `.env` 주소만 바꾸면 된다. **구조를 고칠 필요가 없다.**

---

## 라이선스 (ODbL)

OSM 데이터는 ODbL이다. 구운 타일은 **파생 데이터베이스**에 해당한다.

- 배포물과 앱 화면에 `© OpenStreetMap contributors` 표기 (매니페스트에도 기록된다)
- 저장소 README에 출처와 라이선스 명시
- share-alike 조항이 있으므로, 상업적 출시를 계획한다면 별도로 확인할 것

이 프로젝트는 앱의 지도 화면 좌측 하단에 표기를 넣어두었다.
