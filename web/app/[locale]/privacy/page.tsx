import type { Metadata } from 'next'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const isKo = locale === 'ko'
  return {
    title: isKo ? '개인정보 처리방침' : '隐私政策',
    robots: { index: false },
    alternates: { canonical: `/${locale}/privacy` },
  }
}

const H2 = 'text-lg font-headline font-bold text-[#dee1f7] mt-8 mb-3'
const P = 'text-[#bbc9cf] leading-relaxed mb-3 text-sm'

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params
  const isKo = locale === 'ko'
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-headline font-bold uppercase tracking-tight text-[#dee1f7] mb-6">
        {isKo ? '개인정보 처리방침' : '隐私政策'}
      </h1>
      {isKo ? (
        <>
          <p className={P}>최종 업데이트: 2026-06-06</p>
          <h2 className={H2}>수집하는 정보</h2>
          <p className={P}>
            Earth2Guide는 회원가입 기능이 없으며 이름·이메일 등 개인정보를 직접 수집하지 않습니다.
            사이트 개선을 위해 Google Analytics 4(쿠키 기반)로 방문 통계(페이지뷰, 대략적 지역, 기기 유형)를
            익명 수준에서 수집합니다.
          </p>
          <h2 className={H2}>쿠키</h2>
          <p className={P}>
            Google Analytics가 사용하는 쿠키 외에 자체 추적 쿠키를 사용하지 않습니다.
            브라우저 설정에서 쿠키를 차단해도 사이트 이용에 제한이 없습니다.
          </p>
          <h2 className={H2}>제3자 서비스</h2>
          <p className={P}>
            호스팅(Vercel), 이미지 저장(Cloudflare), 통계(Google Analytics)를 사용하며 각 서비스의
            개인정보 정책이 적용될 수 있습니다. 외부 링크(earth2.io 등) 방문 시 해당 사이트의 정책을 따릅니다.
          </p>
        </>
      ) : (
        <>
          <p className={P}>最近更新：2026-06-06</p>
          <h2 className={H2}>信息收集</h2>
          <p className={P}>
            Earth2Guide 不提供注册功能，不直接收集姓名、邮箱等个人信息。为改进网站，我们使用
            Google Analytics 4（基于 Cookie）匿名收集访问统计（页面浏览量、大致地区、设备类型）。
          </p>
          <h2 className={H2}>Cookie 与第三方服务</h2>
          <p className={P}>
            除 Google Analytics 外，本站不使用自有跟踪 Cookie。本站使用 Vercel（托管）、Cloudflare（图片存储）、
            Google Analytics（统计），各服务适用其自身隐私政策。访问外部链接（如 earth2.io）时适用对方网站政策。
          </p>
        </>
      )}
    </div>
  )
}
