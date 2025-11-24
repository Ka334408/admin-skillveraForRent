"use client";

import FacilityHeader from "@/app/components/allFacilities/facilitySec/FacilityHeder";
import FacilityCalendar from "@/app/components/allFacilities/facilitySec/facilityCalender";
import Header from "@/app/components/header";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import RatingCard from "@/app/components/allFacilities/facilitySec/facilityReview";
import ReviewsList from "@/app/components/allFacilities/facilitySec/personalReview";
import ThingsToKnow from "@/app/components/allFacilities/facilitySec/aboutFacility";

// ✅ منع SSR
const FacilityMapSection = dynamic(
  () => import("@/app/components/allFacilities/facilitySec/facilityMap"),
  { ssr: false }
);

// ✅ تعريف بيانات الفئات (Categories) بشكل كامل
const categoryData: Record<
  string,
  { name: string; description: string; src: string,price:number }
> = {
  FootBall: {
    name: "Five-a-side Football Pitch",
    description:
      "Enjoy premium football pitches equipped with artificial turf, lights, and comfortable seating areas for spectators and price includes tax .",
    src: "/stadium.jpg",
    price: 400,
  },
  Education: {
    name: "Modern Educational",
    description:
      "A fully equipped learning space designed for workshops, lectures, and educational activities and price includes tax.",
    src: "/hotal.jpg",
    price: 800,
  },
  HandBall: {
    name: "Hand ball court",
    description:
      "Experience top-tier fitness and relaxation facilities including a gym, spa, and swimming pool and price includs tax.",
    src: "/school.jpg",
    price: 400,
  },
};

// ✅ إنشاء البيانات التجريبية
const facilitiesData = Array.from({ length: 100 }, (_, i) => {
  const category =
    i % 3 === 0 ? "FootBall" : i % 3 === 1 ? "Education" : "HandBall";
  const cat = categoryData[category];

  return {
    id: i + 1,
    name: cat.name,
    description: cat.description,
    location: i % 2 === 0 ? "Riyadh" : "Jeddah",
    price: cat.price,
    category,
    image: cat.src,
    lat: 24.7136 + i * 0.01,
    lng: 46.6753 + i * 0.01,
  };
});

export default function FacilityPage({ params }: { params: { id: string } }) {
  const facilityId = Number(params.id);
  const facility = facilitiesData.find((f) => f.id === facilityId);

  if (!facility) return notFound();

  return (
    <div>
      <Header
        bgColor="bg-white border-b-gray-200 border-2"
        accounticonColor="bg-[#0E766E]"
        menuiconColor="bg-[#0E766E] text-white rounder-full"
        activeColor="bg-[#0E766E] text-white"
        textColor="text-[#0E766E]"
        hoverColor="hover:bg-[#0E766E] hover:text-white"
        enable="hidden"
        isrounded="rounded-full"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="z-50">
        <FacilityHeader facility={facility} /></div>
        <div className="-z-10">
        <FacilityMapSection
          location={facility.location}
          lat={facility.lat}
          lng={facility.lng}
          features={[
            "Free Wi-Fi",
            "Parking available",
            "Air Conditioning",
            "24/7 Security",
          ]}
        />
        </div>
        <FacilityCalendar
          facility={facility}
          bookedDates={["2025-11-20", "2025-11-22", "2025-11-25"]}
        />
        <ThingsToKnow />
        <ReviewsList />
        <RatingCard />
      </div>
    </div>
  );
}