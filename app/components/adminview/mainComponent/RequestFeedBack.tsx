"use client";

import { Eye, Clock, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment'; // Import moment.js for date formatting

// Define the primary color
const PRIMARY_COLOR = "#0E766E";

// --- Interface Definitions (Kept intact) ---
interface RequestItem {
    provider: {
        id: number;
        name: string;
    };
    id: number;
    name: string;
    status: string;
    createdAt: string;
}

interface FeedbackItem {
    user: {
        id: number;
        name: string;
    };
    facility: {
        id: number;
        name: { en: string, ar: string };
    };
    reservation: {
        id: number;
        startDate: string;
        endDate: string;
    };
    rate: number;
    comment: string;
}

// --- Helper Functions ---

const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
        case 'PENDING':
            return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 flex items-center gap-1"><Clock className="w-3 h-3" /> PENDING</span>;
        case 'APPROVED':
            return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">APPROVED</span>;
        default:
            return <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
};

const getRateStars = (rate: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(
            <Star key={i} className={`w-4 h-4 ${i <= rate ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
        );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
};


// --- Main Component ---

export default function DashboardLists({ request, feedBack }: { request: string; feedBack: string }) {
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
    const [loadingRequests, setLoadingRequests] = useState(true);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);
    const [errorRequests, setErrorRequests] = useState<string | null>(null);
    const [errorFeedbacks, setErrorFeedbacks] = useState<string | null>(null);

    const router = useRouter();
    const locale = useLocale();

    // Fetch requests
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const { data } = await axiosInstance.get('/dashboard-dashboard/need-approval-facilities?limit=5'); // Added limit
                if (data?.data?.data) {
                    setRequests(data.data.data);
                }
            } catch (err: any) {
                console.error('Error fetching requests:', err);
                setErrorRequests(err.response?.status === 403 ? "You are not allowed to see this section." : "Failed to load requests.");
                setRequests([]);
            } finally {
                setLoadingRequests(false);
            }
        };
        fetchRequests();
    }, []);

    // Fetch feedbacks
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const { data } = await axiosInstance.get('/dashboard-dashboard/feedbacks?limit=5'); // Added limit
                if (data?.data?.data) {
                    setFeedbacks(data.data.data);
                }
            } catch (err: any) {
                console.error('Error fetching feedbacks:', err);
                setErrorFeedbacks(err.response?.status === 403 ? "You are not allowed to see this section." : "Failed to load feedbacks.");
                setFeedbacks([]);
            } finally {
                setLoadingFeedbacks(false);
            }
        };
        fetchFeedbacks();
    }, []);


    // Navigation handler
    const handleNavigate = (path: string) => {
        const role = localStorage.getItem("name") === "admin" ? "admin" : "moderator";
        router.push(`/${locale}/${role}/${path}`);
    };


    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ----------------------------------------------------------------- */}
            {/* 1. REQUESTS SECTION: Facilities Needing Approval */}
            {/* ----------------------------------------------------------------- */}
            <div className={`bg-white p-6 rounded-2xl shadow-xl border border-gray-100 ${request}`}>
                <h3 className="font-extrabold text-xl text-gray-800 flex items-center gap-2 mb-6 border-b pb-3">
                    <Clock className={`w-6 h-6 text-yellow-600`} />
                    Approval Requests
                </h3>
                {loadingRequests ? (
                    <div className="h-48 animate-pulse flex items-center justify-center text-gray-400">
                        Loading pending requests...
                    </div>
                ) : errorRequests ? (
                    <div className="text-red-700 text-center font-semibold bg-red-50 p-4 rounded-xl">{errorRequests}</div>
                ) : requests.length === 0 ? (
                    <div className="text-gray-500 text-center p-8 border-dashed border-2 rounded-xl">No pending requests require action.</div>
                ) : (
                    <div className="space-y-4">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                            >
                                <div className="flex flex-col flex-1 min-w-0">
                                    {/* Request Type/Name */}
                                    <span className="text-base font-semibold text-gray-800 truncate">
                                        {req.status === "PENDING" ? `Facility: ${req.name}` : req.name}
                                    </span>
                                    {/* Provider Info and Date */}
                                    <span className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                                        <span>{req.provider.name} (ID: {req.provider.id})</span>
                                        <span className="font-light">|</span>
                                        <span>{moment(req.createdAt).fromNow()}</span>
                                    </span>
                                </div>

                                {getStatusBadge(req.status)}

                            </div>
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <button
                    className={`text-[${PRIMARY_COLOR}] mt-6 font-semibold flex items-center gap-1 hover:gap-2 transition-all`}
                    onClick={() => handleNavigate('AllFacilities/FacilitiesList')}
                >
                    Review All Pending <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* ----------------------------------------------------------------- */}
            {/* 2. FEEDBACK SECTION: Recent Ratings and Comments */}
            {/* ----------------------------------------------------------------- */}
            <div className={`bg-white p-6 rounded-2xl shadow-xl border border-gray-100 ${feedBack}`}>
                <h3 className="font-extrabold text-xl text-gray-800 flex items-center gap-2 mb-6 border-b pb-3">
                    <MessageSquare className={`w-6 h-6 text-blue-600`} />
                    Recent Feedback
                </h3>
                {loadingFeedbacks ? (
                    <div className="h-48 animate-pulse flex items-center justify-center text-gray-400">
                        Loading recent feedback...
                    </div>
                ) : errorFeedbacks ? (
                    <div className="text-red-700 text-center font-semibold bg-red-50 p-4 rounded-xl">{errorFeedbacks}</div>
                ) : feedbacks.length === 0 ? (
                    <div className="text-gray-500 text-center p-8 border-dashed border-2 rounded-xl">No recent customer feedback found.</div>
                ) : (
                    <div className="space-y-4">
                        {feedbacks.map((fb) => (
                            <div
                                key={fb.reservation.id}
                                className="flex items-start justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                            >
                                <div className="flex flex-col flex-1 min-w-0 pr-4">
                                    {/* Rating and User */}
                                    <div className="flex items-center justify-between">
                                        {getRateStars(fb.rate)}
                                        <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
                                            {moment(fb.reservation.startDate).format('MMM Do')}
                                        </span>
                                    </div>

                                    {/* Feedback Content */}
                                    <span className="text-sm font-medium text-gray-800 mt-2 truncate">
                                      Facility Name :  {fb.facility.name.en}
                                    </span>
                                    <p className="text-xs text-gray-600 line-clamp-1 mt-1">
                                         {fb.user.name} commented: {fb.comment || 'No comment provided.'}
                                    </p>
                                </div>

                                {/* View Button */}
                                <button className="flex-shrink-0 text-gray-500 hover:text-blue-600 p-1 rounded-full transition" title="View Details">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                {/* View All Button */}
                <button
                    className={`text-blue-600 mt-6 font-semibold flex items-center gap-1 hover:gap-2 transition-all`}
                    onClick={() => handleNavigate('FeedbackAndRating')}
                >
                    View All Feedback <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}