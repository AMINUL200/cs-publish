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
} from "lucide-react";
import Loader from "../../../components/common/Loader";

const ViewManuscriptDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [manuscriptData, setManuscriptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("abstract");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [rightPanelView, setRightPanelView] = useState("figures");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [figures, setFigures] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);

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
        }
      );

      if (response.data.status) {
        const data = response.data.data;
        setManuscriptData(data);

        // Parse figures data
        if (data.figures) {
          try {
            let figuresArray = [];

            if (typeof data.figures === "string") {
              // Parse the JSON string and clean up escaped slashes
              const cleanedString = data.figures.replace(/\\\//g, "/");
              figuresArray = JSON.parse(cleanedString);
            } else if (Array.isArray(data.figures)) {
              figuresArray = data.figures;
            }

            // Transform into the expected format for display
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
        error.response?.data?.message || "Failed to fetch manuscript"
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
        setShowRightSidebar(true);
        setIsMobileMenuOpen(false);
      } else {
        setShowRightSidebar(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle right sidebar toggle with animation
  const toggleRightSidebar = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    if (!showRightSidebar) {
      setShowRightSidebar(true);
    } else {
      setShowRightSidebar(false);
    }

    // Reset animation state after transition
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
        "noopener,noreferrer"
      );
    } else {
      toast.error("Supplementary file not available.");
    }
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

  const handleDownloadPDF = async (pdf) => {
    if (!pdf) {
      toast.info("PDF Not Found");
    }
    try {
      setDownloadLoading(true); // optional loader
      const response = await axios.post(
        `${API_URL}api/subscription/increase-download/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // responseType: "blob", // very important for binary data
        }
      );

      

      if (response.data.status) {
        // Create a blob link for download
        // const link = document.createElement("a");
        // link.href = pdf;
        // link.download = `manuscript_${id}.pdf`;
        // document.body.appendChild(link);
        // link.click();
        // link.remove();
         window.open(pdf, "_blank", "noopener,noreferrer");
        toast.success("PDF downloaded successfully!");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadLoading(false);
    }
  };

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
      <div className="bg-white shadow-md border-b fixed top-0 left-0 right-0 z-50">
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
                    to="/view-published-manuscript-list"
                    className="hover:text-yellow-600 transition-colors"
                  >
                    Published Manuscripts
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium">Details</span>
                </li>
              </ol>
            </nav>

            {/* Bottom Row: Title and Actions */}
            <div className="flex items-center justify-between gap-4">
              {/* Title - Hidden on medium screens */}
              <h1 className="text-2xl font-bold text-gray-900 flex-1 lg:block hidden">
                {getCleanTitle()}
              </h1>

              {/* Mobile Menu Button - Show on medium and small screens */}
              <div className="lg:hidden flex items-center gap-3">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-inherit text-yellow-500  border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors text-sm font-medium  cursor-pointer"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                  <span>Menu</span>
                </button>

                {/* Show More Button for Right Sidebar */}
                <button
                  onClick={toggleRightSidebar}
                  className="flex items-center gap-2 px-3 py-2 bg-inherit text-yellow-700 border-yellow-300 rounded-lg hover:bg-yellow-300 transition-colors text-sm font-medium cursor-pointer"
                >
                  {showRightSidebar ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Menu className="w-4 h-4" />
                  )}
                  <span>{showRightSidebar ? "Close" : "Show More"}</span>
                </button>
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

                {/* Download PDF Button */}
                <button
                  onClick={() => handleDownloadPDF(manuscriptData.pdf)}
                  disabled={downloadLoading}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer 
    ${
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

            {/* Metadata Row */}
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="font-medium">Author:</span>
                <span className="ml-2">{manuscriptData.username}</span>
              </div>
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed top-24 left-4 right-4 bg-white border text-yellow-200 border-yellow-200 rounded-lg shadow-lg z-50">
          <div className="py-2 max-h-80 overflow-y-auto custom-scrollbar">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-yellow-500  transition-colors border-b border-gray-100 last:border-b-0 ${
                  activeSection === section.id
                    ? "bg-yellow-50 text-yellow-700 font-medium"
                    : "text-gray-700"
                }`}
              >
                {section.label}
              </button>
            ))}
            {/* Download PDF in Mobile Menu */}
            <button
              onClick={() => handleDownloadPDF(manuscriptData.pdf)}
              disabled={downloadLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer 
    ${
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

            <a 
  href="https://cspublishinghouse.com/cs-api/public/uploads/published_manuscripts/pdfs/1761588744_68ffb60805237.pdf" 
  download
  target="_blank"
  rel="noopener noreferrer"
>
  Download PDF
</a>
          </div>
        </div>
      )}

      {/* Main Content Area with Top Padding for Fixed Header */}
      <div className="pt-44 max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 relative">
          {/* Main Content - Left Side */}
          <div
            className={`flex-1 min-w-0 transition-all duration-300 ${
              showRightSidebar ? "lg:block" : ""
            }`}
          >
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 lg:p-8">
                {/* Abstract */}
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
                {manuscriptData.introduction && (
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
                {manuscriptData.materials_and_methods && (
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
                {manuscriptData.results && (
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
                {manuscriptData.discussion && (
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
                {manuscriptData.conclusion && (
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
                {manuscriptData.supplementary_file && (
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
                {manuscriptData.author_contributions && (
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
                {manuscriptData.conflict_of_interest_statement && (
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

                {/* References - Left Section */}
                {manuscriptData.references && (
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

            {/* Additional Information */}
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">
                    Manuscript ID:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {manuscriptData.m_unique_id}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">
                    {manuscriptData.email}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Affiliation:
                  </span>
                  <span className="ml-2 text-gray-900">
                    {manuscriptData.affiliation}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Country:</span>
                  <span className="ml-2 text-gray-900">
                    {manuscriptData.country}
                  </span>
                </div>
                {manuscriptData.supplementary_file && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-600">
                      Supplementary File:
                    </span>
                    <button
                      onClick={handleSupplementaryFileDownload}
                      className="ml-2 text-yellow-600 hover:text-yellow-700 underline text-sm flex items-center gap-1"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download Supplementary Materials</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Figures & References with Slide Animation */}
          <div
            className={`
            lg:w-80 flex-shrink-0
            fixed lg:relative
            top-0 lg:top-auto
            right-0 lg:right-auto
            h-screen lg:h-auto
            bg-white lg:bg-transparent
            shadow-2xl lg:shadow-none
            z-40 lg:z-auto
            transform transition-transform duration-300 ease-in-out
            ${
              showRightSidebar
                ? "translate-x-0"
                : "translate-x-full lg:translate-x-0"
            }
            ${showRightSidebar ? "block" : "hidden lg:block"}
          `}
          >
            <div className="sticky top-44 h-[calc(100vh-176px)] lg:h-auto overflow-y-auto custom-scrollbar">
              {/* Close Button for Mobile */}
              <div className="lg:hidden flex justify-between items-center p-4 border-b bg-white sticky top-0 z-10">
                <h3 className="text-lg font-semibold text-gray-900">
                  {rightPanelView === "figures" ? "Figures" : "References"}
                </h3>
                <button
                  onClick={toggleRightSidebar}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                  <span>Close</span>
                </button>
              </div>

              <div className="p-4 lg:p-0">
                {/* Toggle Buttons */}
                <div className="bg-white rounded-lg shadow-sm border mb-4">
                  <div className="flex border-b">
                    <button
                      onClick={() => setRightPanelView("figures")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                        rightPanelView === "figures"
                          ? "bg-yellow-50 text-yellow-700 border-b-2 border-yellow-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <Image className="w-4 h-4" />
                      Figures
                    </button>
                    <button
                      onClick={() => setRightPanelView("references")}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                        rightPanelView === "references"
                          ? "bg-yellow-50 text-yellow-700 border-b-2 border-yellow-700"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      References
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden max-h-[calc(100vh-250px)] lg:max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                  {rightPanelView === "figures" ? (
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

          {/* Overlay for mobile when sidebar is open */}
          {showRightSidebar && (
            <div
              className="fixed inset-0 bg-black/50 bg-opacity-50 z-30 lg:hidden"
              onClick={toggleRightSidebar}
            />
          )}
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(dropdownOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ViewManuscriptDetails;
