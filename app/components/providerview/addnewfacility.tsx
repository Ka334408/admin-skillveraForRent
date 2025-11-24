"use client";
import { useState } from "react";

export function AddFacilityPage() {
  const [coverPic, setCoverPic] = useState<File | null>(null);
  const [facilityPics, setFacilityPics] = useState<File[]>([]);

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen mt-5 sm:mt-0">
      {/* Breadcrumb */}
      <div className="mb-6 text-lg sm:text-xl text-[#0E766E] font-medium flex flex-wrap gap-2">
        <h1 className="cursor-pointer hover:underline">My Facilities</h1>
        <span>/</span>
        <h1 className="text-[#0E766E]">Add new facility</h1>
      </div>

      {/* Title + Input */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0E766E] uppercase tracking-wide">
          Facility Name
        </h1>
        <input
          type="text"
          placeholder="Enter facility name"
          className="w-full sm:w-auto border-b-2 border-[#85bbb6] bg-transparent focus:outline-none focus:border-[#0E766E] px-2 text-lg text-gray-700"
        />
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-10">
        {/* Cover Pic */}
        <div>
          <h3 className="text-gray-700 font-medium mb-2">Facility Cover Pic</h3>
          <div className="w-full sm:w-56 h-40 sm:h-36 border border-dashed border-gray-300 flex items-center justify-center text-gray-400 rounded-lg mb-3 overflow-hidden">
            {coverPic ? (
              <img
                src={URL.createObjectURL(coverPic)}
                alt="Cover Pic"
                className="w-full h-full object-cover"
              />
            ) : (
              "Cover Pic"
            )}
          </div>
          <label className="px-4 py-2 bg-[#0E766E] text-white rounded-lg cursor-pointer hover:bg-[#0E766E] inline-flex items-center gap-1">
            Upload +
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setCoverPic(e.target.files[0])
              }
              className="hidden"
            />
          </label>
        </div>

        {/* Facility Pics */}
        <div>
          <h3 className="text-gray-700 font-medium mb-2">Facility Pictures</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
            {facilityPics.length > 0 ? (
              facilityPics.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt={`pic-${i}`}
                  className="w-full h-20 object-cover rounded-lg border"
                />
              ))
            ) : (
              <>
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="w-full h-20 bg-gray-100 border rounded-lg flex items-center justify-center text-xs text-gray-400"
                  >
                    +
                  </div>
                ))}
              </>
            )}
          </div>
          <label className="px-4 py-2 bg-[#0E766E] text-white rounded-lg cursor-pointer hover:bg-[#075d55] inline-flex items-center gap-1">
            Upload +
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) =>
                e.target.files && setFacilityPics(Array.from(e.target.files))
              }
              className="hidden"
            />
          </label>
        </div>
      </div>

      <hr className="mb-8 border-blue-200" />

      {/* Form Fields */}
      <form className="space-y-6 p-0 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block rounded-2xl text-gray-700 font-medium mb-2">
              Gender
            </label>
            <select className="w-full border rounded-lg p-3">
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 rounded-2xl font-medium mb-2">
              Age
            </label>
            <select className="w-full border rounded-lg p-3">
              <option>From</option>
              <option>18+</option>
              <option>30+</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 rounded-2xl">
            Location URL *
          </label>
          <input
            type="text"
            className="w-full border rounded-2xl p-3"
            placeholder="Enter Google Maps URL"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2 rounded-2xl">
            Street Name
          </label>
          <input type="text" className="w-full border rounded-3xl p-3 " />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Building Number
          </label>
          <input type="text" className="w-full border rounded-3xl p-3" />
        </div>

        {/* Extra Fields */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Overview</label>
          <textarea className="w-full border rounded-3xl p-3 h-24" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Facility Information
          </label>
          <textarea className="w-full border rounded-3xl p-3 h-24" />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Facility Features
          </label>
          <textarea className="w-full border rounded-3xl p-3 h-24" />
        </div>

        {/* Period */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Period</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <span className="block text-sm text-gray-500 mb-1">From</span>
              <input type="date" className="w-full border rounded-3xl p-3" />
            </div>
            <div>
              <span className="block text-sm text-gray-500 mb-1">To</span>
              <input type="date" className="w-full border rounded-3xl p-3" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-[#0E766E] text-white font-semibold rounded-lg hover:bg-[#075d55]"
        >
          Submit Facility
        </button>
      </form>
    </div>
  );
}