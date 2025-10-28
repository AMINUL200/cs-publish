import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
// import Loader from '../../../components/common/Loader';

const CmsTemplate = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const { slug } = useParams();

  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch content data
  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${API_URL}api/cms-dtl/${slug}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.status) {
        setContent(res.data.data);
      } else {
        setError("Content not found");
        toast.error("Content not found");
      }
    } catch (err) {
      console.error("Error fetching content:", err);
      const errorMsg = err.response?.data?.message || "Error fetching content";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchContent();
    }
  }, [slug]);

  // Extract name and position from title (for team type)
  const getTeamMemberInfo = (title) => {
    const parts = title.split("—");
    if (parts.length === 2) {
      return {
        name: parts[0].trim(),
        position: parts[1].trim(),
      };
    }
    return {
      name: title,
      position: "",
    };
  };

  // Get type-specific styling and icons
  const getTypeConfig = (type) => {
    const configs = {
      research: {
        icon: "🔬",
        color: "yellow",
        gradient: "from-yellow-50 to-cyan-50",
        badgeColor: "bg-yellow-100 text-yellow-800",
      },
      service: {
        icon: "🛠️",
        color: "green",
        gradient: "from-green-50 to-emerald-50",
        badgeColor: "bg-green-100 text-green-800",
      },
      team: {
        icon: "👥",
        color: "purple",
        gradient: "from-purple-50 to-pink-50",
        badgeColor: "bg-purple-100 text-purple-800",
      },
    };
    return configs[type] || configs.research;
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Content Not Found
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            No Content Available
          </h1>
          <p className="text-gray-600">
            The requested content could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const typeConfig = getTypeConfig(content.type);
  const teamInfo =
    content.type === "team" ? getTeamMemberInfo(content.title) : null;

  return (
    <>
   
      <div className="min-h-screen bg-gray-50 pt-30">
        {/* Hero Section */}
        <div className={`bg-gradient-to-br ${typeConfig.gradient} py-16`}>
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                {/* Image */}
                <div className="lg:w-2/5">
                  {content.image ? (
                    <div className="relative">
                      <img
                        src={content.image}
                        alt={teamInfo ? teamInfo.name : content.title}
                        className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
                      />
                      <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-4 shadow-lg">
                        <span className="text-3xl">{typeConfig.icon}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-80 lg:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl shadow-xl flex items-center justify-center">
                      <span className="text-6xl text-gray-400">
                        {typeConfig.icon}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="lg:w-3/5 text-center lg:text-left">
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${typeConfig.badgeColor}`}
                    >
                      {content.type.charAt(0).toUpperCase() +
                        content.type.slice(1)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        content.status === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {content.status === "1" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {teamInfo ? (
                    <>
                      <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
                        {teamInfo.name}
                      </h1>
                      <p className="text-xl lg:text-2xl text-yellow-600 font-semibold mb-6">
                        {teamInfo.position}
                      </p>
                    </>
                  ) : (
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
                      {content.title}
                    </h1>
                  )}

                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {content.short_description}
                  </p>

                  {/* Social Links */}
                  {(content.facebook_link ||
                    content.twitter_link ||
                    content.linkedin_link ||
                    content.instagram_link) && (
                    <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                      {content.facebook_link && (
                        <a
                          href={content.facebook_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-yellow-600 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors shadow-lg"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )}
                      {content.twitter_link && (
                        <a
                          href={content.twitter_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-yellow-400 text-white p-3 rounded-full hover:bg-yellow-500 transition-colors shadow-lg"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </a>
                      )}
                      {content.linkedin_link && (
                        <a
                          href={content.linkedin_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-yellow-700 text-white p-3 rounded-full hover:bg-yellow-800 transition-colors shadow-lg"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                      )}
                      {content.instagram_link && (
                        <a
                          href={content.instagram_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors shadow-lg"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.815 3.73 13.664 3.73 12.367s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Long Description Section */}
        {content.long_description && (
          <div className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    {content.type === "team"
                      ? "About Me"
                      : "Detailed Description"}
                  </h2>
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: content.long_description,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Section */}
        {/* <div className="py-12 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {new Date(content.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">Created Date</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {new Date(content.updated_at).toLocaleDateString()}
                  </div>
                  <div className="text-gray-600">Last Updated</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-2xl font-bold text-gray-800 mb-2">
                    {content.slug}
                  </div>
                  <div className="text-gray-600">URL Slug</div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default CmsTemplate;
