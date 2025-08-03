import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes, faEye, faSearch, faEdit, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import Loader from '../../../components/common/Loader';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditorCheckList = () => {
    const { token } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
    });
    const [editingItem, setEditingItem] = useState({
        name: '',
    });
    const [checklistItems, setChecklistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addListLoading, setAddListLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [updateLoading, setUpdateLoading] = useState(false)
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchChecklistItems = async () => {
        try {
            const response = await axios.get(`${API_URL}api/admin/manuscript`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.flag === 1) {
                setChecklistItems(response.data.data);
                console.log(response.data);

            } else {
                toast.error('Failed to fetch checklist items');
            }
        } catch (err) {
            toast.error(err.message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchChecklistItems();
    }, [])

    const filteredItems = checklistItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddItem = async () => {
        if (newItem.name.trim() === '') return;

        try {
            setAddListLoading(true)
            const response = await axios.post(
                `${API_URL}api/admin/manuscript`,
                newItem,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            fetchChecklistItems();
        } catch (error) {
            toast.error(error.message)
        } finally {
            setNewItem({
                name: '',
            });
            setAddListLoading(false)
            setShowModal(false);
        }

    };

    const handleDelete = async (id) => {
        try {
            setDeleteLoading(true)
            const response = await axios.delete(
                `${API_URL}api/admin/manuscript/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.flag === 1) {
                toast.success(response.data.message)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error.message);
            toast.error(error.message)

        } finally {
            setDeleteLoading(false)
            fetchChecklistItems()
        }
    }

    const handleEditItem = async (id) => {
        const response = await axios.get(
            `${API_URL}api/admin/manuscript/${id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        setEditingItem(response.data.data);
        setShowEditModal(true);
    };

    const handleUpdateItem = async (id) => {
        if (editingItem.name.trim() === '') return;


        try {
            setUpdateLoading(true)
            const response = await axios.put(
                `${API_URL}api/admin/manuscript/${id}`,
                editingItem,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log("response datat ", response);

            if (response.data.flag === 1) {
                toast.success("list update successfully");
                fetchChecklistItems();
            } else {
                toast.error("list not update")
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error);

        } finally {
            setUpdateLoading(false)
            setShowEditModal(false);
            setEditingItem({
                name: '',
            });
        }
    };

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">MANUSCRIPT CHECKLIST</h1>

            <div className="flex justify-between mb-6">
                <div className="relative w-64">
                    <input
                        type="search"
                        placeholder='Search...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='
                                                pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                                                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                                outline-none transition-all duration-200
                                                w-full shadow-sm
                                            '
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="h-4 w-4 text-gray-400" />
                    </div>
                </div>

                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                    onClick={() => setShowModal(true)}
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add New Item
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full w-[700px] bg-white border border-gray-200">
                    <thead className="bg-gray-50 border-2">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">Id</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">Checklist Items</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border-2">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">{item.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 border-2">{item.name}</td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mr-2 cursor-pointer"
                                            onClick={() => handleEditItem(item.id)}
                                            disabled={deleteLoading}
                                        >
                                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(item.id)
                                            }}
                                            disabled={deleteLoading}
                                            className={` text-white p-2 rounded  ${deleteLoading ? 'bg-gray-500 hover:bg-gray-700 cursor-not-allowed' : 'cursor-pointer bg-red-500 hover:bg-red-600'}`}
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No items found matching your search criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                Showing {filteredItems.length} of {checklistItems.length} items
            </div>

            {/* Modal for adding new item */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Add New Checklist Item</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faXmark} size="lg" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Checklist Item
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="Enter checklist item description"
                            />
                        </div>



                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowModal(false)}
                                disabled={ addListLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                                onClick={handleAddItem}
                                disabled={!newItem.name.trim() || addListLoading}
                            >
                                {addListLoading ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                {addListLoading ? 'Adding...' : 'Add Item'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for editing item */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Checklist Item</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faXmark} size="lg" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Checklist Item
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                value={editingItem.name}
                                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                placeholder="Enter checklist item description"
                            />
                        </div>



                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                onClick={() => setShowEditModal(false)}
                                disabled={ updateLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 ${updateLoading ? 'cursor-not-allowed' : 'cursor-pointer'} `}
                                onClick={() => {
                                    handleUpdateItem(editingItem.id)
                                }}
                                disabled={!editingItem.name.trim() || updateLoading}
                            >
                                Update Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EditorCheckList