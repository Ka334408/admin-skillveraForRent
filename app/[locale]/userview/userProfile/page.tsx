import Header from '@/app/components/header'
import ProfilePage from '@/app/components/userview/userProfile'
import React from 'react'

export default function page() {
  return (
    <div>
      <Header
              bgColor="bg-white border-b-gray-200 border-2" 
              accounticonColor="bg-[#0E766E]"
              menuiconColor="bg-[#0E766E] text-white rounder-full"
              activeColor="bg-[#0E766E] text-white"
              textColor="text-[#0E766E]"
              hoverColor="hover:bg-[#0E766E] hover:text-white"
              enable="hidden"
              isrounded="rounded-full"
            />
            <ProfilePage/>
    </div>
  )
}
