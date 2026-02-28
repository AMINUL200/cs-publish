import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TextEditor from "../../../components/common/TextEditor";

const HandleResearchAndServices = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    f_heading: "",
    f_heading_meta: "",
    desc: "",
    desc_meta: "",
    project_number: "",
    client_satisfaction: "",
    no_of_country: "",
    support: "",
    s_heading: "",
    s_heading_meta: "",
    s_desc: "",
    s_desc_meta: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [hasData, setHasData] = useState(false);

  // Fetch existing data
  useEffect(() => {
    fetchResearchData();
  }, []);

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/research-services`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = response.data.data;
      console.log(response);

      if (result.status && result.data) {
        setHasData(true);
        setFormData({
          f_heading: result.data.f_heading || "",
          f_heading_meta: result.data.f_heading_meta || "",
          desc: result.data.desc || "",
          desc_meta: result.data.desc_meta || "",
          project_number: result.data.project_number || "",
          client_satisfaction: result.data.client_satisfaction || "",
          no_of_country: result.data.no_of_country || "",
          support: result.data.support || "",
          s_heading: result.data.s_heading || "",
          s_heading_meta: result.data.s_heading_meta || "",
          s_desc: result.data.s_desc || "",
          s_desc_meta: result.data.s_desc_meta || "",
          is_active: result.data.is_active || true,
        });
      } else {
        setHasData(false);
        // Set default values for new entry
        setFormData({
          f_heading: "Comprehensive Research Solutions",
          f_heading_meta: "Professional research and analytics services",
          desc: "We provide advanced research solutions including data analysis, market research, and strategic planning.",
          desc_meta: "Research service description meta",
          project_number: "500+",
          client_satisfaction: "98%",
          no_of_country: "50+",
          support: "24/7 Dedicated Support",
          s_heading: "Why Choose Our Research Team",
          s_heading_meta: "Expert research specialists",
          s_desc:
            "Our research team consists of experienced analysts and industry experts delivering high-quality results.",
          s_desc_meta: "Second section description meta",
          is_active: true,
        });
      }
    } catch (err) {
      setError("Failed to fetch research data");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const url = hasData
        ? `${API_URL}api/admin/research-services/update` // Assuming ID is 1
        : `${API_URL}api/admin/research-services`;

      const method = hasData ? "post" : "post";

      const response = await axios({
        method: method,
        url: url,
        data: formData, // axios uses "data" instead of body
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = response.data;

      if (result.status) {
        setSuccess(
          hasData ? "Data updated successfully!" : "Data created successfully!",
        );
        setHasData(true);
      } else {
        setError(result.message || "Operation failed");
      }
    } catch (err) {
      setError("Failed to save data");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading research data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {hasData ? "Edit Research & Services" : "Create Research & Services"}
        </h1>
        <p className="text-gray-600 mt-2">
          {hasData
            ? "Update the existing research and services information"
            : "Add new research and services information"}
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
          <div className="text-red-700">{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4">
          <div className="text-green-700">{success}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* First Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            First Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Heading
              </label>
              <input
                type="text"
                name="f_heading"
                value={formData.f_heading}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Heading Meta
              </label>
              <input
                type="text"
                name="f_heading_meta"
                value={formData.f_heading_meta}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <div style={{ height: "600px" }}>
              <TextEditor
                apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                value={formData.desc}
                onChange={(content) =>
                  setFormData((prev) => ({
                    ...prev,
                    desc: content,
                  }))
                }
              />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description Meta
              </label>
              <textarea
                name="desc_meta"
                value={formData.desc_meta}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Number
              </label>
              <input
                type="text"
                name="project_number"
                value={formData.project_number}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Satisfaction
              </label>
              <input
                type="text"
                name="client_satisfaction"
                value={formData.client_satisfaction}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Countries
              </label>
              <input
                type="text"
                name="no_of_country"
                value={formData.no_of_country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Support
              </label>
              <input
                type="text"
                name="support"
                value={formData.support}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Second Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Second Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Heading
              </label>
              <input
                type="text"
                name="s_heading"
                value={formData.s_heading}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Heading Meta
              </label>
              <input
                type="text"
                name="s_heading_meta"
                value={formData.s_heading_meta}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Description
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Description Meta
              </label>
              <textarea
                name="s_desc_meta"
                value={formData.s_desc_meta}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
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
            Toggle to enable or disable this research and services section
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              submitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {submitting
              ? "Saving..."
              : hasData
                ? "Update Research & Services"
                : "Create Research & Services"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HandleResearchAndServices;
