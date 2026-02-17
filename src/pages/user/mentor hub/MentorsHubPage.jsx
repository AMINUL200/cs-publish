import React, { useState, useMemo, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faEye, faFilter, faSearch, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../../components/common/Breadcrumb';
import { Link } from 'react-router-dom';
import MediaRenderer from '../../../components/common/MediaRenderer';
import Loader from '../../../components/common/Loader';
import axios from 'axios';

const MentorsHubPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [showFilters, setShowFilters] = useState(true);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;
    const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;

    // Fetch real data from API
    useEffect(() => {
        const fetchMentorsData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}api/event/latest`);
                
                if (response.data.status) {
                    // Combine latest and most_view arrays, remove duplicates based on slug
                    const latestArticles = response.data.latest || [];
                    const mostViewedArticles = response.data.most_view || [];
                    
                    // Combine and remove duplicates
                    const allArticles = [...latestArticles, ...mostViewedArticles];
                    const uniqueArticles = allArticles.filter((article, index, self) =>
                        index === self.findIndex(a => a.slug === article.slug)
                    );
                    
                    // Transform API data to match component structure
                    const transformedArticles = uniqueArticles.map((article, index) => ({
                        id: index + 1,
                        title: article.title,
                        media: {
                            type: getMediaType(article.image_video),
                            url: `${STORAGE_URL}${article.image_video}`
                        },
                        category: article.catagory,
                        views: Math.floor(Math.random() * 2000) + 500, // Random views for demo
                        comments: Math.floor(Math.random() * 50) + 5, // Random comments for demo
                        excerpt: article.description,
                        slug: article.slug,
                        created_at: article.created_at
                    }));
                    
                    setArticles(transformedArticles);
                } else {
                    throw new Error('Failed to fetch mentors data');
                }
            } catch (error) {
                console.error('Error fetching mentors data:', error);
                setError(error.response?.data?.message || 'Failed to load mentors hub data');
            } finally {
                setLoading(false);
            }
        };

        fetchMentorsData();
        window.scrollTo(0, 0);
    }, []);

    // Function to determine media type based on URL
    const getMediaType = (url) => {
        if (!url) return 'image'; // Default to image if no URL
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return 'youtube';
        } else if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg')) {
            return 'video';
        } else {
            return 'image';
        }
    };

    // Get unique categories from articles
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(articles.map(article => article.category))];
        return uniqueCategories.filter(category => category && category.trim() !== '');
    }, [articles]);

    // Filter articles based on search and categories
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategories.length === 0 ||
                selectedCategories.includes(article.category);

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategories, articles]);

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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
            <>
                <Breadcrumb items={[
                    { label: 'Home', path: '/', icon: 'home' },
                    { label: 'Mentors Hub' }
                ]}
                    pageTitle="Mentors Hub"
                    pageDescription=""
                />
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Content</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-yellow-500 text-black px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Breadcrumb items={[
                { label: 'Home', path: '/', icon: 'home' },
                { label: 'Mentors Hub' }
            ]}
                pageTitle="Mentors Hub"
                pageDescription="Explore our collection of mentor events, workshops, and resources"
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
                                placeholder="Search events and articles..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                            <FontAwesomeIcon icon={faFilter} className="w-4 h-4" />
                            Filters
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar - Categories */}
                        {categories.length > 0 && (
                            <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                                    <div className="space-y-3">
                                        {categories.map((category) => (
                                            <label key={category} className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    className="mt-1 w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
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
                                            className="mt-4 text-sm text-yellow-600 hover:text-yellow-800 font-medium"
                                        >
                                            Clear all filters
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Main Content - Articles Grid */}
                        <div className="flex-1">
                            <div className="mb-6 flex items-center justify-between">
                                <p className="text-gray-600">
                                    Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'event' : 'events'}
                                </p>
                                {selectedCategories.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCategories.map((category) => (
                                            <span
                                                key={category}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                                            >
                                                {category}
                                                <button
                                                    onClick={() => handleCategoryChange(category)}
                                                    className="ml-2 hover:text-yellow-600"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {filteredArticles.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg">
                                    <p className="text-gray-500 text-lg">No events found matching your criteria.</p>
                                    <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {filteredArticles.map((article) => (
                                        <div key={article.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                                            {/* Article Media */}
                                            <div className="relative overflow-hidden">
                                                <MediaRenderer 
                                                    media={article.media} 
                                                    className="w-full h-48 object-cover"
                                                />
                                                <div className="absolute top-3 left-3">
                                                    <span className="inline-block px-2 py-1 bg-white bg-opacity-90 text-xs font-medium text-gray-700 rounded">
                                                        {article.category}
                                                    </span>
                                                </div>
                                                <div className="absolute top-3 right-3">
                                                    <span className="inline-block px-2 py-1 bg-black bg-opacity-70 text-xs font-medium text-white rounded">
                                                        {formatDate(article.created_at)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Article Content */}
                                            <div className="p-6">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-yellow-600 transition-colors">
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
                                                        to={`/mentors/${article.slug}`}
                                                        className="px-4 py-2 bg-yellow-500 text-white text-sm font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                                                    >
                                                        View Details
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