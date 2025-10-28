import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { Editor } from "@tinymce/tinymce-react";

const AddTeam = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const updateId = searchParams.get("update");
  const isEditMode = Boolean(updateId);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    type: "team",
    title: "",
    image: null,
    short_description: "",
    long_description: "",
    facebook_link: "",
    twitter_link: "",
    linkedin_link: "",
    instagram_link: "",
    status: "1",
  });

  // Fetch team data for editing
  useEffect(() => {
    if (isEditMode) {
      fetchTeamForEdit();
    }
  }, [isEditMode, updateId]);

  const fetchTeamForEdit = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(`${API_URL}api/contents/${updateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.status) {
        const team = res.data.data;
        setFormData({
          type: team.type || "team",
          title: team.title || "",
          image: team.image || null,
          short_description: team.short_description || "",
          long_description: team.long_description || "",
          facebook_link: team.facebook_link || "",
          twitter_link: team.twitter_link || "",
          linkedin_link: team.linkedin_link || "",
          instagram_link: team.instagram_link || "",
          status: team.status?.toString() || "1",
        });

        // Set image preview if image exists
        if (team.image) {
          setImagePreview(team.image);
        }
      }
    } catch (err) {
      console.error("Error fetching team data:", err);
      toast.error(
        err.response?.data?.message || "Error fetching team data"
      );
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Auto-generate slug when title changes
  useEffect(() => {
    if (formData.title && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(prev.title),
      }));
    }
  }, [formData.title, isEditMode]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.short_description.trim()) {
      toast.error("Short description is required");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      // Append all form data except image if it's null
      Object.keys(formData).forEach((key) => {
        if (key === 'image') {
          if (formData.image instanceof File) {
            submitData.append(key, formData.image);
          }
        } else {
          if (formData[key] !== null && formData[key] !== undefined) {
            submitData.append(key, formData[key]);
          }
        }
      });

      let res;
      if (isEditMode) {
        // Update existing team
        res = await axios.post(
          `${API_URL}api/contents/${updateId}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new team
        res = await axios.post(`${API_URL}api/contents`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (res.data.status) {
        toast.success(
          res.data.message ||
            (isEditMode
              ? "Team updated successfully"
              : "Team created successfully")
        );
        navigate("/setting/teams");
      }
    } catch (err) {
      console.error("Error saving team:", err);
      toast.error(
        err.response?.data?.message ||
          (isEditMode ? "Error updating team" : "Error creating team")
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
    
    // Also clear the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  if (fetchLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {isEditMode ? "Edit Team" : "Add New Team"}
                </h1>
                <p className="text-gray-600 mt-2">
                  {isEditMode
                    ? "Update your team details"
                    : "Create a new team with all necessary details"}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isEditMode
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {isEditMode ? "Edit Mode" : "Create Mode"}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Enter team title"
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Image
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      Image Preview:
                    </p>
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Team preview"
                        className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  name="image"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Upload a representative image for your team (optional)
                </p>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Brief description of the team"
                  required
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
                      "undo redo | blocks | " +
                      "bold italic underline | link | " +
                      "alignleft aligncenter alignright alignjustify | " +
                      "bullist numlist outdent indent | " +
                      "removeformat | help | code",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                    link_context_toolbar: true,
                    link_assume_external_targets: true,
                    link_title: false,
                    default_link_target: "_blank",
                    link_list: [
                      { title: "Home Page", value: "/" },
                      { title: "About Page", value: "/about" },
                      { title: "Contact Page", value: "/contact" },
                    ],
                  }}
                  onEditorChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      long_description: content,
                    }))
                  }
                />
              </div>

              {/* Social Media Links */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook_link"
                      value={formData.facebook_link}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter_link"
                      value={formData.twitter_link}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin_link"
                      value={formData.linkedin_link}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="https://linkedin.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram_link"
                      value={formData.instagram_link}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center gap-2 ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : isEditMode
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-green-500 hover:bg-green-600"
                  } transition-colors`}
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <span>{isEditMode ? "✏️" : "➕"}</span>
                      {isEditMode ? "Update Team" : "Create Team"}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/setting/teams")}
                  className="py-3 px-6 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeam;