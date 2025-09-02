import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faEye, faFilter, faList,  faSearch,  faTh, faX,  } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../../components/common/Breadcrumb';
import BookCard from '../../../components/user/book card/BookCard';

// Dummy book data
const dummyBooks = [
    {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        category: "Novels",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop",
        price: 24.99,
        discountPrice: 18.99,
        discount: 24,
        rating: 4.5,
        buyers: 1234,
        format: "Hardcover",
        language: "English",
        country: "UK",
        condition: "New",
        publisher: "Canongate",
        isNewArrival: true
    },
    {
        id: 2,
        title: "Dune",
        author: "Frank Herbert",
        category: "Science Fiction & Fantasy",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        price: 29.99,
        discountPrice: 22.49,
        discount: 25,
        rating: 4.8,
        buyers: 2156,
        format: "Paperback",
        language: "English",
        country: "USA",
        condition: "New",
        publisher: "Ace Books",
        isNewArrival: false
    },
    {
        id: 3,
        title: "The Power of Now",
        author: "Eckhart Tolle",
        category: "Spirituality",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        price: 19.99,
        discountPrice: 14.99,
        discount: 25,
        rating: 4.3,
        buyers: 897,
        format: "Paperback",
        language: "English",
        country: "Canada",
        condition: "New",
        publisher: "New World Library",
        isNewArrival: false
    },
    {
        id: 4,
        title: "Yoga Body",
        author: "Mark Singleton",
        category: "Yoga and Meditation",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop",
        price: 22.99,
        discountPrice: 17.99,
        discount: 22,
        rating: 4.1,
        buyers: 543,
        format: "Paperback",
        language: "English",
        country: "USA",
        condition: "New",
        publisher: "Oxford University Press",
        isNewArrival: true
    },
    {
        id: 5,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Lifestyle",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
        price: 27.99,
        discountPrice: 21.99,
        discount: 21,
        rating: 4.7,
        buyers: 3421,
        format: "Hardcover",
        language: "English",
        country: "USA",
        condition: "New",
        publisher: "Avery",
        isNewArrival: true
    },
    {
        id: 6,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Psychology",
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
        price: 25.99,
        discountPrice: 19.99,
        discount: 23,
        rating: 4.6,
        buyers: 1876,
        format: "Paperback",
        language: "English",
        country: "USA",
        condition: "New",
        publisher: "Harriman House",
        isNewArrival: false
    },
    {
        id: 7,
        title: "Batman: The Killing Joke",
        author: "Alan Moore",
        category: "Comic",
        image: "https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=300&h=400&fit=crop",
        price: 15.99,
        discountPrice: 12.99,
        discount: 19,
        rating: 4.4,
        buyers: 967,
        format: "Paperback",
        language: "English",
        country: "USA",
        condition: "New",
        publisher: "DC Comics",
        isNewArrival: false
    },
    {
        id: 8,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        category: "Love and Romance",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
        price: 16.99,
        discountPrice: 12.99,
        discount: 24,
        rating: 4.5,
        buyers: 2341,
        format: "Paperback",
        language: "English",
        country: "UK",
        condition: "New",
        publisher: "Penguin Classics",
        isNewArrival: false
    }
];

const categories = [
    "Story", "Novels", "Poetry", "Science Fiction & Fantasy", "Adventure",
    "Spirituality", "Health and Fitness", "Yoga and Meditation", "Science Fiction",
    "Psychology", "Comic", "Drama", "Crime story", "leadership", "Lifestyle",
    "Non Fiction", "Music", "Love and Romance", "Sports"
];

const sortingOptions = [
    "Price low - high", "Price high - low", "A-Z", "Discount",
    "Payment options", "Format", "Language", "Country", "Condition",
    "New arrivals", "Author", "Publisher"
];

const BookStorePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchBy, setSearchBy] = useState('title');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(true);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter and sort books
    const filteredAndSortedBooks = useMemo(() => {
        let filtered = dummyBooks.filter(book => {
            const matchesSearch = searchBy === 'title'
                ? book.title.toLowerCase().includes(searchTerm.toLowerCase())
                : book.author.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = !selectedCategory || book.category === selectedCategory;
            const matchesPrice = book.discountPrice >= priceRange.min && book.discountPrice <= priceRange.max;

            return matchesSearch && matchesCategory && matchesPrice;
        });

        // Sort books
        switch (sortBy) {
            case 'Price low - high':
                return filtered.sort((a, b) => a.discountPrice - b.discountPrice);
            case 'Price high - low':
                return filtered.sort((a, b) => b.discountPrice - a.discountPrice);
            case 'A-Z':
                return filtered.sort((a, b) => a.title.localeCompare(b.title));
            case 'Discount':
                return filtered.sort((a, b) => b.discount - a.discount);
            case 'New arrivals':
                return filtered.sort((a, b) => b.isNewArrival - a.isNewArrival);
            case 'Author':
                return filtered.sort((a, b) => a.author.localeCompare(b.author));
            case 'Publisher':
                return filtered.sort((a, b) => a.publisher.localeCompare(b.publisher));
            default:
                return filtered;
        }
    }, [searchTerm, searchBy, selectedCategory, sortBy, priceRange]);



    return (
        <>
        
            <Breadcrumb items={[
                { label: 'Home', path: '/', icon: 'home' },
                { label: 'Book Store' }
            ]}
                pageTitle="Book Store"
                pageDescription="Discover your next great read from our curated collection"
            />
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Sidebar - Filters for large screens */}
                    <div className={`hidden lg:block bg-white rounded-xl shadow-sm p-6 h-fit transition-all duration-300 ${showFilters ? 'w-80' : 'w-12'} sticky top-24`}>

                        {/* Filter Toggle Header */}
                        <div className="flex items-center justify-between mb-6">
                            {showFilters && <h2 className="text-xl font-semibold text-gray-900">Filters</h2>}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FontAwesomeIcon icon={faFilter} className="text-gray-600" />
                            </button>
                        </div>

                        {/* Filters Content */}
                        {showFilters && (
                            <div className="space-y-6">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Default</option>
                                        {sortingOptions.map(option => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                    <div className="space-y-2">
                                        <input
                                            type="number"
                                            placeholder="Min Price"
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max Price"
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Clear Filters */}
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setSortBy('');
                                        setSearchTerm('');
                                        setPriceRange({ min: 0, max: 100 });
                                    }}
                                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200 cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faX} className="text-sm" />
                                    <span>Clear All Filters</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Search and Controls */}
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                            <div className="flex flex-col lg:flex-row gap-4 items-center">
                                {/* Mobile Filter Toggle Button */}
                                <button
                                    className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                >
                                    <FontAwesomeIcon icon={faFilter} />
                                    <span>Filters</span>
                                </button>

                                {/* Search */}
                                <div className="flex-1 flex">
                                    <div className="relative flex-1">
                                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder={`Search by ${searchBy}...`}
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <select
                                        value={searchBy}
                                        onChange={(e) => setSearchBy(e.target.value)}
                                        className="px-4 py-3 border-t border-r border-b border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                                    >
                                        <option value="title">Title</option>
                                        <option value="author">Author</option>
                                    </select>
                                </div>

                                {/* View Mode Toggle */}
                                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                    >
                                        <FontAwesomeIcon icon={faTh} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                                    >
                                        <FontAwesomeIcon icon={faList} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Filters - Bottom Fixed */}
                        {showMobileFilters && (
                            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg rounded-t-xl z-50 max-h-80 overflow-y-auto">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Filters</h3>
                                    <button onClick={() => setShowMobileFilters(false)}>
                                        <FontAwesomeIcon icon={faX} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Category Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All Categories</option>
                                            {categories.map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Sort Filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Default</option>
                                            {sortingOptions.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price Range */}
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                type="number"
                                                placeholder="Min Price"
                                                value={priceRange.min}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                            />
                                            <input
                                                type="number"
                                                placeholder="Max Price"
                                                value={priceRange.max}
                                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Clear Filters */}
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('');
                                            setSortBy('');
                                            setSearchTerm('');
                                            setPriceRange({ min: 0, max: 100 });
                                        }}
                                        className="col-span-2 w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors border border-red-200"
                                    >
                                        <FontAwesomeIcon icon={faX} className="text-sm" />
                                        <span>Clear All Filters</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Results Count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing {filteredAndSortedBooks.length} of {dummyBooks.length} books
                            </p>
                        </div>

                        {/* Books Grid/List */}
                        <div className={viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                        }>
                            {filteredAndSortedBooks.map(book => (
                                <BookCard key={book.id} book={book} isListView={viewMode === 'list'} />
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredAndSortedBooks.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
                                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>

    );
};

export default BookStorePage;