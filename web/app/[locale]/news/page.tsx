import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/seo'
import type { Locale } from '@/lib/supabase/types'
import { getPostList } from '@/lib/content'
import { PostListPaginated } from '@/components/news/PostListPaginated'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return {
    title: t('news'),
    description: locale === 'ko'
      ? '어스2(Earth 2) 최신 뉴스·업데이트 — 공식 공지 한국어 번역과 E2V1 소식.'
      : 'Earth 2 最新资讯与更新 — 官方公告中文翻译与 E2V1 动态。',
    alternates: localeAlternates(locale, '/news'),
  }
}

export default async function NewsPage({ params }: PageProps) {
  const { locale } = await params
  const l = locale as Locale
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nav' })

  // static: 전체 로드 → 클라이언트 페이지네이션
  const result = await getPostList(l, ['news', 'announcement', 'update'], 1, 100000)

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

      <PostListPaginated posts={result.data} locale={l} pageSize={12} />
    </div>
  )
}
