import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/common/Loader";
import { Editor } from "@tinymce/tinymce-react";

const AddNewCmsPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const updateSlug = searchParams.get("update");
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    type: "policies_and_access",
    page_title: "",
    heading: "",
    paragraph: "",
    description: "",
    long_description: "",
    image1: null,
    image1_alt: "",
    image2: null,
    image2_alt: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const [imagePreviews, setImagePreviews] = useState({
    image1: "",
    image2: "",
  });

  const [errors, setErrors] = useState({});

  // Fetch CMS page data when in edit mode
  useEffect(() => {
    if (updateSlug) {
      setIsEditMode(true);
      fetchCmsPageData();
    }
  }, [updateSlug]);

  const fetchCmsPageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/cms-pages/${updateSlug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const pageData = response.data.data;

      // Map API response to form data with proper type handling
      setFormData({
        type: pageData.type,
        page_title: pageData.page_title || "",
        heading: pageData.heading || "",
        paragraph: pageData.paragraph || "",
        description: pageData.description || "",
        long_description: pageData.long_description || "",
        image1: null, // Keep as null for file input
        image1_alt: pageData.image1_alt || "",
        image2: null, // Keep as null for file input
        image2_alt: pageData.image2_alt || "",
        facebook: pageData.facebook || "",
        twitter: pageData.twitter || "",
        linkedin: pageData.linkedin || "",
        instagram: pageData.instagram || "",
      });

      // Set image previews for existing images
      setImagePreviews({
        image1: pageData.image1 || "",
        image2: pageData.image2 || "",
      });
    } catch (error) {
      console.error("Error fetching CMS page:", error);
      alert("Failed to fetch page data");
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
   const handleEditorChange = (fieldName, content) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: content,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));

      // Clear error when file is selected
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const removeImage = (imageName) => {
    setFormData((prev) => ({
      ...prev,
      [imageName]: null,
    }));

    setImagePreviews((prev) => ({
      ...prev,
      [imageName]: "",
    }));

    // Reset file input
    const fileInput = document.querySelector(`input[name="${imageName}"]`);
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = "Page type is required";
    }

    if (!formData.page_title.trim()) {
      newErrors.page_title = "Page title is required";
    }

    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required";
    }

    if (!formData.paragraph.trim()) {
      newErrors.paragraph = "Paragraph is required";
    }

    // Validate image alt texts if images are present
    if (
      (formData.image1 || imagePreviews.image1) &&
      !formData.image1_alt.trim()
    ) {
      newErrors.image1_alt = "Alt text is required when image is present";
    }

    if (
      (formData.image2 || imagePreviews.image2) &&
      !formData.image2_alt.trim()
    ) {
      newErrors.image2_alt = "Alt text is required when image is present";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    console.log(formData);

    try {
      setSubmitting(true);

      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Append all form fields
      formDataToSend.append("type", formData.type);
      formDataToSend.append("page_title", formData.page_title);
      formDataToSend.append("heading", formData.heading);
      formDataToSend.append("paragraph", formData.paragraph);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("long_description", formData.long_description);
      formDataToSend.append("image1_alt", formData.image1_alt);
      formDataToSend.append("image2_alt", formData.image2_alt);

      // Append social media links only if they have values
      if (formData.facebook)
        formDataToSend.append("facebook", formData.facebook);
      if (formData.twitter) formDataToSend.append("twitter", formData.twitter);
      if (formData.linkedin)
        formDataToSend.append("linkedin", formData.linkedin);
      if (formData.instagram)
        formDataToSend.append("instagram", formData.instagram);

      // Append image files if they exist
      if (formData.image1) {
        formDataToSend.append("image1", formData.image1);
      }
      if (formData.image2) {
        formDataToSend.append("image2", formData.image2);
      }

      // For update, we need to handle image removal differently
      if (isEditMode) {
        // If user removed an existing image, we need to send a flag to remove it
        if (!formData.image1 && !imagePreviews.image1) {
          formDataToSend.append("remove_image1", "true");
        }
        if (!formData.image2 && !imagePreviews.image2) {
          formDataToSend.append("remove_image2", "true");
        }
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      if (isEditMode) {
        await axios.post(
          `${API_URL}api/cms-pages/${updateSlug}`,
          formDataToSend,
          config
        );
        alert("CMS page updated successfully!");
      } else {
        // Create new page
        await axios.post(`${API_URL}api/cms-pages-add`, formDataToSend, config);
        alert("CMS page created successfully!");
      }

      navigate("/list-cms-page"); // Redirect to CMS pages list
    } catch (error) {
      console.error("Error submitting form:", error);

      // Handle backend validation errors
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        setErrors(backendErrors);

        // Show the first error message
        const firstError = Object.values(backendErrors)[0];
        if (firstError && firstError[0]) {
          alert(firstError[0]);
        }
      } else {
        const errorMessage =
          error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} CMS page`;
        alert(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Update CMS Page" : "Add New CMS Page"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode
              ? "Update the content of your CMS page"
              : "Create a new CMS page for your website"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Page Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.type ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="support_and_contact">Support and Contact</option>
              <option value="policies_and_access">Policies and Access</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">
                {Array.isArray(errors.type) ? errors.type[0] : errors.type}
              </p>
            )}
          </div>

          {/* Page Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              name="page_title"
              value={formData.page_title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.page_title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter page title"
            />
            {errors.page_title && (
              <p className="mt-1 text-sm text-red-600">
                {Array.isArray(errors.page_title)
                  ? errors.page_title[0]
                  : errors.page_title}
              </p>
            )}
          </div>

          {/* Heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Heading *
            </label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.heading ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter heading"
            />
            {errors.heading && (
              <p className="mt-1 text-sm text-red-600">
                {Array.isArray(errors.heading)
                  ? errors.heading[0]
                  : errors.heading}
              </p>
            )}
          </div>

          {/* Paragraph */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paragraph *
            </label>
            <textarea
              name="paragraph"
              value={formData.paragraph}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.paragraph ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter paragraph text"
            />
            {errors.paragraph && (
              <p className="mt-1 text-sm text-red-600">
                {Array.isArray(errors.paragraph)
                  ? errors.paragraph[0]
                  : errors.paragraph}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
              value={formData.description}
              onEditorChange={(content) =>
                handleEditorChange("description", content)
              }
              init={{
                height: 250,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | link | " +
                  "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help | code",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Description
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
              value={formData.long_description}
              onEditorChange={(content) =>
                handleEditorChange("long_description", content)
              }
              init={{
                height: 400,
                menubar: false,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "charmap",
                  "preview",
                  "anchor",
                  "searchreplace",
                  "code",
                  "fullscreen",
                  "insertdatetime",
                  "table",
                  "help",
                  "wordcount",
                ],
                toolbar:
                  "undo redo | blocks | bold italic underline | link | " +
                  "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | " +
                  "removeformat | help | code",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image 1
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  name="image1"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="image1_alt"
                  value={formData.image1_alt}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.image1_alt ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Image 1 alt text"
                />
                {errors.image1_alt && (
                  <p className="mt-1 text-sm text-red-600">
                    {Array.isArray(errors.image1_alt)
                      ? errors.image1_alt[0]
                      : errors.image1_alt}
                  </p>
                )}
                {imagePreviews.image1 && (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <img
                        src={imagePreviews.image1}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("image1")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Click × to remove
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Image 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image 2
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  name="image2"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="image2_alt"
                  value={formData.image2_alt}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.image2_alt ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Image 2 alt text"
                />
                {errors.image2_alt && (
                  <p className="mt-1 text-sm text-red-600">
                    {Array.isArray(errors.image2_alt)
                      ? errors.image2_alt[0]
                      : errors.image2_alt}
                  </p>
                )}
                {imagePreviews.image2 && (
                  <div className="mt-2">
                    <div className="relative inline-block">
                      <img
                        src={imagePreviews.image2}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage("image2")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Click × to remove
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://instagram.com/username"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate("/list-cms-page")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Processing..."
                : isEditMode
                ? "Update Page"
                : "Create Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewCmsPage;
