import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "../../../components/common/Breadcrumb";
import Loader from "../../../components/common/Loader";
import { useNavigate } from "react-router-dom";

const ViewJournalList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedLetter, setSelectedLetter] = useState("All");
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const navigate = useNavigate();

  // Fetch journals data from API
  useEffect(() => {
    const fetchJournals = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}api/all-journals`);

        if (response.data.success) {
          setJournals(response.data.data);
        } else {
          throw new Error("Failed to fetch journals");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching journals:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJournals();
  }, []);

  // Alphabet filter
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  // Filter journals
  const filteredJournals = journals.filter((journal) => {
    const matchesSearch = journal.j_title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLetter =
      selectedLetter === "All" ||
      journal.j_title.charAt(0).toUpperCase() === selectedLetter;
    return matchesSearch && matchesLetter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredJournals.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJournals = filteredJournals.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const handleViewClick = (journalId) => {
    navigate(`/journal/${journalId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLetterFilter = (letter) => {
    setSelectedLetter(letter);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Journal" },
          ]}
          pageTitle="Journal List"
        />
        <Loader />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Journal" },
          ]}
          pageTitle="Journal List"
        />
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 text-lg mb-2">
                  Error loading journals
                </p>
                <p className="text-gray-400">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Journal" },
        ]}
        pageTitle="Journal List"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <BookOpen className="w-10 h-10 text-yellow-400" />
              Journal Library
            </h1>
            <p className="text-gray-400">
              Browse and explore our collection of academic journals
            </p>
          </div>

          {/* Search Bar and Items Per Page */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search journals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-white placeholder-gray-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-gray-400 whitespace-nowrap">Show:</label>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none text-white"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={16}>16</option>
              </select>
            </div>
          </div>

          {/* Alphabet Filter */}
          <div className="mb-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleLetterFilter("All")}
                className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                  selectedLetter === "All"
                    ? "bg-yellow-400 text-black"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                All
              </button>
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleLetterFilter(letter)}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                    selectedLetter === letter
                      ? "bg-yellow-400 text-black"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-400">
              Showing{" "}
              <span className="font-semibold text-yellow-400">
                {filteredJournals.length > 0 ? indexOfFirstItem + 1 : 0}-
                {Math.min(indexOfLastItem, filteredJournals.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-yellow-400">
                {filteredJournals.length}
              </span>{" "}
              journal{filteredJournals.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Journal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentJournals.map((journal, index) => {
              // Alternating yellow and black pattern
              const isYellowCard = index % 2 === 0;
              const cardBgClass = isYellowCard ? "bg-yellow-400" : "bg-black";
              const textColorClass = isYellowCard
                ? "text-black"
                : "text-yellow-400";
              const buttonBgClass = isYellowCard
                ? "bg-black hover:bg-gray-900"
                : "bg-yellow-400 hover:bg-yellow-500";
              const buttonTextClass = isYellowCard
                ? "text-yellow-400"
                : "text-black";

              return (
                <div
                  key={journal.id}
                  className={`${cardBgClass} backdrop-blur-lg rounded-xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 border ${
                    isYellowCard ? "border-yellow-500" : "border-yellow-400"
                  }`}
                >
                  {/* Journal Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={`${STORAGE_URL}${journal.image}`}
                      
                      alt={journal.j_title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image if the journal image fails to load
                        e.target.src =
                          "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>

                  {/* Journal Content */}
                  <div className="p-6 flex flex-col items-center text-center">
                    <h3
                      className={`text-lg font-bold ${textColorClass} mb-4 line-clamp-2 min-h-[3.5rem]`}
                    >
                      {journal.j_title}
                    </h3>

                    {/* Journal Details */}
                    {/* <div className={`text-sm ${textColorClass} mb-4 text-center`}>
                      {journal.issn_online && (
                        <p className="mb-1">ISSN Online: {journal.issn_online_no}</p>
                      )}
                      {journal.ugc_approved && (
                        <p className="mb-1">UGC Approved: {journal.ugc_no}</p>
                      )}
                      <p className="font-semibold">Amount: ${journal.amount}</p>
                    </div> */}

                    {/* View Button */}
                    <button
                      onClick={() => handleViewClick(journal.j_title)}
                      className={`${buttonBgClass} ${buttonTextClass} px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg cursor-pointer`}
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredJournals.length === 0 && journals.length > 0 && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No journals found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter
              </p>
            </div>
          )}

          {/* No Journals Available */}
          {journals.length === 0 && !loading && (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No journals available
              </h3>
              <p className="text-gray-500">
                There are currently no journals in the library.
              </p>
            </div>
          )}

          {/* Pagination */}
          {filteredJournals.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-800 border border-gray-700 rounded-lg p-4">
              {/* Page Info */}
              <div className="text-gray-400">
                Page{" "}
                <span className="font-semibold text-yellow-400">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-yellow-400">
                  {totalPages}
                </span>
              </div>

              {/* Pagination Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg ${
                    currentPage === 1
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-400 text-black hover:bg-yellow-500"
                  } transition-all`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-4 py-2 rounded-lg font-semibold ${
                            currentPage === pageNumber
                              ? "bg-yellow-400 text-black"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          } transition-all`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={pageNumber} className="px-2 text-gray-500">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg cursor-pointer ${
                    currentPage === totalPages
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-yellow-400 text-black hover:bg-yellow-500"
                  } transition-all`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewJournalList;
