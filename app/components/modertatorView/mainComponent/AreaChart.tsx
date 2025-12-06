"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChevronDown, Filter, Clock, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment'; // Using moment for date formatting

// Define the primary color for reusability
const PRIMARY_TEAL = "#0E766E";

// --- Interface Definitions ---
interface ApiChartData {
  period_start: string;
  count: number;
}

interface FormattedChartData {
  month: string;
  value: number;
}

// --- Component ---

export default function FacilitiesAreaChart() {
  const [chartData, setChartData] = useState<FormattedChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const locale = useLocale();

  // ----------------------
  // 1. Data Fetching and Formatting
  // ----------------------
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard-facility/chart');

        if (data?.data && Array.isArray(data.data)) {
          // Map API response to chart data format
          const formattedData: FormattedChartData[] = data.data.map((item: ApiChartData) => ({
            // Format the ISO date string to MMM YYYY (e.g., Oct 2025)
            month: moment(item.period_start).format('MMM YY'),
            value: item.count,
          }));
          setChartData(formattedData);
        } else {
          setErrorMessage("Received unexpected data format from the API.");
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

  // ----------------------
  // 2. Navigation Handler
  // ----------------------
  const handleViewAll = () => {
    const role = localStorage.getItem("name") === "admin" ? "admin" : "moderator";
    router.push(`/${locale}/${role}/AllFacilities/FacilitiesList`);
  };

  // ----------------------
  // 3. Loading and Error States
  // ----------------------
  if (loading) {
    return (
      <div className="w-full p-8 bg-white rounded-2xl shadow-xl animate-pulse h-80 flex items-center justify-center">
        <Clock className="w-6 h-6 mr-2 text-gray-500 animate-spin" />
        <span className="text-gray-500">Loading facility trend data...</span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center font-semibold shadow-md flex items-center justify-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-xl font-extrabold text-gray-800">Facility Registration Trend</h3>

        <button className="flex items-center gap-1 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-xl text-sm hover:bg-gray-100 transition">
          <Filter className="w-4 h-4 text-gray-500" />
          <span>All Time</span> {/* Changed 'All' to 'All Time' for clarity */}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={PRIMARY_TEAL} stopOpacity={0.4} />
                <stop offset="95%" stopColor={PRIMARY_TEAL} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} style={{ fontSize: '12px', fill: '#6B7280' }} />
            {/* Tooltip customized for cleaner look */}
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelFormatter={(label) => `Month: ${label}`}
              formatter={(value: number) => [`${value} Facilities`, 'New Registrations']}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke={PRIMARY_TEAL}
              strokeWidth={3}
              fill="url(#colorShade)"
              dot={{ stroke: PRIMARY_TEAL, strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
        <button className={`text-sm font-medium text-[${PRIMARY_TEAL}] hover:text-[#07534e] transition`} onClick={handleViewAll}>
          View all Facilities →
        </button>
      </div>
    </div>
  );
}