"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import {
  Search,
  X,
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  CreditCard,
  BarChart,
  User,
  ClipboardList,
} from "lucide-react";
import { useUserStore } from "@/app/store/userStore";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import LocaleSwitcher from "@/app/components/local-switcher";
import { useParams, usePathname } from "next/navigation";

export default function Topbar() {
  const t = useTranslations("Topbar");
  const ts = useTranslations("Sidebar");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { user, isHydrated } = useUserStore();

  const [searchValue, setSearchValue] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  /* ===============================
     Menu Items
  =============================== */
  const isMobile = usePathname().includes("mobile");
  const menuItems = useMemo(() => {
  const role = user?.type?.toLowerCase() === "admin" ? "admin" : "moderator";
  const prefix = isMobile ? `mobile/${role}` : role;
  const basePath = `/${locale}/${prefix}`;

  return [
    { id: "dashboard", label: ts("menu.dashboard"), icon: LayoutDashboard, href: `${basePath}/dashBoard` },
    { id: "facilities", label: ts("menu.facilities"), icon: Building2, href: `${basePath}/AllFacilities` },
    { id: "providers", label: ts("menu.providersNeeds"), icon: ClipboardList, href: `${basePath}/Providers` },
    { id: "users", label: ts("menu.users"), icon: Users, href: `${basePath}/Providers/ProvidersList` },
    { id: "calendar", label: ts("menu.calendar"), icon: Calendar, href: `${basePath}/calender` },
    { id: "finance", label: ts("menu.finance"), icon: CreditCard, href: `${basePath}/Finance` },
    { id: "statistic", label: ts("menu.statistic"), icon: BarChart, href: `${basePath}/statistics` },
  ];
}, [locale, user?.type, isMobile, ts]);

  const filteredResults = menuItems.filter((item) =>
    item.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  /* ===============================
     Click Outside Fix (Mobile Safe)
  =============================== */
  useEffect(() => {
  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    if (!searchRef.current) return;

    const target = event.target as HTMLElement;
    if (searchRef.current.contains(target)) return;

    setShowResults(false);
  };

  document.addEventListener("mousedown", handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    document.removeEventListener("touchstart", handleClickOutside);
  };
}, []);

  if (!isHydrated)
    return <div className="h-20 bg-white border-b border-gray-100 animate-pulse" />;

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
    >
      <div className="flex items-center justify-between h-20 px-4 sm:px-8">

        {/* ===============================
            Greeting
        =============================== */}
        <div className="flex flex-col min-w-[140px]">
          <h1 className="text-lg md:text-xl font-black text-gray-900">
            {t("greeting", { name: user?.name?.split(" ")[0] || t("guest") })}
          </h1>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">
            {t("roleStatus", {
              role: t(`roles.${user?.type?.toLowerCase() || "moderator"}`),
            })}
          </span>
        </div>

        {/* ===============================
            Search (FIXED)
        =============================== */}
        <div
          ref={searchRef}
          className="hidden md:flex relative flex-1 max-w-md mx-8 z-50"
        >
          <div className="relative w-full">
            <Search
              className={`absolute ${
                isRTL ? "right-4" : "left-4"
              } top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400`}
            />

            <input
              type="text"
              value={searchValue}
              onFocus={() => setShowResults(true)}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={t("searchPlaceholder")}
              inputMode="search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              className={`w-full bg-gray-50 border border-gray-100 rounded-2xl ${
                isRTL ? "pr-11 pl-10" : "pl-11 pr-10"
              } py-2.5 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/10 focus:border-teal-600`}
            />

            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className={`absolute ${
                  isRTL ? "left-3" : "right-3"
                } top-1/2 -translate-y-1/2 text-gray-400`}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ===============================
              Results Dropdown
          =============================== */}
          {showResults && searchValue && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="max-h-64 overflow-y-auto p-2">
                {filteredResults.length ? (
                  filteredResults.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setSearchValue("");
                        setShowResults(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-teal-50"
                    >
                      <item.icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-700">
                        {item.label}
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-gray-400">
                    {t("noResults")}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ===============================
            Right Side
        =============================== */}
        <div className="flex items-center gap-4">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}