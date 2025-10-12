import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import TextEditor from "../../components/common/TextEditor";

const PublisherDesignManuscript = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const [loading, setLoading] = useState(true);
  const [manuscriptData, setManuscriptData] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/t-manuscript`);

      if (response.data.status === 200) {
        setManuscriptData(response.data.data);
        setEditorContent(response.data.data.name);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare the data for API call
      const updateData = {
        name: editorContent,
        // Add other fields if needed for your API
        // id: manuscriptData.id, // if required by your API
        // updated_at: new Date().toISOString()
      };

      // Make API call to update the manuscript
      const response = await axios.post(
        `${API_URL}api/t-manuscript/`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        // Update local state with the response data
        setManuscriptData((prev) => ({
          ...prev,
          ...response.data.data, // Use the updated data from server
          name: editorContent,
          updated_at: new Date().toISOString(),
        }));

        toast.success("Manuscript updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update manuscript");
      }
    } catch (error) {
      console.error("Save error:", error);

      // Handle different error types
      if (error.response) {
        // Server responded with error status
        toast.error(
          error.response.data?.message || "Failed to update manuscript"
        );
      } else if (error.request) {
        // Request was made but no response received
        toast.error("Network error. Please check your connection.");
      } else {
        // Something else happened
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!manuscriptData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No Manuscript Found
          </h2>
          <p className="text-gray-500">Unable to load manuscript data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Manuscript Designer
              </h1>
              <p className="text-gray-600">
                ID: {manuscriptData.id} | Created:{" "}
                {new Date(manuscriptData.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 font-medium"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>Update Manuscript</span>
                    </>
                  )}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  📥 Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Text Editor Area */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-[800px]">
            <TextEditor
              apiKey={apikey}
              value={editorContent}
              onChange={handleEditorChange}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 mt-6 rounded-lg">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              Last updated:{" "}
              {new Date(manuscriptData.updated_at).toLocaleString()}
            </span>
            <span>Manuscript Designer v1.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherDesignManuscript;
