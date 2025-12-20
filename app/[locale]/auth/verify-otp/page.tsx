"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, XCircle, Loader2, ArrowRight, ShieldCheck, Eye, EyeOff } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";

const THEME_COLOR = "#0E766E";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  // UI State
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // OTP State
  const [otpArray, setOtpArray] = useState(["", "", "", ""]);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  // Password State
  const [showPass, setShowPass] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- OTP INPUT LOGIC ---
  const handleOtpChange = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otpArray];
    newOtp[index] = value.substring(value.length - 1);
    setOtpArray(newOtp);
    if (value && index < 3) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otpArray[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyStaticOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const combinedOtp = otpArray.join("");

    if (combinedOtp === "1234") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsFlipped(true); // Flip to password face
      }, 600);
    } else {
      setError("Invalid OTP code. Please try again.");
    }
  };

  // --- FINAL API CALL (BACK CARD) ---
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // API requires: email, otp, and password
      const response = await axiosInstance.post("/authentication/first-login/set-password", {
        email: email,
        otp: otpArray.join(""), // Sending the 4-digit code
        password: password
      });

      if (response.status === 200 || response.status === 201) {
        alert("Account activated successfully!");
        router.push("/auth/login"); // Redirect back to staff login
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to set password. Link may be expired.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="relative w-full max-w-md h-[550px] perspective-1000">
        <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}>
          
          {/* --- FRONT FACE: OTP --- */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl p-10 flex flex-col justify-center">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7" style={{ color: THEME_COLOR }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Verify Code</h2>
              <p className="text-gray-500 text-sm text-center mt-2 px-4">
                Enter the code sent to <br/><span className="text-gray-900 font-medium break-all">{email}</span>
              </p>
            </div>

            <form onSubmit={verifyStaticOtp} className="space-y-8">
              <div className="flex justify-center gap-3">
                {otpArray.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-100 rounded-xl focus:border-[#0E766E] focus:ring-4 focus:ring-teal-50 outline-none transition-all"
                    required
                  />
                ))}
              </div>

              {error && !isFlipped && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <XCircle size={16} /> {error}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
                style={{ backgroundColor: THEME_COLOR }}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Verify OTP"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </form>
          </div>

          {/* --- BACK FACE: SET PASSWORD --- */}
          <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl p-10 flex flex-col justify-center rotate-y-180">
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center">Set Password</h2>
              <p className="text-gray-500 text-sm text-center mt-2">Almost done! Create a new password for your account.</p>
            </div>

            <form onSubmit={handleSetPassword} className="space-y-4">
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && isFlipped && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <XCircle size={16} /> {error}
                </div>
              )}

              <button 
                disabled={loading} 
                className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
              >
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                {loading ? "Activating..." : "Finish Activation"}
              </button>
            </form>
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