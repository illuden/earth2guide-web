import type { Metadata } from 'next'
import Link from 'next/link'
import { JsonLd, ORG_ID } from '@/components/seo/JsonLd'

interface PageProps { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const isKo = locale === 'ko'
  return {
    title: isKo ? '소개 — 어스2 가이드란?' : '关于我们 — Earth2Guide',
    description: isKo
      ? 'Earth2Guide(어스2 가이드)는 Earth 2 메타버스의 공식 발표와 가이드를 한국어·중국어로 정리하는 독립 정보 사이트입니다. 운영 방식, 출처 정책, 수익 고지를 안내합니다.'
      : 'Earth2Guide 是将 Earth 2 元宇宙官方公告与指南整理为中文·韩文的独立信息网站。',
    alternates: { canonical: `/${locale}/about` },
  }
}

const SECTION = 'mb-10'
const H2 = 'text-xl lg:text-2xl font-headline font-bold text-[#dee1f7] mb-4 uppercase tracking-tight'
const P = 'text-[#bbc9cf] leading-relaxed mb-3'

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params
  const isKo = locale === 'ko'

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: isKo ? 'Earth2Guide 소개' : '关于 Earth2Guide',
          mainEntity: { '@id': ORG_ID },
          inLanguage: isKo ? 'ko-KR' : 'zh-CN',
        }}
      />
      <h1 className="text-3xl lg:text-5xl font-headline font-bold uppercase tracking-tight text-[#dee1f7] mb-10">
        {isKo ? '어스2 가이드 소개' : '关于 Earth2Guide'}
      </h1>

      {isKo ? (
        <>
          <section className={SECTION}>
            <h2 className={H2}>무엇을 하는 사이트인가</h2>
            <p className={P}>
              Earth2Guide(어스2 가이드)는 메타버스 플랫폼 <strong>Earth 2</strong>(earth2.io)의 공식 발표,
              E2V1·Reality Thread 업데이트 소식, 그리고 공식 How-to 문서를 한국어와 중국어로 정리하는
              독립 정보 사이트입니다. 2020년 출시 시점부터 현재까지의 공식 발표 아카이브(150건 이상)와
              위키 가이드를 제공합니다.
            </p>
          </section>
          <section className={SECTION}>
            <h2 className={H2}>운영 방식과 출처</h2>
            <p className={P}>
              모든 뉴스·공지 글은 earth2.io 공식 발표를 원문으로 하며, 각 글 상단에 원문 링크를 표기합니다.
              신규 발표는 주 2회 자동으로 수집·번역됩니다. 번역 시 Essence, Jewel, Tile, Cydroid, Mentar 등
              핵심 용어는 영문을 유지해 공식 표기와의 혼선을 막습니다.
            </p>
            <p className={P}>
              <Link href={`/${locale}/wiki/glossary`} className="text-[#00d4ff] hover:underline">어스2 용어집</Link>에서
              주요 용어 정의를 확인할 수 있습니다.
            </p>
          </section>
          <section className={SECTION}>
            <h2 className={H2}>독립성·수익 고지</h2>
            <p className={P}>
              Earth2Guide는 Earth 2 운영사와 무관한 커뮤니티 프로젝트입니다. Earth 2®는 해당 소유주의
              상표입니다. 본 사이트의 모든 내용은 정보 제공 목적이며 투자 조언이 아닙니다.
            </p>
            <p className={P}>
              사이트 운영비는 Earth 2 리퍼럴(추천인) 프로그램으로 충당될 수 있습니다. 리퍼럴 코드를 사용하면
              신규 Land 구매 시 구매자에게 할인이 적용되며, 사이트에 소정의 보상이 돌아갈 수 있습니다.
            </p>
          </section>
        </>
      ) : (
        <>
          <section className={SECTION}>
            <h2 className={H2}>关于本站</h2>
            <p className={P}>
              Earth2Guide 是一个独立信息网站，将元宇宙平台 <strong>Earth 2</strong>（earth2.io）的官方公告、
              E2V1·Reality Thread 更新资讯以及官方 How-to 文档整理为中文与韩文。我们提供自 2020 年上线以来的
              官方公告档案（150 篇以上）与百科指南。
            </p>
          </section>
          <section className={SECTION}>
            <h2 className={H2}>运作方式与来源</h2>
            <p className={P}>
              所有新闻·公告均以 earth2.io 官方发布为原文，并在每篇文章顶部标注原文链接。新公告每周自动采集·翻译两次。
              翻译时 Essence、Jewel、Tile、Cydroid、Mentar 等核心术语保留英文，以避免与官方表述混淆。
              详见<Link href={`/${locale}/wiki/glossary`} className="text-[#00d4ff] hover:underline"> Earth2 术语表</Link>。
            </p>
          </section>
          <section className={SECTION}>
            <h2 className={H2}>独立性与收益披露</h2>
            <p className={P}>
              Earth2Guide 是与 Earth 2 运营方无关的社区项目。Earth 2® 为其所有者的商标。本站全部内容仅供参考，
              不构成投资建议。网站运营费用可能来自 Earth 2 推荐人计划：使用推荐码购买新土地时，买家可获折扣，
              本站可能获得少量回报。
            </p>
          </section>
        </>
      )}
    </div>
  )
}
