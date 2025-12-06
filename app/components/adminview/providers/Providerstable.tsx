"use client";

import { useRouter } from "next/navigation";
import { Filter, Clock, AlertTriangle, UserPlus, Home, Edit3, Eye } from "lucide-react";
import { useLocale } from "next-intl";
import React, { useEffect, useState } from "react";
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';

// Define constants
const API_PENDING_REQUESTS = '/dashboard-dashboard/need-approval-facilities';
const PRIMARY_TEAL = "#0E766E";

// --- Interface Definitions ---
interface RequestItem {
    id: number;
    name: {en:string}; // Facility Name
    status: string; // Should be 'PENDING'
    createdAt: string;
    provider: {
        id: number;
        name: string;
    };
    // Assuming a 'type' field exists in a real scenario to distinguish between Host/Facility requests
    // For now, we'll infer it based on context or status.
}

// --- Component ---

export default function RecentProviderRequests() {
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
                // Fetch the latest 5 pending requests
                const { data } = await axiosInstance.get(`${API_PENDING_REQUESTS}?limit=5`);

                if (data?.data?.data) {
                    // Filter for PENDING status and store the first 5 results
                    const pendingRequests = data.data.data
                        .filter((req: RequestItem) => req.status === 'PENDING')
                        .slice(0, 5); 
                    setRequests(pendingRequests);
                }
            } catch (err: any) {
                console.error('Error fetching provider requests:', err);
                setErrorMessage(
                    err.response?.status === 403 
                        ? "You are not allowed to see this section." 
                        : "Failed to load provider requests."
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
        // Navigate to the full list of providers/requests
        router.push(`/${role}/Providers/ProvidersList`);
    };

    // Placeholder function for request type icon (Needs real API data for accuracy)
    const getRequestIcon = (request: RequestItem) => {
        // In a real app, this would check a 'requestType' field.
        // For demonstration, we'll just use a facility icon.
        return <Home className="w-5 h-5 text-yellow-600" />; 
    };

    // ----------------------
    // 3. Render Statuses
    // ----------------------
    if (loading) {
        return (
            <div className="w-full bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mt-6 h-56 flex flex-col justify-center items-center">
                <Clock className="w-6 h-6 mr-2 text-gray-500 animate-spin" />
                <span className="text-gray-500 mt-2">Loading recent requests...</span>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="w-full p-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center font-semibold shadow-md flex items-center justify-center gap-2 mt-6">
                <AlertTriangle className="w-5 h-5" />
                {errorMessage}
            </div>
        );
    }


    // ----------------------
    // 4. Render List
    // ----------------------
    return (
        <div className="w-full bg-white rounded-2xl p-6 shadow-xl border border-gray-100 mt-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-3">
                <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
                    <UserPlus className="w-6 h-6 text-indigo-600" />
                    Recent Provider Requests
                </h2>

                <button className="flex items-center gap-1 text-gray-700 border border-gray-300 rounded-xl px-3 py-1.5 text-sm hover:bg-gray-100 transition">
                    <Filter size={16} />
                    <span>Filter</span>
                </button>
            </div>

            {/* Providers list */}
            <div className="flex flex-col gap-3">
                {requests.length === 0 ? (
                    <div className="text-gray-500 text-center p-8 border-dashed border-2 rounded-xl">
                        No new provider-related requests are pending.
                    </div>
                ) : (
                    requests.map((item) => (
                        <div
                            key={item.id}
                            className="w-full flex items-center justify-between gap-4 bg-gray-50 rounded-xl px-4 py-3 border border-gray-200 hover:bg-white transition"
                        >
                            {/* Icon and Main Info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="p-2 bg-yellow-100 rounded-full">
                                    {getRequestIcon(item)}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                        {item.name.en || "New Facility Request"}
                                    </p>
                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                        <span className="font-medium text-indigo-700">
                                            Req ID: #{item.id}
                                        </span>
                                        <span>|</span>
                                        <span>By: {item.provider.name}</span>
                                        <span>|</span>
                                        <span>{moment(item.createdAt).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Button */}
                            <button 
                                className={`flex-shrink-0 text-gray-500 hover:text-[${PRIMARY_TEAL}] p-1 rounded-full transition`} 
                                onClick={() => router.push(`/${locale}/moderator/requests/${item.id}`)}
                                title="Review Request"
                            >
                                <Eye className="w-5 h-5" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* View all */}
            <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                <button
                    onClick={handleViewAll}
                    className={`text-sm font-medium text-[${PRIMARY_TEAL}] hover:underline`}
                >
                    View all Providers →
                </button>
            </div>
        </div>
    );
}