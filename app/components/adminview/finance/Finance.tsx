import React from 'react'
import FacilitiesAreaChart from '../../modertatorView/mainComponent/AreaChart'
import StatsChart from '../../modertatorView/mainComponent/BarChart'
import FacilitiesRequestList from '../../modertatorView/mainComponent/Requests'
import StatsCards from '../mainComponent/statsCards'

export default function Finance() {
  return (
    <div>
        <StatsCards/>
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-3">
  
  {/* Top Full Width Chart */}
  <div className="xl:col-span-3">
    <StatsChart/>
  </div>
  
  {/* Users Interaction - larger (takes 2 columns) */}
  <div className="xl:col-span-2">
    <FacilitiesAreaChart />
  </div>

  {/* Requests - smaller (takes 1 column) */}
  <div className="xl:col-span-1">
    <FacilitiesRequestList />
  </div>
  </div>
  </div>
  )
}
