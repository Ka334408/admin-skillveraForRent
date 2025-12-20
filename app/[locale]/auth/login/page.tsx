"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Shield, XCircle, Loader2, Eye, EyeOff, UserPlus, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";

const THEME_COLOR = "#0E766E";

export default function StaffLoginFlip() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const router = useRouter();
  const { setUser, setToken } = useUserStore();

  // --- LOGIN LOGIC (FRONT) ---
  const tryLogin = async (email: string, password: string, userType: "ADMIN" | "MODERATOR") => {
    try {
      const res = await axiosInstance.post(`/authentication/${userType}/login`, { email, password });
      return { data: res.data, userType };
    } catch (err: any) {
      return null;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const target = e.target as any;
    const email = target.email.value.trim();
    const password = target.password.value.trim();

    let result = await tryLogin(email, password, "ADMIN");
    if (!result) result = await tryLogin(email, password, "MODERATOR");

    if (result?.data?.data) {
      const { user, token } = result.data.data;
      setUser({ ...user, type: result.userType });
      setToken(token);
      router.push(`/${result.userType.toLowerCase()}/dashBoard`);
      return;
    }

    setErrorMessage("Invalid credentials or unauthorized account.");
    setLoading(false);
  };

  // --- FIRST LOGIN REQUEST (BACK) ---
  const handleFirstTimeLoginRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);
    setRequestMessage(null);

    const email = (e.target as any).setupEmail.value.trim();

    try {
      const response = await axiosInstance.post("/authentication/first-login/request", { email });
      
      if (response.status === 200 || response.status === 201) {
        setRequestMessage({ type: 'success', text: "OTP sent successfully!" });
        // Navigate to OTP page, passing email in query params for the next step
        setTimeout(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        }, 1500);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || "Failed to send request. Please try again.";
      setRequestMessage({ type: 'error', text: msg });
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md h-[550px] perspective-1000">
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* --- FRONT CARD: LOGIN --- */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl p-10 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-[#0E766E15] rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7" style={{ color: THEME_COLOR }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Staff Login</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Staff Email"
                className="w-full border border-gray-200 text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#0E766E] transition"
                required
              />
              
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className="w-full border border-gray-200 text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-[#0E766E] transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {errorMessage && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <XCircle size={16} /> {errorMessage}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-70 transition-all"
                style={{ backgroundColor: THEME_COLOR }}
              >
                {loading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>

            <button
              onClick={() => setIsFlipped(true)}
              className="mt-6 text-sm text-gray-500 hover:text-teal-700 flex items-center justify-center gap-2 transition"
            >
              <UserPlus size={16} /> First time logging in?
            </button>
          </div>

          {/* --- BACK CARD: FIRST TIME LOGIN --- */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl p-10 flex flex-col justify-center rotate-y-180">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Activate Account</h2>
              <p className="text-gray-500 text-sm text-center mt-2 px-4">
                Enter your email to receive a one-time password (OTP).
              </p>
            </div>

            <form onSubmit={handleFirstTimeLoginRequest} className="space-y-4">
              <input
                type="email"
                name="setupEmail"
                placeholder="Enter Work Email"
                className="w-full border border-gray-200 text-black p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />

              {requestMessage && (
                <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                  requestMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {requestMessage.type === 'success' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {requestMessage.text}
                </div>
              )}

              <button 
                disabled={requestLoading}
                className="w-full py-4 rounded-xl bg-teal-700 text-white font-bold text-lg hover:bg-teal-800 transition flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {requestLoading ? <Loader2 className="animate-spin" /> : null}
                {requestLoading ? "Sending OTP..." : "Get OTP"}
              </button>
            </form>

            <button
              onClick={() => {
                setIsFlipped(false);
                setRequestMessage(null);
              }}
              className="mt-8 text-sm text-gray-400 hover:text-gray-800 flex items-center justify-center gap-2 transition"
            >
              <ArrowLeft size={16} /> Back to Login
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
}