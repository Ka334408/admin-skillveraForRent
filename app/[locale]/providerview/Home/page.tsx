import Header from '@/app/components/header'
import SkavaIntro from '@/app/components/providerview/home/cardsSec'
import HeroSection from '@/app/components/providerview/home/herosection'
import HowItWorks from '@/app/components/providerview/home/HowitWork'
import EasyAsWaterSection from '@/app/components/providerview/home/timeline'
import ToolsSection from '@/app/components/providerview/home/toolsSec'
import WhyChooseUs from '@/app/components/providerview/home/whyChooseUs'
import FAQSection from '@/app/components/userview/FAQSec'

import React from 'react'

export default function page() {
  return (
    <div>
     <Header
                           bgColor="bg-white border-b-gray-200 " 
                           accounticonColor="bg-[#0E766E]"
                           menuiconColor="bg-[#0E766E] text-white rounder-full"
                           activeColor="bg-[#0E766E] text-white"
                           textColor="text-[#0E766E]"
                           hoverColor="hover:bg-[#0E766E] hover:text-white"
                           enable="hidden"
                           isrounded="rounded-full"
                         />
      <HeroSection/>
      <SkavaIntro/>
      <ToolsSection/>
      <HowItWorks/>
      <EasyAsWaterSection/>
      <WhyChooseUs/>
      <FAQSection/>
    </div>
  )
}
