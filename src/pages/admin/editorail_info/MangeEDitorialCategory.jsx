import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrash,
  faPlus,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../components/common/Loader";

const ManageEditorialCategory = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  const [journals, setJournals] = useState([]);
  const [editorialCategories, setEditorialCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    journal_id: "",
    name: "",
    is_order: "",
  });

  // Fetch journals
  const fetchJournals = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.status === 200 && response.data.success) {
        setJournals(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch journals");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching journals");
    }
  };

  // Fetch editorial categories
  const fetchEditorialCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/admin/editorial-categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        },
      );
      console.log("Editorial Categories Response:", response.data);
      if (response.status === 200 && response.data.status) {
        setEditorialCategories(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch editorial categories",
        );
        console.log("Failed to fetch editorial categories:", response.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching editorial categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
    fetchEditorialCategories();
  }, [token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      journal_id: "",
      name: "",
      is_order: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (category) => {
    setEditingId(category.id);
    setFormData({
      journal_id: category.journal_id,
      name: category.name,
      is_order: category.is_order,
    });
    setShowForm(true);
  };

  // Handle submit (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const url = editingId
        ? `${API_URL}api/admin/editorial-categories/${editingId}`
        : `${API_URL}api/admin/editorial-categories`;
      const method = editingId ? "put" : "post";

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message ||
            `Editorial category ${editingId ? "updated" : "created"} successfully`,
        );
        resetForm();
        fetchEditorialCategories();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this editorial category?",
      )
    )
      return;

    setActionLoading(true);
    try {
      const response = await axios.delete(
        `${API_URL}api/admin/editorial-categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success(
          response.data.message || "Editorial category deleted successfully",
        );
        fetchEditorialCategories();
      } else {
        toast.error(
          response.data.message || "Failed to delete editorial category",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          MANAGE EDITORIAL CATEGORIES
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Editorial Category
          </button>
        )}
        {showForm && (
          <button
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
        )}
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId
              ? "Edit Editorial Category"
              : "Add New Editorial Category"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Journal Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Journal <span className="text-red-500">*</span>
                </label>
                <select
                  name="journal_id"
                  value={formData.journal_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a journal</option>
                  {journals.map((journal) => (
                    <option key={journal.id} value={journal.id}>
                      {journal.j_title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Associate Editors"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="is_order"
                  value={formData.is_order}
                  onChange={handleInputChange}
                  placeholder="e.g., 1, 2, 3..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="1"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={actionLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors duration-300 ${
                  actionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {actionLoading ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Si.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Journal Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Category Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Order
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {editorialCategories.length > 0 ? (
              editorialCategories.map((category, index) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {category.journal?.j_title || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2 text-center">
                    {category.is_order}
                  </td>
                  <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    <button
                      onClick={() => handleEdit(category)}
                      disabled={actionLoading}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-300 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={actionLoading}
                      className={`text-white px-3 py-1 rounded transition-colors duration-300 ${
                        actionLoading
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 cursor-pointer"
                      }`}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-sm text-gray-500 border-2"
                >
                  No editorial categories found. Click "Add Editorial Category"
                  to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {editorialCategories.length > 0 ? 1 : 0} to{" "}
          {editorialCategories.length} of {editorialCategories.length} rows
        </div>
      </div>
    </div>
  );
};

export default ManageEditorialCategory;
