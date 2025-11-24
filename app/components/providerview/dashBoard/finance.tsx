"use client";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  Wallet,
  Banknote,
  CreditCard,
  RefreshCw,
  DollarSign,
} from "lucide-react";

const data = [
  { name: "Jan", earning: 120, expense: 50 },
  { name: "Feb", earning: 180, expense: 90 },
  { name: "Mar", earning: 250, expense: 120 },
  { name: "Apr", earning: 300, expense: 150 },
  { name: "May", earning: 260, expense: 100 },
  { name: "Jun", earning: 200, expense: 160 },
  { name: "Jul", earning: 170, expense: 90 },
];

const transactions = [
  {
    icon: Wallet,
    title: "Wallet",
    subtitle: "Starbucks",
    amount: "-$74",
    color: "text-red-500",
    bg: "bg-red-100",
  },
  {
    icon: Banknote,
    title: "Bank Transfer",
    subtitle: "Add Money",
    amount: "+$480",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    icon: DollarSign,
    title: "Paypal",
    subtitle: "Add Money",
    amount: "+$590",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    icon: CreditCard,
    title: "Mastercard",
    subtitle: "Ordered Food",
    amount: "-$23",
    color: "text-red-500",
    bg: "bg-red-100",
  },
  {
    icon: RefreshCw,
    title: "Transfer",
    subtitle: "Refund",
    amount: "+$98",
    color: "text-green-600",
    bg: "bg-green-100",
  },
];

export default function FinancePage() {
  return (
    <main className="flex-1 bg-[#f5f6fa] min-h-screen p-6 overflow-y-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Finance</h1>

      <div className="grid xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Revenue Report */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-6">
                <h2 className="font-semibold text-gray-700">Revenue Report</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#0E766E]" />
                    <span className="text-sm text-gray-600">Earning</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                    <span className="text-sm text-gray-600">Expense</span>
                  </div>
                </div>
              </div>
              <select className="border rounded-lg px-3 py-1 text-sm text-gray-500">
                <option>Sep</option>
                <option>Aug</option>
                <option>Jul</option>
              </select>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="earning" fill="#0E766E" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-[#f9fafb] rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Account Balance</p>
                  <h3 className="text-3xl font-bold text-gray-800">$25,852</h3>
                  <p className="text-sm text-gray-500 mt-1">Account: $6,800</p>

                  <LineChart width={200} height={60} data={data}>
                    <Line
                      type="monotone"
                      dataKey="earning"
                      stroke="#0E766E"
                      strokeWidth={2}
                    />
                  </LineChart>
                </div>

                <button className="mt-4 bg-[#0E766E] text-white py-2 rounded-xl hover:bg-[#0c8a83] transition">
                  Increase Budget
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Earning */}
            <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Earning</p>
                <p className="text-sm font-semibold text-gray-300">This Month</p>
                <h3 className="text-xl font-semibold text-gray-800">$4,055.56</h3>
                <p className="text-green-600 text-sm flex items-center gap-1 mt-1">
                  <ArrowUpRight className="w-4 h-4" /> +68.2%
                </p>
              </div>
              <PieChart width={80} height={80}>
                <Pie
                  data={[
                    { name: "Sales", value: 38 },
                    { name: "Remaining", value: 62 },
                  ]}
                  innerRadius={25}
                  outerRadius={35}
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#0E766E" />
                  <Cell fill="#E5E7EB" />
                </Pie>
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-semibold fill-gray-700"
                >
                  38%
                </text>
              </PieChart>
            </div>

            {/* Reservations */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-gray-500 text-sm mb-1">Reservations</p>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">18</h3>
              <LineChart width={200} height={60} data={data}>
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#f59e0b"
                  strokeWidth={2}
                />
              </LineChart>
            </div>

            {/* Profit */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-gray-500 text-sm mb-1">Profit</p>
              <h3 className="text-xl font-semibold text-gray-800">6.24k</h3>
              <LineChart width={200} height={60} data={data}>
                <Line
                  type="monotone"
                  dataKey="earning"
                  stroke="#0E766E"
                  strokeWidth={2}
                />
              </LineChart>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500 font-semibold">
                R
              </div>
              <div>
                <p className="text-sm text-gray-500">Reservation</p>
                <p className="font-semibold text-gray-800">230k</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sky-500 font-semibold">
                C
              </div>
              <div>
                <p className="text-sm text-gray-500">Customers</p>
                <p className="font-semibold text-gray-800">300+</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-500 font-semibold">
                F
              </div>
              <div>
                <p className="text-sm text-gray-500">New Facilities</p>
                <p className="font-semibold text-gray-800">6</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-500 font-semibold">
                $
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="font-semibold text-gray-800">$9745</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="font-semibold text-gray-700 mb-4">Transactions</h2>
          <div className="space-y-4">
            {transactions.map((t, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 ${t.bg} rounded-full flex items-center justify-center`}
                  >
                    <t.icon className={`w-5 h-5 ${t.color}`} />
                  </div>
                  <div>
                    <p className="text-gray-700 font-medium text-sm">
                      {t.title}
                    </p>
                    <p className="text-gray-400 text-xs">{t.subtitle}</p>
                  </div>
                </div>
                <span className={`font-semibold ${t.color}`}>{t.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}