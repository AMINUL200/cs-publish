import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const HandleVolume = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editingVolume, setEditingVolume] = useState(null);
  const [formData, setFormData] = useState({
    volume: "",
    issue_no: "",
    from_date: "",
    to_date: "",
    page_no: "",
    image: null
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch volumes from API
  const fetchVolumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/volume/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.status) {
        setVolumes(response.data.data);
        console.log(response.data.data);
        
      } else {
        setError("Failed to fetch volumes");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while fetching volumes");
      console.error("Error fetching volumes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolumes();
  }, []);

  // Handle status toggle - only close open volumes
  const handleToggleStatus = async (volumeId, currentStatus) => {
    try {
      // Only allow closing open volumes, not opening closed ones
      if (currentStatus !== "open") {
        return;
      }

      const newStatus = "close";
      
      const response = await axios.get(
        `${API_URL}api/volume/status/${volumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        // Update the local state to reflect the status change
        setVolumes(prevVolumes => 
          prevVolumes.map(volume => 
            volume.id === volumeId 
              ? { ...volume, status: newStatus }
              : volume
          )
        );
        alert(`Volume status changed to ${newStatus}`);
      } else {
        alert(response.data.message || "Failed to update status");
      }
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while updating status");
      console.error("Error updating volume status:", err);
    }
  };

  // Open popup for adding new volume
  const handleAddVolume = () => {
    setEditingVolume(null);
    setFormData({
      volume: "",
      issue_no: "",
      from_date: "",
      to_date: "",
      page_no: "",
      image: null
    });
    setShowPopup(true);
  };

  // Open popup for editing volume
  const handleEditVolume = (volume) => {
    setEditingVolume(volume);
    setFormData({
      volume: volume.volume || "",
      issue_no: volume.issue_no || "",
      from_date: volume.from_date || "",
      to_date: volume.to_date || "",
      page_no: volume.page_no || "",
      image: null
    });
    setShowPopup(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("volume", formData.volume);
      submitData.append("issue_no", formData.issue_no);
      submitData.append("from_date", formData.from_date);
      submitData.append("to_date", formData.to_date);
      submitData.append("page_no", formData.page_no);
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      let response;
      if (editingVolume) {
        // Update existing volume
        response = await axios.post(
          `${API_URL}api/volume/update/${editingVolume.id}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new volume
        response = await axios.post(
          `${API_URL}api/volume/store`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.data.status) {
        setShowPopup(false);
        fetchVolumes(); // Refresh the list
        alert(editingVolume ? "Volume updated successfully!" : "Volume added successfully!");
      } else {
        alert(response.data.message || "Something went wrong!");
      }
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred!");
      console.error("Error submitting form:", err);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete volume
  const handleDeleteVolume = async (volumeId) => {
    if (!window.confirm("Are you sure you want to delete this volume?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}api/volume/delete/${volumeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        fetchVolumes(); // Refresh the list
        alert("Volume deleted successfully!");
      } else {
        alert(response.data.message || "Failed to delete volume");
      }
    } catch (err) {
      alert(err.response?.data?.message || "An error occurred while deleting volume");
      console.error("Error deleting volume:", err);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setEditingVolume(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading volumes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500 text-lg">{error}</div>
        <button 
          onClick={fetchVolumes}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Journal Volumes</h1>
        <div className="flex space-x-3">
          <button 
            onClick={fetchVolumes}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Refresh
          </button>
          <button 
            onClick={handleAddVolume}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Add Volume
          </button>
        </div>
      </div>

      {volumes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No volumes found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volumes.map((volume) => (
            <div key={volume.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              {/* Volume Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={`${STORAGE_URL}${volume.image}`} 
                  
                  alt={`Volume ${volume.volume}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                  }}
                />
              </div>
              
              {/* Volume Details */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Volume {volume.volume}
                    </h3>
                    {volume.issue_no && (
                      <p className="text-sm text-gray-600 mt-1">
                        {volume.issue_no}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      volume.status === "open" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {volume.status === "open" ? "Open" : "Closed"}
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      ID: {volume.id}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  {volume.page_no && (
                    <div className="flex justify-between">
                      <span className="font-medium">Pages:</span>
                      <span>{volume.page_no}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="font-medium">From Date:</span>
                    <span>{formatDate(volume.from_date)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">To Date:</span>
                    <span>{formatDate(volume.to_date)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Created:</span>
                    <span>{formatDate(volume.created_at)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Updated:</span>
                    <span>{formatDate(volume.updated_at)}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 flex space-x-2">
                  <button 
                    onClick={() => handleEditVolume(volume)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteVolume(volume.id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                  {/* Only show Close button for open volumes */}
                  {volume.status === "open" && (
                    <button 
                      onClick={() => handleToggleStatus(volume.id, volume.status)}
                      className="flex-1 px-3 py-2 bg-orange-500 text-white text-sm rounded hover:bg-orange-600 transition-colors"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingVolume ? "Edit Volume" : "Add New Volume"}
              </h2>
              <button 
                onClick={closePopup}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume Number *
                  </label>
                  <input
                    type="text"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter volume number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Number
                  </label>
                  <input
                    type="text"
                    name="issue_no"
                    value={formData.issue_no}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Issue 01, Spring 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Numbers
                  </label>
                  <input
                    type="text"
                    name="page_no"
                    value={formData.page_no}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 1-150, 50-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date *
                  </label>
                  <input
                    type="date"
                    name="from_date"
                    value={formData.from_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date *
                  </label>
                  <input
                    type="date"
                    name="to_date"
                    value={formData.to_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume Image {!editingVolume && "*"}
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    required={!editingVolume}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {editingVolume && (
                    <p className="text-xs text-gray-500 mt-1">
                      Leave empty to keep current image
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={formLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {formLoading ? "Processing..." : (editingVolume ? "Update" : "Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HandleVolume;