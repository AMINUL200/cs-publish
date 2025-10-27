import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PublisherViewPublishedManuscriptList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);

  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch manuscripts on component mount
  useEffect(() => {
    fetchManuscripts();
  }, []);

  const fetchManuscripts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}api/published-manuscripts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        setManuscripts(response.data.data);
        toast.success(
          response.data.message || "Manuscripts fetched successfully!"
        );
      } else {
        throw new Error(response.data.message || "Failed to fetch manuscripts");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (manuscriptId) => {
    if(!manuscriptId) return;
    navigate(`/publisher/published-manuscripts-edit/${manuscriptId}`)
  };
  const handleView = (manuscriptId) => {
    if(!manuscriptId) return;
    navigate(`/publisher/published-manuscripts-view/${manuscriptId}`);
  };

  const handleDelete = async (manuscriptId) => {
    if (window.confirm("Are you sure you want to delete this manuscript?")) {
      try {
        const response = await axios.delete(
          `${API_URL}api/published-manuscripts/${manuscriptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          toast.success(
            response.data.message || "Manuscript deleted successfully!"
          );
          // Remove the deleted manuscript from the list
          setManuscripts(manuscripts.filter((ms) => ms.id !== manuscriptId));
        } else {
          throw new Error(
            response.data.message || "Failed to delete manuscript"
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete manuscript";
        toast.error(errorMessage);
      }
    }
  };

  // Function to safely render HTML content
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

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
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && manuscripts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button
            onClick={fetchManuscripts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Published Manuscripts
        </h1>
        <p className="text-gray-600 mt-2">Manage your published manuscripts</p>
      </div>

      {manuscripts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No published manuscripts found.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manuscripts.map((manuscript) => (
            <div
              key={manuscript.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
            >
              {/* Manuscript Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={manuscript.image}
                  alt={manuscript.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              </div>

              {/* Manuscript Content */}
              <div className="p-6">
                {/* Journal Title */}
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {manuscript.j_title}
                  </span>
                </div>

                {/* Manuscript Title */}
                <h3
                  className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={renderHTML(manuscript.title)}
                />

                {/* Manuscript ID */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium">ID:</span>
                  <span className="ml-1 font-mono">
                    {manuscript.m_unique_id}
                  </span>
                </div>

                {/* Author */}
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium">Author:</span>
                  <span className="ml-1">{manuscript.username}</span>
                </div>

                {/* Published Date */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(manuscript.created_at)}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleView(manuscript.id)}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(manuscript.id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(manuscript.id)}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublisherViewPublishedManuscriptList;
