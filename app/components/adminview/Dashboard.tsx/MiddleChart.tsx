import { Filter, ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function MiddleChart() {

    const chartData = [
        { month: "0", value: 900 },
        { month: "1", value: 870 },
        { month: "2", value: 200 },
        { month: "3", value: 840 },
        { month: "4", value: 820 },
        { month: "5", value: 600 },
        { month: "6", value: 1000 },
        { month: "7", value: 850 },
        { month: "8", value: 880 },
        { month: "9", value: 250 },
    ];
    const router = useRouter();
        const locale = useLocale();
  return (
    <div>
       {/* ---------- Chart ---------- */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="bg-white p-6 ">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg">All Facilities</h3>

                        <button className="border px-3 py-1 rounded-lg text-sm flex items-center gap-2">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#0E766E" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#0E766E" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="text-right mt-2">
                    <button className="text-[#0E766E] font-medium flex items-center gap-1 float-right"
                    onClick={()=> {localStorage.getItem("name")==="admin" ?
        router.push(`/${locale}/admin/AllFacilities/FacilitiesList`):router.push(`/${locale}/moderator/AllFacilities/FacilitiesList`)}}>
                        View all →
                    </button>
                </div>
            </div>
    </div>
  )
}
