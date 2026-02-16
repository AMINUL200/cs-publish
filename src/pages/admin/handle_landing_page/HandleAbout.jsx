import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HandleAbout = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [aboutData, setAboutData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch about data list
  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}api/abouts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.status === true) {
        setAboutData(response.data.data);
        toast.success("About data fetched successfully!");
      }
    } catch (error) {
      console.error("Error fetching about data:", error);
      toast.error("Failed to fetch about data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Delete about entry
  const handleDeleteAbout = async (id) => {
    if (!window.confirm("Are you sure you want to delete this about entry?")) {
      return;
    }

    try {
      const response = await axios.delete(`${API_URL}api/abouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("About entry deleted successfully!");
        fetchAboutData();
      }
    } catch (error) {
      console.error("Error deleting about entry:", error);
      toast.error("Failed to delete about entry");
    }
  };

  // Navigate to add page
  const handleAddAbout = () => {
    navigate("/landing-page/add-about");
  };

  // Navigate to edit page
  const handleEditAbout = (id) => {
    navigate(`/landing-page/add-about?update=${id}`);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About Page Management</h1>
            <p className="text-gray-600 mt-2">Manage your about page content and images</p>
          </div>
          <button
            onClick={handleAddAbout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add About Content
          </button>
        </div>

        {/* About Data List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : aboutData.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              No about content found. Click "Add About Content" to create one.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar ">
              <table className="min-w-full divide-y divide-gray-200 pb-10">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Button Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {aboutData.map((about) => (
                    <tr key={about.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        #{about.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {about.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                        <div className="truncate" title={about.description || "No description"} dangerouslySetInnerHTML={{__html:about.description}} >
                          {/* {about.description || "N/A"} */}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {/* Image 1 */}
                          {about.image1 ? (
                            <div className="relative group">
                              <img
                                // src={about?.image1}
                                src={`${STORAGE_URL}${about.image1}`}
                                alt={about.image1_alt || "About image 1"}
                                className="h-12 w-12 object-cover rounded-lg shadow-sm"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
                                <span className="text-white text-xs">1</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">1</span>
                            </div>
                          )}

                          {/* Image 2 */}
                          {about.image2 ? (
                            <div className="relative group">
                              <img
                                src={`${STORAGE_URL}${about.image2}`}
                                alt={about.image2_alt || "About image 2"}
                                className="h-12 w-12 object-cover rounded-lg shadow-sm"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
                                <span className="text-white text-xs">2</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">2</span>
                            </div>
                          )}

                          {/* Image 3 */}
                          {about.image3 ? (
                            <div className="relative group">
                              <img
                                src={`${STORAGE_URL}${about.image3}`}
                                
                                alt={about.image3_alt || "About image 3"}
                                className="h-12 w-12 object-cover rounded-lg shadow-sm"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
                                <span className="text-white text-xs">3</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">3</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {about.button_name || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(about.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleEditAbout(about.id)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 transition duration-150 px-3 py-1 rounded-lg hover:bg-blue-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAbout(about.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 transition duration-150 px-3 py-1 rounded-lg hover:bg-red-50"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
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

       
      </div>
    </div>
  );
};

export default HandleAbout;