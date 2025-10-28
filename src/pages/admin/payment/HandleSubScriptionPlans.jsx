import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';

const HandleSubScriptionPlans = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    duration_days: '',
    download_limit: '',
    mentor_hub_access: '1',
    article_read_access: '1',
    article_store_access: '1',
    features: ['']
  });

  // Fetch subscription plans
  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}api/plans`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (res.status === 200) {
          console.log(res.data);
        setPlans(res.data);
      }
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      toast.error(err.response?.data?.message || 'Error fetching subscription plans');
    } finally {
      setLoading(false);
    }
  };

  // Delete plan
  const handleDeletePlan = async (planId, planName) => {
    if (!window.confirm(`Are you sure you want to delete "${planName}"?`)) {
      return;
    }

    try {
      setDeleteLoading(planId);
      const res = await axios.delete(`${API_URL}api/plans/${planId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.data.status) {
        toast.success(res.data.message || 'Plan deleted successfully');
        setPlans(prev => prev.filter(plan => plan.id !== planId));
      }
    } catch (err) {
      console.error('Error deleting plan:', err);
      toast.error(err.response?.data?.message || 'Error deleting plan');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle feature input changes
  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  // Add new feature field
  const addFeatureField = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  // Remove feature field
  const removeFeatureField = (index) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, features: newFeatures }));
    }
  };

  // Open popup for adding new plan
  const handleAddPlan = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      price: '',
      duration: '',
      duration_days: '',
      download_limit: '',
      mentor_hub_access: '1',
      article_read_access: '1',
      article_store_access: '1',
      features: ['']
    });
    setShowPopup(true);
  };

  // Open popup for editing plan
  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      duration_days: plan.duration_days || '',
      download_limit: plan.download_limit || '',
      mentor_hub_access: plan.mentor_hub_access,
      article_read_access: plan.article_read_access,
      article_store_access: plan.article_store_access,
      features: plan.features.length > 0 ? plan.features : ['']
    });
    setShowPopup(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter out empty features
    const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');

    if (filteredFeatures.length === 0) {
      toast.error('Please add at least one feature');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Plan name is required');
      return;
    }

    if (!formData.price) {
      toast.error('Price is required');
      return;
    }

    try {
      setFormLoading(true);

      const submitData = {
        ...formData,
        features: filteredFeatures,
        price: parseFloat(formData.price),
        duration_days: formData.duration_days ? parseInt(formData.duration_days) : null,
        download_limit: formData.download_limit ? parseInt(formData.download_limit) : null
      };

      let res;
      if (editingPlan) {
        // Update plan
        res = await axios.post(`${API_URL}api/plans/${editingPlan.id}`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      } else {
        // Create new plan
        res = await axios.post(`${API_URL}api/plans`, submitData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
      }

      if (res.data.status) {
        toast.success(res.data.message || (editingPlan ? 'Plan updated successfully' : 'Plan created successfully'));
        setShowPopup(false);
        fetchPlans();
      }
    } catch (err) {
      console.error('Error saving plan:', err);
      toast.error(err.response?.data?.message || (editingPlan ? 'Error updating plan' : 'Error creating plan'));
    } finally {
      setFormLoading(false);
    }
  };

  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setEditingPlan(null);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Subscription Plans
            </h1>
            <p className="text-gray-600">
              Manage your subscription plans and pricing
            </p>
          </div>
          
          <button
            onClick={handleAddPlan}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <span>+</span>
            Add New Plan
          </button>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Subscription Plans Found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by creating your first subscription plan.
            </p>
            <button
              onClick={handleAddPlan}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Create Your First Plan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200"
              >
                {/* Plan Header */}
                <div className={`p-6 ${
                  plan.name.toLowerCase().includes('premium') 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : plan.name.toLowerCase().includes('free')
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <span className="bg-black bg-opacity-20 px-2 py-1 rounded-full text-sm">
                      {plan.duration}
                    </span>
                  </div>
                  <div className="text-3xl font-bold mb-1">
                    ${parseFloat(plan.price).toFixed(2)}
                  </div>
                  {plan.duration_days && (
                    <div className="text-sm opacity-90">
                      {plan.duration_days} days
                    </div>
                  )}
                </div>

                {/* Plan Features */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Features:</h4>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <span className="text-green-500 mt-1">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Plan Limits */}
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    {plan.download_limit && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Download Limit:</span>
                        <span className="font-medium">{plan.download_limit} PDFs</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mentor Hub:</span>
                      <span className={`font-medium ${plan.mentor_hub_access === '1' ? 'text-green-600' : 'text-red-600'}`}>
                        {plan.mentor_hub_access === '1' ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Article Access:</span>
                      <span className={`font-medium ${plan.article_read_access === '1' ? 'text-green-600' : 'text-red-600'}`}>
                        {plan.article_read_access === '1' ? 'Available' : 'Not Available'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex space-x-2">
                    <button
                      onClick={() => handleEditPlan(plan)}
                      className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                    >
                      <span>✏️</span>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                      disabled={deleteLoading === plan.id}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors ${
                        deleteLoading === plan.id
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500 text-white hover:bg-red-600'
                      }`}
                    >
                      {deleteLoading === plan.id ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <span>🗑️</span>
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {plans.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchPlans}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Refresh Plans
            </button>
          </div>
        )}

        {/* Add/Edit Plan Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingPlan ? 'Edit Plan' : 'Add New Plan'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Premium, Free"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration *
                    </label>
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Duration</option>
                      <option value="lifetime">Lifetime</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration Days
                    </label>
                    <input
                      type="number"
                      name="duration_days"
                      value={formData.duration_days}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 30, 90, 365"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Download Limit
                    </label>
                    <input
                      type="number"
                      name="download_limit"
                      value={formData.download_limit}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 100"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features *
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter feature"
                        />
                        {formData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeatureField(index)}
                            className="bg-red-500 text-white px-3 rounded-lg hover:bg-red-600"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addFeatureField}
                    className="mt-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 text-sm"
                  >
                    + Add Another Feature
                  </button>
                </div>

                {/* Access Settings */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="mentor_hub_access"
                      checked={formData.mentor_hub_access === '1'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        mentor_hub_access: e.target.checked ? '1' : '0'
                      }))}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Mentor Hub Access</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="article_read_access"
                      checked={formData.article_read_access === '1'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        article_read_access: e.target.checked ? '1' : '0'
                      }))}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Article Read Access</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="article_store_access"
                      checked={formData.article_store_access === '1'}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        article_store_access: e.target.checked ? '1' : '0'
                      }))}
                      className="mr-2"
                    />
                    <label className="text-sm text-gray-700">Article Store Access</label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className={`flex-1 py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center gap-2 ${
                      formLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    } transition-colors`}
                  >
                    {formLoading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        {editingPlan ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      <>
                        <span>{editingPlan ? '✏️' : '➕'}</span>
                        {editingPlan ? 'Update Plan' : 'Create Plan'}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closePopup}
                    className="py-3 px-6 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleSubScriptionPlans;