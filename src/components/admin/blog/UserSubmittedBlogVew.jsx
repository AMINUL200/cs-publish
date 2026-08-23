import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faCheck,
  faTimes,
  faSearch,
  faFilter,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../common/Loader";

const UserSubmittedBlogVew = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittedBlogs, setSubmittedBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [useDummyData, setUseDummyData] = useState(true); // Toggle for dummy/real data
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Dummy data for testing
  const dummyBlogs = [
    {
      id: 1,
      title: "The Future of Artificial Intelligence in Healthcare",
      author: "Dr. Sarah Johnson",
      description: "Exploring how AI is revolutionizing medical diagnosis and patient care",
      long_description: "<p>Artificial Intelligence is transforming healthcare in unprecedented ways. From early disease detection to personalized treatment plans, AI-powered solutions are improving patient outcomes and reducing healthcare costs. This comprehensive study examines the latest developments in AI healthcare applications, including machine learning algorithms for medical imaging, natural language processing for clinical documentation, and predictive analytics for patient monitoring.</p><p>Key findings suggest that AI integration in healthcare could save billions in operational costs while significantly improving diagnostic accuracy. However, challenges remain in data privacy, regulatory compliance, and the need for human oversight in critical medical decisions.</p>",
      image: "/dummy-images/ai-healthcare.jpg",
      image_alt: "AI in Healthcare",
      blog_pdf: "/dummy-pdfs/ai-healthcare.pdf",
      category: {
        id: 1,
        category_name: "Technology"
      },
      user: {
        id: 101,
        name: "John Doe",
        email: "john.doe@example.com"
      },
      status: "pending",
      date: "2026-08-15",
      created_at: "2026-08-10T14:30:00Z",
      rejection_reason: null,
      most_view: 0
    },
    {
      id: 2,
      title: "Sustainable Agriculture Practices for the 21st Century",
      author: "Prof. Michael Green",
      description: "Innovative farming techniques that promote environmental sustainability",
      long_description: "<p>As global population continues to grow, sustainable agriculture has become more critical than ever. This research explores innovative farming techniques that balance productivity with environmental stewardship. Topics covered include precision agriculture, crop rotation strategies, organic farming methods, and the role of technology in sustainable food production.</p><p>The study demonstrates that sustainable practices can increase crop yields by up to 30% while reducing water usage by 40% and eliminating harmful pesticide use. These findings have significant implications for food security and environmental conservation worldwide.</p>",
      image: "/dummy-images/sustainable-agriculture.jpg",
      image_alt: "Sustainable Agriculture",
      blog_pdf: "/dummy-pdfs/sustainable-agriculture.pdf",
      category: {
        id: 2,
        category_name: "Agriculture"
      },
      user: {
        id: 102,
        name: "Jane Smith",
        email: "jane.smith@example.com"
      },
      status: "approved",
      date: "2026-08-12",
      created_at: "2026-08-05T09:15:00Z",
      rejection_reason: null,
      most_view: 156
    },
    {
      id: 3,
      title: "Climate Change Impacts on Marine Ecosystems",
      author: "Dr. Emily Watson",
      description: "Understanding the effects of global warming on ocean life and biodiversity",
      long_description: "<p>Climate change is profoundly affecting marine ecosystems worldwide. Rising ocean temperatures, ocean acidification, and changing currents are reshaping marine habitats and threatening biodiversity. This comprehensive study analyzes data from 50 marine research stations across five continents to document these changes and predict future trends.</p><p>The research reveals alarming rates of coral bleaching, shifting fish migration patterns, and declining plankton populations that form the base of marine food webs. Urgent action is needed to mitigate these effects and protect ocean ecosystems for future generations.</p>",
      image: "/dummy-images/marine-ecosystems.jpg",
      image_alt: "Marine Ecosystems",
      blog_pdf: "/dummy-pdfs/marine-ecosystems.pdf",
      category: {
        id: 3,
        category_name: "Environment"
      },
      user: {
        id: 103,
        name: "Robert Chen",
        email: "robert.chen@example.com"
      },
      status: "rejected",
      date: "2026-08-08",
      created_at: "2026-08-01T11:45:00Z",
      rejection_reason: "The research methodology needs more detail. Please provide additional data sources and statistical analysis.",
      most_view: 0
    },
    {
      id: 4,
      title: "Blockchain Technology in Supply Chain Management",
      author: "Dr. Alex Rivera",
      description: "How blockchain is revolutionizing transparency and efficiency in supply chains",
      long_description: "<p>Blockchain technology is transforming supply chain management by providing unprecedented transparency, security, and efficiency. This research explores the implementation of blockchain solutions in various industries, from retail to manufacturing, and their impact on operational performance.</p><p>Key benefits identified include enhanced traceability of products, reduced fraud and counterfeiting, streamlined documentation processes, and improved stakeholder trust. Case studies from leading companies demonstrate significant cost savings and operational improvements through blockchain integration.</p>",
      image: "/dummy-images/blockchain-supplychain.jpg",
      image_alt: "Blockchain in Supply Chain",
      blog_pdf: null,
      category: {
        id: 4,
        category_name: "Business"
      },
      user: {
        id: 104,
        name: "Maria Garcia",
        email: "maria.garcia@example.com"
      },
      status: "pending",
      date: "2026-08-18",
      created_at: "2026-08-14T16:20:00Z",
      rejection_reason: null,
      most_view: 0
    },
    {
      id: 5,
      title: "Mental Health in the Digital Age",
      author: "Dr. Lisa Park",
      description: "Examining the impact of social media and technology on mental wellbeing",
      long_description: "<p>The digital age has brought unprecedented connectivity but also new challenges for mental health. This comprehensive study examines the relationship between social media usage, screen time, and mental wellbeing across different age groups.</p><p>Findings indicate that excessive social media use is correlated with increased rates of anxiety and depression, particularly among adolescents and young adults. However, mindful technology use and digital detox strategies show promise in mitigating these negative effects. The research provides practical recommendations for maintaining mental health in an increasingly digital world.</p>",
      image: "/dummy-images/mental-health.jpg",
      image_alt: "Mental Health in Digital Age",
      blog_pdf: "/dummy-pdfs/mental-health.pdf",
      category: {
        id: 5,
        category_name: "Health"
      },
      user: {
        id: 105,
        name: "David Kim",
        email: "david.kim@example.com"
      },
      status: "pending",
      date: "2026-08-20",
      created_at: "2026-08-16T10:00:00Z",
      rejection_reason: null,
      most_view: 0
    },
    {
      id: 6,
      title: "Renewable Energy Innovations for Urban Environments",
      author: "Prof. Thomas Brown",
      description: "Sustainable energy solutions for smart cities of the future",
      long_description: "<p>Urban areas face unique energy challenges that require innovative renewable solutions. This research examines the integration of solar, wind, and other renewable energy sources into urban infrastructure, along with energy storage solutions and smart grid technologies.</p><p>The study presents case studies from leading smart cities worldwide, demonstrating how renewable energy innovations are reducing carbon footprints, lowering energy costs, and improving the quality of urban life. Recommendations are provided for policymakers and urban planners to accelerate the transition to sustainable urban energy systems.</p>",
      image: "/dummy-images/renewable-energy.jpg",
      image_alt: "Renewable Energy in Cities",
      blog_pdf: null,
      category: {
        id: 6,
        category_name: "Energy"
      },
      user: {
        id: 106,
        name: "Sarah Williams",
        email: "sarah.williams@example.com"
      },
      status: "approved",
      date: "2026-08-10",
      created_at: "2026-08-03T13:30:00Z",
      rejection_reason: null,
      most_view: 89
    }
  ];

  // Fetch submitted blogs (with dummy data fallback)
  const fetchSubmittedBlogs = async () => {
    try {
      setLoading(true);
      
      // If using dummy data, simulate API delay
      if (useDummyData) {
        setTimeout(() => {
          setSubmittedBlogs(dummyBlogs);
          setFilteredBlogs(dummyBlogs);
          updateStats(dummyBlogs);
          setLoading(false);
        }, 800);
        return;
      }

      // Real API call
      const response = await axios.get(`${API_URL}api/admin/user-submitted-blogs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.status === 200) {
        const blogs = response.data.data || [];
        setSubmittedBlogs(blogs);
        setFilteredBlogs(blogs);
        updateStats(blogs);
      } else {
        toast.error(response.data.message || "Failed to fetch submitted blogs");
        // Fallback to dummy data on API error
        setSubmittedBlogs(dummyBlogs);
        setFilteredBlogs(dummyBlogs);
        updateStats(dummyBlogs);
      }
    } catch (error) {
      console.error("Error fetching submitted blogs:", error);
      toast.error(error.response?.data?.message || "Failed to fetch submitted blogs. Showing sample data.");
      // Fallback to dummy data on error
      setSubmittedBlogs(dummyBlogs);
      setFilteredBlogs(dummyBlogs);
      updateStats(dummyBlogs);
    } finally {
      setLoading(false);
    }
  };

  // Update statistics
  const updateStats = (blogs) => {
    const pending = blogs.filter(b => b.status === 'pending' || !b.status).length;
    const approved = blogs.filter(b => b.status === 'approved').length;
    const rejected = blogs.filter(b => b.status === 'rejected').length;
    
    setStats({
      total: blogs.length,
      pending,
      approved,
      rejected,
    });
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = submittedBlogs;
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(blog => 
        (blog.status || 'pending') === statusFilter
      );
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchLower) ||
        blog.author?.toLowerCase().includes(searchLower) ||
        blog.user?.name?.toLowerCase().includes(searchLower) ||
        blog.user?.email?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredBlogs(filtered);
  }, [searchTerm, statusFilter, submittedBlogs]);

  // Handle view blog details
  const handleViewDetails = (blog) => {
    setSelectedBlog(blog);
    setShowModal(true);
  };

  // Handle apply/approve blog
  const handleApprove = async (blogId) => {
    if (!window.confirm("Are you sure you want to approve this blog? It will be published on the site.")) {
      return;
    }
    
    setActionLoading(true);
    
    if (useDummyData) {
      // Simulate API call for dummy data
      setTimeout(() => {
        const updatedBlogs = submittedBlogs.map(blog => 
          blog.id === blogId ? { ...blog, status: 'approved' } : blog
        );
        setSubmittedBlogs(updatedBlogs);
        setFilteredBlogs(updatedBlogs);
        updateStats(updatedBlogs);
        toast.success("Blog approved successfully!");
        setShowModal(false);
        setActionLoading(false);
      }, 1500);
      return;
    }

    // Real API call
    try {
      const response = await axios.put(
        `${API_URL}api/admin/user-submitted-blogs/${blogId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Blog approved successfully!");
        fetchSubmittedBlogs();
        setShowModal(false);
      } else {
        toast.error(response.data.message || "Failed to approve blog");
      }
    } catch (error) {
      console.error("Error approving blog:", error);
      toast.error(error.response?.data?.message || "Failed to approve blog");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject blog
  const handleReject = async (blogId) => {
    const reason = window.prompt("Please enter a reason for rejection (optional):");
    
    setActionLoading(true);

    if (useDummyData) {
      // Simulate API call for dummy data
      setTimeout(() => {
        const updatedBlogs = submittedBlogs.map(blog => 
          blog.id === blogId ? { 
            ...blog, 
            status: 'rejected', 
            rejection_reason: reason || "Not meeting quality standards" 
          } : blog
        );
        setSubmittedBlogs(updatedBlogs);
        setFilteredBlogs(updatedBlogs);
        updateStats(updatedBlogs);
        toast.success("Blog rejected successfully!");
        setShowModal(false);
        setActionLoading(false);
      }, 1500);
      return;
    }

    // Real API call
    try {
      const response = await axios.put(
        `${API_URL}api/admin/user-submitted-blogs/${blogId}/reject`,
        { reason: reason || "Not meeting quality standards" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Blog rejected successfully!");
        fetchSubmittedBlogs();
        setShowModal(false);
      } else {
        toast.error(response.data.message || "Failed to reject blog");
      }
    } catch (error) {
      console.error("Error rejecting blog:", error);
      toast.error(error.response?.data?.message || "Failed to reject blog");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update blog (redirect to edit page)
  const handleUpdate = (blogId) => {
    // For dummy data, show a toast
    if (useDummyData) {
      toast.info("Update functionality will be available with real API integration");
      return;
    }
    window.location.href = `/blog/edit/${blogId}`;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: faClock, label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: faCheckCircle, label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: faTimesCircle, label: 'Rejected' },
    };
    
    const currentStatus = status || 'pending';
    const config = statusMap[currentStatus] || statusMap.pending;
    
    return (
      <span className={`px-3 py-1 inline-flex items-center text-xs font-semibold rounded-full ${config.color}`}>
        <FontAwesomeIcon icon={config.icon} className="mr-1" />
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Toggle between dummy and real data
  const toggleDataMode = () => {
    setUseDummyData(!useDummyData);
    fetchSubmittedBlogs();
    toast.info(`Switched to ${!useDummyData ? 'dummy' : 'real'} data mode`);
  };

  useEffect(() => {
    fetchSubmittedBlogs();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Submitted Blogs</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage blogs submitted by users</p>
          <div className="mt-1">
            <span className={`text-xs font-medium px-2 py-1 rounded ${useDummyData ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
              {useDummyData ? '📊 Using Sample Data' : '🔗 Connected to API'}
            </span>
          </div>
        </div>
        <button
          onClick={toggleDataMode}
          className="mt-2 sm:mt-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
        >
          Switch to {useDummyData ? 'Real' : 'Sample'} Data
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Submissions</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FontAwesomeIcon icon={faFilter} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FontAwesomeIcon icon={faClock} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Approved</p>
              <p className="text-2xl font-bold text-green-900">{stats.approved}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FontAwesomeIcon icon={faTimesCircle} className="text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("approved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "approved"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === "rejected"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Rejected
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search by title, author..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                #ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Submitted By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Submitted Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map((blog, index) => (
                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 border-2">
                    <div className="max-w-xs truncate">
                      {blog.title || 'Untitled'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {blog.author || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    <div>
                      <div className="font-medium">{blog.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-400">{blog.user?.email || ''}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {blog.category?.category_name || 'Uncategorized'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-2">
                    {getStatusBadge(blog.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    {formatDate(blog.created_at || blog.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                    <button
                      onClick={() => handleViewDetails(blog)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-300"
                    >
                      <FontAwesomeIcon icon={faEye} className="mr-1" />
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-2">📝</div>
                    <p className="font-medium">No submitted blogs found</p>
                    <p className="text-xs text-gray-400 mt-1">No blogs match your search criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Info */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
        <div>
          Showing {filteredBlogs.length > 0 ? 1 : 0} to {filteredBlogs.length} of {submittedBlogs.length} rows
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Blog Details</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gray-500">Status:</span>
                  {getStatusBadge(selectedBlog.status)}
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              {/* Image */}
              {selectedBlog.image ? (
                <div className="mb-6">
                  <img
                    src={selectedBlog.image.startsWith('http') ? selectedBlog.image : `${STORAGE_URL}${selectedBlog.image}`}
                    alt={selectedBlog.image_alt || selectedBlog.title}
                    className="w-full max-h-80 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/1200x800/0066cc/ffffff?text=Blog+Image';
                    }}
                  />
                </div>
              ) : (
                <div className="mb-6 bg-gray-100 rounded-lg p-8 text-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Title</label>
                  <p className="text-lg font-medium text-gray-900">{selectedBlog.title || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Author</label>
                  <p className="text-lg font-medium text-gray-900">{selectedBlog.author || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                  <p className="text-gray-900">{selectedBlog.category?.category_name || 'Uncategorized'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Submitted By</label>
                  <p className="text-gray-900">{selectedBlog.user?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-500">{selectedBlog.user?.email || ''}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Publication Date</label>
                  <p className="text-gray-900">{formatDate(selectedBlog.date)}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Submitted Date</label>
                  <p className="text-gray-900">{formatDate(selectedBlog.created_at)}</p>
                </div>
                {selectedBlog.blog_pdf && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">PDF Attachment</label>
                    <div className="mt-1">
                      <a
                        href={selectedBlog.blog_pdf.startsWith('http') ? selectedBlog.blog_pdf : `${STORAGE_URL}${selectedBlog.blog_pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        View PDF
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">Short Description</label>
                <p className="text-gray-700 mt-1">{selectedBlog.description || 'No description provided'}</p>
              </div>

              {/* Long Description */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">Detailed Content</label>
                <div 
                  className="text-gray-700 mt-1 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.long_description || 'No content provided' }}
                />
              </div>

              {/* Action Buttons */}
              {(selectedBlog.status === 'pending' || !selectedBlog.status) && (
                <div className="border-t border-gray-200 pt-4 mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleApprove(selectedBlog.id)}
                    disabled={actionLoading}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {actionLoading ? (
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                    ) : (
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    )}
                    Apply / Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedBlog.id)}
                    disabled={actionLoading}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdate(selectedBlog.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Update
                  </button>
                </div>
              )}

              {selectedBlog.status === 'approved' && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button
                    onClick={() => handleUpdate(selectedBlog.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Update Blog
                  </button>
                </div>
              )}

              {selectedBlog.status === 'rejected' && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Rejection Reason:</span> {selectedBlog.rejection_reason || 'No reason provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSubmittedBlogVew;