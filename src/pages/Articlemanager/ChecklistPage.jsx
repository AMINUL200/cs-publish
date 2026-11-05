import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faCheck,
  faTimes,
  faSearch,
  faEdit,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";

// ✅ FIXED: no height:"100%", fixed 400px, resize disabled
const editorInit = {
  height: 400,          // ✅ fixed pixel height — no longer overflows
  menubar: false,
  resize: false,        // ✅ prevent user drag-resize breaking layout
  plugins: [
    "advlist",
    "autolink",
    "link",
    "lists",
    "charmap",
    "preview",
    "searchreplace",
    "visualblocks",
    "code",
    "fullscreen",
    "help",
    "wordcount",
  ],
  toolbar:
    "undo redo | blocks | " +
    "bold italic underline | link | " +
    "alignleft aligncenter alignright alignjustify | " +
    "bullist numlist outdent indent | " +
    "removeformat | help | code | fullscreen",
  content_style:
    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
  link_context_toolbar: true,
  link_assume_external_targets: true,
  link_title: false,
  default_link_target: "_blank",
};

const ChecklistPage = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newItem, setNewItem] = useState({ checklist_item: "", status: 1 });
  const [editingItem, setEditingItem] = useState({
    id: null,
    checklist_item: "",
    status: 1,
  });
  const [checklistItems, setChecklistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addListLoading, setAddListLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // ---------------- FETCH ----------------
  const fetchChecklistItems = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/admin/checklist-settings`,
        {
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (response.data.flag === 1) {
        const normalized = response.data.data.map((it) => ({
          ...it,
          status: Number(it.status),
        }));
        setChecklistItems(normalized);
      } else {
        toast.error("Failed to fetch checklist items");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]);

  useEffect(() => {
    fetchChecklistItems();
  }, [fetchChecklistItems]);

  const filteredItems = checklistItems.filter((item) =>
    item.checklist_item?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------- ADD ----------------
  const handleAddItem = async () => {
    if (newItem.checklist_item.trim() === "") {
      return toast.error("Please enter a checklist item");
    }

    try {
      setAddListLoading(true);
      const response = await axios.post(
        `${API_URL}api/admin/checklist-settings`,
        newItem,
        {
          headers: {
            ...authHeaders,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.flag === 1 || response.data.status === "success") {
        toast.success(response.data.message || "Item added successfully");
        fetchChecklistItems();
        setNewItem({ checklist_item: "", status: 1 });
        setShowModal(false);
      } else {
        toast.error(response.data.message || "Failed to add item");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setAddListLoading(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      setDeleteLoadingId(id);
      const response = await axios.delete(
        `${API_URL}api/admin/checklist-settings/${id}`,
        { headers: authHeaders }
      );

      if (response.data.status === "success") {
        toast.success(response.data.message);
        setChecklistItems((prev) => prev.filter((it) => it.id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Delete failed"
      );
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // ---------------- EDIT ----------------
  const handleEditItem = async (id) => {
    try {
      const response = await axios.get(
        `${API_URL}api/admin/checklist-settings/${id}`,
        {
          headers: {
            ...authHeaders,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        }
      );

      if (response.data.flag === 1 || response.data.data) {
        const data = response.data.data;
        // ✅ Keep ONLY the fields we need — no created_at, updated_at, etc.
        setEditingItem({
          id: data.id,
          checklist_item: data.checklist_item,
          status: Number(data.status),
        });
        setShowEditModal(true);
      } else {
        toast.error("Failed to load item");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error.message || "Failed to load item"
      );
    }
  };

  // ---------------- UPDATE ----------------
  const handleUpdateItem = async () => {
    if (editingItem.checklist_item.trim() === "") {
      return toast.error("Please enter a checklist item");
    }
    if (!editingItem.id) {
      return toast.error("Invalid item id");
    }

    try {
      setUpdateLoading(true);

      // ✅ Send ONLY what the API expects — no extra fields
      const payload = {
        checklist_item: editingItem.checklist_item,
        status: editingItem.status,
      };

      const response = await axios.put(
        `${API_URL}api/admin/checklist-settings/${editingItem.id}`,
        payload,
        {
          headers: {
            ...authHeaders,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Update response:", response.data);

      if (response.data.falg === 1 || response.data.status === "success") {
        toast.success(response.data.message || "Item updated successfully");
        fetchChecklistItems();
        setShowEditModal(false);
        setEditingItem({ id: null, checklist_item: "", status: 1 });
      } else {
        toast.error(response.data.message || "Failed to update item");
      }
    } catch (error) {
      console.log("Update error:", error?.response?.data || error);
      // ✅ FIXED: always pass a string to toast
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.errors
            ? JSON.stringify(error.response.data.errors)
            : error.message || "Update failed"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  // ---------------- STRIP HTML ----------------
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">CHECKLIST</h1>

      <div className="flex justify-between mb-6">
        <div className="relative w-64">
          <input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 w-full shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setShowModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add New Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full w-[700px] bg-white border border-gray-200">
          <thead className="bg-gray-50 border-2">
            <tr>
              {["Id", "Checklist Items", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2"
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                    {item.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 border-2">
                    <p dangerouslySetInnerHTML={{__html: item.checklist_item}}></p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    {Number(item.status) === 1 ? (
                      <span className="px-2 inline-flex justify-center items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                        Enabled
                      </span>
                    ) : (
                      <span className="px-2 inline-flex justify-center items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        <FontAwesomeIcon icon={faTimes} className="mr-1" />
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mr-2"
                      onClick={() => handleEditItem(item.id)}
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
                  colSpan="4"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No items found matching your search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Showing {filteredItems.length} of {checklistItems.length} items
      </div>

      {/* ============================================================ */}
      {/* ADD MODAL — full screen, editor fixed height, footer always visible */}
      {/* ============================================================ */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b shrink-0">
              <h2 className="text-xl font-bold">Add New Checklist Item</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>

            {/* Body — scrollable if needed, but editor has fixed height */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Checklist Item
                </label>
                {/* ✅ fixed-height wrapper — editor cannot expand */}
                <div className="w-full">
                  <Editor
                    apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                    value={newItem.checklist_item}
                    init={editorInit}
                    onEditorChange={(content) =>
                      setNewItem((prev) => ({
                        ...prev,
                        checklist_item: content,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      checked={newItem.status === 1}
                      onChange={() => setNewItem({ ...newItem, status: 1 })}
                    />
                    <span className="ml-2">Enabled</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      checked={newItem.status === 0}
                      onChange={() => setNewItem({ ...newItem, status: 0 })}
                    />
                    <span className="ml-2">Disabled</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer — always visible */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 shrink-0">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                onClick={handleAddItem}
                disabled={!newItem.checklist_item.trim() || addListLoading}
              >
                {addListLoading && (
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
                {addListLoading ? "Adding..." : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* EDIT MODAL — same layout */}
      {/* ============================================================ */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b shrink-0">
              <h2 className="text-xl font-bold">Edit Checklist Item</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Checklist Item
                </label>
                <div className="w-full">
                  <Editor
                    apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                    value={editingItem.checklist_item}
                    init={editorInit}
                    onEditorChange={(content) =>
                      setEditingItem((prev) => ({
                        ...prev,
                        checklist_item: content,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      checked={Number(editingItem.status) === 1}
                      onChange={() =>
                        setEditingItem({ ...editingItem, status: 1 })
                      }
                    />
                    <span className="ml-2">Enabled</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio h-4 w-4 text-blue-600"
                      checked={Number(editingItem.status) === 0}
                      onChange={() =>
                        setEditingItem({ ...editingItem, status: 0 })
                      }
                    />
                    <span className="ml-2">Disabled</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Footer — always visible */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 shrink-0">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 ${
                  updateLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={handleUpdateItem}
                disabled={!editingItem.checklist_item.trim() || updateLoading}
              >
                {updateLoading ? "Updating..." : "Update Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistPage;