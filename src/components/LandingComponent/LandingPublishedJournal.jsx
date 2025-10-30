import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { formatDate } from "../../lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const LandingPublishedJournal = ({
  publishedJournalData = [],
  loading = false,
  error = null,
}) => {
  // console.log("ManuscriptData:: ", publishedJournalData);

  // Remove the sample data since you're using real data now
  // const publishedManuscripts = [...];
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  const handleView = ({id}) => {
    navigate(`${API_URL}api/subscription/increase-view/${id}`);
    axios.post(
      `${API_URL}api/articles/${article.id}/view`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  };

  if (loading) {
    return <div>Loading published journals...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!publishedJournalData || publishedJournalData.length === 0) {
    return <div>No published journals found.</div>;
  }

  return (
    <div className="min-h-45 sm:min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-8 pb-4 sm:pb-16 sm:py-16 px-4 sm:px-6 lg:px-8 published-journal-section">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-5">
          Published <span className="text-yellow-400">Manuscripts</span>
        </h2>
        <h5 className="text-lg text-gray-600 max-w-2xl mx-auto">
          Latest research publications from our journal
        </h5>
      </div>

      {/* Carousel Container */}
      <div className="max-w-7xl mx-auto mb-2 md:mb-12">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          pagination={{
            clickable: true,
            el: ".published-journal-section .swiper-pagination",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          {publishedJournalData.map((manuscript) => (
            <SwiperSlide key={manuscript.id}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={manuscript?.image}
                    alt={manuscript.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 custom-btn px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {manuscript?.j_title}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {/* Clean up the HTML from title if needed */}
                    {manuscript.title?.replace(/<[^>]*>/g, "") ||
                      manuscript.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                    {manuscript?.username}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-gray-500 text-xs font-medium">
                      Published: {formatDate(manuscript?.created_at)}
                    </span>
                    <Link
                      to={
                        token
                          ? `/view-published-manuscript/${manuscript?.id}`
                          : "#"
                      }
                      onClick={(e) => {
                        if (!token) {
                          e.preventDefault(); // stop navigation
                          alert("Please log in to view this manuscript.");
                        }
                      }}
                      className="bg-gradient-to-r custom-btn cursor-pointer px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination */}
        <div className="swiper-pagination published-journal-section !mt-14"></div>
      </div>

      {/* View All Button */}
      <div className="text-center">
        <button
          onClick={() => navigate("/view-published-manuscript-list")}
          className="bg-gradient-to-r custom-btn px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2 cursor-pointer"
        >
          View All Manuscripts
          <svg
            className="w-5 h-5 transition-transform duration-300 hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LandingPublishedJournal;
