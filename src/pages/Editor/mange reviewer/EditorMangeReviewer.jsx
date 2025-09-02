import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserCheck,
  faUserTimes,
  faEye,
  faDownload,
  faSearch,
  faFilter,
  faUserGraduate
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Loader from '../../../components/common/Loader';
import { formatDate } from '../../../lib/utils';

const EditorManageReviewer = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [reviewers, setReviewers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(8);

  const fetchReviewers = async () => {
    try {
      const response = await axios.get(`${API_URL}api/editor/show-inactive-reviewer`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.flag === 1) {
        // Transform API data to match our component structure
        const transformedReviewers = response.data.user.map(reviewer => ({
          id: reviewer.id,
          user_id: reviewer.user_id,
          name: reviewer.name,
          email: reviewer.email,
          first_name: reviewer.registration?.first_name || '',
          last_name: reviewer.registration?.last_name || '',
          title: reviewer.registration?.title || '',
          gender: reviewer.registration?.gender || '',
          phone: reviewer.registration?.phone || '',
          city: reviewer.registration?.city || '',
          country: reviewer.registration?.country || '',
          university: reviewer.registration?.university || '',
          affiliation: reviewer.registration?.affiliation || '',
          speciality: reviewer.registration?.speciality || '',
          designation: reviewer.registration?.designation || '',
          // API status: 1 = inactive, 0 = active (waiting for activation)
          // Our component status: 'active' or 'inactive'
          // status: reviewer.status === 0 ? 'active' : 'inactive',
          status: reviewer.status ,
          resume: reviewer.registration?.resume || '',
          created_at: reviewer.created_at,
          last_login: reviewer.last_login || reviewer.created_at
        }));
        
        setReviewers(transformedReviewers);
      }

    } catch (error) {
      console.error("Error fetching reviewers:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch reviewers");
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (reviewerId) => {
    console.log("Changing status for reviewer ID:", reviewerId );
    
    try {
      // Convert our status to API status (0 = active, 1 = inactive)
      // const apiStatus = newStatus === 'active' ? 0 : 1;
      
      const response = await axios.post(
        `${API_URL}api/editor/approved-reviewer`,
        {
          user_id: reviewerId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.flag) {
        toast.success(response.data.message);
        // Update the reviewers list
        fetchReviewers();
        // Close modal if open
        setSelectedReviewer(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error updating reviewer status:", error);
      toast.error(error?.response?.data?.message || "Failed to update reviewer status");
    }
  };

  useEffect(() => {
    fetchReviewers();
  }, []);

  if(!loading) {
    console.log(reviewers);
    
  }

  // Filter reviewers
  const filteredReviewers = reviewers.filter(reviewer => {
    const matchesSearch = reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reviewer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reviewer.university && reviewer.university.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reviewer.speciality && reviewer.speciality.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || reviewer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalRecords = filteredReviewers.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = filteredReviewers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, recordsPerPage]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const getStatusBadge = (status) => {
  //  console.log(typeof status);
   
    
    return status === '0'
      ? <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Active</span>
      : <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Inactive</span>;
  };

  const downloadResume = (resumePath) => {
    if (resumePath) {
      const resumeUrl = `${VITE_STORAGE_URL}${resumePath}`;
      window.open(resumeUrl, '_blank');
    } else {
      toast.info("No resume available for this reviewer");
    }
  };

  if(loading) {
    return <Loader/>
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 bg-gray-50 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FontAwesomeIcon icon={faUserGraduate} className="text-indigo-600" />
            Manage Reviewers
          </h1>
          <p className="text-gray-600 mt-2">Manage reviewer accounts and their status</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reviewers</p>
                <p className="text-2xl font-bold text-gray-900">{reviewers.length}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <FontAwesomeIcon icon={faUserGraduate} className="text-indigo-600" size="lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Reviewers</p>
                <p className="text-2xl font-bold text-green-600">
                  {reviewers.filter(r => r.status === '0').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FontAwesomeIcon icon={faUserCheck} className="text-green-600" size="lg" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-red-600">
                  {reviewers.filter(r => r.status === '1').length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FontAwesomeIcon icon={faUserTimes} className="text-red-600" size="lg" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, university, or speciality..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-lg py-2 pl-3 pr-8 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer transition-all duration-200 hover:border-gray-400"
                >
                  <option value="all">All Status</option>
                  <option value="0">Active</option>
                  <option value="1">Inactive</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show:</span>
                <select
                  value={recordsPerPage}
                  onChange={(e) => setRecordsPerPage(Number(e.target.value))}
                  className="appearance-none border border-gray-300 rounded-lg py-2 pl-3 pr-8 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm cursor-pointer transition-all duration-200 hover:border-gray-400"
                >
                  {[2, 5, 8, 10, 20].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviewers Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden ">
          <div className="overflow-x-auto custom-scrollbar p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reviewer Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University & Affiliation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Speciality
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
                {currentRecords.map((reviewer) => (
                  <motion.tr
                    key={reviewer.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-600 font-semibold text-sm">
                              {reviewer.first_name?.[0] || ''}{reviewer.last_name?.[0] || ''}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {reviewer.title} {reviewer.first_name} {reviewer.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{reviewer.email}</div>
                          <div className="text-xs text-gray-400">
                            {reviewer.city}, {reviewer.country}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{reviewer.university}</div>
                      <div className="text-sm text-gray-500">{reviewer.affiliation}</div>
                      <div className="text-xs text-gray-400">{reviewer.designation}</div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs">
                        {reviewer.speciality || 'Not specified'}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(reviewer.status)}
                      <div className="text-xs text-gray-400 mt-1">
                        Joined: {formatDate(reviewer.created_at)}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {/* View Details Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedReviewer(reviewer)}
                        className="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                        title="View Details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </motion.button>

                      {/* Download Resume Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadResume(reviewer.resume)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 transition-colors"
                        title="Download Resume"
                      >
                        <FontAwesomeIcon icon={faDownload} />
                      </motion.button>

                      {/* Status Action Button */}
                      {reviewer.status === '1' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(reviewer.user_id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <FontAwesomeIcon icon={faUserCheck} size="xs" />
                          Activate
                        </motion.button>
                      ) 
                   }
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {currentRecords.length === 0 && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faUserGraduate} className="text-gray-300 text-4xl mb-4" />
              <p className="text-gray-500">No reviewers found matching your criteria.</p>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalRecords > 0 && (
          <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Records Info */}
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, totalRecords)} of {totalRecords} entries
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                            ? 'bg-indigo-600 text-white'
                            : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reviewer Details Modal */}
        {selectedReviewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50  flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedReviewer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Reviewer Details</h2>
                  <button
                    onClick={() => setSelectedReviewer(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedReviewer.title} {selectedReviewer.first_name} {selectedReviewer.last_name}</p>
                      <p><span className="font-medium">Username:</span> {selectedReviewer.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedReviewer.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedReviewer.phone}</p>
                      <p><span className="font-medium">Gender:</span> {selectedReviewer.gender}</p>
                      <p><span className="font-medium">Location:</span> {selectedReviewer.city}, {selectedReviewer.country}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Academic Information</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">University:</span> {selectedReviewer.university}</p>
                      <p><span className="font-medium">Affiliation:</span> {selectedReviewer.affiliation}</p>
                      <p><span className="font-medium">Designation:</span> {selectedReviewer.designation}</p>
                      <p><span className="font-medium">Speciality:</span> {selectedReviewer.speciality || 'Not specified'}</p>
                      <p><span className="font-medium">Resume:</span> {selectedReviewer.resume ? 'Available' : 'Not available'}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Status: {getStatusBadge(selectedReviewer.status)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Joined: {formatDate(selectedReviewer.created_at)} 
                      </p>
                    </div>

                    <div className="space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => downloadResume(selectedReviewer.resume)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        <FontAwesomeIcon icon={faDownload} className="mr-2" />
                        Download Resume
                      </motion.button>

                      {selectedReviewer.status === '1' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleStatusChange(selectedReviewer.user_id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          <FontAwesomeIcon icon={faUserCheck} className="mr-2" />
                          Activate
                        </motion.button>
                      ) }
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EditorManageReviewer;