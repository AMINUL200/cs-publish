import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, Save, Loader } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";

const UpdateTerms = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const apikey = import.meta.env.VITE_TEXT_EDITOR_API_KEY;
  const { token } = useSelector((state) => state.auth);
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    page_title: "",
    title: "",
    description: ""
  });

  // Fetch page data
  const fetchPageData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/terms-edit/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch page data");
      navigate("/admin/terms");
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle editor changes
  const handleEditorChange = (content, fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: content
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      const response = await axios.post(
        `${API_URL}api/terms-update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success("Page updated successfully!");
        navigate("/setting/terms");
      } else {
        toast.error("Failed to update page");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update page");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPageData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/terms")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Pages</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit {formData.page_title}
            </h1>
            <p className="text-gray-600 mt-2">
              Update the content and details for this page
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6 space-y-6">
          {/* Page Title */}
          <div>
            <label htmlFor="page_title" className="block text-sm font-medium text-gray-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              id="page_title"
              name="page_title"
              value={formData.page_title}
              onChange={handleInputChange}
              required
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 bg-gray-50"
              placeholder="Enter page title"
            />
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Content Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter content title"
            />
          </div>

          {/* Description with TinyMCE Editor */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <Editor
              apiKey={apikey}
              value={formData.description}
              init={{
                height: 500,
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
                // Additional styling options
                branding: false,
                statusbar: true,
                elementpath: true,
                paste_data_images: false,
                images_upload_handler: undefined,
                // Responsive setup
                mobile: {
                  theme: 'mobile',
                  toolbar: [
                    'undo', 'redo', 'bold', 'italic', 'underline', 'link'
                  ]
                }
              }}
              onEditorChange={(content) => handleEditorChange(content, "description")}
            />
            <p className="text-xs text-gray-500 mt-2">
              Use the rich text editor to format your content. You can add links, lists, and apply formatting as needed.
            </p>
          </div>

          {/* Character Count (Optional) */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Content Length:</span>
              <span className="font-medium">
                {formData.description ? formData.description.length : 0} characters
              </span>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate("/admin/terms")}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={updating || !formData.description.trim()}
              className="flex items-center space-x-2 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {updating ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Page</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Quick Tips */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Editor Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use the toolbar to format your text with bold, italic, and underline</li>
          <li>• Create lists and organize your content with proper alignment</li>
          <li>• Add links to relevant pages using the link button</li>
          <li>• Use the code view for advanced HTML editing</li>
          <li>• Make sure your content is comprehensive but easy to understand</li>
        </ul>
      </div>

      {/* Preview Section (Optional) */}
      <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Preview</h3>
          <div className="prose max-w-none p-4 border border-gray-200 rounded-lg min-h-32 bg-gray-50">
            {formData.description ? (
              <div 
                dangerouslySetInnerHTML={{ __html: formData.description }} 
                className="text-gray-700"
              />
            ) : (
              <p className="text-gray-500 italic">Your content will appear here as you type...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTerms;