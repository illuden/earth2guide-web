// ================================================
// earth2guide.com — Supabase 타입 정의
// ================================================

export type Locale = 'ko' | 'zh'

export type PostCategory =
  | 'news'
  | 'announcement'
  | 'official_news'
  | 'update'
  | 'promotion'
  | 'dev_qa'

export type WikiCategory =
  | 'account'
  | 'essence'
  | 'jewel'
  | 'raid'
  | 'general'

export type PostStatus = 'draft' | 'published' | 'archived'
export type TranslationStatus = 'pending' | 'done' | 'failed'
export type PostSource = 'manual' | 'bot' | 'gemini'

// -----------------------------------------------
// Post
// -----------------------------------------------
export interface Post {
  id: string
  message_id: string | null
  slug: string
  category: PostCategory
  title_ko: string | null
  title_zh: string | null
  body_ko: string | null
  body_zh: string | null
  body_original: string | null
  summary_ko: string | null
  summary_zh: string | null
  source_url: string | null
  cover_image_url: string | null
  status: PostStatus
  source: PostSource
  translation_status: TranslationStatus
  published_at: string | null
  created_at: string
  updated_at: string
}

// 프론트엔드용 locale 적용 포스트 (locale별 필드 평탄화)
export interface PostLocalized {
  id: string
  slug: string
  category: PostCategory
  title: string
  summary: string | null
  body: string | null
  body_original: string | null
  source_url: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
}

// -----------------------------------------------
// WikiPage
// -----------------------------------------------
export interface WikiPage {
  id: string
  slug: string
  category: WikiCategory
  title_ko: string | null
  title_zh: string | null
  body_ko: string | null
  body_zh: string | null
  status: PostStatus
  sort_order: number
  translation_status: TranslationStatus
  created_at: string
  updated_at: string
}

export interface WikiPageLocalized {
  id: string
  slug: string
  category: WikiCategory
  title: string
  body: string | null
  sort_order: number
  created_at: string
}

// -----------------------------------------------
// DiscordMessage
// -----------------------------------------------
export interface DiscordMessage {
  id: string
  message_id: string
  channel: string | null
  category: string | null
  source_lang: string
  copyright_restricted: boolean
  author_id: string | null
  author_username: string | null
  content: string | null
  attachments: unknown
  embeds: unknown
  published_at: string | null
  slug_base: string | null
  created_at: string
}

// -----------------------------------------------
// Pagination
// -----------------------------------------------
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// -----------------------------------------------
// Admin form types
// -----------------------------------------------
export interface PostFormData {
  slug: string
  category: PostCategory
  title_ko: string
  title_zh: string
  body_ko: string
  body_zh: string
  body_original?: string
  summary_ko?: string
  summary_zh?: string
  source_url?: string
  cover_image_url?: string
  status: PostStatus
  published_at?: string
}

export interface WikiFormData {
  slug: string
  category: WikiCategory
  title_ko: string
  title_zh: string
  body_ko: string
  body_zh: string
  status: PostStatus
  sort_order: number
}

// -----------------------------------------------
// Category 메타데이터
// -----------------------------------------------
export const CATEGORY_META: Record<PostCategory, { label_ko: string; label_zh: string; color: string }> = {
  news:          { label_ko: '소식',      label_zh: '新闻',    color: 'blue'   },
  announcement:  { label_ko: '공지',      label_zh: '公告',    color: 'red'    },
  official_news: { label_ko: '공식 뉴스', label_zh: '官方新闻', color: 'purple' },
  update:        { label_ko: '업데이트',  label_zh: '更新',    color: 'green'  },
  promotion:     { label_ko: '홍보',      label_zh: '推广',    color: 'yellow' },
  dev_qa:        { label_ko: '개발자 Q&A', label_zh: '开发问答', color: 'gray'  },
}

export const WIKI_CATEGORY_META: Record<WikiCategory, { label_ko: string; label_zh: string; icon: string }> = {
  account:  { label_ko: '계정',   label_zh: '账户',     icon: 'account_circle'     },
  essence:  { label_ko: 'Essence', label_zh: 'Essence', icon: 'energy_program_saving' },
  jewel:    { label_ko: 'Jewel',   label_zh: 'Jewel',   icon: 'diamond'            },
  raid:     { label_ko: 'Raid',    label_zh: 'Raid',    icon: 'swords'             },
  general:  { label_ko: '일반',    label_zh: '一般',    icon: 'info'               },
}
