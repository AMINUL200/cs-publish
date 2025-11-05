import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Download,
  FileText,
  Eye,
  Filter,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Bell,
  Send,
  User,
} from "lucide-react";

const DetailsOfCurrentIssue = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  // State management
  const [journalData, setJournalData] = useState(null);
  const [volumeData, setVolumeData] = useState(null);
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAbstract, setExpandedAbstract] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();

  // Fetch current issue details and manuscripts
  useEffect(() => {
    const fetchCurrentIssueDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/current-issue/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.flag === 1 && response.data.data) {
          const data = response.data.data;
          setJournalData(data.journal);
          setVolumeData(data.volume);
          setManuscripts(data.manuscripts || []);
        } else {
          setError("No data found for this current issue");
        }
      } catch (err) {
        console.error("Error fetching current issue details:", err);
        setError("Failed to load current issue details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCurrentIssueDetails();
    }
  }, [id, token, API_URL]);

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
    navigate(`/view-published-manuscript/${mId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 sm:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading current issue details...</p>
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

  if (!journalData || !volumeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 sm:pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-gray-600 mb-2">
            No Data Found
          </h3>
          <p className="text-gray-500">Current issue details not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 sm:pt-24">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-red-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            {/* Left Side - Cover Image */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <img
                  src={volumeData.image}
                  alt={`Volume ${volumeData.volume} ${volumeData.issue_no}`}
                  className="w-48 h-64 object-cover rounded-xl shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 bg-black text-yellow-500 px-3 py-1 rounded-lg font-bold text-sm">
                  Vol {volumeData.volume}
                </div>
              </div>
            </div>

            {/* Center - Issue Details */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {journalData.j_title}
              </h1>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
                <p className="text-white text-lg leading-relaxed">
                  {journalData.j_description || "No description available"}
                </p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-white">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>From: {formatDate(volumeData.from_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>To: {formatDate(volumeData.to_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  <span>{volumeData.page_no}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Issue No: {volumeData.issue_no || "N/A"}</span>
                </div>
              </div>
            </div>

            {/* Right Side - Action Buttons */}
            <div className="flex flex-col gap-4">
              <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Cover
              </button>
              <button className="bg-red-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-red-500 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Get Alerts
              </button>
              <button className="bg-black text-yellow-500 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
                <Send className="w-5 h-5" />
                Submit Manuscript
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Manuscripts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Manuscripts List */}
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

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
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
                          {manuscript.pdf && (
                            <a
                              onClick={() => handleRedirect(manuscript.id)}
                              className="bg-black text-yellow-500 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 flex items-center gap-2 cursor-pointer"
                            >
                              <Download className="w-4 h-4" />
                              Full Text
                            </a>
                          )}
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
                            src={manuscript.image}
                            alt={getCleanTitle(manuscript.title)}
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
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-600 mb-2">
                  No Manuscripts Found
                </h3>
                <p className="text-gray-500">
                  No manuscripts available for this current issue.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsOfCurrentIssue;
