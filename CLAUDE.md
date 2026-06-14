# CLAUDE.md — earth2guide 프로젝트 작업 가이드

> AI 도구가 이 프로젝트에서 작업할 때 따르는 규칙. Alvin 글로벌 CLAUDE.md와 함께 적용.
> 상세 구조 → `ARCHITECTURE.md` · 현재 상태 → `CONTEXT.md` · 결정 로그 → `DECISIONS.md`

---

## 1. 프로젝트 정체

- **사이트**: https://earth2guide.com
- **Tier**: P1 (라이브 운영 — 자동화 + 모니터)
- **목적**: Earth 2 메타버스 KO/ZH 정보 허브
- **타겟**: KO/ZH 사용자 (영문 원본 번역)
- **스택**: **Next.js `output:export` 정적** · **Cloudflare Pages**(git 자동배포) · Cloudflare R2(이미지) · 콘텐츠 = 레포 MD. **런타임 DB·서버 없음.**
- **상태**: 156 posts + 23 wiki 라이브. Vercel·Supabase·Gemini **제거 완료**(2026-06-14 이관).

---

## 2. 배포 모델 ★먼저 읽기

- **배포 = git push 자동배포** (CF 네이티브 webhook, 2026-06-15 검증). git 프로젝트 = **`earth2guide-web`** (GitHub `illuden/earth2guide-web`).
  - ① `git add/commit/push origin main` — 버전관리 + 배포 소스
  - ② push하면 CF가 자동으로 최신 main을 빌드·배포 (네이티브 webhook). 별도 조작 불필요.
- ✅ **2026-06-15 검증**: 최근 배포 3건 전부 `github:push` 트리거. CF API 트리거(`POST .../deployments`, 토큰=루트 `.env`)는 이제 **선택적 폴백**(webhook 미발화 시). 주간 자동화는 안전차원에서 API 트리거도 함께 수행(중복이나 무해).
- 빌드: CF 클라우드 root=`web`, `npm install` + `npm run build`, output `out`, node 22. **빌드 깨지면 미배포(라이브 보존).**
- `package-lock.json`은 **의도적으로 git 미추적**(gitignore) — CF가 `npm install`로 크로스플랫폼 네이티브 의존성 해결. 로컬 dev lock은 디스크에 남음.
- web/ 코드 변경 시 로컬 빌드 선검증 권장: Windows `cd web && npm run build`.
- 롤백: CF 대시보드 → 이전 배포 Rollback, 또는 `git revert` + push + 재트리거.
- 배포 후 루트 URL은 CDN 캐시로 잠깐 구버전일 수 있음(`?cb=` 쿼리로 우회 확인). 현 토큰엔 Cache Purge 권한 없음 — 새 배포가 캐시 갱신.

> 현재 상태·잔여 작업은 **CONTEXT.md** 확인.

---

## 3. 폴더별 작업 규칙

### `web/` — Next.js 정적 사이트
- **push = 배포**. 작업 전 `git status`, 수정 후 `npm run build`(Windows)로 검증.
- 데이터는 `content/*.md` (DB 아님). 로더 = `lib/content.ts`.
- react-markdown 렌더 · Tailwind v4 · `output:export` 제약 준수(ARCHITECTURE § 주의).

### `content/` — 콘텐츠 소스 (★DB 대체)
- `posts/{ko,zh}` · `wiki/{ko,zh}` MD + `manifest.json`. **slug = unique 영문 고정.**
- 신규/수정은 `pipeline/cf_publish.py` 또는 동일 포맷 수기. **manifest·search-index.json 같이 갱신.**

### `pipeline/` — Python 자동화 헬퍼 (로컬 · gitignore)
- `cf_detect_new.py` / `cf_mirror_image.py` / `cf_publish.py`. MD 생성기라 배포에 직접 영향 없음.
- **주간 스케줄 태스크가 의존** — 경로·이름 함부로 변경 금지.

