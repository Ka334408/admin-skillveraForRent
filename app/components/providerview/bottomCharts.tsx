"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Bus, ShoppingBag, CreditCard } from "lucide-react";

const revenueData = [
  { name: "Mon", value: 50 },
  { name: "Tue", value: 80 },
  { name: "Wed", value: 40 },
  { name: "Thu", value: 95 },
  { name: "Fri", value: 60 },
  { name: "Sat", value: 85 },
  { name: "Sun", value: 30 },
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
      {/* Card 1 - Calendar */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold">27 May</h2>
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-start gap-2">
            <span className="w-1 h-5 bg-[#0E766E] rounded" />
            <div>
              <p className="text-sm font-medium">end date of #1222</p>
              <p className="text-xs text-gray-500">01:00 PM – 02:00 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1 h-5 bg-[#0E766E] rounded" />
            <div>
              <p className="text-sm font-medium">start date of #122</p>
              <p className="text-xs text-gray-500">02:00 PM – 03:00 PM</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-1 h-5 bg-[#0E766E] rounded" />
            <div>
              <p className="text-sm font-medium">end date of #122</p>
              <p className="text-xs text-gray-500">03:00 PM – 04:00 PM</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#0E766E] font-medium cursor-pointer">
          Open calendar
        </p>
      </div>

      {/* Card 2 - Actions */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Your Actions</h2>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Bus className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Public Transport</p>
              <p className="text-xs text-gray-500">22 September 2020</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShoppingBag className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Grocery Store</p>
              <p className="text-xs text-gray-500">18 September 2020</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Public Transport</p>
              <p className="text-xs text-gray-500">22 September 2020</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-[#0E766E] font-medium cursor-pointer">
          View all →
        </p>
      </div>

      {/* Card 3 - Revenue Chart */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h2 className="text-sm text-gray-500">Revenue this month</h2>
        <p className="text-2xl font-bold mt-1">$682.5</p>
        <p className="text-green-500 text-sm font-medium">+2.45% On track</p>
        <div className="mt-6 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Bar dataKey="value" fill="#0E766E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}