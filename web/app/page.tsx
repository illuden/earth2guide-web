'use client'

import { useEffect } from 'react'

/**
 * 루트(/) → 기본 로케일(/ko).
 * static export 호환: 런타임 redirect() 대신 클라이언트 리다이렉트.
 * 1차 처리는 Cloudflare `_redirects` (/ → /ko 302), 본 페이지는 폴백.
 */
export default function RootPage() {
  useEffect(() => {
    window.location.replace('/ko')
  }, [])
  return null
}
