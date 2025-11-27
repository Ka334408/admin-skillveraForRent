"use client";

import { useState } from "react";

export default function FacilitiesTable() {
  const [activeTab, setActiveTab] = useState("all");

  const accountsData = [
    { id: 1, text: "User1 Requested Account Upgrade" },
    { id: 2, text: "User2 Requested Account Verification" },
  ];

  const facilitiesData = [
    { id: 123, text: "User Name Requests To Add A New Facility" },
    { id: 100, text: "User Name Requests To Edit A Facility" },
    { id: 19, text: "User Id Request To Be A Host" },
  ];

  // دمج الاتنين
  const allData = [...accountsData, ...facilitiesData];

  // حسب التاب نحدد الداتا اللي هتظهر
  const renderData =
    activeTab === "accounts"
      ? accountsData
      : activeTab === "facilities"
      ? facilitiesData
      : allData;

  return (
    <div className=" p-6 rounded-xl shadow-sm w-full">
      {/* ========== Tabs ========== */}
      <div className="flex items-center gap-4 mb-5">
        <button
          onClick={() => setActiveTab("accounts")}
          className={`px-5 py-2 rounded-full border ${
            activeTab === "accounts"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Accounts
        </button>

        <button
          onClick={() => setActiveTab("facilities")}
          className={`px-5 py-2 rounded-full border ${
            activeTab === "facilities"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          Facilities
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`px-5 py-2 rounded-full border ml-auto ${
            activeTab === "all"
              ? "bg-black text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          All
        </button>
      </div>

      {/* ========== List Items ========== */}
      <div className="flex flex-col gap-3 max-h-[480px] overflow-y-auto pr-2">
        {renderData.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-gray-100 p-3 rounded-xl"
          >
            <span className="px-4 py-1 text-white bg-teal-700 rounded-md text-sm font-semibold whitespace-nowrap">
              #{`${item.id}`}
            </span>
            <span className="text-gray-700 text-sm">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}