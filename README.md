# earth2guide

> Earth 2 메타버스 한국어/중국어 정보 허브
> https://earth2guide.com

---

## 폴더 구조 (한눈에)

```
earth2guide/
├── README.md           ← 이 문서
├── ARCHITECTURE.md     ← 시스템 구조 (자세히)
├── CLAUDE.md           ← AI 작업 가이드
├── .env.example        ← 환경변수 키 안내
├── .gitignore
├── .git/               ← 모노레포 단일 git
│
├── web/                ← Next.js (Vercel 빌드 root)
├── pipeline/           ← Python 스크래퍼 + 문서 (git 무시)
└── data/               ← 스크래핑 캐시 (git 무시)
```

---

## 빠른 시작

### 사이트 개발
```
cd C:\Users\eldin\Desktop\earth2guide\web
npm run dev
```

### 콘텐츠 작업
```
cd C:\Users\eldin\Desktop\earth2guide\pipeline
python check_db.py
```

### 배포 (모노레포 root에서)
```
cd C:\Users\eldin\Desktop\earth2guide
git status
git add .
git commit -m "fix: ..."
git push origin main
```

---

## 어디 가서 뭘 보지?

| 알고 싶은 것 | 어디 봐 |
|---|---|
| 전체 구조/DB/라우팅 | `ARCHITECTURE.md` |
| AI 작업 규칙 | `CLAUDE.md` |
| 환경변수 | `.env.example` (안내) / `web/.env.local`, `pipeline/.env.local` (실값) |
| 진행 기록 | `pipeline/CHANGELOG.md` |
| 가장 최신 핸드오프 | `pipeline/docs/HANDOFF.md` |
| 콘텐츠 기획 | `pipeline/docs/CONTENT_PLAN.md` |
| SEO 전략 | `pipeline/docs/CONTENT_STRATEGY.md` |
| 옛 세션 핸드오프 | `pipeline/docs/HANDOFF_session3.md`, `HANDOFF_session5.md` |

---

## 인프라 한 줄 요약

```
earth2.io/news → Playwright(pipeline) → R2(이미지) + Supabase(번역본) → Vercel(web) → earth2guide.com
```

상세는 `ARCHITECTURE.md`.

---

## Git / Vercel 작동 원리

- 단일 git: `earth2guide/.git`
- GitHub repo: `illuden/earth2guide-web`
- Vercel: GitHub repo의 **`web/` 폴더를 root directory**로 빌드
- main 브랜치 push → 자동 배포

`pipeline/`, `data/`는 .gitignore로 git에 안 올라감 (대용량/민감 보호).

---

## 진행 상황 (2026-04-26)

```
✅ Step 1~4: 154개 스크래핑/번역(KO+ZH)/publish 완료
✅ 폴더 모노레포 통합
⬜ PostBody 마크다운 → HTML 렌더링 추가
⬜ Vercel 재배포 (모노레포 Root Directory = web 설정)
⬜ Step 6: earth2.io/how-to 위키 beginner
⬜ Step 7: Discord JSON → 위키 초안
⬜ Step 8/9: Twitter/Discord 자동 수집
⬜ Step 10: 소식 페이지 탭 UI
⬜ Step 11: SEO 배치
```
