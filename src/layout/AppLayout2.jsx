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
        <div className="min-h-screen flex flex-col">
            <LandingHeader toggleMenu={toggleSidebar} />
            <LandingSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
            <BackToTop/>
            
            {/* Main content area that grows to fill available space */}
            <main className="flex-grow">
                <Outlet/>
            </main>
            
            {/* Footer will always be at the bottom */}
            <LandingFooter/>
        </div>
    )
}

export default AppLayout2;