import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  User,
  GraduationCap,
  Building,
  Award,
  Briefcase,
  Globe,
  BookOpen,
  Home,
  FileText,
  Map,
  Globe as GlobeIcon,
  Calendar,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

const EditorInfo = () => {
  const { editorId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const [editor, setEditor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch editor data
  const fetchEditor = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}api/editor-detals/${editorId}`);
      
      if (response.data.status) {
        setEditor(response.data.data);
      } else {
        throw new Error("Failed to fetch editor data");
      }
    } catch (error) {
      console.error("Error fetching editor:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editorId) {
      fetchEditor();
    }
  }, [editorId]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Function to get random background color
  const getAvatarColor = (id) => {
    const colors = [
      "bg-yellow-500",
      "bg-red-700",
      "bg-black",
      "bg-yellow-600",
      "bg-red-800",
      "bg-gray-900"
    ];
    return colors[id % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12 sm:py-26">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              onClick={() => navigate(-1)}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back 
            </Link>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Editor Profile</h1>
            <p className="text-lg text-gray-600">Loading editor information...</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/3 flex justify-center">
                <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
              </div>
              <div className="lg:w-2/3 space-y-6">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 flex items-center justify-center py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="mb-8">
            <Link
                 onClick={() => navigate(-1)}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back 
            </Link>
          </div>
          
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Editor</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchEditor}
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors flex items-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
               onClick={() => navigate(-1)}
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back 
            </Link>
          </div>
          
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">👤</div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">Editor Not Found</h3>
            <p className="text-gray-500">The editor you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12 sm:py-26">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back 
          </Link>
        </div>

        {/* Editor Profile Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Header Banner */}
          <div className="h-4 bg-gradient-to-r from-yellow-500 via-red-700 to-black"></div>

          <div className="flex flex-col lg:flex-row">
            {/* Left Column - Profile Image & Basic Info */}
            <div className="lg:w-1/3 bg-gradient-to-b from-yellow-500 to-red-700 p-8 text-white">
              <div className="flex flex-col items-center text-center h-full">
                {/* Profile Image */}
                <div className={`w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6 ${getAvatarColor(editor.id)}`}>
                  {editor.image ? (
                    <img
                      src={`${STORAGE_URL}${editor.image}`}
                      alt={`${editor.first_name} ${editor.last_name}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentElement.classList.add("flex", "items-center", "justify-center");
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                      {editor.first_name?.[0] || "E"}
                    </div>
                  )}
                </div>

                {/* Name and Title */}
                <h1 className="text-3xl font-bold mb-2">
                  {editor.title} {editor.first_name} {editor.last_name}
                </h1>
                <p className="text-yellow-100 opacity-90 mb-1">Editor ID: {editor.user_id}</p>
                <p className="text-yellow-100 opacity-90 mb-6">{editor.email}</p>

                {/* Gender and Member Since */}
                <div className="space-y-3 w-full">
                  {editor.gender && (
                    <div className="flex items-center justify-center space-x-2 bg-black bg-opacity-20 p-3 rounded-lg">
                      <User className="w-5 h-5" />
                      <span className="font-medium">{editor.gender}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center space-x-2 bg-black bg-opacity-20 p-3 rounded-lg">
                    <Calendar className="w-5 h-5" />
                    <div className="text-center">
                      <div className="text-sm opacity-80">Member Since</div>
                      <div className="font-medium">{formatDate(editor.created_at)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Information */}
            <div className="lg:w-2/3 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg border-b-2 border-yellow-500 pb-2 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3 text-gray-700">
                      <Mail className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <strong className="text-sm block mb-1">Email</strong>
                        <span className="text-sm break-all">{editor.email}</span>
                      </div>
                    </div>
                    
                    {editor.phone && (
                      <div className="flex items-start space-x-3 text-gray-700">
                        <Phone className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-sm block mb-1">Phone</strong>
                          <span className="text-sm">{editor.phone}</span>
                        </div>
                      </div>
                    )}

                    {editor.landline && (
                      <div className="flex items-start space-x-3 text-gray-700">
                        <Phone className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-sm block mb-1">Landline</strong>
                          <span className="text-sm">{editor.landline}</span>
                        </div>
                      </div>
                    )}

                    {editor.address && (
                      <div className="flex items-start space-x-3 text-gray-700">
                        <Home className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-sm block mb-1">Address</strong>
                          <span className="text-sm">{editor.address}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location Information */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg border-b-2 border-red-700 pb-2 flex items-center">
                    <Map className="w-5 h-5 mr-2" />
                    Location
                  </h4>
                  <div className="space-y-3">
                    {editor.country && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <GlobeIcon className="w-5 h-5 text-red-700" />
                        <div>
                          <strong className="text-sm block mb-1">Country</strong>
                          <span className="text-sm">{editor.country}</span>
                        </div>
                      </div>
                    )}

                    {editor.city && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-red-700" />
                        <div>
                          <strong className="text-sm block mb-1">City</strong>
                          <span className="text-sm">{editor.city}</span>
                        </div>
                      </div>
                    )}

                    {editor.zip && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <MapPin className="w-5 h-5 text-red-700" />
                        <div>
                          <strong className="text-sm block mb-1">ZIP Code</strong>
                          <span className="text-sm">{editor.zip}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Education & Qualification */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg border-b-2 border-black pb-2 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Education & Qualification
                  </h4>
                  <div className="space-y-3">
                    {editor.qualification && (
                      <div className="flex items-start space-x-3 text-gray-700">
                        <GraduationCap className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-sm block mb-1">Qualification</strong>
                          <span className="text-sm">{editor.qualification}</span>
                        </div>
                      </div>
                    )}

                    {editor.university && (
                      <div className="flex items-start space-x-3 text-gray-700">
                        <Building className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-sm block mb-1">University</strong>
                          <span className="text-sm">{editor.university}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Professional Details */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg border-b-2 border-yellow-600 pb-2 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2" />
                    Professional Details
                  </h4>
                  <div className="space-y-3">
                    {editor.designation && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Briefcase className="w-5 h-5 text-yellow-600" />
                        <div>
                          <strong className="text-sm block mb-1">Designation</strong>
                          <span className="text-sm">{editor.designation}</span>
                        </div>
                      </div>
                    )}

                    {editor.affiliation && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Building className="w-5 h-5 text-yellow-600" />
                        <div>
                          <strong className="text-sm block mb-1">Affiliation</strong>
                          <span className="text-sm">{editor.affiliation}</span>
                        </div>
                      </div>
                    )}

                    {editor.speciality && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <User className="w-5 h-5 text-yellow-600" />
                        <div>
                          <strong className="text-sm block mb-1">Speciality</strong>
                          <span className="text-sm">{editor.speciality}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Awards & Memberships */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="font-bold text-gray-900 text-lg border-b-2 border-red-800 pb-2 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Awards & Memberships
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {editor.awards && editor.awards !== "null" && (
                      <div className="flex items-start space-x-3 text-gray-700">
                        <Award className="w-5 h-5 text-red-800 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-sm block mb-1">Awards & Honors</strong>
                          <p className="text-sm mt-1">{editor.awards}</p>
                        </div>
                      </div>
                    )}

                    {editor.society_memberships && editor.society_memberships !== "null" && (
                      <div className="flex items-start space-x-3 text-gray-700">
                        <User className="w-5 h-5 text-red-800 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-sm block mb-1">Society Memberships</strong>
                          <p className="text-sm mt-1">{editor.society_memberships}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* About Section */}
                {editor.about && (
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="font-bold text-gray-900 text-lg border-b-2 border-black pb-2">
                      About
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-justify">{editor.about}</p>
                  </div>
                )}

                {/* Resume & Links */}
                <div className="lg:col-span-2 pt-6 border-t border-gray-200">
                  <div className="flex flex-wrap gap-4">
                    {editor.resume && editor.resume !== "null" && (
                      <a
                        href={`${API_URL}${editor.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 border border-yellow-200"
                      >
                        <FileText className="w-4 h-4" />
                        <span>View Resume/CV</span>
                      </a>
                    )}
                    
                    {editor.google_scroler && editor.google_scroler !== "null" && (
                      <a
                        href={editor.google_scroler}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <Globe className="w-4 h-4" />
                        <span>Google Scholar</span>
                      </a>
                    )}
                    
                    {editor.orcid_link && editor.orcid_link !== "null" && (
                      <a
                        href={editor.orcid_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <User className="w-4 h-4" />
                        <span>ORCID Profile</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Accent */}
          <div className="h-2 bg-gradient-to-r from-yellow-500 via-red-700 to-black"></div>
        </div>

        {/* Last Updated Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Last updated: {formatDate(editor.updated_at)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorInfo;