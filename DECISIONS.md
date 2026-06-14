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

## 2026-06-14 (세션 12 — Cloudflare 이관)

- **결정**: earth2guide를 Vercel+Supabase → **Cloudflare Pages 정적**으로 완전 이관 (Alvin)
  - **이유**: Supabase −$10/mo + 스택 단순화(런타임 DB·서버 제거). 트래픽 0이라 리스크 낮음
  - **영향**: Next.js output:export, 콘텐츠=레포 MD, admin·middleware·Gemini 제거
- **결정**: 번역은 **기존 KO/ZH 박제**(재번역 X) — 검증·색인된 콘텐츠라 SEO 리스크 회피
- **결정**: 검색 = **정적 클라이언트**(search-index.json + 클라 필터). Pagefind 대신 경량 title+summary 채택(무의존·무빌드스텝)
- **결정**: 신규 공지 = **주간 Claude Scheduled task**(월 09:08 KST). scrape→Claude 번역→MD→git→wrangler deploy. 실패 시 무배포(라이브 보존)
- **결정**: 배포 = **direct-upload(wrangler)** — git push 자동배포 미사용(의도). 대시보드/GitHub 연결 불필요
- **결정**: 도메인 전환 = **검증 후 즉시**(트래픽 0). API로 커스텀도메인+DNS 컷오버, 롤백=DNS 원복
- **결정**: Supabase·Vercel **즉시 삭제**(1주 소크 생략) — Alvin 판단. _backup 보존으로 안전. (유료플랜이라 대시보드에서 직접 삭제)
- **결정**: `/news/[slug]` 라우트 **삭제** — 전 포스트가 official segment(news 0개). 향후 news/dev_qa 카테고리 생기면 복원
- **결정**: 콘텐츠 포맷 = 로케일별 MD + frontmatter(JSON 스칼라), id=slug
- **확인**: GSC = URL-접두어 속성, sitemap 366 정상(6/13 읽음). 색인 206/미색인 584(대부분 양성). 이관이 색인 환경 개선

## 2026-06-14 (세션 13 — 키워드 SEO·리퍼럴·env·마감)

- **결정**: SEO는 **백링크(오프페이지) 안 함** → **온사이트 키워드 페이지**로 (Alvin: 작위적 링크 비선호)
  - 타겟: 어스2 에센스/코인/근황. 진단상 셋 다 GSC 노출 0, 단 `어스2 출금`=5.5위(전용 페이지 효과)
- **결정**: 코인·에센스는 의도 겹쳐 **에센스 허브 1개로 통합**(코인 쿼리 흡수) + **근황 2026 페이지** 별도. KO/ZH 각 1 = 4 MD. 카테고리 ecosims/overview
- **결정**: 리퍼럴 코드 **00000은 Alvin 실제 코드**(플레이스홀더 아님). 이관 커밋 `fc60d4c`에서 코드 표시·`?r=` 링크가 제거됐던 게 누락 원인
  - **방식**: 링크형 아님 → **정보 전달형**(결제 단계 수동 입력 안내). 코드 칩 + 복사 버튼
  - **노출**: 전 페이지 — 홈=큰 배너 / 내부=상단 슬림 띠(usePathname으로 홈 제외)
  - **단일소스**: `lib/referral.ts` + `.env NEXT_PUBLIC_REFERRAL_CODE`(기본값 00000)
- **결정**: 삭제된 스택의 **죽은 시크릿 제거** — `web/.env.local`+`pipeline/.env.local`의 Supabase(service_role 포함)·Gemini·Discord 키. R2(live)·사이트 변수 유지. (둘 다 gitignore라 git 미커밋 — 이력 스크럽 불필요)
  - 참고: Supabase 키는 프로젝트 삭제로 무효. Gemini 키는 구글 측 유효 가능 → 원하면 AI Studio서 폐기
