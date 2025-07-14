import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/common/Loader';

const UpdateNews = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        news: '',
        status: true,
    });
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const navigate = useNavigate();

    const handleEditorChange = (content) => {
        setFormData({ ...formData, news: content });
    };

    const handleStatusChange = (e) => {
        setFormData({ ...formData, status: e.target.value === 'true' });
    };

    const fetchNewsData = async () => {
        try {
            const response = await axios.get(`${API_URL}api/admin/news/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

            if (response.status === 200) {
                setFormData(response.data.data);
            } else {
                toast.error(response.data.message);
                navigate('/setting/news');
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
            navigate('/setting/news');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdateLoading(true);
            const response = await axios.put(`${API_URL}api/admin/news/${id}`,
                {
                    news: formData.news,  // Using raw content instead of htmlContent
                    status: formData.status
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
            if (response.status === 200) {
                toast.success(response.data.message);
                navigate('/setting/news');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            console.log(error);
        } finally {
            setUpdateLoading(false);
        }
    };

    useEffect(() => {
        fetchNewsData();
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Update News</h1>

            <form onSubmit={handleSubmit}>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="news">
                        News Content
                    </label>

                    <Editor
                        apiKey="s2kx7b2f35ixr5a9ed48nxitfypd6aws8x7of79402kjvoeb" // Same key as before
                        value={formData.news}
                        onEditorChange={handleEditorChange}
                        init={{
                            height: 400,
                            menubar: false,
                            plugins: [
                                'advlist', 'lists', 'link', 'charmap', 'preview',
                                'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                'help', 'wordcount'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic underline | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'removeformat | help | code',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Status
                    </label>
                    <div className="flex items-center space-x-4">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-blue-600"
                                name="status"
                                value="true"
                                checked={formData.status === true}
                                onChange={handleStatusChange}
                            />
                            <span className="ml-2">Active</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio text-blue-600"
                                name="status"
                                value="false"
                                checked={formData.status === false}
                                onChange={handleStatusChange}
                            />
                            <span className="ml-2">Inactive</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/setting/news')}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={updateLoading}
                        className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center justify-center ${updateLoading ? 'cursor-not-allowed opacity-75' : ''
                            }`}
                    >
                        {updateLoading ? (
                            <>
                                <span>Updating</span>
                                <svg
                                    className="animate-spin -mr-1 ml-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            </>
                        ) : (
                            'Update'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateNews;