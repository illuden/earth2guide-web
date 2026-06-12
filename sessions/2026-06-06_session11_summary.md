# Session — 2026-06-06 earth2guide (세션 11)

**시작**: ~18:00 KST / **종료**: ~21:30 KST

## 한 일
1. **Session Open** — 프로젝트 복원, 백로그·아키텍처 브리핑
2. **step3/4 번역 스크립트 버그 fix** — 표(`<table>`)·문단내 이미지 누락을 step6 검증 패턴으로 교체. 오프라인 spot test 표 10/10·4/4 보존. 백업 `.bak-20260606`
3. **공지 자동화 스케줄 등록** — `earth2guide-news-auto` (월/목 09:00). 런북 `pipeline/docs/AUTO_NEWS_RUNBOOK.md` 작성. 샌드박스 컨테이너 휘발성 발견 → checkpoint 재실행 방식 반영
4. **sitemap 점검** — 358 URL 정합 (DB 154+20 무결성 0건 이상), robots/라이브 spot OK
5. **SEO 경쟁 분석** — KO: 경쟁자 전멸(earth2.kr 2025-02 정지 등), 키워드 기회 20개. 핵심 발견: 사이트에 '어스2' 한글 표기 부재. 리포트 HTML 작성
6. **SEO 픽스 배포** (`d990771`+`9234a6f`): 어스2 병기(템플릿+홈+위키 title_ko 10), news/official 카테고리 기반 통일+308+canonical, 홈 Official 위젯 fix(0건 버그), ZH og:locale, 본문 잔재 정리([원문 1, 유령 IMAGE 15). 빌드 실패 1회(generateStaticParams cookies()) 즉시 해결
7. **ZH 스캔** — 중국어 전용 사이트 0개. 검색어는 영문 'Earth2'. ZH 위키 title 10건 병기
8. **AIO 기반 배포** (`e44a30a`): JSON-LD 4종(Chrome 실측 검증), robots AI봇 11종, llms.txt, 위키 meta 본문 발췌
9. **E-E-A-T 배포** (`3544542`): about/privacy/terms (KO/ZH), Footer 실링크, FAQ 파서+FAQPage 스키마(가입/출금), **위키 glossary 신설** (용어 17, KO/ZH)

## 결정사항
DECISIONS.md 2026-06-06 (세션 11) 참고 — 자동화 정책, AIO 최우선, 어스2/Earth2 병기, 경로 단일화, 간체 유지 등 11건

## 다음 세션 첫 행동
- 월요일(6/8) 자동 수집 첫 실행 결과 확인 — 그 전에 사이드바 "Run now"로 도구 권한 사전 승인 권장
- GSC 색인·GA4 유입 점검 → 백로그 (Step 10 탭 UI / Step 11 meta 잔여 / 백링크)

## 미해결 이슈
- 세션 10·11 문서 변경분(CONTEXT/DECISIONS/CHANGELOG/sessions) git 미커밋 — Session Push Git 요청 시 처리
- Footer Discord/Twitter 실URL 대기 (Alvin 제공 시 복원)
- 구형 글 published_at 2026-03 집중(35건) — 원본 발행일 재검증 권장 (리포트 이슈 #7)
- 빈 커밋 `330859a` 정리 여부 (이월)
