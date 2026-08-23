import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
  Lightbulb,
  Rocket,
  Users,
  FileCheck,
  Clock,
  CheckCircle,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import Breadcrumb from "../../../components/common/Breadcrumb";

const UserAddInnovationPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState("youtube");
  const [imagePreview, setImagePreview] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (files[0]) {
        if (name === "pdf") {
          if (files[0].type !== "application/pdf") {
            toast.error("Please select a valid PDF file");
            return;
          }
          if (files[0].size > 10 * 1024 * 1024) {
            toast.error("PDF file size should be less than 10MB");
            return;
          }
          setFormData((prev) => ({ ...prev, pdf: files[0] }));
        } else if (name === "image_file") {
          if (!files[0].type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
          }
          if (files[0].size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
          }
          setFormData((prev) => ({ ...prev, image_file: files[0] }));

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
      submitData.append("page_title", formData.page_title);
      submitData.append("title", formData.title);
      submitData.append("description", formData.description);
      submitData.append("long_description", formData.long_description);
      submitData.append("image_alt_tag", formData.image_alt_tag);
      submitData.append("innovator_name", formData.innovator_name);
      submitData.append("innovator_desc", formData.innovator_desc);
      submitData.append("innovator_email", formData.innovator_email);
      submitData.append("is_upcomming", formData.is_upcomming ? "1" : "0");

      if (mediaType === "youtube") {
        submitData.append("image_video", formData.image_video);
      } else if (mediaType === "image") {
        if (formData.image_file) {
          submitData.append("image_video", formData.image_file);
        }
      }

      if (formData.pdf) {
        submitData.append("pdf", formData.pdf);
      }

      const response = await axios.post(`${API_URL}api/innovations`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        toast.success("Your innovation has been submitted successfully!");
        setSubmissionSuccess(true);
        
        // Reset form
        setFormData({
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
        setImagePreview(null);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate("/innovation");
        }, 3000);
      }
    } catch (error) {
      console.error("Error submitting innovation:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit innovation"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Research And Innovation", path: "/innovation" },
          { label: "Submit Innovation" }
        ]}
        pageTitle="Submit Your Innovation"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-red-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Success Message */}
          {submissionSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg animate-fadeIn">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm text-green-800 font-medium">
                    Your innovation has been submitted successfully! You will be redirected shortly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Share Your <span className="text-amber-600">Innovation</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Submit your breakthrough ideas, technologies, and innovations to our community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Guidelines */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-amber-600 mr-2" />
                  <h3 className="text-lg font-bold text-gray-900">Submission Guidelines</h3>
                </div>
                
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="border-l-4 border-amber-400 pl-3">
                    <h4 className="font-semibold text-gray-800">1. Original Content</h4>
                    <p>Submit only original innovations and research that you have created.</p>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-3">
                    <h4 className="font-semibold text-gray-800">2. Media Requirements</h4>
                    <p>Choose between YouTube video or image upload (min 800x500px, max 5MB).</p>
                  </div>
                  
                  <div className="border-l-4 border-green-400 pl-3">
                    <h4 className="font-semibold text-gray-800">3. PDF Upload (Optional)</h4>
                    <p>Upload supporting documents or research papers. Max size: 10MB.</p>
                  </div>
                  
                  <div className="border-l-4 border-purple-400 pl-3">
                    <h4 className="font-semibold text-gray-800">4. Innovator Details</h4>
                    <p>Provide accurate name and email for proper attribution.</p>
                  </div>
                  
                  <div className="border-l-4 border-red-400 pl-3">
                    <h4 className="font-semibold text-gray-800">5. Review Process</h4>
                    <p>All submissions will be reviewed by our expert panel before publication.</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-start">
                    <Rocket className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">Note:</span> Innovative ideas that have the potential to make a significant impact are prioritized for review.
                    </p>
                  </div>
                </div>

                {/* Example PDF Section */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 mb-2">📄 Sample Submission Format</h4>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p>• Page Title: "AI-Powered Healthcare Solutions"</p>
                    <p>• Content Title: "Revolutionizing Patient Care with AI"</p>
                    <p>• Innovator: Dr. Sarah Johnson</p>
                    <p>• Media: YouTube demo or high-quality infographic</p>
                    <p>• PDF: Detailed research methodology (optional)</p>
                  </div>
                  <button 
                    onClick={() => window.open('https://example.com/sample-innovation.pdf', '_blank')}
                    className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    View Example PDF
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-green-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-green-600">50+</p>
                      <p className="text-xs text-gray-600">Innovations</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-amber-600">30+</p>
                      <p className="text-xs text-gray-600">Innovators</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit Your Innovation</h2>
                <p className="text-gray-600 mb-6">Fill in the details below to share your innovation with the world</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="page_title" className="block text-sm font-medium text-gray-700 mb-2">
                        Page Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="page_title"
                        name="page_title"
                        value={formData.page_title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter page title"
                      />
                    </div>

                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Content Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter content title"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 resize-vertical"
                      placeholder="Enter a brief description of your innovation (2-3 sentences)"
                    />
                  </div>

                  {/* Media Type Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Media Type <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={mediaType === "youtube"}
                          onChange={() => setMediaType("youtube")}
                          className="text-amber-600 focus:ring-amber-500"
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
                          className="text-amber-600 focus:ring-amber-500"
                        />
                        <Image className="w-5 h-5 text-blue-600" />
                        <span className="text-gray-700">Image</span>
                      </label>
                    </div>
                  </div>

                  {/* Media Input */}
                  {mediaType === "youtube" ? (
                    <div>
                      <label htmlFor="image_video" className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        id="image_video"
                        name="image_video"
                        value={formData.image_video}
                        onChange={handleInputChange}
                        required={mediaType === "youtube"}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the full YouTube video URL
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Upload <span className="text-red-500">*</span>
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
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center transition-all duration-300 hover:border-amber-400 hover:bg-amber-50">
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
                              PNG, JPG, JPEG up to 5MB (Recommended: 1200x800px)
                            </span>
                          </label>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Image Alt Tag */}
                  <div>
                    <label htmlFor="image_alt_tag" className="block text-sm font-medium text-gray-700 mb-2">
                      Image Alt Tag
                    </label>
                    <input
                      type="text"
                      id="image_alt_tag"
                      name="image_alt_tag"
                      value={formData.image_alt_tag}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                      placeholder="Enter descriptive alt text for the image"
                    />
                  </div>

                  {/* PDF Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PDF Document <span className="text-gray-400 text-xs">(Optional - Max 10MB)</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Upload supporting documents, research papers, or detailed methodology
                    </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="innovator_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Innovator Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="innovator_name"
                        name="innovator_name"
                        value={formData.innovator_name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="innovator_email" className="block text-sm font-medium text-gray-700 mb-2">
                        Innovator Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="innovator_email"
                        name="innovator_email"
                        value={formData.innovator_email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your email address"
                      />
                    </div>
                  </div>

                  {/* Innovator Description */}
                  <div>
                    <label htmlFor="innovator_desc" className="block text-sm font-medium text-gray-700 mb-2">
                      Innovator Bio
                    </label>
                    <textarea
                      id="innovator_desc"
                      name="innovator_desc"
                      value={formData.innovator_desc}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors duration-200 resize-vertical"
                      placeholder="Tell us about yourself and your background"
                    />
                  </div>

                  {/* Long Description */}
                  <div>
                    <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Content <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Write your full innovation details with proper formatting</p>
                    <div className="border rounded-lg border-gray-300">
                      <Editor
                        apiKey={apikey}
                        value={formData.long_description}
                        init={{
                          height: 400,
                          menubar: false,
                          plugins: [
                            "advlist", "autolink", "link", "lists", "charmap",
                            "preview", "searchreplace", "visualblocks", "code",
                            "fullscreen", "help", "wordcount",
                          ],
                          toolbar:
                            "undo redo | blocks | bold italic underline | link | " +
                            "alignleft aligncenter alignright alignjustify | " +
                            "bullist numlist outdent indent | removeformat | help | code",
                          content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height:1.6; }",
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
                  </div>

                  {/* Status */}
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_upcomming"
                        checked={formData.is_upcomming}
                        onChange={handleInputChange}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Mark as Upcoming Innovation
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Upcoming innovations will be shown in the upcoming section
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
                    <button
                      type="button"
                      onClick={() => navigate("/innovation")}
                      className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex justify-center items-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5 mr-2" />
                          Submit Innovation
                        </>
                      )}
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

export default UserAddInnovationPage;