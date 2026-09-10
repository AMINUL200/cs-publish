import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  User,
  FileText,
  Youtube,
  Image as ImageIcon,
  Video,
  Download,
  ExternalLink,
  Share2,
  Mail,
  Link as LinkIcon,
  Loader2,
  X,
  AlertCircle,
  Send,
  RefreshCw,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import Breadcrumb from "../../../components/common/Breadcrumb";

const AdminViewSubmittedMentors = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | pending | active
  const [actionLoading, setActionLoading] = useState(null);

  // ==========================================
  // MODAL STATES
  // ==========================================
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // ==========================================
  // FETCH SUBMISSIONS
  // ==========================================
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}api/admin/user/events`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.data.status) {
        setSubmissions(response.data.data || []);
        setFilteredSubmissions(response.data.data || []);
      } else {
        throw new Error(response.data.message || "Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError(
        error.response?.data?.message || "Failed to load submitted events"
      );
      toast.error("Failed to load submitted events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // ==========================================
  // FILTER LOGIC
  // ==========================================
  useEffect(() => {
    let filtered = [...submissions];

    // Filter by status
    if (filterStatus === "pending") {
      filtered = filtered.filter(
        (item) => item.is_active === 0 || item.is_active === "0"
      );
    } else if (filterStatus === "active") {
      filtered = filtered.filter(
        (item) => item.is_active === 1 || item.is_active === "1"
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.event_name?.toLowerCase().includes(term) ||
          item.catagory?.toLowerCase().includes(term) ||
          item.creator?.name?.toLowerCase().includes(term) ||
          item.creator?.email?.toLowerCase().includes(term)
      );
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, filterStatus, submissions]);

  // ==========================================
  // HANDLE ACTIVATE EVENT
  // POST: events/active/{id}
  // ==========================================
  const handleActivate = async (id) => {
    if (!window.confirm("Are you sure you want to activate this event?")) return;

    try {
      setActionLoading(id);
      const response = await axios.post(
        `${API_URL}api/events/active/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message || "Event activated successfully");
        await fetchSubmissions();
      } else {
        throw new Error(response.data.message || "Failed to activate");
      }
    } catch (error) {
      console.error("Error activating event:", error);
      toast.error(error.response?.data?.message || "Failed to activate event");
    } finally {
      setActionLoading(null);
    }
  };

  // ==========================================
  // HANDLE COMMENT MODAL
  // ==========================================
  const openCommentModal = (event) => {
    setSelectedEvent(event);
    setCommentText(event.comment || "");
    setShowCommentModal(true);
  };

  const closeCommentModal = () => {
    setShowCommentModal(false);
    setSelectedEvent(null);
    setCommentText("");
  };

  // ==========================================
  // SUBMIT COMMENT
  // POST: events/comment/{id}
  // Body: { comment, is_update: 1 }
  // ==========================================
  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    try {
      setCommentLoading(true);
      const response = await axios.post(
        `${API_URL}api/events/comment/${selectedEvent.id}`,
        {
          comment: commentText.trim(),
          is_update: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toast.success(
          response.data.message || "Comment submitted successfully"
        );
        await fetchSubmissions();
        closeCommentModal();
      } else {
        throw new Error(response.data.message || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error(error.response?.data?.message || "Failed to submit comment");
    } finally {
      setCommentLoading(false);
    }
  };

  // ==========================================
  // MEDIA HELPERS
  // ==========================================
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const getMediaUrl = (imageVideo) => {
    if (!imageVideo) return null;
    if (
      imageVideo.startsWith("http://") ||
      imageVideo.startsWith("https://")
    ) {
      return imageVideo;
    }
    if (imageVideo.startsWith("/tmp/")) return null;
    return `${STORAGE_URL}${imageVideo}`;
  };

  const getMediaType = (event) => {
    if (event.media_type) return event.media_type;
    const url = event.image_video || "";
    if (url.includes("youtube.com") || url.includes("youtu.be"))
      return "youtube";
    if (
      url.includes(".mp4") ||
      url.includes(".webm") ||
      url.includes(".ogg")
    )
      return "video";
    return "image";
  };

  // ==========================================
  // RENDER MEDIA THUMBNAIL
  // ==========================================
  const renderMediaThumbnail = (event) => {
    const mediaType = getMediaType(event);
    const mediaUrl = getMediaUrl(event.image_video);

    // No media
    if (!mediaUrl && mediaType !== "youtube") {
      return (
        <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-t-lg">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
      );
    }

    // YouTube
    if (mediaType === "youtube") {
      const videoId = getYoutubeVideoId(event.image_video);
      return (
        <div className="relative w-full h-40 overflow-hidden rounded-t-lg bg-black">
          {videoId ? (
            <>
              <img
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={event.title}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/400x200?text=YouTube";
                }}
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white ml-0.5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-40 flex items-center justify-center">
              <Youtube className="w-12 h-12 text-red-500" />
            </div>
          )}
        </div>
      );
    }

    // Video
    if (mediaType === "video") {
      return (
        <div className="relative w-full h-40 overflow-hidden rounded-t-lg bg-black">
          <video
            src={mediaUrl}
            className="w-full h-40 object-cover"
            muted
            onMouseOver={(e) => e.target.play()}
            onMouseOut={(e) => {
              e.target.pause();
              e.target.currentTime = 0;
            }}
          />
          <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
            <Video className="w-3 h-3" /> Video
          </div>
        </div>
      );
    }

    // Image
    return (
      <div className="relative w-full h-40 overflow-hidden rounded-t-lg">
        <img
          src={mediaUrl}
          alt={event.image_alt_tag || event.title}
          className="w-full h-40 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=Event";
          }}
        />
        <div className="absolute top-2 left-2 bg-gray-700 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
          <ImageIcon className="w-3 h-3" /> Image
        </div>
      </div>
    );
  };

  // ==========================================
  // FORMAT DATE
  // ==========================================
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ==========================================
  // GET STATUS BADGE
  // ==========================================
  const getStatusBadge = (isActive) => {
    const isActiveBool = isActive === 1 || isActive === "1";
    return isActiveBool ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
        <CheckCircle className="w-3 h-3" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
        <AlertCircle className="w-3 h-3" />
        Pending
      </span>
    );
  };

  // ==========================================
  // STATS
  // ==========================================
  const stats = {
    total: submissions.length,
    pending: submissions.filter(
      (s) => s.is_active === 0 || s.is_active === "0"
    ).length,
    active: submissions.filter(
      (s) => s.is_active === 1 || s.is_active === "1"
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
       
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Submissions
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchSubmissions}
              className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
     

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                User Submitted Mentors
              </h1>
              <p className="text-gray-600 mt-1">
                Review, comment, and activate user-submitted mentor events
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-gray-600 text-sm">Total Submissions</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <div className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </div>
              <div className="text-gray-600 text-sm">Pending Review</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="text-2xl font-bold text-gray-900">
                {stats.active}
              </div>
              <div className="text-gray-600 text-sm">Active Events</div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, event name, category, or creator..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Only</option>
                  <option value="active">Active Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submissions Grid */}
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm || filterStatus !== "all"
                  ? "No matching submissions"
                  : "No submissions yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "User-submitted events will appear here"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden flex flex-col"
                >
                  {/* Media Thumbnail */}
                  {renderMediaThumbnail(event)}

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Status + Date */}
                    <div className="flex items-center justify-between mb-2">
                      {getStatusBadge(event.is_active)}
                      <span className="text-xs text-gray-500">
                        {formatDate(event.created_at)}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="text-xs font-medium text-yellow-600 mb-1">
                      {event.catagory}
                    </div>

                    {/* Title */}
                    <h3 className="font-bold text-gray-900 text-base mb-1 line-clamp-2">
                      {event.title}
                    </h3>

                    {/* Event Name */}
                    {event.event_name && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                        {event.event_name}
                      </p>
                    )}

                    {/* Creator Info */}
                    {event.creator && (
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <User className="w-3 h-3" />
                        <span className="truncate">
                          {event.creator.name || event.creator.email}
                        </span>
                      </div>
                    )}

                    {/* Comment Preview */}
                    {event.comment && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3 text-xs">
                        <div className="flex items-start gap-1">
                          <MessageSquare className="w-3 h-3 text-yellow-600 flex-shrink-0 mt-0.5" />
                          <span className="text-yellow-800 line-clamp-2">
                            {event.comment}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-3 mt-auto">
                      {event.pdf && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> PDF
                        </span>
                      )}
                      {event.ppt && (
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" /> PPT
                        </span>
                      )}
                      {event.share_links?.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />{" "}
                          {event.share_links.length}
                        </span>
                      )}
                      {event.drive_link && (
                        <span className="flex items-center gap-1">
                          <LinkIcon className="w-3 h-3" /> Drive
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowDetailModal(true);
                        }}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        View
                      </button>

                      <button
                        onClick={() => openCommentModal(event)}
                        className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Comment
                      </button>

                      {event.is_active === 0 || event.is_active === "0" ? (
                        <button
                          onClick={() => handleActivate(event.id)}
                          disabled={actionLoading === event.id}
                          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                        >
                          {actionLoading === event.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle className="w-3.5 h-3.5" />
                          )}
                          Activate
                        </button>
                      ) : (
                        <span className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* COMMENT MODAL */}
      {/* ========================================== */}
      {showCommentModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">
                    Admin Comment
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {selectedEvent.title}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCommentModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleSubmitComment}>
              <div className="p-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment for the user{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={5}
                  placeholder="e.g., Please update the event description and add more details..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  This comment will be visible to the user who submitted this
                  event.
                </p>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gray-200 flex gap-3">
                <button
                  type="button"
                  onClick={closeCommentModal}
                  disabled={commentLoading}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={commentLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {commentLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit Comment
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* DETAIL MODAL */}
      {/* ========================================== */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Event Details
              </h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEvent(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto flex-1 space-y-5">
              {/* Status Row */}
              <div className="flex items-center gap-3">
                {getStatusBadge(selectedEvent.is_active)}
                <span className="text-xs text-gray-500">
                  Submitted: {formatDate(selectedEvent.created_at)}
                </span>
              </div>

              {/* Media Preview */}
              <div>{renderMediaThumbnail(selectedEvent)}</div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Title
                </label>
                <p className="text-lg font-bold text-gray-900">
                  {selectedEvent.title}
                </p>
              </div>

              {/* Category & Event Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Category
                  </label>
                  <p className="text-sm text-gray-800">
                    {selectedEvent.catagory}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Event Name
                  </label>
                  <p className="text-sm text-gray-800">
                    {selectedEvent.event_name || "N/A"}
                  </p>
                </div>
              </div>

              {/* Description */}
              {selectedEvent.description && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Short Description
                  </label>
                  <p className="text-sm text-gray-700">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              {/* Event Description */}
              {selectedEvent.event_desc && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Event Description
                  </label>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {selectedEvent.event_desc}
                  </p>
                </div>
              )}

              {/* Long Description */}
              {selectedEvent.long_description && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Long Description
                  </label>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {selectedEvent.long_description}
                  </p>
                </div>
              )}

              {/* Event Email */}
              {selectedEvent.event_email && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Event Email
                  </label>
                  <a
                    href={`mailto:${selectedEvent.event_email}`}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Mail className="w-3 h-3" />
                    {selectedEvent.event_email}
                  </a>
                </div>
              )}

              {/* Creator */}
              {selectedEvent.creator && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Submitted By
                  </label>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>
                      {selectedEvent.creator.name} ({selectedEvent.creator.email})
                    </span>
                  </div>
                </div>
              )}

              {/* Resources */}
              {(selectedEvent.pdf ||
                selectedEvent.ppt ||
                selectedEvent.drive_link) && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
                    Resources
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.pdf && (
                      <a
                        href={`${STORAGE_URL}${selectedEvent.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </a>
                    )}
                    {selectedEvent.ppt && (
                      <a
                        href={`${STORAGE_URL}${selectedEvent.ppt}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        PPT
                      </a>
                    )}
                    {selectedEvent.drive_link && (
                      <a
                        href={selectedEvent.drive_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Drive Link
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Share Links */}
              {selectedEvent.share_links?.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
                    Share Links
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.share_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                        {link.key}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Social Links */}
              {selectedEvent.event_social_links?.length > 0 && (
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">
                    Event Social Links
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.event_social_links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Share2 className="w-3 h-3" />
                        {link.key}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Admin Comment */}
              {selectedEvent.comment && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <label className="text-xs font-semibold text-yellow-800 uppercase block mb-1">
                    Admin Comment
                  </label>
                  <p className="text-sm text-yellow-800">
                    {selectedEvent.comment}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedEvent(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  openCommentModal(selectedEvent);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Add Comment
              </button>
              {(selectedEvent.is_active === 0 ||
                selectedEvent.is_active === "0") && (
                <button
                  onClick={() => {
                    handleActivate(selectedEvent.id);
                    setShowDetailModal(false);
                    setSelectedEvent(null);
                  }}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Activate
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminViewSubmittedMentors;