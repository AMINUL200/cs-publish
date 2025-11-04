import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Edit, FileText, Shield, Cookie } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HandleTermsAndCondition = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [cmsData, setCmsData] = useState([]);
  const navigate = useNavigate();

  const fetchCmsList = async () => {
    try {
      const response = await axios.get(`${API_URL}api/terms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setCmsData(response.data.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getIconForPage = (slug) => {
    switch (slug) {
      case "terms-condition":
        return <FileText className="w-6 h-6 text-blue-600" />;
      case "legal-disclaimer":
        return <Shield className="w-6 h-6 text-red-600" />;
      case "privacy-cookies":
        return <Cookie className="w-6 h-6 text-green-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  const handleEdit = (id) => {
    if (!id) return;

    navigate(`/update-terms/${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    fetchCmsList();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Pages</h1>
        <p className="text-gray-600 mt-2">
          Edit and manage your website's terms, policies, and legal pages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cmsData.map((page) => (
          <div
            key={page.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              {/* Header with icon and title */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getIconForPage(page.slug)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {page.page_title}
                    </h3>
                    <p className="text-sm text-gray-500 capitalize">
                      {page.slug.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Title
                  </label>
                  <p className="text-sm text-gray-800 mt-1 line-clamp-2">
                    {page.title}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Description
                  </label>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3" dangerouslySetInnerHTML={{__html:page.description}}>
                    {/* {page.description} */}
                  </p>
                </div>

                {/* Dates */}
                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <div>
                    <span className="font-medium">Created:</span>
                    <br />
                    {formatDate(page.created_at)}
                  </div>
                  <div className="text-right">
                    <span className="font-medium">Updated:</span>
                    <br />
                    {formatDate(page.updated_at)}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleEdit(page.id)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Page</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {cmsData.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No pages found
          </h3>
          <p className="text-gray-600">
            There are no pages to display at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default HandleTermsAndCondition;
