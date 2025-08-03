import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faEnvelope,
    faCheckCircle,
    faTimesCircle,
    faClock,
    faPaperclip,
    faEye,
    faTrash,
    faReply,
    faForward,
    faXmark
} from '@fortawesome/free-solid-svg-icons';
import {
    faAnglesLeft,
    faAngleLeft,
    faAngleRight,
    faAnglesRight
} from '@fortawesome/free-solid-svg-icons';

const EmailTemplate = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dummy email data
    const [emails, setEmails] = useState([
        {
            id: 'EM-1001',
            title: 'Submission Confirmation - Manuscript #MS-001',
            sender: 'editor@journal.com',
            date: '2023-05-15',
            status: 'Read',
            hasAttachment: true,
            important: true,
            content: `Dear Author,

Thank you for submitting your manuscript titled "Deep Learning in Modern AI" to our journal. Your submission has been received and is currently being processed.

Manuscript ID: MS-001
Submission Date: 2023-05-15

Our editorial team will review your submission and you will be notified about the next steps in the review process within 2-3 weeks.

Please find attached the submission confirmation document for your records.

Best regards,
Editorial Team
Journal of Advanced AI Research`
        },
        {
            id: 'EM-1002',
            title: 'Reviewer Assignment Notification',
            sender: 'system@journal.com',
            date: '2023-06-10',
            status: 'Unread',
            hasAttachment: false,
            important: true,
            content: `Dear Author,

We are pleased to inform you that we have assigned reviewers for your manuscript titled "Quantum Computing Basics" (MS-002).

The review process is expected to take approximately 4 weeks. You will be notified as soon as we receive all reviews.

You can track the status of your submission through your author dashboard.

Thank you for your patience.

Best regards,
Editorial Office
Journal of Advanced AI Research`
        },
        // ... (other emails with content property added)
    ]);

    // Filter emails by search
    const filteredEmails = emails.filter((email) => {
        const term = searchTerm.toLowerCase();
        return (
            email.id.toLowerCase().includes(term) ||
            email.title.toLowerCase().includes(term) ||
            email.sender.toLowerCase().includes(term) ||
            email.status.toLowerCase().includes(term)
        );
    });

    // Calculate total pages
    const totalPages = Math.ceil(filteredEmails.length / perPage);

    // Get current page emails
    const indexOfLastEmail = currentPage * perPage;
    const indexOfFirstEmail = indexOfLastEmail - perPage;
    const visibleEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
    const firstPage = () => setCurrentPage(1);
    const lastPage = () => setCurrentPage(totalPages);

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            const leftOffset = Math.floor(maxVisiblePages / 2);
            const rightOffset = Math.ceil(maxVisiblePages / 2) - 1;

            if (currentPage <= leftOffset) {
                // Near the beginning
                for (let i = 1; i <= maxVisiblePages; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            } else if (currentPage >= totalPages - rightOffset) {
                // Near the end
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
                    pageNumbers.push(i);
                }
            } else {
                // In the middle
                pageNumbers.push(1);
                pageNumbers.push('...');
                for (let i = currentPage - leftOffset; i <= currentPage + rightOffset; i++) {
                    pageNumbers.push(i);
                }
                pageNumbers.push('...');
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Read':
                return <div className="flex items-center justify-center text-gray-500 bg-current/15 px-2 py-1 rounded-2xl">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-gray-500 mr-1" />
                    {status}
                </div>;
            case 'Unread':
                return <div className="flex items-center justify-center text-blue-500 bg-current/15 px-2 py-1 rounded-2xl">
                    <FontAwesomeIcon icon={faEnvelope} className="text-blue-500 mr-1" />
                    {status}
                </div>;
            default:
                return <div className="flex items-center justify-center text-gray-500 bg-current/15 px-2 py-1 rounded-2xl">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-500 mr-1" />
                    {status}
                </div>;
        }
    };

    const handleViewEmail = (email) => {
        setSelectedEmail(email);
        setIsModalOpen(true);
        // Mark as read if unread
        if (email.status === 'Unread') {
            setEmails(emails.map(e =>
                e.id === email.id ? { ...e, status: 'Read' } : e
            ));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEmail(null);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">📧 EMAIL INBOX</h1>
            </div>

            {/* Search & Per-page selector */}
            <div className="flex justify-between mb-6 items-center">
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
                            {[5, 10, 20, 50].map((option) => (
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
                        placeholder="Search emails..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Sender</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Status</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 border-b-2">
                        {visibleEmails.length > 0 ? (
                            visibleEmails.map((email) => (
                                <tr
                                    key={email.id}
                                    className={` ${email.status === 'Unread' ? 'font-semibold' : ''} `}
                                >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{email.id}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{email.title}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{email.sender}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{email.date}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {getStatusIcon(email.status)}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex justify-center space-x-2">
                                            <button
                                                onClick={() => handleViewEmail(email)}
                                                className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50 cursor-pointer"
                                                title="View Email"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </button>

                                            <button
                                                className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 cursor-pointer"
                                                title="Delete"
                                            >
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No emails found matching your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer info with pagination */}
            <div className="flex flex-col sm:flex-row sm:gap-4 justify-between items-center mt-4 text-sm text-gray-600">
                <div className="mb-2 sm:mb-0">
                    Showing {visibleEmails.length > 0 ? indexOfFirstEmail + 1 : 0} to{' '}
                    {Math.min(indexOfLastEmail, filteredEmails.length)} of{' '}
                    {filteredEmails.length} emails
                </div>

                <div className="flex items-center space-x-1">
                    <button
                        onClick={firstPage}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        title="First Page"
                    >
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </button>
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        title="Previous Page"
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </button>

                    {getPageNumbers().map((number, index) => (
                        number === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 py-1">...</span>
                        ) : (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`px-3 py-1 rounded-md ${currentPage === number ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                            >
                                {number}
                            </button>
                        )
                    ))}

                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        title="Next Page"
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                    <button
                        onClick={lastPage}
                        disabled={currentPage === totalPages}
                        className="px-2 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                        title="Last Page"
                    >
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </button>
                </div>
            </div>

            {/* Email Detail Modal */}
            {isModalOpen && selectedEmail && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50  transition-opacity duration-300">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transform transition-all duration-300 scale-95 opacity-0 animate-fadeIn">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900">{selectedEmail.title}</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faXmark} size="lg" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="mb-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="font-medium text-gray-900">From: {selectedEmail.sender}</p>
                                        <p className="text-sm text-gray-500">Date: {selectedEmail.date}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {selectedEmail.hasAttachment && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <FontAwesomeIcon icon={faPaperclip} className="mr-1" />
                                                Attachment
                                            </span>
                                        )}
                                        {selectedEmail.important && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Important
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 border-t pt-4">
                                    <pre className="whitespace-pre-wrap font-sans text-gray-800">{selectedEmail.content}</pre>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t px-6 py-4 bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                            >
                                <FontAwesomeIcon icon={faReply} className="mr-2" />
                                Reply
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-700 flex items-center"
                            >
                                <FontAwesomeIcon icon={faForward} className="mr-2" />
                                Forward
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
};

export default EmailTemplate;