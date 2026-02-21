import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../../components/common/Loader';
import { toast } from 'react-toastify';

const Contact = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [formData, setFormData] = useState({
        app_name: '',
        email: '',
        support_email: '',
        phone: '',
        landline: '',
        fax: '',
        web: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        whatsapp: '',
        address_line1: '',
        address_line2: '',
        image: null,
        status: true,
    });
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const fetchContactDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}api/admin/contact`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                const contactData = response.data.data[0];
                console.log(contactData);
                
                setFormData({
                    app_name: contactData.app_name || '',
                    email: contactData.email || '',
                    support_email: contactData.support_email || '',
                    phone: contactData.phone || '',
                    landline: contactData.landline || '',
                    fax: contactData.fax || '',
                    web: contactData.web || '',
                    twitter: contactData.twitter || '',
                    instagram: contactData.instagram || '',
                    linkedin: contactData.linkedin || '',
                    whatsapp: contactData.whatsapp || '',
                    address_line1: contactData.address_line1 || '',
                    address_line2: contactData.address_line2 || '',
                    image: contactData.image ? `${STORAGE_URL}${contactData.image}` : null,
                    status: contactData.status === true || contactData.status === 'true',
                    id: contactData.id,
                });

                // Set image preview if image exists
                if (contactData.image) {
                    setImagePreview(`${STORAGE_URL}${contactData.image}`);
                }
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (file.size > maxSize) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);

            // Store the file for submission
            setImageFile(file);
        }
    };

    const removeImage = () => {
        setImagePreview('');
        setImageFile(null);
        // Also clear the file input
        const fileInput = document.getElementById('image');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdateLoading(true);
            
            // Create FormData to handle file upload
            const submitData = new FormData();
            
            // Append all form fields except status
            Object.keys(formData).forEach(key => {
                if (key !== 'image' && key !== 'status' && formData[key] !== null) {
                    submitData.append(key, formData[key]);
                }
            });

            // Append status as integer (1 for true, 0 for false) - many APIs expect this
            submitData.append('status', formData.status ? '1' : '0');

            // Alternative: If your API accepts string booleans, use this instead:
            // submitData.append('status', formData.status.toString());

            // Append the image file if selected
            if (imageFile) {
                submitData.append('image', imageFile);
            }

            // Debug: Log what we're sending
            console.log('Submitting data:', {
                ...formData,
                status: formData.status,
                image: imageFile ? 'File selected' : 'No file'
            });

            const response = await axios.post(
                `${API_URL}api/admin/contact/${formData.id}`,
                submitData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchContactDetails(); // Refresh data to get updated image URL
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log('Error details:', error.response?.data);
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setUpdateLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchContactDetails();
        }
    }, [token]);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Setting Information</h1>

            <form onSubmit={handleSubmit}>
                {/* Image Upload Section */}
                <div className="mb-8">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Website Logo
                    </label>
                    <div className="flex items-start space-x-6">
                        {/* Image Preview */}
                        <div className="flex flex-col items-center">
                            {imagePreview ? (
                                <div className="relative "> 
                                    <img 
                                        src={imagePreview} 
                                        alt="Contact preview" 
                                        className="w-70 h-42 object-contain rounded-lg  border-2 border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                                    No Image
                                </div>
                            )}
                        </div>

                        {/* Upload Controls */}
                        <div className="flex-1">
                            <div className="mb-4">
                                <input
                                    type="file"
                                    id="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image"
                                    className="inline-flex items-center px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors cursor-pointer"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Choose Image
                                </label>
                            </div>
                            <p className="text-sm text-gray-500">
                                Supported formats: JPEG, PNG, GIF, WebP
                                <br />
                                Max file size: 5MB
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* App Name */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="app_name">
                            Application Name
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="app_name"
                            name="app_name"
                            type="text"
                            value={formData.app_name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Support Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="support_email">
                            Support Email
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="support_email"
                            name="support_email"
                            type="email"
                            value={formData.support_email || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                            Phone
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Landline */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="landline">
                            Landline
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="landline"
                            name="landline"
                            type="tel"
                            value={formData.landline || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Fax */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fax">
                            Fax
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="fax"
                            name="fax"
                            type="text"
                            value={formData.fax || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Website */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="web">
                            Website
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="web"
                            name="web"
                            type="text"
                            value={formData.web || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Status Field */}
                    <div className="mb-4 flex items-center">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="status"
                                checked={formData.status}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <span className="text-gray-700 text-sm font-bold">Active Status</span>
                        </label>
                    </div>

                    {/* Address Line 1 */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address_line1">
                            Address Line 1
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="address_line1"
                            name="address_line1"
                            type="text"
                            value={formData.address_line1 || ''}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Address Line 2 */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address_line2">
                            Address Line 2
                        </label>
                        <input
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            id="address_line2"
                            name="address_line2"
                            type="text"
                            value={formData.address_line2 || ''}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Twitter */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="twitter">
                                Twitter
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                id="twitter"
                                name="twitter"
                                type="text"
                                value={formData.twitter || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Instagram */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instagram">
                                Instagram
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                id="instagram"
                                name="instagram"
                                type="text"
                                value={formData.instagram || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* LinkedIn */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="linkedin">
                                LinkedIn
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                id="linkedin"
                                name="linkedin"
                                type="text"
                                value={formData.linkedin || ''}
                                onChange={handleChange}
                            />
                        </div>

                        {/* WhatsApp */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatsapp">
                                WhatsApp
                            </label>
                            <input
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                                id="whatsapp"
                                name="whatsapp"
                                type="text"
                                value={formData.whatsapp || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={updateLoading}
                        className={`px-6 py-2 bg-violet-600 text-white font-medium rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors ${
                            updateLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                    >
                        {updateLoading ? (
                            <div className="flex items-center justify-center space-x-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Saving...</span>
                            </div>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Contact;