"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, BarChart3, TrendingUp } from "lucide-react"; 
import { LineChart, Line, ResponsiveContainer } from "recharts";
import axiosInstance from "@/lib/axiosInstance";
import { useTranslations, useLocale } from "next-intl";

const PRIMARY_TEAL = "#0E766E";

interface ChartDataPoint {
  value: number;
}

interface StatCard {
  id: number;
  title: string;
  value: string | number;
  icon: any;
  chartColor: string;
  bgColor: string;
  textColor: string;
  chartData: ChartDataPoint[];
}

const generateDummyData = (base: number) => [
  { value: base * 0.9 }, { value: base * 1.1 }, { value: base * 1.05 },
  { value: base * 1.2 }, { value: base * 1.15 }, { value: base * 1.3 },
];

export default function FacilitiesCards() {
  const t = useTranslations("FacilitiesCards");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const [cards, setCards] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/dashboard-facility/cards");

        if (data?.data) {
          const { approvedCount, pendingCount } = data.data;
          const totalCount = (approvedCount || 0) + (pendingCount || 0);

         const formattedCards: StatCard[] = [
  {
    id: 1,
    title: t("pending"),
    value: pendingCount || 0,
    icon: Clock,
    chartColor: "#ffffff",
    bgColor: "bg-slate-600", 
    textColor: "text-white",
    chartData: generateDummyData(pendingCount || 30),
  },
  {
    id: 2,
    title: t("approved"),
    value: approvedCount || 0,
    icon: CheckCircle,
    chartColor: "#ffffff",
    bgColor: "bg-emerald-700", 
    textColor: "text-white",
    chartData: generateDummyData(approvedCount || 150),
  },
  {
    id: 3,
    title: t("total"),
    value: totalCount || 0,
    icon: BarChart3,
    chartColor: "#ffffff",
    bgColor: "bg-[#0E766E]",
    textColor: "text-white",
    chartData: generateDummyData(totalCount || 180),
  },
];

          setCards(formattedCards);
        }
      } catch (err: any) {
        setErrorMessage(err.response?.status === 403 ? t("forbidden") : t("error"));
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [t]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 bg-gray-100 animate-pulse rounded-[2rem]" />
        ))}
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full p-6 bg-rose-50 text-rose-700 rounded-3xl border border-rose-100 text-center font-bold mb-8">
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-8">
      {cards.map((item) => (
        <div
          key={item.id}
          className={`group flex flex-col justify-between ${item.bgColor} p-6 rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-44 relative overflow-hidden`}
        >
          {/* تأثير ضوئي خلفي */}
          <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all`} />

          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className={`text-[11px] font-black ${item.textColor} opacity-80 uppercase tracking-widest mb-1`}>
                {item.title}
              </p>
              <h3 className={`text-3xl font-black ${item.textColor} tracking-tight`}>
                {item.value}
              </h3>
            </div>
            <div className="w-11 h-11 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-2xl shadow-sm">
              <item.icon className={`w-6 h-6 ${item.textColor}`} />
            </div>
          </div>

          {/* الرسم البياني الصغير */}
          <div className="w-full h-12 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={item.chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={item.chartColor}
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-1.5 relative z-10">
             <TrendingUp className={`w-3 h-3 ${item.textColor} opacity-70`} />
             <p className={`text-[9px] font-bold ${item.textColor} opacity-70 uppercase tracking-tighter`}>
                {t("liveUpdate")}
             </p>
          </div>
        </div>
      ))}
    </div>
  );
}