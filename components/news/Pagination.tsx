'use client'

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string  // e.g. '/ko/news'
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const getHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`

  // 표시할 페이지 번호 범위
  const range = []
  const delta = 2
  const start = Math.max(1, currentPage - delta)
  const end = Math.min(totalPages, currentPage + delta)
  for (let i = start; i <= end; i++) range.push(i)

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="페이지네이션">
      {/* 이전 */}
      {currentPage > 1 ? (
        <Link
          href={getHref(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-label text-[#a8e8ff] border border-[#3c494e] hover:border-[#00d4ff]/50 hover:bg-[#1a1f2f] transition-all rounded-sm"
        >
          <span className="material-symbols-outlined text-base">chevron_left</span>
          이전
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-label text-[#3c494e] border border-[#3c494e]/30 rounded-sm cursor-not-allowed">
          <span className="material-symbols-outlined text-base">chevron_left</span>
          이전
        </span>
      )}

      {/* 페이지 번호 (PC에서만) */}
      <div className="hidden sm:flex items-center gap-1">
        {start > 1 && (
          <>
            <Link href={getHref(1)} className="w-9 h-9 flex items-center justify-center text-sm font-label text-[#bbc9cf] hover:text-[#a8e8ff] hover:bg-[#1a1f2f] rounded-sm transition-all">1</Link>
            {start > 2 && <span className="text-[#3c494e] px-1">…</span>}
          </>
        )}
        {range.map((page) => (
          <Link
            key={page}
            href={getHref(page)}
            className={`w-9 h-9 flex items-center justify-center text-sm font-label rounded-sm transition-all ${
              page === currentPage
                ? 'bg-[#00d4ff] text-[#003642] font-bold'
                : 'text-[#bbc9cf] hover:text-[#a8e8ff] hover:bg-[#1a1f2f]'
            }`}
          >
            {page}
          </Link>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-[#3c494e] px-1">…</span>}
            <Link href={getHref(totalPages)} className="w-9 h-9 flex items-center justify-center text-sm font-label text-[#bbc9cf] hover:text-[#a8e8ff] hover:bg-[#1a1f2f] rounded-sm transition-all">{totalPages}</Link>
          </>
        )}
      </div>

      {/* 다음 */}
      {currentPage < totalPages ? (
        <Link
          href={getHref(currentPage + 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-label text-[#a8e8ff] border border-[#3c494e] hover:border-[#00d4ff]/50 hover:bg-[#1a1f2f] transition-all rounded-sm"
        >
          다음
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-label text-[#3c494e] border border-[#3c494e]/30 rounded-sm cursor-not-allowed">
          다음
          <span className="material-symbols-outlined text-base">chevron_right</span>
        </span>
      )}
    </nav>
  )
}
