import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  Users,
  FileText,
  Share2,
  Mail,
  Search,
  Filter,
  Download,
  ExternalLink
} from "lucide-react";
import { toast } from "react-toastify";

const HandleMentorHub = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUpcoming, setFilterUpcoming] = useState("all");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch mentors data
  const fetchMentors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setMentors(response.data.data);
      } else {
        throw new Error("Failed to fetch mentors data");
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      setError(error.response?.data?.message || error.message);
      toast.error("Failed to load mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // Delete mentor
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mentor event?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      const response = await axios.delete(`${API_URL}api/events/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        toast.success("Mentor event deleted successfully");
        fetchMentors(); // Refresh the list
      } else {
        throw new Error(response.data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting mentor:", error);
      toast.error(error.response?.data?.message || "Failed to delete mentor");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Edit mentor
  const handleEdit = (id) => {
    navigate(`/add-mentor?update=${id}`);
  };

  // Add new mentor
  const handleAddNew = () => {
    navigate("/add-mentor");
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter mentors based on search and filter
  const filteredMentors = mentors.filter((mentor) => {
    const matchesSearch = 
      mentor.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.event_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.catagory?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterUpcoming === "all" || 
      (filterUpcoming === "upcoming" && mentor.is_upcomming === "1") ||
      (filterUpcoming === "past" && mentor.is_upcomming === "0");

    return matchesSearch && matchesFilter;
  });

  // Get social links count
  const getSocialLinksCount = (mentor) => {
    let count = 0;
    if (mentor.share_links && typeof mentor.share_links === 'object') {
      count += Object.keys(mentor.share_links).length;
    }
    if (mentor.event_social_links && typeof mentor.event_social_links === 'object') {
      count += Object.keys(mentor.event_social_links).length;
    }
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 rounded"></div>
          </div>

          {/* Controls Skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 animate-pulse">
            <div className="h-12 bg-gray-200 rounded flex-1"></div>
            <div className="h-12 bg-gray-200 rounded w-48"></div>
            <div className="h-12 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Mentors</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMentors}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Mentor Hub
          </h1>
          <p className="text-gray-600">
            Create, edit, and manage mentor events and resources
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search mentors by title, event name, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterUpcoming}
            onChange={(e) => setFilterUpcoming(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="past">Past Events</option>
          </select>

          {/* Add New Button */}
          <button
            onClick={handleAddNew}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-gray-900">{mentors.length}</div>
            <div className="text-gray-600 text-sm">Total Events</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-600">
            <div className="text-2xl font-bold text-gray-900">
              {mentors.filter(m => m.is_upcomming === "1").length}
            </div>
            <div className="text-gray-600 text-sm">Upcoming Events</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-black">
            <div className="text-2xl font-bold text-gray-900">
              {mentors.filter(m => m.view_count > 0).length}
            </div>
            <div className="text-gray-600 text-sm">Viewed Events</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-400">
            <div className="text-2xl font-bold text-gray-900">
              {mentors.filter(m => m.pdf || m.ppt).length}
            </div>
            <div className="text-gray-600 text-sm">With Resources</div>
          </div>
        </div>

        {/* Mentors Grid */}
        {filteredMentors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm || filterUpcoming !== "all" ? "No matching mentors found" : "No mentors available"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterUpcoming !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "Get started by creating your first mentor event"
              }
            </p>
            <button
              onClick={handleAddNew}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Add New Mentor Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMentors.map((mentor) => (
              <div
                key={mentor.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
              >
                {/* Image/Video Section */}
                <div className="relative h-48 bg-gray-100">
                  {mentor.image_video ? (
                    <img
                      src={mentor.image_video}
                      alt={mentor.image_alt_tag || mentor.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Event+Image';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-red-50">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                    mentor.is_upcomming === "1" 
                      ? "bg-green-500 text-white" 
                      : "bg-gray-500 text-white"
                  }`}>
                    {mentor.is_upcomming === "1" ? "Upcoming" : "Past"}
                  </div>

                  {/* View Count */}
                  <div className="absolute top-3 left-3 bg-black bg-opacity-75 text-white px-2 py-1 rounded-full text-xs">
                    <Eye className="w-3 h-3 inline mr-1" />
                    {mentor.view_count}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Category */}
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">
                      {mentor.catagory}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">
                    {mentor.title}
                  </h3>

                  {/* Event Name */}
                  {mentor.event_name && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-1">
                      {mentor.event_name}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(mentor.updated_at)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {/* Social Links Count */}
                      {getSocialLinksCount(mentor) > 0 && (
                        <div className="flex items-center space-x-1">
                          <Share2 className="w-4 h-4" />
                          <span>{getSocialLinksCount(mentor)}</span>
                        </div>
                      )}

                      {/* Resources */}
                      {(mentor.pdf || mentor.ppt) && (
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{(mentor.pdf ? 1 : 0) + (mentor.ppt ? 1 : 0)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => handleEdit(mentor.id)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-3 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    
                    <button
                      onClick={() => handleDelete(mentor.id)}
                      disabled={deleteLoading === mentor.id}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded text-sm font-semibold transition-colors flex items-center justify-center space-x-1 disabled:opacity-50"
                    >
                      {deleteLoading === mentor.id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        {filteredMentors.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredMentors.length} of {mentors.length} mentor events
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleMentorHub;