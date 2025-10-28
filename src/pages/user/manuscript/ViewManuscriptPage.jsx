import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader";

const ViewManuscriptPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigation = useNavigate();

  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredManuscripts, setFilteredManuscripts] = useState([]);

  // Filter states
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Filter options
  const [groups, setGroups] = useState([]);
  const [categories, setCategories] = useState([]);
  const [journals, setJournals] = useState([]);

  // Fetch manuscripts
  const fetchManuscripts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}api/view-published-manuscript`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.status) {
        setManuscripts(res.data.data);
        setFilteredManuscripts(res.data.data);

        // Extract unique filter options from manuscripts
        extractFilterOptions(res.data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching manuscripts");
    } finally {
      setLoading(false);
    }
  };

  // Extract filter options from manuscripts data
  const extractFilterOptions = (data) => {
    const uniqueGroups = [
      ...new Set(data.map((item) => item.group_name)),
    ].filter(Boolean);
    setGroups(uniqueGroups);
  };

  // Get available categories based on selected group
  const getAvailableCategories = () => {
    if (!selectedGroup) return [];
    return [
      ...new Set(
        manuscripts
          .filter((item) => item.group_name === selectedGroup)
          .map((item) => item.category_name)
      ),
    ].filter(Boolean);
  };

  // Get available journals based on selected group and category
  const getAvailableJournals = () => {
    if (!selectedGroup || !selectedCategory) return [];
    return [
      ...new Set(
        manuscripts
          .filter(
            (item) =>
              item.group_name === selectedGroup &&
              item.category_name === selectedCategory
          )
          .map((item) => item.j_title)
      ),
    ].filter(Boolean);
  };

  // Handle group change
  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    setSelectedCategory(""); // Reset category
    setSelectedJournal(""); // Reset journal
    setCurrentPage(1); // Reset to first page
  };

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedJournal(""); // Reset journal
    setCurrentPage(1); // Reset to first page
  };

  // Handle journal change
  const handleJournalChange = (journal) => {
    setSelectedJournal(journal);
    setCurrentPage(1); // Reset to first page
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = manuscripts;

    if (selectedGroup) {
      filtered = filtered.filter((item) => item.group_name === selectedGroup);
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (item) => item.category_name === selectedCategory
      );
    }

    if (selectedJournal) {
      filtered = filtered.filter((item) => item.j_title === selectedJournal);
    }

    setFilteredManuscripts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedGroup("");
    setSelectedCategory("");
    setSelectedJournal("");
    setFilteredManuscripts(manuscripts);
    setCurrentPage(1); // Reset to first page
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredManuscripts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentManuscripts = filteredManuscripts.slice(startIndex, endIndex);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages are less than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // In the middle
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  useEffect(() => {
    fetchManuscripts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedGroup, selectedCategory, selectedJournal]);

  // Update available categories and journals when selections change
  useEffect(() => {
    setCategories(getAvailableCategories());
  }, [selectedGroup]);

  useEffect(() => {
    setJournals(getAvailableJournals());
  }, [selectedGroup, selectedCategory]);

  // Strip HTML tags from title
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Published Manuscript" },
        ]}
        pageTitle="Published Manuscript"
      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Section - Left Side */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Group Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group *
                  </label>
                  <select
                    value={selectedGroup}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="">Select Group</option>
                    {groups.map((group, index) => (
                      <option key={index} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                  {!selectedGroup && (
                    <p className="text-xs text-gray-500 mt-1">
                      Please select a group first
                    </p>
                  )}
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category {selectedGroup ? "" : "(disabled)"}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={!selectedGroup}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      !selectedGroup ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">Select Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {selectedGroup && !selectedCategory && (
                    <p className="text-xs text-gray-500 mt-1">
                      {categories.length > 0
                        ? "Select a category"
                        : "No categories available"}
                    </p>
                  )}
                </div>

                {/* Journal Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Journal {!selectedCategory ? "(disabled)" : ""}
                  </label>
                  <select
                    value={selectedJournal}
                    onChange={(e) => handleJournalChange(e.target.value)}
                    disabled={!selectedCategory}
                    className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                      !selectedCategory ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  >
                    <option value="">Select Journal</option>
                    {journals.map((journal, index) => (
                      <option key={index} value={journal}>
                        {journal}
                      </option>
                    ))}
                  </select>
                  {selectedCategory && !selectedJournal && (
                    <p className="text-xs text-gray-500 mt-1">
                      {journals.length > 0
                        ? "Select a journal"
                        : "No journals available"}
                    </p>
                  )}
                </div>

                {/* Items Per Page Dropdown */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Items per page
                  </label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="3">3 per page</option>
                    <option value="6">6 per page</option>
                    <option value="9">9 per page</option>
                    <option value="12">12 per page</option>
                    <option value="15">15 per page</option>
                  </select>
                </div>

                {/* Filter Status */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Current Filters:
                  </h3>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Group:</span>
                      <span className="font-medium">
                        {selectedGroup || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">
                        {selectedCategory || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Journal:</span>
                      <span className="font-medium">
                        {selectedJournal || "None"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-bold text-yellow-600">
                      {currentManuscripts.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-bold text-gray-800">
                      {filteredManuscripts.length}
                    </span>{" "}
                    manuscripts
                    <br />
                    <span className="text-xs text-gray-600">
                      Page {currentPage} of {totalPages}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Manuscripts Grid - Right Side */}
            <div className="lg:w-3/4">
              {filteredManuscripts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📄</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {manuscripts.length === 0
                      ? "No manuscripts published yet"
                      : "No manuscripts found"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {manuscripts.length === 0
                      ? "Check back later for published manuscripts."
                      : "Try adjusting your filters to see more results."}
                  </p>
                  {manuscripts.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* Active Filters Banner */}
                  {(selectedGroup || selectedCategory || selectedJournal) && (
                    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Active filters:
                        </span>
                        {selectedGroup && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full flex items-center">
                            Group: {selectedGroup}
                            <button
                              onClick={() => handleGroupChange("")}
                              className="ml-1 text-yellow-600 hover:text-yellow-800"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {selectedCategory && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full flex items-center">
                            Category: {selectedCategory}
                            <button
                              onClick={() => handleCategoryChange("")}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        )}
                        {selectedJournal && (
                          <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full flex items-center">
                            Journal: {selectedJournal}
                            <button
                              onClick={() => handleJournalChange("")}
                              className="ml-1 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Manuscripts Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentManuscripts.map((manuscript) => (
                      <div
                        key={manuscript.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-200"
                      >
                        {/* Image with Category Badge */}
                        <div className="relative">
                          <img
                            src={manuscript.image}
                            alt={stripHtml(manuscript.title)}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(
                                stripHtml(manuscript.title).substring(0, 30)
                              )}`;
                            }}
                          />
                          <div className="absolute top-3 left-3">
                            <span className="bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {manuscript.category_name}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          {/* Title */}
                          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 h-12">
                            {stripHtml(manuscript.title)}
                          </h3>

                          {/* Metadata */}
                          <div className="space-y-1 mb-4">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium">Author:</span>
                              <span className="ml-2">
                                {manuscript.username}
                              </span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium">Journal:</span>
                              <span className="ml-2">{manuscript.j_title}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium">Group:</span>
                              <span className="ml-2">
                                {manuscript.group_name}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              Published:{" "}
                              {new Date(
                                manuscript.created_at
                              ).toLocaleDateString()}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                if (!token) {
                                  alert(
                                    "Please log in to view this manuscript."
                                  );
                                  return;
                                }
                                navigation(
                                  `/view-published-manuscript/${manuscript.id}`
                                );
                              }}
                              className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
                            >
                              View Manuscript
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                      {/* Page Info */}
                      <div className="text-sm text-gray-600">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, filteredManuscripts.length)} of{" "}
                        {filteredManuscripts.length} results
                      </div>

                      {/* Pagination Controls */}
                      <div className="flex items-center space-x-2">
                        {/* Previous Button */}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                            currentPage === 1
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          Previous
                        </button>

                        {/* Page Numbers */}
                        <div className="flex space-x-1">
                          {getPageNumbers().map((page, index) =>
                            page === "..." ? (
                              <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-gray-500"
                              >
                                ...
                              </span>
                            ) : (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                                  currentPage === page
                                    ? "bg-yellow-500 text-white border-yellow-500"
                                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                {page}
                              </button>
                            )
                          )}
                        </div>

                        {/* Next Button */}
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                            currentPage === totalPages
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewManuscriptPage;
