"use client";

import Image from "next/image";
import { Users, RefreshCw, CreditCard } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative bg-[#f3f4f4] py-20 overflow-hidden rounder-bl-[100px]">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* العنوان الرئيسي */}
        <h1 className="mx-auto max-w-3xl md:max-w-4xl text-3xl md:text-5xl font-bold text-[#0E766E] mb-12 leading-snug md:leading-tight" data-aos="slide-left">
          Slogan should be here with <br /> one or two good sentence
        </h1>

        {/* الصورة مع التأثير */}
        <div className="relative inline-block group transition-all duration-300 " data-aos="slide-right">
          <Image
            src="/herosec.png"
            alt="Modern Building"
            width={900}
            height={600}
            className="rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02]"
          />

          {/* الكروت الصغيرة تظهر عند Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {/* كارت Easy process */}
            <div className="absolute top-1/3 left-[-50px] bg-white rounded-xl shadow-md px-4 py-2 flex items-center gap-2">
              <RefreshCw size={18} className="text-[#0E766E]" />
              <span className="text-sm font-medium text-gray-700">Easy process</span>
            </div>

            {/* كارت Pay Easley */}
            <div className="absolute bottom-[-30px] left-[60px] bg-white rounded-xl shadow-md px-4 py-2 flex items-center gap-2">
              <CreditCard size={18} className="text-[#0E766E]" />
              <span className="text-sm font-medium text-gray-700">Pay Easley</span>
            </div>

            {/* كارت Provider */}
            <div className="absolute top-[20%] right-[-70px] bg-white rounded-xl shadow-md px-4 py-2 flex items-center gap-2">
              <Users size={18} className="text-[#0E766E]" />
              <span className="text-sm font-medium text-gray-700">
                1260 <span className="text-[#0E766E] font-semibold">Provider</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}