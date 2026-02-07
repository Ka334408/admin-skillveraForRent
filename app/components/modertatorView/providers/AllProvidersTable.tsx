"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Loader2, ChevronLeft, ChevronRight, Users,
  ShieldCheck, UserCog, Mail, Phone, Calendar as CalendarIcon,
  FilterX, CheckCircle, Hash
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
    <div className={`w-full max-w-[100vw] overflow-x-hidden px-4 md:px-8 py-8 min-h-screen bg-[#F8FAFC] ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            {t("subtitle")}
          </p>
        </div>

        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center self-start md:self-auto">
          <span className="text-[10px] text-gray-400 font-black uppercase">
            {t("totalLabel", { type: "" })}
          </span>
          <span className="text-xl font-black text-teal-600">{totalCount}</span>
        </div>
      </div>

      {/* Tabs Layout - Vertical on Mobile */}
      <div className="flex flex-col md:flex-row bg-white p-2 rounded-3xl shadow-sm border border-gray-100 mb-8 gap-2">
        {[
          { id: "PROVIDER", label: t("tabs.provider"), icon: <ShieldCheck size={20} /> },
          { id: "USER", label: t("tabs.user"), icon: <Users size={20} /> },
          { id: "MODERATOR", label: t("tabs.moderator"), icon: <UserCog size={20} /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id as UserType)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all flex-1 ${
              activeTab === tab.id
                ? "bg-[#0E766E] text-white shadow-lg shadow-teal-50 scale-[1.01]"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4 opacity-40" />
            <p className="font-black text-gray-400 text-xs uppercase tracking-widest">{t("loading")}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-gray-400">
            <FilterX size={50} className="mb-4 opacity-20" />
            <p className="font-black text-lg">{t("noDataTitle")}</p>
          </div>
        ) : (
          <div className="w-full">
            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto p-4">
              <table className="w-full border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-gray-400 text-[10px] font-black uppercase tracking-[0.15em]">
                    <th className="pb-4 px-6 text-start">ID</th>
                    <th className="pb-4 px-6 text-start">{t("columns.user")}</th>
                    <th className="pb-4 px-6 text-center">{t("columns.status")}</th>
                    <th className="pb-4 px-6 text-center">{t("columns.phone")}</th>
                    <th className="pb-4 px-6 text-end">{t("columns.joinedDate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="group transition-all">
                      <td className={`bg-gray-50/50 py-5 px-6 font-black text-gray-400 text-[10px] border-y border-transparent group-hover:bg-gray-50 ${isRTL ? "rounded-r-2xl border-r" : "rounded-l-2xl border-l"}`}>
                        #{u.id}
                      </td>
                      <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center text-teal-600 font-black">
                            {u.image ? <img src={`/api/media?media=${u.image}`} alt="" className="w-full h-full object-contain" /> : u.name?.[0]}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-black text-gray-900 text-sm truncate max-w-[150px]">{u.name}</span>
                            <span className="text-[10px] text-gray-400 font-bold truncate max-w-[150px]">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:bg-gray-50 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${u.isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                            {u.isApproved ? (isRTL ? "مفعل" : "ACTIVE") : (isRTL ? "معلق" : "PENDING")}
                          </span>
                          {activeTab === "PROVIDER" && !u.isApproved && (
                            <button onClick={() => handleApproveProvider(u.id)} disabled={actionLoading === u.id} className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[9px] font-black hover:bg-emerald-700 transition-colors">
                              {actionLoading === u.id ? <Loader2 size={10} className="animate-spin" /> : (isRTL ? "تفعيل" : "Activate")}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:bg-gray-50 text-center text-xs font-black text-gray-600" dir="ltr">
                        {u.phone || "—"}
                      </td>
                      <td className={`bg-gray-50/50 py-5 px-6 border-y border-transparent group-hover:bg-gray-50 text-[10px] font-black text-gray-400 ${isRTL ? "text-start rounded-l-2xl border-l" : "text-end rounded-r-2xl border-r"}`}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-GB') : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards */}
            <div className="md:hidden flex flex-col divide-y divide-gray-50">
              {users.map((u) => (
                <div key={u.id} className="p-5 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-teal-600 font-black text-lg overflow-hidden shrink-0 shadow-sm">
                        {u.image ? <img src={`/api/media?media=${u.image}`} alt="" className="w-full h-full object-contain" /> : u.name?.[0]}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-black text-gray-900 truncate uppercase tracking-tight">{u.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold truncate tracking-tight">{u.email}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black border ${u.isApproved ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                        {u.isApproved ? (isRTL ? "مفعل" : "ACTIVE") : (isRTL ? "معلق" : "PENDING")}
                      </span>
                      <span className="text-[9px] text-gray-300 font-black tracking-tighter">#{u.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50/80 p-3.5 rounded-2xl border border-gray-100/50">
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
                    <button 
                      onClick={() => handleApproveProvider(u.id)} 
                      disabled={actionLoading === u.id} 
                      className="w-full bg-[#0E766E] text-white py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-teal-50"
                    >
                      {actionLoading === u.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                      {isRTL ? "تفعيل الحساب الآن" : "Activate Account Now"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-10 bg-white p-5 rounded-3xl border border-gray-100 gap-6 shadow-sm">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            {t("paginationInfo", { current: currentPage, total: totalPages })}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-gray-100 disabled:opacity-20 hover:bg-teal-50 hover:text-teal-600 transition-all text-gray-400"
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            <div className="flex items-center gap-1">
              {getPaginationRange().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === "number" && setCurrentPage(page)}
                  disabled={page === "..."}
                  className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${
                    currentPage === page
                      ? "bg-[#0E766E] text-white shadow-md"
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
              className="p-2.5 rounded-xl border border-gray-100 disabled:opacity-20 hover:bg-teal-50 hover:text-teal-600 transition-all text-gray-400"
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}