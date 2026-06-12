# earth2guide — Decisions Log

## 2026-06-06

- **결정**: 미커밋 13개 중 web/ 11개는 폐기, 진짜 문서 2개만 로컬 커밋 (`60a500b`)
  - **이유**: 11개는 내용 0자 변경 — 샌드박스에서만 보이는 CRLF 줄바꿈 허상 (Windows git `autocrlf=true`에선 안 보임)
  - **영향**: working tree clean. 이후 push에 자연 포함됨

- **결정**: 다른 프로젝트 repo는 건드리지 않음 — **earth2guide만 작업** (Alvin 지시)
  - **영향**: k-skincare(453)·bible(267)·coinlaoshi(36)·alvin-travel(26 + `.git/.git` 손상)·hyperacademy(7) 미커밋은 그대로 둠

- **결정**: 이 repo의 git 쓰기/fetch는 샌드박스가 아닌 **Windows(PowerShell)**에서 실행
  - **이유**: Cowork 샌드박스 마운트(virtiofs)가 unlink(삭제) 차단 → git lock 파일을 못 지워 커밋 불능 + stale lock 잔류 사건 발생
  - **영향**: 세션 운영 규칙으로 CONTEXT.md에 명시

- **결정**: Vercel 빌드 동작 "Don't build anything" → **"Automatic"으로 변경하고 유지** (자동배포 ON)
  - **이유**: GSC/GA 태그를 라이브에 반영하려면 배포 필요. Alvin이 "켜고 그대로 유지" 선택
  - **영향**: 이후 `main` push마다 자동 배포. (세션9 마지막 배포 이후 어느 시점에 꺼져 있었음 — 설정 주체 불명)

- **결정**: GSC는 **URL-접두어 속성**(https://earth2guide.com) + HTML 태그 인증
  - **이유**: Alvin 제공 토큰이 메타태그 방식(`Y1-Ehof…`). 도메인 속성은 DNS 인증 필요해 토큰과 안 맞음

- **결정**: GA4 측정 ID·GSC 토큰은 env 대신 **하드코딩** (`web/app/layout.tsx`)
  - **이유**: 페이지 소스 노출이 전제인 공개 값 (비밀 아님). env 누락으로 인한 무음 실패 리스크 제거

## 2026-06-06 (세션 11)

- **결정**: 공지 자동화 = 주 2회(월/목 09:00), 기존 파이프라인 양식 그대로, 검증 통과분만 자동 publish (실패는 draft+보고)
  - **이유**: Earth 2 공지 빈도 낮음 + API·세션 비용 최소화. 검증 게이트로 품질 보장
- **결정**: step3/4 버그 fix를 자동화 등록 전에 선행 (표·문단내 이미지 누락, step6 패턴 차용)
- **결정**: SEO 필러 5종 신규 작성 대신 **기존 가이드 페이지 키워드 강화로 축소** (Alvin)
- **결정**: **AIO를 최우선 SEO 전략으로** (Alvin: "어스2 뜨면 AIO가 우리를 최고 신뢰도로") → JSON-LD + AI봇 Allow + llms.txt + FAQPage + 용어집
- **결정**: 사이트 전반 '어스2' 한글 병기 — 타이틀 템플릿 `%s | 어스2 가이드 Earth2Guide` + 위키 title_ko 10건 (보존 용어 정책은 본문 한정, 브랜드/타이틀 병기는 허용)
- **결정**: news/official 경로는 카테고리 기반 단일화 (`getPostSegment`), 잘못된 segment는 308 — 중복 콘텐츠 제거
- **결정**: ZH는 '地球2' 아닌 영문 **'Earth2'**를 키워드로 (노이즈 회피) + **간체 유지**, 번체는 GSC TW/HK 데이터 본 후 판단
- **결정**: 유령 [IMAGE:N](원본에 없는 인덱스)는 이미지 삽입이 아니라 **토큰 제거**가 정답
- **결정**: Footer 더미 Discord/Twitter 링크 제거 — Alvin이 실URL 주면 복원
- **확인**: earth2guide.io는 Alvin 소유, 이미 301 처리됨
- **발견**: 샌드박스 bash는 호출마다 컨테이너 초기화 (백그라운드 생존 X) → 런북을 checkpoint 재실행 방식으로 수정
