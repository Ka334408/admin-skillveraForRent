import { CardImage } from "../../mainComponents/CardImage";


export default function ToolsSection() {
  return (
    <section className="bg-[#0E766E] text-white py-16 px-8 text-center rounded-br-[3rem] my-5">
      <h2 className="text-2xl font-bold mb-12">
        Get all the tools <br /> you need to host
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center gap-4">
          <CardImage />
          <p className="font-semibold">Listing editor</p>
          <p className="text-sm text-blue-200">
            Showcase every detail of your facility
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <CardImage />
          <p className="font-semibold">Custom dashboard</p>
          <p className="text-sm text-blue-200">
            Manage your facilities rents
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <CardImage />
          <p className="font-semibold">Calendar</p>
          <p className="text-sm text-blue-200">
            Manage your availability and pricing
          </p>
        </div>
      </div>
    </section>
  );
}