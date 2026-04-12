'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Post } from '@/lib/supabase/types'
import { CATEGORY_META } from '@/lib/supabase/types'
import { StatusBadge } from './StatusBadge'

interface AdminPostTableProps {
  posts: Post[]
  onDelete: (id: string) => void
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: '2-digit', month: '2-digit', day: '2-digit',
  })
}

export function AdminPostTable({ posts, onDelete }: AdminPostTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm('포스트를 삭제하시겠습니까?')) return
    setDeleting(id)
    await onDelete(id)
    setDeleting(null)
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-[#859398] text-sm">
        등록된 포스트가 없습니다.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* PC 테이블 */}
      <table className="hidden md:table w-full text-sm">
        <thead>
          <tr className="border-b border-[#3c494e]/30 text-xs font-label text-[#859398] uppercase tracking-wider">
            <th className="text-left px-4 py-3">제목</th>
            <th className="text-left px-4 py-3">카테고리</th>
            <th className="text-left px-4 py-3">상태</th>
            <th className="text-left px-4 py-3">날짜</th>
            <th className="text-right px-4 py-3">작업</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#3c494e]/20">
          {posts.map((post) => {
            const catMeta = CATEGORY_META[post.category]
            return (
              <tr key={post.id} className="hover:bg-[#1a1f2f] transition-colors">
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-[#dee1f7] truncate font-medium">
                    {post.title_ko ?? post.title_zh ?? post.slug}
                  </p>
                  <p className="text-xs text-[#859398] mt-0.5 truncate">{post.slug}</p>
                </td>
                <td className="px-4 py-3 text-xs text-[#bbc9cf]">
                  {catMeta?.label_ko ?? post.category}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="px-4 py-3 text-xs text-[#859398]">
                  {formatDate(post.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="px-3 py-1.5 text-xs font-label border border-[#3c494e] text-[#bbc9cf] hover:border-[#00d4ff]/50 hover:text-[#a8e8ff] transition-all rounded-sm"
                    >
                      편집
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={deleting === post.id}
                      className="px-3 py-1.5 text-xs font-label border border-red-800/50 text-red-400 hover:bg-red-900/20 transition-all rounded-sm disabled:opacity-50"
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* 모바일 카드 */}
      <div className="md:hidden space-y-3">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#1a1f2f] border border-[#3c494e]/30 rounded-sm p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#dee1f7] truncate">
                  {post.title_ko ?? post.slug}
                </p>
                <p className="text-xs text-[#859398] mt-0.5">{formatDate(post.created_at)}</p>
              </div>
              <StatusBadge status={post.status} />
            </div>
            <div className="flex gap-2 mt-3">
              <Link
                href={`/admin/posts/${post.id}/edit`}
                className="flex-1 text-center py-2 text-xs font-label border border-[#3c494e] text-[#bbc9cf] hover:border-[#00d4ff]/50 transition-all rounded-sm"
              >
                편집
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="flex-1 py-2 text-xs font-label border border-red-800/50 text-red-400 hover:bg-red-900/20 transition-all rounded-sm"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
