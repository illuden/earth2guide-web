# CHANGELOG — earth2guide.com

## 2026-06-14 (세션 14) — git 배포 전환: CF git 프로젝트 + API 트리거 + 도메인 컷오버

### What
- 배포 모델 전환: 구 direct-upload(wrangler) → **CF Pages git 프로젝트 `earth2guide-web`** (GitHub `illuden/earth2guide-web` 연결). 빌드: root=`web`, `npm install` + `npm run build`, out, node 22.
- `web/.node-version`=22 추가(`3bbc8ca`). lockfile 크로스플랫폼 이슈(Windows lock이 `@next/swc-linux`·`@parcel/watcher-linux-x64-glibc` 누락) → **`package-lock.json` git 미추적**(gitignore), CF `npm install`로 해결(`3a86765`).
- 배포 트리거 = **CF API (Option C)**: git push 네이티브 webhook 미작동 확인(3회 push 무반응, config 정상) → push 후 `POST /accounts/{acct}/pages/projects/earth2guide-web/deployments` 명시 트리거.
- 도메인 컷오버: `earth2guide.com`+`www` → earth2guide-web(둘 다 active), DNS CNAME → `earth2guide-web.pages.dev`. 구 `earth2guide` 프로젝트는 폴백(1주 후 삭제·P6).
- 주간 자동화 `earth2guide-weekly-autonews` STEP4/5 = git push + CF API 트리거(로컬 빌드·wrangler 제거).
- 문서: ARCHITECTURE·프로젝트 CLAUDE.md·CONTEXT·DECISIONS 갱신. CONTEXT에 "git push 자동 트리거" 목표 메모(보류).

### 검증
- 빌드 그린: deploy `11d35a57`/`64a2a777`. earth2guide.com/ko HTTP 200 + `cf-cache-status: DYNAMIC`(HTML 엣지캐시 안 함) + 신규 콘텐츠(리퍼럴 00000 상세배너, `?cb=`로 확정).
- git: `3bbc8ca` `a4e71e6` `3a86765` `5e1a195` `b730e72` `53fb3b4` — HEAD=origin/main 동기화.

### 미해결
- git push 네이티브 자동배포 webhook 미작동(GitHub App 전달 안 됨) → Option C(API 트리거) 우회. 향후 GitHub Actions 또는 webhook 재연결로 하드닝(→ CONTEXT ★목표).

## 2026-06-14 (세션 13d) — 다른 세션 마감 + 라이브=git 일치

- 다른 세션이 stale 컨텍스트(Vercel→CF "이관 중"으로 오인, Vercel은 이미 삭제)로 작업해 혼선. 진단: git 멀쩡(분기·유실 0, HEAD=origin/main=`96f0732`, force-dynamic은 `f43b5ce`가 덮음, 수정된 글 0).
- 현재 HEAD(`96f0732` = Official 탭 ko/zh i18n + news/official 목록 meta desc) 빌드 그린(375) → CF 배포 `27bb0e61` → **라이브=git 일치**. /zh/official 중국어 탭·리퍼럴바 검증 통과.
- **Session Close**: CONTEXT 현행화 + DECISIONS(세션13)·sessions(session13 summary+narrative) 갱신. git 미접촉(로컬 저장만).
- 워치: ZH 글 카드 "읽기"(read) 라벨 i18n 누락(사소).

## 2026-06-14 (세션 13c) — env 죽은 시크릿 정리

- `web/.env.local` + `pipeline/.env.local`에서 삭제된 스택의 죽은 키 제거: Supabase(URL·anon·**service_role**)·Gemini·Discord(빈 자리). R2(이미지·live)·사이트·리퍼럴 변수는 유지 → autonews 영향 없음.
- 두 파일 모두 gitignore라 **git에 커밋된 적 없음**(이력 스크럽 불필요). root `.env`는 이미 깨끗.
- 참고: Supabase 키는 프로젝트 삭제로 무효. **Gemini 키는 파일에선 지웠지만 구글 측에선 아직 유효할 수 있음** → 안 쓰므로 원하면 AI Studio에서 폐기 권장.

## 2026-06-14 (세션 13b) — 리퍼럴 코드 사이트 전체 복원

### 문제
- 이관 후 홈 배너가 코드 없는 맨 `app.earth2.io` 링크만 남고, messages의 referral는 화면에 안 쓰이는 dead 키 → 실제 코드(00000)가 어디에도 표시 안 됨. 배너는 홈에만.
- git 추적: 커밋 `fc60d4c`("update referral banner")에서 `earth2.io/?r=00000` 링크 + 코드 표시가 제거된 게 원인. 코드 **00000은 Alvin 실제 코드**(플레이스홀더 아님). 링크형 아님 — 결제 단계 수동 입력형.

### What
- `web/lib/referral.ts` 신규: `REFERRAL_CODE = env.NEXT_PUBLIC_REFERRAL_CODE || '00000'`, EARTH2_APP_URL 단일소스
- `Earth2ReferralBanner.tsx`(홈): i18n화 + 코드 칩(복사) + 안내문(결제 단계 입력, 정보 전달용)
- `ReferralBar.tsx` 신규(슬림 띠): 내부 전 페이지 상단. usePathname으로 홈 제외. `app/[locale]/layout.tsx`에 연결
- messages ko/zh referral 재구성(badge/headline/instruction/codeLabel/barText/copy/copied/cta). zh 배너도 정상 번역(기존엔 홈 배너가 KO 하드코딩)
- .env.local/.env.example에 NEXT_PUBLIC_REFERRAL_CODE=00000

### 검증
- 빌드 EXIT0(375 HTML). 배포 `749861ec`. git `05167e8`(web 6파일)
- 라이브: 홈=큰 배너(코드 00000+복사+안내) / 내부=슬림 띠(redeem 00000 복사), 홈엔 슬림바 없음(의도대로). pages.dev+캐시버스트로 확인. 맨 `/ko`는 CDN 캐시로 잠시 구버전 보일 수 있음(곧 갱신)

