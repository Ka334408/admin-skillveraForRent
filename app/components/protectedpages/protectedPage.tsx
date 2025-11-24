"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  // أول ما يدخل الصفحة، ندي Delay بسيط
  const timer = setTimeout(() => {
    if (!user.token) {
      router.replace("/userview/Home"); 
    } else {
      setLoading(false);
    }
  }, 300); // ← هنا اتحكم في زمن الـ loading (مثلاً 600ms)

  return () => clearTimeout(timer);
}, [user, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0E766E] animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}