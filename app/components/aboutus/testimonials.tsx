"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";

const testimonials = [
  { id: 1, image: "/herosec.jpg" },
  { id: 2, image: "/herosec.jpg" },
  { id: 3, image: "/herosec.jpg" }
];

export default function Testimonials() {
  const t = useTranslations("testimonials");

  return (
    <section className="container mx-auto px-4 py-16">
      <h3 className="text-center text-gray-600 mb-2">{t("subtitle")}</h3>
      <h2 className="text-center text-2xl font-bold text-[#0E766E] mb-8">
        {t("title")}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="border-2 border-gray-300 rounded-xl overflow-hidden transform transition duration-300 hover:scale-105 hover:border-blue-600"
          >
            <Image
              src={item.image}
              alt={`testimonial-${item.id}`}
              width={300}
              height={300}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}