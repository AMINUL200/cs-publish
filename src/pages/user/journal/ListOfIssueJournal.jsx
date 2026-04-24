import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BookOpen } from "lucide-react";
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
        console.log(response.data.journal);

        if (response.data.flag === 1) {
          const data = response.data.data;
          setIssues(data);
          console.log("Issues Data:", data);
          // Use first item to get journal info
          // setJournalData({
          //   title: data[0].j_title,
          //   journalImage: data[0].journal_image,
          //   // Add other journal info if available in response
          // });
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
       if(token){
         toast.warning("Please sign in as an author to access this feature.");
   
       }else{
         navigate("/signin");
       }
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
                  src={`${STORAGE_URL}${journalData.image}`}
                  alt={journalData.j_title}
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
                  {journalData.j_title}
                </h1>
                <p className="text-lg mb-6 text-yellow-300">
                  Author Overview - Guidelines for Authors
                </p>

                {/* Journal Details Grid */}
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
                  <div className="bg-black bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <div className="font-semibold text-yellow-300 text-sm">
                      Impact Factor
                    </div>
                    <div className="text-yellow-200 text-sm">
                      {journalData.impact_factor || "N/A"}
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

      {/* Issues Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {issues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {issues.map((issue, index) => (
              <Link
                key={index}
                to={`/view-archive/${issue.journal_id}/${issue.volume_id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Issue Cover */}
                <div className="relative overflow-hidden bg-gradient-to-br from-red-900 to-red-700">
                  <img
                    // src={issue.image || journalData.journalImage}
                    src={
                      issue.image
                        ? `${STORAGE_URL}${issue.image}`
                        : `${STORAGE_URL}${journalData.journalImage}`
                    }
                    alt={`Volume ${issue.volume} ${issue.issue_no}`}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No Issues Found
            </h3>
            <p className="text-gray-500">
              No journal issues available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOfIssueJournal;
