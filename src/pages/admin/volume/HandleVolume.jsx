import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

const HandleVolume = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  
  const [volumes, setVolumes] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [journalsLoading, setJournalsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [editingVolume, setEditingVolume] = useState(null);
  const [formData, setFormData] = useState({
    journal_id: "",
    volume: "",
    issue_no: "",
    from_date: "",
    to_date: "",
    page_no: "",
    image: null,
    issue_type: "",
    issue_theme: "",
    keywords: "",
    editor_name: "",
    issn_number: "",
    doi: "",
    copyright_type: "",
    copyright_value: null,
    web_url: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  
  // State for image previews
  const [imagePreview, setImagePreview] = useState(null);
  const [copyrightImagePreview, setCopyrightImagePreview] = useState(null);
  
  // Refs for file inputs
  const imageInputRef = useRef(null);
  const copyrightImageInputRef = useRef(null);

  // Fetch journals list
  const fetchJournals = async () => {
    try {
      setJournalsLoading(true);
      const response = await axios.get(`${API_URL}api/admin/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });
      
      if (response.data.success) {
        setJournals(response.data.data);
      } else {
        console.error("Failed to fetch journals");
      }
    } catch (err) {
      console.error("Error fetching journals:", err);
    } finally {
      setJournalsLoading(false);
    }
  };

  // Fetch volumes from API
  const fetchVolumes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/volume/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
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
    fetchJournals();
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
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
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

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle copyright image file selection and preview
  const handleCopyrightImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        copyright_value: file
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setCopyrightImagePreview(previewUrl);
    }
  };

  // Handle copyright URL input change
  const handleCopyrightUrlChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      copyright_value: value
    }));
  };

  // Open popup for adding new volume
  const handleAddVolume = () => {
    setEditingVolume(null);
    setFormData({
      journal_id: "",
      volume: "",
      issue_no: "",
      from_date: "",
      to_date: "",
      page_no: "",
      image: null,
      issue_type: "",
      issue_theme: "",
      keywords: "",
      editor_name: "",
      issn_number: "",
      doi: "",
      copyright_type: "",
      copyright_value: null,
      web_url: ""
    });
    setImagePreview(null);
    setCopyrightImagePreview(null);
    setShowPopup(true);
  };

  // Open popup for editing volume
  const handleEditVolume = (volume) => {
    setEditingVolume(volume);
    setFormData({
      journal_id: volume.journal_id || "",
      volume: volume.volume || "",
      issue_no: volume.issue_no || "",
      from_date: volume.from_date || "",
      to_date: volume.to_date || "",
      page_no: volume.page_no || "",
      image: null,
      issue_type: volume.issue_type || "",
      issue_theme: volume.issue_theme || "",
      keywords: volume.keywords || "",
      editor_name: volume.editor_name || "",
      issn_number: volume.issn_number || "",
      doi: volume.doi || "",
      copyright_type: volume.copyright_type || "",
      copyright_value: volume.copyright_value || null,
      web_url: volume.web_url || ""
    });
    
    // Set image previews for existing images
    if (volume.image) {
      setImagePreview(`${STORAGE_URL}${volume.image}`);
    } else {
      setImagePreview(null);
    }
    
    // Set copyright preview based on type
    if (volume.copyright_type === "image" && volume.copyright_value) {
      setCopyrightImagePreview(`${STORAGE_URL}${volume.copyright_value}`);
    } else {
      setCopyrightImagePreview(null);
    }
    
    setShowPopup(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      handleImageChange(e);
    } else if (name === "copyright_value" && formData.copyright_type === "image") {
      handleCopyrightImageChange(e);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle copyright type change
  const handleCopyrightTypeChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      copyright_type: value,
      copyright_value: null
    }));
    setCopyrightImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.journal_id) {
      alert("Please select a journal");
      return;
    }
    
    setFormLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("journal_id", formData.journal_id);
      submitData.append("volume", formData.volume);
      submitData.append("issue_no", formData.issue_no);
      submitData.append("from_date", formData.from_date);
      submitData.append("to_date", formData.to_date);
      submitData.append("page_no", formData.page_no);
      submitData.append("issue_type", formData.issue_type);
      submitData.append("issue_theme", formData.issue_theme);
      submitData.append("keywords", formData.keywords);
      submitData.append("editor_name", formData.editor_name);
      submitData.append("issn_number", formData.issn_number);
      submitData.append("doi", formData.doi);
      submitData.append("copyright_type", formData.copyright_type);
      submitData.append("web_url", formData.web_url);
      
      // Handle copyright value based on type
      if (formData.copyright_type === "image") {
        if (formData.copyright_value && typeof formData.copyright_value !== 'string') {
          submitData.append("copyright_image", formData.copyright_value);
        }
      } else if (formData.copyright_type === "url") {
        if (formData.copyright_value) {
          submitData.append("copyright_image", formData.copyright_value);
        }
      }
      
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // Debugging: Log form data before submission
      for (let pair of submitData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
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
        console.error("Error response from server:", response.data);
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

  // Get journal title by ID
  const getJournalTitle = (journalId) => {
    const journal = journals.find(j => j.id === journalId);
    return journal ? journal.j_title : "Unknown Journal";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Close popup and cleanup preview URLs
  const closePopup = () => {
    setShowPopup(false);
    setEditingVolume(null);
    // Cleanup preview URLs
    if (imagePreview && !imagePreview.startsWith(STORAGE_URL)) {
      URL.revokeObjectURL(imagePreview);
    }
    if (copyrightImagePreview && !copyrightImagePreview.startsWith(STORAGE_URL)) {
      URL.revokeObjectURL(copyrightImagePreview);
    }
    setImagePreview(null);
    setCopyrightImagePreview(null);
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

                {/* Journal Name */}
                <div className="mb-3 pb-2 border-b border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Journal:</span> {volume?.journal?.j_title || getJournalTitle(volume.journal_id)}
                  </p>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  {/* Issue Type & Theme */}
                  {volume.issue_type && (
                    <div className="flex justify-between">
                      <span className="font-medium">Issue Type:</span>
                      <span>{volume.issue_type}</span>
                    </div>
                  )}
                  
                  {volume.issue_theme && (
                    <div className="flex justify-between">
                      <span className="font-medium">Theme:</span>
                      <span className="truncate max-w-[150px]">{volume.issue_theme}</span>
                    </div>
                  )}
                  
                  {volume.keywords && (
                    <div className="flex justify-between">
                      <span className="font-medium">Keywords:</span>
                      <span className="truncate max-w-[150px]">{volume.keywords}</span>
                    </div>
                  )}
                  
                  {volume.editor_name && (
                    <div className="flex justify-between">
                      <span className="font-medium">Editor:</span>
                      <span>{volume.editor_name}</span>
                    </div>
                  )}
                  
                  {volume.issn_number && (
                    <div className="flex justify-between">
                      <span className="font-medium">ISSN:</span>
                      <span>{volume.issn_number}</span>
                    </div>
                  )}
                  
                  {volume.doi && (
                    <div className="flex justify-between">
                      <span className="font-medium">DOI:</span>
                      <span className="truncate max-w-[150px]">{volume.doi}</span>
                    </div>
                  )}
                  
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
                  
                  {volume.web_url && (
                    <div className="flex justify-between">
                      <span className="font-medium">Web URL:</span>
                      <a href={volume.web_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px]">
                        Link
                      </a>
                    </div>
                  )}

                  {/* Display Copyright Info */}
                  {volume.copyright_type && volume.copyright_value && (
                    <div className="flex justify-between">
                      <span className="font-medium">Copyright:</span>
                      {volume.copyright_type === "image" ? (
                        <span className="text-blue-500">Image</span>
                      ) : (
                        <a href={volume.copyright_value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline truncate max-w-[150px]">
                          URL
                        </a>
                      )}
                    </div>
                  )}
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
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
                {/* Journal Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Journal *
                  </label>
                  <select
                    name="journal_id"
                    value={formData.journal_id}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={journalsLoading}
                  >
                    <option value="">Select a journal</option>
                    {journals.map((journal) => (
                      <option key={journal.id} value={journal.id}>
                        {journal.j_title}
                      </option>
                    ))}
                  </select>
                  {journalsLoading && (
                    <p className="text-xs text-gray-500 mt-1">Loading journals...</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Type
                    </label>
                    <input
                      type="text"
                      name="issue_type"
                      value={formData.issue_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Regular, Special"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Theme
                    </label>
                    <input
                      type="text"
                      name="issue_theme"
                      value={formData.issue_theme}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Issue theme"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Keywords
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Comma separated keywords"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Editor Name
                    </label>
                    <input
                      type="text"
                      name="editor_name"
                      value={formData.editor_name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Editor name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ISSN Number
                    </label>
                    <input
                      type="text"
                      name="issn_number"
                      value={formData.issn_number}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ISSN number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DOI
                  </label>
                  <input
                    type="text"
                    name="doi"
                    value={formData.doi}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Digital Object Identifier"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Web URL
                  </label>
                  <input
                    type="url"
                    name="web_url"
                    value={formData.web_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                {/* Volume Image Section with Preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Volume Image {!editingVolume && "*"}
                  </label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputChange}
                    accept="image/*"
                    ref={imageInputRef}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                      <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Volume preview" 
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                            if (imageInputRef.current) {
                              imageInputRef.current.value = "";
                            }
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )}
                  {editingVolume && !imagePreview && volume?.image && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current image will be kept unless you upload a new one
                    </p>
                  )}
                </div>

                {/* Copyright Section */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">Copyright Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Copyright Type
                    </label>
                    <select
                      name="copyright_type"
                      value={formData.copyright_type}
                      onChange={handleCopyrightTypeChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select copyright type</option>
                      <option value="url">URL</option>
                      <option value="image">Image</option>
                    </select>
                  </div>

                  {formData.copyright_type === "image" && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Copyright Image {!editingVolume && "*"}
                      </label>
                      <input
                        type="file"
                        name="copyright_value"
                        onChange={handleInputChange}
                        accept="image/*"
                        ref={copyrightImageInputRef}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {copyrightImagePreview && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 mb-1">Copyright Image Preview:</p>
                          <div className="relative w-32 h-32 border rounded-md overflow-hidden">
                            <img 
                              src={copyrightImagePreview} 
                              alt="Copyright preview" 
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setCopyrightImagePreview(null);
                                setFormData(prev => ({ ...prev, copyright_value: null }));
                                if (copyrightImageInputRef.current) {
                                  copyrightImageInputRef.current.value = "";
                                }
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      )}
                      {editingVolume && !copyrightImagePreview && (
                        <p className="text-xs text-gray-500 mt-1">
                          Current copyright image will be kept unless you upload a new one
                        </p>
                      )}
                    </div>
                  )}

                  {formData.copyright_type === "url" && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Copyright URL
                      </label>
                      <input
                        type="url"
                        name="copyright_value"
                        value={typeof formData.copyright_value === 'string' ? formData.copyright_value : ''}
                        onChange={handleCopyrightUrlChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/copyright"
                      />
                      {editingVolume && formData.copyright_value && typeof formData.copyright_value === 'string' && (
                        <p className="text-xs text-gray-500 mt-1">
                          Current copyright URL will be updated
                        </p>
                      )}
                    </div>
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