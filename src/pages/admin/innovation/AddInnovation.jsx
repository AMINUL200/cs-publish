import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Save,
  Upload,
  Youtube,
  FileText,
  Image,
  X,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";

const AddInnovation = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const updateId = searchParams.get("update");

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [mediaType, setMediaType] = useState("youtube"); // 'youtube' or 'image'
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    page_title: "",
    title: "",
    description: "",
    long_description: "",
    image_video: "",
    image_alt_tag: "",
    innovator_name: "",
    innovator_desc: "",
    innovator_email: "",
    is_upcomming: false,
    pdf: null,
    image_file: null,
  });

  // Fetch innovation data for update
  useEffect(() => {
    if (updateId) {
      fetchInnovationData();
    }
  }, [updateId]);

  const fetchInnovationData = async () => {
    try {
      setFetchLoading(true);
      const response = await axios.get(
        `${API_URL}api/innovations/${updateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        const data = response.data.data;

        // Determine media type
        const isYouTube =
          data.image_video?.includes("youtube.com") ||
          data.image_video?.includes("youtu.be");
        setMediaType(isYouTube ? "youtube" : "image");

        setFormData({
          page_title: data.page_title || "",
          title: data.title || "",
          description: data.description || "",
          long_description: data.long_description || "",
          image_video: isYouTube ? data.image_video : "",
          image_alt_tag: data.image_alt_tag || "",
          innovator_name: data.innovator_name || "",
          innovator_desc: data.innovator_desc || "",
          innovator_email: data.innovator_email || "",
          is_upcomming: data.is_upcomming || false,
          pdf: null,
          image_file: null,
        });

        // Set image preview if it's an image URL
        if (!isYouTube && data.image_video) {
          setImagePreview(`${STORAGE_URL}${data.image_video}`);
        }
      }
    } catch (error) {
      console.error("Error fetching innovation:", error);
      toast.error("Failed to load innovation data");
      navigate("/admin/innovations");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (files[0]) {
        if (name === "pdf") {
          // Validate PDF file
          if (files[0].type !== "application/pdf") {
            toast.error("Please select a valid PDF file");
            return;
          }
          if (files[0].size > 10 * 1024 * 1024) {
            // 10MB
            toast.error("PDF file size should be less than 10MB");
            return;
          }
          setFormData((prev) => ({ ...prev, pdf: files[0] }));
        } else if (name === "image_file") {
          // Validate image file
          if (!files[0].type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
          }
          if (files[0].size > 5 * 1024 * 1024) {
            // 5MB
            toast.error("Image size should be less than 5MB");
            return;
          }
          setFormData((prev) => ({ ...prev, image_file: files[0] }));

          // Create preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(files[0]);
        }
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditorChange = (content, fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: content,
    }));
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_file: null }));
    setImagePreview(null);

    const fileInput = document.querySelector('input[name="image_file"]');
    if (fileInput) fileInput.value = "";
  };

  const handleRemovePdf = () => {
    setFormData((prev) => ({ ...prev, pdf: null }));

    const fileInput = document.querySelector('input[name="pdf"]');
    if (fileInput) fileInput.value = "";
  };

  const validateForm = () => {
    if (!formData.page_title.trim()) {
      toast.error("Page title is required");
      return false;
    }
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return false;
    }
    if (!formData.long_description.trim()) {
      toast.error("Long description is required");
      return false;
    }
    if (mediaType === "youtube" && !formData.image_video.trim()) {
      toast.error("YouTube URL is required");
      return false;
    }
    if (mediaType === "image" && !formData.image_file && !imagePreview) {
      toast.error("Image is required");
      return false;
    }
    if (!formData.innovator_name.trim()) {
      toast.error("Innovator name is required");
      return false;
    }
    if (!formData.innovator_email.trim()) {
      toast.error("Innovator email is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const submitData = new FormData();

      // Append basic fields
      submitData.append("page_title", formData.page_title);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("long_description", formData.long_description);
      submitData.append("image_alt_tag", formData.image_alt_tag);
      submitData.append("innovator_name", formData.innovator_name);
      submitData.append("innovator_desc", formData.innovator_desc);
      submitData.append("innovator_email", formData.innovator_email);
      submitData.append("is_upcomming", formData.is_upcomming ? "1" : "0");

      // Handle media based on type - CONDITIONAL LOGIC
      if (mediaType === "youtube") {
        // For YouTube: Send URL as string in image_video field
        submitData.append("image_video", formData.image_video);
      } else if (mediaType === "image") {
        // For Image: Send file in image field
        if (formData.image_file) {
          submitData.append("image_video", formData.image_file);
        }
        // If updating and image already exists (imagePreview from API), don't send anything
        // The backend should handle keeping the existing image
      }

      // Append PDF if exists
      if (formData.pdf) {
        submitData.append("pdf", formData.pdf);
      }

      // Debug: Log FormData contents
      console.group("🔍 FormData Debug - Final");
      // Debug FormData before sending
      for (const [key, value] of submitData.entries()) {
        console.log(`${key}:`, value);
      }

      let response;
      if (updateId) {
        // Update existing innovation
        response = await axios.post(
          `${API_URL}api/innovations/${updateId}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new innovation
        response = await axios.post(`${API_URL}api/innovations`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.data.status) {
        toast.success(
          updateId
            ? "Innovation updated successfully!"
            : "Innovation created successfully!"
        );
        navigate("/handle-innovation");
      }
    } catch (error) {
      console.error("Error saving innovation:", error);
      toast.error(
        error.response?.data?.message ||
          `Failed to ${updateId ? "update" : "create"} innovation`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Innovations</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {updateId ? "Edit Innovation" : "Add New Innovation"}
            </h1>
            <p className="text-gray-600 mt-2">
              {updateId
                ? "Update the innovation details"
                : "Create a new innovation entry"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md border border-gray-200"
      >
        <div className="p-6 space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="page_title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Page Title *
              </label>
              <input
                type="text"
                id="page_title"
                name="page_title"
                value={formData.page_title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter page title"
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Content Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter content title"
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
              onChange={handleInputChange}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical"
              placeholder="Enter a brief description"
            />
          </div>

          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Media Type *
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  checked={mediaType === "youtube"}
                  onChange={() => setMediaType("youtube")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Youtube className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">YouTube Video</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="mediaType"
                  checked={mediaType === "image"}
                  onChange={() => setMediaType("image")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <Image className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Image</span>
              </label>
            </div>
          </div>

          {/* Media Input */}
          {mediaType === "youtube" ? (
            <div>
              <label
                htmlFor="image_video"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                YouTube URL *
              </label>
              <input
                type="url"
                id="image_video"
                name="image_video"
                value={formData.image_video}
                onChange={handleInputChange}
                required={mediaType === "youtube"}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the full YouTube video URL
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Upload *
              </label>
              {imagePreview ? (
                <div className="mb-4">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-48 w-auto object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50">
                  <input
                    type="file"
                    name="image_file"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-600">
                      Click to upload image
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG, JPEG up to 5MB
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Image Alt Tag */}
          <div>
            <label
              htmlFor="image_alt_tag"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Image Alt Tag
            </label>
            <input
              type="text"
              id="image_alt_tag"
              name="image_alt_tag"
              value={formData.image_alt_tag}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter descriptive alt text for the image"
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF Document
            </label>
            {formData.pdf ? (
              <div className="flex items-center space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800 flex-1">
                  {formData.pdf.name}
                </span>
                <button
                  type="button"
                  onClick={handleRemovePdf}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-all duration-300 hover:border-green-400 hover:bg-green-50">
                <input
                  type="file"
                  name="pdf"
                  accept=".pdf"
                  onChange={handleInputChange}
                  className="hidden"
                  id="pdf-upload"
                />
                <label
                  htmlFor="pdf-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <FileText className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm font-medium text-gray-600">
                    Upload PDF Document
                  </span>
                  <span className="text-xs text-gray-400">PDF up to 10MB</span>
                </label>
              </div>
            )}
          </div>

          {/* Innovator Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="innovator_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Innovator Name *
              </label>
              <input
                type="text"
                id="innovator_name"
                name="innovator_name"
                value={formData.innovator_name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter innovator name"
              />
            </div>

            <div>
              <label
                htmlFor="innovator_email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Innovator Email *
              </label>
              <input
                type="email"
                id="innovator_email"
                name="innovator_email"
                value={formData.innovator_email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Enter innovator email"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="innovator_desc"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Innovator Description
            </label>
            <textarea
              id="innovator_desc"
              name="innovator_desc"
              value={formData.innovator_desc}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 resize-vertical"
              placeholder="Enter innovator description"
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
              apiKey={apikey}
              value={formData.long_description}
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "link",
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
                  "undo redo | blocks | bold italic underline | link | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help | code",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                link_context_toolbar: true,
                link_assume_external_targets: true,
                link_title: false,
                default_link_target: "_blank",
              }}
              onEditorChange={(content) =>
                handleEditorChange(content, "long_description")
              }
            />
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                name="is_upcomming"
                checked={formData.is_upcomming}
                onChange={handleInputChange}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Mark as Upcoming Innovation
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Upcoming innovations will be shown in the upcoming section
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/innovations")}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{updateId ? "Updating..." : "Creating..."}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>
                    {updateId ? "Update Innovation" : "Create Innovation"}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddInnovation;
