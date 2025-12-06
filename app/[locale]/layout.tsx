// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import AOSProvider from "../components/AOSProvider";
import ThemeProvider from "../components/ThemeProvider";
import "../globals.css";


const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
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