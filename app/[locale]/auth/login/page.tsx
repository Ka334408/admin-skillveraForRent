"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, UserPlus, Shield, XCircle, Loader2 } from "lucide-react"; // Added icons for better context
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/app/store/userStore";

// Define main color theme
const THEME_COLOR = "#0E766E";
const DANGER_COLOR = "#DC2626";

// Placeholder function for Signup logic (currently missing)
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  // In a real application, you'd collect and validate the form data here:
  // const fullName = (e.target as any).fullName.value;
  // const mobile = (e.target as any).mobile.value;
  // const password = (e.target as any).password.value;

  alert("Signup is a placeholder. Please use the Login form.");
};

export default function StaffLoginFlip() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const { setUser, setToken } = useUserStore.getState();

  // ----------------------
  // API TRY FUNCTION
  // ----------------------
  const tryLogin = async (
    email: string,
    password: string,
    userType: "ADMIN" | "MODERATOR"
  ) => {
    try {
      setErrorMessage(null);
      const res = await axiosInstance.post(
        `/authentication/${userType}/login`,
        { email, password }
      );
      return { data: res.data, userType };
    } catch (err: any) {
      // Return null on failure to allow trying the next role
      return null;
    }
  };

  // ----------------------
  // LOGIN HANDLER
  // ----------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const target = e.target as typeof e.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value.trim();
    const password = target.password.value.trim();

    // 1. TRY ADMIN
    let result = await tryLogin(email, password, "ADMIN");

    if (!result) {
      // 2. TRY MODERATOR
      result = await tryLogin(email, password, "MODERATOR");
    }

    if (result?.data?.data) {
      const user = result.data.data.user;
      const token = result.data.data.token;
      const type = result.userType;

      setUser({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        image: user.image || null,
        gender: user.gender || "",
        dob: user.dob || "",
        addressLatLong: user.addressLatLong || "",
        type: type,
      });

      setToken(token);

      // Redirect based on successful role
      router.push(`/${type.toLowerCase()}/dashBoard`);
      setLoading(false);
      return;
    }

    // FAILED BOTH
    setErrorMessage("Invalid credentials or you are not an authorized staff member.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg h-[500px] perspective-1000"> {/* Added perspective for better 3D effect */}
        <div
          className={`absolute inset-0 transition-transform duration-1000 transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ------------------------------------------------ */}
          {/* LOGIN CARD (FRONT) */}
          {/* ------------------------------------------------ */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col p-10 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-center mb-8 gap-3 text-2xl font-extrabold text-gray-800">
                <Shield className={`w-7 h-7 text-[${THEME_COLOR}]`} />
                STAFF LOGIN
            </div>

            <form onSubmit={handleLogin} className="w-full flex flex-col items-center gap-6">
              <input
                type="email"
                name="email"
                placeholder="Staff Email"
                disabled={loading}
                className="w-full border border-gray-300 text-black p-4 rounded-xl outline-none focus:border-blue-500 transition disabled:bg-gray-100"
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                disabled={loading}
                className="w-full border border-gray-300 text-black p-4 rounded-xl outline-none focus:border-blue-500 transition disabled:bg-gray-100"
                required
              />

              {errorMessage && (
                <div className="w-full bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl flex items-center gap-2 text-sm font-medium">
                    <XCircle className="w-5 h-5" />
                    {errorMessage}
                </div>
              )}
              
              <div className="flex justify-between w-full text-sm mt-2">
                <p
                  onClick={() => setIsFlipped(true)}
                  className={`text-right text-sm text-gray-600 cursor-pointer hover:text-[${THEME_COLOR}] transition flex items-center gap-1`}
                >
                  <UserPlus className="w-4 h-4" />
                  Request access?
                </p>
                <p className="text-gray-600 cursor-pointer hover:text-black transition">
                    Forgot password?
                </p>
              </div>


              <button
                type="submit"
                disabled={loading}
                className={`bg-[${THEME_COLOR}] text-white w-full py-4 rounded-xl shadow-lg hover:bg-[#07534e] transition font-bold text-lg flex items-center justify-center gap-3 mt-6 disabled:bg-gray-400`}
              >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <LogIn className="w-5 h-5" />
                )}
                {loading ? "AUTHENTICATING..." : "LOGIN TO DASHBOARD"}
              </button>
            </form>
          </div>

          {/* ------------------------------------------------ */}
          {/* SIGNUP CARD (BACK) */}
          {/* ------------------------------------------------ */}
          <div
            className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col p-10 backface-hidden transform rotate-y-180"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="flex items-center justify-center mb-8 gap-3 text-2xl font-extrabold text-gray-800">
                <UserPlus className={`w-7 h-7 text-blue-600`} />
                STAFF ACCESS REQUEST
            </div>

            <form onSubmit={handleSignup} className="w-full flex flex-col items-center gap-6">
              <p className="text-center text-gray-600 mb-4 border-b pb-4">
                This area is for **Staff Access Requests** only. Please contact IT support to create your account.
              </p>
              
              <input
                type="text"
                placeholder="Full name"
                name="fullName"
                className="w-full border border-gray-300 text-black p-4 rounded-xl outline-none focus:border-blue-500 transition"
                required
              />

              <input
                type="email"
                placeholder="Work Email"
                name="workEmail"
                className="w-full border border-gray-300 text-black p-4 rounded-xl outline-none focus:border-blue-500 transition"
                required
              />
              
              {/* Optional: Add a field for requested role (Admin/Moderator) */}
              
              <div className="flex justify-start w-full text-sm mt-2">
                <p
                  onClick={() => setIsFlipped(false)}
                  className="text-gray-600 cursor-pointer hover:text-black transition flex items-center gap-1 font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  Already have an account? **Log In**
                </p>
              </div>

              <button
                type="submit"
                className="bg-blue-600 text-white w-full py-4 rounded-xl shadow-lg hover:bg-blue-700 transition font-bold text-lg "
              >
                REQUEST ACCESS
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}