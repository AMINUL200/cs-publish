import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import TextEditor from "../../components/common/TextEditor";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Save, Upload, X, FileText, Image, File, Eye, Download, Zap, Plus, Trash2 } from "lucide-react";

const PublisherEditDesignManuscript = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [supplementaryFile, setSupplementaryFile] = useState(null);
  const [supplementaryPreview, setSupplementaryPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
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
          keywords: data.keywords || [],
        });

        // Set quick_press from API response
        if (data.quick_press !== undefined) {
          setQuickPress(data.quick_press.toString());
        }

        // Set cites data if exists
        if (data.cites && Array.isArray(data.cites)) {
          // Create default cites structure
          const defaultCites = [
            { cite_name: "AMA", cite_address: "" },
            { cite_name: "APA", cite_address: "" },
            { cite_name: "MLA", cite_address: "" },
            { cite_name: "NLM", cite_address: "" }
          ];

          // Merge with existing cites data
          const mergedCites = defaultCites.map(defaultCite => {
            const existingCite = data.cites.find(cite => cite.cite_name === defaultCite.cite_name);
            return existingCite ? { ...defaultCite, cite_address: existingCite.cite_address } : defaultCite;
          });

          setCites(mergedCites);
        }

        // Set image preview if image exists
        if (data.image) {
          setImagePreview(`${STORAGE_URL}${data.image}`);
        }

        // Set PDF preview if PDF exists
        if (data.pdf) {
          setPdfPreview(`${STORAGE_URL}${data.pdf}`);
        }

        // Set supplementary file preview if exists
        if (data.supplementary_file) {
          setSupplementaryPreview(`${STORAGE_URL}${data.supplementary_file}`);
        }

        // Set figures preview if figures exist
        if (data.figures) {
          try {
            const figuresArray = typeof data.figures === 'string' 
              ? JSON.parse(data.figures) 
              : data.figures;
            
            if (Array.isArray(figuresArray) && figuresArray.length > 0) {
              setFigurePreviews(figuresArray.map(fig => `${STORAGE_URL}${fig}`));
            }
          } catch (error) {
            console.error("Error parsing figures:", error);
            if (Array.isArray(data.figures)) {
              setFigurePreviews(data.figures.map(fig => `${STORAGE_URL}${fig}`));
            }
          }
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

  // ✅ Handle cite changes
  const handleCiteChange = (index, field, value) => {
    const updatedCites = cites.map((cite, i) => 
      i === index ? { ...cite, [field]: value } : cite
    );
    setCites(updatedCites);
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

  // ✅ Handle image file change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error("Please select a valid image file");
      return;
    }

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
    setSupplementaryPreview(URL.createObjectURL(file));
  };

  // ✅ Remove supplementary file
  const removeSupplementaryFile = () => {
    setSupplementaryFile(null);
    setSupplementaryPreview(null);
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
    setPdfPreview(URL.createObjectURL(file));
  };

  // ✅ Remove PDF file
  const removePdf = () => {
    setPdfFile(null);
    setPdfPreview(null);
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

  // ✅ Handle file preview (open in new tab)
  const handlePreviewFile = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
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
      formData.append("quick_press", quickPress);
      
      // ✅ Add keywords as array (append each keyword individually)
      if (manuscriptData.keywords && manuscriptData.keywords.length > 0) {
        manuscriptData.keywords.forEach((keyword, index) => {
          formData.append(`keywords[${index}]`, keyword);
        });
      }

      // ✅ Add cites as array (append each cite individually)
      cites.forEach((cite, index) => {
        formData.append(`cites[${index}][cite_name]`, cite.cite_name);
        formData.append(`cites[${index}][cite_address]`, cite.cite_address);
      });

      // ✅ Add files if uploaded
      if (imageFile) formData.append("image", imageFile);
      if (supplementaryFile) formData.append("supplementary_file", supplementaryFile);
      if (pdfFile) formData.append("pdf", pdfFile);
      
      figureFiles.forEach((file, index) => {
        formData.append(`figures[${index}]`, file);
      });

      // Log form data for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`${API_URL}api/published-manuscripts/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      console.log("Update response:", response);

      if (response.data.status) {
        toast.success("Manuscript updated successfully!");
        navigate(-1);
      } else {
        toast.error(response.data.message || "Failed to update manuscript!");
      }
    } catch (error) {
      console.error("Update error:", error);
      console.error("Error details:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update manuscript!");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Alternative save method if the above doesn't work
  const handleSaveAlternative = async () => {
    try {
      setSaving(true);

      // Create a plain object instead of FormData
      const payload = {
        manuscript_id: id,
        title: manuscriptData.title,
        abstract: manuscriptData.abstract,
        introduction: manuscriptData.introduction,
        materials_and_methods: manuscriptData.materials_and_methods,
        results: manuscriptData.results,
        discussion: manuscriptData.discussion,
        conclusion: manuscriptData.conclusion,
        author_contributions: manuscriptData.author_contributions,
        conflict_of_interest_statement: manuscriptData.conflict_of_interest_statement,
        references: manuscriptData.references,
        quick_press: quickPress,
        keywords: manuscriptData.keywords,
        cites: cites
      };

      console.log("Payload:", payload);

      const response = await axios.post(`${API_URL}api/published-manuscripts/${id}`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        toast.success("Manuscript updated successfully!");
        navigate(-1);
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
    navigate(-1);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Edit Manuscript Design
                </h1>
                <p className="text-gray-600 mt-1">Editing Manuscript ID: {id}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Published
                  </span>
                  <span className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Press Toggle Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
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

        {/* Keywords Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
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

        {/* Citation Styles Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
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

        {/* File Upload Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
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
              <span className="text-sm text-gray-600">Click to upload new cover image</span>
            </label>
            
            {imagePreview && (
              <div className="relative group">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => handlePreviewFile(imagePreview)}
                    className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={removeImage}
                    className="bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
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
            
            {(pdfFile || pdfPreview) && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <FileText className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {pdfFile ? pdfFile.name : "Current PDF Document"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {pdfFile ? `${(pdfFile.size / 1024 / 1024).toFixed(2)} MB` : "Click to preview"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {pdfPreview && (
                    <button
                      onClick={() => handlePreviewFile(pdfPreview)}
                      className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                      title="Preview PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={removePdf}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove PDF"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
            
            {(supplementaryFile || supplementaryPreview) && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <File className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {supplementaryFile ? supplementaryFile.name : "Current Supplementary File"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {supplementaryFile ? `${(supplementaryFile.size / 1024).toFixed(2)} KB` : "Click to preview"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {supplementaryPreview && (
                    <button
                      onClick={() => handlePreviewFile(supplementaryPreview)}
                      className="p-1 text-blue-500 hover:text-blue-700 transition-colors"
                      title="Preview File"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={removeSupplementaryFile}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    title="Remove File"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
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
                      <div className="absolute top-1 right-1 flex gap-1">
                        <button
                          onClick={() => handlePreviewFile(preview)}
                          className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-blue-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => removeFigure(index)}
                          className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
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

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>Quick Press:</span>
                <span className={`font-semibold ${quickPress === "1" ? "text-yellow-600" : "text-gray-500"}`}>
                  {quickPress === "1" ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="mt-1">Review all changes before updating the manuscript</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2 font-medium"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Manuscript</span>
                  </>
                )}
              </button>
            </div>
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
              <strong>Pro Tip:</strong> Click the eye icon to preview existing files. Upload new files to replace existing ones. All changes are saved immediately when you click "Update Manuscript".
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherEditDesignManuscript;