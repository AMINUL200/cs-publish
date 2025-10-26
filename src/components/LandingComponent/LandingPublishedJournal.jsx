import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const LandingPublishedJournal = () => {
  // Sample data for published manuscripts
  const publishedManuscripts = [
    {
      id: 1,
      title: "Advances in Artificial Intelligence and Machine Learning",
      author: "Dr. Sarah Johnson, Dr. Michael Chen",
      journalCategory: "Computer Science",
      image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=300&fit=crop",
      publishedDate: "2024-01-15"
    },
    {
      id: 2,
      title: "Sustainable Energy Solutions for Urban Environments",
      author: "Prof. Emily Rodriguez, Dr. James Wilson",
      journalCategory: "Environmental Science",
      image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
      publishedDate: "2024-01-10"
    },
    {
      id: 3,
      title: "Neuroplasticity and Cognitive Development in Early Childhood",
      author: "Dr. Robert Kim, Dr. Lisa Thompson",
      journalCategory: "Neuroscience",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      publishedDate: "2024-01-08"
    },
    {
      id: 4,
      title: "Quantum Computing: Breaking New Grounds",
      author: "Dr. Amanda Zhang, Prof. David Lee",
      journalCategory: "Physics",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      publishedDate: "2024-01-05"
    },
    {
      id: 5,
      title: "Cultural Anthropology in the Digital Age",
      author: "Dr. Maria Garcia, Dr. Thomas Brown",
      journalCategory: "Anthropology",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      publishedDate: "2024-01-03"
    },
    {
      id: 6,
      title: "Innovations in Biomedical Engineering",
      author: "Dr. Kevin Patel, Dr. Jennifer White",
      journalCategory: "Biomedical Engineering",
      image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=300&fit=crop",
      publishedDate: "2023-12-28"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-16 px-4 sm:px-6 lg:px-8 published-journal-section">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Published Manuscripts
        </h2>
        <h5 className="text-lg text-gray-600 max-w-2xl mx-auto">
          Latest research publications from our journal
        </h5>
      </div>

      {/* Carousel Container */}
      <div className="max-w-7xl mx-auto mb-12">
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
            el: '.published-journal-section .swiper-pagination',
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
        >
          {publishedManuscripts.map((manuscript) => (
            <SwiperSlide key={manuscript.id}>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={manuscript.image} 
                    alt={manuscript.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {manuscript.journalCategory}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {manuscript.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow leading-relaxed">
                    {manuscript.author}
                  </p>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-gray-500 text-xs font-medium">
                      Published: {new Date(manuscript.publishedDate).toLocaleDateString()}
                    </span>
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      View
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Pagination - This will use your existing CSS */}
        <div className="swiper-pagination published-journal-section !mt-14"></div>
      </div>

      {/* View All Button */}
      <div className="text-center">
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2">
          View All Manuscripts
          <svg className="w-5 h-5 transition-transform duration-300 hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LandingPublishedJournal;