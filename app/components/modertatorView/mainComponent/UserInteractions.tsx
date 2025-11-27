import React from "react";

const data = [
  { dark: 60, light: 40 },
  { dark: 45, light: 55 },
  { dark: 70, light: 30 },
  { dark: 50, light: 50 },
  { dark: 80, light: 20 },
  { dark: 55, light: 45 },
  { dark: 65, light: 35 },
  { dark: 200, light: 70 },
  { dark: 175, light: 70 },
  { dark: 70, light: 70 },
  { dark: 150, light: 70 },
  { dark: 100, light: 70 },
  
];

export default function UsersInteraction() {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm min-[200px]:">
      <h2 className="font-semibold mb-4 text-gray-700">Users Interaction</h2>

      <div className="flex items-end gap-10 h-40 w-fit">
        {data.map((bar, i) => (
          <div key={i} className="flex flex-col justify-end h-full w-6">
            {/* Light Part */}
            <div
              className="w-full rounded-t-xl bg-gray-200 opacity-60"
              style={{ height: `${bar.light}%` }}
            />

            {/* Dark Part */}
            <div
              className="w-full rounded-b-xl rounded-t-xl bg-[#0A7A6A]"
              style={{ height: `${bar.dark}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}