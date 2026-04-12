import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-60a5d261178e40e98b04d0c1a4bbcaea.r2.dev",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
