import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AddGroups = () => {
  const [formData, setFormData] = useState({
    group_name: "",
    description: "",
    // enable: true,
  });
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(false);

  // handle input changes in one place
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // special handler for radio (enable should be boolean)
  // const handleEnableChange = (value) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     enable: value,
  //   }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}api/admin/groups`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      console.log(response);
      if (response.status === 201) {
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }



    } catch (error) {
      console.log(error);
      toast.error(error.message)
    } finally {
      setLoading(false);
      setFormData({
        group_name: "",
        description: "",
        // enable: true,
      })
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Group</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="group_name"
            value={formData.group_name}
            onChange={handleChange}
            placeholder="Enter group name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter group description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          ></textarea>
        </div>

        {/* Enable
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enable
          </label>
          <div className="flex items-center space-x-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="enable"
                value="true"
                checked={formData.enable === true}
                onChange={() => handleEnableChange(true)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="enable"
                value="false"
                checked={formData.enable === false}
                onChange={() => handleEnableChange(false)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">No</span>
            </label>
          </div>
        </div> */}

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`text-white font-semibold px-6 py-2 rounded-lg flex items-center justify-center gap-2 ${loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              } transition-colors duration-300`}
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            Save Group
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddGroups;
