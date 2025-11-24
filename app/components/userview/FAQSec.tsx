"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

// خلي الـ faqs تيجي من الـ messages بدل ما تكون ثابتة
export default function FAQSection() {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // نجيب الأسئلة والأجوبة من الترجمة
  const faqs = t.raw("items") as { question: string; answer: string }[];

  return (
    <section className="py-12 dark:bg-[#0a0a0a] overflow-hidden mx-5 sm:mx-0">
      {/* Title */}
      <div className="text-center mb-8">
        <p
          className="text-[#0E766E] font-medium uppercase tracking-wide"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          {t("title")}
        </p>
        <h2
          className="text-2xl md:text-3xl font-bold mb-2"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          {t("subtitle")}
        </h2>
        <p
          className="text-gray-600"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          {t("description")}
        </p>
      </div>

      {/* FAQ Grid */}
      <div
        className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4"
        data-aos="fade-up"
        data-aos-duration="3000"
      >
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`border rounded-xl p-4 transition-all duration-300 dark:bg-[#0a0a0a] ${
              openIndex === index
                ? "bg-blue-50 border-blue-500"
                : "border-gray-300"
            }`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center text-left font-semibold text-gray-900 dark:text-white"
            >
              {faq.question}
              {openIndex === index ? (
                <Minus className="w-5 h-5 text-[#0E766E]" />
              ) : (
                <Plus className="w-5 h-5 text-[#0E766E]" />
              )}
            </button>

            {openIndex === index && (
              <div className="mt-3 text-gray-600 text-sm dark:text-slate-400">
                {faq.answer}
                <p className="text-[#0E766E] font-medium mt-2 cursor-pointer">
                  {t("readMore")}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-8">
        <button
          className="px-6 py-2 bg-[#0E766E] text-white rounded-lg shadow hover:bg-[#0E766E] transition"
          data-aos="fade-up"
          data-aos-duration="3000"
        >
          {t("cta")}
        </button>
      </div>
    </section>
  );
}