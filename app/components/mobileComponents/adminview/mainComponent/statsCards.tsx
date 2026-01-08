"use client";

import { useEffect, useState } from "react";
import { Users, BarChart3 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import axiosInstance from "@/lib/axiosInstance";
import { useTranslations } from "next-intl";

interface ChartDataPoint {
  value: number;
}

interface StatCard {
  id: string;
  title: string;
  value: string | number;
  icon: any; // هنا سيقبل إما Component أو string (مسار الصورة)
  chartColor: string;
  bgColor: string; 
  textColor: string; 
  chartData: ChartDataPoint[];
}

export default function StatsCards() {
  const t = useTranslations("statsCard");
  const [cards, setCards] = useState<StatCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosInstance.get("/dashboard-dashboard/dashboard-cards");

        if (data?.data) {
          const apiData = data.data;

          const formattedCards: StatCard[] = [
            {
              id: "users",
              title: t("cards.totalUsers"),
              value: apiData.usersCount || 0,
              icon: Users,
              chartColor: "#ffffff",
              bgColor: "bg-slate-700",
              textColor: "text-white",
              chartData: [{ value: 20 }, { value: 40 }, { value: 30 }, { value: 50 }, { value: 70 }, { value: 60 }]
            },
            {
              id: "providers",
              title: t("cards.totalProviders"),
              value: apiData.providersCount || 0,
              icon: BarChart3,
              chartColor: "#ffffff",
              bgColor: "bg-teal-600", 
              textColor: "text-white",
              chartData: [{ value: 15 }, { value: 25 }, { value: 20 }, { value: 30 }, { value: 50 }, { value: 40 }]
            },
            {
              id: "revenue",
              title: t("cards.totalRevenue"),
              value: apiData.revenue ? `${apiData.revenue.toLocaleString()} ${t("currency")}` : `0 ${t("currency")}`,
              icon: "/real.svg", 
              chartColor: "#ffffff",
              bgColor: "bg-[#0E766E]", 
              textColor: "text-white",
              chartData: [{ value: 10 }, { value: 20 }, { value: 15 }, { value: 40 }, { value: 35 }, { value: 50 }]
            },
          ];

          setCards(formattedCards);
        }
      } catch (err: any) {
        setErrorMessage(err.response?.status === 403 ? t("errors.forbidden") : t("errors.failed"));
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
      {cards.map((item) => {
        const IconComponent = item.icon;
        const isImage = typeof IconComponent === "string";

        return (
          <div
            key={item.id}
            className={`group flex flex-col justify-between ${item.bgColor} p-6 rounded-[2rem] shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-44 relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all" />

            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className={`text-[11px] font-bold ${item.textColor} opacity-80 uppercase tracking-widest mb-1`}>
                  {item.title}
                </p>
                <h3 className={`text-2xl font-black ${item.textColor} tracking-tight`}>
                  {item.value}
                </h3>
              </div>
              <div className="w-11 h-11 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-2xl shadow-sm p-2">
                {isImage ? (
                  <img 
                    src={IconComponent} 
                    alt="icon" 
                    className="w-7 h-7 object-contain brightness-0 invert" 
                  />
                ) : (
                  <IconComponent className={`w-6 h-6 ${item.textColor}`} />
                )}
              </div>
            </div>

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
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <p className={`text-[9px] font-bold ${item.textColor} opacity-70 uppercase tracking-tighter`}>
                {t("liveUpdate")}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}