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
  const [supplementaryFile, setSupplementaryFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [figureFiles, setFigureFiles] = useState([]);
  const [figurePreviews, setFigurePreviews] = useState([]);

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

  // ✅ Handle cover image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ✅ Remove cover image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // ✅ Handle supplementary file change
  const handleSupplementaryFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSupplementaryFile(file);
  };

  // ✅ Remove supplementary file
  const removeSupplementaryFile = () => {
    setSupplementaryFile(null);
  };

  // ✅ Handle PDF file change
  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    setPdfFile(file);
  };

  // ✅ Remove PDF file
  const removePdf = () => {
    setPdfFile(null);
  };

  // ✅ Handle figures (multiple images) change
  const handleFiguresChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setFigureFiles(prev => [...prev, ...files]);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setFigurePreviews(prev => [...prev, ...newPreviews]);
  };

  // ✅ Remove individual figure
  const removeFigure = (index) => {
    setFigureFiles(prev => prev.filter((_, i) => i !== index));
    setFigurePreviews(prev => prev.filter((_, i) => i !== index));
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
      formData.append("materials_and_methods", manuscriptData.materials_and_methods);
      formData.append("results", manuscriptData.results);
      formData.append("discussion", manuscriptData.discussion);
      formData.append("conclusion", manuscriptData.conclusion);
      formData.append("author_contributions", manuscriptData.author_contributions);
      formData.append("conflict_of_interest_statement", manuscriptData.conflict_of_interest_statement);
      formData.append("references", manuscriptData.references);

      // ✅ Add cover image if uploaded
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // ✅ Add supplementary file if uploaded
      if (supplementaryFile) {
        formData.append("supplementary_file", supplementaryFile);
      }

      // ✅ Add PDF file if uploaded
      if (pdfFile) {
        formData.append("pdf", pdfFile);
      }

      // ✅ Add figures if uploaded (multiple images)
      figureFiles.forEach((file, index) => {
        formData.append(`figures[${index}]`, file);
      });

      const response = await axios.post(`${API_URL}api/published-manuscripts`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log(response);
      
      if(response.status === 200 || response.status === 201 || response.data.status || response.data.status === 200){
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
            className="block w-full text-sm p-4 text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {imagePreview && (
            <div className="mt-4 relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-48 h-48 object-cover rounded-lg border border-gray-200 shadow-sm"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* ✅ PDF Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload PDF Document
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePdfChange}
            className="block w-full p-4 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {pdfFile && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">{pdfFile.name}</p>
                  <p className="text-xs text-gray-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removePdf}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* ✅ Supplementary File Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Supplementary File
          </label>
          <input
            type="file"
            onChange={handleSupplementaryFileChange}
            className="block w-full p-4 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          {supplementaryFile && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">{supplementaryFile.name}</p>
                  <p className="text-xs text-gray-500">{(supplementaryFile.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeSupplementaryFile}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* ✅ Figures Upload Section (Multiple Images) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Figures (Multiple Images)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFiguresChange}
            className="block w-full p-4 text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          
          {/* Figures Preview */}
          {figurePreviews.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Figures Preview ({figurePreviews.length}):</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {figurePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Figure ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeFigure(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                    >
                      ×
                    </button>
                    <div className="text-xs text-gray-500 mt-1 text-center">
                      Figure {index + 1}
                    </div>
                  </div>
                ))}
              </div>
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