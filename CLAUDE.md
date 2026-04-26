# CLAUDE.md — earth2guide 프로젝트 작업 가이드

> AI 도구가 이 프로젝트에서 작업할 때 따르는 규칙.
> Alvin 개인 글로벌 CLAUDE.md와 함께 적용됨.

---

## 1. 프로젝트 정체

- **사이트**: https://earth2guide.com
- **목적**: Earth 2 메타버스 한국어/중국어 정보 허브
- **타겟**: KO/ZH 사용자 (영문 원본 자동 번역)
- **상태**: 154개 posts publish 완료, 마크다운 렌더링 + 재배포 대기

---

## 2. 폴더별 작업 규칙

### `web/` — Next.js 사이트
- **build 영향 큼**. 코드 변경 = Vercel 자동 배포.
- 작업 전 `git status` 확인.
- 수정 후 항상: dev 서버 또는 `npm run build`로 확인.
- **react-markdown 사용**: body는 마크다운 → `<ReactMarkdown>` 컴포넌트로 렌더.
- 스타일: Tailwind v4 + `prose` 클래스.

### `pipeline/` — Python 스크립트
- **DB 변경 영향 있음**. PATCH/UPDATE 전에 dry-run.
- 체크포인트 (`*_checkpoint.json`)는 incremental — 중단/재시작 안전.
- Gemini API 호출 5초 간격 권장 (rate limit).

### `data/` — 스크래핑 캐시
- **읽기 전용 처럼 다루기**. 새로 스크래핑 시 step1/step2가 갱신.
- git 무시. 손실되면 재스크래핑 필요.

---

## 3. DB 작업 원칙

- **`posts` UPDATE/PATCH는 dry-run 후 실행**.
- 일괄 변경은 사후 검증 (count + 샘플 spot check).
- `slug`는 unique 키 — UPSERT 시 `?on_conflict=slug` 필수.
- `status: draft` 상태로 먼저 저장, publish는 별도 단계.
- service_role 키는 pipeline/.env.local에만. web에는 절대 X.

---

## 4. 절대 하지 말 것

- ❌ `data/`, `pipeline/Discord_*` 폴더 git에 commit
- ❌ `.env.local` git에 commit
- ❌ `web/.env.local`에 service_role 키 넣기
- ❌ `slug` 한국어/중국어로 바꾸기 (영문 통일 — earth2.io 원본 URL과 일치)
- ❌ Discord JSON 아카이브 사이트에 직접 노출 (저작권)
- ❌ DB 일괄 변경 후 검증 생략

---

## 5. 항상 할 것

- ✅ DB 변경 전 `pipeline/CHANGELOG.md`에 의도 + 영향 기록
- ✅ 코드 변경은 web/.git에서 commit (모노레포 루트의 .git)
- ✅ commit 메시지: `feat:` / `fix:` / `chore:` / `refactor:` / `docs:`
- ✅ R2 이미지 URL은 항상 NEXT_PUBLIC_R2_PUBLIC_URL 변수 사용
- ✅ 보존 용어 영문 그대로 유지

---

## 6. 보존 용어 (번역 시 영문)

```
Essence, Jewel, Tile, Cydroid, E-ther, Mentar,
Earth 2, E2, Shane Isaac, E2V1, E2V2, Raid,
Holobuilding, EPL, $ESS
```

---

## 7. 자주 쓰는 명령어

```bash
# 웹 개발
cd C:\Users\eldin\Desktop\earth2guide\web
npm run dev

# DB 현황 확인
cd C:\Users\eldin\Desktop\earth2guide\pipeline
python check_db.py

# 배포
cd C:\Users\eldin\Desktop\earth2guide
git status
git add .
git commit -m "fix: ..."
git push origin main
```

---

## 8. 진행 중 / 대기 중인 작업

자세한 건 `pipeline/CHANGELOG.md` + `pipeline/docs/HANDOFF.md` 참고.

진행 단계 (2026-04-26 기준):
- ✅ Step 1~4: 154개 스크래핑/번역/publish 완료
- ⬜ Step 5 후속: PostBody 마크다운 렌더링 추가 + 재배포
- ⬜ Step 6: earth2.io/how-to 위키 beginner
- ⬜ Step 7: Discord JSON → 위키 초안
- ⬜ Step 8/9: Twitter/Discord 자동 수집
- ⬜ Step 10: 소식 페이지 탭 UI
- ⬜ Step 11: SEO 배치 (meta_title 등)

---

*최초 작성: 2026-04-26 (모노레포 통합 시점)*
