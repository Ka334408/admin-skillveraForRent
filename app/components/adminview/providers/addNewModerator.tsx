"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2, X, AlertCircle, UserPlus, Mail, Phone as PhoneIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useTranslations, useLocale } from "next-intl";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddModeratorModal({ isOpen, onClose, onSuccess }: Props) {
  const t = useTranslations("AddModerator");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roleId: 1,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!formData.phone.startsWith('+') || formData.phone.length < 10) {
      setErrorMessage(t("validation.phone"));
      setLoading(false);
      return;
    }

    try {
      await axiosInstance.post("/moderator/create", formData);
      toast.success(t("success"));
      onSuccess();
      onClose();
      setFormData({ name: "", email: "", phone: "", roleId: 1 }); 
    } catch (error: any) {
      const msg = error.response?.data?.message || t("errorDefault");
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4" dir={isRTL ? "rtl" : "ltr"}>
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white/20">
        
        {/* Header */}
        <div className="relative px-8 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                  <UserPlus size={22} strokeWidth={2.5} />
               </div>
               <div>
                  <h3 className="text-xl font-black text-gray-900 leading-none">{t("title")}</h3>
                  <p className="text-[11px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{t("subtitle")}</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-400 hover:text-gray-900">
              <X size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="mx-8 mt-2 p-4 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex items-center gap-3 text-rose-600 text-sm animate-shake">
            <AlertCircle size={18} strokeWidth={2.5} />
            <p className="font-bold">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">{t("fields.name")}</label>
            <div className="relative group">
               <input
                 required
                 type="text"
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-600 transition-all"
                 placeholder={t("placeholders.name")}
                 value={formData.name}
                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
               />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">{t("fields.email")}</label>
            <div className="relative">
               <input
                 required
                 type="email"
                 className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3.5 text-sm font-bold outline-none focus:bg-white focus:ring-4 focus:ring-teal-500/5 focus:border-teal-600 transition-all"
                 placeholder={t("placeholders.email")}
                 value={formData.email}
                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
               />
            </div>
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">{t("fields.phone")}</label>
            <div className="phone-input-wrapper" dir="ltr"> {/* Phone always LTR */}
              <PhoneInput
                country={"sa"}
                value={formData.phone}
                onChange={(value) => setFormData({ ...formData, phone: `+${value}` })}
                inputStyle={{
                  width: "100%",
                  height: "52px",
                  borderRadius: "1rem",
                  border: "1px solid #f3f4f6",
                  backgroundColor: "#f9fafb",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
                buttonStyle={{
                  borderRadius: isRTL ? "0 1rem 1rem 0" : "1rem 0 0 1rem",
                  border: "1px solid #f3f4f6",
                  backgroundColor: "#f9fafb",
                  padding: "0 8px",
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 rounded-2xl font-black text-gray-400 hover:bg-gray-50 transition-all text-sm uppercase tracking-widest"
            >
              {t("buttons.cancel")}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[1.5] bg-[#0E766E] text-white px-4 py-4 rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-[#0a5c56] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
            >
              {loading ? <Loader2 className="animate-spin" size={20} strokeWidth={3} /> : t("buttons.submit")}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .react-tel-input .form-control:focus {
          border-color: #0E766E !important;
          background-color: white !important;
          box-shadow: 0 0 0 4px rgba(14, 118, 110, 0.05) !important;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}