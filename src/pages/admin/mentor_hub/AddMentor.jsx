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
  Link,
  Calendar,
  Users,
  FileText,
  Share2,
  Mail,
  Eye,
  X
} from "lucide-react";
import { toast } from "react-toastify";

const AddMentor = () => {
  const API_URL = import.meta.env.VITE_API_URL;
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
    is_upcomming: "0"
  });
  
  const [shareLinks, setShareLinks] = useState([{ key: "", value: "" }]);
  const [eventSocialLinks, setEventSocialLinks] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [mentorId, setMentorId] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [pptFile, setPptFile] = useState(null);

  // Check if edit mode
  useEffect(() => {
    const updateId = searchParams.get('update');
    if (updateId) {
      setIsEdit(true);
      setMentorId(updateId);
      fetchMentorData(updateId);
    }
  }, [searchParams]);

  // Fetch mentor data for editing
  const fetchMentorData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status && response.data.data) {
        const mentor = response.data.data;
        
        // Set current image for preview
        if (mentor.image_video) {
          setCurrentImage(mentor.image_video);
        }

        // Set current files if they exist
        if (mentor.pdf) {
          setPdfFile({ name: "Current PDF", url: mentor.pdf });
        }
        if (mentor.ppt) {
          setPptFile({ name: "Current PPT", url: mentor.ppt });
        }

        // Set form data
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
          is_upcomming: mentor.is_upcomming || "0"
        });

        // Set share links
        if (mentor.share_links) {
          if (typeof mentor.share_links === 'object') {
            const links = Object.entries(mentor.share_links).map(([key, value]) => ({
              key,
              value
            }));
            setShareLinks(links.length > 0 ? links : [{ key: "", value: "" }]);
          } else if (Array.isArray(mentor.share_links)) {
            setShareLinks(mentor.share_links.map(link => ({ key: "link", value: link })));
          }
        }

        // Set event social links
        if (mentor.event_social_links) {
          if (typeof mentor.event_social_links === 'object') {
            const links = Object.entries(mentor.event_social_links).map(([key, value]) => ({
              key,
              value
            }));
            setEventSocialLinks(links.length > 0 ? links : [{ key: "", value: "" }]);
          } else if (Array.isArray(mentor.event_social_links)) {
            setEventSocialLinks(mentor.event_social_links.map(link => ({ key: "link", value: link })));
          }
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
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? "1" : "0") : value
    }));
  };

  // Handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      // Validate file types
      if (name === 'image_video') {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          toast.error('Please select an image or video file');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File size should be less than 10MB');
          return;
        }

        // Create preview for image
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
        }
      } else if (name === 'pdf') {
        if (!file.type.includes('pdf')) {
          toast.error('Please select a PDF file');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error('PDF file size should be less than 5MB');
          return;
        }
        setPdfFile(file);
      } else if (name === 'ppt') {
        const allowedTypes = [
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ];
        if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.ppt') && !file.name.toLowerCase().endsWith('.pptx')) {
          toast.error('Please select a PowerPoint file (PPT or PPTX)');
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error('PPT file size should be less than 5MB');
          return;
        }
        setPptFile(file);
      }

      setFormData(prev => ({
        ...prev,
        [name]: file
      }));
    }
  };

  // Handle share links
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

  // Handle event social links
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
    setFormData(prev => ({ ...prev, image_video: null }));
    setImagePreview("");
    setCurrentImage("");
  };

  // Remove PDF file
  const handleRemovePdf = () => {
    setFormData(prev => ({ ...prev, pdf: null }));
    setPdfFile(null);
    // Clear the file input
    const pdfInput = document.getElementById('pdf-upload');
    if (pdfInput) pdfInput.value = '';
  };

  // Remove PPT file
  const handleRemovePpt = () => {
    setFormData(prev => ({ ...prev, ppt: null }));
    setPptFile(null);
    // Clear the file input
    const pptInput = document.getElementById('ppt-upload');
    if (pptInput) pptInput.value = '';
  };

  // Format links for submission
  const formatLinksForSubmission = (links) => {
    const validLinks = links.filter(link => link.key && link.value);
    if (validLinks.length === 0) return null;
    
    const result = {};
    validLinks.forEach(link => {
      result[link.key] = link.value;
    });
    return result;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.catagory || !formData.title || !formData.event_name) {
      toast.error("Please fill in required fields: Category, Title, and Event Name");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      
      // Append form data
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
          if (key === 'image_video' || key === 'pdf' || key === 'ppt') {
            if (formData[key] instanceof File) {
              submitData.append(key, formData[key]);
            } else if (formData[key] === null && isEdit) {
              // In edit mode, if file is removed, send null to delete it
              submitData.append(key, '');
            }
          } else {
            submitData.append(key, formData[key]);
          }
        }
      });

      // Format and append links
      const formattedShareLinks = formatLinksForSubmission(shareLinks);
      const formattedEventLinks = formatLinksForSubmission(eventSocialLinks);

      if (formattedShareLinks) {
        submitData.append('share_links', JSON.stringify(formattedShareLinks));
      } else if (isEdit) {
        submitData.append('share_links', '');
      }

      if (formattedEventLinks) {
        submitData.append('event_social_links', JSON.stringify(formattedEventLinks));
      } else if (isEdit) {
        submitData.append('event_social_links', '');
      }

      const url = isEdit 
        ? `${API_URL}api/events/update/${mentorId}`
        : `${API_URL}api/events/store`;

      const response = await axios.post(url, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status) {
        toast.success(`Mentor event ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/handle-mentor-hub');
      } else {
        throw new Error(response.data.message || 'Operation failed');
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} mentor event`);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/handle-mentor-hub')}
            className="flex items-center space-x-2 text-gray-600 hover:text-yellow-600 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Mentor Hub</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Mentor Event' : 'Add New Mentor Event'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update the mentor event details' : 'Create a new mentor event with all necessary information'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
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

              {/* Image/Video Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Image/Video
                </label>
                
                {(imagePreview || currentImage) && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                    <div className="relative inline-block">
                      <img
                        src={imagePreview || currentImage}
                        alt="Preview"
                        className="h-48 rounded-lg shadow-md"
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
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Click to upload image or video</span>
                      <span className="text-xs text-gray-400">PNG, JPG, MP4 up to 10MB</span>
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
                          {pdfFile.name || 'PDF File'}
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
                        <span className="text-sm text-gray-600">Upload PDF</span>
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
                          {pptFile.name || 'PPT File'}
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
                        <span className="text-sm text-gray-600">Upload PPT</span>
                        <span className="text-xs text-gray-400">Max 5MB</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Social Links */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-black" />
                <span>Social Links</span>
              </h2>

              {/* Share Links */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Share Links (Key-Value Pairs)
                </label>
                {shareLinks.map((link, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Platform (e.g., facebook, twitter)"
                      value={link.key}
                      onChange={(e) => handleShareLinkChange(index, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.value}
                      onChange={(e) => handleShareLinkChange(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeShareLink(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      disabled={shareLinks.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addShareLink}
                  className="mt-2 flex items-center space-x-1 text-yellow-600 hover:text-yellow-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Link</span>
                </button>
              </div>

              {/* Event Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Event Social Links (Key-Value Pairs)
                </label>
                {eventSocialLinks.map((link, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Platform (e.g., linkedin, instagram)"
                      value={link.key}
                      onChange={(e) => handleEventSocialLinkChange(index, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                    <input
                      type="url"
                      placeholder="URL"
                      value={link.value}
                      onChange={(e) => handleEventSocialLinkChange(index, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-yellow-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeEventSocialLink(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                      disabled={eventSocialLinks.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEventSocialLink}
                  className="mt-2 flex items-center space-x-1 text-yellow-600 hover:text-yellow-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Another Link</span>
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
                <label htmlFor="is_upcomming" className="text-sm font-medium text-gray-700">
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
                    <span>{isEdit ? 'Updating...' : 'Creating...'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>{isEdit ? 'Update Event' : 'Create Event'}</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate('/handle-mentor-hub')}
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