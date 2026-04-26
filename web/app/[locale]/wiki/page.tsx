import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Locale, WikiCategory } from '@/lib/supabase/types'
import { WIKI_CATEGORY_META } from '@/lib/supabase/types'
import { getWikiPages } from '@/lib/supabase/queries'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'wiki' })
  return { title: t('title') }
}

export default async function WikiPage({ params, searchParams }: PageProps) {
  const { locale } = await params
  const { category } = await searchParams
  const l = locale as Locale
  const t = await getTranslations({ locale, namespace: 'wiki' })

  const pages = await getWikiPages(l, category as WikiCategory | undefined)
  const categories = Object.entries(WIKI_CATEGORY_META) as [WikiCategory, typeof WIKI_CATEGORY_META[WikiCategory]][]

  // 카테고리별 그룹화
  const grouped: Record<WikiCategory, typeof pages> = {} as Record<WikiCategory, typeof pages>
  for (const page of pages) {
    if (!grouped[page.category]) grouped[page.category] = []
    grouped[page.category].push(page)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* 헤더 */}
      <div className="mb-10">
        <p className="text-xs font-label uppercase tracking-widest text-[#00d4ff]/70 mb-2">
          Knowledge Base
        </p>
        <h1 className="text-3xl lg:text-5xl font-headline font-bold uppercase tracking-tight text-[#dee1f7] mb-2">
          {t('title')}
        </h1>
        <p className="text-[#bbc9cf] text-sm">{t('subtitle')}</p>
      </div>

      {/* 카테고리 필터 탭 */}
      <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
        <Link
          href={`/${locale}/wiki`}
          className={`px-4 py-2 text-sm font-label uppercase tracking-wider border transition-all rounded-sm whitespace-nowrap ${
            !category
              ? 'bg-[#00d4ff] text-[#003642] border-[#00d4ff] font-bold'
              : 'border-[#3c494e] text-[#bbc9cf] hover:border-[#00d4ff]/50 hover:text-[#a8e8ff]'
          }`}
        >
          전체
        </Link>
        {categories.map(([key, meta]) => (
          <Link
            key={key}
            href={`/${locale}/wiki?category=${key}`}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-label uppercase tracking-wider border transition-all rounded-sm whitespace-nowrap ${
              category === key
                ? 'bg-[#00d4ff] text-[#003642] border-[#00d4ff] font-bold'
                : 'border-[#3c494e] text-[#bbc9cf] hover:border-[#00d4ff]/50 hover:text-[#a8e8ff]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">{meta.icon}</span>
            {l === 'ko' ? meta.label_ko : meta.label_zh}
          </Link>
        ))}
      </div>

      {/* 카테고리별 문서 목록 */}
      {category ? (
        // 특정 카테고리 필터
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((page) => (
            <Link
              key={page.slug}
              href={`/${locale}/wiki/${page.slug}`}
              className="group flex items-center gap-3 px-5 py-4 bg-[#1a1f2f] border border-[#3c494e]/30 hover:border-[#00d4ff]/40 transition-all rounded-sm"
            >
              <span className="material-symbols-outlined text-xl text-[#00d4ff]">
                {WIKI_CATEGORY_META[page.category]?.icon ?? 'article'}
              </span>
              <span className="font-body text-sm text-[#dee1f7] group-hover:text-[#a8e8ff] transition-colors">
                {page.title}
              </span>
              <span className="material-symbols-outlined text-sm text-[#3c494e] group-hover:text-[#00d4ff] ml-auto transition-colors">
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      ) : (
        // 전체 카테고리별 섹션
        <div className="space-y-12">
          {categories.map(([key, meta]) => {
            const catPages = grouped[key]
            if (!catPages || catPages.length === 0) return null

            return (
              <div key={key}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-full bg-[#1a1f2f] border border-[#3c494e]/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-base text-[#00d4ff]">{meta.icon}</span>
                  </div>
                  <h2 className="text-lg font-headline font-bold uppercase tracking-wider text-[#dee1f7]">
                    {l === 'ko' ? meta.label_ko : meta.label_zh}
                  </h2>
                  <div className="flex-1 h-px bg-[#3c494e]/30" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catPages.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/${locale}/wiki/${page.slug}`}
                      className="group flex items-center gap-3 px-4 py-3 bg-[#1a1f2f] border border-[#3c494e]/30 hover:border-[#00d4ff]/40 transition-all rounded-sm"
                    >
                      <span className="font-body text-sm text-[#dee1f7] group-hover:text-[#a8e8ff] transition-colors flex-1">
                        {page.title}
                      </span>
                      <span className="material-symbols-outlined text-sm text-[#3c494e] group-hover:text-[#00d4ff] transition-colors">
                        chevron_right
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
