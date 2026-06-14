'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import type { Locale, PostLocalized, PostCategory } from '@/lib/supabase/types'
import { SearchBar } from './SearchBar'
import { SearchResultCard } from './SearchResultCard'
import { EmptyState } from '@/components/ui/EmptyState'

interface IndexPost {
  slug: string
  category: PostCategory
  title_ko: string | null
  title_zh: string | null
  summary_ko: string | null
  summary_zh: string | null
  cover_image_url: string | null
  published_at: string | null
}

/**
 * 정적 클라이언트 검색 (title + summary).
 * 빌드 산출물 `/search-index.json`(public/) 을 받아 브라우저에서 필터.
 * 런타임 DB 없이 동작 — static export 호환.
 */
export function SearchClient({ locale }: { locale: Locale }) {
  const t = useTranslations('search')
  const sp = useSearchParams()
  const query = (sp.get('q') ?? '').trim()
  const [index, setIndex] = useState<IndexPost[] | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/search-index.json')
      .then((r) => r.json())
      .then((d: IndexPost[]) => { if (alive) setIndex(d) })
      .catch(() => { if (alive) setIndex([]) })
    return () => { alive = false }
  }, [])

  const q = query.toLowerCase()
  const results: PostLocalized[] = (index ?? [])
    .map((p): PostLocalized => {
      const title = (locale === 'ko' ? p.title_ko : p.title_zh) ?? p.title_ko ?? ''
      const summary = (locale === 'ko' ? p.summary_ko : p.summary_zh) ?? p.summary_ko ?? null
      return {
        id: p.slug,
        slug: p.slug,
        category: p.category,
        title,
        summary,
        body: null,
        body_original: null,
        source_url: null,
        cover_image_url: p.cover_image_url,
        published_at: p.published_at,
        created_at: p.published_at ?? '',
      }
    })
    .filter(
      (p) =>
        q.length > 0 &&
        (p.title.toLowerCase().includes(q) ||
          (p.summary ?? '').toLowerCase().includes(q))
    )

  return (
    <>
      <SearchBar locale={locale} defaultValue={query} placeholder={t('placeholder')} />

      {query && (
        <div className="mt-8">
          <p className="text-sm text-[#859398] font-label mb-6">
            <span className="text-[#00d4ff]">&ldquo;{query}&rdquo;</span>{' '}
            {locale === 'ko' ? '검색 결과' : '搜索结果'}:{' '}
            {index === null ? '…' : results.length}
            {locale === 'ko' ? '건' : ' 条'}
          </p>

          {index !== null &&
            (results.length > 0 ? (
              <div className="space-y-3">
                {results.map((post) => (
                  <SearchResultCard
                    key={post.id}
                    post={post}
                    locale={locale}
                    query={query}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="manage_search"
                title={t('noResults')}
                description={t('noResultsDesc')}
              />
            ))}
        </div>
      )}
    </>
  )
}
