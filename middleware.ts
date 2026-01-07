import createMiddleware from "next-intl/middleware";
import { pathnames, locales, localePrefix } from "./localization/config";

export default createMiddleware({
  defaultLocale: "ar",
  locales,
  pathnames,
  localePrefix,
  localeDetection: false,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(ar|en)/:path*", "/((?!_next|_vercel|.*\\..*).*)"],
};
