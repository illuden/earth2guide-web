'use client'

import { useState, useRef, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  locale: string
  defaultValue?: string
  size?: 'sm' | 'lg'
  placeholder?: string
}

export function SearchBar({ locale, defaultValue = '', size = 'lg', placeholder }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`)
  }

  const isLarge = size === 'lg'

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <span
        className={`material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#859398] ${
          isLarge ? 'text-xl' : 'text-base'
        }`}
      >
        search
      </span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ?? '검색어를 입력하세요...'}
        className={`w-full bg-[#161b2b] border border-[#3c494e] focus:border-[#00d4ff] focus:ring-0 focus:outline-none text-[#dee1f7] placeholder-[#859398] rounded-sm transition-colors font-body ${
          isLarge
            ? 'pl-12 pr-12 py-4 text-base'
            : 'pl-10 pr-10 py-2.5 text-sm'
        }`}
      />
      {query && (
        <button
          type="button"
          onClick={() => { setQuery(''); inputRef.current?.focus() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-[#859398] hover:text-[#a8e8ff] transition-colors"
        >
          <span className="material-symbols-outlined text-base">close</span>
        </button>
      )}
    </form>
  )
}
