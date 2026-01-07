// app/[locale]/layout.tsx
import type { Metadata } from "next";
import { Cairo, Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import AOSProvider from "../components/AOSProvider";
import ThemeProvider from "../components/ThemeProvider";
import "../globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter', 
});

const cairo = Cairo({ 
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "admin-SKVrent",
  description: "This is a localization example",
  icons: {
    icon: "/logo.png", // Path to your favicon in public folder
    apple: "/logo.png", // Optional: for iOS devices
  },
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
      <body className={`${locale === 'ar' ? cairo.className : inter.className} antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AOSProvider>
            <ThemeProvider>
              <div className="flex flex-col min-h-screen">
                <main className="flex-1">{children}</main>
              </div>
            </ThemeProvider>
          </AOSProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}