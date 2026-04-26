# CHANGELOG — earth2guide.com

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

