import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HandleEventAndConference = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [conferences, setConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch conferences list
  const fetchConferences = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/conference`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.status) {
        setConferences(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to fetch conferences");
      console.error("Error fetching conferences:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete conference
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this conference?")) {
      try {
        const response = await axios.delete(`${API_URL}api/conference/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.status) {
          alert("Conference deleted successfully");
          fetchConferences(); // Refresh the list
        } else {
          alert(response.data.message);
        }
      } catch (err) {
        alert("Failed to delete conference");
        console.error("Error deleting conference:", err);
      }
    }
  };

  // Handle edit - navigate to add/edit page with conference ID
  const handleEdit = (conference) => {
    navigate("/add-event-conference", { 
      state: { 
        conferenceData: conference,
        isEdit: true 
      } 
    });
  };

  // Handle add - navigate to add/edit page without data
  const handleAdd = () => {
    navigate("/add-event-conference", { 
      state: { 
        isEdit: false 
      } 
    });
  };

  useEffect(() => {
    fetchConferences();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading conferences...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Conferences & Events</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
        >
          Add New Conference
        </button>
      </div>

      {conferences.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No conferences found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conferences.map((conference) => (
                <tr key={conference.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {conference.image && (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={`${STORAGE_URL}${conference.image}`}
                            alt={conference.image_alt}
                          />
                        </div>
                      )}
                      <div className={`${conference.image ? 'ml-4' : ''}`}>
                        <div className="text-sm font-medium text-gray-900">
                          {conference.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {conference.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{conference.catagory}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{conference.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(conference.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        conference.status === "1"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {conference.status === "1" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(conference)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(conference.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition duration-200"
                      >
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
  );
};

export default HandleEventAndConference;