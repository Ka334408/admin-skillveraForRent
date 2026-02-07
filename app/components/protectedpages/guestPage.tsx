"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import { usePathname } from "@/localization/navigation";
import { useLocale } from "next-intl";

export default function GuestPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUserStore();
  const [loading, setLoading] = useState(true);

  const locale = useLocale()
  const pathname = usePathname();

  const isMobileView = pathname.includes("mobile");
  const isModeratorView = pathname.includes("moderator")



  useEffect(() => {
    const timer = setTimeout(() => {
      if (user.token) {
        if (isMobileView && isModeratorView) {
          router.replace(`/${locale}/mobile/moderator/dashBoard`);
        } else if (isMobileView && !isModeratorView) {
          router.replace(`/${locale}/mobile/admin/dashBoard`);
        } else {
          router.replace(`/${locale}/admin/dashBoard`);
        }
      } else {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [user, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0E766E] animate-bounce">
          SKV Rent
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}