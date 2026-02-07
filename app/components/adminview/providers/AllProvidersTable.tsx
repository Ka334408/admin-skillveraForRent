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
import { is } from "date-fns/locale";

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
    <div className={`w-full max-w-[100vw] overflow-x-hidden bg-[#F8FAFC] min-h-screen ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-4 md:p-8">
        <AddModeratorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchUsers} />

        {/* --- Header --- */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-6">
          <div className="text-right sm:text-start">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900">{t("title")}</h1>
            <p className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1 flex items-center justify-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
              {t("subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center flex-1 sm:flex-none sm:min-w-[120px]">
              <span className="text-[9px] text-gray-400 font-black uppercase whitespace-nowrap">{t("totalLabel", { type: "" })}</span>
              <span className="text-lg font-black text-teal-600">{totalCount}</span>
            </div>
            {activeTab === "MODERATOR" && (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-[#0E766E] text-white px-5 py-3 rounded-2xl font-black text-xs shadow-lg hover:scale-105 transition-transform active:scale-95">
                <Plus size={16} strokeWidth={3} />
                <span>{t("addModerator")}</span>
              </button>
            )}
          </div>
        </div>

        {/* --- Tabs (Vertical on Mobile / Horizontal on Desktop) --- */}
        <div className="flex flex-col sm:flex-row bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-8 gap-2">
          {[
            { id: "PROVIDER", label: t("tabs.provider"), icon: <ShieldCheck size={18} /> },
            { id: "USER", label: t("tabs.user"), icon: <Users size={18} /> },
            { id: "MODERATOR", label: t("tabs.moderator"), icon: <UserCog size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as UserType)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-black text-sm transition-all flex-1 ${
                activeTab === tab.id 
                ? "bg-[#0E766E] text-white shadow-lg shadow-teal-100 scale-[1.02]" 
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className={activeTab === tab.id ? "text-white" : "text-teal-500"}>
                {tab.icon}
              </span>
              {tab.label}
              {activeTab === tab.id && (
                 <div className="ms-auto w-2 h-2 rounded-full bg-white animate-pulse hidden sm:block" />
              )}
            </button>
          ))}
        </div>

        {/* --- Content Area --- */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center"><Loader2 className="animate-spin text-teal-600 w-8 h-8 mb-2 opacity-40" /></div>
          ) : users.length === 0 ? (
            <div className="p-20 text-center text-gray-400 font-black"><FilterX className="mx-auto mb-2 opacity-20" size={40} /><p>{t("noDataTitle")}</p></div>
          ) : (
            <div className="divide-y divide-gray-50">
              {/* Desktop Header */}
              <div className="hidden md:grid grid-cols-5 gap-4 p-6 bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                <div className="px-2">ID</div>
                <div>{t("columns.user")}</div>
                <div className="text-center">{t("columns.status")}</div>
                <div className="text-center">{t("columns.phone")}</div>
                <div className={isRTL ? "text-left" : "text-right"}>{t("columns.joinedDate")}</div>
              </div>

              {/* Rows */}
              {users.map((u) => (
                <div key={u.id} className="p-4 md:p-6 hover:bg-gray-50/30 transition-colors">
                  
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-5 md:gap-4 items-center">
                    <div className="text-[10px] font-black text-gray-300">#{u.id}</div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 font-black overflow-hidden border border-teal-100">
                        {u.image ? <img src={`/api/media?media=${u.image}`} className="w-full h-full object-contain" alt="" /> : u.name?.[0]}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-black text-gray-900 truncate">{u.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold truncate">{u.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${u.isApproved ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                        {u.isApproved ? (isRTL ? "مفعل" : "ACTIVE") : (isRTL ? "معلق" : "PENDING")}
                      </span>
                      {activeTab === "PROVIDER" && !u.isApproved && (
                        <button onClick={() => handleApproveProvider(u.id)} className="bg-emerald-600 text-white px-3 py-1 rounded-lg text-[9px] font-black hover:bg-emerald-700">تفعيل</button>
                      )}
                    </div>
                    <div className="text-center text-xs font-black text-gray-600" dir="ltr">{u.phone || "—"}</div>
                    <div className={`text-[10px] font-black text-gray-400 ${isRTL ? 'text-left' : 'text-right'}`}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden flex flex-col gap-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-teal-600 text-lg overflow-hidden shrink-0 shadow-sm">
                           {u.image ? <img src={`/api/media?media=${u.image}`} className="w-full h-full object-contain" alt="" /> : u.name?.[0]}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-gray-900 truncate uppercase">{u.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold truncate tracking-tight">{u.email}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black ${u.isApproved ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"}`}>
                          {u.isApproved ? (isRTL ? "مفعل" : "ACTIVE") : (isRTL ? "معلق" : "PENDING")}
                        </span>
                        <span className="text-[9px] text-gray-300 font-black">#{u.id}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-gray-50/80 p-3 rounded-2xl border border-gray-100/50">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{t("columns.phone")}</span>
                        <span className="text-[11px] font-black text-gray-700" dir="ltr">{u.phone || "—"}</span>
                      </div>
                      <div className={`flex flex-col gap-0.5 ${isRTL ? 'items-start' : 'items-end'}`}>
                        <span className="text-[8px] text-gray-400 font-black uppercase tracking-widest">{t("columns.joinedDate")}</span>
                        <span className="text-[10px] font-black text-gray-700">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</span>
                      </div>
                    </div>

                    {activeTab === "PROVIDER" && !u.isApproved && (
                      <button onClick={() => handleApproveProvider(u.id)} disabled={actionLoading === u.id} className="w-full bg-[#0E766E] text-white py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-teal-50">
                        {actionLoading === u.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        {isRTL ? "تفعيل الحساب الآن" : "Activate Now"}
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Pagination --- */}
        {!loading && users.length > 0 && (
          <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-5 rounded-[2rem] border border-gray-100">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("paginationInfo", { current: currentPage, total: totalPages })}</span>
            <div className="flex items-center gap-1.5 flex-wrap justify-center">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2.5 rounded-xl border border-gray-100 disabled:opacity-20 hover:bg-gray-50">
                {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {getPaginationRange().map((p, i) => (
                  <button key={i} onClick={() => typeof p === 'number' && setCurrentPage(p)} className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${currentPage === p ? 'bg-[#0E766E] text-white shadow-md' : 'text-gray-400 hover:bg-gray-50'}`}>{p}</button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2.5 rounded-xl border border-gray-100 disabled:opacity-20 hover:bg-gray-50">
                {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}