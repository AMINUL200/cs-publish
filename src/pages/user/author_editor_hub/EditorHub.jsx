import React, { useState, useEffect } from "react";
import axios from "axios";
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
  BookOpen
} from "lucide-react";

const EditorHub = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [filteredEditors, setFilteredEditors] = useState([]);

  // Fetch editors data
  const fetchEditors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/editor-hub`);
      
      if (response.data.status) {
        const editorsData = response.data.data;
        setEditors(editorsData);
        
        // Set first journal as default selection
        if (editorsData.length > 0) {
          const firstJournal = editorsData[0].j_title;
          setSelectedJournal(firstJournal);
          setFilteredEditors(editorsData.filter(editor => editor.j_title === firstJournal));
        }
      } else {
        throw new Error("Failed to fetch editors data");
      }
    } catch (error) {
      console.error("Error fetching editors:", error);
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEditors();
  }, []);

  // Get unique journals
  const uniqueJournals = [...new Set(editors.map(editor => editor.j_title))];

  // Handle journal selection
  const handleJournalSelect = (journalTitle) => {
    setSelectedJournal(journalTitle);
    const filtered = editors.filter(editor => editor.j_title === journalTitle);
    setFilteredEditors(filtered);
  };

  // Function to get initials for avatar
  const getInitials = (email) => {
    if (!email) return 'ED';
    return email.substring(0, 2).toUpperCase();
  };

  // Function to get random background color for avatar
  const getAvatarColor = (id) => {
    const colors = [
      'bg-yellow-500',
      'bg-red-700',
      'bg-black',
      'bg-yellow-600',
      'bg-red-800',
      'bg-gray-900'
    ];
    return colors[id % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12 sm:py-26">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Editor Hub</h1>
            <p className="text-lg text-gray-600">Loading our editorial team...</p>
          </div>
          <div className="space-y-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8 animate-pulse">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/3 flex justify-center">
                    <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="lg:w-2/3 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Editors</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchEditors}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-50 py-12 sm:py-26">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Editor <span className="text-yellow-600">Hub</span>
          </h1>
          <h5 className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet our dedicated editorial team who ensure the quality and integrity 
            of our publications through their expertise and commitment.
          </h5>
        </div>

        {editors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Editors Found</h3>
            <p className="text-gray-500">There are currently no editors to display.</p>
          </div>
        ) : (
          <>
            {/* Journal Selection */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Select Journal
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {uniqueJournals.map((journal, index) => (
                  <button
                    key={index}
                    onClick={() => handleJournalSelect(journal)}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
                      selectedJournal === journal
                        ? 'bg-yellow-500 text-black shadow-lg'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{journal}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Journal Info */}
            {selectedJournal && (
              <div className="mb-8 text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedJournal}
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto">
                  {editors.find(editor => editor.j_title === selectedJournal)?.j_description || 
                   "Leading journal in its field with dedicated editorial team."}
                </p>
              </div>
            )}

            {/* Editors Grid */}
            <div className="space-y-8">
              {filteredEditors.map((editor) => (
                <div
                  key={editor.id}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Left Side - Editor Image and Basic Info */}
                    <div className="lg:w-1/3 bg-gradient-to-b from-yellow-500 to-red-700 p-8 text-white">
                      <div className="flex flex-col items-center text-center h-full justify-center">
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 ${getAvatarColor(editor.id)}`}>
                          {/* {getInitials(editor.email)} */}
                          <img src={`${STORAGE_URL}${editor.image}`} alt="" className="w-full h-full rounded-full" />
                        </div>
                        
                        <h3 className="text-2xl font-bold mb-2">
                          Editor {editor.user_id}
                        </h3>
                        <p className="text-yellow-100 opacity-90 mb-4">{editor.email}</p>
                        
                        {/* Journal Info */}
                        <div className="mt-6 p-4 bg-black bg-opacity-20 rounded-lg">
                          <BookOpen className="w-6 h-6 mx-auto mb-2" />
                          <div className="text-sm font-semibold">{editor.j_title}</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Editor Details */}
                    <div className="lg:w-2/3 p-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-900 text-lg border-b-2 border-yellow-500 pb-2">
                            Contact Information
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 text-gray-700">
                              <Mail className="w-5 h-5 text-yellow-600" />
                              <span className="text-sm">{editor.email}</span>
                            </div>
                            
                            {editor.phone && (
                              <div className="flex items-center space-x-3 text-gray-700">
                                <Phone className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm">{editor.phone}</span>
                              </div>
                            )}

                            {(editor.country || editor.city) && (
                              <div className="flex items-center space-x-3 text-gray-700">
                                <MapPin className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm">
                                  {[editor.city, editor.country].filter(Boolean).join(', ')}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Professional Information */}
                        <div className="space-y-4">
                          <h4 className="font-bold text-gray-900 text-lg border-b-2 border-red-700 pb-2">
                            Professional Info
                          </h4>
                          <div className="space-y-3">
                            {editor.designation && (
                              <div className="flex items-center space-x-3 text-gray-700">
                                <Briefcase className="w-5 h-5 text-red-700" />
                                <span className="text-sm font-medium">{editor.designation}</span>
                              </div>
                            )}

                            {editor.university && (
                              <div className="flex items-center space-x-3 text-gray-700">
                                <Building className="w-5 h-5 text-red-700" />
                                <span className="text-sm">{editor.university}</span>
                              </div>
                            )}

                            {editor.qualification && (
                              <div className="flex items-center space-x-3 text-gray-700">
                                <GraduationCap className="w-5 h-5 text-red-700" />
                                <span className="text-sm">{editor.qualification}</span>
                              </div>
                            )}

                            {editor.speciality && (
                              <div className="flex items-center space-x-3 text-gray-700">
                                <User className="w-5 h-5 text-red-700" />
                                <span className="text-sm">Specialty: {editor.speciality}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Additional Information */}
                        <div className="lg:col-span-2 space-y-4">
                          <h4 className="font-bold text-gray-900 text-lg border-b-2 border-black pb-2">
                            Additional Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {editor.affiliation && (
                              <div className="flex items-start space-x-3 text-gray-700">
                                <Globe className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                                <div>
                                  <strong className="text-sm">Affiliation:</strong>
                                  <p className="text-sm mt-1">{editor.affiliation}</p>
                                </div>
                              </div>
                            )}

                            {editor.awards && (
                              <div className="flex items-start space-x-3 text-gray-700">
                                <Award className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                                <div>
                                  <strong className="text-sm">Awards:</strong>
                                  <p className="text-sm mt-1">{editor.awards}</p>
                                </div>
                              </div>
                            )}

                            {editor.society_memberships && (
                              <div className="flex items-start space-x-3 text-gray-700 md:col-span-2">
                                <User className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                                <div>
                                  <strong className="text-sm">Society Memberships:</strong>
                                  <p className="text-sm mt-1">{editor.society_memberships}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* About Section */}
                        {editor.about && (
                          <div className="lg:col-span-2 space-y-4">
                            <h4 className="font-bold text-gray-900 text-lg border-b-2 border-yellow-500 pb-2">
                              About
                            </h4>
                            <p className="text-gray-600 leading-relaxed">{editor.about}</p>
                          </div>
                        )}

                        {/* External Links */}
                        {/* <div className="lg:col-span-2 flex space-x-4 pt-4 border-t border-gray-200">
                          {editor.google_scroler && (
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
                          
                          {editor.orcid_link && (
                            <a
                              href={editor.orcid_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                            >
                              <User className="w-4 h-4" />
                              <span>ORCID</span>
                            </a>
                          )}
                        </div> */}
                      </div>
                    </div>
                  </div>

                  {/* Footer Accent */}
                  <div className="h-2 bg-gradient-to-r from-yellow-500 via-red-700 to-black"></div>
                </div>
              ))}
            </div>

           
          </>
        )}
      </div>
    </div>
  );
};

export default EditorHub;