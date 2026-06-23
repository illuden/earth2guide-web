import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import { localeAlternates } from '@/lib/seo'
import { Suspense } from 'react'
import type { Locale } from '@/lib/supabase/types'
import { SearchClient } from '@/components/search/SearchClient'

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'search' })
  return { title: t('title'), alternates: localeAlternates(locale, '/search') }
}

export default async function SearchPage({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'search' })

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
      </div>

      {/* 검색 UI (클라이언트) — useSearchParams는 Suspense 경계 필요 */}
      <Suspense fallback={null}>
        <SearchClient locale={locale as Locale} />
      </Suspense>
    </div>
  )
}
