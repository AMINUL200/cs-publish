import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PublisherViewDesignManuscript = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const [manuscriptData, setManuscriptData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/published-manuscripts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response);
      if (response.data.status) {
        setManuscriptData(response.data.data);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch manuscript');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDownloadPDF = () => {
    toast.info('Download PDF functionality to be implemented');
    // Implement PDF download logic here
  };

  const handleApprove = () => {
    toast.info('Approve manuscript functionality to be implemented');
    // Implement approve logic here
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Function to safely render HTML content
  const renderHTML = (htmlString) => {
    return { __html: htmlString || '' };
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader />;
  }

  if (!manuscriptData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No Manuscript Found</h2>
          <p className="text-gray-500">Unable to load manuscript data.</p>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back
                </button>
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-800 text-sm font-medium">Published</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Manuscript Details
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">Manuscript ID:</span>
                  <p className="text-gray-900">{manuscriptData.m_unique_id}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Author:</span>
                  <p className="text-gray-900">{manuscriptData.username}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Email:</span>
                  <p className="text-gray-900">{manuscriptData.email}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Affiliation:</span>
                  <p className="text-gray-900">{manuscriptData.affiliation}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Country:</span>
                  <p className="text-gray-900">{manuscriptData.country}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Published:</span>
                  <p className="text-gray-900">{formatDate(manuscriptData.created_at)}</p>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{manuscriptData.view_count}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{manuscriptData.download_count}</div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manuscript Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {/* Featured Image */}
          {manuscriptData.image && (
            <div className="w-full h-64 overflow-hidden">
              <img
                src={manuscriptData.image}
                alt="Manuscript featured"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x400?text=No+Image';
                }}
              />
            </div>
          )}

          {/* Content Sections */}
          <div className="p-8">
            {/* Title */}
            <div className="mb-8 pb-6 border-b border-gray-200">
              <div 
                className="prose prose-lg max-w-none text-2xl font-bold text-gray-900"
                dangerouslySetInnerHTML={renderHTML(manuscriptData.title)}
              />
            </div>

            {/* Abstract */}
            {manuscriptData.abstract && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Abstract</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.abstract)}
                />
              </section>
            )}

            {/* Introduction */}
            {manuscriptData.introduction && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Introduction</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.introduction)}
                />
              </section>
            )}

            {/* Materials and Methods */}
            {manuscriptData.materials_and_methods && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Materials and Methods</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.materials_and_methods)}
                />
              </section>
            )}

            {/* Results */}
            {manuscriptData.results && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Results</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.results)}
                />
              </section>
            )}

            {/* Discussion */}
            {manuscriptData.discussion && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Discussion</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.discussion)}
                />
              </section>
            )}

            {/* Conclusion */}
            {manuscriptData.conclusion && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Conclusion</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.conclusion)}
                />
              </section>
            )}

            {/* Author Contributions */}
            {manuscriptData.author_contributions && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Author Contributions</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.author_contributions)}
                />
              </section>
            )}

            {/* Conflict of Interest */}
            {manuscriptData.conflict_of_interest_statement && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">Conflict of Interest</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.conflict_of_interest_statement)}
                />
              </section>
            )}

            {/* References */}
            {manuscriptData.references && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">References</h2>
                <div 
                  className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={renderHTML(manuscriptData.references)}
                />
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
              <span>Last updated: {formatDate(manuscriptData.updated_at)}</span>
              <span>Manuscript ID: {manuscriptData.m_unique_id}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex gap-3">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
          
          {/* <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Approve Manuscript
            </button>
          </div> */}
        </div>
      </div>

      {/* Custom styles for manuscript content */}
      <style jsx>{`
        .prose {
          font-family: 'Georgia', serif;
          line-height: 1.8;
          color: #374151;
        }
        
        .prose h1,
        .prose h2,
        .prose h3,
        .prose h4 {
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .prose p {
          margin-bottom: 1.5rem;
          text-align: justify;
        }
        
        .prose ol,
        .prose ul {
          margin-bottom: 1.5rem;
          padding-left: 2rem;
        }
        
        .prose li {
          margin-bottom: 0.5rem;
        }
        
        .prose img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.8rem ;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .prose a {
          color: #2563eb;
          text-decoration: underline;
        }
        
        .prose a:hover {
          color: #1d4ed8;
        }
        
        .prose sup {
          font-size: 0.75em;
          vertical-align: super;
        }
        
        .prose sub {
          font-size: 0.75em;
          vertical-align: sub;
        }
        
        .prose blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .prose table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5rem 0;
        }
        
        .prose th,
        .prose td {
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          text-align: left;
        }
        
        .prose th {
          background-color: #f9fafb;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}

export default PublisherViewDesignManuscript;