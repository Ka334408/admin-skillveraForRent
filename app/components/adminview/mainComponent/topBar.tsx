"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  X,
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  CreditCard,
  BarChart,
  User
} from "lucide-react";
import { useUserStore } from "@/app/store/userStore";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import LocaleSwitcher from "@/app/components/local-switcher";

export default function Topbar() {
  const t = useTranslations("Topbar");
  const ts = useTranslations("Sidebar");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { user, isHydrated } = useUserStore();

  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { id: "dashboard", label: ts("menu.dashboard"), icon: LayoutDashboard, href: `/${locale}/moderator/dashBoard` },
    { id: "facilities", label: ts("menu.facilities"), icon: Building2, href: `/${locale}/moderator/AllFacilities` },
    { id: "providers", label: ts("menu.providers"), icon: Users, href: `/${locale}/moderator/Providers` },
    { id: "calendar", label: ts("menu.calendar"), icon: Calendar, href: `/${locale}/moderator/calender` },
    { id: "finance", label: ts("menu.finance"), icon: CreditCard, href: `/${locale}/moderator/Finance` },
    { id: "statistic", label: ts("menu.statistic"), icon: BarChart, href: `/${locale}/moderator/statistics` },
    { id: "myProfile", label: ts("menu.myProfile"), icon: User, href: `/${locale}/providerview/statistic` },
  ];

  const filteredResults = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isHydrated) return <div className="h-20 bg-white border-b border-gray-100 animate-pulse" />;

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between h-20 px-4 sm:px-8">

        {/* 1. الترحيب باليوزر */}
        <div className="flex flex-col leading-tight min-w-[140px]">
          <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight">
            {t("greeting", { name: user?.name?.split(' ')[0] || t("guest") })}
          </h1>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.15em] opacity-80 mt-0.5">
            {t("roleStatus", { role: t(`roles.${user?.type?.toLowerCase() || "moderator"}`) })}
          </span>
        </div>

        {/* 2. السيرش - تم إصلاح المنطق والنتائج */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative" ref={searchRef}>
          <div className="relative w-full group">
            <Search className={`absolute ${isRTL ? "right-4" : "left-4"} top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-teal-600 transition-colors w-4 h-4`} />
            <input
              type="text"
              value={searchValue}
              onFocus={() => setShowResults(true)}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className={`w-full bg-gray-50/50 border border-gray-100 rounded-2xl ${isRTL ? "pr-11 pl-10" : "pl-11 pr-10"} py-2.5 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-600 transition-all`}
            />
            {searchValue && (
              <button onClick={() => setSearchValue("")} className={`absolute ${isRTL ? "left-3" : "right-3"} top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500`}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* قائمة نتائج البحث */}
          {showResults && searchValue && (
            <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2 max-h-64 overflow-y-auto">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setShowResults(false);
                        setSearchValue("");
                      }}
                      className="flex items-center gap-3 p-3 hover:bg-teal-50 rounded-xl transition-colors group"
                    >
                      <item.icon className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                      <span className="text-sm font-bold text-gray-700">{item.label}</span>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400">{t("noResults")}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 3. البروفايل واللوجو */}
        <div className="flex items-center gap-2 md:gap-5">
          <div className="hidden sm:flex items-center">
            <LocaleSwitcher />
          </div>

          <div className="h-8 w-px bg-gray-100 hidden sm:block"></div>

          <div className="flex items-center gap-3 cursor-pointer group p-1.5 hover:bg-white hover:shadow-xl hover:shadow-gray-200/40 rounded-[1.3rem] transition-all duration-500 border border-transparent hover:border-gray-50">
            
            <div className="hidden lg:flex flex-col text-start justify-center gap-0.5 min-w-0 order-1">
              <span className="font-black text-gray-900 text-[14px] leading-tight group-hover:text-teal-700 transition-colors truncate">
                {user?.name || "Kamel Mohamed"}
              </span>
              <span className="text-[11px] text-gray-400 font-bold tracking-tight truncate max-w-[150px]">
                {user?.email}
              </span>
            </div>

            <div className="relative w-12 h-12 flex-shrink-0 order-2">
              <div className="w-full h-full rounded-[1.1rem] bg-white flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-teal-100 transition-all duration-500 shadow-sm">
                <img
                  src={user?.image || "/logo.png"}
                  alt="Brand Logo"
                  className={`transition-transform duration-700 ease-in-out ${
                    !user?.image
                      ? "w-full h-full object-contain scale-[2.2] p-1 filter drop-shadow-sm" // تم ضبط الـ Scale لـ 2.2 ليظهر اللوجو بوضوح تام
                      : "w-full h-full object-cover"
                  } group-hover:scale-[2.4]`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}