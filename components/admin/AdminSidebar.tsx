'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/admin/posts', label: '포스트 관리', icon: 'article' },
  { href: '/admin/wiki', label: '위키 관리', icon: 'menu_book' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin')
    router.refresh()
  }

  return (
    <>
      {/* PC 사이드바 */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-[#090e1c] border-r border-[#3c494e]/30">
        <div className="px-6 py-5 border-b border-[#3c494e]/30">
          <span className="text-lg font-headline font-bold text-[#00d4ff] uppercase tracking-tighter">
            Earth2Guide
          </span>
          <p className="text-xs text-[#859398] font-label uppercase tracking-widest mt-0.5">Admin</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm transition-all ${
                  active
                    ? 'bg-[#00d4ff]/10 text-[#00d4ff] font-medium'
                    : 'text-[#bbc9cf] hover:bg-[#1a1f2f] hover:text-[#a8e8ff]'
                }`}
              >
                <span className="material-symbols-outlined text-base">{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#3c494e]/30">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-sm text-sm text-[#859398] hover:bg-[#1a1f2f] hover:text-red-400 transition-all"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            로그아웃
          </button>
        </div>
      </aside>

      {/* 모바일 상단 탭 */}
      <div className="flex md:hidden border-b border-[#3c494e]/30 bg-[#090e1c] px-4">
        {navItems.map(({ href, label, icon }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-3 text-sm border-b-2 transition-all ${
                active
                  ? 'border-[#00d4ff] text-[#00d4ff]'
                  : 'border-transparent text-[#859398] hover:text-[#a8e8ff]'
              }`}
            >
              <span className="material-symbols-outlined text-base">{icon}</span>
              {label}
            </Link>
          )
        })}
      </div>
    </>
  )
}
