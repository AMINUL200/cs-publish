import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { set } from "date-fns/set";

const Subscription = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const { token, userData } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const fetchPricingData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/plan`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200 || response.status || response.data.status) {
        setPricingData(response.data);
      } else {
        toast.error("Failed to fetch pricing data");
        setError("Failed to fetch pricing data");
      }
    } catch (error) {
      console.error("Error fetching pricing data:", error);
      toast.error(error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPricingData();
  }, []);

  const handlePayment = async (plan) => {
    try {
      console.log("1. Starting payment process for plan:", plan.id);

      // Step 1: Check login
      if (!token) {
        console.log("No token found");
        alert("Please log in to continue with payment.");
        return;
      }

      setLoadingPayment(true);
      console.log("2. Loading payment state set to true");

      // Step 2: Create order
      console.log("3. Creating order...");
      const { data } = await axios.post(
        `${API_URL}api/subscription/order`,
        { plan_id: plan.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("4. Order created:", data);

      if (!data.order_id) {
        console.error("No order_id in response:", data);
        toast.error("Failed to create order");
        return;
      }

      // Step 3: Configure Razorpay options
      console.log("5. Configuring Razorpay options...");
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Math.round(parseFloat(data.amount) * 100), // Ensure it's integer
        currency: data.currency || "INR",
        name: "Your Journal Name",
        description: `${plan.name} Plan Subscription`,
        order_id: data.order_id,
        handler: function (response) {
          console.log("Razorpay handler called:", response);
          // ... rest of handler code
        },
        modal: {
          ondismiss: function () {
            console.log("Razorpay modal dismissed");
            setLoadingPayment(false);
          },
        },
      };

      console.log("6. Razorpay options configured:", options);

      // Step 4: Create and open Razorpay instance
      console.log("7. Creating Razorpay instance...");
      const rzp = new window.Razorpay(options);
      console.log("8. Razorpay instance created:", rzp);

      // Add error handlers
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setLoadingPayment(false);
      });

      console.log("9. Opening Razorpay modal...");
      rzp.open();
      console.log("10. rzp.open() called");
    } catch (err) {
      console.error("Error in handlePayment:", err);
      setLoadingPayment(false);
    }
  };

  // Helper function to render features list
  const renderFeatures = (features) => {
    if (!features || !Array.isArray(features)) {
      return null;
    }

    return (
      <ul className="space-y-3 mb-6 mx-auto">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
    );
  };
  // Helper function to render additional plan details
  const renderPlanDetails = (plan) => {
    const details = [];

    if (plan.download_limit) {
      details.push(`${plan.download_limit} PDF Downloads`);
    }

    if (plan.mentor_hub_access === "1") {
      details.push("Mentor Hub Access");
    }

    if (plan.article_read_access === "1") {
      details.push("Article Read Access");
    }

    if (plan.article_store_access === "1") {
      details.push("Article Store Access");
    }

    if (details.length === 0) {
      return null;
    }

    return (
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Plan Includes:
        </h4>
        <ul className="space-y-2">
          {details.map((detail, index) => (
            <li key={index} className="flex items-center text-xs text-gray-600">
              <svg
                className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return <Loader />;
  }
  console.log("pricingData:: ", pricingData);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 sm:pt-30 pb-8 sm:pb-10 ">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Choose <span className="text-yellow-400">Your Plan</span>
        </h2>
        <h5 className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the perfect plan for your manuscript
        </h5>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
        {pricingData.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl p-8 transition-all duration-300 cursor-pointer flex flex-col h-full ${
              plan.popular
                ? "border-2 border-yellow-500 bg-white shadow-xl"
                : "border-2 border-gray-200 bg-white hover:border-yellow-300 hover:shadow-lg"
            } ${
              selectedPlan === plan.id
                ? "ring-2 ring-yellow-500 ring-opacity-50"
                : ""
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-yellow-600">
                  ₹{plan.price}
                </span>
                <span className="text-gray-600 ml-2 text-sm capitalize">
                  / {plan.duration}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Features Section */}
            <div className="flex-grow">
              {renderFeatures(plan.features)}
              {/* {renderPlanDetails(plan)} */}
            </div>

            {/* Button at the bottom */}
            <div className="mt-auto pt-6">
              <button
                onClick={() => handlePayment(plan)}
                disabled={loadingPayment && selectedPlan === plan.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  loadingPayment && selectedPlan === plan.id
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : selectedPlan === plan.id
                    ? "custom-btn"
                    : plan.popular
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {loadingPayment && selectedPlan === plan.id
                  ? "Processing..."
                  : plan.price === "0.00"
                  ? "Get Started Free"
                  : "Select Plan"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-600">Loading plans...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to load plans
            </h3>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;
