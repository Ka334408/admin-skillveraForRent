"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import { useLocale } from "next-intl";
import { ro } from "date-fns/locale";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUserStore();
  const [loading, setLoading] = useState(true);
  const locale = useLocale()
  const pathname = usePathname();

  const isMobileView = pathname.includes("mobile");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user.token) {
        if (isMobileView) {
          router.replace(`/${locale}/mobile/auth/login`);
        }
        else {
          router.replace(`/${locale}/auth/login`);
        }

      } else {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [user, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0E766E] animate-bounce">
          SKV Rent
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}