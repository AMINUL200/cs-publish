import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";

const EditGroups = () => {
    const { id } = useParams();
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        group_name: "",
        description: "",
        status: "", // default enabled
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle radio change for status
    const handleStatusChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            status: value,
        }));
    };

    // Fetch data (dummy or real API)
    const fetchGroupData = async () => {
        try {
            const res = await axios.get(`${API_URL}api/admin/groups/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
                console.log(res.data);

                setFormData({
                    group_name: res.data.data.group_name,
                    description: res.data.data.description,
                    status: res.data.data.status, // should already be "0" or "1"
                });
            }


        } catch (err) {
            console.error(err);
            toast.error("Failed to load group data");
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put(`${API_URL}api/admin/groups/${id}`, formData, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                navigate("/groups/view-groups");
            } else {
                toast.error(response.data.message);
            }


        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return <Loader />
    }
    return (
        <div className="p-6 bg-white rounded-lg shadow-sm max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Group</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Group Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Group Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="group_name"
                        value={formData.group_name}
                        onChange={handleChange}
                        placeholder="Enter group name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter group description"
                        rows={4}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                    ></textarea>
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                    </label>
                    <div className="flex items-center space-x-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="1"
                                checked={formData.status === "1"}
                                onChange={() => handleStatusChange("1")}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">Enable</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                name="status"
                                value="0"
                                checked={formData.status === "0"}
                                onChange={() => handleStatusChange("0")}
                                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-gray-700">Disable</span>
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`text-white font-semibold px-6 py-2 rounded-lg flex items-center justify-center gap-2 ${loading
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                            } transition-colors duration-300`}
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
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
                        )}
                        Update Group
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditGroups;
