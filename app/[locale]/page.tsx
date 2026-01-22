"use client";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { redirect, usePathname, useRouter } from "next/navigation";


export default function HomePage() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const isMobileView = pathname.includes("mobile");

    if (isMobileView) {
        redirect(`/${locale}/mobile/auth/login`);
    } else  {
        redirect(`/${locale}/auth/login`)
    }
}