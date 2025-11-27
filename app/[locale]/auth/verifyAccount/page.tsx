"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";

export default function VerifyAccount() {
  const router = useRouter();
  const { verificationEmail } = useUserStore();

  const [code, setCode] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // --- handle input changes ---
  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 3) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  // --- submit verification ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const verificationCode = code.join("");

    if (verificationCode.length < 4) {
      setError("Please enter the 4-digit code");
      return;
    }

    if (!verificationEmail) {
      setError("Email lost — please sign up again");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/authentication/verify-account",
        { email: verificationEmail, code: verificationCode },
        { withCredentials: true } // يخلّي الكوكي تتكتب
      );

      console.log("VERIFY RESPONSE:", res.data);

      router.push("/auth/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  // --- resend verification ---
  const handleResend = async () => {
    setError(null);
    setMessage(null);
    setResending(true);

    try {
      const res = await axiosInstance.post(
        "/authentication/request-verification",
        { email: verificationEmail },
        { withCredentials: true }
      );

      console.log("RESEND RESPONSE:", res.data);
      setMessage("Verification code has been resent!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  return (
    
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className=" rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            You&apos;re ready to go!
          </h1>
          <p className="text-gray-600 mb-6">
            Please check your email for the verification code
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => (inputsRef.current[index] = el)}
                  onChange={(e) => handleChange(e.target.value, index)}
                  className="w-14 h-14 text-center text-xl border rounded-lg focus:ring-2 focus:ring-[#0E766E]"
                />
              ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-600 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0E766E] text-white py-3 rounded-full font-semibold hover:bg-[#0a5f59] transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <p className="mt-6 text-sm text-gray-600">
            Didn&apos;t receive the code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-[#0E766E] font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? "Resending..." : "Resend"}
            </button>
          </p>
        </div>
      </main>
    
  );
}