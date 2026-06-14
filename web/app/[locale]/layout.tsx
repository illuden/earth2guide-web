import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { JsonLd, siteGraph } from '@/components/seo/JsonLd'
import { Footer } from '@/components/layout/Footer'
import { ReferralBar } from '@/components/referral/ReferralBar'

// static export: [locale] 전부 prerender
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isKo = locale === 'ko'
  return {
    title: {
      template: isKo ? '%s | 어스2 가이드 Earth2Guide' : '%s | Earth2Guide',
      default: isKo
        ? 'Earth2Guide — 어스2(Earth 2) 정보 허브'
        : 'Earth2Guide — Earth 2 信息中心',
    },
    description: isKo
      ? '어스2(Earth 2) 메타버스 한국어 뉴스, 공식 공지, 위키 정보를 한곳에서'
      : 'Earth 2 元宇宙中文资讯、官方公告与百科指南',
    openGraph: {
      siteName: 'Earth2Guide',
      locale: isKo ? 'ko_KR' : 'zh_CN',
      type: 'website',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // static rendering 활성화 (next-intl)
  setRequestLocale(locale)

  const messages = (await import(`@/messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd data={siteGraph(locale)} />
      <Header />
      <main className="flex-1 pt-16">
        <ReferralBar />
        {children}
      </main>
      <Footer locale={locale} />
    </NextIntlClientProvider>
  )
}
