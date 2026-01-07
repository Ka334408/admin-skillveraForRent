"use client";

import { CheckCircle, XCircle, Clock, Eye, RefreshCw, AlertTriangle, ListChecks, Plus, Loader2, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';
import 'moment/locale/ar';
import { toast, Toaster } from 'react-hot-toast';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const API_PENDING_REQUESTS = '/dashboard-dashboard/need-approval-facilities';
const API_APPROVED_FACILITIES = '/guest-facility';
const API_STATUS_UPDATE = '/moderator-facility/';
const API_CREATE_CATEGORY = '/admin/category/create';

interface FacilityItem {
  id: number;
  name: { en: string; ar?: string };
  status: string;
  createdAt?: string;
  provider?: { id: number; name: string; };
}

type Tab = 'pending' | 'approved';

export default function FacilityApprovalTabs() {
  const t = useTranslations("Facilities");
  const locale = useLocale();
  const isRTL = locale === "ar";
  moment.locale(locale);

  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catNameEn, setCatNameEn] = useState("");
  const [catNameAr, setCatNameAr] = useState("");
  const [catLoading, setCatLoading] = useState(false);
  const router = useRouter();

  const pathname = usePathname();
  const isModeratorView = pathname.includes("moderator")
  
  const fetchData = useCallback(async (tab: Tab, page: number) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = tab === 'pending' ? API_PENDING_REQUESTS : API_APPROVED_FACILITIES;
      const { data } = await axiosInstance.get(endpoint, { params: { page, limit: itemsPerPage } });
      let fetchedData = tab === 'pending' ? data?.data?.data : data?.data;
      setFacilities(fetchedData || []);
      setTotalPages(tab === 'pending' ? data?.data?.totalPages : (data?.totalPages || 1));
    } catch (err) {
      setError(t("errors.fetchFailed"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => { fetchData(activeTab, currentPage); }, [activeTab, currentPage, fetchData]);

  const handleUpdateStatus = async (facilityId: number, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(facilityId);
    try {
      await axiosInstance.patch(`${API_STATUS_UPDATE}${facilityId}/status`, { status });
      toast.success(status === 'APPROVED' ? t("success.approved") : t("success.rejected"));
      fetchData(activeTab, currentPage);
    } catch (err) {
      toast.error(t("errors.actionFailed"));
    } finally {
      setProcessingId(null);
    }
  };
 const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!catNameEn.trim() || !catNameAr.trim()) {
      toast.error(isRTL ? "يرجى ملء جميع الحقول" : "Please fill all fields");
      return;
    }

    setCatLoading(true);
    try {
      const response = await axiosInstance.post(API_CREATE_CATEGORY, {
        name: {
          en: catNameEn,
          ar: catNameAr
        }
      });

      const successMsg = response.data?.message || t("success.categoryCreated");
      toast.success(successMsg);
      
      // إغلاق المودال وتفريغ الحقول
      setIsCatModalOpen(false);
      setCatNameEn("");
      setCatNameAr("");

    } catch (err: any) {
      console.error("Create Category Error:", err);
      const errorMessage = err.response?.data?.message || t("errors.categoryFailed");
      toast.error(errorMessage);
    } finally {
      setCatLoading(false);
    }
  };

  return (
    <div className={`w-full bg-[#FBFBFE] min-h-screen p-4 md:p-10 ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      <Toaster position="top-center" reverseOrder={false} />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t("title")}</h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.15em] mt-1.5">{t("subtitle")}</p>
        </div>
        <button 
          onClick={() => setIsCatModalOpen(true)}
          className="group flex items-center gap-3 bg-[#0E766E] text-white px-7 py-4 rounded-2xl font-black text-sm shadow-xl shadow-teal-900/10 hover:bg-[#0a5c56] transition-all"
        >
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus size={18} strokeWidth={3} />
          </div>
          {t("addCategory")}
        </button>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full max-w-md border border-slate-200/50">
          {(['pending', 'approved'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-[0.9rem] font-black text-xs transition-all ${
                activeTab === tab ? "bg-white text-[#0E766E] shadow-sm" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === 'pending' ? <Clock size={16} /> : <CheckCircle size={16} />}
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>
        <button onClick={() => fetchData(activeTab, currentPage)} className="hidden md:flex p-3 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-teal-600 shadow-sm transition-all">
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Luxury Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="overflow-x-auto min-h-[500px]">
          {loading ? (
             <div className="flex flex-col items-center justify-center h-[500px] opacity-20"><Loader2 className="w-12 h-12 animate-spin" /></div>
          ) : (
            <table className="w-full border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className={`py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest ${isRTL ? 'text-right' : 'text-left'}`}># ID</th>
                  <th className={`py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest ${isRTL ? 'text-right' : 'text-left'}`}>{t("columns.facility")}</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">{t("columns.provider")}</th>
                  <th className={`py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest ${isRTL ? 'text-left' : 'text-right'}`}>{t("columns.date")}</th>
                  <th className="py-5 px-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">{t("columns.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {facilities.map((fac) => (
                  <tr key={fac.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-6 px-8 font-black text-slate-400 text-xs">#{fac.id}</td>
                    <td className="py-6 px-8">
                      <div className="font-black text-slate-900 text-sm tracking-tight">
                        {isRTL && fac.name.ar ? fac.name.ar : fac.name.en}
                      </div>
                    </td>
                    <td className="py-6 px-8 text-center font-bold text-slate-500 text-xs">{fac.provider?.name || "—"}</td>
                    <td className={`py-6 px-8 text-[11px] font-black text-slate-400 ${isRTL ? 'text-left' : 'text-right'}`}>
                      {fac.createdAt ? moment(fac.createdAt).fromNow() : "—"}
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center justify-center gap-3">
                        <button className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 transition-all shadow-sm"
                        onClick={()=>{isModeratorView? router.push(`/${locale}/moderator/AllFacilities/Facility/${fac.id}`) : router.push(`/${locale}/admin/AllFacilities/Facility/${fac.id}`)}}
                        ><Eye size={16} /></button>
                        {activeTab === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => handleUpdateStatus(fac.id, 'APPROVED')}
                              disabled={processingId === fac.id}
                              className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100/50"
                            >
                              {processingId === fac.id ? <Loader2 className="animate-spin w-3 h-3" /> : <Check size={14} strokeWidth={3} />}
                              {t("actions.approve") || "Approve"}
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(fac.id, 'REJECTED')}
                              disabled={processingId === fac.id}
                              className="flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all border border-rose-100/50"
                            >
                              <X size={14} strokeWidth={3} />
                              {t("actions.reject") || "Reject"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination Container */}
      {!loading && facilities.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between bg-white p-5 rounded-3xl border border-slate-200 shadow-sm gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {t("pagination.page")} <span className="text-slate-900 mx-1">{currentPage}</span> {t("pagination.of")} <span className="text-slate-900 mx-1">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-100 transition-all"
            >
              {isRTL ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-100 transition-all"
            >
              {isRTL ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>
      )}

       {/* Add Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 shadow-2xl animate-in zoom-in duration-300" dir={isRTL ? "rtl" : "ltr"}>
            <h4 className="text-lg md:text-xl font-black text-gray-900 mb-6">{t("modal.title")}</h4>
            <form onSubmit={handleCreateCategory} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t("modal.labelEn")}</label>
                <input 
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-[#0E766E] transition-all"
                  placeholder="e.g. Health"
                  value={catNameEn}
                  onChange={(e) => setCatNameEn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">{t("modal.labelAr")}</label>
                <input 
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:bg-white focus:border-[#0E766E] transition-all"
                  placeholder="مثلاً: الصحة"
                  value={catNameAr}
                  onChange={(e) => setCatNameAr(e.target.value)}
                />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="flex-1 py-4 font-black text-gray-400 uppercase text-[10px] tracking-widest">{t("modal.cancel")}</button>
                <button 
                  type="submit" 
                  disabled={catLoading}
                  className="flex-[2] bg-[#0E766E] text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-teal-100 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {catLoading ? <Loader2 className="animate-spin w-4 h-4" /> : t("modal.submit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}