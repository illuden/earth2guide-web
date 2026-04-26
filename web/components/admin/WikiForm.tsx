'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { WikiPage, WikiFormData, WikiCategory, PostStatus } from '@/lib/supabase/types'
import { WIKI_CATEGORY_META } from '@/lib/supabase/types'

interface WikiFormProps {
  initialData?: WikiPage
  onSubmit: (data: WikiFormData) => Promise<void>
}

const CATEGORIES = Object.keys(WIKI_CATEGORY_META) as WikiCategory[]

export function WikiForm({ initialData, onSubmit }: WikiFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'ko' | 'zh'>('ko')

  const [form, setForm] = useState<WikiFormData>({
    slug: initialData?.slug ?? '',
    category: initialData?.category ?? 'overview',
    title_ko: initialData?.title_ko ?? '',
    title_zh: initialData?.title_zh ?? '',
    body_ko: initialData?.body_ko ?? '',
    body_zh: initialData?.body_zh ?? '',
    status: initialData?.status ?? 'draft',
    sort_order: initialData?.sort_order ?? 0,
  })

  function update(field: keyof WikiFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.slug || !form.title_ko) {
      setError('슬러그와 한국어 제목은 필수입니다.')
      return
    }

    startTransition(async () => {
      try {
        await onSubmit(form)
      } catch (err) {
        setError(err instanceof Error ? err.message : '저장 실패')
      }
    })
  }

  const inputClass = "w-full bg-[#0e1322] border border-[#3c494e] focus:border-[#00d4ff] focus:outline-none px-3 py-2.5 text-sm text-[#dee1f7] rounded-sm transition-colors"
  const labelClass = "block text-xs font-label uppercase tracking-wider text-[#859398] mb-1.5"

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-900/20 border border-red-700/30 rounded-sm text-sm text-red-300">
          <span className="material-symbols-outlined text-base">error</span>
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>슬러그 *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            className={inputClass}
            placeholder="wiki-page-slug"
            required
          />
        </div>
        <div>
          <label className={labelClass}>카테고리</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {WIKI_CATEGORY_META[cat].label_ko}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>상태</label>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value as PostStatus)}
            className={inputClass}
          >
            <option value="draft">초안</option>
            <option value="published">발행됨</option>
            <option value="archived">보관됨</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>정렬 순서</label>
          <input
            type="number"
            value={form.sort_order}
            onChange={(e) => update('sort_order', parseInt(e.target.value, 10))}
            className={inputClass}
            min={0}
          />
        </div>
      </div>

      {/* 언어 탭 */}
      <div>
        <div className="flex gap-1 border-b border-[#3c494e]/30 mb-4">
          {(['ko', 'zh'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveTab(lang)}
              className={`px-5 py-2.5 text-sm font-label uppercase tracking-wider border-b-2 transition-all ${
                activeTab === lang
                  ? 'border-[#00d4ff] text-[#00d4ff]'
                  : 'border-transparent text-[#859398] hover:text-[#a8e8ff]'
              }`}
            >
              {lang === 'ko' ? '한국어' : '중국어'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelClass}>제목 {activeTab === 'ko' ? '*' : ''}</label>
            <input
              type="text"
              value={activeTab === 'ko' ? form.title_ko : form.title_zh}
              onChange={(e) => update(activeTab === 'ko' ? 'title_ko' : 'title_zh', e.target.value)}
              className={inputClass}
              placeholder={`${activeTab === 'ko' ? '한국어' : '중국어'} 제목`}
            />
          </div>
          <div>
            <label className={labelClass}>본문 (HTML)</label>
            <textarea
              value={activeTab === 'ko' ? form.body_ko : form.body_zh}
              onChange={(e) => update(activeTab === 'ko' ? 'body_ko' : 'body_zh', e.target.value)}
              rows={20}
              className={`${inputClass} resize-y font-mono text-xs`}
              placeholder="<h2>섹션 제목</h2><p>내용...</p>"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-[#3c494e]/30">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 text-sm font-label border border-[#3c494e] text-[#bbc9cf] hover:border-[#00d4ff]/50 transition-all rounded-sm"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-headline font-bold uppercase tracking-wider bg-[#00d4ff] text-[#003642] hover:bg-[#a8e8ff] transition-colors rounded-sm disabled:opacity-50"
        >
          {isPending ? '저장 중...' : '저장'}
        </button>
      </div>
    </form>
  )
}
