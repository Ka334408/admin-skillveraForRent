"use client";

import { useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2, X, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddModeratorModal({ isOpen, onClose, onSuccess }: Props) {
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

    // Basic Validation: Ensure it starts with + and has enough digits
    if (!formData.phone.startsWith('+') || formData.phone.length < 10) {
      setErrorMessage("Please enter a valid phone number with country code.");
      setLoading(false);
      return;
    }

    try {
      // Sending formData where phone is now "+20..."
      await axiosInstance.post("/moderator/create", formData);
      toast.success("Moderator created successfully!");
      onSuccess();
      onClose();
      setFormData({ name: "", email: "", phone: "", roleId: 1 }); 
    } catch (error: any) {
      const msg = error.response?.data?.message || "An unexpected error occurred.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Add New Moderator</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm animate-shake">
            <AlertCircle size={16} />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f7f6b] focus:border-transparent outline-none transition-all"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              required
              type="email"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f7f6b] focus:border-transparent outline-none transition-all"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
            <div className="phone-input-container">
              <PhoneInput
                country={"eg"}
                // Force the "+" to be included in the value
                value={formData.phone}
                onChange={(value, country, e, formattedValue) => {
                  // formattedValue includes spaces/dashes, 
                  // but we want just the digits with a + prefix
                  setFormData({ ...formData, phone: `+${value}` });
                }}
                // This ensures the + is visible in the UI
                
                inputStyle={{
                  width: "100%",
                  height: "45px",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  fontSize: "14px",
                }}
                buttonStyle={{
                  borderRadius: "12px 0 0 12px",
                  border: "1px solid #e5e7eb",
                  backgroundColor: "white",
                }}
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#0f7f6b] text-white px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-teal-100 hover:bg-[#0d6d5c] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Create Account"}
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        .react-tel-input .form-control:focus {
          border-color: #0f7f6b !important;
          box-shadow: 0 0 0 2px rgba(15, 127, 107, 0.2) !important;
          outline: none !important;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}