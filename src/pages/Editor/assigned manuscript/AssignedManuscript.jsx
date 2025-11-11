import React, { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faTimesCircle,
  faClock,
  faFileAlt,
  faUser,
  faCalendarAlt,
  faEye,
  faTimes,
  faComments,
  faQuestionCircle,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { formatDate } from "../../../lib/utils";
import PaginationControls from "../../../components/common/PaginationControls";
import RecordsPerPageSelector from "../../../components/common/RecordsPerPageSelector";
import SearchInput from "../../../components/common/SearchInput";
import RevisionModal from "../../../components/editor/RevisionModal";

const statusStyles = {
  completed: "bg-green-100 text-green-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const statusIcons = {
  completed: (
    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
  ),
  accepted: (
    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
  ),
  rejected: (
    <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-1" />
  ),
  pending: <FontAwesomeIcon icon={faClock} className="text-yellow-500 mr-1" />,
};

const recommendationMap = {
  minor_revisions: "Minor Revisions",
  major_revisions: "Major Revisions",
  accept: "Accept",
  reject: "Reject",
};

const AssignedManuscript = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedManuscript, setSelectedManuscript] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [publisherInfo, setPublisherInfo] = useState([]);

  // Add these new state variables to your component (around line 35)
  const [isPublisherModalOpen, setIsPublisherModalOpen] = useState(false);
  const [selectedPublisher, setSelectedPublisher] = useState("");
  const [assigningPublisher, setAssigningPublisher] = useState(false);

  // New state for revision modal
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);

  // Pagination and search state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Aggregate reviewer assignments for stats
  const allAssignments = useMemo(() => {
    return manuscripts.flatMap((m) => m.reviewers || []);
  }, [manuscripts]);

  const fetchAssignedManuscripts = async () => {
    try {
      const response = await axios.get(`${API_URL}api/editor/show-manuscript`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.flag === 1) {
        setManuscripts(response.data.data);
        console.log("Assigned manuscripts data:", response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch assigned manuscripts"
        );
      }
    } catch (error) {
      console.error("Error fetching assigned manuscripts:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch assigned manuscripts"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPublisher = async () => {
    try {
      const response = await axios.get(`${API_URL}api/permission/publisher`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data.flag) {
        console.log(response.data.data.publisher);
        const pubInfo = response.data.data.publisher;
        setPublisherInfo(pubInfo);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching publisher details :", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch publisher details "
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedManuscripts();
    fetchPublisher();
  }, [token]);

  // Filter manuscripts based on search term (by title only)
  const filteredManuscripts = useMemo(() => {
    if (!searchTerm) return manuscripts;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return manuscripts.filter((m) =>
      (m.title || "").toLowerCase().includes(lowerSearchTerm)
    );
  }, [manuscripts, searchTerm]);

  // Calculate pagination values
  const totalRecords = filteredManuscripts.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);
  const currentRecords = filteredManuscripts.slice(startIndex, endIndex);

  const openModal = (manuscript) => {
    setSelectedManuscript(manuscript);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedManuscript(null);
  };

  // Add functions to handle publisher modal
  const openPublisherModal = () => {
    setIsPublisherModalOpen(true);
    setSelectedPublisher("");
  };

  const closePublisherModal = () => {
    setIsPublisherModalOpen(false);
    setSelectedPublisher("");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Add this function to handle publisher assignment
  const handleAssignPublisher = async () => {
    if (!selectedPublisher || !selectedManuscript?.manuscript_id) {
      toast.error("Please select a publisher");
      return;
    }

    setAssigningPublisher(true);
    try {
      const response = await axios.post(
        `${API_URL}api/permission/publisher`, // Update this endpoint as needed
        {
          manuscript_id: selectedManuscript.manuscript_id,
          publisher_id: selectedPublisher,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag ) {
        toast.success(
          response.data.message || "Publisher assigned successfully"
        );
        fetchAssignedManuscripts(); // Refresh the data
        closePublisherModal();
      } else {
        toast.error(response.data.message || "Failed to assign publisher");
      }
    } catch (error) {
      console.error("Error assigning publisher:", error);
      toast.error(
        error.response?.data?.message || "Failed to assign publisher"
      );
    } finally {
      setAssigningPublisher(false);
    }
  };

  const handlePublish = async (manuscriptId) => {
    if (!manuscriptId) return;
    console.log("Publishing manuscript ID:", manuscriptId);
    // Add your publish logic here
  };

  const handleNeedRevision = async (manuscriptId) => {
    if (!manuscriptId) return;
    console.log("Marking manuscript ID as needing revision:", manuscriptId);

    try {
      const response = await axios.post(
        `${API_URL}api/editor/resubmission-manuscript`,
        {
          manuscript_id: manuscriptId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag === 1) {
        toast.success(
          response.data.message || "Manuscript marked as needing revision"
        );
        fetchAssignedManuscripts();
        closeModal();
      } else {
        toast.error(
          response.data.message ||
            "Failed to mark manuscript as needing revision"
        );
      }
    } catch (error) {
      console.error("Error marking manuscript as needing revision:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to mark manuscript as needing revision"
      );
    }
  };

  // New function to handle sending individual reviewer revision to author
  const handleSendRevisionToAuthor = async (formData) => {
    try {
      const response = await axios.post(
        `${API_URL}api/editor/send-revision-to-author`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.flag === 1) {
        toast.success(
          response.data.message || "Revision sent to author successfully"
        );
        fetchAssignedManuscripts();
        closeModal();
      } else {
        toast.error(
          response.data.message || "Failed to send revision to author"
        );
      }
    } catch (error) {
      console.error("Error sending revision to author:", error);
      toast.error(
        error.response?.data?.message || "Failed to send revision to author"
      );
      throw error;
    }
  };

  const openRevisionModal = (reviewer) => {
    setSelectedReviewer(reviewer);
    setIsRevisionModalOpen(true);
  };

  const closeRevisionModal = () => {
    setIsRevisionModalOpen(false);
    setSelectedReviewer(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Revision Modal */}
      <RevisionModal
        isOpen={isRevisionModalOpen}
        onClose={closeRevisionModal}
        manuscript={selectedManuscript}
        reviewer={selectedReviewer}
        onSendRevision={handleSendRevisionToAuthor}
      />

      {/* Publisher Assignment Modal */}
      {isPublisherModalOpen && selectedManuscript && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500/50 bg-opacity-75 transition-opacity"
              onClick={closePublisherModal}
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Assign Publisher
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Select a publisher to assign this manuscript for
                        publication.
                      </p>

                      {/* Manuscript Info */}
                      <div className="bg-gray-50 p-3 rounded-lg mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Manuscript:
                        </h4>
                        <p
                          className="text-sm text-gray-700 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html: selectedManuscript.title,
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {selectedManuscript.manuscript_id}
                        </p>
                      </div>

                      {/* Publisher Selection */}
                      <div>
                        <label
                          htmlFor="publisher-select"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Select Publisher{" "}
                          <span className="text-red-500">*</span>
                        </label>

                        {publisherInfo && publisherInfo.length > 0 ? (
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {publisherInfo.map((publisher) => (
                              <div
                                key={publisher.user_id}
                                className={`relative rounded-lg border p-3 cursor-pointer transition-all duration-200 ${
                                  selectedPublisher === publisher.user_id
                                    ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                                }`}
                                onClick={() =>
                                  setSelectedPublisher(publisher.user_id)
                                }
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <input
                                      type="radio"
                                      name="publisher"
                                      value={publisher.user_id}
                                      checked={
                                        selectedPublisher === publisher.user_id
                                      }
                                      onChange={() =>
                                        setSelectedPublisher(publisher.user_id)
                                      }
                                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                    <div className="ml-3">
                                      <div className="flex items-center">
                                        <FontAwesomeIcon
                                          icon={faUser}
                                          className="text-gray-400 mr-2"
                                        />
                                        <span className="font-medium text-gray-900">
                                          {publisher.name}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-500">
                                        ID: {publisher.user_id}
                                      </p>
                                    </div>
                                  </div>
                                  {selectedPublisher === publisher.user_id && (
                                    <FontAwesomeIcon
                                      icon={faCheckCircle}
                                      className="text-blue-500"
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FontAwesomeIcon
                              icon={faUser}
                              className="text-3xl mb-2"
                            />
                            <p>No publishers available</p>
                          </div>
                        )}
                      </div>

                      {/* Selected Publisher Summary */}
                      {selectedPublisher && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="text-green-500 mr-2"
                            />
                            <span className="text-sm font-medium text-green-800">
                              Selected:{" "}
                              {
                                publisherInfo.find(
                                  (p) => p.user_id === selectedPublisher
                                )?.name
                              }
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <button
                  type="button"
                  disabled={!selectedPublisher || assigningPublisher}
                  className={`inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto ${
                    !selectedPublisher || assigningPublisher
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                  }`}
                  onClick={handleAssignPublisher}
                >
                  {assigningPublisher ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Assigning...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      Assign Publisher
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={closePublisherModal}
                  disabled={assigningPublisher}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      {isModalOpen && selectedManuscript && (
        <div className="fixed inset-0 z-40 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Manuscript Details
                      </h3>
                      <button
                        onClick={closeModal}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-6">
                      {/* Manuscript Details */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                          <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                          Manuscript Information
                        </h4>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-bold text-gray-500">
                              Title:{" "}
                            </p>
                            <p
                              className="text-sm text-gray-900"
                              dangerouslySetInnerHTML={{
                                __html: selectedManuscript.title,
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-500">
                              Abstract:{" "}
                            </p>
                            <p
                              className="text-sm text-gray-900"
                              dangerouslySetInnerHTML={{
                                __html: selectedManuscript.abstract,
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Reviewer Details (List) */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                          <FontAwesomeIcon icon={faUser} className="mr-2" />
                          Assigned Reviewers{" "}
                          {`(${(selectedManuscript.reviewers || []).length})`}
                        </h4>
                        <div className="space-y-4">
                          {(selectedManuscript.reviewers || []).map(
                            (assignment, idx) => (
                              <div
                                key={assignment.assignment_id}
                                className="border rounded-md p-3"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {idx + 1}. {assignment.reviewer?.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {assignment.reviewer?.email}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-xs text-gray-600 flex items-center">
                                      <FontAwesomeIcon
                                        icon={faCalendarAlt}
                                        className="mr-1"
                                      />
                                      {formatDate(assignment.assigned_at)}
                                    </div>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                        statusStyles[assignment.status]
                                      }`}
                                    >
                                      {statusIcons[assignment.status]}
                                      <span className="ml-1 capitalize">
                                        {assignment.status}
                                      </span>
                                    </span>

                                    {/* Send Revision Button - Only for completed reviews */}
                                    {assignment.status === "completed" &&
                                      assignment.messages?.length > 0 && (
                                        <button
                                          onClick={() =>
                                            openRevisionModal(assignment)
                                          }
                                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                          <FontAwesomeIcon
                                            icon={faPaperPlane}
                                            className="mr-1"
                                          />
                                          Send to Author
                                        </button>
                                      )}
                                  </div>
                                </div>

                                {/* Messages for this reviewer */}
                                {(assignment.messages || []).length > 0 && (
                                  <div className="mt-3 bg-white rounded">
                                    <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                                      <FontAwesomeIcon
                                        icon={faComments}
                                        className="mr-2"
                                      />
                                      Reviews ({assignment.messages.length})
                                    </h5>
                                    <div className="space-y-3">
                                      {assignment.messages.map(
                                        (message, mIdx) => (
                                          <div
                                            key={message.id || mIdx}
                                            className="border-l-4 border-indigo-500 pl-3 bg-gray-50 p-3 rounded"
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <span className="text-xs font-medium text-gray-600">
                                                Review #{mIdx + 1}
                                              </span>
                                              <div className="flex items-center space-x-2">
                                                {assignment.status ===
                                                  "completed" && (
                                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <FontAwesomeIcon
                                                      icon={faCheckCircle}
                                                      className="mr-1"
                                                    />
                                                    Ready to Send
                                                  </span>
                                                )}
                                                <button
                                                  onClick={() =>
                                                    openRevisionModal(
                                                      assignment
                                                    )
                                                  }
                                                  className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                                                  title="Send this review to author"
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faPaperPlane}
                                                    className="mr-1"
                                                  />
                                                  Send
                                                </button>
                                              </div>
                                            </div>

                                            <div className="space-y-2">
                                              <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                  Message to Editor:
                                                </p>
                                                <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                  {message.message_to_editor}
                                                </p>
                                              </div>
                                              <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                  Message to Author:
                                                </p>
                                                <p className="text-sm text-gray-900 bg-white p-2 rounded border">
                                                  {message.message_to_author}
                                                </p>
                                              </div>
                                              <div className="flex items-center justify-between">
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Recommendation:
                                                  </p>
                                                  <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                      message.recommendation ===
                                                      "accept"
                                                        ? "bg-green-100 text-green-800"
                                                        : message.recommendation ===
                                                          "reject"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                  >
                                                    {recommendationMap[
                                                      message.recommendation
                                                    ] || "N/A"}
                                                  </span>
                                                </div>
                                                <div>
                                                  <p className="text-xs font-medium text-gray-500">
                                                    Attached File:
                                                  </p>
                                                  {message.image ? (
                                                    <a
                                                      href={`${VITE_STORAGE_URL}${message.image}`}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="text-blue-600 hover:underline text-xs"
                                                    >
                                                      <FontAwesomeIcon
                                                        icon={faFileAlt}
                                                        className="mr-1"
                                                      />
                                                      Download File
                                                    </a>
                                                  ) : (
                                                    <span className="text-xs text-gray-600">
                                                      No file attached
                                                    </span>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Problems for this reviewer */}
                                {(assignment.problems || []).length > 0 && (
                                  <div className="mt-3 bg-white rounded">
                                    <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                                      <FontAwesomeIcon
                                        icon={faQuestionCircle}
                                        className="mr-2"
                                      />
                                      Questions ({assignment.problems.length})
                                    </h5>
                                    <div className="space-y-2">
                                      {assignment.problems.map(
                                        (problem, pIdx) => (
                                          <div
                                            key={problem.id || pIdx}
                                            className="border-l-4 border-blue-500 pl-3 bg-blue-50 p-2 rounded"
                                          >
                                            <p className="text-xs font-medium text-gray-500">
                                              Question {pIdx + 1}:
                                            </p>
                                            <p className="text-sm text-gray-900">
                                              {problem.question}
                                            </p>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Status indicator for empty reviews */}
                                {assignment.status === "pending" &&
                                  (!assignment.messages ||
                                    assignment.messages.length === 0) && (
                                    <div className="mt-3 text-center py-4">
                                      <FontAwesomeIcon
                                        icon={faClock}
                                        className="text-yellow-500 text-2xl mb-2"
                                      />
                                      <p className="text-sm text-gray-600">
                                        Waiting for reviewer response
                                      </p>
                                    </div>
                                  )}
                              </div>
                            )
                          )}

                          {(selectedManuscript.reviewers || []).length ===
                            0 && (
                            <div className="text-center py-6">
                              <FontAwesomeIcon
                                icon={faUser}
                                className="text-gray-400 text-3xl mb-2"
                              />
                              <p className="text-sm text-gray-600">
                                No reviewers assigned yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Summary Section */}
                      {(selectedManuscript.reviewers || []).length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                            <FontAwesomeIcon
                              icon={faCheckCircle}
                              className="mr-2"
                            />
                            Review Summary
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {
                                  (selectedManuscript.reviewers || []).filter(
                                    (r) => r.status === "completed"
                                  ).length
                                }
                              </div>
                              <div className="text-xs text-gray-600">
                                Completed
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">
                                {
                                  (selectedManuscript.reviewers || []).filter(
                                    (r) => r.status === "pending"
                                  ).length
                                }
                              </div>
                              <div className="text-xs text-gray-600">
                                Pending
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {
                                  (selectedManuscript.reviewers || []).filter(
                                    (r) => r.messages && r.messages.length > 0
                                  ).length
                                }
                              </div>
                              <div className="text-xs text-gray-600">
                                With Reviews
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {(selectedManuscript.reviewers || []).reduce(
                                  (total, r) =>
                                    total +
                                    (r.messages ? r.messages.length : 0),
                                  0
                                )}
                              </div>
                              <div className="text-xs text-gray-600">
                                Total Reviews
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition cursor-pointer"
                    onClick={openPublisherModal}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4" />
                    Assigned Publisher
                  </button>

                  {selectedManuscript.is_update === "0" ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-yellow-500 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition cursor-pointer"
                      onClick={() =>
                        handleNeedRevision(selectedManuscript.manuscript_id)
                      }
                    >
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="h-4 w-4"
                      />
                      Need Revision
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-gray-400 px-4 py-2 text-white text-sm font-semibold shadow cursor-not-allowed"
                      disabled
                    >
                      <FontAwesomeIcon
                        icon={faQuestionCircle}
                        className="h-4 w-4"
                      />
                      Already Assigned To Update
                    </button>
                  )}

                  {/* Quick Send All Reviews Button */}
                  {(selectedManuscript.reviewers || []).some(
                    (r) => r.status === "completed" && r.messages?.length > 0
                  ) && (
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-semibold shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition cursor-pointer"
                      onClick={() => {
                        // You can implement a bulk send function here
                        toast.info(
                          "Select individual reviews to send to author"
                        );
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        className="h-4 w-4"
                      />
                      Send Reviews
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="sm:flex sm:items-center mb-4">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">
            Assigned Manuscripts
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of manuscripts assigned to reviewers and their current
            status. Send individual reviews to authors.
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Completed
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        allAssignments.filter((a) => a.status === "completed")
                          .length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-yellow-500 p-3">
                <FontAwesomeIcon icon={faClock} className="text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Pending
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        allAssignments.filter((a) => a.status === "pending")
                          .length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-red-500 p-3">
                <FontAwesomeIcon icon={faTimesCircle} className="text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Rejected
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        allAssignments.filter((a) => a.status === "rejected")
                          .length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-md bg-blue-500 p-3">
                <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    Ready to Send
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {
                        allAssignments.filter(
                          (a) =>
                            a.status === "completed" && a.messages?.length > 0
                        ).length
                      }
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Controls - Top */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        <RecordsPerPageSelector
          value={recordsPerPage}
          onChange={(value) => {
            setRecordsPerPage(value);
            setCurrentPage(1);
          }}
          options={[5, 10, 25, 50]}
        />

        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search by title..."
        />
      </div>

      <div className="mt-4 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto custom-scrollbar sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg py-4">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Reviewers
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Reviews Status
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Action</span>
                      <span>Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {currentRecords.length > 0 ? (
                    currentRecords.map((manuscript, index) => {
                      const completedReviews = (
                        manuscript.reviewers || []
                      ).filter((r) => r.status === "completed").length;
                      const totalReviewers = (manuscript.reviewers || [])
                        .length;
                      const pendingReviews = (
                        manuscript.reviewers || []
                      ).filter((r) => r.status === "pending").length;
                      const readyToSend = (manuscript.reviewers || []).filter(
                        (r) =>
                          r.status === "completed" && r.messages?.length > 0
                      ).length;

                      return (
                        <tr key={manuscript.manuscript_id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            {manuscript.manuscript_id}
                          </td>
                          <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 line-clamp-2 w-80">
                            <div
                              className="text-gray-900 font-medium"
                              dangerouslySetInnerHTML={{
                                __html: manuscript.title,
                              }}
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            <div className="flex items-center space-x-1">
                              <span className="font-medium">
                                {totalReviewers}
                              </span>
                              <span className="text-gray-500">reviewers</span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {completedReviews} completed
                              </span>
                              {pendingReviews > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                  {pendingReviews} pending
                                </span>
                              )}
                              {readyToSend > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  <FontAwesomeIcon
                                    icon={faPaperPlane}
                                    className="mr-1"
                                  />
                                  {readyToSend} ready
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => openModal(manuscript)}
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                            >
                              <FontAwesomeIcon icon={faEye} className="mr-1" />
                              View Details
                              <span className="sr-only">
                                , {manuscript.title}
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        {searchTerm
                          ? "No matching manuscripts found"
                          : "No manuscripts assigned yet"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Table Controls - Bottom */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 gap-4">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {endIndex} of {totalRecords} entries
          {searchTerm && ` (filtered from ${manuscripts.length} total entries)`}
        </div>

        {totalPages > 1 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default AssignedManuscript;
