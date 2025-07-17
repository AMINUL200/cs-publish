import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";

const EditJournal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(true);
    const [handleLoading, setHandleLoading] = useState(false);

    const [groupOptions, setGroupOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [groupName, setGroupName] = useState("");
    const [categoryName, setCategoryName] = useState("");

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
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
        image: null,
        status: "1",
    });

    // fetch groups
    const fetchGroups = async () => {
        try {
            const res = await axios.get(`${API_URL}api/admin/groups`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200) {
                setGroupOptions(res.data.data || []);
            }
        } catch (err) {
            toast.error("Error fetching groups");
        }
    };

    const fetchCategories = async (groupId) => {
        if (!groupId) {
            setCategoryOptions([]);
            return;
        }
        try {
            const res = await axios.get(`${API_URL}api/admin/categories/${groupId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200) {
                setCategoryOptions(res.data.data || []);
            }
        } catch (err) {
            toast.error("Error fetching categories");
        }
    };

    // fetch journal by ID
    const fetchJournal = async () => {
        try {
            const res = await axios.get(`${API_URL}api/admin/journals/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200 && res.data.success) {
                const j = res.data.data;
                // set read-only display values
                setGroupName(j.group?.group_name || "");
                setCategoryName(j.category?.category_name || "");
                // set editable fields
                setFormData({
                    group_id: j.group_id || "",
                    category_id: j.category_id || "",
                    j_title: j.j_title || "",
                    j_categories: j.j_categories || "",
                    j_description: j.j_description || "",
                    editorial_board: j.editorial_board || "",
                    editor: j.editor || "",
                    issn_print: j.issn_print ? "1" : "0",
                    issn_print_no: j.issn_print_no || "",
                    issn_online: j.issn_online ? "1" : "0",
                    issn_online_no: j.issn_online_no || "",
                    ugc_approved: j.ugc_approved ? "1" : "0",
                    ugc_no: j.ugc_no || "",
                    image: null,
                    status: j.status ? "1" : "0",
                });
            }
        } catch (err) {
            toast.error("Error fetching journal");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJournal();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            setFormData((prev) => ({ ...prev, [name]: files[0] }));
        } else if (
            ["issn_print", "issn_online", "ugc_approved", "status"].includes(name)
        ) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }


    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHandleLoading(true);
        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    submitData.append(key, value);
                }
            });

            const res = await axios.post(
                `${API_URL}api/admin/journals/update/${id}`, // or use axios.put if API supports
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            


            if (res.status === 200) {
                console.log(res.data);
                
                toast.success(res.data.message || "Journal updated successfully");
                navigate("/article-manger/journal"); // redirect if needed
            } else {
                toast.error(res.data.message || "Failed to update journal");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setHandleLoading(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="p-6 bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Journal</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Group and Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">Group</label>
                        <input
                            type="text"
                            value={groupName}
                            readOnly
                            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Category</label>
                        <input
                            type="text"
                            value={categoryName}
                            readOnly
                            className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                        />
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

                {/* Journal Categories */}
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
                    {formData.image === null && (
                        <p className="text-sm text-gray-500">
                            (Current image will remain unless you upload a new one)
                        </p>
                    )}
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
                    className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${handleLoading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {handleLoading ? "Updating..." : "Update Journal"}
                </button>
            </form>
        </div>
    );
};

export default EditJournal;
