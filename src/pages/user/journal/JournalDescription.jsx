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
        // Use fallback data if API fails
        setJournalData({
          j_title: "Fundamental and Translational Immune Therapy",
          j_description: "Journal Description",
          editor: "Journal Editor",
          issn_print: true,
          issn_print_no: "255",
          issn_online: true,
          issn_online_no: "125",
          ugc_approved: true,
          ugc_no: "UG12",
          image: "https://cspublishinghouse.com/cs-api/storage/app/public/journal/1761637696_applied-immunotherapy.jpg"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, [id]);

  // Mock data for additional journal information (since API only provides basic info)
  const additionalData = {
    abbreviation: "FTIT",
    publisher: "Global Research Publications",
    impactFactor: "4.8",
    category: "Medical Sciences - Immunology",
    frequency: "Quarterly",
    publicationMode: "Open Access",
    acceptanceRate: "42%",
    submissionToDecision: "45 days",
    indexing: ["Scopus", "Web of Science", "PubMed", "Google Scholar", "DOAJ"],
    subjects: ["Immunology", "Cancer Therapy", "Autoimmune Diseases", "Vaccines", "Immunotherapy"],
    aimsAndScope: "Fundamental and Translational Immune Therapy publishes high-quality research on immune system mechanisms and their clinical applications. The journal covers basic immunology, translational research, clinical trials, and therapeutic developments in immunotherapy.",
    latestArticles: [
      { id: 1, title: "CAR-T Cell Therapy Advancements in Leukemia", authors: "Miller et al.", date: "2024-03-15", downloads: 245, views: 1200 },
      { id: 2, title: "Checkpoint Inhibitors in Solid Tumors", authors: "Johnson & Wilson", date: "2024-03-10", downloads: 189, views: 980 },
      { id: 3, title: "Personalized Cancer Vaccines", authors: "Chen et al.", date: "2024-03-05", downloads: 312, views: 1550 },
      { id: 4, title: "Immunotherapy for Autoimmune Disorders", authors: "Patel & Gupta", date: "2024-02-28", downloads: 167, views: 890 },
    ],
    metrics: {
      totalArticles: 847,
      totalCitations: 12542,
      hIndex: 38,
      i10Index: 245,
      avgReviewTime: "5 weeks",
      avgPublicationTime: "7 weeks"
    },
    fees: {
      publicationFee: "$1500",
      waiverAvailable: true,
      membershipDiscount: true
    },
    editorialBoard: [
      { name: "Dr. Robert Miller", affiliation: "Harvard Medical School, USA", role: "Editor-in-Chief" },
      { name: "Prof. Emily Chen", affiliation: "University of Oxford, UK", role: "Senior Editor" },
      { name: "Dr. Kenji Tanaka", affiliation: "University of Tokyo, Japan", role: "Associate Editor" },
      { name: "Prof. Maria Rodriguez", affiliation: "University of Barcelona, Spain", role: "Review Editor" },
    ]
  };

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
            <a href="/journals/medical" className="hover:text-[#ffba00]">Medical</a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-gray-900">{journalData.j_title}</span>
          </nav>
        </div>

        {/* Journal Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 mb-6">
            {/* Journal Image */}
            <div className="flex-shrink-0">
              <div className="w-48 h-64 rounded-lg overflow-hidden bg-gray-100">
                {journalData.image ? (
                  <img
                    src={journalData.image}
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
                    <span className="px-3 py-1 bg-[#ffba00]/10 text-[#ffba00] text-sm font-medium rounded-full">
                      {additionalData.abbreviation}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{journalData.j_description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Book className="w-4 h-4 text-gray-500" />
                      {journalData.issn_print && (
                        <span className="text-sm text-gray-700">Print ISSN: {journalData.issn_print_no}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-500" />
                      {journalData.issn_online && (
                        <span className="text-sm text-gray-700">eISSN: {journalData.issn_online_no}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{additionalData.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-900">Impact Factor: {additionalData.impactFactor}</span>
                    </div>
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
                <div className="mb-6">
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

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{additionalData.metrics.totalArticles.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Articles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{additionalData.metrics.totalCitations.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Citations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{additionalData.metrics.hIndex}</div>
              <div className="text-sm text-gray-600">h-Index</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{additionalData.acceptanceRate}</div>
              <div className="text-sm text-gray-600">Acceptance Rate</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 border-b border-gray-200">
            {['overview', 'aims-scope', 'editorial-board', 'submission', 'articles', 'metrics'].map((tab) => (
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
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Editor-in-Chief
                        </h3>
                        <p className="text-gray-700">{journalData.editor}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Publisher
                        </h3>
                        <p className="text-gray-700">{additionalData.publisher}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Submission to Decision
                        </h3>
                        <p className="text-gray-700">{additionalData.submissionToDecision}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Category
                        </h3>
                        <p className="text-gray-700">{additionalData.category}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Indexing & Abstracting
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {additionalData.indexing.map((index, idx) => (
                          <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                            {index}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Subject Areas
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {additionalData.subjects.map((subject, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>

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
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'aims-scope' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Aims and Scope</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 mb-4">{additionalData.aimsAndScope}</p>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Topics Covered:</h3>
                  <ul className="space-y-2 mb-6">
                    {additionalData.subjects.map((subject, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{subject}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'editorial-board' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Editorial Board</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {additionalData.editorialBoard.map((member, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-[#ffba00]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-[#ffba00]" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.affiliation}</p>
                        <p className="text-sm text-[#ffba00] font-medium mt-1">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Latest Articles</h2>
                  <a href="/articles" className="text-[#ffba00] hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="space-y-4">
                  {additionalData.latestArticles.map((article) => (
                    <div key={article.id} className="p-4 border border-gray-200 rounded-xl hover:border-[#ffba00] transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-[#ffba00] cursor-pointer">
                        {article.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>By {article.authors}</span>
                        <span>•</span>
                        <span>{formatDate(article.date)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" /> {article.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" /> {article.views}
                          </span>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#ffba00] text-white text-sm rounded-lg hover:bg-[#e6a800] transition-colors">
                          <FileText className="w-4 h-4" />
                          View Abstract
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publication Fees Card */}
            <div className="bg-gradient-to-r from-[#ffba00] to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Publication Fees</h2>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-5 h-5" />
                    <span className="text-3xl font-bold">{additionalData.fees.publicationFee}</span>
                  </div>
                  <p className="text-sm opacity-90">Article Processing Charge</p>
                </div>
                {additionalData.fees.waiverAvailable && (
                  <span className="px-3 py-1 bg-white/20 text-sm rounded-full">
                    Waivers Available
                  </span>
                )}
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
                {additionalData.fees.membershipDiscount && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Member Discount: 20% off</span>
                  </div>
                )}
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
          </div>

          {/* Right Column - Sidebar (Same as before, using additionalData) */}
          {/* ... Include the sidebar components from previous code ... */}
        </div>
      </div>
    </div>
  );
};

export default JournalDescription;