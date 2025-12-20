"use client";

import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Loader2, ChevronLeft, ChevronRight, Users, ShieldCheck, UserCog, Plus } from "lucide-react";
import AddModeratorModal from "./addNewModerator"; // <--- Import here

type UserType = "PROVIDER" | "USER" | "MODERATOR";

export default function UnifiedUserTable() {
  const [activeTab, setActiveTab] = useState<UserType>("PROVIDER");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false); // <--- Modal State
  const itemsPerPage = 10;

  const getPaginationRange = () => {
    const delta = 1; 
    const range = [];
    const rangeWithDots = [];
    let l;
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) range.push(i);
    }
    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l !== 1) rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/admin/users`, {
        params: { page: currentPage, limit: itemsPerPage, type: activeTab }
      });
      setUsers(response.data?.data || []);
      setTotalPages(response.data?.totalPages || 1);
      setTotalCount(response.data?.totalData || 0); 
    } catch (error) {
      console.error(`Error:`, error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, activeTab]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleTabChange = (type: UserType) => {
    setActiveTab(type);
    setCurrentPage(1);
  };

  return (
    <div className="w-full px-6 py-6">
      {/* 1. Call the Modal Component */}
      <AddModeratorModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchUsers} 
      />

      {/* 2. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Management Dashboard</h1>
          <p className="text-gray-500 text-sm">Monitor system accounts.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0f7f6b10] text-[#0f7f6b] px-4 py-2.5 rounded-xl border border-[#0f7f6b20] font-bold text-sm">
            Total {activeTab.toLowerCase()}s: {totalCount}
          </div>

          {activeTab === "MODERATOR" && (
            <button
              onClick={() => setIsModalOpen(true)} // <--- Open Modal
              className="flex items-center gap-2 bg-[#0f7f6b] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-[#0d6d5c] transition-all"
            >
              <Plus size={20} />
              Add Moderator
            </button>
          )}
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner">
          {[
            { id: "PROVIDER", label: "Providers", icon: <ShieldCheck size={18} /> },
            { id: "USER", label: "Users", icon: <Users size={18} /> },
            { id: "MODERATOR", label: "Moderators", icon: <UserCog size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as UserType)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id ? "bg-white text-[#0f7f6b] shadow-md scale-105" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto min-h-[450px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-teal-600">
            <Loader2 className="w-10 h-10 animate-spin mb-2" />
            <p className="font-medium animate-pulse">Loading...</p>
          </div>
        ) : (
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="bg-[#0f7f6b] text-white text-left">
                <th className="py-4 px-4 rounded-l-xl font-medium">ID</th>
                <th className="py-4 px-4 font-medium">Name</th>
                <th className="py-4 px-4 font-medium">Email</th>
                <th className="py-4 px-4 font-medium text-center">Status</th>
                <th className="py-4 px-4 font-medium text-center">Phone</th>
                <th className="py-4 px-4 rounded-r-xl font-medium text-right">Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <td className="py-3 px-4 font-semibold text-gray-400 rounded-l-xl">#{u.id}</td>
                  <td className="py-3 px-4 flex items-center gap-3 font-bold text-gray-800">{u.name}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{u.email}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${u.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                      {u.status || "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500 text-sm">{u.phone}</td>
                  <td className="py-3 px-4 text-right rounded-r-xl text-gray-700 font-semibold text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-50 gap-4">
        <p className="text-sm text-gray-400 font-medium">
          Showing page <span className="text-gray-800 font-bold">{currentPage}</span> of {totalPages}
        </p>
        <div className="flex items-center gap-1.5">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2.5 rounded-xl border border-gray-100 disabled:opacity-20 hover:bg-gray-50">
            <ChevronLeft size={18} />
          </button>
          {getPaginationRange().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && setCurrentPage(page)}
              disabled={page === "..."}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === page ? "bg-[#0f7f6b] text-white shadow-lg" : page === "..." ? "text-gray-300" : "text-gray-400 hover:bg-gray-100"}`}
            >
              {page}
            </button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2.5 rounded-xl border border-gray-100 disabled:opacity-20 hover:bg-gray-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}