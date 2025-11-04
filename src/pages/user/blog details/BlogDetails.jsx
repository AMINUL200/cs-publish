import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import Loader from "../../../components/common/Loader";
import { formatDate } from "../../../lib/utils";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const BlogDetails = () => {
  const { id } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const [blogDetailsData, setBlogDetailsData] = useState(null);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [mostViewedBlogs, setMostViewedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState({
    name: "",
    email: "",
    message: "",
  });

  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}api/blog/details/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data;
        setBlogDetailsData(data.blog_details);
        setLatestBlogs(data.latest_blog || []);
        setMostViewedBlogs(data.most_view_blog || []);

        // Set comments from API response if available
        if (data.blog_details?.comments) {
          setComments(data.blog_details.comments);
        }
      }
    } catch (error) {
      console.log("Error fetching blog details:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch blog details"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBlogDetails();
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Pleas Login to comment");
      return;
    }
    if (
      !newComment.name.trim() ||
      !newComment.email.trim() ||
      !newComment.message.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // If you have API endpoint for adding comments, use this:
      const response = await axios.post(
        `${API_URL}api/blog-comment`,
        {
          blog_page_id: id,
          name: newComment.name,
          email: newComment.email,
          comment: newComment.message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 201) {
        console.log(response);
        fetchBlogDetails();
        setNewComment({
          name: "",
          email: "",
          message: "",
        });
        toast.success("Comment Submit Success Full")
      }
    } catch (error) {
      console.log("Error adding comment:", error);
      toast.error("Failed to add comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!blogDetailsData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600">Blog not found</h2>
          <Link
            to="/blog"
            className="text-blue-600 hover:underline mt-4 inline-block"
          >
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Blog", path: "/blog", icon: "folder" },
          { label: blogDetailsData.title },
        ]}
        pageTitle="Blog Details"
      />

      <div className="blog-details-section pb-8 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="blog-details-section-wrap">
            {/* Blog Header Section */}
            <div className="blog-post-content-box">
              <div className="meta-text-block flex flex-row justify-center items-center gap-2 pt-4 pb-2">
                <motion.div
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="blog-category bg-gray-100 text-gray-800 text-center border border-gray-100 h-6 px-4 flex items-center justify-center text-sm"
                >
                  {blogDetailsData.category?.category_name}
                </motion.div>
                <motion.div
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="blog-date text-gray-600"
                >
                  {formatDate(blogDetailsData.date)}
                </motion.div>
                <motion.div
                  initial={{ x: 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="blog-views text-gray-600"
                >
                  {blogDetailsData.most_view} views
                </motion.div>
              </div>

              <div className="blog-post-title-block text-center">
                <motion.div
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="blog-detail-title text-4xl md:text-5xl font-normal text-black mb-3"
                >
                  {blogDetailsData.title}
                </motion.div>
              </div>

              <div className="blog-details-desc-box text-center w-full md:w-3/5 mx-auto pb-5">
                <motion.p
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="blog-desc text-gray-700 mb-3"
                >
                  {blogDetailsData.description}
                </motion.p>
                <motion.p
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="author-name text-gray-600 font-medium"
                >
                  By {blogDetailsData.author}
                </motion.p>
              </div>

              <div className="blog-details-thumbnail-box flex justify-center items-center w-full h-96 md:h-[450px] mb-10 mx-auto relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="blog-single-image-box w-full h-full relative"
                >
                  <img
                    className="blog-single-image object-cover w-full h-full rounded-lg"
                    src={blogDetailsData.image}
                    alt={blogDetailsData.image_alt || blogDetailsData.title}
                  />
                </motion.div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="blog-content-wrap">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="blog-detail-content-block">
                    <div className="blog-rich-text-block-1">
                      <div
                        className="blog-rich-text prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: blogDetailsData.long_description,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="blog-sidebar flex flex-col gap-6">
                    {/* Most Viewed Posts */}
                    <div className="blog-sidebar-content-block bg-gray-50 p-6 rounded-lg">
                      <div className="blog-author-detail-box">
                        <div className="blog-author-thumbnail mb-5">
                          <h2 className="title text-2xl font-medium text-left">
                            Most Viewed Posts
                          </h2>
                        </div>
                        <div className="blog-author-box text-left">
                          {mostViewedBlogs.length > 0 ? (
                            mostViewedBlogs.map((post, index) => (
                              <Link
                                key={post.id || index}
                                to={`/blog/${post.id}`}
                                className="flex items-center gap-3 py-3 border-b border-gray-200 text-gray-700 hover:text-[#ffba00] transition-colors group"
                              >
                                <motion.div
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.4,
                                    delay: index * 0.1,
                                  }}
                                  className="flex items-center gap-3 w-full"
                                >
                                  <img
                                    src={post.image}
                                    alt={post.image_alt || post.title}
                                    className="w-12 h-12 rounded-full object-cover shadow-lg flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-2 group-hover:text-[#ffba00] transition-colors">
                                      {post.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {post.most_view} views
                                    </p>
                                  </div>
                                </motion.div>
                              </Link>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm py-3">
                              No most viewed posts
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Latest Blogs */}
                    <div className="blog-sidebar-content-block our-service bg-gray-50 p-6 rounded-lg">
                      <div className="blog-author-detail-box">
                        <div className="blog-author-thumbnail mb-5">
                          <h2 className="title text-2xl font-medium text-left">
                            Latest Blogs
                          </h2>
                        </div>
                        <div className="blog-author-box text-left">
                          {latestBlogs.length > 0 ? (
                            latestBlogs.map((latest, index) => (
                              <Link
                                key={latest.id || index}
                                to={`/blog/${latest.id}`}
                                className="flex items-center gap-3 py-3 border-b border-gray-200 text-gray-700 hover:text-[#ffba00] transition-colors group"
                              >
                                <motion.div
                                  initial={{ opacity: 0, x: 50 }}
                                  whileInView={{ x: 0, opacity: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 420,
                                    damping: 32,
                                    mass: 0.75,
                                    delay: index * 0.08,
                                  }}
                                  viewport={{ once: true, amount: 0.25 }}
                                  className="flex items-center gap-3 w-full group-hover:gap-4 transition-all duration-300"
                                >
                                  <img
                                    src={latest.image}
                                    alt={latest.image_alt || latest.title}
                                    className="w-12 h-12 rounded object-cover shadow-lg flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-2 group-hover:text-[#ffba00] transition-colors">
                                      {latest.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {formatDate(latest.date)}
                                    </p>
                                  </div>
                                </motion.div>
                              </Link>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm py-3">
                              No latest blogs
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments and Author Section */}
            <div className="mt-10 lg:mt-14">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                  {/* Comments Section */}
                  <div className="comments-box bg-white p-6 rounded-lg border border-gray-100">
                    <h3 className="text-xl font-medium mb-4">
                      Comments ({comments.length})
                    </h3>
                    <div className="flex flex-col divide-y divide-gray-100 overflow-auto max-h-96 custom-scrollbar">
                      {comments.length === 0 ? (
                        <p className="text-sm text-gray-500 py-4">
                          No comments yet. Be the first to comment.
                        </p>
                      ) : (
                        comments?.map((comment) => (
                          <div
                            key={comment.id}
                            className="py-4 flex items-start gap-3"
                          >
                            {/* <img
                              src={
                                comment.avatar ||
                                `https://i.pravatar.cc/100?u=${encodeURIComponent(
                                  comment.email
                                )}`
                              }
                              alt={comment.name}
                              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                            /> */}
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {comment.name}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {formatDate(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-700 mt-1">
                                {comment.comment || comment.message}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Comment Form */}
                  <div className="comment-form bg-gray-50 p-6 rounded-lg border border-gray-100">
                    <h3 className="text-xl font-medium mb-4">
                      Leave a Comment
                    </h3>
                    <form
                      onSubmit={handleSubmitComment}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      <div className="md:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          value={newComment.name}
                          onChange={(e) =>
                            setNewComment((p) => ({
                              ...p,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Your name"
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-sm text-gray-600 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          value={newComment.email}
                          onChange={(e) =>
                            setNewComment((p) => ({
                              ...p,
                              email: e.target.value,
                            }))
                          }
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">
                          Message *
                        </label>
                        <textarea
                          rows="4"
                          className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                          value={newComment.message}
                          onChange={(e) =>
                            setNewComment((p) => ({
                              ...p,
                              message: e.target.value,
                            }))
                          }
                          placeholder="Write your comment..."
                          required
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                        >
                          Post Comment
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="lg:col-span-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogDetails;
