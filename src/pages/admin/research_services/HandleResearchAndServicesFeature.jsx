import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Plus, Edit, Trash2, X, Check, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import TextEditor from "../../../components/common/TextEditor";

const API_URL = import.meta.env.VITE_API_URL;
const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

const HandleResearchAndServicesFeature = () => {
  const { token } = useSelector((state) => state.auth);

  // State for products list (for dropdown)
  const [products, setProducts] = useState([]);

  // State for features list
  const [features, setFeatures] = useState([]);
  const [filteredFeatures, setFilteredFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [featuresLoading, setFeaturesLoading] = useState(false);

  // State for filters
  const [selectedProductId, setSelectedProductId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // State for modal/form
  const [showForm, setShowForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState(null);
  const [formData, setFormData] = useState({
    rs_product_id: "",
    catagory: "",
    title: "",
    desc: "",
    long_desc: "",
    badge1: "",
    badge2: "",
    badge3: "",
    is_active: true,
  });

  // Fetch products and features on component mount
  useEffect(() => {
    fetchProducts();
    fetchFeatures();
  }, []);

  // Filter features when selectedProductId or searchTerm changes
  useEffect(() => {
    filterFeatures();
  }, [selectedProductId, searchTerm, features]);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/rs-products`, {
        headers: { Authorization: `Bearer ${token}`,
       "Cache-Control": "no-cache",
          Pragma: "no-cache", },
        
      });

      if (response.data.status) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    }
  };

  // Fetch all features from API
  const fetchFeatures = async () => {
    try {
      setFeaturesLoading(true);
      const response = await axios.get(`${API_URL}api/admin/rs-features`, {
        headers: { Authorization: `Bearer ${token}`,
       "Cache-Control": "no-cache",
          Pragma: "no-cache", },
      });

      if (response.data.success) {
        setFeatures(response.data.data);
        setFilteredFeatures(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching features:", error);
      toast.error("Failed to fetch features");
    } finally {
      setFeaturesLoading(false);
    }
  };

  // Filter features based on selected product and search term
  const filterFeatures = () => {
    let filtered = [...features];

    // Filter by product
    if (selectedProductId) {
      filtered = filtered.filter(
        (feature) => feature.rs_product_id === selectedProductId,
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (feature) =>
          feature.title.toLowerCase().includes(term) ||
          feature.catagory.toLowerCase().includes(term) ||
          feature.desc.toLowerCase().includes(term) ||
          feature.product?.name.toLowerCase().includes(term),
      );
    }

    setFilteredFeatures(filtered);
  };

  // Handle filter change
  const handleProductFilterChange = (e) => {
    setSelectedProductId(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    setSelectedProductId("");
    setSearchTerm("");
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      rs_product_id: "",
      catagory: "",
      title: "",
      desc: "",
      long_desc: "",
      badge1: "",
      badge2: "",
      badge3: "",
      is_active: true,
    });
    setEditingFeature(null);
  };

  // Open form for adding new feature
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  // Open form for editing feature
  const handleEdit = (feature) => {
    setEditingFeature(feature);
    setFormData({
      rs_product_id: feature.rs_product_id,
      catagory: feature.catagory,
      title: feature.title,
      desc: feature.desc,
      long_desc: feature.long_desc,
      badge1: feature.badge1,
      badge2: feature.badge2,
      badge3: feature.badge3,
      is_active: feature.is_active,
    });
    setShowForm(true);
  };

  // Close form
  const handleCloseForm = () => {
    setShowForm(false);
    resetForm();
  };

  // Submit form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rs_product_id) {
      toast.error("Please select a product");
      return;
    }

    try {
      setLoading(true);

      if (editingFeature) {
        // Update feature
        const response = await axios.put(
          `${API_URL}api/admin/rs-features/${editingFeature.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          toast.success("Feature updated successfully");
          fetchFeatures();
          handleCloseForm();
        }
      } else {
        // Add new feature
        const response = await axios.post(
          `${API_URL}api/admin/rs-features`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        if (response.data.success) {
          toast.success("Feature added successfully");
          fetchFeatures();
          handleCloseForm();
        }
      }
    } catch (error) {
      console.error("Error saving feature:", error);
      toast.error(error.response?.data?.message || "Failed to save feature");
    } finally {
      setLoading(false);
    }
  };

  // Delete feature
  const handleDelete = async (featureId) => {
    if (!window.confirm("Are you sure you want to delete this feature?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_URL}api/admin/rs-features/${featureId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        toast.success("Feature deleted successfully");
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error deleting feature:", error);
      toast.error("Failed to delete feature");
    } finally {
      setLoading(false);
    }
  };

  // Toggle feature status
  const handleToggleStatus = async (feature) => {
    try {
      setLoading(true);
      const response = await axios.put(
        `${API_URL}api/admin/rs-features/${feature.id}`,
        { ...feature, is_active: !feature.is_active },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        toast.success(
          `Feature ${!feature.is_active ? "activated" : "deactivated"} successfully`,
        );
        fetchFeatures();
      }
    } catch (error) {
      console.error("Error toggling feature status:", error);
      toast.error("Failed to update feature status");
    } finally {
      setLoading(false);
    }
  };

  // Get product name by ID
  const getProductName = (productId) => {
    const product = products.find((p) => p.id === parseInt(productId));
    return product ? product.name : "Unknown Product";
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Research & Services Features
        </h1>
        <p className="text-gray-600">
          Manage all features for research and service products
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Product Filter Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Product
              </label>
              <select
                value={selectedProductId}
                onChange={handleProductFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Products</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id.toString()}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Features
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by title, category, description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Add New Button */}
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Feature
          </button>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingFeature ? "Edit Feature" : "Add New Feature"}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Product Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Product <span className="text-red-500">*</span>
                </label>
                <select
                  name="rs_product_id"
                  value={formData.rs_product_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="catagory"
                    value={formData.catagory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="desc"
                  value={formData.desc}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Description <span className="text-red-500">*</span>
                </label>
                <div style={{height:"600px"}}>
                <TextEditor
                  key={editingFeature?.id || "new"} // IMPORTANT for edit switching
                  apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                  value={formData.long_desc}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      long_desc: content,
                    }))
                  }
                />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge 1
                  </label>
                  <input
                    type="text"
                    name="badge1"
                    value={formData.badge1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge 2
                  </label>
                  <input
                    type="text"
                    name="badge2"
                    value={formData.badge2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Badge 3
                  </label>
                  <input
                    type="text"
                    name="badge3"
                    value={formData.badge3}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="is_active"
                  className="ml-2 text-sm text-gray-700"
                >
                  Active
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingFeature ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            All Features{" "}
            {filteredFeatures.length > 0 && `(${filteredFeatures.length})`}
          </h2>
        </div>

        {featuresLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredFeatures.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No features found</p>
            {(selectedProductId || searchTerm) && (
              <button
                onClick={clearFilters}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`border rounded-lg p-4 ${
                  feature.is_active
                    ? "border-gray-200"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                        {feature.catagory}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                        {feature.product?.name ||
                          getProductName(feature.rs_product_id)}
                      </span>
                      {!feature.is_active && (
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{feature.desc}</p>
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                      {feature.long_desc}
                    </p>

                    {/* Badges */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {feature.badge1 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature.badge1}
                        </span>
                      )}
                      {feature.badge2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature.badge2}
                        </span>
                      )}
                      {feature.badge3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {feature.badge3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleToggleStatus(feature)}
                      className={`p-2 rounded-lg ${
                        feature.is_active
                          ? "text-green-600 hover:bg-green-50"
                          : "text-gray-400 hover:bg-gray-100"
                      }`}
                      title={feature.is_active ? "Deactivate" : "Activate"}
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEdit(feature)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Edit"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(feature.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleResearchAndServicesFeature;
