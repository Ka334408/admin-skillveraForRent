"use client";

import { useTranslations } from "next-intl";
import StatsCards from "@/app/components/adminview/mainComponent/statsCards";
import RequestFeedBack from "../mainComponent/RequestFeedBack";
import FacilityChart from "./facilityChart";

export default function DashboardHome() {
    const t = useTranslations("Home");

    return (
        <div className="p-4 md:p-8 space-y-10 bg-[#F9FAFB] min-h-screen font-cairo">
            
            {/* ---------- Header Section ---------- */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                    {t("welcomeTitle")}
                </h1>
                <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">
                    {t("welcomeSubtitle")}
                </p>
            </div>

            {/* ---------- 1. Top Section: Statistics Cards ---------- */}
            <section aria-label="Statistics Summary">
                <StatsCards />
            </section>

            {/* ---------- 2. Middle Section: Growth Chart ---------- */}
            <section className="grid grid-cols-1 gap-6" aria-label="Activity Chart">
                <div className="transition-all duration-500 hover:shadow-2xl">
                    <FacilityChart />
                </div>
            </section>

            {/* ---------- 3. Bottom Section: Lists & Interactions ---------- */}
            <section aria-label="Requests and Feedback">
                <RequestFeedBack 
                    feedBack="block shadow-lg" 
                    request="block shadow-lg" 
                />
            </section>

            {/* Footer space */}
            <div className="pb-10"></div>
        </div>
    );
}