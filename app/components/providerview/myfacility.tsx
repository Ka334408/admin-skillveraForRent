"use client";

import { useState } from "react";

type Facility = {
  id: string;
  name: string;
  status: "onProgress" | "rejected" | "active" |"rented";
  img?: string;
};

const facilitiesData: Record<"pending" | "active", Facility[]> = {
  pending: [
    { id: "#1222", name: "Facility 1", status: "onProgress", img: "/hotal.jpg" },
    { id: "#1223", name: "Facility 2", status: "rejected", img: "/hotal.jpg" },
    { id: "#1224", name: "Facility 3", status: "onProgress", img: "/hotal.jpg" },
  ],
  active: [
    { id: "#2001", name: "Facility 4", status: "active", img: "/hotal.jpg" },
    { id: "#2002", name: "Facility 5", status: "rented", img: "/hotal.jpg" },
  ],
};

const statusColor = (s: Facility["status"]): string =>
  s === "onProgress"
    ? "text-yellow-500"
    : s === "rejected"
    ? "text-red-500"
    : s=== "rented"
    ?"text-[#0E766E]"
    :"text-green-600"

export default function FacilitiesPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");
  const facilities: Facility[] = facilitiesData[activeTab] ?? [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#0E766E] mb-3">
          My Facilities
        </h2>

        {/* Tabs under title */}
        <div className="flex items-center gap-3">
          {(["pending", "active"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab
                  ? "bg-gray-800 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          <button
            onClick={() => window.location.href="/providerview/dashBoardHome/myFacilities/addNewFacility"}
            className="ml-2 px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50"
            aria-label="Add facility"
          >
            +
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {facilities.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded shadow">
            No facilities in <strong>{activeTab}</strong>
          </div>
        ) : (
          facilities.map((f) => (
            <article
              key={f.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className={`text-sm font-semibold ${statusColor(f.status)}`}>
                    {f.status}
                  </div>
                  <div className="text-xs text-gray-400">{f.id}</div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">⋯</button>
              </div>

              <div className="w-full h-36 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                {f.img ? (
                  <img
                    src={f.img}
                    alt={f.name}
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://via.placeholder.com/600x360?text=No+Image")
                    }
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">There is no photo</span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-gray-800">{f.name}</h3>
              <p className="text-sm text-gray-500 grow">
                This facility {f.name} description or short note...
              </p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}