import React, { useState } from "react";

const AddCategories = () => {
  // Dummy groups for select dropdown (replace with API later)
  const groupOptions = [
    { id: 1, name: "Developers" },
    { id: 2, name: "Designers" },
    { id: 3, name: "Marketing Team" },
  ];

  const [formData, setFormData] = useState({
    groupName: "",
    categoryName: "",
    description: "",
    enable: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEnableChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      enable: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted category:", formData);
    alert("Category added successfully (dummy)");
    // reset form
    setFormData({
      groupName: "",
      categoryName: "",
      description: "",
      enable: true,
    });
  };

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
            name="groupName"
            value={formData.groupName}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          >
            <option value="">Select a group</option>
            {groupOptions.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
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
            name="categoryName"
            value={formData.categoryName}
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
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          ></textarea>
        </div>

        {/* Enable */}
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
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Save Category
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategories;
