"use client";


import { Users, Building2, CreditCard, BarChart} from "lucide-react";
import StatsCards from "@/app/components/adminview/mainComponent/statsCards";
import RequestFeedBack from "../../adminview/mainComponent/RequestFeedBack";
import StatsChart from "../mainComponent/BarChart";



export default function DashboardHome() {
    /* ------- Fake Data ------- */
    const stats = [
        {
            id: 1,
            title: "Users",
            value: "1000",
            icon: <Users className="w-6 h-6 text-[#0E766E]" />,
        },
        {
            id: 2,
            title: "Providers",
            value: "100",
            icon: <Building2 className="w-6 h-6 text-[#0E766E]" />,
        },
        {
            id: 3,
            title: "Total balance",
            value: "350.40 SAR",
            icon: <CreditCard className="w-6 h-6 text-[#0E766E]" />,
        },
    ];

    

    

    return (
        <div className="space-y-6">
            {/* ---------- Stats Cards ---------- */}
            <div >
                <StatsCards />
            </div>
            {/*---------------middle Chart ----------*/ }
            <div>
               <StatsChart />
            </div>
           

            {/* ---------- Requests + Feedback ---------- */}
            <div>
                <RequestFeedBack feedBack="block" request="block/"/>
            </div>
            
        </div>
    );
}