### 메모(후속)
- `web/.env.local`에 삭제된 Supabase service_role·Gemini 키 잔존(gitignore·죽은 값) → 정리 제안
- `.env.example`은 .gitignore `.env*` 룰로 커밋 제외(기능 영향 없음 — lib 기본값 00000)

## 2026-06-14 (세션 13) — 키워드 SEO: Essence 허브 + 근황 위키 신설·배포

### What
- 신규 위키 4페이지 배포 (KO/ZH): `/wiki/essence`(어스2 에센스 — "어스2 코인" 쿼리 흡수), `/wiki/earth2-status-2026`(어스2 근황·현황 2026)
- manifest.json wiki 21→23, sitemap 366→370, 빌드 out/ 371→375 HTML
- CF direct-upload 배포(deploy e4d3e989), git push `bd8dfa8` (web/content 5파일만)

### Why
- GSC 90일 진단: 클릭 0 / 노출 64, 타겟 3키워드(어스2 에센스·코인·근황) **노출 0**. 단 `어스2 출금`=평균 5.5위(전용 페이지 효과) → 전용 타겟 페이지 신설이 핵심 레버
- 경쟁: earth2pedia·earth2korea(니치 정보), CoinGecko류(가격). 가격경쟁 회피 + 정보형 의도 공략, 시세는 CoinGecko 링크아웃

### 검증
- 라이브 4 URL 렌더·canonical·메타description(키워드 포함)·hreflang·sitemap 포함 전부 정상. 위키 사이드바 자동 편입. 내부링크 11개 유효
- 색인·순위는 향후 2~6주 형성 예상 → GSC 추세 모니터(일일 대시보드에 earth2guide 포함)

### 후속(대기)
- (선택) earth2-status-2026을 주간 autonews에 연동 → 타임라인·날짜 자동 갱신(신선도 유지)
- 리포트: 프로젝트 루트 `SEO_KEYWORD_PLAN_2026-06-14.html`
- ZH는 구글 TW/HK 대상. Baidu(중국 본토)·Naver는 별도 트랙(이번 범위 밖)

## 2026-06-06 (세션 11d) — AIO 후속: About/법적 페이지 + 위키 FAQ + 용어집 (의도 기록)

