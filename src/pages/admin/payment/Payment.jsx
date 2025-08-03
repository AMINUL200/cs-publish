import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFileInvoiceDollar, faCheckCircle, faTimesCircle, faClock, faMoneyBillWave, faPrint } from '@fortawesome/free-solid-svg-icons';
import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';

const Payment = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [perPage, setPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    // Dummy payment data
    const [payments, setPayments] = useState([
        {
            id: 'PAY-1001',
            manuscriptId: 'MS-001',
            manuscriptTitle: 'Deep Learning in Modern AI  flkdjfal dlfkjasldf dlfakvnlxk ',
            type: 'Processing Fee',
            amount: '$250',
            status: 'Paid',
            date: '2023-05-15',
            method: 'Credit Card',
            invoice: 'INV-1001'
        },
        {
            id: 'PAY-1002',
            manuscriptId: 'MS-002',
            manuscriptTitle: 'Quantum Computing Basics',
            type: 'Publication Fee',
            amount: '$500',
            status: 'Pending',
            date: '2023-06-10',
            method: 'Bank Transfer',
            invoice: 'INV-1002'
        },
        {
            id: 'PAY-1003',
            manuscriptId: 'MS-003',
            manuscriptTitle: 'React Hooks in Depth',
            type: 'Processing Fee',
            amount: '$250',
            status: 'Failed',
            date: '2023-06-15',
            method: 'PayPal',
            invoice: 'INV-1003'
        },
        {
            id: 'PAY-1004',
            manuscriptId: 'MS-004',
            manuscriptTitle: 'Blockchain for Beginners',
            type: 'Processing Fee',
            amount: '$250',
            status: 'Refunded',
            date: '2023-07-01',
            method: 'Credit Card',
            invoice: 'INV-1004'
        },
        {
            id: 'PAY-1005',
            manuscriptId: 'MS-005',
            manuscriptTitle: 'Microservices Architecture',
            type: 'Publication Fee',
            amount: '$500',
            status: 'Paid',
            date: '2023-07-10',
            method: 'Bank Transfer',
            invoice: 'INV-1005'
        },
    ]);

    // Filter payments by search
    const filteredPayments = payments.filter((p) => {
        const term = searchTerm.toLowerCase();
        return (
            p.id.toLowerCase().includes(term) ||
            p.manuscriptId.toLowerCase().includes(term) ||
            p.manuscriptTitle.toLowerCase().includes(term) ||
            p.type.toLowerCase().includes(term) ||
            p.status.toLowerCase().includes(term)
        );
    });
    // Calculate total pages
    const totalPages = Math.ceil(filteredPayments.length / perPage);
    // Get current page payments
    const indexOfLastPayment = currentPage * perPage;
    const indexOfFirstPayment = indexOfLastPayment - perPage;
    const visiblePayments = filteredPayments.slice(indexOfFirstPayment, indexOfLastPayment);

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
            case 'Paid':
                return <div className="flex items-center justify-center text-green-500 bg-current/15 px-2 py-1 rounded-2xl">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 mr-1" />
                    {status}
                </div>
            case 'Failed':
                return <div className="flex items-center justify-center text-red-500 bg-current/15 px-2 py-1 rounded-2xl">
                    <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 mr-1" />
                    {status}
                </div>
            case 'Pending':
                return <div className="flex items-center justify-center text-yellow-500 bg-current/15 px-2 py-1 rounded-2xl">
                    <FontAwesomeIcon icon={faClock} className="text-yellow-500 mr-1" />
                    {status}
                </div>
            case 'Refunded':
                return <div className="flex items-center justify-center text-blue-500 bg-current/15 px-2 py-1 rounded-2xl">
                    <FontAwesomeIcon icon={faMoneyBillWave} className="text-blue-500 mr-1" />
                    {status}
                </div>
            default:
                return <div className="flex items-center justify-center text-gray-500 bg-current/15 px-2 py-1 rounded-2xl">
                    <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-gray-500 mr-1" />
                    {status}
                </div>
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">💳 PAYMENT RECORDS</h1>
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
                        placeholder="Search payments..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 ">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Payment ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Manuscript ID</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Method</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Invoice</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 border-b-2">
                        {visiblePayments.length > 0 ? (
                            visiblePayments.map((p) => (
                                <tr key={p.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{p.manuscriptId}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate ">{p.manuscriptTitle}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.amount}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        {getStatusIcon(p.status)}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{p.date}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{p.method}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                                        <a href={`/invoices/${p.invoice}`} className="hover:underline">{p.invoice}</a>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex space-x-2">
                                            <button
                                                className="flex gap-2 items-center justify-center text-blue-600 bg-current/15 p-2 rounded-xl hover:text-blue-900 cursor-pointer"
                                                title="View Invoice Details"
                                            >
                                                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                                                Invoice
                                            </button>
                                            <button
                                                className="flex gap-2 items-center justify-center text-gray-600 bg-current/15 p-2 rounded-xl hover:text-gray-900 cursor-pointer"
                                                title="Print Invoice"
                                            >
                                                <FontAwesomeIcon icon={faPrint} />
                                                Print
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No payment records found matching your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer info with pagination */}
            <div className="flex flex-col sm:flex-row sm:gap-4 justify-between items-center mt-4 text-sm text-gray-600 ">
                <div className="mb-2 sm:mb-0">
                    Showing {visiblePayments.length > 0 ? indexOfFirstPayment + 1 : 0} to{' '}
                    {Math.min(indexOfLastPayment, filteredPayments.length)} of{' '}
                    {filteredPayments.length} entries
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
        </div>
    );
};

export default Payment;