### `data/` · `_backup/` — 캐시·백업 (gitignore)
- `_backup/` **삭제 금지**(유일 백업). `data/`는 재스크래핑 가능.

---

## 4. 콘텐츠 / 배포 원칙

- content MD 일괄 변경은 **사후 검증**(개수 + 샘플 spot check).
- 신규 글은 `manifest.json` 등록돼야 리스트 노출 + `search-index.json` 갱신 필수.
- web/ 코드 변경 → **로컬 빌드 그린 확인 후** push(=배포).
- R2 이미지 URL은 `NEXT_PUBLIC_R2_PUBLIC_URL` 기준. 보존 용어 영문 유지.

---

## 5. 절대 하지 말 것

- ❌ `data/`·`pipeline/Discord_*`·`_backup/`·`.env.local` git commit
- ❌ `slug` 한국어/중국어로 변경 (영문 통일 — earth2.io 원본 URL 일치)
- ❌ Discord JSON 아카이브 사이트 직접 노출 (저작권)
- ❌ content 일괄 변경 후 검증 생략
- ❌ 빌드 그린 확인 없이 web/ 대량 변경 push (= 깨진 채 배포 시도)
- ❌ 시크릿(R2 쓰기키·토큰 등) 하드코딩·로그·커밋

---

## 6. 항상 할 것

- ✅ web/ 변경 전 `git status`, 변경 후 `npm run build`(Windows) 검증
- ✅ content/배포 영향 변경은 `DECISIONS.md` + `pipeline/CHANGELOG.md`에 의도 기록
- ✅ commit 메시지: `feat:` / `fix:` / `chore:` / `refactor:` / `docs:`
- ✅ 보존 용어 영문 그대로 유지
- ✅ ★**파일·git 검증은 Windows(PowerShell) 또는 Read 툴로** — 샌드박스 bash는 이 repo에서 NUL 바이트·git index 깨짐을 **허위 보고**함(virtiofs mount 버그)

---

## 7. 보존 용어 (번역 시 영문)

```
Essence, Jewel, Tile, Cydroid, E-ther, Mentar, Earth 2, E2,
Shane Isaac, E2V1, E2V2, Raid, Holobuilding, EPL, $ESS
```

---

## 8. 자주 쓰는 명령어

```bash
# 웹 개발 (Windows PowerShell)
cd C:\Users\eldin\Desktop\Claude\Projects\Claude-Workspace\projects\earth2guide\web
npm run dev
npm run build          # out/ 생성 — 배포 전 로컬 검증

# 배포 = ① git push  ② CF API 빌드 트리거 (둘 다 필요)
cd ..
git add .
git commit -m "feat: ..."
git push origin main
# ② CF 빌드 트리거 (토큰은 .env에서 로드, 출력 금지):
#   POST https://api.cloudflare.com/client/v4/accounts/$ACCT/pages/projects/earth2guide-web/deployments
#   → deployments?per_page=1 폴링해서 latest_stage.status = success 확인
```

---

## 9. 진행 중 / 대기 (상세 → CONTEXT.md, DECISIONS.md)

- ✅ Cloudflare Pages 정적 이관 완료 (2026-06-14)
- ✅ git 배포 전환 — CF git 프로젝트 `earth2guide-web` + API 배포 트리거(Option C), 도메인 컷오버 완료 (2026-06-14)
- ⬜ essence / 근황 페이지 GSC 색인·순위 모니터 (2~6주)
- ⬜ 주간 자동화(`earth2guide-weekly-autonews`, 월 09:08) 첫 실행 확인
- ⬜ (선택) `package.json` 미사용 `@supabase` 의존성 제거 · ZH 카드 '읽기' 라벨 i18n

---

*v0.2 — 2026-06-14 · Cloudflare 정적 이관 + git 자동배포 반영. 구 Vercel/Supabase/Gemini/DB-dry-run·react-markdown SSR 서술 전면 교체. (v0.1 = 2026-04-26 모노레포 통합 시점)*
