import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendar,
  faQuoteLeft,
  faQuoteRight,
  faSearch,
  faStar,
  faEye,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../../components/common/Breadcrumb";
import InnovationTestimonial from "../../../components/common/InnovationTestimonial";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";

const InnovationPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [innovations, setInnovations] = useState({
    upcoming: [],
    popular: [],
    recent: []
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const navigation = useNavigate();

  // Fetch innovations data
  const fetchInnovations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/innovations`);

      if (response.data.status) {
        setInnovations({
          upcoming: response.data.upcoming || [],
          popular: response.data.popular || [],
          recent: response.data.recent || []
        });
      }
    } catch (error) {
      console.error('Error fetching innovations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRead =(innovation) =>{
    if(!innovation) return;
    try {
      axios.get(`${API_URL}api/innovations/${innovation.id}/view`);
      navigation(`/innovation/${innovation.slug}`)
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  // Extract YouTube video ID or get image URL
  const getMediaInfo = (url) => {
    if (!url) return { type: 'none', src: null };

    // Check if it's a YouTube URL
    const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (youtubeMatch) {
      return {
        type: 'youtube',
        src: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
      };
    }

    // Check if it's an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const isImageUrl = imageExtensions.some(ext => url.toLowerCase().includes(ext)) || 
                      url.includes('uploads/innovations');

    if (isImageUrl) {
      const fullImageUrl = url.startsWith('http') ? url : `${API_URL}${url}`;
      return {
        type: 'image',
        src: fullImageUrl
      };
    }

    return { type: 'none', src: null };
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const InnovationCard = ({ innovation, type = "recent" }) => {
    const mediaInfo = getMediaInfo(innovation.image_video);
    
    return (
      <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-200">
        <div className="relative overflow-hidden">
          {mediaInfo.type === 'youtube' && mediaInfo.src ? (
            <div className="relative w-full h-48">
              <img
                src={mediaInfo.src}
                alt={innovation.image_alt_tag}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="bg-red-600 text-white p-3 rounded-full">
                  <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
                </div>
              </div>
            </div>
          ) : mediaInfo.type === 'image' && mediaInfo.src ? (
            <img
              src={mediaInfo.src}
              alt={innovation.image_alt_tag}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-yellow-50 to-amber-100 flex items-center justify-center">
              <div className="text-center">
                <FontAwesomeIcon icon={faUser} className="w-12 h-12 text-amber-600 mb-2" />
                <span className="text-amber-700 font-medium">No Media</span>
              </div>
            </div>
          )}
          
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-amber-600 to-red-800 text-white px-3 py-1 rounded-full text-xs font-medium">
              {innovation.catagory || "Innovation"}
            </span>
          </div>
          
          {type === "popular" && (
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <FontAwesomeIcon
                icon={faStar}
                className="w-3 h-3 text-yellow-400 fill-current"
              />
              <span className="text-xs font-medium text-white">4.8</span>
            </div>
          )}
          
          {type === "recent" && (
            <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded-full text-xs">
              <FontAwesomeIcon icon={faEye} className="w-3 h-3 mr-1" />
              {innovation.view_count}
            </div>
          )}
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
            {innovation.page_title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2">
            {innovation.description}
          </p>

          <div className="flex items-center justify-between mb-4">
            {type === "recent" && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                {formatDate(innovation.created_at)}
              </span>
            )}
            {type === "popular" && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                {innovation.view_count} views
              </span>
            )}
            {type === "upcoming" && (
              <div className="flex flex-col gap-1">
                <span className="text-sm text-amber-600 font-medium">
                  {innovation.is_upcomming ? "Coming Soon" : "Published"}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(innovation.created_at)}
                </span>
              </div>
            )}
          </div>

          {/* Innovator Info */}
          <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="w-4 h-4 text-amber-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {innovation.innovator_name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {innovation.innovator_email}
              </p>
            </div>
          </div>

          <button
            // to={`/innovation/${innovation.slug}`}
            onClick={()=> handleRead(innovation)}
            className="w-full bg-gradient-to-r from-amber-600 to-red-800 text-white py-3 px-4 rounded-lg hover:from-amber-700 hover:to-red-900 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer font-medium"
          >
            Read More
            <FontAwesomeIcon
              icon={faArrowRight}
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    );
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
    fetchInnovations();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Innovation" },
        ]}
        pageTitle="Innovation"
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-red-50">
        {/* Search Section */}
        {/* <div className="bg-gradient-to-r from-amber-600 via-red-800 to-black py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Discover{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-200">
                  Innovation
                </span>
              </h1>
              <h5 className="text-xl text-amber-100 max-w-2xl mx-auto">
                Explore cutting-edge technologies and breakthrough innovations
                shaping our future
              </h5>
            </div>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 w-5 h-5 z-10"
                />

                <input
                  type="text"
                  placeholder="Search innovations, technologies, or innovators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 text-lg rounded-2xl border-0 shadow-2xl focus:ring-4 focus:ring-amber-300/50 focus:outline-none backdrop-blur-sm bg-white/95 text-gray-900"
                />
              </div>
            </div>
          </div>
        </div> */}

        {/* Recent Innovations Section */}
        <section className="py-16 innovation-section">
          <div className="container mx-auto px-4 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Recent Innovations
              </h2>
              <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with the latest breakthrough technologies and
                cutting-edge solutions
              </h5>
            </div>

            {innovations.recent.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                loop={true}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 2 },
                  1280: { slidesPerView: 3 },
                }}
                className="pb-12"
              >
                {innovations.recent.map((innovation) => (
                  <SwiperSlide key={innovation.id}>
                    <InnovationCard innovation={innovation} type="recent" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-12">
                <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
                  <FontAwesomeIcon icon={faUser} className="w-16 h-16 text-amber-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Recent Innovations</h3>
                  <p className="text-gray-600 mb-4">
                    Check back later for the latest innovations and breakthroughs.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Popular Innovations Section */}
        <section className="py-16 bg-white innovation-section">
          <div className="container mx-auto px-4 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Popular Innovations
              </h2>
              <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the most viewed and highly-rated innovations capturing
                global attention
              </h5>
            </div>

            {innovations.popular.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, reverseDirection: true }}
                loop={true}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 2 },
                  1280: { slidesPerView: 3 },
                }}
                className="pb-12"
              >
                {innovations.popular.map((innovation) => (
                  <SwiperSlide key={innovation.id}>
                    <InnovationCard innovation={innovation} type="popular" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-12">
                <div className="bg-amber-50 rounded-2xl p-8 border border-amber-200">
                  <FontAwesomeIcon icon={faStar} className="w-16 h-16 text-amber-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Popular Innovations</h3>
                  <p className="text-gray-600 mb-4">
                    The most viewed innovations will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Upcoming Innovations Section */}
        <section className="py-16 bg-gradient-to-r from-amber-50 to-red-50 innovation-section">
          <div className="container mx-auto px-4 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Upcoming Innovations
              </h2>
              <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get a glimpse into the future with innovations currently in
                development
              </h5>
            </div>

            {innovations.upcoming.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                loop={true}
                breakpoints={{
                  640: { slidesPerView: 1 },
                  1024: { slidesPerView: 2 },
                  1280: { slidesPerView: 3 },
                }}
                className="pb-12"
              >
                {innovations.upcoming.map((innovation) => (
                  <SwiperSlide key={innovation.id}>
                    <InnovationCard innovation={innovation} type="upcoming" />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-12">
                <div className="bg-white rounded-2xl p-8 border border-amber-200">
                  <FontAwesomeIcon icon={faCalendar} className="w-16 h-16 text-amber-400 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No Upcoming Innovations</h3>
                  <p className="text-gray-600 mb-4">
                    Exciting new innovations are on the horizon. Stay tuned!
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Innovators' Voices Section */}
        {/* <section className="py-20 bg-white innovation-section ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-800">
                  Innovators
                </span>
              </h2>
              <h5 className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
                The visionaries and pioneers driving technological advancement
              </h5>
            </div>

            <InnovationTestimonial innovatorVoices={innovatorVoices} />
          </div>
        </section> */}
      </div>
    </>
  );
};

export default InnovationPage;