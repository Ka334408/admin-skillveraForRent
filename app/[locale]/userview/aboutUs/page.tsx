import Benefits from "@/app/components/aboutus/benfiets";
import Hero from "@/app/components/aboutus/hero";
import Story from "@/app/components/aboutus/story";
import Testimonials from "@/app/components/aboutus/testimonials";
import Header from "@/app/components/header";


export default function AboutPage() {
  return (
    <main>
        <Header bgColor="bg-[#0E766E]" accounticonColor="bg-[#0E766E]"  hoverColor="hover:bg-[#63bdb6]" menuiconColor="bg-[#0E766E]"
                        activeColor="text-[#0E766E] bg-white" />
      <Hero />
      <Benefits />
      <Story />
      <Testimonials />
    </main>
  );
}