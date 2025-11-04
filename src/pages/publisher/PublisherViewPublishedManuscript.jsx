import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const PublisherViewPublishedManuscriptList = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);

  const [manuscripts, setManuscripts] = useState([]);
  const [filteredManuscripts, setFilteredManuscripts] = useState([]);
  const [volumes, setVolumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [volumesLoading, setVolumesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState("all");
  const [selectedManuscripts, setSelectedManuscripts] = useState([]);
  const [selectedVolume, setSelectedVolume] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const navigate = useNavigate();

  // Fetch manuscripts on component mount
  useEffect(() => {
    fetchManuscripts();
    fetchVolumes();
  }, []);

  // Update filtered manuscripts when manuscripts or filter changes
  useEffect(() => {
    if (selectedJournal === "all") {
      setFilteredManuscripts(manuscripts);
    } else {
      setFilteredManuscripts(
        manuscripts.filter((manuscript) => manuscript.j_title === selectedJournal)
      );
    }
    setSelectedManuscripts([]);
    setSelectAll(false);
  }, [manuscripts, selectedJournal]);

  const fetchManuscripts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}api/published-manuscripts`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        setManuscripts(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch manuscripts");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolumes = async () => {
    try {
      setVolumesLoading(true);
      const response = await axios.get(`${API_URL}api/volume/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        setVolumes(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch volumes");
      }
    } catch (err) {
      console.error("Error fetching volumes:", err);
      toast.error("Failed to load volumes");
    } finally {
      setVolumesLoading(false);
    }
  };

  // Get unique journal titles for filter
  const journalTitles = [...new Set(manuscripts.map((manuscript) => manuscript.j_title))];

  // Get journal ID for selected journal
  const getSelectedJournalId = () => {
    if (selectedJournal === "all") return null;
    const journal = manuscripts.find(ms => ms.j_title === selectedJournal);
    return journal ? journal.journal_id : null;
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setSelectedJournal(e.target.value);
  };

  // Handle individual checkbox change
  const handleCheckboxChange = (manuscriptId) => {
    setSelectedManuscripts((prev) => {
      if (prev.includes(manuscriptId)) {
        return prev.filter((id) => id !== manuscriptId);
      } else {
        return [...prev, manuscriptId];
      }
    });
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedManuscripts([]);
    } else {
      setSelectedManuscripts(filteredManuscripts.map((manuscript) => manuscript.id));
    }
    setSelectAll(!selectAll);
  };

  // Update select all when selected manuscripts change
  useEffect(() => {
    if (filteredManuscripts.length > 0 && selectedManuscripts.length === filteredManuscripts.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedManuscripts, filteredManuscripts]);

  // Open volume selection modal
  const handleOpenVolumeModal = () => {
    if (selectedManuscripts.length === 0) {
      toast.warning("Please select at least one manuscript to archive");
      return;
    }
    setSelectedVolume("");
    setShowVolumeModal(true);
  };

  // Close volume selection modal
  const handleCloseVolumeModal = () => {
    setShowVolumeModal(false);
    setSelectedVolume("");
  };

  // Push to archive
  const handlePushToArchive = async () => {
    if (!selectedVolume) {
      toast.warning("Please select a volume");
      return;
    }

    const journalId = getSelectedJournalId();
    if (!journalId && selectedJournal !== "all") {
      toast.error("Could not determine journal ID");
      return;
    }

    if (window.confirm(`Are you sure you want to archive ${selectedManuscripts.length} manuscript(s) to volume ${selectedVolume}?`)) {
      try {
        const response = await axios.post(
          `${API_URL}api/archive/store`,
          {
            published_id: selectedManuscripts,
            journal_id: journalId,
            volume_id: selectedVolume
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          toast.success(
            response.data.message || "Manuscripts archived successfully!"
          );
          // Remove archived manuscripts from the list
          setManuscripts(manuscripts.filter((ms) => !selectedManuscripts.includes(ms.id)));
          setSelectedManuscripts([]);
          setSelectAll(false);
          handleCloseVolumeModal();
        } else {
          throw new Error(
            response.data.message || "Failed to archive manuscripts"
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to archive manuscripts";
        toast.error(errorMessage);
      }
    }
  };

  const handleEdit = (manuscriptId) => {
    if (!manuscriptId) return;
    navigate(`/publisher/published-manuscripts-edit/${manuscriptId}`);
  };

  const handleView = (manuscriptId) => {
    if (!manuscriptId) return;
    navigate(`/publisher/published-manuscripts-view/${manuscriptId}`);
  };

  const handleDelete = async (manuscriptId) => {
    if (window.confirm("Are you sure you want to delete this manuscript?")) {
      try {
        const response = await axios.delete(
          `${API_URL}api/published-manuscripts/${manuscriptId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status) {
          toast.success(
            response.data.message || "Manuscript deleted successfully!"
          );
          // Remove the deleted manuscript from the list
          setManuscripts(manuscripts.filter((ms) => ms.id !== manuscriptId));
          setSelectedManuscripts(selectedManuscripts.filter((id) => id !== manuscriptId));
        } else {
          throw new Error(
            response.data.message || "Failed to delete manuscript"
          );
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to delete manuscript";
        toast.error(errorMessage);
      }
    }
  };

  // Function to safely render HTML content
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && manuscripts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button
            onClick={fetchManuscripts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Published Manuscripts
        </h1>
        <p className="text-gray-600 mt-2">Manage your published manuscripts</p>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Filter Section */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Filter by Journal:
              </label>
              <select
                value={selectedJournal}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
              >
                <option value="all">All Journals</option>
                {journalTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>

            {selectedJournal !== "all" && (
              <div className="text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg">
                <span className="font-medium">Journal ID:</span> {getSelectedJournalId()}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {selectedManuscripts.length > 0 && (
              <button
                onClick={handleOpenVolumeModal}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center text-sm font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
                Push to Archive ({selectedManuscripts.length})
              </button>
            )}

            {filteredManuscripts.length > 0 && (
              <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                <input
                  type="checkbox"
                  id="selectAll"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="selectAll"
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  Select All ({filteredManuscripts.length})
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Selected Manuscripts Info */}
        {selectedManuscripts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-800 font-medium">
                    {selectedManuscripts.length} manuscript(s) selected
                  </p>
                  <p className="text-blue-600 text-sm">
                    Ready to archive to a volume
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedManuscripts([])}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Volume Selection Modal */}
      {showVolumeModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Select Volume
                </h3>
                <button
                  onClick={handleCloseVolumeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Please select a volume to archive {selectedManuscripts.length} manuscript(s) to:
                </p>

                {volumesLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <select
                    value={selectedVolume}
                    onChange={(e) => setSelectedVolume(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a volume</option>
                    {volumes.map((volume) => (
                      <option key={volume.id} value={volume.id}>
                        Volume {volume.volume} - {volume.issue_no} ({volume.page_no})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCloseVolumeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePushToArchive}
                  disabled={!selectedVolume}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Archive Manuscripts
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredManuscripts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <p className="text-gray-500 text-lg mb-4">
            No published manuscripts found.
          </p>
          <button
            onClick={fetchManuscripts}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredManuscripts.map((manuscript) => (
            <div
              key={manuscript.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row">
                {/* Checkbox */}
                <div className="flex items-start p-6">
                  <input
                    type="checkbox"
                    checked={selectedManuscripts.includes(manuscript.id)}
                    onChange={() => handleCheckboxChange(manuscript.id)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                </div>

                {/* Manuscript Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      {/* Journal Title */}
                      <div className="mb-4">
                        <span className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {manuscript.j_title}
                        </span>
                      </div>

                      {/* Manuscript Title */}
                      <h3
                        className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 hover:text-blue-600 cursor-pointer transition-colors"
                        onClick={() => handleView(manuscript.id)}
                        dangerouslySetInnerHTML={renderHTML(manuscript.title)}
                      />

                      {/* Manuscript Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 w-24">Manuscript ID:</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{manuscript.m_unique_id}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 w-24">Author:</span>
                          <span>{manuscript.username}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 w-24">Affiliation:</span>
                          <span>{manuscript.affiliation || "N/A"}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(manuscript.created_at)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleView(manuscript.id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(manuscript.id)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(manuscript.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center text-sm font-medium"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Manuscript Image */}
                    <div className="lg:ml-6">
                      <div className="w-48 h-32 overflow-hidden rounded-xl shadow-md">
                        <img
                          src={manuscript.image}
                          alt={manuscript.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublisherViewPublishedManuscriptList;