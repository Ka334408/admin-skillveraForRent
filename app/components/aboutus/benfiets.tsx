"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function Benefits() {
  const t = useTranslations("benefits");

  return (
    <section className="container mx-auto px-4 py-16 flex flex-col md:flex-row items-stretch gap-8">
      {/* صورة */}
      <div className="w-full md:w-1/3">
        <Image
          src="/herosec.jpg"
          alt="About us"
          width={400}
          height={400}
          className="rounded-lg object-cover w-full h-full"
        />
      </div>

      {/* تكبير جزء الكلام بحيث يبقى بنفس طول الصورة */}
      <div className="w-full md:w-2/3 border border-[#0E766E] rounded-xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <h3 className="font-bold mb-2">{t("responsable")}</h3>
          <p className="text-gray-600 text-sm">{t("text")}</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">{t("benefit1")}</h3>
          <p className="text-gray-600 text-sm">{t("text")}</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">{t("benefit2")}</h3>
          <p className="text-gray-600 text-sm">{t("text")}</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">{t("benefit3")}</h3>
          <p className="text-gray-600 text-sm">{t("text")}</p>
        </div>
      </div>
    </section>
  );
}