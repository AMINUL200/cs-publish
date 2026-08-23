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
  faLightbulb,
  faRocket,
  faUser,
  faImage,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import Loader from "../../../components/common/Loader";

const UserSubmitInnovation = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submittedInnovations, setSubmittedInnovations] = useState([]);
  const [filteredInnovations, setFilteredInnovations] = useState([]);
  const [selectedInnovation, setSelectedInnovation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [useDummyData, setUseDummyData] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

  // Dummy data for testing
  const dummyInnovations = [
    {
      id: 1,
      page_title: "AI-Powered Healthcare Diagnostics",
      title: "Revolutionizing Medical Diagnosis with Artificial Intelligence",
      description: "A groundbreaking AI system that detects diseases with 95% accuracy using medical imaging",
      long_description: "<p>This innovation presents a cutting-edge AI-powered diagnostic system that utilizes deep learning algorithms to analyze medical images. The system can detect various diseases including cancer, pneumonia, and cardiovascular conditions with unprecedented accuracy.</p><p>Key features include real-time analysis, integration with existing medical infrastructure, and continuous learning capabilities. Clinical trials have shown a 95% accuracy rate, surpassing traditional diagnostic methods.</p>",
      image_video: "/dummy-images/ai-healthcare.jpg",
      image_alt_tag: "AI Healthcare Diagnostics System",
      innovator_name: "Dr. Sarah Johnson",
      innovator_desc: "AI Researcher with 15+ years in medical imaging",
      innovator_email: "sarah.johnson@example.com",
      pdf: "/dummy-pdfs/ai-healthcare-research.pdf",
      is_upcomming: false,
      status: "pending",
      created_at: "2026-08-20T10:30:00Z",
      rejection_reason: null,
      view_count: 0,
      category: "Healthcare"
    },
    {
      id: 2,
      page_title: "Sustainable Energy Storage System",
      title: "Revolutionary Battery Technology for Renewable Energy",
      description: "A new battery technology that stores renewable energy 3x more efficiently",
      long_description: "<p>This innovation introduces a novel battery technology that dramatically improves energy storage efficiency for renewable sources. Using advanced materials and nano-technology, the system achieves 3x the storage capacity of current lithium-ion batteries.</p><p>The technology is environmentally friendly, using abundant materials and offering a longer lifespan. It has the potential to revolutionize the renewable energy sector and accelerate the transition to clean energy.</p>",
      image_video: "/dummy-images/sustainable-energy.jpg",
      image_alt_tag: "Sustainable Energy Storage",
      innovator_name: "Prof. Michael Green",
      innovator_desc: "Materials Science Expert & Renewable Energy Researcher",
      innovator_email: "michael.green@example.com",
      pdf: "/dummy-pdfs/energy-storage.pdf",
      is_upcomming: true,
      status: "approved",
      created_at: "2026-08-15T14:20:00Z",
      rejection_reason: null,
      view_count: 234,
      category: "Energy"
    },
    {
      id: 3,
      page_title: "Blockchain Supply Chain Solution",
      title: "Transparent Supply Chain Management Using Blockchain",
      description: "A blockchain platform that ensures transparency and traceability in supply chains",
      long_description: "<p>This innovation presents a comprehensive blockchain-based platform for supply chain management. The system provides end-to-end traceability, reduces fraud, and improves operational efficiency.</p><p>Key features include smart contracts for automated payments, real-time tracking, and immutable record-keeping. Major corporations have shown interest in implementing this solution to improve their supply chain transparency.</p>",
      image_video: "https://www.youtube.com/watch?v=abc123xyz",
      image_alt_tag: "Blockchain Supply Chain Visualization",
      innovator_name: "Alex Rivera",
      innovator_desc: "Blockchain Developer & Supply Chain Specialist",
      innovator_email: "alex.rivera@example.com",
      pdf: null,
      is_upcomming: false,
      status: "rejected",
      created_at: "2026-08-10T09:45:00Z",
      rejection_reason: "The technical implementation details are unclear. Please provide more specific information about the blockchain architecture and scalability solutions.",
      view_count: 0,
      category: "Technology"
    },
    {
      id: 4,
      page_title: "Water Purification Innovation",
      title: "Solar-Powered Water Purification System",
      description: "An affordable solar-powered system that purifies water in developing regions",
      long_description: "<p>This innovation introduces a low-cost solar-powered water purification system designed for developing regions. The system uses solar energy to purify water through a combination of filtration and UV treatment.</p><p>Capable of purifying 1000 liters per day, the system is designed to be easily maintainable and uses locally available materials. It addresses the critical need for clean drinking water in underserved communities.</p>",
      image_video: "/dummy-images/water-purification.jpg",
      image_alt_tag: "Solar Water Purification System",
      innovator_name: "Dr. Emily Watson",
      innovator_desc: "Environmental Engineer & Social Entrepreneur",
      innovator_email: "emily.watson@example.com",
      pdf: "/dummy-pdfs/water-purification.pdf",
      is_upcomming: false,
      status: "pending",
      created_at: "2026-08-18T16:00:00Z",
      rejection_reason: null,
      view_count: 0,
      category: "Environment"
    },
    {
      id: 5,
      page_title: "Smart Agriculture Drones",
      title: "AI-Powered Drones for Precision Agriculture",
      description: "Autonomous drones that monitor crop health and optimize farming practices",
      long_description: "<p>This innovation presents autonomous drones equipped with AI capabilities for precision agriculture. The drones monitor crop health, detect diseases early, and optimize irrigation and fertilization.</p><p>The system uses computer vision and machine learning to analyze crop conditions and provide actionable insights to farmers. Initial trials have shown a 30% increase in crop yield and 40% reduction in water usage.</p>",
      image_video: "https://www.youtube.com/watch?v=def456uvw",
      image_alt_tag: "Agriculture Drones in Action",
      innovator_name: "Dr. Raj Patel",
      innovator_desc: "Agricultural Engineer & Drone Technology Expert",
      innovator_email: "raj.patel@example.com",
      pdf: null,
      is_upcomming: true,
      status: "pending",
      created_at: "2026-08-22T11:15:00Z",
      rejection_reason: null,
      view_count: 0,
      category: "Agriculture"
    },
    {
      id: 6,
      page_title: "Mental Health App",
      title: "AI-Powered Mental Health Support Platform",
      description: "An innovative platform providing personalized mental health support using AI",
      long_description: "<p>This innovation introduces an AI-powered mental health support platform that provides personalized therapy recommendations, mood tracking, and 24/7 support.</p><p>The platform uses natural language processing and machine learning to understand user needs and provide appropriate interventions. Early studies show significant improvement in user well-being and reduced symptoms of anxiety and depression.</p>",
      image_video: "/dummy-images/mental-health-app.jpg",
      image_alt_tag: "Mental Health Support Platform",
      innovator_name: "Lisa Park",
      innovator_desc: "Clinical Psychologist & Digital Health Innovator",
      innovator_email: "lisa.park@example.com",
      pdf: "/dummy-pdfs/mental-health-app.pdf",
      is_upcomming: false,
      status: "approved",
      created_at: "2026-08-12T13:30:00Z",
      rejection_reason: null,
      view_count: 156,
      category: "Health"
    }
  ];

  // Fetch submitted innovations
  const fetchSubmittedInnovations = async () => {
    try {
      setLoading(true);
      
      if (useDummyData) {
        setTimeout(() => {
          setSubmittedInnovations(dummyInnovations);
          setFilteredInnovations(dummyInnovations);
          updateStats(dummyInnovations);
          setLoading(false);
        }, 800);
        return;
      }

      const response = await axios.get(`${API_URL}api/admin/user-submitted-innovations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      });

      if (response.status === 200) {
        const innovations = response.data.data || [];
        setSubmittedInnovations(innovations);
        setFilteredInnovations(innovations);
        updateStats(innovations);
      } else {
        toast.error(response.data.message || "Failed to fetch submitted innovations");
        setSubmittedInnovations(dummyInnovations);
        setFilteredInnovations(dummyInnovations);
        updateStats(dummyInnovations);
      }
    } catch (error) {
      console.error("Error fetching submitted innovations:", error);
      toast.error(error.response?.data?.message || "Failed to fetch submitted innovations. Showing sample data.");
      setSubmittedInnovations(dummyInnovations);
      setFilteredInnovations(dummyInnovations);
      updateStats(dummyInnovations);
    } finally {
      setLoading(false);
    }
  };

  // Update statistics
  const updateStats = (innovations) => {
    const pending = innovations.filter(i => i.status === 'pending' || !i.status).length;
    const approved = innovations.filter(i => i.status === 'approved').length;
    const rejected = innovations.filter(i => i.status === 'rejected').length;
    
    setStats({
      total: innovations.length,
      pending,
      approved,
      rejected,
    });
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = submittedInnovations;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(innovation => 
        (innovation.status || 'pending') === statusFilter
      );
    }
    
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(innovation =>
        innovation.page_title?.toLowerCase().includes(searchLower) ||
        innovation.title?.toLowerCase().includes(searchLower) ||
        innovation.innovator_name?.toLowerCase().includes(searchLower) ||
        innovation.innovator_email?.toLowerCase().includes(searchLower) ||
        innovation.category?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredInnovations(filtered);
  }, [searchTerm, statusFilter, submittedInnovations]);

  // Handle view innovation details
  const handleViewDetails = (innovation) => {
    setSelectedInnovation(innovation);
    setShowModal(true);
  };

  // Handle apply/approve innovation
  const handleApprove = async (innovationId) => {
    if (!window.confirm("Are you sure you want to approve this innovation? It will be published on the site.")) {
      return;
    }
    
    setActionLoading(true);

    if (useDummyData) {
      setTimeout(() => {
        const updatedInnovations = submittedInnovations.map(innovation => 
          innovation.id === innovationId ? { ...innovation, status: 'approved' } : innovation
        );
        setSubmittedInnovations(updatedInnovations);
        setFilteredInnovations(updatedInnovations);
        updateStats(updatedInnovations);
        toast.success("Innovation approved successfully!");
        setShowModal(false);
        setActionLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}api/admin/user-submitted-innovations/${innovationId}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Innovation approved successfully!");
        fetchSubmittedInnovations();
        setShowModal(false);
      } else {
        toast.error(response.data.message || "Failed to approve innovation");
      }
    } catch (error) {
      console.error("Error approving innovation:", error);
      toast.error(error.response?.data?.message || "Failed to approve innovation");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle reject innovation
  const handleReject = async (innovationId) => {
    const reason = window.prompt("Please enter a reason for rejection (optional):");
    
    setActionLoading(true);

    if (useDummyData) {
      setTimeout(() => {
        const updatedInnovations = submittedInnovations.map(innovation => 
          innovation.id === innovationId ? { 
            ...innovation, 
            status: 'rejected', 
            rejection_reason: reason || "Does not meet our innovation criteria" 
          } : innovation
        );
        setSubmittedInnovations(updatedInnovations);
        setFilteredInnovations(updatedInnovations);
        updateStats(updatedInnovations);
        toast.success("Innovation rejected successfully!");
        setShowModal(false);
        setActionLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await axios.put(
        `${API_URL}api/admin/user-submitted-innovations/${innovationId}/reject`,
        { reason: reason || "Does not meet our innovation criteria" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Innovation rejected successfully!");
        fetchSubmittedInnovations();
        setShowModal(false);
      } else {
        toast.error(response.data.message || "Failed to reject innovation");
      }
    } catch (error) {
      console.error("Error rejecting innovation:", error);
      toast.error(error.response?.data?.message || "Failed to reject innovation");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle update innovation (redirect to edit page)
  const handleUpdate = (innovationId) => {
    if (useDummyData) {
      toast.info("Update functionality will be available with real API integration");
      return;
    }
    window.location.href = `/innovation/edit/${innovationId}`;
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

  // Get media type
  const getMediaType = (url) => {
    if (!url) return { type: 'none', icon: faImage };
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return { type: 'youtube', icon: faImage, color: 'text-red-600' };
    }
    return { type: 'image', icon: faImage, color: 'text-blue-600' };
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
    fetchSubmittedInnovations();
    toast.info(`Switched to ${!useDummyData ? 'dummy' : 'real'} data mode`);
  };

  useEffect(() => {
    fetchSubmittedInnovations();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Submitted Innovations</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage innovations submitted by users</p>
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
            placeholder="Search by title, innovator..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 w-full transition-all duration-300"
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
                Innovator
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-2">
                Media
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
            {filteredInnovations.length > 0 ? (
              filteredInnovations.map((innovation, index) => {
                const mediaInfo = getMediaType(innovation.image_video);
                return (
                  <tr key={innovation.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                      #{index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 border-2">
                      <div>
                        <div className="max-w-xs truncate font-semibold">
                          {innovation.page_title || 'Untitled'}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {innovation.title || ''}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                      <div>
                        <div className="font-medium">{innovation.innovator_name || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{innovation.innovator_email || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                        {innovation.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                      <FontAwesomeIcon 
                        icon={mediaInfo.icon} 
                        className={`w-5 h-5 ${mediaInfo.color || 'text-gray-400'}`}
                      />
                      <span className="ml-1 text-xs capitalize">{mediaInfo.type}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap border-2">
                      {getStatusBadge(innovation.status)}
                      {innovation.is_upcomming && (
                        <span className="ml-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                      {formatDate(innovation.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-2">
                      <button
                        onClick={() => handleViewDetails(innovation)}
                        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded transition-colors duration-300"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-sm text-gray-500">
                  <div className="flex flex-col items-center">
                    <FontAwesomeIcon icon={faLightbulb} className="text-4xl text-amber-400 mb-2" />
                    <p className="font-medium">No submitted innovations found</p>
                    <p className="text-xs text-gray-400 mt-1">No innovations match your search criteria</p>
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
          Showing {filteredInnovations.length > 0 ? 1 : 0} to {filteredInnovations.length} of {submittedInnovations.length} rows
        </div>
      </div>

      {/* View Details Modal */}
      {showModal && selectedInnovation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Innovation Details</h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-sm text-gray-500">Status:</span>
                  {getStatusBadge(selectedInnovation.status)}
                  {selectedInnovation.is_upcomming && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      🚀 Upcoming
                    </span>
                  )}
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
              {/* Media */}
              {selectedInnovation.image_video && (
                <div className="mb-6">
                  {getMediaType(selectedInnovation.image_video).type === 'youtube' ? (
                    <div className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden shadow-md">
                      <iframe
                        src={`https://www.youtube.com/embed/${selectedInnovation.image_video.split('v=')[1]?.split('&')[0]}`}
                        className="absolute top-0 left-0 w-full h-full"
                        allowFullScreen
                        title="Innovation Video"
                      />
                    </div>
                  ) : (
                    <img
                      src={selectedInnovation.image_video.startsWith('http') ? selectedInnovation.image_video : `${STORAGE_URL}${selectedInnovation.image_video}`}
                      alt={selectedInnovation.image_alt_tag || selectedInnovation.page_title}
                      className="w-full max-h-80 object-cover rounded-lg shadow-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/1200x800/amber/ffffff?text=Innovation+Image';
                      }}
                    />
                  )}
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Page Title</label>
                  <p className="text-lg font-medium text-gray-900">{selectedInnovation.page_title || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Content Title</label>
                  <p className="text-lg font-medium text-gray-900">{selectedInnovation.title || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                  <p className="text-gray-900">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      {selectedInnovation.category || 'Uncategorized'}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Media Type</label>
                  <p className="text-gray-900 capitalize">
                    {getMediaType(selectedInnovation.image_video).type}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Innovator Name</label>
                  <p className="text-gray-900 font-medium">{selectedInnovation.innovator_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Innovator Email</label>
                  <p className="text-gray-900">{selectedInnovation.innovator_email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Submitted Date</label>
                  <p className="text-gray-900">{formatDate(selectedInnovation.created_at)}</p>
                </div>
                {selectedInnovation.view_count > 0 && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Views</label>
                    <p className="text-gray-900">{selectedInnovation.view_count}</p>
                  </div>
                )}
                {selectedInnovation.pdf && (
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase">PDF Attachment</label>
                    <div className="mt-1">
                      <a
                        href={selectedInnovation.pdf.startsWith('http') ? selectedInnovation.pdf : `${STORAGE_URL}${selectedInnovation.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-amber-600 hover:text-amber-800"
                      >
                        <FontAwesomeIcon icon={faFilePdf} className="mr-2 text-red-500" />
                        <span>View PDF Document</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Innovator Description */}
              {selectedInnovation.innovator_desc && (
                <div className="mb-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Innovator Bio</label>
                  <p className="text-gray-700 mt-1">{selectedInnovation.innovator_desc}</p>
                </div>
              )}

              {/* Description */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">Short Description</label>
                <p className="text-gray-700 mt-1">{selectedInnovation.description || 'No description provided'}</p>
              </div>

              {/* Long Description */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-gray-500 uppercase">Detailed Content</label>
                <div 
                  className="text-gray-700 mt-1 prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedInnovation.long_description || 'No content provided' }}
                />
              </div>

              {/* Action Buttons */}
              {(selectedInnovation.status === 'pending' || !selectedInnovation.status) && (
                <div className="border-t border-gray-200 pt-4 mt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => handleApprove(selectedInnovation.id)}
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
                    onClick={() => handleReject(selectedInnovation.id)}
                    disabled={actionLoading}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleUpdate(selectedInnovation.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300 flex items-center"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Update
                  </button>
                </div>
              )}

              {selectedInnovation.status === 'approved' && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button
                    onClick={() => handleUpdate(selectedInnovation.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-300"
                  >
                    Update Innovation
                  </button>
                </div>
              )}

              {selectedInnovation.status === 'rejected' && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Rejection Reason:</span> {selectedInnovation.rejection_reason || 'No reason provided'}
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

export default UserSubmitInnovation;