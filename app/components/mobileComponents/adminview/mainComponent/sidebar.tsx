"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  ArrowRightLeft,
} from "lucide-react";
import { useUserStore } from "@/app/store/userStore";
import { useLocale, useTranslations } from "next-intl";

export default function Sidebar({ menuItems }: { menuItems: any[] }) {
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const { user, isHydrated, logout } = useUserStore();

  if (!isHydrated) return null;

  const isMobileView = pathname.includes("mobile");

  const isActive = (href: string) => {
    const normalize = (path: string) => path.replace(new RegExp(`^/${locale}`), "") || "/";
    return normalize(pathname) === normalize(href);
  };

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/auth/login`);
  };

  const bottomItems = [
    { id: "support", label: t("support"), icon: HelpCircle, href: `/${locale}/providerview/support` },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden mt-20 p-2.5 m-2 bg-white text-gray-500 rounded-xl fixed top-2 ${isRTL ? "right-2" : "left-2"} z-50 shadow-sm border border-gray-100`}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      <aside
        dir={isRTL ? "rtl" : "ltr"}
        className={`
          fixed top-0 ${isRTL ? "right-0" : "left-0"} h-screen w-72 bg-white border-gray-200 p-6 z-50
          flex flex-col justify-between transform transition-transform duration-300 ease-in-out overflow-hidden
          ${isOpen ? "translate-x-0" : isRTL ? "translate-x-full" : "-translate-x-full"}
          md:static md:translate-x-0 md:border-r md:border-l-0
        `}
      >
        <button onClick={() => setIsOpen(false)} className={`md:hidden absolute top-6 ${isRTL ? "left-6" : "right-6"} text-gray-400`}>
          <X className="w-6 h-6" />
        </button>

        {/* الجزء العلوي - اللوجو والتابات */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 mb-6 mt-2 px-2">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-[#0E766E]" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <h2 className="text-sm font-black text-gray-800 truncate leading-none mb-1">
                {user?.name || t("defaultUser")}
              </h2>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate">
                {user?.email || "staff@system.com"}
              </span>
            </div>
          </div>
          
          <nav className="flex flex-col gap-1">
            {menuItems.map(({ id, label, icon: Icon, href }) => (
              <Link
                key={id}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm
                  ${isActive(href) ? "text-[#0E766E] bg-teal-50 border border-teal-100/30" : "hover:bg-gray-50 text-gray-500 hover:text-gray-900"}
                `}
              >
                <Icon className={`w-5 h-5 ${isActive(href) ? "text-[#0E766E]" : "text-gray-400"}`} />
                <span className="truncate">{t(`menu.${id}`) || label}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="py-4">
          <Link
            href={isMobileView ? `/${locale}/auth/login` : `/${locale}/mobile/moderator/AllFacilities`}
            className="flex items-center justify-between p-3.5 bg-green-900 rounded-xl hover:bg-black transition-all group shadow-md border border-white/5"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg group-hover:rotate-12 transition-transform">
                <ArrowRightLeft className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex flex-col text-start">
                <span className="text-[10px] font-bold text-gray-400 leading-none mb-1">
                  {t("switch_to")}
                </span>
                <span className="text-[13px] font-black text-white uppercase tracking-tight">
                  {isMobileView ? t("web_site_mode") : t("mobile_app_mode")}
                </span>
              </div>
            </div>
            
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </div>
          </Link>
        </div>

        {/* الجزء السفلي - الإعدادات والخروج */}
        <div className="flex flex-col gap-1 pt-4 border-t border-gray-50">
          {bottomItems.map(({ id, label, icon: Icon, href }) => (
            <Link
              key={id}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm
                ${isActive(href) ? "text-[#0E766E] bg-teal-50" : "hover:bg-gray-50 text-gray-500 hover:text-gray-900"}
              `}
            >
              <Icon className={`w-5 h-5 ${isActive(href) ? "text-[#0E766E]" : "text-gray-400"}`} />
              {label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-sm text-rose-600 hover:bg-rose-50 mt-1"
          >
            <LogOut className="w-5 h-5" />
            {t("logout")}
          </button>
        </div>
      </aside>
    </>
  );
}