import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSearch,
  faClock,
  faCheckCircle,
  faEdit,
  faDownload,
  faCalendarAlt,
  faFileAlt,
  faUserEdit,
  faBook,
  faClipboardList,
  faFilter,
  faTag,
  faHourglassStart,
  faThumbsUp,
  faThumbsDown,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";

const ReviewerDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true)
  const [assignedManuscripts, setAssignedManuscripts] = useState([])
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchManuscripts = async () => {
    try {
      const response = await axios.get(`${API_URL}api/review/view-manuscript`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.flag === 1) {
        setAssignedManuscripts(response.data.data)
      } else {
        toast.error(response.data.message || "Failed to fetch manuscripts");
      }
    } catch (error) {
      console.error("Error fetching manuscripts:", error);
      toast.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchManuscripts();
  }, [token])

  const handleStatusUpdate = async (manuscriptId, status) => {
    setUpdatingStatus(true);
    try {
      const response = await axios.post(
        `${API_URL}api/review/assign-status/${manuscriptId}`,
        { status },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.data.flag === 1) {
        toast.success(`Manuscript ${status} successfully`);
        fetchManuscripts(); // Refresh the list
      } else {
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating manuscript status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Filter manuscripts
  const filteredManuscripts = assignedManuscripts.filter(manuscript => {
    const matchesSearch =
      manuscript.manuscript_data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manuscript.manuscript_data.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || manuscript.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        text: "New Assigned",
        color: "bg-yellow-100 text-yellow-800",
        icon: <FontAwesomeIcon icon={faHourglassStart} className="mr-1" />
      },
      accepted: {
        text: "Accepted",
        color: "bg-blue-100 text-blue-800",
        icon: <FontAwesomeIcon icon={faThumbsUp} className="mr-1" />
      },
      completed: {
        text: "Completed",
        color: "bg-green-100 text-green-800",
        icon: <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
      },
      rejected: {
        text: "Rejected",
        color: "bg-red-100 text-red-800",
        icon: <FontAwesomeIcon icon={faThumbsDown} className="mr-1" />
      }
    };

    return (
      <span className={`inline-flex items-center justify-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusConfig[status].color}`}>
        {statusConfig[status].icon}
        {statusConfig[status].text}
      </span>
    );
  };

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          <FontAwesomeIcon icon={faClipboardList} className="mr-2 text-blue-600" />
          My Assigned Manuscripts
        </h1>
        <p className="text-gray-600 ml-8">Manuscripts assigned to you for review</p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {/* New Assigned Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-50 text-yellow-600 mr-4">
              <FontAwesomeIcon icon={faHourglassStart} size="lg" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">New Assigned</h3>
              <p className="text-xl font-semibold">
                {assignedManuscripts.filter(m => m.status === "pending").length}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-600 font-medium">
            Manuscripts awaiting your response
          </div>
        </div>

        {/* Accepted Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
              <FontAwesomeIcon icon={faThumbsUp} size="lg" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Accepted</h3>
              <p className="text-xl font-semibold">
                {assignedManuscripts.filter(m => m.status === "accepted").length}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-600 font-medium">
            Manuscripts you've accepted to review
          </div>
        </div>

        {/* Completed Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-50 text-green-600 mr-4">
              <FontAwesomeIcon icon={faCheckCircle} size="lg" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-xl font-semibold">
                {assignedManuscripts.filter(m => m.status === "completed").length}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 font-medium">
            Reviews you've completed
          </div>
        </div>

        {/* Rejected Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
              <FontAwesomeIcon icon={faThumbsDown} size="lg" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-xl font-semibold">
                {assignedManuscripts.filter(m => m.status === "rejected").length}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-red-600 font-medium">
            Manuscripts you've declined to review
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by title or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-gray-200">
          <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
            <FontAwesomeIcon icon={faFilter} className="mr-1" />
            Status:
          </label>
          <select
            id="status-filter"
            className="border-0 py-0 pl-2 pr-8 text-sm focus:ring-0 focus:border-0"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">New Assigned</option>
            <option value="completed">Completed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Manuscript Cards */}
      {filteredManuscripts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManuscripts.map((manuscript) => (
            <div key={manuscript.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
                    {manuscript.manuscript_data.title}
                  </h2>
                  <StatusBadge status={manuscript.status} />
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                  {manuscript.manuscript_data.abstract}
                </p>

                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">Author:</span> {manuscript.manuscript_data.username}
                </div>

                <div className="mt-1 text-xs text-gray-500">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                  Submitted: {new Date(manuscript.created_at).toLocaleDateString()}
                </div>
              </div>
              
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                {manuscript.status === "pending" ? (
                  <div className="flex justify-between space-x-2">
                    <button
                      onClick={() => handleStatusUpdate(manuscript.id, "rejected")}
                      disabled={updatingStatus}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faThumbsDown} className="mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(manuscript.id, "accepted")}
                      disabled={updatingStatus}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faThumbsUp} className="mr-2" />
                      Accept
                    </button>
                  </div>
                ) : manuscript.status === "rejected" ? (
                  <div className="text-center text-sm text-gray-500 py-2">
                    You have declined to review this manuscript
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <Link 
                      to={`/view-manuscript/${manuscript.manuscript_id}`}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-2" />
                      View Manuscript
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="text-gray-400 mb-4">
            <FontAwesomeIcon icon={faSearch} size="2x" className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">No manuscripts found</h3>
          <p className="text-gray-500 mt-1">
            {searchTerm ? "Try adjusting your search" : "You currently have no assigned manuscripts"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ReviewerDashboard;