"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";

export default function GuestPage({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useUserStore(); 
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const timer = setTimeout(() => {
    if (user.token) {
      router.replace("/admin/dashBoard"); 
    } else {
      setLoading(false);
    }
  }, 300);

  return () => clearTimeout(timer);
}, [user, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0E766E] animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  return <>{children}</>;
}