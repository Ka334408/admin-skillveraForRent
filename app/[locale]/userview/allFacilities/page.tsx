import FacilitySection from '@/app/components/allFacilities/allFacilities'
import FacilitySectionWrapper from '@/app/components/allFacilities/facilitySecWrapper'
import Header from '@/app/components/header'
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
            <FacilitySectionWrapper/>
           
    </div>
  )
}
