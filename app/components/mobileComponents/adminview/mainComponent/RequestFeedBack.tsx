"use client";

import { Eye, Clock, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';
import 'moment/locale/ar'; // لدعم تواريخ باللغة العربية

const PRIMARY_COLOR = "#0E766E";

interface RequestItem {
    provider: { id: number; name: string; };
    id: number;
    name: { en: string, ar: string };
    status: string;
    createdAt: string;
}

interface FeedbackItem {
    user: { id: number; name: string; };
    facility: { id: number; name: { en: string, ar: string }; };
    reservation: { id: number; startDate: string; endDate: string; };
    rate: number;
    comment: string;
}

export default function DashboardLists({ request, feedBack }: { request?: string; feedBack?: string }) {
    const t = useTranslations("Lists");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const router = useRouter();
    const pathname = usePathname();
    const isModeratorView = pathname.includes("moderator");




    moment.locale(locale);

    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
    const [errorRequests, setErrorRequests] = useState<string | null>(null);
    const [errorFeedbacks, setErrorFeedbacks] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await axiosInstance.get('/dashboard-dashboard/need-approval-facilities?limit=5');
                if (data?.data?.data) setRequests(data.data.data);
            } catch (err: any) {
                setErrorRequests(err.response?.status === 403 ? t("forbidden") : t("error"));
            } finally { setLoadingRequests(false); }
        };

        const fetchFeedbacks = async () => {
            try {
                const { data } = await axiosInstance.get('/dashboard-dashboard/feedbacks?limit=5');
                if (data?.data?.data) setFeedbacks(data.data.data);
            } catch (err: any) {
                setErrorFeedbacks(err.response?.status === 403 ? t("forbidden") : t("error"));
            } finally { setLoadingFeedbacks(false); }
        };

        fetchRequests();
        fetchFeedbacks();
    }, [t]);

    const handleNavigate = (path: string) => {
        isModeratorView?
        router.push(`/${locale}/mobile/moderator/${path}`):
        router.push(`/${locale}/mobile/admin/${path}`);
    };

    const getStatusBadge = (status: string) => {
        const isPending = status.toUpperCase() === 'PENDING';
        return (
            <span className={`text-[10px] font-black px-3 py-1 rounded-full flex items-center gap-1 uppercase tracking-tighter
                ${isPending ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                {isPending && <Clock className="w-3 h-3" />}
                {isPending ? t("statusPending") : t("statusApproved")}
            </span>
        );
    };

    const getRateStars = (rate: number) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < rate ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                ))}
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* 1. Approval Requests */}
            <div className={`bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col ${request}`}>
                <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-gray-900 leading-none">{t("requestsTitle")}</h3>
                            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{t("requestsSubtitle")}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    {loadingRequests ? (
                        [...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />)
                    ) : requests.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 font-bold text-sm">{t("noRequests")}</div>
                    ) : (
                        requests.map((req) => (
                            <div key={req.id} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-teal-100 hover:bg-teal-50/30 transition-all duration-300">
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-black text-gray-800 truncate">{isRTL ? req.name.ar : req.name.en}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{req.provider.name}</span>
                                        <span className="w-1 h-1 bg-gray-200 rounded-full" />
                                        <span className="text-[10px] font-medium text-gray-400">{moment(req.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                                {getStatusBadge(req.status)}
                            </div>
                        ))
                    )}
                </div>

                <button onClick={() => handleNavigate('AllFacilities/FacilitiesList')}
                    className="mt-8 group flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-900 hover:text-white rounded-2xl text-xs font-black transition-all duration-300">
                    {t("viewAllRequests")}
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* 2. Recent Feedback */}
            <div className={`bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col ${feedBack}`}>
                <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-gray-900 leading-none">{t("feedbackTitle")}</h3>
                            <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tight">{t("feedbackSubtitle")}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    {loadingFeedbacks ? (
                        [...Array(3)].map((_, i) => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />)
                    ) : feedbacks.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 font-bold text-sm">{t("noFeedback")}</div>
                    ) : (
                        feedbacks.map((fb) => (
                            <div key={fb.reservation.id} className="flex items-start justify-between p-4 rounded-2xl border border-gray-50 hover:bg-blue-50/20 transition-all duration-300">
                                <div className="flex-1 min-w-0 pr-3 ml-3">
                                    <div className="flex items-center gap-3 mb-1">
                                        {getRateStars(fb.rate)}
                                        <span className="text-[10px] font-black text-gray-300 uppercase">
                                            {moment(fb.reservation.startDate).format('D MMM')}
                                        </span>
                                    </div>
                                    <p className="text-xs font-black text-gray-800 truncate mb-0.5">
                                        {isRTL ? fb.facility.name.ar : fb.facility.name.en}
                                    </p>
                                    <p className="text-[11px] text-gray-500 line-clamp-1 italic">
                                        &ldquo;{fb.comment || t("noComment")}&ldquo;
                                    </p>
                                </div>
                               
                            </div>
                        ))
                    )}
                </div>

                <button onClick={() => handleNavigate('AllFacilities/FacilitiesList')}
                    className="mt-8 group flex items-center justify-center gap-2 py-3 bg-gray-50  hover:bg-gray-900 hover:text-white rounded-2xl text-xs font-black transition-all duration-300">
                    {t("viewAllFeedback")}
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </div>
    );
}