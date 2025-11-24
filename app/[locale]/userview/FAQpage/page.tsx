"use client";

import Header from "@/app/components/header";
import FaqHeader from "@/app/components/userview/faqHeader";
import { useState } from "react";


const faqData = {
  Rent: [
    { q: "Do We Get Electronic Invoice?", a: "Yes, after booking confirmation you receive it by email." },
    { q: "Can We Reschedule The Rent Date?", a: "Yes, you can reschedule 24 hours before your booking." },
    { q: "Can We Rent More Than One Facility?", a: "Absolutely, multiple facilities can be booked at once." },
    { q: "What Do We Need To Rent A Facility?", a: "You need a valid ID and payment method." },
  ],
  Host: [
    { q: "How To Register As A Host?", a: "You can sign up using the Host Registration form." },
    { q: "Can Hosts Edit Listings?", a: "Yes, hosts can modify listing details anytime." },
  ],
  Payment: [
    { q: "What Payment Methods Are Supported?", a: "We support Visa, MasterCard, and digital wallets." },
    { q: "Is My Payment Secure?", a: "Yes, all transactions are encrypted and secure." },
  ],
  Policies: [
    { q: "What Is The Refund Policy?", a: "Refunds are available up to 48 hours before your booking date." },
    { q: "Are There Any Extra Fees?", a: "No hidden fees, only standard taxes may apply." },
  ],
};

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof faqData>("Rent");

  return (
    <div>
        <Header bgColor="bg-[#0E766E]" accounticonColor="bg-[#0E766E]"  hoverColor="hover:bg-[#63bdb6]" menuiconColor="bg-[#0E766E]"
                activeColor="text-[#0E766E] bg-white" />
    
    <div className="min-h-screen bg-gray-50">
      {/* Header Component */}
      <FaqHeader
        title="Frequently Asked Question"
        subtitle="Did you find the question as you expected?"
      />

      {/* Tabs */}
      <div className="flex justify-center gap-8 mt-8 text-lg font-semibold text-[#0E766E]">
        {Object.keys(faqData).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as keyof typeof faqData)}
            className={`pb-2 border-b-2 transition-all ${
              activeTab === tab ? "border-[#0E766E]" : "border-transparent hover:border-[#0E766E]/50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-2xl mx-auto mt-10 space-y-4 px-4">
        {faqData[activeTab].map((faq, idx) => (
          <details
            key={idx}
            className="border border-[#0E766E] rounded-lg p-4 bg-white shadow-sm"
          >
            <summary className="cursor-pointer font-medium text-[#0E766E]">
              {faq.q}
            </summary>
            <p className="mt-2 text-gray-700">{faq.a}</p>
          </details>
        ))}
      </div>
    </div>
    </div>
  );
}