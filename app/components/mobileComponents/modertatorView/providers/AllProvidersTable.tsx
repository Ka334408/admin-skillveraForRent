"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Loader2, ChevronLeft, ChevronRight, Users,
  ShieldCheck, UserCog, Mail, Phone, Calendar as CalendarIcon,
  FilterX, CheckCircle
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl"; 
import toast from "react-hot-toast";

type UserType = "PROVIDER" | "USER" | "MODERATOR";

export default function UnifiedUserTable() {
  const t = useTranslations("UsersTable");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [activeTab, setActiveTab] = useState<UserType>("PROVIDER");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const itemsPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/users`, {
        params: { page: currentPage, limit: itemsPerPage, type: activeTab }
      });
      setUsers(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalCount(response.data?.totalData || 0);
    } catch (error) {
      console.error(`Error:`, error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleApproveProvider = async (id: string) => {
    try {
      setActionLoading(id);
      await axiosInstance.post(`/moderator-providers/${id}/approve`);
      toast.success(isRTL ? "تم تفعيل الحساب بنجاح" : "Account activated successfully");
      fetchUsers();
    } catch (error: any) {
      console.error("Approve Error:", error);
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTabChange = (type: UserType) => {
    setActiveTab(type);
    setCurrentPage(1);
  };

  const getPaginationRange = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
    }
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className={`w-full px-4 md:px-8 py-8 min-h-screen bg-[#F8FAFC] ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 font-black uppercase">
              {t("totalLabel", { type: t(`tabs.${activeTab.toLowerCase()}`) })}
            </span>
            <span className="text-xl font-black text-teal-600">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-gray-100 w-full md:w-auto overflow-x-auto">
          {[
            { id: "PROVIDER", label: t("tabs.provider"), icon: <ShieldCheck size={18} /> },
            { id: "USER", label: t("tabs.user"), icon: <Users size={18} /> },
            { id: "MODERATOR", label: t("tabs.moderator"), icon: <UserCog size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as UserType)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${activeTab === tab.id
                  ? "bg-[#0E766E] text-white shadow-lg shadow-teal-50"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[500px] text-teal-600">
            <Loader2 className="w-12 h-12 animate-spin mb-4 opacity-40" />
            <p className="font-black text-gray-400 animate-pulse text-xs uppercase tracking-widest">{t("loading")}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[500px] text-gray-400">
            <FilterX size={60} strokeWidth={1} className="mb-4 opacity-20" />
            <p className="font-black text-lg">{t("noDataTitle")}</p>
            <p className="text-sm font-bold">{t("noDataSubtitle")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className={`text-gray-400 text-xs font-black uppercase tracking-widest ${isRTL ? "text-right" : "text-left"}`}>
                  <th className={`pb-4 px-6 ${isRTL ? "text-right" : "text-left"}`}>{t("columns.id")}</th>
                  <th className={`pb-4 px-6 ${isRTL ? "text-right" : "text-left"}`}>{t("columns.user")}</th>
                  <th className={`pb-4 px-6 ${isRTL ? "text-right" : "text-left"}`}>{t("columns.contact")}</th>
                  <th className="pb-4 px-6 text-center">{t("columns.status")}</th>
                  <th className="pb-4 px-6 text-center">{t("columns.phone")}</th>
                  <th className={`pb-4 px-6 ${isRTL ? "text-left" : "text-right"}`}>{t("columns.joinedDate")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u: any) => (
                  <tr key={u.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                    <td className={`bg-gray-50/50 py-5 px-6 font-black text-gray-400 text-xs border-y border-transparent group-hover:border-gray-100 group-hover:bg-white ${isRTL ? "rounded-r-[1.5rem] border-r" : "rounded-l-[1.5rem] border-l"}`}>
                      #{u.id}
                    </td>
                    <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-black text-lg flex-shrink-0">
                          {u.image ? (
                            <img
                              src={`/api/media?media=${u.image}`}
                              alt={u.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span>{u.name?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <span className="font-black text-gray-900 text-sm leading-none mb-1">
                            {u.name}
                          </span>
                          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-tighter">
                            {t(`tabs.${activeTab.toLowerCase()}`)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white text-gray-500">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold">
                        <Mail size={12} className="text-teal-500" /> {u.email}
                      </div>
                    </td>
                    <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${u.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                          {u.status || "PENDING"}
                        </span>
                        
                        {/* زر الموافقة للبروفايدر الـ PENDING */}
                        {activeTab === "PROVIDER" && u.status === "PENDING" && (
                          <button
                            onClick={() => handleApproveProvider(u.id)}
                            disabled={actionLoading === u.id}
                            className="flex items-center gap-1.5 bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-sm"
                          >
                            {actionLoading === u.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                            {isRTL ? "تفعيل" : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white text-center">
                      <div className="inline-flex items-center gap-2 text-xs font-black text-gray-600">
                        <Phone size={12} className="text-gray-300" /> {u.phone || "—"}
                      </div>
                    </td>
                    <td className={`bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white rounded-l-[1.5rem] ${isRTL ? "text-left rounded-l-[1.5rem] border-l" : "text-right rounded-r-[1.5rem] border-r"}`}>
                      <div className={`flex items-center gap-2 text-xs font-black text-gray-700 ${isRTL ? "justify-start" : "justify-end"}`}>
                        <CalendarIcon size={14} className="text-gray-300" />
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB") : "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Container */}
      {!loading && users.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-10 bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 gap-6">
          <p className="text-xs text-gray-400 font-black uppercase tracking-widest">
            {t("paginationInfo", { current: currentPage, total: totalPages })}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-3.5 rounded-2xl border border-gray-100 disabled:opacity-30 hover:bg-teal-50 hover:border-teal-100 hover:text-teal-600 transition-all text-gray-400"
            >
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <div className="flex items-center gap-1.5 mx-2">
              {getPaginationRange().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  disabled={page === "..."}
                  className={`w-11 h-11 rounded-2xl text-xs font-black transition-all ${currentPage === page
                      ? "bg-[#0E766E] text-white shadow-xl shadow-teal-100 scale-110"
                      : page === "..."
                        ? "text-gray-300 cursor-default"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-3.5 rounded-2xl border border-gray-100 disabled:opacity-30 hover:bg-teal-50 hover:border-teal-100 hover:text-teal-600 transition-all text-gray-400"
            >
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}