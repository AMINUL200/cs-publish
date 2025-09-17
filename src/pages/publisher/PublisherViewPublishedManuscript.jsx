import React, { useState, useMemo } from "react";
import { Search, FileText, ExternalLink, Download, Calendar, User, BookOpen, Filter, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

const samplePublished = [
  {
    id: "MS100",
    title: "AI in Healthcare: Revolutionizing Patient Care Through Machine Learning",
    author: "Dr. A. Kumar",
    published: "2025-09-10",
    category: "Medical Technology",
    citations: 45,
    downloads: 1250,
    pdfUrl: "#",
    webUrl: "#",
  },
  {
    id: "MS101",
    title: "Blockchain Security: Advanced Cryptographic Protocols",
    author: "M. Roy",
    published: "2025-09-12",
    category: "Computer Science",
    citations: 28,
    downloads: 890,
    pdfUrl: "#",
    webUrl: "#",
  },
  {
    id: "MS102",
    title: "Climate Change Studies: Impact on Coastal Ecosystems",
    author: "S. Das",
    published: "2025-09-15",
    category: "Environmental Science",
    citations: 67,
    downloads: 2100,
    pdfUrl: "#",
    webUrl: "#",
  },
  {
    id: "MS103",
    title: "Quantum Computing Applications in Financial Modeling",
    author: "Dr. R. Patel",
    published: "2025-09-08",
    category: "Physics",
    citations: 52,
    downloads: 1680,
    pdfUrl: "#",
    webUrl: "#",
  },
  {
    id: "MS104",
    title: "Neuroscience Breakthroughs in Memory Formation",
    author: "Dr. L. Zhang",
    published: "2025-09-05",
    category: "Neuroscience",
    citations: 89,
    downloads: 2450,
    pdfUrl: "#",
    webUrl: "#",
  },
  {
    id: "MS105",
    title: "Sustainable Agriculture in Arid Regions",
    author: "Prof. M. Johnson",
    published: "2025-09-18",
    category: "Agricultural Science",
    citations: 34,
    downloads: 1120,
    pdfUrl: "#",
    webUrl: "#",
  },
  {
    id: "MS106",
    title: "Advanced Materials for Solar Energy Conversion",
    author: "Dr. S. Chen",
    published: "2025-09-22",
    category: "Materials Science",
    citations: 76,
    downloads: 1980,
    pdfUrl: "#",
    webUrl: "#",
  },
  {
    id: "MS107",
    title: "Machine Learning Approaches to Natural Language Processing",
    author: "Dr. K. Tanaka",
    published: "2025-09-14",
    category: "Computer Science",
    citations: 102,
    downloads: 3120,
    pdfUrl: "#",
    webUrl: "#",
  },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

const PublisherViewPublishedManuscript = () => {
  const [published] = useState(samplePublished);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("published");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredAndSortedData = useMemo(() => {
    let filtered = published.filter(
      (manuscript) =>
        manuscript.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manuscript.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manuscript.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      if (sortBy === "published") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      } else if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  }, [published, searchTerm, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    return (
      <span className="ml-1 text-xs">
        {sortOrder === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // If total pages is less than max visible, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 4;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }
      
      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Published Manuscripts</h1>
            <p className="text-lg text-gray-600 mt-1">
              Manage and track your published research works
            </p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Publications</p>
                <p className="text-2xl font-bold text-gray-900">{published.length}</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Citations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(published.reduce((sum, p) => sum + p.citations, 0))}
                </p>
              </div>
              <User className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Downloads</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(published.reduce((sum, p) => sum + p.downloads, 0))}
                </p>
              </div>
              <Download className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white shadow-xl rounded-3xl border border-gray-100 overflow-hidden">
        {/* Table Header */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">All Publications</h2>
              <p className="text-sm text-gray-500 mt-1">
                {filteredAndSortedData.length} manuscript{filteredAndSortedData.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, or category..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm min-w-[280px]"
                />
              </div>
              
              {/* Items per page dropdown */}
              <div className="relative">
                <select
                  value={itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  className="pl-10 pr-8 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white shadow-sm appearance-none w-full"
                >
                  {ITEMS_PER_PAGE_OPTIONS.map(option => (
                    <option key={option} value={option}>{option} per page</option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors border-2"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center">
                    ID {getSortIcon('id')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors border-2"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title {getSortIcon('title')}
                  </div>
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors border-2"
                  onClick={() => handleSort('author')}
                >
                  <div className="flex items-center">
                    Author {getSortIcon('author')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  Category
                </th>
                <th 
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors border-2"
                  onClick={() => handleSort('published')}
                >
                  <div className="flex items-center">
                    Published {getSortIcon('published')}
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  Metrics
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((manuscript) => (
                <tr key={manuscript.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                      {manuscript.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-2">
                    <div className="flex items-start gap-3 max-w-xs">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 leading-5 line-clamp-2">
                          {manuscript.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 font-medium">{manuscript.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {manuscript.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(manuscript.published)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-500">
                        Citations: <span className="font-semibold text-gray-700">{manuscript.citations}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Downloads: <span className="font-semibold text-gray-700">{formatNumber(manuscript.downloads)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right border-2">
                    <div className="flex justify-end gap-2">
                      <a
                        href={manuscript.pdfUrl}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </a>
                      <a
                        href={manuscript.webUrl}
                        className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                        title="View Online"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-gray-100 rounded-full">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No manuscripts found</h3>
                        <p className="text-gray-500">
                          {searchTerm 
                            ? `No manuscripts match "${searchTerm}". Try adjusting your search.`
                            : "No published manuscripts yet. Your published works will appear here."
                          }
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAndSortedData.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)}
                </span> of{" "}
                <span className="font-medium">{filteredAndSortedData.length}</span> manuscripts
              </div>
              
              <div className="flex items-center gap-1">
                {/* First page button */}
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                
                {/* Previous page button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={page === '...'}
                    className={`min-w-[40px] px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : page === '...'
                        ? 'border-transparent text-gray-500 cursor-default'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                {/* Next page button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                
                {/* Last page button */}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherViewPublishedManuscript;