import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { da } from 'date-fns/locale/da';


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
    zip: '',
    qualification: '',
    university: '',
    affiliation: '',
    designation: '',
    awards: '',
    society_memberships: '',
    speciality: '',
    image: null,
    resume: null
};

const ProfilePage = () => {
      const { token } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    const [tempResume, setTempResume] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [isFetching, setIsFetching] = useState(true);

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
                setTempImage(files[0]);
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
                '/api/profile',
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
            const response = await axios.get('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.flag === 1) {
                const data = response.data.data;
                console.log(data);
                
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
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Profile Information</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        {isEditing ?
                            <select
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Ms">Ms</option>
                                <option value="Dr">Dr</option>
                            </select> :
                            <p className='bg-gray-200 p-2 px-4 rounded-xl' style={{ padding: "10px" }}>{formData.title}</p>
                        }
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            readOnly={!isEditing}
                            value={formData.first_name}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            readOnly={!isEditing}
                            value={formData.last_name}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Gender</label>
                        {isEditing ?
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            :
                            <p className='bg-gray-200 p-2 px-4 rounded-xl' style={{ padding: "10px" }}>{formData.gender}</p>
                        }
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            readOnly={!isEditing}
                            value={formData.phone}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Landline</label>
                        <input
                            type="tel"
                            name="landline"
                            readOnly={!isEditing}
                            value={formData.landline || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            readOnly={!isEditing}
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Profile Image</label>
                        <input
                            type="file"
                            name="image"
                            disabled={!isEditing}
                            onChange={handleFileChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                            accept="image/*"
                        />
                        {(formData.image || tempImage) && (
                            <div className="mt-3 w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                                <img
                                    src={
                                        tempImage
                                            ? URL.createObjectURL(tempImage)
                                            : (formData.image instanceof File
                                                ? URL.createObjectURL(formData.image)
                                                : formData.image)
                                    }
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Address</label>
                        <input
                            type="text"
                            name="address"
                            readOnly={!isEditing}
                            value={formData.address || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Country</label>
                        <input
                            type="text"
                            name="country"
                            readOnly={!isEditing}
                            value={formData.country || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">City</label>
                        <input
                            type="text"
                            name="city"
                            readOnly={!isEditing}
                            value={formData.city || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">ZIP Code</label>
                        <input
                            type="text"
                            name="zip"
                            readOnly={!isEditing}
                            value={formData.zip || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Qualification</label>
                        <input
                            type="text"
                            name="qualification"
                            readOnly={!isEditing}
                            value={formData.qualification || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">University</label>
                        <input
                            type="text"
                            name="university"
                            readOnly={!isEditing}
                            value={formData.university || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            readOnly={!isEditing}
                            value={formData.designation || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Affiliation</label>
                        <input
                            type="text"
                            name="affiliation"
                            readOnly={!isEditing}
                            value={formData.affiliation || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Awards</label>
                        <input
                            type="text"
                            name="awards"
                            readOnly={!isEditing}
                            value={formData.awards || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Society Memberships</label>
                        <input
                            type="text"
                            name="society_memberships"
                            readOnly={!isEditing}
                            value={formData.society_memberships || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Speciality</label>
                        <input
                            type="text"
                            name="speciality"
                            readOnly={!isEditing}
                            value={formData.speciality || ''}
                            onChange={handleChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Resume</label>
                        <input
                            type="file"
                            name="resume"
                            disabled={!isEditing}
                            onChange={handleFileChange}
                            className={`w-full p-[10px] rounded-xl ${!isEditing
                                ? "bg-gray-200 outline-none border-none focus:border-none focus:outline-none focus:ring-0"
                                : "border"
                                }`}
                            onFocus={e => !isEditing && e.target.blur()}
                            accept=".pdf"
                        />
                    </div>
                </div>

                {!isEditing &&
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Edit Profile
                    </button>
                }
                {isEditing &&
                    <div className='flex gap-3'>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-800"
                        >
                            Cancel
                        </button>
                    </div>
                }
            </form>
        </div>
    );
};

export default ProfilePage;