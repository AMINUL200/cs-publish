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
    const [errors, setErrors] = useState({});

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
        author_guide: "",
        about_the_journal: "",
        impact_factor: "",
        total_citations: "",
        h_index: "",
        acceptance_rate: "",
        total_articles: "",
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState("");

    // Validation function - Same as AddJournal
    const validateField = (name, value) => {
        let error = "";
        
        // Number fields that should accept decimals with any number of decimal places
        const decimalFields = [
            "impact_factor", 
            "acceptance_rate",
            "issn_print_no",
            "issn_online_no"
        ];
        
        // Integer fields (whole numbers only)
        const integerFields = [
            "total_articles",
            "total_citations", 
            "h_index",
            "amount"
        ];
        
        // Text fields (can contain alphanumeric and special characters)
        const textFields = [
            "ugc_no"
        ];

        if (decimalFields.includes(name)) {
            // Allow empty or numbers with any number of decimal places
            if (value && !/^\d*\.?\d*$/.test(value)) {
                error = "Please enter a valid decimal number (e.g., 22.05, 12.005, 5.234445345)";
            }
            // Check if it's a valid number format (no multiple dots)
            if (value && (value.match(/\./g) || []).length > 1) {
                error = "Please enter a valid number with only one decimal point";
            }
        } else if (integerFields.includes(name)) {
            if (value && !/^\d*$/.test(value)) {
                error = "Please enter a valid number (digits only)";
            }
            // For amount field, check if it's not negative
            if (name === "amount" && value && parseFloat(value) < 0) {
                error = "Amount cannot be negative";
            }
        } else if (textFields.includes(name)) {
            // UGC No can contain alphanumeric characters
            if (value && !/^[a-zA-Z0-9\-_\s]*$/.test(value)) {
                error = "Please enter valid characters (alphanumeric, spaces, hyphens, underscores)";
            }
        }
        
        return error;
    };

    // fetch journal by ID
    const fetchJournal = async () => {
        try {
            const res = await axios.get(`${API_URL}api/admin/journals/${id}`, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                },
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
                    image: null,
                    status: j.status ? "1" : "0",
                    author_guide: j.author_guide || "",
                    about_the_journal: j.about_the_journal || "",
                    impact_factor: j.impact_factor || "",
                    total_citations: j.total_citations || "",
                    h_index: j.h_index || "",
                    acceptance_rate: j.acceptance_rate || "",
                    total_articles: j.total_articles || "",
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
        
        // Clear previous error for this field
        setErrors(prev => ({ ...prev, [name]: "" }));
        
        if (type === "file") {
            const file = files[0];
            if (file) {
                // Validate image file
                const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                const maxSize = 5 * 1024 * 1024; // 5MB
                
                if (!validTypes.includes(file.type)) {
                    setErrors(prev => ({ ...prev, image: "Please upload a valid image file (JPEG, PNG, GIF, WEBP)" }));
                    return;
                }
                if (file.size > maxSize) {
                    setErrors(prev => ({ ...prev, image: "Image size should be less than 5MB" }));
                    return;
                }
                
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
            // Validate the field
            const error = validateField(name, value);
            if (error) {
                setErrors(prev => ({ ...prev, [name]: error }));
            }
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
        
        // Validate all fields before submission
        const newErrors = {};
        let hasError = false;
        
        // Check required fields
        const requiredFields = ['j_title', 'amount'];
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `${field.replace('_', ' ')} is required`;
                hasError = true;
            }
        });
        
        // Validate all numeric fields
        const numericFields = [
            'impact_factor', 'acceptance_rate', 'total_articles', 
            'total_citations', 'h_index', 'issn_print_no', 
            'issn_online_no', 'amount'
        ];
        
        numericFields.forEach(field => {
            if (formData[field]) {
                const error = validateField(field, formData[field]);
                if (error) {
                    newErrors[field] = error;
                    hasError = true;
                }
            }
        });
        
        // Validate UGC No
        if (formData.ugc_no) {
            const error = validateField('ugc_no', formData.ugc_no);
            if (error) {
                newErrors.ugc_no = error;
                hasError = true;
            }
        }
        
        if (hasError) {
            setErrors(newErrors);
            // Scroll to first error
            const firstErrorField = Object.keys(newErrors)[0];
            const element = document.querySelector(`[name="${firstErrorField}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                element.focus();
            }
            toast.error("Please fix all validation errors before submitting");
            return;
        }
        
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
                        className={`w-full border px-3 py-2 rounded ${errors.j_title ? 'border-red-500' : ''}`}
                        required
                    />
                    {errors.j_title && <p className="text-red-500 text-sm mt-1">{errors.j_title}</p>}
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

                {/* Journal Metrics Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4 text-gray-700">Journal Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Impact Factor - Decimal */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Impact Factor
                                <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="impact_factor"
                                value={formData.impact_factor}
                                onChange={handleChange}
                                placeholder="e.g., 23.04"
                                className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.impact_factor ? 'border-red-500' : ''}`}
                            />
                            {errors.impact_factor && <p className="text-red-500 text-sm mt-1">{errors.impact_factor}</p>}
                        </div>

                        {/* Total Articles - Integer */}
                        <div>
                            <label className="block mb-1 font-medium">
                               Quick Press
                                <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="total_articles"
                                value={formData.total_articles}
                                onChange={handleChange}
                                placeholder="e.g., 500"
                                className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.total_articles ? 'border-red-500' : ''}`}
                            />
                            {errors.total_articles && <p className="text-red-500 text-sm mt-1">{errors.total_articles}</p>}
                        </div>

                        {/* Total Citations - Integer */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Indexing
                                <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="total_citations"
                                value={formData.total_citations}
                                onChange={handleChange}
                                placeholder="e.g., 1250"
                                className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.total_citations ? 'border-red-500' : ''}`}
                            />
                            {errors.total_citations && <p className="text-red-500 text-sm mt-1">{errors.total_citations}</p>}
                        </div>

                        {/* H-Index - Integer */}
                        <div>
                            <label className="block mb-1 font-medium">
                                First Decision
                                <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="h_index"
                                value={formData.h_index}
                                onChange={handleChange}
                                placeholder="e.g., 45"
                                className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.h_index ? 'border-red-500' : ''}`}
                            />
                            {errors.h_index && <p className="text-red-500 text-sm mt-1">{errors.h_index}</p>}
                        </div>

                        {/* Acceptance Rate - Decimal */}
                        <div>
                            <label className="block mb-1 font-medium">
                                Acceptance Rate (%)
                                <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="acceptance_rate"
                                value={formData.acceptance_rate}
                                onChange={handleChange}
                                placeholder="e.g., 25.50"
                                className={`w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.acceptance_rate ? 'border-red-500' : ''}`}
                            />
                            {errors.acceptance_rate && <p className="text-red-500 text-sm mt-1">{errors.acceptance_rate}</p>}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        These metrics help authors evaluate the journal's impact, volume, and selectivity.
                    </p>
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

                {/* Amount - Integer */}
                <div>
                    <label className="block mb-1 font-medium">Amount</label>
                    <input
                        type="text"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 rounded ${errors.amount ? 'border-red-500' : ''}`}
                        placeholder="Enter amount"
                        required
                    />
                    {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                </div>

                {/* Publication Model */}
                <div>
                    <label className="block mb-1 font-medium">Publication Model</label>
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
                    <label className="block mb-1 font-medium">Publication Model No</label>
                    <input
                        type="text"
                        name="issn_print_no"
                        value={formData.issn_print_no}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 rounded ${errors.issn_print_no ? 'border-red-500' : ''}`}
                        placeholder="Enter ISSN Print Number (e.g., 22.05, 12.005, 5.234445345)"
                    />
                    {errors.issn_print_no && <p className="text-red-500 text-sm mt-1">{errors.issn_print_no}</p>}
                </div>

                {/* ISSN Online */}
                <div>
                    <label className="block mb-1 font-medium">Peer Review</label>
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
                    <label className="block mb-1 font-medium">Peer Review No</label>
                    <input
                        type="text"
                        name="issn_online_no"
                        value={formData.issn_online_no}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 rounded ${errors.issn_online_no ? 'border-red-500' : ''}`}
                        placeholder="Enter ISSN Online Number (e.g., 22.05, 12.005, 5.234445345)"
                    />
                    {errors.issn_online_no && <p className="text-red-500 text-sm mt-1">{errors.issn_online_no}</p>}
                </div>

                {/* UGC Approved */}
                <div>
                    <label className="block mb-1 font-medium">DOI</label>
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
                    <label className="block mb-1 font-medium">DOI No</label>
                    <input
                        type="text"
                        name="ugc_no"
                        value={formData.ugc_no}
                        onChange={handleChange}
                        className={`w-full border px-3 py-2 rounded ${errors.ugc_no ? 'border-red-500' : ''}`}
                        placeholder="Enter UGC Number"
                    />
                    {errors.ugc_no && <p className="text-red-500 text-sm mt-1">{errors.ugc_no}</p>}
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
                        className={`w-full border px-3 py-2 rounded ${errors.image ? 'border-red-500' : ''}`}
                    />
                    {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                    
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
                    {handleLoading ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
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
                            Updating...
                        </>
                    ) : (
                        "Update Journal"
                    )}
                </button>
            </form>
        </div>
    );
};

export default EditJournal;