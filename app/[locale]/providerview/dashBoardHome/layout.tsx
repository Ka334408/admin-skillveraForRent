"use client";

import ProviderSidebar from "@/app/components/providerview/sidebar";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProviderLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <ProviderSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}