"use client";

import { useLocale, useTranslations } from "next-intl";
import clsx from "clsx";

export default function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const isArabic = locale === "ar";

  const sections = [
    { title: t("main"), items: t.raw("mainLinks") },
    { title: t("about"), items: t.raw("aboutLinks") },
    { title: t("support"), items: t.raw("supportLinks") },
    { title: t("apps"), items: t.raw("appsLinks") },
  ];

  return (
    <footer
      dir={isArabic ? "rtl" : "ltr"}
      className="bg-white text-gray-700 border-t border-gray-200 py-10"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* الأقسام */}
        <div
          className={clsx(
            "grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            isArabic ? "text-right" : "text-left"
          )}
        >
          {sections.map((section, i) => (
            <div key={i}>
              <h3 className="font-semibold text-gray-400 mb-3 text-base">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.items.map((item: {label:string;href:string}, j: number) => (
                  <li key={j}>
                    <a
                      href={item.href}
                      className="hover:text-[#0C8A83] transition-colors font-medium text-sm"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* الفاصل */}
        <div className="border-t border-gray-200 mt-10 mb-6" />

        {/* اللوجو */}
        <div
          className={clsx(
            "flex items-center sm:justify-between justify-center flex-row"
          )}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#0C8A83] rounded-sm" />
            <span className="font-semibold text-[#0C8A83] text-sm">
              {t("brand")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}