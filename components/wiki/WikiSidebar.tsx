import Link from 'next/link'
import type { WikiPageLocalized, WikiCategory } from '@/lib/supabase/types'
import { WIKI_CATEGORY_META } from '@/lib/supabase/types'

interface WikiSidebarProps {
  pages: WikiPageLocalized[]
  currentSlug?: string
  locale: string
}

// 카테고리별로 그룹화
function groupByCategory(pages: WikiPageLocalized[]): Record<WikiCategory, WikiPageLocalized[]> {
  const groups: Record<string, WikiPageLocalized[]> = {}
  for (const page of pages) {
    if (!groups[page.category]) groups[page.category] = []
    groups[page.category].push(page)
  }
  return groups as Record<WikiCategory, WikiPageLocalized[]>
}

export function WikiSidebar({ pages, currentSlug, locale }: WikiSidebarProps) {
  const groups = groupByCategory(pages)
  const categories = Object.keys(WIKI_CATEGORY_META) as WikiCategory[]

  return (
    <aside className="w-60 flex-shrink-0">
      <div className="sticky top-24 space-y-6">
        {categories.map((cat) => {
          const catPages = groups[cat]
          if (!catPages || catPages.length === 0) return null
          const meta = WIKI_CATEGORY_META[cat]

          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3 px-2">
                <span className="material-symbols-outlined text-base text-[#00d4ff]">
                  {meta.icon}
                </span>
                <span className="text-xs font-label uppercase tracking-widest text-[#859398]">
                  {locale === 'ko' ? meta.label_ko : meta.label_zh}
                </span>
              </div>

              <div className="space-y-1">
                {catPages.map((page) => (
                  <Link
                    key={page.slug}
                    href={`/${locale}/wiki/${page.slug}`}
                    className={`block px-3 py-2 text-sm rounded-sm transition-all ${
                      page.slug === currentSlug
                        ? 'bg-[#00d4ff]/10 text-[#00d4ff] border-l-2 border-[#00d4ff] font-medium'
                        : 'text-[#bbc9cf] hover:text-[#a8e8ff] hover:bg-[#1a1f2f]'
                    }`}
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
