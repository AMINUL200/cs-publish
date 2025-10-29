import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  BookOpen,
  Calendar,
  CreditCard,
  Download,
  CheckCircle,
  Eye,
} from "lucide-react";

const MySubscription = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [error, setError] = useState(null);

  // Fetch subscription data
  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/my-subscription-history`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.status) {
        setSubscriptionData(response.data);
      } else {
        setError("Failed to fetch subscription data");
      }
    } catch (err) {
      console.error("Error fetching subscription data:", err);
      setError("Error loading subscription data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [token]);

  // Calculate total manuscripts read across all plans
  const calculateTotalManuscriptsRead = () => {
    if (!subscriptionData?.per_plan_usage) return 0;
    return subscriptionData.per_plan_usage.reduce((total, plan) => {
      return total + parseInt(plan.total_view_used || 0);
    }, 0);
  };

  // Calculate total downloads across all plans
  const calculateTotalDownloads = () => {
    if (!subscriptionData?.per_plan_usage) return 0;
    return subscriptionData.per_plan_usage.reduce((total, plan) => {
      return total + parseInt(plan.total_downloads_used || 0);
    }, 0);
  };

  // Get member since date (oldest subscription start date)
  const getMemberSince = () => {
    if (!subscriptionData?.subscription_history?.length) return "N/A";
    
    const oldestSubscription = subscriptionData.subscription_history.reduce((oldest, current) => {
      const oldestDate = new Date(oldest.start_date);
      const currentDate = new Date(current.start_date);
      return currentDate < oldestDate ? current : oldest;
    });

    return new Date(oldestSubscription.start_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long"
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Calculate duration display
  const getDurationDisplay = (subscription) => {
    if (subscription.duration === "lifetime") return "Lifetime";
    
    if (subscription.end_date) {
      const start = new Date(subscription.start_date);
      const end = new Date(subscription.end_date);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    }
    
    return subscription.duration_days ? `${subscription.duration_days} days` : subscription.duration;
  };

  // Get features based on plan
  const getPlanFeatures = (planName) => {
    const baseFeatures = [
      "Access to manuscripts",
      "Standard support",
    ];

    if (planName === "Premium Plan") {
      return [
        "Access to all manuscripts",
        "Unlimited downloads",
        "Priority support",
        "Early access to new releases",
        "Offline reading capability",
      ];
    }

    return baseFeatures;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8 !pt-30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900 mx-auto mb-4"></div>
          <p className="text-amber-900">Loading subscription data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8 !pt-30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchSubscriptionData}
            className="bg-amber-900 text-yellow-300 px-6 py-2 rounded-lg hover:bg-amber-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!subscriptionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8 !pt-30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-amber-900">No subscription data available</p>
        </div>
      </div>
    );
  }

  const { active_plan, subscription_history, total_usage, per_plan_usage } = subscriptionData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8 !pt-30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">
            My Subscription
          </h1>
          <p className="text-amber-800">
            Manage your manuscript access and subscription details
          </p>
        </div>

        {/* Current Plan Card */}
        {active_plan && (
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl shadow-lg p-6 md:p-8 mb-8 border-2 border-amber-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-amber-900 text-yellow-300 p-3 rounded-full">
                  <BookOpen size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-amber-900">
                    {active_plan.plan_name}
                  </h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                    active_plan.status === 'active' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-400 text-white'
                  }`}>
                    {active_plan.status.charAt(0).toUpperCase() + active_plan.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-900">
                  ${parseFloat(active_plan.price).toFixed(2)}
                </p>
                <p className="text-amber-700 text-sm">
                  {active_plan.duration === 'lifetime' ? 'one-time' : `per ${active_plan.duration}`}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white bg-opacity-60 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} className="text-amber-800" />
                  <span className="font-semibold text-amber-900">Start Date</span>
                </div>
                <p className="text-amber-800">{formatDate(active_plan.start_date)}</p>
              </div>

              <div className="bg-white bg-opacity-60 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={20} className="text-amber-800" />
                  <span className="font-semibold text-amber-900">
                    {active_plan.end_date ? 'End Date' : 'Next Renewal'}
                  </span>
                </div>
                <p className="text-amber-800">
                  {active_plan.end_date ? formatDate(active_plan.end_date) : 'Auto-renewal'}
                </p>
              </div>
            </div>

            {/* Usage Stats */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white bg-opacity-60 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Download size={20} className="text-amber-800" />
                  <span className="font-semibold text-amber-900">Downloads Used</span>
                </div>
                <p className="text-amber-800">{active_plan.downloads_used}</p>
              </div>

              <div className="bg-white bg-opacity-60 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye size={20} className="text-amber-800" />
                  <span className="font-semibold text-amber-900">Views Used</span>
                </div>
                <p className="text-amber-800">{active_plan.view_used}</p>
              </div>
            </div>

            <div className="bg-white bg-opacity-60 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-amber-900 mb-3 text-lg">
                Plan Features
              </h3>
              <div className="grid md:grid-cols-2 gap-2">
                {getPlanFeatures(active_plan.plan_name).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle
                      size={18}
                      className="text-green-600 flex-shrink-0"
                    />
                    <span className="text-amber-800">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-amber-900 text-yellow-300 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors">
              Manage Subscription
            </button>
          </div>
        )}

        {/* Previous Subscriptions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-amber-900" size={28} />
            <h2 className="text-2xl font-bold text-amber-900">
              Subscription History
            </h2>
          </div>

          <div className="space-y-4">
            {subscription_history?.filter(sub => sub.subscription_id !== active_plan?.subscription_id)
              .map((sub) => (
              <div
                key={sub.subscription_id}
                className="border-2 border-amber-200 rounded-lg p-5 hover:border-amber-400 transition-colors bg-gradient-to-r from-amber-50 to-yellow-50"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-amber-900">
                        {sub.plan_name}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        sub.status === 'active' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-400 text-white'
                      }`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-amber-700 font-semibold">
                          Period:{" "}
                        </span>
                        <span className="text-amber-900">
                          {formatDate(sub.start_date)} - {sub.end_date ? formatDate(sub.end_date) : 'Present'}
                        </span>
                      </div>
                      <div>
                        <span className="text-amber-700 font-semibold">
                          Duration:{" "}
                        </span>
                        <span className="text-amber-900">{getDurationDisplay(sub)}</span>
                      </div>
                      <div>
                        <span className="text-amber-700 font-semibold">
                          Price:{" "}
                        </span>
                        <span className="text-amber-900">
                          ${parseFloat(sub.price).toFixed(2)} {sub.duration === 'lifetime' ? 'one-time' : `per ${sub.duration}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye size={16} className="text-amber-700" />
                        <span className="text-amber-700 font-semibold">
                          Views Used:{" "}
                        </span>
                        <span className="text-amber-900">
                          {sub.view_used}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(!subscription_history || subscription_history.length === 0) && (
              <div className="text-center py-8 text-amber-700">
                No subscription history found
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl p-6 text-center shadow-lg">
            <p className="text-amber-900 font-semibold mb-2">
              Total Manuscripts Read
            </p>
            <p className="text-4xl font-bold text-white">{calculateTotalManuscriptsRead()}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 text-center shadow-lg">
            <p className="text-yellow-200 font-semibold mb-2">
              Total Downloads
            </p>
            <p className="text-4xl font-bold text-white">{calculateTotalDownloads()}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-800 to-amber-900 rounded-xl p-6 text-center shadow-lg">
            <p className="text-yellow-300 font-semibold mb-2">Member Since</p>
            <p className="text-2xl font-bold text-white">{getMemberSince()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySubscription;