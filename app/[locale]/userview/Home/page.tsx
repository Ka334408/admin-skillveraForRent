"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/userStore";
import axiosInstance from "@/lib/axiosInstance";
import HeroSection from "../../../components/userview/heroSection";
import SearchSection from "../../../components/userview/searchBar";
import CategoriesSection from "../../../components/userview/catigories";
import NearestMap from "@/app/components/userview/LiveMap";
import TrustedSection from "@/app/components/userview/TrustedSec";
import FAQSection from "@/app/components/userview/FAQSec";
import FeaturesSection from "@/app/components/userview/FeaturesSec";
import DownloadSection from "@/app/components/userview/downloadappsec";
import Header from "@/app/components/header";

export default function HomePage() {
  const [needsProfile, setNeedsProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const { isHydrated}=useUserStore();

  const locale = useLocale();
  const router = useRouter();

  const { user, setUser } = useUserStore();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if(!isHydrated) return null;
        // 🔹 أولاً: لو فيه user في Zustand → استخدمه
        if (user) {
          const { dob, gender } = user;
          

          if (!dob || !gender) setNeedsProfile(true);
          setLoading(false);
          return;
        }

        // 🔹 ثانياً: لو مفيش user في Zustand → هات الـ current user
        const res = await axiosInstance.get("/authentication/current-user");

        const fetchedUser =
          res.data?.user || res.data?.data?.user || null;     

        if (fetchedUser) {
          setUser(fetchedUser);

          const { dob, gender } = fetchedUser;

          if (!dob || !gender) setNeedsProfile(true);
        } else {
          console.warn("No user returned from API");
        }
      } catch (err) {
        console.error("Error fetching current user:", err);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // 🔄 Loader
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0E766E] animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  return (
    <main dir={locale === "ar" ? "rtl" : "ltr"} className="relative bg-[#f3f4f4]">
      <div className={needsProfile ? "blur-sm pointer-events-none select-none" : ""}>
        <Header
          bgColor="bg-[#f3f4f4] border-b-gray-200 "
          accounticonColor="bg-[#0E766E]"
          menuiconColor="bg-[#0E766E] text-white rounder-full"
          activeColor="bg-[#0E766E] text-white"
          textColor="text-[#0E766E]"
          hoverColor="hover:bg-[#0E766E] hover:text-white"
          enable="border-none"
          isrounded="rounded-full"
        />

        <HeroSection />
        <SearchSection />
        <CategoriesSection />
        <NearestMap />
        <TrustedSection />
        <FAQSection />
        <FeaturesSection />
        <DownloadSection />
      </div>

      {/* 🔸 Overlay message */}
      {needsProfile && (
        <div className="fixed top-20 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 text-left max-w-xs border border-gray-200 mr-5">
            <h2 className="text-lg font-semibold mb-2">Complete your profile</h2>
            <p className="text-gray-600 mb-3 text-sm">
              Please update your date of birth and gender to continue.
            </p>
            <button
              onClick={() => router.push("/userview/useraccount")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-[#0E766E] transition w-full"
            >
              Go to Profile
            </button>
          </div>
        </div>
      )}
    </main>
  );
}