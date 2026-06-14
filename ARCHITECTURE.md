# ARCHITECTURE — earth2guide

> 전체 시스템 한 페이지. **2026-06-14 Cloudflare Pages 정적 이관 + git 자동배포** 반영.
> 변경 이력 → `DECISIONS.md` · 세션 흐름 → `sessions/` · 현재 상태 → `CONTEXT.md`.

---

## 한 줄 요약

Earth 2 메타버스 **KO/ZH 정보 허브**. Next.js `output:'export'` **정적 사이트**, **Cloudflare Pages** 호스팅, 콘텐츠는 레포 안의 **마크다운**. 런타임 서버·DB 없음. 신규 공지는 주간 Claude 자동화가 MD를 커밋·push하면 **CF가 자동 빌드·배포**.

---

## 모노레포 구조

루트(= git repo root): `C:\Users\eldin\Desktop\Claude\Projects\Claude-Workspace\projects\earth2guide\`
GitHub: `illuden/earth2guide-web` (이제 **배포 소스**)

```
earth2guide/
├── ARCHITECTURE.md / CLAUDE.md / CONTEXT.md / DECISIONS.md   ← 문서 (레포 추적)
├── .git/                       ← 단일 git
│
├── web/                        ← ★CF Pages 빌드 대상 (root directory)
│   ├── .node-version           ← 22 (CF 빌드 node 핀)
│   ├── next.config.ts          ← output:'export' + images.unoptimized
│   ├── content/                ← ★콘텐츠 소스 (레포 = DB 대체)
│   │   ├── posts/{ko,zh}/*.md   (156×2)
│   │   ├── wiki/{ko,zh}/*.md    (23×2)
│   │   └── manifest.json        (리스트·사이트맵 메타)
│   ├── lib/
│   │   ├── content.ts           ← 파일 기반 데이터 로더 (프론트매터 자체 파서, 의존성 0)
│   │   ├── referral.ts          ← 리퍼럴 코드 단일 소스
│   │   └── supabase/types.ts    ← Post 타입 + getPostSegment + CATEGORY_META (이름만 잔존, DB 클라이언트 아님)
│   ├── app/                     ← App Router (i18n ko/zh, static export)
│   ├── components/              ← UI (news/official/wiki/search/referral)
│   ├── messages/                ← UI 번역 ko.json / zh.json
│   ├── public/
│   │   ├── _redirects           ← WP 레거시 308 (135 룰)
│   │   └── search-index.json    ← 정적 검색 인덱스
│   └── .env.local               ← 빌드 공개값 NEXT_PUBLIC_* (gitignore)
│
├── pipeline/                   ← 로컬 전용 자동화 헬퍼 (gitignore · 배포 무관)
│   ├── cf_detect_new.py         ← earth2.io WordPress API diff (신규 탐지)
│   ├── cf_mirror_image.py       ← 이미지 R2(e2korea) 업로드
│   ├── cf_publish.py            ← MD + manifest + search-index 갱신
│   └── .env.local               ← R2 쓰기 시크릿 등 (gitignore)
│
└── _backup/                    ← posts/wiki/discord 유일 백업 (gitignore · 삭제 금지)
```

**삭제된 동적 잔재** (이관 시): `app/admin`, `lib/actions`, `components/admin`, `middleware.ts`, `lib/supabase/{client,server,static,queries}.ts`.

---

## 데이터 흐름

### 기존 콘텐츠 (박제)

154+ EN 원본 → (과거 Gemini 번역, 검증·색인 완료) → **레포 MD로 동결**. **재번역 안 함** (SEO 보존).

### 신규 공지 (주간 자동화)

```
earth2.io (WordPress REST API)
  │  cf_detect_new.py        — diff, 신규 글만
  ▼
Claude 번역 (KO/ZH, 보존용어 유지)   — Cowork scheduled task
  │  cf_mirror_image.py       — 이미지 → Cloudflare R2 (e2korea)
  │  cf_publish.py            — web/content/*.md + manifest.json + search-index.json
  ▼
git commit + push (main)
  ▼
★ Cloudflare Pages 자동 빌드 (npm run build → out/) → 자동 배포
  ▼
earth2guide.com 반영
```

스케줄: **`earth2guide-weekly-autonews`** (매주 월 09:08 KST). 신규 0건이면 무커밋·무배포(라이브 보존).

---

## 인프라

| 레이어 | 서비스 | 비고 |
|---|---|---|
| 도메인 / DNS | Cloudflare | earth2guide.com (+ www) |
| 호스팅 | **Cloudflare Pages (정적)** | GitHub 연결 · main push = 자동 배포 |
| 빌드 | CF 클라우드 빌더 | root=`web`, `npm run build`, output `out`, node 22 |
| 콘텐츠 | 레포 MD | **DB 없음** |
| 이미지 | Cloudflare R2 | bucket `e2korea` · `pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev` |
| 검색 | 정적 `search-index.json` | 클라이언트 필터 (런타임 쿼리 없음) |
| 번역 / 수집 | **Claude (Cowork scheduled)** | 주간 |
| 소스 / 배포 | GitHub `illuden/earth2guide-web` | **배포 트리거 = main push** |
| 분석 | GA4 `G-F0PYH6DYLW` + GSC + Naver | `app/layout.tsx` 하드코딩 (공개값) |

**제거됨**: Vercel 호스팅 · Supabase DB/Auth · Gemini 번역 · ISR/SSR 런타임.

---

## 빌드 / 배포 ★핵심

- **방식: Cloudflare Pages ↔ GitHub 네이티브 연결.** `main` push → CF가 클라우드에서 빌드·배포. (구 wrangler 다이렉트 업로드 폐기)
- **CF 빌드 설정**:
  - production branch: `main`
  - root directory: `web`
  - build command: `npm run build`
  - build output: `out`
  - node: `web/.node-version` = `22`
- **빌드 env** (전부 공개값 — 시크릿 아님):
  - `NEXT_PUBLIC_SITE_URL` = https://earth2guide.com
  - `NEXT_PUBLIC_REFERRAL_CODE` = 00000
  - `NEXT_PUBLIC_R2_PUBLIC_URL` = https://pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev
  - `NEXT_PUBLIC_DEFAULT_LOCALE` = ko
- **롤백**: CF 대시보드 → 이전 배포 Rollback, 또는 `git revert` + push.
- 빌드 실패 시 자동배포 안 됨 → **라이브 보존**.
- 비상 수동 배포(연결 장애 시): `npx wrangler pages deploy out --project-name=<proj> --branch=main` (CF 토큰 = 루트 `.env`).

> ⚠️ git push = 빌드·배포 트리거. 문서만 바꿔 push해도 빌드 1회 돔(무해). 빈번하면 CF에서 빌드 경로 필터 설정.

---

## 콘텐츠 포맷

- 로케일별 MD: `content/posts/{ko,zh}/{slug}.md`, `content/wiki/{ko,zh}/{slug}.md`
- **frontmatter**(JSON 스칼라: `id`=slug, title, category, summary, created_at …) + 본문 마크다운(`![](R2-url)` 이미지)
- `manifest.json` = 전 posts+wiki 리스트/사이트맵 메타
- `content.ts`: manifest=리스트, per-locale MD=상세 본문으로 로드. 공개 시그니처(getLatestPosts/getPostList/getPostBySlug/getWikiPages/searchPosts …) 유지.

---

## 라우팅 (static export)

```
/  →  /ko
/[locale]/news,  news 리스트            ← 현재 빈 목록 (전 글 official)
/[locale]/official,  /[locale]/official/[slug]   ← 전 156 포스트
/[locale]/wiki,      /[locale]/wiki/[slug]        ← 23 위키
/[locale]/search                        ← 정적 검색
/[locale]/about, /privacy, /terms
  (locale = ko | zh)
```

- next-intl middleware **없음** → `setRequestLocale(locale)` + `generateStaticParams`로 ko/zh × slug 전부 빌드 시 prerender.
- `/admin` 없음. `/news/[slug]` 라우트 삭제(전 글 official) — news/dev_qa 카테고리 생기면 복원.

---

## Next.js 16 + static export 주의 (실제 함정)

1. **`generateStaticParams`는 모든 dynamic segment 반환** — `[locale]/.../[slug]`면 locale×slug 카르테시안 전부. 하나 빠지면 prerender 실패.
2. **`params`는 Promise** — `const { locale, slug } = await params`.
3. **`output:'export'` 제약** — ISR/`revalidate`/`force-dynamic` 불가. 런타임 `redirect()`→`notFound()`, `searchParams` 페이지네이션→**클라이언트 슬라이스**.
4. **middleware 불가** (output:export) → WP 레거시 308은 `public/_redirects`로.
5. **react-markdown은 server component OK**. `prose`는 plugin 없이 `components` prop으로 element별 직접 스타일.
6. **이미지 `unoptimized`** (CF Pages엔 Image Optimization API 없음) → R2 원본 URL 그대로.

---

## 보존 용어 (번역 시 영문 유지)

```
Essence, Jewel, Tile, Cydroid, E-ther, Mentar, Earth 2, E2,
Shane Isaac, E2V1, E2V2, Raid, Holobuilding, EPL, $ESS
```
