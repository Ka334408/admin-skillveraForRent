"use client";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { features } from "../../constants/content";
import phone from "../../../public/phone.png";

export default function FeaturesSection() {
  const t = useTranslations("features");
  const locale = useLocale();

  return (
    <section
      className="relative bg-[#0E766E] text-white py-14 lg:py-20 rounded-tr-[100px] lg:rounded-tr-[150px] rounded-bl-[100px] lg:rounded-bl-[150px] overflow-hidden"
      data-aos="fade-up"
      data-aos-duration="3000"
    >
      {/* Header */}
      <div
        className="text-center mb-10 lg:mb-16 px-4"
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        <p
          className="text-sm lg:text-base opacity-80 text-black"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          {t("subtitle")}
        </p>
        <h2
          className="text-2xl md:text-3xl lg:text-4xl font-bold max-w-4xl mx-auto mt-2 leading-relaxed dark:text-[#0a0a0a]"
          data-aos="zoom-in"
          data-aos-duration="3000"
        >
          {t("title")}
        </h2>
      </div>

      {/* ===== Desktop & Large Layout ===== */}
      <div className="hidden md:flex relative justify-center items-center min-h-[600px] lg:min-h-[750px]">
        {/* Circles */}
        <div
          className="absolute w-[420px] h-[420px] lg:w-[550px] lg:h-[550px] border border-white rounded-full"
          data-aos="zoom-in"
          data-aos-duration="2000"
        ></div>
        <div
          className="absolute w-[550px] h-[550px] lg:w-[680px] lg:h-[680px] border border-white rounded-full"
          data-aos="zoom-in"
          data-aos-duration="2500"
        ></div>
        <div
          className="absolute w-[680px] h-[680px] lg:w-[820px] lg:h-[820px] border border-white rounded-full"
          data-aos="zoom-in"
          data-aos-duration="3000"
        ></div>

        {/* Phone */}
        <Image
          src={phone}
          alt="phone"
          width={220}
          height={450}
          className="relative z-10 lg:w-[280px] lg:h-auto"
          data-aos="zoom-in"
          data-aos-duration="3000"
        />

        {/* Features */}
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`absolute ${feature.top} ${
                feature.side === "left"
                  ? "-translate-x-[300px] lg:-translate-x-[380px] flex-row-reverse"
                  : "translate-x-[300px] lg:translate-x-[380px] text-left"
              } flex items-center gap-3 lg:gap-4 max-w-[200px] lg:max-w-[260px]`}
            >
              <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm shrink-0">
                <Icon
                  className="w-5 h-5 lg:w-6 lg:h-6 text-white dark:text-[#0a0a0a]"
                  data-aos="zoom-in"
                  data-aos-duration="3000"
                />
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg dark:text-[#0a0a0a]">
                  {t(`${feature.key}Title`)}
                </h3>
                <p className="text-xs lg:text-sm opacity-90 leading-5 dark:text-[#0a0a0a]">
                  {t(`${feature.key}Desc`)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== Mobile Layout ===== */}
      <div className="flex flex-col items-center gap-8 md:hidden">
        {/* Phone */}
        <Image
          src="/phone.png"
          alt="phone"
          width={180}
          height={380}
          className="relative z-10 h-auto w-auto"
        />

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
                  <Icon className="w-6 h-6 text-white dark:text-[#0a0a0a]" />
                </div>
                <h3 className="font-semibold text-base lg:text-lg dark:text-[#0a0a0a]">
                  {t(`${feature.key}Title`)}
                </h3>
                <p className="text-sm opacity-90 leading-6 dark:text-[#0a0a0a]">
                  {t(`${feature.key}Desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}