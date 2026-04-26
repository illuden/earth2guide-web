// ================================================
// earth2guide.com — Supabase 쿼리 함수
// ================================================
import { createClient } from './server'
import type {
  Post,
  PostLocalized,
  WikiPage,
  WikiPageLocalized,
  PostCategory,
  WikiCategory,
  Locale,
  PaginatedResult,
  PostFormData,
  WikiFormData,
} from './types'

const PAGE_SIZE = 12

// locale에 따라 제목/본문 필드 선택
function localizePost(post: Post, locale: Locale): PostLocalized {
  return {
    id: post.id,
    slug: post.slug,
    category: post.category,
    title: (locale === 'ko' ? post.title_ko : post.title_zh) ?? post.title_ko ?? '',
    summary: (locale === 'ko' ? post.summary_ko : post.summary_zh) ?? post.summary_ko ?? null,
    body: (locale === 'ko' ? post.body_ko : post.body_zh) ?? post.body_ko ?? null,
    body_original: post.body_original,
    source_url: post.source_url,
    cover_image_url: post.cover_image_url,
    published_at: post.published_at,
    created_at: post.created_at,
  }
}

function localizeWiki(page: WikiPage, locale: Locale): WikiPageLocalized {
  return {
    id: page.id,
    slug: page.slug,
    category: page.category,
    title: (locale === 'ko' ? page.title_ko : page.title_zh) ?? page.title_ko ?? '',
    body: (locale === 'ko' ? page.body_ko : page.body_zh) ?? page.body_ko ?? null,
    sort_order: page.sort_order,
    created_at: page.created_at,
  }
}

// -----------------------------------------------
// 공개 쿼리 (anon — published only)
// -----------------------------------------------

/** 홈: 최신 포스트 (카테고리 필터 옵션) */
export async function getLatestPosts(
  locale: Locale,
  category?: PostCategory | PostCategory[],
  limit = 6
): Promise<PostLocalized[]> {
  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (category) {
    if (Array.isArray(category)) {
      query = query.in('category', category)
    } else {
      query = query.eq('category', category)
    }
  }

  const { data, error } = await query
  if (error) { console.error('getLatestPosts:', error); return [] }
  return (data as Post[]).map((p) => localizePost(p, locale))
}

/** 뉴스/Official 목록 (페이지네이션) */
export async function getPostList(
  locale: Locale,
  category: PostCategory | PostCategory[],
  page = 1,
  pageSize = PAGE_SIZE
): Promise<PaginatedResult<PostLocalized>> {
  const supabase = await createClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to)

  if (Array.isArray(category)) {
    query = query.in('category', category)
  } else {
    query = query.eq('category', category)
  }

  const { data, count, error } = await query
  if (error) { console.error('getPostList:', error) }

  const total = count ?? 0
  return {
    data: ((data ?? []) as Post[]).map((p) => localizePost(p, locale)),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/** 포스트 상세 (slug) */
export async function getPostBySlug(slug: string, locale: Locale): Promise<PostLocalized | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return localizePost(data as Post, locale)
}

/** 모든 published 포스트 slug (generateStaticParams용 — 빌드타임) */
export async function getAllPostSlugs(): Promise<string[]> {
  const { createStaticClient } = await import('./static')
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('posts')
    .select('slug')
    .eq('status', 'published')
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

/** 위키 목록 (카테고리 필터) */
export async function getWikiPages(
  locale: Locale,
  category?: WikiCategory
): Promise<WikiPageLocalized[]> {
  const supabase = await createClient()
  let query = supabase
    .from('wiki_pages')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })

  if (category) query = query.eq('category', category)

  const { data, error } = await query
  if (error) { console.error('getWikiPages:', error); return [] }
  return (data as WikiPage[]).map((p) => localizeWiki(p, locale))
}

/** 위키 상세 (slug) */
export async function getWikiBySlug(slug: string, locale: Locale): Promise<WikiPageLocalized | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('wiki_pages')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return localizeWiki(data as WikiPage, locale)
}

/** 모든 위키 slug (generateStaticParams용 — 빌드타임) */
export async function getAllWikiSlugs(): Promise<string[]> {
  const { createStaticClient } = await import('./static')
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('wiki_pages')
    .select('slug')
    .eq('status', 'published')
  return (data ?? []).map((r: { slug: string }) => r.slug)
}

