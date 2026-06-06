// JSON-LD 구조화 데이터 — AIO/AI 검색이 엔티티·신뢰도를 파악하는 1차 신호
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://earth2guide.com'

export const ORG_ID = `${BASE_URL}/#organization`
export const WEBSITE_ID = `${BASE_URL}/#website`

/** 사이트 전역 Organization + WebSite 그래프 (locale layout에서 1회 주입) */
export function siteGraph(locale: string) {
  const isKo = locale === 'ko'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': ORG_ID,
        name: 'Earth2Guide',
        alternateName: isKo ? ['어스2 가이드', 'Earth 2 Guide'] : ['Earth 2 Guide', '어스2 가이드'],
        url: BASE_URL,
        description: isKo
          ? '어스2(Earth 2) 메타버스 한국어·중국어 정보 허브 — 공식 공지 번역, 업데이트 뉴스, 위키 가이드'
          : 'Earth 2 元宇宙中文及韩文信息中心 — 官方公告翻译、更新资讯与百科指南',
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: 'Earth2Guide',
        alternateName: isKo ? '어스2 가이드' : 'Earth2 指南',
        url: `${BASE_URL}/${locale}`,
        inLanguage: isKo ? 'ko-KR' : 'zh-CN',
        publisher: { '@id': ORG_ID },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/${locale}/search?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }
}

/** 뉴스/공지 글 NewsArticle */
export function articleLd(opts: {
  locale: string
  url: string
  title: string
  description?: string | null
  image?: string | null
  datePublished?: string | null
  dateModified?: string | null
  sourceUrl?: string | null
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.title,
    description: opts.description ?? undefined,
    image: opts.image ? [opts.image] : undefined,
    datePublished: opts.datePublished ?? undefined,
    dateModified: opts.dateModified ?? opts.datePublished ?? undefined,
    inLanguage: opts.locale === 'ko' ? 'ko-KR' : 'zh-CN',
    mainEntityOfPage: opts.url,
    isBasedOn: opts.sourceUrl ?? undefined,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
  }
}

/** 위키 TechArticle + 브레드크럼 */
export function wikiLd(opts: {
  locale: string
  url: string
  title: string
  description?: string
  dateModified?: string | null
  categoryLabel: string
  categorySlug: string
}) {
  const isKo = opts.locale === 'ko'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: opts.title,
        description: opts.description ?? undefined,
        dateModified: opts.dateModified ?? undefined,
        inLanguage: isKo ? 'ko-KR' : 'zh-CN',
        mainEntityOfPage: opts.url,
        author: { '@id': ORG_ID },
        publisher: { '@id': ORG_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isKo ? '어스2 위키' : 'Earth2 百科',
            item: `${BASE_URL}/${opts.locale}/wiki`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: opts.categoryLabel,
            item: `${BASE_URL}/${opts.locale}/wiki?category=${opts.categorySlug}`,
          },
          { '@type': 'ListItem', position: 3, name: opts.title, item: opts.url },
        ],
      },
    ],
  }
}

/** 마크다운 본문 → 메타 description 발췌 */
export function mdExcerpt(md: string, max = 155): string {
  const text = md
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')   // 이미지 제거
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크 → 텍스트
    .replace(/^#{1,6}\s.*$/gm, ' ')           // 헤더 라인 제거
    .replace(/[*_`>|#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text
}


/** 마크다운에서 FAQ 섹션 추출 — '## 자주 묻는 질문' / '## 常见问题' 아래 '### 질문' + 본문 */
export function faqFromMarkdown(md: string): { q: string; a: string }[] {
  const m = md.match(/^##\s*(자주 묻는 질문|常见问题)\s*$/m)
  if (!m || m.index === undefined) return []
  const section = md.slice(m.index)
  const lines = section.split('\n').slice(1)
  const out: { q: string; a: string }[] = []
  let q: string | null = null
  let buf: string[] = []
  const flush = () => {
    if (q && buf.join(' ').trim()) out.push({ q, a: buf.join(' ').replace(/\s+/g, ' ').trim() })
    buf = []
  }
  for (const line of lines) {
    if (/^##[^#]/.test(line)) break // 다음 H2에서 종료
    const qm = line.match(/^###\s+(.+)$/)
    if (qm) { flush(); q = qm[1].replace(/^Q[.:]?\s*/i, '').trim() }
    else if (q) buf.push(line)
  }
  flush()
  return out
}

/** FAQPage JSON-LD */
export function faqLd(items: { q: string; a: string }[], locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    inLanguage: locale === 'ko' ? 'ko-KR' : 'zh-CN',
    mainEntity: items.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  }
}
