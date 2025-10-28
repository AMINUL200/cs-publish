import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { useNavigate } from 'react-router-dom';

const HandleResearch = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [researchData, setResearchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState('Research & Innovation');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch research data
  const fetchResearchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}api/research-admin`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.data.status) {
        setResearchData(res.data.data);
        setSectionTitle(res.data.section || 'Research & Innovation');
      }
    } catch (err) {
      console.error('Error fetching research data:', err);
      toast.error(err.response?.data?.message || 'Error fetching research data');
    } finally {
      setLoading(false);
    }
  };

  // Delete research item
  const handleDeleteResearch = async (researchId, researchTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${researchTitle}"?`)) {
      return;
    }

    try {
      setDeleteLoading(researchId);
      const res = await axios.delete(`${API_URL}api/contents/${researchId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.data.status) {
        toast.success(res.data.message || 'Research deleted successfully');
        // Remove from local state
        setResearchData(prev => prev.filter(item => item.id !== researchId));
      }
    } catch (err) {
      console.error('Error deleting research:', err);
      toast.error(err.response?.data?.message || 'Error deleting research');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Edit research item
  const handleEditResearch = (researchId) => {
    navigate(`/setting/add-research?update=${researchId}`);
  };

  // Add new research
  const handleAddResearch = () => {
    navigate('/setting/add-research');
  };

  useEffect(() => {
    fetchResearchData();
  }, []);

  // Strip HTML tags from description
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header with Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {sectionTitle}
            </h1>
            <p className="text-gray-600">
              Manage research  projects
            </p>
          </div>
          
          <button
            onClick={handleAddResearch}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <span>+</span>
            Add New Research
          </button>
        </div>

        {/* Research Grid */}
        {researchData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔬</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Research Projects Found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first research project.
            </p>
            <button
              onClick={handleAddResearch}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Add Your First Research
            </button>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Research Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{researchData.length}</div>
                  <div className="text-sm text-gray-600">Total Projects</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {researchData.filter(item => item.status === '1').length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {researchData.filter(item => item.status === '0').length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {researchData.filter(item => item.image).length}
                  </div>
                  {/* <div className="text-sm text-gray-600">With Images</div> */}
                </div>
              </div>
            </div>

            {/* Research Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {researchData.map((research) => (
                <div
                  key={research.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  {/* Image */}
                  <div className="relative">
                    {research.image ? (
                      <img
                        src={research.image}
                        alt={research.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(
                            research.title.substring(0, 30)
                          )}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-white text-4xl">🔬</div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          research.status === '1'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {research.status === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {research.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {stripHtml(research.short_description)}
                    </p>

                    {/* Social Media Links */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Social Links:</h4>
                      <div className="flex flex-wrap gap-2">
                        {research.facebook_link && (
                          <span className="inline-flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                            📘 Facebook
                          </span>
                        )}
                        {research.twitter_link && (
                          <span className="inline-flex items-center text-blue-400 text-xs bg-blue-50 px-2 py-1 rounded">
                            🐦 Twitter
                          </span>
                        )}
                        {research.linkedin_link && (
                          <span className="inline-flex items-center text-blue-700 text-xs bg-blue-50 px-2 py-1 rounded">
                            💼 LinkedIn
                          </span>
                        )}
                        {research.instagram_link && (
                          <span className="inline-flex items-center text-pink-600 text-xs bg-pink-50 px-2 py-1 rounded">
                            📷 Instagram
                          </span>
                        )}
                        {!research.facebook_link && 
                         !research.twitter_link && 
                         !research.linkedin_link && 
                         !research.instagram_link && (
                          <span className="text-gray-500 text-xs">No social links</span>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Created:</span>{' '}
                          {new Date(research.created_at).toLocaleDateString()}
                        </div>
                        {/* <div>
                          <span className="font-medium">Type:</span>{' '}
                          <span className="capitalize">{research.type}</span>
                        </div> */}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleEditResearch(research.id)}
                        className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteResearch(research.id, research.title)}
                        disabled={deleteLoading === research.id}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors ${
                          deleteLoading === research.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        {deleteLoading === research.id ? (
                          <>
                            <span className="animate-spin">⏳</span>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <span>🗑️</span>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Refresh Button */}
        {researchData.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchResearchData}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Refresh Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleResearch;