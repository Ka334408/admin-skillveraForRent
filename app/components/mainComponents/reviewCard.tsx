"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

type ReviewCardProps = {
  name: string;
  email: string;
  avatar: string;
  review: string;
  rating: number;
  date: string;
  nights: number;
};

export default function ReviewCard({
  name,
  email,
  avatar,
  review,
  rating,
  date,
  nights,
}: ReviewCardProps) {
  const t = useTranslations("review");

  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white flex flex-col space-y-2">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <Image
          src={avatar}
          alt={name}
          width={50}
          height={50}
          className="rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{email}</p>
          <p className="text-xs text-gray-400">
            {date} • {t("stayed", { nights })}
          </p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < rating ? "fill-[#0E766E] text-[#0E766E]" : "text-gray-300"}
          />
        ))}
      </div>

      {/* Review text */}
      <p className="text-sm text-gray-700">{review}</p>

      {/* Action */}
      <button className="text-blue-600 text-sm font-medium hover:underline self-start">
        {t("showMore")}
      </button>
    </div>
  );
}