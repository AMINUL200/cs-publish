import {
  faEdit,
  faTrash,
  faSearch,
  faPlus,
  faFileAlt,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import Loader from "../../../components/common/Loader";

const ViewJournal = () => {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  const [journalData, setJournalData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const dropdownRef = useRef(null);

  // Fetch journals
  const fetchJournals = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.status === 200 && response.data.success) {
        setJournalData(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch journals");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching journals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [token]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter by title or category
  const filteredJournals = journalData.filter((journal) => {
    const term = searchTerm.toLowerCase();
    return (
      journal.j_title.toLowerCase().includes(term) ||
      (journal.category?.category_name || "").toLowerCase().includes(term)
    );
  });

  // Delete journal
  const handleDelete = async (id) => {
    if (!id) return;
    setDeleteLoading(true);
    try {
      const res = await axios.delete(`${API_URL}api/admin/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        toast.success(res.data.message || "Journal deleted");
        fetchJournals();
      } else {
        toast.error(res.data.message || "Failed to delete journal");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while deleting journal");
    } finally {
      setDeleteLoading(false);
      setOpenDropdownId(null);
    }
  };

  // Navigate to edit
  const handleNavigate = (id) => {
    setOpenDropdownId(null);
    navigate(`/article-manger/journal/edit-journal/${id}`);
  };

  // Navigate to articles page with journal ID
  const handleViewArticles = (id) => {
    setOpenDropdownId(null);
    navigate(`/article-manger/journal/ethics/?journal_id=${id}`);
  };

  // Toggle dropdown
  const toggleDropdown = (id, e) => {
    e.stopPropagation();
    setOpenDropdownId((prev) => (prev === id ? null : id));
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">VIEW JOURNALS</h1>
        <Link
          to="/article-manger/journal/add-journal"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Add Journal
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
            placeholder="Search by title or category..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-visible">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Si.No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Journal ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Title
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredJournals.length > 0 ? (
              filteredJournals.map((journal, index) => (
                <tr key={journal.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {journal.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2">
                    {journal.j_title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-2 text-center">
                    {journal.image ? (
                      <img
                        src={`${STORAGE_URL}${journal.image}`}
                        alt={journal.j_title}
                        className="h-12 w-12 object-cover rounded mx-auto"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    ₹{journal.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {journal.status ? "Active" : "Inactive"}
                  </td>
                  <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    <div className="relative inline-block">
                      {/* Three Dot Button */}
                      <button
                        onClick={(e) => toggleDropdown(journal.id, e)}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Open actions menu"
                      >
                        <FontAwesomeIcon
                          icon={faEllipsisV}
                          className="text-gray-600"
                        />
                      </button>

                      {/* Dropdown Menu */}
                      {openDropdownId === journal.id && (
                        <div
                          className="absolute right-0 z-50 mt-2 w-44 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                          style={{ top: "100%" }}
                        >
                          {/* Articles */}
                          <button
                            onClick={() => handleViewArticles(journal.id)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors duration-150 border-b border-gray-100"
                          >
                            <FontAwesomeIcon
                              icon={faFileAlt}
                              className="text-blue-500"
                            />
                            Ethics
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleNavigate(journal.id)}
                            disabled={deleteLoading}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 flex items-center gap-3 transition-colors duration-150 border-b border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              className="text-green-500"
                            />
                            Edit
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(journal.id)}
                            disabled={deleteLoading}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className="text-red-500"
                            />
                            {deleteLoading ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No journals found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {filteredJournals.length > 0 ? 1 : 0} to{" "}
          {filteredJournals.length} of {journalData.length} rows
        </div>
      </div>
    </div>
  );
};

export default ViewJournal;