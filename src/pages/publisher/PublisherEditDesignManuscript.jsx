import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import TextEditor from "../../components/common/TextEditor";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Save, Upload, X, FileText, Image, File, Eye, Download } from "lucide-react";

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
  const [supplementaryFile, setSupplementaryFile] = useState(null);
  const [supplementaryPreview, setSupplementaryPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
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

        // Set PDF preview if PDF exists
        if (data.pdf) {
          setPdfPreview(data.pdf);
        }

        // Set supplementary file preview if exists
        if (data.supplementary_file) {
          setSupplementaryPreview(data.supplementary_file);
        }

        // Set figures preview if figures exist
        if (data.figures) {
          try {
            // Parse the figures string if it's a JSON string
            const figuresArray = typeof data.figures === 'string' 
              ? JSON.parse(data.figures) 
              : data.figures;
            
            if (Array.isArray(figuresArray) && figuresArray.length > 0) {
              setFigurePreviews(figuresArray);
            }
          } catch (error) {
            console.error("Error parsing figures:", error);
            // If parsing fails, check if it's already an array
            if (Array.isArray(data.figures)) {
              setFigurePreviews(data.figures);
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

      // ✅ Add files if uploaded
      if (imageFile) formData.append("image", imageFile);
      if (supplementaryFile) formData.append("supplementary_file", supplementaryFile);
      if (pdfFile) formData.append("pdf", pdfFile);
      
      figureFiles.forEach((file, index) => {
        formData.append(`figures[${index}]`, file);
      });

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
              Review all changes before updating the manuscript
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