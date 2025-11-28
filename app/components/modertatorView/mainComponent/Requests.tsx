"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export default function FacilitiesRequestList() {
  const requests = [
    { id: 123, text: "Added A New Facility" },
    { id: 100, text: "Added A New Facility" },
    { id: 19, text: "Request Edited Facility" },
  ];
  const router = useRouter();
  const locale = useLocale();

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm w-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        New Facilities Request
      </h3>

      <div className="flex flex-col gap-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
          >
            <span className="px-3 py-1 text-white bg-teal-700 rounded-md text-sm font-semibold">
              #{req.id}
            </span>
            <span className="text-gray-700 text-sm">{req.text}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-end mt-3">
        <button className="text-sm text-teal-700 hover:underline"
        onClick={()=> {localStorage.getItem("name")==="admin" ?
        router.push(`/${locale}/admin/AllFacilities/FacilitiesList`):router.push(`/${locale}/moderator/AllFacilities/FacilitiesList`)}}>
          View all →
        </button>
      </div>
    </div>
  );
}