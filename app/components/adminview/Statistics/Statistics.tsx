import React from 'react'
import Topbar from '../mainComponent/topBar'
import FacilitiesAreaChart from '../../modertatorView/mainComponent/AreaChart'
import UsersInteraction from '../../modertatorView/mainComponent/UserInteractions'
import StatsCards from '../mainComponent/statsCards'
import ProvidersList from '../providers/Providerstable'
import StatsChart from '../../modertatorView/mainComponent/BarChart'


export default function Statistics() {
  return (
    <div>
     <div>
             <StatsCards/>
         <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 py-3">
       
       {/* Top Full Width Chart */}
       <div className="xl:col-span-3">
         <StatsChart  highlightedMonth='Nov'/>
       </div>
       
       {/* Users Interaction - larger (takes 2 columns) */}
      
         <FacilitiesAreaChart />
       
     
       {/* Requests - smaller (takes 1 column) */}
     
         <UsersInteraction />
       
    </div>
    </div>
    </div>
  )
}
