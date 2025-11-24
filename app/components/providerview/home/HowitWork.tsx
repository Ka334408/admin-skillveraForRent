"use client";

import Image from "next/image";

export default function HowItWorks() {
  return (
    <section className="flex flex-col items-start justify-center px-8 sm:px-12 lg:px-24 py-20 bg-white">
      {/* النص */}
      <div className="max-w-xl text-left ml-6 sm:ml-10 lg:ml-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          How It Works
        </h2>

        <p className="text-lg sm:text-xl font-semibold text-gray-800">
          Getting Skava Is Easy.
        </p>

        <p className="text-gray-500 mt-2 text-base sm:text-lg">
          We Handle Everything.
          <br />
          You Decide What To Do With It.
        </p>
      </div>

      {/* الصورة */}
      <div className="relative w-full mt-12 flex justify-center">
        <Image
          src="/blackHouse.png" // 👈 غيّر المسار حسب الصورة عندك
          alt="Modern House"
          width={1200} // 👈 كبرنا العرض
          height={600}
          className="w-[95%] sm:w-[90%] lg:w-[80%] max-w-6xl h-auto object-contain"
          priority
        />
      </div>
    </section>
  );
}