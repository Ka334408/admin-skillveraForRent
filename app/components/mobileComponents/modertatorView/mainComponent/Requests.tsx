"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Eye, Clock, AlertTriangle, ArrowRight, User, Hash } from "lucide-react";
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';
import 'moment/locale/ar';

const PRIMARY_TEAL = "#0E766E";

interface RequestItem {
  provider: {
    id: number;
    name: string;
  };
  id: number;
  name: { en: string; ar: string };
  status: string;
  createdAt: string;
}

export default function FacilitiesRequestList() {
  const t = useTranslations("Requests");
  const locale = useLocale();
  const router = useRouter();
  const isRTL = locale === "ar";  const pathname = usePathname();
  const isModeratorView = pathname.includes("moderator");


  moment.locale(locale);

  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/dashboard-dashboard/need-approval-facilities?limit=5');
        if (data?.data?.data) {
          const pendingRequests = data.data.data.filter((req: RequestItem) => req.status === 'PENDING');
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
    isModeratorView?
    router.push(`/${locale}/mobile/moderator/AllFacilities/FacilitiesList`) :
    router.push(`/${locale}/mobile/admin/AllFacilities/FacilitiesList`);
  };

  if (loading) return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full h-80 flex flex-col justify-center items-center">
      <Clock className="w-8 h-8 text-amber-200 animate-spin mb-4" />
      <div className="h-4 bg-gray-100 w-48 rounded-full animate-pulse" />
    </div>
  );

  if (errorMessage) return (
    <div className="w-full p-8 bg-rose-50 border border-rose-100 text-rose-700 rounded-[2rem] text-center font-bold flex items-center justify-center gap-2">
      <AlertTriangle className="w-5 h-5" /> {errorMessage}
    </div>
  );

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-50 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">{t("title")}</h3>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t("subtitle")}</p>
          </div>
        </div>
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
           {requests.length} {t("pendingBadge")}
        </span>
      </div>

      {/* List Items */}
      <div className="flex flex-col gap-4">
        {requests.length === 0 ? (
          <div className="text-gray-400 font-bold text-sm text-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            {t("noRequests")}
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="group flex items-center justify-between bg-gray-50/50 p-4 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md hover:border-teal-100 transition-all duration-300"
            >
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-black text-gray-800 mb-1 group-hover:text-teal-700 transition-colors">
                  {req.name[locale as keyof typeof req.name] || req.name.en}
                </span>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                    <Hash className="w-3 h-3 text-amber-500" />
                    <span>{req.id}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                    <User className="w-3 h-3" />
                    <span>{req.provider.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-600/60">
                    <Clock className="w-3 h-3" />
                    <span>{moment(req.createdAt).fromNow()}</span>
                  </div>
                </div>
              </div>

              <button
                className="w-10 h-10 bg-white shadow-sm border border-gray-100 flex items-center justify-center rounded-xl text-gray-400 hover:bg-[#0E766E] hover:text-white hover:border-[#0E766E] transition-all duration-300"
                title={t("viewDetails")}
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
          className="group text-xs font-black text-[#0E766E] flex items-center gap-2 hover:underline transition-all"
          onClick={handleViewAll}
        >
          {t("viewAll")}
          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
}