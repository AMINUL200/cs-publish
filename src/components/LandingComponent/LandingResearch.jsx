import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCalendar,
  faEye,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

import "swiper/css";
import "swiper/css/pagination";

const LandingResearch = ({
  researchInfo = [],
  loading = false,
}) => {

  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const navigate = useNavigate();

  // ✅ Same media detection logic
  const getMediaInfo = (url) => {
    if (!url) return { type: "none", src: null };

    const youtubeMatch = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
    );

    if (youtubeMatch) {
      return {
        type: "youtube",
        src: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`,
      };
    }

    return {
      type: "image",
      src: url.startsWith("http") ? url : `${STORAGE_URL}${url}`,
    };
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleRead = (item) => {
    navigate(`/innovation/${item.slug}`);
  };

  if (!researchInfo.length) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-red-50">
      <div className="container mx-auto px-4 md:px-20">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">
            Research And <span className="text-yellow-500">Innovation</span>
          </h2>
        </div>

        {/* ✅ SAME SLIDER */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
          loop
          breakpoints={{
            640: { slidesPerView: 1 },
            1024: { slidesPerView: 2 },
            1280: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {researchInfo.map((innovation) => {
            const media = getMediaInfo(
              innovation.image_video || innovation.image
            );

            return (
              <SwiperSlide key={innovation.id}>
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border">

                  {/* IMAGE */}
                  <div className="relative overflow-hidden">
                    {media.src ? (
                      <img
                        src={media.src}
                        alt={innovation.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-48 flex items-center justify-center bg-amber-50">
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                    )}

                    <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 rounded-full text-xs">
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      {innovation.view_count || 0}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-amber-700">
                      {innovation.page_title || innovation.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {innovation.description}
                    </p>

                    <span className="text-sm text-gray-500 flex items-center gap-1 mb-4">
                      <FontAwesomeIcon icon={faCalendar} />
                      {formatDate(innovation.created_at)}
                    </span>

                    <button
                      onClick={() => handleRead(innovation)}
                      className="w-full bg-gradient-to-r from-amber-600 to-red-800 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:from-amber-700 hover:to-red-900 transition"
                    >
                      Read More
                      <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default LandingResearch;