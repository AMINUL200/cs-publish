import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";

const AddAbout = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  // Get ID from query parameter
  const queryParams = new URLSearchParams(location.search);
  const updateId = queryParams.get("update");
  const isEdit = Boolean(updateId);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    button_name: "",
    image1: null,
    image2: null,
    image3: null,
    image1_alt: "",
    image2_alt: "",
    image3_alt: "",
  });
  const [imagePreviews, setImagePreviews] = useState({
    image1: null,
    image2: null,
    image3: null,
  });

  // Fetch about data for editing
  useEffect(() => {
    if (isEdit && updateId) {
      fetchAboutData();
    }
  }, [isEdit, updateId]);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}api/abouts/${updateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === true) {
        const about = response.data.data;
        console.log(about);
        
        setFormData({
          title: about.title || "",
          description: about.description || "",
          button_name: about.button_name || "",
          image1: null,
          image2: null,
          image3: null,
          image1_alt: about.image1_alt || "",
          image2_alt: about.image2_alt || "",
          image3_alt: about.image3_alt || "",
        });
        setImagePreviews({
          image1: `${STORAGE_URL}${about.image1}`,
          image2: `${STORAGE_URL}${about.image2}`,
          image3: `${STORAGE_URL}${about.image3}`,
        });
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      toast.error("Failed to fetch about data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e, imageField) => {
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
        [imageField]: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({
          ...prev,
          [imageField]: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (imageField) => {
    setFormData((prev) => ({
      ...prev,
      [imageField]: null,
    }));
    setImagePreviews((prev) => ({
      ...prev,
      [imageField]: null,
    }));

    // Reset file input
    const fileInput = document.querySelector(`input[name="${imageField}"]`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("button_name", formData.button_name);
    submitData.append("image1_alt", formData.image1_alt);
    submitData.append("image2_alt", formData.image2_alt);
    submitData.append("image3_alt", formData.image3_alt);

    // Append images only if they are selected
    if (formData.image1) submitData.append("image1", formData.image1);
    if (formData.image2) submitData.append("image2", formData.image2);
    if (formData.image3) submitData.append("image3", formData.image3);

    // For edit, use PUT method
    // if (isEdit) {
    //   submitData.append("_method", "PUT");
    // }

    try {
      const url = isEdit
        ? `${API_URL}api/abouts/${updateId}`
        : `${API_URL}api/abouts`;
      const response = await axios.post(url, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success(
          `About content ${isEdit ? "updated" : "added"} successfully!`
        );
        navigate("/landing-page/about-us"); // Redirect to about list page
      }
    } catch (error) {
      console.error(`Error ${isEdit ? "updating" : "adding"} about:`, error);
      toast.error(`Failed to ${isEdit ? "update" : "add"} about content`);
    } finally {
      setLoading(false);
    }
  };

  // Image Upload Component
  const ImageUploadField = ({
    fieldName,
    label,
    preview,
    altValue,
    onAltChange,
  }) => (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <label className="block text-lg font-semibold text-gray-800 mb-4">
        {label}
      </label>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 mb-4">
        <input
          type="file"
          name={fieldName}
          accept="image/*"
          onChange={(e) => handleImageChange(e, fieldName)}
          className="hidden"
          id={`${fieldName}-upload`}
        />
        <label
          htmlFor={`${fieldName}-upload`}
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

      {/* Image Preview */}
      {preview && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="relative inline-block group">
            <img
              src={preview}
              alt="Preview"
              className="h-40 w-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <button
              type="button"
              onClick={() => handleRemoveImage(fieldName)}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg"
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
        </div>
      )}

      {/* Alt Text Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alt Text for {label}
        </label>
        <input
          type="text"
          name={`${fieldName}_alt`}
          value={altValue}
          onChange={onAltChange}
          placeholder={`Enter alt text for ${label.toLowerCase()}`}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
        />
      </div>
    </div>
  );

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading about content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                {isEdit ? "Edit About Content" : "Add About Content"}
              </h1>
              <p className="text-gray-600 mt-2">
                {isEdit
                  ? "Update your about page content and images"
                  : "Create new content for your about page"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/landing-page/about-us")}
                className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to List
              </button>
              {isEdit && (
                <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
                  Editing ID: {updateId}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-lg"
                    placeholder="Enter about section title"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Description
                  </label>

                  <Editor
                    apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API_KEY}`}
                    value={formData.description}
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
                      setFormData((prev) => ({ ...prev, description: content }))
                    }
                  />
                </div>

                {/* Button Name */}
                <div>
                  <label className="block text-lg font-semibold text-gray-800 mb-3">
                    Button Name
                  </label>
                  <input
                    type="text"
                    name="button_name"
                    value={formData.button_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-lg"
                    placeholder="Enter button text (e.g., 'Learn More', 'Read More')"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
                Images Gallery
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ImageUploadField
                  fieldName="image1"
                  label="Primary Image"
                  preview={imagePreviews.image1}
                  altValue={formData.image1_alt}
                  onAltChange={handleInputChange}
                />

                <ImageUploadField
                  fieldName="image2"
                  label="Secondary Image"
                  preview={imagePreviews.image2}
                  altValue={formData.image2_alt}
                  onAltChange={handleInputChange}
                />

                <ImageUploadField
                  fieldName="image3"
                  label="Additional Image"
                  preview={imagePreviews.image3}
                  altValue={formData.image3_alt}
                  onAltChange={handleInputChange}
                />
              </div>
            </div>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-500">
                Fields marked with <span className="text-red-500">*</span> are
                required
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/about")}
                  className="px-8 py-4 text-lg font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isEdit ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {isEdit ? "Update About" : "Add About"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tips Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Tips for Great About Content
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>
                  • Use high-quality, relevant images that represent your brand
                </li>
                <li>• Write a compelling description that tells your story</li>
                <li>
                  • Add descriptive alt text for better accessibility and SEO
                </li>
                <li>• Keep button text clear and action-oriented</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAbout;
