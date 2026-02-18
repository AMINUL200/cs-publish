import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Zap, FileText, Download, ArrowLeft, Eye, File, Image } from 'lucide-react';

const PublisherViewDesignManuscript = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
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

      if (response.data.status) {
        console.log('Manuscript data:', response.data.data);
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
    if (manuscriptData.pdf) {
      window.open(`${STORAGE_URL}${manuscriptData.pdf}`, '_blank');
    } else {
      toast.info('No PDF available for download');
    }
  };

  const handleViewFile = (fileUrl) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
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

  // Parse figures data
  const parseFigures = (figures) => {
    if (!figures) return [];
    try {
      return typeof figures === 'string' ? JSON.parse(figures) : figures;
    } catch (error) {
      console.error('Error parsing figures:', error);
      return Array.isArray(figures) ? figures : [];
    }
  };

  // Parse cites data
  const parseCites = (cites) => {
    if (!cites) return [];
    try {
      return typeof cites === 'string' ? JSON.parse(cites) : cites;
    } catch (error) {
      console.error('Error parsing cites:', error);
      return Array.isArray(cites) ? cites : [];
    }
  };

  // Parse keywords data
  const parseKeywords = (keywords) => {
    if (!keywords) return [];
    try {
      return typeof keywords === 'string' ? JSON.parse(keywords) : keywords;
    } catch (error) {
      console.error('Error parsing keywords:', error);
      return Array.isArray(keywords) ? keywords : [];
    }
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

  const figures = parseFigures(manuscriptData.figures);
  const cites = parseCites(manuscriptData.cites);
  const keywords = parseKeywords(manuscriptData.keywords);

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
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="bg-green-100 px-3 py-1 rounded-full">
                  <span className="text-green-800 text-sm font-medium">Published</span>
                </div>
                {manuscriptData.quick_press === 1 && (
                  <div className="bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-600" />
                    <span className="text-yellow-800 text-sm font-medium">Quick Press</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Manuscript Details
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
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

              {/* Keywords */}
              {keywords.length > 0 && (
                <div className="mt-4">
                  <span className="font-semibold text-gray-600 block mb-2">Keywords:</span>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Stats */}
            <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{manuscriptData.view_count || 0}</div>
                  <div className="text-sm text-gray-600">Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{manuscriptData.download_count || 0}</div>
                  <div className="text-sm text-gray-600">Downloads</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Press Status */}
        {manuscriptData.quick_press === 1 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-800 text-lg">Quick Press Featured</h3>
                <p className="text-yellow-700 mt-1">
                  This manuscript is featured in the Quick Press section for immediate visibility across the platform.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Files Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* PDF File */}
          {manuscriptData.pdf && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-50 rounded-lg">
                  <FileText className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">PDF Document</h3>
                  <p className="text-sm text-gray-500">Manuscript PDF</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleViewFile(`${STORAGE_URL}${manuscriptData.pdf}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Supplementary File */}
          {manuscriptData.supplementary_file && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <File className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Supplementary File</h3>
                  <p className="text-sm text-gray-500">Additional documents</p>
                </div>
              </div>
              <button
                onClick={() => handleViewFile(`${STORAGE_URL}${manuscriptData.supplementary_file}`)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm"
              >
                <Eye className="w-4 h-4" />
                View File
              </button>
            </div>
          )}

          {/* Figures Count */}
          {figures.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Image className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Figures</h3>
                  <p className="text-sm text-gray-500">{figures.length} figure(s)</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {figures.slice(0, 3).map((figure, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`${STORAGE_URL}${figure}`}
                      alt={`Figure ${index + 1}`}
                      className="w-full h-16 object-cover rounded-lg border border-gray-200 cursor-pointer"
                      onClick={() => handleViewFile(`${STORAGE_URL}${figure}`)}
                    />
                    <div className="absolute inset-0 bg-black/10 bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
                {figures.length > 3 && (
                  <div className="flex items-center justify-center bg-gray-100 rounded-lg border border-gray-200">
                    <span className="text-sm text-gray-600">+{figures.length - 3} more</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Citation Styles Section */}
        {cites.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-50 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Citation Styles</h2>
                <p className="text-sm text-gray-600">Available citation formats for this manuscript</p>
              </div>
            </div>

            <div className="space-y-4">
              {cites.map((cite, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full text-sm border">
                      {cite.cite_name} Format
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm leading-relaxed bg-white p-3 rounded border">
                    {cite.cite_address || `No ${cite.cite_name} citation available`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
              <Download className="w-5 h-5" />
              Download PDF
            </button>
          </div>
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