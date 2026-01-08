"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Loader2, ChevronLeft, ChevronRight, Users,
  ShieldCheck, UserCog, Plus, Mail, Phone, Calendar as CalendarIcon,
  FilterX
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
    // تعديل 1: استخدام w-full مع overflow-x-hidden لمنع التمدد العرضي
    <div className={`w-full overflow-x-hidden min-h-screen bg-[#F8FAFC] pb-10 ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      <AddModeratorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchUsers} />

      {/* الحاوية الداخلية مع padding متجاوب */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col gap-5 mb-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">{t("title")}</h1>
            <div className="flex items-center gap-2">
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">{t("subtitle")}</p>
            </div>
          </div>

          {/* تعديل 2: جعل الإحصائيات والزر يترتبان بشكل مرن جداً */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
              <span className="text-[10px] text-gray-400 font-black uppercase">
                {t("totalLabel", { type: t(`tabs.${activeTab.toLowerCase()}`) })}:
              </span>
              <span className="text-lg font-black text-teal-600">{totalCount}</span>
            </div>
            
            {activeTab === "MODERATOR" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-[#0E766E] text-white px-4 py-2.5 rounded-xl font-black text-xs shadow-md hover:bg-[#0a5c56] transition-all"
              >
                <Plus size={16} strokeWidth={3} />
                <span>{t("addModerator")}</span>
              </button>
            )}
          </div>
        </div>

        {/* --- Tabs Section --- */}
        {/* تعديل 3: تحسين الـ Tabs على الموبايل لتكون Scrollable بدون ما تخرج بره الشاشة */}
        <div className="mb-6 w-full">
  {/* تعديل: 
      - في الموبايل: grid-cols-1 (تحت بعض) أو grid-cols-3 (بجانب بعض بانتظام)
      - تم استخدام flex-col في الشاشات الصغيرة جداً و flex-row في الشاشات الأكبر
  */}
  <div className="flex flex-col sm:flex-row gap-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm w-full sm:w-fit">
    {(["PROVIDER", "USER", "MODERATOR"] as UserType[]).map((tabId) => (
      <button
        key={tabId}
        onClick={() => handleTabChange(tabId)}
        className={`
          flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-black text-xs transition-all 
          w-full sm:w-auto sm:whitespace-nowrap
          ${activeTab === tabId 
            ? "bg-[#0E766E] text-white shadow-md scale-[1.02]" 
            : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          }
        `}
      >
        <span className="flex-shrink-0">
          {tabId === "PROVIDER" && <ShieldCheck size={16} />}
          {tabId === "USER" && <Users size={16} />}
          {tabId === "MODERATOR" && <UserCog size={16} />}
        </span>
        <span className="flex-1 text-center sm:flex-none">
          {t(`tabs.${tabId.toLowerCase()}`)}
        </span>
      </button>
    ))}
  </div>
</div>

        {/* --- Main Content Section --- */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600 mb-3" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t("loading")}</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center">
              <FilterX size={40} className="mx-auto text-gray-200 mb-4" />
              <h3 className="font-black text-gray-900 text-sm">{t("noDataTitle")}</h3>
            </div>
          ) : (
            <>
              {/* Desktop View (Lg and up) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-separate border-spacing-y-2 px-4">
                   {/* ... (نفس كود الجدول السابق مع تعديل الـ padding) ... */}
                   <thead className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                     <tr>
                        <th className={`p-4 ${isRTL ? 'text-right' : 'text-left'}`}>{t("columns.user")}</th>
                        <th className="p-4 text-center">{t("columns.status")}</th>
                        <th className="p-4 text-center">{t("columns.phone")}</th>
                        <th className={`p-4 ${isRTL ? 'text-left' : 'text-right'}`}>{t("columns.joinedDate")}</th>
                     </tr>
                   </thead>
                   <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="group">
                          <td className={`bg-gray-50/50 p-4 ${isRTL ? 'rounded-r-xl' : 'rounded-l-xl'}`}>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center text-teal-600 font-black">
                                {u.image ? <img src={`/api/media?media=${u.image}`} alt="" className="w-full h-full object-contain" /> : u.name[0]}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-black text-gray-900 truncate max-w-[150px]">{u.name}</span>
                                <span className="text-[10px] text-gray-400 truncate max-w-[150px]">{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="bg-gray-50/50 p-4 text-center">
                            <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                              {u.status || "PENDING"}
                            </span>
                          </td>
                          <td className="bg-gray-50/50 p-4 text-center text-[11px] font-bold text-gray-600">{u.phone || "—"}</td>
                          <td className={`bg-gray-50/50 p-4 ${isRTL ? 'rounded-l-xl text-left' : 'rounded-r-xl text-right'} text-[10px] font-black text-gray-400`}>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB") : "—"}
                          </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
              </div>

              {/* تعديل 4: Mobile Card View (Below LG) - تحسين جذري لشكل الكارت */}
              <div className="lg:hidden divide-y divide-gray-50">
                {users.map((u) => (
                  <div key={u.id} className="p-4 sm:p-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-teal-50 flex-shrink-0 flex items-center justify-center text-teal-600 font-black text-lg border border-teal-100 shadow-sm overflow-hidden">
                           {u.image ? <img src={`/api/media?media=${u.image}`} alt="" className="w-full h-full object-contain" /> : u.name[0]}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-gray-900 truncate">{u.name}</span>
                          <span className="text-[10px] text-gray-400 font-bold">ID: {u.id}</span>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase flex-shrink-0 ${u.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                          {u.status || "PENDING"}
                      </span>
                    </div>
                    
                    {/* شبكة معلومات بسيطة داخل الكارت */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase leading-none">{t("columns.user")}</span>
                        <span className="text-[11px] font-bold text-gray-700 truncate">{u.email}</span>
                      </div>
                      <div className="flex flex-col gap-1 sm:items-end">
                        <span className="text-[9px] font-black text-gray-400 uppercase leading-none">{t("columns.phone")}</span>
                        <span className="text-[11px] font-bold text-gray-700" dir="ltr">{u.phone || "—"}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-gray-400 uppercase leading-none">{t("columns.joinedDate")}</span>
                        <span className="text-[11px] font-bold text-gray-700">
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
          <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-[10px] font-black text-gray-400 uppercase">
              {t("paginationInfo", { current: currentPage, total: totalPages })}
            </p>
            <div className="flex items-center gap-2">
              <button 
                 onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                 disabled={currentPage === 1}
                 className="p-2 rounded-lg border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all"
              >
                {isRTL ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <span className="text-xs font-black text-teal-600 bg-teal-50 px-3 py-1 rounded-md">{currentPage}</span>
              <button 
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                 disabled={currentPage === totalPages}
                 className="p-2 rounded-lg border border-gray-100 disabled:opacity-20 hover:bg-gray-50 transition-all"
              >
                {isRTL ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}