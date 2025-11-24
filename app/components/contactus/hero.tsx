"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HeroSection() {
  const t = useTranslations("contact");

  return (
    <section className="bg-[#0E766E] text-white py-16 px-6 rounded-b-3xl">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* النص */}
        <div className="md:w-1/2">
          <h1 className="text-3xl md:text-6xl font-bold">{t("title")}</h1>
          <p className="mt-2 text-lg opacity-90">{t("subtitle")}</p>
        </div>

        {/* الصور */}
        <div className="w-full md:w-1/2">
          {/* موبايل: الصور فوق بعض */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <Image
                src="/herosec.png"
                alt="Contact 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <Image
                src="/herosec.png"
                alt="Contact 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-full h-40 rounded-lg overflow-hidden">
              <Image
                src="/herosec.png"
                alt="Contact 3"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Tablet / Desktop: 2+1 layout */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {/* الصورتين اللي فوق بعض */}
            <div className="flex flex-col gap-4">
              <div className="relative w-full h-40 md:h-44 rounded-lg overflow-hidden">
                <Image
                  src="/herosec.png"
                  alt="Contact 1"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative w-full h-40 md:h-44 rounded-lg overflow-hidden">
                <Image
                  src="/herosec.png"
                  alt="Contact 2"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* الصورة الطويلة */}
            <div className="relative w-full h-[336px] md:h-[380px] row-span-2 rounded-lg overflow-hidden">
              <Image
                src="/herosec.png"
                alt="Contact 3"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}