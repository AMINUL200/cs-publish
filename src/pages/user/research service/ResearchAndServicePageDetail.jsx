import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle,
  Star,
  Clock,
  Users,
  FileText,
  BookOpen,
  Building,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  Award,
  Shield,
  Zap,
  DollarSign,
  Send,
  UserCheck,
  Eye,
  CreditCard,
  Globe,
} from "lucide-react";
import Breadcrumb from "../../../components/common/Breadcrumb";
import Loader from "../../../components/common/Loader";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { File } from "lucide-react";

const ResearchServiceDetail = () => {
  const { serviceId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentStep, setCurrentStep] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [serviceData, setServiceData] = useState(null);
  const [relatedServices, setRelatedServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);

  // Icon mapping for different categories
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Process Workflow': ArrowRight,
      'Benefits': Award,
      'Overview': FileText,
    };
    return iconMap[category] || FileText;
  };

  // Get step icon for workflow steps
  const getStepIcon = (title) => {
    const iconMap = {
      'Author Submission': Send,
      'Editorial Review': UserCheck,
      'Peer Review Proces': Eye,
      'Payment Processing': CreditCard,
      'Final Publication': Globe,
    };
    return iconMap[title] || FileText;
  };

  // Get color based on index
  const getStepColor = (index) => {
    const colors = [
      "from-blue-500 to-cyan-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-teal-500",
      "from-orange-500 to-yellow-500",
      "from-red-500 to-pink-500",
    ];
    return colors[index % colors.length];
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}api/research-services-details/${serviceId}`,{
        headers: {
           "Cache-Control": "no-cache",
          Pragma: "no-cache",
        }
      });

      if (response.data.status) {
        console.log(response.data);
        setServiceData(response.data.data);
        setRelatedServices(response.data.related_service || []);
        
        // Extract unique categories from features
        if (response.data.data.features) {
          const uniqueCategories = [...new Set(
            response.data.data.features.map(feature => feature.catagory)
          )];
          setCategories(uniqueCategories);
          
          // Set active tab to first category if exists, otherwise keep overview
          if (uniqueCategories.length > 0 && uniqueCategories[0] !== 'Overview') {
            setActiveTab(uniqueCategories[0].toLowerCase().replace(/\s+/g, ''));
          }
        }
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
  }, [serviceId]);

  // Auto-play workflow animation
  useEffect(() => {
    let interval;
    const workflowFeatures = serviceData?.features?.filter(
      f => f.catagory === "Process Workflow" && f.is_active
    ) || [];
    
    if (isAutoPlay && activeTab === "processworkflow" && workflowFeatures.length > 0) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % workflowFeatures.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlay, activeTab, serviceData]);

  if (loading) {
    return <Loader />;
  }

  if (!serviceData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h2>
          <Link
            to="/research-services"
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // Get main image
  const mainImage = serviceData.images?.find(img => img.is_active) || serviceData.images?.[0];
  
  // Filter features by category
  const overviewFeatures = serviceData.features?.filter(
    f => f.catagory === "Overview" && f.is_active
  ) || [];
  
  const workflowFeatures = serviceData.features?.filter(
    f => f.catagory === "Process Workflow" && f.is_active
  ) || [];
  
  const benefitsFeatures = serviceData.features?.filter(
    f => f.catagory === "Benefits" && f.is_active
  ) || [];

  // Parse rating and reviews
  const rating = parseFloat(serviceData.rating) || 4.0;
  const reviews = parseInt(serviceData.number_of_review) || 0;

  // Parse short description (remove HTML tags if needed)
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const shortDescription = serviceData.s_desc ? stripHtml(serviceData.s_desc) : "";

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", path: "/", icon: "home" },
          {
            label: "Research And Service",
            path: "/research-services",
            icon: "file",
          },
          { label: serviceData.name || "Research And Service Details" },
        ]}
        pageTitle={serviceData.name || "Research And Service Details"}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-4">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-cyan-500">
          <div className="absolute inset-0 bg-black opacity-40"></div>

          {/* Background Animation */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 animate-pulse"></div>
            <div className="absolute top-1/2 -left-20 w-60 h-60 rounded-full bg-white/5 animate-pulse delay-1000"></div>
            <div className="absolute bottom-10 right-1/4 w-32 h-32 rounded-full bg-white/10 animate-pulse delay-500"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  {mainImage && (
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4 overflow-hidden">
                      <img 
                        src={`${STORAGE_URL}${mainImage.image}`} 
                        alt={mainImage.image_alt || serviceData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-current" : ""}`}
                      />
                    ))}
                    <span className="ml-2 text-white/90">
                      {rating.toFixed(1)} ({reviews} reviews)
                    </span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {serviceData.name}
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl">
                  {shortDescription}
                </p>

                <div className="flex flex-wrap gap-4">
                  
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <Users className="w-4 h-4 mr-2" />
                    Expert Team
                  </div>
                  <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                    <File className="w-4 h-4 mr-2" />
                    Review {serviceData?.number_of_review}+
                  </div>
                </div>
              </div>

              <div className="lg:w-80">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Quick Features
                  </h3>
                  <div className="space-y-3">
                    {serviceData.l_desc && (
                      <div 
                        className="text-white/90 text-sm"
                        dangerouslySetInnerHTML={{ __html: serviceData.l_desc }}
                      />
                    )}
                  </div>
                  <button className="w-full mt-6 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Dynamic from categories */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
            <nav className="flex space-x-8 min-w-max">
              {/* Always show Overview tab */}
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Overview
              </button>

              {/* Dynamic tabs from categories */}
              {categories.map((category) => {
                if (category === 'Overview') return null; // Skip Overview as we already have it
                const CategoryIcon = getCategoryIcon(category);
                const tabId = category.toLowerCase().replace(/\s+/g, '');
                return (
                  <button
                    key={category}
                    onClick={() => setActiveTab(tabId)}
                    className={`flex items-center py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tabId
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <CategoryIcon className="w-4 h-4 mr-2" />
                    {category}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Service Overview
                </h2>
                {overviewFeatures.map((feature) => (
                  <div key={feature.id} className="space-y-4">
                    {feature.long_desc && (
                      <div 
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: feature.long_desc }}
                      />
                    )}
                    {feature.desc && (
                      <div className="whitespace-pre-line text-gray-700">
                        {feature.desc}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                {/* Service Highlights from overview feature badges */}
                {overviewFeatures.map((feature) => (
                  (feature.badge1 || feature.badge2 || feature.badge3) && (
                    <div key={feature.id} className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Service Highlights
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {feature.badge1 && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {feature.badge1}
                            </div>
                          </div>
                        )}
                        {feature.badge2 && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                              {feature.badge2}
                            </div>
                          </div>
                        )}
                        {feature.badge3 && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              {feature.badge3}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ))}

                {/* What's Included from overview feature */}
                {overviewFeatures.map((feature) => (
                  feature.title && (
                    <div key={feature.id} className="bg-white rounded-2xl shadow-lg p-6 border">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                      <div className="space-y-3">
                        {feature.desc && (
                          <div className="whitespace-pre-line text-gray-700">
                            {feature.desc}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Process Workflow Tab */}
          {activeTab === "processworkflow" && workflowFeatures.length > 0 && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Manuscript Management Workflow
                </h2>
                <p className="text-xl text-gray-600 mb-6">
                  From submission to publication - our streamlined process
                </p>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIsAutoPlay(!isAutoPlay)}
                    className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                      isAutoPlay
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {isAutoPlay ? (
                      <Pause className="w-4 h-4 mr-2" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    {isAutoPlay ? "Pause" : "Play"} Animation
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Workflow Steps */}
                <div className="space-y-6">
                  {workflowFeatures.map((step, index) => {
                    const StepIcon = getStepIcon(step.title);
                    const isActive = currentStep === index;
                    const isCompleted = currentStep > index;
                    const stepColor = getStepColor(index);

                    return (
                      <div
                        key={step.id}
                        className={`relative cursor-pointer transition-all duration-500 ${
                          isActive ? "scale-105" : ""
                        }`}
                        onClick={() => setCurrentStep(index)}
                      >
                        <div
                          className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                            isActive
                              ? "border-blue-500 bg-blue-50 shadow-lg"
                              : isCompleted
                                ? "border-green-300 bg-green-50"
                                : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-start">
                            <div
                              className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 ${
                                isActive
                                  ? `bg-gradient-to-r ${stepColor} text-white`
                                  : isCompleted
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="w-6 h-6" />
                              ) : (
                                <StepIcon className="w-6 h-6" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <span
                                  className={`text-sm font-medium px-2 py-1 rounded-full mr-3 ${
                                    isActive
                                      ? "bg-blue-100 text-blue-800"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  Step {index + 1}
                                </span>
                              </div>
                              <h3
                                className={`text-lg font-semibold mb-2 ${
                                  isActive ? "text-blue-900" : "text-gray-900"
                                }`}
                              >
                                {step.title}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Connecting Line */}
                        {index < workflowFeatures.length - 1 && (
                          <div
                            className={`absolute left-6 top-20 w-0.5 h-6 transition-colors duration-300 ${
                              isCompleted ? "bg-green-400" : "bg-gray-300"
                            }`}
                          ></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Active Step Details */}
                <div className="lg:sticky lg:top-8">
                  <div
                    className={`bg-gradient-to-br ${getStepColor(currentStep)} rounded-2xl p-8 text-white`}
                  >
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                        {React.createElement(getStepIcon(workflowFeatures[currentStep]?.title), { className: "w-8 h-8" })}
                      </div>
                      <div>
                        <div className="text-sm opacity-90">
                          Step {currentStep + 1} of {workflowFeatures.length}
                        </div>
                        <h3 className="text-2xl font-bold">
                          {workflowFeatures[currentStep]?.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-white/90 mb-6 leading-relaxed">
                      {workflowFeatures[currentStep]?.desc}
                    </p>

                    {workflowFeatures[currentStep]?.long_desc && (
                      <div 
                        className="space-y-3 text-white/90"
                        dangerouslySetInnerHTML={{ __html: workflowFeatures[currentStep].long_desc }}
                      />
                    )}

                    {/* Badges */}
                    {(workflowFeatures[currentStep]?.badge1 || 
                      workflowFeatures[currentStep]?.badge2 || 
                      workflowFeatures[currentStep]?.badge3) && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {workflowFeatures[currentStep].badge1 && (
                          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            {workflowFeatures[currentStep].badge1}
                          </span>
                        )}
                        {workflowFeatures[currentStep].badge2 && (
                          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            {workflowFeatures[currentStep].badge2}
                          </span>
                        )}
                        {workflowFeatures[currentStep].badge3 && (
                          <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                            {workflowFeatures[currentStep].badge3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-8">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm opacity-90">Progress</span>
                        <span className="text-sm font-medium">
                          {Math.round(((currentStep + 1) / workflowFeatures.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-white rounded-full h-2 transition-all duration-500"
                          style={{
                            width: `${((currentStep + 1) / workflowFeatures.length) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Benefits Tab */}
          {activeTab === "benefits" && benefitsFeatures.length > 0 && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Why Choose Our Service?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Discover the advantages that make our service the preferred
                  choice for researchers worldwide
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {benefitsFeatures.map((benefit, index) => (
                  <div
                    key={benefit.id}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4`}
                    >
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Experience Excellence?
                  </h3>
                  <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                    Join thousands of satisfied researchers who have
                    successfully published their work with our expert
                    assistance.
                  </p>
                  <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
                    Start Your Project Today
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

       

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                Related Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedServices.map((service) => {
                  // Determine icon based on service name
                  let ServiceIcon = FileText;
                  if (service.name?.toLowerCase().includes('scientific')) ServiceIcon = FileText;
                  else if (service.name?.toLowerCase().includes('publication')) ServiceIcon = BookOpen;
                  else if (service.name?.toLowerCase().includes('manuscript')) ServiceIcon = Users;
                  else if (service.name?.toLowerCase().includes('industrial')) ServiceIcon = Building;

                  return (
                    <Link
                      key={service.id}
                      to={`/research-services/${service.slug}`}
                      className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border group"
                    >
                      <div
                        className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                      >
                        <ServiceIcon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">
                        {service.s_desc ? stripHtml(service.s_desc).substring(0, 100) + '...' : ''}
                      </p>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResearchServiceDetail;