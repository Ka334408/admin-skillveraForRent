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
} from "recharts";
import { Clock, AlertTriangle, CalendarDays } from "lucide-react";
import axiosInstance from '@/lib/axiosInstance';

// Define the primary color
const PRIMARY_TEAL = "#0E766E";

// --- Interface Definitions ---
interface ApiChartData {
  month: number;
  count: number;
}

interface FormattedChartData {
  name: string; // Month Name (e.g., "Dec")
  reservations: number;
}

// Helper function to convert month number to short name
const getMonthName = (monthNumber: number): string => {
  const date = new Date(2000, monthNumber - 1, 1);
  return date.toLocaleString('en-US', { month: 'short' });
};

// --- Custom Tooltip Component for Recharts ---
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg text-sm">
        <p className="font-semibold text-gray-700">{`Month: ${label}`}</p>
        <p className="text-teal-700">{`Reservations: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

// --- Main Component ---

export default function MonthlyReservationsChart() {
  const [chartData, setChartData] = useState<FormattedChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ----------------------
  // 1. Data Fetching and Formatting
  // ----------------------
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const { data } = await axiosInstance.get('/dashboard-facility/reservations-chart');

        if (data?.data && Array.isArray(data.data)) {
          // Map API response to chart data format
          const formattedData: FormattedChartData[] = data.data.map((item: ApiChartData) => ({
            name: getMonthName(item.month),
            reservations: item.count,
          })).sort((a: any, b: any) => a.reservations - b.reservations); // Optional: sort by month number if required

          setChartData(formattedData);
        } else {
          setErrorMessage("Received unexpected data format from the API.");
        }
      } catch (err: any) {
        console.error('Error fetching reservations chart:', err);
        if (err.response?.status === 403) {
          setErrorMessage("You are not allowed to see this section.");
        } else {
          setErrorMessage("Failed to load reservations data.");
        }
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  // ----------------------
  // 2. Loading and Error States
  // ----------------------
  if (loading) {
    return (
      <div className="w-full p-8 bg-white rounded-2xl shadow-xl animate-pulse h-80 flex items-center justify-center">
        <Clock className="w-6 h-6 mr-2 text-gray-500 animate-spin" />
        <span className="text-gray-500">Loading reservations chart...</span>
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

  // ----------------------
  // 3. Render Chart
  // ----------------------
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 border-b pb-3">
        <CalendarDays className={`w-5 h-5 text-teal-600`} />
        <h2 className="text-xl font-extrabold text-gray-800">Monthly Facility Reservations</h2>
      </div>

      {chartData.length === 0 ? (
        <div className="text-gray-500 text-center p-8 border-dashed border-2 rounded-xl h-64 flex items-center justify-center">
          No reservation data available for the current period.
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: '12px', fill: '#6B7280' }}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                style={{ fontSize: '12px', fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="reservations"
                fill={PRIMARY_TEAL}
                radius={[4, 4, 0, 0]}
                barSize={25}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}