# earth2guide — Context

**Last updated**: 2026-06-14 (세션 14 — git 배포 전환: CF git 프로젝트 + API 트리거 + 도메인 컷오버)
**Status**: 배포됨 (라이브 — **Cloudflare Pages 정적, git 프로젝트 `earth2guide-web`**)

## 한 줄 요약
Earth 2 메타버스 KO/ZH 정보 허브 (https://earth2guide.com). Next.js `output:export` 정적, **CF Pages git 프로젝트**(`earth2guide-web`, GitHub illuden/earth2guide-web) 빌드. 콘텐츠 = 레포 MD(156 posts + 23 wiki). 런타임 DB 없음. **배포 = git push + CF API 빌드 트리거(Option C).** 신규 공지는 주간 Claude 스케줄.

## 현재 상태 (세션 14)
- **배포 모델 전환 완료**: 구 direct-upload(wrangler) → **CF git 프로젝트 `earth2guide-web`**(GitHub 연결).
  - 빌드: CF 클라우드, root=`web`, `npm install` + `npm run build`, out, node 22(`web/.node-version`). 빌드 env 4개(NEXT_PUBLIC_SITE_URL / REFERRAL_CODE / R2_PUBLIC_URL / DEFAULT_LOCALE) 설정됨.
  - **배포 트리거 = CF API** (`POST /accounts/{acct}/pages/projects/earth2guide-web/deployments`). ⚠️ git push 네이티브 webhook **미작동** → 미사용. 배포는 항상 API로(자동화 / Claude가 push 직후).
  - **lockfile git 미추적**(gitignore): Windows 생성 lock이 Linux 네이티브(@next/swc-linux, @parcel/watcher-linux) 누락 → CF `npm install`로 해결. 로컬 dev lock은 디스크 유지.
- **도메인 컷오버 완료**: `earth2guide.com` + `www` = **earth2guide-web 프로젝트에 연결**(둘 다 active). 구 프로젝트(earth2guide)는 도메인 0(폴백 보존). DNS CNAME → `earth2guide-web.pages.dev`. 라이브 검증: earth2guide.com/ko HTTP 200 + 신규 콘텐츠(상세 리퍼럴 배너 + 00000 복사) 서빙 확인.
- **주간 자동화 갱신**: `earth2guide-weekly-autonews` STEP4/5 = git push + CF API 트리거(로컬 빌드·wrangler 제거).
- 진행 중: 없음.
- 다음: ① 월요일(6/15) 자동화 첫 실행 확인(push + CF API 트리거 동작?) ② essence/근황 GSC 색인·순위 2~6주 ③ **P6(1주 후): 구 earth2guide 프로젝트 삭제 + 와일드카드/_domainconnect DNS 정리**.

## ★ 목표 (보류 — Alvin 기대치, 당장 X)
**git push = CF 자동 트리거** 구조. Alvin이 원하는 최종형 = CF Builders ↔ Git 네이티브 연결로 `git push` 하면 자동 빌드·배포(2단계 API 트리거 불필요).
- 현재: 네이티브 webhook이 push 이벤트를 안 받아 **Option C(push 후 CF API 명시 트리거)**로 우회 중. 기능은 동일하나 트리거가 자동이 아님.
- 해결 옵션: **(a)** GitHub의 Cloudflare Pages 앱 webhook 재연결/권한 재승인 디버깅(네이티브 유지) · **(b)** GitHub Actions(push→빌드→wrangler 배포, CF 토큰을 GH 시크릿에). (b)가 가장 확실.
- 시점: Alvin이 결정. 지금은 보류.

## SEO/GSC 메모 (세션 13, 변동 없음)
- 타겟 키워드(어스2 에센스·코인·근황) GSC 노출 0, `어스2 출금`=5.5위 → 전용 페이지 전략. essence/근황 위키 신설됨. 색인 2~6주 모니터.
- 리포트: 루트 `SEO_KEYWORD_PLAN_2026-06-14.html`, `MIGRATION_AUDIT_2026-06-14.html`.

## 기술 스택
- Next.js `output:export` / next-intl v4(`setRequestLocale`) / Tailwind v4 / **CF Pages git 프로젝트 `earth2guide-web`** / R2(`e2korea`, `pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev`)
- GA4 `G-F0PYH6DYLW` + GSC(URL-접두어·HTML태그) + Naver
- repo: GitHub `illuden/earth2guide-web` (web/만 추적; pipeline/·data/·_backup/·**package-lock.json** gitignore)

## 주요 파일·디렉토리
- `web/lib/content.ts` — 파일 기반 데이터 로더
- `web/content/{posts,wiki}/{ko,zh}/*.md` + `manifest.json` — 콘텐츠
- `web/lib/referral.ts` — 리퍼럴 코드 단일소스
- `web/.node-version` — `22` (CF 빌드 node 핀)
- `web/public/_redirects`, `web/public/search-index.json`
- `pipeline/cf_detect_new.py`/`cf_mirror_image.py`/`cf_publish.py` — 자동화 헬퍼(로컬)
- `_backup/` — posts/wiki/discord 유일 백업(로컬, gitignore)

## ⚠️ 운영 주의
1. **배포는 2단계**: ① `git push` ② CF API 배포 트리거. **push만으론 라이브 안 바뀜**(네이티브 webhook 미사용).
2. **파일·git 검증은 Windows(PowerShell) 또는 Read 툴** — 샌드박스 bash는 이 repo서 NUL·git index 깨짐 **허위 보고**(virtiofs). git 쓰기·push도 Windows.
3. `package-lock.json` 미추적(gitignore) — **커밋 금지**. CF는 `npm install`로 빌드.
4. `_backup/` 삭제 금지.
5. CF 토큰(루트 `.env`): Pages·R2·Zone 일부 OK, **Cache Purge 권한 없음**. 배포 후 루트 URL 캐시는 새 배포가 갱신(`?cb=`로 우회 확인).
6. 구 `earth2guide` 프로젝트 = 폴백(도메인 0). **1주 후 삭제 예정** — 그 전엔 두기(롤백 대비).
7. 보존 용어 영문 유지. slug 영문 고정. 전 포스트 official segment(`/news/[slug]` 라우트 삭제됨).

## 세션 재개 시 첫 행동
월요일 자동화(`earth2guide-weekly-autonews`) 첫 실행 결과 확인(git push + CF API 트리거가 정상 동작했는지) + essence/근황 GSC 색인 추세. (P6: CF 1주 안정 후 구 `earth2guide` 프로젝트 삭제 + 와일드카드 DNS 정리.)
