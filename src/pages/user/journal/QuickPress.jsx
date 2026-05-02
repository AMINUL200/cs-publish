import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import { Download } from "lucide-react";
import { Bell } from "lucide-react";
import { Send } from "lucide-react";
import { User } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { FileText } from "lucide-react";
import { BookOpen, Layers } from "lucide-react";
import { toast } from "react-toastify";
import { ChevronLeft } from "lucide-react";
import { ChevronRight } from "lucide-react";

const QuickPress = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [journalData, setJournalData] = useState(null);
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAbstract, setExpandedAbstract] = useState(null);
  const [volumes, setVolumes] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState(null);
  const [currentIssueData, setCurrentIssueData] = useState(null);
  const [activeTab, setActiveTab] = useState("current"); // 'current' or 'archive'
  const navigate = useNavigate();

  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = useRef(null);

  // Check scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll function
  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [volumes]);

  // Fetch current issue details and manuscripts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}api/article/quick-press/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          },
        );

        if (response.data.status) {
          const data = response.data;
          console.log(data);

          setJournalData(data.journal);

          // Set current issue data
          if (data.current_issue) {
            setCurrentIssueData(data.current_issue);
            setManuscripts(data.current_issue.manuscripts || []);
          }

          // Set volumes data
          if (data.volumes && data.volumes.length > 0) {
            setVolumes(data.volumes);
            // Set default selected volume to first volume
            setSelectedVolume(data.volumes[0]);
          }
        } else {
          setError("No data found for this Quick Press");
        }
      } catch (err) {
        console.error("Error fetching Quick Press details:", err);
        setError("Failed to load Quick Press details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, token, API_URL]);

  // Handle volume change
  const handleVolumeClick = (volume) => {
    setSelectedVolume(volume);
    setActiveTab("archive");
    setManuscripts(volume.manuscripts || []);
    setExpandedAbstract(null); // Close any open abstract
  };

  // Handle current issue tab click
  const handleCurrentIssueClick = () => {
    setActiveTab("current");
    setManuscripts(currentIssueData?.manuscripts || []);
    setExpandedAbstract(null);
  };

  // Toggle abstract visibility
  const toggleAbstract = (id) => {
    setExpandedAbstract(expandedAbstract === id ? null : id);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Remove HTML tags from text
  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  // Get title text without HTML
  const getCleanTitle = (title) => {
    if (!title) return "No Title";
    const cleanTitle = stripHtmlTags(title);
    return cleanTitle.length > 150
      ? cleanTitle.substring(0, 150) + "..."
      : cleanTitle;
  };

  // Get short description from abstract
  const getShortDescription = (abstract) => {
    if (!abstract) return "No description available";
    const cleanAbstract = stripHtmlTags(abstract);
    return cleanAbstract.length > 200
      ? cleanAbstract.substring(0, 200) + "..."
      : cleanAbstract;
  };

  const handleRedirect = (mId) => {
    if (!mId) return;
    try {
      axios.post(
        `${API_URL}api/subscription/increase-view/${mId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      navigate(`/view-published-manuscript/${mId}`);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSubmitButton = () => {
    if (token) {
      toast.warning("Please sign in as an author to access this feature.");
    } else {
      navigate("/signin");
    }
  };

  // Navigation items (matching UserSideViewJournal)
  const navItems = [
    {
      label: "About Journal",
      path: `/about-journal/${journalData?.id}`,
    },
    {
      label: "Scholarly domain",
      path: `/author-overview/${journalData?.id}`,
    },
    {
      label: "Library of issues",
      path: `/list-of-archive/${journalData?.id}`,
    },
    {
      label: "Present issue",
      path: `/view-current-issue/${journalData?.id}`,
    },
    { label: "Quick Press", path: `/quick-press/${journalData?.id}` },
    {
      label: "Quick Insight (A-Z)",
      path: `/journal-description/${journalData?.id}`,
    },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  if (loading) {
    return <Loader />;
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 sm:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">Error</h3>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!journalData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 sm:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            No Data Found
          </h3>
          <p className="text-gray-500">Quick Press details not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10 sm:pt-24">
      {/* Header Section - Matching UserSideViewJournal design */}
      <div className="bg-black text-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Right Column - Journal Image (moved to right in original) */}
            <div className="lg:col-span-3 flex justify-center lg:justify-end order-2 lg:order-3">
              <div className="relative">
                <img
                  src={`${STORAGE_URL}${journalData.image}`}
                  alt={journalData.j_title}
                  className="w-48 h-60 lg:w-56 lg:h-80 object-cover rounded-lg shadow-2xl border-4 border-yellow-500"
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
                  {journalData.j_title}
                </h1>
                <p className="text-lg mb-6 text-yellow-300">
                  Quick Press - Latest Articles
                </p>

                {/* Journal Details Grid - Matching UserSideViewJournal */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                  {journalData.issn_print && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        ISSN Print
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {journalData.issn_print_no}
                      </div>
                    </div>
                  )}
                  {journalData.issn_online && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        ISSN Online
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {journalData.issn_online_no}
                      </div>
                    </div>
                  )}
                  {journalData.ugc_approved && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        UGC Approved
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {journalData.ugc_no}
                      </div>
                    </div>
                  )}
                  {journalData.impact_factor && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        Impact Factor
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {journalData?.impact_factor || "456"}
                      </div>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      Total Articles
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData.total_articles || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      Total Citations
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData.total_citations || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      H-Index
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData.h_index || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      Acceptance Rate
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData.acceptance_rate || "0"}%
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Matching UserSideViewJournal style but keeping original functionality */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 shadow-lg">
                    <Bell className="w-5 h-5" />
                    Get Alerts
                  </button>
                  <button
                    onClick={handleSubmitButton}
                    className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                    Submit Manuscript
                  </button>
                </div>
              </div>
            </div>

            {/* Left Column - Navigation Links (matching UserSideViewJournal) */}
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

      {/* Volume Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap">
              {/* Current Issue Tab */}
              <button
                onClick={handleCurrentIssueClick}
                className={`px-6 py-4 text-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                  activeTab === "current"
                    ? "bg-yellow-500 text-black border-b-2 border-yellow-600"
                    : "text-gray-600 hover:text-yellow-500 hover:bg-gray-50"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                Current Issue
                {currentIssueData?.total_manuscripts > 0 && (
                  <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {currentIssueData.total_manuscripts}
                  </span>
                )}
              </button>

              {/* Archive Volumes Section with Horizontal Scroll and Navigation Buttons */}
              <div className="px-4 py-2">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-600 font-medium">
                      Archive Volumes:
                    </span>
                  </div>

                  {/* Scroll Navigation Buttons */}
                  <div className="flex gap-2">
                    {showLeftScroll && (
                      <button
                        onClick={() => scroll("left")}
                        className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Scroll left"
                      >
                        <ChevronLeft className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                    {showRightScroll && (
                      <button
                        onClick={() => scroll("right")}
                        className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Scroll right"
                      >
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                  style={{ scrollbarWidth: "thin" }}
                >
                  <div className="flex gap-3 pb-2 min-w-max">
                    {volumes.map((volume) => (
                      <button
                        key={volume.volume.id}
                        onClick={() => handleVolumeClick(volume)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${
                          activeTab === "archive" &&
                          selectedVolume?.volume.id === volume.volume.id
                            ? "bg-yellow-500 text-black shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-yellow-100 hover:text-yellow-700"
                        }`}
                      >
                        Vol. {volume.volume.volume}, {volume.volume.issue_no}
                        {volume.total_manuscripts > 0 && (
                          <span className="ml-2 text-xs font-normal">
                            ({volume.total_manuscripts})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Volume Info Bar */}
          {activeTab === "archive" && selectedVolume && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-3 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Volume {selectedVolume.volume.volume}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Issue: {selectedVolume.volume.issue_no}
                  </div>
                  <div className="text-sm text-gray-600">
                    Pages: {selectedVolume.volume.page_no}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Published: {formatDate(selectedVolume.volume.from_date)} -{" "}
                  {formatDate(selectedVolume.volume.to_date)}
                </div>
              </div>
            </div>
          )}

          {/* Current Issue Info Bar */}
          {activeTab === "current" && currentIssueData && (
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-3 border-b border-yellow-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Volume {currentIssueData.volume.volume}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Issue: {currentIssueData.volume.issue_no}
                  </div>
                  <div className="text-sm text-gray-600">
                    Pages: {currentIssueData.volume.page_no}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Current Issue Open:{" "}
                  {formatDate(currentIssueData.volume.from_date)} -{" "}
                  {formatDate(currentIssueData.volume.to_date)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Manuscripts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          <div className="space-y-12">
            {manuscripts.length > 0 ? (
              manuscripts.map((manuscript) => (
                <div
                  key={manuscript.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Manuscript Content */}
                      <div className="flex-1">
                        <h3
                          onClick={() => handleRedirect(manuscript.id)}
                          className="text-xl font-bold text-gray-900 mb-3 leading-tight hover:text-yellow-500 hover:underline cursor-pointer"
                        >
                          {getCleanTitle(manuscript.title)}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>
                              {manuscript.username || "Unknown Author"}
                            </span>
                          </div>
                          {manuscript.affiliation && (
                            <div className="text-sm text-gray-500">
                              {manuscript.affiliation}
                            </div>
                          )}
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {getShortDescription(manuscript.abstract)}
                        </p>

                        {/* Manuscript ID */}
                        <div className="text-sm text-gray-600 mb-4">
                          <span className="font-semibold">Manuscript ID:</span>{" "}
                          {manuscript.m_unique_id}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => toggleAbstract(manuscript.id)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-yellow-500 transition-all duration-300 flex items-center gap-2"
                          >
                            {expandedAbstract === manuscript.id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                            Abstract
                          </button>
                          {manuscript.pdf && (
                            <a
                              href={manuscript.pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-red-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-black hover:text-red-500 transition-all duration-300 flex items-center gap-2"
                            >
                              <FileText className="w-4 h-4" />
                              PDF
                            </a>
                          )}

                          <a
                            onClick={() => handleRedirect(manuscript.id)}
                            className="bg-black text-yellow-500 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer"
                          >
                            <Download className="w-4 h-4" />
                            Full Text
                          </a>
                        </div>

                        {/* Abstract Section */}
                        {expandedAbstract === manuscript.id && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Abstract
                            </h4>
                            <div
                              className="text-gray-700 leading-relaxed prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html:
                                  manuscript.abstract ||
                                  "No abstract available.",
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Manuscript Image */}
                      {manuscript.image && (
                        <div className="flex-shrink-0">
                          <img
                            src={`${STORAGE_URL}${manuscript.image}`}
                            alt={getCleanTitle(manuscript.title)}
                            loading="lazy"
                            className="w-40 h-28 object-cover rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Border */}
                  <div className="h-1 bg-gradient-to-r from-yellow-500 to-red-700"></div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white rounded-xl shadow-md">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-2">
                  No Manuscripts Found
                </h3>
                <p className="text-gray-500">
                  {activeTab === "current"
                    ? "No manuscripts available for the current issue."
                    : "No manuscripts available for this volume."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPress;
