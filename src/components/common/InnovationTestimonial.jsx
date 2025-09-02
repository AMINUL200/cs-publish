import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const InnovationTestimonial = ({ innovatorVoices }) => {
    return (


        <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            // navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            loop={true}
            breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                // 1280: { slidesPerView: 4 }
            }}
            className="pb-8"
        >
            {innovatorVoices.map((voice) => (
                <SwiperSlide key={voice.id}>
                    <div className="group text-center">
                        {/* Profile Image with gradient border */}
                        <div className="relative mx-auto w-48 h-48 mb-6">
                            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 group-hover:scale-105 transition-transform duration-300">
                                <img
                                    src={voice.image}
                                    alt={voice.name}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                        </div>

                        {/* Name & Role */}
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                            {voice.name}
                        </h3>
                        <p className="text-purple-600 font-medium mb-3">
                            {voice.role}
                        </p>

                        {/* Bio */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-4">
                            {voice.bio}
                        </p>

                        {/* Social */}
                        <p className="text-gray-500 text-sm font-mono">
                            {voice.social}
                        </p>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>

    )
}

export default InnovationTestimonial
