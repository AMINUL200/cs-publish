import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  //   faEdit,
  //   faTrash,
  //   faPlus,
  //   faSave,
  //   faTimes,
  faFacebook,
  faTwitter,
  faLinkedin,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import Loader from "../../../components/common/Loader";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import TextEditor from "../../../components/common/TextEditor";

const ManageEditorial = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const TINYMCE_API_KEY = import.meta.env.VITE_TEXT_EDITOR_API_KEY;

  const [editorialCategories, setEditorialCategories] = useState([]);
  const [editorialMembers, setEditorialMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    editorial_category_id: "",
    title: "",
    short_description: "",
    long_description: "",
    facebook_link: "",
    twitter_link: "",
    linkedin_link: "",
    instagram_link: "",
    status: 1,
    is_order: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch editorial categories
  const fetchEditorialCategories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/admin/editorial-categories`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        },
      );

      if (response.status === 200 && response.data.status) {
        setEditorialCategories(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch editorial categories",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching editorial categories");
    }
  };

  // Fetch editorial members
  const fetchEditorialMembers = async () => {
    try {
      const response = await axios.get(
        `${API_URL}api/admin/editorial-details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        },
      );

      if (response.status === 200 && response.data.status) {
        setEditorialMembers(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch editorial members",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching editorial members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditorialCategories();
    fetchEditorialMembers();
  }, [token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };
  const handleLongDescriptionChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      long_description: content,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      editorial_category_id: "",
      title: "",
      short_description: "",
      long_description: "",
      facebook_link: "",
      twitter_link: "",
      linkedin_link: "",
      instagram_link: "",
      status: 1,
      is_order: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  // Handle edit
  const handleEdit = (member) => {
    setEditingId(member.id);
    setFormData({
      editorial_category_id: member.editorial_category_id,
      title: member.title,
      short_description: member.short_description || "",
      long_description: member.long_description || "",
      facebook_link: member.facebook_link || "",
      twitter_link: member.twitter_link || "",
      linkedin_link: member.linkedin_link || "",
      instagram_link: member.instagram_link || "",
      status: parseInt(member.status),
      is_order: member.is_order,
    });
    if (member.image) {
      setImagePreview(`${STORAGE_URL}${member.image}`);
    }
    setShowForm(true);
  };

  // Handle submit (Create/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append image if exists
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      // For PUT requests, Laravel needs _method spoofing
      //   if (editingId) {
      //     formDataToSend.append("_method", "PUT");
      //   }

      const url = editingId
        ? `${API_URL}api/admin/editorial-details/update/${editingId}`
        : `${API_URL}api/admin/editorial-details`;

      const response = await axios({
        method: "POST",
        url: url,
        data: formDataToSend,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast.success(
          response.data.message ||
            `Editorial member ${editingId ? "updated" : "created"} successfully`,
        );
        resetForm();
        fetchEditorialMembers();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this editorial member?")
    )
      return;

    setActionLoading(true);
    try {
      const response = await axios.delete(
        `${API_URL}api/admin/editorial-details/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        toast.success(
          response.data.message || "Editorial member deleted successfully",
        );
        fetchEditorialMembers();
      } else {
        toast.error(
          response.data.message || "Failed to delete editorial member",
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while deleting");
    } finally {
      setActionLoading(false);
    }
  };

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = editorialCategories.find(
      (cat) => cat.id === parseInt(categoryId),
    );
    return category ? category.name : "N/A";
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          MANAGE EDITORIAL MEMBERS
        </h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            Add Editorial Member
          </button>
        )}
        {showForm && (
          <button
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2" />
            Cancel
          </button>
        )}
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            {editingId ? "Edit Editorial Member" : "Add New Editorial Member"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Editorial Category Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Editorial Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="editorial_category_id"
                  value={formData.editorial_category_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {editorialCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name} ({category.journal?.j_title || "N/A"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name/Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Prof. John Smith"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleInputChange}
                  placeholder="e.g., Executive Editor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="is_order"
                  value={formData.is_order}
                  onChange={handleInputChange}
                  placeholder="e.g., 1, 2, 3..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="1"
                />
              </div>

              {/* Long Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Long Description
                </label>

                <div className="w-full h-[450px]">
                  <TextEditor
                    apiKey={TINYMCE_API_KEY}
                    value={formData.long_description}
                    onChange={handleLongDescriptionChange}
                  />
                </div>
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded-full"
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="flex items-center mt-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status === 1}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
              </div>

              {/* Social Media Links */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Social Media Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      <FontAwesomeIcon
                        icon={faFacebook}
                        className="mr-2 text-blue-600"
                      />
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook_link"
                      value={formData.facebook_link}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      <FontAwesomeIcon
                        icon={faTwitter}
                        className="mr-2 text-blue-400"
                      />
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter_link"
                      value={formData.twitter_link}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      <FontAwesomeIcon
                        icon={faLinkedin}
                        className="mr-2 text-blue-700"
                      />
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin_link"
                      value={formData.linkedin_link}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      <FontAwesomeIcon
                        icon={faInstagram}
                        className="mr-2 text-pink-600"
                      />
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram_link"
                      value={formData.instagram_link}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/username"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={actionLoading}
                className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center transition-colors duration-300 ${
                  actionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <FontAwesomeIcon icon={faSave} className="mr-2" />
                {actionLoading ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Si.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Short Description
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Order
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {editorialMembers.length > 0 ? (
              editorialMembers.map((member, index) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {getCategoryName(member.editorial_category_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {member.image ? (
                      <img
                        src={`${STORAGE_URL}${member.image}`}
                        alt={member.title}
                        className="h-12 w-12 object-cover rounded-full"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {member.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {member.short_description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2 text-center">
                    {member.is_order}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        member.status === "1" || member.status === 1
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {member.status === "1" || member.status === 1
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>
                  <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    <button
                      onClick={() => handleEdit(member)}
                      disabled={actionLoading}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-300 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      disabled={actionLoading}
                      className={`text-white px-3 py-1 rounded transition-colors duration-300 ${
                        actionLoading
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600 cursor-pointer"
                      }`}
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-4 text-center text-sm text-gray-500 border-2"
                >
                  No editorial members found. Click "Add Editorial Member" to
                  create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {editorialMembers.length > 0 ? 1 : 0} to{" "}
          {editorialMembers.length} of {editorialMembers.length} rows
        </div>
      </div>
    </div>
  );
};

export default ManageEditorial;
