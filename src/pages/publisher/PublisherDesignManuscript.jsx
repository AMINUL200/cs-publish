import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import TextEditor from "../../components/common/TextEditor";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Zap, Plus, X, FileText, File, Image, Upload } from "lucide-react";

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
  const [quickPress, setQuickPress] = useState("0");

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
    keywords: [],
  });

  const [cites, setCites] = useState([
    { cite_name: "AMA", cite_address: "" },
    { cite_name: "APA", cite_address: "" },
    { cite_name: "MLA", cite_address: "" },
    { cite_name: "NLM", cite_address: "" }
  ]);

  // ✅ Handle text editor changes
  const handleEditorChange = (field, content) => {
    setManuscriptData((prev) => ({
      ...prev,
      [field]: content,
    }));
  };

  // ✅ Handle keywords changes
  const handleKeywordsChange = (e) => {
    const inputValue = e.target.value;
    const keywordsArray = inputValue.split(',').map(keyword => keyword.trim()).filter(keyword => keyword);
    setManuscriptData(prev => ({
      ...prev,
      keywords: keywordsArray
    }));
  };

  // ✅ Handle cite changes
  const handleCiteChange = (index, field, value) => {
    const updatedCites = cites.map((cite, i) => 
      i === index ? { ...cite, [field]: value } : cite
    );
    setCites(updatedCites);
  };

  // ✅ Handle cover image file change
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

  // ✅ Handle Quick Press toggle
  const handleQuickPressChange = (e) => {
    setQuickPress(e.target.checked ? "1" : "0");
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
      formData.append("quick_press", quickPress);

      // ✅ Add keywords as array
      if (manuscriptData.keywords && manuscriptData.keywords.length > 0) {
        manuscriptData.keywords.forEach((keyword, index) => {
          formData.append(`keywords[${index}]`, keyword);
        });
      }

      // ✅ Add cites as array
      cites.forEach((cite, index) => {
        formData.append(`cites[${index}][cite_name]`, cite.cite_name);
        formData.append(`cites[${index}][cite_address]`, cite.cite_address);
      });

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

      // Log form data for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`${API_URL}api/published-manuscripts`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log(response);
      
      if(response.status === 200 || response.status === 201 || response.data.status || response.data.status === 200){
        toast.success("Manuscript published successfully!");
      } else {
        toast.error("Failed to publish manuscript!");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to publish manuscript!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Manuscript Designer
              </h1>
              <p className="text-gray-600">ID: {id}</p>
            </div>
          </div>
        </div>

        {/* ✅ Quick Press Toggle Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Quick Press Feature</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enable to feature this manuscript prominently in the Quick Press section for immediate visibility
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={quickPress === "1"}
                onChange={handleQuickPressChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {quickPress === "1" ? "Enabled" : "Disabled"}
              </span>
            </label>
          </div>
          {quickPress === "1" && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-yellow-100 rounded">
                  <Zap className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="text-sm text-yellow-800">
                  <strong>Quick Press Active:</strong> This manuscript will be featured prominently in the Quick Press section and get immediate visibility across the platform.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Keywords Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Keywords</h3>
              <p className="text-sm text-gray-500">Enter keywords separated by commas</p>
            </div>
          </div>
          <input
            type="text"
            value={manuscriptData.keywords?.join(', ') || ''}
            onChange={handleKeywordsChange}
            placeholder="e.g., quantum, biology, research, physics"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {manuscriptData.keywords && manuscriptData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {manuscriptData.keywords.map((keyword, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Citation Styles Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Citation Styles</h3>
              <p className="text-sm text-gray-600">Manage different citation formats for this manuscript</p>
            </div>
          </div>

          <div className="space-y-4">
            {cites.map((cite, index) => (
              <div key={cite.cite_name} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full text-sm border">
                    {cite.cite_name} Format
                  </span>
                </div>
                <textarea
                  value={cite.cite_address}
                  onChange={(e) => handleCiteChange(index, 'cite_address', e.target.value)}
                  placeholder={`Enter ${cite.cite_name} citation format...`}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-vertical"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-purple-100 rounded">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-purple-800">
                <strong>Citation Formats:</strong> Provide complete citation information in AMA, APA, MLA, and NLM formats. This helps readers cite your work correctly in different academic contexts.
              </div>
            </div>
          </div>
        </div>

        {/* ✅ File Upload Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Cover Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Image className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Cover Image</h3>
                <p className="text-sm text-gray-500">JPG, PNG, WebP • Max 5MB</p>
              </div>
            </div>
            
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="cover-image"
            />
            <label
              htmlFor="cover-image"
              className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-400 transition-colors mb-4"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">Click to upload cover image</span>
            </label>
            
            {imagePreview && (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 right-2">
                  <button
                    onClick={removeImage}
                    className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* PDF Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">PDF Document</h3>
                <p className="text-sm text-gray-500">Upload manuscript PDF</p>
              </div>
            </div>
            
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              className="hidden"
              id="pdf-file"
            />
            <label
              htmlFor="pdf-file"
              className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-red-400 transition-colors mb-4"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">Upload PDF document</span>
            </label>
            
            {pdfFile && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{pdfFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removePdf}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove PDF"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Supplementary File */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <File className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Supplementary File</h3>
                <p className="text-sm text-gray-500">Additional documents</p>
              </div>
            </div>
            
            <input
              type="file"
              onChange={handleSupplementaryFileChange}
              className="hidden"
              id="supplementary-file"
            />
            <label
              htmlFor="supplementary-file"
              className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-green-400 transition-colors mb-4"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">Upload supplementary file</span>
            </label>
            
            {supplementaryFile && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <File className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{supplementaryFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(supplementaryFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={removeSupplementaryFile}
                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  title="Remove File"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Figures Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Image className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Figures</h3>
                <p className="text-sm text-gray-500">Multiple images allowed</p>
              </div>
            </div>
            
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFiguresChange}
              className="hidden"
              id="figures"
            />
            <label
              htmlFor="figures"
              className="block w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-purple-400 transition-colors mb-4"
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <span className="text-sm text-gray-600">Upload multiple figures</span>
            </label>
            
            {figurePreviews.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Figures ({figurePreviews.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {figurePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Figure ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeFigure(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <div className="text-xs text-gray-500 text-center mt-1">
                        Figure {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text Editor Sections */}
        <div className="space-y-8">
          {[
            { key: "title", label: "Title", description: "Main title of the manuscript", icon: "📝" },
            { key: "abstract", label: "Abstract", description: "Brief summary of the research", icon: "📄" },
            { key: "introduction", label: "Introduction", description: "Background and context", icon: "🔍" },
            { key: "materials_and_methods", label: "Materials and Methods", description: "Research methodology", icon: "🧪" },
            { key: "results", label: "Results", description: "Findings and data", icon: "📊" },
            { key: "discussion", label: "Discussion", description: "Interpretation of results", icon: "💬" },
            { key: "conclusion", label: "Conclusion", description: "Summary and final thoughts", icon: "🎯" },
            { key: "author_contributions", label: "Author Contributions", description: "Contributions of each author", icon: "👥" },
            { key: "conflict_of_interest_statement", label: "Conflict of Interest", description: "Declaration of conflicts", icon: "⚖️" },
            { key: "references", label: "References", description: "Citations and bibliography", icon: "📚" },
          ].map((section) => (
            <div
              key={section.key}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="border-b border-gray-200 px-6 py-4 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{section.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{section.label}</h3>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              </div>
              <div className="h-[500px] p-6">
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Quick Press:</span>
                <span className={`font-semibold ${quickPress === "1" ? "text-yellow-600" : "text-gray-500"}`}>
                  {quickPress === "1" ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="mt-1">Review all content before publishing the manuscript</div>
            </div>
            <button
              onClick={handleSave}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg flex items-center gap-2 font-medium"
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>📤</span>
                  <span>Publish Manuscript</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <strong>Important:</strong> Ensure all sections are properly filled before publishing. Once published, the manuscript will be publicly available. You can edit it later if needed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherDesignManuscript;