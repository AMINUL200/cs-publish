import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Star,
  Globe,
  Zap,
  FileText,
  Users,
  BookOpen,
  Building,
  ChevronRight,
  Award,
  Clock,
  Shield,
} from "lucide-react";
import Breadcrumb from "../../../components/common/Breadcrumb";
import { Link } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

const ResearchAndServicePage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const [heroData, setHeroData] = useState({});
  const [processData, setProcessData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  const stats = [
    {
      icon: CheckCircle,
      value: heroData?.project_number || "500+",
      label: "Projects Completed",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Star,
      value: heroData?.client_satisfaction || "98%",
      label: "Client Satisfaction",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Globe,
      value: heroData?.no_of_country || "50+",
      label: "Countries Served",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: Zap,
      value: heroData?.support || "24/7",
      label: "Support Available",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/research-services`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.status) {
        setHeroData(response.data.data.service);
        setServiceData(response.data.data.rs_products);
        setProcessData(response.data.data.manuscript_processes);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedProcessData = processData
    ?.filter((item) => item.is_active)
    ?.sort((a, b) => Number(a.stage) - Number(b.stage));

  const activeServices = serviceData?.filter((item) => item.is_active);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          { label: "Research And Service" },
        ]}
        pageTitle="Research And Service"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>

          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400/15 to-blue-400/15 animate-pulse delay-500"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {heroData?.f_heading || "Our Service"}
              </h1>
              <h5
                className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
                dangerouslySetInnerHTML={{ __html: heroData?.desc }}
              ></h5>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative -mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border border-gray-100"
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-4`}
                  >
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Services Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {heroData?.s_heading}
            </h2>
            <h5
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: heroData?.s_desc }}
            ></h5>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activeServices?.map((service) => {
              const imageObj = service.images?.find((img) => img.is_active);
              const imageUrl = imageObj
                ? `${STORAGE_URL}${imageObj.image}`
                : null;

              return (
                <Link
                  key={service.id}
                  to={`/research-services/${service.slug}`}
                  className="group relative overflow-hidden rounded-3xl bg-white p-8 cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl border border-gray-100"
                >
                  {/* Optional Image */}
                  {imageUrl && (
                    <div className="mb-6 overflow-hidden rounded-xl">
                      <img
                        src={imageUrl}
                        alt={imageObj?.image_alt || service.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Rating & Reviews */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-yellow-500">
                      <Star className="w-5 h-5 mr-1" />
                      <span className="font-semibold">{service.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {service.number_of_review} Reviews
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {service.name}
                  </h3>

                  {/* Short Description */}
                  <div
                    className="text-gray-600 mb-6 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: service.s_desc }}
                  />

                  {/* Learn More */}
                  <div className="flex items-center text-blue-600 font-semibold">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Process Flow Section */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Manuscript Management Process
              </h2>
              <p className="text-xl text-gray-600">
                From submission to publication - a streamlined process for
                quality research
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {sortedProcessData?.map((process, index) => (
                <div key={process.id} className="relative">
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                    <div className="text-3xl font-bold text-blue-600 mb-3">
                      {process.stage}
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {process.title}
                    </h3>

                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{ __html: process.description }}
                    />
                  </div>

                  {index < sortedProcessData.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-8 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResearchAndServicePage;
