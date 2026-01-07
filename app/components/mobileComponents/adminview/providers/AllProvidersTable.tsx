"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Loader2, ChevronLeft, ChevronRight, Users,
  ShieldCheck, UserCog, Plus, Mail, Phone, Calendar as CalendarIcon,
  FilterX, MoreVertical
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl"; 
import AddModeratorModal from "./addNewModerator";

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

  const handleTabChange = (type: UserType) => {
    setActiveTab(type);
    setCurrentPage(1);
  };

  return (
    <div className={`w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen bg-[#F8FAFC] ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      <AddModeratorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchUsers} />

      {/* --- Header Section --- */}
      <div className="flex flex-col gap-6 mb-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{t("title")}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <p className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">{t("subtitle")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[140px] bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center lg:min-w-[160px]">
            <span className="text-[9px] text-gray-400 font-black uppercase mb-1">{t("totalLabel", { type: t(`tabs.${activeTab.toLowerCase()}`) })}</span>
            <span className="text-xl font-black text-teal-600">{totalCount}</span>
          </div>
          {activeTab === "MODERATOR" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex-1 min-w-[180px] flex items-center justify-center gap-2 bg-[#0E766E] text-white px-6 py-4 rounded-2xl font-black text-sm shadow-lg shadow-teal-100 hover:bg-[#0a5c56] transition-all"
            >
              <Plus size={18} strokeWidth={3} />
              <span className="whitespace-nowrap">{t("addModerator")}</span>
            </button>
          )}
        </div>
      </div>

      {/* --- Tabs Section --- */}
      <div className="mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="inline-flex bg-white p-1.5 rounded-[1.2rem] border border-gray-100 shadow-sm min-w-full sm:min-w-0">
          {(["PROVIDER", "USER", "MODERATOR"] as UserType[]).map((tabId) => (
            <button
              key={tabId}
              onClick={() => handleTabChange(tabId)}
              className={`flex items-center justify-center gap-2 px-4 py-3 sm:px-8 sm:py-3.5 rounded-xl font-black text-xs sm:text-sm transition-all whitespace-nowrap flex-1 sm:flex-none ${
                activeTab === tabId ? "bg-[#0E766E] text-white shadow-md" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tabId === "PROVIDER" && <ShieldCheck size={16} />}
              {tabId === "USER" && <Users size={16} />}
              {tabId === "MODERATOR" && <UserCog size={16} />}
              {t(`tabs.${tabId.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-teal-500 opacity-20 mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{t("loading")}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <FilterX size={48} className="mx-auto text-gray-200 mb-4" />
            <h3 className="font-black text-gray-900">{t("noDataTitle")}</h3>
            <p className="text-sm text-gray-400 font-bold">{t("noDataSubtitle")}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View (lg and up) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3 px-6 pb-6">
                <thead>
                  <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
                    <th className={`py-4 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t("columns.user")}</th>
                    <th className="py-4 px-4 text-center">{t("columns.status")}</th>
                    <th className="py-4 px-4 text-center">{t("columns.phone")}</th>
                    <th className={`py-4 px-4 ${isRTL ? 'text-left' : 'text-right'}`}>{t("columns.joinedDate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="group transition-all">
                      <td className={`bg-gray-50/50 py-4 px-5 border-y border-transparent group-hover:bg-white group-hover:border-gray-100 ${isRTL ? 'rounded-r-2xl border-r' : 'rounded-l-2xl border-l'}`}>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex-shrink-0 overflow-hidden flex items-center justify-center text-teal-600 font-black">
                            {u.image ? <img src={`/api/media?media=${u.image}`} alt="" className="w-full h-full object-contain" /> : u.name[0]}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black text-gray-900 truncate max-w-[180px]">{u.name}</span>
                            <span className="text-[11px] text-gray-400 font-bold truncate lowercase">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="bg-gray-50/50 py-4 px-5 border-y border-transparent group-hover:bg-white group-hover:border-gray-100 text-center">
                        <span className={`inline-block px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {u.status || "PENDING"}
                        </span>
                      </td>
                      <td className="bg-gray-50/50 py-4 px-5 border-y border-transparent group-hover:bg-white group-hover:border-gray-100 text-center font-bold text-xs text-gray-600">
                        {u.phone || "—"}
                      </td>
                      <td className={`bg-gray-50/50 py-4 px-5 border-y border-transparent group-hover:bg-white group-hover:border-gray-100 ${isRTL ? 'rounded-l-2xl border-l text-left' : 'rounded-r-2xl border-r text-right'}`}>
                         <span className="text-[11px] font-black text-gray-400">
                           {u.createdAt ? new Date(u.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB") : "—"}
                         </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Card View (Below lg) */}
            <div className="lg:hidden divide-y divide-gray-50">
              {users.map((u) => (
                <div key={u.id} className="p-5 hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 flex-shrink-0 flex items-center justify-center text-teal-600 font-black text-lg border border-teal-100 shadow-sm overflow-hidden">
                         {u.image ? <img src={`/api/media?media=${u.image}`} alt="" className="w-full h-full object-cover" /> : u.name[0]}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-black text-gray-900 truncate pr-2">{u.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">#{u.id}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {u.status || "PENDING"}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-4 pt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-300 uppercase mb-1">{t("columns.contact")}</span>
                      <span className="text-[11px] font-bold text-gray-600 truncate">{u.email}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-gray-300 uppercase mb-1">{t("columns.phone")}</span>
                      <span className="text-[11px] font-bold text-gray-600" dir="ltr">{u.phone || "—"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-gray-300 uppercase mb-1">{t("columns.joinedDate")}</span>
                      <span className="text-[11px] font-bold text-gray-600">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB") : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* --- Pagination --- */}
      {!loading && users.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center sm:text-right">
            {t("paginationInfo", { current: currentPage, total: totalPages })}
          </p>
          <div className="flex items-center justify-center gap-2">
            <button 
               onClick={() => setCurrentPage(p => Math.max(1, p-1))}
               disabled={currentPage === 1}
               className="p-2.5 rounded-xl border border-gray-100 disabled:opacity-30 text-gray-400 hover:bg-gray-50 transition-all"
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <div className="flex items-center gap-1.5">
               <span className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center text-xs font-black shadow-lg shadow-teal-100">{currentPage}</span>
               <span className="text-gray-300 font-bold mx-1">/</span>
               <span className="text-gray-400 font-bold text-xs">{totalPages}</span>
            </div>
            <button 
               onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
               disabled={currentPage === totalPages}
               className="p-2.5 rounded-xl border border-gray-100 disabled:opacity-30 text-gray-400 hover:bg-gray-50 transition-all"
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}