import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { useNavigate } from 'react-router-dom';

const HandleServices = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionTitle, setSectionTitle] = useState('Our Services');
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Fetch services data
  const fetchServicesData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}api/services-admin`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.data.status) {
        console.log('Fetched services data:', res.data.data);
        setServicesData(res.data.data);
        setSectionTitle(res.data.section || 'Our Services');
      }
    } catch (err) {
      console.error('Error fetching services data:', err);
      toast.error(err.response?.data?.message || 'Error fetching services data');
    } finally {
      setLoading(false);
    }
  };

  // Delete service item
  const handleDeleteService = async (serviceId, serviceTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${serviceTitle}"?`)) {
      return;
    }

    try {
      setDeleteLoading(serviceId);
      const res = await axios.delete(`${API_URL}api/contents/${serviceId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.data.status) {
        toast.success(res.data.message || 'Service deleted successfully');
        // Remove from local state
        setServicesData(prev => prev.filter(item => item.id !== serviceId));
      }
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error(err.response?.data?.message || 'Error deleting service');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Edit service item
  const handleEditService = (serviceId) => {
    navigate(`/setting/add-service?update=${serviceId}`);
  };

  // Add new service
  const handleAddService = () => {
    navigate('/setting/add-service');
  };

  useEffect(() => {
    fetchServicesData();
  }, []);

  // Strip HTML tags from description
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header with Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {sectionTitle}
            </h1>
            <p className="text-gray-600">
              Manage services and offerings
            </p>
          </div>
          
          <button
            onClick={handleAddService}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center gap-2"
          >
            <span>+</span>
            Add New Service
          </button>
        </div>

        {/* Services Grid */}
        {servicesData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🛠️</div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No Services Found
            </h3>
            <p className="text-gray-500 mb-6">
              Get started by adding your first service.
            </p>
            <button
              onClick={handleAddService}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Add Your First Service
            </button>
          </div>
        ) : (
          <>
            {/* Stats Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Services Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{servicesData.length}</div>
                  <div className="text-sm text-gray-600">Total Services</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {servicesData.filter(item => item.status === '1').length}
                  </div>
                  <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {servicesData.filter(item => item.status === '0').length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {servicesData.filter(item => item.image).length}
                  </div>
                  <div className="text-sm text-gray-600">With Images</div>
                </div>
              </div>
            </div>

            {/* Services Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {servicesData.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-gray-200"
                >
                  {/* Image */}
                  <div className="relative">
                    {service.image ? (
                      <img
                        // src={service.image}
                        src={`${STORAGE_URL}${service.image}`}
                        alt={service.title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/400x200/4F46E5/FFFFFF?text=${encodeURIComponent(
                            service.title.substring(0, 30)
                          )}`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-white text-4xl">🛠️</div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.status === '1'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {service.status === '1' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                      {service.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {stripHtml(service.short_description)}
                    </p>

                    {/* Service Metadata */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Service Details:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.service_type && (
                          <span className="inline-flex items-center text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded">
                            📊 {service.service_type}
                          </span>
                        )}
                        {service.duration && (
                          <span className="inline-flex items-center text-green-600 text-xs bg-green-50 px-2 py-1 rounded">
                            ⏱️ {service.duration}
                          </span>
                        )}
                        {service.price && (
                          <span className="inline-flex items-center text-purple-600 text-xs bg-purple-50 px-2 py-1 rounded">
                            💰 {service.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Created:</span>{' '}
                          {new Date(service.created_at).toLocaleDateString()}
                        </div>
                        {/* <div>
                          <span className="font-medium">Type:</span>{' '}
                          <span className="capitalize">{service.type || 'service'}</span>
                        </div> */}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex space-x-2">
                      <button
                        onClick={() => handleEditService(service.id)}
                        className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm flex items-center justify-center gap-1"
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id, service.title)}
                        disabled={deleteLoading === service.id}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-1 transition-colors ${
                          deleteLoading === service.id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        {deleteLoading === service.id ? (
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
          </>
        )}

        {/* Refresh Button */}
        {servicesData.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchServicesData}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Refresh Data
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleServices;