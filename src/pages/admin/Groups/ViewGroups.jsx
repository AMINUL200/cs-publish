import { faEdit, faTrash, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';

const ViewGroups = () => {
    const { token } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [groupData, setGroupData] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    // Filter groups by name
    const filteredGroups = groupData.filter((group) => {
        const searchLower = searchTerm.toLowerCase();
        return group.group_name.toLowerCase().includes(searchLower);
    });

    // Fetch groups data
    const fetchGroups = async () => {
        try {
              const response = await axios.get(`${API_URL}api/admin/groups`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              
              
              if (response.status === 200) {
                setGroupData(response.data.data); 
              } else {
                toast.error(response.data.message);
              }

           

        } catch (error) {
            toast.error(error.message);
            console.log(error);
            
        } finally {
            setLoading(false);
        }
    };

    // Delete group
    const handleDelete = async (id) => {
        if (!id) return;
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`${API_URL}api/admin/groups/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchGroups();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Navigate to edit page
    const handleNavigate = (id) => {
        if (!id) return;
        navigate(`/groups/edit/${id}`);
    };

    useEffect(() => {
        fetchGroups();
    }, [token]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-800">VIEW GROUPS</h1>
                <Link
                    to="/groups/add-groups"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Group
                </Link>
            </div>

            {/* Search */}
            <div className="flex justify-end mb-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search by group name..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Si.No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Group Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Enable
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredGroups.length > 0 ? (
                            filteredGroups.map((group) => (
                                <tr key={group.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                                        {group.id }
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                                        {group.group_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {group.status === '1' ? 'Yes' : 'No'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {group.created_at.split('T')[0]}
                                    </td>
                                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        <button
                                            onClick={() => handleNavigate(group.id)}
                                            disabled={deleteLoading}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-300"
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(group.id)}
                                            disabled={deleteLoading}
                                            className={`text-white px-3 py-1 rounded transition-colors duration-300 ${deleteLoading
                                                    ? 'bg-gray-500 cursor-not-allowed'
                                                    : 'bg-red-500 hover:bg-red-600 cursor-pointer'
                                                }`}
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="5"
                                    className="px-6 py-4 text-center text-sm text-gray-500"
                                >
                                    No groups found matching your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div>
                    Showing {filteredGroups.length > 0 ? 1 : 0} to {filteredGroups.length} of {groupData.length} rows
                </div>
            </div>
        </div>
    );
};

export default ViewGroups;
