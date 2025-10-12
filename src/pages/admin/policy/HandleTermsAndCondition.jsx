import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import TextEditor from "../../../components/common/TextEditor";
import { useSelector } from "react-redux";
// import TextEditor from "./TextEditor"; // Adjust the import path as needed

const HandleTermsAndCondition = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { token } = useSelector((state) => state.auth);

  const [termsData, setTermsData] = useState({
    id: null,
    title: "",
    description: ""
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch terms and conditions data
  const fetchTermsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}api/terms-edit`,{
        headers:{
            Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.status ) {
        setTermsData(response.data.data);
        toast.success("Terms & conditions loaded successfully!");
      } else {
        toast.warning("No terms & conditions data found");
      }
    } catch (error) {
      console.error("Error fetching terms data:", error);
      toast.error("Failed to load terms & conditions");
    } finally {
      setLoading(false);
    }
  };

  // Save terms and conditions data
  const saveTermsData = async () => {
    if (!termsData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!termsData.description.trim()) {
      toast.error("Please enter description content");
      return;
    }

    setSaving(true);
    try {
      let response;
      
      if (termsData.id) {
        // Update existing record
        response = await axios.post(
          `${API_URL}api/terms-update`,
          {
            title: termsData.title,
            description: termsData.description
          },{
            headers:{
                Authorization: `Bearer ${token}`
            }
          }
        );
      } else {
        // Create new record
        response = await axios.post(
          `${API_URL}/terms-and-conditions`,
          {
            title: termsData.title,
            description: termsData.description
          }
        );
      }

      if (response.data.status) {
        setTermsData(prev => ({
          ...prev,
          id: response.data.data.id
        }));
        toast.success("Terms & conditions saved successfully!");
      } else {
        toast.error("Failed to save terms & conditions");
      }
    } catch (error) {
      console.error("Error saving terms data:", error);
      toast.error("Error saving terms & conditions");
    } finally {
      setSaving(false);
    }
  };

  // Handle title change
  const handleTitleChange = (e) => {
    setTermsData(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  // Handle description change from text editor
  const handleDescriptionChange = (content) => {
    setTermsData(prev => ({
      ...prev,
      description: content
    }));
  };

  // Load data on component mount
  useEffect(() => {
    fetchTermsData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading terms & conditions...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Terms & Conditions</h1>
      
      {/* Title Input */}
      <div className="mb-6">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={termsData.title}
          onChange={handleTitleChange}
          placeholder="Enter terms & conditions title"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Description Text Editor */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <div className="border border-gray-300 rounded-md overflow-hidden" style={{ height: "500px" }}>
          <TextEditor
            apiKey={apikey}
            value={termsData.description}
            onChange={handleDescriptionChange}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={saveTermsData}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : "Save Terms & Conditions"}
        </button>
        
        <button
          onClick={fetchTermsData}
          disabled={loading}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reload
        </button>
      </div>

     
    </div>
  );
};

export default HandleTermsAndCondition;