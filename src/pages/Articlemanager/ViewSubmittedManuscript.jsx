import { faEdit, faTrash, faSearch, faPlus, faFileAlt, faCheckCircle, faTimesCircle, faClock, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';


const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const ViewSubmittedManuscript = () => {
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [manuscripts, setManuscripts] = useState([]);
    const [perPage, setPerPage] = useState(5);
    const [selectedManuscript, setSelectedManuscript] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);


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

    const openModal = (manuscript) => {
        setSelectedManuscript(manuscript);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedManuscript(null);
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

    const filteredManuscripts = manuscripts.filter((m) => {
        const term = searchTerm.toLowerCase();
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

    const visibleManuscripts = filteredManuscripts.slice(0, perPage);
    console.log('Visible Manuscripts:', visibleManuscripts);


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
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.title}</p>
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
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.journal.editor.id}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reviewers */}
                                        <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                <FontAwesomeIcon icon={faSearch} className="mr-2" />
                                                Reviewers
                                            </h4>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned At</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {selectedManuscript.reviewers.length === 0 && (
                                                            <tr>
                                                                <td colSpan="4" className="px-4 py-2 text-center text-sm text-gray-500">
                                                                    No reviewers assigned yet.
                                                                </td>
                                                            </tr>
                                                        )}
                                                        {selectedManuscript.reviewers.map((reviewer, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{reviewer.name}</td>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{reviewer.id}</td>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm">
                                                                    <div className="flex items-center">
                                                                        {getStatusIcon(reviewer.status)}
                                                                        <span className="capitalize">{reviewer.status}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                                                    {/* {new Date(reviewer.assigned_at).toLocaleDateString()} */}
                                                                    {formatDate(reviewer.assigned_at)}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Messages and Problems */}
                                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Messages */}
                                            {selectedManuscript.messages.length > 0 && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                        <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                                                        Messages
                                                    </h4>
                                                    {selectedManuscript.messages.map((message, index) => (
                                                        <div key={index} className="mb-4 p-3 bg-white rounded border border-gray-200">
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-medium text-sm">{message.sender.name} ({message.sender.id})</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {/* {new Date(message.created_at).toLocaleString()} */}
                                                                    {formatDate(message.created_at)}
                                                                </p>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="text-sm font-medium text-gray-500">To Editor:</p>
                                                                <p className="text-sm">{message.message_to_editor}</p>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="text-sm font-medium text-gray-500">To Author:</p>
                                                                <p className="text-sm">{message.message_to_author}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Problems */}
                                            {selectedManuscript.problems.length > 0 && (
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                        <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                                        Problems Identified
                                                    </h4>
                                                    {selectedManuscript.problems.map((problem, index) => (
                                                        <div key={index} className="mb-4 p-3 bg-white rounded border border-gray-200">
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-medium text-sm">{problem.reviewer.name} ({problem.reviewer.id})</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {/* {new Date(problem.created_at).toLocaleString()} */}
                                                                    {formatDate(problem.created_at)}
                                                                </p>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="text-sm font-medium text-gray-500">Question:</p>
                                                                <p className="text-sm">{problem.question}</p>
                                                            </div>
                                                            <div className="mt-2">
                                                                <p className="text-sm font-medium text-gray-500">Answer:</p>
                                                                <p className="text-sm">{problem.answer}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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
            <div className="flex justify-between mb-6 items-center mt-8">
                <div className="flex items-center space-x-2">
                    <label htmlFor="perPage" className="text-sm font-medium text-gray-700 hidden sm:block">
                        Show per page:
                    </label>
                    <div className="relative">
                        <select
                            id="perPage"
                            value={perPage}
                            onChange={(e) => setPerPage(Number(e.target.value))}
                            className="appearance-none bg-white border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer transition-all duration-200 hover:border-blue-400"
                        >
                            {[3, 5, 10, 20, 50].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search manuscripts..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="mt-8 flow-root">
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
                                            Reviewer
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">View</span>
                                            <span >View</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {visibleManuscripts.length > 0 ? (
                                        visibleManuscripts.map((m) => (
                                            <tr key={m.manuscript.id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    {m.manuscript.id}
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-900 max-w-[15rem] truncate">
                                                    {m.manuscript.title}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {m.manuscript.journal.name}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <div>
                                                        <p className="font-medium">{m.manuscript.journal.editor.name}</p>
                                                        <p className="text-xs text-gray-400">{m.manuscript.journal.editor.id}</p>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-gray-500">
                                                    <p className="font-medium">{m.reviewers[0]?.name || "Not Assigned"}</p>
                                                    <p className="text-xs text-gray-400">{m.reviewers[0]?.id} </p>
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
                                            <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                                No manuscripts found matching your search criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer info */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div>
                    Showing {visibleManuscripts.length > 0 ? 1 : 0} to {visibleManuscripts.length} of{' '}
                    {filteredManuscripts.length} filtered / {manuscripts.length} total
                </div>
            </div>
        </div>
    );
};

export default ViewSubmittedManuscript;