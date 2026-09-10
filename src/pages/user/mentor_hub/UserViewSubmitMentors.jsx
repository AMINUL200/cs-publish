import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  Edit,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  Calendar,
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
  RefreshCw,
  Filter,
} from "lucide-react";
import { toast } from "react-toastify";
import Breadcrumb from "../../../components/common/Breadcrumb";

const UserViewSubmitMentors = () => {
  const { token, userData } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all | pending | active | needs_update

  // ==========================================
  // MODAL STATE
  // ==========================================
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // ==========================================
  // FETCH USER'S SUBMITTED EVENTS
  // ==========================================
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}api/user/events/list`, {
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
        error.response?.data?.message || "Failed to load your submissions"
      );
      console.log(error);
      toast.error("Failed to load your submissions");
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
    if (filterStatus === "needs_update") {
      filtered = filtered.filter(
        (item) => item.is_update === 1 || item.is_update === "1"
      );
    } else if (filterStatus === "pending") {
      filtered = filtered.filter(
        (item) =>
          (item.is_active === 0 || item.is_active === "0") &&
          item.is_update !== 1 &&
          item.is_update !== "1"
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
          item.catagory?.toLowerCase().includes(term)
      );
    }

    setFilteredSubmissions(filtered);
  }, [searchTerm, filterStatus, submissions]);

  // ==========================================
  // HANDLE UPDATE REDIRECT
  // ==========================================
  const handleUpdate = (id) => {
    navigate(`/submit-mentor?update=${id}`);
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
  const getStatusBadge = (event) => {
    const needsUpdate = event.is_update === 1 || event.is_update === "1";
    const isActive = event.is_active === 1 || event.is_active === "1";

    // Priority 1: Needs Update
    if (needsUpdate) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
          <AlertCircle className="w-3 h-3" />
          Needs Update
        </span>
      );
    }

    // Priority 2: Active
    if (isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
          <CheckCircle className="w-3 h-3" />
          Published
        </span>
      );
    }

    // Default: Pending
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
        <Clock className="w-3 h-3" />
        Pending Review
      </span>
    );
  };

  // ==========================================
  // STATS
  // ==========================================
  const stats = {
    total: submissions.length,
    pending: submissions.filter(
      (s) =>
        (s.is_active === 0 || s.is_active === "0") &&
        s.is_update !== 1 &&
        s.is_update !== "1"
    ).length,
    active: submissions.filter(
      (s) => s.is_active === 1 || s.is_active === "1"
    ).length,
    needsUpdate: submissions.filter(
      (s) => s.is_update === 1 || s.is_update === "1"
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "My Submissions Mentors" },
          ]}
          pageTitle="My Submissions Mentors"
        />
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
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Mentors Hub", path: "/mentors" },
          { label: "My Submissions Mentors" },
        ]}
        pageTitle="My Submissions Mentors"
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Submitted Mentors
              </h1>
              <p className="text-gray-600 mt-1">
                View and manage your submitted mentor events
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchSubmissions}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={() => navigate("/submit-mentor")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition-colors text-sm"
              >
                Submit New
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <div className="text-2xl font-bold text-gray-900">
                {stats.total}
              </div>
              <div className="text-gray-600 text-sm">Total</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <div className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </div>
              <div className="text-gray-600 text-sm">Pending</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <div className="text-2xl font-bold text-gray-900">
                {stats.active}
              </div>
              <div className="text-gray-600 text-sm">Published</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
              <div className="text-2xl font-bold text-gray-900">
                {stats.needsUpdate}
              </div>
              <div className="text-gray-600 text-sm">Needs Update</div>
            </div>
          </div>

          {/* Alert for needs update */}
          {stats.needsUpdate > 0 && (
            <div className="mb-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-orange-800">
                    Action Required
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    You have {stats.needsUpdate} submission
                    {stats.needsUpdate > 1 ? "s" : ""} that need
                    {stats.needsUpdate === 1 ? "s" : ""} updates. Please check
                    the admin comments and update your submissions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by title, event name, or category..."
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
                  <option value="needs_update">Needs Update</option>
                  <option value="pending">Pending Review</option>
                  <option value="active">Published</option>
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
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Start by submitting your first mentor event"}
              </p>
              {!searchTerm && filterStatus === "all" && (
                <button
                  onClick={() => navigate("/submit-mentor")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg font-semibold transition-colors"
                >
                  Submit Your First Event
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubmissions.map((event) => {
                const needsUpdate =
                  event.is_update === 1 || event.is_update === "1";

                return (
                  <div
                    key={event.id}
                    className={`bg-white rounded-lg shadow hover:shadow-lg transition-shadow border overflow-hidden flex flex-col ${
                      needsUpdate
                        ? "border-orange-300 ring-2 ring-orange-100"
                        : "border-gray-200"
                    }`}
                  >
                    {/* Media Thumbnail */}
                    {renderMediaThumbnail(event)}

                    {/* Content */}
                    <div className="p-4 flex-1 flex flex-col">
                      {/* Status + Date */}
                      <div className="flex items-center justify-between mb-2">
                        {getStatusBadge(event)}
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

                      {/* Admin Comment - IMPORTANT */}
                      {event.comment && (
                        <div
                          className={`rounded p-2 mb-3 text-xs ${
                            needsUpdate
                              ? "bg-orange-50 border border-orange-200"
                              : "bg-blue-50 border border-blue-200"
                          }`}
                        >
                          <div className="flex items-start gap-1">
                            <MessageSquare
                              className={`w-3 h-3 flex-shrink-0 mt-0.5 ${
                                needsUpdate
                                  ? "text-orange-600"
                                  : "text-blue-600"
                              }`}
                            />
                            <div>
                              <p
                                className={`font-semibold mb-0.5 ${
                                  needsUpdate
                                    ? "text-orange-800"
                                    : "text-blue-800"
                                }`}
                              >
                                Admin Comment:
                              </p>
                              <p
                                className={`line-clamp-2 ${
                                  needsUpdate
                                    ? "text-orange-700"
                                    : "text-blue-700"
                                }`}
                              >
                                {event.comment}
                              </p>
                            </div>
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

                        {/* Update Button - Only when is_update === 1 */}
                        {needsUpdate && (
                          <button
                            onClick={() => handleUpdate(event.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            Update Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* DETAIL MODAL */}
      {/* ========================================== */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Submission Details
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
                {getStatusBadge(selectedEvent)}
                <span className="text-xs text-gray-500">
                  Submitted: {formatDate(selectedEvent.created_at)}
                </span>
              </div>

              {/* Admin Comment Alert */}
              {selectedEvent.comment && (
                <div
                  className={`rounded-lg p-4 border-l-4 ${
                    selectedEvent.is_update === 1 ||
                    selectedEvent.is_update === "1"
                      ? "bg-orange-50 border-orange-500"
                      : "bg-blue-50 border-blue-500"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare
                      className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                        selectedEvent.is_update === 1 ||
                        selectedEvent.is_update === "1"
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    />
                    <div>
                      <h4
                        className={`font-semibold mb-1 ${
                          selectedEvent.is_update === 1 ||
                          selectedEvent.is_update === "1"
                            ? "text-orange-800"
                            : "text-blue-800"
                        }`}
                      >
                        Admin Comment
                      </h4>
                      <p
                        className={`text-sm ${
                          selectedEvent.is_update === 1 ||
                          selectedEvent.is_update === "1"
                            ? "text-orange-700"
                            : "text-blue-700"
                        }`}
                      >
                        {selectedEvent.comment}
                      </p>
                      {(selectedEvent.is_update === 1 ||
                        selectedEvent.is_update === "1") && (
                        <p className="text-xs text-orange-600 mt-2 font-medium">
                          ⚠️ Please update your submission based on this
                          comment.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

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

              {/* Update Button - Only when is_update === 1 */}
              {(selectedEvent.is_update === 1 ||
                selectedEvent.is_update === "1") && (
                <button
                  onClick={() => {
                    handleUpdate(selectedEvent.id);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-medium transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Update Submission
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserViewSubmitMentors;