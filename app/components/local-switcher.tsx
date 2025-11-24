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
import { Globe } from "lucide-react";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (nextLocale: string) => {
    router.replace(

      { pathname },
      { locale: nextLocale }
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0E766E] hover:bg-white hover:text-black transition w-full text-white mt-2">
          <Image
            src={`/locale/${locale}.svg`}
            alt={locale}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="capitalize">{t("locale", { locale })}</span>
          <Globe className="w-4 h-4 ml-auto" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 bg-[#0E766E] text-black rounded-2xl shadow-xl p-2 text-lg"
      >
        {locales.map((cur) => (
          <DropdownMenuItem
            key={cur}
            onClick={() => handleLocaleChange(cur)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer ${cur === locale
                ? "bg-white text-black font-semibold"
                : "bg-[#0E766E] hover:bg-[#0E766E]"
              }`}
          >
            <Image
              src={`/locale/${cur}.svg`}
              alt={cur}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="capitalize">{t("locale", { locale: cur })}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}