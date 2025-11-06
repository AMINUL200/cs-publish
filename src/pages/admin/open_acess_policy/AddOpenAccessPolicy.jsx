import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Editor } from "@tinymce/tinymce-react";

const AddOpenAccessPolicy = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    journal_id: "",
    title: "",
    long_description: "",
    pages: "open_access_policy"
  });
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState("");

  // Check if we're in edit mode
  useEffect(() => {
    const updateId = searchParams.get('update');
    if (updateId) {
      setIsEdit(true);
      setCurrentId(updateId);
      fetchItemData(updateId);
    }
    fetchJournals();
  }, [searchParams]);

  // Fetch journals for dropdown
  const fetchJournals = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/journals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success) {
        setJournals(response.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch journals");
    }
  };

  // Fetch item data for editing
  const fetchItemData = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/open-access-policy/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status && response.data.data) {
        const data = response.data.data;
        setFormData({
          journal_id: data.journal_id || "",
          title: data.title || "",
          long_description: data.long_description || "",
          pages: data.pages || "open_access_policy"
        });
      }
    } catch (err) {
      toast.error("Error fetching open access policy data: " + err.message);
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

  // Handle editor change for long description
  const handleEditorChange = (content) => {
    setFormData(prev => ({
      ...prev,
      long_description: content
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.journal_id || !formData.title || !formData.long_description) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setLoading(true);

      const url = isEdit 
        ? `${API_URL}api/open-access-policy/${currentId}`
        : `${API_URL}api/open-access-policy`;
      
      const method = isEdit ? 'POST' : 'POST';

      const response = await axios({
        method: method,
        url: url,
        data: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status) {
        toast.success(`Open access policy ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate('/handle-open-access-policy');
      } else {
        throw new Error(response.data.message || 'Operation failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${isEdit ? 'update' : 'create'} open access policy`;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading open access policy data...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {isEdit ? 'Edit Open Access Policy' : 'Add New Open Access Policy'}
      </h1>
      
      <p className="text-gray-600 mb-6">
        {isEdit ? 'Update the open access policy information' : 'Create a new open access policy for a journal'}
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          {/* Journal Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Journal *
            </label>
            <select
              name="journal_id"
              value={formData.journal_id}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">Select a Journal</option>
              {journals.map((journal) => (
                <option key={journal.id} value={journal.id}>
                  {journal.j_title}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="Enter open access policy title"
            />
          </div>

          {/* Pages (Hidden field since it's always open_access_policy) */}
          <input type="hidden" name="pages" value="open_access_policy" />

          {/* Long Description with TinyMCE Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Long Description *
            </label>
            <Editor
              apiKey={import.meta.env.VITE_TEXT_EDITOR_API_KEY}
              value={formData.long_description}
              onEditorChange={handleEditorChange}
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
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
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
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEdit ? 'Update Open Access Policy' : 'Create Open Access Policy'
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/handle-open-access-policy')}
              disabled={loading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddOpenAccessPolicy;