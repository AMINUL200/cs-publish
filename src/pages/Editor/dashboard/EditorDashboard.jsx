import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faUserEdit, faUsers, faChartBar, faInbox, faCog, faSignOutAlt, faBell, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';

const EditorDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const API_URL = import.meta.env.VITE_API_URL;
  const [reviewers, setReviewers] = useState([]);
  const [manuscripts, setManuscripts] = useState([]);
  const [selectedManuscript, setSelectedManuscript] = useState('');
  const [selectedReviewer, setSelectedReviewer] = useState('');
    const [assignLoading, setAssignLoading] = useState(false);
  const [loading, setLoading] = useState(true);



  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/permission/editor`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        const { reviewer, manuscripts } = response.data.data;
        console.log(response.data);
        

        setReviewers(reviewer || []);
        setManuscripts(manuscripts || []);
      } else {
        toast.error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching reviewer permissions:", error);
      toast.error(error.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAssignReviewer = async () => {
    if (!selectedManuscript || !selectedReviewer) {
      toast.warning("Please select both a manuscript and a reviewer");
      return;
    }
    console.log(`manuId:: ${selectedManuscript} :: revId :: ${selectedReviewer}`);

    try {
      setAssignLoading(true);
      
      const response = await axios.post(
        `${API_URL}api/permission/editor`,
        {
          manuscript_id: selectedManuscript,
          reviewer_id: selectedReviewer
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.status === 200) {
        toast.success("Reviewer assigned successfully");
        fetchData(); // Refresh data
        setSelectedManuscript('');
        setSelectedReviewer('');
      } else {
        toast.error(response.data.message || "Failed to assign reviewer");
      }
    } catch (error) {
      console.error("Error assigning reviewer:", error);
      toast.error(error.message || "Failed to assign reviewer");
    } finally {
      setAssignLoading(false);
    }
  };



  // Sample data - replace with your actual data
  const stats = [
    { title: "New Submissions", value: 12, icon: faBook, color: "bg-blue-500" },
    { title: "In Review", value: 8, icon: faUserEdit, color: "bg-yellow-500" },
    { title: "Assigned to Me", value: 5, icon: faUsers, color: "bg-green-500" },
    { title: "Completed", value: 23, icon: faChartBar, color: "bg-purple-500" }
  ];

  const recentSubmissions = [
    { id: 1, title: "Quantum Computing Advances", author: "Dr. Smith", date: "2023-05-15", status: "Under Review" },
    { id: 2, title: "Machine Learning in Healthcare", author: "Dr. Johnson", date: "2023-05-10", status: "New" },
    { id: 3, title: "Renewable Energy Systems", author: "Dr. Williams", date: "2023-05-08", status: "Review Completed" }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 ">
        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6 flex flex-col justify-center items-center">
                <div className={`${stat.color} h-12 w-12 rounded-full flex items-center justify-center text-white mb-4`}>
                  <FontAwesomeIcon icon={stat.icon} size="lg" />
                </div>
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
          {/* Recent Submissions */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-lg">Recent Submissions</h3>
              <p className="text-sm text-gray-500">Latest manuscripts submitted for review</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSubmissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{submission.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${submission.status === "New" ? "bg-blue-100 text-blue-800" :
                            submission.status === "Under Review" ? "bg-yellow-100 text-yellow-800" :
                              "bg-green-100 text-green-800"}`}>
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <Link
                          className="text-green-600 hover:text-green-900"
                          to='/permission/reviewer'
                        >
                          Assign
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">Showing 3 of 12 submissions</p>
              <Link
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                to='/permission/reviewer'
              >
                View All Submissions
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Quick Assign</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Manuscript</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={selectedManuscript}
                    onChange={(e) => setSelectedManuscript(e.target.value)}
                  >
                    <option value="">Select Manuscript</option>
                    {manuscripts?.map(manuscript => (
                      <option key={manuscript.id} value={manuscript.id}>
                        {manuscript.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Select Reviewer</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    value={selectedReviewer}
                    onChange={(e) => setSelectedReviewer(e.target.value)}
                  >
                    <option value="">Select Reviewer</option>
                    {reviewers?.map(reviewer => (
                      <option key={reviewer.user_id} value={reviewer.user_id}>
                        {reviewer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 flex items-center justify-center ${assignLoading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
                  onClick={handleAssignReviewer}
                  disabled={assignLoading}
                >
                  {assignLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Assigning...
                    </>
                  ) : 'Assign Reviewer'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Review Progress</h3>
              <div className="space-y-4 overflow-y-auto custom-scrollbar h-52 pr-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quantum Computing</span>
                    <span>2/3 reviews</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '66%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>ML in Healthcare</span>
                    <span>1/3 reviews</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '33%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy Systems</span>
                    <span>3/3 reviews</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy Systems</span>
                    <span>3/3 reviews</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy Systems</span>
                    <span>3/3 reviews</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy Systems</span>
                    <span>3/3 reviews</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Energy Systems</span>
                    <span>3/3 reviews</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-lg mb-4">Recent Messages</h3>
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Dr. Anderson</span>
                    <span className="text-xs text-gray-500">2h ago</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">Regarding the Quantum Computing manuscript review timeline...</p>
                </div>
                <div className="border-b pb-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Editorial Board</span>
                    <span className="text-xs text-gray-500">1d ago</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">Reminder: Editorial meeting next Wednesday at 10am...</p>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-medium">System Notification</span>
                    <span className="text-xs text-gray-500">2d ago</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">New submission received: "Advanced Neural Networks"...</p>
                </div>
              </div>
              <button className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
                View All Messages
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditorDashboard;