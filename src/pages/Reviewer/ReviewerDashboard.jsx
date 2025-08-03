import React, { useState } from "react";
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
  faTag
} from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const ReviewerDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Sample assigned manuscripts data
  const assignedManuscripts = [
    {
      id: 1,
      title: "Novel Approaches to Cancer Treatment",
      journal: "Journal of Medical Research",
      author: "Dr. Alice Zhang",
      assignedDate: "2023-05-20",
      deadline: "2023-06-20",
      status: "in_review", // 'in_review', 'completed', 'overdue'
      decision: "",
      wordCount: 8500,
      files: ["main.pdf", "figures.zip"],
      category: "Oncology",
      abstract: "This study explores innovative methods for treating advanced cancer cases..."
    },
    {
      id: 2,
      title: "Quantum Computing Breakthroughs",
      journal: "Physics Review Letters",
      author: "Prof. Robert Lang",
      assignedDate: "2023-05-18",
      deadline: "2023-06-15",
      status: "overdue",
      decision: "",
      wordCount: 12000,
      files: ["main.pdf", "supplement.pdf"],
      category: "Quantum Physics",
      abstract: "New discoveries in qubit stability that could revolutionize computing..."
    },
    {
      id: 3,
      title: "AI in Modern Healthcare",
      journal: "Computer Science Review",
      author: "Dr. James Wilson",
      assignedDate: "2023-05-25",
      deadline: "2023-06-25",
      status: "completed",
      decision: "Accept with Minor Revisions",
      wordCount: 7500,
      files: ["main.pdf"],
      category: "Medical AI",
      abstract: "Comprehensive review of AI applications in diagnostic imaging..."
    }
  ];


  const fetchManuscripts = async () => {
    try {
      const response = await axios.get(`${API_URL}api/review/view-manuscript`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log(response.data);

      } else {
        toast.error(response.data.message || "Failed to fetch manuscripts");
      }
    } catch (error) {
      console.error("Error fetching manuscripts:", error);
      toast.error(error)
    }
  }

  // Filter manuscripts
  const filteredManuscripts = assignedManuscripts.filter(manuscript => {
    const matchesSearch = manuscript.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manuscript.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || manuscript.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      in_review: {
        text: "In Review",
        color: "bg-blue-100 text-blue-800",
        icon: <FontAwesomeIcon icon={faClock} className="mr-1" />
      },
      completed: {
        text: "Completed",
        color: "bg-green-100 text-green-800",
        icon: <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
      },
      overdue: {
        text: "Overdue",
        color: "bg-red-100 text-red-800",
        icon: <FontAwesomeIcon icon={faClock} className="mr-1" />
      }
    };

    return (
      <span className={`w-34 inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${statusConfig[status].color}`}>
        {statusConfig[status].icon}
        {statusConfig[status].text}
      </span>
    );
  };

  // Days remaining calculation
  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

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

      {/* Stats Summary - Now at the top */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-blue-50 text-blue-600 mr-4">
            <FontAwesomeIcon icon={faClock} size="lg" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">In Review</h3>
            <p className="text-xl font-semibold">
              {assignedManuscripts.filter(m => m.status === "in_review").length}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
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

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow">
          <div className="p-3 rounded-full bg-red-50 text-red-600 mr-4">
            <FontAwesomeIcon icon={faClock} size="lg" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
            <p className="text-xl font-semibold">
              {assignedManuscripts.filter(m => m.status === "overdue").length}
            </p>
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
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Manuscript Cards */}
      {filteredManuscripts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManuscripts.map((manuscript) => (
            <div key={manuscript.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Card Header */}
              <div className="p-5 pb-3">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-800 line-clamp-2">
                    <FontAwesomeIcon icon={faFileAlt} className="mr-2 text-blue-500" />
                    {manuscript.title}
                  </h2>
                  <StatusBadge status={manuscript.status} />
                </div>
                <p className="text-sm text-gray-500 mt-1 ml-6">
                  <FontAwesomeIcon icon={faBook} className="mr-1" />
                  {manuscript.journal}
                </p>
              </div>

              {/* Card Body */}
              <div className="px-5 py-3">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FontAwesomeIcon icon={faUserEdit} className="mr-2 text-gray-400" />
                  <span className="font-medium">Author:</span>
                  <span className="ml-2">{manuscript.author}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <FontAwesomeIcon icon={faTag} className="mr-2 text-gray-400" />
                  <span className="font-medium">Category:</span>
                  <span className="ml-2">{manuscript.category}</span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-gray-400" />
                  <span>Due in {getDaysRemaining(manuscript.deadline)} days</span>
                </div>

                <p className="text-sm text-gray-600 line-clamp-3 mb-4 pl-5">
                  {manuscript.abstract}
                </p>

                <div className="flex items-center text-sm text-gray-500 pl-5">
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  <span>{manuscript.files.length} file{manuscript.files.length !== 1 ? 's' : ''} attached</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-gray-50 px-5 py-3 flex justify-between items-center border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Assigned: {new Date(manuscript.assignedDate).toLocaleDateString()}
                </span>
                <div className="flex space-x-2">
                  <button
                    className="p-2 text-blue-600 hover:text-blue-800 rounded-md hover:bg-blue-50"
                    title="Download files"
                  >
                    <FontAwesomeIcon icon={faDownload} size="sm" />
                  </button>
                  {manuscript.status !== "completed" ? (
                    <Link
                      to={`/view-manuscript/${manuscript.id}`}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 cursor-pointer"
                      title="Submit review"
                    >
                      <FontAwesomeIcon icon={faEdit} className="mr-1" size="sm" />
                      View Manuscript
                    </Link>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md">
                      {manuscript.decision}
                    </span>
                  )}
                </div>
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