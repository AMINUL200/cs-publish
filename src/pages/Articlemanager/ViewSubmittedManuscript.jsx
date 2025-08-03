import { faEdit, faTrash, faSearch, faPlus, faFileAlt, faCheckCircle, faTimesCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ViewSubmittedManuscript = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();

    // Enhanced dummy data with all required fields
    const [manuscripts, setManuscripts] = useState([
        { 
            id: 1, 
            title: 'Deep Learning in Modern AI xsfad sfasf dfas', 
            author: 'Alice Johnson', 
            journal: 'AI Research Journal',
            status: 'Under Review',
            processingPayment: 'Paid',
            publicationPayment: 'Pending',
            dateSubmitted: '2023-05-15',
            dateUpdated: '2023-06-20'
        },
        { 
            id: 2, 
            title: 'Quantum Computing Basics', 
            author: 'Bob Smith', 
            journal: 'Tech Innovators',
            status: 'Accepted',
            processingPayment: 'Paid',
            publicationPayment: 'Paid',
            dateSubmitted: '2023-04-10',
            dateUpdated: '2023-05-25'
        },
        { 
            id: 3, 
            title: 'React Hooks in Depth', 
            author: 'Charlie Brown', 
            journal: 'Frontend World',
            status: 'Rejected',
            processingPayment: 'Refunded',
            publicationPayment: 'N/A',
            dateSubmitted: '2023-06-01',
            dateUpdated: '2023-06-30'
        },
        { 
            id: 4, 
            title: 'Blockchain for Beginners', 
            author: 'Diana Prince', 
            journal: 'Future Tech',
            status: 'Submitted',
            processingPayment: 'Pending',
            publicationPayment: 'N/A',
            dateSubmitted: '2023-07-05',
            dateUpdated: '2023-07-05'
        },
        { 
            id: 5, 
            title: 'Microservices Architecture', 
            author: 'Eve Adams', 
            journal: 'Backend Weekly',
            status: 'Revision Required',
            processingPayment: 'Paid',
            publicationPayment: 'Pending',
            dateSubmitted: '2023-03-20',
            dateUpdated: '2023-05-15'
        },
    ]);

    const [perPage, setPerPage] = useState(5);

    // Filter manuscripts by search
    const filteredManuscripts = manuscripts.filter((m) => {
        const term = searchTerm.toLowerCase();
        return (
            m.title.toLowerCase().includes(term) ||
            m.author.toLowerCase().includes(term) ||
            m.journal.toLowerCase().includes(term) ||
            m.status.toLowerCase().includes(term)
        );
    });

    const visibleManuscripts = filteredManuscripts.slice(0, perPage);

    const handleDelete = (id) => {
        setDeleteLoading(true);
        setTimeout(() => {
            setManuscripts((prev) => prev.filter((m) => m.id !== id));
            setDeleteLoading(false);
        }, 800);
    };

    const handleNavigate = (id) => {
        navigate(`/manuscript/view/${id}`);
    };

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Accepted':
                return <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />;
            case 'Rejected':
                return <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-1" />;
            case 'Under Review':
                return <FontAwesomeIcon icon={faFileAlt} className="text-blue-500 mr-1" />;
            case 'Revision Required':
                return <FontAwesomeIcon icon={faClock} className="text-yellow-500 mr-1" />;
            default:
                return <FontAwesomeIcon icon={faFileAlt} className="text-gray-500 mr-1" />;
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">📑 VIEW MANUSCRIPTS</h1>
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
            <div className="overflow-x-auto custom-scrollbar pb-6">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Journal</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proc. Payment</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pub. Payment</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Submitted</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Updated</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {visibleManuscripts.length > 0 ? (
                            visibleManuscripts.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{m.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{m.journal}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{m.author}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{m.title}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center">
                                            {getStatusIcon(m.status)}
                                            {m.status}
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            m.processingPayment === 'Paid' ? 'bg-green-100 text-green-800' :
                                            m.processingPayment === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {m.processingPayment}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            m.publicationPayment === 'Paid' ? 'bg-green-100 text-green-800' :
                                            m.publicationPayment === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {m.publicationPayment}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{m.dateSubmitted}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{m.dateUpdated}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleNavigate(m.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="Edit"
                                            >
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(m.id)}
                                                disabled={deleteLoading}
                                                className={`${deleteLoading ? 'text-gray-400' : 'text-red-600 hover:text-red-900'}`}
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
                                <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No manuscripts found matching your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
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