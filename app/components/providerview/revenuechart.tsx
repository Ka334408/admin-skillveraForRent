// components/dashboard/RevenueChart.tsx
"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 450 },
  { name: "May", value: 600 },
  { name: "Jun", value: 800 }, // نميِّز الشهر ده باللون الأزرق
  { name: "Jul", value: 400 },
  { name: "Aug", value: 350 },
  { name: "Sep", value: 300 },
  { name: "Oct", value: 500 },
  { name: "Nov", value: 450 },
  { name: "Dec", value: 400 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Revenue</h2>
          <p className="text-2xl font-bold">$682.5</p>
        </div>
        {/* أي عناصر إضافية (مثلاً أيقونة أو ملخص صغير) */}
      </div>

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip cursor={{ fill: "#0E766E" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Jun" ? "#0E766E" : "#dbeafe"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}