import React, { useState } from 'react'
import LandingHeader from '../../components/LandingComponent/LandingHeader';
import LandingBanner from '../../components/LandingComponent/LandingBanner';
import LandingAbout from '../../components/LandingComponent/LandingAbout';
import BrowseJournals from '../../components/LandingComponent/BrowseJournals';
import LandingRecentPost from '../../components/LandingComponent/LandingRecentPost';
import LandingResearch from '../../components/LandingComponent/LandingResearch';
import LandingServices from '../../components/LandingComponent/LandingServices';
import LandingFooter from '../../components/LandingComponent/LandingFooter';
import OurPartner from '../../components/LandingComponent/OurPartner';

const HomePage = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };
    console.log(isOpen);

    return (
        <>
            <LandingHeader toggleMenu={toggleMenu} />
            <LandingBanner/>
            <LandingAbout/>
            <BrowseJournals/>
            <LandingRecentPost/>
            <LandingResearch/>
            <LandingServices/>
            <OurPartner/>

            <LandingFooter/>
        </>
    )
}

export default HomePage
