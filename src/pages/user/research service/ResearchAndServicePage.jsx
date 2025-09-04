import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Globe, Zap, FileText, Users, BookOpen, Building, ChevronRight, Award, Clock, Shield } from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { Link } from 'react-router-dom';
import Loader from '../../../components/common/Loader';


const ResearchAndServicePage = () => {
    const [hoveredCard, setHoveredCard] = useState(null);
     const [loading, setLoading] = useState(true)
    

    const stats = [
        {
            icon: CheckCircle,
            value: "500+",
            label: "Projects Completed",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            icon: Star,
            value: "98%",
            label: "Client Satisfaction",
            color: "text-purple-600",
            bgColor: "bg-purple-50"
        },
        {
            icon: Globe,
            value: "50+",
            label: "Countries Served",
            color: "text-green-600",
            bgColor: "bg-green-50"
        },
        {
            icon: Zap,
            value: "24/7",
            label: "Support Available",
            color: "text-orange-600",
            bgColor: "bg-orange-50"
        }
    ];

    const services = [
        {
            id: 1,
            title: "Scientific Research Services",
            description: "Comprehensive research support from conception to publication with expert guidance throughout the entire research lifecycle.",
            icon: FileText,
            features: ["Research Design", "Data Analysis", "Statistical Support", "Methodology Consultation"],
            color: "from-blue-500 to-cyan-500",
            bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50"
        },
        {
            id: 2,
            title: "Scientific Publication Support",
            description: "End-to-end publication assistance including journal selection, submission process, and peer review management.",
            icon: BookOpen,
            features: ["Journal Selection", "Submission Management", "Peer Review Process", "Publication Strategy"],
            color: "from-purple-500 to-pink-500",
            bgPattern: "bg-gradient-to-br from-purple-50 to-pink-50"
        },
        {
            id: 3,
            title: "Manuscript Writing/Editing Services",
            description: "Professional manuscript preparation and editing services to ensure your research meets the highest publication standards.",
            icon: Users,
            features: ["Professional Writing", "Language Editing", "Format Compliance", "Quality Assurance"],
            color: "from-green-500 to-teal-500",
            bgPattern: "bg-gradient-to-br from-green-50 to-teal-50"
        },
        {
            id: 4,
            title: "Industrial Consultation",
            description: "Expert consultation services bridging academia and industry with practical solutions for real-world challenges.",
            icon: Building,
            features: ["Industry Analysis", "Technical Consultation", "Project Management", "Strategic Planning"],
            color: "from-orange-500 to-red-500",
            bgPattern: "bg-gradient-to-br from-orange-50 to-red-50"
        }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        // Simulate API call with setTimeout
        const timer = setTimeout(() => {

            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />
    }


    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Home', path: '/', icon: 'home' },
                    { label: 'Research And Service' }
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
                                Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Services</span>
                            </h1>
                            <h5 className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                                Comprehensive manuscript management and research services from submission to publication.
                                We support authors, editors, and reviewers throughout the entire publishing lifecycle.
                            </h5>
                            <div className="flex flex-wrap justify-center gap-4">
                                <div className="flex items-center text-cyan-400 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Award className="w-5 h-5 mr-2" />
                                    <span>Expert Reviews</span>
                                </div>
                                <div className="flex items-center text-cyan-400 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Clock className="w-5 h-5 mr-2" />
                                    <span>Fast Turnaround</span>
                                </div>
                                <div className="flex items-center text-cyan-400 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Shield className="w-5 h-5 mr-2" />
                                    <span>Quality Assured</span>
                                </div>
                            </div>
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
                                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.bgColor} mb-4`}>
                                        <IconComponent className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                    <div className={`text-4xl font-bold ${stat.color} mb-2`}>
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Services Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Professional Research Services
                        </h2>
                        <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Choose from our comprehensive range of services designed to support every aspect of your research and publication journey
                        </h5>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {services.map((service, index) => {
                            const IconComponent = service.icon;
                            return (
                                <Link
                                    key={service.id}
                                    className={`group relative overflow-hidden rounded-3xl ${service.bgPattern} p-8 cursor-pointer transform hover:scale-105 transition-all duration-500 hover:shadow-2xl border border-white/50`}
                                    onMouseEnter={() => setHoveredCard(service.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    to={`/research-services/${service.id}`}
                                >
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                                    {/* Animated Background Pattern */}
                                    <div className="absolute inset-0 opacity-5">
                                        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-white to-transparent transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-700"></div>
                                        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-gradient-to-tr from-white to-transparent transform -translate-x-12 translate-y-12 group-hover:scale-150 transition-transform duration-700 delay-100"></div>
                                    </div>

                                    <div className="relative z-10">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} text-white shadow-lg`}>
                                                <IconComponent className="w-8 h-8" />
                                            </div>
                                            <ChevronRight className={`w-6 h-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all duration-300 ${hoveredCard === service.id ? 'text-gray-700' : ''}`} />
                                        </div>

                                        <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                                            {service.title}
                                        </h3>

                                        <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                                            {service.description}
                                        </p>

                                        <div className="grid grid-cols-2 gap-3">
                                            {service.features.map((feature, featureIndex) => (
                                                <div
                                                    key={featureIndex}
                                                    className="flex items-center text-sm text-gray-700 group-hover:text-gray-800 transition-colors duration-300"
                                                >
                                                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-2 shadow-sm`}></div>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-gray-200/50">
                                            <button className={`inline-flex items-center text-sm font-semibold bg-gradient-to-r ${service.color} bg-clip-text text-transparent group-hover:text-gray-800 transition-colors duration-300`}>
                                                Learn More
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Hover Effect Border */}
                                    <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r ${service.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
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
                                From submission to publication - a streamlined process for quality research
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {[
                                { step: "01", title: "Author Submission", desc: "Authors submit manuscripts through our platform" },
                                { step: "02", title: "Editorial Review", desc: "Editors review and assign manuscripts to qualified reviewers" },
                                { step: "03", title: "Peer Review", desc: "Expert reviewers provide comprehensive feedback and recommendations" },
                                { step: "04", title: "Publication", desc: "Accepted manuscripts are published with full support" }
                            ].map((process, index) => (
                                <div key={index} className="relative">
                                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                                        <div className="text-3xl font-bold text-blue-600 mb-3">{process.step}</div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{process.title}</h3>
                                        <p className="text-gray-600">{process.desc}</p>
                                    </div>
                                    {index < 3 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-4xl font-bold text-white mb-6">
                            Ready to Start Your Research Journey?
                        </h2>
                        <p className="text-xl text-gray-300 mb-8">
                            Join thousands of researchers who trust our platform for their manuscript management needs
                        </p>
                        <button className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-cyan-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            Get Started Today
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
};

export default ResearchAndServicePage;