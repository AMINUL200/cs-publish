import { faEdit, faTrash, faSearch, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../../../components/common/Loader";

const ViewCategories = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;

  const [categoryData, setCategoryData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        setCategoryData(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // Filter by categoryName or groupName
  const filteredCategories = categoryData.filter((cat) => {
    const term = searchTerm.toLowerCase();
    return (
      cat.category_name.toLowerCase().includes(term) ||
      (cat.group?.group_name || "").toLowerCase().includes(term)
    );
  });

  // Handle delete
  const handleDelete = async (id) => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`${API_URL}api/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success(res.data.message || "Category deleted");
        fetchCategories();
      } else {
        toast.error(res.data.message || "Failed to delete");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while deleting");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Navigate to edit page
  const handleNavigate = (id) => {
    navigate(`/categories/edit/${id}`);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">VIEW CATEGORIES</h1>
        <Link
          to="/categories/add-categories"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="flex justify-end mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search by category or group name..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Si.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Group Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Enable
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Created At
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((cat, index) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                    {cat.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {cat.group?.group_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {cat.category_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {cat.status === "1" ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {cat.created_at.split("T")[0]} 
                  </td>
                  <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    <button
                      onClick={() => handleNavigate(cat.id)}
                      disabled={deleteLoading}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 cursor-pointer transition-colors duration-300"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={deleteLoading}
                      className={`text-white px-3 py-1 rounded transition-colors duration-300 ${
                        deleteLoading
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
                  colSpan="6"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No categories found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {filteredCategories.length > 0 ? 1 : 0} to {filteredCategories.length} of{" "}
          {categoryData.length} rows
        </div>
      </div>
    </div>
  );
};

export default ViewCategories;
