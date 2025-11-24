"use client";

import { useState, useEffect } from "react";
import { Bell, Search } from "lucide-react";

interface User {
  name: string;
  email: string;
  photo: string;
}

export default function Topbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/authentication/current-user", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // لو محتاج الكوكيز
        });

        const result = await res.json();
        if (result?.data) {
          const { name, email, image } = result.data;

          setUser({
            name: name || "Provider",
            email: email || "user@email.com",
            photo: image
              ?` /api/media?media=${image}`
              : "/herosec.png", // fallback
          });
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between shadow rounded-xl p-4 mb-5 gap-4 mt-10 sm:mt-0">
      {/* User info */}
      <div className="flex items-center space-x-3">
        <img
          src={user?.photo}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => (e.currentTarget.src = "/herosec.png")}
        />
        <div className="flex flex-col leading-tight">
          <span className="font-medium text-sm">{user?.email}</span>
          <span className="text-gray-500 text-xs">{user?.name}</span>
        </div>
      </div>

      {/* Search + Notification */}
      <div className="flex items-center space-x-4 flex-1 max-w-lg w-full">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search For any thing.."
            className="w-full border rounded-3xl pl-10 pr-4 py-2 focus:ring-2 focus:ring-[#0E766E]"
          />
        </div>

        <button className="relative">
          <Bell className="w-6 h-6 text-gray-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
}