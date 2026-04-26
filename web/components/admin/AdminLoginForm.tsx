'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    // 세션 쿠키가 미들웨어에서 인식되도록 풀 리로드
    window.location.href = '/admin/posts'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1322] px-6">
      <div className="w-full max-w-sm">
        {/* 로고 */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-headline font-bold text-[#00d4ff] uppercase tracking-tighter mb-1">
            Earth2Guide
          </h1>
          <p className="text-sm text-[#859398] font-label uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-label uppercase tracking-wider text-[#859398] mb-2">
              이메일
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-[#161b2b] border border-[#3c494e] focus:border-[#00d4ff] focus:outline-none px-4 py-3 text-[#dee1f7] text-sm rounded-sm transition-colors"
              placeholder="admin@earth2guide.com"
            />
          </div>

          <div>
            <label className="block text-xs font-label uppercase tracking-wider text-[#859398] mb-2">
              비밀번호
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-[#161b2b] border border-[#3c494e] focus:border-[#00d4ff] focus:outline-none px-4 py-3 text-[#dee1f7] text-sm rounded-sm transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-900/20 border border-red-700/30 rounded-sm text-sm text-red-300">
              <span className="material-symbols-outlined text-base">error</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#00d4ff] text-[#003642] font-headline font-bold uppercase tracking-wider text-sm hover:bg-[#a8e8ff] transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className="text-center text-xs text-[#3c494e] mt-8 font-label">
          earth2guide.com admin — authorized access only
        </p>
      </div>
    </div>
  )
}
