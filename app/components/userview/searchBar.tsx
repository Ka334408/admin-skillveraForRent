"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";


export default function SearchSection() {
  const [place, setPlace] = useState("");
  const [category, setCategory] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [fromType, setFromType] = useState("text");
  const [toType, setToType] = useState("text");
  const t = useTranslations("Search");

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (place || category || from || to) {
        const query = { place, category, from, to };

        try {
          const res = await fetch("/api/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query),
          });

          const data = await res.json();
          setResults(data);
        } catch (error) {
          console.error("Search error:", error);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [place, category, from, to]);

  return (
    <div className="bg-[#f3f4f4]">
    <section className="w-[90%] md:w-[75%] mx-auto mt-8 mb-16 overflow-hidden">
      <div className="flex flex-col md:flex-row items-center dark:bg-black bg-[#f3f4f4] border-2 border-[#0E766E] rounded-[50px] sm:rounded-full shadow-md overflow-hidden" data-aos="fade-up">
        {/* Place */}
        <div className="flex-1 py-3 flex flex-col items-center justify-center relative">
          <p className="text-sm font-semibold text-gray-700">{t("place")}</p>
          <input
            type="text"
            placeholder={t("placePlaceholder")}
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="w-full bg-transparent text-gray-500 placeholder-gray-400 focus:outline-none text-sm text-center"
          />
          {/* Divider */}
          <span className="hidden sm:block absolute top-1/2 -translate-y-1/2 ltr:right-0 rtl:left-0 h-8 w-[2px] bg-[#0E766E]"></span>
          <span className="sm:hidden mt-2 w-2/3 h-[2px] bg-[#0E766E]"></span>
        </div>

        {/* Category */}
        <div className="flex-1 px-4 py-3 flex flex-col items-center justify-center relative">
          <p className="text-sm font-semibold text-gray-700">{t("category")}</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-transparent text-gray-500 focus:outline-none text-sm text-center"
          >
            <option value="">{t("categoryPlaceholder")}</option>
            <option value="hotel">{t("hotel")}</option>
            <option value="apartment">{t("apartment")}</option>
            <option value="villa">{t("villa")}</option>
          </select>
          {/* Divider */}
          {/* Divider (Desktop) */}
          <span className="hidden sm:block absolute top-1/2 -translate-y-1/2 ltr:right-0 rtl:left-0 h-8 w-px bg-[#0E766E]"></span>

          {/* Divider (Mobile) */}
          <span className="sm:hidden mt-2 w-full h-px bg-[#0E766E]"></span>
        </div>

        {/* From */}
        <div className="flex-1 px-4 py-3 flex flex-col items-center justify-center relative">
          <p className="text-sm font-semibold text-gray-700">{t("from")}</p>
          <input
            type={fromType}
            onFocus={() => setFromType("date")}
            onBlur={() => !from && setFromType("text")}
            placeholder={t("start")}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full bg-transparent text-gray-500 placeholder-gray-400 focus:outline-none text-sm text-center"
          />
          {/* Divider */}
          <span className="hidden sm:block absolute top-1/2 -translate-y-1/2 ltr:right-0 rtl:left-0 h-8 w-[2px] bg-[#0E766E]"></span>
          <span className="sm:hidden mt-2 w-2/3 h-[2px] bg-[#0E766E]"></span>
        </div>

        {/* To */}
        <div className="flex-1 px-4 py-3 flex flex-col items-center justify-center relative">
          <p className="text-sm font-semibold text-gray-700">{t("to")}</p>
          <input
            type={toType}
            onFocus={() => setToType("date")}
            onBlur={() => !to && setToType("text")}
            placeholder={t("end")}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full bg-transparent text-gray-500 placeholder-gray-400 focus:outline-none text-sm text-center"
          />
          {/* Divider */}
          <span className="hidden sm:block absolute top-1/2 -translate-y-1/2 ltr:right-0 rtl:left-0 h-8 w-[2px] bg-[#0E766E]"></span>
          <span className="sm:hidden mt-2 w-2/3 h-[2px] bg-[#0E766E]"></span>
        </div>

        {/* Search button */}
        <button
          type="button"
          className="bg-[#0E766E] hover:bg-blue-600 text-white p-4 rounded-full m-2 flex items-center justify-center transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </section>
    </div>
  );
}