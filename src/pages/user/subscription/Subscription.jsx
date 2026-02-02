import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const [pricingData, setPricingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const { token, userData } = useSelector((state) => state.auth);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchPricingData();
  }, []);

  const verifyPayment = async (paymentData) => {
    try {
      console.log("Verifying payment with data:", paymentData);
      
      const response = await axios.post(
        `${API_URL}api/subscription/verify`,
        {
          payment_id: paymentData.razorpay_payment_id,
          plan_id: paymentData.plan_id,
          order_id: paymentData.razorpay_order_id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Verification response:", response.data);

      if (response.data.status) {
        toast.success("Payment verified successfully! Your subscription is now active.");
        
        // You might want to update user data or redirect here
        // For example, update user subscription status in Redux
        // or redirect to a success page
        
        // Refresh pricing data to reflect updated subscription
        // fetchPricingData();
        
        // Optionally redirect to success page or dashboard
        navigate("/my-subscription");
      } else {
        toast.error(response.data.message || "Payment verification failed");
        console.error("Verification failed:", response.data);
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      toast.error(error.response?.data?.message || "Payment verification failed. Please contact support.");
    } finally {
      setLoadingPayment(false);
    }
  };

  const handlePayment = async (plan) => {
    try {
      console.log("1. Starting payment process for plan:", plan.id);

      // Step 1: Check login
      if (!token) {
        console.log("No token found");
        toast.error("Please log in to continue with payment.");
        return;
      }

      setLoadingPayment(true);
      setCurrentPlanId(plan.id);
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
        setLoadingPayment(false);
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
        handler: async function (response) {
          console.log("Razorpay handler called:", response);
          
          // Prepare verification data
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            plan_id: plan.id
          };

          console.log("Payment successful, verifying...");
          
          // Call verification API
          await verifyPayment(verificationData);
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
          contact: userData?.phone || ""
        },
        notes: {
          plan_id: plan.id,
          plan_name: plan.name,
          user_id: userData?.id
        },
        theme: {
          color: "#F59E0B"
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
        toast.error(`Payment failed: ${response.error.description || "Unknown error"}`);
        setLoadingPayment(false);
      });

      rzp.on("payment.authorized", function (response) {
        console.log("Payment authorized:", response);
      });

      console.log("9. Opening Razorpay modal...");
      rzp.open();
      console.log("10. rzp.open() called");

    } catch (err) {
      console.error("Error in handlePayment:", err);
      toast.error(err.response?.data?.message || "Failed to initiate payment");
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

      {/* Payment Processing Modal */}
      {loadingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Processing Payment
              </h3>
              <p className="text-gray-600 text-center">
                Please wait while we process your payment. Do not refresh the page.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                You will be redirected to the payment gateway shortly...
              </div>
            </div>
          </div>
        </div>
      )}

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
              {renderPlanDetails(plan)}
            </div>

            {/* Button at the bottom */}
            <div className="mt-auto pt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click event
                  handlePayment(plan);
                }}
                disabled={loadingPayment && currentPlanId === plan.id}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                  loadingPayment && currentPlanId === plan.id
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : selectedPlan === plan.id
                    ? "custom-btn"
                    : plan.popular
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {loadingPayment && currentPlanId === plan.id
                  ? "Processing..."
                  : plan.price === "0.00"
                  ? "Get Started Free"
                  : "Select Plan"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-12 max-w-3xl mx-auto text-center">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            💳 Secure Payment
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            All payments are processed securely through Razorpay. Your payment information is encrypted and never stored on our servers.
          </p>
          <div className="flex justify-center items-center space-x-4">
            <div className="text-xs text-gray-500">🔒 SSL Secured</div>
            <div className="text-xs text-gray-500">💳 Multiple Payment Options</div>
            <div className="text-xs text-gray-500">🔄 Instant Activation</div>
          </div>
        </div>
      </div>

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
            <button
              onClick={fetchPricingData}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscription;