import type { Metadata } from 'next'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const isKo = locale === 'ko'
  return {
    title: isKo ? '이용약관' : '使用条款',
    robots: { index: false },
    alternates: { canonical: `/${locale}/terms` },
  }
}

const H2 = 'text-lg font-headline font-bold text-[#dee1f7] mt-8 mb-3'
const P = 'text-[#bbc9cf] leading-relaxed mb-3 text-sm'

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params
  const isKo = locale === 'ko'
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-headline font-bold uppercase tracking-tight text-[#dee1f7] mb-6">
        {isKo ? '이용약관' : '使用条款'}
      </h1>
      {isKo ? (
        <>
          <p className={P}>최종 업데이트: 2026-06-06</p>
          <h2 className={H2}>정보 제공 목적</h2>
          <p className={P}>
            Earth2Guide의 모든 콘텐츠는 정보 제공 목적이며, 투자·법률·세무 조언이 아닙니다.
            가상자산 및 메타버스 자산 구매는 원금 손실 위험이 있으며, 모든 결정과 책임은 이용자 본인에게 있습니다.
          </p>
          <h2 className={H2}>정확성의 한계</h2>
          <p className={P}>
            본 사이트는 earth2.io 공식 발표를 원문 링크와 함께 번역·정리하지만, 번역 오류나 정보의 시차가
            있을 수 있습니다. 중요한 결정 전에는 반드시 원문(earth2.io)을 확인하십시오.
          </p>
          <h2 className={H2}>상표·저작권</h2>
          <p className={P}>
            Earth 2®는 해당 소유주의 상표이며, 본 사이트는 Earth 2 운영사와 무관한 독립 커뮤니티 프로젝트입니다.
            원문 콘텐츠의 권리는 원저작자에게 있습니다.
          </p>
        </>
      ) : (
        <>
          <p className={P}>最近更新：2026-06-06</p>
          <h2 className={H2}>仅供参考</h2>
          <p className={P}>
            Earth2Guide 的全部内容仅供参考，不构成投资、法律或税务建议。购买虚拟资产存在本金损失风险，
            一切决定与责任由用户自行承担。
          </p>
          <h2 className={H2}>准确性限制与商标</h2>
          <p className={P}>
            本站翻译·整理 earth2.io 官方发布并附原文链接，但可能存在翻译误差或信息时差，重要决定前请务必核对原文。
            Earth 2® 为其所有者的商标；本站为独立社区项目，与 Earth 2 运营方无关。原文内容版权归原作者所有。
          </p>
        </>
      )}
    </div>
  )
}
