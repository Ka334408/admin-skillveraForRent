"use client";

import { useTranslations } from "next-intl";

interface LoginModalProps {
  show: boolean;
  onClose: () => void;
}

export default function LoginModal({ show, onClose }: LoginModalProps) {
  const t = useTranslations("categories"); 

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm text-center">
        <h3 className="text-lg font-bold mb-4 text-gray-800">
          {t("login_required")}
        </h3>
        <button
          onClick={onClose}
          className="bg-[#0E766E] text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          {t("ok")}
        </button>
      </div>
    </div>
  );
}