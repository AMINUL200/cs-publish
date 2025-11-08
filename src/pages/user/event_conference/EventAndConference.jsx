import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EventAndConference = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  
  const [conferences, setConferences] = useState([]);
  const [filteredConferences, setFilteredConferences] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch conferences on component mount
  useEffect(() => {
    fetchConferences();
  }, []);

  // Extract categories and filter conferences when data changes
  useEffect(() => {
    if (conferences.length > 0) {
      const uniqueCategories = ["all", ...new Set(conferences.map(conf => conf.catagory))];
      setCategories(uniqueCategories);
      filterConferences(selectedCategory);
    }
  }, [conferences]);

  const fetchConferences = async () => {
    try {
      setLoading(true);
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await axios.get(`${API_URL}api/conference`, config);
      
      if (response.data.status) {
        setConferences(response.data.data);
      } else {
        setError("Failed to fetch conferences");
      }
    } catch (err) {
      setError("Error loading conferences. Please try again later.");
      console.error("Error fetching conferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterConferences = (category) => {
    if (category === "all") {
      setFilteredConferences(conferences);
    } else {
      const filtered = conferences.filter(conf => conf.catagory === category);
      setFilteredConferences(filtered);
    }
    setSelectedCategory(category);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Color scheme functions
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

  const getCardBorderColor = (category) => {
    const colors = {
      "Physics Confarences": "border-yellow-400",
      "Mathamatics": "border-red-600",
      "International Conference": "border-gray-800"
    };
    return colors[category] || "border-gray-400";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading conferences...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 sm:py-25">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Events & Conferences
          </h1>
          <h5 className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover upcoming conferences and events in various fields of study
          </h5>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Side - Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => filterConferences(category)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-yellow-500 text-gray-900 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Conference List */}
          <div className="lg:w-3/4">
            {filteredConferences.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No conferences found for the selected category.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {filteredConferences.map((conference) => (
                  <div
                    key={conference.id}
                    className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${getCardBorderColor(conference.catagory)} hover:shadow-lg transition-shadow duration-300`}
                  >
                    {/* Conference Image */}
                    {conference.image ? (
                      <img
                        src={conference.image}
                        alt={conference.image_alt}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image Available</span>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Category Badge */}
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(conference.catagory)} ${getCategoryTextColor(conference.catagory)}`}
                        >
                          {conference.catagory}
                        </span>
                        <span className="text-sm text-gray-500">
                          Views: {conference.most_view}
                        </span>
                      </div>

                      {/* Conference Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {conference.name}
                      </h3>

                      {/* Location and Date */}
                      <div className="flex items-center text-gray-600 mb-3">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm">{conference.location}</span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-4">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm">{formatDate(conference.date)}</span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {conference.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <button 
                        onClick={()=> navigate(`/conference-detail/${conference.slug}`)}
                        className="flex-1 bg-yellow-500 text-gray-900 py-2 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors duration-200">
                          View Details
                        </button>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAndConference;