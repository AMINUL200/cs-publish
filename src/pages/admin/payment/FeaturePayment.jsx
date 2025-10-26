import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FeaturePayment = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
  });

  // Get feature payments list
  const getFeaturePayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}api/author-features`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setPayments(response.data.data);
      } else {
        toast.error("Failed to fetch payments");
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
      toast.error("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

  // Create or update feature payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingPayment
        ? `${API_URL}api/author-features/update/${editingPayment.id}`
        : `${API_URL}api/author-features`;

      const method = editingPayment ? "post" : "post";

      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        toast.success(
          editingPayment
            ? "Payment updated successfully!"
            : "Payment created successfully!"
        );
        getFeaturePayments();
        handleClosePopup();
      } else {
        toast.error("Operation failed");
      }
    } catch (error) {
      console.error("Error saving payment:", error);
      toast.error("Error saving payment");
    } finally {
      setLoading(false);
    }
  };

  // Delete feature payment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}api/author-features/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        toast.success("Payment deleted successfully!");
        getFeaturePayments();
      } else {
        toast.error("Failed to delete payment");
      }
    } catch (error) {
      console.error("Error deleting payment:", error);
      toast.error("Error deleting payment");
    }
  };

  // Open popup for create
  const handleOpenPopup = () => {
    setEditingPayment(null);
    setFormData({ name: "", amount: "" });
    setShowPopup(true);
  };

  // Open popup for edit
  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setFormData({
      name: payment.name,
      amount: payment.amount,
    });
    setShowPopup(true);
  };

  // Close popup
  const handleClosePopup = () => {
    setShowPopup(false);
    setEditingPayment(null);
    setFormData({ name: "", amount: "" });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Fetch payments on component mount
  useEffect(() => {
    getFeaturePayments();
  }, []);

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Feature Payments</h1>
        <button
          onClick={handleOpenPopup}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Add Feature Payment
        </button>
      </div>

      {/* Loading State */}
      {loading && payments.length === 0 && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading payments...</p>
        </div>
      )}

      {/* Payments Grid */}
      {!loading && payments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {payment.name}
                </h3>
                <span className="text-green-600 font-bold text-xl">
                  ₹{payment.amount}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(payment)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(payment.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && payments.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No feature payments found.</p>
          <button
            onClick={handleOpenPopup}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create Your First Payment
          </button>
        </div>
      )}

      {/* Create/Edit Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingPayment ? "Edit Payment" : "Create Payment"}
              </h2>
              <button
                onClick={handleClosePopup}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter payment name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="amount"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  {loading ? "Saving..." : editingPayment ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturePayment;
