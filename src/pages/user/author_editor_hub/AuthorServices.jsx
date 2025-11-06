import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Calendar, 
  Share2, 
  BookOpen,
  ExternalLink,
  Users,
  FileCheck,
  Edit3,
  Search
} from "lucide-react";

const AuthorServices = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch services data
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/services`);
      
      if (response.data.status) {
        setServices(response.data.data);
      } else {
        throw new Error("Failed to fetch services data");
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services based on search term
  const filteredServices = services.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.short_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to get service icon based on title
  const getServiceIcon = (title) => {
    if (title.includes("Publication")) return <BookOpen className="w-6 h-6" />;
    if (title.includes("Peer Review")) return <FileCheck className="w-6 h-6" />;
    if (title.includes("Editing")) return <Edit3 className="w-6 h-6" />;
    if (title.includes("DOI")) return <ExternalLink className="w-6 h-6" />;
    return <Users className="w-6 h-6" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-4 w-32 bg-yellow-200 rounded mx-auto mb-4"></div>
            <div className="h-12 w-96 bg-gray-200 rounded mx-auto mb-4"></div>
            <div className="h-4 w-64 bg-gray-200 rounded mx-auto"></div>
          </div>

          {/* Search Skeleton */}
          <div className="max-w-2xl mx-auto mb-12 animate-pulse">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Services</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12 sm:py-26">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center space-x-2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Users className="w-4 h-4" />
            <span>Author Services</span>
          </div> */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Professional <span className="text-yellow-600">Author Services</span>
          </h1>
          <h5 className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive publishing support services designed to help researchers 
            and authors achieve academic excellence and maximize the impact of their work.
          </h5>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search services by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Services Grid */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Found</h3>
            <p className="text-gray-500">
              {searchTerm ? "No services match your search criteria." : "There are currently no services available."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                  {/* Service Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=Service+Image';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <div className="bg-yellow-500 text-black p-2 rounded-lg shadow-lg">
                        {getServiceIcon(service.title)}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {service.status === "1" ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>

                  {/* Service Content */}
                  <div className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(service.updated_at)}</span>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {service.title}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                      {service.short_description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/cms/${service.slug}`)}
                        className="flex items-center space-x-2 bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-all duration-300 group/btn"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: service.title,
                              text: service.short_description,
                              url: `${window.location.origin}/cms/${service.slug}`,
                            });
                          } else {
                            navigator.clipboard.writeText(`${window.location.origin}/cms/${service.slug}`);
                            alert('Service link copied to clipboard!');
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Share Service"
                      >
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Footer Accent */}
                  <div className="h-1 bg-gradient-to-r from-yellow-500 via-red-700 to-black"></div>
                </div>
              ))}
            </div>

           

         
          </>
        )}
      </div>
    </div>
  );
};

export default AuthorServices;