import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../../components/common/Loader';
import { toast } from 'react-toastify';

const Contact = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { token } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [updateLoading, setUpdateLoading] = useState(false)


    const fetchContactDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}api/admin/contact`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.status === 200) {
                setFormData(response.data.data[0])
                console.log(response.data);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setUpdateLoading(true);
            const response = await axios.put(`${API_URL}api/admin/contact/${formData.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
            if (response.status === 200) {
                toast.success(response.data.message);
                fetchContactDetails();
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error);

        } finally {
            setUpdateLoading(false)
        }
    };

    useEffect(() => {
        fetchContactDetails();
    }, [token])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h1>

            <form onSubmit={handleSubmit}>
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
                            value={formData?.app_name}
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
                            className={`w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500`}
                            id="email"
                            name="email"
                            type="email"
                            value={formData?.email}
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
                            className={`w-full px-3 py-2 border 'border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500`}
                            id="support_email"
                            name="support_email"
                            type="email"
                            value={formData?.support_email}
                            onChange={handleChange}
                            required
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
                            value={formData.phone}
                            onChange={handleChange}
                            required
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
                            value={formData.landline}
                            onChange={handleChange}
                            required
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
                            value={formData.fax}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Website */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="web">
                            Website
                        </label>
                        <input
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500`}
                            id="web"
                            name="web"
                            type="text"
                            value={formData.web}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Social Media Section */}
                    <div className="md:col-span-2">
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
                                    value={formData.twitter}
                                    onChange={handleChange}
                                    required
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
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    required
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
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    required
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
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={updateLoading}
                        className={`px-6 py-2 bg-violet-600 text-white font-medium rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 transition-colors ${updateLoading ? 'opacity-75 cursor-not-allowed' : ''
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