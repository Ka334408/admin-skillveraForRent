"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {logos} from "../../constants/content"


export default function TrustedSection() {
  const t = useTranslations("trusted");
  const locale = useLocale();

  return (
    <section className="py-12 bg-[#f3f4f4] overflow-hidden dark:bg-[#0a0a0a]">
      <h2 className="text-center text-lg md:text-xl font-semibold mb-8 " data-aos="fade-up" data-aos-duration="3000">
        {t("trustedBy")} <span className="text-[#0E766E]">{t("enterprices")}</span>{" "}
        {t("inSaudi")}
      </h2>

      {/* Container */}
      <div className="relative w-full overflow-hidden" data-aos-duration="3000" data-aos="slide-right">
        {/* Track */}
        <div
          className={`flex w-max hover:[animation-play-state:paused] ${
            locale === "ar" ? "animate-marquee-rtl" : "animate-marquee-ltr"
          }`}
        >
          {[...logos, ...logos, ...logos, ...logos , ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex items-center justify-center mx-8 flex-shrink-0"
            >
              <Image
                src={logo}
                alt={`logo-${index}`}
                width={100}
                height={50}
                className="object-contain h-auto w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}