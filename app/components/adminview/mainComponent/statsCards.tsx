"use client";

import { Users, BarChart3 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const fakeData = [
  {
    id: 1,
    title: "Users",
    value: 321,
    icon: <Users className="text-white w-5 h-5" />,
    bgColor: "bg-blue-600",
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
    title: "Providers",
    value: "1.2k",
    icon: <Users className="text-green-600 w-5 h-5" />,
    bgColor: "bg-green-100",
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
    title: "Revenue",
    value: "$350.40",
    icon: <BarChart3 className="text-[#0E766E] w-5 h-5" />,
    bgColor: "bg-blue-100",
    chartData: [
      { value: 10 },
      { value: 20 },
      { value: 15 },
      { value: 40 },
      { value: 35 },
      { value: 50 },
    ],
  },
  
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
      {fakeData.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between bg-white p-4 rounded-xl shadow hover:shadow-md transition w-full"
        >
          {/* Icon */}
          <div
            className={`w-12 h-12 ${item.bgColor} flex items-center justify-center rounded-full`}
          >
            {item.icon}
          </div>

          {/* Info */}
          <div className="flex-1 px-4">
            <p className="text-gray-500 text-sm">{item.title}</p>
            <p className="text-lg font-bold">{item.value}</p>
          </div>

          {/* Mini chart */}
          <div className="w-20 h-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={item.chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#6366F1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}