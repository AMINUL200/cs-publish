import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const EventAndConferenceDetail = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const { slug } = useParams(); // Extract slug from URL
  
  const [conference, setConference] = useState(null);
  const [latestConferences, setLatestConferences] = useState([]);
  const [popularConferences, setPopularConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch conference details on component mount
  useEffect(() => {
    fetchConferenceDetail();
  }, [slug]);

  const fetchConferenceDetail = async () => {
    try {
      setLoading(true);
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(`${API_URL}api/conference-details/${slug}`, config);
      
      if (response.data.status) {
        setConference(response.data.data);
        setLatestConferences(response.data.latest_5 || []);
        setPopularConferences(response.data.popular_5 || []);
      } else {
        setError("Conference not found");
      }
    } catch (err) {
      setError("Error loading conference details. Please try again later.");
      console.error("Error fetching conference:", err);
    } finally {
      setLoading(false);
    }
  };

  // Color scheme functions (consistent with list page)
  const getCategoryColor = (category) => {
    const colors = {
      "Physics Confarences": "bg-yellow-500",
      "Mathamatics": "bg-red-700",
      "International Conference": "bg-black"
    };
    return colors[category] || "bg-gray-500";
  };

  const getCategoryTextColor = (category) => {
    const colors = {
      "Physics Confarences": "text-gray-800",
      "Mathamatics": "text-white",
      "International Conference": "text-white"
    };
    return colors[category] || "text-white";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading conference details...</div>
      </div>
    );
  }

  if (error || !conference) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">{error || "Conference not found"}</div>
          <Link 
            to="/events" 
            className="bg-yellow-500 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-25">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Link 
            to="/events" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Events
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Conference Image */}
              {conference.image ? (
                <img
                  src={`${STORAGE_URL}${conference.image}`}
                  alt={conference.image_alt}
                  className="w-full h-64 lg:h-80 object-cover"
                />
              ) : (
                <div className="w-full h-64 lg:h-80 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-lg">No Image Available</span>
                </div>
              )}

              <div className="p-6 lg:p-8">
                {/* Category Badge and Views */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(conference.catagory)} ${getCategoryTextColor(conference.catagory)}`}
                  >
                    {conference.catagory}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {conference.most_view} views
                  </span>
                </div>

                {/* Conference Title */}
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                  {conference.name}
                </h1>

                {/* Location and Date */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{conference.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{formatDate(conference.date)}</span>
                  </div>
                </div>

                {/* Short Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">About this Event</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {conference.description}
                  </p>
                </div>

                {/* Long Description with HTML content */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">Event Details</h2>
                  <div 
                    className="blog-rich-text max-w-none text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: conference.long_description }}
                  />
                </div>

                
              </div>
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:w-1/3 space-y-8">
            {/* Latest Conferences */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Latest Conferences
              </h3>
              <div className="space-y-4">
                {latestConferences.map((conf) => (
                  <Link
                    key={conf.id}
                    to={`/events/${conf.slug}`}
                    className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {conf.image ? (
                      <img
                        src={`${STORAGE_URL}${conf.image}`}
                        alt={conf.image_alt}
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                        {conf.name}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{formatDate(conf.date)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Popular Conferences */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-200">
                Most Viewed
              </h3>
              <div className="space-y-4">
                {popularConferences.map((conf) => (
                  <Link
                    key={conf.id}
                    to={`/events/${conf.slug}`}
                    className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    {conf.image ? (
                      <img
                        src={`${STORAGE_URL}${conf.image}`}
                        alt={conf.image_alt}
                        className="w-16 h-16 object-cover rounded flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
                        {conf.name}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {conf.most_view} views
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAndConferenceDetail;