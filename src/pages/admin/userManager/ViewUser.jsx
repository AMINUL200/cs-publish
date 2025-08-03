import { faEdit, faTrash, faSearch, faPlus, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { getUserTypeLabel } from '../../../utils/Common';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

const ViewUser = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
    const { token } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    const navigate = useNavigate();



    // Filter users based on search term (name or email)
    const filteredUsers = userData.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        const userTypeLabel = getUserTypeLabel(user?.user_type).toLowerCase();
        return (
            user.name && user.name.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower) ||
             userTypeLabel.includes(searchLower)
            );
    });
    // Get current records
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredUsers.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredUsers.length / recordsPerPage);

    // Handle records per page change
    const handleRecordsPerPageChange = (e) => {
        setRecordsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when changing records per page
    };

    // Pagination functions
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`${API_URL}api/admin/all-user`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

            if (response.status === 200) {
                // setUserData(response.data.data);
                console.log(response.data);
                setUserData(response.data.user)

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!id) return;
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`/api/admin/users/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                fetchUserData();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleNavigate = (id) => {
        if (!id) return;
        navigate(`/user/edit/${id}`);
    };

    useEffect(() => {
        fetchUserData();
    }, [token]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold text-gray-800">VIEW USERS</h1>
                <Link
                    to='/user/add'
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add User
                </Link>
            </div>

            <div className='flex flex-col md:flex-row justify-center items-center md:justify-between  mb-6 gap-4'>
                <div className="flex items-center gap-2 relative">
                    <span className="text-sm text-gray-700 font-medium">Records per page:</span>

                    <div className="relative w-28">
                        <select
                            value={recordsPerPage}
                            onChange={handleRecordsPerPageChange}
                            className="appearance-none w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                        >
                            {[5, 10, 20, 50].map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>

                        {/* Custom down arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                            <FontAwesomeIcon icon={faChevronDown} />
                        </div>
                    </div>
                </div>


                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search by name, email or role (e.g. Editor)..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar pb-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                SI.NO
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Gender
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Contact No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Address
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Country
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Date
                            </th>

                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Resume
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentRecords.length > 0 ? (
                            currentRecords.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                                        {user.id || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                                        {user?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user?.registration?.gender || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user?.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user?.registration?.phone || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user?.registration?.address || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user?.registration?.country || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user?.created_at ? user.created_at.split('T')[0] : '-'}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {getUserTypeLabel(user?.user_type)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2 text-center">
                                        {user?.registration?.resume ? (
                                            <a
                                                href={`${STORAGE_URL}${user.registration.resume}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 flex justify-center"
                                                title="View Resume"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                            </a>
                                        ) : 'N/A'}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        <button
                                            onClick={() => handleNavigate(user.id)}
                                            disabled={deleteLoading}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-300 cursor-pointer">
                                            <FontAwesomeIcon icon={faEdit} className='mr-1' />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            disabled={deleteLoading}
                                            className={`text-white px-3 py-1 rounded transition-colors duration-300 ${deleteLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 cursor-pointer'}`}>
                                            <FontAwesomeIcon icon={faTrash} className='mr-1' />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No users found matching your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col md:flex-row justify-center items-center md:justify-between  mb-4 mt-4 gap-4">
                <div>
                    Showing {currentRecords.length > 0 ? indexOfFirstRecord + 1 : 0} to{' '}
                    {Math.min(indexOfLastRecord, filteredUsers.length)} of {filteredUsers.length} rows
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    >
                        Next
                    </button>
                </div>
            </div>


        </div>
    );
};

export default ViewUser;