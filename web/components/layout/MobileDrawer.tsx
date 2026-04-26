'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { LocaleToggle } from './LocaleToggle'
import { useEffect } from 'react'

interface MobileDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const locale = useLocale()
  const t = useTranslations('nav')

  // 드로어 열릴 때 body 스크롤 잠금
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const navLinks = [
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/official`, label: t('official') },
    { href: `/${locale}/wiki`, label: t('wiki') },
    { href: `/${locale}/search`, label: t('search') },
  ]

  return (
    <div className="fixed inset-0 z-[200] flex justify-end">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-[#0e1322]/70 backdrop-blur-md"
        onClick={onClose}
      />

      {/* 드로어 패널 */}
      <div className="relative w-full max-w-sm h-full bg-[#0e1322]/95 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-[#3c494e]/30">

        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <span className="font-headline font-bold text-xl tracking-tight text-[#00d4ff] uppercase">
            Earth2Guide
          </span>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#25293a] text-[#dee1f7] hover:bg-[#2f3445] transition-colors"
            aria-label="메뉴 닫기"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-3">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="group flex items-center justify-between px-6 py-4 rounded-2xl bg-[#161b2b] border border-[#3c494e]/20 hover:bg-[#1a1f2f] hover:border-[#00d4ff]/30 transition-all"
              >
                <span className="font-headline text-xl font-medium text-[#dee1f7] group-hover:text-[#a8e8ff]">
                  {label}
                </span>
                <span className="material-symbols-outlined text-[#859398] group-hover:text-[#00d4ff] transition-colors">
                  chevron_right
                </span>
              </Link>
            ))}
          </div>
        </nav>

        {/* 하단 locale 토글 */}
        <div className="px-6 pb-8 pt-4 border-t border-[#3c494e]/30">
          <p className="text-xs text-[#859398] uppercase tracking-widest mb-3 font-label">
            Language
          </p>
          <LocaleToggle />
        </div>
      </div>
    </div>
  )
}
