import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/seo'
import type { Locale } from '@/lib/supabase/types'
import { getLatestPosts } from '@/lib/content'
import { OfficialTabs } from '@/components/official/OfficialTabs'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return {
    title: t('official'),
    description: locale === 'ko'
      ? '어스2(Earth 2) 공식 공지·뉴스·업데이트·홍보 모음 — 한국어 번역.'
      : 'Earth 2 官方公告、新闻、更新与活动汇总 — 中文翻译。',
    alternates: localeAlternates(locale, '/official'),
  }
}

export default async function OfficialPage({ params }: PageProps) {
  const { locale } = await params
  const l = locale as Locale
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'nav' })

  // 카테고리별로 포스트 병렬 로딩 (각 최대 20개)
  const [announcements, officialNews, updates, promotions] = await Promise.all([
    getLatestPosts(l, 'announcement', 20),
    getLatestPosts(l, 'official_news', 20),
    getLatestPosts(l, 'update', 20),
    getLatestPosts(l, 'promotion', 20),
  ])

  const postsByCategory: Record<string, typeof announcements> = {
    announcement:  announcements,
    official_news: officialNews,
    update:        updates,
    promotion:     promotions,
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-10">
        <p className="text-xs font-label uppercase tracking-widest text-[#00d4ff]/70 mb-2">
          Verified Broadcast
        </p>
        <h1 className="text-3xl lg:text-5xl font-headline font-bold uppercase tracking-tight text-[#dee1f7]">
          {t('official')}
        </h1>
      </div>

      <OfficialTabs
        postsByCategory={postsByCategory}
        locale={l}
      />
    </div>
  )
}
