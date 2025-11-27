"use client";

import Sidebar from "@/app/components/adminview/mainComponent/sidebar";
import Topbar from "@/app/components/adminview/mainComponent/topBar";
import locale from "date-fns/locale/af";
import { LayoutDashboard, Building2, Users, Calendar, CreditCard, BarChart, User } from "lucide-react";
import { useLocale } from "next-intl";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProviderLayout({ children }: Props) {
    const locale = useLocale();
    const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: `/${locale}/admin/dashBoard` },
    { id: "facilities", label: "ALL Facilities", icon: Building2, href: `/${locale}/admin/AllFacilities` },
    { id: "providers", label: "Providers", icon: Users, href: `/${locale}/admin/Providers` },
    { id: "calendar", label: "Calendar", icon: Calendar, href: `/${locale}/admin/Calander` },
    { id: "finance", label: "Finance", icon: CreditCard, href: `/${locale}/admin/Finance` },
    { id: "statistic", label: "Statistic", icon: BarChart, href: `/${locale}/admin/Statistics` },
    { id: "myProfile", label: "My Profile", icon: User, href: "/providerview/statistic" },
  ];
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar (يسار الشاشة) */}
      <Sidebar menuItems={menuItems} name="Admin" />

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