"use client";

import { useState } from "react";
import { User, Users, Building2, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

const plans = [
  {
    id: "individual",
    label: "Individual",
    description: "can add up to 1 facility",
    icon: User,
  },
  {
    id: "team",
    label: "Team",
    description: "can add up to 5 facility",
    icon: Users,
  },
  {
    id: "organization",
    label: "Organization",
    description: "can add up to 10 facility",
    icon: Building2,
  },
  {
    id: "enterprise",
    label: "Enterprise",
    description: "more than 10 facilities",
    icon: Briefcase,
  },
];

export default function SelectPlanPage() {
  const [selected, setSelected] = useState("individual");
  const router=useRouter();
  const locale = useLocale()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-4xl text-center">
        {/* العنوان */}
        <h1 className="text-2xl font-bold mb-2">Choose Your subscibe</h1>
        <p className="text-gray-500 mb-10">
          shoose your subscribation to go to Provider DashBoard.
        </p>

        {/* الباقات */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isActive = selected === plan.id;
            return (
              <button
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                className={`
                  flex flex-col items-center justify-center rounded-2xl border-2 p-6 h-40 transition
                  ${
                    isActive
                      ? "border-[#0E766E] text-[#0E766E] bg-blue-50"
                      : "border-gray-200 text-gray-400 bg-gray-50"
                  }
                `}
              >
                <Icon className="w-8 h-8 mb-3" />
                <span className="font-semibold text-lg">{plan.label}</span>
                <span className="text-sm">{plan.description}</span>
              </button>
            );
          })}
        </div>

        {/* زرار Next */}
        <button className="px-8 py-2 rounded-full bg-white border-2 border-[#0E766E] text-[#0E766E] font-semibold hover:bg-blue-50 transition" 
        onClick={()=>router.push(`/${locale}/providerview/dashBoardHome/myProfile`)}>
          Let&apos;s go
        </button>
      </div>
    </div>
  );
}