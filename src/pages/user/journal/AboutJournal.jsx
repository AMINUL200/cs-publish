import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BookOpen,
  Users,
  FileText,
  Award,
  Globe,
  Calendar,
  CheckCircle,
  Eye,
  Download,
  Share2,
  Bell,
  Send,
} from "lucide-react";
import Loader from "../../../components/common/Loader";
import { ArrowLeft } from "lucide-react";
import { ArrowRight } from "lucide-react";
// import Loader from "../../components/common/Loader";

const AboutJournal = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/about_the_journal/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch journal information"
      );
      console.error("Error fetching journal details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  // Navigation items (matching UserSideViewJournal)
  const navItems = [
    {
      label: "About Journal",
      path: `/about-journal/${data?.id}`,
    },
    {
      label: "Scholarly domain",
      path: `/author-overview/${data?.id}`,
    },
    {
      label: "Library of issues",
      path: `/list-of-archive/${data?.id}`,
    },
    {
      label: "Present issue",
      path: `/view-current-issue/${data?.id}`,
    },
    { label: "Quick Press", path: `/quick-press/${data?.id}` },
    {
      label: "Quick Insight (A-Z)",
      path: `/journal-description/${data?.id}`,
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="bg-brown-red text-white px-6 py-2 rounded-lg hover:bg-brown-red-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center text-gray-600">
          Journal information not available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-10 sm:pt-24">
      {/* Header Section - Matching UserSideViewJournal design */}
      <div className="bg-black text-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Right Column - Journal Image */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end order-2 lg:order-3">
              <div className="relative">
                <img
                  src={`${STORAGE_URL}${data.image}`}
                  alt={data.j_title}
                  className="w-48 h-60 lg:w-56 lg:h-86 object-cover rounded-lg shadow-2xl border-4 border-yellow-500"
                />
                <div className="absolute -bottom-3 -right-3 bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold text-xs shadow-lg rotate-3">
                  Journal Cover
                </div>
              </div>
            </div>

            {/* Middle Column - Journal Information */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="text-center lg:text-left">
                <span className="inline-block bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-semibold mb-4">
                  {data.j_categories}
                </span>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-yellow-400">
                  {data.j_title}
                </h1>

                {/* Journal Metadata Grid - Matching UserSideViewJournal */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                  {/* Editor */}
                  <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-sm">
                      Editor
                    </div>
                    <div className="text-yellow-200 text-sm truncate">
                      {data.editor}
                    </div>
                  </div>

                  {/* ISSN Print */}
                  {data.issn_print && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        ISSN Print
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {data.issn_print_no}
                      </div>
                    </div>
                  )}

                  {/* ISSN Online */}
                  {data.issn_online && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        ISSN Online
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {data.issn_online_no}
                      </div>
                    </div>
                  )}

                  {/* UGC Approval */}
                  {data.ugc_approved && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        UGC Approved
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {data.ugc_no}
                      </div>
                    </div>
                  )}

                  {/* Impact Factor - Placeholder */}
                  <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-sm">
                      Impact Factor
                    </div>
                    <div className="text-yellow-200 text-sm">4.56</div>
                  </div>
                </div>

                {/* Action Buttons - Matching UserSideViewJournal style */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link
                    to="/signin"
                    className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    Submit Manuscript
                  </Link>
                  <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 shadow-lg">
                    <Bell className="w-5 h-5" />
                    Get Alerts
                  </button>
                </div>
              </div>
            </div>

            {/* Left Column - Navigation Links */}
            <div className="lg:col-span-3 order-3 lg:order-1">
              <div className="space-y-3">
                {navItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleNavClick(item.path)}
                    className="w-full bg-yellow-500 text-black px-4 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-center"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Journal Description Section */}
      {data.j_description && (
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-amber-50 rounded-xl p-6 border-l-4 border-yellow-500">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="bg-yellow-500 p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-black" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    About {data.j_title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {data.j_description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Journal Content Section */}
      <section className="py-10 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-black to-yellow-300 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-8 w-8 text-yellow-300" />
                    <div>
                      <h2 className="text-2xl font-bold">About the Journal</h2>
                    </div>
                  </div>
                </div>

                {/* About Content */}
                <div className="p-8">
                  <div className="blog-rich-text max-w-none">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.about_the_journal,
                      }}
                      className="text-gray-700 leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutJournal;