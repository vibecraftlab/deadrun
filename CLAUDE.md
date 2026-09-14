# DEADRUN 작업 규약

GPS 실외 러닝 × 좀비 서바이벌 × AR 전투 모바일 게임. 가칭 DEADRUN.

## 이 워크스페이스의 구성

| 폴더 | 내용 |
| --- | --- |
| `deadrun-expo/` | 현재 살아 있는 프로토타입 (Expo SDK 57, RN, TypeScript). **모든 사실의 기준.** |
| `deadrun-proto/` | 초기 Unity 프로토타입. 참고용. |
| `design/` | 디자인 캔버스 작업 파일 (`*.dc.html.tpl`, `canvas.json`, 빌드 스크립트) |

기획 문서와 활동 로그는 코드가 아니라 Obsidian에 있다:
`G:\내 드라이브\obsidian\projects\zombie-runner\`

## 여러 세션이 동시에 이 저장소를 고친다

실제로 한 세션이 디자인을 그리는 동안 다른 세션이 그 제안을 코드로 구현한 적이
있다. 그래서:

- 앱의 값(색·크기·문구·상수)을 인용하기 전에 **그 자리에서 소스를 다시 읽는다.**
  이전 대화에서 읽은 값은 이미 낡았을 수 있다.
- 디자인 캔버스나 문서가 "현재 이렇다"고 주장하는 부분은 작업 시작 시점에
  한 번 대조한다.

## 작업이 한 단계 끝나면 Obsidian에 기록한다

`design-scribe` 에이전트를 호출한다. 로그 형식과 갱신 대상 문서는 그 에이전트
정의에 있다. 요지는 두 가지다.

- `log.md` 의 **맨 위**에 `## [YYYY-MM-DD] {action} | {요약}` 항목을 넣는다.
- 사실이 바뀌었으면 로그만 쓰지 말고 해당 `wiki/` 문서도 같이 고친다.

## 디자인 수정 요청

클라이언트 피드백은 `design-review` 에이전트로 처리한다. 그 에이전트는
**반영 전에 변경안을 먼저 보고하고 승인을 받는다.** 이 순서를 건너뛰지 않는다.

디자인 캔버스 파이프라인:

```bash
cd design && node release.mjs        # 빌드 → 조립 → 검증
```

- 편집 대상은 `*.dc.html.tpl` 과 `canvas.json` 뿐이다. `*.dc.html` 은 생성물이다.
- 좀비 픽셀맵은 `build.mjs` 가 `deadrun-expo/src/components/zombieSprites.ts` 를
  직접 읽는다. 시트에서 스프라이트를 바꾸려면 앱 소스를 고쳐야 한다.
- 게시는 Artifact 도구로, `url` 을 넘겨 같은 링크에 갱신한다:
  `https://claude.ai/code/artifact/e1f4e359-886b-4836-8fac-55eb4cc7746f`

## Expo

`deadrun-expo/AGENTS.md` 의 지시를 따른다. Expo는 버전마다 API가 바뀌므로
코드를 쓰기 전에 해당 버전 문서를 확인한다.
