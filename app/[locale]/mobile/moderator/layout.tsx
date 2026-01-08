"use client";

import Sidebar from "@/app/components/mobileComponents/adminview/mainComponent/sidebar";
import Topbar from "@/app/components/mobileComponents/adminview/mainComponent/topBar";
import ProtectedPage from '@/app/components/protectedpages/protectedPage'
import locale from "date-fns/locale/af";
import { LayoutDashboard, Building2, Users, Calendar, CreditCard, BarChart, User, ClipboardList } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProviderLayout({ children }: Props) {
  const locale = useLocale();
  const ts = useTranslations("Sidebar");
  const menuItems = [
    { id: "dashboard", label: ts("menu.dashboard"), icon: LayoutDashboard, href: `/${locale}/mobile/moderator/dashBoard` },
    { id: "facilities", label: ts("menu.facilities"), icon: Building2, href: `/${locale}/mobile/moderator/AllFacilities` },
    { id: "providers", label: ts("menu.providersNeeds"), icon: ClipboardList, href: `/${locale}/mobile/moderator/Providers` },
    { id: "Users", label: ts("menu.users"), icon: Users, href: `/${locale}/mobile/moderator/Providers/ProvidersList` },
    { id: "calendar", label: ts("menu.calendar"), icon: Calendar, href: `/${locale}/mobile/moderator/calender` },
    { id: "finance", label: ts("menu.finance"), icon: CreditCard, href: `/${locale}/mobile/moderator/Finance` },
    { id: "statistic", label: ts("menu.statistic"), icon: BarChart, href: `/${locale}/mobile/moderator/statistics` },
  ];
  return (
    <div className="flex min-h-screen">

      {/* Sidebar (يسار الشاشة) */}
      <Sidebar menuItems={menuItems} />

      {/* يمين الشاشة: Topbar + main content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-50">

        {/* Topbar */}
        <Topbar />

        {/* Main content (protected) */}
        <main className="flex-1 p-6 bg-gray-50">
          <ProtectedPage>
            {children}
          </ProtectedPage>
        </main>

      </div>
    </div>
  );
}