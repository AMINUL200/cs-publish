import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    faQuestionCircle
} from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import Loader from '../../../components/common/Loader'

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

const recommendationMap = {
    minor_revisions: 'Minor Revisions',
    major_revisions: 'Major Revisions',
    accept: 'Accept',
    reject: 'Reject'
}

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};


const AssignedManuscript = () => {
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;
    const [manuscripts, setManuscripts] = useState([])
    const [loading, setLoading] = useState(true);
    const [selectedManuscript, setSelectedManuscript] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAssignedManuscripts = async () => {
        try {
            const response = await axios.get(`${API_URL}api/editor/show-manuscript`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.flag === 1) {
                setManuscripts(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch assigned manuscripts");
            }
        } catch (error) {
            console.error("Error fetching assigned manuscripts:", error);
            toast.error(error.response?.data?.message || "Failed to fetch assigned manuscripts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedManuscripts();
    }, [token]);

    const openModal = (assignment) => {
        setSelectedManuscript(assignment);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedManuscript(null);
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
                            <div className="absolute inset-0 bg-gray-500/75 " onClick={closeModal}></div>
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
                                                        <p className="text-sm font-medium text-gray-500">Title</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.title}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Abstract</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.manuscript.abstract}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Reviewer Details */}
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                                                    Reviewer Information
                                                </h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Name</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.reviewer.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                                        <p className="text-sm text-gray-900">{selectedManuscript.reviewer.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Assigned Date</p>
                                                        <p className="text-sm text-gray-900">
                                                            {formatDate(selectedManuscript.assigned_at)}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Status</p>
                                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[selectedManuscript.status]}`}>
                                                            {statusIcons[selectedManuscript.status]}
                                                            <span className="ml-1 capitalize">{selectedManuscript.status}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        {selectedManuscript.manuscript.messages.length > 0 && (
                                            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faComments} className="mr-2" />
                                                    Review Messages
                                                </h4>
                                                <div className="space-y-4">
                                                    {selectedManuscript.manuscript.messages.map((message, index) => (
                                                        <div key={index} className="border-l-4 border-indigo-500 pl-4 py-2">
                                                            <div className="mb-2">
                                                                <p className="text-sm font-medium text-gray-500">Message to Editor</p>
                                                                <p className="text-sm text-gray-900">{message.message_to_editor}</p>
                                                            </div>
                                                            <div className="mb-2">
                                                                <p className="text-sm font-medium text-gray-500">Message to Author</p>
                                                                <p className="text-sm text-gray-900">{message.message_to_author}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-500">Recommendation</p>
                                                                <p className="text-sm text-gray-900">
                                                                    {recommendationMap[message.recommendation] || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Problems */}
                                        {selectedManuscript.manuscript.problems.length > 0 && (
                                            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                                                <h4 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                                                    <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                                                    Review Questions
                                                </h4>
                                                <div className="space-y-4">
                                                    {selectedManuscript.manuscript.problems.map((problem, index) => (
                                                        <div key={problem.id} className="border-l-4 border-blue-500 pl-4 py-2">
                                                            <p className="text-sm font-medium text-gray-500">Question {index + 1}</p>
                                                            <p className="text-sm text-gray-900">{problem.question}</p>
                                                            {/* <p className="text-sm font-medium text-gray-500 mt-1">Answer : &nbsp; {problem.answer}</p> */}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
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
                    <h1 className="text-xl font-semibold text-gray-900">Assigned Manuscripts</h1>
                    <p className="mt-2 text-sm text-gray-700">
                        Overview of manuscripts assigned to reviewers and their current status
                    </p>
                </div>
            </div>

            {/* Stats cards */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 rounded-md bg-green-500 p-3">
                                <FontAwesomeIcon icon={faCheckCircle} className="text-white" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-gray-500">Completed</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {manuscripts.filter(a => a.status === 'completed').length}
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
                                    <dt className="truncate text-sm font-medium text-gray-500">Pending</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {manuscripts.filter(a => a.status === 'pending').length}
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
                                    <dt className="truncate text-sm font-medium text-gray-500">Rejected</dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-gray-900">
                                            {manuscripts.filter(a => a.status === 'rejected').length}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flow-root">
                <div className="-my-2 -mx-4 overflow-x-auto custom-scrollbar sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                            #
                                        </th>

                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                                            Reviewer
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                            Assigned Date
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Status
                                        </th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                            Recommendation
                                        </th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Details</span>
                                            <span >Details</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {manuscripts.map((assignment, index) => (
                                        <tr key={assignment.assignment_id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                                {index + 1}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <div className="text-gray-900">{assignment.reviewer.name}</div>
                                                <div className="text-gray-500">{assignment.reviewer.email}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {formatDate(assignment.assigned_at)}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[assignment.status]}`}>
                                                    {statusIcons[assignment.status]}
                                                    <span className="ml-1 capitalize">{assignment.status}</span>
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {assignment.manuscript.messages.length > 0
                                                    ? recommendationMap[assignment.manuscript.messages[0].recommendation] || 'N/A'
                                                    : 'N/A'}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button
                                                    onClick={() => openModal(assignment)}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                                                    View<span className="sr-only">, {assignment.manuscript.title}</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssignedManuscript;