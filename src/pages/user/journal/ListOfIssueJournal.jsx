import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BookOpen, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Bell } from "lucide-react";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

const ListOfIssueJournal = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  // State for data
  const [journalData, setJournalData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [selectedYear, setSelectedYear] = useState("all");
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [groupByYear, setGroupByYear] = useState(false);

  // Extract unique years from issues
  const availableYears = useMemo(() => {
    const years = new Set();
    
    issues.forEach(issue => {
      if (issue.from_date) {
        const year = new Date(issue.from_date).getFullYear();
        years.add(year);
      }
    });
    
    return Array.from(years).sort((a, b) => b - a); // Sort descending (latest first)
  }, [issues]);

  // Filter issues based on selected year
  const filteredIssues = useMemo(() => {
    if (selectedYear === "all") {
      return issues;
    }
    
    return issues.filter(issue => {
      if (!issue.from_date) return false;
      const issueYear = new Date(issue.from_date).getFullYear();
      return issueYear === parseInt(selectedYear);
    });
  }, [issues, selectedYear]);

  // Group issues by year for grouped view
  const groupedIssues = useMemo(() => {
    if (!groupByYear) return null;
    
    const grouped = {};
    filteredIssues.forEach(issue => {
      if (issue.from_date) {
        const year = new Date(issue.from_date).getFullYear();
        if (!grouped[year]) {
          grouped[year] = [];
        }
        grouped[year].push(issue);
      }
    });
    
    // Sort years descending
    return Object.keys(grouped)
      .sort((a, b) => b - a)
      .map(year => ({
        year,
        issues: grouped[year]
      }));
  }, [filteredIssues, groupByYear]);

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

  // Fetch journal issues data
  useEffect(() => {
    const fetchJournalIssues = async () => {
      console.log("fetch start::");

      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/all-volume/${id}`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
        console.log(response.data);

        if (response.data.flag === 1) {
          const data = response.data.data;
          setIssues(data);
          setJournalData(response.data.journal);
        } else {
          setError("No issues found for this journal");
        }
      } catch (err) {
        console.error("Error fetching journal issues:", err);
        setError("Failed to load journal issues");
      } finally {
        setLoading(false);
      }
    };

    if (id || token) {
      fetchJournalIssues();
    }
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmitButton = () => {
    if (token) {
      toast.warning("Please sign in as an author to access this feature.");
    } else {
      navigate("/signin");
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    return status === "open" 
      ? "bg-green-100 text-green-800 border border-green-200" 
      : "bg-gray-100 text-gray-600 border border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 sm:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading journal issues...</p>
        </div>
      </div>
    );
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
                  src={`${STORAGE_URL}${journalData?.image}`}
                  alt={journalData?.j_title}
                  className="w-48 h-60 lg:w-56 lg:min-h-80 object-cover rounded-lg shadow-2xl border-4 border-yellow-500"
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
                  {journalData?.j_title}
                </h1>
                <p className="text-lg mb-6 text-yellow-300">
                  Library of Issues - Archive Volumes
                </p>

                {/* Journal Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
                  {journalData?.issn_print && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        ISSN Print
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {journalData?.issn_print_no}
                      </div>
                    </div>
                  )}
                  {journalData?.issn_online && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        ISSN Online
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {journalData?.issn_online_no}
                      </div>
                    </div>
                  )}
                  {journalData?.ugc_approved && (
                    <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                      <div className="font-semibold text-yellow-300 text-sm">
                        UGC Approved
                      </div>
                      <div className="text-yellow-200 text-sm">
                        {journalData?.ugc_no}
                      </div>
                    </div>
                  )}
                  <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-sm">
                      Impact Factor
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData?.impact_factor || "N/A"}
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
                      {journalData?.total_articles || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      Total Citations
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData?.total_citations || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      H-Index
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData?.h_index || "0"}
                    </div>
                  </div>
                  <div className="bg-black bg-opacity-20 rounded-lg p-2 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-xs">
                      Acceptance Rate
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData?.acceptance_rate || "0"}%
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

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <span className="text-lg font-semibold text-gray-800">
                Filter Issues
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Year Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowYearDropdown(!showYearDropdown)}
                  className="flex items-center justify-between gap-3 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[180px]"
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
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowYearDropdown(false)}
                    />
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
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 flex items-center gap-2"
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
              
              {/* Results Count */}
              <div className="flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-700">
                  {filteredIssues.length} {filteredIssues.length === 1 ? "Issue" : "Issues"} Found
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Issues Grid - Grouped View */}
        {groupByYear ? (
          <div className="space-y-12">
            {groupedIssues?.map(({ year, issues: yearIssues }) => (
              <div key={year}>
                {/* Year Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-r from-yellow-500 to-red-700 w-12 h-1 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                    {year}
                  </h2>
                  <div className="bg-gray-200 px-2 py-1 rounded-full text-xs font-semibold text-gray-600">
                    {yearIssues.length} Issues
                  </div>
                </div>
                
                {/* Issues Grid for this Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {yearIssues.map((issue, index) => (
                    <Link
                      key={`${year}-${index}`}
                      to={`/view-archive/${issue.journal_id}/${issue.id}`}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 group"
                    >
                      {/* Issue Cover */}
                      <div className="relative overflow-hidden bg-gradient-to-br from-red-900 to-red-700">
                        <img
                          src={
                            issue.image
                              ? `${STORAGE_URL}${issue.image}`
                              : `${STORAGE_URL}${journalData?.volume_image}`
                          }
                          alt={`Volume ${issue.volume} ${issue.issue_no}`}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Status Badge */}
                        {/* <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(issue.status)}`}>
                          {issue.status === "open" ? "Open" : "Closed"}
                        </div> */}
                      </div>

                      {/* Issue Details */}
                      <div className="p-6">
                        <div className="text-center mb-4">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Volume {issue.volume}, {issue.issue_no}
                          </h3>
                          <div className="text-sm text-gray-600 mb-4">
                            <div className="mb-1">
                              <span className="font-semibold">From:</span>{" "}
                              {formatDate(issue.from_date)}
                            </div>
                            <div>
                              <span className="font-semibold">To:</span>{" "}
                              {formatDate(issue.to_date)}
                            </div>
                          </div>
                          <div className="mt-3 text-center">
                            <div className="font-semibold text-gray-700">Pages</div>
                            <div className="text-lg font-bold text-red-700">
                              {issue.page_no}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Border */}
                      <div className="h-2 bg-gradient-to-r from-yellow-500 to-red-700"></div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Issues Grid - Flat View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredIssues.map((issue, index) => (
              <Link
                key={index}
                to={`/view-archive/${issue.journal_id}/${issue.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Issue Cover */}
                <div className="relative overflow-hidden bg-gradient-to-br from-red-900 to-red-700">
                  <img
                    src={
                      issue.image
                        ? `${STORAGE_URL}${issue.image}`
                        : `${STORAGE_URL}${journalData?.volume_image}`
                    }
                    alt={`Volume ${issue.volume} ${issue.issue_no}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Status Badge */}
                  {/* <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(issue.status)}`}>
                    {issue.status === "open" ? "Open" : "Closed"}
                  </div> */}
                </div>

                {/* Issue Details */}
                <div className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Volume {issue.volume}, {issue.issue_no}
                    </h3>
                    <div className="text-sm text-gray-600 mb-4">
                      <div className="mb-1">
                        <span className="font-semibold">From:</span>{" "}
                        {formatDate(issue.from_date)}
                      </div>
                      <div>
                        <span className="font-semibold">To:</span>{" "}
                        {formatDate(issue.to_date)}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="font-semibold text-gray-700">Pages</div>
                      <div className="text-lg font-bold text-red-700">
                        {issue.page_no}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Border */}
                <div className="h-2 bg-gradient-to-r from-yellow-500 to-red-700"></div>
              </Link>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {filteredIssues.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No Issues Found
            </h3>
            <p className="text-gray-500">
              {selectedYear !== "all" 
                ? `No issues found for the year ${selectedYear}.` 
                : "No journal issues available at the moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOfIssueJournal;