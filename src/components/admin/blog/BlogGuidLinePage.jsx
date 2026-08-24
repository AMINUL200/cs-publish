import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFilePdf,
  faTrash,
  faDownload,
  faSpinner,
  faCheck,
  faTimes,
  faEye,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../common/Loader";

const BlogGuidLinePage = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pdfData, setPdfData] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch current guideline PDF
  const fetchGuidelinePdf = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/blog-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (response.data.status) {
        setPdfData(response.data.data);

      } else {
        // No PDF found or error
        setPdfData(null);
      }
    } catch (error) {
      console.error("Error fetching guideline PDF:", error);
      // If 404 or no data, just set to null
      if (error.response?.status === 404) {
        setPdfData(null);
      } else {
        toast.error("Failed to fetch guideline PDF");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file");
      e.target.value = "";
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDF file size should be less than 10MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsEditing(true);
  };

  // Handle file upload/update
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a PDF file to upload");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);

      const response = await axios.post(
        `${API_URL}api/admin/blogs/blog-pdf`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        toast.success(response.data.message || "PDF uploaded successfully!");
        fetchGuidelinePdf();
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsEditing(false);
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(response.data.message || "Failed to upload PDF");
      }
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast.error(error.response?.data?.message || "Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  // Handle remove/cancel
  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  // Get full PDF URL
  const getPdfUrl = (pdfPath) => {
    if (!pdfPath) return null;
    if (pdfPath.startsWith('http')) return pdfPath;
    return `${STORAGE_URL}${pdfPath}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    fetchGuidelinePdf();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Blog Submission Guidelines</h1>
        <p className="text-gray-600 mt-1">
          Manage the PDF guidelines that users will see when submitting blogs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            {/* Upload Area */}
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {pdfData ? "Update Guideline PDF" : "Upload Guideline PDF"}
              </h2>
              
              <p className="text-sm text-gray-500 mb-4">
                Upload a PDF file that will be displayed as a sample guideline for users submitting blogs.
                {pdfData && " The existing PDF will be replaced."}
              </p>

              {/* File Upload Area */}
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                  isEditing 
                    ? 'border-purple-400 bg-purple-50' 
                    : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                }`}
              >
                {!isEditing ? (
                  <>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <div className="bg-purple-100 p-4 rounded-full mb-3">
                        <FontAwesomeIcon icon={faUpload} className="w-8 h-8 text-purple-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        PDF files only, max 10MB
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FontAwesomeIcon icon={faFilePdf} className="w-8 h-8 text-red-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedFile?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        {previewUrl && (
                          <button
                            onClick={() => setShowPreview(true)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Preview PDF"
                          >
                            <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                      <button
                        onClick={handleCancel}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                        title="Remove file"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Preview Info */}
                    {previewUrl && (
                      <div className="mt-3 text-left">
                        <p className="text-xs text-gray-500">
                          <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-1" />
                          File ready for upload
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                        {pdfData ? "Update PDF" : "Upload PDF"}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={uploading}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Current PDF Info - Only show if PDF exists and not editing */}
          {pdfData && !isEditing && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mt-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Current Guideline PDF</h3>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <FontAwesomeIcon icon={faFilePdf} className="w-8 h-8 text-red-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {pdfData.pdf?.split('/').pop() || 'Guideline PDF'}
                    </p>
                    <p className="text-xs text-gray-500">
                      Last updated: {formatDate(pdfData.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={getPdfUrl(pdfData.pdf)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors duration-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faDownload} className="mr-1.5" />
                    View
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-20">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Guideline Information</h3>
            
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">PDF Status</h4>
                    <p className="text-xs text-blue-600">
                      {pdfData ? '✅ Guideline PDF is set' : '⚠️ No guideline PDF uploaded'}
                    </p>
                  </div>
                </div>
              </div>

              {pdfData && (
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-lg mr-3">
                      <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Last Updated</h4>
                      <p className="text-xs text-green-600">
                        {formatDate(pdfData.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={faEdit} className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-800">What Users See</h4>
                    <p className="text-xs text-purple-600">
                      This PDF appears as a sample guideline when users submit blogs
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon icon={faUpload} className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">File Requirements</h4>
                    <ul className="text-xs text-yellow-700 space-y-1 mt-1">
                      <li>• PDF format only</li>
                      <li>• Maximum 10MB</li>
                      <li>• Clear formatting</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">PDF Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Body - PDF Preview */}
            <div className="flex-1 p-4 overflow-auto">
              <iframe
                src={previewUrl}
                className="w-full h-full min-h-[500px] rounded-lg border border-gray-200"
                title="PDF Preview"
                type="application/pdf"
              />
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={previewUrl}
                download={selectedFile?.name || 'guideline.pdf'}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-300 flex items-center"
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogGuidLinePage;