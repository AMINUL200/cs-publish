import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import TextEditor from "../../../components/common/TextEditor";
// import TextEditor from "./TextEditor"; // Adjust the import path as needed

const HandleCompanyPolicy = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { token } = useSelector((state) => state.auth);

  const [policyData, setPolicyData] = useState({
    id: null,
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch company policy data
  const fetchPolicyData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}api/policy-edit`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status && response.data.data) {
        setPolicyData({
          id: response.data.data.id,
          title: response.data.data.title || "",
          description: response.data.data.description || ""
        });
        toast.success("Company policy loaded successfully!");
      } else {
        toast.warning("No company policy data found");
      }
    } catch (error) {
      console.error("Error fetching company policy:", error);
      toast.error("Failed to load company policy");
    } finally {
      setLoading(false);
    }
  };

  // Save company policy data
  const savePolicyData = async () => {
    if (!policyData.description.trim()) {
      toast.error("Please enter policy content");
      return;
    }

    setSaving(true);
    try {
      let response;
      
      if (policyData.id) {
        // Update existing record
        response = await axios.post(
          `${API_URL}api/policy-update`,
          {
            title: policyData.title,
            description: policyData.description
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } else {
        // Create new record
        response = await axios.post(
          `${API_URL}api/policy-update`,
          {
            title: policyData.title,
            description: policyData.description
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      if (response.data.status) {
        setPolicyData(response.data.data.description);
        toast.success("Company policy saved successfully!");
      } else {
        toast.error("Failed to save company policy");
      }
    } catch (error) {
      console.error("Error saving company policy:", error);
      if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Error saving company policy");
      }
    } finally {
      setSaving(false);
    }
  };

  // Handle title change (optional, based on your API)
  const handleTitleChange = (e) => {
    setPolicyData(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  // Handle description change from text editor
  const handleDescriptionChange = (content) => {
    setPolicyData(prev => ({
      ...prev,
      description: content
    }));
  };

  // Reset form
  const handleReset = () => {
    setPolicyData({
      id: null,
      title: "",
      description: ""
    });
  };

  // Load data on component mount
  useEffect(() => {
    if (token) {
      fetchPolicyData();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading company policy...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Company Policy</h1>
      
      {/* Optional Title Input - Remove if not needed */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Policy Title (Optional)
        </label>
        <input
          type="text"
          id="title"
          value={policyData.title}
          onChange={handleTitleChange}
          placeholder="Enter company policy title (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Description Text Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Policy Content *
        </label>
        <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: "500px" }}>
          <TextEditor
            apiKey={apikey}
            value={policyData.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Enter the complete company policy content. This field is required.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={savePolicyData}
          disabled={saving }
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? "Saving..." : "Save Company Policy"}
        </button>
        
        <button
          onClick={fetchPolicyData}
          disabled={loading}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Reload
        </button>

        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
        >
          Clear
        </button>
      </div>

      
     
    </div>
  );
};

export default HandleCompanyPolicy;