import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import TextEditor from "../../components/common/TextEditor";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const PublisherDesignManuscript = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { id } = useParams();
    const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
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
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file)); // for instant preview
  };

  // ✅ Handle Save (send complete body)
  const handleSave = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("manuscript_id", id);
      formData.append("title", manuscriptData.title);
      formData.append("abstract", manuscriptData.abstract);
      formData.append("introduction", manuscriptData.introduction);
      formData.append(
        "materials_and_methods",
        manuscriptData.materials_and_methods
      );
      formData.append("results", manuscriptData.results);
      formData.append("discussion", manuscriptData.discussion);
      formData.append("conclusion", manuscriptData.conclusion);
      formData.append("author_contributions", manuscriptData.author_contributions);
      formData.append(
        "conflict_of_interest_statement",
        manuscriptData.conflict_of_interest_statement
      );
      formData.append("references", manuscriptData.references);

      // ✅ Add image if uploaded
      if (imageFile) {
        formData.append("image", imageFile);
      }

     const response = await axios.post(`${API_URL}api/published-manuscripts`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      
      if(response.status === 200){
        toast.success("Manuscript updated successfully!");
      }else{
        toast.error("Failed to update manuscript!");
      }

      
    } catch (error) {
      console.error(error);
      toast.error("Failed to save manuscript!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

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
              <p className="text-gray-600">ID: {id}</p>
            </div>
          </div>
        </div>

        {/* ✅ Image Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Manuscript Image (Cover)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Text Editor Sections */}
        <div className="space-y-10">
          {[
            { key: "title", label: "Title" },
            { key: "abstract", label: "Abstract" },
            { key: "introduction", label: "Introduction" },
            { key: "materials_and_methods", label: "Materials and Methods" },
            { key: "results", label: "Results" },
            { key: "discussion", label: "Discussion" },
            { key: "conclusion", label: "Conclusion" },
            { key: "author_contributions", label: "Author Contributions" },
            {
              key: "conflict_of_interest_statement",
              label: "Conflict of Interest Statement",
            },
            { key: "references", label: "References" },
          ].map((section) => (
            <div
              key={section.key}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="border-b px-6 py-3 bg-gray-50 font-semibold text-gray-800">
                {section.label}
              </div>
              <div className="h-[800px] p-4">
                <TextEditor
                  apiKey={apikey}
                  value={manuscriptData[section.key]}
                  onChange={(content) => handleEditorChange(section.key, content)}
                  height={400}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Footer Buttons */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 mt-6 rounded-lg">
          <div className="flex items-center space-x-4">
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
                  <span>Published Manuscript</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherDesignManuscript;
