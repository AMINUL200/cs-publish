import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import Loader from "../../common/Loader";

const UpdateBlog = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    blog_category_id: "",
    title: "",
    author: "",
    description: "",
    long_description: "",
    image: null,
    image_alt: "",
    date: "",
    most_view: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/blog-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.flag === 1) {
        setCategories(response.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch categories. Please try again later.");
      console.log(err);
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/admin/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const blogData = response.data.data;
        setFormData({
          blog_category_id: blogData.blog_category_id || "",
          title: blogData.title || "",
          author: blogData.author || "",
          description: blogData.description || "",
          long_description: blogData.long_description || "",
          image: null, // We don't set the file object for existing image
          image_alt: blogData.image_alt || "",
          date: formatDateForInput(blogData.date),
          most_view: blogData.most_view || 0,
        });

        // Set image preview if image exists
        if (blogData.image) {
          setImagePreview(blogData.image);
        }
      } else {
        toast.error("Failed to fetch blog details");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and blog details on component mount
  useEffect(() => {
    fetchCategories();
    fetchBlogDetails();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: content,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("blog_category_id", formData.blog_category_id);
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      submitData.append("description", formData.description);
      submitData.append("long_description", formData.long_description);
      submitData.append("image_alt", formData.image_alt);
      submitData.append("date", formData.date);
      // submitData.append("most_view", formData.most_view);
      // submitData.append('_method', 'PUT'); // For Laravel to recognize as PUT request

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const response = await axios.post(
        `${API_URL}api/admin/blogs/${id}`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/blog/view");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update blog";
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <div>
          <label
            htmlFor="blog_category_id"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category *
          </label>
          <select
            id="blog_category_id"
            name="blog_category_id"
            value={formData.blog_category_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            disabled={loading}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter blog title"
          />
        </div>

        {/* Author */}
        <div>
          <label
            htmlFor="author"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Author *
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter author name"
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date *
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Most Views */}
        {/* <div>
          <label
            htmlFor="most_view"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Most Views
          </label>
          <input
            type="number"
            id="most_view"
            name="most_view"
            value={formData.most_view}
            onChange={handleChange}
            min="0"
            disabled={loading}
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter view count"
          />
          <p className="text-sm text-gray-500 mt-1">
            Number of times this blog has been viewed
          </p>
        </div> */}

        {/* Image Upload */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Blog Image
          </label>

          {/* Upload Area */}
          {!imagePreview && (
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-600 mb-1">
                  Click to upload image
                </span>
                <span className="text-xs text-gray-400">
                  PNG, JPG, JPEG up to 5MB
                </span>
              </label>
            </div>
          )}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative inline-block group">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-48 w-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={loading}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {formData.image ? "New image selected" : "Current image"}
              </p>
            </div>
          )}

          {/* Alt Text Input */}
          <div>
            <label
              htmlFor="image_alt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Image Alt Text
            </label>
            <input
              type="text"
              id="image_alt"
              name="image_alt"
              value={formData.image_alt}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter descriptive alt text for the image"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Short Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading}
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter a brief description of the blog"
          />
        </div>

        {/* Long Description */}
        <div>
          <label
            htmlFor="long_description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Long Description *
          </label>
          <Editor
            apiKey={
              import.meta.env.VITE_TEXT_EDITOR_API_KEY ||
              "s2kx7b2f35ixr5a9ed48nxitfypd6aws8x7of79402kjvoeb"
            }
            value={formData.long_description}
            init={{
              height: 400,
              menubar: false,
              plugins: [
                "advlist",
                "autolink", // Added autolink plugin for automatic link detection
                "link", // Added link plugin for link functionality
                "lists",
                "charmap",
                "preview",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic underline | link | " + // Added link button to toolbar
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | " +
                "removeformat | help | code",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              // Optional: Configure link options
              link_context_toolbar: true,
              link_assume_external_targets: true,
              link_title: false,
              default_link_target: "_blank", // Opens links in new tab by default
              // Link dialog configuration
              link_list: [
                { title: "Home Page", value: "/" },
                { title: "About Page", value: "/about" },
                { title: "Contact Page", value: "/contact" },
              ],
            }}
            onEditorChange={(content) =>
              handleEditorChange(content, "long_description")
            }
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={updateLoading}
            className="inline-flex justify-center items-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {updateLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating Blog...
              </>
            ) : (
              "Update Blog"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
