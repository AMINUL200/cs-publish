import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserSideOpenAccessPolicy = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [openAccessPolicies, setOpenAccessPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch open access policies data
  const fetchOpenAccessPolicies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/open-access-policy`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.status) {
        const data = response.data.data;
        // Sort by journal title in ascending order
        const sortedData = data.sort((a, b) => 
          a.journal.j_title.localeCompare(b.journal.j_title)
        );
        setOpenAccessPolicies(sortedData);
        setFilteredPolicies(sortedData);
        
        // Select first journal by default
        if (sortedData.length > 0) {
          setSelectedJournal(sortedData[0]);
        }
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch open access policies';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle journal selection
  const handleJournalSelect = (journalId) => {
    const selected = openAccessPolicies.find(item => item.journal_id === journalId);
    setSelectedJournal(selected);
  };

  // Filter journals by search
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredPolicies(openAccessPolicies);
      return;
    }
    
    const filtered = openAccessPolicies.filter(item =>
      item.journal.j_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPolicies(filtered);
    
    if (filtered.length > 0 && !filtered.find(item => item.journal_id === selectedJournal?.journal_id)) {
      setSelectedJournal(filtered[0]);
    }
  };

  useEffect(() => {
    fetchOpenAccessPolicies();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-800 text-lg">Loading open access policies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <svg className="w-12 h-12 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold mb-2">Error Loading Content</p>
            <p className="mb-4">{error}</p>
            <button 
              onClick={fetchOpenAccessPolicies}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 py-12 sm:py-26">
      {/* Header Section */}
      <div className="bg-yellow-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Open Access Policies</h1>
            <p className="text-amber-100 text-lg md:text-xl">
              Comprehensive open access policies for all our journals
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Journal List */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
              {/* Search Box */}
              <div className="p-6 border-b border-amber-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search journals..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50 text-gray-800 placeholder-amber-600"
                  />
                  <svg className="absolute left-3 top-3.5 w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Journal List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredPolicies.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No journals found matching your search</p>
                  </div>
                ) : (
                  <div className="divide-y divide-amber-100">
                    {filteredPolicies.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleJournalSelect(item.journal_id)}
                        className={`w-full text-left p-6 transition-all duration-200 hover:bg-amber-50 ${
                          selectedJournal?.journal_id === item.journal_id 
                            ? 'bg-amber-100 border-r-4 border-amber-600' 
                            : 'bg-white'
                        }`}
                      >
                        <div className="flex items-start space-x-4">
                          <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 ${
                            selectedJournal?.journal_id === item.journal_id 
                              ? 'bg-yellow-600' 
                              : 'bg-amber-300'
                          }`}></div>
                          <div className="flex-1">
                            <h3 className={`font-semibold text-lg mb-1 ${
                              selectedJournal?.journal_id === item.journal_id 
                                ? 'text-amber-800' 
                                : 'text-gray-800'
                            }`}>
                              {item.journal.j_title}
                            </h3>
                            <p className={`text-sm ${
                              selectedJournal?.journal_id === item.journal_id 
                                ? 'text-amber-600' 
                                : 'text-gray-600'
                            }`}>
                              Click to view open access policy
                            </p>
                          </div>
                          {selectedJournal?.journal_id === item.journal_id && (
                            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content - Open Access Policy Details */}
          <div className="lg:w-2/3">
            {selectedJournal ? (
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
                {/* Journal Header */}
                <div className="bg-gradient-to-r from-black to-yellow-600 text-white p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        {selectedJournal.journal.j_title}
                      </h2>
                      <p className="text-amber-100 opacity-90">
                        Open Access Policy & Guidelines
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Title */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-amber-200">
                      {selectedJournal.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="prose max-w-none">
                    <div 
                      className="blog-rich-text leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: selectedJournal.long_description }}
                    />
                  </div>

                  {/* Additional Info */}
                  <div className="mt-8 pt-6 border-t border-amber-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Last Updated
                        </h4>
                        <p className="text-amber-700">
                          {new Date(selectedJournal.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                        <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                          Page Type
                        </h4>
                        <p className="text-red-700 capitalize">
                          {selectedJournal.pages.replace(/_/g, ' ')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Journal Selected</h3>
                <p className="text-gray-600 mb-4">Please select a journal from the list to view its open access policy.</p>
                <button 
                  onClick={() => filteredPolicies.length > 0 && handleJournalSelect(filteredPolicies[0].journal_id)}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Select First Journal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSideOpenAccessPolicy;