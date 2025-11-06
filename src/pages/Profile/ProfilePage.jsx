import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { da } from 'date-fns/locale/da';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import { faAward } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faGoogle, faOrcid } from '@fortawesome/free-brands-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Initial empty state
const initialFormData = {
    title: '',
    first_name: '',
    last_name: '',
    gender: '',
    phone: '',
    landline: '',
    address: '',
    country: '',
    city: '',
    zip: '',
    qualification: '',
    university: '',
    affiliation: '',
    designation: '',
    awards: '',
    society_memberships: '',
    speciality: '',
    image: null,
    resume: null,
    google_scroler: '',
    orcid_link: '',
    about: ''
};

const ProfilePage = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
    const { token, userData } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [tempResume, setTempResume] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [isFetching, setIsFetching] = useState(true);

    console.log(userData);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            if (name === 'image') {
                const file = files[0];
                // Validate file size (2MB max)
                if (file.size > 2 * 1024 * 1024) {
                    toast.error('Profile image must be less than 2MB');
                    e.target.value = ''; // Clear the file input
                    return;
                }
                setTempImage(file);
            } else if (name === 'resume') {
                setTempResume(files[0]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create FormData for file upload
            const submitData = new FormData();

            // Append all regular fields
            Object.keys(formData).forEach(key => {
                if (key !== 'image' && key !== 'resume') {
                    submitData.append(key, formData[key]);
                }
            });

            // Append files if they exist
            if (tempImage) submitData.append('image', tempImage);
            if (tempResume) submitData.append('resume', tempResume);

            const response = await axios.post(
                `${API_URL}api/profile/update`,
                submitData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success(response.data.message);
            // Refresh profile data after update
            await getProfileData();
            setIsEditing(false);

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.message || 'An error occurred while updating profile');
        } finally {
            setIsLoading(false);
            setIsEditing(false)
        }
    };

    const getProfileData = async () => {
        setIsFetching(true);
        try {
            const response = await axios.get(`${API_URL}api/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log("data ", response.data.data);
            if (response.data.flag === 1) {
                const data = response.data.data;

                setFormData({
                    ...initialFormData, // Reset to initial state first
                    ...data // Override with API data
                });
                setTempImage(null);
                setTempResume(null);
            } else {
                toast.error(response.data.message || 'Failed to load profile data');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile data');
        } finally {
            setIsFetching(false);
        }
    };

    const handleCancel = () => {
        // Reset to initial data by fetching again
        getProfileData();
        setTempImage(null);
        setTempResume(null);
        setIsEditing(false);
    };

    useEffect(() => {
        getProfileData();
    }, [token]);

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Profile Information</h1>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        Edit Profile
                    </button>
                ) : (
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            form="profile-form"
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-green-400"
                        >
                            <FontAwesomeIcon icon={faSave} />
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Header with Image */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                <div className="flex flex-col md:flex-row items-center p-6">
                    <div className="relative mb-4 md:mb-0 md:mr-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                            {(formData.image || tempImage) ? (
                                <img
                                    src={
                                        tempImage
                                            ? URL.createObjectURL(tempImage)
                                            : formData.image
                                                ? `${formData.image}`
                                                : ''
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUser} className="text-4xl text-gray-400" />
                                </div>
                            )}
                        </div>
                        {isEditing && (
                            <div className="mt-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                                    Change Photo
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                                    accept="image/*"
                                />
                                <p className="text-xs text-gray-500 mt-1 text-center">Max 2MB</p>
                            </div>
                        )}
                    </div>

                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {formData.title} {formData.first_name} {formData.last_name}
                        </h2>
                        <p className="text-gray-600 mb-2">{formData.designation}</p>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                            {formData.speciality && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {formData.speciality}
                                </span>
                            )}
                            {formData.affiliation && (
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                    {formData.affiliation}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                                Personal Information
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Title</label>
                                    {isEditing ? (
                                        <select
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Title</option>
                                            <option value="Mr">Mr</option>
                                            <option value="Mrs">Mrs</option>
                                            <option value="Ms">Ms</option>
                                            <option value="Dr">Dr</option>
                                        </select>
                                    ) : (
                                        <div className="p-2 bg-gray-50 rounded-lg">{formData.title || '-'}</div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                                    {isEditing ? (
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Gender </option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    ) : (
                                        <div className="p-2 bg-gray-50 rounded-lg">{formData.gender || '-'}</div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    readOnly={!isEditing}
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    readOnly={!isEditing}
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faPhone} className="text-blue-500" />
                                Contact Information
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    readOnly={true}
                                    value={formData.email}
                                    className="w-full p-2 bg-gray-50 rounded-lg"
                                />
                            </div>

                            <div>
                                <label className=" text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                                    Phone
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    readOnly={!isEditing}
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className=" text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                                    Landline
                                </label>
                                <input
                                    type="tel"
                                    name="landline"
                                    readOnly={!isEditing}
                                    value={formData.landline || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Address Information Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2">
                        <div className="bg-blue-50 p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-blue-500" />
                                Address Information
                            </h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    readOnly={!isEditing}
                                    value={formData.address || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    readOnly={!isEditing}
                                    value={formData.country || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    readOnly={!isEditing}
                                    value={formData.city || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">ZIP Code</label>
                                <input
                                    type="text"
                                    name="zip"
                                    readOnly={!isEditing}
                                    value={formData.zip || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Information Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faGraduationCap} className="text-blue-500" />
                                Education
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    readOnly={!isEditing}
                                    value={formData.qualification || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">University</label>
                                <input
                                    type="text"
                                    name="university"
                                    readOnly={!isEditing}
                                    value={formData.university || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Professional Information Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faBriefcase} className="text-blue-500" />
                                Professional
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Designation</label>
                                <input
                                    type="text"
                                    name="designation"
                                    readOnly={!isEditing}
                                    value={formData.designation || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Affiliation</label>
                                <input
                                    type="text"
                                    name="affiliation"
                                    readOnly={!isEditing}
                                    value={formData.affiliation || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Speciality</label>
                                <input
                                    type="text"
                                    name="speciality"
                                    readOnly={!isEditing}
                                    value={formData.speciality || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Achievements Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faAward} className="text-blue-500" />
                                Achievements
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Awards</label>
                                <input
                                    type="text"
                                    name="awards"
                                    readOnly={!isEditing}
                                    value={formData.awards || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUsers} className="text-gray-400" />
                                    Society Memberships
                                </label>
                                <input
                                    type="text"
                                    name="society_memberships"
                                    readOnly={!isEditing}
                                    value={formData.society_memberships || ''}
                                    onChange={handleChange}
                                    className={`w-full p-2 rounded-lg ${!isEditing ? 'bg-gray-50' : 'border focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500" />
                                About
                            </h3>
                        </div>
                        <div className="p-4">
                            <label className="block text-sm font-medium text-gray-600 mb-1">About Me</label>
                            {isEditing ? (
                                <textarea
                                    name="about"
                                    value={formData.about || ''}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <div className="p-2 bg-gray-50 rounded-lg min-h-[100px]">
                                    {formData.about || 'No information provided'}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Researcher Links - Only show for user_type = 2 */}
                    {userData?.user_type === "2" && (
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="bg-blue-50 p-4 border-b">
                                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                                    Researcher Links
                                </h3>
                            </div>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faGoogle} className="text-green-500" />
                                        Google Scholar
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            name="google_scroler"
                                            value={formData.google_scroler || ''}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="https://scholar.google.com/..."
                                        />
                                    ) : (
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            {formData.google_scroler ? (
                                                <a
                                                    href={formData.google_scroler}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 break-all"
                                                >
                                                    {formData.google_scroler}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faOrcid} className="text-green-500" />
                                        ORCID Link
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="url"
                                            name="orcid_link"
                                            value={formData.orcid_link || ''}
                                            onChange={handleChange}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="https://orcid.org/..."
                                        />
                                    ) : (
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            {formData.orcid_link ? (
                                                <a
                                                    href={formData.orcid_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 break-all"
                                                >
                                                    {formData.orcid_link}
                                                </a>
                                            ) : (
                                                '-'
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Resume Card */}
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-blue-50 p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FontAwesomeIcon icon={faFilePdf} className="text-blue-500" />
                                Resume
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            {isEditing && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Upload New Resume</label>
                                    <input
                                        type="file"
                                        name="resume"
                                        onChange={handleFileChange}
                                        className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                                        accept=".pdf"
                                    />
                                    {tempResume && (
                                        <p className="mt-1 text-sm text-gray-600">New file: {tempResume.name}</p>
                                    )}
                                </div>
                            )}

                            {formData.resume && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">
                                        {isEditing ? 'Current Resume' : 'Resume'}
                                    </label>
                                    <a
                                        href={`${STORAGE_URL}${formData.resume}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                                    >
                                        <FontAwesomeIcon icon={faFilePdf} className="text-red-500" />
                                        View PDF Resume
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;