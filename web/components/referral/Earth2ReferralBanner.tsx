'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { REFERRAL_CODE, EARTH2_APP_URL } from '@/lib/referral'

export function Earth2ReferralBanner() {
  const t = useTranslations('referral')
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard 미지원 환경 무시 — 코드는 화면에 노출되어 있음 */
    }
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#003642] via-[#001f27] to-[#003642] border border-[#00d4ff]/20 rounded-sm p-6 lg:p-8">
      {/* 배경 글로우 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08),transparent_70%)]" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-xs font-label uppercase tracking-widest text-[#00d4ff]/70 mb-1">
            {t('badge')}
          </p>
          <h3 className="text-xl lg:text-2xl font-headline font-bold text-[#dee1f7]">
            {t('headline')}
          </h3>
          <p className="text-[#a8e8ff]/70 text-sm mt-1 max-w-md">
            {t('instruction')}
          </p>

          {/* 리퍼럴 코드 (복사용) */}
          <div className="mt-3 flex items-center justify-center md:justify-start gap-2">
            <span className="text-[#a8e8ff]/60 text-xs font-label uppercase tracking-wider">
              {t('codeLabel')}
            </span>
            <code className="px-3 py-1 rounded bg-[#00121a] border border-[#00d4ff]/40 text-[#00d4ff] font-mono font-bold tracking-[0.3em] text-base select-all">
              {REFERRAL_CODE}
            </code>
            <button
              type="button"
              onClick={copy}
              className="px-2.5 py-1 text-xs font-label uppercase tracking-wider border border-[#00d4ff]/40 text-[#a8e8ff] rounded hover:bg-[#00d4ff]/10 transition-colors"
            >
              {copied ? t('copied') : t('copy')}
            </button>
          </div>
        </div>

        <a
          href={EARTH2_APP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 px-8 py-3 bg-[#00d4ff] text-[#003642] font-headline font-bold uppercase tracking-wider text-sm hover:bg-[#a8e8ff] transition-colors rounded-sm"
        >
          {t('cta')}
        </a>
      </div>
    </div>
  )
}
