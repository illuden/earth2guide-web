'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { REFERRAL_CODE } from '@/lib/referral'

// 내부 페이지 상단 얇은 리퍼럴 띠. 홈(/ko, /zh)에는 큰 배너가 있으므로 숨김.
export function ReferralBar() {
  const t = useTranslations('referral')
  const pathname = usePathname()
  const [copied, setCopied] = useState(false)

  // 세그먼트가 로케일 하나뿐이면(=홈) 숨김. 예: /ko, /zh
  const segments = (pathname || '').split('/').filter(Boolean)
  if (segments.length <= 1) return null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* 무시 — 코드는 화면에 노출됨 */
    }
  }

  return (
    <div className="border-b border-[#00d4ff]/15 bg-[#00121a]/60">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 py-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-xs sm:text-sm text-[#a8e8ff]/80">
        <span className="material-symbols-outlined text-[#00d4ff] text-base leading-none">redeem</span>
        <span>{t('barText', { code: REFERRAL_CODE })}</span>
        <button
          type="button"
          onClick={copy}
          className="px-2 py-0.5 text-[11px] font-label uppercase tracking-wider border border-[#00d4ff]/40 text-[#00d4ff] rounded hover:bg-[#00d4ff]/10 transition-colors"
        >
          {copied ? t('copied') : t('copy')}
        </button>
      </div>
    </div>
  )
}
