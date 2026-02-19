import React from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentForAuthor = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  
  const [payments, setPayments] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [totalCollection, setTotalCollection] = React.useState("0.00");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [currentPage, setCurrentPage] = React.useState(1);
  
  // State for modal
  const [selectedPayment, setSelectedPayment] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_URL}api/admin/payment-collections`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag === 1) {
        // Sort payments by created_at date (newest first)
        const sortedPayments = response.data.payments.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        setPayments(sortedPayments);
        console.log("Fetched payments:", sortedPayments);
        setTotalCollection(response.data.total_collection);
      } else {
        toast.error(response.data.message || "Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error(error?.response?.data?.message || "Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPayments();
  }, []);

  // Filter payments based on status
  const filteredPayments = payments.filter(payment => {
    if (filterStatus === "all") return true;
    return payment.payment_status === filterStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page
  };

  // Send invoice function
  const handleSendInvoice = async (paymentId, manuscriptId) => {
    try {
      const response = await axios.post(
        `${API_URL}api/admin/send-invoice`,
        {
          payment_id: paymentId,
          manuscript_id: manuscriptId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.flag === 1) {
        toast.success("Invoice sent successfully!");
        fetchPayments(); // Refresh data
      } else {
        toast.error(response.data.message || "Failed to send invoice");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      toast.error(error?.response?.data?.message || "Failed to send invoice");
    }
  };

  // View details function
  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  // Close modal function
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  // Helper function to strip HTML tags
  const stripHtml = (html) => {
    if (!html) return "N/A";
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Get status badge class
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${parseFloat(amount).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Payment Details Modal Component
  const PaymentDetailsModal = ({ payment, onClose }) => {
    if (!payment) return null;

    return (
      <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Payment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            {/* Payment Status Banner */}
            <div className={`mb-6 p-4 rounded-lg border ${getStatusClass(payment.payment_status)}`}>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Payment Status:</span>
                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-white bg-opacity-50">
                  {payment.payment_status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Payment Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Payment ID Section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium text-blue-600">#{payment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Manuscript ID:</span>
                    <span className="font-medium">#{payment.manuscript_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created Date:</span>
                    <span className="font-medium">{formatDate(payment.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium">{formatDate(payment.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Amount Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Journal Amount:</span>
                    <span className="font-medium">{formatCurrency(payment.journal_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Features Total:</span>
                    <span className="font-medium text-green-600">{formatCurrency(payment.optional_feature_total)}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-800">Total Amount:</span>
                      <span className="text-green-600 text-lg">{formatCurrency(payment.total_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Manuscript Details */}
            {payment.manuscript && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Manuscript Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Title:</p>
                    <p className="font-medium mb-2">{stripHtml(payment.manuscript.title)}</p>
                    
                    <p className="text-sm text-gray-600">Unique ID:</p>
                    <p className="font-medium mb-2">{payment.manuscript.unique_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Author:</p>
                    <p className="font-medium mb-2">{payment.manuscript.username}</p>
                    
                    <p className="text-sm text-gray-600">Email:</p>
                    <p className="font-medium mb-2">{payment.manuscript.email}</p>
                    
                    <p className="text-sm text-gray-600">Contact:</p>
                    <p className="font-medium">{payment.manuscript.contact_number}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Journal Details */}
            {payment.journal && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Journal Details</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Journal ID:</p>
                    <p className="font-medium">{payment.journal.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Journal Title:</p>
                    <p className="font-medium">{payment.journal.j_title}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Optional Features */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Selected Features</h3>
              {payment.optional_features && payment.optional_features.length > 0 ? (
                <div className="space-y-2">
                  {payment.optional_features.map((feature) => (
                    <div key={feature.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-200">
                      <span className="font-medium text-gray-800">{feature.name}</span>
                      <span className="text-green-600 font-semibold">{formatCurrency(feature.amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No optional features selected</p>
              )}
            </div>

            {/* Feature IDs */}
            {payment.author_optional_features_id && payment.author_optional_features_id.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Feature IDs</h3>
                <div className="flex flex-wrap gap-2">
                  {payment.author_optional_features_id.map((id, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      Feature #{id}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Close
            </button>
            {/* {payment.payment_status === "pending" && (
              <button
                onClick={() => {
                  handleSendInvoice(payment.id, payment.manuscript_id);
                  onClose();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Send Invoice
              </button>
            )} */}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading payment data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Modal */}
      {isModalOpen && (
        <PaymentDetailsModal 
          payment={selectedPayment} 
          onClose={closeModal}
        />
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Author Payments Management
        </h1>
        <p className="text-gray-600 text-lg">
          Overview of all author payments and collections
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Collection */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Collection
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalCollection)}
              </div>
            </div>
          </div>
        </div>

        {/* Total Payments */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📄</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Payments
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {payments.length}
              </div>
            </div>
          </div>
        </div>

        {/* Paid Payments */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-emerald-500 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="text-3xl mr-4">✅</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Paid Payments
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.payment_status === "paid").length}
              </div>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-amber-500 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center">
            <div className="text-3xl mr-4">⏳</div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Pending Payments
              </h3>
              <div className="text-2xl font-bold text-gray-900">
                {payments.filter(p => p.payment_status === "pending").length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Filter by Status:
              </label>
              <select 
                value={filterStatus} 
                onChange={(e) => {
                  setFilterStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                Show:
              </label>
              <select 
                value={itemsPerPage} 
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
          
          <button 
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
            onClick={fetchPayments}
          >
            <span>🔄</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">Author Payments</h2>
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} payments
            </span>
          </div>
        </div>

        {currentPayments.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-500">
              No payments match the current filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Manuscript & Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Journal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Journal Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Features
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPayments.map((payment) => (
                    <tr 
                      key={payment.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* Payment ID */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-blue-600">
                            #{payment.id}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">
                            MS#{payment.manuscript_id}
                          </span>
                        </div>
                      </td>

                      {/* Manuscript & Author Info */}
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                            {stripHtml(payment.manuscript?.title)}
                          </div>
                          <div className="text-xs text-gray-600 mb-1">
                            {payment.manuscript?.unique_id}
                          </div>
                          <div className="text-xs text-gray-500">
                            <div>{payment.manuscript?.username}</div>
                            <div>{payment.manuscript?.email}</div>
                            <div>{payment.manuscript?.contact_number}</div>
                          </div>
                        </div>
                      </td>

                      {/* Journal Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {payment.journal?.j_title || "N/A"}
                        </span>
                      </td>

                      {/* Journal Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(payment.journal_amount)}
                        </span>
                      </td>

                      {/* Features List */}
                      <td className="px-6 py-4">
                        <div className="space-y-1 min-w-[150px]">
                          {payment.optional_features?.length > 0 ? (
                            <>
                              {payment.optional_features.map((feature) => (
                                <div 
                                  key={feature.id}
                                  className="flex justify-between items-center bg-blue-50 px-2 py-1 rounded border-l-2 border-blue-400"
                                >
                                  <span className="text-xs font-medium text-gray-700">
                                    {feature.name}
                                  </span>
                                  <span className="text-xs font-semibold text-green-600">
                                    +{formatCurrency(feature.amount)}
                                  </span>
                                </div>
                              ))}
                              <div className="text-xs text-gray-600 font-medium mt-1">
                                Features Total: {formatCurrency(payment.optional_feature_total)}
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500 italic">
                              No features
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <strong className="text-lg font-bold text-green-600">
                          {formatCurrency(payment.total_amount)}
                        </strong>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {formatDate(payment.created_at)}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClass(payment.payment_status)}`}>
                          {payment.payment_status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-2">
                          <button 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                            onClick={() => handleViewDetails(payment)}
                          >
                            View Details
                          </button>
{/*                           
                          {payment.payment_status === "pending" && (
                            <button 
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
                              onClick={() => handleSendInvoice(payment.id, payment.manuscript_id)}
                            >
                              Send Invoice
                            </button>
                          )} */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                        currentPage === 1
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors duration-200 ${
                        currentPage === totalPages
                          ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentForAuthor;