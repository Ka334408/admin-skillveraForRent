"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserStore } from "@/app/store/userStore";

export default function ProfileCard() {
  const { user, setUser } = useUserStore();
  const t = useTranslations("proPhoto");
  const router = useRouter();

  const [name, setName] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 NEW → Saving + Saved UI
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);

  // مسار الـ API بتاع الصور
  const fetchImageFromApi = async (path: string) => {
    try {
      const res = await axios.get(`/api/media?media=${path}`, {
        responseType: "blob",
      });

      const url = URL.createObjectURL(res.data);
      return url;
    } catch (err) {
      console.error("Failed to load image:", err);
      return null;
    }
  };

  // Load data from Zustand
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setName(user.name || "");

    if (user.image && user.image.startsWith("uploads/")) {
      fetchImageFromApi(user.image).then((url) => {
        if (url) setFilePreview(url);
        setLoading(false);
      });
    } else if (user.image) {
      setFilePreview(user.image);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  // يفتح input
  const handleChoose = () => fileRef.current?.click();

  // لما يختار صورة جديدة
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const url = URL.createObjectURL(f);
    setFilePreview(url);

    setUser({
      ...user!,
      image: url,
    });
  };

  // 🔥 NEW → SAVE مع Animation + رسالة نجاح
  const handleSave = () => {
    setSaving(true);
    setSavedMessage(null);

    setTimeout(() => {
      setSaving(false);
      setUser({
        ...user!,
        name,
        image: filePreview,
      });

      setSavedMessage("Saved successfully ✓");

      setTimeout(() => setSavedMessage(null), 2000);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0E766E] animate-bounce">
          Skillvera
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h3 className="text-2xl font-semibold mb-6">{t("aboutTitle")}</h3>

      <div className="flex flex-col md:flex-row items-start gap-10">
        {/* LEFT CARD */}
        <div className="w-full md:w-1/2 lg:w-1/3">
          <div className="rounded-2xl p-6 text-center min-h-[220px] flex flex-col items-center justify-center">

            {/* الصورة */}
            {filePreview ? (
              <div className="rounded-lg overflow-hidden w-48 h-48 mx-auto">
                <img
                  src={filePreview}
                  className="w-full h-full object-cover  object-[50%_25%]"
                  alt="profile"
                />
              </div>
            ) : (
              <div className="w-48 h-48 flex items-center justify-center rounded-lg bg-[#0E766E] mx-auto">
                <svg width="72" height="72" viewBox="0 0 24 24" className="text-white opacity-90">
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
                  />
                  <path
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    d="M4 20a8 8 0 0 1 16 0"
                  />
                </svg>
              </div>
            )}

            <div className="mt-4 text-black font-semibold text-lg">{name}</div>

            <div className="mt-4 flex gap-3 justify-center">
              <button
                onClick={handleChoose}
                className="bg-gray-300 text-black px-5 py-2 rounded-full font-medium"
              >
                {t("choose")}
              </button>

              <button
                onClick={handleSave}
                className="bg-[#0E766E] text-white px-5 py-2 rounded-full font-medium"
              >
                {saving ? "Saving..." : t("save")}
              </button>
            </div>

            {/* 🔥 NEW → MESSAGE */}
            <div className="mt-3 h-6">
              {saving && (
                <span className="text-[#0E766E] animate-pulse font-medium">
                  Saving...
                </span>
              )}

              {savedMessage && (
                <span className="text-green-600 font-medium">
                  {savedMessage}
                </span>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1">
          <h4 className="text-2xl font-bold mb-3">{t("completeTitle")}</h4>

          <p className="text-gray-600 mb-4 leading-6">{t("completeDesc")}</p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-3 border rounded-lg w-full sm:flex-1"
              placeholder={t("namePlaceholder")}
            />

            <button
              onClick={() => router.push("/userview/userProfile")}
              className="bg-[#0E766E] text-white px-6 py-3 rounded-lg w-full sm:w-auto"
            >
              {t("getStarted")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}