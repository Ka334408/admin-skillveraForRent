"use client";

import ReservationCard from "@/app/components/allFacilities/Reservation/ReservationDetails";
import ReservationSteps from "@/app/components/allFacilities/Reservation/reservationSteps";
import Header from "@/app/components/header";
import { useSearchParams } from "next/navigation";

export default function ReservationPage() {
  const searchParams = useSearchParams();
  const id=searchParams.get("id")||"";
  const name = searchParams.get("name") || "Facility Name";
  const price = searchParams.get("price") || "0";
  const image = searchParams.get("image") || "/placeholder.jpg";
  const start = searchParams.get("start") || "-";
  const end = searchParams.get("end") || "-";
 

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
    
    <div className=" bg-gray-100 px-6 py-10">
       
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* الخطوات */}
        <ReservationSteps />

        {/* الكارت */}
        <ReservationCard
                          />
      </div>
    </div>
    </div>
  );
}