import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { formatDate } from "../../../lib/utils";

const UserBlogPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const [blogData, setBlogData] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const fetchBlogData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const blogs = response.data.data;
        setBlogData(blogs);
        setFilteredBlogs(blogs);
        
        // Extract unique categories
        const uniqueCategories = [...new Map(blogs.map(blog => 
          [blog.category.id, blog.category])
        ).values()];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogData();
  }, []);

  // Filter blogs based on selected category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredBlogs(blogData);
    } else {
      const filtered = blogData.filter(blog => 
        blog.category.id.toString() === selectedCategory
      );
      setFilteredBlogs(filtered);
    }
  }, [selectedCategory, blogData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Home", path: "/", icon: "home" }, { label: "Blogs" }]}
        pageTitle="Blogs"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4 max-w-8xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our <span className="text-yellow-600">Blog</span>
            </h1>
            <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover insightful articles, latest trends, and expert opinions from our team
            </h5>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Filter by Category</h3>
                
                {/* All Categories Button */}
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left px-4 py-3 rounded-xl mb-3 transition-all duration-200 ${
                    selectedCategory === "all" 
                      ? "bg-yellow-600 text-white shadow-lg" 
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="font-medium">All Categories</span>
                  <span className="ml-2 text-sm opacity-75">({blogData.length})</span>
                </button>

                {/* Category Filters */}
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id.toString())}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                        selectedCategory === category.id.toString()
                          ? "bg-yellow-600 text-white shadow-lg"
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <span className="font-medium">{category.category_name}</span>
                      <span className="ml-2 text-sm opacity-75">
                        ({blogData.filter(blog => blog.category.id === category.id).length})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Active Filter Info */}
                {selectedCategory !== "all" && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-sm text-yellow-800">
                      Showing blogs from{" "}
                      <strong>
                        {categories.find(cat => cat.id.toString() === selectedCategory)?.category_name}
                      </strong>
                    </p>
                    <button
                      onClick={() => setSelectedCategory("all")}
                      className="text-yellow-600 hover:text-yellow-800 text-sm font-medium mt-2"
                    >
                      Clear filter
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content - Blog Cards */}
            <div className="lg:w-3/4">
              {/* Results Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  Showing <span className="font-semibold">{filteredBlogs.length}</span> 
                  {filteredBlogs.length === 1 ? " blog" : " blogs"}
                  {selectedCategory !== "all" && (
                    <> in <span className="font-semibold text-yellow-600">
                      {categories.find(cat => cat.id.toString() === selectedCategory)?.category_name}
                    </span></>
                  )}
                </p>
              </div>

              {/* Blog Grid */}
              {filteredBlogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                    >
                      {/* Image */}
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={blog.image}
                          alt={blog.image_alt || blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <span className="custom-btn text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                            {blog.category.category_name}
                          </span>
                        </div>
                        {/* View Count */}
                        <div className="absolute top-4 right-4">
                          <span className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-medium">
                            {blog.most_view} views
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        {/* Date */}
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(blog.date)}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
                          {blog.title}
                        </h3>

                        {/* Description */}
                        {/* <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                          {blog.description}
                        </p> */}

                        {/* Author */}
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          By {blog.author}
                        </div>

                        {/* Read More Button */}
                        <Link
                          to={`/blog/${blog.id}`}
                          className="inline-flex items-center justify-center w-full custom-btn text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 hover:shadow-lg group/btn"
                        >
                          Read More
                          <svg className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // No Results State
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <svg className="w-24 h-24 text-gray-300 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No blogs found</h3>
                    <p className="text-gray-600 mb-6">
                      {selectedCategory !== "all" 
                        ? `No blogs found in the selected category. Try selecting a different category.`
                        : `No blogs available at the moment. Please check back later.`
                      }
                    </p>
                    {selectedCategory !== "all" && (
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className="custom-btn text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                      >
                        View All Blogs
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBlogPage;