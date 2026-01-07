"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChevronDown, Filter, Clock, AlertTriangle, TrendingUp, Calendar } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState, useMemo } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';
import 'moment/locale/ar';

const PRIMARY_TEAL = "#0E766E";

export default function FacilitiesAreaChart() {
  const t = useTranslations("FacilityAreaChart");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const pathname = usePathname();

  const router = useRouter();

  moment.locale(locale);

  const [rawApiData, setRawApiData] = useState<any[]>([]);
  const [filterRange, setFilterRange] = useState<number>(12);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isModeratorView = pathname.includes("moderator");


  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard-facility/chart');
        if (data?.data) {
          setRawApiData(data.data);
        }
      } catch (err: any) {
        setErrorMessage(err.response?.status === 403 ? t("forbidden") : t("error"));
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [t]);

  const chartData = useMemo(() => {
    if (!rawApiData.length) return [];

    const slicedData = rawApiData.slice(-filterRange);

    return slicedData.map((item) => ({
      month: moment(item.period_start).format('MMM YY'),
      value: item.count,
    }));
  }, [rawApiData, filterRange]);

  const filterOptions = [
    { label: t("last3Months"), value: 3 },
    { label: t("last6Months"), value: 6 },
    { label: t("lastYear"), value: 12 },
  ];

  if (loading) return (
    <div className="w-full p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse h-80 flex flex-col justify-center items-center">
      <Clock className="w-8 h-8 text-gray-200 animate-spin mb-2" />
      <div className="h-4 bg-gray-100 w-32 rounded-full" />
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-50 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">{t("title")}</h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t("subtitle")}</p>
          </div>
        </div>

        {/* Custom Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="group flex items-center gap-2 bg-gray-50 text-gray-900 px-5 py-2.5 rounded-2xl text-xs font-black hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
          >
            <Filter className="w-3.5 h-3.5 text-teal-600" />
            <span>{filterOptions.find(opt => opt.value === filterRange)?.label}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFilterOpen && (
            <div className="absolute top-full mt-2 right-0 w-48 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setFilterRange(opt.value);
                    setIsFilterOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-colors ${filterRange === opt.value ? 'bg-teal-50 text-teal-700' : 'hover:bg-gray-50 text-gray-600'}`}
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart Area */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PRIMARY_TEAL} stopOpacity={0.2} />
                <stop offset="95%" stopColor={PRIMARY_TEAL} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} reversed={isRTL} style={{ fontSize: '11px', fontWeight: 'bold', fill: '#9CA3AF' }} dy={10} />
            <YAxis tickLine={false} axisLine={false} orientation={isRTL ? "right" : "left"} style={{ fontSize: '11px', fontWeight: 'bold', fill: '#9CA3AF' }} />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', direction: isRTL ? 'rtl' : 'ltr' }}
              labelStyle={{ fontWeight: 'black', marginBottom: '4px', color: '#111827' }}
            />
            <Area type="monotone" dataKey="value" stroke={PRIMARY_TEAL} strokeWidth={4} fillOpacity={1} fill="url(#colorTeal)" dot={{ stroke: PRIMARY_TEAL, strokeWidth: 2, r: 4, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: PRIMARY_TEAL }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-[11px] font-black text-gray-400 uppercase tracking-tighter">{t("growthTrend")}</span>
        </div>
        <button className="text-xs font-black text-[#0E766E] hover:underline flex items-center gap-1 group" 
        onClick={() => {isModeratorView ? router.push(`/${locale}/moderator/AllFacilities/FacilitiesList`): router.push(`/${locale}/admin/AllFacilities/FacilitiesList`)}}>
          {t("viewAll")} <span className={`transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`}>→</span>
        </button>
      </div>
    </div>
  );
}