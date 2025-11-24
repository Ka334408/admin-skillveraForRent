"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import LocalizedLink from "@/app/components/localized-link";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";
import { EyeIcon, EyeOff } from "lucide-react";
import GuestPage from "@/app/components/protectedpages/guestPage";

export default function Login() {
  const t = useTranslations("loginWords");
  const locale = useLocale();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { setUser, setToken } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post(
        "/authentication/user/login",
        { email, password },
        { withCredentials: true }
      );

      const payload = res.data?.data;
      if (!payload) throw new Error("Invalid response from server");

      const user = payload.user;
      const token = payload.token || payload.accessToken;

      if (!user) throw new Error("User object missing");
      if (!token) throw new Error("Token missing from API");

      // ✅ Save user & token in Zustand (PERSISTENT)
      setUser(user);
      setToken(token);

      const role = user.type.toLowerCase();

      switch (role) {
        case "user":
          router.replace("/userview/Home");
          break;
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "provider":
          router.replace("/provider/dashboard");
          break;
        case "moderator":
          router.replace("/moderator/dashboard");
          break;
        default:
          router.replace("/");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div><GuestPage>
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-gray-200 flex items-center justify-center px-4 dark:bg-[#0a0a0a]"
    >
      {/* ---- UI ---- */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl min-h-[550px] flex flex-col md:flex-row overflow-hidden dark:bg-black">
        
        {/* left images */}
        <div className="md:w-1/2 grid grid-cols-2 gap-4 bg-gray-100 p-6 dark:bg-black">
          <div className="col-span-2 mt-5 bg-gray-300 rounded-xl h-40 flex items-center justify-center">
            <span className="text-gray-700">Image 1</span>
          </div>
          <div className="bg-gray-300 rounded-xl h-60 flex items-center justify-center">
            <span className="text-gray-700">Image 2</span>
          </div>
          <div className="bg-gray-300 rounded-xl h-60 flex items-center justify-center">
            <span className="text-gray-700">Image 3</span>
          </div>
        </div>

        {/* right form */}
        <div className="flex flex-col justify-center p-8 md:w-1/2 w-full">
          <h1 className="text-black text-2xl font-bold mb-2">{t("welcome")}</h1>
          <p className="text-gray-500 text-sm mb-8">{t("tagline")}</p>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
            <input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("password")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-full px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0E766E] w-full"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeIcon size={20} /> : <EyeOff size={20} />}
              </button>
            </div>

            <div className="flex justify-end">
              <a
                href="/auth/resetPass"
                className="text-sm text-gray-500 hover:underline whitespace-nowrap"
              >
                {t("forgot")}
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#0E766E] text-white rounded-full py-3 font-semibold hover:bg-[#0c625b] transition disabled:opacity-50"
            >
              {loading ? t("loading") : t("login")}
            </button>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          </form>

          <div className="mt-6 flex justify-center items-center gap-2 text-sm">
            <span className="text-gray-600">{t("no_account")}</span>

            <LocalizedLink
              href="/auth/signUp"
              className="text-[#0E766E] font-semibold hover:underline"
            >
              {t("signup")}
            </LocalizedLink>
          </div>
        </div>
      </div>
    </main>
    </GuestPage></div>
  );
}