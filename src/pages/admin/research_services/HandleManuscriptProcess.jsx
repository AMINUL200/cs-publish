import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import TextEditor from "../../../components/common/TextEditor";

const HandleManuscriptProcess = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);

  // State for list data
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // State for form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Initial form state
  const initialFormState = {
    stage: "",
    title: "",
    description: "",
    is_active: true,
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch all manuscript processes on component mount
  useEffect(() => {
    fetchProcesses();
  }, []);

  // Fetch all manuscript processes
  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/admin/manuscript-processes`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
             "Cache-Control": "no-cache",
          Pragma: "no-cache",
          },
        },
      );

      if (response.data.success) {
        setProcesses(response.data.data);
      }
    } catch (err) {
      setError("Failed to fetch manuscript processes");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      stage: item.stage || "",
      title: item.title || "",
      description: item.description || "",
      is_active: item.is_active || true,
    });
    setShowForm(true);
    setError(null);
    // Scroll to form
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
        stage: formData.stage,
        title: formData.title,
        description: formData.description,
        is_active: formData.is_active,
      };

      let response;
      if (editingId) {
        // Update existing record
        response = await axios.put(
          `${API_URL}api/admin/manuscript-processes/${editingId}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
      } else {
        // Create new record
        response = await axios.post(
          `${API_URL}api/admin/manuscript-processes`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
      }

      if (response.data.success) {
        setSuccess(
          editingId
            ? "Manuscript process updated successfully!"
            : "Manuscript process created successfully!",
        );
        await fetchProcesses(); // Refresh the list
        resetForm(); // Reset form and hide it

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save manuscript process",
      );
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this manuscript process?",
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}api/admin/manuscript-processes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        setSuccess("Manuscript process deleted successfully!");
        await fetchProcesses(); // Refresh the list
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError("Failed to delete manuscript process");
      console.error("Delete error:", err);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (item) => {
    try {
      const response = await axios.put(
        `${API_URL}api/admin/manuscript-process/toggle-status/${item.id}`,
        { is_active: !item.is_active },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.data.success) {
        setSuccess("Status updated successfully!");
        await fetchProcesses(); // Refresh the list
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
            Manuscript Process
          </h1>
          <p className="text-gray-600 mt-2">
            Manage manuscript review and editorial process stages
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          + Add New Process
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
              ? "Edit Manuscript Process"
              : "Add New Manuscript Process"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="stage"
                  value={formData.stage}
                  onChange={handleInputChange}
                  placeholder="e.g., 01, 02, 03"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter stage number (e.g., 01, 02, 03)
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Editorial Accept Manuscript"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                 <div style={{ height: "600px" }}>
                <TextEditor
                  key={editingId || "new"} // VERY IMPORTANT for edit mode
                  apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                  value={formData.description}
                  onChange={(content) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: content,
                    }))
                  }
                />
                </div>
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
                <p className="mt-1 text-sm text-gray-500">
                  Toggle to enable or disable this manuscript process stage
                </p>
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
            Manuscript Process List
          </h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-600">Loading manuscript processes...</div>
          </div>
        ) : processes.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-600">No manuscript processes found.</div>
            <button
              onClick={handleAddNew}
              className="mt-4 px-4 py-2 text-blue-600 hover:text-blue-800"
            >
              Add your first manuscript process
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
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processes.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                        Stage {item.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="font-medium">{item.title}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate">{item.description}</div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
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
    </div>
  );
};

export default HandleManuscriptProcess;
