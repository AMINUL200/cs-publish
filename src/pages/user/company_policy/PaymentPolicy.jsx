import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Breadcrumb from "../../../components/common/Breadcrumb";

const PaymentPolicy = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payment policy data
  const fetchPaymentPolicy = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/payment-policy`);

      if (response.data.status) {
        setPolicy(response.data.data);
      } else {
        setError("Payment policy not found");
      }
    } catch (error) {
      console.error("Error fetching payment policy:", error);
      setError("Failed to load payment policy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentPolicy();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment policy...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">
                No payment policy available at the moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Payment Policy" },
        ]}
      />

      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}

          {/* Policy Content */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Policy Title */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <h2 className="text-2xl font-bold text-white text-center">
                {policy.title}
              </h2>
            </div>

            {/* Policy Description */}
            <div className="p-8">
              <div
                className="custom-prose text-gray-700"
                dangerouslySetInnerHTML={{ __html: policy.description }}
              />
            </div>
          </div>
          {/* Last Updated Info */}
          {policy.updated_at && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:mt-12 mb-8">
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-blue-700">
                  Last updated:{" "}
                  {new Date(policy.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Custom Styles for HTML elements */}
        <style jsx>{`
          .custom-prose {
            line-height: 1.75;
          }
          .custom-prose h1,
          .custom-prose h2,
          .custom-prose h3,
          .custom-prose h4 {
            color: #1f2937;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }
          .custom-prose h1 {
            font-size: 1.875rem;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 0.5rem;
          }
          .custom-prose h2 {
            font-size: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 0.5rem;
          }
          .custom-prose h3 {
            font-size: 1.25rem;
          }
          .custom-prose h4 {
            font-size: 1.125rem;
          }
          .custom-prose p {
            margin-bottom: 1.25rem;
            line-height: 1.75;
          }
          .custom-prose a {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 500;
            transition: color 0.2s ease;
          }
          .custom-prose a:hover {
            color: #1d4ed8;
          }
          .custom-prose ul,
          .custom-prose ol {
            margin-bottom: 1.25rem;
            padding-left: 1.625rem;
          }
          .custom-prose ul {
            list-style-type: disc;
          }
          .custom-prose ol {
            list-style-type: decimal;
          }
          .custom-prose li {
            margin-bottom: 0.5rem;
            line-height: 1.75;
          }
          .custom-prose li > ul,
          .custom-prose li > ol {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          .custom-prose strong {
            font-weight: 600;
            color: #374151;
          }
          .custom-prose em {
            font-style: italic;
            color: #4b5563;
          }
          .custom-prose blockquote {
            border-left: 4px solid #d1d5db;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #6b7280;
          }
          .custom-prose code {
            background-color: #f3f4f6;
            padding: 0.125rem 0.375rem;
            border-radius: 0.25rem;
            font-size: 0.875rem;
            color: #dc2626;
          }
          .custom-prose pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
          }
          .custom-prose pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
          }
          .custom-prose table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          .custom-prose th,
          .custom-prose td {
            border: 1px solid #d1d5db;
            padding: 0.75rem;
            text-align: left;
          }
          .custom-prose th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #374151;
          }
          .custom-prose tr:nth-child(even) {
            background-color: #f9fafb;
          }
          .custom-prose img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
          }
          .custom-prose hr {
            border: none;
            border-top: 1px solid #e5e7eb;
            margin: 2rem 0;
          }
        `}</style>
      </div>
    </>
  );
};

export default PaymentPolicy;
