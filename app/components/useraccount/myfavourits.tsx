"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function Favorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("favorites");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/favorites", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            
          },
        });

        if (!res.ok) throw new Error("Failed to fetch favorites");

        const data = await res.json();
        setFavorites(data || []);
      } catch (err) {
        console.error(err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div className=" rounded-2xl  p-6 w-full">
      <h1 className="text-xl font-bold mb-6">{t("title")}</h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col justify-center items-center text-center py-12">
          <div className="text-red-500 text-5xl mb-4">❤</div>
          <p className="text-gray-600 mb-4">{t("emptyMessage")}</p>
          <button className="bg-[#0E766E] text-white px-6 py-2 rounded-lg hover:bg-[#0E766E]">
            {t("exploreButton")}
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-600">
                <th className="p-3">{t("product")}</th>
                <th className="p-3">{t("category")}</th>
                <th className="p-3">{t("addedOn")}</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav, index) => (
                <tr
                  key={index}
                  className="border-b text-sm hover:bg-gray-50 transition"
                >
                  <td className="p-3">{fav.productName}</td>
                  <td className="p-3">{fav.category}</td>
                  <td className="p-3">
                    {new Date(fav.addedAt).toLocaleDateString()}
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