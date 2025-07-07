import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { sliderImage } from '../../assets';

const LandingBanner = () => {
    const slides = [
        {
            title: "After all is said ",
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.",
            cta: "GET ACCESS",
            image: sliderImage
        },
        {
            title: "Discover ",
            text: "Explore innovative solutions that will transform your approach to challenges and open new opportunities for growth.",
            cta: "LEARN MORE",
            image: sliderImage
        },
        {
            title: "Join our community",
            text: "Become part of a network of professionals and enthusiasts who share your passion and drive for excellence.",
            cta: "SIGN UP",
            image: sliderImage
        }
    ];
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
                {slides.map((slide, index) => (
                    <SwiperSlide key={index}>
                        {/* Background Image */}
                        <div
                            className="absolute inset-0 bg-cover bg-center z-0"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="absolute inset-0 bg-black/30"></div>
                        </div>

                        {/* Content */}
                        <div className=" px-4 h-full flex justify-center items-center  relative z-10">
                            <div className="max-w-2xl text-center">
                                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                    {slide.title}
                                </h1>
                                <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                                    {slide.text}
                                </p>
                                <div className="pt-6 border-t border-white/20">
                                    <button className="px-8 py-3 bg-[#ffba00] text-white font-medium rounded-3xl hover:bg-black transition-all duration-300 ease-in-out transform hover:scale-105">
                                        {slide.cta}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    
  )
}

export default LandingBanner
