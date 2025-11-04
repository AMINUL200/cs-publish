import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Calendar, Clock, FileText, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CompanyPolicyCmsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch page data based on slug
  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}api/terms-shows/${slug}`);
      
      if (response.data.status) {
        setPageData(response.data.data);
      } else {
        setError("Page not found");
      }
    } catch (err) {
      console.error("Error fetching page data:", err);
      setError("Failed to load page content");
      toast.error("Failed to load page content");
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate reading time
  const calculateReadingTime = (htmlContent) => {
    if (!htmlContent) return 0;
    
    // Remove HTML tags and get plain text
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const wordCount = text.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / 200); // 200 words per minute
    
    return readingTimeMinutes;
  };

  useEffect(() => {
    if (slug) {
      fetchPageData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading page content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Content Available</h2>
          <p className="text-gray-600">The requested page content is not available.</p>
        </div>
      </div>
    );
  }

  const readingTime = calculateReadingTime(pageData.description);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {pageData.page_title}
              </h1>
              
             
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Page Title */}
          {pageData.title && (
            <div className="border-b border-gray-200 px-8 py-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {pageData.title}
              </h2>
            </div>
          )}

          {/* Main Content */}
          <div className="px-8 py-8">
            <div 
              className="blog-rich-text"
              dangerouslySetInnerHTML={{ __html: pageData.description }}
            />
          </div>

         
        </div>

       
      </div>

     
    </div>
  );
};

export default CompanyPolicyCmsPage;