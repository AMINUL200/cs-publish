import React, { useState } from 'react';
import { BookOpen, Calendar, CreditCard, Download, CheckCircle } from 'lucide-react';

const MySubscription = () => {
  const [currentPlan] = useState({
    name: 'Premium Plan',
    price: 29.99,
    startDate: '2024-10-01',
    renewalDate: '2025-10-01',
    status: 'Active',
    manuscripts: 'Unlimited',
    downloads: 'Unlimited',
    features: [
      'Access to all manuscripts',
      'Unlimited downloads',
      'Priority support',
      'Early access to new releases',
      'Offline reading capability'
    ]
  });

  const [previousSubscriptions] = useState([
    {
      id: 1,
      planName: 'Basic Plan',
      price: 9.99,
      startDate: '2023-08-15',
      endDate: '2024-09-30',
      duration: '13 months',
      manuscriptsRead: 45
    },
    {
      id: 2,
      planName: 'Standard Plan',
      price: 19.99,
      startDate: '2023-01-10',
      endDate: '2023-08-14',
      duration: '7 months',
      manuscriptsRead: 28
    },
    {
      id: 3,
      planName: 'Basic Plan',
      price: 9.99,
      startDate: '2022-06-01',
      endDate: '2022-12-31',
      duration: '7 months',
      manuscriptsRead: 15
    }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8 !pt-30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">My Subscription</h1>
          <p className="text-amber-800">Manage your manuscript access and subscription details</p>
        </div>

        {/* Current Plan Card */}
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl shadow-lg p-6 md:p-8 mb-8 border-2 border-amber-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-900 text-yellow-300 p-3 rounded-full">
                <BookOpen size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-amber-900">{currentPlan.name}</h2>
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold mt-1">
                  {currentPlan.status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-amber-900">${currentPlan.price}</p>
              <p className="text-amber-700 text-sm">per month</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white bg-opacity-60 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={20} className="text-amber-800" />
                <span className="font-semibold text-amber-900">Start Date</span>
              </div>
              <p className="text-amber-800">{new Date(currentPlan.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            <div className="bg-white bg-opacity-60 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={20} className="text-amber-800" />
                <span className="font-semibold text-amber-900">Next Renewal</span>
              </div>
              <p className="text-amber-800">{new Date(currentPlan.renewalDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          <div className="bg-white bg-opacity-60 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-amber-900 mb-3 text-lg">Plan Features</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
                  <span className="text-amber-800">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-amber-900 text-yellow-300 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors">
            Manage Subscription
          </button>
        </div>

        {/* Previous Subscriptions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-amber-900" size={28} />
            <h2 className="text-2xl font-bold text-amber-900">Subscription History</h2>
          </div>

          <div className="space-y-4">
            {previousSubscriptions.map((sub) => (
              <div key={sub.id} className="border-2 border-amber-200 rounded-lg p-5 hover:border-amber-400 transition-colors bg-gradient-to-r from-amber-50 to-yellow-50">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-amber-900">{sub.planName}</h3>
                      <span className="bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Expired
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-amber-700 font-semibold">Period: </span>
                        <span className="text-amber-900">{new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-amber-700 font-semibold">Duration: </span>
                        <span className="text-amber-900">{sub.duration}</span>
                      </div>
                      <div>
                        <span className="text-amber-700 font-semibold">Price: </span>
                        <span className="text-amber-900">${sub.price}/month</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download size={16} className="text-amber-700" />
                        <span className="text-amber-700 font-semibold">Manuscripts Read: </span>
                        <span className="text-amber-900">{sub.manuscriptsRead}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-6 text-center shadow-lg">
            <p className="text-amber-900 font-semibold mb-2">Total Manuscripts Read</p>
            <p className="text-4xl font-bold text-white">88</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 text-center shadow-lg">
            <p className="text-yellow-200 font-semibold mb-2">Total Downloads</p>
            <p className="text-4xl font-bold text-white">156</p>
          </div>
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl p-6 text-center shadow-lg">
            <p className="text-yellow-300 font-semibold mb-2">Member Since</p>
            <p className="text-2xl font-bold text-white">June 2022</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySubscription;