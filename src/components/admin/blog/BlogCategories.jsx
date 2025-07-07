import { faEdit, faPlus, faSearch, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const BlogCategories = () => {
    const { token } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({ id: '', category_name: '' });
    const [updateLoading, setUpdateLoading] = useState(false);

    // Filter Category based on search term
    const filteredCategory = categories.filter(cta => {
        const searchLower = searchTerm.toLowerCase();
        return (
            cta.category_name.toLowerCase().includes(searchLower) ||
            cta.created_at.toLowerCase().includes(searchLower)
        );
    });

    const fetchCategories = async () => {
        try {
            const response = await axios.get('/api/admin/blog-categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.flag === 1) {
                setCategories(response.data.data);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setDeleteLoading(true);
        try {
            const response = await axios.delete(
                `/api/admin/blog-categories/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

            if (response.status === 200) {
                toast.success(response.data.message);
                fetchCategories();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEdit = (category) => {
        setCurrentCategory({
            id: category.id,
            category_name: category.category_name
        });
        setEditModalOpen(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const response = await axios.put(
                `/api/admin/blog-categories/${currentCategory.id}`,
                { category_name: currentCategory.category_name },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message);
                fetchCategories();
                setEditModalOpen(false);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdateLoading(false);
            setEditModalOpen(false)
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">


            {/* Main Content */}
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold text-gray-800">Blog Category</h1>
                <Link
                    to='/blog/addCategoryBlogpage'
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Blog Categories
                </Link>
            </div>

            <div className='flex justify-end mb-6'>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search by Categories or Date..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full w-[700px] divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                                ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                                Category Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                                Created
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider border-2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCategory.length > 0 ? (
                            filteredCategory.map((cta) => (
                                <tr key={cta.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                                        {cta.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {cta.category_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {cta.created_at.split('T')[0]}
                                    </td>
                                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        <button
                                        disabled={deleteLoading }
                                            onClick={() => handleEdit(cta)}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-300">
                                            <FontAwesomeIcon icon={faEdit} className='mr-1' />
                                            Edit
                                        </button>
                                        <button
                                            disabled={deleteLoading || updateLoading}
                                            onClick={() => handleDelete(cta.id)}
                                            className={`text-white px-3 py-1 rounded transition-colors duration-300 ${deleteLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 cursor-pointer'
                                                }`}>
                                            <FontAwesomeIcon icon={faTrash} className='mr-1' />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No categories found matching your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div>
                    Showing {filteredCategory.length > 0 ? 1 : 0} to {filteredCategory.length} of {categories.length} rows
                </div>
            </div>



            {/* Edit Category Modal */}
            {editModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Update Blog Category</h2>
                            <button
                                onClick={() => setEditModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label htmlFor="edit-category-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    id="edit-category-name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={currentCategory.category_name}
                                    onChange={(e) => setCurrentCategory({
                                        ...currentCategory,
                                        category_name: e.target.value
                                    })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={updateLoading}
                                className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${updateLoading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {updateLoading ? 'Updating...' : 'Update Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogCategories;