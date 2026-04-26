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

```
earth2.io/news
  ↓ Playwright (step1, step2)
data/articles/*.json + data/images/*
  ↓ (R2 업로드)
Cloudflare R2 (e2korea bucket)
  ↓ (Gemini 2.0 Flash 번역, step3/step4)
Supabase posts (status=draft → published)
  ↓ (Vercel SSR/ISR)
earth2guide.com (KO/ZH)
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

---

## 라우팅

```
/ → /ko (default redirect)
/ko/news, /ko/news/[slug]            ← 소식
/ko/official, /ko/official/[slug]    ← 공식 (announcement|update|promotion)
/ko/wiki, /ko/wiki/[slug]            ← 위키
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

## 보존 용어 (번역 시 영문 유지)

```
Essence, Jewel, Tile, Cydroid, E-ther, Mentar, Earth 2, E2,
Shane Isaac, E2V1, E2V2, Raid, Holobuilding, EPL, $ESS
```
