import React, { useState } from "react";
import {
  FileText,
  DollarSign,
  CheckCircle,
  Download,
  PieChart,
  Calendar,
  Search,
  Filter,
  ArrowUp,
  TrendingUp,
} from "lucide-react";
const PublisherDashboardDesign = () => {
  // Mock data for demonstration
  const [stats, setStats] = useState({
    awaitingPayment: 12,
    readyToPublish: 8,
    publishedThisMonth: 23,
    revenue: 2840,
  });

  const [manuscripts, setManuscripts] = useState([
    {
      id: 1,
      title: "AI in Healthcare",
      author: "Dr. Smith",
      status: "awaiting-payment",
      submitted: "2023-05-15",
      amount: 250,
    },
    {
      id: 2,
      title: "Renewable Energy Solutions",
      author: "Prof. Johnson",
      status: "payment-received",
      submitted: "2023-05-18",
      amount: 300,
    },
    {
      id: 3,
      title: "Blockchain Applications",
      author: "Dr. Williams",
      status: "ready-to-publish",
      submitted: "2023-05-20",
      amount: 275,
    },
    {
      id: 4,
      title: "Climate Change Impacts",
      author: "Dr. Brown",
      status: "published",
      submitted: "2023-05-05",
      amount: 350,
    },
    {
      id: 5,
      title: "Neural Network Advances",
      author: "Prof. Davis",
      status: "awaiting-payment",
      submitted: "2023-05-22",
      amount: 225,
    },
  ]);

  const [activeTab, setActiveTab] = useState("all");

  const filteredManuscripts = manuscripts.filter((manuscript) => {
    if (activeTab === "all") return true;
    return manuscript.status === activeTab;
  });

  const statusStyles = {
    "awaiting-payment": "bg-yellow-100 text-yellow-800",
    "payment-received": "bg-blue-100 text-blue-800",
    "ready-to-publish": "bg-purple-100 text-purple-800",
    published: "bg-green-100 text-green-800",
  };

  const statusText = {
    "awaiting-payment": "Awaiting Payment",
    "payment-received": "Payment Received",
    "ready-to-publish": "Ready to Publish",
    published: "Published",
  };

  const handleSendReminder = (id) => {
    alert(`Payment reminder sent for manuscript #${id}`);
  };

  const handlePublish = (id) => {
    alert(`Publishing manuscript #${id}`);
    setManuscripts(
      manuscripts.map((ms) =>
        ms.id === id ? { ...ms, status: "published" } : ms
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Publisher Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search manuscripts..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg px-4 py-2">
              <Filter className="mr-2 w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto pt-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <FileText className="text-yellow-600 w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Awaiting Payment
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.awaitingPayment}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 w-4 h-4" />
              <span>2 from yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <DollarSign className="text-blue-600 w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Ready to Publish
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.readyToPublish}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="mr-1 w-4 h-4" />
              <span>3 from yesterday</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="text-green-600 w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">
                  Published This Month
                </h3>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.publishedThisMonth}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowUp className="mr-1 w-4 h-4" />
              <span>12% from last month</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <PieChart className="text-purple-600 w-6 h-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
                <p className="text-2xl font-semibold text-gray-900">
                  ${stats.revenue}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <DollarSign className="mr-1 w-4 h-4" />
              <span>$540 this week</span>
            </div>
          </div>
        </div>

        {/* Manuscripts Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {[
                "all",
                "awaiting-payment",
                "payment-received",
                "ready-to-publish",
                "published",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`ml-4 py-4 px-3 text-sm font-medium ${
                    activeTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab === "all" ? "All Manuscripts" : statusText[tab]}
                </button>
              ))}
            </nav>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-2">
                    Manuscript
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-2">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-2">
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-2">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-2">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-2">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredManuscripts.map((manuscript) => (
                  <tr key={manuscript.id} className="hover:bg-gray-50">
                    <td className="px-2 py-4 whitespace-nowrap border-2">
                      <div className="text-sm font-medium text-gray-900">
                        {manuscript.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: #{manuscript.id}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap border-2">
                      <div className="text-sm text-gray-900">
                        {manuscript.author}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap flex items-center text-sm text-gray-900">
                      {/* <Calendar className="mr-1 text-gray-400 w-4 h-4" /> */}
                      {manuscript.submitted}
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap border-2">
                      <div className="text-sm font-medium text-gray-900">
                        ${manuscript.amount}
                      </div>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap border-2">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusStyles[manuscript.status]
                        }`}
                      >
                        {statusText[manuscript.status]}
                      </span>
                    </td>
                    <td className="px-2 py-4 whitespace-nowrap text-start text-sm font-medium flex flex-col justify-center items-center ">
                      {manuscript.status === "awaiting-payment" && (
                        <button
                          onClick={() => handleSendReminder(manuscript.id)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Send Reminder
                        </button>
                      )}
                      {manuscript.status === "ready-to-publish" && (
                        <button
                          onClick={() => handlePublish(manuscript.id)}
                          className="text-green-600 hover:text-green-900 mr-4"
                        >
                          Publish
                        </button>
                      )}
                      <button className="text-gray-600 hover:text-gray-900 flex items-center">
                        <Download className="inline-block mr-1 w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to{" "}
                <span className="font-medium">5</span> of{" "}
                <span className="font-medium">23</span> results
              </p>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <a
                  href="#"
                  className="px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </a>
                <a
                  href="#"
                  className="px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100"
                >
                  1
                </a>
                <a
                  href="#"
                  className="px-4 py-2 border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50"
                >
                  2
                </a>
                <a
                  href="#"
                  className="px-4 py-2 border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50"
                >
                  3
                </a>
                <a
                  href="#"
                  className="px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm text-gray-500 hover:bg-gray-50"
                >
                  Next
                </a>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublisherDashboardDesign;
