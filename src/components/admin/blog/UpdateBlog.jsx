import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';
import Loader from '../../common/Loader';

const UpdateBlog = () => {
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        blog_category_id: '',
        title: '',
        author: '',
        content: '',
        tags: ''
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false)
    const navigate = useNavigate()



    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/blog-categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.flag === 1) {
                setCategories(response.data.data);
            }
        } catch (err) {
            toast.error('Failed to fetch categories. Please try again later.');
            console.log(err);

        } finally {
            setLoading(false);
        }
    };

    const fetchBlogDetails = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/admin/blogs/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                setFormData(response.data.data);

            } else {
                toast.error("Failed to fetch blog details")
            }


        } catch (error) {
            toast.error(error.message)
            console.log(error);

        } finally {
            setLoading(false)
        }
    }

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
        fetchBlogDetails();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleEditorChange = (content) => {
        setFormData(prev => ({
            ...prev,
            content: content
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        try {
            const response = await axios.put(`/api/admin/blogs/${id}`, 
                formData,
                {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log(response);
            
            if (response.status === 200) {
                toast.success(response.data.message)
                navigate('/blog/view')
                
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdateLoading(false)
        }
    };
    if (loading) {
        return <Loader />
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Update Blog</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="blog_category_id" className="block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <select
                        id="blog_category_id"
                        name="blog_category_id"
                        value={formData.blog_category_id}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        disabled={loading}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                        Author
                    </label>
                    <input
                        type="text"
                        id="author"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                        Content
                    </label>
                    <Editor
                        apiKey="s2kx7b2f35ixr5a9ed48nxitfypd6aws8x7of79402kjvoeb" // Get from TinyMCE cloud
                        value={formData.content}
                        init={{
                            height: 400,
                            menubar: false, // Simpler interface without menubar
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
                        onEditorChange={handleEditorChange}
                    />
                </div>

                <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                        Tags (comma separated)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        disabled={loading}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={updateLoading}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {updateLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : 'Update Blog'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UpdateBlog
