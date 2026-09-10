import React, { useState, useMemo, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMessage,
  faEye,
  faFilter,
  faSearch,
  faPlus,
  faUserGraduate,
  faChalkboardTeacher,
  faFileAlt,
  faRocket,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import axios from "axios";
import { useSelector } from "react-redux";

const MentorsHubPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // ==========================================
  // HANDLE SUBMIT MENTOR
  // ==========================================
  const handleSubmitMentor = () => {
    if (token) {
      navigate("/submit-mentor");
    } else {
      navigate("/signin", { state: { from: "/submit-mentor" } });
    }
  };

  // ==========================================
  // DETECT MEDIA TYPE FROM URL
  // ==========================================
  const getMediaType = (url) => {
    if (!url) return "image";

    const lowerUrl = url.toLowerCase();

    // YouTube
    if (
      lowerUrl.includes("youtube.com") ||
      lowerUrl.includes("youtu.be") ||
      lowerUrl.includes("youtube-nocookie.com")
    ) {
      return "youtube";
    }

    // Video files
    if (
      lowerUrl.includes(".mp4") ||
      lowerUrl.includes(".webm") ||
      lowerUrl.includes(".ogg") ||
      lowerUrl.includes(".mov")
    ) {
      return "video";
    }

    // Default to image
    return "image";
  };

  // ==========================================
  // EXTRACT YOUTUBE VIDEO ID
  // ==========================================
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // ==========================================
  // GET YOUTUBE THUMBNAIL
  // ==========================================
  const getYoutubeThumbnail = (url) => {
    const videoId = getYoutubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  };

  // ==========================================
  // BUILD MEDIA URL PROPERLY
  // ==========================================
  const getMediaUrl = (imageVideo) => {
    if (!imageVideo) return null;

    // If it's already a full URL (YouTube, external, etc.), use as-is
    if (
      imageVideo.startsWith("http://") ||
      imageVideo.startsWith("https://")
    ) {
      return imageVideo;
    }

    // If it's a /tmp/ path, it's invalid
    if (imageVideo.startsWith("/tmp/")) {
      return null;
    }

    // Otherwise prefix with STORAGE_URL
    return `${STORAGE_URL}${imageVideo}`;
  };

  // Fetch real data from API
  useEffect(() => {
    const fetchMentorsData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/event/latest`, {
          headers: {
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (response.data.status) {
          const latestArticles = response.data.latest || [];
          const mostViewedArticles = response.data.most_view || [];

          const allArticles = [...latestArticles, ...mostViewedArticles];
          const uniqueArticles = allArticles.filter(
            (article, index, self) =>
              index === self.findIndex((a) => a.slug === article.slug)
          );

          const transformedArticles = uniqueArticles.map((article, index) => {
            const mediaType = getMediaType(article.image_video);
            const mediaUrl = getMediaUrl(article.image_video);

            return {
              id: index + 1,
              title: article.title,
              media: {
                type: mediaType,
                url: mediaUrl,
                rawUrl: article.image_video, // Keep raw for YouTube links
                altTag: article.image_alt_tag,
              },
              category: article.catagory,
              views: Math.floor(Math.random() * 2000) + 500,
              comments: Math.floor(Math.random() * 50) + 5,
              excerpt: article.description,
              slug: article.slug,
              created_at: article.created_at,
            };
          });

          setArticles(transformedArticles);
        } else {
          throw new Error("Failed to fetch mentors data");
        }
      } catch (error) {
        console.error("Error fetching mentors data:", error);
        setError(
          error.response?.data?.message || "Failed to load mentors hub data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMentorsData();
    window.scrollTo(0, 0);
  }, []);

  // Get unique categories from articles
  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(articles.map((article) => article.category)),
    ];
    return uniqueCategories.filter(
      (category) => category && category.trim() !== ""
    );
  }, [articles]);

  // Filter articles based on search and categories
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(article.category);

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories, articles]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ==========================================
  // RENDER MEDIA (FIXED SIZE + PROPER HANDLING)
  // ==========================================
  const renderMedia = (article) => {
    const { media } = article;
    const mediaType = media.type;
    const mediaUrl = media.url;

    // No media - show placeholder
    if (!mediaUrl) {
      return (
        <div className="w-full h-48 bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
          <FontAwesomeIcon
            icon={faFileAlt}
            className="w-12 h-12 text-gray-400"
          />
        </div>
      );
    }

    // YouTube video
    if (mediaType === "youtube") {
      const thumbnailUrl = getYoutubeThumbnail(media.rawUrl);
      const embedUrl = getYoutubeVideoId(media.rawUrl)
        ? `https://www.youtube.com/embed/${getYoutubeVideoId(media.rawUrl)}`
        : null;

      return (
        <div className="relative w-full h-48 overflow-hidden group">
          {thumbnailUrl ? (
            <>
              <img
                src={thumbnailUrl}
                alt={media.altTag || article.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x200?text=Video";
                }}
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-50 transition-all pointer-events-none">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* YouTube badge */}
              <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 z-10">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
                YouTube
              </div>
            </>
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <FontAwesomeIcon
                icon={faFileAlt}
                className="w-12 h-12 text-gray-400"
              />
            </div>
          )}
        </div>
      );
    }

    // Video file
    if (mediaType === "video") {
      return (
        <div className="relative w-full h-48 overflow-hidden bg-black">
          <video
            src={mediaUrl}
            className="w-full h-48 object-cover"
            muted
            playsInline
            onMouseOver={(e) => e.target.play()}
            onMouseOut={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
          <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
            Video
          </div>
        </div>
      );
    }

    // Image (default)
    return (
      <div className="relative w-full h-48 overflow-hidden group">
        <img
          src={mediaUrl}
          alt={media.altTag || article.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x200?text=Event+Image";
          }}
        />
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Mentors Hub" },
          ]}
          pageTitle="Mentors Hub"
          pageDescription=""
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Content
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Mentors Hub" },
        ]}
        pageTitle="Mentors Hub"
        pageDescription="Explore our collection of mentor events, workshops, and resources"
      />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center gap-2">
            {/* Search Bar */}
            <div className="relative max-w-2xl text-center flex-1">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
              />
              <input
                type="text"
                placeholder="Search events and articles..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Submit Mentor & Categories */}
            <div
              className={`lg:w-64 ${
                showFilters ? "block" : "hidden lg:block"
              }`}
            >
              <div className="space-y-6">
                {/* ========================================== */}
                {/* SUBMIT MENTOR CARD - Different for login/guest */}
                {/* ========================================== */}
                {token ? (
                  // LOGGED IN USER - Submit Mentor Card
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-md p-6 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FontAwesomeIcon
                        icon={faUserGraduate}
                        className="w-5 h-5 text-yellow-600"
                      />
                      <h3 className="text-lg font-bold text-gray-900">
                        Share Your Expertise
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Are you a mentor or expert? Share your knowledge and
                      inspire others in our community.
                    </p>

                    <div className="space-y-2 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faRocket}
                          className="w-3 h-3 text-yellow-600"
                        />
                        <span>Reach thousands of learners</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faChalkboardTeacher}
                          className="w-3 h-3 text-yellow-600"
                        />
                        <span>Build your mentor profile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          className="w-3 h-3 text-yellow-600"
                        />
                        <span>Share valuable resources</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitMentor}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
                      Submit as Mentor
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-2">
                      Join our growing community of mentors
                    </p>
                  </div>
                ) : (
                  // NOT LOGGED IN - Login Prompt Card
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md p-6 border border-blue-200">
                    <div className="flex items-center gap-2 mb-3">
                      <FontAwesomeIcon
                        icon={faSignInAlt}
                        className="w-5 h-5 text-blue-600"
                      />
                      <h3 className="text-lg font-bold text-gray-900">
                        Want to Become a Mentor?
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">
                      Login to share your expertise, create mentor events, and
                      inspire our community.
                    </p>

                    <div className="space-y-2 mb-4 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faRocket}
                          className="w-3 h-3 text-blue-600"
                        />
                        <span>Reach thousands of learners</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faChalkboardTeacher}
                          className="w-3 h-3 text-blue-600"
                        />
                        <span>Build your mentor profile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          className="w-3 h-3 text-blue-600"
                        />
                        <span>Share valuable resources</span>
                      </div>
                    </div>

                    <button
                      onClick={handleSubmitMentor}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="w-4 h-4" />
                      Please Login to Submit
                    </button>

                    <p className="text-xs text-gray-400 text-center mt-2">
                      New here?{" "}
                      <Link
                        to="/signup"
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Create an account
                      </Link>
                    </p>
                  </div>
                )}

                {/* Categories Section */}
                {categories.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Categories
                    </h3>
                    <div className="space-y-3">
                      {categories.map((category) => (
                        <label
                          key={category}
                          className="flex items-start gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            className="mt-1 w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-5">
                            {category}
                          </span>
                        </label>
                      ))}
                    </div>

                    {selectedCategories.length > 0 && (
                      <button
                        onClick={() => setSelectedCategories([])}
                        className="mt-4 text-sm text-yellow-600 hover:text-yellow-800 font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-blue-600">
                        {articles.length}
                      </p>
                      <p className="text-xs text-gray-600">Total Events</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-green-600">
                        {categories.length}
                      </p>
                      <p className="text-xs text-gray-600">Categories</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Articles Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600">
                  Showing {filteredArticles.length}{" "}
                  {filteredArticles.length === 1 ? "event" : "events"}
                </p>
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        {category}
                        <button
                          onClick={() => handleCategoryChange(category)}
                          className="ml-2 hover:text-yellow-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg">
                  <p className="text-gray-500 text-lg">
                    No events found matching your criteria.
                  </p>
                  <p className="text-gray-400 mt-2">
                    Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group flex flex-col"
                    >
                      {/* Article Media - Fixed Size */}
                      {renderMedia(article)}

                      {/* Article Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                          {article.title}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                          {article.excerpt}
                        </p>

                        {/* Stats and Button */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FontAwesomeIcon
                                icon={faEye}
                                className="w-4 h-4"
                              />
                              <span>{formatNumber(article.views)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FontAwesomeIcon
                                icon={faMessage}
                                className="w-4 h-4"
                              />
                              <span>{article.comments}</span>
                            </div>
                          </div>

                          <Link
                            to={`/mentors/${article.slug}`}
                            className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorsHubPage;