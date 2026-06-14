// ================================================
// earth2guide.com — 파일 기반 콘텐츠 로더 (빌드타임 정적)
// Supabase 런타임 쿼리를 대체. content/*.md + manifest.json에서 읽음.
// 기존 queries.ts의 공개 함수 시그니처를 그대로 유지 → 페이지는 import 경로만 교체.
// ================================================
import { promises as fs } from 'fs'
import path from 'path'
import type {
  Locale,
  PostCategory,
  WikiCategory,
  PostLocalized,
  WikiPageLocalized,
  PaginatedResult,
} from './supabase/types'

const PAGE_SIZE = 12
const CONTENT_DIR = path.join(process.cwd(), 'content')

// -----------------------------------------------
// manifest (리스트/사이트맵용 메타)
// -----------------------------------------------
interface ManifestPost {
  id: string
  slug: string
  segment: 'news' | 'official'
  category: PostCategory
  status: string
  title_ko: string | null
  title_zh: string | null
  summary_ko: string | null
  summary_zh: string | null
  cover_image_url: string | null
  published_at: string | null
  created_at: string
}
interface ManifestWiki {
  id: string
  slug: string
  category: WikiCategory
  sort_order: number
  status: string
  title_ko: string | null
  title_zh: string | null
  created_at: string
  updated_at: string
}
interface Manifest {
  posts: ManifestPost[]
  wiki: ManifestWiki[]
}

let _manifest: Manifest | null = null
async function loadManifest(): Promise<Manifest> {
  if (!_manifest) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, 'manifest.json'), 'utf-8')
    _manifest = JSON.parse(raw) as Manifest
  }
  return _manifest
}

// -----------------------------------------------
// 개별 MD 문서 읽기 (frontmatter + body)
// frontmatter 값은 JSON 스칼라로 직렬화돼 있음 → JSON.parse, 실패 시 raw 문자열
// -----------------------------------------------
interface ParsedDoc {
  meta: Record<string, unknown>
  body: string
}
async function readDoc(
  type: 'posts' | 'wiki',
  locale: Locale,
  slug: string
): Promise<ParsedDoc | null> {
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, type, locale, `${slug}.md`),
      'utf-8'
    )
    const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
    if (!m) return null
    const meta: Record<string, unknown> = {}
    for (const line of m[1].split(/\r?\n/)) {
      const idx = line.indexOf(': ')
      if (idx < 0) continue
      const key = line.slice(0, idx).trim()
      const rawVal = line.slice(idx + 2).trim()
      try {
        meta[key] = JSON.parse(rawVal)
      } catch {
        meta[key] = rawVal
      }
    }
    return { meta, body: raw.slice(m[0].length) }
  } catch {
    return null
  }
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null
}

function mapListPost(p: ManifestPost, locale: Locale): PostLocalized {
  return {
    id: p.id,
    slug: p.slug,
    category: p.category,
    title: (locale === 'ko' ? p.title_ko : p.title_zh) ?? p.title_ko ?? '',
    summary: (locale === 'ko' ? p.summary_ko : p.summary_zh) ?? p.summary_ko ?? null,
    body: null, // 리스트는 본문 미포함
    body_original: null,
    source_url: null,
    cover_image_url: p.cover_image_url,
    published_at: p.published_at,
    created_at: p.created_at,
  }
}

function publishedPostsSorted(m: Manifest): ManifestPost[] {
  return m.posts
    .filter((p) => p.status === 'published')
    .sort(
      (a, b) =>
        new Date(b.published_at ?? b.created_at).getTime() -
        new Date(a.published_at ?? a.created_at).getTime()
    )
}

function matchCategory(
  cat: PostCategory,
  filter?: PostCategory | PostCategory[]
): boolean {
  if (!filter) return true
  return Array.isArray(filter) ? filter.includes(cat) : cat === filter
}

// -----------------------------------------------
// 공개 쿼리 (queries.ts 시그니처 호환)
// -----------------------------------------------

/** 홈: 최신 포스트 (카테고리 필터 옵션) */
export async function getLatestPosts(
  locale: Locale,
  category?: PostCategory | PostCategory[],
  limit = 6
): Promise<PostLocalized[]> {
  const m = await loadManifest()
  return publishedPostsSorted(m)
    .filter((p) => matchCategory(p.category, category))
    .slice(0, limit)
    .map((p) => mapListPost(p, locale))
}

