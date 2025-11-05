import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BookOpen, Users, FileText, Award, Mail, Globe } from "lucide-react";
// import Loader from "../../components/common/Loader";
import { useParams } from "react-router-dom";
import Loader from "../../../components/common/Loader";

const JournalAuthorInformation = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const {id} = useParams();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}api/journal/author_guide/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch author information");
      console.error("Error fetching author guide:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-4">{error}</div>
          <button 
            onClick={fetchData}
            className="bg-brown-red text-white px-6 py-2 rounded-lg hover:bg-brown-red-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-yellow-50">
        <div className="text-center text-gray-600">
          No author information available
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 sm:py-25">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-yellow-400 via-brown-red to-black">
        <div className="absolute inset-0 bg-yellow-400 bg-opacity-40"></div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Content */}
            <div className="flex flex-col justify-center text-white z-10 py-12">
              <div className="mb-6">
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {data.j_title}
                </h1>
               
              </div>
              
             
            </div>

            {/* Right Image */}
            <div className="hidden lg:flex items-center justify-end">
              <div className="relative w-full h-80">
                <img
                  src={data.image}
                  alt={data.j_title}
                  className="w-full h-full object-cover rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-300"
                />
                <div className="absolute -inset-4 bg-yellow-500 rounded-2xl transform -rotate-2 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-t-3xl"></div>
      </section>

      {/* Author Guide Section */}
      <section className="py-8 bg-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 ">
           

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-black to-yellow-300 text-white p-6">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="h-8 w-8 text-yellow-300" />
                    <div>
                      <h2 className="text-2xl font-bold">Author Overview</h2>
                      {/* <p className="text-yellow-200 text-sm">
                        Everything you need to know before submitting your manuscript
                      </p> */}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div 
                    className="blog-rich-text max-w-none"
                  
                  >
                    <div 
                      dangerouslySetInnerHTML={{ __html: data.author_guide }}
                      className="text-gray-700 leading-relaxed"
                    />
                  </div>

                
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     
    </div>
  );
};

export default JournalAuthorInformation;