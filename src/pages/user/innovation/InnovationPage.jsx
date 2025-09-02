import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCalendar, faQuoteLeft, faQuoteRight, faSearch, faStar } from '@fortawesome/free-solid-svg-icons'
import Breadcrumb from '../../../components/common/Breadcrumb'
import InnovationTestimonial from '../../../components/common/InnovationTestimonial'
import { Link } from 'react-router-dom'
import Loader from '../../../components/common/Loader'

const InnovationPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] =useState(true)

  // Dummy Data Arrays
  const recentInnovations = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      title: "AI-Powered Sustainable Energy Grid",
      description: "Revolutionary smart grid technology that optimizes renewable energy distribution using machine learning algorithms.",
      date: "2024-08-15",
      category: "Clean Tech"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      title: "Biodegradable Smart Packaging",
      description: "Innovative packaging solution that decomposes naturally while monitoring food freshness through embedded sensors.",
      date: "2024-08-10",
      category: "Sustainability"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      title: "Quantum Computing Healthcare ",
      description: "Next-generation medical diagnosis system leveraging quantum computing for unprecedented accuracy.",
      date: "2024-08-05",
      category: "Healthcare"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      title: "Neural Interface Communication",
      description: "Brain-computer interface enabling direct thought-to-digital communication for paralyzed patients.",
      date: "2024-07-30",
      category: "Biotech"
    }
  ]

  const popularInnovations = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      title: "Autonomous Delivery Drones",
      description: "Self-navigating delivery system reducing carbon footprint by 80% while ensuring 24/7 availability.",
      rating: 4.9,
      views: "2.3M",
      category: "Logistics"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
      title: "Lab-Grown Meat Revolution",
      description: "Cellular agriculture producing real meat without animals, addressing global food security challenges.",
      rating: 4.8,
      views: "1.9M",
      category: "Food Tech"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      title: "Ocean Plastic Recycling Robot",
      description: "Autonomous marine robots collecting and processing ocean plastic waste into valuable materials.",
      rating: 4.7,
      views: "1.5M",
      category: "Environmental"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
      title: "Holographic Display Technology",
      description: "True 3D holographic displays revolutionizing entertainment, education, and professional collaboration.",
      rating: 4.6,
      views: "1.2M",
      category: "Display Tech"
    }
  ]

  const upcomingInnovations = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      title: "Space Elevator Construction",
      description: "Revolutionary carbon nanotube-based space elevator reducing satellite deployment costs by 99%.",
      launchDate: "2025-Q3",
      status: "Development",
      funding: "$2.5B"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop",
      title: "Fusion Energy Breakthrough",
      description: "Compact fusion reactors providing unlimited clean energy for residential and commercial use.",
      launchDate: "2025-Q4",
      status: "Testing",
      funding: "$4.2B"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop",
      title: "Digital Twin Cities",
      description: "Complete virtual replicas of cities enabling advanced urban planning and disaster simulation.",
      launchDate: "2026-Q1",
      status: "Beta",
      funding: "$1.8B"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
      title: "Memory Enhancement Implants",
      description: "Neural implants augmenting human memory capacity and cognitive processing speed.",
      launchDate: "2026-Q2",
      status: "Research",
      funding: "$3.1B"
    }
  ]

  // Team Members Data
  const innovatorVoices = [
    {
      id: 1,
      name: "Sarah Mitchell",
      role: "Editor-in-Chief",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      bio: "Award-winning journalist with 15+ years in digital publishing",
      social: "@sarahmitchell"
    },
    {
      id: 2,
      name: "Marcus Johnson",
      role: "Senior Writer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
      bio: "Bestselling author and writing coach specializing in fiction",
      social: "@marcusjwrites"
    },
    {
      id: 3,
      name: "Lisa Chen",
      role: "Content Strategist",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
      bio: "Digital marketing expert helping authors build their online presence",
      social: "@lisachen_media"
    },
    {
      id: 4,
      name: "James Rivera",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
      bio: "Passionate about connecting writers and fostering creative communities",
      social: "@jamesrivera"
    }
  ];

  const InnovationCard = ({ innovation, type = 'recent' }) => (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
      <div className="relative overflow-hidden">
        <img
          src={innovation.image}
          alt={innovation.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            {innovation.category}
          </span>
        </div>
        {type === 'popular' && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-yellow-500 fill-current" />
            <span className="text-xs font-medium">{innovation.rating}</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {innovation.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {innovation.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          {type === 'recent' && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
              {new Date(innovation.date).toLocaleDateString()}
            </span>
          )}
          {type === 'popular' && (
            <span className="text-sm text-gray-500">
              {innovation.views} views
            </span>
          )}
          {type === 'upcoming' && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-green-600 font-medium">
                {innovation.status}
              </span>
              <span className="text-xs text-gray-500">
                Launch: {innovation.launchDate}
              </span>
            </div>
          )}
        </div>

        <Link
          to={`/innovation/${innovation.id}`}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer">
          Read More
          <FontAwesomeIcon icon={faArrowRight} className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  )

  useEffect(() => {
    window.scrollTo(0, 0);
    // Simulate API call with setTimeout
    const timer = setTimeout(() => {

      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />
  }



  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', path: '/', icon: 'home' },
        { label: 'Innovation' }
      ]} 
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Search Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">Innovation</span>
              </h1>
              <h5 className="text-xl text-blue-100 max-w-2xl mx-auto">
                Explore cutting-edge technologies and breakthrough innovations shaping our future
              </h5>
            </div>

            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 z-10"
                />

                <input
                  type="text"
                  placeholder="Search innovations, technologies, or innovators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 text-lg rounded-2xl border-0 shadow-2xl focus:ring-4 focus:ring-blue-300/50 focus:outline-none backdrop-blur-sm bg-white/95"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Innovations Section */}
        <section className="py-16 innovation-section">
          <div className="container mx-auto px-4 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Recent Innovations</h2>
              <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
                Stay updated with the latest breakthrough technologies and cutting-edge solutions
              </h5>
            </div>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              // navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1 },
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 3 }
              }}
              className="pb-12"
            >
              {recentInnovations.map((innovation) => (
                <SwiperSlide key={innovation.id}>
                  <InnovationCard innovation={innovation} type="recent" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Popular Innovations Section */}
        <section className="py-16 bg-white innovation-section">
          <div className="container mx-auto px-4 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Innovations</h2>
              <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover the most viewed and highly-rated innovations capturing global attention
              </h5>
            </div>

            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              // navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, reverseDirection: true }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 1 },
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 3 }
              }}
              className="pb-12"
            >
              {popularInnovations.map((innovation) => (
                <SwiperSlide key={innovation.id}>
                  <InnovationCard innovation={innovation} type="popular" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Upcoming Innovations Section */}
        <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50 innovation-section">
          <div className="container mx-auto px-4 md:px-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Upcoming Innovations</h2>
              <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get a glimpse into the future with innovations currently in development
              </h5>
            </div>

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
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 3 }
              }}
              className="pb-12"
            >
              {upcomingInnovations.map((innovation) => (
                <SwiperSlide key={innovation.id}>
                  <InnovationCard innovation={innovation} type="upcoming" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>

        {/* Innovators' Voices Section */}
        <section className="py-20 bg-white innovation-section ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Innovators</span>
              </h2>
              <h5 className="text-lg text-gray-600 max-w-2xl mx-auto text-center">
                The visionaries and pioneers driving technological advancement
              </h5>
            </div>

            <InnovationTestimonial innovatorVoices={innovatorVoices} />


          </div>
        </section>




      </div>
    </>

  )
}

export default InnovationPage