import React, { useState } from 'react'
import LandingHeader from '../components/LandingComponent/LandingHeader';
import LandingFooter from '../components/LandingComponent/LandingFooter';
import { Outlet } from 'react-router-dom';
import BackToTop from '../components/common/BackToTop';
import LandingSidebar from '../components/LandingComponent/LandingSidebar';


const AppLayout2 = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

  return (
    
    <>
     <LandingHeader toggleMenu={toggleSidebar} />
     <LandingSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
     <BackToTop/>
     <Outlet/>
     <LandingFooter/>
    </>
  )
}

export default AppLayout2
