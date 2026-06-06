import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/supabase/types'
import { getWikiBySlug, getWikiPages, getAllWikiSlugs } from '@/lib/supabase/queries'
import { JsonLd, wikiLd, mdExcerpt, faqFromMarkdown, faqLd } from '@/components/seo/JsonLd'
import { WIKI_CATEGORY_META } from '@/lib/supabase/types'
import { routing } from '@/i18n/routing'
import { WikiSidebar } from '@/components/wiki/WikiSidebar'
import { WikiCategoryDropdown } from '@/components/wiki/WikiCategoryDropdown'
import { WikiContent } from '@/components/wiki/WikiContent'

export const revalidate = 3600
export const dynamicParams = true   // 빌드 후 추가된 slug도 ISR로 처리

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
  const excerpt = mdExcerpt(page.body ?? '')
  return {
    title: page.title,
    description: excerpt || (locale === 'ko'
      ? `어스2 위키 — ${page.title} | Earth 2 공식 가이드 한국어 정리`
      : `Earth2Guide 百科 — ${page.title}`),
    alternates: { canonical: `/${locale}/wiki/${slug}` },
  }
}

export default async function WikiDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const l = locale as Locale

  const [page, allPages] = await Promise.all([
    getWikiBySlug(slug, l),
    getWikiPages(l),
  ])

  if (!page) redirect(`/${locale}/wiki/overview`)

  const catMeta = WIKI_CATEGORY_META[page.category]
  const categoryLabel = locale === 'ko' ? catMeta.label_ko : catMeta.label_zh
  const faqItems = faqFromMarkdown(page.body ?? '')

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <JsonLd
        data={wikiLd({
          locale,
          url: `https://earth2guide.com/${locale}/wiki/${page.slug}`,
          title: page.title,
          description: mdExcerpt(page.body ?? ''),
          categoryLabel,
          categorySlug: page.category,
        })}
      />
      {faqItems.length > 0 && <JsonLd data={faqLd(faqItems, locale)} />}
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
            <WikiContent body={page.body} />
          ) : (
            <p className="text-[#bbc9cf] leading-relaxed">(콘텐츠 준비 중)</p>
          )}
        </div>
      </div>
    </div>
  )
}
