// app/provider/dashboard/page.tsx
"use client";

import StatsCards from "../mainComponents/statsCards";
import AccountBalanceCard from "./AccountBalanceCard";
import BottomCharts from "./bottomCharts";
import FinancialSection from "./middleCards";
import MyFacilities from "./proFacilitiesShow";
import RevenueChart from "./revenuechart";
import Topbar from "./topBar";





export default function DashboardPage() {
  return (
   
    <div> 
        <Topbar/>
        <StatsCards/>
        <MyFacilities/>
        <FinancialSection/>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Revenue Chart - 2/3 */}
      <div className="lg:col-span-2">
        <RevenueChart />
      </div>

      {/* Account Balance - 1/3 */}
      <div className="lg:col-span-1">
        <AccountBalanceCard />
      </div>
  </div>

<BottomCharts/>
    </div>
  );
}