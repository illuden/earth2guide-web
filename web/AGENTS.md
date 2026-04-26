<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

이 프로젝트는 **Next.js 16.2 + React 19.2 + Tailwind v4** 기반.
APIs, conventions, file structure 모두 옛 버전과 다를 수 있음.
코드 작성 전 `node_modules/next/dist/docs/`의 관련 가이드 확인. deprecation notice 무시 금지.

---

## 실제 부딪힌 함정 (반복 방지)

### `generateStaticParams` — 모든 dynamic segment 반환 필수

라우트 `[locale]/news/[slug]`처럼 dynamic segment 여러 개면 모두 반환:

```ts
// ❌ Next.js 14 패턴 (16에선 prerender 안 됨 → 런타임 500)
return slugs.map((slug) => ({ slug }))

// ✅ Next.js 16 패턴
import { routing } from '@/i18n/routing'
return routing.locales.flatMap((locale) =>
  slugs.map((slug) => ({ locale, slug }))
)
```

증상: `x-matched-path: /500`, detail URL 500, 목록 페이지 정상.

### params는 Promise

```ts
interface PageProps { params: Promise<{ locale: string; slug: string }> }
const { locale, slug } = await params  // await 필수
```

### react-markdown — server component OK

`'use client'` 추가하지 말 것. server-side rendering으로 SEO 안전.

### Tailwind v4 — `prose` 사용 시 typography plugin 명시

현재 plugin 없음. `prose` 클래스 쓰면 작동 안 함. `components` prop으로 element별 직접 스타일링하는 패턴 사용 (PostBody.tsx 참고).

<!-- END:nextjs-agent-rules -->

---

## 작업 시작 전 확인

| 항목 | 어디서 |
|---|---|
| 모노레포 구조 | `../ARCHITECTURE.md` |
| AI 작업 가이드 | `../CLAUDE.md` |
| 환경변수 | `.env.local` (anon, R2 public만) |
| DB 쿼리 | `lib/supabase/queries.ts` |
| 라우팅 | `app/[locale]/...`  |
| i18n config | `i18n/routing.ts` |
| 디자인 토큰 | `Design.md` + `app/globals.css` |