- **결정/확인**: 다른 세션 혼선 **마감** — git 분기·유실 0(HEAD=origin/main=`96f0732`), force-dynamic은 CF 이관(`f43b5ce`)이 덮음. 라이브를 HEAD에 배포해 **라이브=git 일치**(deploy `27bb0e61`). (다른 세션이 Vercel→CF "이관 중"으로 stale 인식했을 뿐, Vercel은 이미 삭제·404 정상)
- **결정**: 스케줄러 — 구버전 `earth2guide-news-auto`(Supabase/Gemini 기반, 월/목) 삭제, 최종 `earth2guide-weekly-autonews`(월 09:08)만 유지

## 2026-06-14 (세션 14 — git 배포 전환 + 도메인 컷오버)

- **결정**: 배포를 **CF git 프로젝트 `earth2guide-web`**로 전환 (Alvin: "git으로 버전관리 + CF 자동 업로드")
  - direct-upload 프로젝트는 git 연결로 전환 불가 → **신규 git 프로젝트 생성 + 도메인 이전** 방식
  - GitHub `illuden`은 Cloudflare Pages 앱 기연결 상태라 OAuth 불필요(repo 선택만)
  - 빌드 설정: root=`web`, `npm run build`, out=`out`, node 22(`web/.node-version`), env 4개(`NEXT_PUBLIC_SITE_URL/REFERRAL_CODE/R2_PUBLIC_URL/DEFAULT_LOCALE`)
- **결정**: 배포 트리거 = **CF API (Option C)**, git 네이티브 webhook **미사용** (Alvin 선택: "자동화만 배포 트리거")
  - **이유**: CF config는 정상(deployments_enabled·production_deployments_enabled=True, path=`*`)인데 **git push가 빌드를 안 띄움** — GitHub App webhook이 push 이벤트를 CF로 전달 안 함(3회 push 모두 무반응). 디버깅이 GitHub 계정 접근 필요 + 불확실
  - **방식**: push 후 `POST /accounts/{acct}/pages/projects/earth2guide-web/deployments`로 명시 트리거 → CF가 최신 main 빌드. 주간 자동화 STEP5 / Claude가 수행. Alvin "Claude가 다 실행" 모델과 정합
- **결정**: `package-lock.json` **git 미추적**(gitignore에 추가) — CF는 `npm install`로 빌드
  - **이유**: Windows 생성 lock이 Linux 네이티브(`@next/swc-linux-x64-gnu`, `@parcel/watcher-linux-x64-glibc`) 누락 → CF(Linux) `npm ci` 빌드 실패. `npm install`은 플랫폼 네이티브 자동 설치. 크로스플랫폼 lock 생성이 샌드박스 45s 한도로 불안정 → 미추적이 가장 견고
  - **트레이드오프**: 빌드 재현성 일부 손실(정적 콘텐츠 사이트라 감수). 추후 Linux CI lock으로 하드닝 가능. 로컬 dev lock은 디스크에 유지
- **결정**: 도메인 컷오버 = **API로 즉시** (Alvin 승인 "음 해"). OLD(earth2guide)서 earth2guide.com+www 제거 → NEW(earth2guide-web)에 추가 → DNS CNAME 2개를 `earth2guide-web.pages.dev`로. 롤백=원복(수분)
- **결정**: 구 `earth2guide`(direct-upload) 프로젝트 = **폴백 보존, 1주 후 삭제(P6)**. 즉시 삭제 안 함(롤백 대비)
- **확인**: 빌드 그린 — deploy `11d35a57`(commit 3a86765, npm install) build success → `earth2guide-web.pages.dev` 전체 렌더 정상(리퍼럴 00000·이미지·SEO메타). 컷오버 후 earth2guide.com/ko HTTP 200 + 신규 콘텐츠 서빙(`?cb=` 우회로 확정)
- **확인**: lockfile 수정 시행착오 — ① Windows npm install(변화 0: npm11 vs CF npm10 차이) ② npm@10.9.2 재생성(@swc/helpers 0.5.15 vs CF 요구 0.5.23 불일치) ③ 최종 **미추적** 채택(npm install)
- **확인**: CF 토큰에 **Cache Purge 권한 없음**(code 10000) → 배포 후 루트 URL 캐시는 새 배포로 갱신. 필요시 토큰에 Cache Purge 추가
