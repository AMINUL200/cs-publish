import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import Breadcrumb from "../../../components/common/Breadcrumb";

const ListOfArchive = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);

  const [archives, setArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJournal, setSelectedJournal] = useState("all");
  const [uniqueJournals, setUniqueJournals] = useState([]);

  useEffect(() => {
    fetchArchives();
  }, []);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/archive/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.flag === 1) {
        const archivesData = response.data.data;
        setArchives(archivesData);
        setFilteredArchives(archivesData);

        // Extract unique journals for filter
        const journals = [
          ...new Set(archivesData.map((archive) => archive.journal.j_title)),
        ];
        setUniqueJournals(journals);
      }
    } catch (err) {
      setError("Failed to fetch archives. Please try again.");
      console.error("Error fetching archives:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleJournalFilter = (journalTitle) => {
    setSelectedJournal(journalTitle);
    if (journalTitle === "all") {
      setFilteredArchives(archives);
    } else {
      const filtered = archives.filter(
        (archive) => archive.journal.j_title === journalTitle
      );
      setFilteredArchives(filtered);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Loading archives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-200 max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-gray-800 mb-6">{error}</p>
          <button
            onClick={fetchArchives}
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "List Of Issue" },
        ]}
        pageTitle="List Of Issue"
      />
      <div className="min-h-screen bg-gradient-to-br bg-white py-8  px-4 sm:px-6 lg:px-8">
      

        {/* Filter Section */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-amber-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="journal-filter"
                  className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  Filter by Journal:
                </label>
                <select
                  id="journal-filter"
                  value={selectedJournal}
                  onChange={(e) => handleJournalFilter(e.target.value)}
                  className="px-4 py-2 border border-amber-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
                >
                  <option value="all">All Journals</option>
                  {uniqueJournals.map((journal, index) => (
                    <option key={index} value={journal}>
                      {journal}
                    </option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredArchives.length} volume
                {filteredArchives.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {/* Archives Grid */}
        <div className="max-w-7xl mx-auto">
          {filteredArchives.length === 0 ? (
            <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No Archives Found
              </h3>
              <p className="text-gray-600">
                Try selecting a different journal filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArchives.map((archive) => (
                <div
                  key={archive.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-200 hover:border-amber-400"
                >
                  {/* Volume Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={archive.volume.image}
                      alt={`Volume ${archive.volume.volume}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Vol. {archive.volume.volume}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Journal Title */}
                    <div className="mb-4">
                      <span className="inline-block bg-gradient-to-r from-amber-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                        {archive.journal.j_title}
                      </span>
                    </div>

                    {/* Volume Details */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Issue
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          {archive.volume.issue_no}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Pages
                        </span>
                        <span className="text-lg font-semibold text-amber-700">
                          {archive.volume.page_no}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          Period
                        </span>
                        <span className="text-sm text-gray-700">
                          {formatDate(archive.volume.from_date)} -{" "}
                          {formatDate(archive.volume.to_date)}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    {/* <div className="mt-6 pt-4 border-t border-amber-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        archive.volume.status === 'close' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {archive.volume.status === 'close' ? 'Closed' : 'Active'}
                      </span>
                    </div>
                  </div> */}

                    {/* Action Button */}
                    <button className="w-full mt-6 bg-gradient-to-r custom-btn cursor-pointer py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListOfArchive;
