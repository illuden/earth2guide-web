'use client'

import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'

export function LocaleToggle() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(next: 'ko' | 'zh') {
    if (next === locale) return
    // pathname에서 현재 locale prefix 교체
    const newPath = pathname.replace(`/${locale}`, `/${next}`)
    startTransition(() => {
      router.push(newPath)
    })
  }

  return (
    <div className="flex items-center gap-1 bg-[#161b2b] border border-[#3c494e] rounded-sm p-1">
      <button
        onClick={() => switchLocale('ko')}
        disabled={isPending}
        className={`px-3 py-1 text-xs font-headline uppercase tracking-wider transition-all rounded-sm ${
          locale === 'ko'
            ? 'bg-[#00d4ff] text-[#003642] font-bold'
            : 'text-[#a8e8ff]/60 hover:text-[#a8e8ff]'
        }`}
      >
        KO
      </button>
      <button
        onClick={() => switchLocale('zh')}
        disabled={isPending}
        className={`px-3 py-1 text-xs font-headline uppercase tracking-wider transition-all rounded-sm ${
          locale === 'zh'
            ? 'bg-[#00d4ff] text-[#003642] font-bold'
            : 'text-[#a8e8ff]/60 hover:text-[#a8e8ff]'
        }`}
      >
        ZH
      </button>
    </div>
  )
}
