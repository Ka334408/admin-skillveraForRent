"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, Search, ChevronDown, X } from "lucide-react";

export default function CalendarPage() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const todayTasks = [
    { title: "Daily Standup", color: "bg-green-500" },
    { title: "Budget Review", color: "bg-red-500" },
    { title: "Evolve Jay 1:1", color: "bg-amber-500" },
    { title: "Web Team Progress Update", color: "bg-sky-500" },
    { title: "Social team briefing", color: "bg-emerald-500" },
  ];

  const tomorrowTasks = [
    { title: "Daily Standup", color: "bg-green-500" },
    { title: "Tech Standup", color: "bg-sky-500" },
    { title: "Developer Progress", color: "bg-blue-500" },
  ];

  const [selectedMonth, setSelectedMonth] = useState("January");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowModal(true);
  };

  return (
    <main className="flex-1 bg-[#f5f6fa] min-h-screen p-6 overflow-y-auto">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
        Your Calendar <span className="text-2xl">👋</span>
      </h1>

      <div className="bg-white rounded-2xl shadow-sm p-6 grid md:grid-cols-3 gap-6">
        {/* Left Side */}
        <div className="space-y-6">
          {/* Mini Calendar */}
          <div>
            <h2 className="font-semibold text-gray-700 mb-3">{selectedMonth}</h2>
            <div className="grid grid-cols-7 gap-2 text-center text-gray-500 text-sm">
              {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                <div key={day} className="font-semibold">
                  {day}
                </div>
              ))}
              {Array.from({ length: 31 }, (_, i) => (
                <div
                  key={i}
                  onClick={() => handleDayClick(i + 1)}
                  className={`py-1 rounded-md cursor-pointer ${
                    i + 1 === selectedDay
                      ? "bg-[#0E766E] text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Today Tasks */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Today</h3>
            <div className="space-y-2">
              {todayTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${task.color}`}></span>
                  <p className="text-gray-700">{task.title}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tomorrow Tasks */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Tomorrow</h3>
            <div className="space-y-2">
              {tomorrowTasks.map((task, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${task.color}`}></span>
                  <p className="text-gray-700">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Calendar */}
        <div className="md:col-span-2 border border-gray-200 rounded-2xl">
          {/* Calendar Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100 relative">
            <div className="flex items-center gap-3">
              <CalendarIcon className="text-gray-500 w-5 h-5" />
              <h2 className="text-lg font-semibold text-gray-700">
                {selectedMonth} 2026
              </h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Month Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                  className="border rounded-md px-3 py-1 text-sm text-gray-600 flex items-center gap-2"
                >
                  {selectedMonth} <ChevronDown className="w-4 h-4" />
                </button>
                {showMonthDropdown && (
                  <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-md w-36 z-10">
                    {months.map((month) => (
                      <div
                        key={month}
                        onClick={() => {
                          setSelectedMonth(month);
                          setShowMonthDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      >
                        {month}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button className="border rounded-md p-2 text-gray-500 hover:bg-gray-100">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days Header */}
          <div className="grid grid-cols-7 text-center text-gray-500 text-sm border-b border-gray-100">
            {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="py-3 font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Body */}
          <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 text-sm min-h-[400px]">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                onClick={() => handleDayClick(i + 1)}
                className="h-20 hover:bg-gray-50 cursor-pointer"
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[350px] shadow-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Add Event – {selectedMonth} {selectedDay}
            </h3>
            <input
              type="text"
              placeholder="Event Title"
              className="w-full border rounded-md p-2 text-sm mb-3"
            />
            <textarea
              placeholder="Event Description"
              className="w-full border rounded-md p-2 text-sm mb-3 h-20 resize-none"
            />
            <button
              onClick={() => setShowModal(false)}
              className="w-full bg-[#0E766E] text-white rounded-md py-2 text-sm font-medium hover:bg-[#0c5e59]"
            >
              Save Event
            </button>
          </div>
        </div>
      )}
    </main>
  );
}