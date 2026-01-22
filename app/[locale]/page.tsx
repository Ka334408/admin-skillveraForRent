"use client";
import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";

export default function HomePage() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const hostname = window.location.hostname;

        if (hostname.includes("mobile")) {
            router.replace(`/${locale}/mobile/auth/login`);
        } else {
            router.replace(`/${locale}/auth/login`);
        }
    }, [locale, router]);

    return null; 
}