import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  BookOpen,
  Users,
  FileText,
  Award,
  Mail,
  Globe,
  Bell,
  Send,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";

const JournalAuthorInformation = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  // Navigation items (matching QuickPress component)
  const navItems = [
    {
      label: "About Journal",
      path: `/about-journal/${id}`,
    },
    {
      label: "Scholarly domain",
      path: `/author-overview/${id}`,
    },
    {
      label: "Library of issues",
      path: `/list-of-archive/${id}`,
    },
    {
      label: "Present issue",
      path: `/view-current-issue/${id}`,
    },
    { label: "Quick Press", path: `/quick-press/${id}` },
    {
      label: "Quick Insight (A-Z)",
      path: `/journal-description/${id}`,
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  const handleViewEditor = (edId) => {
    navigate(`/editor-info/${edId}`);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/journal/author_guide/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setData(response.data.data);
        console.log("Author Guide Data:", response.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch author information",
      );
      console.error("Error fetching author guide:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitButton = () => {
    toast.warning("Please sign in as an author to access this feature.");
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button
            onClick={fetchData}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-600">
          No author information available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 sm:pt-24">
      {/* Header Section - Matching QuickPress design */}
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
                <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-yellow-400">
                  {data.j_title}
                </h1>
                <p className="text-lg mb-6 text-yellow-300">
                  Author Overview - Guidelines for Authors
                </p>

                {/* Journal Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
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
                  <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-sm">
                      Impact Factor
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {data.impact_factor || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Journal Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      Total Articles
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {data.total_articles || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      Total Citations
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {data.total_citations || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      H-Index
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {data.h_index || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      Acceptance Rate
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {data.acceptance_rate || "0"}%
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 shadow-lg">
                    <Bell className="w-5 h-5" />
                    Get Alerts
                  </button>
                  <button 
                  onClick={handleSubmitButton}
                  className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 shadow-lg">
                    <Send className="w-5 h-5" />
                    Submit Manuscript
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
                {/* {data.editor && (
                  <button
                    onClick={() => handleViewEditor(data.editor)}
                    className="w-full bg-yellow-500 text-black px-4 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-center flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Editor Information
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author Guide Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-black to-yellow-500 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-yellow-300" />
                    <div>
                      <h2 className="text-2xl font-bold">Author Overview</h2>
                      <p className="text-yellow-200 text-sm">
                        Guidelines and information for authors
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* About the Journal Section */}
                  {data.about_the_journal && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5 text-yellow-500" />
                        About the Journal
                      </h3>
                      <div
                        className="prose max-w-none text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-200"
                        dangerouslySetInnerHTML={{
                          __html: data.about_the_journal,
                        }}
                      />
                    </div>
                  )}

                  {/* Author Guide Section */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-yellow-500" />
                      Author Guidelines
                    </h3>
                    <div
                      className="prose max-w-none text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg border border-gray-200"
                      dangerouslySetInnerHTML={{ __html: data.author_guide }}
                    />
                  </div>

                  {/* Editorial Information */}
                  {(data.editor || data.editorial_board) && (
                    <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-black bg-opacity-5 rounded-lg border border-yellow-200">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        Editorial Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.editor && (
                          <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-yellow-500 mt-1" />
                            <div>
                              <p className="font-semibold text-gray-700">
                                Editor
                              </p>
                              <p className="text-gray-600">{data.editor}</p>
                            </div>
                          </div>
                        )}
                        {data.editorial_board && (
                          <div className="flex items-start gap-3">
                            <Award className="w-5 h-5 text-yellow-500 mt-1" />
                            <div>
                              <p className="font-semibold text-gray-700">
                                Editorial Board
                              </p>
                              <p className="text-gray-600">
                                {data.editorial_board}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JournalAuthorInformation;