/** 뉴스/Official 목록 (페이지네이션) */
export async function getPostList(
  locale: Locale,
  category: PostCategory | PostCategory[],
  page = 1,
  pageSize = PAGE_SIZE
): Promise<PaginatedResult<PostLocalized>> {
  const m = await loadManifest()
  const all = publishedPostsSorted(m).filter((p) =>
    matchCategory(p.category, category)
  )
  const total = all.length
  const from = (page - 1) * pageSize
  return {
    data: all.slice(from, from + pageSize).map((p) => mapListPost(p, locale)),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}

/** 포스트 상세 (slug) — 본문 포함 */
export async function getPostBySlug(
  slug: string,
  locale: Locale
): Promise<PostLocalized | null> {
  const doc = await readDoc('posts', locale, slug)
  if (!doc || doc.meta.status !== 'published') return null
  return {
    id: str(doc.meta.id) ?? slug,
    slug,
    category: doc.meta.category as PostCategory,
    title: str(doc.meta.title) ?? '',
    summary: str(doc.meta.summary),
    body: doc.body.trim().length > 0 ? doc.body : null,
    body_original: null,
    source_url: str(doc.meta.source_url),
    cover_image_url: str(doc.meta.cover_image_url),
    published_at: str(doc.meta.published_at),
    created_at: str(doc.meta.created_at) ?? str(doc.meta.published_at) ?? '',
  }
}

/** 모든 published 포스트 slug (generateStaticParams용) */
export async function getAllPostSlugs(): Promise<string[]> {
  const m = await loadManifest()
  return m.posts.filter((p) => p.status === 'published').map((p) => p.slug)
}

/** 모든 published 포스트 slug + category (generateStaticParams용) */
export async function getAllPostSlugsWithCategory(): Promise<
  { slug: string; category: PostCategory }[]
> {
  const m = await loadManifest()
  return m.posts
    .filter((p) => p.status === 'published')
    .map((p) => ({ slug: p.slug, category: p.category }))
}

/** 위키 목록 (카테고리 필터) */
export async function getWikiPages(
  locale: Locale,
  category?: WikiCategory
): Promise<WikiPageLocalized[]> {
  const m = await loadManifest()
  return m.wiki
    .filter((w) => w.status === 'published' && (!category || w.category === category))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((w) => ({
      id: w.id,
      slug: w.slug,
      category: w.category,
      title: (locale === 'ko' ? w.title_ko : w.title_zh) ?? w.title_ko ?? '',
      body: null,
      sort_order: w.sort_order,
      created_at: w.created_at,
    }))
}

/** 위키 상세 (slug) — 본문 포함 */
export async function getWikiBySlug(
  slug: string,
  locale: Locale
): Promise<WikiPageLocalized | null> {
  const doc = await readDoc('wiki', locale, slug)
  if (!doc || doc.meta.status !== 'published') return null
  return {
    id: str(doc.meta.id) ?? slug,
    slug,
    category: doc.meta.category as WikiCategory,
    title: str(doc.meta.title) ?? '',
    body: doc.body.trim().length > 0 ? doc.body : null,
    sort_order: typeof doc.meta.sort_order === 'number' ? doc.meta.sort_order : 0,
    created_at: str(doc.meta.created_at) ?? '',
  }
}

/** 모든 위키 slug (generateStaticParams용) */
export async function getAllWikiSlugs(): Promise<string[]> {
  const m = await loadManifest()
  return m.wiki.filter((w) => w.status === 'published').map((w) => w.slug)
}

/**
 * 정적 폴백 검색 (title + summary, 대소문자 무시).
 * 전문(full-text) 검색은 빌드 후 Pagefind 클라이언트가 담당 — search 페이지에서 사용.
 */
export async function searchPosts(
  query: string,
  locale: Locale,
  limit = 20
): Promise<PostLocalized[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const m = await loadManifest()
  return publishedPostsSorted(m)
    .map((p) => mapListPost(p, locale))
    .filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.summary ?? '').toLowerCase().includes(q)
    )
    .slice(0, limit)
}

/** Sitemap용: 모든 published posts + wiki slugs */
export async function getAllPublishedSlugs(): Promise<{
  posts: { slug: string; published_at: string | null; category: PostCategory }[]
  wikis: { slug: string; updated_at: string }[]
}> {
  const m = await loadManifest()
  return {
    posts: publishedPostsSorted(m).map((p) => ({
      slug: p.slug,
      published_at: p.published_at,
      category: p.category,
    })),
    wikis: m.wiki
      .filter((w) => w.status === 'published')
      .map((w) => ({ slug: w.slug, updated_at: w.updated_at })),
  }
}
