'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Post, PostFormData, PostCategory, PostStatus } from '@/lib/supabase/types'
import { CATEGORY_META } from '@/lib/supabase/types'

interface PostFormProps {
  initialData?: Post
  onSubmit: (data: PostFormData) => Promise<void>
}

const CATEGORIES = Object.entries(CATEGORY_META) as [PostCategory, typeof CATEGORY_META[PostCategory]][]

export function PostForm({ initialData, onSubmit }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'ko' | 'zh'>('ko')

  const [form, setForm] = useState<PostFormData>({
    slug: initialData?.slug ?? '',
    category: initialData?.category ?? 'news',
    title_ko: initialData?.title_ko ?? '',
    title_zh: initialData?.title_zh ?? '',
    body_ko: initialData?.body_ko ?? '',
    body_zh: initialData?.body_zh ?? '',
    body_original: initialData?.body_original ?? '',
    summary_ko: initialData?.summary_ko ?? '',
    summary_zh: initialData?.summary_zh ?? '',
    source_url: initialData?.source_url ?? '',
    cover_image_url: initialData?.cover_image_url ?? '',
    status: initialData?.status ?? 'draft',
    published_at: initialData?.published_at ?? new Date().toISOString().slice(0, 16),
  })

  function update(field: keyof PostFormData, value: string) {
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

      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>슬러그 *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            className={inputClass}
            placeholder="my-post-slug"
            required
          />
        </div>
        <div>
          <label className={labelClass}>카테고리 *</label>
          <select
            value={form.category}
            onChange={(e) => update('category', e.target.value)}
            className={inputClass}
          >
            {CATEGORIES.map(([key, meta]) => (
              <option key={key} value={key}>{meta.label_ko}</option>
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
          <label className={labelClass}>발행일</label>
          <input
            type="datetime-local"
            value={form.published_at?.slice(0, 16) ?? ''}
            onChange={(e) => update('published_at', e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>커버 이미지 URL</label>
          <input
            type="url"
            value={form.cover_image_url ?? ''}
            onChange={(e) => update('cover_image_url', e.target.value)}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>출처 URL</label>
          <input
            type="url"
            value={form.source_url ?? ''}
            onChange={(e) => update('source_url', e.target.value)}
            className={inputClass}
            placeholder="https://earth2.io/..."
          />
        </div>
      </div>

      {/* 언어별 콘텐츠 탭 */}
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
            <label className={labelClass}>요약</label>
            <textarea
              value={activeTab === 'ko' ? (form.summary_ko ?? '') : (form.summary_zh ?? '')}
              onChange={(e) => update(activeTab === 'ko' ? 'summary_ko' : 'summary_zh', e.target.value)}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="2-3줄 요약"
            />
          </div>
          <div>
            <label className={labelClass}>본문 (HTML)</label>
            <textarea
              value={activeTab === 'ko' ? form.body_ko : form.body_zh}
              onChange={(e) => update(activeTab === 'ko' ? 'body_ko' : 'body_zh', e.target.value)}
              rows={16}
              className={`${inputClass} resize-y font-mono text-xs`}
              placeholder="<p>본문 내용...</p>"
            />
          </div>
        </div>
      </div>

      {/* 원문 */}
      <div>
        <label className={labelClass}>원문 (영어)</label>
        <textarea
          value={form.body_original ?? ''}
          onChange={(e) => update('body_original', e.target.value)}
          rows={8}
          className={`${inputClass} resize-y font-mono text-xs`}
          placeholder="Original English text..."
        />
      </div>

      {/* 버튼 */}
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
