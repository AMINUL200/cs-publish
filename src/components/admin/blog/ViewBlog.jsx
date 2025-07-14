import { faEdit, faTrash, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../common/Loader';

const ViewBlog = () => {
    const { token } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [blogData, setBlogData] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false)
    const navigate = useNavigate();

    // Filter blogs based on search term (title or author)
    const filteredBlogs = blogData.filter(blog => {
        const searchLower = searchTerm.toLowerCase();
        return (
            blog.title.toLowerCase().includes(searchLower) ||
            blog.author.toLowerCase().includes(searchLower)
        );
    });


    const fetchBlogData = async () => {
        try {
            const response = await axios.get('/api/admin/blogs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {

                setBlogData(response.data.data)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        if (!id) return;
        setDeleteLoading(true);
        try {
            const response = await axios.delete(`/api/admin/blogs/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

            if (response.status === 200) {
                toast.success(response.data.message)
                fetchBlogData();
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error);

        } finally {
            setDeleteLoading(false)
        }

    }


    const handleNavigate =(id)=>{
        if(!id) return;

        navigate(`/blog/view/${id}`)
    }



    useEffect(() => {
        fetchBlogData();
    }, [token]);

    if (loading) {
        return <Loader />
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold text-gray-800">VIEW BLOGS</h1>
                <Link
                    to='/blog/add'
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors duration-300">
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add Blog
                </Link>
            </div>

            <div className='flex justify-end mb-6'>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                    </div>
                    <input
                        type="search"
                        placeholder="Search by title or author..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all duration-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>

                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Title
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Author
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Comments
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBlogs.length > 0 ? (
                            filteredBlogs.map((blog) => (
                                <tr key={blog.id}>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">
                                        {blog.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        {blog.author}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800 cursor-pointer border-2">
                                        {blog.content}
                                    </td>
                                    <td className="text-center px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                                        <button
                                            onClick={() => {
                                                handleNavigate(blog.id)
                                            }}  
                                            disabled={deleteLoading}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2 transition-colors duration-300 cursor-pointer">
                                            <FontAwesomeIcon icon={faEdit} className='mr-1' />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(blog.id);
                                            }}
                                            disabled={deleteLoading}
                                            className={` text-white px-3 py-1 rounded transition-colors duration-300  ${deleteLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 cursor-pointer'}`}>
                                            <FontAwesomeIcon icon={faTrash} className='mr-1' />
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No blogs found matching your search criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                <div>
                    Showing {filteredBlogs.length > 0 ? 1 : 0} to {filteredBlogs.length} of {blogData.length} rows
                </div>

            </div>
        </div>
    )
}

export default ViewBlog;