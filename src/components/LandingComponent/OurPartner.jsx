import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { partnear1, partnear2, partnear3, partnear4 } from "../../assets";

const partners = [
  { img: partnear1, name: "Partner name" },
  { img: partnear2, name: "Partner name" },
  { img: partnear3, name: "Partner name" },
  { img: partnear4, name: "Partner name" },
  { img: partnear2, name: "Partner name" },
];

const OurPartner = () => {
  return (
    <section className="our-partner">
      <div className="mx-auto md:mx-20">
        <div className="text-center mb-12">
          <h4 className="heading text-white">
            <span className="color_yellow"> Partners</span> and Collaborations
          </h4>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={4}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        //   navigation={true}
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="partnears"
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index}>
              <div className="partnear-area">
                <div className="prtn_img">
                  <img src={partner.img} alt="partner" className="img-fluid" />
                </div>
                <p className="prtn_name">{partner.name}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default OurPartner;
