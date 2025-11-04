import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  Calendar,
} from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const UserSideViewJournal = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const [journalData, setJournalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch journal data
  const fetchJournalData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/journal-article/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        console.log(response.data);
        
        setJournalData(response.data);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch journal data"
        );
      }
    } catch (error) {
      console.error("Error fetching journal data:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournalData();
  }, [id]);

  // Function to strip HTML tags from title
  const stripHtmlTags = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ");
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Navigation items
  const navItems = [
    { label: "List of Issues", path: `/list-of-archive/${journalData?.journal?.id}` },
    { label: "ASAP Article", path: "/asap-article" },
    { label: "Current Issue", path: `/view-current-issue/${journalData?.journal?.id}` },
    { label: "Author", path: "/author" },
    { label: "About Journal", path: "/about-journal" },
  ];

  const handleNavClick = (path) => {
    // You can implement navigation logic here
    console.log(`Navigating to: ${path}`);
    navigate(path); // Uncomment this if you want actual navigation
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchJournalData}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!journalData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Journal Not Found
          </h2>
          <p className="text-gray-600">
            The requested journal could not be found.
          </p>
        </div>
      </div>
    );
  }

  const {
    journal,
    editor,
    latest_published,
    most_viewed,
    most_downloaded,
    all_manuscripts,
  } = journalData;

  return (
    <div className="min-h-screen bg-gray-50 pt-10 sm:pt-24">
      {/* Header Section - Updated with Black Background and Yellow Text */}
      <div className="bg-black text-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-8 justify-center">
            {/* Journal Image */}
            <div className="flex-shrink-0">
              <img
                src={journal.image}
                alt={journal.j_title}
                className="w-48 h-64 object-cover rounded-lg shadow-2xl border-4 border-yellow-500"
              />
            </div>

            {/* Journal Information */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-yellow-400">
                {journal.j_title}
              </h1>
              <p className="text-xl mb-6 text-yellow-300">
                {journal.j_categories}
              </p>

              {/* Journal Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {journal.issn_print && (
                  <div className="bg-inherit bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <span className="font-semibold text-yellow-300">
                      ISSN Print:
                    </span>
                    <span className="ml-2 text-yellow-200">
                      {journal.issn_print_no}
                    </span>
                  </div>
                )}
                {journal.issn_online && (
                  <div className="bg-inherit bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <span className="font-semibold text-yellow-300">
                      ISSN Online:
                    </span>
                    <span className="ml-2 text-yellow-200">
                      {journal.issn_online_no}
                    </span>
                  </div>
                )}
                {journal.ugc_approved && (
                  <div className="bg-inherit bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                    <span className="font-semibold text-yellow-300">
                      UGC Approved:
                    </span>
                    <span className="ml-2 text-yellow-200">
                      {journal.ugc_no}
                    </span>
                  </div>
                )}
              </div>
              {/* Journal Description */}
              <div className="bg-inherit bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30 mb-4">
                <h3 className="font-bold text-yellow-300 mb-2">
                  Journal Description
                </h3>
                <p  className="text-yellow-200">
                  {journal.j_description}
                </p>
              </div>

              {/* Editor Information */}
              {editor && editor.length > 0 && (
                <div className="bg-inherit bg-opacity-20 rounded-lg p-3 border border-yellow-500 border-opacity-30">
                  <h3 className="font-bold text-yellow-300 mb-2">
                    Editor-in-Chief
                  </h3>
                  <p className="text-yellow-200">
                    <span className="font-semibold text-yellow-300">
                      {editor[0].editor_name}
                    </span>
                    <span className="mx-2 text-yellow-400">•</span>
                    {editor[0].editor_email}
                  </p>
                </div>
              )}
            </div>

            <div>
              <button className="border rounded border-yellow-200 py-2 px-4 hover:bg-yellow-500 hover:text-white cursor-pointer transition-all duration-300">Submit Manuscript</button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Navigation Buttons */}
      <div className="bg-yellow-500 py-4 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between gap-4 md:gap-6 lg:gap-8">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavClick(item.path)}
                className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-black hover:text-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Slider Sections */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Latest Published Slider */}
          <SectionSlider
            title="Latest Published Articles"
            articles={latest_published}
            stripHtmlTags={stripHtmlTags}
            formatDate={formatDate}
          />

          {/* Most Viewed Slider */}
          <SectionSlider
            title="Most Viewed Articles"
            articles={most_viewed}
            stripHtmlTags={stripHtmlTags}
            formatDate={formatDate}
          />

          {/* Most Downloaded Slider */}
          <SectionSlider
            title="Most Downloaded Articles"
            articles={most_downloaded}
            stripHtmlTags={stripHtmlTags}
            formatDate={formatDate}
          />

          {/* All Manuscripts Slider */}
          <SectionSlider
            title="All Manuscripts"
            articles={all_manuscripts}
            stripHtmlTags={stripHtmlTags}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
};

// Reusable Slider Component
const SectionSlider = ({ title, articles, stripHtmlTags, formatDate }) => {
  const [swiperInstance, setSwiperInstance] = useState(null);

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="mb-16 ">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900 border-l-4 border-yellow-500 pl-4">
          {title}
        </h2>

        {/* Custom Navigation Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => swiperInstance?.slidePrev()}
            className="w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => swiperInstance?.slideNext()}
            className="w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center hover:bg-yellow-600 transition-colors shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
          bulletClass: "swiper-pagination-bullet bg-yellow-500 opacity-50",
          bulletActiveClass:
            "swiper-pagination-bullet-active !bg-yellow-600 !opacity-100",
        }}
        onSwiper={setSwiperInstance}
        className="relative"
      >
        {articles.map((article) => (
          <SwiperSlide key={article.id}>
            <ArticleCard
              article={article}
              stripHtmlTags={stripHtmlTags}
              formatDate={formatDate}
            />
          </SwiperSlide>
        ))}

        {/* Custom Pagination */}
        <div className="swiper-pagination mt-6 !relative !bottom-0"></div>
      </Swiper>
    </section>
  );
};

// Article Card Component
const ArticleCard = ({ article, stripHtmlTags, formatDate }) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth); // ✅ get token from Redux

  const handleReadMore = () => {
    navigate(`/view-published-manuscript/${article.id}`);
    try {
      axios.post(
        `${API_URL}api/subscription/increase-view/${article.id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
      {/* Article Image */}
      <div className="relative overflow-hidden">
        <img
          src={article.image}
          alt={stripHtmlTags(article.title)}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-0 left-0 bg-red-800 text-white px-3 py-1 text-sm font-semibold">
          New
        </div>
      </div>

      {/* Article Content */}
      <div className="p-6">
        <h3 className="font-bold text-gray-900 mb-3 line-clamp-2 h-14 overflow-hidden">
          {stripHtmlTags(article.title)}
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <span className="font-semibold text-black">By:</span>
          <span className="ml-1">{article.username}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="w-4 h-4 mr-1 text-yellow-600" />
          <span>{formatDate(article.created_at)}</span>
        </div>

        <div className="flex items-center justify-center text-sm ">
          <button
            onClick={handleReadMore}
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600 transition-colors"
          >
            Read More
          </button>
        </div>
      </div>

      {/* Bottom Border Effect */}
      <div className="h-1 bg-gradient-to-r from-yellow-500 to-red-800"></div>
    </div>
  );
};

export default UserSideViewJournal;