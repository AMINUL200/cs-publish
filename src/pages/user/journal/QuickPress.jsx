import axios from "axios";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import { Download, Bell, Send, User, FileText, BookOpen, Calendar, ChevronDown, ChevronUp, Layers, Eye } from "lucide-react";
import { toast } from "react-toastify";

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
  
  // Filter states
  const [selectedYear, setSelectedYear] = useState("all");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [groupByYear, setGroupByYear] = useState(false);
  
  const navigate = useNavigate();

  // Extract unique years from volumes
  const availableYears = useMemo(() => {
    const years = new Set();
    volumes.forEach(volume => {
      if (volume.volume.from_date) {
        const year = new Date(volume.volume.from_date).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [volumes]);

  // Filter volumes based on selected year
  const filteredVolumes = useMemo(() => {
    if (selectedYear === "all") {
      return volumes;
    }
    return volumes.filter(volume => {
      if (!volume.volume.from_date) return false;
      const volumeYear = new Date(volume.volume.from_date).getFullYear();
      return volumeYear === parseInt(selectedYear);
    });
  }, [volumes, selectedYear]);

  // Group volumes by year for grouped view
  const groupedVolumes = useMemo(() => {
    if (!groupByYear) return null;
    
    const grouped = {};
    filteredVolumes.forEach(volume => {
      if (volume.volume.from_date) {
        const year = new Date(volume.volume.from_date).getFullYear();
        if (!grouped[year]) {
          grouped[year] = [];
        }
        grouped[year].push(volume);
      }
    });
    
    return Object.keys(grouped)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        volumes: grouped[year]
      }));
  }, [filteredVolumes, groupByYear]);

  // Fetch journal data and volumes
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

          // Set current issue data (for info only)
          if (data.current_issue) {
            setCurrentIssueData(data.current_issue);
          }

          // Set volumes data
          if (data.volumes && data.volumes.length > 0) {
            setVolumes(data.volumes);
            // Auto-select the first volume and show its manuscripts
            setSelectedVolume(data.volumes[0]);
            setManuscripts(data.volumes[0].manuscripts || []);
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

  // Handle volume click - show manuscripts for selected volume
  const handleVolumeClick = (volume) => {
    setSelectedVolume(volume);
    setManuscripts(volume.manuscripts || []);
    setExpandedAbstract(null); // Close any open abstract
  };

  const toggleAbstract = (id) => {
    setExpandedAbstract(expandedAbstract === id ? null : id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatShortDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  const getCleanTitle = (title) => {
    if (!title) return "No Title";
    const cleanTitle = stripHtmlTags(title);
    return cleanTitle.length > 150
      ? cleanTitle.substring(0, 150) + "..."
      : cleanTitle;
  };

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

  const getStatusBadge = (status) => {
    return status === "open" 
      ? "bg-green-100 text-green-800 border border-green-200" 
      : "bg-gray-100 text-gray-600 border border-gray-200";
  };

  const navItems = [
    { label: "About Journal", path: `/about-journal/${journalData?.id}` },
    { label: "Scholarly domain", path: `/author-overview/${journalData?.id}` },
    { label: "Library of issues", path: `/list-of-archive/${journalData?.id}` },
    { label: "Present issue", path: `/view-current-issue/${journalData?.id}` },
    { label: "Quick Press", path: `/quick-press/${journalData?.id}` },
    { label: "Quick Insight (A-Z)", path: `/journal-description/${journalData?.id}` },
  ];

  const handleNavClick = (path) => {
    navigate(path);
  };

  if (loading) return <Loader />;
  
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
          <h3 className="text-2xl font-bold text-gray-600 mb-2">No Data Found</h3>
          <p className="text-gray-500">Quick Press details not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 sm:pt-24">
      {/* Header Section */}
      <div className="bg-black text-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Right Column - Journal Image */}
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
                  Quick Press - Archive Volumes
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                  {journalData.issn_print && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">ISSN Print</div>
                      <div className="text-yellow-200 text-sm">{journalData.issn_print_no}</div>
                    </div>
                  )}
                  {journalData.issn_online && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">ISSN Online</div>
                      <div className="text-yellow-200 text-sm">{journalData.issn_online_no}</div>
                    </div>
                  )}
                  {journalData.ugc_approved && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">UGC Approved</div>
                      <div className="text-yellow-200 text-sm">{journalData.ugc_no}</div>
                    </div>
                  )}
                  <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-sm">Impact Factor</div>
                    <div className="text-yellow-200 text-sm">{journalData?.impact_factor || "N/A"}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">Total Articles</div>
                    <div className="text-yellow-200 text-sm">{journalData.total_articles || "0"}</div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">Total Citations</div>
                    <div className="text-yellow-200 text-sm">{journalData.total_citations || "0"}</div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">H-Index</div>
                    <div className="text-yellow-200 text-sm">{journalData.h_index || "0"}</div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">Acceptance Rate</div>
                    <div className="text-yellow-200 text-sm">{journalData.acceptance_rate || "0"}%</div>
                  </div>
                </div>

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

      {/* Current Issue Info Banner (Optional) */}
      {currentIssueData && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-gray-700">
                  Current Issue: Volume {currentIssueData.volume.volume}, {currentIssueData.volume.issue_no}
                </span>
                <span className="text-sm text-gray-500">
                  ({formatDate(currentIssueData.volume.from_date)} - {formatDate(currentIssueData.volume.to_date)})
                </span>
              </div>
              <div className="text-sm text-blue-600">
                {currentIssueData.total_manuscripts || 0} Articles in Current Issue
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-white rounded-xl p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-semibold text-gray-800">Archive Volumes</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-semibold text-gray-600">
                  {filteredVolumes.length} Volumes
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Year Filter Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowYearDropdown(!showYearDropdown)}
                    className="flex items-center justify-between gap-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[160px]"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">
                        {selectedYear === "all" ? "All Years" : `Year: ${selectedYear}`}
                      </span>
                    </div>
                    {showYearDropdown ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                  
                  {showYearDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowYearDropdown(false)} />
                      <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
                        <button
                          onClick={() => {
                            setSelectedYear("all");
                            setShowYearDropdown(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                            selectedYear === "all" ? "bg-yellow-50 text-yellow-700 font-medium" : "text-gray-700"
                          }`}
                        >
                          All Years
                        </button>
                        {availableYears.map(year => (
                          <button
                            key={year}
                            onClick={() => {
                              setSelectedYear(year.toString());
                              setShowYearDropdown(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                              selectedYear === year.toString() ? "bg-yellow-50 text-yellow-700 font-medium" : "text-gray-700"
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                
                {/* Group Toggle Button */}
                <button
                  onClick={() => setGroupByYear(!groupByYear)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 flex items-center gap-2"
                >
                  {groupByYear ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Ungroup</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>Group by Year</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Volumes Grid - Grouped View */}
          {groupByYear ? (
            <div className="p-6 space-y-12">
              {groupedVolumes?.map(({ year, volumes: yearVolumes }) => (
                <div key={year}>
                  {/* Year Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-yellow-500 to-red-700 w-12 h-1 rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Calendar className="w-6 h-6 text-yellow-600" />
                      {year}
                    </h2>
                    <div className="bg-gray-200 px-2 py-1 rounded-full text-xs font-semibold text-gray-600">
                      {yearVolumes.length} Volumes
                    </div>
                  </div>
                  
                  {/* Volumes Grid for this Year */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {yearVolumes.map((volumeData) => (
                      <div
                        key={volumeData.volume.id}
                        onClick={() => handleVolumeClick(volumeData)}
                        className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                          selectedVolume?.volume.id === volumeData.volume.id
                            ? "ring-2 ring-yellow-500 shadow-xl"
                            : "hover:shadow-lg"
                        }`}
                      >
                        <div className="bg-white rounded-xl overflow-hidden border border-gray-200 h-full group">
                          {/* Volume Cover */}
                          <div className="relative overflow-hidden bg-gradient-to-br from-red-900 to-red-700 h-48">
                            {volumeData.volume.image ? (
                              <img
                                src={`${STORAGE_URL}${volumeData.volume.image}`}
                                alt={`Volume ${volumeData.volume.volume}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Layers className="w-16 h-16 text-white opacity-50" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold bg-white bg-opacity-90">
                              {volumeData.total_manuscripts} Articles
                            </div>
                          </div>

                          {/* Volume Details */}
                          <div className="p-5">
                            <div className="text-center mb-3">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                Volume {volumeData.volume.volume}
                              </h3>
                              <p className="text-sm text-yellow-600 font-semibold mb-2">
                                {volumeData.volume.issue_no}
                              </p>
                              <div className="text-xs text-gray-500 mb-3">
                                📅 {formatShortDate(volumeData.volume.from_date)} - {formatShortDate(volumeData.volume.to_date)}
                              </div>
                              {volumeData.volume.page_no && (
                                <div className="text-sm text-gray-600">
                                  <span className="font-semibold">Pages:</span> {volumeData.volume.page_no}
                                </div>
                              )}
                            </div>
                            
                            <div className={`inline-block w-full text-center px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusBadge(volumeData.volume.status)}`}>
                              {volumeData.volume.status === "open" ? "Open Issue" : "Closed Issue"}
                            </div>

                            {selectedVolume?.volume.id === volumeData.volume.id && (
                              <div className="mt-3 text-yellow-600 text-xs font-semibold flex items-center justify-center gap-1">
                                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                Currently Selected
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Volumes Grid - Flat View */
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredVolumes.map((volumeData) => (
                  <div
                    key={volumeData.volume.id}
                    onClick={() => handleVolumeClick(volumeData)}
                    className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedVolume?.volume.id === volumeData.volume.id
                        ? "ring-2 ring-yellow-500 shadow-xl"
                        : "hover:shadow-lg"
                    }`}
                  >
                    <div className="bg-white rounded-xl overflow-hidden border border-gray-200 h-full group">
                      {/* Volume Cover */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-red-900 to-red-700 h-48">
                        {volumeData.volume.image ? (
                          <img
                            src={`${STORAGE_URL}${volumeData.volume.image}`}
                            alt={`Volume ${volumeData.volume.volume}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Layers className="w-16 h-16 text-white opacity-50" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold bg-white bg-opacity-90">
                          {volumeData.total_manuscripts} Articles
                        </div>
                      </div>

                      {/* Volume Details */}
                      <div className="p-5">
                        <div className="text-center mb-3">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Volume {volumeData.volume.volume}
                          </h3>
                          <p className="text-sm text-yellow-600 font-semibold mb-2">
                            {volumeData.volume.issue_no}
                          </p>
                          <div className="text-xs text-gray-500 mb-3">
                            📅 {formatShortDate(volumeData.volume.from_date)} - {formatShortDate(volumeData.volume.to_date)}
                          </div>
                          {volumeData.volume.page_no && (
                            <div className="text-sm text-gray-600">
                              <span className="font-semibold">Pages:</span> {volumeData.volume.page_no}
                            </div>
                          )}
                        </div>
                        
                        <div className={`inline-block w-full text-center px-3 py-1.5 rounded-lg text-xs font-medium ${getStatusBadge(volumeData.volume.status)}`}>
                          {volumeData.volume.status === "open" ? "Open Issue" : "Closed Issue"}
                        </div>

                        {selectedVolume?.volume.id === volumeData.volume.id && (
                          <div className="mt-3 text-yellow-600 text-xs font-semibold flex items-center justify-center gap-1">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            Currently Selected
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Message */}
          {filteredVolumes.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Volumes Found</h3>
              <p className="text-gray-500">
                {selectedYear !== "all" 
                  ? `No volumes found for the year ${selectedYear}.` 
                  : "No archive volumes available for this journal."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Manuscripts Section - Only shown when a volume is selected */}
      {selectedVolume && manuscripts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-yellow-200">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-yellow-600" />
                  <h2 className="text-xl font-bold text-gray-800">
                    Articles from Volume {selectedVolume.volume.volume}, {selectedVolume.volume.issue_no}
                  </h2>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  {manuscripts.length} {manuscripts.length === 1 ? "Article" : "Articles"} Found
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-8">
                {manuscripts.map((manuscript) => (
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

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{manuscript.username || "Unknown Author"}</span>
                            </div>
                            {manuscript.affiliation && (
                              <div className="text-sm text-gray-500">
                                {manuscript.affiliation}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span>ID: {manuscript.m_unique_id}</span>
                            </div>
                          </div>

                          <p className="text-gray-700 mb-5 leading-relaxed">
                            {getShortDescription(manuscript.abstract)}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => toggleAbstract(manuscript.id)}
                              className="bg-yellow-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-black hover:text-yellow-500 transition-all duration-300 flex items-center gap-2"
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
                                className="bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-black hover:text-red-500 transition-all duration-300 flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                PDF
                              </a>
                            )}
                            <button
                              onClick={() => handleRedirect(manuscript.id)}
                              className="bg-black text-yellow-500 px-5 py-2.5 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center gap-2"
                            >
                              <Download className="w-4 h-4" />
                              Full Text
                            </button>
                          </div>

                          {/* Abstract Section */}
                          {expandedAbstract === manuscript.id && (
                            <div className="mt-5 p-5 bg-gray-50 rounded-lg border border-gray-200">
                              <h4 className="font-semibold text-gray-900 mb-3 text-lg">Abstract</h4>
                              <div
                                className="text-gray-700 leading-relaxed prose max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: manuscript.abstract || "No abstract available.",
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
                    <div className="h-1 bg-gradient-to-r from-yellow-500 to-red-700"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message when volume has no manuscripts */}
      {selectedVolume && manuscripts.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 px-6 py-4 border-b border-yellow-200">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-yellow-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  Articles from Volume {selectedVolume.volume.volume}, {selectedVolume.volume.issue_no}
                </h2>
              </div>
            </div>
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-gray-600 mb-2">No Manuscripts Found</h3>
              <p className="text-gray-500">
                No manuscripts available for this volume.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickPress;