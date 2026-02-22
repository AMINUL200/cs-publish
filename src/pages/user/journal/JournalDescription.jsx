import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Globe,
  FileText,
  Download,
  BookOpen,
  Star,
  Share2,
  Bookmark,
  CheckCircle,
  ArrowRight,
  Clock,
  BarChart3,
  Tag,
  MessageSquare,
  Eye,
  ThumbsUp,
  Printer,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
  Book,
  Award,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const JournalDescription = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [journalData, setJournalData] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch journal data
  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/about_the_journal/${id}`);
        console.log(response);
        
        setJournalData(response.data.data);
      } catch (error) {
        console.error('Error fetching journal data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Share functions
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: journalData?.j_title || 'Journal',
        text: `Check out ${journalData?.j_title || 'this journal'}`,
        url: window.location.href,
      });
    } else {
      alert('Share URL copied to clipboard!');
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(journalData?.j_title || 'Journal')}&body=${encodeURIComponent(`Check out this journal: ${window.location.href}`)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-48 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!journalData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Journal not found</h1>
          <p className="text-gray-600">The journal you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-gray-600">
            <a href="/journals" className="hover:text-[#ffba00]">Journals</a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <a href={`/journals/${journalData.j_categories?.toLowerCase()}`} className="hover:text-[#ffba00]">{journalData.j_categories || 'Category'}</a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-gray-900">{journalData.j_title}</span>
          </nav>
        </div>

        {/* Journal Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Journal Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-100">
                {journalData.image ? (
                  <img
                    src={`${STORAGE_URL}${journalData.image}`}
                    alt={journalData.j_title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><ImageIcon class="w-12 h-12 text-gray-400" /></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Journal Info */}
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{journalData.j_title}</h1>
                    {journalData.j_categories && (
                      <span className="px-3 py-1 bg-[#ffba00]/10 text-[#ffba00] text-sm font-medium rounded-full">
                        {journalData.j_categories}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-4">
                    {journalData.issn_print && journalData.issn_print_no && (
                      <div className="flex items-center gap-2">
                        <Book className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">Print ISSN: {journalData.issn_print_no}</span>
                      </div>
                    )}
                    {journalData.issn_online && journalData.issn_online_no && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">eISSN: {journalData.issn_online_no}</span>
                      </div>
                    )}
                    {journalData.amount && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">APC: ${journalData.amount}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isBookmarked ? 'bg-[#ffba00] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <Bookmark className="w-4 h-4" />
                    {isBookmarked ? 'Saved' : 'Save Journal'}
                  </button>
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Editor Info */}
              {journalData.editor && (
                <div className="mb-4">
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Editor-in-Chief
                  </h3>
                  <p className="text-gray-700">{journalData.editor}</p>
                </div>
              )}

              {/* UGC Approval */}
              {journalData.ugc_approved && (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">UGC Approved</span>
                  {journalData.ugc_no && (
                    <span className="text-sm">({journalData.ugc_no})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Journal Description - Moved here after header */}
          {journalData.j_description && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#ffba00]" />
                About the Journal
              </h2>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{journalData.j_description}</p>
              </div>
            </div>
          )}

          {/* Simple Stats based on available data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 mt-6 border-t border-b border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">--</div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">--</div>
              <div className="text-sm text-gray-600">Total Citations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">--</div>
              <div className="text-sm text-gray-600">h-Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">--</div>
              <div className="text-sm text-gray-600">Acceptance Rate</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 border-b border-gray-200">
            {['overview', 'aims-scope', 'submission', 'author-guide'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab
                    ? 'bg-[#ffba00] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Journal Overview</h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {journalData.editor && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Editor-in-Chief
                          </h3>
                          <p className="text-gray-700">{journalData.editor}</p>
                        </div>
                      )}
                      
                      {journalData.j_categories && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Category
                          </h3>
                          <p className="text-gray-700">{journalData.j_categories}</p>
                        </div>
                      )}
                    </div>

                    {/* About the Journal content from API */}
                    {journalData.about_the_journal && (
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          About the Journal
                        </h3>
                        <div 
                          className="prose max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{ __html: journalData.about_the_journal }}
                        />
                      </div>
                    )}

                    {/* ISSN Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">ISSN Information</h3>
                        <div className="space-y-2">
                          {journalData.issn_print && (
                            <p className="text-gray-700">
                              <span className="font-medium">Print ISSN:</span> {journalData.issn_print_no}
                            </p>
                          )}
                          {journalData.issn_online && (
                            <p className="text-gray-700">
                              <span className="font-medium">Online ISSN:</span> {journalData.issn_online_no}
                            </p>
                          )}
                        </div>
                      </div>
                      {journalData.ugc_approved && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">Approval Status</h3>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-gray-700 font-medium">UGC Approved Journal</p>
                              {journalData.ugc_no && (
                                <p className="text-sm text-gray-600">Approval No: {journalData.ugc_no}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Publication Date */}
                    <div className="text-sm text-gray-500 border-t pt-4">
                      <p>Last updated: {formatDate(journalData.updated_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'aims-scope' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Aims and Scope</h2>
                <div className="prose max-w-none">
                  {journalData.about_the_journal ? (
                    <div dangerouslySetInnerHTML={{ __html: journalData.about_the_journal }} />
                  ) : (
                    <p className="text-gray-700">{journalData.j_description}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'submission' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Submission Guidelines</h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Submit your manuscript through our online submission system. All submissions undergo rigorous peer review.
                  </p>
                  
                  {journalData.amount && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Article Processing Charge (APC)
                      </h3>
                      <p className="text-2xl font-bold text-[#ffba00]">${journalData.amount}</p>
                      <p className="text-sm text-gray-600 mt-1">One-time publication fee</p>
                    </div>
                  )}
                  
                  <button className="mt-4 px-6 py-3 bg-[#ffba00] text-white font-semibold rounded-lg hover:bg-[#e6a800] transition-colors">
                    Submit Manuscript
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'author-guide' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Author Guide</h2>
                {journalData.author_guide ? (
                  <div 
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: journalData.author_guide }}
                  />
                ) : (
                  <p className="text-gray-700">Author guide is not available at the moment.</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Publication Fees Card */}
            {journalData.amount && (
              <div className="bg-gradient-to-r from-[#ffba00] to-orange-500 rounded-2xl p-6 text-white">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Publication Fees</h2>
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="w-5 h-5" />
                      <span className="text-3xl font-bold">${journalData.amount}</span>
                    </div>
                    <p className="text-sm opacity-90">Article Processing Charge</p>
                  </div>
                </div>
                
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Open Access Publication</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Professional Copyediting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Rigorous Peer Review</span>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 py-3 bg-white text-[#ffba00] font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                    Submit Paper
                  </button>
                  <button className="flex-1 py-3 bg-white/20 border border-white font-semibold rounded-lg hover:bg-white/30 transition-colors">
                    View Guide
                  </button>
                </div>
              </div>
            )}

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Journal Information</h3>
              <div className="space-y-3">
                {journalData.j_categories && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">{journalData.j_categories}</span>
                  </div>
                )}
                {journalData.issn_print && journalData.issn_print_no && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Print ISSN</span>
                    <span className="font-medium text-gray-900">{journalData.issn_print_no}</span>
                  </div>
                )}
                {journalData.issn_online && journalData.issn_online_no && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Online ISSN</span>
                    <span className="font-medium text-gray-900">{journalData.issn_online_no}</span>
                  </div>
                )}
                {journalData.ugc_approved && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">UGC Approved</span>
                    <span className="text-green-600 font-medium">Yes</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${journalData.status ? 'text-green-600' : 'text-red-600'}`}>
                    {journalData.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalDescription;