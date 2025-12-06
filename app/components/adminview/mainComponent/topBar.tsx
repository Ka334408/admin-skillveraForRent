"use client";

import { Search, Bell, Settings, LogOut, ChevronDown } from "lucide-react";
import { useUserStore } from "@/app/store/userStore";

// Define main color theme
const THEME_COLOR = "#0E766E";

export default function Topbar() {
  const { user, isHydrated } = useUserStore();

  // --- Derived User Data ---
  const userName = user?.name || "Dashboard User";
  const userEmail = user?.email || "staff@dashboard.com";
  const userRole = user?.type?.toLowerCase() || "Guest";
  const userPhoto = user?.image || "/herosec.png"; // Fallback image

  // --- Loading State ---
  if (!isHydrated) {
    return (
      <div className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm px-8 py-4 animate-pulse">
        <div className="flex items-center justify-between">
            <div className="h-6 w-48 bg-gray-200 rounded"></div>
            <div className="h-10 w-1/3 bg-gray-200 rounded-3xl hidden md:block"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  // --- Main Render ---
  return (
    // 1. Sticky, full-width container with professional styling
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between h-20 px-4 sm:px-8">
        
        {/* 2. User Greeting / Context */}
        <div className="flex flex-col leading-snug">
          <h1 className="text-xl font-extrabold text-gray-800 capitalize">
            {`Hello, ${userName.split(' ')[0]}!`}
          </h1>
          <span className="text-sm font-medium text-gray-500 capitalize">
            {`${userRole} Dashboard`}
          </span>
        </div>

        {/* 3. Central Search and Actions (Desktop: hidden for mobile) */}
        <div className="hidden md:flex items-center space-x-6 flex-1 max-w-xl justify-end">
            {/* Search Input */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search for facilities, users, or reports..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-full pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-[${THEME_COLOR}] focus:border-[${THEME_COLOR}] transition"
                />
            </div>
        </div>

        {/* 4. User Profile and Action Icons Group */}
        <div className="flex items-center space-x-4">
            
            {/* Action Buttons */}
            <button 
                className="relative p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition hidden sm:block"
                title="Notifications"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <button 
                className="relative p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition hidden sm:block"
                title="Settings"
            >
                <Settings className="w-5 h-5" />
            </button>

            {/* Separator */}
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            
            {/* Profile Menu/Avatar */}
            <div className="flex items-center space-x-3 cursor-pointer p-1 rounded-full hover:bg-gray-50 transition">
                <img
                    src={userPhoto}
                    alt={userName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    onError={(e) => (e.currentTarget.src = "/herosec.png")}
                />
                
                {/* User Info (Hidden on mobile) */}
                <div className="hidden lg:flex flex-col leading-tight">
                    <span className="font-semibold text-gray-800 text-sm line-clamp-1">{userName}</span>
                    <span className="text-gray-500 text-xs font-medium">{userEmail}</span>
                </div>
                
                <ChevronDown className="w-4 h-4 text-gray-500 hidden lg:block" />
            </div>

             {/* Mobile Search Button (Visible only on mobile) */}
            <button 
                className="relative p-2 rounded-full md:hidden bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                title="Search"
            >
                <Search className="w-5 h-5" />
            </button>
        </div>
        
      </div>
    </header>
  );
}