/** 전문 검색 (FTS) */
export async function searchPosts(
  query: string,
  locale: Locale,
  limit = 20
): Promise<PostLocalized[]> {
  const supabase = await createClient()
  const titleField = locale === 'ko' ? 'title_ko' : 'title_zh'
  const bodyField = locale === 'ko' ? 'body_ko' : 'body_zh'

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .or(`${titleField}.ilike.%${query}%,${bodyField}.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) { console.error('searchPosts:', error); return [] }
  return (data as Post[]).map((p) => localizePost(p, locale))
}

// -----------------------------------------------
// Admin 쿼리 (service_role)
// -----------------------------------------------
import { createAdminClient } from './server'

/** Admin: 포스트 전체 목록 (status 포함) */
export async function adminGetAllPosts(
  page = 1,
  pageSize = 20,
  filter?: { status?: string; category?: string }
): Promise<PaginatedResult<Post>> {
  const supabase = await createAdminClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (filter?.status) query = query.eq('status', filter.status)
  if (filter?.category) query = query.eq('category', filter.category)

  const { data, count, error } = await query
  if (error) console.error('adminGetAllPosts:', error)

  const total = count ?? 0
  return {
    data: (data ?? []) as Post[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/** Admin: 포스트 단건 조회 (id) */
export async function adminGetPostById(id: string): Promise<Post | null> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as Post
}

/** Admin: 포스트 생성/수정 */
export async function adminUpsertPost(
  data: PostFormData,
  id?: string
): Promise<{ id: string } | null> {
  const supabase = await createAdminClient()

  if (id) {
    const { data: result, error } = await supabase
      .from('posts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id')
      .single()
    if (error) { console.error('adminUpsertPost update:', error); return null }
    return result
  } else {
    const { data: result, error } = await supabase
      .from('posts')
      .insert(data)
      .select('id')
      .single()
    if (error) { console.error('adminUpsertPost insert:', error); return null }
    return result
  }
}

/** Admin: 포스트 삭제 */
export async function adminDeletePost(id: string): Promise<boolean> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('posts').delete().eq('id', id)
  if (error) { console.error('adminDeletePost:', error); return false }
  return true
}

/** Admin: 위키 전체 목록 */
export async function adminGetAllWikiPages(
  page = 1,
  pageSize = 50
): Promise<PaginatedResult<WikiPage>> {
  const supabase = await createAdminClient()
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await supabase
    .from('wiki_pages')
    .select('*', { count: 'exact' })
    .order('category', { ascending: true })
    .order('sort_order', { ascending: true })
    .range(from, to)

  if (error) console.error('adminGetAllWikiPages:', error)

  const total = count ?? 0
  return {
    data: (data ?? []) as WikiPage[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/** Admin: 위키 단건 조회 */
export async function adminGetWikiById(id: string): Promise<WikiPage | null> {
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('wiki_pages')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data as WikiPage
}

/** Admin: 위키 생성/수정 */
export async function adminUpsertWiki(
  data: WikiFormData,
  id?: string
): Promise<{ id: string } | null> {
  const supabase = await createAdminClient()

  if (id) {
    const { data: result, error } = await supabase
      .from('wiki_pages')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id')
      .single()
    if (error) { console.error('adminUpsertWiki update:', error); return null }
    return result
  } else {
    const { data: result, error } = await supabase
      .from('wiki_pages')
      .insert(data)
      .select('id')
      .single()
    if (error) { console.error('adminUpsertWiki insert:', error); return null }
    return result
  }
}

/** Admin: 위키 삭제 */
export async function adminDeleteWiki(id: string): Promise<boolean> {
  const supabase = await createAdminClient()
  const { error } = await supabase.from('wiki_pages').delete().eq('id', id)
  if (error) { console.error('adminDeleteWiki:', error); return false }
  return true
}

/** Sitemap용: 모든 published posts + wiki slugs */
export async function getAllPublishedSlugs(): Promise<{
  posts: { slug: string; published_at: string | null; category: PostCategory }[]
  wikis: { slug: string; updated_at: string }[]
}> {
  const supabase = await createClient()

  const [postsRes, wikisRes] = await Promise.all([
    supabase
      .from('posts')
      .select('slug, published_at, category')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('wiki_pages')
      .select('slug, updated_at')
      .eq('status', 'published'),
  ])

  return {
    posts: (postsRes.data ?? []) as { slug: string; published_at: string | null; category: PostCategory }[],
    wikis: (wikisRes.data ?? []) as { slug: string; updated_at: string }[],
  }
}
