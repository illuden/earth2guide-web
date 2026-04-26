import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import type { Locale, PostCategory } from '@/lib/supabase/types'
import { getLatestPosts } from '@/lib/supabase/queries'
import { OfficialTabs } from '@/components/official/OfficialTabs'

export const revalidate = 300

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'nav' })
  return { title: t('official') }
}

const OFFICIAL_CATEGORIES: PostCategory[] = ['announcement', 'official_news', 'update', 'promotion']

export default async function OfficialPage({ params }: PageProps) {
  const { locale } = await params
  const l = locale as Locale
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
        basePath={`/${locale}/official`}
      />
    </div>
  )
}
