import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";

/**
 * Cloudflare Pages 정적 배포 (static export).
 * - output: 'export'   → 런타임 서버/DB 없이 전 라우트 SSG
 * - images.unoptimized → CF Pages엔 Image Optimization API 없음 (R2 원본 URL 그대로)
 *
 * WordPress(2020-2026) 레거시 308 리다이렉트는 static export에서 next의 redirects()가
 * 무시되므로 Cloudflare `_redirects`(public/_redirects → out/_redirects)로 이관함.
 * 생성 스크립트: pipeline/gen_redirects.py · SEO 보존 기준선: _backup/sitemap-baseline-*.txt
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
