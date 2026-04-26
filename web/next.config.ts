import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";

/**
 * WordPress (어스2 가이드, 2020-2026) → Next.js (earth2guide.com) URL mapping.
 * GSC indexed URL이 끊기지 않도록 308 (영구 리다이렉트) 처리.
 *
 * Source:
 *   - pipeline/Legacy/2.WordPress.2026-04-12.xml (40 published)
 *   - pipeline/docs/SEO_REDIRECT_MAP.md
 *   - pipeline/docs/seo_redirects.json
 *
 * Policy:
 *   - All legacy URLs → /ko/... (legacy content was Korean)
 *   - direct match (slug 동일): 8개
 *   - 의미 매칭: /2fa-korean → /ko/wiki/manage-2fa 등
 *   - 월별 공지 / 트위터 시리즈: /ko/official 목록으로
 */

const PERM = true;

const WP_POSTS: Array<[string, string]> = [
  // direct match (wiki 3 + post 5)
  ["/create-your-account", "/ko/wiki/create-your-account"],
  ["/manage-2fa", "/ko/wiki/manage-2fa"],
  ["/customize-your-account", "/ko/wiki/customize-your-account"],
  ["/retrospective-reward-for-earth-2-land-owners", "/ko/official/retrospective-reward-for-earth-2-land-owners"],
  ["/earth-2-announces-acquisition-of-3d-fast-paced-sci-fi-vehicular-combat-game-drone", "/ko/official/earth-2-announces-acquisition-of-3d-fast-paced-sci-fi-vehicular-combat-game-drone"],
  ["/former-senior-binance-director-omar-rahim-joins-earth-2-as-strategic-advisor", "/ko/official/former-senior-binance-director-omar-rahim-joins-earth-2-as-strategic-advisor"],
  ["/e2turns2", "/ko/official/e2turns2"],
  ["/raiding-update", "/ko/official/raiding-update"],

  // 한국어 가이드 → 위키 의미 매칭
  ["/register-korean", "/ko/wiki/create-your-account"],
  ["/add-credit-korean", "/ko/wiki/account-balance-and-withdrawals"],
  ["/2fa-korean", "/ko/wiki/manage-2fa"],
  ["/withdrawal-korean", "/ko/wiki/account-balance-and-withdrawals"],
  ["/account-balances-and-withdrawals", "/ko/wiki/account-balance-and-withdrawals"],
  ["/epls-introduction-and-setup", "/ko/wiki/epl"],
  ["/edc", "/ko/wiki/tier-1-properties-and-bonus-essence"],

  // 월별 공지 모음 → /ko/official
  ["/2020-12", "/ko/official"],
  ["/2021-01", "/ko/official"],
  ["/2021-02", "/ko/official"],
  ["/2021-03", "/ko/official"],
  ["/2021-04", "/ko/official"],
  ["/2021-05", "/ko/official"],
  ["/2021-06", "/ko/official"],
  ["/2021-07", "/ko/official"],
  ["/2021-08", "/ko/official"],

  // Shane 트위터 월별 시리즈 → /ko/official
  ["/twitter-2021-02", "/ko/official"],
  ["/twitter-2021-03", "/ko/official"],
  ["/twitter-2021-04", "/ko/official"],
  ["/twitter-2021-05", "/ko/official"],
  ["/twitter-2021-06", "/ko/official"],
  ["/twitter-2021-07", "/ko/official"],
  ["/twitter-2021-08", "/ko/official"],
  ["/twitter-2021-09", "/ko/official"],
  ["/twitter-2021-10", "/ko/official"],

  // 단발 콘텐츠
  ["/israel", "/ko/news"],
  ["/earth2_sourceofwealth_kyc", "/ko/official"],
  ["/ess-pool-1", "/ko/news"],

  // 한글 인코딩 슬러그 (encoded + decoded 양쪽)
  ["/%ed%83%80%ec%9d%bc%ea%b5%ac%eb%a7%a4-%ec%a0%84%eb%9e%b5", "/ko/wiki/buy-new-land"],
  ["/타일구매-전략", "/ko/wiki/buy-new-land"],
  ["/%ec%96%b4%ec%8a%a42-pre-alpha-%ed%85%8c%ec%8a%a4%ed%84%b0-%ec%8b%a0%ec%b2%ad-%ec%96%91%ec%8b%9d-%ec%9e%91%ec%84%b1%eb%b2%95", "/ko/wiki/create-your-account"],
  ["/어스2-pre-alpha-테스터-신청-양식-작성법", "/ko/wiki/create-your-account"],
  ["/%ec%96%b4%ec%8a%a42-%ea%b3%b5%ec%8b%9d-2020%eb%85%84-12%ec%9b%94-%ea%b3%b5%ec%a7%80%ec%82%ac%ed%95%ad", "/ko/official"],
  ["/어스2-공식-2020년-12월-공지사항", "/ko/official"],
];

const WP_CATEGORIES: Array<[string, string]> = [
  ["/category/shane-isaac", "/ko/news"],
  ["/category/shane-isaac/x", "/ko/news"],
  ["/category/shane-isaac/discord", "/ko/news"],
  ["/category/manual", "/ko/wiki/overview"],
  ["/category/manual/account", "/ko/wiki/overview"],
  ["/category/manual/essence", "/ko/wiki/overview"],
  ["/category/manual/jewel", "/ko/wiki/jewels"],
  ["/category/manual/raid", "/ko/wiki/overview"],
  ["/category/news", "/ko/news"],
  ["/category/news/announcement", "/ko/official"],
  ["/category/news/youtube", "/ko/news"],
];

const WP_SYSTEM: Array<[string, string]> = [
  ["/feed", "/sitemap.xml"],
  ["/comments/feed", "/"],
  ["/wp-admin", "/admin"],
  ["/wp-login.php", "/admin"],
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev",
      },
    ],
  },

  async redirects() {
    const rules: Array<{ source: string; destination: string; permanent: boolean; has?: any }> = [];

    for (const [src, dest] of WP_POSTS) {
      rules.push({ source: src, destination: dest, permanent: PERM });
      if (!src.endsWith("/")) {
        rules.push({ source: src + "/", destination: dest, permanent: PERM });
      }
    }

    for (const [src, dest] of WP_CATEGORIES) {
      rules.push({ source: src, destination: dest, permanent: PERM });
      rules.push({ source: src + "/", destination: dest, permanent: PERM });
    }

    for (const [src, dest] of WP_SYSTEM) {
      rules.push({ source: src, destination: dest, permanent: PERM });
      rules.push({ source: src + "/", destination: dest, permanent: PERM });
    }

    rules.push({ source: "/wp-content/:path*", destination: "/", permanent: PERM });
    rules.push({ source: "/wp-includes/:path*", destination: "/", permanent: PERM });
    rules.push({ source: "/wp-admin/:path*", destination: "/admin", permanent: PERM });

    // 옛 위키 카테고리 query param (5→7 변경 잔재)
    for (const oldCat of ["essence", "jewel", "raid", "general"]) {
      rules.push({
        source: "/wiki",
        has: [{ type: "query", key: "category", value: oldCat }],
        destination: "/ko/wiki/overview",
        permanent: PERM,
      });
      rules.push({
        source: "/:locale(ko|zh)/wiki",
        has: [{ type: "query", key: "category", value: oldCat }],
        destination: "/:locale/wiki/overview",
        permanent: PERM,
      });
    }

    // earth2.io how-to 패턴 호환
    rules.push({ source: "/how-to", destination: "/ko/wiki/overview", permanent: PERM });
    rules.push({ source: "/how-to/:cat", destination: "/ko/wiki/overview", permanent: PERM });
    rules.push({ source: "/how-to/:cat/:slug", destination: "/ko/wiki/:slug", permanent: PERM });

    return rules;
  },
};

export default withNextIntl(nextConfig);
