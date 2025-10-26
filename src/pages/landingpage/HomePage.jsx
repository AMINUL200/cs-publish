import React, { useState } from "react";
import LandingBanner from "../../components/LandingComponent/LandingBanner";
import LandingAbout from "../../components/LandingComponent/LandingAbout";
import BrowseJournals from "../../components/LandingComponent/BrowseJournals";
import LandingRecentPost from "../../components/LandingComponent/LandingRecentPost";
import LandingResearch from "../../components/LandingComponent/LandingResearch";
import LandingServices from "../../components/LandingComponent/LandingServices";
import OurPartner from "../../components/LandingComponent/OurPartner";
import LandingPricing from "../../components/LandingComponent/LandingPricing";
import { toast } from "react-toastify";
import axios from "axios";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
   const API_URL = import.meta.env.VITE_API_URL;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [bannerData, setBannerData] = useState([]);

  const [loading, setLoading] = useState({
    banner: true,
  });
  const [error, setError] = useState({
    banner: null,
  });

  const fetchAll = async () => {
    const requests = {
      banner: axios.get(`${API_URL}api/banners`),
    };

    Object.entries(requests).forEach(async ([key, request]) => {
      try {
        const response = await request;
        if (response.status === 200) {
          if (key === "banner") setBannerData(response.data.data);
        }
      } catch (error) {
        console.log(`Error fetching ${key}: `, error);
        setError((prev) => ({ ...prev, [key]: error.message }));
        toast.error(`Error fetching ${key}: ${error.message}`);
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    });
  };

    React.useEffect(() => {
    fetchAll();
    }, []);

  return (
    <>
      <LandingBanner
        bannerData={bannerData}
        loading={loading.banner}
        error={error.banner}
      />
      <LandingAbout />
      <BrowseJournals />
      <LandingRecentPost />
      <LandingResearch />
      <LandingPricing />
      <LandingServices />
      <OurPartner />
    </>
  );
};

export default HomePage;
