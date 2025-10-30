import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Breadcrumb from "../../../components/common/Breadcrumb";

const TermsAndCondition = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [termsData, setTermsData] = useState({
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch terms and conditions data
  const fetchTermsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}api/terms-shows/terms-condition`);
      
      if (response.data.status && response.data.data) {
        setTermsData({
          title: response.data.data.title || "Terms and Conditions",
          description: response.data.data.description || ""
        });
      } else {
        setError("No terms and conditions found");
        toast.info("No terms and conditions available at the moment");
      }
    } catch (error) {
      console.error("Error fetching terms data:", error);
      setError("Failed to load terms and conditions");
      toast.error("Failed to load terms and conditions");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchTermsData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Terms And Condition" },
          ]}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading terms and conditions...</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error && !termsData.description) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Terms And Condition" },
          ]}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Terms & Conditions Not Available</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchTermsData}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Try Again
              </button>
            </div>
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
          { label: "Terms And Condition" },
        ]}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {termsData.title}
            </h1>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>

         

          {/* Terms Content with Enhanced Styling */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              {termsData.description ? (
                <div 
                  className="terms-content"
                  dangerouslySetInnerHTML={{ __html: termsData.description }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📄</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Content Available
                  </h3>
                  <p className="text-gray-500">
                    The terms and conditions content is currently being prepared.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Styles for Rich Text Content */}
      <style jsx>{`
        .terms-content {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.7;
          color: #374151;
          font-size: 16px;
        }

        /* Headings */
        .terms-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 2rem 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .terms-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 1.5rem 0 1rem 0;
        }

        .terms-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 1.25rem 0 0.75rem 0;
        }

        .terms-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #4b5563;
          margin: 1rem 0 0.5rem 0;
        }

        /* Paragraphs */
        .terms-content p {
          margin: 1rem 0;
          text-align: justify;
        }

        /* Links */
        .terms-content a {
          color: #2563eb;
          text-decoration: underline;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .terms-content a:hover {
          color: #1d4ed8;
          text-decoration: none;
        }

        .terms-content a:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* Lists */
        .terms-content ul, 
        .terms-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .terms-content ul {
          list-style-type: disc;
        }

        .terms-content ol {
          list-style-type: decimal;
        }

        .terms-content li {
          margin: 0.5rem 0;
          padding-left: 0.5rem;
        }

        .terms-content ul ul,
        .terms-content ol ol,
        .terms-content ul ol,
        .terms-content ol ul {
          margin: 0.5rem 0;
        }

        .terms-content ul ul {
          list-style-type: circle;
        }

        .terms-content ul ul ul {
          list-style-type: square;
        }

        /* Strong and Emphasis */
        .terms-content strong {
          font-weight: 700;
          color: #111827;
        }

        .terms-content em {
          font-style: italic;
          color: #4b5563;
        }

        /* Blockquotes */
        .terms-content blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f9fafb;
          padding: 1rem 1rem 1rem 1.5rem;
          border-radius: 0 0.375rem 0.375rem 0;
        }

        /* Code */
        .terms-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }

        .terms-content pre {
          background-color: #1f2937;
          color: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .terms-content pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
        }

        /* Tables */
        .terms-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.875rem;
        }

        .terms-content th,
        .terms-content td {
          border: 1px solid #d1d5db;
          padding: 0.75rem;
          text-align: left;
        }

        .terms-content th {
          background-color: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .terms-content tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .terms-content tr:hover {
          background-color: #f3f4f6;
        }

        /* Images */
        .terms-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem auto;
          display: block;
        }

        /* Horizontal Rule */
        .terms-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }

        /* Superscript and Subscript */
        .terms-content sup,
        .terms-content sub {
          font-size: 0.75em;
          line-height: 0;
          position: relative;
          vertical-align: baseline;
        }

        .terms-content sup {
          top: -0.5em;
        }

        .terms-content sub {
          bottom: -0.25em;
        }

        /* Print Styles */
        @media print {
          .terms-content {
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
          }
          
          .terms-content a {
            color: #000;
            text-decoration: underline;
          }
          
          .terms-content h1,
          .terms-content h2,
          .terms-content h3,
          .terms-content h4 {
            color: #000;
            page-break-after: avoid;
          }
          
          .terms-content table {
            page-break-inside: avoid;
          }
          
          .terms-content img {
            page-break-inside: avoid;
            max-width: 100% !important;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .terms-content {
            font-size: 14px;
            line-height: 1.6;
          }
          
          .terms-content h1 {
            font-size: 1.75rem;
          }
          
          .terms-content h2 {
            font-size: 1.375rem;
          }
          
          .terms-content h3 {
            font-size: 1.125rem;
          }
          
          .terms-content ul,
          .terms-content ol {
            padding-left: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default TermsAndCondition;