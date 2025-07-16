import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../../components/common/Loader';

const EditCategories = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    group_id: "", // fetched but not editable
    group_name: "",
    category_name: "",
    category_description: "",
    status: "1",
  });
  const [loading, setLoading] = useState(true);
  const [handleLoading, setHandleLoading] = useState(false);

  // Fetch single category
  const fetchCategoryData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200 && response.data?.data) {
        const data = response.data.data;
        setFormData({
          group_id: data.group_id,
          group_name: data.group?.group_name || "", // show group name
          category_name: data.category_name,
          category_description: data.category_description,
          status: data.status,
        });
      } else {
        toast.error(response.data.message || "Failed to fetch category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching category data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandleLoading(true);
    try {
      const payload = {
        category_name: formData.category_name,
        category_description: formData.category_description,
        status: formData.status,
      };

      const response = await axios.put(
        `${API_URL}api/admin/categories/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Category updated successfully");
        navigate("/categories/view-categories"); // redirect back
      } else {
        toast.error(response.data.message || "Failed to update category");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while updating category");
    } finally {
      setHandleLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name
          </label>
          <input
            type="text"
            value={formData.group_name}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm px-3 py-2 border"
          />
        </div>

        {/* Category Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
            placeholder="Enter category name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="category_description"
            value={formData.category_description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          ></textarea>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enable
          </label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="1"
                checked={formData.status === "1"}
                onChange={() => handleStatusChange("1")}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="status"
                value="0"
                checked={formData.status === "0"}
                onChange={() => handleStatusChange("0")}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={handleLoading}
            className={`text-white font-semibold px-6 py-2 rounded-lg flex items-center justify-center gap-2 ${
              handleLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } transition-colors duration-300`}
          >
            {handleLoading && (
              <svg
                className="animate-spin h-5 w-5 text-white"
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
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCategories;
