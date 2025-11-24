import { CardImage } from "../../mainComponents/CardImage";


export default function WhyChooseUs() {
  return (
    <section className="bg-[#0E766E] text-white py-16 px-8 text-center rounded-bl-[3rem] my-5 text-3xl">
      <p className="text-sm text-blue-200">Happy Viewrs</p>
      <h2 className="text-2xl font-bold mb-12">Why Choose Us</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
        <CardImage />
        <CardImage />
        <CardImage />
      </div>
    </section>
  );
}