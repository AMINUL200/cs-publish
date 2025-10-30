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
import LandingPublishedJournal from "../../components/LandingComponent/LandingPublishedJournal";
import LandingOurTeam from "../../components/LandingComponent/LandingOurTeam";

const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const [bannerData, setBannerData] = useState([]);
  const [partnerData, setPartnerData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [aboutData, setAboutData] = useState({});
  const [pricingData, setPricingData] = useState([]);
  const [publishedJournalData, setPublishedJournalData] = useState([]);
  const [browsJournalData, setBrowsJournalData] = useState([]);
  const [researchData, setResearchData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [ourTeamData, setOurTeamData] = useState([]);

  const [loading, setLoading] = useState({
    banner: true,
    partner: true,
    blog: true,
    about: true,
    pricing: true,
    publishedJournal: true,
    browsJournal: true,
    research: true,
    service: true,
    team: true,
  });
  const [error, setError] = useState({
    banner: null,
    partner: null,
    blog: null,
    about: null,
    pricing: null,
    publishedJournal: null,
    browsJournal: null,
    research: null,
    service: null,
    team: null,
  });

  const fetchAll = async () => {
    const requests = {
      banner: axios.get(`${API_URL}api/banners`),
      partner: axios.get(`${API_URL}api/partners`),
      blog: axios.get(`${API_URL}api/blog-user`),
      about: axios.get(`${API_URL}api/about`),
      pricing: axios.get(`${API_URL}api/plan`),
      // publishedJournal: axios.get(`${API_URL}api/published-manuscripts-list`),
      browsJournal: axios.get(`${API_URL}api/show-journals`),
      research: axios.get(`${API_URL}api/research`),
      service: axios.get(`${API_URL}api/services`),
      team: axios.get(`${API_URL}api/team`),
    };

    Object.entries(requests).forEach(async ([key, request]) => {
      try {
        const response = await request;
        if (
          response.status === 200 ||
          response.status ||
          response.data.status
        ) {
          if (key === "banner") setBannerData(response.data.data);
          if (key === "partner") setPartnerData(response.data.data);
          if (key === "blog") setBlogData(response.data.data);
          if (key === "about") setAboutData(response.data.data[0]);
          if (key === "pricing") setPricingData(response.data);
          // if (key === "publishedJournal")
          //   setPublishedJournalData(response.data.data);
          if (key === "browsJournal") setBrowsJournalData(response.data.data);
          if (key === "research") setResearchData(response.data.data);
          if (key === "service") setServicesData(response.data.data);
          if (key === "team") setOurTeamData(response.data.data);
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
      <LandingAbout
        aboutData={aboutData}
        loading={loading.about}
        error={error.about}
      />
      <BrowseJournals
        browsJournalData={browsJournalData}
        loading={loading.browsJournal}
        error={error.browsJournal}
      />
      {/* <LandingPublishedJournal
        publishedJournalData={publishedJournalData}
        loading={loading.publishedJournal}
        error={error.publishedJournal}
      /> */}
      <LandingRecentPost
        postData={blogData}
        loading={loading.blog}
        error={error.blog}
      />
      <LandingResearch
        researchInfo={researchData}
        loading={loading.research}
        error={error.research}
      />
      <LandingPricing
        pricingData={pricingData}
        loading={loading.pricing}
        error={error.pricing}
      />
      <LandingServices
        servicesData={servicesData}
        loading={loading.service}
        error={error.service}
      />
      <OurPartner
        partnerData={partnerData}
        loading={loading.partner}
        error={error.partner}
      />
      <LandingOurTeam
        ourTeamData={ourTeamData}
        loading={loading.team}
        error={error.team}
      />
    </>
  );
};

export default HomePage;
