import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/common/Loader";
// import Loader from "../../components/common/Loader";

const CmsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const { slug } = useParams();
  
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Color scheme
  const colors = {
    primary: "#D97706", // Amber-600 (Yellow)
    secondary: "#991B1B", // Red-800 (Red Brown)
    dark: "#1F2937", // Gray-800 (Black)
    light: "#FEF3C7", // Amber-50 (Light Yellow)
    text: "#374151", // Gray-700
    white: "#FFFFFF"
  };

  // Fetch CMS page data
  useEffect(() => {
    const fetchCmsPage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(
          `${API_URL}api/cms-pages-user/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        setPageData(response.data.data);
      } catch (err) {
        console.error("Error fetching CMS page:", err);
        setError("Failed to load page content");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCmsPage();
    }
  }, [slug, token, API_URL]);

  // Function to render HTML content safely
  const renderHTML = (htmlContent) => {
    return { __html: htmlContent || '' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center max-w-md mx-auto p-8 rounded-lg" style={{ backgroundColor: colors.white }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.secondary }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.dark }}>Error Loading Page</h2>
          <p className="mb-4" style={{ color: colors.text }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            style={{ backgroundColor: colors.primary, color: colors.white }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.light }}>
        <div className="text-center max-w-md mx-auto p-8 rounded-lg" style={{ backgroundColor: colors.white }}>
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: colors.dark }}>Page Not Found</h2>
          <p style={{ color: colors.text }}>The requested page could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-15 sm:py-21 " style={{ backgroundColor: colors.light }}>
      {/* Header Section */}
      <header className="py-8" style={{ backgroundColor: colors.dark }}>
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: colors.white }}>
              {pageData.page_title}
            </h1>
            <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: colors.primary }}></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Image 1 */}
          {pageData.image1 && (
            <div className="mb-12 text-center">
              <img
                src={`${STORAGE_URL}${pageData.image1}`}
                alt={pageData.image1_alt}
                className="w-full max-w-4xl h-80 object-cover rounded-2xl shadow-2xl mx-auto"
              />
              {pageData.image1_alt && (
                <p className="text-sm mt-3 italic" style={{ color: colors.text }}>
                  {pageData.image1_alt}
                </p>
              )}
            </div>
          )}

          {/* Heading Section */}
          <section className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.secondary }}>
              {pageData.heading}
            </h2>
            <div className="w-16 h-1 rounded-full mx-auto mb-8" style={{ backgroundColor: colors.primary }}></div>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto" style={{ color: colors.text }}>
              {pageData.paragraph}
            </p>
          </section>

          {/* Description Section */}
          {pageData.description && (
            <section className="mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div 
                  className="prose prose-lg max-w-none"
                  style={{ 
                    color: colors.text,
                    '--tw-prose-headings': colors.secondary,
                    '--tw-prose-bold': colors.secondary,
                  }}
                  dangerouslySetInnerHTML={renderHTML(pageData.description)}
                />
              </div>
            </section>
          )}

          {/* Image 2 */}
          {pageData.image2 && (
            <div className="mb-12 text-center">
              <img
                src={`${STORAGE_URL}${pageData.image2}`}
                alt={pageData.image2_alt}
                className="w-full max-w-2xl h-64 object-cover rounded-2xl shadow-2xl mx-auto"
              />
              {pageData.image2_alt && (
                <p className="text-sm mt-3 italic" style={{ color: colors.text }}>
                  {pageData.image2_alt}
                </p>
              )}
            </div>
          )}

          {/* Long Description Section */}
          {pageData.long_description && (
            <section className="mb-12">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <div 
                  className="blog-rich-text prose-lg max-w-none"
                  style={{ 
                    color: colors.text,
                    '--tw-prose-headings': colors.secondary,
                    '--tw-prose-bold': colors.secondary,
                  }}
                  dangerouslySetInnerHTML={renderHTML(pageData.long_description)}
                />
              </div>
            </section>
          )}

          {/* Social Media Links */}
          {(pageData.facebook || pageData.twitter || pageData.linkedin || pageData.instagram) && (
            <section className="text-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-6" style={{ color: colors.secondary }}>
                  Connect With Us
                </h3>
                <div className="flex justify-center flex-wrap gap-6 md:gap-8">
                  {pageData.facebook && (
                    <a
                      href={pageData.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center transition-transform duration-200 hover:scale-110"
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-200 group-hover:shadow-lg" 
                           style={{ backgroundColor: colors.primary }}>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium" style={{ color: colors.dark }}>Facebook</span>
                    </a>
                  )}
                  {pageData.twitter && (
                    <a
                      href={pageData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center transition-transform duration-200 hover:scale-110"
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-200 group-hover:shadow-lg" 
                           style={{ backgroundColor: colors.primary }}>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium" style={{ color: colors.dark }}>Twitter</span>
                    </a>
                  )}
                  {pageData.linkedin && (
                    <a
                      href={pageData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center transition-transform duration-200 hover:scale-110"
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-200 group-hover:shadow-lg" 
                           style={{ backgroundColor: colors.primary }}>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium" style={{ color: colors.dark }}>LinkedIn</span>
                    </a>
                  )}
                  {pageData.instagram && (
                    <a
                      href={pageData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center transition-transform duration-200 hover:scale-110"
                    >
                      <div className="w-14 h-14 rounded-full flex items-center justify-center mb-2 transition-all duration-200 group-hover:shadow-lg" 
                           style={{ backgroundColor: colors.primary }}>
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.24 14.865 3.75 13.714 3.75 12.417s.49-2.448 1.376-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.886.875 1.376 2.026 1.376 3.323s-.49 2.448-1.376 3.323c-.875.807-2.026 1.297-3.323 1.297zm8.062-10.966h2.438c.259 0 .49.23.49.49v2.438c0 .259-.231.49-.49.49h-2.438c-.259 0-.49-.231-.49-.49V6.512c0-.26.231-.49.49-.49zm2.438 8.062h-2.438c-.259 0-.49.231-.49.49v2.438c0 .259.231.49.49.49h2.438c.259 0 .49-.231.49-.49v-2.438c0-.259-.231-.49-.49-.49z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-medium" style={{ color: colors.dark }}>Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      </main>

      
    </div>
  );
};

export default CmsPage;