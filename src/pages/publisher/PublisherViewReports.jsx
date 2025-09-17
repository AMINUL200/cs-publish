import React, { useState, useEffect } from "react";
import { TrendingUp, Users, DollarSign, Clock, Award, BarChart3, ChevronRight, Star } from "lucide-react";

const PublisherViewReports = () => {
  const [activeCard, setActiveCard] = useState(null);

  // Sample data
  const [stats] = useState({
    totalPublished: 120,
    totalRevenue: "₹2,45,000",
    topAuthor: "Dr. A. Kumar",
    avgProcessingTime: "18 days",
  });

  const [topAuthors] = useState([
    { name: "Dr. A. Kumar", manuscripts: 12, revenue: "₹40,000", trend: "+23%" },
    { name: "M. Roy", manuscripts: 9, revenue: "₹32,000", trend: "+18%" },
    { name: "S. Das", manuscripts: 7, revenue: "₹25,000", trend: "+12%" },
    { name: "P. Sharma", manuscripts: 5, revenue: "₹18,500", trend: "+8%" },
  ]);

  const StatCard = ({ icon: Icon, label, value, sublabel, index }) => (
    <div
      className="group relative bg-white border border-gray-100 rounded-3xl p-8 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setActiveCard(index)}
      onMouseLeave={() => setActiveCard(null)}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-gray-100 transition-colors duration-200">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
        <div className="w-2 h-2 bg-gray-200 rounded-full group-hover:bg-green-400 transition-colors duration-300" />
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-500 tracking-wide uppercase">{label}</p>
        <p className="text-3xl font-bold text-gray-900 tracking-tight">{value}</p>
        {sublabel && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>{sublabel}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-white border border-gray-200 rounded-2xl shadow-sm">
              <BarChart3 className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                Reports & Analytics
              </h1>
              <p className="text-lg text-gray-500 mt-1">
                Track performance and revenue insights
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
          <StatCard
            icon={Users}
            label="Published Works"
            value={stats.totalPublished}
            sublabel="+12% this month"
            index={0}
          />
          <StatCard
            icon={DollarSign}
            label="Total Revenue"
            value={stats.totalRevenue}
            sublabel="+18% this month"
            index={1}
          />
          <StatCard
            icon={Award}
            label="Top Contributor"
            value={stats.topAuthor}
            sublabel="Leading author"
            index={2}
          />
          <StatCard
            icon={Clock}
            label="Processing Time"
            value={stats.avgProcessingTime}
            sublabel="Average turnaround"
            index={3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* Revenue Chart Section */}
          <div className="xl:col-span-2">
            <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Revenue Trends</h2>
                  <p className="text-gray-500">Monthly performance overview</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-600">Live</span>
                </div>
              </div>
              
              <div className="h-80 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center group hover:bg-gray-50/80 transition-colors duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm group-hover:shadow-md transition-shadow duration-300">
                    <BarChart3 className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Chart Integration Ready</h3>
                  <p className="text-gray-500 text-sm max-w-xs">Connect your preferred charting library for detailed analytics</p>
                </div>
              </div>
            </div>
          </div>

          {/* Top Authors */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Top Authors</h2>
                <p className="text-sm text-gray-500">Performance leaders</p>
              </div>
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
                View all
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-6">
              {topAuthors.map((author, idx) => (
                <div
                  key={idx}
                  className="group flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-bold text-gray-700 group-hover:bg-gray-200 transition-colors duration-200">
                        {idx + 1}
                      </div>
                      {idx === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3 text-white" fill="currentColor" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{author.name}</h3>
                      <p className="text-sm text-gray-500">{author.manuscripts} manuscripts</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-gray-900 mb-1">{author.revenue}</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>{author.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-xl border border-gray-200">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Performance Insight</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Top performers are generating 68% more revenue this quarter with consistent quality output.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublisherViewReports;