"use client";

import { useRouter } from "next/navigation";
import { Filter } from "lucide-react";
import { useLocale } from "next-intl";

export default function ProvidersList() {
  const router = useRouter();
  const locale = useLocale();

  const providers = [
    { id: 1, facilityId: "#provider Id", text: "User Name Requests To became a host" },
    { id: 2, facilityId: "#provider Id", text: "provider Name Requests To add A Facility" },
    { id: 3, facilityId: "#provider Id", text: "provider Name Requests To Edit A Facility" },
    { id: 4, facilityId: "#provider Id", text: "User Id Request To Be A Host" },
  ];

  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Providers</h2>

        <button className="flex items-center gap-1 text-gray-700 bg-gray-100 rounded-md px-3 py-1">
          <Filter size={16} />
          <span>All</span>
        </button>
      </div>

      {/* Providers list */}
      <div className="flex flex-col gap-3">
        {providers.map((item) => (
          <div
            key={item.id}
            className="w-full flex items-center gap-4 bg-gray-100 rounded-lg px-4 py-3 hover:bg-gray-200 transition cursor-pointer"
            onClick={() => router.push(`/admin/providers/${item.id}`)}
          >
            <span className="bg-teal-700 text-white px-3 py-1 rounded-md text-sm">
              {item.facilityId}
            </span>
            <p className="text-gray-700 text-sm">{item.text}</p>
          </div>
        ))}
      </div>

      {/* View all */}
      <div className="flex justify-end mt-3">
        <button
          onClick={()=> {localStorage.getItem("name")==="admin" ?
        router.push(`/admin/Providers/ProvidersList`):router.push(`/moderator/Providers/ProvidersList`)}}
          className="text-teal-700 font-medium hover:underline"
        >
          View all →
        </button>
      </div>
    </div>
  );
}