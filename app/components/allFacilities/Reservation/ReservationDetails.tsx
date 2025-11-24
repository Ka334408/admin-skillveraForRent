"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReservationCard() {
  const router = useRouter();
  const [reservation, setReservation] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("reservationData");
    if (stored) {
      setReservation(JSON.parse(stored));
      console.log(stored);

    } else {
      router.push("/userview/allFacilities");
      console.log(stored);

    }
  }, [router]);

  if (!reservation) return <p>Loading...</p>;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 w-full max-w-lg mx-auto min-h-[460px] flex flex-col justify-between">
      {/* بيانات المكان */}
      <div className="space-y-6">
        <div className="flex items-center gap-5">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-200">
            <Image src={reservation.image} alt={reservation.name} fill className="object-cover" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{reservation.name}</h2>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Star className="text-yellow-500" size={18} />
              <span className="text-sm">5.0 (100)</span>
            </div>
          </div>
        </div>

        {/* إلغاء مجاني */}
        <div className="border-t pt-4">
          <p className="font-semibold text-gray-800 text-sm sm:text-base">
            Free cancellation
          </p>
          <p className="text-gray-500 leading-relaxed text-sm mt-1">
            Cancel before <strong>20/11/2025</strong> for a full refund{" "}
            <a href="#" className="text-[#0E766E] underline">
              open policy
            </a>
          </p>
        </div>

        {/* التواريخ */}
        <div className="border-t pt-4 flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">
              Dates from - to
            </p>
            <p className="text-gray-500 text-sm">
              From {reservation.start} to {reservation.end}
            </p>
          </div>
          <button
            onClick={() => router.push(`/userview/allFacilities/${reservation.id}`)}
            className="bg-[#0E766E] text-white px-4 py-2 rounded-md hover:bg-[#095f55] transition text-sm"
          >
            Change
          </button>
        </div>
      </div>

      {/* السعر */}
      <div className="border-t mt-6 pt-4">
        <div className="flex justify-between font-semibold text-sm sm:text-base">
          <span className="text-gray-800">Price details</span>
          <a href="#" className="text-[#0E766E] underline">
            Price Breakdown
          </a>
        </div>
        <p className="mt-2 text-gray-700 text-base">
          Total price: <span className="font-semibold">{reservation.price} SR</span>
        </p>
      </div>
    </div>
  );
}