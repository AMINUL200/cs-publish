import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    Globe
} from 'lucide-react';
import Breadcrumb from '../../../components/common/Breadcrumb';
import Loader from '../../../components/common/Loader';


const ResearchServiceDetail = () => {
    const { serviceId } = useParams();
    const [activeTab, setActiveTab] = useState('overview');
    const [currentStep, setCurrentStep] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);
    const [loading, setLoading] = useState(true)

    // Service data based on your original array
    const services = {
        1: {
            title: "Scientific Research Services",
            description: "Comprehensive research support from conception to publication with expert guidance throughout the entire research lifecycle.",
            icon: FileText,
            features: ["Research Design", "Data Analysis", "Statistical Support", "Methodology Consultation"],
            color: "from-blue-500 to-cyan-500",
            bgPattern: "bg-gradient-to-br from-blue-50 to-cyan-50",
            price: "$299 - $999",
            duration: "2-8 weeks",
            rating: 4.9,
            reviews: 156,
            detailed_features: [
                "Research methodology design and consultation",
                "Advanced statistical analysis and interpretation",
                "Data collection strategies and implementation",
                "Literature review and gap analysis",
                "Hypothesis development and testing",
                "Research proposal writing assistance"
            ],
            benefits: [
                "Expert guidance from PhD researchers",
                "Customized research design",
                "Statistical software support (SPSS, R, Python)",
                "24/7 consultation support",
                "Revision guarantee"
            ]
        },
        2: {
            title: "Scientific Publication Support",
            description: "End-to-end publication assistance including journal selection, submission process, and peer review management.",
            icon: BookOpen,
            features: ["Journal Selection", "Submission Management", "Peer Review Process", "Publication Strategy"],
            color: "from-purple-500 to-pink-500",
            bgPattern: "bg-gradient-to-br from-purple-50 to-pink-50",
            price: "$199 - $599",
            duration: "1-4 weeks",
            rating: 4.8,
            reviews: 203,
            detailed_features: [
                "Target journal identification and analysis",
                "Manuscript submission management",
                "Peer review process coordination",
                "Response to reviewer comments",
                "Publication timeline management",
                "Impact factor optimization"
            ],
            benefits: [
                "Higher acceptance rates",
                "Faster publication process",
                "Expert journal selection",
                "Professional submission handling",
                "Post-publication support"
            ]
        },
        3: {
            title: "Manuscript Writing/Editing Services",
            description: "Professional manuscript preparation and editing services to ensure your research meets the highest publication standards.",
            icon: Users,
            features: ["Professional Writing", "Language Editing", "Format Compliance", "Quality Assurance"],
            color: "from-green-500 to-teal-500",
            bgPattern: "bg-gradient-to-br from-green-50 to-teal-50",
            price: "$99 - $499",
            duration: "3-10 days",
            rating: 4.9,
            reviews: 342,
            detailed_features: [
                "Professional academic writing assistance",
                "Comprehensive language editing and proofreading",
                "Journal-specific formatting compliance",
                "Citation and reference management",
                "Abstract and summary optimization",
                "Multiple revision rounds included"
            ],
            benefits: [
                "Native English editors",
                "Subject matter expertise",
                "Plagiarism-free guarantee",
                "Quick turnaround time",
                "Unlimited revisions"
            ]
        },
        4: {
            title: "Industrial Consultation",
            description: "Expert consultation services bridging academia and industry with practical solutions for real-world challenges.",
            icon: Building,
            features: ["Industry Analysis", "Technical Consultation", "Project Management", "Strategic Planning"],
            color: "from-orange-500 to-red-500",
            bgPattern: "bg-gradient-to-br from-orange-50 to-red-50",
            price: "$499 - $1999",
            duration: "1-12 weeks",
            rating: 4.7,
            reviews: 89,
            detailed_features: [
                "Comprehensive industry analysis and market research",
                "Technical consultation and problem-solving",
                "Project management and timeline coordination",
                "Strategic planning and implementation guidance",
                "Technology transfer and commercialization",
                "Regulatory compliance assistance"
            ],
            benefits: [
                "Industry expert consultants",
                "Customized solutions",
                "Long-term partnership",
                "ROI-focused approach",
                "Confidentiality guaranteed"
            ]
        }
    };

    const currentService = services[serviceId];

    // Manuscript management workflow steps
    const workflowSteps = [
        {
            step: 1,
            title: "Author Submission",
            description: "Authors submit their manuscript through our secure platform with all required documents and metadata.",
            icon: Send,
            details: [
                "Upload manuscript files (DOC/PDF)",
                "Complete author information",
                "Select service type and preferences",
                "Provide research abstract and keywords"
            ],
            color: "from-blue-500 to-cyan-500"
        },
        {
            step: 2,
            title: "Editorial Review",
            description: "Our editorial team reviews the submission and assigns qualified reviewers based on expertise.",
            icon: UserCheck,
            details: [
                "Initial quality assessment",
                "Subject area identification",
                "Reviewer matching algorithm",
                "Timeline estimation and setup"
            ],
            color: "from-purple-500 to-pink-500"
        },
        {
            step: 3,
            title: "Peer Review Process",
            description: "Expert reviewers conduct thorough evaluation and provide comprehensive feedback.",
            icon: Eye,
            details: [
                "Double-blind peer review",
                "Expert feedback and suggestions",
                "Quality scoring and assessment",
                "Revision recommendations"
            ],
            color: "from-green-500 to-teal-500"
        },
        {
            step: 4,
            title: "Payment Processing",
            description: "Secure payment processing before final publication with flexible payment options.",
            icon: CreditCard,
            details: [
                "Transparent pricing structure",
                "Multiple payment methods",
                "Secure transaction processing",
                "Invoice and receipt generation"
            ],
            color: "from-orange-500 to-yellow-500"
        },
        {
            step: 5,
            title: "Final Publication",
            description: "Publication with DOI assignment, indexing, and global distribution.",
            icon: Globe,
            details: [
                "DOI assignment and registration",
                "Professional formatting and layout",
                "Global database indexing",
                "Author notification and certificates"
            ],
            color: "from-red-500 to-pink-500"
        }
    ];

    // Auto-play workflow animation
    useEffect(() => {
        let interval;
        if (isAutoPlay && activeTab === 'workflow') {
            interval = setInterval(() => {
                setCurrentStep((prev) => (prev + 1) % workflowSteps.length);
            }, 3000);
        }
        return () => clearInterval(interval);
    }, [isAutoPlay, activeTab]);

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

    if (!currentService) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h2>
                    <Link
                        to="/research-services"
                        className="text-blue-600 hover:text-blue-800">
                        ← Back to Services
                    </Link>
                </div>
            </div>
        );
    }

    const IconComponent = currentService.icon;

    return (
        <>
            <Breadcrumb
                items={[
                    { label: 'Home', path: '/', icon: 'home' },
                    { label: 'Research And Service', path: '/research-services', icon: 'file' },
                    { label: 'Research And Service Details' }
                ]}
                pageTitle="Research And Service Details"
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-4">
                {/* Header Section */}
                <div className={`relative overflow-hidden bg-gradient-to-r ${currentService.color}`}>
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
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="flex items-center text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(currentService.rating) ? 'fill-current' : ''}`} />
                                        ))}
                                        <span className="ml-2 text-white/90">{currentService.rating} ({currentService.reviews} reviews)</span>
                                    </div>
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                                    {currentService.title}
                                </h1>
                                <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl">
                                    {currentService.description}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        {currentService.price}
                                    </div>
                                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {currentService.duration}
                                    </div>
                                    <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                                        <Users className="w-4 h-4 mr-2" />
                                        Expert Team
                                    </div>
                                </div>
                            </div>

                            <div className="lg:w-80">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                                    <h3 className="text-xl font-semibold text-white mb-4">Quick Features</h3>
                                    <div className="space-y-3">
                                        {currentService.features.map((feature, index) => (
                                            <div key={index} className="flex items-center text-white/90">
                                                <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                                                {feature}
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
                                        Get Started Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <nav className="flex space-x-8">
                            {[
                                { id: 'overview', label: 'Overview', icon: FileText },
                                { id: 'workflow', label: 'Process Workflow', icon: ArrowRight },
                                { id: 'benefits', label: 'Benefits', icon: Award },
                                { id: 'pricing', label: 'Pricing', icon: DollarSign }
                            ].map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <TabIcon className="w-4 h-4 mr-2" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-6">Service Overview</h2>
                                <div className="space-y-4">
                                    {currentService.detailed_features.map((feature, index) => (
                                        <div key={index} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Service Highlights</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">24/7</div>
                                            <div className="text-sm text-gray-600">Support Available</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600">98%</div>
                                            <div className="text-sm text-gray-600">Success Rate</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-purple-600">500+</div>
                                            <div className="text-sm text-gray-600">Projects Done</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-orange-600">50+</div>
                                            <div className="text-sm text-gray-600">Expert Team</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg p-6 border">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h3>
                                    <div className="space-y-3">
                                        {currentService.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center">
                                                <Shield className="w-4 h-4 text-blue-500 mr-3" />
                                                <span className="text-gray-700">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'workflow' && (
                        <div>
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Manuscript Management Workflow</h2>
                                <p className="text-xl text-gray-600 mb-6">From submission to publication - our streamlined process</p>

                                <div className="flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => setIsAutoPlay(!isAutoPlay)}
                                        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${isAutoPlay
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                    >
                                        {isAutoPlay ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                        {isAutoPlay ? 'Pause' : 'Play'} Animation
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Workflow Steps */}
                                <div className="space-y-6">
                                    {workflowSteps.map((step, index) => {
                                        const StepIcon = step.icon;
                                        const isActive = currentStep === index;
                                        const isCompleted = currentStep > index;

                                        return (
                                            <div
                                                key={step.step}
                                                className={`relative cursor-pointer transition-all duration-500 ${isActive ? 'scale-105' : ''
                                                    }`}
                                                onClick={() => setCurrentStep(index)}
                                            >
                                                <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${isActive
                                                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                                                    : isCompleted
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                                    }`}>
                                                    <div className="flex items-start">
                                                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl mr-4 ${isActive
                                                            ? `bg-gradient-to-r ${step.color} text-white`
                                                            : isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-gray-100 text-gray-400'
                                                            }`}>
                                                            {isCompleted ? (
                                                                <CheckCircle className="w-6 h-6" />
                                                            ) : (
                                                                <StepIcon className="w-6 h-6" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center mb-2">
                                                                <span className={`text-sm font-medium px-2 py-1 rounded-full mr-3 ${isActive
                                                                    ? 'bg-blue-100 text-blue-800'
                                                                    : 'bg-gray-100 text-gray-600'
                                                                    }`}>
                                                                    Step {step.step}
                                                                </span>
                                                            </div>
                                                            <h3 className={`text-lg font-semibold mb-2 ${isActive ? 'text-blue-900' : 'text-gray-900'
                                                                }`}>
                                                                {step.title}
                                                            </h3>
                                                            <p className="text-gray-600 text-sm">
                                                                {step.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Connecting Line */}
                                                {index < workflowSteps.length - 1 && (
                                                    <div className={`absolute left-6 top-20 w-0.5 h-6 transition-colors duration-300 ${isCompleted ? 'bg-green-400' : 'bg-gray-300'
                                                        }`}></div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Active Step Details */}
                                <div className="lg:sticky lg:top-8">
                                    <div className={`bg-gradient-to-br ${workflowSteps[currentStep].color} rounded-2xl p-8 text-white`}>
                                        <div className="flex items-center mb-6">
                                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                                                <workflowSteps className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="text-sm opacity-90">Step {workflowSteps[currentStep].step} of {workflowSteps.length}</div>
                                                <h3 className="text-2xl font-bold">{workflowSteps[currentStep].title}</h3>
                                            </div>
                                        </div>

                                        <p className="text-white/90 mb-6 leading-relaxed">
                                            {workflowSteps[currentStep].description}
                                        </p>

                                        <div className="space-y-3">
                                            <h4 className="font-semibold text-lg mb-4">Key Activities:</h4>
                                            {workflowSteps[currentStep].details.map((detail, index) => (
                                                <div key={index} className="flex items-start">
                                                    <Zap className="w-4 h-4 mr-3 mt-1 flex-shrink-0 opacity-80" />
                                                    <span className="text-white/90">{detail}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-8">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm opacity-90">Progress</span>
                                                <span className="text-sm font-medium">{Math.round(((currentStep + 1) / workflowSteps.length) * 100)}%</span>
                                            </div>
                                            <div className="w-full bg-white/20 rounded-full h-2">
                                                <div
                                                    className="bg-white rounded-full h-2 transition-all duration-500"
                                                    style={{ width: `${((currentStep + 1) / workflowSteps.length) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'benefits' && (
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Service?</h2>
                                <h5 className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Discover the advantages that make our service the preferred choice for researchers worldwide
                                </h5>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {currentService.benefits.map((benefit, index) => (
                                    <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border">
                                        <div className={`w-12 h-12 bg-gradient-to-r ${currentService.color} rounded-xl flex items-center justify-center mb-4`}>
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit}</h3>
                                        <p className="text-gray-600">
                                            Professional service delivery with attention to detail and quality assurance.
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className={`bg-gradient-to-r ${currentService.color} rounded-2xl p-8 text-white`}>
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold mb-4">Ready to Experience Excellence?</h3>
                                    <h5 className="text-white/90 mb-6 max-w-2xl mx-auto">
                                        Join thousands of satisfied researchers who have successfully published their work with our expert assistance.
                                    </h5>
                                    <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors duration-200">
                                        Start Your Project Today
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'pricing' && (
                        <div className="space-y-12">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">Transparent Pricing</h2>
                                <p className="text-xl text-gray-600">
                                    Choose the package that best fits your research needs
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {['Basic', 'Standard', 'Premium'].map((tier, index) => (
                                    <div key={tier} className={`rounded-2xl p-8 border-2 ${index === 1
                                        ? `border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 relative`
                                        : 'border-gray-200 bg-white'
                                        } hover:shadow-lg transition-shadow duration-300`}>
                                        {index === 1 && (
                                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                                <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                                                    Most Popular
                                                </span>
                                            </div>
                                        )}

                                        <div className="text-center mb-8">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier}</h3>
                                            <div className="text-4xl font-bold text-blue-600 mb-1">
                                                ${['99', '299', '599'][index]}
                                            </div>
                                            <div className="text-gray-600">per project</div>
                                        </div>

                                        <div className="space-y-4 mb-8">
                                            {[
                                                'Basic service features',
                                                'Standard turnaround time',
                                                'Email support',
                                                index > 0 ? 'Priority processing' : null,
                                                index > 0 ? 'Advanced features' : null,
                                                index > 1 ? '24/7 phone support' : null,
                                                index > 1 ? 'Expedited delivery' : null
                                            ].filter(Boolean).map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center">
                                                    <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                                                    <span className="text-gray-700">{feature}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <button className={`w-full py-3 rounded-xl font-semibold transition-colors duration-200 ${index === 1
                                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                                            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                            }`}>
                                            Choose {tier}
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="text-center bg-gray-50 rounded-2xl p-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Need a Custom Solution?</h3>
                                <h5 className="text-gray-600 mb-6 max-w-2xl mx-auto">
                                    Contact our team for enterprise solutions, bulk projects, or specialized requirements.
                                    We offer flexible pricing for large-scale research collaborations.
                                </h5>
                                <button className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors duration-200">
                                    Contact Sales Team
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom CTA Section */}
                <div className={`bg-gradient-to-r ${currentService.color} py-16`}>
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Join thousands of researchers who trust our platform for their manuscript management needs
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg">
                                Start Your Project
                            </button>
                            <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
                                Schedule Consultation
                            </button>
                        </div>
                    </div>
                </div>

                {/* Related Services */}
                <div className="bg-gray-50 py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                            Related Services
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(services)
                                .filter(([id]) => id !== serviceId)
                                .slice(0, 3)
                                .map(([id, service]) => {
                                    const ServiceIcon = service.icon;
                                    return (
                                        <Link
                                            key={id}
                                            to={`/research-services/${id}`}
                                            className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border group"
                                        >
                                            <div className={`w-12 h-12 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                                <ServiceIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                                                {service.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4">
                                                {service.description}
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


            </div>
        </>

    );
};

export default ResearchServiceDetail;