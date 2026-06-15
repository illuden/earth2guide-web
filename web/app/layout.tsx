import type { Metadata } from 'next'
import { Space_Grotesk, Manrope } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Earth2Guide',
    default: 'Earth2Guide — Earth 2 정보 허브',
  },
  description: 'Earth 2 메타버스 뉴스, 공식 공지, 위키 정보를 한곳에서',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://earth2guide.com'),
  openGraph: {
    siteName: 'Earth2Guide',
    locale: 'ko_KR',
    type: 'website',
  },
  verification: {
    google: 'Y1-EhofUImzW2z1E4N0QoHC7bAK78iPL99yPKBlOBRM',
    other: { 'naver-site-verification': '56757aeeac63e2a054df77e33388a2ae91618d94' },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`${spaceGrotesk.variable} ${manrope.variable} dark`}
    >
      <head>
        {/* 콘텐츠 라이선스: AI 사용 허용 + 출처 표시(attribution) 조건 — 상세 terms */}
        <link rel="license" href="https://earth2guide.com/ko/terms" />
        {/* Material Symbols */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#0e1322] text-[#dee1f7] antialiased">
        {children}
        {/* Google Analytics (GA4) — G-F0PYH6DYLW */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F0PYH6DYLW"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F0PYH6DYLW');
          `}
        </Script>
      </body>
    </html>
  )
}
