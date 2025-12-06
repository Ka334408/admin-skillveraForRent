"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';
import { Clock, AlertTriangle, Filter, BarChart as BarChartIcon } from "lucide-react";
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
import { useLocale } from "next-intl";

// Define constants
const API_RESERVATIONS_CHART = '/dashboard-facility/reservations-chart';
const PRIMARY_TEAL = "#0E766E";
const BAR_COLOR_DEFAULT = "#3d5b5822"; // Light transparent teal

// --- API and Chart Data Types ---
interface ApiChartData {
  month: number;
  count: number;
}

type Point = {
  month: string; // Formatted month name (e.g., "Jan")
  value: number; // Reservation count
};

// Helper function to convert month number to short name
const getMonthName = (monthNumber: number): string => {
  return moment().month(monthNumber - 1).format('MMM');
};

// --- Custom Tooltip Component for Recharts ---
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-700">{`Month: ${label}`}</p>
        <p className="text-teal-700">{`Reservations: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// --- Main Component ---

export default function ReservationChartWrapper() {
  const [chartData, setChartData] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [highlightedMonth, setHighlightedMonth] = useState<string | undefined>(undefined);

  const router = useRouter();
  const locale = useLocale();

  // ----------------------
  // 1. Data Fetching and Formatting
  // ----------------------
  useEffect(() => {
    const fetchChartData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(API_RESERVATIONS_CHART);

        if (data?.data && Array.isArray(data.data)) {
          const formattedData: Point[] = data.data.map((item: ApiChartData) => ({
            month: getMonthName(item.month),
            value: item.count,
          }));

          // Sort by month number to ensure correct chronological order
          formattedData.sort((a, b) => {
            // Re-calculate month number for sorting purposes
            const monthA = moment().month(a.month, ).month();
            const monthB = moment().month(b.month, ).month();
            return monthA - monthB;
          });

          setChartData(formattedData);

          // Set the current month to be highlighted
          const currentMonthName = moment().format('MMM');
          setHighlightedMonth(currentMonthName);

        } else {
          setErrorMessage("Received unexpected data format from the API.");
        }
      } catch (err: any) {
        console.error('Error fetching reservations chart:', err);
        if (err.response?.status === 403) {
          setErrorMessage("You are not allowed to see this section.");
        } else {
          setErrorMessage("Failed to load reservation data.");
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
      <div className="w-full p-6 bg-white rounded-2xl shadow-xl h-80 flex items-center justify-center">
        <Clock className="w-6 h-6 mr-2 text-gray-500 animate-spin" />
        <span className="text-gray-500">Loading reservation chart...</span>
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

  // Check for empty data after loading
  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full h-80 flex items-center justify-center">
        <div className="text-gray-500 text-center p-8 border-dashed border-2 rounded-xl">
          No reservation data available for the current period.
        </div>
      </div>
    );
  }

  // ----------------------
  // 4. Render Bar Chart (Integrated)
  // ----------------------
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
          <BarChartIcon className="w-5 h-5 text-teal-600" />
          Monthly Reservation Count
        </h3>

        {/* Filter Button (Placeholder) */}
        <button
          className="flex items-center gap-1 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-xl text-sm hover:bg-gray-100 transition"
        >
          <span>Filter</span>
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Chart Area */}
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px', fill: '#6B7280' }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '12px', fill: '#6B7280' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={25}>
              {chartData.map((item) => {
                const isHighlighted = item.month === highlightedMonth;
                return (
                  <Cell
                    key={item.month}
                    cursor="pointer"
                    fill={isHighlighted ? PRIMARY_TEAL : BAR_COLOR_DEFAULT}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer - View All */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
        <button
          className={`text-sm font-medium flex items-center gap-1 text-teal-700 hover:text-[#07534e] transition`}
          onClick={handleViewAll}
        >
          View all Reservations →
        </button>
      </div>
    </div>
  );
}