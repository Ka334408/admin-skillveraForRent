import React from 'react'
import FacilitiesAreaChart from '../../modertatorView/mainComponent/AreaChart'
import FacilitiesRequestList from '../../modertatorView/mainComponent/Requests'
import UsersInteraction from '../../modertatorView/mainComponent/UserInteractions'
import StatsCards from '../../adminview/mainComponent/statsCards'


export default function AllFacilities() {
  return (
    <div>
        <StatsCards/>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-3">
  
  {/* Top Full Width Chart */}
  <div className="xl:col-span-3">
    <FacilitiesAreaChart />
  </div>
  
  {/* Users Interaction - larger (takes 2 columns) */}
  <div className="xl:col-span-2">
    <UsersInteraction />
  </div>

  {/* Requests - smaller (takes 1 column) */}
  <div className="xl:col-span-1">
    <FacilitiesRequestList />
  </div>

</div>
</div>
  )
}
