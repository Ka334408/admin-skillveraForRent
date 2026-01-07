"use client";

import React from 'react';
import { useTranslations } from "next-intl";

import ProvidersList from './Providerstable';
import RecentProviderRequests from '../../modertatorView/mainComponent/Requests'; // المكون الذي طورناه للتو
import UsersInteraction from '../../modertatorView/mainComponent/UserInteractions';
import StatsCards from '../../adminview/mainComponent/statsCards';

export default function Providers() {
  const t = useTranslations("ProvidersPage");

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F9FAFB] min-h-screen font-cairo">
      
      {/* 1. Header Section - عنوان الصفحة */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          {t("mainTitle")}
        </h1>
        <p className="text-gray-500 font-bold text-xs md:text-sm uppercase tracking-widest">
          {t("subTitle")}
        </p>
      </div>

      <section>
        <StatsCards />
      </section>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        

        <div className="xl:col-span-3 bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-1"> 
            <ProvidersList />
          </div>
        </div>
        
        <div className="xl:col-span-2 transition-all duration-300 hover:shadow-lg">
          <UsersInteraction />
        </div>

        <div className="xl:col-span-1 transition-all duration-300 hover:shadow-lg">
          <RecentProviderRequests />
        </div>

      </div>

      {/* Bottom Spacer */}
      <div className="pb-10"></div>
    </div>
  );
}