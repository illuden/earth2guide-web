import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createIntlMiddleware(routing)

const PUBLIC_PATHS = ['/admin', '/admin/']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/* 경로 보호 (로그인 페이지 자체는 제외)
  const isAdminPath = pathname.startsWith('/admin')
  const isAdminLoginPage = pathname === '/admin' || pathname === '/admin/'

  if (isAdminPath && !isAdminLoginPage) {
    const response = NextResponse.next()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value)
              response.cookies.set(name, value, options)
            })
          },
        },
      }
    )

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return response
  }

  // admin 경로가 아닌 경우 next-intl 처리
  if (!isAdminPath) {
    return intlMiddleware(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // next-intl 대상: /, /ko/*, /zh/*
    '/',
    '/(ko|zh)/:path*',
    // admin 보호
    '/admin/:path+',
    // 정적파일 제외
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}
