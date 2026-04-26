'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { WikiPageLocalized, WikiCategory } from '@/lib/supabase/types'
import { WIKI_CATEGORY_META } from '@/lib/supabase/types'

interface WikiCategoryDropdownProps {
  pages: WikiPageLocalized[]
  currentSlug?: string
  locale: string
}

export function WikiCategoryDropdown({ pages, currentSlug, locale }: WikiCategoryDropdownProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const current = pages.find((p) => p.slug === currentSlug)

  return (
    <div className="relative mb-6 md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#161b2b] border border-[#3c494e] rounded-sm text-sm text-[#dee1f7] font-label"
      >
        <span>{current?.title ?? '문서 선택...'}</span>
        <span className="material-symbols-outlined text-base text-[#859398]">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-[#1a1f2f] border border-[#3c494e] rounded-sm shadow-xl max-h-64 overflow-y-auto">
          {pages.map((page) => {
            const meta = WIKI_CATEGORY_META[page.category as WikiCategory]
            return (
              <button
                key={page.slug}
                onClick={() => {
                  router.push(`/${locale}/wiki/${page.slug}`)
                  setOpen(false)
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                  page.slug === currentSlug
                    ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                    : 'text-[#bbc9cf] hover:bg-[#25293a] hover:text-[#a8e8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-sm text-[#00d4ff]">
                  {meta?.icon ?? 'article'}
                </span>
                {page.title}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
