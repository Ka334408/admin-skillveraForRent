"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Loader2, Mail, Phone, Calendar as CalendarIcon,
  FilterX, MessageSquare, Trash2, ExternalLink, User,
  CheckCircle2, Clock, Inbox
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import toast from "react-hot-toast";

export default function ContactUsMessages() {
  const t = useTranslations("ContactUs"); // تأكد من إضافة الترجمات في ملف الـ JSON
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin-contact-us`);
      setMessages(response.data?.data || []);
    } catch (error) {
      console.error(`Error:`, error);
      toast.error(isRTL ? "فشل في جلب البيانات" : "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [isRTL]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  return (
    <div className={`w-full px-4 md:px-8 py-8 min-h-screen bg-[#F8FAFC] ${isRTL ? 'font-cairo' : ''}`} dir={isRTL ? "rtl" : "ltr"}>
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-600 rounded-lg text-white">
               <Inbox size={24} />
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {isRTL ? "رسائل التواصل" : "Contact Messages"}
            </h1>
          </div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            {isRTL ? "إدارة طلبات واستفسارات المستخدمين" : "Manage user inquiries & requests"}
          </p>
        </div>

        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-[10px] text-gray-400 font-black uppercase">
            {isRTL ? "إجمالي الرسائل" : "Total Messages"}
          </span>
          <span className="text-xl font-black text-teal-600">{messages.length}</span>
        </div>
      </div>

      {/* --- Main Content --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[400px] text-teal-600">
          <Loader2 className="w-12 h-12 animate-spin mb-4 opacity-40" />
          <p className="font-black text-gray-400 animate-pulse text-xs uppercase tracking-widest">
            {isRTL ? "جاري التحميل..." : "Loading Messages..."}
          </p>
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <FilterX size={40} className="text-gray-200" />
          </div>
          <h3 className="font-black text-gray-900 text-lg">{isRTL ? "لا توجد رسائل" : "No Messages Found"}</h3>
          <p className="text-gray-400 text-sm mt-1">{isRTL ? "صندوق الوارد الخاص بك فارغ حالياً" : "Your inbox is currently empty"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="group bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                
                {/* User Info Sidebar (Left/Right) */}
                <div className="lg:w-1/4 bg-gray-50/50 p-6 border-b lg:border-b-0 lg:border-inline-end border-gray-100">
                  <div className="flex flex-col items-center lg:items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-teal-600 border border-gray-100">
                      <User size={28} />
                    </div>
                    <div className="text-center lg:text-start">
                      <h3 className="font-black text-gray-900 text-base leading-tight">{msg.name}</h3>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">ID: #{msg.id}</p>
                    </div>
                    
                    <div className="flex flex-col gap-2 w-full mt-2">
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-teal-600 transition-colors">
                        <Mail size={14} className="text-teal-500" />
                        <span className="truncate">{msg.email}</span>
                      </a>
                      <a href={`tel:${msg.phone}`} className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-teal-600 transition-colors">
                        <Phone size={14} className="text-teal-500" />
                        <span dir="ltr">{msg.phone}</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Message Content (Main) */}
                <div className="flex-1 p-6 lg:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        
                        <div className="flex items-center gap-1.5 text-xs font-black text-gray-400">
                          <CalendarIcon size={14} />
                          {new Date(msg.createdAt).toLocaleDateString(isRTL ? "ar-EG" : "en-GB")}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 relative">
                      <MessageSquare size={20} className="absolute -top-3 -inline-start-3 text-teal-100" />
                      <p className="text-gray-700 font-medium text-sm leading-relaxed italic">
                        "{msg.message}"
                      </p>
                    </div>
                  </div>

               
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}