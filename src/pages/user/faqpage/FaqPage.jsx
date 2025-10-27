import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Breadcrumb from "../../../components/common/Breadcrumb";

const FaqPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState({});

  // Fetch FAQ data
  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/faqs`);

      if (response.data.status) {
        setFaqs(response.data.data);
        toast.success(response.data.message);

        // Initialize open state for all items (all closed by default)
        const initialOpenState = {};
        response.data.data.forEach((faq) => {
          initialOpenState[faq.id] = false;
        });
        setOpenItems(initialOpenState);
      } else {
        throw new Error(response.data.message || "Failed to fetch FAQs");
      }
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      setError(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Toggle FAQ item
  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Get unique categories
  const categories = ["all", ...new Set(faqs.map((faq) => faq.category))];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Group FAQs by category for organized display
  const faqsByCategory = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading FAQs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading FAQs
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchFaqs}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Home", path: "/", icon: "home" }, { label: "Frequently Asked Questions" }]}
        pageTitle="Frequently Asked Questions"
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-24">
        {/* Hero Section */}
        {/* <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h1>
            </div>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-32">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Categories
                </h3>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        activeCategory === category
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <span className="capitalize">
                        {category === "all" ? "All Categories" : category}
                      </span>
                      {category !== "all" && (
                        <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                          {faqs.filter((f) => f.category === category).length}
                        </span>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="flex-1">
              {filteredFaqs.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">❓</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No FAQs Found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || activeCategory !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "No FAQs available at the moment."}
                  </p>
                  {(searchTerm || activeCategory !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setActiveCategory("all");
                      }}
                      className="mt-4 bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Group by category */}
                  {Object.keys(faqsByCategory).map((category) => (
                    <div
                      key={category}
                      className="bg-white rounded-2xl shadow-sm border overflow-hidden"
                    >
                      {/* Category Header */}
                      <div className="bg-gradient-to-r from-yellow-50 to-[#ff5656]/50 px-6 py-4 border-b">
                        <h2 className="text-xl font-semibold text-gray-900 capitalize">
                          {category}
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                          {faqsByCategory[category].length} question
                          {faqsByCategory[category].length !== 1 ? "s" : ""}
                        </p>
                      </div>

                      {/* FAQ Items */}
                      <div className="divide-y divide-gray-100">
                        {faqsByCategory[category].map((faq) => (
                          <div key={faq.id} className="group">
                            <button
                              onClick={() => toggleItem(faq.id)}
                              className="w-full px-6 py-6 text-left hover:bg-gray-50 transition-colors duration-200 flex items-start justify-between"
                            >
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 pr-8">
                                  {faq.question}
                                </h3>
                                <div
                                  className={`mt-3 text-gray-600 transition-all duration-300 overflow-hidden ${
                                    openItems[faq.id]
                                      ? "max-h-96 opacity-100"
                                      : "max-h-0 opacity-0"
                                  }`}
                                >
                                  <div
                                    className="blog-rich-text prose prose-blue max-w-none"
                                    dangerouslySetInnerHTML={{
                                      __html: faq.answer,
                                    }}
                                  />
                                </div>
                              </div>
                              <div className="flex-shrink-0 ml-4">
                                <svg
                                  className={`h-6 w-6 text-gray-400 transition-transform duration-300 ${
                                    openItems[faq.id] ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{faqs.length}</div>
              <div className="text-gray-600">Total Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {categories.length - 1}
              </div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div> */}
      </div>
    </>
  );
};

export default FaqPage;
