import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import TextEditor from "../../../components/common/TextEditor";

const HandlePaymentPolicy = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  // Fetch payment policy
  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/payment-policy-edit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setPolicy(response.data.data);
        setFormData({
          title: response.data.data.title || "",
          description: response.data.data.description || "",
        });
        toast.success("Payment policy loaded successfully!");
      }
    } catch (error) {
      console.error("Error fetching payment policy:", error);
      if (error.response?.status === 404) {
        // Policy doesn't exist yet, this is fine for first-time setup
        toast.info("No existing policy found. You can create a new one.");
      } else {
        toast.error("Failed to load payment policy");
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit/Update payment policy
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a policy title");
      return;
    }

    if (
      !formData.description.trim() ||
      formData.description === "<p><br></p>"
    ) {
      toast.error("Please enter policy description");
      return;
    }

    try {
      setSaving(true);
      const response = await axios.post(
        `${API_URL}api/payment-policy-update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        setPolicy(response.data.data);
        toast.success("Payment policy updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update policy");
      }
    } catch (error) {
      console.error("Error updating payment policy:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to update payment policy";
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      description: content,
    }));
  };

  // Fetch policy on component mount
  useEffect(() => {
    fetchPolicy();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Payment Policy Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your payment policy terms and conditions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Policy Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter policy title"
            required
          />
        </div>

        {/* Description Text Editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Policy Content *
          </label>
          <div
            className="border border-gray-300 rounded-md overflow-hidden"
            style={{ height: "500px" }}
          >
            <TextEditor
              apiKey={apikey}
              value={formData.description}
              onChange={handleDescriptionChange}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Enter the complete company policy content. This field is required.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            {saving ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Updating...
              </>
            ) : policy ? (
              "Update Policy"
            ) : (
              "Create Policy"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HandlePaymentPolicy;
