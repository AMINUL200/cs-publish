import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import {
  ChevronDown,
  Download,
  Image,
  BookOpen,
  Menu,
  X,
  ExternalLink,
  FileText,
  Quote,
  Share,
  Maximize,
  User,
  Mail,
  Building,
  GraduationCap,
  Copy,
  FileDown,
  Zap,
} from "lucide-react";
import Loader from "../../../components/common/Loader";

const ViewManuscriptDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token, userData } = useSelector((state) => state.auth);
  const isLoggedIn = Boolean(token);
  const hasActiveSubscription = Boolean(
    userData?.subscription ||
    userData?.active_plan ||
    userData?.subscription_status === "active",
  );

  const { id } = useParams();

  const [manuscriptData, setManuscriptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("abstract");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [leftPanelView, setLeftPanelView] = useState("figures");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [figures, setFigures] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [citeDropdownOpen, setCiteDropdownOpen] = useState(false);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(false);
  const [journalInfo, setJournalInfo] = useState();
  const [volumeInfo, setVolumeInfo] = useState();
  const [authorInfo, setAuthorInfo] = useState([]);
  const [hoveredAuthor, setHoveredAuthor] = useState(null);
  const [authorPopupPosition, setAuthorPopupPosition] = useState({
    x: 0,
    y: 0,
  });
  const [paymentFeature, setPaymentFeature] = useState();
  const [showCitePopup, setShowCitePopup] = useState(false);
  const [selectedCite, setSelectedCite] = useState(null);

  // Fetch manuscript data
  const fetchManuscriptData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/published-manuscripts-details/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status) {
        const data = response.data.data;
        console.log(response.data);
        setManuscriptData(data);
        setJournalInfo(response.data.journal);
        setVolumeInfo(response.data.volume);
        setAuthorInfo(response.data.author_details.author);
        setPaymentFeature(response.data.payment_feature);

        // Parse figures data
        if (data.figures) {
          try {
            let figuresArray = [];
            if (typeof data.figures === "string") {
              const cleanedString = data.figures.replace(/\\\//g, "/");
              figuresArray = JSON.parse(cleanedString);
            } else if (Array.isArray(data.figures)) {
              figuresArray = data.figures;
            }

            const formattedFigures = figuresArray.map((figureUrl, index) => ({
              id: index + 1,
              image: figureUrl,
              title: `Figure ${index + 1}`,
              description: `Figure ${index + 1} from the manuscript`,
            }));
            setFigures(formattedFigures);
          } catch (parseError) {
            console.error("Error parsing figures:", parseError);
            setFigures([]);
          }
        }
      } else {
        throw new Error(response.data.message || "Failed to fetch manuscript");
      }
    } catch (error) {
      console.error("Error fetching manuscript:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(
        error.response?.data?.message || "Failed to fetch manuscript",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchManuscriptData();
    }
  }, [id]);

  // Function to strip HTML tags and clean text
  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
  };

  // Function to get clean title
  const getCleanTitle = () => {
    if (!manuscriptData?.title) return "Manuscript Details";
    return stripHtmlTags(manuscriptData.title);
  };

  // Function to handle section navigation with proper offset
  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setDropdownOpen(false);
    setIsMobileMenuOpen(false);

    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 140;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "abstract",
        "introduction",
        "materials-methods",
        "results",
        "discussion",
        "conclusion",
        "supplementary-file",
        "author-contributions",
        "conflict-interest",
        "references",
      ];

      const scrollPosition = window.scrollY + 150;
      let currentSection = sections[0];

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;

          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            currentSection = sectionId;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [manuscriptData]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowLeftSidebar(true);
        setIsMobileMenuOpen(false);
      } else {
        setShowLeftSidebar(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle left sidebar toggle with animation
  const toggleLeftSidebar = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    if (!showLeftSidebar) {
      setShowLeftSidebar(true);
    } else {
      setShowLeftSidebar(false);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle figure preview
  const handleFigurePreview = (figureUrl) => {
    window.open(figureUrl, "_blank", "noopener,noreferrer");
  };

  // Handle supplementary file download
  const handleSupplementaryFileDownload = () => {
    if (manuscriptData?.supplementary_file) {
      window.open(
        manuscriptData.supplementary_file,
        "_blank",
        "noopener,noreferrer",
      );
    } else {
      toast.error("Supplementary file not available.");
    }
  };

  // Handle citation popup
  const handleCitePopup = (cite = null) => {
    if (cite) {
      setSelectedCite(cite);
    }
    setShowCitePopup(true);
  };

  // Copy citation to clipboard
  const handleCopyCitation = (citationText) => {
    navigator.clipboard.writeText(citationText);
    toast.success("Citation copied to clipboard!");
  };

  // Download citation as text file
  const handleDownloadCitation = (cite) => {
    const element = document.createElement("a");
    const file = new Blob([cite.cite_address], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${cite.cite_name}_citation.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`${cite.cite_name} citation downloaded!`);
  };

  // Handle share
  const handleShare = (platform) => {
    const title = getCleanTitle();
    const url = window.location.href;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title,
          )}&url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url,
          )}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url,
          )}`,
          "_blank",
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        break;
    }
    setShareDropdownOpen(false);
  };

  // Handle expand
  const handleExpand = () => {
    toast.info("Expand functionality to be implemented");
  };

  // Simple handlers for mobile view (without dropdowns for now)
  const handleMobileCite = () => {
    if (manuscriptData?.cites?.length > 0) {
      handleCitePopup(manuscriptData.cites[0]);
    }
  };

  const handleMobileShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleDownloadPDF = async (pdf) => {
    console.log("click");
    
    if (!pdf) {
      toast.info("PDF Not Found");
    }
    try {
      setDownloadLoading(true);
      const response = await axios.post(
        `${API_URL}api/subscription/increase-download/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(response);
      
      if (response.data.status) {
        window.open(pdf, "_blank", "noopener,noreferrer");
        toast.success("PDF downloaded successfully!");
      } else {
        toast.error(response.data.message || "Failed to download PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadLoading(false);
    }
  };

  // Handle author hover
  const handleAuthorMouseEnter = (author, event) => {
    setHoveredAuthor(author);
    const rect = event.target.getBoundingClientRect();
    setAuthorPopupPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY,
    });
  };

  const handleAuthorMouseLeave = () => {
    setHoveredAuthor(null);
  };

  // Navigation sections
  const sections = [
    { id: "abstract", label: "Abstract" },
    { id: "introduction", label: "Introduction" },
    { id: "materials-methods", label: "Materials & Methods" },
    { id: "results", label: "Results" },
    { id: "discussion", label: "Discussion" },
    { id: "conclusion", label: "Conclusion" },
    { id: "supplementary-file", label: "Supplementary File" },
    { id: "author-contributions", label: "Author Contributions" },
    { id: "conflict-interest", label: "Conflict of Interest" },
    { id: "references", label: "References" },
  ];

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/"
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!manuscriptData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Manuscript Not Found
          </h2>
          <p className="text-gray-600">
            The requested manuscript could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Fixed Header with Navigation */}
      <div className="bg-white shadow-md border-b fixed mb-10 top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            {/* Top Row: Breadcrumb */}
            <nav className="flex mb-3" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <Link
                    to="/"
                    className="hover:text-yellow-600 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link
                    to={`/journal/${manuscriptData?.j_title}`}
                    className="hover:text-yellow-600 transition-colors"
                  >
                    {manuscriptData?.j_title}
                  </Link>
                </li>
                {volumeInfo?.volume && (
                  <li className="flex items-center">
                    <span className="mx-2">/</span>
                    <a className="hover:text-yellow-600 transition-colors">
                      {`Volume ${volumeInfo?.volume} / ${volumeInfo?.issue_no}`}
                    </a>
                  </li>
                )}
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium">Details</span>
                </li>
              </ol>
            </nav>

            {paymentFeature?.length && (
              <span className="inline-flex p-1 bg-yellow-600 text-white rounded-full justify-center align-center text-center text-[10px] -mb-2 ">
                {paymentFeature[0]}
              </span>
            )}

            {/* Bottom Row: Title and Actions */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              {/* Title - Hidden on medium screens */}
              <h1 className="text-2xl font-bold text-gray-900 flex-1 ">
                {getCleanTitle()}
              </h1>

              {/* Mobile Menu Button - Show on medium and small screens */}
              <div className="lg:hidden flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-inherit text-yellow-500 border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium cursor-pointer"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                  <span>Menu</span>
                </button>

                {/* Show More Button for Left Sidebar */}
                <button
                  onClick={toggleLeftSidebar}
                  className="flex items-center gap-2 px-3 py-2 bg-inherit text-yellow-700 border-yellow-300 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-medium cursor-pointer"
                >
                  {showLeftSidebar ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                  <span>{showLeftSidebar ? "Close" : "Show More"}</span>
                </button>

                {/* Mobile Action Buttons: Cite, Share, Expand */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleMobileCite}
                    className="flex flex-row items-center gap-1 px-2 py-2 bg-inherit/10 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-gray-700 cursor-pointer"
                  >
                    <Quote className="w-4 h-4" />
                    <span className="text-xs">Cite</span>
                  </button>
                  <button
                    onClick={handleMobileShare}
                    className="flex flex-row items-center gap-1 px-2 py-2 bg-inherit/10 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-gray-700 cursor-pointer"
                  >
                    <Share className="w-4 h-4" />
                    <span className="text-xs">Share</span>
                  </button>
                  <button
                    onClick={handleExpand}
                    className="flex flex-row items-center gap-1 px-2 py-2 bg-inherit/10 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-gray-700 cursor-pointer"
                  >
                    <Maximize className="w-4 h-4" />
                    <span className="text-xs">Expand</span>
                  </button>
                </div>
              </div>

              {/* Right Side Actions - Hidden on medium screens */}
              <div className="hidden lg:flex items-center gap-3">
                {/* Jump to Section Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-inherit/10 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    <span>Jump to Section</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border text-yellow-200 border-yellow-200 rounded-lg shadow-lg z-50 cursor-pointer">
                      <div className="py-2">
                        {sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-yellow-500 hover:text-white transition-colors ${
                              activeSection === section.id
                                ? "bg-yellow-50 text-yellow-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            {section.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button
                      onClick={() => handleCitePopup()}
                      className="flex flex-row items-center gap-1 px-3 py-2 bg-inherit/10 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-gray-700 cursor-pointer"
                    >
                      <Quote className="w-4 h-4" />
                      <span className="text-xs">Cite</span>
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => setShareDropdownOpen(!shareDropdownOpen)}
                      className="flex flex-row items-center gap-1 px-3 py-2 bg-inherit/10 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-gray-700 cursor-pointer"
                    >
                      <Share className="w-4 h-4" />
                      <span className="text-xs">Share</span>
                    </button>
                  </div>

                  <button
                    onClick={handleExpand}
                    className="flex flex-row items-center gap-1 px-3 py-2 bg-inherit/10 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-gray-700 cursor-pointer"
                  >
                    <Maximize className="w-4 h-4" />
                    <span className="text-xs">Expand</span>
                  </button>
                </div>

                {/* Download PDF Button */}
                <button
                  onClick={() => handleDownloadPDF(manuscriptData.pdf)}
                  disabled={downloadLoading}
                  className={`flex flex-row items-center gap-1 px-3 py-2 bg-inherit/10 border border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-gray-700 cursor-pointer ${
                    downloadLoading ? " cursor-not-allowed" : " text-black"
                  }`}
                >
                  {downloadLoading ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Author info with hover popup */}
            <div className="relative">
              <ul className="flex flex-wrap gap-3">
                {authorInfo.map((author, index) => (
                  <li
                    key={index}
                    className="relative"
                    onMouseEnter={(e) => handleAuthorMouseEnter(author, e)}
                    onMouseLeave={handleAuthorMouseLeave}
                  >
                    <button className="text-blue-600 hover:text-yellow-600 hover:underline transition-colors text-sm font-medium cursor-pointer">
                      {author.name}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Author Details Popup */}
              {hoveredAuthor && (
                <div
                  className="fixed z-50 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
                  style={{
                    left: `${authorPopupPosition.x}px`,
                    top: `${authorPopupPosition.y}px`,
                    transform: "translateX(-50%)",
                  }}
                  onMouseEnter={() => setHoveredAuthor(hoveredAuthor)}
                  onMouseLeave={handleAuthorMouseLeave}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {hoveredAuthor.name}
                        {hoveredAuthor.order && (
                          <sup className="ml-1 text-xs text-gray-500">
                            {hoveredAuthor.order}
                          </sup>
                        )}
                      </h3>
                      <div className="space-y-2">
                        {hoveredAuthor.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600 break-all">
                              {hoveredAuthor.email}
                            </span>
                          </div>
                        )}
                        {hoveredAuthor.university && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {hoveredAuthor.university}
                            </span>
                          </div>
                        )}
                        {hoveredAuthor.affiliation && (
                          <div className="flex items-center gap-2">
                            <Building className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {hoveredAuthor.affiliation}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Arrow indicator */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45" />
                </div>
              )}
            </div>

            {/* Metadata Row */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium">Published:</span>
                <span className="ml-2">
                  {new Date(manuscriptData.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Views:</span>
                <span className="ml-2">{manuscriptData.view_count}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Downloads:</span>
                <span className="ml-2">{manuscriptData.download_count}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Citation Popup */}
      {showCitePopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Header with gradient */}
            <div className="relative bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 border-b border-yellow-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-600 rounded-lg">
                    <Quote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cites</h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowCitePopup(false)}
                  className="p-2 hover:bg-yellow-200 rounded-lg transition-colors group"
                >
                  <X className="w-6 h-6 text-gray-600 group-hover:text-gray-900" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-5">
                {manuscriptData.cites?.map((cite, index) => (
                  <div
                    key={cite.id}
                    className="group relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300"
                  >
                    {/* Format badge and title */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                          <span className="text-lg font-bold text-yellow-700">
                            {cite.cite_name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            {cite.cite_name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">Cite</p>
                        </div>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-yellow-300">
                        {cite.cite_name}
                      </span>
                    </div>

                    {/* Citation content with enhanced styling */}
                    <div className="relative bg-white rounded-lg p-4 border border-gray-300 mb-4 shadow-sm">
                      <div className="absolute top-3 right-3">
                        <div className="p-1.5 bg-gray-100 rounded-md">
                          <FileText className="w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap pr-10 font-mono">
                        {cite.cite_address}
                      </p>
                    </div>

                    {/* Action buttons with enhanced design */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleCopyCitation(cite.cite_address)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 active:scale-95 transition-all text-sm font-semibold flex-1 shadow-md hover:shadow-lg"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Cite
                      </button>
                      <button
                        onClick={() => handleDownloadCitation(cite)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all text-sm font-semibold flex-1 shadow-md hover:shadow-lg"
                      >
                        <FileDown className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {(!manuscriptData.cites || manuscriptData.cites.length === 0) && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Quote className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Citations Available
                  </h3>
                </div>
              )}
            </div>

            {/* Footer with info */}
            {manuscriptData.cites && manuscriptData.cites.length > 0 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  💡 Tip: Click "Copy" to quickly add the cite to your
                  clipboard, or "Download" to save as a text file
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-24 left-4 right-4 bg-white border text-yellow-200 border-yellow-200 rounded-lg shadow-lg z-50">
          <div className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-yellow-500 transition-colors border-b border-gray-100 last:border-b-0 ${
                  activeSection === section.id
                    ? "bg-yellow-50 text-yellow-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {section.label}
              </button>
            ))}
            <button
              onClick={() => handleDownloadPDF(manuscriptData.pdf)}
              disabled={downloadLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                downloadLoading
                  ? "bg-yellow-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              {downloadLoading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="pt-60 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 relative">
          {/* Left Sidebar - Journal Info (Scrollable) + Figures & References (Fixed) */}
          <div className="lg:w-90 flex-shrink-0">
            {/* Journal Information Card - Scrollable */}
            <div className="bg-white rounded-lg shadow-sm border mb-4 hidden lg:block">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-yellow-600" />
                  Journal Information
                </h3>
                {journalInfo && (
                  <div className="space-y-3">
                    {journalInfo.image && (
                      <div className="flex justify-center mb-3">
                        <img
                          src={`${STORAGE_URL}${journalInfo.image}`}
                          // srcSet={`${STORAGE_URL}${journalInfo.image} 1x, ${STORAGE_URL}${journalInfo.image} 2x`}
                          alt={journalInfo.j_title}
                          className="h-20 w-auto object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        Journal
                      </h4>
                      <p className="text-sm text-gray-700">
                        {journalInfo.j_title}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        {journalInfo.j_description}
                      </p>
                    </div>
                    {volumeInfo && (
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm mb-1">
                          Issue
                        </h4>
                        <p className="text-sm text-gray-700">
                          Volume {volumeInfo.volume}, {volumeInfo.issue_no}
                        </p>
                        {volumeInfo.page_no && (
                          <p className="text-xs text-gray-500 mt-1">
                            Pages: {volumeInfo.page_no}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border mb-4 hidden lg:block">
              <div className="flex gap-2 justify-center ">
                <div className="flex flex-col text-center p-6">
                  <span> Altmetric</span>
                  <span> -</span>
                </div>
                <div className="flex flex-col text-center p-6">
                  <span> Citations</span>
                  <span> -</span>
                </div>
              </div>
            </div>

            {/* Keywords Section */}
            {manuscriptData.keywords && manuscriptData.keywords.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border mb-4 hidden lg:block">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {manuscriptData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Figures & References Section - Fixed */}
            <div
              className={`lg:w-90 flex-shrink-0 fixed lg:sticky top-0 lg:top-60 left-0 lg:left-auto h-screen lg:h-auto bg-white lg:bg-transparent shadow-2xl lg:shadow-none z-999 lg:z-auto transform transition-transform duration-300 ease-in-out ${
                showLeftSidebar
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
              } ${showLeftSidebar ? "block" : "hidden lg:block"}`}
            >
              <div className="h-[calc(100vh-176px)] lg:max-h-100vh overflow-y-auto custom-scrollbar">
                <div className="lg:hidden flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {leftPanelView === "figures" ? "Figures" : "References"}
                  </h3>
                  <button
                    onClick={toggleLeftSidebar}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    <span>Close</span>
                  </button>
                </div>

                <div className="p-4 lg:p-0">
                  <div className="bg-white rounded-lg shadow-sm border mb-4">
                    <div className="flex border-b">
                      <button
                        onClick={() => setLeftPanelView("figures")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                          leftPanelView === "figures"
                            ? "bg-yellow-50 text-yellow-700 border-b-2 border-yellow-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <Image className="w-4 h-4" />
                        Figures
                      </button>
                      <button
                        onClick={() => setLeftPanelView("references")}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                          leftPanelView === "references"
                            ? "bg-yellow-50 text-yellow-700 border-b-2 border-yellow-700"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        References
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border overflow-hidden max-h-[calc(100vh-320px)] lg:max-h-[calc(100vh-260px)] overflow-y-auto custom-scrollbar">
                    {leftPanelView === "figures" ? (
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:block hidden">
                          Figures
                        </h3>
                        <div className="space-y-6">
                          {figures && figures.length > 0 ? (
                            figures.map((figure) => (
                              <div
                                key={figure.id}
                                className="border-b pb-4 last:border-b-0 group"
                              >
                                <div className="relative overflow-hidden rounded-lg">
                                  <img
                                    src={figure.image}
                                    alt={figure.title}
                                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <button
                                    onClick={() =>
                                      handleFigurePreview(figure.image)
                                    }
                                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Preview Figure"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </button>
                                </div>
                                <h4 className="font-semibold text-sm text-gray-900 mb-1 mt-2">
                                  {figure.title}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {figure.description}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8">
                              <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                              <p className="text-sm text-gray-500">
                                No figures available
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 lg:block hidden">
                          References
                        </h3>
                        <div
                          className="blog-rich-text max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{
                            __html: manuscriptData.references,
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Right Side */}
          <div
            className={`flex-1 min-w-0 transition-all duration-300 ${
              showLeftSidebar ? "lg:block" : ""
            }`}
          >
            {/* Your main content sections remain the same */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 lg:p-8">
                <section id="abstract" className="mb-12 scroll-mt-44">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                    Abstract
                  </h2>
                  <div
                    className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: manuscriptData.abstract,
                    }}
                  />
                </section>

                {/* Introduction */}
                {manuscriptData.introduction && hasActiveSubscription  && (
                  <section id="introduction" className="mb-12 scroll-mt-44">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      Introduction
                    </h2>
                    <div
                      className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: manuscriptData.introduction,
                      }}
                    />
                  </section>
                )}

                {/* Materials and Methods */}
                {manuscriptData.materials_and_methods && hasActiveSubscription && (
                  <section
                    id="materials-methods"
                    className="mb-12 scroll-mt-44"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      Materials and Methods
                    </h2>
                    <div
                      className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: manuscriptData.materials_and_methods,
                      }}
                    />
                  </section>
                )}

                {/* Results */}
                {manuscriptData.results && hasActiveSubscription && (
                  <section id="results" className="mb-12 scroll-mt-44">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      Results
                    </h2>
                    <div
                      className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: manuscriptData.results,
                      }}
                    />
                  </section>
                )}

                {/* Discussion */}
                {manuscriptData.discussion && hasActiveSubscription && (
                  <section id="discussion" className="mb-12 scroll-mt-44">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      Discussion
                    </h2>
                    <div
                      className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: manuscriptData.discussion,
                      }}
                    />
                  </section>
                )}

                {/* Conclusion */}
                {manuscriptData.conclusion && hasActiveSubscription && (
                  <section id="conclusion" className="mb-12 scroll-mt-44">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      Conclusion
                    </h2>
                    <div
                      className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: manuscriptData.conclusion,
                      }}
                    />
                  </section>
                )}

                {/* Supplementary File Section */}
                {manuscriptData.supplementary_file && hasActiveSubscription && (
                  <section
                    id="supplementary-file"
                    className="mb-12 scroll-mt-44"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      Supplementary File
                    </h2>
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-yellow-100 rounded-lg">
                            <FileText className="w-6 h-6 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Supplementary Materials
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Additional supporting documents and data
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleSupplementaryFileDownload}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                        >
                          <Download className="w-4 h-4" />
                          <span>Download File</span>
                        </button>
                      </div>
                      <div className="mt-4 text-sm text-gray-600">
                        <p>
                          This supplementary file contains additional data,
                          methods, or supporting information related to the
                          research.
                        </p>
                      </div>
                      {/* 👇 PDF Preview Section */}
                      <div className="mt-6">
                        <h4 className="text-md font-semibold text-gray-900 mb-2">
                          Preview Supplementary PDF:
                        </h4>
                        <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                          <iframe
                            src={`${manuscriptData.supplementary_file}`}
                            title="Supplementary File"
                            className="w-full h-[600px]"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Author Contributions */}
                {manuscriptData.author_contributions && hasActiveSubscription && (
                  <section
                    id="author-contributions"
                    className="mb-12 scroll-mt-44"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      Author Contributions
                    </h2>
                    <div
                      className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: manuscriptData.author_contributions,
                      }}
                    />
                  </section>
                )}

                {/* Conflict of Interest */}
                {manuscriptData.conflict_of_interest_statement && hasActiveSubscription && (
                  <section
                    id="conflict-interest"
                    className="mb-12 scroll-mt-44"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      Conflict of Interest
                    </h2>
                    <div
                      className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: manuscriptData.conflict_of_interest_statement,
                      }}
                    />
                  </section>
                )}

                {/* References - Right Section */}
                {manuscriptData.references && hasActiveSubscription && (
                  <section id="references" className="mb-12 scroll-mt-44">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-1 h-6 bg-yellow-600 rounded mr-3"></span>
                      References
                    </h2>
                    <div
                      className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: manuscriptData.references,
                      }}
                    />
                  </section>
                )}
              </div>
            </div>

            {/* 🔐 Login Required Message */}
            {!isLoggedIn && (
              <div className="my-10 bg-yellow-50 border border-yellow-300 rounded-xl p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  🔒 Login Required
                </h3>
                <p className="text-gray-700 mb-4">
                  Please log in to read the full manuscript including methods,
                  results, discussion, references, and supplementary files.
                </p>
                <Link
                  to="/signin"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                >
                  Login to Read Full Article
                </Link>
              </div>
            )}
            {isLoggedIn && !hasActiveSubscription && (
              <div className="my-12">
                <div className="bg-gradient-to-br from-yellow-50 to-white border border-yellow-300 rounded-2xl p-8 shadow-lg">
                  {/* ⬇ Force center here */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      🚀 Unlock Full Access
                    </h3>

                    <h5 className="text-gray-700 max-w-2xl mx-auto mb-6 leading-relaxed">
                      You’re logged in, but your account does not have an active
                      subscription. Subscribe now to access the complete
                      manuscript, PDF downloads, references, figures, and
                      supplementary materials.
                    </h5>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link
                        to="/subscription"
                        className="px-8 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition font-semibold"
                      >
                        View Plans
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Overlay for mobile when sidebar is open */}
          {showLeftSidebar && (
            <div
              className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 lg:hidden"
              onClick={toggleLeftSidebar}
            />
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(dropdownOpen ||
        isMobileMenuOpen ||
        citeDropdownOpen ||
        shareDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(false);
            setIsMobileMenuOpen(false);
            setCiteDropdownOpen(false);
            setShareDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ViewManuscriptDetails;
