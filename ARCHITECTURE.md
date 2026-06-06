# ARCHITECTURE — earth2guide

> 전체 시스템 한 페이지. 자세한 핸드오프는 `pipeline/docs/HANDOFF.md`.

---

## 모노레포 구조

```
C:\Users\eldin\Desktop\earth2guide\
│
├── README.md          ← 프로젝트 개요 + 빠른 시작
├── ARCHITECTURE.md    ← 이 문서 (시스템 구조)
├── CLAUDE.md          ← AI 작업 가이드
├── .env.example       ← 환경변수 키 가이드 (실값 X)
├── .gitignore         ← 대용량/민감 파일 보호
├── .git/              ← 모노레포 단일 git (GitHub: illuden/earth2guide-web)
│
├── web/               ← Vercel 빌드 대상 (Next.js)
│   ├── app/           ← App Router (i18n: ko/zh)
│   ├── components/    ← UI 컴포넌트
│   ├── lib/supabase/  ← DB 쿼리/클라이언트
│   ├── messages/      ← UI 번역 (ko.json, zh.json)
│   ├── .env.local     ← 빌드/런타임 키 (anon, R2 public)
│   └── ...
│
├── pipeline/          ← Python 스크립트 + Discord 아카이브 + 문서
│   ├── scrapers/
│   │   ├── step1_collect_links.py     ← earth2.io/news 링크 수집
│   │   ├── step2_scrape_articles.py   ← 본문/이미지 R2 업로드
│   │   ├── step3_translate_and_ingest.py  ← EN→KO 번역 + DB 저장
│   │   └── step4_translate_zh.py      ← EN→ZH 번역 + DB PATCH
│   ├── check_db.py    ← DB 현황 확인
│   ├── docs/          ← HANDOFF, CONTENT_PLAN 등 기획 문서
│   ├── CHANGELOG.md   ← 진행 기록
│   ├── .env.local     ← 서비스 키 (service_role, Gemini, R2 secret)
│   └── (Discord JSON 아카이브 — git 무시)
│
└── data/              ← 스크래핑 캐시 (git 무시)
    ├── articles/      ← 154개 EN 원본 JSON
    ├── images/        ← 661개 R2 업로드 이미지 (로컬 사본)
    ├── index.json
    └── *_checkpoint.json
```

---

## 데이터 흐름

### News (posts)

```
earth2.io/news
  ↓ Playwright (step1, step2)
data/articles/*.json + data/images/*
  ↓ (R2 업로드 → wiki/news/* 661개)
Cloudflare R2 (e2korea bucket)
  ↓ (Gemini 2.0 Flash 번역, step3/step4)
Supabase posts (status=draft → published)
  ↓ (Vercel SSR/ISR)
earth2guide.com (KO/ZH)
```

### Wiki (wiki_pages, 세션 8 추가)

```
earth2.io/how-to (7 카테고리, 20 페이지)
  ↓ Playwright (step5_howto_scraper)
data/wiki/*.json + data/wiki_images/* (191개)
  ↓ (R2 업로드 → wiki/*)
Cloudflare R2 (e2korea bucket)
  ↓ (Gemini 2.0 Flash 번역, step6_translate_wiki — KO+ZH)
Supabase wiki_pages (status=published)
  ↓ (step7_inject_images — 이미지 마크다운 위치 매핑)
earth2guide.com/{ko|zh}/wiki/{slug}
```

### News 표 복구 4-Phase (세션 8 추가)

```
data/articles/*.json (영문 원본)
  ↓ phase1_extract_tables  (오프라인, API 0)
checkpoint/{slug}.tables.en.json
  ↓ phase2_translate_cells (Gemini, 셀 단위 번역)
checkpoint/{slug}.tables.{lang}.json
  ↓ phase3_reassemble      (DB body 가져옴 + footer 분리 + N번째 H2 매칭)
checkpoint/{slug}.{lang}.body.txt
  ↓ phase4_patch_db        (Supabase PATCH)
posts.body_{lang} (표 보존)
```

---

## 인프라

| 레이어 | 서비스 | 용도 |
|---|---|---|
| 도메인 | Cloudflare | earth2guide.com |
| 호스팅 | Vercel | Next.js 빌드/배포 (web/ 하위에서) |
| DB | Supabase | posts, wiki_pages, auth |
| 파일 | Cloudflare R2 | bucket: e2korea (이미지) |
| 번역 | Gemini 2.0 Flash | EN → KO/ZH |
| GitHub | illuden/earth2guide-web | 단일 repo, web/ 폴더가 빌드 root |

---

## DB 스키마 (요약)

```
posts:
  id, slug (unique), category, title_ko/zh, body_ko/zh, summary_ko/zh,
  source_url, cover_image_url (R2),
  status (draft|published|archived),
  source (gemini|manual|bot),
  translation_status (pending|done|failed),
  published_at, created_at, updated_at

wiki_pages:
  id, slug, category (account|essence|jewel|raid|general|beginner),
  title_ko/zh, body_ko/zh, sort_order, status, ...
```

