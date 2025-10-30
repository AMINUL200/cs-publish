import React, { useEffect, useState } from "react";
import LandingHeader from "../components/LandingComponent/LandingHeader";
import LandingFooter from "../components/LandingComponent/LandingFooter";
import { Outlet } from "react-router-dom";
import BackToTop from "../components/common/BackToTop";
import LandingSidebar from "../components/LandingComponent/LandingSidebar";
import axios from "axios";
import { toast } from "react-toastify";

const AppLayout2 = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsData, setSettingsData] = useState(null);
  const [aboutData, setAboutData] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [journalList, setJournalList] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // ✅ Fire all requests in parallel
      const [settingsRes, journal] = await Promise.all([
        axios.get(`${API_URL}api/contact-us`),
        axios.get(`${API_URL}api/show-journals`),
        // axios.get(`${API_URL}api/services`)
      ]);

      // ✅ Handle each response
      if (settingsRes.data.flag === 1) setSettingsData(settingsRes.data.data);
      if (journal.data.status) setJournalList(journal.data.data);
      // if (serviceRes.data.flag === 1) setServiceData(serviceRes.data.data);

      // console.log({
      //   settings: settingsRes.data.data,
      //   journal: journal.data.data,
      //   // services: serviceRes.data.data,
      // });
    } catch (error) {
      console.error("Parallel fetch failed:", error);
      toast.error("Failed to load site data!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader
        toggleMenu={toggleSidebar}
        settingsData={settingsData}
        journalList={journalList}
        loading={loading}
      />
      <LandingSidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        settingsData={settingsData}
        journalList={journalList}
      />
      <BackToTop />

      <main className="flex-grow">
        <Outlet context={{ aboutData, serviceData, settingsData, loading }} />
      </main>

      <LandingFooter settingsData={settingsData} loading={loading} />
    </div>
  );
};

export default AppLayout2;
