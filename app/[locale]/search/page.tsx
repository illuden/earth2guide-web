import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/supabase/types'
import { searchPosts } from '@/lib/supabase/queries'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchResultCard } from '@/components/search/SearchResultCard'
import { EmptyState } from '@/components/ui/EmptyState'

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'search' })
  return { title: t('title') }
}

export default async function SearchPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { q } = await searchParams
  const l = locale as Locale
  const t = await getTranslations({ locale, namespace: 'search' })

  const query = q?.trim() ?? ''
  const results = query ? await searchPosts(query, l) : []

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <p className="text-xs font-label uppercase tracking-widest text-[#00d4ff]/70 mb-2">
          Data Scan
        </p>
        <h1 className="text-3xl lg:text-4xl font-headline font-bold uppercase tracking-tight text-[#dee1f7] mb-6">
          {t('title')}
        </h1>

        <SearchBar
          locale={locale}
          defaultValue={query}
          placeholder={t('placeholder')}
        />
      </div>

      {/* 결과 */}
      {query && (
        <div>
          <p className="text-sm text-[#859398] font-label mb-6">
            <span className="text-[#00d4ff]">&ldquo;{query}&rdquo;</span>
            {' '}검색 결과: {results.length}건
          </p>

          {results.length > 0 ? (
            <div className="space-y-3">
              {results.map((post) => (
                <SearchResultCard
                  key={post.id}
                  post={post}
                  locale={l}
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
          )}
        </div>
      )}
    </div>
  )
}
