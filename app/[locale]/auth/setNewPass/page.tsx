"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";

import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { Eye, EyeOff, Check, X, AlertCircle, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const t = useTranslations("resetPasswordWords");
  const locale = useLocale();
  const router = useRouter();

  const { resetEmail } = useUserStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [showPasswordRules, setShowPasswordRules] = useState(false);

  const rules = [
    { id: 1, label: "At least 8 characters", test: (p: string) => p.length >= 8 },
    { id: 2, label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
    { id: 3, label: "Contains lowercase letter", test: (p: string) => /[a-z]/.test(p) },
    { id: 4, label: "Contains a number", test: (p: string) => /[0-9]/.test(p) },
    { id: 5, label: "Contains a special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError(t("not_match"));
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("resetToken");

      console.log("Reset Email =>", resetEmail);
      console.log("Reset Token =>", token);

      if (!resetEmail || !token) {
        setError("Missing reset email or token!");
        return;
      }

      const res = await axiosInstance.post("/authentication/reset-password", {
        email: resetEmail,
        token,
        password,
      });

      localStorage.removeItem("resetToken");

      setSuccess(t("success"));
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Error resetting password";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
     
        <main
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]"
        >
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl min-h-[500px] flex flex-col items-center justify-center p-10 dark:bg-black">
            <h1 className="text-4xl font-bold text-center mb-2 text-gray-800 dark:text-white">
              {t("title")}
            </h1>
            <p className="text-sm text-center text-gray-500 mb-8">
              {t("subtitle")}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-5 w-full max-w-md">
              {/* PASSWORD INPUT */}
              <div className="relative w-full">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder={t("new_password")}
                  value={password}
                  onFocus={() => setShowPasswordRules(true)}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border rounded-full px-5 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                  required
                />

                {/* EYE ICON */}
                <span
                  className="absolute right-4 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* PASSWORD RULES */}
              {showPasswordRules && (
                <div className="bg-gray-100 rounded-xl p-4 text-sm space-y-1">
                  {rules.map((rule) => (
                    <div key={rule.id} className="flex items-center gap-2">
                      {rule.test(password) ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <AlertCircle size={18} className="text-red-500" />
                      )}
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CONFIRM PASSWORD */}
              <div className="relative w-full">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder={t("confirm_password")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border rounded-full px-5 py-3 pr-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                  required
                />

                {/* EYE ICON */}
                <span
                  className="absolute right-4 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                >
                  {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
                </span>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0E766E] text-white rounded-full py-3 font-semibold hover:bg-[#054b45] transition disabled:opacity-50"
              >
                {loading ? t("loading") : t("button")}
              </button>

              {/* ERROR / SUCCESS */}
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              {success && <p className="text-green-600 text-sm text-center">{success}</p>}
            </form>
          </div>
        </main>
     
    </div>
  );
}