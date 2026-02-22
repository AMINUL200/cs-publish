import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faUser,
  faShareAlt,
  faEnvelope,
  faMessage,
  faEye,
  faTag,
  faDownload,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import Loader from "../../../components/common/Loader";
import InnovationTestimonial from "../../../components/common/InnovationTestimonial";
import MediaRenderer from "../../../components/common/MediaRenderer";
import { Link } from "react-router-dom";

const InnoVationDetailsPage = () => {
  const { slug } = useParams(); // Extract slug from URL
  const [loading, setLoading] = useState(true);
  const [innovation, setInnovation] = useState(null);
  const [popularInnovations, setPopularInnovations] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch innovation data by slug
  const fetchInnovationData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/innovations-details/${slug}`,
      );

      if (response.data.status) {
        console.log("Innovation data fetched successfully:", response.data);
        setInnovation(response.data.data);
        setPopularInnovations(response.data.popular || []);
      }
    } catch (error) {
      console.error("Error fetching innovation data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle HTML content
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  // Extract YouTube video ID or get image URL
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

  // Team Members Data (keeping this as it's for testimonials)
  const innovatorVoices = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Editor-in-Chief",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      bio: "Award-winning journalist with 15+ years in digital publishing",
      social: "@sarahmitchell",
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Senior Writer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      bio: "Bestselling author and writing coach specializing in fiction",
      social: "@marcusjwrites",
    },
    {
      id: 3,
      name: "Lisa Chen",
      role: "Content Strategist",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      bio: "Digital marketing expert helping authors build their online presence",
      social: "@lisachen_media",
    },
    {
      id: 4,
      name: "James Rivera",
      role: "Community Manager",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      bio: "Passionate about connecting writers and fostering creative communities",
      social: "@jamesrivera",
    },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      fetchInnovationData();
    }
  }, [slug]);

  if (loading) {
    return <Loader />;
  }

  if (!innovation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Innovation Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The innovation you're looking for doesn't exist.
          </p>
          <Link
            to="/innovation"
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700"
          >
            Back to Innovations
          </Link>
        </div>
      </div>
    );
  }

  const mediaInfo = getMediaInfo(innovation.image_video);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Innovation", path: "/innovation", icon: "folder" },
          { label: innovation.page_title },
        ]}
        pageTitle={innovation.page_title}
      />
      <div className="container mx-auto px-4 py-8 md:px-10">
        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Main Content */}
          <div className="w-full lg:w-8/12">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Title and Metadata */}
              <div className="p-6">
                <h1 className="text-3xl text-center font-bold text-gray-800 mb-4">
                  {innovation.page_title}
                </h1>

                <div className="flex flex-wrap items-center justify-around text-gray-600 mb-6 gap-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                    <span>{formatDate(innovation.created_at)}</span>
                  </div>

                  {innovation.catagory && (
                    <div className="flex items-center">
                      <FontAwesomeIcon icon={faTag} className="mr-2" />
                      <span>{innovation.catagory}</span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    <span>{innovation.view_count} Views</span>
                  </div>
                </div>

                <p className="text-lg text-gray-700 mb-6">
                  {innovation.description}
                </p>
              </div>

              {/* Featured Media */}
              <div className="w-full p-4">
                <MediaRenderer
                  media={{
                    type: mediaInfo.type,
                    url: mediaInfo.src,
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={createMarkup(
                    innovation.long_description,
                  )}
                />

                {/* Share Buttons */}
                <div className="flex flex-wrap justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-6">
                  {/* Share Section */}
                  <div className="w-full md:w-auto">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FontAwesomeIcon icon={faShareAlt} className="mr-2" />
                      Share this innovation
                    </h3>
                    <div className="flex space-x-4">
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-600 hover:text-yellow-800 transition"
                      >
                        <FontAwesomeIcon icon={faFacebook} size="lg" />
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(innovation.page_title)}&url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:text-yellow-600 transition"
                      >
                        <FontAwesomeIcon icon={faTwitter} size="lg" />
                      </a>
                      <a
                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-700 hover:text-yellow-900 transition"
                      >
                        <FontAwesomeIcon icon={faLinkedin} size="lg" />
                      </a>
                    </div>
                  </div>

                  {/* Buttons Section */}
                  <div className="flex flex-wrap gap-4">
                    {innovation.pdf && (
                      <a
                        href={`${STORAGE_URL}${innovation.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 rounded-lg bg-red-500 text-white font-medium shadow-md hover:bg-red-600 transition cursor-pointer flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        PDF Download
                      </a>
                    )}
                    {innovation.ppt && (
                      <a
                        href={`${STORAGE_URL}${innovation.ppt}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 rounded-lg bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition cursor-pointer flex items-center gap-2"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                        PPT Download
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>

            {/* Innovator Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-2xl font-bold mb-6">About the Innovator</h2>

              <div className="flex flex-col sm:flex-row items-start">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {innovation.innovator_name?.charAt(0) || "U"}
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">
                    {innovation.innovator_name}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {innovation.innovator_desc}
                  </p>

                  {innovation.innovator_email && (
                    <div className="flex mt-4 space-x-4">
                      <a
                        href={`mailto:${innovation.innovator_email}`}
                        className="text-gray-600 hover:text-yellow-600"
                      >
                        <FontAwesomeIcon icon={faEnvelope} size="lg" />
                      </a>
                    </div>
                  )}

                  <button className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Contact Innovator
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-4/12">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 border-b pb-2">
                Popular Innovations
              </h2>

              <div className="space-y-6">
                {popularInnovations.length > 0 ? (
                  popularInnovations.map((item, index) => {
                    const itemMediaInfo = getMediaInfo(item.image_video);
                    return (
                      <div
                        key={index}
                        className="flex items-start hover:bg-gray-50 p-2 rounded-md transition-colors"
                      >
                        <div className="flex-shrink-0 mr-4 w-28">
                          <MediaRenderer
                            media={{
                              type: itemMediaInfo.type,
                              url: itemMediaInfo.src,
                            }}
                            className="h-20"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 hover:text-yellow-600 transition-colors">
                            <Link to={`/innovation/${item.slug}`}>
                              {item.title}
                            </Link>
                          </h3>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No popular innovations available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Innovators' Voices Section */}
      {/* <section className="py-20 bg-white innovation-section ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Voice Of   <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Innovator</span>
            </h2>
            <h5 className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
              The visionaries and pioneers driving technological advancement
            </h5>
          </div>

          <InnovationTestimonial innovatorVoices={innovatorVoices} />
        </div>
      </section> */}
    </>
  );
};

export default InnoVationDetailsPage;
