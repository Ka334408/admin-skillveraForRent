import ContactFormSection from '@/app/components/contactus/form'
import HeroSection from '@/app/components/contactus/hero'
import InfoSection from '@/app/components/contactus/infosec'
import Header from '@/app/components/header'
import React from 'react'

export default function page() {
  return (
    <div>
      <Header bgColor="bg-[#0E766E]" accounticonColor="bg-[#0E766E]" hoverColor="hover:bg-[#63bdb6]" menuiconColor="bg-[#0E766E]"
        activeColor="text-[#0E766E] bg-white" />
      <HeroSection />
      <InfoSection />
      <ContactFormSection />
    </div>
  )
}
