import { Eye } from 'lucide-react'
import React from 'react'

export default function RequestFeedBack({request , feedBack}:{request : string , feedBack:string}) {
    const requests = [
        {
            id: "#Provider Id",
            text: "User Name Requests to Add a New Facility",
        },
        {
            id: "#Facility Id",
            text: "User Name Requests to Edit a Facility",
        },
        {
            id: "#Facility Id",
            text: "User Name Requests to Create a Provider Id",
        },
    ];

    const feedback = [
        { id: "#123", text: "User11 Added Feedback" },
        { id: "#100", text: "User22 Added New Rating" },
        { id: "#19", text: "User44 Added New Rating" },
        { id: "#19", text: "User49 Added New Rating" },
    ];
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Requests */}
                <div className={`bg-white p-6 rounded-xl shadow-sm ${request}`}>
                    <h3 className="font-semibold mb-4">Requests</h3>
                    <div className="space-y-3">
                        {requests.map((req, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                            >
                                <span className="px-3 py-1 bg-[#0E766E] text-white rounded-md text-sm">
                                    {req.id}
                                </span>
                                <span className="text-sm">{req.text}</span>
                            </div>
                        ))}
                    </div>
                    <button className="text-[#0E766E] mt-3 font-medium flex items-center gap-1">
                        View all →
                    </button>
                </div>

                {/* Feedback */}
                <div className={`${feedBack} bg-white p-6 rounded-xl shadow-sm`}>
                    <h3 className="font-semibold mb-4">Feedback And Rating</h3>
                    <div className="space-y-3">
                        {feedback.map((fb, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                            >
                                <span className="px-3 py-1 bg-[#0E766E] text-white rounded-md text-sm">
                                    {fb.id}
                                </span>
                                <span className="text-sm">{fb.text}</span>
                                <Eye className="text-gray-600 w-5 h-5" />
                            </div>
                        ))}
                    </div>
                    <button className="text-[#0E766E] mt-3 font-medium flex items-center gap-1">
                        View all →
                    </button>
                </div>
            </div>
    </div>
  )
}
