# CHANGELOG — earth2guide.com

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

