import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/supabase/types'
import { getWikiBySlug, getWikiPages, getAllWikiSlugs } from '@/lib/supabase/queries'
import { routing } from '@/i18n/routing'
import { WikiSidebar } from '@/components/wiki/WikiSidebar'
import { WikiCategoryDropdown } from '@/components/wiki/WikiCategoryDropdown'
import { WikiContent } from '@/components/wiki/WikiContent'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllWikiSlugs()
  // [locale] × [slug] 카르테시안 — Next.js 16은 모든 dynamic segment 명시 요구
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const page = await getWikiBySlug(slug, locale as Locale)
  if (!page) return {}
  return {
    title: page.title,
    description: `Earth2Guide 위키 — ${page.title}`,
  }
}

export default async function WikiDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const l = locale as Locale

  const [page, allPages] = await Promise.all([
    getWikiBySlug(slug, l),
    getWikiPages(l),
  ])

  if (!page) notFound()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex gap-10">
        {/* 사이드바 (PC) */}
        <div className="hidden md:block">
          <WikiSidebar pages={allPages} currentSlug={slug} locale={locale} />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 min-w-0">
          {/* 모바일 드롭다운 */}
          <WikiCategoryDropdown pages={allPages} currentSlug={slug} locale={locale} />

          {/* 제목 */}
          <h1 className="text-2xl lg:text-4xl font-headline font-bold text-[#dee1f7] mb-8 pb-4 border-b border-[#3c494e]/30">
            {page.title}
          </h1>

          {/* 본문 */}
          {page.body ? (
            <WikiContent html={page.body} />
          ) : (
            <p className="text-[#bbc9cf] leading-relaxed">(콘텐츠 준비 중)</p>
          )}
        </div>
      </div>
    </div>
  )
}
