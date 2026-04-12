import Link from 'next/link'
import Image from 'next/image'
import type { PostLocalized, PostCategory } from '@/lib/supabase/types'
import { CategoryBadge } from './CategoryBadge'

interface PostCardProps {
  post: PostLocalized
  locale: 'ko' | 'zh'
  basePath?: string  // '/ko/news' | '/ko/official'
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

export function PostCard({ post, locale, basePath }: PostCardProps) {
  const href = basePath
    ? `${basePath}/${post.slug}`
    : `/${locale}/news/${post.slug}`

  return (
    <Link
      href={href}
      className="group flex flex-col bg-[#1a1f2f] border border-[#3c494e]/30 hover:border-[#00d4ff]/40 transition-all duration-300 overflow-hidden"
    >
      {/* 썸네일 */}
      <div className="relative aspect-video w-full bg-[#161b2b] overflow-hidden">
        {post.cover_image_url ? (
          <Image
            src={post.cover_image_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#161b2b] to-[#0e1322]">
            <span className="material-symbols-outlined text-4xl text-[#3c494e]">article</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e1322]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <div className="flex items-center justify-between gap-2">
          <CategoryBadge category={post.category as PostCategory} locale={locale} size="sm" />
          <span className="text-xs text-[#859398] font-label">
            {formatDate(post.published_at)}
          </span>
        </div>

        <h3 className="font-headline font-bold text-sm lg:text-base text-[#dee1f7] line-clamp-2 group-hover:text-[#a8e8ff] transition-colors">
          {post.title}
        </h3>

        {post.summary && (
          <p className="text-xs text-[#bbc9cf] line-clamp-2 leading-relaxed">
            {post.summary}
          </p>
        )}

        <div className="mt-auto pt-2 flex justify-end">
          <span className="text-xs text-[#00d4ff]/70 group-hover:text-[#00d4ff] font-label uppercase tracking-wider flex items-center gap-1 transition-colors">
            읽기
            <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
