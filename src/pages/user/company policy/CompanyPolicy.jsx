import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Breadcrumb from "../../../components/common/Breadcrumb";

const CompanyPolicy = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [policyData, setPolicyData] = useState({
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch company policy data
  const fetchPolicyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}api/policy`);

      if (response.data.status && response.data.data) {
        setPolicyData({
          title: response.data.data.title || "Company Policy",
          description: response.data.data.description || "",
        });
      } else {
        setError("No company policy found");
        toast.info("No company policy available at the moment");
      }
    } catch (error) {
      console.error("Error fetching company policy:", error);
      setError("Failed to load company policy");
      toast.error("Failed to load company policy");
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchPolicyData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Policy" },
          ]}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">
                  Loading company policy...
                </p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error && !policyData.description) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Policy" },
          ]}
        />

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Company Policy Not Available
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchPolicyData}
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
          { label: "Policy" },
        ]}
      />

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {policyData.title}
            </h1>
            <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          </div>

         

          {/* Policy Content with Enhanced Styling */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 sm:p-8">
              {policyData.description ? (
                <div
                  className="policy-content"
                  dangerouslySetInnerHTML={{ __html: policyData.description }}
                />
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-4xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Policy Content Available
                  </h3>
                  <p className="text-gray-500">
                    The company policy content is currently being prepared.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Print Button */}
          {/* <div className="mt-6 flex justify-end">
            <button
              onClick={() => window.print()}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors no-print"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Print Policy</span>
            </button>
          </div> */}
        </div>
      </div>

      {/* Enhanced CSS Styles for Policy Content */}
      <style jsx>{`
        .policy-content {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            "Helvetica Neue", Arial, sans-serif;
          line-height: 1.7;
          color: #374151;
          font-size: 16px;
        }

        /* Headings */
        .policy-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 2rem 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .policy-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 1.5rem 0 1rem 0;
          padding-left: 0.5rem;
          border-left: 4px solid #10b981;
        }

        .policy-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
          margin: 1.25rem 0 0.75rem 0;
        }

        .policy-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #4b5563;
          margin: 1rem 0 0.5rem 0;
        }

        /* Paragraphs */
        .policy-content p {
          margin: 1rem 0;
          text-align: justify;
        }

        /* Links */
        .policy-content a {
          color: blue;
          text-decoration: underline;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .policy-content a:hover {
          color: blue;
          text-decoration: none;
        }

        /* Lists */
        .policy-content ul,
        .policy-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .policy-content ul {
          list-style-type: disc;
        }

        .policy-content ol {
          list-style-type: decimal;
        }

        .policy-content li {
          margin: 0.5rem 0;
          padding-left: 0.5rem;
        }

        .policy-content ul ul,
        .policy-content ol ol,
        .policy-content ul ol,
        .policy-content ol ul {
          margin: 0.5rem 0;
        }

        .policy-content ul ul {
          list-style-type: circle;
        }

        .policy-content ul ul ul {
          list-style-type: square;
        }

        /* Strong and Emphasis */
        .policy-content strong {
          font-weight: 700;
          color: #111827;
        }

        .policy-content em {
          font-style: italic;
          color: #4b5563;
        }

        /* Blockquotes - Useful for policy highlights */
        .policy-content blockquote {
          border-left: 4px solid #10b981;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
          background-color: #f0fdf4;
          padding: 1rem 1rem 1rem 1.5rem;
          border-radius: 0 0.375rem 0.375rem 0;
        }

        /* Tables for policy data */
        .policy-content table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
          font-size: 0.875rem;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
        }

        .policy-content th,
        .policy-content td {
          border: 1px solid #d1d5db;
          padding: 0.75rem;
          text-align: left;
        }

        .policy-content th {
          background-color: #f0fdf4;
          font-weight: 600;
          color: #065f46;
        }

        .policy-content tr:nth-child(even) {
          background-color: #f9fafb;
        }

        .policy-content tr:hover {
          background-color: #f3f4f6;
        }

        /* Code elements */
        .policy-content code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
          font-size: 0.875rem;
          color: #dc2626;
        }

        /* Images */
        .policy-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem auto;
          display: block;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        /* Horizontal Rule */
        .policy-content hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 2rem 0;
        }

        /* Policy-specific highlights */
        .policy-content .policy-highlight {
          background-color: #fffbeb;
          border: 1px solid #fcd34d;
          border-left: 4px solid #f59e0b;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 0.375rem;
        }

        /* Print Styles */
        @media print {
          .no-print {
            display: none !important;
          }

          .policy-content {
            font-size: 12pt;
            line-height: 1.6;
            color: #000;
          }

          .policy-content a {
            color: #000;
            text-decoration: underline;
          }

          .policy-content h1,
          .policy-content h2,
          .policy-content h3,
          .policy-content h4 {
            color: #000;
            page-break-after: avoid;
          }

          .policy-content table {
            page-break-inside: avoid;
          }

          .policy-content img {
            page-break-inside: avoid;
            max-width: 100% !important;
          }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .policy-content {
            font-size: 14px;
            line-height: 1.6;
          }

          .policy-content h1 {
            font-size: 1.75rem;
          }

          .policy-content h2 {
            font-size: 1.375rem;
            border-left: 3px solid #10b981;
          }

          .policy-content h3 {
            font-size: 1.125rem;
          }

          .policy-content ul,
          .policy-content ol {
            padding-left: 1.5rem;
          }
        }
      `}</style>
    </>
  );
};

export default CompanyPolicy;
