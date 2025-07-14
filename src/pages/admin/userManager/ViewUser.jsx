import { faEdit, faTrash, faSearch, faPlus, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';

const ViewUser = () => {
      const API_URL = import.meta.env.VITE_API_URL;
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
        return (
            user.name && user.name.toLowerCase().includes(searchLower)) ||
            (user.email && user.email.toLowerCase().includes(searchLower)
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
            // const response = await axios.get('/api/admin/users', {
            //     headers: {
            //         'Authorization': `Bearer ${token}`
            //     }
            // });

            // if (response.status === 200) {
            //     setUserData(response.data.data);
            // } else {
            //     toast.error(response.data.message);
            // }
            const dummyData = [
    {
        id: 1,
        name: "Alice Johnson",
        gender: "Female",
        email: "alice@example.com",
        contact: "1234567890",
        role: "Admin",
        resume: true,
        address: "123 Main St, New York",
        country: "USA",
        date: "2025-07-10",
    },
    {
        id: 2,
        name: "Bob Smith",
        gender: "Male",
        email: "bob@example.com",
        contact: "9876543210",
        role: "User",
        resume: false,
        address: "456 Elm St, London",
        country: "UK",
        date: "2025-07-08",
    },
    {
        id: 3,
        name: "Charlie Brown",
        gender: "Male",
        email: "charlie@example.com",
        contact: "9988776655",
        role: "Editor",
        resume: true,
        address: "789 Pine Ave, Toronto",
        country: "Canada",
        date: "2025-07-05",
    },
    {
        id: 4,
        name: "Diana Prince",
        gender: "Female",
        email: "diana@example.com",
        contact: "8899776655",
        role: "Moderator",
        resume: false,
        address: "1010 Paradise Island",
        country: "Themyscira",
        date: "2025-07-01",
    },
    {
        id: 5,
        name: "Ethan Hunt",
        gender: "Male",
        email: "ethan@example.com",
        contact: "7788990011",
        role: "Agent",
        resume: true,
        address: "Mission Impossible HQ",
        country: "Global",
        date: "2025-06-28",
    },
    {
        id: 6,
        name: "Fiona Green",
        gender: "Female",
        email: "fiona@example.com",
        contact: "6677889900",
        role: "Designer",
        resume: true,
        address: "22 Art Street, Paris",
        country: "France",
        date: "2025-06-25",
    },
    {
        id: 7,
        name: "George Wilson",
        gender: "Male",
        email: "george@example.com",
        contact: "5566778899",
        role: "Developer",
        resume: true,
        address: "101 Tech Park, Bangalore",
        country: "India",
        date: "2025-06-20",
    },
    {
        id: 8,
        name: "Hannah Baker",
        gender: "Female",
        email: "hannah@example.com",
        contact: "4455667788",
        role: "Counselor",
        resume: false,
        address: "33 Hope Lane, California",
        country: "USA",
        date: "2025-06-15",
    },
    {
        id: 9,
        name: "Ian Cooper",
        gender: "Male",
        email: "ian@example.com",
        contact: "3344556677",
        role: "Manager",
        resume: true,
        address: "404 Corporate Blvd, Chicago",
        country: "USA",
        date: "2025-06-10",
    },
    {
        id: 10,
        name: "Julia Roberts",
        gender: "Female",
        email: "julia@example.com",
        contact: "2233445566",
        role: "Actor",
        resume: false,
        address: "55 Hollywood Blvd, LA",
        country: "USA",
        date: "2025-06-05",
    },
    {
        id: 11,
        name: "Kevin Hart",
        gender: "Male",
        email: "kevin@example.com",
        contact: "1122334455",
        role: "Comedian",
        resume: true,
        address: "66 Laugh Street, Vegas",
        country: "USA",
        date: "2025-05-30",
    },
    {
        id: 12,
        name: "Lily Collins",
        gender: "Female",
        email: "lily@example.com",
        contact: "9988776655",
        role: "Journalist",
        resume: true,
        address: "77 Press Avenue, London",
        country: "UK",
        date: "2025-05-25",
    },
    {
        id: 13,
        name: "Mike Tyson",
        gender: "Male",
        email: "mike@example.com",
        contact: "8877665544",
        role: "Boxer",
        resume: false,
        address: "88 Knockout Street, Nevada",
        country: "USA",
        date: "2025-05-20",
    },
    {
        id: 14,
        name: "Nina Dobrev",
        gender: "Female",
        email: "nina@example.com",
        contact: "7766554433",
        role: "Actress",
        resume: true,
        address: "99 Drama Road, Vancouver",
        country: "Canada",
        date: "2025-05-15",
    },
    {
        id: 15,
        name: "Oliver Queen",
        gender: "Male",
        email: "oliver@example.com",
        contact: "6655443322",
        role: "Vigilante",
        resume: false,
        address: "Arrow Cave, Star City",
        country: "USA",
        date: "2025-05-10",
    },
    {
        id: 16,
        name: "Pam Beesly",
        gender: "Female",
        email: "pam@example.com",
        contact: "5544332211",
        role: "Receptionist",
        resume: true,
        address: "Dunder Mifflin, Scranton",
        country: "USA",
        date: "2025-05-05",
    },
    {
        id: 17,
        name: "Quentin Tarantino",
        gender: "Male",
        email: "quentin@example.com",
        contact: "4433221100",
        role: "Director",
        resume: false,
        address: "Cinema Paradiso, Hollywood",
        country: "USA",
        date: "2025-04-30",
    },
    {
        id: 18,
        name: "Rachel Green",
        gender: "Female",
        email: "rachel@example.com",
        contact: "3322110099",
        role: "Fashion Buyer",
        resume: true,
        address: "Central Perk, New York",
        country: "USA",
        date: "2025-04-25",
    },
    {
        id: 19,
        name: "Steve Rogers",
        gender: "Male",
        email: "steve@example.com",
        contact: "2211009988",
        role: "Super Soldier",
        resume: false,
        address: "Avengers Tower, New York",
        country: "USA",
        date: "2025-04-20",
    },
    {
        id: 20,
        name: "Tina Fey",
        gender: "Female",
        email: "tina@example.com",
        contact: "1100998877",
        role: "Writer",
        resume: true,
        address: "30 Rock, NBC Studios",
        country: "USA",
        date: "2025-04-15",
    }
];


            // Simulate delay
            await new Promise((res) => setTimeout(res, 1000));

            setUserData(dummyData);
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
                <div className="flex items-center">
                    <span className="mr-2 text-sm text-gray-600">Records per page:</span>
                    <select
                        value={recordsPerPage}
                        onChange={handleRecordsPerPageChange}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>


                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search by name or email..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
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
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
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
                                        {user.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user.gender || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user.contact || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user.address || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user.country || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user.date || '-'}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {user.resume && (
                                            <button className="text-blue-600 hover:text-blue-800 flex mx-auto cursor-pointer">
                                                <FontAwesomeIcon icon={faDownload} />
                                            </button>
                                        )}
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