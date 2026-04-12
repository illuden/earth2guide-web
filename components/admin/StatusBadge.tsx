import type { PostStatus } from '@/lib/supabase/types'

const STATUS_CONFIG: Record<PostStatus, { label: string; className: string }> = {
  draft:     { label: '초안',   className: 'bg-[#2f3445] text-[#bbc9cf] border-[#3c494e]' },
  published: { label: '발행됨', className: 'bg-green-900/30 text-green-300 border-green-700/40' },
  archived:  { label: '보관됨', className: 'bg-[#1a1f2f] text-[#859398] border-[#3c494e]/50' },
}

export function StatusBadge({ status }: { status: PostStatus }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-label uppercase tracking-wider border rounded-sm ${config.className}`}>
      {config.label}
    </span>
  )
}
