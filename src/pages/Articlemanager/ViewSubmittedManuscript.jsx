import { faEdit, faTrash, faSearch, faPlus, faFileAlt, faCheckCircle, faTimesCircle, faClock, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../lib/utils';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import PaginationControls from '../../components/common/PaginationControls';
import RecordsPerPageSelector from '../../components/common/RecordsPerPageSelector';
import SearchInput from '../../components/common/SearchInput';

const ViewSubmittedManuscript = () => {
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [manuscripts, setManuscripts] = useState([]);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedManuscript, setSelectedManuscript] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const statusStyles = {
        completed: 'bg-green-100 text-green-800',
        accepted: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        pending: 'bg-yellow-100 text-yellow-800'
    }

    const statusIcons = {
        completed: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />,
        accepted: <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />,
        rejected: <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-1" />,
        pending: <FontAwesomeIcon icon={faClock} className="text-yellow-500 mr-1" />
    }

    const fetchManuscripts = async () => {
        try {
            const res = await axios.get(`${API_URL}api/admin/track-manuscript`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (res.data.success === true) {
                setManuscripts(res.data.data);
            } else {
                toast.error(res.data.message || "Failed to fetch manuscripts");
            }
        } catch (error) {
            console.error('Error fetching manuscripts:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch manuscripts');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchManuscripts();
    }, [token]);

    // Filter manuscripts based on search term
    const filteredManuscripts = useMemo(() => {
        if (!searchTerm) return manuscripts;
        const term = searchTerm.toLowerCase();
        return manuscripts.filter((m) => {
            const editorName = m.manuscript.journal.editor?.name?.toLowerCase() || '';
            const reviewerNames = m.reviewers.map(r => r.name.toLowerCase()).join(' ');

            return (
                m.manuscript.title?.toLowerCase().includes(term) ||
                m.manuscript.journal.name?.toLowerCase().includes(term) ||
                editorName.includes(term) ||
                reviewerNames.includes(term) ||
                m.manuscript.status?.toLowerCase().includes(term)
            );
        });
    }, [manuscripts, searchTerm]);

    // Calculate pagination values
    const totalRecords = filteredManuscripts.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = Math.min(startIndex + recordsPerPage, totalRecords);
    const currentRecords = filteredManuscripts.slice(startIndex, endIndex);

    // Reset to first page when search term or records per page changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, recordsPerPage]);

    const openModal = (manuscript) => {
        setSelectedManuscript(manuscript);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedManuscript(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleRecordsPerPageChange = (value) => {
        setRecordsPerPage(value);
        setCurrentPage(1); // Reset to first page
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />;
            case 'rejected':
                return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-1" />;
            case 'accepted':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mr-1" />;
            case 'pending':
                return <FontAwesomeIcon icon={faClock} className="text-yellow-500 mr-1" />;
            default:
                return <FontAwesomeIcon icon={faFileAlt} className="text-gray-500 mr-1" />;
        }
    };

    const getReviewerStatusSummary = (reviewers) => {
        const statusCounts = {
            pending: 0,
            completed: 0,
            accepted: 0,
            rejected: 0
        };

        reviewers.forEach(reviewer => {
            statusCounts[reviewer.status]++;
        });

        return (
            <div className="flex space-x-2">
                {statusCounts.completed > 0 && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {statusCounts.completed} Completed
                    </span>
                )}
                {statusCounts.pending > 0 && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        {statusCounts.pending} Pending
                    </span>
                )}
                {statusCounts.rejected > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                        {statusCounts.rejected} Rejected
                    </span>
                )}
                {statusCounts.accepted > 0 && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {statusCounts.accepted} Accepted
                    </span>
                )}
            </div>
        );
    };

    if (loading) {
        return <Loader />
    }

    return (
        <div className="px-4 py-6 sm:px-6 lg:px-8">
            {/* Modal */}
            {isModalOpen && selectedManuscript && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500/75" onClick={closeModal}></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
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

                                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Manuscript Details */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                                                    Manuscript Information
                                                </h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">ID</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.id}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Title</p>
                                                        <p className="text-sm text-gray-900" dangerouslySetInnerHTML={{ __html: selectedManuscript.manuscript.title }} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Journal</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.journal.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                                        <div className="flex items-center">
                                                            {getStatusIcon(selectedManuscript.manuscript.status)}
                                                            <span className="ml-1 capitalize">{selectedManuscript.manuscript.status}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Submitted Date</p>
                                                        <p className="text-sm text-gray-900">{formatDate(selectedManuscript.manuscript.created_at)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Editor Details */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                                    Editor Information
                                                </h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Editor Name</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.journal.editor.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Editor ID</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.journal.editor.editor_id}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.journal.editor.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reviewers */}
                                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                <FontAwesomeIcon icon={faUser} className="mr-2" />
                                                Assigned Reviewers {`(${(selectedManuscript.reviewers || []).length})`}
                                            </h4>
                                            <div className="space-y-4">
                                                {(selectedManuscript.reviewers || []).map((assignment, idx) => (
                                                    <div key={assignment.reviewer_id} className="border rounded-md p-3">
                                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-900">{idx + 1}. {assignment?.name}</p>
                                                                <p className="text-xs text-gray-500">{assignment?.email}</p>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="text-xs text-gray-600 flex items-center">
                                                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                                                                    {formatDate(assignment.assigned_at)}
                                                                </div>
                                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[assignment.status]}`}>
                                                                    {statusIcons[assignment.status]}
                                                                    <span className="ml-1 capitalize">{assignment.status}</span>
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Messages for this reviewer */}
                                                        {(assignment.all_messages || []).length > 0 && (
                                                            <div className="mt-3 bg-white rounded">
                                                                <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                                                                    <FontAwesomeIcon icon={faComments} className="mr-2" />
                                                                    Messages
                                                                </h5>
                                                                <div className="space-y-3">
                                                                    {assignment.all_messages.map((message, mIdx) => (
                                                                        <div key={message.id || mIdx} className="border-l-4 border-indigo-500 pl-3">
                                                                            <div className="mb-1">
                                                                                <p className="text-xs font-medium text-gray-500">Message to Editor</p>
                                                                                <p className="text-sm text-gray-900">{message.message_to_editor}</p>
                                                                            </div>
                                                                            <div className="mb-1">
                                                                                <p className="text-xs font-medium text-gray-500">Message to Author</p>
                                                                                <p className="text-sm text-gray-900">{message.message_to_author}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Problems for this reviewer */}
                                                        {(assignment.all_problems || []).length > 0 && (
                                                            <div className="mt-3 bg-white rounded">
                                                                <h5 className="text-sm font-medium text-gray-800 mb-2 flex items-center">
                                                                    <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                                                                    Questions
                                                                </h5>
                                                                <div className="space-y-2">
                                                                    {assignment.all_problems.map((problem, pIdx) => (
                                                                        <div key={problem.id || pIdx} className="border-l-4 border-blue-500 pl-3">
                                                                            <p className="text-xs font-medium text-gray-500">Question {pIdx + 1}</p>
                                                                            <p className="text-sm text-gray-900">{problem.question}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                    <h1 className="text-xl font-semibold text-gray-900">View Manuscripts</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Overview of all submitted manuscripts and their current status
                    </p>
                </div>
            </div>

            {/* Search & Per-page selector */}
            <div className="mt-8 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
                <RecordsPerPageSelector
                    value={recordsPerPage}
                    onChange={handleRecordsPerPageChange}
                    options={[5, 10, 25, 50]}
                />

                <SearchInput
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search manuscripts..."
                />
            </div>

            {/* Table */}
            <div className="mt-4 flow-root">
                <div className="-my-2 -mx-4 overflow-x-auto custom-scrollbar sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            ID
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Title
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Journal
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Editor
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Reviewers
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">View</span>
                                            <span>View</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {currentRecords.length > 0 ? (
                                        currentRecords.map((m) => (
                                            <tr key={m.manuscript.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {m.manuscript.id}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 max-w-[15rem] truncate">
                                                    <div dangerouslySetInnerHTML={{ __html: m.manuscript.title }} />
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {m.manuscript.journal.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div>
                                                        <p className="font-medium">{m.manuscript.journal.editor.name}</p>
                                                        <p className="text-xs text-gray-400">{m.manuscript.journal.editor.editor_id}</p>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">
                                                    {m.reviewers.length > 0 ? (
                                                        <>
                                                            <p className="font-medium">{m.reviewers[0].name}</p>
                                                            <p className="text-xs text-gray-400">{m.reviewers[0].reviewer_id}</p>
                                                            {m.reviewers.length > 1 && (
                                                                <p className="text-xs text-blue-500 mt-1">+{m.reviewers.length - 1} more</p>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <p className="text-gray-400">Not Assigned</p>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <div className="flex items-center">
                                                        {getStatusIcon(m.manuscript.status)}
                                                        <span className="capitalize">{m.manuscript.status}</span>
                                                    </div>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-center text-sm font-medium sm:pr-6">
                                                    <button
                                                        onClick={() => openModal(m)}
                                                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                                        title="View Details"
                                                    >
                                                        <FontAwesomeIcon icon={faEye} className='pr-1' />
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                                                {searchTerm
                                                    ? "No matching manuscripts found"
                                                    : "No manuscripts available"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
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

export default ViewSubmittedManuscript;