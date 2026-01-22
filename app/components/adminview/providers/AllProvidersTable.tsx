"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Loader2, ChevronLeft, ChevronRight, Users,
  ShieldCheck, UserCog, Plus, Mail, Phone, Calendar as CalendarIcon,
  FilterX, CheckCircle, Hash
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl"; 
import AddModeratorModal from "./addNewModerator";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      toast.success(isRTL ? "تمت الموافقة بنجاح" : "Approved successfully");
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
      <AddModeratorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchUsers} />

      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
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
          
          {activeTab === "MODERATOR" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-[#0E766E] text-white px-6 py-4 rounded-2xl font-black text-sm shadow-xl shadow-teal-100 hover:bg-[#0a5c56] transition-all hover:scale-105 active:scale-95"
            >
              <Plus size={20} strokeWidth={3} />
              <span>{t("addModerator")}</span>
            </button>
          )}
        </div>
      </div>

      {/* --- Tabs Section (العريضة) --- */}
      <div className="flex bg-white p-1.5 rounded-[1.5rem] shadow-sm border border-gray-100 mb-8 w-full md:w-fit overflow-x-auto">
        {[
          { id: "PROVIDER", label: t("tabs.provider"), icon: <ShieldCheck size={18} /> },
          { id: "USER", label: t("tabs.user"), icon: <Users size={18} /> },
          { id: "MODERATOR", label: t("tabs.moderator"), icon: <UserCog size={18} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as UserType)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#0E766E] text-white shadow-lg shadow-teal-50"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- Table Container --- */}
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
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full border-separate border-spacing-y-4">
              <thead>
                <tr className="text-gray-400 text-xs font-black uppercase tracking-widest">
                  <th className={`pb-4 px-6 ${isRTL ? "text-right" : "text-left"}`}>ID</th>
                  <th className={`pb-4 px-6 ${isRTL ? "text-right" : "text-left"}`}>{t("columns.user")}</th>
                  <th className="pb-4 px-6 text-center">{t("columns.status")}</th>
                  <th className="pb-4 px-6 text-center">{t("columns.phone")}</th>
                  <th className={`pb-4 px-6 ${isRTL ? "text-left" : "text-right"}`}>{t("columns.joinedDate")}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="group hover:bg-gray-50/80 transition-all duration-300">
                    {/* ID Column */}
                    <td className={`bg-gray-50/50 py-5 px-6 font-black text-gray-400 text-xs border-y border-transparent group-hover:border-gray-100 group-hover:bg-white ${isRTL ? "rounded-r-[1.5rem] border-r" : "rounded-l-[1.5rem] border-l"}`}>
                      <div className="flex items-center gap-1">
                        <Hash size={12} className="opacity-50" />
                        {u.id} 
                      </div>
                    </td>

                    {/* User Info Column */}
                    <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 font-black text-lg flex-shrink-0">
                          {u.image ? (
                            <img src={`/api/media?media=${u.image}`} alt="" className="w-full h-full object-contain" />
                          ) : (
                            u.name[0].toUpperCase()
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-gray-900 text-sm truncate max-w-[180px]">{u.name}</span>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold">
                            <Mail size={10} />
                            <span className="truncate max-w-[150px]">{u.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status & Action Column */}
                    <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className={`inline-flex px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          u.status === "ACTIVE" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {u.status || "PENDING"}
                        </span>
                        
                        {activeTab === "PROVIDER" && u.status === "PENDING" && (
                          <button
                            onClick={() => handleApproveProvider(u.id)}
                            disabled={actionLoading === u.id}
                            className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black hover:bg-emerald-700 transition-all shadow-md disabled:opacity-50"
                          >
                            {actionLoading === u.id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle size={12} />}
                            {isRTL ? "تفعيل الحساب" : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Phone Column */}
                    <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white text-center">
                      <div className="inline-flex items-center gap-2 text-xs font-black text-gray-600 bg-white/50 px-3 py-1.5 rounded-lg border border-gray-100">
                        <Phone size={12} className="text-teal-500" />
                        <span dir="ltr">{u.phone || "—"}</span>
                      </div>
                    </td>

                    {/* Date Column */}
                    <td className={`bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:border-gray-100 group-hover:bg-white ${isRTL ? "rounded-l-[1.5rem] border-l text-left" : "rounded-r-[1.5rem] border-r text-right"}`}>
                      <div className={`flex items-center gap-2 text-xs font-black text-gray-400 ${isRTL ? "justify-start" : "justify-end"}`}>
                        <CalendarIcon size={14} />
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "en-GB") : "—"}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Pagination --- */}
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
                  className={`w-11 h-11 rounded-2xl text-xs font-black transition-all ${
                    currentPage === page
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