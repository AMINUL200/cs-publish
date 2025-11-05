import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import RecordsPerPageSelector from "../../components/common/RecordsPerPageSelector";
import SearchInput from "../../components/common/SearchInput";
import PaginationControls from "../../components/common/PaginationControls";
import { Link } from "react-router-dom";

const PublisherDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/publisher/list-manuscript`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched data:", response.data);

      if (response.data.flag === 1) {
        setData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error.message || "An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to strip HTML tags
  const stripHtml = (html) => {
    if (!html) return "";
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get payment status badge
  const getPaymentStatusBadge = (payment) => {
    if (!payment) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          No Payment
        </span>
      );
    }

    const status = payment.payment_status?.toLowerCase();
    
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {payment.payment_status || 'Unknown'}
          </span>
        );
    }
  };

  // Filter data based on search term
  const filteredData = data ? data.filter(item => 
    stripHtml(item.manuscript_data.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manuscript_data.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.editor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.manuscript_id.toString().includes(searchTerm) ||
    (item.payment && item.payment.payment_status?.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  // Pagination calculations
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle records per page change
  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page when changing records per page
  };

  // Handle search term change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading manuscripts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Publisher Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage manuscripts assigned by editors for publication
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SearchInput
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search manuscripts by title, author, editor, ID, or payment status..."
          />
          
          <RecordsPerPageSelector
            value={recordsPerPage}
            onChange={handleRecordsPerPageChange}
            options={[5, 10, 25, 50]}
          />
        </div>

        {/* Manuscripts Table */}
        {data && data.length > 0 ? (
          <>
            <div className="bg-white shadow-sm overflow-hidden mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                       ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                      Assigned By
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                      Date Assigned
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                      Payment Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border border-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-400">
                        <span className="text-sm text-gray-900 font-mono text-right">
                          #{item.manuscript_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 border border-gray-400">
                        <div className="max-w-xs">
                          <div className="text-sm font-medium text-gray-900 truncate" title={stripHtml(item.manuscript_data.title)}>
                            {stripHtml(item.manuscript_data.title)}
                          </div>
                          <div className="text-xs text-gray-500 truncate mt-1" title={stripHtml(item.manuscript_data.abstract)}>
                            {stripHtml(item.manuscript_data.abstract).substring(0, 60)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-400">
                        <div className="text-sm text-gray-900">{item.manuscript_data.username}</div>
                        <div className="text-xs text-gray-500">ID: {item.manuscript_data.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-400">
                        <div className="text-sm text-gray-900">{item.editor.name}</div>
                        <div className="text-xs text-gray-500">ID: {item.editor.user_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border border-gray-400">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border border-gray-400">
                        {getPaymentStatusBadge(item.payment)}
                        {item.payment && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.payment.optional_features?.length || 0} feature(s)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border border-gray-400">
                        <div className="flex space-x-2 justify-center">
                          <Link 
                            to={`/publisher/view-manuscript/${item.manuscript_id}`} 
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                          >
                            View
                          </Link>
                          <Link 
                            to={`/publisher/manuscripts/design/${item.manuscript_id}`}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-xs font-medium transition-colors duration-200"
                          >
                            Design Web View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords} entries
              </div>
              
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm ? 'No manuscripts found matching your search' : 'No manuscripts assigned yet'}
            </div>
            <p className="text-gray-400 mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'Manuscripts assigned by editors will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublisherDashboard;