"use client";

import Sidebar from "@/app/components/adminview/mainComponent/sidebar";
import Topbar from "@/app/components/adminview/mainComponent/topBar";
import locale from "date-fns/locale/af";
import { LayoutDashboard, Building2, Users, Calendar, CreditCard, BarChart, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProviderLayout({ children }: Props) {
    const locale = useLocale();
    const ts = useTranslations("Sidebar");
    const menuItems = [
    { id: "dashboard", label: ts("menu.dashboard"), icon: LayoutDashboard, href: `/${locale}/admin/dashBoard` },
    { id: "facilities", label: ts("menu.facilities"), icon: Building2, href: `/${locale}/admin/AllFacilities` },
    { id: "providers", label: ts("menu.providers"), icon: Users, href: `/${locale}/admin/Providers` },
    { id: "calendar", label: ts("menu.calendar"), icon: Calendar, href: `/${locale}/admin/calender` },
    { id: "finance", label: ts("menu.finance"), icon: CreditCard, href: `/${locale}/admin/Finance` },
    { id: "statistic", label: ts("menu.statistic"), icon: BarChart, href: `/${locale}/admin/Statistics` },
  ];
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar (يسار الشاشة) */}
      <Sidebar menuItems={menuItems} />

      {/* يمين الشاشة: Topbar + main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">

        {/* Topbar */}
        <Topbar />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>

      </div>
    </div>
  );
}