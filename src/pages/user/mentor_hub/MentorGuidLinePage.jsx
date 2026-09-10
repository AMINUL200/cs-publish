import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faFilePdf,
  faFileWord,
  faTrash,
  faDownload,
  faSpinner,
  faCheck,
  faTimes,
  faEye,
  faEdit,
  faLink,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../components/common/Loader";

const MentorGuidLinePage = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pdfData, setPdfData] = useState(null);

  // ==========================================
  // GUIDELINE PDF STATE
  // ==========================================
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // ==========================================
  // WORD TEMPLATE STATE
  // ==========================================
  const [selectedWordFile, setSelectedWordFile] = useState(null);
  const [wordPreviewUrl, setWordPreviewUrl] = useState(null);
  const [isWordEditing, setIsWordEditing] = useState(false);

  // ==========================================
  // DRIVE LINK STATE
  // ==========================================
  const [driveLink, setDriveLink] = useState("");
  const [isDriveEditing, setIsDriveEditing] = useState(false);
  const [driveLinkError, setDriveLinkError] = useState("");

  // ==========================================
  // FETCH MENTOR GUIDELINE DATA
  // API: api/mentor-guideline-pdf/1
  // ==========================================
  const fetchGuidelinePdf = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/blog-pdf/2`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.data.status) {
        setPdfData(response.data.data);
        // ✅ Populate drive link if it exists
        if (response.data.data?.drive) {
          setDriveLink(response.data.data.drive);
        }
      } else {
        setPdfData(null);
      }
    } catch (error) {
      console.error("Error fetching mentor guideline:", error);
      if (error.response?.status === 404) {
        setPdfData(null);
      } else {
        toast.error("Failed to fetch mentor guideline");
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // HANDLE PDF FILE SELECTION
  // ==========================================
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please select a valid PDF file");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("PDF file size should be less than 10MB");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setIsEditing(true);
  };

  // ==========================================
  // HANDLE WORD FILE SELECTION
  // ==========================================
  const handleWordFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate Word file types
    const validWordTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const isWordFile =
      validWordTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".doc") ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isWordFile) {
      toast.error("Please select a valid Word file (.doc or .docx)");
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Word file size should be less than 10MB");
      e.target.value = "";
      return;
    }

    setSelectedWordFile(file);
    setWordPreviewUrl(URL.createObjectURL(file));
    setIsWordEditing(true);
  };

  // ==========================================
  // HANDLE DRIVE LINK CHANGE
  // ==========================================
  const handleDriveLinkChange = (e) => {
    const value = e.target.value;
    setDriveLink(value);
    setIsDriveEditing(true);

    // Validate URL if not empty
    if (value.trim() !== "") {
      try {
        new URL(value);
        setDriveLinkError("");
      } catch {
        setDriveLinkError("Please enter a valid URL");
      }
    } else {
      setDriveLinkError("");
    }
  };

  // ==========================================
  // HANDLE UPLOAD/UPDATE (PDF + WORD + DRIVE)
  // API: api/mentor-guideline-pdf/1
  // ==========================================
  const handleUpload = async () => {
    // Check if any changes exist
    const hasPdfChange = selectedFile !== null;
    const hasWordChange = selectedWordFile !== null;
    const hasDriveChange =
      isDriveEditing && driveLink !== (pdfData?.drive || "");

    if (!hasPdfChange && !hasWordChange && !hasDriveChange) {
      toast.error("Please make at least one change to update");
      return;
    }

    // Validate drive link if changed
    if (hasDriveChange && driveLink.trim() !== "") {
      try {
        new URL(driveLink);
      } catch {
        toast.error("Please enter a valid Drive Link URL");
        return;
      }
    }

    setUploading(true);
    try {
      const formData = new FormData();

      // Append PDF if selected
      if (selectedFile) {
        formData.append("pdf", selectedFile);
      }

      // Append Word file if selected
      if (selectedWordFile) {
        formData.append("word", selectedWordFile);
      }

      // Append Drive link (always send when changed, even if empty to allow clearing)
      if (hasDriveChange) {
        formData.append("drive", driveLink || "");
      }

      const response = await axios.post(
        `${API_URL}api/admin/blogs/blog-pdf/2`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.status) {
        toast.success(
          response.data.message || "Mentor resources updated successfully!"
        );

        // Refresh data
        await fetchGuidelinePdf();

        // Reset PDF state
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsEditing(false);

        // Reset Word state
        setSelectedWordFile(null);
        setWordPreviewUrl(null);
        setIsWordEditing(false);

        // Reset Drive state
        setIsDriveEditing(false);
        setDriveLinkError("");

        // Reset file inputs
        const fileInputs = document.querySelectorAll('input[type="file"]');
        fileInputs.forEach((input) => (input.value = ""));
      } else {
        toast.error(response.data.message || "Failed to update resources");
      }
    } catch (error) {
      console.error("Error uploading:", error);
      console.log("Error response:", error.response);
      toast.error(
        error.response?.data?.message || "Failed to update resources"
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // HANDLE CANCEL (Reset all editing states)
  // ==========================================
  const handleCancel = () => {
    // Reset PDF
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(false);

    // Reset Word
    setSelectedWordFile(null);
    setWordPreviewUrl(null);
    setIsWordEditing(false);

    // Reset Drive
    setIsDriveEditing(false);
    setDriveLink(pdfData?.drive || "");
    setDriveLinkError("");

    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach((input) => (input.value = ""));
  };

  // Get full file URL
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `${STORAGE_URL}${filePath}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get file name from path
  const getFileName = (filePath) => {
    if (!filePath) return "File";
    return decodeURIComponent(filePath.split("/").pop() || "File");
  };

  // Check if any changes exist
  const hasAnyChange =
    selectedFile !== null ||
    selectedWordFile !== null ||
    (isDriveEditing && driveLink !== (pdfData?.drive || ""));

  useEffect(() => {
    fetchGuidelinePdf();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Mentor Submission Resources
        </h1>
        <p className="text-gray-600 mt-1">
          Manage the guideline PDF, Word template, and Drive link that mentors
          will see when submitting events
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upload Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* ========================================== */}
          {/* GUIDELINE PDF SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <FontAwesomeIcon
                    icon={faFilePdf}
                    className="w-5 h-5 text-red-600"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Guideline PDF
                  </h2>
                  <p className="text-xs text-gray-500">
                    {pdfData?.pdf
                      ? "Update the existing guideline PDF"
                      : "Upload guideline PDF for mentors"}
                  </p>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                  isEditing
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-300 hover:border-purple-400 hover:bg-purple-50"
                }`}
              >
                {!isEditing ? (
                  <>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="mentor-pdf-upload"
                    />
                    <label
                      htmlFor="mentor-pdf-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <div className="bg-purple-100 p-4 rounded-full mb-3">
                        <FontAwesomeIcon
                          icon={faUpload}
                          className="w-6 h-6 text-purple-600"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Click to upload PDF
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
                        <FontAwesomeIcon
                          icon={faFilePdf}
                          className="w-8 h-8 text-red-500 flex-shrink-0"
                        />
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
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setIsEditing(false);
                          const input =
                            document.getElementById("mentor-pdf-upload");
                          if (input) input.value = "";
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-3 text-left">
                      <p className="text-xs text-gray-500">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-green-500 mr-1"
                        />
                        File ready for upload
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Current PDF Info */}
              {pdfData?.pdf && !isEditing && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FontAwesomeIcon
                        icon={faFilePdf}
                        className="w-6 h-6 text-red-500 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getFileName(pdfData.pdf)}
                        </p>
                        <p className="text-xs text-gray-500">Current PDF</p>
                      </div>
                    </div>
                    <a
                      href={getFileUrl(pdfData.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-1.5" />
                      View
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* WORD TEMPLATE SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FontAwesomeIcon
                    icon={faFileWord}
                    className="w-5 h-5 text-blue-600"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Word Template
                  </h2>
                  <p className="text-xs text-gray-500">
                    {pdfData?.word
                      ? "Update the existing Word template"
                      : "Upload a Word template for mentors"}
                  </p>
                </div>
              </div>

              {/* File Upload Area */}
              <div
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                  isWordEditing
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                {!isWordEditing ? (
                  <>
                    <input
                      type="file"
                      accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleWordFileSelect}
                      className="hidden"
                      id="mentor-word-upload"
                    />
                    <label
                      htmlFor="mentor-word-upload"
                      className="cursor-pointer flex flex-col items-center justify-center"
                    >
                      <div className="bg-blue-100 p-4 rounded-full mb-3">
                        <FontAwesomeIcon
                          icon={faUpload}
                          className="w-6 h-6 text-blue-600"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        Click to upload Word template
                      </span>
                      <span className="text-xs text-gray-400 mt-1">
                        DOC, DOCX files only, max 10MB
                      </span>
                    </label>
                  </>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <FontAwesomeIcon
                          icon={faFileWord}
                          className="w-8 h-8 text-blue-500 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {selectedWordFile?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(selectedWordFile?.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedWordFile(null);
                          setWordPreviewUrl(null);
                          setIsWordEditing(false);
                          const input =
                            document.getElementById("mentor-word-upload");
                          if (input) input.value = "";
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                      >
                        <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="mt-3 text-left">
                      <p className="text-xs text-gray-500">
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-green-500 mr-1"
                        />
                        File ready for upload
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Current Word File Info */}
              {pdfData?.word && !isWordEditing && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FontAwesomeIcon
                        icon={faFileWord}
                        className="w-6 h-6 text-blue-500 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {getFileName(pdfData.word)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Current template
                        </p>
                      </div>
                    </div>
                    <a
                      href={getFileUrl(pdfData.word)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors flex items-center"
                    >
                      <FontAwesomeIcon icon={faDownload} className="mr-1.5" />
                      View
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* DRIVE LINK SECTION */}
          {/* ========================================== */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <FontAwesomeIcon
                    icon={faCloud}
                    className="w-5 h-5 text-green-600"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Drive Link
                  </h2>
                  <p className="text-xs text-gray-500">
                    {pdfData?.drive
                      ? "Update the existing Drive link"
                      : "Add a Google Drive or external resource link"}
                  </p>
                </div>
              </div>

              {/* Drive Link Input */}
              <div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faLink}
                    className="w-4 h-4 text-green-600"
                  />
                  <input
                    type="url"
                    value={driveLink}
                    onChange={handleDriveLinkChange}
                    placeholder="https://drive.google.com/..."
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                      driveLinkError ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {driveLinkError && (
                  <p className="text-red-500 text-xs mt-1">{driveLinkError}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Add a link to a Google Drive folder or any external resource
                </p>
              </div>

              {/* Current Drive Link Info */}
              {pdfData?.drive && !isDriveEditing && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <FontAwesomeIcon
                        icon={faCloud}
                        className="w-6 h-6 text-green-500 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {pdfData.drive}
                        </p>
                        <p className="text-xs text-gray-500">
                          Current drive link
                        </p>
                      </div>
                    </div>
                    <a
                      href={pdfData.drive}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors flex items-center"
                    >
                      <FontAwesomeIcon icon={faLink} className="mr-1.5" />
                      Open
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================== */}
          {/* ACTION BUTTONS */}
          {/* ========================================== */}
          {hasAnyChange && (
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 flex gap-3">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      className="animate-spin mr-2"
                    />
                    Updating...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Update Resources
                  </>
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Right Column - Information */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 sticky top-20">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Resource Information
            </h3>

            <div className="space-y-4">
              {/* PDF Status */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon
                      icon={faFilePdf}
                      className="w-4 h-4 text-blue-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">
                      PDF Status
                    </h4>
                    <p className="text-xs text-blue-600">
                      {pdfData?.pdf
                        ? "✅ Guideline PDF is set"
                        : "⚠️ No guideline PDF uploaded"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Word Status */}
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon
                      icon={faFileWord}
                      className="w-4 h-4 text-indigo-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-indigo-800">
                      Word Template Status
                    </h4>
                    <p className="text-xs text-indigo-600">
                      {pdfData?.word
                        ? "✅ Word template is set"
                        : "⚠️ No Word template uploaded"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drive Status */}
              <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon
                      icon={faCloud}
                      className="w-4 h-4 text-green-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-800">
                      Drive Link Status
                    </h4>
                    <p className="text-xs text-green-600">
                      {pdfData?.drive
                        ? "✅ Drive link is set"
                        : "⚠️ No drive link added"}
                    </p>
                  </div>
                </div>
              </div>

              {/* What Mentors See */}
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="w-4 h-4 text-purple-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-purple-800">
                      What Mentors See
                    </h4>
                    <p className="text-xs text-purple-600">
                      These resources appear as downloadable options when
                      mentors submit events
                    </p>
                  </div>
                </div>
              </div>

              {/* File Requirements */}
              <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100">
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-lg mr-3">
                    <FontAwesomeIcon
                      icon={faUpload}
                      className="w-4 h-4 text-yellow-600"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">
                      File Requirements
                    </h4>
                    <ul className="text-xs text-yellow-700 space-y-1 mt-1">
                      <li>• PDF: Max 10MB</li>
                      <li>• Word: DOC/DOCX, Max 10MB</li>
                      <li>• Drive: Valid URL</li>
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
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                PDF Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              <iframe
                src={previewUrl}
                className="w-full h-full min-h-[500px] rounded-lg border border-gray-200"
                title="PDF Preview"
              />
            </div>

            <div className="flex justify-end gap-3 p-4 border-t border-gray-200">
              <button
                onClick={() => setShowPreview(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <a
                href={previewUrl}
                download={selectedFile?.name || "guideline.pdf"}
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

export default MentorGuidLinePage;