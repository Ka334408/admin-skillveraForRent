"use client";

import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';
import 'moment/locale/ar';
import { Clock, AlertTriangle, Filter, BarChart as BarChartIcon, ChevronDown, Calendar } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const PRIMARY_TEAL = "#0E766E";
const BAR_LIGHT = "#E5E7EB"; 

interface ApiChartData {
  month: number;
  count: number;
}

interface Point {
  month: string;
  value: number;
  originalMonth: number;
}

export default function ReservationChartWrapper() {
  const t = useTranslations("ReservationsFinanceChart");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  
  moment.locale(locale);

  const [rawApiData, setRawApiData] = useState<Point[]>([]);
  const [filterRange, setFilterRange] = useState<number>(12); 
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard-facility/reservations-chart');
        if (data?.data && Array.isArray(data.data)) {
          const formatted = data.data.map((item: ApiChartData) => ({
            month: moment().month(item.month - 1).format('MMM'),
            value: item.count,
            originalMonth: item.month
          })).sort((a: any, b: any) => a.originalMonth - b.originalMonth);
          
          setRawApiData(formatted);
        }
      } catch (err: any) {
        setErrorMessage(err.response?.status === 403 ? t("forbidden") : t("error"));
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [t]);

  const filteredData = useMemo(() => {
    return rawApiData.slice(-filterRange);
  }, [rawApiData, filterRange]);

  const filterOptions = [
    { label: t("last3Months"), value: 3 },
    { label: t("last6Months"), value: 6 },
    { label: t("lastYear"), value: 12 },
  ];

  if (loading) return (
    <div className="w-full p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse h-80 flex flex-col justify-center items-center">
      <Clock className="w-8 h-8 text-gray-200 animate-spin mb-2" />
      <div className="h-4 bg-gray-100 w-40 rounded-full" />
    </div>
  );

  if (errorMessage) return (
    <div className="w-full p-8 bg-rose-50 border border-rose-100 text-rose-700 rounded-[2rem] text-center font-bold flex items-center justify-center gap-2">
      <AlertTriangle className="w-5 h-5" /> {errorMessage}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-50 pb-5">
        <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                <BarChartIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-900">{t("title")}</h3>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t("subtitle")}</p>
            </div>
        </div>

        {/* Filter Dropdown */}
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
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis 
              dataKey="month" 
              tickLine={false} 
              axisLine={false} 
              reversed={isRTL}
              style={{ fontSize: '11px', fontWeight: 'bold', fill: '#9CA3AF' }} 
              dy={10} 
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              orientation={isRTL ? "right" : "left"}
              style={{ fontSize: '11px', fontWeight: 'bold', fill: '#9CA3AF' }} 
            />
            <Tooltip
              cursor={{ fill: '#F9FAFB', radius: 12 }}
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', direction: isRTL ? 'rtl' : 'ltr' }}
              labelStyle={{ fontWeight: 'black', marginBottom: '4px', color: '#111827' }}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]} barSize={30}>
              {filteredData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === filteredData.length - 1 ? PRIMARY_TEAL : BAR_LIGHT}
                  className="hover:fill-[#0E766E] transition-all duration-300 cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-8 pt-6 border-t border-gray-50">
        
      </div>
    </div>
  );
}