import React, { useState, useEffect } from "react";
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
  Image as ImageIcon,
  FileType,
  ShieldCheck,
} from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { IndianRupee } from "lucide-react";
import { toast } from "react-toastify";

const JournalDescription = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [journalData, setJournalData] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch journal data
  useEffect(() => {
    const fetchJournalData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}api/about_the_journal/${id}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          },
        );
        console.log(response);

        setJournalData(response.data.data);
      } catch (error) {
        console.error("Error fetching journal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJournalData();
  }, [id]);

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Share functions
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: journalData?.j_title || "Journal",
        text: `Check out ${journalData?.j_title || "this journal"}`,
        url: window.location.href,
      });
    } else {
      alert("Share URL copied to clipboard!");
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const TAB_LABELS = {
    overview: "Overview",
    "aims-scope": "Aims & Scope",
    submission: "Submission",
    "author-guide": "Author Guide",
    ethics: "Ethics",
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(journalData?.j_title || "Journal")}&body=${encodeURIComponent(`Check out this journal: ${window.location.href}`)}`;
  };

  const handleSubmitButtonClick = () => {
    toast.info("Please Login as Author to Submit Paper");
  };

  // Build file URL (handles full URLs and relative storage paths)
  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${STORAGE_URL}${path}`;
  };

  // Get filename from path
  const getFileName = (path) => {
    if (!path) return "File";
    try {
      return decodeURIComponent(path.split("/").pop() || "File");
    } catch {
      return "File";
    }
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Journal not found
          </h1>
          <p className="text-gray-600">
            The journal you're looking for doesn't exist or has been removed.
          </p>
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
            <a href="/journals" className="hover:text-[#ffba00]">
              Journals
            </a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <a
              href={`/journals/${journalData.j_categories?.toLowerCase()}`}
              className="hover:text-[#ffba00]"
            >
              {journalData.j_categories || "Category"}
            </a>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-gray-900">
              {journalData.j_title}
            </span>
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
                      e.target.parentElement.innerHTML =
                        '<div class="w-full h-full flex items-center justify-center"><ImageIcon class="w-12 h-12 text-gray-400" /></div>';
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
                    <h1 className="text-3xl font-bold text-gray-900">
                      {journalData.j_title}
                    </h1>
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
                        <span className="text-sm text-gray-700">
                          Publication Model: {journalData.issn_print_no}
                        </span>
                      </div>
                    )}
                    {journalData.issn_online && journalData.issn_online_no && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          Peer Review: {journalData.issn_online_no}
                        </span>
                      </div>
                    )}
                    {journalData.amount && (
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-700">
                          APC: {journalData.amount}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isBookmarked ? "bg-[#ffba00] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    <Bookmark className="w-4 h-4" />
                    {isBookmarked ? "Saved" : "Save Journal"}
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
                  <span className="font-medium">DOI</span>
                  {journalData.ugc_no && (
                    <span className="text-sm">({journalData.ugc_no})</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Journal Description - Moved here after header */}
          {journalData.small_desc && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="prose max-w-none text-gray-700">
                <p
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: journalData.small_desc }}
                />
              </div>
            </div>
          )}

          {/* Simple Stats based on available data */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 mt-6 border-t border-b border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {journalData?.total_articles}+
              </div>
              <div className="text-sm text-gray-600">Quick Press</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {journalData?.total_citations}
              </div>
              <div className="text-sm text-gray-600">Indexing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {journalData?.h_index}
              </div>
              <div className="text-sm text-gray-600">First Decision</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {journalData?.acceptance_rate}
              </div>
              <div className="text-sm text-gray-600">Acceptance Rate</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 border-b border-gray-200">
            {["overview", "aims-scope", "submission", "author-guide", "ethics"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors flex items-center gap-2 ${
                    activeTab === tab
                      ? "bg-[#ffba00] text-white"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab === "ethics" && <ShieldCheck className="w-4 h-4" />}
                  {TAB_LABELS[tab] ||
                    tab
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  {tab === "ethics" &&
                    journalData.athics?.length > 0 && (
                      <span
                        className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                          activeTab === tab
                            ? "bg-white/20"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {journalData.athics.length}
                      </span>
                    )}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tab Content */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Journal Overview
                  </h2>
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
                          <p className="text-gray-700">
                            {journalData.j_categories}
                          </p>
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
                          dangerouslySetInnerHTML={{
                            __html: journalData.about_the_journal,
                          }}
                        />
                      </div>
                    )}

                    {/* ISSN Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">
                          Publication Model
                        </h3>
                        <div className="space-y-2">
                          {journalData.issn_print && (
                            <p className="text-gray-700">
                              <span className="font-medium">
                                Publication Model:
                              </span>{" "}
                              {journalData.issn_print_no}
                            </p>
                          )}
                          {journalData.issn_online && (
                            <p className="text-gray-700">
                              <span className="font-medium">Peer Review:</span>{" "}
                              {journalData.issn_online_no}
                            </p>
                          )}
                        </div>
                      </div>
                      {journalData.ugc_approved && (
                        <div>
                          <h3 className="font-medium text-gray-900 mb-2">
                            Approval Status
                          </h3>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <div>
                              <p className="text-gray-700 font-medium">DOI</p>
                              {journalData.ugc_no && (
                                <p className="text-sm text-gray-600">
                                  DOI No: {journalData.ugc_no}
                                </p>
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

            {activeTab === "aims-scope" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Aims and Scope
                </h2>
                <div className="prose max-w-none">
                  {journalData.aims_scope ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: journalData.aims_scope,
                      }}
                    />
                  ) : (
                    <p className="text-gray-700">{journalData.aims_scope}</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === "submission" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Submission Guidelines
                </h2>
                <div className="space-y-4">
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: journalData.submission_guideline,
                    }}
                  />

                  {journalData.amount && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        Article Processing Charge (APC)
                      </h3>
                      <p className="text-2xl font-bold text-[#ffba00]">
                        {journalData.amount}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        One-time publication fee
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleSubmitButtonClick()}
                    className="mt-4 px-6 py-3 bg-[#ffba00] text-white font-semibold rounded-lg hover:bg-[#e6a800] transition-colors"
                  >
                    Submit Manuscript
                  </button>
                </div>
              </div>
            )}

            {activeTab === "author-guide" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Author Guide
                </h2>
                {journalData.author_guide ? (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: journalData.author_guide,
                    }}
                  />
                ) : (
                  <p className="text-gray-700">
                    Author guide is not available at the moment.
                  </p>
                )}
              </div>
            )}

            {/* ========================================== */}
            {/* ETHICS TAB */}
            {/* ========================================== */}
            {activeTab === "ethics" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#ffba00]/10 p-3 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-[#ffba00]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Ethics & Guidelines
                    </h2>
                    <p className="text-sm text-gray-500">
                      Download the ethics documents for this journal
                    </p>
                  </div>
                </div>

                {!journalData.athics || journalData.athics.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                      No ethics documents available for this journal.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {journalData.athics.map((athics) => (
                      <div
                        key={athics.id}
                        className="border border-gray-200 rounded-xl p-4 hover:border-[#ffba00] hover:shadow-md transition-all bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Info */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="bg-[#ffba00]/10 p-2.5 rounded-lg flex-shrink-0">
                              <FileText className="w-5 h-5 text-[#ffba00]" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-gray-900 truncate">
                                {athics.athics_name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-1">
                                Added: {formatDate(athics.created_at)}
                              </p>
                            </div>
                          </div>

                          {/* Download Buttons */}
                          <div className="flex flex-wrap gap-2 flex-shrink-0">
                            {athics.word_document && (
                              <a
                                href={getFileUrl(athics.word_document)}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium transition-colors"
                                title={`Download ${getFileName(athics.word_document)}`}
                              >
                                <FileType className="w-4 h-4" />
                                <span>Word</span>
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                            {athics.pdf_document && (
                              <a
                                href={getFileUrl(athics.pdf_document)}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                                title={`Download ${getFileName(athics.pdf_document)}`}
                              >
                                <FileText className="w-4 h-4" />
                                <span>PDF</span>
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
                    <h2 className="text-xl font-semibold mb-2">
                      Publication Fees
                    </h2>
                    <div className="flex items-center gap-2 mb-1">
                      <IndianRupee className="w-5 h-5" />
                      <span className="text-3xl font-bold">
                        {journalData.amount}
                      </span>
                    </div>
                    <p className="text-sm opacity-90">
                      Article Processing Charge
                    </p>
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
                  <button
                    onClick={() => handleSubmitButtonClick()}
                    className="flex-1 py-3 bg-white text-[#ffba00] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Submit Paper
                  </button>
                  <button
                    onClick={() => setActiveTab("submission")}
                    className="flex-1 py-3 bg-white/20 border border-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
                  >
                    View Guide
                  </button>
                </div>
              </div>
            )}

            {/* Quick Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Journal Information
              </h3>
              <div className="space-y-3">
                {journalData.j_categories && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">
                      {journalData.j_categories}
                    </span>
                  </div>
                )}
                {journalData.issn_print && journalData.issn_print_no && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Publication Model</span>
                    <span className="font-medium text-gray-900">
                      {journalData.issn_print_no}
                    </span>
                  </div>
                )}
                {journalData.issn_online && journalData.issn_online_no && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Peer Review</span>
                    <span className="font-medium text-gray-900">
                      {journalData.issn_online_no}
                    </span>
                  </div>
                )}
                {journalData.ugc_approved && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">DOI</span>
                    <span className="text-green-600 font-medium">Yes</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-medium ${journalData.status ? "text-green-600" : "text-red-600"}`}
                  >
                    {journalData.status ? "Active" : "Inactive"}
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