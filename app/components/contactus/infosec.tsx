"use client";

import { useTranslations } from "next-intl";

export default function MiddleTextSection() {
  const t = useTranslations("contact");

  return (
    <section className="py-12 px-6 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{t("teamTitle")}</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{t("teamDesc")}</p>
    </section>
  );
}