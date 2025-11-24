"use client";

import { Building2, Bus, GraduationCap, MoreHorizontal } from "lucide-react";

export default function AccountBalanceCard() {
  const transactions = [
    {
      id: "#1112",
      date: "Today, 16:36",
      amount: "+$154.50",
      icon: <Building2 className="w-5 h-5 text-gray-600" />,
      bg: "bg-gray-100",
    },
    {
      id: "#1323",
      date: "23 Jun, 13:06",
      amount: "+$40.50",
      icon: <Bus className="w-5 h-5 text-green-500" />,
      bg: "bg-green-100",
    },
    {
      id: "#114",
      date: "21 Jun, 19:04",
      amount: "+$70.00",
      icon: <GraduationCap className="w-5 h-5 text-yellow-500" />,
      bg: "bg-yellow-100",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow p-4 w-full max-w-sm">
      {/* Header */}
      <div className="bg-[#0E766E] text-white rounded-2xl p-4 flex justify-between items-start">
        <div>
          <p className="text-sm opacity-80">Account Balance</p>
          <h2 className="text-2xl font-bold">$25,215</h2>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <MoreHorizontal className="w-5 h-5 text-white opacity-80" />
          <span className="w-12 h-6 rounded-full border border-white opacity-70 flex items-center justify-center">
            ~
          </span>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-4">
        <p className="text-gray-500 text-sm mb-3">Recent</p>
        <ul className="space-y-3">
          {transactions.map((tx, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.bg}`}>
                  {tx.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold">{tx.id}</p>
                  <p className="text-xs text-gray-400">{tx.date}</p>
                </div>
              </div>
              <span className="font-semibold text-gray-800">{tx.amount}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}