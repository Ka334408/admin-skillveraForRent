"use client";

import { usePathname, useRouter } from "@/localization/navigation";
import { locales } from "@/localization/config";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, Check, ChevronDown } from "lucide-react";

interface topBarProps {
  bgColor?: string;
  iconWidth?: string;
  iconHeight?: string;
  enableLabel?: string;
  enableFlag?: string;
}

export default function LocaleSwitcher({
  bgColor = "bg-gray-50",
  iconHeight = "h-4",
  iconWidth = "w-4",
  enableLabel = "block",
  enableFlag = "block",
}: topBarProps) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: string) => {
    router.replace({ pathname }, { locale: nextLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button 
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all duration-200 group outline-none
            ${bgColor} hover:bg-gray-100 border border-transparent hover:border-gray-200`}
        >
          {/* العلم الحالي */}
          <div className={`relative w-5 h-5 overflow-hidden rounded-full border border-gray-200 ${enableFlag}`}>
            <Image
              src={`/locale/${locale}.svg`}
              alt={locale}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <span className={`text-[13px] font-bold text-gray-700 group-hover:text-[#0E766E] transition-colors ${enableLabel}`}>
            {locale.toUpperCase()}
          </span>

          <ChevronDown className={`${iconWidth} ${iconHeight} text-gray-400 group-hover:text-[#0E766E] transition-all`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-48 bg-white border border-gray-100 rounded-2xl shadow-xl p-1.5 animate-in fade-in zoom-in-95 duration-200 z-[60]"
      >
        <div className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
          {t("select_language")}
        </div>

        {locales.map((cur) => (
          <DropdownMenuItem
            key={cur}
            onClick={() => handleLocaleChange(cur)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer mb-1 transition-all outline-none
              ${cur === locale
                ? "bg-teal-50 text-[#0E766E]"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
          >
            <div className="relative w-5 h-5 overflow-hidden rounded-full border border-gray-100">
              <Image
                src={`/locale/${cur}.svg`}
                alt={cur}
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-sm font-bold flex-1">
              {t("locale", { locale: cur })}
            </span>
            
            {cur === locale && <Check size={14} className="text-[#0E766E] animate-in zoom-in" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}