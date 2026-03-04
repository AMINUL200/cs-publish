// pages/TeamPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Users, X, Filter, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch team members
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/team`); // Adjust endpoint as needed

      if (response.data && response.data.data) {
        setTeamMembers(response.data.data);
        setFilteredMembers(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredMembers(teamMembers);
    } else {
      const filtered = teamMembers.filter((member) => {
        const { name, position } = getTeamMemberInfo(member.title);
        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          position.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.short_description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        );
      });
      setFilteredMembers(filtered);
    }
  }, [searchTerm, teamMembers]);

  // Extract name and position from title
  const getTeamMemberInfo = (title) => {
    const parts = title.split("—");
    if (parts.length === 2) {
      return {
        name: parts[0].trim(),
        position: parts[1].trim(),
      };
    }
    return {
      name: title,
      position: "Team Member",
    };
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meet <span className="text-yellow-400">Our Team</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Loading our amazing team members...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="bg-gray-300 h-80 w-full"></div>
                <div className="p-6 text-center">
                  <div className="bg-gray-300 h-6 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="bg-gray-300 h-3 rounded w-full mx-auto mb-2"></div>
                  <div className="bg-gray-300 h-3 rounded w-5/6 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meet <span className="text-yellow-400">Our Team</span>
            </h1>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-12 max-w-2xl mx-auto text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">
              Unable to Load Team
            </h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchTeamMembers}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 pt-30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet <span className="text-yellow-400">Our Team</span>
          </h1>
          <h5 className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Dedicated professionals committed to excellence in scientific
            publishing and innovation
          </h5>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, position, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-lg"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Stats */}
            {searchTerm && (
              <div className="mt-3 text-left text-gray-600">
                Found{" "}
                <span className="font-semibold">{filteredMembers.length}</span>{" "}
                team member{filteredMembers.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>
        </div>

        {/* Team Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 max-w-2xl mx-auto text-center">
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No team members found
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              {searchTerm
                ? `No results match "${searchTerm}". Try adjusting your search.`
                : "Team members will appear here once added."}
            </p>
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors font-semibold"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-8 text-right text-gray-600">
              Showing{" "}
              <span className="font-semibold">{filteredMembers.length}</span> of{" "}
              <span className="font-semibold">{teamMembers.length}</span> team
              members
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mx-6">
              {filteredMembers.map((member) => {
                const { name, position } = getTeamMemberInfo(member.title);

                return (
                  <div
                    key={member.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group"
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden">
                      <img
                        src={`${STORAGE_URL}${member.image}`}
                        alt={name}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=${encodeURIComponent(
                            name.charAt(0),
                          )}`;
                        }}
                      />
                      {/* Overlay with social links */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                          {member.facebook_link && (
                            <a
                              href={member.facebook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-yellow-600 text-white p-3 rounded-full hover:bg-yellow-700 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </a>
                          )}
                          {member.twitter_link && (
                            <a
                              href={member.twitter_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-yellow-400 text-white p-3 rounded-full hover:bg-yellow-500 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                              </svg>
                            </a>
                          )}
                          {member.linkedin_link && (
                            <a
                              href={member.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-yellow-700 text-white p-3 rounded-full hover:bg-yellow-800 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                              </svg>
                            </a>
                          )}
                          {member.instagram_link && (
                            <a
                              href={member.instagram_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.22 14.815 3.73 13.664 3.73 12.367s.49-2.448 1.396-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.906.875 1.396 2.026 1.396 3.323s-.49 2.448-1.396 3.323c-.875.807-2.026 1.297-3.323 1.297z" />
                              </svg>
                            </a>
                          )}
                          {!member.facebook_link &&
                            !member.twitter_link &&
                            !member.linkedin_link &&
                            !member.instagram_link && (
                              <span className="text-white text-sm bg-gray-600 px-3 py-2 rounded-full">
                                No Social Links
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 text-center">
                      <Link
                        to={`/cms/${member.slug}`}
                        className="text-xl font-bold text-gray-800 mb-2 hover:text-yellow-600 transition-colors block"
                      >
                        {name}
                      </Link>
                      {/* <p className="text-yellow-600 font-semibold mb-3">
                        {position}
                      </p> */}
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {member.short_description}
                      </p>

                      {/* Read More Link */}
                      <Link
                        to={`/cms/${member.slug}`}
                        className="inline-block mt-4 text-yellow-600 hover:text-yellow-700 font-medium text-sm"
                      >
                        View Profile →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Back to Home Link */}
        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamPage;
