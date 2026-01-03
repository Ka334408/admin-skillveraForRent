// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./localization/i18n.ts");
const WEB_API_URL = process.env.NEXT_PUBLIC_API_URL ;
const MOBILE_API_URL = process.env.NEXT_PUBLIC_API_MOBILE_BASE_URL ;
const API_IMAGES = process.env.NEXT_PUBLIC_API_IMAGES ;

if (!WEB_API_URL||!MOBILE_API_URL) {
  console.warn("NEXT_PUBLIC_API_BASE_URL is not defined, defaulting to /api");
}

const nextConfig = {
  async rewrites() {
    return [
      // ===== Web API =====
      {
        source: "/:locale/api/:path*",
        destination: `${WEB_API_URL}/:path*`,
      },
      {
        source: "/api/:path*",
        destination: `${WEB_API_URL}/:path*`,
      },

      // ===== Mobile API with fallback =====
      {
        source: "/mobile-api/:path*",
        destination: `${MOBILE_API_URL}/:path*`,
      },
    ];
  },

  images: {
    remotePatterns: API_IMAGES
      ? [
          {
            protocol: "http",
            hostname: new URL(API_IMAGES).hostname,
            port: new URL(API_IMAGES).port || "",
            pathname: "/**",
          },
        ]
      : [],
  },
};

export default withNextIntl(nextConfig);