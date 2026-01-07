// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Cairo } from "next/font/google"; // تغيير الخط هنا
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import AOSProvider from "../components/AOSProvider";
import ThemeProvider from "../components/ThemeProvider";
import "../globals.css";

// إعداد خط Cairo مع الأوزان التي قد تحتاجها
const cairo = Cairo({ 
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Skillvera",
  description: "This is a localization example",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      {/* تطبيق الخط على الـ body */}
      <body className={cairo.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AOSProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">{children}</main>
                <div></div>
              </div>
            </ThemeProvider>
          </AOSProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}