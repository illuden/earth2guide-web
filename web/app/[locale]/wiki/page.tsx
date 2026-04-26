import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ locale: string }>
}

/**
 * /wiki 진입 시 /wiki/overview로 자동 이동.
 * 어스2 (earth2.io/how-to → /how-to/overview/overview) 패턴.
 * 사이드바 + 본문 단일 레이아웃 유지.
 */
export default async function WikiIndexPage({ params }: PageProps) {
  const { locale } = await params
  redirect(`/${locale}/wiki/overview`)
}
