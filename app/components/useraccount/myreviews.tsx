"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Reviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("reviews");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/reviews", {
          headers: {
            "Content-Type": "application/json",
           
          },
        });
        if (!res.ok) throw new Error("Failed to fetch reviews");
        const data = await res.json();
        setReviews(data || []);
      } catch (err) {
        console.error(err);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return <p className="text-gray-500">{t("loading")}</p>;
  }

  return (
    <div className=" rounded-2xl  p-6 w-full">
      <h1 className="text-xl font-bold mb-6">{t("title")}</h1>

      {reviews.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center py-12">
          <div className="text-[#0E766E] text-5xl mb-4">💬</div>
          <p className="text-gray-600 mb-4">{t("emptyMessage")}</p>
          <button className="bg-[#0E766E] text-white px-6 py-2 rounded-lg hover:bg-[#0E766E]">
            {t("rentNow")}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="p-3">{t("review")}</th>
                <th className="p-3">{t("date")}</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, index) => (
                <tr key={index} className="border-b text-sm hover:bg-gray-50">
                  <td className="p-3">{r.text}</td>
                  <td className="p-3">
                    {new Date(r.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}