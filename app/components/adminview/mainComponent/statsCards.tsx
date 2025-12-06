"use client";

import { useEffect, useState } from "react";
import { Users, BarChart3, TrendingUp, DollarSign } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import axiosInstance from "@/lib/axiosInstance";

// Define the primary color for reusability
const PRIMARY_TEAL = "#0E766E";

interface ChartDataPoint {
  value: number;
}

interface StatCard {
  id: number;
  title: string;
  value: string | number;
  icon: JSX.Element;
  iconColor: string; // Tailwind class for icon color
  chartColor: string; // Hex code for chart line
  bgColor: string; // Tailwind class for background
  chartData: ChartDataPoint[];
}

// Initial card data
const initialCards: StatCard[] = [
  {
    id: 1,
    title: "Total Users",
    value: 0,
    icon: <Users className="w-6 h-6" />,
    iconColor: "text-indigo-600",
    chartColor: "#4F46E5", 
    bgColor: "bg-indigo-50",
    chartData: [
      { value: 20 },
      { value: 40 },
      { value: 30 },
      { value: 50 },
      { value: 70 },
      { value: 60 },
    ],
  },
  {
    id: 2,
    title: "Total Providers",
    value: 0,
    icon: <BarChart3 className="w-6 h-6" />,
    iconColor: "text-green-600",
    chartColor: "#10B981",
    bgColor: "bg-green-50",
    chartData: [
      { value: 15 },
      { value: 25 },
      { value: 20 },
      { value: 30 },
      { value: 50 },
      { value: 40 },
    ],
  },
  {
    id: 3,
    title: "Total Revenue",
    value: 0,
    icon: <DollarSign className="w-6 h-6" />,
    iconColor: `text-[${PRIMARY_TEAL}]`,
    chartColor: PRIMARY_TEAL,
    bgColor: "bg-teal-50",
    chartData: [
      { value: 10 },
      { value: 20 },
      { value: 15 },
      { value: 40 },
      { value: 35 },
      { value: 50 },
    ],
  },
  {
    id: 4,
    title: "New Registrations",
    value: 0,
    icon: <TrendingUp className="w-6 h-6" />,
    iconColor: "text-yellow-600",
    chartColor: "#F59E0B",
    bgColor: "bg-yellow-50",
    chartData: [
      { value: 5 },
      { value: 15 },
      { value: 8 },
      { value: 20 },
      { value: 12 },
      { value: 25 },
    ],
  },
];

export default function StatsCards() {
  const [cards, setCards] = useState<StatCard[]>(initialCards.slice(0, 3));
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get(
          "/dashboard-dashboard/dashboard-cards"
        );

        if (data?.data) {
          const updated = [...initialCards]; 
          let hasFourthCard = false;

          if (data.data.usersCount !== undefined) updated[0].value = data.data.usersCount;
          if (data.data.providersCount !== undefined) updated[1].value = data.data.providersCount;
          if (data.data.revenue !== undefined) updated[2].value = `${data.data.revenue.toLocaleString()} SR`;
          if (data.data.newRegistrations !== undefined) {
            updated[3].value = data.data.newRegistrations;
            hasFourthCard = true;
          }

          setCards(hasFourthCard ? updated : updated.slice(0, 3));
        }
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);

        if (err.response?.status === 403) {
          setErrorMessage("You are not allowed to see this section.");
        } else {
          setErrorMessage("Failed to load stats.");
        }

        setCards([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const CardSkeleton = () => (
    <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-pulse h-32">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full p-6 bg-red-50 text-red-700 rounded-2xl text-center font-semibold">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
      {cards.map((item) => (
        <div
          key={item.id}
          className={`group flex flex-col justify-between ${item.bgColor} p-6 rounded-2xl shadow-xl border border-gray-100 
                      transition-all duration-300 transform hover:shadow-2xl hover:scale-[1.01] hover:border-2 hover:border-gray-300 relative`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`text-sm font-semibold ${item.iconColor} uppercase tracking-wider`}>
              {item.title}
            </div>
            <div className={`w-10 h-10 ${item.iconColor} bg-white flex items-center justify-center rounded-full shadow-md`}>
              {item.icon}
            </div>
          </div>

          <div className="text-3xl font-extrabold text-gray-900 mb-4">
            {item.value}
          </div>

          <div className="w-full h-10 -mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={item.chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={item.chartColor}
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 5, fill: item.chartColor }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-gray-600 mt-2">
            Trend over the last 6 periods.
          </p>
        </div>
      ))}
    </div>
  );
}