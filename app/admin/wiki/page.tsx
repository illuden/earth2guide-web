import Link from 'next/link'
import type { Metadata } from 'next'
import { adminGetAllWikiPages } from '@/lib/supabase/queries'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { WIKI_CATEGORY_META } from '@/lib/supabase/types'
import type { WikiCategory } from '@/lib/supabase/types'
import { deleteWikiAction } from '@/lib/actions/wiki'

export const metadata: Metadata = { title: '위키 관리' }
export const dynamic = 'force-dynamic'

export default async function AdminWikiPage() {
  const result = await adminGetAllWikiPages(1, 100)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-headline font-bold text-[#dee1f7]">위키 관리</h1>
          <p className="text-xs text-[#859398] mt-0.5">총 {result.total}개</p>
        </div>
        <Link
          href="/admin/wiki/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#00d4ff] text-[#003642] font-headline font-bold text-sm uppercase tracking-wider hover:bg-[#a8e8ff] transition-colors rounded-sm"
        >
          <span className="material-symbols-outlined text-base">add</span>
          새 문서
        </Link>
      </div>

      <div className="bg-[#1a1f2f] border border-[#3c494e]/30 rounded-sm overflow-hidden">
        {result.data.length === 0 ? (
          <div className="text-center py-16 text-[#859398] text-sm">
            등록된 위키 문서가 없습니다.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#3c494e]/30 text-xs font-label text-[#859398] uppercase tracking-wider">
                <th className="text-left px-4 py-3">제목</th>
                <th className="text-left px-4 py-3">카테고리</th>
                <th className="text-left px-4 py-3">상태</th>
                <th className="text-left px-4 py-3">순서</th>
                <th className="text-right px-4 py-3">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3c494e]/20">
              {result.data.map((page) => {
                const catMeta = WIKI_CATEGORY_META[page.category as WikiCategory]
                return (
                  <tr key={page.id} className="hover:bg-[#161b2b] transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <p className="text-[#dee1f7] truncate font-medium">
                        {page.title_ko ?? page.slug}
                      </p>
                      <p className="text-xs text-[#859398] mt-0.5 truncate font-mono">{page.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs text-[#bbc9cf]">
                        <span className="material-symbols-outlined text-sm text-[#00d4ff]">
                          {catMeta?.icon ?? 'article'}
                        </span>
                        {catMeta?.label_ko ?? page.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={page.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-[#859398]">
                      {page.sort_order}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/wiki/${page.id}/edit`}
                          className="px-3 py-1.5 text-xs font-label border border-[#3c494e] text-[#bbc9cf] hover:border-[#00d4ff]/50 hover:text-[#a8e8ff] transition-all rounded-sm"
                        >
                          편집
                        </Link>
                        <form action={async () => {
                          'use server'
                          await deleteWikiAction(page.id)
                        }}>
                          <button
                            type="submit"
                            className="px-3 py-1.5 text-xs font-label border border-red-800/50 text-red-400 hover:bg-red-900/20 transition-all rounded-sm"
                          >
                            삭제
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
