import React, { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  Send, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Calendar,
  User,
  Hash,
  AlertCircle
} from "lucide-react";

const samplePayments = [
  {
    id: "MS123",
    title: "AI in Healthcare",
    author: "Dr. A. Kumar",
    amount: 120,
    status: "Pending",
    dueDate: "2025-09-20",
  },
  {
    id: "MS124",
    title: "Blockchain Security",
    author: "M. Roy",
    amount: 100,
    status: "Completed",
    dueDate: "2025-09-10",
  },
  {
    id: "MS125",
    title: "Climate Change Studies",
    author: "S. Das",
    amount: 150,
    status: "Pending",
    dueDate: "2025-09-22",
  },
  {
    id: "MS126",
    title: "Renewable Energy Solutions",
    author: "P. Sharma",
    amount: 200,
    status: "Completed",
    dueDate: "2025-08-15",
  },
  {
    id: "MS127",
    title: "Machine Learning Applications",
    author: "R. Patel",
    amount: 180,
    status: "Pending",
    dueDate: "2025-09-25",
  },
  {
    id: "MS128",
    title: "Quantum Computing Advances",
    author: "Dr. S. Singh",
    amount: 250,
    status: "Completed",
    dueDate: "2025-08-30",
  },
  {
    id: "MS129",
    title: "Neuroscience Research",
    author: "A. Gupta",
    amount: 170,
    status: "Pending",
    dueDate: "2025-09-28",
  },
];

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

const PublisherViewPayments = () => {
  const [payments, setPayments] = useState(samplePayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const resendReminder = (id) => {
    alert(`Reminder sent for ${id}`);
  };

  const markAsPaid = (id) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: "Completed" } : p))
    );
  };

  // Filter and search logic
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const currentPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPayments, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Calculate summary statistics
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const completedAmount = payments
    .filter(p => p.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 text-white rounded-lg">
            <DollarSign className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Dashboard</h1>
        </div>
        <p className="text-gray-600 ml-11">
          Track payment requests, verify status, and manage author payments
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">${totalAmount}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-orange-600">${pendingAmount}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Payments</p>
              <p className="text-2xl font-bold text-green-600">${completedAmount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-gray-500" />
            <h2 className="text-xl font-semibold text-gray-900">Payment Requests</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Status Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-40 pl-9 pr-8 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search manuscripts or authors..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-64 pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        {/* Table Header with Items Per Page */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-6 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <span>entries</span>
          </div>
          
          <div className="text-sm text-gray-500">
            {filteredPayments.length} of {payments.length} payments
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" />
                    ID
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Title
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Author
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Amount
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Due Date
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {currentPayments.map((payment, index) => (
                <tr
                  key={payment.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <div className="text-sm font-medium text-gray-900">{payment.id}</div>
                  </td>
                  <td className="px-6 py-4 border-2">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{payment.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <div className="text-sm text-gray-600">{payment.author}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <div className="text-sm font-semibold text-gray-900">${payment.amount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    <div className="text-sm text-gray-500">{payment.dueDate}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    {payment.status === "Completed" ? (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Completed
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <Clock className="w-3 h-3" />
                        Pending
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap border-2">
                    <div className="flex items-center justify-center gap-2">
                      {payment.status === "Pending" && (
                        <>
                          <button
                            onClick={() => resendReminder(payment.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            Remind
                          </button>
                          <button
                            onClick={() => markAsPaid(payment.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Mark Paid
                          </button>
                        </>
                      )}
                      {payment.status === "Completed" && (
                        <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                          <Eye className="w-3 h-3" />
                          View Receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {currentPayments.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle className="w-12 h-12 text-gray-400" />
                      <div className="text-gray-500">
                        <div className="font-medium">No payment records found</div>
                        <div className="text-sm">Try adjusting your search or filter criteria</div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredPayments.length)} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of{" "}
            {filteredPayments.length} entries
            {searchQuery && ` (filtered from ${payments.length} total)`}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            <div className="flex gap-1 mx-2">
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
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherViewPayments;