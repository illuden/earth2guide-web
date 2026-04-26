# AUTOMATION PIPELINE — Twitter + Discord 자동 수집

> Step 8 (Twitter) + Step 9 (Discord) + Step 10 (UI 탭).
> 작성: 2026-04-26 (세션 9)
> 상태: 설계 확정. 구현은 다음 세션.

---

## 0. 한눈에 보는 결정

| 영역 | 선택 | 이유 |
|---|---|---|
| Twitter 수집 | **Make.com** webhook | 무료 1000 ops/월, GUI, Twitter API key 불필요 |
| Discord 수집 | **Vercel cron + Discord API polling** | 무료, 추가 인프라 0, 5분 폴링 |
| Publish 정책 | **draft → 수동 publish** | 안전. 잘못된 번역/스팸 필터 |
| 번역 시점 | **수집 즉시 (Gemini)** | draft에 KO+ZH 미리 — 검토 효율 |
| 도메인 보호 | (이미 완료) | https://earth2guide.com 308 redirect |

---

## 1. 전체 아키텍처

```
┌──────────────────────────┐         ┌────────────────────────┐
│  Twitter @ShaneIsaac     │         │  Discord 공식 채널들    │
│  (X.com)                  │         │  (Earth 2 Official)    │
└──────────┬───────────────┘         └──────────┬─────────────┘
           │ Make.com 모니터링                  │ Vercel cron (5분마다)
           │ (트윗 발생 시 트리거)              │ (Discord API polling)
           ▼                                    ▼
   POST /api/webhook/twitter            POST /api/cron/discord-poll
   (Vercel Edge Function)               (Vercel Cron Job)
           │                                    │
           │  body: { tweet_id, text, url }    │  fetch & filter
           │                                    │  (author=Shane only)
           ▼                                    ▼
        ┌─────────────────────────────────────────┐
        │  공통 처리 함수 (shared)                │
        │  1. 중복 체크 (source_url unique)      │
        │  2. Gemini 번역 (EN→KO + EN→ZH)         │
        │  3. Supabase INSERT                     │
        │     {                                   │
        │       category: 'community',            │
        │       sub_type: 'twitter' | 'discord',  │
        │       status: 'draft',                  │
        │       source_url: <원본 URL>,           │
        │       title_ko/zh, body_ko/zh,          │
        │       summary_ko/zh,                    │
        │       cover_image_url (있으면)          │
        │     }                                   │
        └────────────────────┬────────────────────┘
                             │
                             ▼
                  ┌────────────────────┐
                  │  Admin UI          │
                  │  /admin/posts      │
                  │  ?status=draft&    │
                  │   sub_type=twitter │
                  │  → 검토 + Publish  │
                  └─────────┬──────────┘
                            │ status=draft → published
                            ▼
                  ┌────────────────────┐
                  │  /ko/news 탭 UI    │
                  │  [전체|트위터|디코]│
                  └────────────────────┘
```

---

## 2. DB 스키마 변경

### 2.1 마이그레이션 SQL (Supabase SQL Editor 직접 실행)

```sql
-- web/supabase/migrations/003_add_sub_type.sql

-- posts 테이블에 sub_type 컬럼 추가
ALTER TABLE posts
  ADD COLUMN sub_type TEXT CHECK (
    sub_type IN ('twitter', 'discord', 'youtube', 'official', NULL)
  );

-- community 카테고리 추가 (CHECK constraint 갱신)
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_check;
ALTER TABLE posts ADD CONSTRAINT posts_category_check CHECK (
  category IN (
    'news', 'announcement', 'official_news', 'update',
    'promotion', 'dev_qa', 'community'
  )
);

-- source 컬럼에 'twitter_bot' / 'discord_cron' 추가
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_source_check;
ALTER TABLE posts ADD CONSTRAINT posts_source_check CHECK (
  source IN ('gemini', 'manual', 'bot', 'twitter_bot', 'discord_cron')
);

-- 인덱스 (조회 최적화)
CREATE INDEX IF NOT EXISTS idx_posts_sub_type ON posts(sub_type);
CREATE INDEX IF NOT EXISTS idx_posts_source_url_unique ON posts(source_url) WHERE source_url IS NOT NULL;

-- discord_message_id 추가 (중복 방지용 raw ID, source_url 외에 보조)
ALTER TABLE posts ADD COLUMN external_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_external_id ON posts(external_id) WHERE external_id IS NOT NULL;
```

### 2.2 TypeScript 타입 갱신

```ts
// web/lib/supabase/types.ts
export type PostCategory =
  | 'news' | 'announcement' | 'official_news'
  | 'update' | 'promotion' | 'dev_qa'
  | 'community'                           // ⬅ 추가

export type PostSubType =
  | 'twitter' | 'discord' | 'youtube' | 'official' | null

export interface Post {
  // ...기존 필드...
  sub_type: PostSubType
  external_id: string | null              // Discord message ID 등
}
```

---

## 3. API Endpoints (Vercel)

### 3.1 `POST /api/webhook/twitter` (Make.com에서 호출)

```ts
// web/app/api/webhook/twitter/route.ts
export const runtime = 'edge'

export async function POST(req: Request) {
  // 1. 토큰 검증 (Make.com에서 X-Webhook-Secret 헤더 보냄)
  const auth = req.headers.get('x-webhook-secret')
  if (auth !== process.env.WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 2. 페이로드 파싱 (Make.com이 보내는 JSON 형태)
  const { tweet_id, tweet_url, text, author, created_at, media_url } = await req.json()

  // 3. 중복 체크 (external_id)
  const exists = await supabase
    .from('posts').select('id')
    .eq('external_id', `twitter:${tweet_id}`)
    .maybeSingle()
  if (exists.data) return Response.json({ skipped: 'duplicate' })

  // 4. Gemini 번역 (KO + ZH 동시)
  const [koResult, zhResult] = await Promise.all([
    geminiTranslate(text, 'ko'),
    geminiTranslate(text, 'zh'),
  ])

  // 5. INSERT (status=draft)
  await supabase.from('posts').insert({
    slug: `twitter-${tweet_id}`,
    category: 'community',
    sub_type: 'twitter',
    title_ko: koResult.title || `Shane 트윗 ${created_at.slice(0,10)}`,
    title_zh: zhResult.title || `Shane 推文 ${created_at.slice(0,10)}`,
    body_ko: koResult.body,
    body_zh: zhResult.body,
    summary_ko: koResult.summary,
    summary_zh: zhResult.summary,
    source_url: tweet_url,
    external_id: `twitter:${tweet_id}`,
    cover_image_url: media_url || null,
    status: 'draft',
    source: 'twitter_bot',
    published_at: null,
  })

  return Response.json({ ok: true })
}
```

### 3.2 `GET /api/cron/discord-poll` (Vercel Cron)

