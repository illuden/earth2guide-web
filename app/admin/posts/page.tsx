import Link from 'next/link'
import type { Metadata } from 'next'
import { adminGetAllPosts } from '@/lib/supabase/queries'
import { AdminPostTable } from '@/components/admin/AdminPostTable'
import { deletePostAction } from '@/lib/actions/posts'

export const metadata: Metadata = { title: '포스트 관리' }
export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ page?: string; status?: string; category?: string }>
}

export default async function AdminPostsPage({ searchParams }: PageProps) {
  const { page: pageParam, status, category } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))

  const result = await adminGetAllPosts(page, 20, { status, category })

  return (
    <div className="p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-headline font-bold text-[#dee1f7]">포스트 관리</h1>
          <p className="text-xs text-[#859398] mt-0.5">총 {result.total}개</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-[#003642] font-headline font-bold text-sm uppercase tracking-wider hover:bg-[#a8e8ff] transition-colors rounded-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          새 포스트
        </Link>
      </div>

      {/* 필터 */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { href: '/admin/posts', label: '전체' },
          { href: '/admin/posts?status=draft', label: '초안' },
          { href: '/admin/posts?status=published', label: '발행됨' },
          { href: '/admin/posts?status=archived', label: '보관됨' },
        ].map(({ href, label }) => (
          <Link
            key={label}
            href={href}
            className="px-3 py-1.5 text-xs font-label border border-[#3c494e] text-[#bbc9cf] hover:border-[#00d4ff]/50 hover:text-[#a8e8ff] transition-all rounded-sm"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* 테이블 */}
      <div className="bg-[#1a1f2f] border border-[#3c494e]/30 rounded-sm overflow-hidden">
        <AdminPostTable
          posts={result.data}
          onDelete={deletePostAction}
        />
      </div>

      {/* 페이지네이션 */}
      {result.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: result.totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/admin/posts?page=${p}${status ? `&status=${status}` : ''}`}
              className={`w-8 h-8 flex items-center justify-center text-xs rounded-sm border transition-all ${
                p === page
                  ? 'bg-[#00d4ff] text-[#003642] border-[#00d4ff] font-bold'
                  : 'border-[#3c494e] text-[#bbc9cf] hover:border-[#00d4ff]/50'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
