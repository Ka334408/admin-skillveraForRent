"use client";
import { useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import GuestPage from "@/app/components/protectedpages/guestPage";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";

export default function VerifyCode() {
  const t = useTranslations("verify");
  const locale = useLocale();
  const router = useRouter();

  const { resetEmail } = useUserStore(); // ← الإيميل جاي من Zustand

  const [code, setCode] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < code.length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleVerify = async () => {
    const verificationCode = code.join("");

    if (verificationCode.length < 4) {
      setError("Please enter full code");
      return;
    }

    if (!resetEmail) {
      setError("Email not found, please go back");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.post(
        "/authentication/reset-password/validate-otp",
        {
          email: resetEmail,
          code: verificationCode,
        }
      );
      console.log(res.data);

      // 🟢 الباك بيرجع token — دا اللي نبنيه نبعته للـ reset password
      const token = res.data?.data?.token;

      if (!token) {
        setError("Token missing from server response");
        return;
      }

      // خزّن token في localStorage
      localStorage.setItem("resetToken", token);

      console.log("Received token:", token);

      router.push("/auth/setNewPass");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      setError(null);

      await axiosInstance.post(
        "/authentication/reset-password/request",
        { email: resetEmail }
      );

      setTimer(30);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/auth/resetPass");
  };

  return (
    <GuestPage>
      <main
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]"
      >
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-xl flex flex-col items-center justify-center p-8 dark:bg-black">

          <button
            onClick={handleBack}
            className="self-start text-[#0E766E] mb-6 hover:underline"
          >
            ← {t("back")}
          </button>

          <h1 className="text-2xl font-bold mb-2 text-center">{t("title")}</h1>
          <p className="text-gray-500 text-sm mb-6 text-center">{t("subtitle")}</p>

          <div className="flex gap-4 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                type="text"
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 text-center border-2 border-[#0E766E] rounded-lg text-xl focus:outline-none focus:ring-2 focus:ring-[#0E766E]"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            disabled={loading}
            className="bg-[#0E766E] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0A5F58] disabled:opacity-50"
          >
            {loading ? "Loading..." : t("verifyBtn")}
          </button>

          <div className="mt-4">
            {timer > 0 ? (
              <p className="text-gray-600 text-sm">
                {t("resend", { seconds: timer })}
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={loading}
                className="text-[#0E766E] text-sm hover:underline"
              >
                {loading ? "..." : t("resendBtn")}
              </button>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </main>
    </GuestPage>
  );
}