```ts
// web/app/api/cron/discord-poll/route.ts
export const runtime = 'nodejs'

export async function GET(req: Request) {
  // Vercel cron이 호출 시 'authorization: Bearer $CRON_SECRET' 자동 첨부
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 1. 마지막 polling 시점 가져오기 (KV / DB)
  const lastPoll = await getLastPollTimestamp()  // ISO 8601

  // 2. Discord API: 마지막 시점 이후 메시지만
  const channels = [
    { id: process.env.DISCORD_CHANNEL_ANNOUNCEMENTS, type: 'announcement' },
    { id: process.env.DISCORD_CHANNEL_DEV_QA, type: 'dev_qa' },
  ]

  const newMessages: any[] = []
  for (const ch of channels) {
    const res = await fetch(
      `https://discord.com/api/v10/channels/${ch.id}/messages?limit=50`,
      { headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` } }
    )
    const msgs = await res.json()
    // Shane Isaac 메시지만 필터 (Author ID로)
    const SHANE_ID = process.env.DISCORD_SHANE_USER_ID  // 정확 ID 조사 필요
    const filtered = msgs.filter((m: any) =>
      m.author.id === SHANE_ID && new Date(m.timestamp) > new Date(lastPoll)
    )
    newMessages.push(...filtered.map((m: any) => ({ ...m, _channel_type: ch.type })))
  }

  // 3. 각 메시지마다 처리
  for (const msg of newMessages) {
    const exists = await supabase.from('posts').select('id')
      .eq('external_id', `discord:${msg.id}`).maybeSingle()
    if (exists.data) continue

    const [ko, zh] = await Promise.all([
      geminiTranslate(msg.content, 'ko'),
      geminiTranslate(msg.content, 'zh'),
    ])

    await supabase.from('posts').insert({
      slug: `discord-${msg.id}`,
      category: 'community',
      sub_type: 'discord',
      title_ko: ko.title || `Shane Discord ${msg.timestamp.slice(0,10)}`,
      title_zh: zh.title || `Shane Discord ${msg.timestamp.slice(0,10)}`,
      body_ko: ko.body,
      body_zh: zh.body,
      summary_ko: ko.summary,
      summary_zh: zh.summary,
      source_url: `https://discord.com/channels/${msg.guild_id}/${msg.channel_id}/${msg.id}`,
      external_id: `discord:${msg.id}`,
      cover_image_url: msg.attachments?.[0]?.url || null,
      status: 'draft',
      source: 'discord_cron',
      published_at: null,
    })
  }

  await setLastPollTimestamp(new Date().toISOString())
  return Response.json({ processed: newMessages.length })
}
```

### 3.3 `vercel.json` cron 설정

```json
{
  "crons": [
    {
      "path": "/api/cron/discord-poll",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

> Vercel Hobby 플랜: cron 무료. 단, 한 번 실행 시 60초 제한.

---

## 4. Make.com Twitter 시나리오

### 4.1 시나리오 구조

```
[Trigger] X (Twitter) — Watch User Tweets
   └── User: ShaneIsaac
   └── 5분 간격 폴링 (또는 webhook)
        ↓
[Filter] 리트윗 제외 (옵션)
        ↓
[HTTP] Make a Request
   └── URL: https://earth2guide.com/api/webhook/twitter
   └── Method: POST
   └── Headers:
       - X-Webhook-Secret: <WEBHOOK_SECRET>
       - Content-Type: application/json
   └── Body (JSON):
       {
         "tweet_id": "{{1.id}}",
         "tweet_url": "https://x.com/ShaneIsaac/status/{{1.id}}",
         "text": "{{1.text}}",
         "author": "{{1.user.screen_name}}",
         "created_at": "{{1.created_at}}",
         "media_url": "{{1.entities.media[0].media_url_https}}"
       }
```

### 4.2 무료 티어 한계

- 1,000 ops/월 = 약 30개/일 (Shane 평균 이하 — 충분)
- Twitter API key는 Make.com이 OAuth로 처리 (개인 키 불필요)

---

## 5. UI 변경

### 5.1 `/ko/news` 탭 추가

```tsx
// web/app/[locale]/news/page.tsx (수정)
const tabs = [
  { key: 'all',     label_ko: '전체',   label_zh: '全部',   filter: {} },
  { key: 'twitter', label_ko: '트위터', label_zh: '推特',   filter: { sub_type: 'twitter' } },
  { key: 'discord', label_ko: '디스코드', label_zh: '社区',  filter: { sub_type: 'discord' } },
  { key: 'youtube', label_ko: '유튜브', label_zh: '油管',   filter: { sub_type: 'youtube' } },
]

// URL: /ko/news?tab=twitter
```

### 5.2 Admin UI

```tsx
// web/app/admin/posts/page.tsx (수정)
// status=draft 필터 + sub_type 표시
// 한 줄 publish 버튼
```

---

## 6. 환경변수 추가

### web/.env.local
```
# Make.com webhook 인증
WEBHOOK_SECRET=<long random string, 사용자 생성>

# Vercel Cron 인증
CRON_SECRET=<long random string, Vercel이 자동 생성>

# Discord Bot
DISCORD_BOT_TOKEN=<Discord Developer Portal에서 발급>
DISCORD_CHANNEL_ANNOUNCEMENTS=<channel ID>
DISCORD_CHANNEL_DEV_QA=<channel ID>
DISCORD_SHANE_USER_ID=<Shane Discord user ID>

# 마지막 polling 시점 저장 (옵션 — Vercel KV 또는 DB)
# 또는 DB에 별도 metadata 테이블
```

### Vercel 대시보드에 동일하게 등록

---

## 7. 검토 워크플로우 (Alvin)

1. **알림** (선택): Make.com에 Discord/이메일 알림 모듈 추가 → 새 draft 생성 시 알림
2. **검토**: `/admin/posts?status=draft` 진입 (모바일 OK)
3. **각 draft**:
   - 번역 검토 (KO + ZH 빠른 스캔)
   - 잘못된 번역 → inline 수정
   - 스팸/리트윗/광고 → 삭제 (status=archived)
   - 정상 → "Publish" 버튼 클릭 → status=published
4. **자동 사이트 반영**: ISR 1시간 또는 즉시 revalidate (publish API에서 호출)

---

## 8. 비용 + 한계

| 항목 | 비용 | 한계 |
|---|---|---|
| Make.com 무료 | $0 | 1,000 ops/월 (Shane 트윗 30/일이면 OK) |
| Vercel Hobby | $0 | cron 무료, 함수 60초 제한 |
| Discord API | $0 | rate limit 50 req/sec — 충분 |
| Gemini Free | $0 | 14 RPM — 5초 간격 또는 batch |
| Supabase Free | $0 | 500MB DB — 트윗 5,000개 ≈ 5MB |
| **합계** | **$0/월** | |

만약 Shane 트윗이 월 1,000개를 넘으면 Make.com Core ($9/월, 10,000 ops) 업그레이드.

---

## 9. 위험 + 미티게이션

| 위험 | 미티게이션 |
|---|---|
| Discord API rate limit 초과 | 채널당 limit=50, 5분 polling으로 충분. 429 응답 시 exponential backoff |
| Gemini quota 초과 | draft 저장 시 번역 실패해도 raw text 보존 → 수동 번역 가능 |
| Twitter cloaking (Make.com 끊김) | 모니터링 — 24h 동안 새 draft 0이면 알림 |
| Shane이 채널 변경 | 환경변수 channel ID 갱신만으로 대응 |
| 잘못된 번역 publish | 모든 신규 draft → 수동 검토 후 publish (자동 publish X) |
| 저작권 (Shane 트윗 인용) | 짧은 인용 + source_url 명시 = 공정 사용 |

---

## 10. 단계별 구현 순서 (다음 세션)

```
Phase 1: DB + 타입 (30분)
  □ 003_add_sub_type.sql 작성 + Supabase 실행
  □ web/lib/supabase/types.ts 갱신
  □ check_db.py로 검증

Phase 2: API endpoint 골격 (1시간)
  □ /api/webhook/twitter route.ts (인증 + 더미 응답)
  □ /api/cron/discord-poll route.ts (인증 + 더미 응답)
  □ vercel.json cron 등록
  □ 환경변수 .env.example 갱신

Phase 3: Gemini 공통 함수 (1시간)
  □ web/lib/gemini/translate.ts (서버 사이드)
  □ EN → KO/ZH 번역 + JSON 응답 (title/body/summary)
  □ 보존 용어 prompt 적용

Phase 4: Twitter MVP (1시간)
  □ /api/webhook/twitter 실제 구현 (translate + insert)
  □ Make.com 시나리오 구축 + 테스트 webhook 발사
  □ 첫 Shane 트윗 → draft 확인

Phase 5: Discord MVP (1.5시간)
  □ Discord Bot 등록 (Developer Portal)
  □ /api/cron/discord-poll 실제 구현
  □ Shane User ID 확인
  □ Vercel cron 활성화 + 첫 polling 검증

Phase 6: UI 탭 + Admin (1.5시간)
  □ /ko/news 탭 컴포넌트 (전체/트위터/디스코드)
  □ /admin/posts 필터 (status=draft, sub_type)
  □ Publish 버튼 + revalidate
  □ 모바일 반응형

Phase 7: 운영 마무리 (30분)
  □ 모니터링 (24h 동안 새 draft 0이면 알림 — 옵션)
  □ CHANGELOG + HANDOFF 갱신

총 예상: 7시간 (1-2 세션)
```

---

## 11. MVP 범위 (가장 작게 시작하려면)

**Phase 1 + 2 + 3 + 4** 만 = 3.5시간
- Twitter만 → draft 저장
- Admin에서 수동 publish
- /ko/news 탭은 나중에 (기본 PostList로도 표시됨)

→ **이게 가장 빠른 가치 검증.** 1주 운영해보고 안정화되면 Discord/UI 추가.

---

## 부록 A. Discord Shane User ID 조사 방법

1. Discord 클라이언트 설정 → 고급 → 개발자 모드 ON
2. Shane 메시지 우클릭 → "ID 복사" → 환경변수 `DISCORD_SHANE_USER_ID` 에 입력
3. 동일 방법으로 채널 ID도 조사 → `DISCORD_CHANNEL_*`

## 부록 B. Make.com Twitter 모듈 권한

- Make.com이 OAuth로 Twitter 인증 → 본인 계정으로 read
- @ShaneIsaac 같은 다른 계정 트윗 read 가능 (public timeline)
- private/protected 계정은 follow 필요

## 부록 C. revalidate API

```ts
// web/app/api/admin/revalidate/route.ts
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  // admin 인증
  const { path } = await req.json()
  revalidatePath(path)  // 예: '/ko/news'
  return Response.json({ revalidated: true })
}
```

---

*다음 세션 시작 시 이 문서 먼저 다시 읽고 Phase 1부터 진행.*
