// pages/TeamPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, Users, X, ArrowLeft } from "lucide-react";
import axios from "axios";

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const API_URL = import.meta.env.VITE_API_URL;

  // ---------------- FETCH ----------------
  const fetchTeamMembers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/team`, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });

      if (response.data?.data) {
        setTeamMembers(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  // ---------------- CATEGORIES ----------------
  // Build unique categories from the loaded team members
  const categories = useMemo(() => {
    const map = new Map();

    teamMembers.forEach((member) => {
      const cat = member.team_category;
      if (!cat) return;

      if (!map.has(cat.id)) {
        map.set(cat.id, {
          id: cat.id,
          name: cat.name,
          order: Number(cat.is_order) || 999,
          count: 0,
        });
      }
      map.get(cat.id).count += 1;
    });

    return Array.from(map.values()).sort(
      (a, b) => a.order - b.order || a.id - b.id
    );
  }, [teamMembers]);

  // ---------------- HELPERS ----------------
  const getTeamMemberInfo = (title = "") => {
    const parts = title.split("--");
    if (parts.length === 2) {
      return { name: parts[0].trim(), position: parts[1].trim() };
    }
    return { name: title, position: "Team Member" };
  };

  // ---------------- FILTER ----------------
  const filteredMembers = useMemo(() => {
    let filtered = [...teamMembers];

    // ✅ FIXED: compare as strings
    if (selectedCategory !== "ALL") {
      filtered = filtered.filter(
        (m) => String(m.category) === String(selectedCategory)
      );
    }

    // Search
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((member) => {
        const { name, position } = getTeamMemberInfo(member.title);
        return (
          name.toLowerCase().includes(q) ||
          position.toLowerCase().includes(q) ||
          member.short_description?.toLowerCase().includes(q) ||
          member.team_category?.name?.toLowerCase().includes(q)
        );
      });
    }

    // ✅ Also sort by the member's own is_order inside the category
    filtered.sort((a, b) => {
      const oa = Number(a.is_order) || 999;
      const ob = Number(b.is_order) || 999;
      return oa - ob;
    });

    return filtered;
  }, [teamMembers, selectedCategory, searchTerm]);

  // ---------------- UI HELPERS ----------------
  const getCategoryName = (id) =>
    categories.find((c) => String(c.id) === String(id))?.name || "Unknown";

  const getTotalMembersCount = () => teamMembers.length;

  const clearSearch = () => setSearchTerm("");

  // ---------------- LOADING ----------------
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
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

  // ---------------- ERROR ----------------
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

  // ---------------- RENDER ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16 pt-32">
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

          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, position, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="max-w-5xl mx-auto mb-10">
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSelectedCategory("ALL")}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === "ALL"
                    ? "bg-yellow-500 text-white shadow-lg ring-2 ring-yellow-300"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                }`}
              >
                ALL
                <span className="ml-2 text-sm">({getTotalMembersCount()})</span>
              </button>

              {categories.map((category) => {
                const catIdStr = String(category.id);
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(catIdStr)}
                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === catIdStr
                        ? "bg-yellow-500 text-white shadow-lg ring-2 ring-yellow-300"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 text-sm">({category.count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats bar */}
        {(searchTerm || selectedCategory !== "ALL") && (
          <div className="max-w-5xl mx-auto mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="text-gray-600">
                Found{" "}
                <span className="font-semibold text-yellow-600">
                  {filteredMembers.length}
                </span>{" "}
                team member{filteredMembers.length !== 1 ? "s" : ""}
                {selectedCategory !== "ALL" && (
                  <span className="ml-1">
                    in{" "}
                    <span className="font-semibold">
                      {getCategoryName(selectedCategory)}
                    </span>{" "}
                    category
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {selectedCategory !== "ALL" && (
                  <button
                    onClick={() => setSelectedCategory("ALL")}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Clear Filter
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Grid / Empty */}
        {filteredMembers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 max-w-2xl mx-auto text-center">
            <Users className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No team members found
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              {searchTerm || selectedCategory !== "ALL"
                ? `No results match your filters. Try adjusting them.`
                : "Team members will appear here once added."}
            </p>
            {(searchTerm || selectedCategory !== "ALL") && (
              <div className="flex gap-3 justify-center">
                {selectedCategory !== "ALL" && (
                  <button
                    onClick={() => setSelectedCategory("ALL")}
                    className="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 font-semibold"
                  >
                    Clear Category Filter
                  </button>
                )}
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-8 text-right text-gray-600 max-w-5xl mx-auto">
              Showing{" "}
              <span className="font-semibold text-yellow-600">
                {filteredMembers.length}
              </span>{" "}
              of <span className="font-semibold">{teamMembers.length}</span>{" "}
              team members
            </div>

            <div
              className="grid gap-8 mx-6 justify-center"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 320px))",
              }}
            >
              {filteredMembers.map((member) => {
                const { name, position } = getTeamMemberInfo(member.title);
                const categoryName =
                  member.team_category?.name || "Uncategorized";

                return (
                  <div
                    key={member.id}
                    className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group w-full max-w-sm"
                  >
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-yellow-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                        {categoryName}
                      </span>
                    </div>

                    <div className="relative overflow-hidden">
                      <img
                        src={`${STORAGE_URL}${member.image}`}
                        alt={name}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=${encodeURIComponent(
                            name.charAt(0)
                          )}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                          {member.facebook_link && (
                            <a
                              href={member.facebook_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700"
                            >
                              FB
                            </a>
                          )}
                          {member.twitter_link && (
                            <a
                              href={member.twitter_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600"
                            >
                              TW
                            </a>
                          )}
                          {member.linkedin_link && (
                            <a
                              href={member.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-800 text-white p-3 rounded-full hover:bg-blue-900"
                            >
                              IN
                            </a>
                          )}
                          {member.instagram_link && (
                            <a
                              href={member.instagram_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700"
                            >
                              IG
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

                    <div className="p-6 text-center">
                      <Link
                        to={`/cms/${member.slug}`}
                        className="text-xl font-bold text-gray-800 mb-2 hover:text-yellow-600 transition-colors block"
                      >
                        {name}
                      </Link>
                      <p className="text-yellow-600 font-semibold mb-3">
                        {position}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                        {member.short_description}
                      </p>
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