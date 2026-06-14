import type { MetadataRoute } from 'next'
import { getAllPublishedSlugs } from '@/lib/content'
import { getPostSegment } from '@/lib/supabase/types'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://earth2guide.com'
const LOCALES = ['ko', 'zh']

// static export 호환: 빌드타임 1회 생성
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, wikis } = await getAllPublishedSlugs()

  const urls: MetadataRoute.Sitemap = []

  // 정적 페이지
  const staticPaths = ['', '/news', '/official', '/wiki', '/search', '/about']
  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      urls.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`])
          ),
        },
      })
    }
  }

  // 포스트 페이지
  for (const post of posts) {
    const segment = getPostSegment(post.category)
    for (const locale of LOCALES) {
      urls.push({
        url: `${BASE_URL}/${locale}/${segment}/${post.slug}`,
        lastModified: post.published_at ? new Date(post.published_at) : new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}/${segment}/${post.slug}`])
          ),
        },
      })
    }
  }

  // 위키 페이지
  for (const wiki of wikis) {
    for (const locale of LOCALES) {
      urls.push({
        url: `${BASE_URL}/${locale}/wiki/${wiki.slug}`,
        lastModified: new Date(wiki.updated_at),
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}/wiki/${wiki.slug}`])
          ),
        },
      })
    }
  }

  return urls
}
