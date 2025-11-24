"use client";

import React from "react";

export default function FinancialSection() {
  return (
    <section className="w-full bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
        {/* Left side - text */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#0E766E] leading-snug">
            Reach financial goals faster
          </h2>
          <p className="text-gray-600">
            Use your cards with no hidden fees. <br />
            Hold, transfer and gain your money.
          </p>
          <button className="px-6 py-2 bg-[#0E766E] text-white font-medium rounded-lg shadow hover:bg-[#075d55]">
            Update financial info
          </button>
        </div>

        {/* Middle - card with hover animation */}
        <div className="flex justify-center">
          <div className="relative w-72 h-44 group cursor-pointer">
            {/* Card 1 */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[#0E766E] to-indigo-400 rounded-xl shadow-lg transform rotate-6 transition-transform duration-500 group-hover:-rotate-3 group-hover:translate-x-2"></div>

            {/* Card 2 */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl shadow-lg flex flex-col justify-center px-6 text-white font-semibold transform transition-transform duration-500 group-hover:rotate-6 group-hover:-translate-x-2">
              <span className="text-lg">Glassy.</span>
              <span className="text-xl tracking-widest">
                7812 2139 0823 XXXX
              </span>
              <div className="flex justify-between text-sm mt-4">
                <span>05/24</span>
                <span>09X</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - feedback */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">
            Feedback And Rating
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <span className="bg-[#0E766E] text-white text-sm font-bold px-3 py-1 rounded-lg">
                #123
              </span>
              <span className="text-gray-600 text-sm">
                User11 Added Feedback
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-[#0E766E] text-white text-sm font-bold px-3 py-1 rounded-lg">
                #100
              </span>
              <span className="text-gray-600 text-sm">
                User22 Added New Rating
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="bg-[#0E766E] text-white text-sm font-bold px-3 py-1 rounded-lg">
                #19
              </span>
              <span className="text-gray-600 text-sm">
                User44 Added New Rating
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}