import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import TextEditor from "../../components/common/TextEditor";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PublisherEditDesignManuscript = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [manuscriptData, setManuscriptData] = useState({
    title: "",
    abstract: "",
    introduction: "",
    materials_and_methods: "",
    results: "",
    discussion: "",
    conclusion: "",
    author_contributions: "",
    conflict_of_interest_statement: "",
    references: "",
  });

  // ✅ Fetch manuscript data on component mount
  const fetchManuscriptData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/published-manuscripts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Fetched manuscript data:", response.data);

      if (response.data.status && response.data.data) {
        const data = response.data.data;
        
        // Set manuscript data from API response
        setManuscriptData({
          title: data.title || "",
          abstract: data.abstract || "",
          introduction: data.introduction || "",
          materials_and_methods: data.materials_and_methods || "",
          results: data.results || "",
          discussion: data.discussion || "",
          conclusion: data.conclusion || "",
          author_contributions: data.author_contributions || "",
          conflict_of_interest_statement: data.conflict_of_interest_statement || "",
          references: data.references || "",
        });

        // Set image preview if image exists
        if (data.image) {
          setImagePreview(data.image);
        }

        toast.success("Manuscript data loaded successfully!");
      } else {
        throw new Error(response.data.message || "Failed to fetch manuscript data");
      }
    } catch (error) {
      console.error("Error fetching manuscript:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch manuscript data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManuscriptData();
  }, [id]);

  // ✅ Handle text editor changes
  const handleEditorChange = (field, content) => {
    setManuscriptData((prev) => ({
      ...prev,
      [field]: content,
    }));
  };

  // ✅ Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // for instant preview
  };

  // ✅ Handle Save (update manuscript)
  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("manuscript_id", id);
      formData.append("title", manuscriptData.title);
      formData.append("abstract", manuscriptData.abstract);
      formData.append("introduction", manuscriptData.introduction);
      formData.append("materials_and_methods", manuscriptData.materials_and_methods);
      formData.append("results", manuscriptData.results);
      formData.append("discussion", manuscriptData.discussion);
      formData.append("conclusion", manuscriptData.conclusion);
      formData.append("author_contributions", manuscriptData.author_contributions);
      formData.append("conflict_of_interest_statement", manuscriptData.conflict_of_interest_statement);
      formData.append("references", manuscriptData.references);

      // ✅ Add image if uploaded
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // Use PUT or PATCH for update, depending on your API
      const response = await axios.post(`${API_URL}api/published-manuscripts/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Update response:", response);

      if (response.data.status) {
        toast.success("Manuscript updated successfully!");
        // Optionally navigate back or refresh data
        navigate(-1);
        // fetchManuscriptData(); // Refresh data
      } else {
        toast.error(response.data.message || "Failed to update manuscript!");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update manuscript!");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Handle Cancel
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Edit Manuscript Design
              </h1>
              <p className="text-gray-600">Editing Manuscript ID: {id}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Published
                </span>
                <span className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </div>

        {/* ✅ Image Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Manuscript Cover Image
          </label>
          <p className="text-sm text-gray-500 mb-4">
            Upload a new image or keep the existing one. Supported formats: JPG, PNG, WebP. Max size: 5MB
          </p>
          
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none mb-4"
          />
          
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="flex items-center gap-4">
                <img
                  src={imagePreview}
                  alt="Manuscript cover preview"
                  className="w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
                <div className="text-sm text-gray-600">
                  <p>Current cover image preview</p>
                  <p className="text-xs text-gray-500 mt-1">
                    The image will be updated when you save changes
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Editor Sections */}
        <div className="space-y-10">
          {[
            { key: "title", label: "Title", description: "Main title of the manuscript" },
            { key: "abstract", label: "Abstract", description: "Brief summary of the research" },
            { key: "introduction", label: "Introduction", description: "Background and context of the study" },
            { key: "materials_and_methods", label: "Materials and Methods", description: "Research methodology and materials used" },
            { key: "results", label: "Results", description: "Findings and data from the research" },
            { key: "discussion", label: "Discussion", description: "Interpretation and analysis of results" },
            { key: "conclusion", label: "Conclusion", description: "Summary and final thoughts" },
            { key: "author_contributions", label: "Author Contributions", description: "Contributions of each author" },
            {
              key: "conflict_of_interest_statement",
              label: "Conflict of Interest Statement",
              description: "Declaration of any conflicts of interest"
            },
            { key: "references", label: "References", description: "Citations and bibliography" },
          ].map((section) => (
            <div
              key={section.key}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="border-b px-6 py-4 bg-gray-50">
                <h3 className="font-semibold text-gray-800 text-lg">{section.label}</h3>
                <p className="text-sm text-gray-600 mt-1">{section.description}</p>
              </div>
              <div className="h-[600px] p-4">
                <TextEditor
                  apiKey={apikey}
                  value={manuscriptData[section.key]}
                  onChange={(content) => handleEditorChange(section.key, content)}
                  height={500}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="bg-white px-8 py-6 border-t border-gray-200 mt-8 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Make your changes and save to update the manuscript
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 font-medium"
                disabled={saving}
              >
                <span>Cancel</span>
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-medium"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Update Manuscript</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="text-sm text-yellow-800">
              <strong>Note:</strong> All changes will be applied immediately after saving. Make sure to review your edits before updating the manuscript.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherEditDesignManuscript;