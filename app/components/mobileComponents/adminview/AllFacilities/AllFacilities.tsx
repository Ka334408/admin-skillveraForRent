"use client";

import React from 'react';
import { useTranslations } from "next-intl";
import FacilitiesAreaChart from '../../modertatorView/mainComponent/AreaChart';
import FacilitiesRequestList from '../../modertatorView/mainComponent/Requests';
import UsersInteraction from '../../modertatorView/mainComponent/UserInteractions';
import FacilitiesCards from './FacilitiesCard';

export default function AllFacilities() {
  const t = useTranslations("AllFacilities");

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F9FAFB] min-h-screen font-cairo">
      
      {/* 1. Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
          {t("mainTitle")}
        </h1>
        <p className="text-gray-500 font-bold text-xs md:text-sm uppercase tracking-widest">
          {t("subTitle")}
        </p>
      </div>

      {/* 2. Key Stats Cards (Top) */}
      <section>
        <FacilitiesCards />
      </section>

      {/* 3. Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 
        <div className="xl:col-span-3 transition-all duration-300 hover:shadow-lg rounded-[2rem]">
          <FacilitiesAreaChart />
        </div>
    
        <div className="xl:col-span-2 order-2 xl:order-1 transition-all duration-300 hover:shadow-lg rounded-[2rem]">
          <UsersInteraction />
        </div>

        <div className="xl:col-span-1 order-1 xl:order-2 transition-all duration-300 hover:shadow-lg rounded-[2rem]">
          <FacilitiesRequestList />
        </div>

      </div>

      {/* Spacer for bottom padding */}
      <div className="pb-10"></div>
    </div>
  );
}