"use client";

import { useLocale } from "next-intl";

export default function HomePage() {

    const locale = useLocale();

   return (

        <main
            dir={locale === "ar" ? "rtl" : "ltr"}
        >

        </main>
    );
}