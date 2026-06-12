# earth2guide — Context

**Last updated**: 2026-06-06 (세션 11)
**Status**: 배포됨 (P1 라이브 운영 + 공지 자동화 가동)

## 한 줄 요약
Earth 2 메타버스 KO/ZH 정보 허브 (https://earth2guide.com). News 154 + Wiki 21 published. 공지 자동 수집 스케줄 가동(월/목), SEO·AIO 기반 구축 완료.

## 현재 상태
- 완료 (세션 11, 2026-06-06):
  - **공지 자동화**: 스케줄 `earth2guide-news-auto` (월/목 09:00, cron `0 9 * * 1,4`) — 런북 `pipeline/docs/AUTO_NEWS_RUNBOOK.md`. 검증 통과분 자동 publish, 실패는 draft+보고
  - **step3/4 번역 스크립트 버그 fix** — 표·문단내 이미지 누락 (step6 패턴 차용, 백업 `scrapers/*.py.bak-20260606`)
  - **SEO 픽스** (`d990771`+`9234a6f`): 사이트 전반 '어스2' 병기(타이틀 템플릿), news/official 경로 카테고리 기반 통일+308+canonical, 홈 Official 위젯 fix, ZH og:locale=zh_CN, 본문 잔재 정리([원문 1건+유령 [IMAGE:N] 15개)
  - **AIO 기반** (`e44a30a`): JSON-LD(Organization/WebSite/NewsArticle/TechArticle+Breadcrumb), robots.txt AI봇 11종 Allow, llms.txt, 위키 meta 본문 발췌, ZH 위키 타이틀 'Earth2' 병기 10건
  - **E-E-A-T** (`3544542`): /about /privacy /terms (KO/ZH), Footer 실링크, FAQ 마크다운 파서+FAQPage 스키마(가입/출금), **위키 신규 `glossary`**(용어 17개, KO/ZH)
  - **SEO 경쟁 리포트**: `pipeline/docs/SEO_COMPETITIVE_2026-06-06.html` — KO/ZH 경쟁자·키워드 20·AIO 작업 기록
- 진행 중: 없음 (세션 종료 시점)
- 다음: 월요일(6/8) 자동 수집 첫 실행 결과 확인 → GSC 색인·GA4 유입 점검 → 백로그 재개

## 핵심 인사이트 (SEO 전략)
- KO/ZH 어스2 시장 모두 무주공산 — 경쟁자 전원 2025년 초 이전 정지, 우리가 유일한 2026 발행자
- 한국 유저는 "어스2", 중국어권은 영문 "Earth2"로 검색 (地球2는 노이즈) — 타이틀 병기 완료
- 간체 유지, 번체 전환은 GSC에서 TW/HK 유입 확인 후 판단
- 남은 랭킹 변수: 색인 시간(수 주) + 백링크(현재 0)

## 기술 스택
- Next.js 16.2.3 (Turbopack) / Tailwind v4 / Supabase / Vercel (root=`web/`) / Cloudflare R2 / Gemini 2.0 Flash
- GA4 `G-F0PYH6DYLW` + GSC (sitemap 362 URL — 358+about/glossary)
- Live = `dpl_BEdvtghY` (commit `3544542`)

## 주요 파일·디렉토리
- `web/components/seo/JsonLd.tsx` — 모든 구조화 데이터 + FAQ 파서 + mdExcerpt
- `web/lib/supabase/types.ts` — `getPostSegment()` (카테고리→경로 단일 소스)
- `pipeline/docs/AUTO_NEWS_RUNBOOK.md` — 자동화 런북 (스케줄러가 읽음)
- `pipeline/docs/SEO_COMPETITIVE_2026-06-06.html` — 경쟁·키워드·AIO 리포트
- `pipeline/CHANGELOG.md` — 세션 11a~11d 전체 기록

## ⚠️ 운영 주의
1. git 쓰기/fetch는 **Windows PowerShell** (샌드박스 마운트 unlink 불가)
2. **샌드박스 bash는 호출마다 컨테이너 초기화** — 백그라운드 프로세스 생존 X. 장시간 작업은 checkpoint 재실행 방식 (런북 반영됨)
3. Vercel 자동배포 ON — main push = 즉시 배포. generateStaticParams에서 cookies() 쓰는 쿼리 사용 금지 (createStaticClient 사용)
4. 위키에 `## 자주 묻는 질문` 섹션 쓰면 FAQPage 스키마 자동 생성
5. 스케줄 작업은 앱 켜져 있을 때 실행. 첫 실행 전 "Run now"로 권한 사전 승인 권장

## 세션 재개 시 첫 행동
월요일 자동 수집 결과 확인 (CHANGELOG의 auto-news run 항목) + GSC 색인 상태. 이상 없으면 백로그: Step 10 소식 탭 UI / Step 11 SEO meta 잔여 / 백링크 활동.