slug는 단일 컬럼 (영문, earth2.io 원본 URL과 100% 일치). KO/ZH가 같은 slug 공유.

### Wiki 카테고리 (2026-04-26 세션 8: 5개 → 7개)

```
overview / account / land / sub-asset / ecosims / create / market
```

earth2.io/how-to URL 패턴 (`/how-to/{category}/{slug}`) 1:1 매핑.
사이드바 표시 순서 = `WIKI_CATEGORY_META` 키 순서 (`web/lib/supabase/types.ts`).
DB CHECK constraint 갱신: `web/supabase/migrations/002_wiki_category_v2.sql`.

---

## 라우팅

```
/ → /ko (default redirect)
/ko/news, /ko/news/[slug]            ← 소식
/ko/official, /ko/official/[slug]    ← 공식 (announcement|update|promotion)
/ko/wiki → /ko/wiki/overview         ← redirect (어스2 패턴)
/ko/wiki/[slug]                      ← 위키 (사이드바 + 본문 단일 레이아웃)
/ko/search                           ← 검색 (ilike)
/zh/* (동일 구조)
/admin/*                             ← Supabase Auth 보호
```

`generateStaticParams`로 빌드 시점에 published slug 목록 받아서 페이지 prerender.

---

## 카테고리 매핑

| posts.category | URL | 비고 |
|---|---|---|
| news | /news/[slug] | |
| announcement | /official/[slug] | 공지 |
| official_news | /official/[slug] | 뉴스성 |
| update | /official/[slug] | 버전 업데이트 |
| promotion | /official/[slug] | 홍보 |
| dev_qa | (Phase 3) | 개발자 QA |
| community | /news/twitter or /news/discord (Phase 3) | sub_type 컬럼 필요 |

---

## Git / 배포

- 단일 git: `earth2guide/.git`
- GitHub: `illuden/earth2guide-web`
- Vercel: GitHub repo의 `web/` 폴더를 root directory로 빌드
- main 브랜치 push → 자동 배포

```
cd C:\Users\eldin\Desktop\earth2guide
git status
git add .
git commit -m "fix: ..."
git push origin main
```

---

## Next.js 16 주의사항 (실제 부딪힌 함정)

> Next.js 16은 14/15와 동작이 다름. AI 에이전트가 옛 패턴 적용하면 빌드는 통과해도 런타임 500 가능.

### 1. `generateStaticParams`는 모든 dynamic segment 명시 필수

라우트가 `[locale]/news/[slug]`처럼 **dynamic segment 2개 이상**이면, `generateStaticParams`가 모두 반환해야 함. 하나라도 빠지면 페이지가 prerender 안 되고 런타임 매칭 실패 → 500.

```ts
// ❌ 틀림 (slug만 반환 — Next.js 14에선 통했지만 16에선 안 됨)
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.map((slug) => ({ slug }))
}

// ✅ 맞음 (locale × slug 카르테시안)
import { routing } from '@/i18n/routing'
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}
```

증상: `x-matched-path: /500`, 모든 detail URL 500, 목록 페이지는 정상.

### 2. params는 Promise

```ts
// ✅ 맞음
interface PageProps { params: Promise<{ locale: string; slug: string }> }
const { locale, slug } = await params
```

### 3. revalidate / dynamicParams 명시 권장

```ts
export const revalidate = 3600       // ISR 1시간
export const dynamicParams = true    // 기본값이지만 명시
```

### 4. react-markdown은 server component에서 OK

`'use client'` 추가 필요 없음. 단, Tailwind v4에서 `prose` 클래스는 `@tailwindcss/typography` plugin 필요 — 우리는 plugin 없이 `components` prop으로 element별 직접 스타일링.
PostBody.tsx + WikiContent.tsx 동일 패턴.

### 5. dynamicParams = true 명시 권장

빌드 시점에 slug 0건이거나 push 후 새 slug 추가될 때, ISR로 첫 방문 시 페이지 생성. 명시 안 하면 일부 환경에서 404 가능. wiki/[slug]/page.tsx에 명시함.

### 6. HTML → 마크다운 추출 시 walk 함수 함정

`<p><img/></p>` 구조에서 p 태그 처리 후 return하면 img 자식 walk 안 됨 → `[IMAGE:N]` placeholder 누락 → 번역 결과에 이미지 0개. p/li/blockquote 안 img는 별도 처리 필수 (step6에서 fix). step3/step4 옛 코드에도 같은 버그 있음 — 다음 세션에서 fix 필요.

`<table>` / `<figure.wp-block-table>`도 walk에서 별도 처리. step3/step4에 누락돼 32개 글 표 100% 누락된 문제 발생 → 4-Phase 파이프라인으로 사후 복구함.

---

## 보존 용어 (번역 시 영문 유지)

```
Essence, Jewel, Tile, Cydroid, E-ther, Mentar, Earth 2, E2,
Shane Isaac, E2V1, E2V2, Raid, Holobuilding, EPL, $ESS
```
