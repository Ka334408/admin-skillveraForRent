"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function ReviewsSlider() {
  const reviews = [
    {
      name: "Alexa Rawles",
      role: "Host, Designer",
      review:
        "So thoughtful and wise, and vulnerable in sharing her own challenges with me. Dani is wonderful!",
    },
    {
      name: "John Doe",
      role: "Director, Producer",
      review:
        "Great experience staying here. The communication was smooth and everything was clean!",
    },
    {
      name: "Sarah Lee",
      role: "Marketing Lead",
      review:
        "Absolutely loved the stay! The vibe and attention to detail made me feel at home.",
    },
  ];

  const [current, setCurrent] = useState(0);

  const nextReview = () => setCurrent((prev) => (prev + 1) % reviews.length);
  const prevReview = () =>
    setCurrent((prev) => (prev - 1 + reviews.length) % reviews.length);

  const { name, role, review } = reviews[current];

  return (
    <section className="relative py-24 ">
      <div className="max-w-4xl mx-auto px-6 text-center relative flex flex-col items-center">
        {/* علامة الاقتباس */}
        <Quote
          className="absolute text-[#0E766E] w-56 h-36 -top-20  left-[-16%] sm:left-[9%] rotate-180  z-20"
        fill="#0E766E"/>

        {/* الكارت */}
        <div className="bg-white shadow-lg rounded-xl max-w-md p-10 relative z-30">
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {review}
          </p>
          <h4 className="text-teal-700 font-semibold">{name}</h4>
          <p className="text-gray-500 text-sm">{role}</p>

          {/* الأسهم */}
          <div className="flex justify-between mt-8 text-teal-700">
            <button
              onClick={prevReview}
              className="hover:text-teal-900 transition"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={nextReview}
              className="hover:text-teal-900 transition"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}