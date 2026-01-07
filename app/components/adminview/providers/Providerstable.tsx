"use client";

import { usePathname, useRouter } from "next/navigation";
import { Filter, Clock, AlertTriangle, UserPlus, Home, Eye, ArrowRight, Hash, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';
import 'moment/locale/ar';

const PRIMARY_TEAL = "#0E766E";

interface RequestItem {
    id: number;
    name: { en: string; ar: string };
    status: string;
    createdAt: string;
    provider: {
        id: number;
        name: string;
    };
}

export default function RecentProviderRequests() {
    const t = useTranslations("RecentRequests");
    const locale = useLocale();
    const router = useRouter();
    const isRTL = locale === "ar";

    moment.locale(locale);

    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const pathname = usePathname();
    const isModeratorView = pathname.includes("moderator")


    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get('/dashboard-dashboard/need-approval-facilities?limit=5');
                if (data?.data?.data) {
                    const pendingRequests = data.data.data
                        .filter((req: RequestItem) => req.status === 'PENDING')
                        .slice(0, 5);
                    setRequests(pendingRequests);
                }
            } catch (err: any) {
                setErrorMessage(err.response?.status === 403 ? t("forbidden") : t("error"));
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, [t]);

    const handleViewAll = () => {
        isModeratorView ?
            router.push(`/${locale}/moderator/Providers/ProvidersList`)
            :
            router.push(`/${locale}/admin/Providers/ProvidersList`);
    };

    if (loading) return (
        <div className="w-full bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-80 flex flex-col justify-center items-center">
            <Clock className="w-8 h-8 text-indigo-200 animate-spin mb-4" />
            <div className="h-4 bg-gray-100 w-48 rounded-full animate-pulse" />
        </div>
    );

    if (errorMessage) return (
        <div className="w-full p-8 bg-rose-50 border border-rose-100 text-rose-700 rounded-[2rem] text-center font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" /> {errorMessage}
        </div>
    );

    return (
        <div className="w-full bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 border-b border-gray-50 pb-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900">{t("title")}</h2>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t("subtitle")}</p>
                    </div>
                </div>


            </div>

            {/* Requests list */}
            <div className="flex flex-col gap-4">
                {requests.length === 0 ? (
                    <div className="text-gray-400 font-bold text-sm text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                        {t("noRequests")}
                    </div>
                ) : (
                    requests.map((item) => (
                        <div
                            key={item.id}
                            className="group flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-indigo-100 transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className="hidden sm:flex w-10 h-10 bg-white rounded-xl items-center justify-center text-amber-500 shadow-sm border border-gray-50 group-hover:scale-110 transition-transform">
                                    <Home className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-black text-gray-800 truncate group-hover:text-indigo-600 transition-colors">
                                        {item.name[locale as keyof typeof item.name] || item.name.en}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                            <Hash className="w-3 h-3 text-indigo-400" />
                                            <span>{item.id}</span>
                                        </div>
                                        <span className="text-gray-200 hidden sm:inline">|</span>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
                                            <User className="w-3 h-3" />
                                            <span>{item.provider.name}</span>
                                        </div>
                                        <span className="text-gray-200 hidden sm:inline">|</span>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-500/70">
                                            <Clock className="w-3 h-3" />
                                            <span>{moment(item.createdAt).fromNow()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-10 h-10 bg-white shadow-sm border border-gray-100 flex items-center justify-center rounded-xl text-gray-400 hover:bg-[#0E766E] hover:text-white hover:border-[#0E766E] transition-all duration-300"
                                onClick={() => {
                                    isModeratorView ? router.push(`/${locale}/moderator/requests/${item.id}`) :
                                        router.push(`/${locale}/admin/requests/${item.id}`)
                                }} title={t("review")}
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-8 pt-6 border-t border-gray-50">
                <button
                    onClick={handleViewAll}
                    className="group text-xs font-black text-indigo-600 flex items-center gap-2 hover:underline transition-all"
                >
                    {t("viewAll")}
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
    );
}