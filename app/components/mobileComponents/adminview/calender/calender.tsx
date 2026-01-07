"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Calendar as CalendarIcon, LayoutGrid, Loader2, 
  ChevronLeft, ChevronRight 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // إضافة المكتبة
import axiosInstance from "@/lib/axiosInstance";
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameDay, addMonths, subMonths, parseISO 
} from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";

export default function FacilitiesCalendar() {
  const t = useTranslations("Calendar");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const dateLocale = isRTL ? ar : enUS;
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0); 
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get('/dashboard-facility/list');
        if (data?.data) setFacilities(data.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchFacilities();
  }, []);

  const daysInMonth = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    });
  }, [currentDate]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentDate(newDirection === 1 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const weekDays = isRTL 
    ? ["الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <main className={`flex-1 bg-[#F8FAFC] min-h-screen p-4 md:p-8 ${isRTL ? "font-cairo" : "font-sans"}`} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
      >
        <div className={isRTL ? "text-right" : "text-left"}>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            {t("title")} <span className="text-teal-600 underline decoration-teal-200">2026</span>
          </h1>
          <p className="text-gray-400 font-bold mt-1 text-xs uppercase tracking-[0.2em]">{t("subtitle")}</p>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-black text-gray-900 text-xs uppercase">{t("recentAdded")}</h3>
                <div className="p-2.5 bg-teal-50 text-teal-600 rounded-2xl"><LayoutGrid size={20} /></div>
             </div>
             <div className="space-y-4">
                {facilities.slice(0, 5).map((fac, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                      key={fac.id} className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-gray-50/50 border border-gray-100 hover:border-teal-100 transition-all"
                    >
                        <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.3)]" />
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-black text-gray-800 truncate">{fac.name[locale as 'ar'|'en'] || fac.name.en}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{format(parseISO(fac.createdAt), "dd MMM yyyy", { locale: dateLocale })}</p>
                        </div>
                    </motion.div>
                ))}
             </div>
          </motion.div>
        </div>

        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="flex items-center justify-between p-8 border-b border-gray-50 bg-white">
              <h2 className="text-2xl font-black text-gray-900">{format(currentDate, "MMMM yyyy", { locale: dateLocale })}</h2>
              <div className="flex gap-3 bg-gray-50 p-1.5 rounded-2xl">
                <button onClick={() => paginate(-1)} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-600">
                  {isRTL ? <ChevronRight size={22}/> : <ChevronLeft size={22}/>}
                </button>
                <button onClick={() => paginate(1)} className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-gray-600">
                  {isRTL ? <ChevronLeft size={22}/> : <ChevronRight size={22}/>}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 bg-gray-50/40 border-b border-gray-50">
              {weekDays.map(d => <div key={d} className="py-5 text-center text-[11px] font-black text-gray-400 uppercase tracking-widest">{d}</div>)}
            </div>

            {/* Animation Wrapper for the Grid */}
            <div className="relative overflow-hidden min-h-[500px]" style={{ direction: 'ltr' }}>
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentDate.toISOString()}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="grid grid-cols-7 divide-x divide-y divide-gray-50"
                >
                  {daysInMonth.map((day, i) => {
                    const createdInDay = facilities.filter(f => isSameDay(parseISO(f.createdAt), day));
                    return (
                      <div key={i} className="min-h-[150px] p-4 hover:bg-gray-50/50 transition-colors group" dir={isRTL ? "rtl" : "ltr"}>
                        <span className={`text-xs font-black p-1.5 rounded-lg ${isSameDay(day, new Date()) ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'text-gray-400'}`}>
                          {format(day, "d")}
                        </span>
                        <div className="mt-3 space-y-2">
                          {createdInDay.map(fac => (
                            <div key={fac.id} className="bg-white border border-teal-50 text-[#0E766E] text-[10px] font-black p-2 rounded-xl shadow-sm truncate flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                              {fac.name[locale as 'ar'|'en'] || fac.name.en}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}