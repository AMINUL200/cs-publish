import {
  faEdit,
  faTrash,
  faSearch,
  faPlus,
  faCheck,
  faTimes,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../common/Loader";

const ViewBlog = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null); // per-row delete
  const [actionLoadingId, setActionLoadingId] = useState(null); // per-row status toggle
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // ---------------- FETCH ----------------
  const fetchBlogData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.status === 200) {
        setBlogData(response.data.data || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchBlogData();
  }, [fetchBlogData]);

  // ---------------- SEARCH ----------------
  const filteredBlogs = blogData.filter((blog) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      blog.title?.toLowerCase().includes(searchLower) ||
      blog.author?.toLowerCase().includes(searchLower)
    );
  });

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    setDeleteLoadingId(id);
    try {
      const response = await axios.delete(`${API_URL}api/admin/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success(response.data.message || "Blog deleted successfully");
        setBlogData((prev) => prev.filter((b) => b.id !== id)); // optimistic
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // ---------------- STATUS TOGGLE ----------------
  const handleStatusToggle = async (blogId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this blog?`)) {
      return;
    }

    setActionLoadingId(blogId);
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
        fetchBlogData(); // ✅ was fetchSubmittedBlogs()
      } else {
        toast.error(response.data.message || `Failed to ${action} blog`);
      }
    } catch (error) {
      console.error(`Error ${action}ing blog:`, error);
      toast.error(
        error.response?.data?.message || `Failed to ${action} blog`
      );
    } finally {
      setActionLoadingId(null); // ✅ was setShowModal(false)
    }
  };

  // ---------------- NAVIGATE ----------------
  const handleNavigate = (id) => {
    if (!id) return;
    navigate(`/blog/view/${id}`);
  };

  // ---------------- STATUS BADGE ----------------
  const renderStatusBadge = (blog) => {
    // Handles both boolean `status` and string statuses if your API uses them
    if (blog.status === true || blog.status === 1 || blog.status === "approved") {
      return (
        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          <FontAwesomeIcon icon={faCheck} className="mr-1" />
          Approved
        </span>
      );
    }
    if (blog.status === false || blog.status === 0 || blog.status === "rejected") {
      return (
        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          <FontAwesomeIcon icon={faTimes} className="mr-1" />
          Rejected
        </span>
      );
    }
    return (
      <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        <FontAwesomeIcon icon={faClock} className="mr-1" />
        Pending
      </span>
    );
  };

  // ---------------- LOADING ----------------
  if (loading) return <Loader />;

  // ---------------- RENDER ----------------
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">VIEW BLOGS</h1>
        <Link
          to="/blog/add"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Blog
        </Link>
      </div>

      <div className="flex justify-end mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search by title or author..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["Title", "Author", "Image", "Status", "Action"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog) => {
                const isToggling = actionLoadingId === blog.id;
                const isDeleting = deleteLoadingId === blog.id;
                const isApproved =
                  blog.status === true ||
                  blog.status === 1 ||
                  blog.status === "approved";

                return (
                  <tr key={blog.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                      {blog.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 border-2">
                      <img
                        src={`${STORAGE_URL}${blog.image}`}
                        alt="Blog"
                        className="w-16 h-16 object-cover mt-1"
                      />
                    </td>

                    {/* ---------- STATUS ---------- */}
                    <td className="px-6 py-4 whitespace-nowrap border-2">
                      {renderStatusBadge(blog)}
                    </td>

                    {/* ---------- ACTIONS ---------- */}
                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                      {/* Status Toggle */}
                      <button
                        onClick={() =>
                          handleStatusToggle(blog.id, blog.status)
                        }
                        disabled={isToggling}
                        className={`text-white px-3 py-1 rounded mr-2 transition-colors duration-300 ${
                          isToggling
                            ? "bg-gray-500 cursor-not-allowed"
                            : isApproved
                            ? "bg-yellow-500 hover:bg-yellow-600 cursor-pointer"
                            : "bg-green-500 hover:bg-green-600 cursor-pointer"
                        }`}
                        title={isApproved ? "Reject blog" : "Approve blog"}
                      >
                        <FontAwesomeIcon
                          icon={isApproved ? faTimes : faCheck}
                          className="mr-1"
                        />
                        {isToggling
                          ? "Updating..."
                          : isApproved
                          ? "Reject"
                          : "Approve"}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleNavigate(blog.id)}
                        disabled={isDeleting || isToggling}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FontAwesomeIcon icon={faEdit} className="mr-1" />
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={isDeleting || isToggling}
                        className={`text-white px-3 py-1 rounded transition-colors duration-300 ${
                          isDeleting
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 cursor-pointer"
                        }`}
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No blogs found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {filteredBlogs.length} of {blogData.length} rows
        </div>
      </div>
    </div>
  );
};

export default ViewBlog;