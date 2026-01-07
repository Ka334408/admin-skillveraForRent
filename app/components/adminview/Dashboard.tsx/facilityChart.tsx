"use client";

import { Filter, ChevronDown, TrendingUp, BarChart } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import axiosInstance from '@/lib/axiosInstance';

interface FacilityChartDataPoint {
    month: string;
    count: number;
}

// ألوان متناسقة مع ألوان الكروت والسايدبار
const THEME_COLOR = "#0E766E"; // Teal الأساسي
const GRID_COLOR = "#F3F4F6";

export default function FacilityChart() {
    const t = useTranslations("FacilityChart");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const router = useRouter();
    const pathname=usePathname();
    const isModeratorView = pathname.includes("moderator"); 

    const [chartData, setChartData] = useState<FacilityChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filterActive, setFilterActive] = useState('6_months');

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const { data } = await axiosInstance.get('/dashboard-dashboard/facilities-chart');

                if (data?.data) {
                    // مصفوفة الشهور بناءً على اللغة
                    const monthLabels = isRTL 
                        ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر']
                        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    const formattedData = data.data.map((item: any) => ({
                        month: monthLabels[item.month - 1] || item.month.toString(),
                        count: item.count,
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
    }, [isRTL, t]);

    const handleViewAll = () => {
        isModeratorView?
        router.push(`/${locale}/moderator/AllFacilities/FacilitiesList`)
        :router.push(`/${locale}/admin/AllFacilities/FacilitiesList`)
        ;
    };

    if (loading) return (
        <div className="w-full p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm animate-pulse h-[450px] flex flex-col">
            <div className="h-8 w-48 bg-gray-100 rounded-full mb-6"></div>
            <div className="flex-1 bg-gray-50 rounded-3xl"></div>
        </div>
    );

    if (errorMessage) return (
        <div className="w-full p-8 bg-rose-50 border border-rose-100 text-rose-700 rounded-[2rem] text-center font-bold">
            {errorMessage}
        </div>
    );

    return (
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 h-full">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="font-black text-xl text-gray-900">{t("title")}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tight mt-1">{t("subtitle")}</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-gray-200 hover:bg-black transition-all flex items-center gap-2"
                        onClick={handleViewAll}
                    >
                        {t("viewAll")}
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME_COLOR} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={THEME_COLOR} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
                        <XAxis 
                            dataKey="month" 
                            tickLine={false} 
                            axisLine={false} 
                            reversed={isRTL}
                            style={{ fontSize: '11px', fontWeight: 'bold', fill: '#9CA3AF' }} 
                        />
                        <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            orientation={isRTL ? "right" : "left"}
                            style={{ fontSize: '11px', fontWeight: 'bold', fill: '#9CA3AF' }} 
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                fontFamily: 'inherit'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={THEME_COLOR}
                            strokeWidth={4}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            dot={{ stroke: THEME_COLOR, strokeWidth: 2, r: 4, fill: '#fff' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-400">
                    <BarChart className="w-4 h-4" />
                    <span className="text-[11px] font-bold uppercase tracking-tighter">{t("footerNote")}</span>
                </div>
                
                <div className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                    <TrendingUp className="w-3 h-3 mr-1 ml-1" />
                    <span className="text-[10px] font-black uppercase">
                        {(chartData[chartData.length - 1]?.count || 0) >= (chartData[0]?.count || 0) ? t("trendPositive") : t("trendStable")}
                    </span>
                </div>
            </div>
        </div>
    );
}