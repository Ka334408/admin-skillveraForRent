"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Eye, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';

// Define API endpoint
const API_PENDING_REQUESTS = '/dashboard-dashboard/need-approval-facilities';
const PRIMARY_TEAL = "#0E766E";

// --- Interface Definitions ---
interface RequestItem {
  provider: {
    id: number;
    name: string;
  };
  id: number;
  name:{en: string}; // Facility Name or Request Type
  status: string;
  createdAt: string;
}

export default function FacilitiesRequestList() {
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();
  const locale = useLocale();

  // ----------------------
  // 1. Data Fetching
  // ----------------------
  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      try {
        // Fetch data, limiting results to, say, the top 5 for a dashboard view
        const { data } = await axiosInstance.get(`${API_PENDING_REQUESTS}?limit=5`);

        if (data?.data?.data) {
          // Filter to show only PENDING status, as this component is for *New* requests
          const pendingRequests = data.data.data.filter((req: RequestItem) => req.status === 'PENDING');
          setRequests(pendingRequests);
        }
      } catch (err: any) {
        console.error('Error fetching requests:', err);
        setErrorMessage(
          err.response?.status === 403
            ? "You are not allowed to see this section."
            : "Failed to load facility requests."
        );
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // ----------------------
  // 2. Navigation Handler
  // ----------------------
  const handleViewAll = () => {
    const role = localStorage.getItem("name") === "admin" ? "admin" : "moderator";
    router.push(`/${locale}/${role}/AllFacilities/FacilitiesList`);
  };

  // ----------------------
  // 3. Render Statuses
  // ----------------------
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full h-56 flex flex-col justify-center items-center">
        <Clock className="w-6 h-6 mr-2 text-gray-500 animate-spin" />
        <span className="text-gray-500 mt-2">Loading new requests...</span>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="w-full p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center font-semibold shadow-md flex items-center justify-center gap-2">
        <AlertTriangle className="w-5 h-5" />
        {errorMessage}
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full">
      {/* Header */}
      <h3 className="text-xl font-extrabold text-gray-800 mb-6 border-b pb-3 flex items-center gap-2">
        <Clock className="w-5 h-5 text-yellow-600" />
        New Facilities Requests
      </h3>

      {/* List Items */}
      <div className="flex flex-col gap-4">
        {requests.length === 0 ? (
          <div className="text-gray-500 text-center p-8 border-dashed border-2 rounded-xl">
            No new facility requests waiting for approval.
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200 hover:bg-white transition"
            >
              <div className="flex flex-col flex-1 min-w-0 pr-4">
                {/* Request Title/Facility Name */}
                <span className="text-sm font-semibold text-gray-800 truncate">
                  {req.name.en || "Facility/Edit Request"}
                </span>
                {/* Provider and Date */}
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                  <span className="font-medium text-yellow-700">#{req.id}</span>
                  <span>|</span>
                  <span>Requested by {req.provider.name}</span>
                  <span>|</span>
                  <span>{moment(req.createdAt).fromNow()}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                className={`flex-shrink-0 text-gray-500 hover:text-[${PRIMARY_TEAL}] p-1 rounded-full transition`}
                title="View Request Details"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
        <button
          className={`text-sm font-medium flex items-center gap-1 text-[${PRIMARY_TEAL}] hover:gap-2 transition-all`}
          onClick={handleViewAll}
        >
          View all pending →
        </button>
      </div>
    </div>
  );
}