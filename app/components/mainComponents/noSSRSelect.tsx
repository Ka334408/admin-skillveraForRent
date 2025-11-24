"use client";

import dynamic from "next/dynamic";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[40px] bg-gray-200 animate-pulse rounded-md" />
  ),
});

export default Select;