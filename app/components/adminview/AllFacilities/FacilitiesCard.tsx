"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle, BarChart3 } from "lucide-react"; 
import { LineChart, Line, ResponsiveContainer } from "recharts";
import axiosInstance from "@/lib/axiosInstance";

const PRIMARY_TEAL = "#0E766E";

interface ChartDataPoint {
    value: number;
}

interface StatCard {
    id: number;
    title: string;
    value: string | number;
    icon: JSX.Element;
    iconColor: string;
    chartColor: string;
    bgColor: string;
    chartData: ChartDataPoint[];
}

const generateDummyData = (base: number) => [
    { value: base * 0.9 },
    { value: base * 1.1 },
    { value: base * 1.05 },
    { value: base * 1.2 },
    { value: base * 1.15 },
    { value: base * 1.3 },
];

const initialCards: StatCard[] = [
    {
        id: 1,
        title: "Pending Facilities",
        value: 0,
        icon: <Clock className="w-6 h-6" />,
        iconColor: "text-yellow-600",
        chartColor: "#FBBF24",
        bgColor: "bg-yellow-50",
        chartData: generateDummyData(30),
    },
    {
        id: 2,
        title: "Approved Facilities",
        value: 0,
        icon: <CheckCircle className="w-6 h-6" />,
        iconColor: "text-green-600",
        chartColor: "#10B981",
        bgColor: "bg-green-50",
        chartData: generateDummyData(150),
    },
    {
        id: 3,
        title: "Total Facilities",
        value: 0,
        icon: <BarChart3 className="w-6 h-6" />,
        iconColor: `text-[${PRIMARY_TEAL}]`,
        chartColor: PRIMARY_TEAL,
        bgColor: "bg-teal-50",
        chartData: generateDummyData(180),
    },
];

export default function FacilitiesCards() {
    const [cards, setCards] = useState<StatCard[]>(initialCards);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axiosInstance.get("/dashboard-facility/cards");

                if (data?.data) {
                    const { approvedCount, pendingCount } = data.data;
                    const totalCount = (approvedCount || 0) + (pendingCount || 0);

                    const updatedCards = initialCards.map(card => {
                        switch (card.id) {
                            case 1: return { ...card, value: pendingCount };
                            case 2: return { ...card, value: approvedCount };
                            case 3: return { ...card, value: totalCount };
                            default: return card;
                        }
                    });

                    setCards(updatedCards);
                } else {
                    setErrorMessage("Data format error from API.");
                }
            } catch (err: any) {
                console.error("Error fetching dashboard stats:", err);

                if (err.response?.status === 403) {
                    setErrorMessage("You are not allowed to see this section.");
                } else {
                    setErrorMessage("Failed to load facility stats.");
                }

                setCards(initialCards);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const CardSkeleton = () => (
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-pulse h-32">
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        </div>
    );

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-full p-6 bg-red-50 text-red-700 rounded-2xl text-center font-semibold border border-red-200">
                {errorMessage}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {cards.map(item => (
                <div
                    key={item.id}
                    className={`group flex flex-col justify-between ${item.bgColor} p-6 rounded-2xl shadow-xl border border-gray-100 
                    transition-all duration-300 transform hover:shadow-2xl hover:scale-[1.01] hover:border-2 hover:border-gray-300 relative`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            {item.title}
                        </div>
                        <div className={`w-10 h-10 ${item.iconColor} bg-white flex items-center justify-center rounded-full shadow-md`}>
                            {item.icon}
                        </div>
                    </div>

                    <div className="text-3xl font-extrabold text-gray-900 mb-4">
                        {item.value}
                    </div>

                    <div className="w-full h-10 -mb-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={item.chartData}>
                                <Line type="monotone" dataKey="value" stroke={item.chartColor} strokeWidth={3} dot={false} activeDot={{ r: 5, fill: item.chartColor }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <p className="text-xs text-gray-600 mt-2">
                        Trend over the last 6 periods (Hypothetical).
                    </p>
                </div>
            ))}
        </div>
    );
}