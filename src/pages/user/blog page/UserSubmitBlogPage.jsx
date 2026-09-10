import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breadcrumb from "../../../components/common/Breadcrumb";

const UserSubmitBlogPage = () => {
  const { token, userData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const updateId = searchParams.get("update");

  const [formData, setFormData] = useState({
    blog_category_id: "",
    title: "",
    author: "",
    description: "",
    long_description: "",
    image: null,
    image_alt: "",
    blog_pdf: null,
    date: "",
    most_view: 0,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfFileName, setPdfFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [examplePdf, setExamplePdf] = useState(null);
  const [examplePdfLoading, setExamplePdfLoading] = useState(false);
  const [existingImage, setExistingImage] = useState(null);
  const [existingPdf, setExistingPdf] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_URL}api/user/blogs/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );
        if (response.data.flag === 1) {
          setCategories(response.data.data);
        }
      } catch (err) {
        toast.error("Failed to fetch categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [token, API_URL]);

  // Fetch example PDF on component mount
  useEffect(() => {
    const fetchExamplePdf = async () => {
      try {
        setExamplePdfLoading(true);
        const response = await axios.get(`${API_URL}api/blog-pdf/1`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });

        if (response.data.status) {
          setExamplePdf(response.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch example PDF:", err);
      } finally {
        setExamplePdfLoading(false);
      }
    };

    fetchExamplePdf();
  }, [token, API_URL]);

  // Fetch blog data for update
  useEffect(() => {
    if (updateId) {
      fetchBlogData(updateId);
    }
  }, [updateId]);

  const fetchBlogData = async (id) => {
    try {
      setFetchLoading(true);
      const response = await axios.get(`${API_URL}api/user/blogs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.data.flag === 1) {
        const data = response.data.data;

        // Set form data with existing values
        setFormData({
          blog_category_id: data.blog_category_id || "",
          title: data.title || "",
          author: data.author || "",
          description: data.description || "",
          long_description: data.long_description || "",
          image: null,
          image_alt: data.image_alt || "",
          blog_pdf: null,
          date: data.date ? data.date.split("T")[0] : "",
          most_view: data.most_view || 0,
        });

        // Set existing image preview
        if (data.image) {
          setExistingImage(data.image);
          setImagePreview(`${STORAGE_URL}${data.image}`);
        }

        // Set existing PDF name
        if (data.blog_pdf) {
          setExistingPdf(data.blog_pdf);
          const pdfName = data.blog_pdf.split("/").pop();
          setPdfFileName(pdfName);
        }

        toast.info("Blog data loaded for editing");
      } else {
        toast.error(response.data.message || "Failed to load blog data");
      }
    } catch (error) {
      console.error("Error fetching blog data:", error);
      toast.error(error.response?.data?.message || "Failed to load blog data");
    } finally {
      setFetchLoading(false);
    }
  };

  // Validation function
  const validateField = (name, value) => {
    let error = "";

    const requiredFields = [
      "blog_category_id",
      "title",
      "author",
      "description",
      "long_description",
      "date",
    ];

    if (requiredFields.includes(name) && !value) {
      error = `${name.replace("_", " ")} is required`;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrors((prev) => ({ ...prev, [name]: "" }));

    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content, fieldName) => {
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));

    if (fieldName === "long_description" && !content) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Long description is required",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [fieldName]: content,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setErrors((prev) => ({ ...prev, image: "" }));
    setExistingImage(null);

    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        toast.error("Please select a valid image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        toast.error("Image size should be less than 5MB");
        return;
      }

      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = function () {
        const width = this.width;
        const height = this.height;

        if (width < 800 || height < 500) {
          setErrors((prev) => ({
            ...prev,
            image: `Image dimensions should be at least 800x500px. Current: ${width}x${height}px`,
          }));
          toast.error(
            `Image dimensions should be at least 800x500px. Current: ${width}x${height}px`
          );
          URL.revokeObjectURL(objectUrl);
          return;
        }

        const aspectRatio = width / height;
        if (aspectRatio < 1.3 || aspectRatio > 2.0) {
          setErrors((prev) => ({
            ...prev,
            image: `Recommended aspect ratio is between 1.3:1 and 2:1 (landscape). Current: ${(
              width / height
            ).toFixed(2)}:1`,
          }));
          toast.error(
            `Recommended aspect ratio is between 1.3:1 and 2:1 (landscape)`
          );
          URL.revokeObjectURL(objectUrl);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          image: file,
        }));

        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        URL.revokeObjectURL(objectUrl);
      };

      img.onerror = function () {
        toast.error("Failed to load image");
        URL.revokeObjectURL(objectUrl);
      };

      img.src = objectUrl;
    }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];

    setErrors((prev) => ({ ...prev, blog_pdf: "" }));
    setExistingPdf(null);

    if (file) {
      if (file.type !== "application/pdf") {
        setErrors((prev) => ({
          ...prev,
          blog_pdf: "Please select a valid PDF file",
        }));
        toast.error("Please select a valid PDF file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          blog_pdf: "PDF file size should be less than 10MB",
        }));
        toast.error("PDF file size should be less than 10MB");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        blog_pdf: file,
      }));

      setPdfFileName(file.name);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
      image_alt: "",
    }));
    setImagePreview(null);
    setExistingImage(null);
    setErrors((prev) => ({ ...prev, image: "" }));

    const fileInput = document.querySelector(
      'input[type="file"][accept="image/*"]'
    );
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleRemovePdf = () => {
    setFormData((prev) => ({
      ...prev,
      blog_pdf: null,
    }));
    setPdfFileName("");
    setExistingPdf(null);
    setErrors((prev) => ({ ...prev, blog_pdf: "" }));

    const fileInput = document.querySelector(
      'input[type="file"][accept=".pdf"]'
    );
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    let hasError = false;

    const requiredFields = [
      "blog_category_id",
      "title",
      "author",
      "description",
      "long_description",
      "date",
    ];
    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
        hasError = true;
      }
    });

    // Check if image exists (either new upload or existing)
    if (!formData.image && !existingImage) {
      newErrors.image = "Image is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      toast.error("Please fix all validation errors before submitting");
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("blog_category_id", formData.blog_category_id);
      submitData.append("title", formData.title);
      submitData.append("author", formData.author);
      submitData.append("description", formData.description);
      submitData.append("long_description", formData.long_description);
      submitData.append("image_alt", formData.image_alt);
      submitData.append("date", formData.date);
      submitData.append("most_view", formData.most_view);
      submitData.append("created_by", userData?.id);

      // For update, keep status as is
      if (updateId) {
        submitData.append("is_update", 0);
      } else {
        submitData.append("status", 0);
      }

      // Handle image - only append if new file is selected
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      // Handle PDF - only append if new file is selected
      if (formData.blog_pdf) {
        submitData.append("blog_pdf", formData.blog_pdf);
      }

      let response;
      if (updateId) {
        // Update existing blog
        response = await axios.post(
          `${API_URL}api/user/blogs/${updateId}`,
          submitData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Create new blog
        response = await axios.post(`${API_URL}api/user/blogs`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        toast.success(
          updateId
            ? "Your blog has been updated successfully!"
            : "Your blog has been submitted successfully!"
        );
        setSubmissionSuccess(true);

        // Reset form after successful submission
        setFormData({
          blog_category_id: "",
          title: "",
          author: "",
          description: "",
          long_description: "",
          image: null,
          image_alt: "",
          blog_pdf: null,
          date: "",
          most_view: 0,
        });
        setImagePreview(null);
        setPdfFileName("");
        setExistingImage(null);
        setExistingPdf(null);
        setErrors({});

        // Redirect after short delay
        setTimeout(() => {
          navigate(updateId ? "/view-submit-blog" : "/blog");
        }, 1500);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (updateId
          ? "Failed to update blog. Please try again."
          : "Failed to submit blog. Please try again.");
      toast.error(errorMessage);
      console.error("Error submitting blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // Get full file URL
  const getFileUrl = (filePath) => {
    if (!filePath) return null;
    if (filePath.startsWith("http")) return filePath;
    return `${STORAGE_URL}${filePath}`;
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Research Snapshot", path: "/blog" },
          { label: updateId ? "Update Blog" : "Submit Blog" },
        ]}
        pageTitle={
          updateId ? "Update Your Research Blog" : "Submit Your Research Blog"
        }
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Success Message */}
          {submissionSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg animate-fadeIn">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-800 font-medium">
                    {updateId
                      ? "Your blog has been updated successfully! You will be redirected shortly."
                      : "Your blog has been submitted successfully! You will be redirected shortly."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {updateId ? "Update Your" : "Share Your"}{" "}
              <span className="text-yellow-600">Research</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {updateId
                ? "Update your research blog with new findings and insights"
                : "Contribute your research findings, insights, and expertise to our community"}
            </p>
            {updateId && (
              <div className="mt-3 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editing existing blog
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Guidelines */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
                <div className="flex items-center mb-4">
                  <svg
                    className="w-6 h-6 text-yellow-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-bold text-gray-900">
                    Submission Guidelines
                  </h3>
                </div>

                <div className="space-y-4 text-sm text-gray-600">
                  <div className="border-l-4 border-yellow-400 pl-3">
                    <h4 className="font-semibold text-gray-800">
                      1. Original Content
                    </h4>
                    <p>
                      Submit only original research and content that you have
                      created.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-3">
                    <h4 className="font-semibold text-gray-800">
                      2. Image Requirements
                    </h4>
                    <p>
                      Images should be at least 800x500px in landscape format
                      (aspect ratio 1.3:1 to 2:1). Max size: 5MB.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-3">
                    <h4 className="font-semibold text-gray-800">
                      3. PDF Upload (Optional)
                    </h4>
                    <p>
                      Upload a PDF version of your research for detailed
                      reference. Max size: 10MB.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-3">
                    <h4 className="font-semibold text-gray-800">
                      4. Structure
                    </h4>
                    <p>
                      Include a clear title, author name, short description, and
                      detailed content.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-400 pl-3">
                    <h4 className="font-semibold text-gray-800">
                      5. Review Process
                    </h4>
                    <p>
                      All submissions will be reviewed by our editorial team
                      before publication.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-yellow-600 mr-2 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-xs text-yellow-800">
                      <span className="font-semibold">Note:</span> Please ensure
                      all information is accurate and well-researched before
                      submission.
                    </p>
                  </div>
                </div>

                {/* ========================================== */}
                {/* RESOURCES SECTION - PDF, WORD, DRIVE */}
                {/* ========================================== */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                      />
                    </svg>
                    Sample Resources
                  </h4>

                  {examplePdfLoading ? (
                    <div className="flex items-center text-xs text-blue-600">
                      <svg
                        className="animate-spin w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
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
                      Loading resources...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* PDF - Guideline */}
                      {examplePdf && examplePdf.pdf && (
                        <a
                          href={getFileUrl(examplePdf.pdf)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-2.5 bg-white rounded-lg hover:bg-gray-50 transition-colors group border border-blue-100"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-red-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-xs font-medium text-gray-700">
                              Guideline PDF
                            </span>
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                          </svg>
                        </a>
                      )}

                      {/* Word - Template */}
                      {examplePdf && examplePdf.word && (
                        <a
                          href={getFileUrl(examplePdf.word)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-2.5 bg-white rounded-lg hover:bg-gray-50 transition-colors group border border-blue-100"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span className="text-xs font-medium text-gray-700">
                              Word Template
                            </span>
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                            />
                          </svg>
                        </a>
                      )}

                      {/* Drive Link */}
                      {examplePdf && examplePdf.drive && (
                        <a
                          href={examplePdf.drive}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-between p-2.5 bg-white rounded-lg hover:bg-gray-50 transition-colors group border border-blue-100"
                        >
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                              />
                            </svg>
                            <span className="text-xs font-medium text-gray-700">
                              Drive Link
                            </span>
                          </div>
                          <svg
                            className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      )}

                      {/* If no resources available */}
                      {(!examplePdf ||
                        (!examplePdf.pdf &&
                          !examplePdf.word &&
                          !examplePdf.drive)) && (
                        <p className="text-xs text-gray-500 text-center py-2">
                          No sample resources available
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Sample Format */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-700 mb-2">
                    📄 Sample Format
                  </h4>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>• Title: "The Impact of AI"</p>
                    <p>• Author: Dr. Jane Smith</p>
                    <p>• Category: Technology</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-yellow-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-yellow-600">50+</p>
                      <p className="text-xs text-gray-600">Blogs Published</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <p className="text-lg font-bold text-blue-600">30+</p>
                      <p className="text-xs text-gray-600">Active Authors</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {updateId ? "Update Your Blog" : "Submit Your Blog"}
                </h2>
                <p className="text-gray-600 mb-6">
                  {updateId
                    ? "Make changes to your blog and submit for review again"
                    : "Fill in the details below to submit your research blog"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Selection */}
                  <div>
                    <label
                      htmlFor="blog_category_id"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="blog_category_id"
                      name="blog_category_id"
                      value={formData.blog_category_id}
                      onChange={handleChange}
                      required
                      className={`mt-1 block w-full pl-3 pr-10 py-3 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                        errors.blog_category_id
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={loading || fetchLoading}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                    {errors.blog_category_id && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.blog_category_id}
                      </p>
                    )}
                  </div>

                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      disabled={loading || fetchLoading}
                      className={`mt-1 block w-full border rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your blog title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Author */}
                  <div>
                    <label
                      htmlFor="author"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Author <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      disabled={loading || fetchLoading}
                      className={`mt-1 block w-full border rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                        errors.author ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.author && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.author}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Publication Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      disabled={loading || fetchLoading}
                      max={getTodayDate()}
                      className={`mt-1 block w-full border rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                        errors.date ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                  </div>

                  {/* Image Upload Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Blog Image <span className="text-red-500">*</span>
                    </label>

                    {!imagePreview && !existingImage && (
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 hover:border-yellow-400 hover:bg-yellow-50 mb-4 ${
                          errors.image ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                          disabled={loading || fetchLoading}
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <svg
                            className="w-12 h-12 text-gray-400 mb-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-600 mb-1">
                            Click to upload image
                          </span>
                          <span className="text-xs text-gray-400">
                            PNG, JPG, JPEG up to 5MB (Recommended: 1200x800px,
                            landscape)
                          </span>
                        </label>
                      </div>
                    )}

                    {(imagePreview || existingImage) && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {existingImage && !imagePreview
                            ? "Current Image:"
                            : "Preview:"}
                        </p>
                        <div className="relative inline-block group">
                          <img
                            src={
                              imagePreview || `${STORAGE_URL}${existingImage}`
                            }
                            alt="Preview"
                            className="h-48 w-full object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            disabled={loading || fetchLoading}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg disabled:opacity-50"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        {existingImage && !imagePreview && (
                          <p className="text-xs text-gray-500 mt-1">
                            Remove to upload a new image
                          </p>
                        )}
                      </div>
                    )}

                    {errors.image && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.image}
                      </p>
                    )}

                    <div className="mt-4">
                      <label
                        htmlFor="image_alt"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Image Alt Text
                      </label>
                      <input
                        type="text"
                        id="image_alt"
                        name="image_alt"
                        value={formData.image_alt}
                        onChange={handleChange}
                        disabled={loading || fetchLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-200"
                        placeholder="Enter descriptive alt text for the image"
                      />
                    </div>
                  </div>

                  {/* PDF Upload Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blog PDF{" "}
                      <span className="text-gray-400 text-xs">
                        (Optional - Max 10MB)
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Upload a PDF version of your research for detailed
                      reference
                    </p>

                    {!pdfFileName && !existingPdf && (
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 hover:border-green-400 hover:bg-green-50 ${
                          errors.blog_pdf
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handlePdfChange}
                          className="hidden"
                          id="pdf-upload"
                          disabled={loading || fetchLoading}
                        />
                        <label
                          htmlFor="pdf-upload"
                          className="cursor-pointer flex flex-col items-center justify-center"
                        >
                          <svg
                            className="w-10 h-10 text-gray-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-600">
                            Click to upload PDF
                          </span>
                        </label>
                      </div>
                    )}

                    {(pdfFileName || existingPdf) && (
                      <div className="flex items-center justify-between bg-white border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <svg
                            className="w-8 h-8 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {pdfFileName || existingPdf?.split("/").pop()}
                            </p>
                            <p className="text-xs text-gray-500">
                              {existingPdf && !pdfFileName
                                ? "Current PDF file"
                                : "PDF file selected"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePdf}
                          disabled={loading || fetchLoading}
                          className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    )}

                    {errors.blog_pdf && (
                      <p className="text-red-500 text-sm mt-2">
                        {errors.blog_pdf}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Short Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      disabled={loading || fetchLoading}
                      rows="4"
                      className={`mt-1 block w-full border rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter a brief description of your blog (2-3 sentences)"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Long Description */}
                  <div>
                    <label
                      htmlFor="long_description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Detailed Content <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Write your full research content with proper formatting
                    </p>
                    <div
                      className={`border rounded-lg ${
                        errors.long_description
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <Editor
                        apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
                        value={formData.long_description}
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
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height:1.6; }",
                          link_context_toolbar: true,
                          link_assume_external_targets: true,
                          link_title: false,
                          default_link_target: "_blank",
                        }}
                        onEditorChange={(content) =>
                          handleEditorChange(content, "long_description")
                        }
                      />
                    </div>
                    {errors.long_description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.long_description}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
                    <button
                      type="button"
                      onClick={() => navigate(updateId ? "/my-blogs" : "/blog")}
                      className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || fetchLoading}
                      className="inline-flex justify-center items-center py-3 px-8 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          {updateId ? "Updating..." : "Submitting..."}
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          {updateId ? "Update Blog" : "Submit Blog"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSubmitBlogPage;