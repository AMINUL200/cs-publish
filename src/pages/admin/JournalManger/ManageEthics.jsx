import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  FileText,
  FileType,
  X,
  Upload,
  MoreVertical,
  BookOpen,
  Loader2,
  RefreshCw,
} from "lucide-react";
import Loader from "../../../components/common/Loader";

const ManageEthics = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  const [searchParams] = useSearchParams();
  const journalIdFromUrl = searchParams.get("journal_id");

  const [athicsList, setAthicsList] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    journal_id: "",
    athics_name: "",
    word_document: null,
    pdf_document: null,
  });

  const [wordFileName, setWordFileName] = useState("");
  const [pdfFileName, setPdfFileName] = useState("");

  // ✅ Track existing files separately
  const [existingWord, setExistingWord] = useState(""); // URL/name of existing word
  const [existingPdf, setExistingPdf] = useState(""); // URL/name of existing pdf

  const [errors, setErrors] = useState({});

  // Refs for hidden file inputs
  const wordInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // ==========================================
  // FETCH
  // ==========================================
  const fetchAthics = async () => {
    try {
      const res = await axios.get(`${API_URL}api/athics`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      if (res.data.success) setAthicsList(res.data.data || []);
    } catch (err) {
      console.error("Error fetching athics:", err);
      toast.error("Failed to fetch athics list");
    }
  };

  const fetchJournals = async () => {
    try {
      const res = await axios.get(`${API_URL}api/admin/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      if (res.data.success) setJournals(res.data.data || []);
    } catch (err) {
      console.error("Error fetching journals:", err);
      toast.error("Failed to fetch journals");
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchAthics(), fetchJournals()]);
      setLoading(false);
    };
    init();
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ==========================================
  // FILTER
  // ==========================================
  const filteredAthics = athicsList.filter((item) => {
    if (journalIdFromUrl) {
      if (String(item.journal_id) !== String(journalIdFromUrl)) return false;
    }
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      return (
        item.athics_name?.toLowerCase().includes(term) ||
        item.journal?.j_title?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const currentJournal = journalIdFromUrl
    ? journals.find((j) => String(j.id) === String(journalIdFromUrl))
    : null;

  // ==========================================
  // OPEN MODAL
  // ==========================================
  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      journal_id: journalIdFromUrl || "",
      athics_name: "",
      word_document: null,
      pdf_document: null,
    });
    setWordFileName("");
    setPdfFileName("");
    setExistingWord("");
    setExistingPdf("");
    setErrors({});
    setShowModal(true);
    setOpenDropdownId(null);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      journal_id: item.journal_id || "",
      athics_name: item.athics_name || "",
      word_document: null,
      pdf_document: null,
    });
    // ✅ Store existing files separately
    setExistingWord(item.word_document || "");
    setExistingPdf(item.pdf_document || "");
    setWordFileName(""); // Start empty, will show existing block separately
    setPdfFileName("");
    setErrors({});
    setShowModal(true);
    setOpenDropdownId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setExistingWord("");
    setExistingPdf("");
  };

  // ==========================================
  // FILE HANDLERS
  // ==========================================
  const handleWordChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isWord =
      validTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".doc") ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isWord) {
      toast.error("Please select a valid Word file (.doc or .docx)");
      e.target.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Word file size should be less than 10MB");
      e.target.value = "";
      return;
    }

    setFormData((p) => ({ ...p, word_document: file }));
    setWordFileName(file.name);
    setErrors((p) => ({ ...p, word_document: "" }));
  };

  const handlePdfChange = (e) => {
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

    setFormData((p) => ({ ...p, pdf_document: file }));
    setPdfFileName(file.name);
    setErrors((p) => ({ ...p, pdf_document: "" }));
  };

  // ✅ Remove newly selected file (keeps existing file)
  const removeNewWord = () => {
    setFormData((p) => ({ ...p, word_document: null }));
    setWordFileName("");
    setErrors((p) => ({ ...p, word_document: "" }));
    if (wordInputRef.current) wordInputRef.current.value = "";
  };

  const removeNewPdf = () => {
    setFormData((p) => ({ ...p, pdf_document: null }));
    setPdfFileName("");
    setErrors((p) => ({ ...p, pdf_document: "" }));
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  // ✅ Remove existing file (from server)
  const removeExistingWord = () => {
    setExistingWord("");
    setWordFileName("");
  };

  const removeExistingPdf = () => {
    setExistingPdf("");
    setPdfFileName("");
  };

  // ✅ Trigger file picker for replacement
  const triggerWordInput = () => wordInputRef.current?.click();
  const triggerPdfInput = () => pdfInputRef.current?.click();

  // ==========================================
  // SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.journal_id) newErrors.journal_id = "Journal is required";
    if (!formData.athics_name?.trim())
      newErrors.athics_name = "Athics name is required";

    // Word required only if there's no existing AND no new file
    if (!editingItem) {
      if (!formData.word_document) newErrors.word_document = "Word document is required";
      if (!formData.pdf_document) newErrors.pdf_document = "PDF document is required";
    } else {
      if (!formData.word_document && !existingWord)
        newErrors.word_document = "Word document is required";
      if (!formData.pdf_document && !existingPdf)
        newErrors.pdf_document = "PDF document is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const submitData = new FormData();
      submitData.append("journal_id", formData.journal_id);
      submitData.append("athics_name", formData.athics_name.trim());

      if (formData.word_document) {
        submitData.append("word_document", formData.word_document);
      } else if (editingItem && !existingWord) {
        // User removed existing file — send empty to clear
        submitData.append("word_document", "");
      }

      if (formData.pdf_document) {
        submitData.append("pdf_document", formData.pdf_document);
      } else if (editingItem && !existingPdf) {
        submitData.append("pdf_document", "");
      }

      const url = editingItem
        ? `${API_URL}api/athics/${editingItem.id}`
        : `${API_URL}api/athics`;

      const res = await axios.post(url, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success || res.status === 200 || res.status === 201) {
        toast.success(
          editingItem
            ? "Athics updated successfully"
            : "Athics created successfully"
        );
        closeModal();
        await fetchAthics();
      } else {
        toast.error(res.data.message || "Operation failed");
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          `Failed to ${editingItem ? "update" : "create"} athics`
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // DELETE
  // ==========================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this athics?")) return;

    try {
      const res = await axios.delete(`${API_URL}api/athics/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success || res.status === 200) {
        toast.success("Athics deleted successfully");
        await fetchAthics();
      } else {
        toast.error(res.data.message || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete athics");
    } finally {
      setOpenDropdownId(null);
    }
  };

  // ==========================================
  // HELPERS
  // ==========================================
  const getFileUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${STORAGE_URL}${path}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <Loader />;

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Athics</h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentJournal
                ? `Athics for journal: ${currentJournal.j_title}`
                : "Add, edit, and manage athics documents linked to journals"}
            </p>
            {currentJournal && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm">
                <BookOpen className="w-4 h-4" />
                <span className="font-medium">{currentJournal.j_title}</span>
                <span className="text-xs text-blue-500">
                  (ID: {currentJournal.id})
                </span>
              </div>
            )}
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Athics
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by athics name or journal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-visible">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Si.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Athics Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Journal</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Word</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">PDF</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAthics.length > 0 ? (
                  filteredAthics.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.athics_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{item.journal?.j_title || "N/A"}</td>
                      <td className="px-6 py-4 text-center">
                        {item.word_document ? (
                          <a
                            href={getFileUrl(item.word_document)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                            title="Download Word"
                          >
                            <FileType className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.pdf_document ? (
                          <a
                            href={getFileUrl(item.pdf_document)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                            title="Download PDF"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(item.created_at)}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="relative inline-block">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId((prev) => (prev === item.id ? null : item.id));
                            }}
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>

                          {openDropdownId === item.id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-0 z-50 mt-2 w-40 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                              style={{ top: "100%" }}
                            >
                              <button
                                onClick={() => openEditModal(item)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-3 border-b border-gray-100"
                              >
                                <Edit className="w-4 h-4 text-green-500" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3"
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      {journalIdFromUrl ? "No athics found for this journal" : "No athics found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* ADD/EDIT MODAL */}
      {/* ========================================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                {editingItem ? "Edit Athics" : "Add Athics"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4">
              {/* Journal Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Journal <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.journal_id}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, journal_id: e.target.value }));
                    setErrors((p) => ({ ...p, journal_id: "" }));
                  }}
                  disabled={!!journalIdFromUrl}
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.journal_id ? "border-red-500" : "border-gray-300"
                  } ${journalIdFromUrl ? "bg-gray-100 cursor-not-allowed" : ""}`}
                >
                  <option value="">Select Journal</option>
                  {journals.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.j_title}
                    </option>
                  ))}
                </select>
                {journalIdFromUrl && (
                  <p className="text-xs text-gray-500 mt-1">
                    Journal is locked to the one selected from the URL.
                  </p>
                )}
                {errors.journal_id && (
                  <p className="text-red-500 text-xs mt-1">{errors.journal_id}</p>
                )}
              </div>

              {/* Athics Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Athics Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.athics_name}
                  onChange={(e) => {
                    setFormData((p) => ({ ...p, athics_name: e.target.value }));
                    setErrors((p) => ({ ...p, athics_name: "" }));
                  }}
                  placeholder="e.g., Plant Athics"
                  className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.athics_name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.athics_name && (
                  <p className="text-red-500 text-xs mt-1">{errors.athics_name}</p>
                )}
              </div>

              {/* ========================================== */}
              {/* WORD DOCUMENT */}
              {/* ========================================== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Word Document {!editingItem && <span className="text-red-500">*</span>}
                </label>

                {/* Hidden input always present */}
                <input
                  type="file"
                  accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleWordChange}
                  className="hidden"
                  id="athics-word-upload"
                  ref={wordInputRef}
                />

                {/* NEW FILE selected */}
                {wordFileName && formData.word_document ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileType className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-700 truncate block">
                          {wordFileName}
                        </span>
                        <span className="text-xs text-green-600 font-medium">New file selected</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeNewWord}
                      className="text-red-500 hover:text-red-700"
                      title="Remove new file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : existingWord ? (
                  /* EXISTING FILE from server */
                  <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileType className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-700 truncate block">
                          {existingWord.split("/").pop()}
                        </span>
                        <span className="text-xs text-blue-600">Current file</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={triggerWordInput}
                        className="text-blue-600 hover:text-blue-800"
                        title="Replace file"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={removeExistingWord}
                        className="text-red-500 hover:text-red-700"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* NO FILE — show upload label */
                  <label
                    htmlFor="athics-word-upload"
                    className={`flex items-center justify-center gap-2 w-full px-3 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${
                      errors.word_document
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Upload Word (.doc/.docx) — max 10MB
                    </span>
                  </label>
                )}

                {/* "Upload new file" option even when existing file is present */}
                {existingWord && !formData.word_document && (
                  <label
                    htmlFor="athics-word-upload"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    Or upload a new file to replace
                  </label>
                )}

                {errors.word_document && (
                  <p className="text-red-500 text-xs mt-1">{errors.word_document}</p>
                )}
              </div>

              {/* ========================================== */}
              {/* PDF DOCUMENT */}
              {/* ========================================== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Document {!editingItem && <span className="text-red-500">*</span>}
                </label>

                <input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfChange}
                  className="hidden"
                  id="athics-pdf-upload"
                  ref={pdfInputRef}
                />

                {pdfFileName && formData.pdf_document ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-300 rounded-lg p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-700 truncate block">
                          {pdfFileName}
                        </span>
                        <span className="text-xs text-green-600 font-medium">New file selected</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeNewPdf}
                      className="text-red-500 hover:text-red-700"
                      title="Remove new file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : existingPdf ? (
                  <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="text-sm text-gray-700 truncate block">
                          {existingPdf.split("/").pop()}
                        </span>
                        <span className="text-xs text-red-600">Current file</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={triggerPdfInput}
                        className="text-blue-600 hover:text-blue-800"
                        title="Replace file"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={removeExistingPdf}
                        className="text-red-500 hover:text-red-700"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="athics-pdf-upload"
                    className={`flex items-center justify-center gap-2 w-full px-3 py-3 border-2 border-dashed rounded-lg cursor-pointer transition ${
                      errors.pdf_document
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                    }`}
                  >
                    <Upload className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Upload PDF — max 10MB</span>
                  </label>
                )}

                {existingPdf && !formData.pdf_document && (
                  <label
                    htmlFor="athics-pdf-upload"
                    className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    Or upload a new file to replace
                  </label>
                )}

                {errors.pdf_document && (
                  <p className="text-red-500 text-xs mt-1">{errors.pdf_document}</p>
                )}
              </div>
            </form>

            <div className="p-5 border-t border-gray-200 flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>{editingItem ? "Update" : "Save"}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEthics;