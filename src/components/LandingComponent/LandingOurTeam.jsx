import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
// import "./LandingOurTeam.css"; // Optional custom CSS

const LandingOurTeam = ({
  ourTeamData = [],
  loading = false,
  error = null,
}) => {
  // console.log(ourTeamData);

  // Loading state
  if (loading) {
    return (
      <section className="team-section bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Team</h2>
            <p className="text-gray-600 text-lg">Loading our amazing team...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-pulse flex space-x-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-lg shadow-lg p-6 w-64"
                >
                  <div className="bg-gray-300 h-48 w-48 rounded-full mx-auto mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/2 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="team-section bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-2xl mx-auto">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">
              Unable to Load Team
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!ourTeamData || ourTeamData.length === 0) {
    return (
      <section className="team-section bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm p-12 max-w-2xl mx-auto">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Meet Our Team
            </h3>
            <p className="text-gray-500 text-lg">
              Our team details will be available soon.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Extract name and position from title
  const getTeamMemberInfo = (title) => {
    const parts = title.split("—");
    if (parts.length === 2) {
      return {
        name: parts[0].trim(),
        position: parts[1].trim(),
      };
    }
    return {
      name: title,
      position: "Team Member",
    };
  };

  return (
    <section className="team-section bg-gradient-to-br from-gray-50 to-blue-50 py-6 md:py-14">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Meet <span className="text-yellow-400">Our Team</span>
          </h2>
          <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dedicated professionals committed to excellence in scientific
            publishing and innovation
          </h5>
        </div>

        {/* Swiper Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation={{
              nextEl: ".team-swiper-button-next",
              prevEl: ".team-swiper-button-prev",
            }}
            pagination={{
              clickable: true,
              el: ".team-swiper-pagination",
            }}
            autoplay={{
              delay: 5000,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="team-swiper"
          >
            {ourTeamData.map((member) => {
              const { name, position } = getTeamMemberInfo(member.title);

              return (
                <SwiperSlide key={member.id}>
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <img
                        src={member.image}
                        alt={name}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=${encodeURIComponent(
                            name.charAt(0)
                          )}`;
                        }}
                      />
                      {/* Overlay with social links */}
                      <div className="absolute inset-0 bg-black/0 bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                          {member.facebook_link && (
                            <a
                              href={member.facebook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-yellow-600 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </a>
                          )}
                          {member.twitter_link && (
                            <a
                              href={member.twitter_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-yellow-400 text-white p-3 rounded-full hover:bg-yellow-500 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                              </svg>
                            </a>
                          )}
                          {member.linkedin_link && (
                            <a
                              href={member.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-yellow-700 text-white p-3 rounded-full hover:bg-yellow-800 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </a>
                          )}
                          {member.instagram_link && (
                            <a
                              href={member.instagram_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.815 3.73 13.664 3.73 12.367s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                              </svg>
                            </a>
                          )}
                          {!member.facebook_link &&
                            !member.twitter_link &&
                            !member.linkedin_link &&
                            !member.instagram_link && (
                              <span className="text-white text-sm bg-gray-600 px-3 py-2 rounded-full">
                                No Social Links
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                      <Link
                      to={`/cms/${member.slug}`}
                       className="text-xl font-bold text-gray-800 mb-2 hover:text-yellow-600">
                        {name}
                      </Link>
                      <p className="text-yellow-600 font-semibold mb-3">
                        {position}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {member.short_description}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="team-swiper-button-prev absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors -ml-4">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button className="team-swiper-button-next absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-lg p-3 hover:bg-gray-100 transition-colors -mr-4">
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Custom Pagination */}
          <div className="team-swiper-pagination mt-8 flex justify-center space-x-2"></div>
        </div>
      </div>
    </section>
  );
};

export default LandingOurTeam;
