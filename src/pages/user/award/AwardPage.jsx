import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

// Import required modules
import { Pagination, Navigation, Autoplay, EffectCoverflow } from "swiper/modules";

const AwardPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch awards data
  const fetchAwards = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/awards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status) {
        setAwards(response.data.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch awards';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg font-semibold">Loading Awards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-red-50 border border-red-300 rounded-2xl p-8 shadow-lg">
            <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-red-800 mb-2">Unable to Load Awards</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={fetchAwards}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 sm:py-22">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-black via-yellow-600 to-amber-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500 rounded-full translate-y-24 -translate-x-24 opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
           
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-300 to-amber-100 bg-clip-text text-transparent">
              Awards & Recognition
            </h1>
            <h5 className="text-amber-100 text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
              Celebrating excellence and outstanding achievements in our journey
            </h5>
          </div>
        </div>
      </div>

      {/* Awards Slider Section */}
      <div className="container mx-auto px-4 py-16">
        {awards.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-3xl p-12 max-w-2xl mx-auto shadow-2xl border border-amber-200">
              <svg className="w-24 h-24 mx-auto mb-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No Awards Yet</h3>
              <p className="text-gray-600 text-lg">
                We're working on achieving new milestones. Check back soon for updates!
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
           

            {/* Swiper Slider */}
            <div className="max-w-6xl mx-auto">
              <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                  slideShadows: true,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                navigation={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                loop={true}
                modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                className="awardsSwiper"
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                }}
              >
                {awards.map((award, index) => (
                  <SwiperSlide key={award.id}>
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-amber-200 transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                      {/* Award Image */}
                      <div className="relative h-64 bg-gradient-to-br from-amber-100 to-amber-200 overflow-hidden">
                        <img
                          src={`${STORAGE_URL}${award.image}`}
                          alt={award.image_alt}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300/FFFBEB/F59E0B?text=Award+Image';
                          }}
                        />
                        {/* Award Badge */}
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                          #{index + 1}
                        </div>
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Award Content */}
                      <div className="p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                          <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
                            Achievement
                          </span>
                        </div>
                        
                        {/* Description */}
                        <div 
                          className="src/App.css leading-relaxed mb-4 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: award.short_desc }}
                        />

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-amber-100">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(award.updated_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Swiper Styles */}
              <style jsx>{`
                .awardsSwiper {
                  padding: 50px 20px;
                }
                .awardsSwiper .swiper-slide {
                  background: transparent;
                  border-radius: 24px;
                }
                .awardsSwiper .swiper-pagination-bullet {
                  background: #D97706;
                  opacity: 0.5;
                  width: 12px;
                  height: 12px;
                }
                .awardsSwiper .swiper-pagination-bullet-active {
                  background: #B45309;
                  opacity: 1;
                  transform: scale(1.2);
                }
                .awardsSwiper .swiper-button-next,
                .awardsSwiper .swiper-button-prev {
                  color: #B45309;
                  background: white;
                  width: 50px;
                  height: 50px;
                  border-radius: 50%;
                  box-shadow: 0 4px 15px rgba(180, 83, 9, 0.3);
                  transition: all 0.3s ease;
                }
                .awardsSwiper .swiper-button-next:hover,
                .awardsSwiper .swiper-button-prev:hover {
                  background: #B45309;
                  color: white;
                  transform: scale(1.1);
                }
                .awardsSwiper .swiper-button-next:after,
                .awardsSwiper .swiper-button-prev:after {
                  font-size: 20px;
                  font-weight: bold;
                }
              `}</style>
            </div>
          </>
        )}
      </div>

    
    </div>
  );
};

export default AwardPage;