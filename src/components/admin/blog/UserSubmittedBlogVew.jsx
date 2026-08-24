import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCheck,
  faTimes,
  faSearch,
  faFilter,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
  faEdit,
  faTimes as faTimesIcon,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../common/Loader";

const UserSubmittedBlogVew = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittedBlogs, setSubmittedBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  
  // Update form state
  const [updateForm, setUpdateForm] = useState({
    is_update: "0",
    comment: "",
    blogId: null,
  });

  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch submitted blogs
  const fetchSubmittedBlogs = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}api/admin/blogs/user-blog-list`, {
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
        toast.error(response.data.message || "Failed to fetch submitted blogs");
      }
    } catch (error) {
      console.error("Error fetching submitted blogs:", error);
      toast.error(error.response?.data?.message || "Failed to fetch submitted blogs");
    } finally {
      setLoading(false);
    }
  };

  // Update statistics
  const updateStats = (blogs) => {
    const pending = blogs.filter(b => b.status === false || b.status === 0 || b.status === "0").length;
    const approved = blogs.filter(b => b.status === true || b.status === 1 || b.status === "1").length;
    
    setStats({
      total: blogs.length,
      pending,
      approved,
      rejected: 0, // No rejected status in your API
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
      }
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchLower) ||
        blog.author?.toLowerCase().includes(searchLower) ||
        blog.created_by?.name?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredBlogs(filtered);
  }, [searchTerm, statusFilter, submittedBlogs]);

  // Handle view blog details
  const handleViewDetails = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  // Handle open update modal
  const handleOpenUpdate = (blog) => {
    setUpdateForm({
      is_update: blog.is_update || "0",
      comment: blog.comment || "",
      blogId: blog.id,
    });
    setShowUpdateModal(true);
    setShowModal(false);
  };

  // Handle update form change
  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle update submit
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!updateForm.blogId) return;
    
    setActionLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}api/admin/blogs/comment/${updateForm.blogId}`,
        {
          is_update: updateForm.is_update,
          comment: updateForm.comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.flag === 1 || response.status === 200) {
        toast.success("Blog updated successfully!");
        setShowUpdateModal(false);
        fetchSubmittedBlogs();
      } else {
        toast.error(response.data.message || "Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error(error.response?.data?.message || "Failed to update blog");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle approve/reject blog (status toggle)
  const handleStatusToggle = async (blogId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "approve" : "reject";
    
    if (!window.confirm(`Are you sure you want to ${action} this blog?`)) {
      return;
    }
    
    setActionLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}api/admin/blogs/status/${blogId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === true || response.status === 200) {
        toast.success(`Blog ${action}d successfully!`);
        fetchSubmittedBlogs();
        setShowModal(false);
      } else {
        toast.error(response.data.message || `Failed to ${action} blog`);
      }
    } catch (error) {
      console.error(`Error ${action}ing blog:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} blog`);
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const isActive = status === true || status === 1 || status === "1";
    
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
          Pending
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
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Submitted Blogs</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage blogs submitted by users</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search by title, author..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                #ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Submitted By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Submitted Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 border-2">
                    <div className="max-w-xs truncate">
                      {blog.title || 'Untitled'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {blog.author || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    <div>
                      <div className="font-medium">{blog.created_by?.name || 'Unknown'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {blog.category?.category_name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    {getStatusBadge(blog.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {formatDate(blog.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    <button
                      onClick={() => handleViewDetails(blog)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-300 mr-2"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="font-medium">No submitted blogs found</p>
                    <p className="text-xs text-gray-400 mt-1">No blogs match your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {filteredBlogs.length > 0 ? 1 : 0} to {filteredBlogs.length} of {submittedBlogs.length} rows
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
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">Status:</span>
                  {getStatusBadge(selectedBlog.status)}
                  {selectedBlog.is_update === "1" && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Needs Update
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
                    src={selectedBlog.image.startsWith('http') ? selectedBlog.image : `${STORAGE_URL}${selectedBlog.image}`}
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
                  <label className="text-xs font-semibold text-gray-500 uppercase">Submitted By</label>
                  <p className="text-gray-900">{selectedBlog.created_by?.name || 'Unknown'}</p>
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
                  <label className="text-xs font-semibold text-gray-500 uppercase">Needs Update</label>
                  <p className="text-gray-900">{selectedBlog.is_update === "1" ? "Yes" : "No"}</p>
                </div>
                {selectedBlog.comment && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Admin Comment</label>
                    <p className="text-gray-700 mt-1 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {selectedBlog.comment}
                    </p>
                  </div>
                )}
                {selectedBlog.blog_pdf && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">PDF Attachment</label>
                    <div className="mt-1">
                      <a
                        href={selectedBlog.blog_pdf.startsWith('http') ? selectedBlog.blog_pdf : `${STORAGE_URL}${selectedBlog.blog_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        View PDF
                      </a>
                    </div>
                  </div>
                )}
              </div>

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
                <button
                  onClick={() => handleOpenUpdate(selectedBlog)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center"
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Update
                </button>
                
                {selectedBlog.status === false || selectedBlog.status === 0 || selectedBlog.status === "0" ? (
                  <button
                    onClick={() => handleStatusToggle(selectedBlog.id, selectedBlog.status)}
                    disabled={actionLoading}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    ) : (
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    )}
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusToggle(selectedBlog.id, selectedBlog.status)}
                    disabled={actionLoading}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    ) : (
                      <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    )}
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 rounded-t-xl flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Update Blog</h3>
              <button
                onClick={() => setShowUpdateModal(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FontAwesomeIcon icon={faTimesIcon} className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleUpdateSubmit} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Needs Update
                </label>
                <select
                  name="is_update"
                  value={updateForm.is_update}
                  onChange={handleUpdateChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="0">No</option>
                  <option value="1">Yes - Needs Update</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select "Yes" if the author needs to make changes to their blog
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment / Feedback
                </label>
                <textarea
                  name="comment"
                  value={updateForm.comment}
                  onChange={handleUpdateChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical"
                  placeholder="Enter feedback or instructions for the author..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Provide detailed feedback to help the author improve their blog
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSubmittedBlogVew;