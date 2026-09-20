import React, { useEffect, useState, useCallback, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faXmark,
  faSearch,
  faFilePdf,
  faFileWord,
  faDownload,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; 
const storage_url = import.meta.env.VITE_STORAGE_URL;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXT = ["pdf", "doc", "docx"];
const ALLOWED_MIME = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

// ---------- Helpers ----------
const getFileExt = (name = "") => name.split(".").pop().toLowerCase();

const isAllowedFile = (file) => {
  if (!file) return false;
  const ext = getFileExt(file.name);
  return (
    ALLOWED_EXT.includes(ext) &&
    (ALLOWED_MIME.includes(file.type) || file.type === "")
  );
};

const validateFile = (file, label) => {
  if (!file) return `${label} is required`;
  if (!isAllowedFile(file))
    return `${label} must be PDF, DOC, or DOCX`;
  if (file.size > MAX_FILE_SIZE)
    return `${label} must be less than 10 MB`;
  return null;
};

const fileIcon = (path = "") => {
  const ext = getFileExt(path);
  if (ext === "pdf") return faFilePdf;
  return faFileWord;
};

const buildFileUrl = (path) => {
  if (!path) return "#";
  if (path.startsWith("http")) return path;
  // API_URL ends with "/" typically; strip trailing slash to avoid //
  const base =storage_url || "";
  return `${base}/${path.replace(/^\//, "")}`;
};

// ---------- Main Component ----------
const ManageTemplate = () => {
  const { token } = useSelector((state) => state.auth);

  const [templates, setTemplates] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [showModal, setShowModal] = useState(false); // add
  const [showEditModal, setShowEditModal] = useState(false); // edit

  // Form state
  const [newItem, setNewItem] = useState({
    journal_id: "",
    copyright_file: null,
    template_file: null,
  });
  const [editingItem, setEditingItem] = useState({
    id: null,
    journal_id: "",
    copyright_file: null, // new file (optional)
    template_file: null, // new file (optional)
    existing_copyright: "",
    existing_template: "",
  });

  // Loading states
  const [addLoading, setAddLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  // Refs for resetting <input type="file">
  const addCopyrightRef = useRef(null);
  const addTemplateRef = useRef(null);
  const editCopyrightRef = useRef(null);
  const editTemplateRef = useRef(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

  // ---------------- FETCH ----------------
  const fetchTemplates = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}api/admin/templates`, {
        headers: {
          ...authHeaders,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      console.log("Fetch templates response:", res.data);
      if (res.data.success) {
        setTemplates(res.data.data || []);
      } else {
        toast.error(res.data.message || "Failed to fetch templates");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    //   console.log("Fetch templates error details:", err);
    } finally {
      setLoading(false);
    }
  }, [ token]);

  const fetchJournals = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}api/admin/journals`, {
        headers: { ...authHeaders, "Cache-Control": "no-cache" },
      });
      if (res.data.success) {
        setJournals(res.data.data || []);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
        // console.log("Fetch journals error details:", err);
    }
  }, [ token]);

  useEffect(() => {
    fetchTemplates();
    fetchJournals();
  }, [fetchTemplates, fetchJournals]);

  // ---------------- FILTER ----------------
  const filteredItems = templates.filter((t) => {
    const q = searchTerm.toLowerCase();
    return (
      t.journal?.j_title?.toLowerCase().includes(q) ||
      String(t.journal_id).includes(q) ||
      String(t.id).includes(q)
    );
  });

  // ---------------- ADD ----------------
  const resetAddForm = () => {
    setNewItem({ journal_id: "", copyright_file: null, template_file: null });
    if (addCopyrightRef.current) addCopyrightRef.current.value = "";
    if (addTemplateRef.current) addTemplateRef.current.value = "";
  };

  const handleAddItem = async () => {
    if (!newItem.journal_id) return toast.error("Please select a journal");

    const err1 = validateFile(newItem.copyright_file, "Copyright file");
    if (err1) return toast.error(err1);
    const err2 = validateFile(newItem.template_file, "Template file");
    if (err2) return toast.error(err2);

    const fd = new FormData();
    fd.append("journal_id", newItem.journal_id);
    fd.append("copyright_file", newItem.copyright_file);
    fd.append("template_file", newItem.template_file);

    try {
      setAddLoading(true);
      const res = await axios.post(`${API_URL}api/admin/templates`, fd, {
        headers: {
          ...authHeaders,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Template added successfully");
        fetchTemplates();
        resetAddForm();
        setShowModal(false);
      } else {
        toast.error(res.data.message || "Failed to add template");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setAddLoading(false);
    }
  };

  // ---------------- EDIT OPEN ----------------
  const handleEditOpen = (item) => {
    setEditingItem({
      id: item.id,
      journal_id: item.journal_id,
      copyright_file: null,
      template_file: null,
      existing_copyright: item.copyright_file,
      existing_template: item.template_file,
    });
    if (editCopyrightRef.current) editCopyrightRef.current.value = "";
    if (editTemplateRef.current) editTemplateRef.current.value = "";
    setShowEditModal(true);
  };

  // ---------------- UPDATE ----------------
  const handleUpdateItem = async () => {
    if (!editingItem.journal_id)
      return toast.error("Please select a journal");

    // If user picked new files, validate them
    if (editingItem.copyright_file) {
      const e = validateFile(editingItem.copyright_file, "Copyright file");
      if (e) return toast.error(e);
    }
    if (editingItem.template_file) {
      const e = validateFile(editingItem.template_file, "Template file");
      if (e) return toast.error(e);
    }

    const fd = new FormData();
    fd.append("journal_id", editingItem.journal_id);
    // fd.append("_method", "PUT"); // Laravel method spoofing
    if (editingItem.copyright_file)
      fd.append("copyright_file", editingItem.copyright_file);
    if (editingItem.template_file)
      fd.append("template_file", editingItem.template_file);

    try {
      setUpdateLoading(true);
      const res = await axios.post(
        `${API_URL}api/admin/templates/update/${editingItem.id}`,
        fd,
        {
          headers: {
            ...authHeaders,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Template updated successfully");
        fetchTemplates();
        setShowEditModal(false);
      } else {
        toast.error(res.data.message || "Failed to update template");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    try {
      setDeleteLoadingId(id);
      const res = await axios.delete(`${API_URL}api/admin/templates/${id}`, {
        headers: authHeaders,
      });

      if (res.data.success) {
        toast.success(res.data.message || "Template deleted successfully");
        setTemplates((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast.error(res.data.message || "Failed to delete template");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // ---------------- RENDER ----------------
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">MANAGE TEMPLATES</h1>

      {/* Header */}
      <div className="flex justify-between mb-6">
        <div className="relative w-64">
          <input
            type="search"
            placeholder="Search by journal title or id..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 w-full shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faSearch}
              className="h-4 w-4 text-gray-400"
            />
          </div>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          onClick={() => {
            resetAddForm();
            setShowModal(true);
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New Template
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full w-[900px] bg-white border border-gray-200">
          <thead className="bg-gray-50 border-2">
            <tr>
              {[
                "Id",
                "Journal",
                "Copyright File",
                "Template File",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-2">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                    {item.id}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-700 border-2">
                    <div className="font-semibold">
                      {item.journal?.j_title || "-"}
                    </div>
                    <div className="text-xs text-gray-400">
                      ID: {item.journal_id}
                    </div>
                  </td>

                  {/* Copyright File */}
                  <td className="px-4 py-4 text-sm border-2">
                    <a
                      href={buildFileUrl(item.copyright_file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      <FontAwesomeIcon
                        icon={fileIcon(item.copyright_file)}
                        className="mr-2"
                      />
                      {item.copyright_file
                        ? item.copyright_file.split("/").pop()
                        : "-"}
                    </a>
                  </td>

                  {/* Template File */}
                  <td className="px-4 py-4 text-sm border-2">
                    <a
                      href={buildFileUrl(item.template_file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      <FontAwesomeIcon
                        icon={fileIcon(item.template_file)}
                        className="mr-2"
                      />
                      {item.template_file
                        ? item.template_file.split("/").pop()
                        : "-"}
                    </a>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap border-2">
                    <span
                      className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                        item.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium border-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mr-2"
                      onClick={() => handleEditOpen(item)}
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteLoadingId === item.id}
                      className={`text-white p-2 rounded ${
                        deleteLoadingId === item.id
                          ? "bg-gray-500 cursor-not-allowed"
                          : "cursor-pointer bg-red-500 hover:bg-red-600"
                      }`}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      {deleteLoadingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No templates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredItems.length} of {templates.length} templates
      </div>

      {/* ---------------- ADD MODAL ---------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Template</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>

            {/* Journal Select */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Journal <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newItem.journal_id}
                onChange={(e) =>
                  setNewItem({ ...newItem, journal_id: e.target.value })
                }
              >
                <option value="">-- Select Journal --</option>
                {journals.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.j_title} (ID: {j.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Copyright File */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Copyright File <span className="text-red-500">*</span>
              </label>
              <input
                ref={addCopyrightRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    copyright_file: e.target.files?.[0] || null,
                  })
                }
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-400 mt-1">
                PDF / DOC / DOCX, max 10 MB
              </p>
            </div>

            {/* Template File */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Template File <span className="text-red-500">*</span>
              </label>
              <input
                ref={addTemplateRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) =>
                  setNewItem({
                    ...newItem,
                    template_file: e.target.files?.[0] || null,
                  })
                }
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-400 mt-1">
                PDF / DOC / DOCX, max 10 MB
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleAddItem}
                disabled={
                  addLoading ||
                  !newItem.journal_id ||
                  !newItem.copyright_file ||
                  !newItem.template_file
                }
              >
                {addLoading && (
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
                {addLoading ? "Adding..." : "Add Template"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- EDIT MODAL ---------------- */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Edit Template</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>

            {/* Journal Select */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Journal <span className="text-red-500">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={editingItem.journal_id}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, journal_id: e.target.value })
                }
              >
                <option value="">-- Select Journal --</option>
                {journals.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.j_title} (ID: {j.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Current + New Copyright File */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Copyright File
              </label>
              {editingItem.existing_copyright && (
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={fileIcon(editingItem.existing_copyright)}
                  />
                  Current:{" "}
                  <a
                    href={buildFileUrl(editingItem.existing_copyright)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {editingItem.existing_copyright.split("/").pop()}
                  </a>
                </div>
              )}
              <input
                ref={editCopyrightRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    copyright_file: e.target.files?.[0] || null,
                  })
                }
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-400 mt-1">
                Leave empty to keep current file
              </p>
            </div>

            {/* Current + New Template File */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Template File
              </label>
              {editingItem.existing_template && (
                <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={fileIcon(editingItem.existing_template)}
                  />
                  Current:{" "}
                  <a
                    href={buildFileUrl(editingItem.existing_template)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {editingItem.existing_template.split("/").pop()}
                  </a>
                </div>
              )}
              <input
                ref={editTemplateRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    template_file: e.target.files?.[0] || null,
                  })
                }
                className="w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-400 mt-1">
                Leave empty to keep current file
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 ${
                  updateLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={handleUpdateItem}
                disabled={updateLoading || !editingItem.journal_id}
              >
                {updateLoading ? "Updating..." : "Update Template"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageTemplate;