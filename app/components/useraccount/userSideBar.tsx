"use client";

import { useState } from "react";
import { User, BookOpen, MessageCircle, Bookmark, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

interface SidebarProps {
  active: string;
  setActive: (id: string) => void;
}

export default function ProfileSidebar({ active, setActive }: SidebarProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "about", label: t("about"), icon: User },
    { id: "reservations", label: t("reservations"), icon: BookOpen },
    { id: "reviews", label: t("reviews"), icon: MessageCircle },
    { id: "favorites", label: t("favorites"), icon: Bookmark },
  ];

  return (
    <>
     
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 m-2 bg-white text-gray-500 rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        dir={locale === "ar" ? "rtl" : "ltr"}
        className={`
          fixed top-16 ${locale === "ar" ? "right-0" : "left-0"}
          h-screen w-64 bg-white border-gray-200 p-6 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : locale === "ar" ? "translate-x-full" : "-translate-x-full"}
          md:static md:translate-x-0 md:border-r
        `}
      >
        
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-4 ltr:right-4 rtl:left-4 text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold mb-6">{t("title")}</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setActive(id);
                setIsOpen(false); 
              }}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition text-left font-medium
                ${
                  active === id
                    ? "bg-gray-200 text-[#0E766E]"
                    : "text-[#0E766E] hover:bg-gray-100"
                }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}