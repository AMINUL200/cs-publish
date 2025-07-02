// import React from 'react'

import { useState } from "react";
import LandingHeader from "../../components/landingpagecomponent/LandingHeader"
import LandingBanner from "../../components/landingpagecomponent/LandingBanner";
import LandingAbout from "../../components/landingpagecomponent/LandingAbout";
import BrowseJournals from "../../components/landingpagecomponent/BrowseJournals";
import LandingRecentPost from "../../components/landingpagecomponent/LandingRecentPost";
import LandingResearch from "../../components/landingpagecomponent/LandingResearch";

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
        </>
    )
}

export default HomePage
