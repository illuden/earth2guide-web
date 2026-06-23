import type { Metadata } from 'next'

/**
 * hreflang alternates 일관 생성.
 * 모든 페이지가 ko/zh + x-default(=ko) 를 빠짐없이 갖도록 강제한다.
 * @param locale 현재 로케일 (canonical 용)
 * @param path   로케일 접두어를 뺀 경로. 예: '/about', `/wiki/${slug}`. 홈은 '' .
 */
export function localeAlternates(
  locale: string,
  path = '',
): NonNullable<Metadata['alternates']> {
  const clean = path && !path.startsWith('/') ? `/${path}` : path
  return {
    canonical: `/${locale}${clean}`,
    languages: {
      ko: `/ko${clean}`,
      zh: `/zh${clean}`,
      'x-default': `/ko${clean}`,
    },
  }
}
