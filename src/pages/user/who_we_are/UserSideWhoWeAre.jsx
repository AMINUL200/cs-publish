import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Calendar, ArrowLeft, Share2, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserSideWhoWeAre = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch page data
  const fetchPageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/who-we-are/${slug}`);
      
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="bg-white rounded-2xl shadow-xl p-8 animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Image Skeleton */}
              <div className="lg:w-2/5">
                <div className="w-full h-80 bg-gray-200 rounded-xl"></div>
              </div>
              
              {/* Text Skeleton */}
              <div className="lg:w-3/5 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Page</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchPageData}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
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
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12 sm:py-26">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-700 hover:text-yellow-600 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold">Back to Previous</span>
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
         
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {pageData.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <span>{formatDate(pageData.created_at)}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Featured Image */}
          {pageData.image && (
            <div className="relative">
              <img
                src={`${STORAGE_URL}${pageData.image}`}
                alt={pageData.title}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
            </div>
          )}

          {/* Content Area */}
          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Content */}
              <div className="lg:w-3/4">
                <article className="prose prose-lg max-w-none">
                  {/* Long Description with Styling */}
                  <div 
                    className="blog-rich-text leading-relaxed space-y-6"
                    dangerouslySetInnerHTML={{ __html: pageData.long_desc }}
                    style={{
                      lineHeight: '1.8',
                      fontSize: '1.125rem',
                    }}
                  />
                </article>

              
              </div>

             
            </div>
          </div>

          {/* Footer Accent */}
          <div className="h-2 bg-gradient-to-r from-yellow-500 via-red-700 to-black"></div>
        </div>

     
      </div>
    </div>
  );
};

export default UserSideWhoWeAre;