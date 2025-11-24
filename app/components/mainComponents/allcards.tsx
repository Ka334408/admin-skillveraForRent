import Image from "next/image";
import { MapPin } from "lucide-react";

interface FacilityCardProps {
  id: number;
  name: string;
  description: string;
  location: string;
  price: number;
  category: string;
  image: string;
}

export default function FacilityCard({
  name,
  description,
  location,
  price,
  category,
  image,
}: FacilityCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition w-full h-auto sm:h-40">
      {/* الصورة */}
      <div className="w-full sm:w-40 h-40 sm:h-full bg-gray-200 flex-shrink-0">
        <Image
          src={image}
          alt={name}
          width={160}
          height={160}
          className="w-full h-full object-cover block"
        />
      </div>

      {/* المحتوى */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-gray-500 text-sm line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center text-sm text-gray-600">
            <MapPin size={16} className="mr-1 text-[#0E766E]" />
            {location}
          </div>
          <span className="sm:font-semibold bg-[#0E766E] text-white px-3 py-1 rounded-lg text-sm">
            {price} R
          </span>
        </div>
      </div>
    </div>
  );
}