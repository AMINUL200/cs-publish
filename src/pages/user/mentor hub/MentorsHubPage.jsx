import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faEye, faFilter, faSearch, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { Link } from 'react-router-dom';
import MediaRenderer from '../../../components/common/MediaRenderer';
import Loader from '../../../components/common/Loader';




const MentorsHubPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(true);

    // Sample articles data with different media types
    const articles = [
        {
            id: 1,
            title: "Building Stronger Communities Through Digital Collaboration",
            media: {
                type: "image",
                url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop"
            },
            category: "Community & Collab",
            views: 1247,
            comments: 23,
            excerpt: "Discover how modern tools are revolutionizing community building and collaborative efforts across different platforms."
        },
        {
            id: 2,
            title: "The Art of Creative Problem Solving in Modern Design",
            media: {
                type: "youtube",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Example YouTube URL
            },
            category: "Creative Crossroads",
            views: 892,
            comments: 15,
            excerpt: "Exploring innovative approaches to design challenges that bridge traditional artistry with contemporary needs."
        },
        {
            id: 3,
            title: "Finding Your Voice in Academic Writing",
            media: {
                type: "video",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" // Example video URL
            },
            category: "Pen & Purpose",
            views: 2156,
            comments: 34,
            excerpt: "A comprehensive guide to developing a distinctive writing style while maintaining academic rigor and clarity."
        },
        {
            id: 4,
            title: "Amplifying Marginalized Stories in Media",
            media: {
                type: "image",
                url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop"
            },
            category: "Voices Unheard",
            views: 1683,
            comments: 41,
            excerpt: "Understanding the importance of representation and how to create platforms for underrepresented voices."
        },
        {
            id: 5,
            title: "Experimental Writing Techniques for Fiction",
            media: {
                type: "youtube",
                url: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Example YouTube URL
            },
            category: "Writer's Lab",
            views: 756,
            comments: 19,
            excerpt: "Push the boundaries of storytelling with innovative narrative structures and experimental prose techniques."
        },
        {
            id: 6,
            title: "Collaborative Art Projects That Changed Communities",
            media: {
                type: "image",
                url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop"
            },
            category: "Community & Collab",
            views: 1034,
            comments: 27,
            excerpt: "Case studies of successful community art initiatives that brought lasting positive change to neighborhoods."
        },
        {
            id: 7,
            title: "Digital Art Meets Traditional Crafts",
            media: {
                type: "video",
                url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" // Example video URL
            },
            category: "Creative Crossroads",
            views: 1389,
            comments: 22,
            excerpt: "Exploring the fascinating intersection where digital creativity meets time-honored traditional crafting methods."
        },
        {
            id: 8,
            title: "The Power of Personal Essays in Social Change",
            media: {
                type: "image",
                url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop"
            },
            category: "Pen & Purpose",
            views: 943,
            comments: 31,
            excerpt: "How personal storytelling can drive meaningful social movements and inspire collective action."
        }
    ];

    const categories = [
        "Community & Collab",
        "Creative Crossroads",
        "Pen & Purpose",
        "Voices Unheard",
        "Writer's Lab"
    ];

    // Filter articles based on search and categories
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategories.length === 0 ||
                selectedCategories.includes(article.category);

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategories]);

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    };

     const [loading, setLoading] = useState(true)
    
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
            <Breadcrumb items={[
                { label: 'Home', path: '/', icon: 'home' },
                { label: 'Mentors Hub' }
            ]}
                pageTitle="Mentors Hub"
                pageDescription=""
            />
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-center items-center gap-2 ">

                        {/* Search Bar */}
                        <div className="relative max-w-2xl text-center flex-1">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar - Categories */}
                        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                                <div className="space-y-3">
                                    {categories.map((category) => (
                                        <label key={category} className="flex items-start gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                className="mt-1 w-4 h-4 text-blue-600  border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => handleCategoryChange(category)}
                                            />
                                            <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors leading-5">
                                                {category}
                                            </span>
                                        </label>
                                    ))}
                                </div>

                                {selectedCategories.length > 0 && (
                                    <button
                                        onClick={() => setSelectedCategories([])}
                                        className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Main Content - Articles Grid */}
                        <div className="flex-1">
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-gray-600">
                                    Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
                                </p>
                                {selectedCategories.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategories.map((category) => (
                                            <span
                                                key={category}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                {category}
                                                <button
                                                    onClick={() => handleCategoryChange(category)}
                                                    className="ml-2 hover:text-blue-600"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {filteredArticles.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No articles found matching your criteria.</p>
                                    <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredArticles.map((article) => (
                                        <div key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                                            {/* Article Media */}
                                            <div className="relative overflow-hidden">
                                                <MediaRenderer media={article.media} />
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-block px-2 py-1 bg-white bg-opacity-90 text-xs font-medium text-gray-700 rounded">
                                                        {article.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Article Content */}
                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                    {article.title}
                                                </h3>

                                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                    {article.excerpt}
                                                </p>

                                                {/* Stats and Button */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                                                            <span>{formatNumber(article.views)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={faMessage} className="w-4 h-4" />
                                                            <span>{article.comments}</span>
                                                        </div>
                                                    </div>

                                                    <Link
                                                        to={`/mentors/${article.id}`}
                                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                                        Read More
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default MentorsHubPage;