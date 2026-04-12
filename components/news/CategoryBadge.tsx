import type { PostCategory } from '@/lib/supabase/types'
import { CATEGORY_META } from '@/lib/supabase/types'

const colorMap: Record<string, string> = {
  blue:   'bg-blue-900/40 text-blue-300 border-blue-700/40',
  red:    'bg-red-900/40 text-red-300 border-red-700/40',
  purple: 'bg-purple-900/40 text-purple-300 border-purple-700/40',
  green:  'bg-green-900/40 text-green-300 border-green-700/40',
  yellow: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/40',
  gray:   'bg-[#2f3445] text-[#bbc9cf] border-[#3c494e]',
}

interface CategoryBadgeProps {
  category: PostCategory
  locale?: 'ko' | 'zh'
  size?: 'sm' | 'md'
}

export function CategoryBadge({ category, locale = 'ko', size = 'md' }: CategoryBadgeProps) {
  const meta = CATEGORY_META[category]
  if (!meta) return null

  const label = locale === 'ko' ? meta.label_ko : meta.label_zh
  const colorClass = colorMap[meta.color] ?? colorMap.gray
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1'

  return (
    <span
      className={`inline-flex items-center border rounded-sm font-label font-medium uppercase tracking-wider ${colorClass} ${sizeClass}`}
    >
      {label}
    </span>
  )
}
