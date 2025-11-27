"use client";

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ChevronDown, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const data = [
  { month: "Jan", value: 30 },
  { month: "Feb", value: 45 },
  { month: "Mar", value: 55 },
  { month: "Apr", value: 60 },
  { month: "May", value: 70 },
  { month: "Jun", value: 80 },
  { month: "Jul", value: 75 },
  { month: "Aug", value: 85 },
  { month: "Sep", value: 90 },
  { month: "Oct", value: 110 },
];


export default function FacilitiesAreaChart() {
    const router = useRouter();
    const locale = useLocale();
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Facilities</h3>

        <button className="flex items-center gap-1 border text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100">
          <Filter className="w-4 h-4" />
          <span>All</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorShade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="20%" stopColor="#0E766E" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0E766E" stopOpacity={0} />
              </linearGradient>
            </defs>

            
            <XAxis dataKey="month" />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#0E766E"
              strokeWidth={3}
              fill="url(#colorShade)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-3">
        <button className="text-sm text-teal-700 hover:underline" onClick={()=> {localStorage.getItem("name")==="admin" ?
        router.push(`${locale}/admin/AllFacilities/FacilitiesList`):router.push(`/moderator/AllFacilities/FacilitiesList`)}}>
          View all →
        </button>
      </div>
    </div>
  );
}