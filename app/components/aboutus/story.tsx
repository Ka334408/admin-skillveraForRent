"use client";
import { useTranslations } from "next-intl";

export default function Story() {
  const t = useTranslations("story");

  return (
    <section className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-2xl font-bold text-[#0E766E] mb-4">{t("title")}</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">{t("text")}</p>
    </section>
  );
}