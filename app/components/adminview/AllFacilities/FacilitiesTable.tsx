"use client";

import { CheckCircle, XCircle, Clock, Eye, RefreshCw, AlertTriangle, ListChecks } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import moment from 'moment';

// Define the API endpoints
const API_PENDING_REQUESTS = '/dashboard-dashboard/need-approval-facilities';
const API_APPROVED_FACILITIES = '/guest-facility'; // New API for Approved Facilities
const API_STATUS_UPDATE = '/moderator-facility/';

// --- Interface Definitions ---
interface FacilityItem {
  id: number;
  name:{en: string};
  status: string;
  createdAt?: string; // Optional for Approved list
  provider?: { id: number; name: string; }; // Optional for Approved list
}

type Tab = 'pending' | 'approved';

// --- Main Component ---

export default function FacilityApprovalTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('pending');
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // ----------------------
  // 1. Fetch Data Function
  // ----------------------
  const fetchData = useCallback(async (tab: Tab) => {
    setLoading(true);
    setError(null);
    setFacilities([]);

    const endpoint = tab === 'pending' ? API_PENDING_REQUESTS : API_APPROVED_FACILITIES;

    try {
      const { data } = await axiosInstance.get(endpoint);
      let fetchedData: FacilityItem[] = [];

      if (tab === 'pending') {
        // For pending list, we expect data.data.data and filter for PENDING status
        if (data?.data?.data) {
          fetchedData = data.data.data.filter((item: FacilityItem) => item.status === 'PENDING');
        }
      } else {
        // For approved list, we expect data.data and we only need facilities that are not PENDING
        // Note: Assuming /api/guest-facility returns facility objects. Adjust based on actual API response structure.
        if (data?.data) {
          // Filter to only include APPROVED facilities (if the API supports it, otherwise assumes /guest-facility returns approved only)
          fetchedData = data.data.filter((item: FacilityItem) => item.status === 'APPROVED');
        }
      }

      setFacilities(fetchedData);
    } catch (err: any) {
      console.error(`Error fetching ${tab} facilities:`, err);
      setError(`Failed to load ${tab} facilities.`);
    } finally {
      setLoading(false);
    }
  }, []);

  // ----------------------
  // 2. Fetch Data Effect (on tab change)
  // ----------------------
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, fetchData]);


  // ----------------------
  // 3. Handle Status Update (Approve/Reject)
  // ----------------------
  const handleUpdateStatus = async (facilityId: number, status: 'APPROVED' | 'REJECTED') => {
    setProcessingId(facilityId);
    const endpoint = `${API_STATUS_UPDATE}${facilityId}/status`;

    try {
      await axiosInstance.put(endpoint, { status });

      // Success: Remove the request from the local 'pending' state
      setFacilities(prevRequests => prevRequests.filter(req => req.id !== facilityId));

      alert(`Facility ID ${facilityId} successfully ${status}.`);

    } catch (err: any) {
      console.error(`Error updating status to ${status} for ID ${facilityId}:`, err);
      alert(`Failed to ${status} facility ID ${facilityId}. Please check permissions.`);
    } finally {
      setProcessingId(null);
    }
  };


  // ----------------------
  // 4. Render Components
  // ----------------------

  // Skeleton/Loading State
  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-500">
          <Clock className="w-5 h-5 mr-2 animate-spin" />
          Loading {activeTab} facilities...
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center font-semibold flex items-center justify-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {error}
        </div>
      );
    }

    if (facilities.length === 0) {
      return (
        <div className="text-gray-500 text-center p-8 border-dashed border-2 rounded-xl">
          {activeTab === 'pending'
            ? '🎉 Great job! No pending facilities require action.'
            : 'No approved facilities found.'
          }
        </div>
      );
    }

    // List Rendering
    return (
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {facilities.map((fac) => {
          const isProcessing = processingId === fac.id;
          const isPendingTab = activeTab === 'pending';

          return (
            <div
              key={fac.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
            >
              {/* Details */}
              <div className="flex-1 min-w-0 pr-4 mb-3 sm:mb-0">
                <span className="text-base font-semibold text-gray-800 block truncate">
                  {fac.name.en || 'Unnamed Facility'}
                </span>
                <div className="text-xs text-gray-500 mt-1 space-x-2">
                  <span className="font-medium text-yellow-700">ID: #{fac.id}</span>
                  {isPendingTab && fac.provider && (
                    <>
                      <span className="font-light">|</span>
                      <span>Provider: {fac.provider.name}</span>
                      <span className="font-light">|</span>
                      <span>Requested: {moment(fac.createdAt).fromNow()}</span>
                    </>
                  )}
                  {!isPendingTab && (
                    <>
                      <span className="font-light">|</span>
                      <span>Status: <span className="text-green-600">{fac.status}</span></span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions (Only for Pending Tab) */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  className="text-gray-500 hover:text-blue-600 p-2 rounded-full transition"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </button>

                {isPendingTab && (
                  <>
                    {/* Approve Button */}
                    <button
                      onClick={() => handleUpdateStatus(fac.id, 'APPROVED')}
                      disabled={isProcessing}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-sm font-medium bg-green-600 hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve
                    </button>

                    {/* Reject Button */}
                    <button
                      onClick={() => handleUpdateStatus(fac.id, 'REJECTED')}
                      disabled={isProcessing}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-red-600 text-sm font-medium border border-red-600 hover:bg-red-50 transition disabled:border-gray-400 disabled:text-gray-600"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // ----------------------
  // 5. Final Layout
  // ----------------------

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <h3 className="font-extrabold text-xl text-gray-800 flex items-center gap-2 mb-4">
        <ListChecks className={`w-6 h-6 text-gray-800`} />
        Facility Approval Management
      </h3>

      {/* Tabs */}
      <div className="flex items-center gap-6 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-1 pb-3 text-sm font-semibold capitalize transition-colors duration-200 relative flex items-center gap-1 ${activeTab === 'pending'
              ? 'text-yellow-600 border-b-2 border-yellow-600'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <Clock className='w-4 h-4' />
          Pending Approval
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-1 pb-3 text-sm font-semibold capitalize transition-colors duration-200 relative flex items-center gap-1 ${activeTab === 'approved'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          <CheckCircle className='w-4 h-4' />
          Approved Facilities
        </button>
        <button
          onClick={() => fetchData(activeTab)}
          className="ml-auto text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100"
          disabled={loading}
          title="Refresh Data"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {renderContent()}
    </div>
  );
}