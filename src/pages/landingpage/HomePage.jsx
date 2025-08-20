import React, { useState } from 'react'
import LandingBanner from '../../components/LandingComponent/LandingBanner';
import LandingAbout from '../../components/LandingComponent/LandingAbout';
import BrowseJournals from '../../components/LandingComponent/BrowseJournals';
import LandingRecentPost from '../../components/LandingComponent/LandingRecentPost';
import LandingResearch from '../../components/LandingComponent/LandingResearch';
import LandingServices from '../../components/LandingComponent/LandingServices';
import OurPartner from '../../components/LandingComponent/OurPartner';

const HomePage = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    console.log(isOpen);

    return (
        <>
           
            <LandingBanner/>
            <LandingAbout/>
            <BrowseJournals/>
            <LandingRecentPost/>
            <LandingResearch/>
            <LandingServices/>
            <OurPartner/>

            
        </>
    )
}

export default HomePage
