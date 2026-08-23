import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  Upload,
  Calendar,
  Users,
  FileText,
  Share2,
  X,
  Youtube,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { toast } from "react-toastify";

const AddMentor = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    page_title: "Events",
    catagory: "",
    title: "",
    description: "",
    image_video: null,
    image_alt_tag: "",
    long_description: "",
    pdf: null,
    ppt: null,
    event_name: "",
    event_desc: "",
    event_email: "",
    is_upcomming: "0",
    media_type: "image",
    youtube_url: "",
    slug: "",
  });

  // ==========================================
  // SHARE LINKS STATE
  // ==========================================
  const [shareLinks, setShareLinks] = useState([{ key: "", value: "" }]);

  // ==========================================
  // EVENT SOCIAL LINKS STATE
  // ==========================================
  const [eventSocialLinks, setEventSocialLinks] = useState([
    { key: "", value: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [mentorId, setMentorId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [currentYoutubeUrl, setCurrentYoutubeUrl] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);

  // Check if edit mode
  useEffect(() => {
    const updateId = searchParams.get("update");
    if (updateId) {
      setIsEdit(true);
      setMentorId(updateId);
      fetchMentorData(updateId);
    }
  }, [searchParams]);

  // ==========================================
  // FETCH MENTOR DATA FOR EDITING
  // ==========================================
  const fetchMentorData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.data.status && response.data.data) {
        const mentor = response.data.data;
        console.log("Fetched mentor data:", mentor);

        const mediaType = mentor.media_type || "image";

        if (mediaType === "youtube" && mentor.image_video) {
          setCurrentYoutubeUrl(mentor.image_video);
        } else if (mentor.image_video) {
          setCurrentImage(`${STORAGE_URL}${mentor.image_video}`);
        }

        if (mentor.pdf) {
          setPdfFile({
            name: "Current PDF",
            url: `${STORAGE_URL}${mentor.pdf}`,
          });
        }
        if (mentor.ppt) {
          setPptFile({
            name: "Current PPT",
            url: `${STORAGE_URL}${mentor.ppt}`,
          });
        }

        setFormData({
          page_title: mentor.page_title || "Events",
          catagory: mentor.catagory || "",
          title: mentor.title || "",
          description: mentor.description || "",
          image_video: null,
          image_alt_tag: mentor.image_alt_tag || "",
          long_description: mentor.long_description || "",
          pdf: null,
          ppt: null,
          event_name: mentor.event_name || "",
          event_desc: mentor.event_desc || "",
          event_email: mentor.event_email || "",
          is_upcomming: mentor.is_upcomming || "0",
          media_type: mediaType,
          youtube_url: mediaType === "youtube" ? mentor.image_video || "" : "",
          slug: mentor.slug || "",
        });

        // ==========================================
        // HANDLE SHARE LINKS - Handle double-encoded data
        // ==========================================
        let shareLinksData = mentor.share_links;
        const parsedShareLinks = [];

        if (Array.isArray(shareLinksData) && shareLinksData.length > 0) {
          shareLinksData.forEach((item) => {
            try {
              let parsed = item;

              // If it's a string, parse it
              if (typeof parsed === "string") {
                parsed = JSON.parse(parsed);
              }

              // If it's an array, parse each item
              if (Array.isArray(parsed)) {
                parsed.forEach((innerItem) => {
                  if (typeof innerItem === "string") {
                    try {
                      const obj = JSON.parse(innerItem);
                      if (typeof obj === "object" && !Array.isArray(obj)) {
                        Object.entries(obj).forEach(([key, value]) => {
                          parsedShareLinks.push({ key, value });
                        });
                      }
                    } catch (e) {
                      console.error("Error parsing inner share link:", e);
                    }
                  }
                });
              } else if (typeof parsed === "object" && !Array.isArray(parsed)) {
                // If it's a direct object
                Object.entries(parsed).forEach(([key, value]) => {
                  parsedShareLinks.push({ key, value });
                });
              }
            } catch (e) {
              console.error("Error parsing share link:", e);
            }
          });
        }

        if (parsedShareLinks.length > 0) {
          setShareLinks(parsedShareLinks);
        } else {
          setShareLinks([{ key: "", value: "" }]);
        }

        // ==========================================
        // HANDLE EVENT SOCIAL LINKS - Handle double-encoded data
        // ==========================================
        let eventSocialLinksData = mentor.event_social_links;
        const parsedEventLinks = [];

        if (
          Array.isArray(eventSocialLinksData) &&
          eventSocialLinksData.length > 0
        ) {
          eventSocialLinksData.forEach((item) => {
            try {
              let parsed = item;

              // If it's a string, parse it
              if (typeof parsed === "string") {
                parsed = JSON.parse(parsed);
              }

              // If it's an array, parse each item
              if (Array.isArray(parsed)) {
                parsed.forEach((innerItem) => {
                  if (typeof innerItem === "string") {
                    try {
                      const obj = JSON.parse(innerItem);
                      if (typeof obj === "object" && !Array.isArray(obj)) {
                        Object.entries(obj).forEach(([key, value]) => {
                          parsedEventLinks.push({ key, value });
                        });
                      }
                    } catch (e) {
                      console.error("Error parsing inner event link:", e);
                    }
                  }
                });
              } else if (typeof parsed === "object" && !Array.isArray(parsed)) {
                // If it's a direct object
                Object.entries(parsed).forEach(([key, value]) => {
                  parsedEventLinks.push({ key, value });
                });
              }
            } catch (e) {
              console.error("Error parsing event social link:", e);
            }
          });
        }

        if (parsedEventLinks.length > 0) {
          setEventSocialLinks(parsedEventLinks);
        } else {
          setEventSocialLinks([{ key: "", value: "" }]);
        }
      }
    } catch (error) {
      console.error("Error fetching mentor data:", error);
      toast.error("Failed to load mentor data");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    }));
  };

  // ==========================================
  // HANDLE FILE CHANGE
  // ==========================================
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      if (name === "image_video") {
        // Check if file is image or video
        if (
          !file.type.startsWith("image/") &&
          !file.type.startsWith("video/")
        ) {
          toast.error("Please select an image or video file");
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error("File size should be less than 10MB");
          return;
        }

        if (file.type.startsWith("image/")) {
          setFormData((prev) => ({ ...prev, media_type: "image" }));
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        } else if (file.type.startsWith("video/")) {
          setFormData((prev) => ({ ...prev, media_type: "video" }));
        }
      } else if (name === "pdf") {
        if (!file.type.includes("pdf")) {
          toast.error("Please select a PDF file");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("PDF file size should be less than 5MB");
          return;
        }
        setPdfFile(file);
      } else if (name === "ppt") {
        const allowedTypes = [
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ];
        if (
          !allowedTypes.includes(file.type) &&
          !file.name.toLowerCase().endsWith(".ppt") &&
          !file.name.toLowerCase().endsWith(".pptx")
        ) {
          toast.error("Please select a PowerPoint file (PPT or PPTX)");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("PPT file size should be less than 5MB");
          return;
        }
        setPptFile(file);
      }

      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));
    }
  };

  // Handle media type change
  const handleMediaTypeChange = (e) => {
    const mediaType = e.target.value;
    setFormData((prev) => ({
      ...prev,
      media_type: mediaType,
      image_video: null,
      youtube_url: mediaType === "youtube" ? prev.youtube_url || "" : "",
    }));

    if (mediaType !== "image") {
      setImagePreview("");
    }
    if (mediaType !== "youtube") {
      setCurrentYoutubeUrl("");
    }
  };

  // Handle YouTube URL change
  const handleYoutubeUrlChange = (e) => {
    const url = e.target.value;
    setFormData((prev) => ({
      ...prev,
      youtube_url: url,
      image_video: url,
    }));
  };

  // ==========================================
  // SHARE LINKS HANDLERS
  // ==========================================
  const handleShareLinkChange = (index, field, value) => {
    const updatedLinks = [...shareLinks];
    updatedLinks[index][field] = value;
    setShareLinks(updatedLinks);
  };

  const addShareLink = () => {
    setShareLinks([...shareLinks, { key: "", value: "" }]);
  };

  const removeShareLink = (index) => {
    if (shareLinks.length > 1) {
      const updatedLinks = shareLinks.filter((_, i) => i !== index);
      setShareLinks(updatedLinks);
    }
  };

  // ==========================================
  // EVENT SOCIAL LINKS HANDLERS
  // ==========================================
  const handleEventSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...eventSocialLinks];
    updatedLinks[index][field] = value;
    setEventSocialLinks(updatedLinks);
  };

  const addEventSocialLink = () => {
    setEventSocialLinks([...eventSocialLinks, { key: "", value: "" }]);
  };

  const removeEventSocialLink = (index) => {
    if (eventSocialLinks.length > 1) {
      const updatedLinks = eventSocialLinks.filter((_, i) => i !== index);
      setEventSocialLinks(updatedLinks);
    }
  };

  // Remove image
  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image_video: null }));
    setImagePreview("");
    setCurrentImage("");
    setCurrentYoutubeUrl("");
  };

  // Remove PDF file
  const handleRemovePdf = () => {
    setFormData((prev) => ({ ...prev, pdf: null }));
    setPdfFile(null);
    const pdfInput = document.getElementById("pdf-upload");
    if (pdfInput) pdfInput.value = "";
  };

  // Remove PPT file
  const handleRemovePpt = () => {
    setFormData((prev) => ({ ...prev, ppt: null }));
    setPptFile(null);
    const pptInput = document.getElementById("ppt-upload");
    if (pptInput) pptInput.value = "";
  };

  // Generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // ==========================================
  // FORM SUBMISSION
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.catagory || !formData.title || !formData.event_name) {
      toast.error(
        "Please fill in required fields: Category, Title, and Event Name",
      );
      return;
    }

    // Validate media
    if (formData.media_type === "youtube" && !formData.youtube_url) {
      toast.error("Please enter a YouTube URL");
      return;
    }
    if (
      formData.media_type !== "youtube" &&
      !formData.image_video &&
      !currentImage &&
      !isEdit
    ) {
      toast.error("Please upload an image or video");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      // Generate slug if not editing
      let slug = formData.slug;
      if (!isEdit) {
        slug = generateSlug(formData.title);
      }

      // Add slug
      submitData.append("slug", slug);

      // Add media_type
      submitData.append("media_type", formData.media_type);

      // Normal fields
      Object.keys(formData).forEach((key) => {
        // Skip these keys as they're handled separately
        if (key === "slug" || key === "media_type") return;

        // Handle files
        if (key === "image_video" || key === "pdf" || key === "ppt") {
          if (formData[key] instanceof File) {
            submitData.append(key, formData[key]);
          }
          return;
        }

        // Handle YouTube URL
        if (key === "youtube_url" && formData.media_type === "youtube") {
          submitData.append("image_video", formData.youtube_url);
          return;
        }

        // Skip empty values for normal fields
        if (
          key !== "youtube_url" &&
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          submitData.append(key, formData[key]);
        }
      });

      // ==========================================
      // SHARE LINKS - Format for backend
      // ==========================================
      submitData.append("share_links", JSON.stringify(shareLinks));

      submitData.append("event_social_links", JSON.stringify(eventSocialLinks));

      // Debug log
      console.log("========== FORM DATA ==========");
      for (const [key, value] of submitData.entries()) {
        console.log(key, value instanceof File ? `FILE: ${value.name}` : value);
      }
      console.log("===============================");

      const url = isEdit
        ? `${API_URL}api/events/update/${mentorId}`
        : `${API_URL}api/events/store`;

      const response = await axios.post(url, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        toast.success(
          `Mentor event ${isEdit ? "updated" : "created"} successfully!`,
        );
        navigate("/handle-mentor-hub");
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (
        error.response?.data?.message?.includes("Duplicate entry") ||
        error.response?.data?.errors?.slug
      ) {
        toast.error(
          "A event with this title already exists. Please use a different title.",
        );
      } else if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          messages.forEach((message) => {
            toast.error(`${field}: ${message}`);
          });
        });
      } else {
        toast.error(
          error.response?.data?.message ||
            `Failed to ${isEdit ? "update" : "create"} mentor event`,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p>Loading mentor data...</p>
        </div>
      </div>
    );
  }

  // Extract YouTube video ID for preview
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/handle-mentor-hub")}
            className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Mentor Hub</span>
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Mentor Event" : "Add New Mentor Event"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit
              ? "Update the mentor event details"
              : "Create a new mentor event with all necessary information"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-yellow-600" />
                <span>Basic Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <input
                    type="text"
                    name="catagory"
                    value={formData.catagory}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="e.g., Math Events, Science Workshop"
                  />
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Event title"
                  />
                </div>

                {/* Event Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    name="event_name"
                    value={formData.event_name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Official event name"
                  />
                </div>

                {/* Event Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Email
                  </label>
                  <input
                    type="email"
                    name="event_email"
                    value={formData.event_email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="contact@event.com"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Brief description of the event"
                />
              </div>

              {/* Long Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description
                </label>
                <textarea
                  name="long_description"
                  value={formData.long_description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Detailed description of the event"
                />
              </div>

              {/* Event Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Description
                </label>
                <textarea
                  name="event_desc"
                  value={formData.event_desc}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Description about the event itself"
                />
              </div>
            </section>

            {/* Media Upload */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-red-600" />
                <span>Media & Files</span>
              </h2>

              {/* Media Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Media Type *
                </label>
                <select
                  name="media_type"
                  value={formData.media_type}
                  onChange={handleMediaTypeChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="image">Image</option>
                  <option value="youtube">YouTube URL</option>
                  <option value="video">Video File</option>
                </select>
              </div>

              {/* YouTube URL Input */}
              {formData.media_type === "youtube" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube URL *
                  </label>
                  <div className="flex items-center space-x-2">
                    <Youtube className="w-5 h-5 text-red-600" />
                    <input
                      type="url"
                      name="youtube_url"
                      value={formData.youtube_url}
                      onChange={handleYoutubeUrlChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>

                  {/* YouTube Preview */}
                  {formData.youtube_url &&
                    getYoutubeEmbedUrl(formData.youtube_url) && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Preview:
                        </p>
                        <div className="relative w-full max-w-lg">
                          <iframe
                            src={getYoutubeEmbedUrl(formData.youtube_url)}
                            title="YouTube video preview"
                            className="w-full h-64 rounded-lg"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Image/Video Upload (non-YouTube) */}
              {formData.media_type !== "youtube" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {formData.media_type === "image"
                      ? "Event Image"
                      : "Event Video"}
                  </label>

                  {(imagePreview || currentImage) && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </p>
                      <div className="relative inline-block">
                        <img
                          src={imagePreview || currentImage}
                          alt="Preview"
                          className="h-48 rounded-lg shadow-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {!imagePreview && !currentImage && (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        name="image_video"
                        accept={
                          formData.media_type === "image"
                            ? "image/*"
                            : "video/*"
                        }
                        onChange={handleFileChange}
                        className="hidden"
                        id="media-upload"
                      />
                      <label
                        htmlFor="media-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        {formData.media_type === "image" ? (
                          <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                        ) : (
                          <Video className="w-8 h-8 text-gray-400 mb-2" />
                        )}
                        <span className="text-sm text-gray-600">
                          Click to upload {formData.media_type}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formData.media_type === "image" ? "PNG, JPG" : "MP4"}{" "}
                          up to 10MB
                        </span>
                      </label>
                    </div>
                  )}

                  {/* Image Alt Tag */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Alt Tag
                    </label>
                    <input
                      type="text"
                      name="image_alt_tag"
                      value={formData.image_alt_tag}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      placeholder="Descriptive text for accessibility"
                    />
                  </div>
                </div>
              )}

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      name="pdf"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-upload"
                    />

                    {pdfFile ? (
                      <div className="text-center">
                        <div className="flex items-center justify-between mb-2">
                          <FileText className="w-6 h-6 text-green-600" />
                          <button
                            type="button"
                            onClick={handleRemovePdf}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {pdfFile.name || "PDF File"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(pdfFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <label
                        htmlFor="pdf-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FileText className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-600">
                          Upload PDF
                        </span>
                        <span className="text-xs text-gray-400">Max 5MB</span>
                      </label>
                    )}
                  </div>
                </div>

                {/* PPT Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PowerPoint Presentation
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      name="ppt"
                      accept=".ppt,.pptx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="ppt-upload"
                    />

                    {pptFile ? (
                      <div className="text-center">
                        <div className="flex items-center justify-between mb-2">
                          <FileText className="w-6 h-6 text-blue-600" />
                          <button
                            type="button"
                            onClick={handleRemovePpt}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {pptFile.name || "PPT File"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {(pptFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <label
                        htmlFor="ppt-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FileText className="w-6 h-6 text-gray-400 mb-1" />
                        <span className="text-sm text-gray-600">
                          Upload PPT
                        </span>
                        <span className="text-xs text-gray-400">Max 5MB</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================== */}
            {/* SOCIAL LINKS SECTION */}
            {/* ========================================== */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-black" />
                <span>Social Links</span>
              </h2>

              {/* ========================================== */}
              {/* SHARE LINKS */}
              {/* ========================================== */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Share Links (Key-Value Pairs)
                </label>
                {shareLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Platform (e.g., facebook, twitter)"
                      value={link.key}
                      onChange={(e) =>
                        handleShareLinkChange(index, "key", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.value}
                      onChange={(e) =>
                        handleShareLinkChange(index, "value", e.target.value)
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeShareLink(index)}
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                      disabled={shareLinks.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addShareLink}
                  className="mt-2 flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Share Link</span>
                </button>
              </div>

              {/* ========================================== */}
              {/* EVENT SOCIAL LINKS */}
              {/* ========================================== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Social Links (Key-Value Pairs)
                </label>
                {eventSocialLinks.map((link, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Platform (e.g., linkedin, instagram)"
                      value={link.key}
                      onChange={(e) =>
                        handleEventSocialLinkChange(
                          index,
                          "key",
                          e.target.value,
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.value}
                      onChange={(e) =>
                        handleEventSocialLinkChange(
                          index,
                          "value",
                          e.target.value,
                        )
                      }
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeEventSocialLink(index)}
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                      disabled={eventSocialLinks.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEventSocialLink}
                  className="mt-2 flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Event Social Link</span>
                </button>
              </div>
            </section>

            {/* Settings */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-yellow-600" />
                <span>Event Settings</span>
              </h2>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="is_upcomming"
                  id="is_upcomming"
                  checked={formData.is_upcomming === "1"}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="is_upcomming"
                  className="text-sm font-medium text-gray-700"
                >
                  Mark as Upcoming Event
                </label>
              </div>
            </section>

            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>{isEdit ? "Updating..." : "Creating..."}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isEdit ? "Update Event" : "Create Event"}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/handle-mentor-hub")}
                disabled={loading}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMentor;
