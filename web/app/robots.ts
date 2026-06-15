import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://earth2guide.com'

// static export 호환: 빌드타임 1회 생성
export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      // AI 검색/어시스턴트 크롤러 명시 허용 — AIO·AI 답변 인용 전제 (정적 사이트라 비공개 경로 없음)
      ...['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended', 'Bytespider', 'CCBot'].map(
        (bot) => ({ userAgent: bot, allow: '/' as const })
      ),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
