import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Breadcrumb from "../../../components/common/Breadcrumb";
import Loader from "../../../components/common/Loader";

const UserProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_URL}api/about`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        setProfileData(response.data.data[0]); // Get first item from array
        toast.success(
          response.data.message || "Profile data loaded successfully"
        );
      } else {
        throw new Error(
          response.data.message || "Failed to fetch profile data"
        );
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch profile data";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) {
    return <Loader/>
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <h3 className="text-lg font-bold mb-2">Error Loading Profile</h3>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchProfileData}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2">No Profile Data</h3>
            <p>No profile information available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[{ label: "Home", path: "/", icon: "home" }, { label: "About" }]}
        pageTitle="About"
      />
      <div className="min-h-screen bg-gray-50 py-8 ">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {profileData.title || "Profile"}
            </h1>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="aspect-w-16 aspect-h-12 rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={profileData.image1}
                  alt={profileData.image1_alt || "Profile main image"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Secondary Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={profileData.image2}
                    alt={profileData.image2_alt || "Profile secondary image"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                  <img
                    src={profileData.image3}
                    alt={profileData.image3_alt || "Profile tertiary image"}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    About
                  </h2>
                  <div
                    className="blog-rich-text text-gray-700 leading-relaxed prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: profileData.description,
                    }}
                  />
                </div>

            

                
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
