import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HandlePartners = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    image_alt: "",
    images: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  const isEdit = Boolean(selectedPartner);

  // Fetch partners list
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}api/partners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.status === true) {
        console.log("Fetched partners:", response.data.data);
        setPartners(response.data.data);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching partners:", error);
      toast.error("Failed to fetch partners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        images: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image preview
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      images: null
    }));
    setImagePreview(null);
    
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      name: "",
      image_alt: "",
      images: null
    });
    setImagePreview(null);
    setSelectedPartner(null);
  };

  // Open modal for add or edit
  const openModal = (partner = null) => {
    if (partner) {
      // Edit mode
      setSelectedPartner(partner);
      setFormData({
        title: partner.title || "",
        name: partner.name || "",
        image_alt: partner.image_alt || "",
        images: null
      });
      setImagePreview(`${STORAGE_URL}${partner.images}`);
    } else {
      // Add mode
      resetForm();
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setTimeout(() => {
      resetForm();
    }, 300);
  };

  // Submit form (add or edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("name", formData.name);
    submitData.append("image_alt", formData.image_alt);
    
    if (formData.images) {
      submitData.append("images", formData.images);
    }

    // // For edit, use PUT method
    // if (isEdit) {
    //   submitData.append("_method", "PUT");
    // }

    try {
      const url = isEdit ? `${API_URL}api/partners/${selectedPartner.id}` : `${API_URL}api/partners`;
      const response = await axios.post(url, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(`Partner ${isEdit ? 'updated' : 'added'} successfully!`);
        closeModal();
        fetchPartners();
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'adding'} partner:`, error);
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} partner`);
    } finally {
      setModalLoading(false);
    }
  };

  // Delete partner
  const handleDeletePartner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this partner?")) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}api/partners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Partner deleted successfully!");
        fetchPartners();
      }
    } catch (error) {
      console.error("Error deleting partner:", error);
      toast.error("Failed to delete partner");
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-3xl font-bold text-gray-900">Partners Management</h1>
            <p className="text-gray-600 mt-2">Manage your partners and their information</p>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Partner
          </button>
        </div>

        {/* Partners Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Partners Found</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first partner.</p>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition duration-200"
            >
              Add Partner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {partners.map((partner) => (
              <div key={partner.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition duration-300">
                {/* Partner Image */}
                <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                  {partner.images ? (
                    <img
                      src={`${STORAGE_URL}${partner.images}`}
                      alt={partner.image_alt || partner.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                    ID: {partner.id}
                  </div>
                </div>

                {/* Partner Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {partner.title}
                  </h3>
                  
                  {partner.name && (
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      <span className="font-medium">Name:</span> {partner.name}
                    </p>
                  )}
                  
                  {partner.image_alt && (
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      <span className="font-medium">Alt Text:</span> {partner.image_alt}
                    </p>
                  )}

                  <div className="text-xs text-gray-400 mb-4">
                    Created: {formatDate(partner.created_at)}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      onClick={() => openModal(partner)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition duration-150 px-3 py-2 rounded-lg hover:bg-blue-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePartner(partner.id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1 transition duration-150 px-3 py-2 rounded-lg hover:bg-red-50"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        

        {/* Unified Modal for Add/Edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl transform transition-all duration-300 scale-100 overflow-auto max-h-[90vh] ">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isEdit ? 'Edit Partner' : 'Add New Partner'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition duration-150 p-1 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter partner title"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter partner name (optional)"
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Partner Logo/Image
                    </label>
                    <div className="space-y-3">
                      {/* Upload Area */}
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center transition duration-200 hover:border-blue-400">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="partner-image-upload"
                        />
                        <label
                          htmlFor="partner-image-upload"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-600">Click to upload image</span>
                          <span className="text-xs text-gray-400">PNG, JPG, JPEG up to 5MB</span>
                        </label>
                      </div>

                      {/* Current Image (Edit Mode) */}
                      {isEdit && selectedPartner?.images && !imagePreview && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Current Image:</p>
                          <div className="relative inline-block">
                            <img
                              src={selectedPartner.images}
                              alt="Current"
                              className="h-32 w-full object-cover rounded-lg shadow-sm"
                            />
                            <div className="mt-2 text-xs text-gray-500">
                              Upload new image to replace current one
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">
                            {isEdit ? 'New Image Preview:' : 'Image Preview:'}
                          </p>
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="h-32 w-full object-cover rounded-lg shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition duration-200"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Alt Text */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      name="image_alt"
                      value={formData.image_alt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      placeholder="Enter alt text for accessibility"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center gap-2"
                  >
                    {modalLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isEdit ? 'Updating...' : 'Adding...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {isEdit ? 'Update Partner' : 'Add Partner'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandlePartners;