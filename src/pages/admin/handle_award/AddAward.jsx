import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Editor } from "@tinymce/tinymce-react";

const AddAward = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    image: null,
    image_alt: "",
    short_desc: ""
  });
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [currentImage, setCurrentImage] = useState("");

  // Check if we're in edit mode
  useEffect(() => {
    const updateId = searchParams.get('update');
    if (updateId) {
      setIsEdit(true);
      setCurrentId(updateId);
      fetchItemData(updateId);
    }
  }, [searchParams]);

  // Fetch award data for editing
  const fetchItemData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/awards/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status && response.data.data) {
        const data = response.data.data;
        setCurrentImage(data.image);
        
        setFormData({
          image: null,
          image_alt: data.image_alt || "",
          short_desc: data.short_desc || ""
        });
      }
    } catch (err) {
      toast.error("Error fetching award data: " + err.message);
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

  // Handle editor change for short description
  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      short_desc: content
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
    
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.short_desc || formData.short_desc.trim() === '') {
      toast.error("Please fill in the short description");
      return;
    }

    // Check if short description has actual content (not just HTML tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formData.short_desc;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.trim() === '') {
      toast.error("Please enter a valid short description");
      return;
    }

    if (!isEdit && !formData.image) {
      toast.error("Please select an image");
      return;
    }
    
    try {
      setLoading(true);
      
      const submitData = new FormData();
      submitData.append('short_desc', formData.short_desc);
      submitData.append('image_alt', formData.image_alt);
      
      // For edit mode, if no new image is selected, we still need to handle the update
      // The backend should handle keeping the existing image if no new image is provided
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // For edit mode, we need to use PUT method and append _method for Laravel
      const url = isEdit 
        ? `${API_URL}api/awards/${currentId}`
        : `${API_URL}api/awards/`;
      
      // For Laravel, we need to use POST with _method for updates
      const method = 'POST';
      
      if (isEdit) {
        submitData.append('_method', 'PUT');
      }

      const response = await axios({
        method: method,
        url: url,
        data: submitData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status) {
        toast.success(`Award ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/handle-award');
      } else {
        throw new Error(response.data.message || 'Operation failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${isEdit ? 'update' : 'create'} award`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading award data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {isEdit ? 'Edit Award' : 'Add New Award'}
      </h1>
      
      <p className="text-gray-600 mb-6">
        {isEdit ? 'Update the award information' : 'Add a new award or recognition'}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Image Upload Section */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Award Image {!isEdit && '*'}
            </label>

            {/* Upload Area - Show for both add and edit modes */}
            {!imagePreview && !currentImage && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                  disabled={loading}
                  required={!isEdit}
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
            {(imagePreview || currentImage) && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {isEdit ? (imagePreview ? 'New Image Preview' : 'Current Image') : 'Preview'}:
                </p>
                <div className="relative inline-block group">
                  <img
                    src={imagePreview || currentImage}
                    alt="Preview"
                    className="h-48 w-auto object-contain rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105 border border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  {/* Show remove button for new image uploads in both modes */}
                  {(imagePreview || !isEdit) && (
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
                  )}
                </div>
                
                {/* Upload new image button for edit mode when current image is shown */}
                {isEdit && currentImage && !imagePreview && (
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="replace-image"
                      disabled={loading}
                    />
                    <label
                      htmlFor="replace-image"
                      className="cursor-pointer inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Replace Image
                    </label>
                  </div>
                )}
              </div>
            )}

            {isEdit && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> {currentImage ? 
                    "You can keep the current image or upload a new one. If you upload a new image, it will replace the current one." : 
                    "Upload a new image to update the award image."
                  }
                </p>
              </div>
            )}
          </div>

          {/* Image Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Alt Text
            </label>
            <input
              type="text"
              name="image_alt"
              value={formData.image_alt}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter descriptive alt text for the image"
            />
          </div>

          {/* Short Description with TinyMCE Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
              value={formData.short_desc}
              onEditorChange={handleEditorChange}
              init={{
                height: 300,
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
                  "image"
                ],
                toolbar:
                  "undo redo | blocks | " +
                  "bold italic underline | link | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | " +
                  "image | removeformat | help | code",
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
                // Image upload configuration
                images_upload_url: `${API_URL}api/upload`,
                images_upload_handler: async (blobInfo) => {
                  return new Promise((resolve, reject) => {
                    const formData = new FormData();
                    formData.append('file', blobInfo.blob(), blobInfo.filename());

                    fetch(`${API_URL}api/upload`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                      body: formData
                    })
                    .then(response => response.json())
                    .then(result => {
                      if (result.url) {
                        resolve(result.url);
                      } else {
                        reject('Upload failed');
                      }
                    })
                    .catch(() => reject('Upload failed'));
                  });
                },
                // Remove unnecessary buttons for short description
                toolbar_mode: 'sliding',
                paste_data_images: true,
                image_advtab: true,
                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                // Validation
                invalid_elements: 'h1,h2,h3,h4,h5,h6', // Remove heading tags for short description
                setup: (editor) => {
                  editor.on('change', () => {
                    // Additional validation if needed
                  });
                }
              }}
              disabled={loading}
            />
            <p className="text-sm text-gray-500 mt-2">
              Provide a detailed description of the award, recognition, or achievement
            </p>
          </div>

          {/* Character/Word Count (Optional) */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Editor Guidelines:
            </h4>
            <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>Use the editor to format your award description</li>
              <li>You can add links, lists, and basic formatting</li>
              <li>Images can be uploaded directly in the editor if needed</li>
              <li>Keep the description concise but informative</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
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
                isEdit ? 'Update Award' : 'Create Award'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/handle-award')}
              disabled={loading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>

     
    </div>
  );
};

export default AddAward;