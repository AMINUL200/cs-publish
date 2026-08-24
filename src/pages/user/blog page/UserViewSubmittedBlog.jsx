import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSearch,
  faFilter,
  faClock,
  faCheckCircle,
  faEdit,
  faFilePdf,
  faImage,
  faUser,
  faCalendar,
  faSpinner,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../../components/common/Breadcrumb";
import Loader from "../../../components/common/Loader";

const UserViewSubmittedBlog = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittedBlogs, setSubmittedBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    needsUpdate: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch user's submitted blogs
  const fetchSubmittedBlogs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}api/user/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      
      if (response.data.flag === 1) {
        const blogs = response.data.data || [];
        setSubmittedBlogs(blogs);
        setFilteredBlogs(blogs);
        updateStats(blogs);
      } else {
        toast.error(response.data.message || "Failed to fetch your blogs");
      }
    } catch (error) {
      console.error("Error fetching submitted blogs:", error);
      toast.error(error.response?.data?.message || "Failed to fetch your blogs");
    } finally {
      setLoading(false);
    }
  };

  // Update statistics
  const updateStats = (blogs) => {
    const pending = blogs.filter(b => b.status === false || b.status === 0 || b.status === "0").length;
    const approved = blogs.filter(b => b.status === true || b.status === 1 || b.status === "1").length;
    const needsUpdate = blogs.filter(b => b.is_update === "1").length;
    
    setStats({
      total: blogs.length,
      pending,
      approved,
      needsUpdate,
    });
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = submittedBlogs;
    
    // Apply status filter
    if (statusFilter !== "all") {
      if (statusFilter === "pending") {
        filtered = filtered.filter(blog => blog.status === false || blog.status === 0 || blog.status === "0");
      } else if (statusFilter === "approved") {
        filtered = filtered.filter(blog => blog.status === true || blog.status === 1 || blog.status === "1");
      } else if (statusFilter === "needsUpdate") {
        filtered = filtered.filter(blog => blog.is_update === "1");
      }
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchLower) ||
        blog.author?.toLowerCase().includes(searchLower) ||
        blog.category?.category_name?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredBlogs(filtered);
  }, [searchTerm, statusFilter, submittedBlogs]);

  // Handle view blog details
  const handleViewDetails = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  // Handle update blog - redirect to submit page with update parameter
  const handleUpdateBlog = (blogId) => {
    navigate(`/submit-blog?update=${blogId}`);
  };

  // Handle delete blog
  const handleDeleteBlog = async (blogId, blogTitle) => {
    if (!blogId) return;
    
    // Show confirmation dialog
    if (!window.confirm(`Are you sure you want to delete "${blogTitle || 'this blog'}"? This action cannot be undone.`)) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      const response = await axios.delete(
        `${API_URL}api/user/blogs/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (response.status === 200 || response.data.flag === 1) {
        toast.success(response.data.message || "Blog deleted successfully!");
        // Close modal if open
        setShowModal(false);
        // Refresh the list
        fetchSubmittedBlogs();
      } else {
        toast.error(response.data.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (blog) => {
    const isActive = blog.status === true || blog.status === 1 || blog.status === "1";
    const needsUpdate = blog.is_update === "1";
    
    if (needsUpdate) {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
          <FontAwesomeIcon icon={faEdit} className="mr-1" />
          Needs Update
        </span>
      );
    }
    
    if (isActive) {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-green-100 text-green-800">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
          Approved
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          Pending Review
        </span>
      );
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchSubmittedBlogs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Research Snapshot", path: "/blog" },
          { label: "My Submissions" }
        ]}
        pageTitle="My Submitted Blogs"
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              My <span className="text-yellow-600">Submissions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Track the status of your submitted blogs and respond to admin feedback
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Submissions</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faFilter} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600 font-medium">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faClock} className="text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Needs Update</p>
                  <p className="text-2xl font-bold text-purple-900">{stats.needsUpdate}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FontAwesomeIcon icon={faEdit} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setStatusFilter("approved")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "approved"
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setStatusFilter("needsUpdate")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === "needsUpdate"
                    ? "bg-purple-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Needs Update
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search by title, author..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 w-full transition-all duration-300 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Blog Cards Grid */}
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div
                  key={blog.id}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group border ${
                    blog.is_update === "1" ? 'border-purple-300 shadow-purple-100' : 'border-gray-200'
                  }`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48">
                    {blog.image ? (
                      <img
                        src={`${STORAGE_URL}${blog.image}`}
                        alt={blog.image_alt || blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/1200x800/0066cc/ffffff?text=Blog+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FontAwesomeIcon icon={faImage} className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      {getStatusBadge(blog)}
                    </div>

                    {/* Needs Update Badge - Additional indicator */}
                    {blog.is_update === "1" && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
                          Action Required
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Category */}
                    <div className="mb-2">
                      <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                        {blog.category?.category_name || 'Uncategorized'}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                      {blog.title || 'Untitled'}
                    </h3>

                    {/* Author */}
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-2" />
                      <span>By {blog.author || 'Anonymous'}</span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-gray-400 text-xs mb-3">
                      <FontAwesomeIcon icon={faCalendar} className="w-3 h-3 mr-2" />
                      <span>Submitted: {formatDate(blog.created_at)}</span>
                    </div>

                    {/* Admin Comment (if needs update) */}
                    {blog.is_update === "1" && blog.comment && (
                      <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-xs text-purple-700">
                          <span className="font-semibold">Feedback:</span> {blog.comment}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleViewDetails(blog)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FontAwesomeIcon icon={faEye} />
                        View
                      </button>
                      
                      {blog.is_update === "1" && (
                        <button
                          onClick={() => handleUpdateBlog(blog.id)}
                          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 animate-pulse"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Update
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Results State
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No submitted blogs found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== "all" 
                    ? "No blogs match your search criteria. Try adjusting your filters."
                    : "You haven't submitted any blogs yet. Start sharing your research!"
                  }
                </p>
                <button
                  onClick={() => navigate("/submit-blog")}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 transition-colors"
                >
                  Submit Your First Blog
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Blog Details</h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {getStatusBadge(selectedBlog)}
                  {selectedBlog.is_update === "1" && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Update Required
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Image */}
              {selectedBlog.image ? (
                <div className="mb-6">
                  <img
                    src={`${STORAGE_URL}${selectedBlog.image}`}
                    alt={selectedBlog.image_alt || selectedBlog.title}
                    className="w-full max-h-80 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/1200x800/0066cc/ffffff?text=Blog+Image';
                    }}
                  />
                </div>
              ) : (
                <div className="mb-6 bg-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                  <p className="text-lg font-medium text-gray-900">{selectedBlog.title || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Author</label>
                  <p className="text-lg font-medium text-gray-900">{selectedBlog.author || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                  <p className="text-gray-900">{selectedBlog.category?.category_name || 'Uncategorized'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Publication Date</label>
                  <p className="text-gray-900">{formatDate(selectedBlog.date)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Submitted Date</label>
                  <p className="text-gray-900">{formatDate(selectedBlog.created_at)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Last Updated</label>
                  <p className="text-gray-900">{formatDate(selectedBlog.updated_at)}</p>
                </div>
                {selectedBlog.blog_pdf && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">PDF Attachment</label>
                    <div className="mt-1">
                      <a
                        href={`${STORAGE_URL}${selectedBlog.blog_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-red-500" />
                        View PDF
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Comment (if needs update) */}
              {selectedBlog.is_update === "1" && selectedBlog.comment && (
                <div className="mb-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <label className="text-xs font-semibold text-purple-700 uppercase">Admin Feedback</label>
                  <p className="text-gray-700 mt-1">{selectedBlog.comment}</p>
                </div>
              )}

              {/* Description */}
              {selectedBlog.description && (
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Short Description</label>
                  <p className="text-gray-700 mt-1">{selectedBlog.description}</p>
                </div>
              )}

              {/* Long Description */}
              {selectedBlog.long_description && (
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Detailed Content</label>
                  <div 
                    className="text-gray-700 mt-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedBlog.long_description }}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-4 mt-4 flex flex-wrap gap-3">
                {selectedBlog.is_update === "1" ? (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      handleUpdateBlog(selectedBlog.id);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Update Blog
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      navigate("/submit-blog");
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Submit New Blog
                  </button>
                )}
                
                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteBlog(selectedBlog.id, selectedBlog.title)}
                  disabled={deleteLoading}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      Delete
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserViewSubmittedBlog;