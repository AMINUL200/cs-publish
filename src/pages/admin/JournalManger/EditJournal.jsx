import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";
import { Editor } from "@tinymce/tinymce-react";

const EditJournal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;
      const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

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
        amount: "",
        issn_print: "1",
        issn_print_no: "",
        issn_online: "1",
        issn_online_no: "",
        ugc_approved: "1",
        ugc_no: "",
        image: null,
        status: "1",
        author_guide: "", // New field
        about_the_journal: "", // New field
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    // fetch journal by ID
    const fetchJournal = async () => {
        try {
            const res = await axios.get(`${API_URL}api/admin/journals/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200 && res.data.success) {
                const j = res.data.data;
                console.log(res.data.data);
                
                // set read-only display values
                setGroupName(j.group?.group_name || "");
                setCategoryName(j.category?.category_name || "");
                
                // Set current image URL for preview
                if (j.image) {
                    setCurrentImageUrl(j.image);
                    setImagePreview(`${STORAGE_URL}${j.image}`);
                }
                
                // set editable fields
                setFormData({
                    group_id: j.group_id || "",
                    category_id: j.category_id || "",
                    j_title: j.j_title || "",
                    j_categories: j.j_categories || "",
                    j_description: j.j_description || "",
                    editorial_board: j.editorial_board || "",
                    editor: j.editor || "",
                    amount: j.amount || "",
                    issn_print: j.issn_print ? "1" : "0",
                    issn_print_no: j.issn_print_no || "",
                    issn_online: j.issn_online ? "1" : "0",
                    issn_online_no: j.issn_online_no || "",
                    ugc_approved: j.ugc_approved ? "1" : "0",
                    ugc_no: j.ugc_no || "",
                    image: null, // Keep as null initially, we'll handle file separately
                    status: j.status ? "1" : "0",
                    author_guide: j.author_guide || "", // New field
                    about_the_journal: j.about_the_journal || "", // New field
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
            const file = files[0];
            if (file) {
                setFormData((prev) => ({ ...prev, [name]: file }));
                
                // Create preview for new image
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else if (
            ["issn_print", "issn_online", "ugc_approved", "status"].includes(name)
        ) {
            setFormData((prev) => ({ ...prev, [name]: value }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle editor changes for rich text fields
    const handleEditorChange = (content, fieldName) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: content,
        }));
    };

    const handleRemoveImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
        setCurrentImageUrl("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
                `${API_URL}api/admin/journals/update/${id}`,
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
                navigate("/article-manger/journal");
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
                        rows="4"
                    />
                </div>

                {/* About the Journal - Rich Text Editor */}
                <div>
                    <label className="block mb-1 font-medium">About the Journal</label>
                    <Editor
                        apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                        value={formData.about_the_journal}
                        init={{
                            height: 400,
                            menubar: false,
                            plugins: [
                                "advlist",
                                "autolink",
                                "link",
                                "lists",
                                "charmap",
                                "preview",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "help",
                                "wordcount",
                            ],
                            toolbar:
                                "undo redo | blocks | " +
                                "bold italic underline | link | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | " +
                                "removeformat | help | code",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            link_context_toolbar: true,
                            link_assume_external_targets: true,
                            link_title: false,
                            default_link_target: "_blank",
                            link_list: [
                                { title: "Home Page", value: "/" },
                                { title: "About Page", value: "/about" },
                                { title: "Contact Page", value: "/contact" },
                            ],
                        }}
                        onEditorChange={(content) =>
                            handleEditorChange(content, "about_the_journal")
                        }
                    />
                </div>

                {/* Author Guide - Rich Text Editor */}
                <div>
                    <label className="block mb-1 font-medium">Author Guide</label>
                    <Editor
                        apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                        value={formData.author_guide}
                        init={{
                            height: 400,
                            menubar: false,
                            plugins: [
                                "advlist",
                                "autolink",
                                "link",
                                "lists",
                                "charmap",
                                "preview",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "help",
                                "wordcount",
                            ],
                            toolbar:
                                "undo redo | blocks | " +
                                "bold italic underline | link | " +
                                "alignleft aligncenter alignright alignjustify | " +
                                "bullist numlist outdent indent | " +
                                "removeformat | help | code",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                            link_context_toolbar: true,
                            link_assume_external_targets: true,
                            link_title: false,
                            default_link_target: "_blank",
                            link_list: [
                                { title: "Home Page", value: "/" },
                                { title: "About Page", value: "/about" },
                                { title: "Contact Page", value: "/contact" },
                            ],
                        }}
                        onEditorChange={(content) =>
                            handleEditorChange(content, "author_guide")
                        }
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

                {/* Image Upload and Preview */}
                <div>
                    <label className="block mb-1 font-medium">Image</label>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                            <div className="relative inline-block">
                                <img 
                                    src={imagePreview} 
                                    // src={`${STORAGE_URL}${currentImageUrl}`}
                                    alt="Journal preview" 
                                    className="w-32 h-32 object-cover rounded-lg border shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    {/* File Input */}
                    <input
                        type="file"
                        name="image"
                        ref={fileInputRef}
                        onChange={handleChange}
                        accept="image/*"
                        className="w-full border px-3 py-2 rounded"
                    />
                    
                    {/* Help Text */}
                    <div className="mt-2">
                        {currentImageUrl && !formData.image ? (
                            <p className="text-sm text-blue-600">
                                Current image is being used. Upload a new image to replace it.
                            </p>
                        ) : formData.image ? (
                            <p className="text-sm text-green-600">
                                New image selected. Click "Update Journal" to save changes.
                            </p>
                        ) : (
                            <p className="text-sm text-gray-500">
                                No image selected. The journal will not have an image.
                            </p>
                        )}
                    </div>
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
                    className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 ${
                        handleLoading
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