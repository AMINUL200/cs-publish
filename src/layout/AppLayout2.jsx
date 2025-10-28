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
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}api/contact-us`);
      if (res.data.flag === 1) {
        setSettingsData(res.data.data);
        console.log(res.data.data);
      }
    } catch (error) {
      console.error("Settings fetch failed:", error);
      toast.error("Failed to load site settings!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <LandingHeader
        toggleMenu={toggleSidebar}
        settingsData={settingsData}
        loading={loading}
      />
      <LandingSidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <BackToTop />

      {/* Main content area that grows to fill available space */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer will always be at the bottom */}
      <LandingFooter settingsData={settingsData} loading={loading} />
    </div>
  );
};

export default AppLayout2;
