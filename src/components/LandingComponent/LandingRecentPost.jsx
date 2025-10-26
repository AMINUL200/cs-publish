// import React from 'react';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { formatDate } from "../../lib/utils";



const LandingRecentPost = ({
  postData = [],
  loading = false,
  error = null,
}) => {

  


  return (
    <section className="section recent-post">
      <div className="container-fluid ">
        <div className="titlebox text-center pb-8">
          <h4 className="heading">
            Recent <span className="color_yellow">Blogs</span>
          </h4>
          <p>
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus.
          </p>
        </div>

        <div className="recent-post-slider">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            // navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              576: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 3,
              },
            }}
            loop={true}
          >
            {postData.map((post) => (
              <SwiperSlide key={post.id}>
                <div className="item">
                  <div className="card rounded">
                    <div className="imgwrrap">
                      <div className="txtwraap">
                        <h5 className="card-title">{post.title}</h5>
                      </div>
                      <img
                        src={post.image}
                        className="w-full h-80"
                        alt={post.image_alt}
                      />
                    </div>
                    <div className="card-body bg-white p-5">
                      <div className="mb-4">
                        <span className="date">
                          <span className="mr-3">
                            <FontAwesomeIcon icon={faCalendar} />
                          </span>
                          {/* {post.date} */}
                          {formatDate(post.date)}
                        </span>
                        <p className="card-text text-gray-700 text-xl ">
                          {post.author}
                        </p>
                      </div>
                      <div className="flex justify-center items-center">
                        <Link
                          to={`/blog/${post.id}`}
                          className="bg-[#ffba00] hover:bg-black hover:text-white px-20 py-2 rounded-2xl transition-all duration-300 "
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default LandingRecentPost;
