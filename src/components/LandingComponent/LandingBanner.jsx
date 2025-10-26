import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const LandingBanner = ({ bannerData = [], loading = false, error = null }) => {
    console.log("banner data:: ", bannerData);
    console.log("banner error:: ", error);
    console.log("banner loading:: ", loading);
    
    
  // Loading Skeleton
  if (loading) {
    return (
      <div className="relative w-full h-screen max-h-[540px] py-4 pt-20 overflow-hidden" id='home'>
        <div className="h-full bg-gray-200 animate-pulse">
          <div className="absolute inset-0 bg-gray-300 z-0"></div>
          <div className="px-4 h-full flex justify-center items-center relative z-10">
            <div className="max-w-2xl text-center w-full">
              <div className="h-8 bg-gray-400 rounded-lg mb-6 mx-auto max-w-md"></div>
              <div className="h-6 bg-gray-400 rounded mb-4 mx-auto max-w-lg"></div>
              <div className="h-6 bg-gray-400 rounded mb-8 mx-auto max-w-sm"></div>
              <div className="pt-6 border-t border-gray-400/20">
                <div className="w-32 h-10 bg-gray-400 rounded-3xl mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="relative w-full h-screen max-h-[540px] py-4 pt-20 overflow-hidden" id='home'>
        <div className="h-full bg-gradient-to-br from-red-50 to-red-100">
          <div className="absolute inset-0 bg-red-200/20 z-0"></div>
          <div className="px-4 h-full flex justify-center items-center relative z-10">
            <div className="max-w-2xl text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl md:text-4xl font-bold text-red-800 mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-lg text-red-600 mb-6">
                {error.message || 'Failed to load banner content. Please try again later.'}
              </p>
              <button 
                className="px-6 py-3 bg-red-600 text-white font-medium rounded-3xl hover:bg-red-700 transition-all duration-300"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!bannerData || bannerData.length === 0) {
    return (
      <div className="relative w-full h-screen max-h-[540px] py-4 pt-20 overflow-hidden" id='home'>
        <div className="h-full bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="absolute inset-0 bg-blue-200/20 z-0"></div>
          <div className="px-4 h-full flex justify-center items-center relative z-10">
            <div className="max-w-2xl text-center">
              <div className="text-blue-500 text-6xl mb-4">📷</div>
              <h1 className="text-2xl md:text-4xl font-bold text-blue-800 mb-4">
                No Content Available
              </h1>
              <p className="text-lg text-blue-600">
                Banner content is currently unavailable. Please check back later.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal State with Data
  return (
    <div className="relative w-full h-screen max-h-[540px] py-4 pt-20 overflow-hidden" id='home'>
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={true}
        className="h-full"
      >
        {bannerData.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Content */}
            <div className="px-4 h-full flex justify-center items-center relative z-10">
              <div className="max-w-2xl text-center">
                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                  {slide.description}
                </p>
                <div className="pt-6 border-t border-white/20">
                  <button className="px-8 py-3 bg-[#ffba00] text-white font-medium rounded-3xl hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105">
                    {slide.button_name}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default LandingBanner;