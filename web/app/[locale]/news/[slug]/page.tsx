import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { Locale } from '@/lib/supabase/types'
import { getPostBySlug, getAllPostSlugs } from '@/lib/supabase/queries'
import { routing } from '@/i18n/routing'
import { CategoryBadge } from '@/components/news/CategoryBadge'
import { PostBody } from '@/components/post/PostBody'
import { OriginalTextBlock } from '@/components/post/OriginalTextBlock'
import { SourceLink } from '@/components/post/SourceLink'
import { Earth2ReferralBanner } from '@/components/referral/Earth2ReferralBanner'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  // [locale] × [slug] 카르테시안 — Next.js 16은 모든 dynamic segment 명시 요구
  return routing.locales.flatMap((locale) =>
    slugs.map((slug) => ({ locale, slug }))
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPostBySlug(slug, locale as Locale)
  if (!post) return {}
  return {
    title: post.title,
    description: post.summary ?? undefined,
    openGraph: {
      title: post.title,
      description: post.summary ?? undefined,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  }
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const l = locale as Locale
  const post = await getPostBySlug(slug, l)

  if (!post) notFound()

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* 메타 */}
      <div className="flex items-center gap-3 mb-4">
        <CategoryBadge category={post.category} locale={l} />
        <span className="text-xs text-[#859398] font-label">
          {formatDate(post.published_at)}
        </span>
      </div>

      {/* 제목 */}
      <h1 className="text-2xl lg:text-4xl font-headline font-bold text-[#dee1f7] leading-tight mb-4">
        {post.title}
      </h1>

      {/* 출처 링크 */}
      {post.source_url && (
        <div className="mb-6">
          <SourceLink url={post.source_url} />
        </div>
      )}

      {/* 커버 이미지 */}
      {post.cover_image_url && (
        <div className="relative aspect-video w-full overflow-hidden mb-8 rounded-sm border border-[#3c494e]/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* 본문 */}
      {post.body ? (
        <PostBody markdown={post.body} />
      ) : post.summary ? (
        <p className="text-[#bbc9cf] leading-relaxed">{post.summary}</p>
      ) : null}

      {/* 원문 */}
      {post.body_original && (
        <OriginalTextBlock text={post.body_original} sourceUrl={post.source_url} />
      )}

      {/* 리퍼럴 배너 */}
      <div className="mt-12">
        <Earth2ReferralBanner />
      </div>
    </div>
  )
}
