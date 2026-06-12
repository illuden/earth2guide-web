# Session Narrative — 2026-06-06 earth2guide (세션 10, raw 백업)

> 핵심 turn 시간순 재구성. 요약은 `2026-06-06_summary.md`.

1. **Session Open** — 로컬 로드. 브리핑: News 154 + Wiki 20 라이브, 세션9(4-26)에서 SEO redirect + 자동화 설계까지. 미커밋 13개 발견 보고.

2. **Alvin**: "Git env는 Claude-Workspace에 있음. Live 영향 없이 fetch/pull/migrate/sync 다 해서 깔끔히 정리 + 현재 작동 상황 확인."

3. **Git 진단 (read-only)**: fetch 후 local == origin == 36ae571. stash 0. DB 마이그레이션 001/002 적용 완료(대기 0). Vercel 최근 18배포 전부 READY, /ko/news 정상 렌더. → 미커밋 13개만 dirty.

4. **CRLF 진실 규명**: `git diff --ignore-cr-at-eol` → 실변경은 ARCHITECTURE.md(+56)·CLAUDE.md(+2)뿐. 나머지 11개는 줄바꿈 허상. 원인: `.gitattributes` 없음 + 샌드박스/Windows EOL 차이.

5. **Alvin 선택(위젯)**: "EOL 폐기 + 문서 로컬 커밋" (push X).

6. **샌드박스 git 쓰기 실패 사건**: `index.lock` 존재 → rm도 "Operation not permitted". 진단: **마운트가 unlink 자체를 차단** (fresh 파일도 삭제 불가, rename은 가능). 내 fetch의 auto-maintenance가 만든 lock을 git이 못 지운 것.

7. **Windows PowerShell로 우회**: Windows git 시점에선 11개 허상 아예 안 보임(autocrlf). lock 2개 + probe 잔여물 제거 → 문서 2개 커밋 `60a500b` → working tree clean, 1 ahead. 검증 통과.

8. **Alvin**: "다른 프로젝트는 건들지 마. earth2guide만." → 후속 옵션 제시 → "여기서 멈춤".

9. **Alvin**: "GSC 연결, 다음 Analytics까지. (gtag G-F0PYH6DYLW 스니펫 + google-site-verification=Y1-Ehof… 제공) 이걸로 다 연결해줘."

10. **구현**: 루트 layout.tsx에 `metadata.verification.google` + next/script gtag 3곳 수정(LF 확인 후 Edit). pipeline/CHANGELOG.md에 의도 기록. Windows에서 `npm run build` 통과(665p, 12.4s). Alvin 승인(위젯: "구현→빌드검증→push") → 커밋 `098f460` push.

11. **배포 즉시 CANCELED**: 빌드 로그 0. 빈 커밋 `330859a`로 재시도 → 또 즉시 CANCELED → 지속 차단 판정. Vercel get_project: `live: false`. Alvin 선택(위젯): "Chrome로 내가 대시보드 확인".

12. **Chrome 진단**: 배포 페이지에 명시 — "Ignored Build Step 설정 명령으로 조기 취소". Settings → Build and Deployment: Production Override(빈 값=정상빌드) vs **Project Settings Behavior = "Don't build anything"** (세션9 이후 변경됨). repo에 vercel.json 없음 = 순수 대시보드 설정.

13. **Alvin 선택(위젯)**: "켜고 그대로 유지" → Behavior **Automatic** 변경. 1차 Save가 렌더 프리즈로 미반영 → ref 클릭으로 재시도, Save 버튼 disabled 확인, 새로고침 후 영구 반영 확인.

14. **Redeploy**: 옛 36ae571이 아닌 **330859a 배포 페이지**에서 Redeploy. "Use project's Ignore Build Step" **해제**(스킵 방지) → 빌드 실행 → **READY** `dpl_47afctZea`, alias에 earth2guide.com + www.

15. **라이브 검증(JS)**: gscMeta=`Y1-Ehof…` / gtag.js?id=G-F0PYH6DYLW 로드 / gtag=function / dataLayer 4. 둘 다 작동.

16. **Alvin 선택(위젯)**: "Chrome으로 GSC Verify+사이트맵까지."

17. **GSC**: 속성 목록에 earth2guide.com 없음 → 속성 추가 → **URL 접두어** `https://earth2guide.com` → "속성 확인 중" → **"소유권이 자동으로 확인됨 (HTML 태그)"**. Sitemaps에서 `sitemap.xml` 제출 → "사이트맵이 제출됨". (옛 2022 WP /sitemap.xml 항목은 오류 상태로 잔존 — 무시 가능)

18. **사이트맵 검증**: 200 / application/xml / urlset / **URL 358개** (/ko, /ko/news, /ko/official, /ko/wiki …).

19. **Session Close** — CONTEXT/DECISIONS/CHANGELOG(결과)/sessions 작성, 검증.

## 커밋 이력 (이번 세션)
- `60a500b` docs: update ARCHITECTURE + CLAUDE (P1 tier, E2Chat merge notes)
- `098f460` feat: connect Google Search Console verification + GA4 (gtag) in root layout
- `330859a` chore: re-trigger Vercel deploy (prev build canceled) ← 빈 커밋, 현재 Live
