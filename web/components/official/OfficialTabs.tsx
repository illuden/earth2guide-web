'use client'

import { useState } from 'react'
import type { PostLocalized, PostCategory } from '@/lib/supabase/types'
import { PostList } from '@/components/news/PostList'

interface Tab {
  id: PostCategory[]
  label_ko: string
  label_zh: string
  icon: string
}

const TABS: Tab[] = [
  { id: ['announcement'],  label_ko: '공지',     label_zh: '公告', icon: 'campaign' },
  { id: ['official_news'], label_ko: '뉴스',     label_zh: '新闻', icon: 'newspaper' },
  { id: ['update'],        label_ko: '업데이트', label_zh: '更新', icon: 'update' },
  { id: ['promotion'],     label_ko: '홍보',     label_zh: '推广', icon: 'star' },
]

interface OfficialTabsProps {
  postsByCategory: Record<string, PostLocalized[]>
  locale: 'ko' | 'zh'
}

export function OfficialTabs({ postsByCategory, locale }: OfficialTabsProps) {
  const [activeTab, setActiveTab] = useState(0)

  const currentTab = TABS[activeTab]
  const currentPosts = currentTab.id.flatMap(
    (cat) => postsByCategory[cat] ?? []
  ).sort((a, b) =>
    new Date(b.published_at ?? b.created_at).getTime() -
    new Date(a.published_at ?? a.created_at).getTime()
  )

  return (
    <div>
      {/* 탭 바 */}
      <div className="flex gap-1 mb-8 border-b border-[#3c494e]/30 overflow-x-auto">
        {TABS.map((tab, index) => (
          <button
            key={tab.icon}
            onClick={() => setActiveTab(index)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-label uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
              activeTab === index
                ? 'border-[#00d4ff] text-[#00d4ff]'
                : 'border-transparent text-[#859398] hover:text-[#a8e8ff] hover:border-[#3c494e]'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {locale === 'ko' ? tab.label_ko : tab.label_zh}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <PostList posts={currentPosts} locale={locale} />
    </div>
  )
}
