import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { useSelector } from "react-redux";
import axios from "axios";

const AddCategories = () => {
  // Dummy groups for select dropdown (replace with API later)
  const [groupOptions, setGroupOptions] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  const [formData, setFormData] = useState({
    group_id: '',
    category_name: "",
    category_description: "",
  });
  const [loading, setLoading] = useState(true);
  const [handleLoading, setHandleLoading] = useState(false);

  const fetchGroupData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/groups`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setGroupOptions(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch groups");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandleLoading(true)

    try {
      const response = await axios.post(`${API_URL}api/admin/categories`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      if (response.status === 201) {
        toast.success(response.data.message || "Category added successfully");

      } else {
        toast.error(response.data.message || "Failed to add category");
      }


    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong while adding category");
    } finally {
      setHandleLoading(false)
      setFormData({
        group_id: 1,
        category_name: "",
        category_description: "",
      });
    }


  };

  useEffect(() => {
    fetchGroupData();

  }, [token])

  if (loading) {
    return <Loader />
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Category</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name (Select) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name <span className="text-red-500">*</span>
          </label>
          <select
            name="group_id"
            value={formData.group_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          >
            <option value="">Select a group</option>
            {groupOptions.map((group) => (
              <option key={group.id} value={group.id}>
                {group.group_name}
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



        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={handleLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 ${handleLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
          >
            {handleLoading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategories;
