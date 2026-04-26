import Link from 'next/link'
import type { PostLocalized, PostCategory } from '@/lib/supabase/types'
import { CategoryBadge } from '@/components/news/CategoryBadge'

interface SearchResultCardProps {
  post: PostLocalized
  locale: 'ko' | 'zh'
  query: string
}

function highlight(text: string, query: string): string {
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return text.replace(
    new RegExp(`(${escaped})`, 'gi'),
    '<mark class="bg-[#00d4ff]/20 text-[#00d4ff] rounded-sm px-0.5">$1</mark>'
  )
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  })
}

export function SearchResultCard({ post, locale, query }: SearchResultCardProps) {
  const isOfficial = ['announcement', 'official_news', 'update', 'promotion'].includes(post.category)
  const href = `/${locale}/${isOfficial ? 'official' : 'news'}/${post.slug}`

  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 px-5 py-4 bg-[#1a1f2f] border border-[#3c494e]/30 hover:border-[#00d4ff]/40 transition-all rounded-sm"
    >
      <div className="flex items-center gap-3">
        <CategoryBadge category={post.category as PostCategory} locale={locale} size="sm" />
        <span className="text-xs text-[#859398] font-label ml-auto">
          {formatDate(post.published_at)}
        </span>
      </div>

      <h3
        className="font-headline font-bold text-[#dee1f7] group-hover:text-[#a8e8ff] transition-colors leading-snug"
        dangerouslySetInnerHTML={{ __html: highlight(post.title, query) }}
      />

      {post.summary && (
        <p
          className="text-sm text-[#bbc9cf] leading-relaxed line-clamp-2"
          dangerouslySetInnerHTML={{ __html: highlight(post.summary, query) }}
        />
      )}

      <div className="flex justify-end">
        <span className="text-xs text-[#00d4ff]/60 group-hover:text-[#00d4ff] font-label uppercase tracking-wider flex items-center gap-1 transition-colors">
          읽기
          <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
        </span>
      </div>
    </Link>
  )
}
