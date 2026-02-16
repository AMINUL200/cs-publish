import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { useNavigate } from 'react-router-dom';

const HandleTeams = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState('Our Team');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch teams data
  const fetchTeamsData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}api/team-admin`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.data.status) {
        setTeamsData(res.data.data);
        console.log('Fetched teams data:', res.data.data);
        setSectionTitle(res.data.section || 'Our Team');
      }
    } catch (err) {
      console.error('Error fetching teams data:', err);
      toast.error(err.response?.data?.message || 'Error fetching teams data');
    } finally {
      setLoading(false);
    }
  };

  // Delete team member
  const handleDeleteTeam = async (teamId, memberName) => {
    if (!window.confirm(`Are you sure you want to delete "${memberName}"?`)) {
      return;
    }

    try {
      setDeleteLoading(teamId);
      const res = await axios.delete(`${API_URL}api/contents/${teamId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.data.status) {
        toast.success(res.data.message || 'Team member deleted successfully');
        // Remove from local state
        setTeamsData(prev => prev.filter(item => item.id !== teamId));
      }
    } catch (err) {
      console.error('Error deleting team member:', err);
      toast.error(err.response?.data?.message || 'Error deleting team member');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Edit team member
  const handleEditTeam = (teamId) => {
    navigate(`/setting/add-team?update=${teamId}`);
  };

  // Add new team member
  const handleAddTeam = () => {
    navigate('/setting/add-team');
  };

  useEffect(() => {
    fetchTeamsData();
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
              Manage team members and their details
            </p>
          </div>
          
          <button
            onClick={handleAddTeam}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <span>+</span>
            Add New Team Member
          </button>
        </div>

        {/* Teams Grid */}
        {teamsData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Team Members Found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first team member.
            </p>
            <button
              onClick={handleAddTeam}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Add Your First Team Member
            </button>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Team Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{teamsData.length}</div>
                  <div className="text-sm text-gray-600">Total Members</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {teamsData.filter(item => item.status === '1').length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {teamsData.filter(item => item.status === '0').length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {teamsData.filter(item => item.image).length}
                  </div>
                  <div className="text-sm text-gray-600">With Images</div>
                </div>
              </div>
            </div>

            {/* Teams Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {teamsData.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  {/* Image */}
                  <div className="relative">
                    {member.image ? (
                      <img
                        src={`${STORAGE_URL}${member.image}`}
                        alt={member.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(
                            member.title ? member.title.substring(0, 30) : 'Team Member'
                          )}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-white text-4xl">👤</div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === '1'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {member.status === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title/Name */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {member.title || 'Unnamed Member'}
                    </h3>

                    {/* Position/Role */}
                    {member.position && (
                      <p className="text-blue-600 font-medium mb-3">
                        {member.position}
                      </p>
                    )}

                    {/* Short Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {stripHtml(member.short_description)}
                    </p>

                    {/* Team Member Metadata */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Member Details:</h4>
                      <div className="flex flex-wrap gap-2">
                        {member.department && (
                          <span className="inline-flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                            🏢 {member.department}
                          </span>
                        )}
                        {member.experience && (
                          <span className="inline-flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                            📅 {member.experience}
                          </span>
                        )}
                        {member.email && (
                          <span className="inline-flex items-center text-purple-600 text-xs bg-purple-50 px-2 py-1 rounded">
                            ✉️ {member.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Social Links */}
                    {(member.facebook_link || member.twitter_link || member.linkedin_link || member.instagram_link) && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Social Links:</h4>
                        <div className="flex gap-2">
                          {member.facebook_link && (
                            <a href={member.facebook_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                              <span className="text-lg">📘</span>
                            </a>
                          )}
                          {member.twitter_link && (
                            <a href={member.twitter_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                              <span className="text-lg">🐦</span>
                            </a>
                          )}
                          {member.linkedin_link && (
                            <a href={member.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                              <span className="text-lg">💼</span>
                            </a>
                          )}
                          {member.instagram_link && (
                            <a href={member.instagram_link} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                              <span className="text-lg">📷</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Created:</span>{' '}
                          {new Date(member.created_at).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>{' '}
                          <span className="capitalize">{member.type || 'team'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleEditTeam(member.id)}
                        className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(member.id, member.title || 'Unnamed Member')}
                        disabled={deleteLoading === member.id}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors ${
                          deleteLoading === member.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        {deleteLoading === member.id ? (
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
        {teamsData.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchTeamsData}
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

export default HandleTeams;