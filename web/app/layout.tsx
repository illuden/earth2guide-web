import type { Metadata } from 'next'
import './globals.css'

// 루트 레이아웃은 패스스루.
// <html lang>은 로케일을 아는 app/[locale]/layout.tsx 에서 렌더한다.
// (정적 export + next-intl 라우팅 권장 패턴 — lang 하드코딩 제거)
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://earth2guide.com'),
  title: {
    template: '%s | Earth2Guide',
    default: 'Earth2Guide — Earth 2 정보 허브',
  },
  description: 'Earth 2 메타버스 뉴스, 공식 공지, 위키 정보를 한곳에서',
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
  return children
}
