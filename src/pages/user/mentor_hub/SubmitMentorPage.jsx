import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  Download,
  FileCheck,
  Lightbulb,
  Rocket,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import Breadcrumb from "../../../components/common/Breadcrumb";

const SubmitMentorPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();

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
  const [imagePreview, setImagePreview] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);
  const [guidelinePdf, setGuidelinePdf] = useState(null);
  const [guidelineLoading, setGuidelineLoading] = useState(false);
  const [templatePdf, setTemplatePdf] = useState(null);
  const [templateLoading, setTemplateLoading] = useState(false);

  // Fetch guideline PDF and template
  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetch guideline PDF
        setGuidelineLoading(true);
        const guidelineResponse = await axios.get(
          `${API_URL}api/mentor-guideline-pdf`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );
        if (guidelineResponse.data.status) {
          setGuidelinePdf(guidelineResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching guideline PDF:", error);
      } finally {
        setGuidelineLoading(false);
      }

      try {
        // Fetch template PDF
        setTemplateLoading(true);
        const templateResponse = await axios.get(
          `${API_URL}api/mentor-template-pdf`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );
        if (templateResponse.data.status) {
          setTemplatePdf(templateResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching template PDF:", error);
      } finally {
        setTemplateLoading(false);
      }
    };

    fetchResources();
  }, [token, API_URL]);

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

  // Get full PDF URL
  const getPdfUrl = (pdfPath) => {
    if (!pdfPath) return null;
    if (pdfPath.startsWith('http')) return pdfPath;
    return `${STORAGE_URL}${pdfPath}`;
  };

  // Handle download
  const handleDownload = (url, filename) => {
    if (!url) {
      toast.error("File not available");
      return;
    }
    window.open(url, '_blank');
  };

  // ==========================================
  // FORM SUBMISSION
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.catagory || !formData.title || !formData.event_name) {
      toast.error(
        "Please fill in required fields: Category, Title, and Event Name"
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
      !imagePreview
    ) {
      toast.error("Please upload an image or video");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();

      // Generate slug
      const slug = generateSlug(formData.title);
      submitData.append("slug", slug);
      submitData.append("media_type", formData.media_type);
      submitData.append("created_by", userData?.id || "");

      // Normal fields
      Object.keys(formData).forEach((key) => {
        if (key === "slug" || key === "media_type") return;

        if (key === "image_video" || key === "pdf" || key === "ppt") {
          if (formData[key] instanceof File) {
            submitData.append(key, formData[key]);
          }
          return;
        }

        if (key === "youtube_url" && formData.media_type === "youtube") {
          submitData.append("image_video", formData.youtube_url);
          return;
        }

        if (
          key !== "youtube_url" &&
          formData[key] !== null &&
          formData[key] !== undefined &&
          formData[key] !== ""
        ) {
          submitData.append(key, formData[key]);
        }
      });

      // Social links
      submitData.append("share_links", JSON.stringify(shareLinks));
      submitData.append("event_social_links", JSON.stringify(eventSocialLinks));

      const response = await axios.post(`${API_URL}api/events/store`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        toast.success("Your mentor event has been submitted successfully!");
        setSubmissionSuccess(true);

        // Reset form
        setFormData({
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
        setShareLinks([{ key: "", value: "" }]);
        setEventSocialLinks([{ key: "", value: "" }]);
        setImagePreview("");
        setPdfFile(null);
        setPptFile(null);

        // Redirect after delay
        setTimeout(() => {
          navigate("/mentors");
        }, 3000);
      } else {
        throw new Error(response.data.message || "Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);

      if (
        error.response?.data?.message?.includes("Duplicate entry") ||
        error.response?.data?.errors?.slug
      ) {
        toast.error(
          "A event with this title already exists. Please use a different title."
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
          error.response?.data?.message || "Failed to submit mentor event"
        );
      }
    } finally {
      setLoading(false);
    }
  };

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
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Mentors Hub", path: "/mentors" },
          { label: "Submit as Mentor" }
        ]}
        pageTitle="Submit as Mentor"
      />

      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Success Message */}
          {submissionSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg animate-fadeIn">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm text-green-800 font-medium">
                    Your mentor event has been submitted successfully! You will be redirected shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Share Your <span className="text-yellow-600">Expertise</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Submit your mentor event and inspire others with your knowledge and experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Guidelines & Resources */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Guidelines Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-4">
                    <FileCheck className="w-5 h-5 text-yellow-600" />
                    <h3 className="text-lg font-bold text-gray-900">Guidelines</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="border-l-4 border-yellow-400 pl-3">
                      <h4 className="font-semibold text-gray-800">1. Complete All Fields</h4>
                      <p>Fill in all required fields with accurate information.</p>
                    </div>
                    
                    <div className="border-l-4 border-blue-400 pl-3">
                      <h4 className="font-semibold text-gray-800">2. Use Quality Media</h4>
                      <p>Upload high-quality images/videos (max 10MB).</p>
                    </div>
                    
                    <div className="border-l-4 border-green-400 pl-3">
                      <h4 className="font-semibold text-gray-800">3. Provide Social Links</h4>
                      <p>Add relevant social media and share links.</p>
                    </div>
                    
                    <div className="border-l-4 border-purple-400 pl-3">
                      <h4 className="font-semibold text-gray-800">4. Review Process</h4>
                      <p>All submissions will be reviewed before publication.</p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-xs text-yellow-800">
                      <span className="font-semibold">Note:</span> Please ensure all information is accurate and up-to-date.
                    </p>
                  </div>
                </div>

                {/* Download Resources Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Resources
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Guideline PDF */}
                    <div>
                      {guidelineLoading ? (
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-2"></div>
                          Loading guideline...
                        </div>
                      ) : guidelinePdf && guidelinePdf.pdf ? (
                        <button
                          onClick={() => handleDownload(getPdfUrl(guidelinePdf.pdf), 'guideline.pdf')}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-red-500" />
                            <span className="text-sm font-medium text-gray-700">Guideline PDF</span>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 transition-colors" />
                        </button>
                      ) : (
                        <p className="text-xs text-gray-400">Guideline not available</p>
                      )}
                    </div>

                    {/* Template PDF */}
                    <div>
                      {templateLoading ? (
                        <div className="flex items-center text-xs text-gray-500">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-2"></div>
                          Loading template...
                        </div>
                      ) : templatePdf && templatePdf.pdf ? (
                        <button
                          onClick={() => handleDownload(getPdfUrl(templatePdf.pdf), 'template.pdf')}
                          className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-medium text-gray-700">Template PDF</span>
                          </div>
                          <Download className="w-4 h-4 text-gray-400 group-hover:text-yellow-600 transition-colors" />
                        </button>
                      ) : (
                        <p className="text-xs text-gray-400">Template not available</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-yellow-50 rounded-lg p-3 text-center">
                      <Rocket className="w-5 h-5 text-yellow-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">50+</p>
                      <p className="text-xs text-gray-600">Mentors</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <UserCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">100+</p>
                      <p className="text-xs text-gray-600">Events</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Mentor Event</h2>
                <p className="text-gray-600 mb-6">Fill in the details below to share your mentor event with the community</p>

                <form onSubmit={handleSubmit} className="space-y-8">
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
                          Category <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="catagory"
                          value={formData.catagory}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          placeholder="e.g., Technology, Business, Health"
                        />
                      </div>

                      {/* Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Title <span className="text-red-500">*</span>
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
                          Event Name <span className="text-red-500">*</span>
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
                        Media Type <span className="text-red-500">*</span>
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
                          YouTube URL <span className="text-red-500">*</span>
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
                            : "Event Video"} <span className="text-red-500">*</span>
                        </label>

                        {imagePreview && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Preview:
                            </p>
                            <div className="relative inline-block">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="h-48 rounded-lg shadow-md object-cover"
                              />
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}

                        {!imagePreview && (
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
                                e.target.value
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
                                e.target.value
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
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Submit Event</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/mentors")}
                      disabled={loading}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubmitMentorPage;