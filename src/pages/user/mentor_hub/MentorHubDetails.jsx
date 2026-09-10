import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faUser,
  faQuoteLeft,
  faShareAlt,
  faEnvelope,
  faMessage,
  faEye,
  faList,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
  faGithub,
  faInstagram,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import Loader from "../../../components/common/Loader";
import { Link } from "react-router-dom";
import axios from "axios";

const MentorHubDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [eventDetails, setEventDetails] = useState(null);
  const [popularMentors, setPopularMentors] = useState([]);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // ==========================================
  // DETECT MEDIA TYPE FROM URL (FALLBACK)
  // ==========================================
  const getMediaType = (url) => {
    if (!url) return "image";

    const lowerUrl = url.toLowerCase();

    if (
      lowerUrl.includes("youtube.com") ||
      lowerUrl.includes("youtu.be") ||
      lowerUrl.includes("youtube-nocookie.com")
    ) {
      return "youtube";
    }

    if (
      lowerUrl.includes(".mp4") ||
      lowerUrl.includes(".webm") ||
      lowerUrl.includes(".ogg") ||
      lowerUrl.includes(".mov")
    ) {
      return "video";
    }

    return "image";
  };

  // ==========================================
  // EXTRACT YOUTUBE VIDEO ID
  // ==========================================
  const getYoutubeVideoId = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // ==========================================
  // GET YOUTUBE THUMBNAIL
  // ==========================================
  const getYoutubeThumbnail = (url) => {
    const videoId = getYoutubeVideoId(url);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : null;
  };

  // ==========================================
  // BUILD MEDIA URL PROPERLY
  // ==========================================
  const getMediaUrl = (imageVideo) => {
    if (!imageVideo) return null;

    // Full URL (YouTube, external, etc.) — use as-is
    if (
      imageVideo.startsWith("http://") ||
      imageVideo.startsWith("https://")
    ) {
      return imageVideo;
    }

    // Invalid /tmp/ path — no valid media
    if (imageVideo.startsWith("/tmp/")) {
      return null;
    }

    // Relative path — prefix with STORAGE_URL
    return `${STORAGE_URL}${imageVideo}`;
  };

  // ==========================================
  // GET FINAL MEDIA TYPE (PREFER API'S media_type)
  // ==========================================
  const resolveMediaType = (event) => {
    // If API has media_type, use it
    if (event.media_type) {
      return event.media_type; // "image" | "youtube" | "video"
    }
    // Otherwise detect from URL
    return getMediaType(event.image_video);
  };

  // ==========================================
  // NORMALIZE LINKS (handles array of {key, value} or object)
  // ==========================================
  const normalizeLinks = (rawData) => {
    if (!rawData) return [];

    let data = rawData;

    // Parse if string
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return [];
      }
    }

    // If it's already an object with dynamic keys (not array)
    if (!Array.isArray(data) && typeof data === "object") {
      // Check if it's a {key, value} object (unlikely) or a map of key→value
      if (data.key !== undefined && data.value !== undefined) {
        return [{ key: data.key, value: data.value }];
      }
      return Object.entries(data).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    }

    if (!Array.isArray(data)) return [];

    const result = [];

    data.forEach((item) => {
      if (!item) return;

      // String item — try parse
      if (typeof item === "string") {
        try {
          const parsed = JSON.parse(item);
          if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            if (parsed.key !== undefined && parsed.value !== undefined) {
              result.push({ key: parsed.key, value: parsed.value });
            } else {
              Object.entries(parsed).forEach(([key, value]) => {
                result.push({ key, value: String(value) });
              });
            }
          }
        } catch (e) {
          // ignore
        }
        return;
      }

      // Object with key/value
      if (typeof item === "object") {
        if (item.key !== undefined && item.value !== undefined) {
          result.push({ key: item.key, value: item.value });
        } else {
          Object.entries(item).forEach(([key, value]) => {
            result.push({ key, value: String(value) });
          });
        }
      }
    });

    return result.filter((l) => l.key?.trim() && l.value?.trim());
  };

  // ==========================================
  // GET ICON FOR PLATFORM
  // ==========================================
  const getPlatformIcon = (platform) => {
    const key = (platform || "").toLowerCase();
    if (key === "facebook" || key === "fb") return faFacebook;
    if (key === "twitter" || key === "x") return faTwitter;
    if (key === "linkedin") return faLinkedin;
    if (key === "instagram") return faInstagram;
    if (key === "youtube") return faYoutube;
    if (key === "github") return faGithub;
    return faShareAlt;
  };

  // Fetch event details and popular mentors
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}api/events/detail/${id}`,
          {
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        if (response.data.status) {
          setEventDetails(response.data.event_details);
          setPopularMentors(response.data.most_view || []);
        } else {
          throw new Error("Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError(
          error.response?.data?.message || "Failed to load event details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
      window.scrollTo(0, 0);
    }
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // ==========================================
  // RENDER MAIN MEDIA (fixed size, proper handling)
  // ==========================================
  const renderMainMedia = (event) => {
    const mediaType = resolveMediaType(event);
    const mediaUrl = getMediaUrl(event.image_video);

    if (!mediaUrl && mediaType !== "youtube") {
      return null;
    }

    // YouTube — show responsive iframe
    if (mediaType === "youtube") {
      const videoId = getYoutubeVideoId(event.image_video);
      if (!videoId) return null;

      return (
        <div className="w-full p-4">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={event.title}
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }

    // Video file
    if (mediaType === "video") {
      return (
        <div className="w-full p-4">
          <video
            src={mediaUrl}
            controls
            className="w-full h-auto max-h-[500px] rounded-lg shadow-md bg-black"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Image (default)
    return (
      <div className="w-full p-4">
        <img
          src={mediaUrl}
          alt={event.image_alt_tag || event.title}
          className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow-md"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      </div>
    );
  };

  // ==========================================
  // RENDER POPULAR MENTOR THUMBNAIL (small, fixed)
  // ==========================================
  const renderPopularThumbnail = (mentor) => {
    const mediaType = mentor.media_type || getMediaType(mentor.image_video);
    const mediaUrl = getMediaUrl(mentor.image_video);

    // No media — placeholder
    if (!mediaUrl && mediaType !== "youtube") {
      return (
        <div className="w-28 h-20 bg-gradient-to-br from-yellow-50 to-amber-50 rounded flex items-center justify-center">
          <FontAwesomeIcon icon={faList} className="text-gray-400" />
        </div>
      );
    }

    // YouTube — thumbnail with play overlay
    if (mediaType === "youtube") {
      const thumb = getYoutubeThumbnail(mentor.image_video);
      return (
        <div className="relative w-28 h-20 rounded overflow-hidden group">
          {thumb ? (
            <img
              src={thumb}
              alt={mentor.image_alt_tag || mentor.title}
              className="w-28 h-20 object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-28 h-20 bg-black flex items-center justify-center">
              <FontAwesomeIcon icon={faYoutube} className="text-red-500" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center pointer-events-none">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white ml-0.5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>
      );
    }

    // Image
    return (
      <img
        src={mediaUrl}
        alt={mentor.image_alt_tag || mentor.title}
        className="w-28 h-20 object-cover rounded"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/112x80?text=Event";
        }}
      />
    );
  };

  // Transform popular mentors data
  const transformedPopularMentors = popularMentors.map((mentor) => ({
    id: mentor.id,
    title: mentor.title,
    slug: mentor.slug,
    category: mentor.catagory,
    views: mentor.view_count,
    created_at: mentor.created_at,
    media_type: mentor.media_type,
    image_video: mentor.image_video,
    image_alt_tag: mentor.image_alt_tag,
  }));

  if (loading) return <Loader />;

  if (error) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Mentors Hub", path: "/mentors", icon: "folder" },
            { label: "Event Details" },
          ]}
          pageTitle="Event Details"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Event
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }

  if (!eventDetails) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: "Home", path: "/", icon: "home" },
            { label: "Mentors Hub", path: "/mentors", icon: "folder" },
            { label: "Event Not Found" },
          ]}
          pageTitle="Event Not Found"
        />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📄</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Event Not Found
            </h2>
            <p className="text-gray-600">
              The requested event could not be found.
            </p>
          </div>
        </div>
      </>
    );
  }

  // Normalize links for both sections
  const normalizedShareLinks = normalizeLinks(eventDetails.share_links);
  const normalizedEventSocialLinks = normalizeLinks(
    eventDetails.event_social_links
  );

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Mentors Hub", path: "/mentors", icon: "folder" },
          { label: eventDetails.title },
        ]}
        pageTitle={eventDetails.title}
      />

      <div className="container mx-auto px-4 py-8 md:px-10">
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Main Content */}
          <div className="w-full lg:w-8/12">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">
                  {eventDetails.title}
                </h1>

                <div className="flex flex-wrap items-center justify-around text-gray-600 mb-6 gap-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                    <span>{formatDate(eventDetails.created_at)}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faList} className="mr-2" />
                    <span>{eventDetails.catagory}</span>
                  </div>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    <span>{eventDetails.view_count} Views</span>
                  </div>
                  {(eventDetails.is_upcomming === "1" ||
                    eventDetails.is_upcomming === 1) && (
                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Upcoming Event
                    </div>
                  )}
                </div>

                {eventDetails.description && (
                  <p className="text-lg text-gray-700 mb-6 text-center">
                    {eventDetails.description}
                  </p>
                )}
              </div>

              {/* ========================================== */}
              {/* Featured Media (proper YouTube / Image / Video) */}
              {/* ========================================== */}
              {eventDetails.image_video && renderMainMedia(eventDetails)}

              {/* Event Description */}
              {eventDetails.event_desc && (
                <div className="p-6 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-4">
                    Event Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {eventDetails.event_desc}
                  </p>
                </div>
              )}

              {/* Long Description */}
              {eventDetails.long_description && (
                <div className="p-6 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-4">
                    Detailed Information
                  </h2>
                  <div
                    className="prose max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={createMarkup(
                      eventDetails.long_description
                    )}
                  />
                </div>
              )}

              {/* File Downloads */}
              {(eventDetails.pdf || eventDetails.ppt) && (
                <div className="p-6 border-t border-gray-200">
                  <h2 className="text-2xl font-bold mb-4">Resources</h2>
                  <div className="flex flex-wrap gap-4">
                    {eventDetails.pdf && (
                      <a
                        href={`${STORAGE_URL}${eventDetails.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        <span>Download PDF</span>
                      </a>
                    )}
                    {eventDetails.ppt && (
                      <a
                        href={`${STORAGE_URL}${eventDetails.ppt}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        <span>Download PPT</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Event Information */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <h2 className="text-2xl font-bold mb-4">Event Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Event Name
                    </h3>
                    <p className="text-gray-600">{eventDetails.event_name}</p>
                  </div>
                  {eventDetails.event_email && (
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">
                        Contact Email
                      </h3>
                      <a
                        href={`mailto:${eventDetails.event_email}`}
                        className="text-yellow-600 hover:text-yellow-700 flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faEnvelope} />
                        {eventDetails.event_email}
                      </a>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">
                      Category
                    </h3>
                    <p className="text-gray-600">{eventDetails.catagory}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Status</h3>
                    <p className="text-gray-600">
                      {eventDetails.is_upcomming === "1" ||
                      eventDetails.is_upcomming === 1
                        ? "Upcoming"
                        : "Past Event"}
                    </p>
                  </div>
                </div>
              </div>

              {/* ========================================== */}
              {/* Share Links (normalized) */}
              {/* ========================================== */}
              <div className="p-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                  Share this Event
                </h3>
                <div className="flex flex-wrap gap-4">
                  {/* User-provided share links */}
                  {normalizedShareLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-600 hover:text-yellow-600 transition-colors"
                      title={link.key}
                    >
                      <FontAwesomeIcon
                        icon={getPlatformIcon(link.key)}
                        size="lg"
                      />
                      <span className="text-sm capitalize">{link.key}</span>
                    </a>
                  ))}

                  {/* Default share buttons */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Share on Facebook"
                  >
                    <FontAwesomeIcon icon={faFacebook} size="lg" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      eventDetails.title
                    )}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600 transition"
                    title="Share on Twitter"
                  >
                    <FontAwesomeIcon icon={faTwitter} size="lg" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 hover:text-blue-900 transition"
                    title="Share on LinkedIn"
                  >
                    <FontAwesomeIcon icon={faLinkedin} size="lg" />
                  </a>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-4/12">
            {/* Popular Mentors */}
            {transformedPopularMentors.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6 border-b pb-2">
                  Popular Events
                </h2>
                <div className="space-y-6">
                  {transformedPopularMentors.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start hover:bg-gray-50 p-2 rounded-md transition-colors"
                    >
                      <div className="flex-shrink-0 mr-4 w-28">
                        {renderPopularThumbnail(item)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 hover:text-yellow-600 transition-colors text-sm leading-tight line-clamp-2">
                          <Link to={`/mentors/${item.slug}`}>
                            {item.title}
                          </Link>
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <FontAwesomeIcon icon={faEye} className="w-3 h-3" />
                          <span>{item.views} views</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* Event Social Links (normalized) */}
            {/* ========================================== */}
            {normalizedEventSocialLinks.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">
                  Event Social Links
                </h2>
                <div className="flex flex-wrap gap-3">
                  {normalizedEventSocialLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-yellow-100 text-gray-700 rounded-lg transition-colors"
                    >
                      <FontAwesomeIcon icon={getPlatformIcon(link.key)} />
                      <span className="text-sm capitalize">{link.key}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MentorHubDetails;