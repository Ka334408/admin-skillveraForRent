"use client";

import { useTranslations } from "next-intl";

export default function ThingsToKnow() {
  const t = useTranslations("thingsToKnow");
  const rules: string[] = t.raw("rules");

  return (
    <section className="py-16 px-4 ">
      <h2 className="text-3xl font-bold text-center text-[#0E766E] mb-12">
        {t("title")}
      </h2>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Facility Rules */}
        <div>
          <h3 className="font-semibold text-xl mb-5 text-gray-900">
            {t("rulesTitle")}
          </h3>
          <ul className="space-y-3">
            {rules.map((rule, i) => (
              <li
                key={i}
                className="bg-[#0E766E] text-white rounded-full py-3 px-6 text-sm font-medium flex items-center"
              >
                <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Facility Policies */}
        <div>
          <h3 className="font-semibold text-xl mb-5 text-gray-900">
            {t("policiesTitle")}
          </h3>
          <div className="bg-[#0E766E] text-white rounded-2xl p-6 text-sm leading-relaxed">
            <p>{t("policies")}</p>
            <button className="text-white underline mt-4 block font-medium hover:text-gray-200 transition">
              {t("showMore")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}