import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/supabase/types'
import { WIKI_CATEGORY_META } from '@/lib/supabase/types'
import { getLatestPosts } from '@/lib/supabase/queries'
import { PostList } from '@/components/news/PostList'
import { Earth2ReferralBanner } from '@/components/referral/Earth2ReferralBanner'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export const revalidate = 300 // 5분 ISR

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const l = locale as Locale
  const t = await getTranslations({ locale, namespace: 'home' })

  // 병렬 데이터 페칭
  const [latestNews, officialPosts] = await Promise.all([
    getLatestPosts(l, ['news', 'announcement', 'update'], 6),
    getLatestPosts(l, ['official_news', 'promotion'], 6),
  ])

  const wikiCategories = Object.entries(WIKI_CATEGORY_META) as [
    keyof typeof WIKI_CATEGORY_META,
    typeof WIKI_CATEGORY_META[keyof typeof WIKI_CATEGORY_META]
  ][]

  return (
    <div className="min-h-screen">

      {/* ── Hero Section ── */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center pt-20 pb-16 px-6 overflow-hidden">
        {/* 배경 글로우 */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,212,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(22,255,158,0.05),transparent_60%)]" />

        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#00d4ff]/20 bg-[#003642]/30 rounded-sm text-xs font-label uppercase tracking-widest text-[#00d4ff]/70 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" />
            Earth 2 메타버스 정보 허브
          </div>

          <h1 className="text-5xl lg:text-7xl font-headline font-bold text-[#dee1f7] uppercase tracking-tighter text-glow">
            {t('title')}
          </h1>
          <p className="text-lg text-[#a8e8ff]/70 font-body max-w-xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>

          {/* 검색창 */}
          <Link
            href={`/${locale}/search`}
            className="group inline-flex items-center gap-3 w-full max-w-md mx-auto px-5 py-3 bg-[#161b2b] border border-[#3c494e] hover:border-[#00d4ff]/50 transition-all rounded-sm text-[#859398] hover:text-[#a8e8ff]"
          >
            <span className="material-symbols-outlined text-xl">search</span>
            <span className="text-sm font-label">{t('searchPlaceholder')}</span>
          </Link>
        </div>
      </section>

      {/* ── 리퍼럴 배너 ── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <Earth2ReferralBanner />
      </section>

      {/* ── 최신 뉴스 ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-headline font-bold uppercase tracking-tight text-[#dee1f7]">
            {t('latestNews')}
          </h2>
          <Link
            href={`/${locale}/news`}
            className="flex items-center gap-1 text-sm font-label text-[#00d4ff]/70 hover:text-[#00d4ff] transition-colors uppercase tracking-wider"
          >
            {t('viewAll')}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
        <PostList posts={latestNews} locale={l} basePath={`/${locale}/news`} />
      </section>

      {/* ── Earth 2 Official ── */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl lg:text-3xl font-headline font-bold uppercase tracking-tight text-[#dee1f7]">
            {t('officialSection')}
          </h2>
          <Link
            href={`/${locale}/official`}
            className="flex items-center gap-1 text-sm font-label text-[#00d4ff]/70 hover:text-[#00d4ff] transition-colors uppercase tracking-wider"
          >
            {t('viewAll')}
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
        <PostList posts={officialPosts} locale={l} basePath={`/${locale}/official`} />
      </section>

      {/* ── 위키 바로가기 ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 pb-24">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-2xl lg:text-4xl font-headline font-bold uppercase tracking-tight text-[#dee1f7]">
            {t('wikiSection')}
          </h2>
          <p className="text-[#bbc9cf] max-w-xl mx-auto font-body text-sm lg:text-base">
            {t('wikiDesc')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {wikiCategories.map(([key, meta]) => (
            <Link
              key={key}
              href={`/${locale}/wiki?category=${key}`}
              className="group relative aspect-square bg-[#1a1f2f] overflow-hidden border border-[#3c494e]/20 hover:border-[#00d4ff]/50 transition-all flex flex-col items-center justify-center gap-4"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00d4ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#25293a] group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl text-[#00d4ff]">
                  {meta.icon}
                </span>
              </div>
              <span className="font-headline font-bold tracking-widest text-xs uppercase text-[#dee1f7] group-hover:text-[#a8e8ff]">
                {locale === 'ko' ? meta.label_ko : meta.label_zh}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
