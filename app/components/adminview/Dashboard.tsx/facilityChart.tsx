"use client";

import { Filter, ChevronDown, TrendingUp, BarChart } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'; // Switched to AreaChart for better visual impact
import axiosInstance from '@/lib/axiosInstance';

interface FacilityChartDataPoint {
    month: number | string;
    count: number;
}

// Define the main colors
const THEME_COLOR = "#0E766E"; // Teal
const ACCENT_COLOR = "#34D399"; // Green (for trend)

export default function FacilityChart() {
    const [chartData, setChartData] = useState<FacilityChartDataPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [filterActive, setFilterActive] = useState('Last 6 Months'); // State for active filter

    const router = useRouter();
    const locale = useLocale();

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const { data } = await axiosInstance.get('/dashboard-dashboard/facilities-chart');

                if (data?.data) {
                    // Map month numbers to readable labels for better display
                    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

                    const formattedData = data.data.map((item: any) => ({
                        month: monthLabels[item.month - 1] || item.month.toString(), // Convert month number to string/label
                        count: item.count,
                    }));
                    setChartData(formattedData);
                }
            } catch (err: any) {
                console.error('Error fetching facilities chart:', err);
                if (err.response?.status === 403) {
                    setErrorMessage("You are not allowed to see this section.");
                } else {
                    setErrorMessage("Failed to load chart data.");
                }
                setChartData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    // Handler for navigation to the full list
    const handleViewAll = () => {
        // Note: LocalStorage is generally discouraged for state management; consider using Redux/Zustand or API for role check.
        const role = localStorage.getItem("name") === "admin" ? "admin" : "moderator";
        router.push(`/${locale}/${role}/AllFacilities/FacilitiesList`);
    };

    // --- Components for Visual Feedback ---

    // 1. Loading Skeleton
    if (loading) {
        return (
            <div className="w-full p-8 bg-white rounded-2xl shadow-xl animate-pulse h-80 flex flex-col justify-between">
                <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
                <div className="flex-1 bg-gray-100 rounded-lg"></div>
            </div>
        );
    }

    // 2. Error Message
    if (errorMessage) {
        return (
            <div className="w-full p-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center font-semibold shadow-md">
                {errorMessage}
            </div>
        );
    }

    // 3. The Filter Dropdown (Mocked)
    const FilterDropdown = () => {
        const filters = ['Last 6 Months', 'Last 12 Months', 'This Year'];
        const [open, setOpen] = useState(false);

        return (
            <div className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 
                             ${open ? `bg-[${THEME_COLOR}] text-white` : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                    <Filter className="w-4 h-4" />
                    <span>{filterActive}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {open && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-1">
                        {filters.map(f => (
                            <button
                                key={f}
                                onClick={() => { setFilterActive(f); setOpen(false); /* Re-fetch data logic here */ }}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${filterActive === f ? `bg-[${THEME_COLOR}] text-white` : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }

    // --- Main Component Render ---
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
            {/* Chart Header */}
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div className='flex flex-col'>
                    <h3 className="font-extrabold text-2xl text-gray-900">Facility Growth</h3>
                    <p className="text-sm text-gray-500 mt-1">New facility registrations over time.</p>
                </div>

                <div className="flex items-center gap-3">
                    <FilterDropdown />
                    <button
                        className={`bg-[${THEME_COLOR}] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-md hover:bg-[#07534e] transition`}
                        onClick={handleViewAll}
                    >
                        View All Facilities
                    </button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            {/* Define gradient for the area fill */}
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={THEME_COLOR} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={THEME_COLOR} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="4 4" stroke="#E5E7EB" vertical={false} /> {/* Light, horizontal-only grid */}
                        <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: '12px', fill: '#6B7280' }} />
                        <YAxis tickLine={false} axisLine={false} style={{ fontSize: '12px', fill: '#6B7280' }} />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke={THEME_COLOR}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                            dot={{ stroke: THEME_COLOR, strokeWidth: 2, r: 4 }} // Highlight data points
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Footer/Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                <p className="text-gray-600 flex items-center gap-1">
                    <BarChart className="w-4 h-4 text-gray-400" />
                    Showing facility counts by registration month.
                </p>
                <div className="flex items-center font-semibold text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {(chartData[chartData.length - 1]?.count || 0) > (chartData[0]?.count || 0) ? 'Positive Trend' : 'Stable'}
                </div>
            </div>
        </div>
    );
}