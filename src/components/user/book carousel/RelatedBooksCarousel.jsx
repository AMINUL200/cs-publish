import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const RelatedBooksCarousel = ({ books }) => {
    const navigate = useNavigate();
    return (
        <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Product</h2>
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
                }}
                className="pb-12"
            >
                {books.map((book) => (
                    <SwiperSlide key={book.id}>
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group h-full">
                            <div className="relative">
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <button className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{book.title}</h3>
                                <p className="text-gray-600 text-sm mb-3">{book.author}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold text-gray-900">₹{book.price}</span>
                                        <span className="text-sm text-gray-500 line-through">₹{book.originalPrice}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-600">{book.rating}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={()=> navigate(`/products/${book.id}`)}
                                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                                    <span className='mr-2'>View Details</span>
                                    <FontAwesomeIcon icon={faArrowRight} />

                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default RelatedBooksCarousel
