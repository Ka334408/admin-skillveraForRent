// components/StatsChart.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type Point = {
  month: string;
  value: number;
};

type Props = {
  data?: Point[];
  title?: string;
  variant?: "line" | "bar" | "area";
  highlightedMonth?: string;
  className?: string;
  onFilterClick?: () => void;
};

const defaultData: Point[] = [
  { month: "Jan", value: 40 },
  { month: "Feb", value: 90 },
  { month: "Mar", value: 75 },
  { month: "Apr", value: 85 },
  { month: "May", value: 70 },
  { month: "Jun", value: 120 },
  { month: "Jul", value: 60 },
  { month: "Aug", value: 110 },
  { month: "Sep", value: 30 },
  { month: "Oct", value: 95 },
  { month: "Nov", value: 50 },
  { month: "Dec", value: 80 },
];

export default function StatsChart({
  data = defaultData,
  title = "All Facilities",
  variant = "bar",
  highlightedMonth,
  className = "",
  onFilterClick,
}: Props) {
  const primary = "#0E766E";
  const barColor = "#3d5b5822";
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className={`bg-white rounded-xl shadow-sm p-5 w-full ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-1 text-[gray-600] text-sm border px-3 py-1.5 rounded-lg hover:bg-gray-100"
        >
          <span>Filter</span>
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer>
          {variant === "line" ? (
            <LineChart data={data}>
              <CartesianGrid stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={primary}
                strokeWidth={3}
              />
            </LineChart>
          ) : variant === "area" ? (
            <AreaChart data={data}>
              <CartesianGrid stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={primary}
                fill="#55c3b922"
                strokeWidth={3}
              />
            </AreaChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data.map((item) => {
                  const isHighlighted = item.month === highlightedMonth;
                  return (
                    <Cell
                      key={item.month}
                      fill={isHighlighted ? primary : barColor}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer - View All */}
      <div className="flex justify-end mt-3">
        <button className="text-sm text-teal-700 hover:underline" onClick={()=> {localStorage.getItem("name")==="admin" ?
        router.push(`${locale}/admin/AllFacilities/FacilitiesList`):router.push(`/moderator/AllFacilities/FacilitiesList`)}}>
          View all →
        </button>
      </div>
    </div>
  );
}