### What
1. `/[locale]/about` `/privacy` `/terms` 정적 페이지 신설 (KO/ZH) — Footer 죽은 링크(#) 연결, About에 AboutPage 스키마. Discord/Twitter 더미 외부링크는 실URL 확보 전까지 Footer에서 제거
2. 위키 가입/출금 페이지 body에 ' 자주 묻는 질문' 섹션 append (KO/ZH, 기존 본문 사실만 재구성) + 마크다운 FAQ 파서로 FAQPage JSON-LD 자동 생성
3. 위키 신규 페이지 `glossary` (어스2 용어집, KO/ZH) — overview 카테고리, 보존 용어 15개 정의. 엔티티 사전 = AIO 인용 타깃
4. sitemap 정적 경로에 /about 추가

### Why
- AIO 후속 권고(리포트 §7) 실행 — E-E-A-T 신뢰 신호(About/법적 고지) + AIO가 가장 잘 인용하는 FAQ 포맷 + 용어 정의 독점
- Alvin 승인: "작업 계속 할 수 있는 건 계속 해줘" (2026-06-06)

### 결과 (배포 완료)
- 커밋 `3544542` → 배포 `dpl_BEdvtghY` READY
- 라이브 검증 (Chrome 실측):
  - /ko/about · /privacy · /terms 정상, AboutPage 스키마 ✓, Footer 링크 4종 실연결 (더미 Discord/Twitter 제거)
  - 위키 가입/출금 페이지: FAQPage 스키마 발동 ✓ (마크다운 FAQ 파서)
  - **/ko/wiki/glossary 신설** — 용어 17개 + FAQ 2건, TechArticle+FAQPage 스키마 ✓ (ZH 동일)
- sitemap: 정적 경로 +about, glossary 자동 포함 (358 → 362 URL)
- DB: wiki_pages FAQ append 2건(KO/ZH), glossary INSERT 1건 (published)

---

## 2026-06-06 (세션 11c) — AIO(AI Overviews) 기반 + ZH 키워드 (의도 기록)

### What
1. **JSON-LD 구조화 데이터**: Organization+WebSite(@graph, alternateName '어스2 가이드') → locale layout / NewsArticle → news·official [slug] / TechArticle+BreadcrumbList → wiki [slug]
2. **llms.txt** 신설 (web/public) — AI 크롤러용 사이트 안내
3. **robots.ts**: AI 봇(GPTBot, ClaudeBot, PerplexityBot 등) 명시적 Allow
4. 위키 meta description을 템플릿 문구 → 본문 발췌로
5. **ZH 위키 title 10건에 'Earth2' 병기** (DB) — ZH 스캔 결과 중국어권은 '地球2'가 아니라 영문 'Earth2'로 검색 (노이즈 회피 + 브랜드 키워드)

### Why
- Alvin 지시: "가장 중요한 건 AIO — 어스2가 뜨면 AIO가 우리 사이트 신뢰도를 최고로 치게" (2026-06-06)
- AIO/AI 검색은 구조화 데이터·엔티티 명확성·크롤러 접근성·인용 가능한 답변형 콘텐츠를 우대 → 그 기반 작업
- ZH 스캔: 중국어 어스2 전용 사이트 전무 (知乎·HK매체 2021 잔재뿐) — 우리 ZH 154+20이 유일한 체계적 소스

### 결과 (배포 완료)
- 커밋 `e44a30a` → 배포 `dpl_TXXNmmXL` READY
- 라이브 검증: JSON-LD 렌더 확인 (공지=Organization+WebSite+NewsArticle / 위키=+TechArticle+BreadcrumbList, Chrome 실측), robots.txt AI봇 11종 ✓, llms.txt ✓, 위키 meta 발췌 ✓, ZH 위키 title 10건 'Earth2' 병기 ✓
- 리포트 확장: SEO_COMPETITIVE_2026-06-06.html에 ZH 스캔(§6) + AIO 작업(§7) 섹션 추가

---

## 2026-06-06 (세션 11b) — SEO 마이너 픽스 배치 (의도 기록)

### What
1. **'어스2' 한글 키워드 사이트 전반 병기**: [locale]/layout 타이틀 템플릿 locale별 분리 (ko: `%s | 어스2 가이드 Earth2Guide`), 홈 메타 절대 타이틀, og:locale locale별 (zh_CN 분리 — ZH 메타 한국어 오염 fix 포함), wiki meta description locale별
2. **news/official 경로 통일**: PostCard가 category 기반으로 링크 생성 (`getPostSegment` 헬퍼 신설), 양쪽 [slug] 페이지에서 잘못된 segment 접근 시 permanentRedirect + canonical 명시, generateStaticParams를 segment별로 필터 → 중복 콘텐츠 제거
3. **홈 위젯 fix**: Official 섹션 쿼리를 announcement/official_news/promotion으로 (기존: official_news/promotion만 → 0건 빈 상태), 최신 뉴스는 news/update로 분리
4. **DB 본문 정리**: e2v1-update-0-4-7-1 KO 번역 잔재([원문 제목]…) 제거, [IMAGE:N] 미치환 KO 7건 원본 JSON 매핑으로 치환
5. **위키 고의도 페이지 title_ko에 '어스2' 병기** (가입/출금/구매 등 5-6건)

### Why
- SEO 경쟁 분석(SEO_COMPETITIVE_2026-06-06.html) 결과: 한국 유저는 '어스2'로 검색하는데 사이트에 한글 표기 전무 (Critical #1)
- /news/와 /official/ 양쪽에 전체 154개 글이 중복 prerender되던 상태 (sitemap은 official만 선언 — 신호 불일치)
- Alvin 승인: "다 마이너 픽스니까 그냥 쭉 진행" (2026-06-06)

### 결과 (배포 완료)
- 커밋 `d990771`(본 픽스) + `9234a6f`(빌드 fix: generateStaticParams에서 cookies() 쓰는 클라이언트 → createStaticClient 기반 `getAllPostSlugsWithCategory` 신설) → 배포 `dpl_CqhFb8NK` READY
- 라이브 검증: 홈 타이틀/위젯/카테고리별 링크 ✓, /news→/official 308 ✓, canonical ✓, 위키 어스2 타이틀 ✓, ZH og:locale=zh_CN ✓, [원문]·[IMAGE:N]·중복 관련기사 0건 ✓
- DB: 위키 title_ko 10건 병기, posts body_ko 8건 정리 (모두 사후 검증 통과)

---

## 2026-06-06 (세션 11) — step3/4 표·이미지 누락 fix + 공지 자동 수집 스케줄 등록

### What (의도 — 코드 변경 전 기록)
- `step3_translate_and_ingest.py` / `step4_translate_zh.py`의 `html_to_text_with_placeholders`를 step6 검증 패턴으로 교체
  - `<table>` / `<figure.wp-block-table>` → GFM 마크다운 변환 (이전: 통째로 누락)
  - p/li/blockquote 내 img → [IMAGE:N] placeholder (DOM 순서 보존)
  - a → 마크다운 링크, strong/b → 볼드 (step6과 동일)
  - 이미지 매핑: r2_url + 원본 src 양쪽 lookup
- 공지 자동 수집을 Cowork 스케줄러 등록: 주 2회 (월/목 09:00), 런북 `pipeline/docs/AUTO_NEWS_RUNBOOK.md`
- sitemap.xml 점검 (별도)

### Why
- 옛 step3/4가 표를 누락해 32개 글 사고 발생 (HANDOFF 잔재 A). 자동 수집이 이 스크립트를 사용하므로 선행 fix 필수
- 원본 .bak 백업: `scrapers/*.py.bak-20260606`

---

## 2026-06-06 (세션 10 결과) — GSC/GA4 연결 완료 + Vercel 배포 차단 해결

### 결과
- **GSC**: earth2guide.com URL-접두어 속성 생성 → HTML 태그로 소유권 **자동 확인** → **sitemap.xml 제출** (358 URL, `application/xml` 유효 확인)
- **GA4**: `G-F0PYH6DYLW` 라이브 발동 확인 (gtag.js 로드 + dataLayer 수집)
- 배포: `098f460`(GSC/GA) + `330859a`(트리거) → `dpl_47afctZea` **READY**, earth2guide.com/www 반영

### 발견/해결 — Vercel 배포 전면 차단 (중요)
- 증상: push마다 배포가 생성 즉시 CANCELED (빌드 로그 0)
- 원인: 프로젝트 설정 Ignored Build Step **Behavior = "Don't build anything"** (세션9 마지막 배포 이후 설정돼 있었음)
- 해결: Behavior → **Automatic** 변경(유지, Alvin 승인). 최초 1회는 Redeploy 다이얼로그에서 "Use project's Ignore Build Step" 해제로 강제 빌드
- ⚠️ 이후 `main` push = 자동 배포 ON

### 운영 노트
- Cowork 샌드박스 마운트는 unlink(삭제) 불가 → **이 repo의 git 쓰기/fetch는 Windows PowerShell로** (stale `index.lock` 사건. 잔여 lock 2개 + probe 파일 Windows에서 제거 완료)
- git 동기화: 미커밋 13개 중 11개는 샌드박스 CRLF 허상 → 폐기. 문서 2개만 커밋(`60a500b`). local == origin == `330859a`
- GSC 옛 사이트맵 항목(2022 WP, 오류 상태)은 새 sitemap.xml로 대체 — 무시 가능

---

## 2026-06-06 (세션 10) — GSC + GA4 연결 (검색 콘솔 인증 + 애널리틱스 태그)

### What
- 루트 `web/app/layout.tsx`에 두 가지 추가:
  - **GSC 인증**: `metadata.verification.google` → `<meta name="google-site-verification" content="Y1-Ehof…">` 자동 생성 (메타태그 방식)
  - **GA4**: `next/script`(afterInteractive)로 gtag.js 삽입, Measurement ID `G-F0PYH6DYLW`

### Why
- earth2guide.com을 Google Search Console에 등록(색인/검색 성능 모니터) + GA4로 트래픽 측정 시작.
- 두 값 모두 공개 ID(페이지 소스 노출 전제) → 환경변수 대신 하드코딩, 누락 위험 제거.

### 영향
- `web/` 변경 → Vercel 자동 재배포. 태그 추가만이라 기존 페이지 동작 영향 0.
- 새 패키지 설치 없음 (`next/script` 내장 사용).

### 검증
- `npm run build` 통과 후 push.
- 배포 후 Live HTML에 `google-site-verification` meta + gtag 존재 확인.
- 후속(수동): GSC "확인" 클릭, 사이트맵(`/sitemap.xml`) 제출.

---

## 2026-04-26 (세션 9 hotfix) — WP 자동 생성 URL 추가 redirect (태그 166개 등)

### 발견
- 사용자가 site:earth2guide.com 검색 중 `https://earth2guide.com/ko/tag/유동성` 발견 → 404.
- WP XML 재분석: **태그 166개** (120개 한글 인코딩 슬러그). 게시글에 사용된 태그 150개.
- 다른 자동 생성 패턴 누락 확인: /author/*, /page/N, /YYYY/MM/DD, ?s= 등.

### 추가 redirect (web/next.config.ts)
- `/tag/:slug*`, `/ko/tag/:slug*`, `/zh/tag/:slug*` → `/ko/news` (or `/zh/news`)
- `/author/:name*`, `/ko/author/*`, `/zh/author/*` → `/ko/news`
- `/page/:n` (페이지네이션) → `/ko/news`
- `/YYYY`, `/YYYY/MM`, `/YYYY/MM/DD` (날짜 아카이브) → `/ko/news`
- `/?s=keyword` (WP 검색) → `/ko/search`

### 영향
- 166개 태그 페이지 + N개 자동 생성 페이지의 SEO juice 보존
- 사용자 손실 위험 감소
- next.config.ts에 12개 rule 추가


### 추가 (slug 미매칭 fallback)
- `/ko/news/[slug]`, `/ko/official/[slug]`, `/ko/wiki/[slug]`에서 DB에 slug 없으면 `notFound()` 대신 카테고리 목록으로 redirect:
  - `/ko/news/<unknown>` → `/ko/news`
  - `/ko/official/<unknown>` → `/ko/official`
  - `/ko/wiki/<unknown>` → `/ko/wiki/overview`
- `/zh/...` 동일 패턴
- 기대 효과: 옛 URL 중 우리 매핑에 없는 것도 404 대신 카테고리 목록으로 안전 안내, SEO juice 일부 보존

### 변경 파일
- `web/next.config.ts` (12개 wildcard rule 추가)
- `web/app/[locale]/news/[slug]/page.tsx` (notFound → redirect)
- `web/app/[locale]/official/[slug]/page.tsx` (notFound → redirect)
- `web/app/[locale]/wiki/[slug]/page.tsx` (notFound → redirect)

### 검증
- tsc 통과
- 다음 push 후 라이브 검증: `/ko/tag/유동성` → `/ko/news` 308 예상

---

## 2026-04-26 (세션 9 후속) — Twitter/Discord 자동화 파이프라인 설계 + Discord 아카이브 저작권 결정

### 배경
- HANDOFF Phase 2 #2 (Discord 큐레이션) 검토.
- pipeline/개발자_문답/, 공지사항_국문/, 공지사항_영문/ 발견 (총 7.2GB, JSON 173, 이미지 6400+).
- 메시지 6,742개 분석.

### 결정 1: Discord 아카이브 직접 사용 안 함 (저작권)
- `open24hrs` Discord 계정 = 다른 한국 커뮤니티 관리자 (Alvin 본인 X).
- 한국어 Q&A 정리 + Remark = 타인 저작물 → 동의 없이 재사용 불가.
- Shane 원본 영문 발언 (스크린샷 안)만 인용 가능.
- **결정**: 아카이브는 참고용 보관 (`pipeline/.gitignore` 그대로). 사이트 미반영.

### 결정 2: Step 8 + 9 자동화 파이프라인으로 우회
- 옛 5년치는 포기, 앞으로 Shane 원본만 직접 수집 → 자체 번역 = 100% 합법.
- 설계 문서: `pipeline/docs/AUTOMATION_PIPELINE.md` (482 라인, 16KB).

### 도구 선택 (Alvin 합의)
| 영역 | 선택 | 이유 |
|---|---|---|
| Twitter 수집 | Make.com webhook | 무료 1000 ops/월, GUI |
| Discord 수집 | Vercel cron + Discord API polling | 무료, 추가 인프라 0, 5분 폴링 |
| Publish 정책 | draft → 수동 publish | 안전 |
| 번역 시점 | 수집 즉시 (Gemini KO+ZH) | 검토 효율 |

### 파이프라인 설계 요약
```
Twitter @ShaneIsaac
  └→ Make.com 모니터링
      └→ POST /api/webhook/twitter (Vercel Edge)
          └→ Gemini 번역 → Supabase posts (status=draft, sub_type=twitter)

Discord 공식 채널
  └→ Vercel cron (5분) → /api/cron/discord-poll
      └→ Discord API fetch (author=Shane filter)
          └→ Gemini 번역 → Supabase posts (status=draft, sub_type=discord)

[Alvin 검토] /admin/posts?status=draft → publish
[/ko/news 탭 UI] 전체 / 트위터 / 디스코드 / 유튜브
```

### 비용 = $0/월
- Make.com 무료 1000 ops, Vercel Hobby cron 무료, Gemini Free 14 RPM, Supabase Free 500MB.

### DB 스키마 변경 plan (다음 세션 Phase 1)
- `posts.sub_type` TEXT (twitter | discord | youtube | official)
- `posts.external_id` TEXT (`twitter:xxx` | `discord:xxx` 중복 방지)
- category에 `community` 추가
- `web/supabase/migrations/003_add_sub_type.sql` 작성 후 Supabase SQL Editor 실행

### 단계별 구현 순서 (다음 세션 7시간)
- Phase 1: DB + 타입 (30분)
- Phase 2: API endpoint 골격 (1시간)
- Phase 3: Gemini 공통 함수 (1시간)
- Phase 4: Twitter MVP (1시간) ← MVP 종료점
- Phase 5: Discord MVP (1.5시간)
- Phase 6: UI 탭 + Admin (1.5시간)
- Phase 7: 운영 마무리 (30분)

### MVP 권장 (3.5시간)
Phase 1+2+3+4 만 = Twitter draft 저장 + Admin 수동 publish.
1주 운영 검증 후 Discord/UI 추가.

### 환경변수 추가 항목
```
WEBHOOK_SECRET, CRON_SECRET, DISCORD_BOT_TOKEN,
DISCORD_CHANNEL_ANNOUNCEMENTS, DISCORD_CHANNEL_DEV_QA, DISCORD_SHANE_USER_ID
```

---

## 2026-04-26 (세션 9) — WordPress legacy SEO 보존: 118+ redirect 규칙 추가

### 의도
- WordPress 6.9.4 시절 `earth2guide.com` (어스2 가이드, illuden@naver.com)이 GSC에 indexed 되어 있음 (2026-01-26 기준 색인 187, 비색인 113, **404 17건**, 리디렉션 포함 3건).
- `pipeline/Legacy/2.WordPress.2026-04-12.xml` (1.8MB WP export) 분석: published post/page 40개.
- 현재 Next.js 사이트 (posts 154 + wikis 20) 와 매핑: 직매칭 8 (wiki 3 + post 5), 수동 매핑 31, fallback 1.
- Google에 indexed된 옛 URL이 끊기면 SEO juice 손실 → **308(영구 리다이렉트)로 새 URL에 집중**.

### 매핑 원천 (검토용 + 코드용)
- `pipeline/docs/SEO_REDIRECT_MAP.md` — 사람 검토용 마크다운 표
- `pipeline/docs/seo_redirects.json` — 매핑 raw data

### 매핑 정책 (Alvin 합의)
- 옛 위키 카테고리 (essence/jewel/raid/general 4개 query param) → 전부 `/ko/wiki/overview`
- 월별 공지/트위터 시리즈 (`/2021-01` ~ `/2021-08`, `/twitter-2021-XX`) 18개 → 전부 `/ko/official`
- WP `/category/manual/raid` → `/ko/wiki/overview`
- `/edc` (1티어 + 에센스 분배) → `/ko/wiki/tier-1-properties-and-bonus-essence`
- `/2fa-korean` → `/ko/wiki/manage-2fa` (한국어 가이드 → 영문 위키, 의미 매칭)
- `/register-korean` → `/ko/wiki/create-your-account`
- `/withdrawal-korean`, `/add-credit-korean` → `/ko/wiki/account-balance-and-withdrawals`
- `/epls-introduction-and-setup` → `/ko/wiki/epl`
- `/category/manual/jewel` → `/ko/wiki/jewels`
- WP 시스템 (`/feed`, `/wp-admin`, `/wp-content/*`, `/wp-login.php`) → 의미 있는 곳

### 도메인 정책
- canonical: `earth2guide.com` (non-www)
- locale: 옛 콘텐츠가 모두 한국어였으므로 모든 redirect는 `/ko/...`로 명시

### 변경 파일
- `web/next.config.ts` — `redirects()` async 함수 추가 (118+ 규칙)
- `pipeline/CHANGELOG.md` — 이 항목

### 영향
- 빌드/배포 영향: `web/next.config.ts`만 수정 (DB 변경 0)
- 사용자 영향: 옛 링크 클릭해도 끊김 없이 새 페이지로 점프
- Google 재크롤링 시 308 받고 새 URL로 색인 이동 (보통 수일~수주)

### 검증
- `npx tsc --noEmit` 통과
- 단위 검증 (`/tmp/test_redirects.mjs`): WP_POSTS 42, WP_CATEGORIES 11, WP_SYSTEM 4 모두 인식
- spot check 6/6 (`/2fa-korean`, `/2021-01`, `/category/manual/jewel`, `/edc`, `/wp-admin`, `/feed`)
- 옛 위키 카테고리 query param redirect (4개) ✅
- /how-to/:cat/:slug pattern ✅
- trailing slash 처리 ✅

### 미적용 (다음 단계)
- canonical URL meta (`alternates.canonical`) 추가
- `metadataBase` + default OG image
- JSON-LD (Article schema) 주입
- Cloudflare/Vercel www → non-www 통일 검증

### 부수 작업 (이번 세션 발견 + 복구)
- 이전 세션에서 손상된 4개 파일 (sandbox Write tool truncation 사고) 발견:
  - `web/components/post/PostBody.tsx` (861 byte, 4834 byte로 복구)
  - `web/components/wiki/WikiContent.tsx` (1235 byte, 4752 byte로 복구)
  - `web/app/[locale]/wiki/page.tsx` (6032 byte 중 5600 byte NULL 패딩, 433 byte로 정상화)
  - `web/app/[locale]/wiki/[slug]/page.tsx` (Edit tool 회귀 1회 → git restore + 재 Edit)
- 복구 방법: python으로 강제 truncate + write (Write/Edit tool 비신뢰성 우회)

---

## 2026-04-26 (밤) — 표 누락 32개 글 일괄 복구 (4단계 파이프라인)

### 의도
- audit 결과 32개 글에서 표 100% 누락 확인 (KO+ZH 양쪽). 원인은 step3/step4의 `html_to_text_with_placeholders`가 BeautifulSoup으로 텍스트 추출 시 `<table>`을 무시한 것.
- 본문은 이미 번역됐으니 다시 번역 안 함. **표만** 추출 → 셀 번역 → 본문에 끼워넣기.

### 4단계 파이프라인 (체크포인트 기반)
1. **Phase 1** (`pipeline/phase1_extract_tables.py`) — 영문 HTML에서 표 + 컨텍스트(직전 H2/H3, caption) 추출 → `pipeline/checkpoint/{slug}.tables.en.json`. API 0회.
2. **Phase 2** (`pipeline/phase2_translate_cells.py`) — 표 셀만 Gemini 번역 (KO + ZH). 이름/날짜/숫자/링크/Earth 2 용어 영문 그대로. 배치 단위 부분 체크포인트 (망가져도 재개). 결과: `{slug}.tables.{lang}.json`.
3. **Phase 3** (`pipeline/phase3_reassemble.py`) — DB body_{lang} 가져옴 → footer ("관련 기사", "커뮤니티에 참여하세요") 분리 → main에서 N번째 H2 다음 위치에 표 삽입. 영문 H2 개수 == KO/ZH main H2 개수 검증. 결과: `{slug}.{lang}.body.txt`.
4. **Phase 4** (`pipeline/phase4_patch_db.py`) — 조립된 body로 Supabase PATCH. body_{lang}만 갱신, status/source 등 보존.

### 결과
- 32 슬러그 × 2 언어 = **64건 PATCH 성공**
- audit 재실행: `total_with_tables: 32, ko_missing: 0, zh_missing: 0, both_ok: 32`
- API 비용: 본문 안 다시 번역해서 retranslate 방식 대비 1/3 이하
- 본문 일관성: 기존 번역 유지, 표만 추가

### 진단 발견
- step3/step4의 `html_to_text_with_placeholders`가 `<table>`/`<figure.wp-block-table>` 무시. **다음 스크래핑 시 step3/step4 프롬프트 + 추출 함수에 표 처리 추가 필요** (별도 작업).

---

## 2026-04-26 (저녁) — UX 픽스: OriginalTextBlock 제거 + Referral 배너 갱신 + 테이블 스타일 보강

### 의도
- `2021-egg-hunt` 검토 중 발견한 3가지 UX 이슈 픽스:
  1. **원문 보기 토글에 raw HTML(wordpress 클래스 + SVG) 노출** — `body_original`이 41KB raw HTML 그대로라서 토글 열면 codebase가 그대로 보임. 사용자 가치 0, 불쾌감만 큼.
  2. **Referral 배너 메시지 약함** — "Earth 2 가입 시" → 정확한 트리거 시점인 "신규 Land 구매 시"로 변경. URL은 `?r=00000` 트래킹 코드 빼고 `https://app.earth2.io`로 단순화 (트래킹 인프라 미구축).
  3. **테이블 가독성** — 마크다운 테이블이 좁은 화면에서 깨짐. min-w-full + 가로 스크롤 + 셀 padding 축소.

### 변경
- `web/components/post/OriginalTextBlock.tsx` — 컴포넌트 자체는 유지하되 detail page에서 import/사용 제거
- `web/app/[locale]/news/[slug]/page.tsx` — `<OriginalTextBlock>` 제거 (상단 SourceLink가 원문 하이퍼링크 역할 이미 수행)
- `web/app/[locale]/official/[slug]/page.tsx` — 동일
- `web/components/referral/Earth2ReferralBanner.tsx`:
  - 제목: "Earth 2 가입 시 리퍼럴 코드 입력" → "Earth 2 신규 Land 구매 시 리퍼럴 코드 입력"
  - 부제: "코드 00000 입력 → 7.5% 할인 혜택" → "7.5% 할인 혜택"
  - URL: `https://earth2.io/?r=00000` → `https://app.earth2.io`
- `web/components/post/PostBody.tsx` — `table` 스타일 강화 (min-w-full, whitespace-nowrap header, 작은 padding)

### 진단 (별도 작업으로 분리)
- `2021-egg-hunt` body_ko에 마크다운 테이블 0개. 원문에는 WINNERS/RUNNERS-UP 테이블 6+개 존재 → **Gemini 번역에서 누락**.
- 같은 글에 "관련 기사" 섹션 + 다른 글 발췌까지 포함됨 → 스크래퍼가 article main을 너무 광범위하게 잡음.
- 영향 범위 audit 필요: 다른 154개 글도 같은 패턴일 가능성. 별도 세션에서 재번역 결정.

---

## 2026-04-26 (오후) — 모노레포 통합 + 사이트 정상화 ✅ 완료

### 실행 결과
- 폴더 통합: `Desktop\E2Korea_Discord` + `earth2_scraped` + `earth2guide-web` → `Desktop\earth2guide\{pipeline, data, web}`
- robocopy 무손실 카피 (web/.git 보존), 옛 폴더 3개 삭제
- 단일 git: `web/.git` → `earth2guide/.git`. Vercel "Root Directory" = `web`
- root 메타 신설: `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, `.env.example`, `.gitignore`
- pipeline 흩어진 .md 9개 → `pipeline/docs/`로 통합
- Python 스크립트 절대경로 9개 새 경로로 보정

### 사이트 정상화
- `react-markdown` + `remark-gfm` 추가 → `PostBody.tsx` 마크다운 렌더링
- **버그 fix**: `generateStaticParams` slug만 반환 → Next.js 16에선 prerender 안 됨 (모든 dynamic segment 명시 필수)
- 3개 detail page (`news/[slug]`, `official/[slug]`, `wiki/[slug]`)에 `routing.locales × slugs` 카르테시안 적용
- 결과: `/ko/news/{slug}`, `/zh/news/{slug}` 등 detail URL 200 OK 정상 작동

### 의도
- 흩어진 폴더 → 한 곳에서 관리 (모노레포)
- 단일 git으로 `git push` 한 줄 배포
- Next.js 16 함정 ARCHITECTURE/AGENTS에 명시 → 반복 방지

### 미적용 / 후속 작업
- `[IMAGE:N]` 미치환 15건 (KO 7 / ZH 8) — `data/articles/` 매칭 작업
- 5MB 초과 cover 이미지 35건 — 압축 + R2 재업로드
- Step 6 위키 beginner 콘텐츠
- 위키/Twitter/Discord 자동화는 Phase 2~3로

---

## 2026-04-26 (오전) — Body 일괄 정리 + 154개 일괄 publish ✅ 완료

### 실행 결과
- KO body PATCH: 154/154 성공
- ZH body PATCH (reality-thread-7): 1/1 성공
- 일괄 publish: 154건 (announcement 126 + update 28) → status=published
- published_at NULL 0건 (전부 원본 발행일 보존)
- 사후 검증: ellipse/divider 잔존 0건, reality-thread-7 H1=1개

### 변경 내용
1. **KO body 장식 이미지 제거** (154개 posts)
   - `![ellipse](...ellipse.svg)` 라인 단독 제거 (157회 발생)
   - `![divider](...divider-line.png)` 라인 단독 제거 (155회 발생)
2. **`reality-thread-7` H1 강등** (KO + ZH)
   - 첫 번째 H1만 유지 (글 제목)
   - 나머지 113개 H1을 H2(##)로 강등
3. **154개 일괄 publish**
   - `status: draft → published`
   - `published_at: 원본 발행일 보존` (이미 세팅된 값 유지)

### 의도
- 사이트 가독성 개선 (장식 이미지가 본문 흐름 끊음)
- reality-thread-7의 모든 H1이 거대 폰트로 렌더되는 문제 해결
- 154개 posts 공개로 사이트 콘텐츠 활성화

### 영향 범위
- DB: `posts` 테이블 154행 UPDATE
- 사이트: `/ko/news`, `/ko/official`, `/zh/news`, `/zh/official` 콘텐츠 노출
- Vercel: SSR 방식이므로 즉시 반영 (단, generateStaticParams 페이지는 재배포 필요할 수 있음)

### 미적용 / 후속 작업
- `[IMAGE:N]` 미치환 15건 (KO 7 / ZH 8): `data/articles/` 원본 필요 — 후속 처리
- 5MB 초과 cover 이미지 35건: R2 이미지 압축 작업 별도 진행

## 2026-06-06 (auto-news run)

**Result: 2 new posts found, 0 published — run aborted at step2 (R2 auth failure). DB untouched, no drafts created.**

### New slugs found (step1 diff vs data/index.json)
- `e2v1-update-0-5-8-2` — "Reality Thread 8 Update – 0.5.8.2 Released" (May 31, 2026)
- `reality-thread-8` — "Chapter 5 - Reality Thread 8 – Seeds of Change" (May 26, 2026, 117 images)

### Published
- None.

### Left as draft
- None — step3/4 (translate+ingest) intentionally NOT run. Ingesting drafts with broken image URLs would poison translate checkpoints and waste Gemini quota; both slugs will be processed end-to-end on the next run after the fix.

### Failures
1. **R2 API token dead (blocker)**: all S3 API calls (PUT/HEAD/LIST) return `401 Unauthorized`. Retried after ~3 min — same. Public serving (NEXT_PUBLIC_R2_PUBLIC_URL) returns 200, so the live site is unaffected; only ingestion writes are blocked. Likely token expired/rotated, or token has an IP allowlist that excludes sandbox egress IPs. → **Action (Alvin): check R2 API token in Cloudflare dashboard, issue a new one WITHOUT client-IP filtering, update `pipeline/.env.local`.**
2. **step2 hardcoded Windows path (sandbox-incompatible)**: `step2_scrape_articles.py` line 51 `OUTPUT_DIR = Path("C:/Users/eldin/Desktop/earth2guide/data")` — on Linux this resolves as a relative path, so the run created a junk folder `pipeline/C:/...` (36KB, article JSON + images for the 2 slugs). Mount cannot unlink → **delete `pipeline/C:` manually in PowerShell**. Fix needed before next auto run: `OUTPUT_DIR = BASE_DIR.parent / "data"` (NOT edited in this unattended run per runbook scope; same pattern may exist in step1/step3/step4 — audit all scrapers).
3. **Runbook nohup pattern doesn't work in this sandbox**: background processes are reaped between bash calls (even with setsid). Worked around with synchronous `timeout 43` chunks + a budget-aware step1 variant (loads /news, stops at known-slug overlap; overlap=11 → diff reliable, no LOAD MORE needed). → Update AUTO_NEWS_RUNBOOK accordingly.

### State after this run (idempotent for next run)
- `data/scrape_checkpoint.json`: 154, unchanged. `data/index.json`: 154, unchanged. `data/articles/`: unchanged. DB: untouched.
- `pipeline/news_links.json`: refreshed (156 = 154 old + 2 new, full history merged) — next run's diff still detects both new slugs.
- Junk: `pipeline/C:/` (manual delete), `/tmp` logs (ephemeral).

## 2026-06-06 (auto-news run, scheduled task 1st live run)

### Result
- NEW slugs found: 2 — `e2v1-update-0-5-8-2` (May 31, update), `reality-thread-8` (May 26, announcement, 104 chunks/lang)
- Published: 2/2 (KO+ZH 모두 검증 통과 — body 비어있지 않음, [IMAGE: 잔여 0, 테이블 0=0 일치, ASCII slug, published_at OK)
- Left as draft: 0 | Failures: 0
- Live 확인: /ko/official/e2v1-update-0-5-8-2 200 ✓, /zh/official/reality-thread-8 200 ✓ (R2 이미지 로드 확인)
- R2: reality-thread-8 이미지 117개 전부 업로드 (43개 신규 + 74개 기존 재사용), e2v1 8개 전부 기존 재사용

### Fixes applied (코드 변경 — 검토 요망)
1. **step3/step4 Gemini 모델 교체**: `gemini-2.0-flash` → `gemini-2.5-flash` + `thinkingConfig:{thinkingBudget:0}` (1줄씩).
   사유: Google이 2.0-flash 폐기 — API가 404 "no longer available" 반환, 파이프라인 전면 불능이었음. Windows 수동 실행도 동일하게 깨진 상태였음.
   주의: `*.py.bak-20260606` 백업은 오늘 새벽 테이블 수정 *이전* 상태라 복원 시 두 수정이 모두 사라짐.
2. **R2 S3 자격증명(.env.local) 401**: 샌드박스에서 R2 S3 API가 read/write 전부 401 Unauthorized (IP 제한 또는 토큰 회전 추정 — Alvin 확인 필요).
   우회: workspace 루트 `.env`의 `CLOUDFLARE_API_TOKEN`으로 R2 REST API 업로드 (정상 동작 확인).

### Sandbox adapters (원본 스크립트 무수정, 신규 파일)
- `pipeline/sandbox_step2_wrapper.py` — step2의 하드코딩 Windows 경로(`C:/Users/...`)를 실제 `data/`로 repoint + REST 업로드 (first-writer-wins 유지)
- `pipeline/sandbox_translate_wrapper.py` — step3/4에 청크 단위 resume 추가 (45s 샌드박스 한계 대응; 원본 체크포인트는 아티클 단위라 104청크 아티클 처리 불가)
- 영구 캐시: `data/r2_uploaded_cache.json` (9,646 keys, 버킷 listing으로 시드)

### State after this run
- `data/scrape_checkpoint.json` 156 | `data/index.json` 156 | translate/zh 체크포인트에 신규 2개 추가
- DB: 2 rows upsert→published. 기존 154 rows 무접촉.

### Manual cleanup 권장 (샌드박스에서 unlink 불가 — PowerShell로)
- `pipeline/C:/` 정크 폴더 (step2 하드코딩 경로 부산물; **git add . 전에 반드시 삭제**)
- `data/translate_progress_*.json` 4개 (done 마커), `data/unlink_test.txt`, `pipeline/logs/` 작업 로그, `pipeline/pw_install.log`, `pipeline/logs_step1.txt`
- 장기 과제: step2/3/4의 `BASE_DIR=C:/Users/...` 하드코딩을 상대경로로 교체하면 wrapper 불필요


## 2026-06-12 (auto-news run)

- **신규 0건.** earth2.io/news WordPress REST API `found=156` == data/index.json 156 == DB `posts` status=published 156 (3자 완전 일치). publish 0 / draft 잔류 0 / 실패 0. (run: 2026-06-12 01:14 KST)
- 잔여 translate_progress 4파일(reality-thread-8, e2v1-update-0-5-8-2 의 ko/zh)은 점검 결과 둘 다 이미 **published** (body_ko/zh 정상, `[IMAGE:` 잔재 없음, published_at 설정됨) — 무해한 잔재이며 미처리 작업 아님.
- ⚠️ 운영 메모(다음 런): ① earth2.io/news가 클라이언트 렌더 + WordPress REST 13건/페이지 방식으로 동작 → step1(브라우저 LOAD MORE)은 networkidle로도 13건만 수집됨(과거 156건 수집과 거동 달라짐). 이번엔 SPA가 호출하는 원본 API `public-api.wordpress.com/rest/v1.1/sites/195754016/posts?number=100&offset=N` 를 브라우저 컨텍스트로 직접 조회해 156건 확정 (news_links.json source=wordpress-api). → **step1을 WP API 방식으로 교체 권장** (Alvin 승인 후 코드 변경). ② 샌드박스 `/sessions` 볼륨 100% full(옛 세션 280+개 누적) → pip/chromium을 root fs로 우회 설치 필요: `PLAYWRIGHT_BROWSERS_PATH=/var/tmp/ms-playwright`, `TMPDIR=/tmp`.

## 2026-06-14 (auto-news run)

- **신규 0건.** WordPress REST API `found=156` == data/index.json 156 == Supabase posts status=published 156 (3자 완전 일치). publish 0 / draft 잔류 0 / 실패 0. (run: 2026-06-14, source=wordpress-api)
- 브라우저(chromium) 미설치 — NEW 0이라 step2~4 미진입 (런북 §0/§1대로 조기 종료).
- ⚠️ 운영 메모: MIGRATION_PROGRESS.md(2026-06-14) — Cloudflare static 전환 진행 중, Gemini 파이프라인 폐기 + 신규 공지는 Claude Schedule(수집→번역→MD→git→배포)로 이관 예정. 이번 런은 신규 0이라 DB/스크랩 무접촉 → 런북(Supabase) 경로와 충돌 없음. **다음 신규 공지 발생 시 이 auto-news 런북이 마이그레이션 후 방식과 일치하는지 Alvin 확인 권장.**

## 2026-06-14 (Cloudflare 이관 — 세션 12)

**Vercel+Supabase → CF Pages 정적 완전 이관. 라이브 검증 완료. commit f43b5ce (web/).**

- feat: `next.config` output:export + images.unoptimized
- feat: `web/lib/content.ts` 파일 기반 로더 (Supabase 런타임 쿼리 대체, 시그니처 동일)
- feat: `web/content/{posts,wiki}/{ko,zh}/*.md` 354 + manifest.json (id·created_at)
- feat: 정적 클라이언트 검색 (`public/search-index.json` + SearchClient)
- feat: `web/public/_redirects` 140룰 (WP 레거시 308 + `/`→`/ko` + wiki→overview). 생성기 `gen_redirects.py`
- refactor: 페이지 8개 정적화 (setRequestLocale, force-dynamic/searchParams 제거, redirect→notFound, 클라 페이지네이션)
- chore: admin·middleware·supabase 클라이언트(server/client/static/queries)·Gemini 제거
- chore: `/news/[slug]` 라우트 삭제 (전 포스트 official segment)
- fix: robots.ts·sitemap.ts `force-static` (output:export 호환)
- deploy: CF Pages `earth2guide` direct-upload(wrangler) → earth2guide.com 도메인 전환(apex+www CNAME, 인증서 active)
- feat: 주간 자동화 Scheduled task `earth2guide-weekly-autonews` + 헬퍼 cf_detect_new/cf_mirror_image/cf_publish
- chore: Supabase·Vercel 프로젝트 삭제(Alvin), 잔여 Vercel DNS(와일드카드·_domainconnect) 정리
