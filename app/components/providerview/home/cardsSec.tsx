import Image from "next/image";

export default function SkavaOverview() {
  return (
    <section className="px-6 md:px-16 py-20 bg-white">
      <div className="max-w-5xl mx-auto text-left">
        {/* السطر الأول مع الصورة السودة */}
        <div className="flex items-center gap-3">
          <h2 className="text-3xl md:text-5xl font-semibold text-gray-900">
            Skava Is A
          </h2>
          <Image
            src="/blackHouse.png" // غيّر حسب الصورة عندك
            alt="Black House"
            width={150}
            height={150}
            className="object-contain"
          />
        </div>

        {/* باقي العنوان */}
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 leading-tight mt-2">
          Super Simple, Smartly <br />
          Customizable, All-Type Of <br />
          Facilities Listing From Skillvera.
        </h2>

        {/* السطرين اللي في الآخر */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-8">
          <div>
            <p className="text-lg text-gray-800 font-medium">
              We Handle Everything, From Listing To Financing.
            </p>

            <p className="mt-2 text-gray-500 text-sm">
              Available Now In Riyadh. Not In Riyadh?{" "}
              <a href="#" className="text-gray-800 underline font-medium">
                Tell Us Where To Be Next
              </a>
            </p>
          </div>

          {/* الصورة البيضا */}
          <div className="mt-6 md:mt-0">
            <Image
              src="/blackHouse.png" // غيّر حسب الصورة عندك
              alt="White House"
              width={180}
              height={100}
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}