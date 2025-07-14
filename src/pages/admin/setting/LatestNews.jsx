import { faCheck, faEdit, faPlus, faSearch, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { use, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { Link, useNavigate } from 'react-router-dom';

const LatestNews = () => {
      const API_URL = import.meta.env.VITE_API_URL;
    const { token } = useSelector((state) => state.auth);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [newsData, setNewsData] = useState([])
    const [deleteLoading, setDeleteLoading] = useState(false)

    const filteredItems = newsData.filter(item =>
        item.news.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const navigate = useNavigate();


    const fetchNewsData = async () => {
        try {
            const response = await axios.get(`${API_URL}api/admin/news`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                setNewsData(response.data.data)
            } else {
                toast.error(response.data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message)

        } finally {
            setLoading(false)
        }
    }




    const handleDelete = async (id) => {
        try {
            setDeleteLoading(true);
            const response = await axios.delete(`${API_URL}api/admin/news/${id}`, 
                {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            if(response.status === 200){
                toast.success(response.data.message);
                fetchNewsData();
            }else{
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error);

        } finally {
            setDeleteLoading(false)
        }
    }
    const handleEditItem = (id) => {
        if(!id) return ;
        navigate(`/setting/news/${id}`)
    }

    useEffect(() => {
        fetchNewsData();
    }, [token]);

    if (loading) {
        return <Loader />
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">News</h1>

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

                <Link
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                    to='/setting/add-news'
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add News
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full w-[700px] bg-white border border-gray-200">
                    <thead className="bg-gray-50 border-2">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">Id</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">Notification</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border-2">
                        {filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-2">{item.id}</td>
                                    <td
                                        className="px-6 py-4 text-sm text-gray-500 border-2"
                                        dangerouslySetInnerHTML={{ __html: item.news }}
                                    />
                                    <td className="px-6 py-4 whitespace-nowrap border-2">
                                        {item.status ? (
                                            <span className="px-2 inline-flex justify-center items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                                Enabled
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex justify-center items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                                Disabled
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium border-2">
                                        <button
                                            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded mr-2"
                                            onClick={() => handleEditItem(item.id)}
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
                                    No news found matching your search criteria
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                Showing {filteredItems.length} of {newsData.length} items
            </div>

        </div>
    )
}

export default LatestNews
