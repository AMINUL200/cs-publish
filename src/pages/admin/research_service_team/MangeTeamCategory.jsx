import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { useNavigate } from "react-router-dom";

const MangeTeamCategory = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    is_order: "",
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    is_order: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}api/team-category`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
        params: {
          t: new Date(),
        },
      });

      if (res.data.status) {
        setCategories(res.data.data);
        console.log("Fetched categories:", res.data.data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      toast.error(err.response?.data?.message || "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!addFormData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await axios.post(`${API_URL}api/team-category`, addFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.status) {
        toast.success(res.data.message || "Category added successfully");
        setAddModalOpen(false);
        setAddFormData({ name: "", is_order: "" });
        fetchCategories();
      }
    } catch (err) {
      console.error("Error adding category:", err);
      toast.error(err.response?.data?.message || "Error adding category");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Update category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSubmitLoading(true);
      const res = await axios.post(
        `${API_URL}api/team-category/${selectedCategory.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.status) {
        toast.success(res.data.message || "Category updated successfully");
        setEditModalOpen(false);
        setSelectedCategory(null);
        setFormData({ name: "", is_order: "" });
        fetchCategories();
      }
    } catch (err) {
      console.error("Error updating category:", err);
      toast.error(err.response?.data?.message || "Error updating category");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      setDeleteLoading(categoryId);
      const res = await axios.delete(`${API_URL}api/team-category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.status) {
        toast.success(res.data.message || "Category deleted successfully");
        setCategories((prev) => prev.filter((item) => item.id !== categoryId));
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      toast.error(err.response?.data?.message || "Error deleting category");
    } finally {
      setDeleteLoading(null);
    }
  };

  // Open edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      is_order: category.is_order,
    });
    setEditModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setEditModalOpen(false);
    setAddModalOpen(false);
    setSelectedCategory(null);
    setFormData({ name: "", is_order: "" });
    setAddFormData({ name: "", is_order: "" });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Manage Team Categories
            </h1>
            <p className="text-gray-600">
              Organize team members by creating and managing categories
            </p>
          </div>

          {/* Add Button */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2 shadow-sm"
          >
            <span>+</span>
            Add New Category
          </button>
        </div>

        {/* Categories List */}
        {categories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📂</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first team category.
            </p>
            <button
              onClick={() => setAddModalOpen(true)}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Create First Category
            </button>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Categories Overview
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {categories.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Categories</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {categories.filter((c) => parseInt(c.is_order) <= 5).length}
                  </div>
                  <div className="text-sm text-gray-600">Top Priority</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {categories.filter((c) => parseInt(c.is_order) > 5).length}
                  </div>
                  <div className="text-sm text-gray-600">Lower Priority</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">
                    {Math.max(...categories.map((c) => parseInt(c.is_order)), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Max Order</div>
                </div>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  <div className="p-6">
                    {/* Category Icon and Name */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl">
                          📁
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {category.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            ID: {category.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Information */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">
                          Order Priority:
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          Position {category.is_order}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Created:</span>{" "}
                          {new Date(category.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Updated:</span>{" "}
                          {new Date(category.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(category)}
                        className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCategory(category.id, category.name)
                        }
                        disabled={deleteLoading === category.id}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors ${
                          deleteLoading === category.id
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-red-500 text-white hover:bg-red-600"
                        }`}
                      >
                        {deleteLoading === category.id ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <span>🗑️</span>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Refresh Button */}
        {categories.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchCategories}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Refresh Data
            </button>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Add New Category
              </h2>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={addFormData.name}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Order Position
                </label>
                <input
                  type="number"
                  value={addFormData.is_order}
                  onChange={(e) =>
                    setAddFormData({ ...addFormData, is_order: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter order number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-medium ${
                    submitLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitLoading ? "Adding..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editModalOpen && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Edit Category
              </h2>
              <button
                onClick={closeModals}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="p-6">
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Order Position
                </label>
                <input
                  type="number"
                  value={formData.is_order}
                  onChange={(e) =>
                    setFormData({ ...formData, is_order: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter order number"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModals}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className={`flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium ${
                    submitLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {submitLoading ? "Updating..." : "Update Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MangeTeamCategory;