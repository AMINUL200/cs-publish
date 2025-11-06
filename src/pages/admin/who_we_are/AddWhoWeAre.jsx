import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddWhoWeAre = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [id, setId] = useState();
  
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    long_desc: "",
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentSlug, setCurrentSlug] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  // Check if we're in edit mode
  useEffect(() => {
    const updateSlug = searchParams.get('update');
    if (updateSlug) {
      setIsEdit(true);
      setCurrentSlug(updateSlug);
      fetchItemData(updateSlug);
    }
  }, [searchParams]);

  // Fetch item data for editing
  const fetchItemData = async (slug) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}api/who-we-are/${slug}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch item data');
      }
      
      const data = await response.json();
      if (data.status && data.data) {
        setId(data.data.id);
        setCurrentImage(data.data.image);
        setLastUpdated(data.data.updated_at || data.data.created_at);
        
        setFormData({
          category: data.data.category || "",
          title: data.data.title || "",
          long_desc: data.data.long_desc || "",
          image: null
        });
      }
    } catch (err) {
      toast.error("Error fetching item data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle editor change for long description
  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      long_desc: content
    }));
  };

  // Handle file input change with preview
  const handleFileChange = (e) => {
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

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image preview and clear file input
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    setImagePreview("");
    setCurrentImage(""); // Also clear current image in edit mode
    
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  // Get current date and time for display
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.category || !formData.title || !formData.long_desc) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isEdit && !formData.image) {
      toast.error("Please select an image");
      return;
    }
    
    try {
      setLoading(true);
      
      const submitData = new FormData();
      submitData.append('category', formData.category);
      submitData.append('title', formData.title);
      submitData.append('long_desc', formData.long_desc);
      
      // In edit mode, if no new image is selected but we want to remove current image
      if (isEdit) {
        if (formData.image) {
          // New image selected
          submitData.append('image', formData.image);
        } else if (!currentImage && !formData.image) {
          // No image exists and no new image selected
          submitData.append('remove_image', 'true');
        }
      } else {
        // Create mode - image is required
        if (formData.image) {
          submitData.append('image', formData.image);
        }
      }

      const url = isEdit 
        ? `${API_URL}api/who-we-are/update/${id}`
        : `${API_URL}api/who-we-are/store`;
      
      const method = 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} item`);
      }

      const result = await response.json();
      
      if (result.status) {
        toast.success(`Item ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/handle-who-we-are');
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (err) {
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {isEdit ? 'Edit Who We Are' : 'Add New Who We Are'}
      </h1>
      
      {/* Time Information Display */}
      <div className="mb-6 bg-gradient-to-r from-yellow-50 to-red-50 rounded-lg p-4 border border-yellow-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Current Time:</p>
            <p className="text-lg font-semibold text-yellow-600">{getCurrentDateTime()}</p>
          </div>
          {isEdit && lastUpdated && (
            <div>
              <p className="text-sm font-medium text-gray-700">Last Updated:</p>
              <p className="text-lg font-semibold text-red-600">{formatDate(lastUpdated)}</p>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
              placeholder="Enter category"
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
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition duration-200"
              placeholder="Enter title"
            />
          </div>

          {/* Image Upload Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Image {!isEdit && '*'}
            </label>

            {/* Current Image Display in Edit Mode */}
            {isEdit && currentImage && !imagePreview && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                <div className="relative inline-block group">
                  <img
                    src={currentImage}
                    alt="Current"
                    className="h-48 w-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={loading}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                    title="Remove current image"
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
                <p className="text-xs text-gray-500 mt-1">
                  Click the X button to remove current image
                </p>
              </div>
            )}

            {/* Upload Area */}
            {(!currentImage || imagePreview) && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-50 mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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
                    {isEdit ? 'Upload new image' : 'Click to upload image'}
                  </span>
                  <span className="text-xs text-gray-400">
                    PNG, JPG, JPEG up to 5MB
                  </span>
                </label>
              </div>
            )}

            {/* New Image Preview */}
            {imagePreview && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">New Image Preview:</p>
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
              </div>
            )}

            {isEdit && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-yellow-700">
                  <strong>Note:</strong> {currentImage ? 
                    "Upload a new image to replace the current one, or remove the current image using the X button." : 
                    "No current image. Upload an image to add one."
                  }
                </p>
              </div>
            )}
          </div>

          {/* Long Description with TinyMCE Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Description *
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
              value={formData.long_desc}
              onEditorChange={handleEditorChange}
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
                // Link dialog configuration
                link_list: [
                  { title: "Home Page", value: "/" },
                  { title: "About Page", value: "/about" },
                  { title: "Contact Page", value: "/contact" },
                ],
              }}
              disabled={loading}
            />
          </div>

          {/* Image Requirements */}
          <div className="bg-gradient-to-r from-yellow-50 to-red-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-yellow-800 mb-2">
              Image Requirements:
            </h4>
            <ul className="text-xs text-yellow-700 list-disc list-inside space-y-1">
              <li>Supported formats: JPG, PNG, JPEG, GIF, WEBP</li>
              <li>Maximum file size: 5MB</li>
              <li>Recommended dimensions: 1200x800px or similar ratio</li>
              <li>Optimal format: WebP for better performance</li>
              <li>Upload time: {getCurrentDateTime()}</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 flex items-center justify-center shadow-lg"
            >
              {loading ? (
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
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Update Content' : 'Create Content'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/handle-who-we-are')}
              disabled={loading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 shadow-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

     
    </div>
  );
};

export default AddWhoWeAre;