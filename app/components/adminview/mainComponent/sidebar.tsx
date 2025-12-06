"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Calendar,
  CreditCard,
  BarChart,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Users,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { useLocale } from "next-intl";

export default function Sidebar({menuItems,name}:{menuItems :any[],name:any}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { user, isHydrated } = useUserStore();

  if (!isHydrated) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  const finalUser = {
    name: user?.name || "User",
  };



  const bottomItems = [
    { id: "support", label: "Support", icon: HelpCircle, href: "/providerview/support" },
    { id: "settings", label: "Settings", icon: Settings, href: "/providerview/settings" },
  ];

  const isActive = (href: string) => pathname.toLowerCase() === href.toLowerCase();

  const handleLogout = () => {
    router.push(`/${locale}/auth/login`);
  };

  return (
    <>
      {/* زرار الموبايل */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 m-2 bg-white text-gray-500 rounded-lg fixed top-2 left-2 z-50 shadow"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-gray-200 p-6 z-50
          flex flex-col justify-between
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:border-r
        `}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 right-4 text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center gap-3 mb-6 mt-4">
          <User className="w-7 h-7 text-[#0E766E]" />
          { (
            <h2 className="text-xl font-bold">
              {finalUser.name}
            </h2>
          )}
        </div>

          <p className="mb-5 border-t-2 border-t-[#0E766E]" />

          {/* Main Menu */}
          <nav className="flex flex-col gap-2 mb-6">
            {menuItems.map(({ id, label, icon: Icon, href }) => (
              <Link
                key={id}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium
                  ${
                    isActive(href)
                      ? "text-[#0E766E] bg-blue-100"
                      : "hover:bg-gray-100 text-gray-700"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive(href) ? "text-[#0E766E]" : "text-gray-500"
                  }`}
                />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 🔹 الجزء السفلي */}
        <div className="flex flex-col gap-2 mt-auto">
          {bottomItems.map(({ id, label, icon: Icon, href }) => (
            <Link
              key={id}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium
                ${
                  isActive(href)
                    ? "text-[#0E766E] bg-blue-100"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive(href) ? "text-[#0E766E]" : "text-gray-500"
                }`}
              />
              {label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl transition text-left font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}