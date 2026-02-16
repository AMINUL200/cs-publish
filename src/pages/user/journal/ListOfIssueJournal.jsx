import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BookOpen } from "lucide-react";

const ListOfIssueJournal = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  console.log("id::",id);
  

  // State for data
  const [journalData, setJournalData] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch journal issues data
  useEffect(() => {
    const fetchJournalIssues = async () => {
      console.log("fetch start::");
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}api/all-volume/${id}`
        );
        console.log(response);
        
        if (response.data.flag === 1 && response.data.data.length > 0) {
          const data = response.data.data;
          setIssues(data);
          console.log("Issues Data:", data);
          // Use first item to get journal info
          setJournalData({
            title: data[0].j_title,
            journalImage: data[0].journal_image,
            // Add other journal info if available in response
          });
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
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Left Side - Page Title */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                 Library of issues
              </h1>
              <div className="flex items-center justify-center lg:justify-start text-white/90">
                <BookOpen className="w-6 h-6 mr-2" />
                <span className="text-lg">Journal Archive Collection</span>
              </div>
            </div>

            {/* Right Side - Journal Info */}
            {journalData && (
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                <img
                  src={`${STORAGE_URL}${journalData.journalImage}`}
                  alt={journalData.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-lg border-2 border-white"
                />
                <div className="text-white text-center sm:text-left">
                  <h3 className="font-bold text-lg mb-1">{journalData.title}</h3>
                  {/* Add other journal information here if available in API response */}
                </div>
              </div>
            )}
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
                    src={issue.image ? `${STORAGE_URL}${issue.image}` : `${STORAGE_URL}${journalData.journalImage}`}
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