import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import TextEditor from "../../../components/common/TextEditor";

const HandleResearchAndServicesDetails = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);

  // State for list data
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // State for form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // State for images
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [serviceImages, setServiceImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // State for image upload form
  const [imageForm, setImageForm] = useState({
    image: null,
    image_alt: "",
    is_active: true
  });
  const [imagePreview, setImagePreview] = useState(null);

  // Initial form state for main service
  const initialFormState = {
    name: "",
    name_meta: "",
    s_desc: "",
    s_desc_meta: "",
    l_desc: "",
    l_desc_meta: "",
    number_of_review: "",
    rating: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch all details on component mount
  useEffect(() => {
    fetchDetails();
  }, []);

  // Fetch all research service details
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/admin/rs-products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setDetails(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch research service details");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch service images
  const fetchServiceImages = async (serviceId) => {
    try {
      setLoadingImages(true);
      const response = await axios.get(`${API_URL}api/admin/rs-product-images/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setServiceImages(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch service images");
      console.error("Fetch images error:", err);
    } finally {
      setLoadingImages(false);
    }
  };

  // Handle input changes for main form
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError("Please upload an image file");
        return;
      }

      setImageForm(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle image form input change
  const handleImageFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setImageForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Reset image form
  const resetImageForm = () => {
    setImageForm({
      image: null,
      image_alt: "",
      is_active: true
    });
    setImagePreview(null);
    setError(null);
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    
    if (!imageForm.image) {
      setError("Please select an image");
      return;
    }

    setUploadingImage(true);
    setError(null);

    const formData = new FormData();
    formData.append('rs_product_id', selectedServiceId);
    formData.append('image', imageForm.image);
    formData.append('image_alt', imageForm.image_alt);
    formData.append('is_active', imageForm.is_active === "true" ? "1":"0");

    try {
      const response = await axios.post(
        `${API_URL}api/admin/rs-product-images/store`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        }
      );

      if (response.data.status) {
        setSuccess("Image uploaded successfully!");
        resetImageForm();
        await fetchServiceImages(selectedServiceId); // Refresh images list
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload image");
      console.error("Upload error:", err);
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image delete
  const handleImageDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}api/admin/rs-product-images/delete/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setSuccess("Image deleted successfully!");
        await fetchServiceImages(selectedServiceId); // Refresh images list
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to delete image");
      console.error("Delete error:", err);
    }
  };

  // Handle manage images click
  const handleManageImages = (serviceId) => {
    setSelectedServiceId(serviceId);
    fetchServiceImages(serviceId);
    setShowImageModal(true);
    resetImageForm();
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setShowForm(false);
    setError(null);
  };

  // Handle edit click
  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || "",
      name_meta: item.name_meta || "",
      s_desc: item.s_desc || "",
      s_desc_meta: item.s_desc_meta || "",
      l_desc: item.l_desc || "",
      l_desc_meta: item.l_desc_meta || "",
      number_of_review: item.number_of_review || "",
      rating: item.rating || "",
      is_active: item.is_active || true,
    });
    setShowForm(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle add new click
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = {
        ...formData,
        number_of_review: formData.number_of_review
          ? Number(formData.number_of_review)
          : 0,
        rating: formData.rating ? Number(formData.rating) : 0,
      };

      let response;
      if (editingId) {
        response = await axios.put(
          `${API_URL}api/admin/rs-products/${editingId}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${API_URL}api/admin/rs-products`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.status) {
        setSuccess(
          editingId
            ? "Record updated successfully!"
            : "Record created successfully!"
        );
        await fetchDetails();
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save record");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}api/admin/rs-products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        setSuccess("Record deleted successfully!");
        await fetchDetails();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to delete record");
      console.error("Delete error:", err);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (item) => {
    try {
      const response = await axios.put(
        `${API_URL}api/admin/rs-products/toggle-status/${item.id}`,
        { is_active: !item.is_active },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        setSuccess("Status updated successfully!");
        await fetchDetails();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to update status");
      console.error("Status update error:", err);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Research Services Details
          </h1>
          <p className="text-gray-600 mt-2">
            Manage research service details and features
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add New Detail
        </button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <div className="text-green-700">{success}</div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="mb-8 bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {editingId
              ? "Edit Research Service Detail"
              : "Add New Research Service Detail"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Name Meta */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name Meta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name_meta"
                  value={formData.name_meta}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Short Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <div style={{ height: "600px" }}>
                  <TextEditor
                    apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                    value={formData.s_desc}
                    onChange={(content) =>
                      setFormData((prev) => ({
                        ...prev,
                        s_desc: content,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Short Description Meta */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description Meta <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="s_desc_meta"
                  value={formData.s_desc_meta}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Long Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description <span className="text-red-500">*</span>
                </label>
                <div style={{ height: "600px" }}>
                  <TextEditor
                    apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                    value={formData.l_desc}
                    onChange={(content) =>
                      setFormData((prev) => ({
                        ...prev,
                        l_desc: content,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Long Description Meta */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Long Description Meta <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="l_desc_meta"
                  value={formData.l_desc_meta}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Number of Reviews */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Reviews <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="number_of_review"
                  value={formData.number_of_review}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  name="rating"
                  value={formData.rating}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Active Status */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active Status
                  </label>
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  submitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {submitting ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List Section */}
      <div className="bg-white shadow-lg rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Research Service Details List
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-600">
              Loading research service details...
            </div>
          </div>
        ) : details.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-600">
              No research service details found.
            </div>
            <button
              onClick={handleAddNew}
              className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              Add your first research service detail
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviews
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Images
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {details.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.name_meta}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.slug}
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.number_of_review}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.rating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(item)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleManageImages(item.id)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        Manage Images
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Image Management Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Manage Service Images
              </h3>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setServiceImages([]);
                  resetImageForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            {/* Image Upload Form */}
            <div className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="text-md font-medium text-gray-800 mb-3">Upload New Image</h4>
              <form onSubmit={handleImageUpload} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image File (Max 2MB) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-md border border-gray-200"
                      />
                    </div>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Supported formats: JPG, PNG, GIF, WEBP (Max size: 2MB)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    name="image_alt"
                    value={imageForm.image_alt}
                    onChange={handleImageFormChange}
                    placeholder="Describe the image for SEO"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={imageForm.is_active}
                    onChange={handleImageFormChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Active Status
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={uploadingImage}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    uploadingImage ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {uploadingImage ? "Uploading..." : "Upload Image"}
                </button>
              </form>
            </div>

            {/* Images List */}
            <div>
              <h4 className="text-md font-medium text-gray-800 mb-3">Service Images</h4>
              {loadingImages ? (
                <div className="text-center py-4">Loading images...</div>
              ) : serviceImages.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No images uploaded yet
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {serviceImages.map((image) => (
                    <div key={image.id} className="relative group border rounded-lg overflow-hidden">
                      <img
                        src={`${STORAGE_URL}${image.image}`}
                        alt={image.image_alt || 'Service image'}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleImageDelete(image.id)}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          image.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {image.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleResearchAndServicesDetails;