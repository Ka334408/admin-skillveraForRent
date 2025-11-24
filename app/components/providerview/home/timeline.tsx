"use client";

import Image from "next/image";
import step1 from "@/public/blackHouse.png";

export default function EasyAsWaterTop() {
  return (
    <section className="py-20 bg-white dark:bg-[#0a0a0a] relative">
      {/* العنوان */}
      <h2 className="text-3xl font-bold text-center mb-16 text-gray-900 dark:text-white">
        Easy As Water
      </h2>

      {/*-------------------- Section 1 */}
      <div className="relative max-w-5xl mx-auto flex justify-center mb-12">
        {/* الخط */}
        <div className="absolute left-1/2 top-0 flex flex-col items-center -translate-x-1/2 z-0">
          <div className="hidden sm:block w-3 h-3 bg-[#0E766E] rounded-full"></div>
          <div className="hidden sm:block w-[4px] h-28 bg-[#0E766E] my-1 rounded-full"></div>
          <div className="hidden sm:block w-3 h-3 bg-[#0E766E] rounded-full mt-1"></div>
        </div>

        {/* النص والصورة */}
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left md:pl-[52%]">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
              Create Your <br /> Host Account
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
              Sign up easily and start your hosting journey
            </p>
          </div>

          <div className="w-32 h-32 relative rounded-xl overflow-hidden shadow-md">
            <Image src={step1} alt="Create Host Account" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/*-------------------- Section 2 */}
      <div className="relative max-w-5xl mx-auto flex justify-center mb-12">
        {/* الخط */}
        <div className="absolute left-1/2 top-0 flex flex-col items-center -translate-x-1/2 z-0">
          <div className="hidden sm:block w-[4px] h-28 bg-[#0E766E] rounded-full"></div>
          <div className="hidden sm:block w-3 h-3 bg-[#0E766E] rounded-full mt-1"></div>
        </div>

        {/* النص والصورة */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-6 text-center md:text-left md:pr-[52%]">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
              Add Your <br /> Property Details
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
              Provide all the key information about your listing
            </p>
          </div>

          <div className="w-32 h-32 relative rounded-xl overflow-hidden shadow-md">
            <Image src={step1} alt="Add Property Details" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/*-------------------- Section 3 */}
      <div className="relative max-w-5xl mx-auto flex justify-center mb-12">
        <div className="absolute left-1/2 top-0 flex flex-col items-center -translate-x-1/2 z-0">
          <div className="hidden sm:block w-[4px] h-28 bg-[#0E766E] rounded-full"></div>
          <div className="hidden sm:block w-3 h-3 bg-[#0E766E] rounded-full mt-1"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left md:pl-[52%]">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
              Complete Your <br /> Profile Setup
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
              Add all your personal and contact information
            </p>
          </div>

          <div className="w-32 h-32 relative rounded-xl overflow-hidden shadow-md">
            <Image src={step1} alt="Profile Setup" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/*-------------------- Section 4 */}
      <div className="relative max-w-5xl mx-auto flex justify-center mb-12">
        <div className="absolute left-1/2 top-0 flex flex-col items-center -translate-x-1/2 z-0">
          <div className="hidden sm:block w-[4px] h-28 bg-[#0E766E] rounded-full"></div>
          <div className="hidden sm:block w-3 h-3 bg-[#0E766E] rounded-full mt-1"></div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-6 text-center md:text-left md:pr-[52%]">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
              Manage Your <br /> Listings Easily
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
              Edit, update, and control your property anytime
            </p>
          </div>

          <div className="w-32 h-32 relative rounded-xl overflow-hidden shadow-md">
            <Image src={step1} alt="Manage Listings" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/*-------------------- Section 5 */}
      <div className="relative max-w-5xl mx-auto flex justify-center">
        <div className="absolute left-1/2 top-0 flex flex-col items-center -translate-x-1/2 z-0">
          <div className="hidden sm:block w-[4px] h-28 bg-[#0E766E] rounded-full"></div>
          <div className="hidden sm:block w-3 h-3 bg-[#0E766E] rounded-full mt-1"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left md:pl-[52%]">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white leading-snug">
              Start Hosting <br /> and Earn Today
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-base mt-2">
              Begin accepting guests and grow your income fast
            </p>
          </div>

          <div className="w-32 h-32 relative rounded-xl overflow-hidden shadow-md">
            <Image src={step1} alt="Start Hosting" fill className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}