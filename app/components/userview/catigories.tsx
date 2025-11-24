"use client";

import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Card from "../mainComponents/card";
import LoginModal from "../loginmodel";
import { facilitiesData } from "@/app/constants/content";

export default function CategoriesSection() {
  const t = useTranslations("categories");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const isLoggedIn = !!token;

  // تجهيز الداتا
  const items = facilitiesData.slice(0, 10).map((f) => ({
    id: f.id.toString(),
    title: f.name,
    category: f.category,
    image: f.image,
    price: f.price,
    rating: 4.5,
    reviewsCount: 20,
  }));

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category.includes(activeCategory));

  // نكرر العناصر مرتين عشان CSS looping يكون seamless
  const doubledItems = [...filteredItems, ...filteredItems];

  // مدة الانيميشن تعتمد على عدد العناصر (أقصر مدة 10s)
  const animationDuration = Math.max(10, filteredItems.length * 3); // seconds

  const handleFavorite = (id: string) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  return (
    <section className="px-6 py-10 relative bg-[#f3f4f4] dark:bg-[#0a0a0a] dark:text-white mt-15 overflow-hidden">
      {/* Title + See All */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0E766E]">{t("title")}</h2>
        <button
          onClick={() => router.push("/userview/allFacilities")}
          className="text-[#0E766E] font-semibold hover:text-white border-[#0E766E] px-4 py-2 rounded-full border transition hover:bg-[#0E766E]"
        >
          {t("see_all")}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {[
          { key: "all", label: t("all") },
          { key: "FootBall", label: "FootBall" },
          { key: "Education", label: "Education" },
          { key: "HandBall", label: "HandBall" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => {
              setActiveCategory(cat.key);
            }}
            className={`px-4 py-2 rounded-full border transition ${
              activeCategory === cat.key
                ? "bg-[#0E766E] text-white border-[#0E766E] dark:bg-white dark:text-[#0E766E]"
                : "bg-white text-[#0E766E] border-blue-400 hover:bg-blue-100 dark:bg-[#0a0a0a]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards Slider (CSS infinite loop) */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Inline style for CSS variable --duration */}
        <div
          className="flex gap-6 will-change-transform"
          style={{
            // نستخدم animation فقط إذا فيه عناصر كافية
            animation: filteredItems.length > 0
              ? `${isPaused ? "scrollX" : "scrollX"} ${animationDuration}s linear infinite`
              : "none",
          }}
        >
          {doubledItems.map((item, index) => (
            <div key={`${item.id}-${index}`} style={{ flex: "0 0 auto" }}>
              <Card
                {...item}
                isFavorite={favorites.includes(item.id)}
                onFavorite={() => handleFavorite(item.id)}
              />
            </div>
          ))}
        </div>

        {/* keyframes داخل style tag عشان تكون مهيئة في نفس الكومبوننت */}
        <style>{`
          @keyframes scrollX {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          /* لضمان السلاسة، العنصر الأب لازم يكون display:flex وعرض المحتوى المكرر = 200% */
          .flex[style] {
            /* fallback in case Tailwind specificity differs; not relied on */
          }

          /* إذا احتجت توقف الانيميشن عبر كلاس 'paused' ممكن تضيفه */
        `}</style>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal show={true} onClose={() => setShowLoginModal(false)} />
      )}
    </section>
  );
}