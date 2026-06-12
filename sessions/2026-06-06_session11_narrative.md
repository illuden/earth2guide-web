# Session Narrative — 2026-06-06 earth2guide (세션 11, raw 재구성)

1. **Session Open** → 로컬 소스, CONTEXT/HANDOFF/CHANGELOG 로드, 브리핑 (GSC/GA4 직후 상태)
2. Alvin: 목적·아키텍처·공지 루트 질문 → 정리 답변 (자동화는 Step 8/9 미구축, step1~4는 수동+버그)
3. Alvin: "공지 자동화 스케줄러 등록 + sitemap 점검, 트위터/디스코드는 다른 세션" → 옵션 확정(주2회/기존양식/fix선행)
4. CHANGELOG 의도 기록 → step3/4 `html_to_text_with_placeholders` 교체(표 GFM 변환, p/li/blockquote img, a/strong) → ast+spot test 통과
5. sitemap: 코드 검토 + DB 대조(154/20, 이상 0) + 라이브 spot → 358 정합. 운영 중 발견: 홈 Official 위젯 빈 것, update글 /news/ 링크
6. 런북 작성 → `create_scheduled_task` (cron `0 9 * * 1,4`) — 표시문자열은 "Monday only"지만 cron 저장값 정상 확인
7. Alvin: "어스2 한국어 SEO 전부 먹기, 경쟁자·키워드 조사" → seo-audit 스킬 → WebSearch 12회 + 경쟁사 크롤 → 발견: earth2.kr 2025-02 정지, earth2korea.io=우리 리다이렉트, earth2guide.io 의문(→Alvin이 301 확인), '어스2' 표기 부재, [원문 잔재 1·IMAGE 7건 → 리포트 HTML
8. Alvin: "마이너 픽스 쭉 진행" → DB 정리(잔재 절단 2단계+유령 IMAGE 15 제거) → 코드 패치 13파일 → tsc OK → PowerShell push `d990771` → **Vercel ERROR** (generateStaticParams에서 cookies()) → `getAllPostSlugsWithCategory`(createStaticClient) 신설 → `9234a6f` READY → 라이브 전수 검증
9. Alvin: "어스2 먹을 자신 있나? 중국어도?" → 정직 평가 (구조 유리/시간·백링크·필러 변수, ZH는 바이두/번체 이슈)
10. Alvin: "ZH 스캔 + 필러는 기존 강화만 + **AIO 최우선**" → ZH 스캔 5회(전용 사이트 0, 'Earth2' 영문 검색) → JSON-LD 컴포넌트+robots AI봇+llms.txt+위키 meta 발췌+ZH 타이틀 10건 → `e44a30a` READY → Chrome으로 ld+json 실측 ([Organization+WebSite, NewsArticle/TechArticle+Breadcrumb])
11. Alvin: "계속 할 수 있는 건 계속" → about/privacy/terms+Footer+FAQ 파서+FAQPage+glossary(용어 17, KO/ZH INSERT) → `3544542` READY → Chrome 검증 (FAQPage 발동, glossary 라이브, footer 링크 4종)
12. Session Close — CONTEXT 갱신, DECISIONS append, 세션 파일 생성 (오늘 세션10 파일과 충돌 방지 위해 `_session11` 접미사)
