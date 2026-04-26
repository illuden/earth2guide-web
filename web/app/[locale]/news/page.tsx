import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/supabase/types'
import { getPostList } from '@/lib/supabase/queries'
import { PostList } from '@/components/news/PostList'
import { Pagination } from '@/components/news/Pagination'

export const revalidate = 300

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('news') }
}

export default async function NewsPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { page: pageParam } = await searchParams
  const l = locale as Locale
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const t = await getTranslations({ locale, namespace: 'nav' })

  const result = await getPostList(l, ['news', 'announcement', 'update'], page)

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-10">
        <p className="text-xs font-label uppercase tracking-widest text-[#00d4ff]/70 mb-2">
          Intel Stream
        </p>
        <h1 className="text-3xl lg:text-5xl font-headline font-bold uppercase tracking-tight text-[#dee1f7]">
          {t('news')}
        </h1>
      </div>

      <PostList posts={result.data} locale={l} basePath={`/${locale}/news`} />

      <Pagination
        currentPage={result.page}
        totalPages={result.totalPages}
        basePath={`/${locale}/news`}
      />
    </div>
  )
}
