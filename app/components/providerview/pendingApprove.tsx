"use client";

import { useRouter } from "next/navigation";

export default function PendingApproval() {
    const router=useRouter();
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-6">
      {/* Icon Box */}
      <div className="bg-blue-100 p-6 rounded-xl mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 text-[#0E766E]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M5.121 17.804A9.969 9.969 0 0112 15c2.485 0 4.735.905 6.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      {/* Text */}
      <h1 className="text-2xl font-bold text-[#0E766E] mb-2">
        Your account is pending please wait for skava approval!
      </h1>
      <p className="text-gray-500 mb-6">
        You will receive a message via mail and it will appear in the
        notification screen
      </p>

      {/* Button */}
      <button
      onClick={()=>router.push("/providerview/dashBoardHome/dashBoard")}
      className="px-6 py-2 bg-[#0E766E] text-white rounded-lg shadow">
        back to Home Dashboard
      </button>
    </div>
  );
}