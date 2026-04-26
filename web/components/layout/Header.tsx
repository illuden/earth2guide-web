'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState } from 'react'
import { LocaleToggle } from './LocaleToggle'
import { MobileDrawer } from './MobileDrawer'

export function Header() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const navLinks = [
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/official`, label: t('official') },
    { href: `/${locale}/wiki`, label: t('wiki') },
  ]

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#0e1322]/60 backdrop-blur-xl shadow-[0_0_20px_rgba(0,212,255,0.05)]">
        <div className="flex justify-between items-center px-6 lg:px-8 py-4 max-w-screen-2xl mx-auto">

          {/* 로고 */}
          <Link
            href={`/${locale}`}
            className="text-xl lg:text-2xl font-bold tracking-tighter text-[#00d4ff] font-headline uppercase hover:opacity-80 transition-opacity"
          >
            Earth2Guide
          </Link>

          {/* PC 네비게이션 */}
          <div className="hidden md:flex items-center gap-8 font-headline uppercase tracking-wider text-sm">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-[#a8e8ff]/70 hover:text-[#a8e8ff] transition-all duration-300 hover:text-shadow-[0_0_8px_rgba(168,232,255,0.5)]"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* 우측: 검색 + 언어 토글 */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* PC 검색 */}
            <Link
              href={`/${locale}/search`}
              className="hidden lg:flex items-center gap-2 text-[#a8e8ff]/60 hover:text-[#a8e8ff] transition-colors"
              aria-label="검색"
            >
              <span className="material-symbols-outlined text-lg">search</span>
            </Link>

            {/* PC 언어 토글 */}
            <div className="hidden md:block">
              <LocaleToggle />
            </div>

            {/* 모바일 햄버거 */}
            <button
              className="flex md:hidden items-center justify-center w-10 h-10 text-[#a8e8ff] hover:bg-[#a8e8ff]/10 rounded-lg transition-colors"
              onClick={() => setDrawerOpen(true)}
              aria-label="메뉴 열기"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
        </div>

        {/* 하단 그라데이션 라인 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-[#00d4ff]/20 via-[#00d4ff]/5 to-transparent" />
      </nav>

      {/* 모바일 드로어 */}
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
