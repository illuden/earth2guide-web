'use client'

import { useState } from 'react'
import type { PostLocalized } from '@/lib/supabase/types'
import { PostList } from './PostList'

interface Props {
  posts: PostLocalized[]
  locale: 'ko' | 'zh'
  pageSize?: number
}

/**
 * 클라이언트 페이지네이션 (static export 호환 — searchParams 미사용).
 * 전체 포스트를 받아 브라우저에서 slice.
 */
export function PostListPaginated({ posts, locale, pageSize = 12 }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(posts.length / pageSize))
  const current = Math.min(page, totalPages)
  const slice = posts.slice((current - 1) * pageSize, current * pageSize)

  const go = (p: number) => {
    setPage(Math.min(Math.max(1, p), totalPages))
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const delta = 2
  const start = Math.max(1, current - delta)
  const end = Math.min(totalPages, current + delta)
  const range: number[] = []
  for (let i = start; i <= end; i++) range.push(i)

  const numBtn = (p: number) =>
    `w-9 h-9 flex items-center justify-center text-sm font-label rounded-sm transition-all ${
      p === current
        ? 'bg-[#00d4ff] text-[#003642] font-bold'
        : 'text-[#bbc9cf] hover:text-[#a8e8ff] hover:bg-[#1a1f2f]'
    }`

  return (
    <div>
      <PostList posts={slice} locale={locale} />

      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-12" aria-label="페이지네이션">
          <button
            onClick={() => go(current - 1)}
            disabled={current <= 1}
            className="flex items-center gap-1 px-4 py-2 text-sm font-label text-[#a8e8ff] border border-[#3c494e] hover:border-[#00d4ff]/50 hover:bg-[#1a1f2f] transition-all rounded-sm disabled:text-[#3c494e] disabled:border-[#3c494e]/30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
            {locale === 'ko' ? '이전' : '上一页'}
          </button>

          <div className="hidden sm:flex items-center gap-1">
            {start > 1 && (
              <>
                <button onClick={() => go(1)} className={numBtn(1)}>1</button>
                {start > 2 && <span className="text-[#3c494e] px-1">…</span>}
              </>
            )}
            {range.map((p) => (
              <button key={p} onClick={() => go(p)} className={numBtn(p)}>
                {p}
              </button>
            ))}
            {end < totalPages && (
              <>
                {end < totalPages - 1 && <span className="text-[#3c494e] px-1">…</span>}
                <button onClick={() => go(totalPages)} className={numBtn(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => go(current + 1)}
            disabled={current >= totalPages}
            className="flex items-center gap-1 px-4 py-2 text-sm font-label text-[#a8e8ff] border border-[#3c494e] hover:border-[#00d4ff]/50 hover:bg-[#1a1f2f] transition-all rounded-sm disabled:text-[#3c494e] disabled:border-[#3c494e]/30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          >
            {locale === 'ko' ? '다음' : '下一页'}
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </nav>
      )}
    </div>
  )
}
