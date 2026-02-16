import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar,
  Users,
  Clock,
  Youtube,
  Image as ImageIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HandleInnovation = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [innovations, setInnovations] = useState({
    upcoming: [],
    popular: [],
    recent: [],
  });
  const [activeTab, setActiveTab] = useState("upcoming");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch innovations data
  const fetchInnovations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/innovations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        console.log("Fetched innovations:", response.data);
        setInnovations({
          upcoming: response.data.upcoming || [],
          popular: response.data.popular || [],
          recent: response.data.recent || [],
        });
      }
    } catch (error) {
      console.error("Error fetching innovations:", error);
      toast.error("Failed to load innovations");
    } finally {
      setLoading(false);
    }
  };

  // Delete innovation
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this innovation?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await axios.delete(`${API_URL}api/innovations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        toast.success("Innovation deleted successfully");
        fetchInnovations(); // Refresh the list
      }
    } catch (error) {
      console.error("Error deleting innovation:", error);
      toast.error("Failed to delete innovation");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/add-innovation?update=${id}`);
  };

  // Navigate to add page
  const handleAdd = () => {
    navigate("/add-innovation");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Extract YouTube video ID or check if it's an image
  const getMediaInfo = (url) => {
    if (!url) return { type: "none", src: null };

    // ✅ YouTube check
    const youtubeMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/,
    );

    if (youtubeMatch) {
      return {
        type: "youtube",
        src: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`,
      };
    }

    // ✅ Image check
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"];

    const isImageUrl =
      imageExtensions.some((ext) => url.toLowerCase().includes(ext)) ||
      url.includes("innovations");

    if (isImageUrl) {
      const fullImageUrl = url.startsWith("http")
        ? url
        : `${STORAGE_URL}${url}`;

      return {
        type: "image",
        src: fullImageUrl,
      };
    }

    return { type: "none", src: null };
  };

  useEffect(() => {
    fetchInnovations();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentData = innovations[activeTab];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Innovations
          </h1>
          <p className="text-gray-600 mt-2">
            Create, edit, and manage innovation content
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Innovation</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            {
              key: "upcoming",
              label: "Upcoming",
              count: innovations.upcoming.length,
            },
            {
              key: "popular",
              label: "Popular",
              count: innovations.popular.length,
            },
            {
              key: "recent",
              label: "Recent",
              count: innovations.recent.length,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-gray-100 text-gray-900 px-2 py-1 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Innovation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentData.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No innovations found
              </h3>
              <p className="text-gray-600 mb-4">
                {activeTab === "upcoming"
                  ? "No upcoming innovations scheduled."
                  : `No ${activeTab} innovations available.`}
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Innovation</span>
              </button>
            </div>
          </div>
        ) : (
          currentData.map((innovation) => {
            const mediaInfo = getMediaInfo(innovation.image_video);

            return (
              <div
                key={innovation.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                {/* Image/Video Thumbnail */}
                <div className="relative h-48 bg-gray-200">
                  {mediaInfo.type === "youtube" && mediaInfo.src ? (
                    <div className="relative w-full h-full">
                      <img
                        src={mediaInfo.src}
                        alt={innovation.image_alt_tag}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                        <Youtube className="w-12 h-12 text-red-600" />
                      </div>
                    </div>
                  ) : mediaInfo.type === "image" && mediaInfo.src ? (
                    <div className="relative w-full h-full">
                      <img
                        src={mediaInfo.src}
                        alt={innovation.image_alt_tag}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, show fallback
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center hidden">
                        <ImageIcon className="w-12 h-12 text-blue-600" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                      <div className="text-center">
                        <ImageIcon className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                        <span className="text-blue-600 font-medium">
                          No Media
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        innovation.is_upcomming
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {innovation.is_upcomming ? "Upcoming" : "Published"}
                    </span>
                  </div>

                  {/* View Count */}
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                      <Eye className="w-3 h-3" />
                      <span>{innovation.view_count}</span>
                    </span>
                  </div>

                  {/* Media Type Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        mediaInfo.type === "youtube"
                          ? "bg-red-100 text-red-800"
                          : mediaInfo.type === "image"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {mediaInfo.type === "youtube"
                        ? "Video"
                        : mediaInfo.type === "image"
                          ? "Image"
                          : "No Media"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title and Description */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {innovation.page_title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {innovation.description}
                  </p>

                  {/* Innovator Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {innovation.innovator_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {innovation.innovator_email}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(innovation.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>Updated {formatDate(innovation.updated_at)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(innovation.id)}
                        className="flex items-center space-x-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(innovation.id)}
                        disabled={deleteLoading === innovation.id}
                        className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      >
                        {deleteLoading === innovation.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        <span className="text-sm">Delete</span>
                      </button>
                    </div>

                    {/* PDF Download */}
                    {/* {innovation.pdf && (
                      <a
                        href={`${API_URL}${innovation.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                      >
                        <Download className="w-4 h-4" />
                        <span className="text-sm">PDF</span>
                      </a>
                    )} */}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Upcoming</p>
              <p className="text-2xl font-bold text-blue-900">
                {innovations.upcoming.length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Popular</p>
              <p className="text-2xl font-bold text-green-900">
                {innovations.popular.length}
              </p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Recent</p>
              <p className="text-2xl font-bold text-purple-900">
                {innovations.recent.length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HandleInnovation;
