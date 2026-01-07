"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Clock, AlertTriangle, CalendarDays, TrendingUp } from "lucide-react";
import axiosInstance from '@/lib/axiosInstance';
import { useTranslations, useLocale } from "next-intl";

const PRIMARY_TEAL = "#0E766E";

interface ApiChartData {
  month: number;
  count: number;
}

interface FormattedChartData {
  name: string;
  reservations: number;
}

export default function MonthlyReservationsChart() {
  const t = useTranslations("ReservationsChart");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const [chartData, setChartData] = useState<FormattedChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard-facility/reservations-chart');

        if (data?.data && Array.isArray(data.data)) {
          const formattedData: FormattedChartData[] = data.data.map((item: ApiChartData) => ({
            name: new Date(2000, item.month - 1, 1).toLocaleString(locale, { month: 'short' }),
            reservations: item.count,
          }));
          setChartData(formattedData);
        }
      } catch (err: any) {
        setErrorMessage(err.response?.status === 403 ? t("forbidden") : t("error"));
      } finally {
        setLoading(false);
      }
    };
    fetchChartData();
  }, [t, locale]);

  if (loading) return (
    <div className="w-full p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse h-64 flex flex-col justify-center items-center">
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

    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 w-full">
      
    
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-4 border-b border-gray-50 pb-4">
        <div className="flex items-center gap-4">
       
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">{t("title")}</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{t("subtitle")}</p>
            </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="text-gray-400 font-bold text-sm text-center py-10 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
          {t("noData")}
        </div>
      ) : (
       
        <div className="h-56 w-full"> 
         
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: -25, bottom: 0 }}
              barGap={8}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                reversed={isRTL}
                style={{ fontSize: '10px', fontWeight: 'black', fill: '#9CA3AF' }}
                dy={8}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                orientation={isRTL ? "right" : "left"}
                style={{ fontSize: '10px', fontWeight: 'black', fill: '#9CA3AF' }}
              />
              <Tooltip 
                cursor={{ fill: '#F9FAFB', radius: 10 }}
                contentStyle={{ 
                    borderRadius: '12px', 
                    padding: '8px',
                    fontSize: '12px'
                }}
              />
              <Bar
                dataKey="reservations"
                radius={[6, 6, 6, 6]} 
                barSize={28}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === chartData.length - 1 ? PRIMARY_TEAL : '#E5E7EB'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}


      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">
            {t("updateNotice")}
        </span>
      </div>
    </div>
  );
}