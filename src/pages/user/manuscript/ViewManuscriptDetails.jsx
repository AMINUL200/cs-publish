import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";

const ViewManuscriptDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();

  const [manuscriptData, setManuscriptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("abstract");

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
        setManuscriptData(response.data.data);
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message || "Failed to fetch manuscript");
      }
    } catch (error) {
      console.error("Error fetching manuscript:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch manuscript");
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
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 120; // Increased offset for better positioning
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "abstract", "introduction", "materials-methods", "results", 
        "discussion", "conclusion", "author-contributions", "conflict-interest", "references"
      ];
      
      const scrollPosition = window.scrollY + 150; // Adjusted for better detection
      
      // Find the current section
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

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once on mount
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [manuscriptData]); // Added manuscriptData dependency

  // Navigation sections
  const sections = [
    { id: "abstract", label: "Abstract" },
    { id: "introduction", label: "Introduction" },
    { id: "materials-methods", label: "Materials & Methods" },
    { id: "results", label: "Results" },
    { id: "discussion", label: "Discussion" },
    { id: "conclusion", label: "Conclusion" },
    { id: "author-contributions", label: "Author Contributions" },
    { id: "conflict-interest", label: "Conflict of Interest" },
    { id: "references", label: "References" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading manuscript details...</p>
        </div>
      </div>
    );
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
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
          <p className="text-gray-600">The requested manuscript could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            {/* Breadcrumb */}
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm text-gray-600">
                <li>
                  <Link to="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link
                    to="/published-manuscripts"
                    className="hover:text-blue-600 transition-colors"
                  >
                    Published Manuscripts
                  </Link>
                </li>
                <li className="flex items-center">
                  <span className="mx-2">/</span>
                  <span className="text-gray-900 font-medium">
                    Manuscript Details
                  </span>
                </li>
              </ol>
            </nav>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {getCleanTitle()}
            </h1>

            {/* Author and Metadata */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
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

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-32">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Jump to Section
              </h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? "bg-yellow-100 text-yellow-700 border border-blue-200"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </nav>

              {/* Additional Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button className="w-full custom-btn px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors mb-3">
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              {/* Manuscript Image */}
              {/* {manuscriptData.image && (
                <div className="w-full h-64 sm:h-80 lg:h-96 overflow-hidden rounded-t-lg">
                  <img
                    src={manuscriptData.image}
                    alt={getCleanTitle()}
                    className="w-full h-full object-cover"
                  />
                </div>
              )} */}

              {/* Content Sections */}
              <div className="p-6 lg:p-8">
                {/* Abstract */}
                <section id="abstract" className="mb-12 scroll-mt-32">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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
                  <section id="introduction" className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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
                  <section id="materials-methods" className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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
                  <section id="results" className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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
                  <section id="discussion" className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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
                  <section id="conclusion" className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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

                {/* Author Contributions */}
                {manuscriptData.author_contributions && (
                  <section id="author-contributions" className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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
                  <section id="conflict-interest" className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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

                {/* References */}
                {manuscriptData.references && (
                  <section id="references" className="mb-12 scroll-mt-32">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="w-2 h-6 bg-blue-600 rounded mr-3"></span>
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
                  <span className="font-medium text-gray-600">Manuscript ID:</span>
                  <span className="ml-2 text-gray-900">
                    {manuscriptData.m_unique_id}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <span className="ml-2 text-gray-900">{manuscriptData.email}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Affiliation:</span>
                  <span className="ml-2 text-gray-900">
                    {manuscriptData.affiliation}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Country:</span>
                  <span className="ml-2 text-gray-900">{manuscriptData.country}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewManuscriptDetails;