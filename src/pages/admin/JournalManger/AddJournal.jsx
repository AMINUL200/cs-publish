import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";

const AddJournal = () => {
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;
    const fileInputRef = useRef(null);

    const [groupOptions, setGroupOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);

    const [loading, setLoading] = useState(true);
    const [handleLoading, setHandleLoading] = useState(false);

    // formData state
    const [formData, setFormData] = useState({
        group_id: "",
        category_id: "",
        j_title: "",
        j_categories: "",
        j_description: "",
        editorial_board: "",
        editor: "",
        issn_print: "1", // default true
        issn_print_no: "",
        issn_online: "1",
        issn_online_no: "",
        ugc_approved: "1",
        ugc_no: "",
        amount: "", // Added amount field
        image: null,
        status: "1",
    });
    // fetch groups
    const fetchGroupData = async () => {
        try {
            const response = await axios.get(`${API_URL}api/admin/groups`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setGroupOptions(response.data.data);
            } else {
                toast.error(response.data.message || "Failed to fetch groups");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategoryData = async (groupId) => {
        if (!groupId) {
            setCategoryOptions([]);
            return;
        }
        try {
            const response = await axios.get(`${API_URL}api/admin/categories/groups/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setCategoryOptions(response.data.data); // adjust based on your API response
            } else {
                toast.error(response.data.message || "Failed to fetch categories");
                setCategoryOptions([]);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message || "Error fetching categories");
            setCategoryOptions([]);
        }
    };


    useEffect(() => {
        fetchGroupData();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else if (
            ["issn_print", "issn_online", "ugc_approved", "status"].includes(name)
        ) {
            setFormData((prev) => ({ ...prev, [name]: Number(value) })); // 👈 store as number
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        if (name === "group_id") {
            fetchCategoryData(value);
            setFormData((prev) => ({ ...prev, category_id: "" }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setHandleLoading(true);
        try {
            const submitData = new FormData();

            // Append all form data to FormData object
            Object.entries(formData).forEach(([key, value]) => {
                // Skip null or undefined values
                if (value !== null && value !== undefined) {
                    submitData.append(key, value);
                }
            });

            const res = await axios.post(`${API_URL}api/admin/journals`, submitData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 201) {
                toast.success(res.data.message || "Journal added successfully");
                setFormData({
                    group_id: "",
                    category_id: "",
                    j_title: "",
                    j_categories: "",
                    j_description: "",
                    editorial_board: "",
                    editor: "",
                    issn_print: "1",
                    issn_print_no: "",
                    issn_online: "1",
                    issn_online_no: "",
                    ugc_approved: "1",
                    ugc_no: "",
                    amount: "", // Reset amount field
                    image: null,
                    status: "1",
                });
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                toast.error(res.data.message || "Failed to add journal");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.message || "Something went wrong");
        } finally {
            setHandleLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm ">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Add Journal</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Group */}
                    <div>
                        <label className="block mb-1 font-medium">Group</label>
                        <select
                            name="group_id"
                            value={formData.group_id}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Select Group</option>
                            {groupOptions.map((group) => (
                                <option key={group.id} value={group.id}>
                                    {group.group_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category ID */}
                    <div>
                        <label className="block mb-1 font-medium">Category</label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            {categoryOptions.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                </div>


                {/* Title */}
                <div>
                    <label className="block mb-1 font-medium">Journal Title</label>
                    <input
                        type="text"
                        name="j_title"
                        value={formData.j_title}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        required
                    />
                </div>

                {/* Categories */}
                <div>
                    <label className="block mb-1 font-medium">Journal Categories</label>
                    <input
                        type="text"
                        name="j_categories"
                        value={formData.j_categories}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <textarea
                        name="j_description"
                        value={formData.j_description}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Editorial Board */}
                <div>
                    <label className="block mb-1 font-medium">Editorial Board</label>
                    <input
                        type="text"
                        name="editorial_board"
                        value={formData.editorial_board}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Editor */}
                <div>
                    <label className="block mb-1 font-medium">Editor</label>
                    <input
                        type="text"
                        name="editor"
                        value={formData.editor}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Amount */}
                <div>
                    <label className="block mb-1 font-medium">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Enter amount"
                    />
                </div>

                {/* ISSN Print */}
                <div>
                    <label className="block mb-1 font-medium">ISSN Print</label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="issn_print"
                                value="1"
                                checked={formData.issn_print === "1"}
                                onChange={handleChange}
                            />{" "}
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="issn_print"
                                value="0"
                                checked={formData.issn_print === "0"}
                                onChange={handleChange}
                            />{" "}
                            No
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">ISSN Print No</label>
                    <input
                        type="number"
                        name="issn_print_no"
                        value={formData.issn_print_no}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* ISSN Online */}
                <div>
                    <label className="block mb-1 font-medium">ISSN Online</label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="issn_online"
                                value="1"
                                checked={formData.issn_online === "1"}
                                onChange={handleChange}
                            />{" "}
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="issn_online"
                                value="0"
                                checked={formData.issn_online === "0"}
                                onChange={handleChange}
                            />{" "}
                            No
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">ISSN Online No</label>
                    <input
                        type="number"
                        name="issn_online_no"
                        value={formData.issn_online_no}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* UGC Approved */}
                <div>
                    <label className="block mb-1 font-medium">UGC Approved</label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="ugc_approved"
                                value="1"
                                checked={formData.ugc_approved === "1"}
                                onChange={handleChange}
                            />{" "}
                            Yes
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="ugc_approved"
                                value="0"
                                checked={formData.ugc_approved === "0"}
                                onChange={handleChange}
                            />{" "}
                            No
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium">UGC No</label>
                    <input
                        type="text"
                        name="ugc_no"
                        value={formData.ugc_no}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Image */}
                <div>
                    <label className="block mb-1 font-medium">Image</label>
                    <input
                        type="file"
                        name="image"
                        ref={fileInputRef}
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full border px-3 py-2 rounded"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block mb-1 font-medium">Status</label>
                    <div className="flex items-center gap-4">
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="1"
                                checked={formData.status === "1"}
                                onChange={handleChange}
                            />{" "}
                            Active
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="status"
                                value="0"
                                checked={formData.status === "0"}
                                onChange={handleChange}
                            />{" "}
                            Inactive
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={handleLoading}
                    className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${handleLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"}`}
                >
                    {handleLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-1 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (
                        "Save Journal"
                    )}
                </button>
            </form>
        </div>
    );
};

export default AddJournal;