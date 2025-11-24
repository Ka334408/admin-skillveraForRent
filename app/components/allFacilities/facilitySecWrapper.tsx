"use client";

import dynamic from "next/dynamic";

const FacilitySection = dynamic(() => import("./allFacilities"), {
  ssr: false, // ✅ Important: disable SSR
});

export default function FacilitySectionWrapper() {
  return <FacilitySection />;
}