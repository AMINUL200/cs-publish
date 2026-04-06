import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowLeft, Share2, Target, Eye, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserSideWhoWeAre = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color scheme
  const colors = {
    primary: "#D97706", // Amber-600 (Yellow)
    secondary: "#991B1B", // Red-800 (Red Brown)
    dark: "#1F2937", // Gray-800 (Black)
    light: "#FEF3C7", // Amber-50 (Light Yellow)
    text: "#374151", // Gray-700
    white: "#FFFFFF",
    gradient: "from-yellow-500 via-red-700 to-black"
  };

  // Fetch page data
  const fetchPageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/who-we-are/${slug}`, {
        headers: {
           "Cache-Control": "no-cache",
          Pragma: "no-cache",
        }
      });
      
      if (response.data.status) {
        setPageData(response.data.data);
      } else {
        throw new Error("Failed to fetch page data");
      }
    } catch (error) {
      console.error("Error fetching page data:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchPageData();
    }
  }, [slug]);

  // Function to strip HTML tags for excerpt
  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: pageData?.title,
          text: stripHtmlTags(pageData?.long_desc).substring(0, 100) + '...',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  // Get icon based on category
  const getCategoryIcon = () => {
    switch(pageData?.category?.toLowerCase()) {
      case 'vision':
        return <Eye className="w-8 h-8" />;
      case 'mission':
        return <Target className="w-8 h-8" />;
      default:
        return <Award className="w-8 h-8" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>
          
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>

          {/* Content Skeleton */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden animate-pulse">
            <div className="h-96 bg-gray-200"></div>
            <div className="p-8 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
            <span className="text-4xl text-white">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: colors.dark }}>Error Loading Page</h2>
          <p className="mb-6" style={{ color: colors.text }}>{error}</p>
          <button
            onClick={fetchPageData}
            className="px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <span className="text-4xl text-white">📄</span>
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: colors.dark }}>Page Not Found</h2>
          <p style={{ color: colors.text }}>The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/50 backdrop-blur-sm"
            style={{ color: colors.dark }}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" style={{ color: colors.primary }} />
            <span className="font-medium">Back</span>
          </button>
        </div>

        {/* Hero Section with Image */}
        <div className="relative mb-16">
          {/* Category Badge */}
          <div className="absolute top-6 left-6 z-10">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-lg">
              <div style={{ color: colors.primary }}>{getCategoryIcon()}</div>
              <span className="font-semibold" style={{ color: colors.secondary }}>{pageData.category}</span>
            </div>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform duration-300"
            style={{ color: colors.primary }}
          >
            <Share2 className="w-5 h-5" />
          </button>

          {/* Main Image - Full Width with Gradient Overlay */}
          {pageData.image && (
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={`${STORAGE_URL}${pageData.image}`}
                alt={pageData.title}
                className="w-full h-[500px] md:h-[600px] object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              {/* Title Overlay on Image */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight max-w-4xl">
                  {pageData.title}
                </h1>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{formatDate(pageData.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <div className="sticky top-8 space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.secondary }}>Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium" style={{ color: colors.dark }}>{pageData.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Published</p>
                    <p className="font-medium" style={{ color: colors.dark }}>{formatDate(pageData.created_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="font-medium" style={{ color: colors.dark }}>{formatDate(pageData.updated_at)}</p>
                  </div>
                </div>
              </div>

              {/* Decorative Element */}
              <div className="h-2 rounded-full bg-gradient-to-r" style={{ background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)` }}></div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Content Body */}
              <div className="p-8 md:p-12">
                {/* Title (if no image, show here) */}
                {!pageData.image && (
                  <h1 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: colors.dark }}>
                    {pageData.title}
                  </h1>
                )}

                {/* Long Description */}
                <article className="prose prose-lg max-w-none">
                  <div 
                    className="blog-rich-text leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: pageData.long_desc }}
                    style={{
                      color: colors.text,
                      fontSize: '1.125rem',
                      lineHeight: '1.8',
                    }}
                  />
                </article>

               
              </div>

              {/* Footer Accent */}
              <div className="h-2 bg-gradient-to-r" style={{ background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 50%, ${colors.primary} 100%)` }}></div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default UserSideWhoWeAre;