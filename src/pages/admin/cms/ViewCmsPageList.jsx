import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/common/Loader";
import { 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  Search, 
  Filter,
  FileText,
  Calendar,
  RefreshCw
} from "lucide-react";

const ViewCmsPageList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [cmsPages, setCmsPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Fetch all CMS pages
  const fetchCmsPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/cms-pages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setCmsPages(response.data.data || []);
      console.log("Fetched CMS pages:", response.data.data);
    } catch (error) {
      console.error("Error fetching CMS pages:", error);
      alert("Failed to fetch CMS pages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCmsPages();
  }, []);

  // Delete CMS page
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this CMS page?")) {
      return;
    }

    try {
      setDeletingId(id);
      await axios.delete(
        `${API_URL}api/cms-pages/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      alert("CMS page deleted successfully!");
      fetchCmsPages(); // Refresh the list
    } catch (error) {
      console.error("Error deleting CMS page:", error);
      alert("Failed to delete CMS page");
    } finally {
      setDeletingId(null);
    }
  };

  // Edit CMS page
  const handleEdit = (id) => {
    navigate(`/add-cms-page?update=${id}`);
  };

  // View CMS page details
  const handleView = (slug) => {
    navigate(`/cms-pages/${slug}`);
  };

  // Add new CMS page
  const handleAddNew = () => {
    navigate("/add-cms-page");
  };

  // Filter and search CMS pages
  const filteredPages = cmsPages.filter(page => {
    const matchesSearch = page.page_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.heading?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || page.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get badge color based on type
  const getTypeBadge = (type) => {
    switch (type) {
      case "support_and_contact":
        return "bg-green-100 text-green-800";
      case "policies_and_access":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get display name for type
  const getTypeDisplayName = (type) => {
    switch (type) {
      case "support_and_contact":
        return "Support & Contact";
      case "policies_and_access":
        return "Policies & Access";
      default:
        return type;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">CMS Pages</h1>
            <p className="text-gray-600 mt-2">
              Manage your website's content pages
            </p>
          </div>
          <button
            onClick={handleAddNew}
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Page
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Search size={16} />
                Search Pages
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or heading..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter by Type */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Filter size={16} />
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="support_and_contact">support_and_Contact</option>
                <option value="policies_and_access">policies_and_Access</option>
              </select>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {filteredPages.length} of {cmsPages.length} pages
            </div>
            <button
              onClick={fetchCmsPages}
              className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* CMS Pages List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto text-gray-400 mb-4" size={64} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No CMS Pages Found
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterType !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by creating your first CMS page"
                }
              </p>
              {(searchTerm || filterType !== "all") ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilterType("all");
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 mx-auto"
                >
                  <Filter size={16} />
                  Clear Filters
                </button>
              ) : (
                <button
                  onClick={handleAddNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  Add New Page
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Heading
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Created
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Updated
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="text-blue-600" size={20} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {page.page_title}
                            </div>
                            <div className="text-sm text-gray-500">
                              /{page.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeBadge(page.type)}`}>
                          {getTypeDisplayName(page.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {page.heading}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(page.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(page.updated_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(page.id)}
                            className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-50 transition-colors"
                            title="Edit Page"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(page.id)}
                            disabled={deletingId === page.id}
                            className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Delete Page"
                          >
                            {deletingId === page.id ? (
                              <RefreshCw size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats */}
        {filteredPages.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={24} />
                <div>
                  <p className="text-sm text-blue-600 font-medium">Total Pages</p>
                  <p className="text-2xl font-bold text-blue-900">{cmsPages.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="text-green-600" size={24} />
                <div>
                  <p className="text-sm text-green-600 font-medium">Support & Contact</p>
                  <p className="text-2xl font-bold text-green-900">
                    {cmsPages.filter(page => page.type === 'support_and_contact').length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileText className="text-purple-600" size={24} />
                <div>
                  <p className="text-sm text-purple-600 font-medium">Policies & Access</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {cmsPages.filter(page => page.type === 'policies_and_access').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewCmsPageList;