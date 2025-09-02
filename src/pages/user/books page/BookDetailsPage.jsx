import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faBookmark, faClock, faEye, faHeart, faShare, faShoppingCart, faStar, faUsers } from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../../components/common/Breadcrumb';
import RelatedBooksCarousel from '../../../components/user/book carousel/RelatedBooksCarousel';

// Dummy book data
const bookData = {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    category: "Fiction",
    originalPrice: 24.99,
    discountPrice: 18.99,
    discount: 24,
    rating: 4.8,
    reviews: 1247,
    stock: 12,
    isbn: "978-0525559474",
    publisher: "Viking Press",
    publishDate: "August 13, 2020",
    pages: 288,
    language: "English",
    format: ["Hardcover", "Paperback", "eBook", "Audiobook"],
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?",
    images: [
        "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop"
    ],
    features: [
        "New York Times Bestseller",
        "Goodreads Choice Award Winner",
        "International Bestseller",
        "Over 1 Million Copies Sold"
    ],
    specifications: {
        weight: "0.8 lbs",
        dimensions: "6.4 x 1.1 x 9.5 inches",
        binding: "Hardcover",
        edition: "1st Edition"
    }
};

const relatedBooks = [
    {
        id: 2,
        title: "Klara and the Sun",
        author: "Kazuo Ishiguro",
        price: 16.99,
        originalPrice: 22.99,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        rating: 4.6
    },
    {
        id: 3,
        title: "The Seven Moons of Maali Almeida",
        author: "Shehan Karunatilaka",
        price: 19.99,
        originalPrice: 26.99,
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
        rating: 4.4
    },
    {
        id: 4,
        title: "The Atlas Six",
        author: "Olivie Blake",
        price: 14.99,
        originalPrice: 19.99,
        image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=300&h=400&fit=crop",
        rating: 4.3
    },
    {
        id: 3,
        title: "The Seven Moons of Maali Almeida",
        author: "Shehan Karunatilaka",
        price: 19.99,
        originalPrice: 26.99,
        image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=300&h=400&fit=crop",
        rating: 4.4
    },
];

const BookDetailsPage = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedFormat, setSelectedFormat] = useState("Hardcover");
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    return (
        <>
            <Breadcrumb items={[
                { label: 'Home', path: '/', icon: 'home' },
                { label: 'Book Store', path: '/products', icon: 'file' },
                { label: 'Book Details' }
            ]}
                pageTitle="Book Details"
                pageDescription="Discover your next great read from our curated collection"
            />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 mt-8">


                <div className="max-w-7xl mx-auto px-4 py-8">
                    {/* Main Product Section */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-16">
                        {/* Left - Images */}
                        <div className="space-y-4">
                            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden group">
                                <img
                                    src={bookData.images[selectedImage]}
                                    alt={bookData.title}
                                    className="w-full h-[600px] object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        -{bookData.discount}%
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => setIsWishlisted(!isWishlisted)}
                                        className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white'
                                            }`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                    </button>
                                    <button className="p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white backdrop-blur-sm transition-colors">
                                        <FontAwesomeIcon icon={faShare} className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Thumbnail Images */}
                            <div className="flex space-x-3">
                                {bookData.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`relative w-20 h-24 rounded-lg overflow-hidden transition-all ${selectedImage === index ? 'ring-2 ring-blue-500 shadow-lg' : 'opacity-70 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={image} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right - Product Details */}
                        <div className="space-y-6">
                            {/* Title & Author */}
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{bookData.title}</h1>
                                <p className="text-xl text-gray-600">by <span className="text-blue-600 hover:underline cursor-pointer font-medium">{bookData.author}</span></p>
                            </div>

                            {/* Rating & Reviews */}
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            key={i}
                                            className={`w-5 h-5 ${i < Math.floor(bookData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                        />
                                    ))}
                                    <span className="text-lg font-semibold text-gray-900 ml-2">{bookData.rating}</span>
                                </div>
                                <span className="text-gray-500">({bookData.reviews} reviews)</span>
                            </div>

                            {/* Category & Features */}
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {bookData.category}
                                </span>
                                {bookData.features.slice(0, 2).map((feature, index) => (
                                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                                        <FontAwesomeIcon icon={faAward} className="w-3 h-3 mr-1" />
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            {/* Price */}
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl">
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="text-3xl font-bold text-gray-900">₹{bookData.discountPrice}</span>
                                    <span className="text-xl text-gray-500 line-through">₹{bookData.originalPrice}</span>
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        Save ₹{(bookData.originalPrice - bookData.discountPrice).toFixed(2)}
                                    </span>
                                </div>

                                {/* Stock Status */}
                                <div className="flex items-center space-x-2 text-green-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">{bookData.stock} items in stock</span>
                                </div>
                            </div>

                            {/* Format Selection */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Format</h3>
                                <div className="flex flex-wrap gap-2">
                                    {bookData.format.map((format) => (
                                        <button
                                            key={format}
                                            onClick={() => setSelectedFormat(format)}
                                            className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedFormat === format
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            {format}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity & Actions */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 block mb-2">Quantity</label>
                                        <div className="flex items-center border-2 border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-2 font-semibold">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="p-2 hover:bg-gray-100 transition-colors cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg cursor-pointer">
                                        <FontAwesomeIcon icon={faShoppingCart} className="w-5 h-5" />
                                        <span>Add to Cart</span>
                                    </button>
                                    <button className="px-6 py-4 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors cursor-pointer">
                                        Buy Now
                                    </button>
                                </div>
                            </div>

                            {/* Quick Info */}
                            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FontAwesomeIcon icon={faEye} className="w-4 h-4" />
                                    <span className="text-sm">1.2k views today</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FontAwesomeIcon icon={faClock} className="w-4 h-4" />
                                    <span className="text-sm">Fast delivery</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FontAwesomeIcon icon={faUsers} className="w-4 h-4" />
                                    <span className="text-sm">32 sold this week</span>
                                </div>
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <FontAwesomeIcon icon={faBookmark} className="w-4 h-4" />
                                    <span className="text-sm">Free bookmark</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="border-b">
                            <div className="flex space-x-8 px-8">
                                {['description', 'specifications', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`py-4 px-2 border-b-2 font-semibold capitalize transition-colors ${activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-8">
                            {activeTab === 'description' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-gray-900">About this book</h3>
                                    <p className="text-gray-700 text-lg leading-relaxed">{bookData.description}</p>
                                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Publication Details</h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                <div>Publisher: {bookData.publisher}</div>
                                                <div>Publication Date: {bookData.publishDate}</div>
                                                <div>Pages: {bookData.pages}</div>
                                                <div>Language: {bookData.language}</div>
                                                <div>ISBN: {bookData.isbn}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-2">Awards & Recognition</h4>
                                            <div className="space-y-2">
                                                {bookData.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <FontAwesomeIcon icon={faAward} className="w-4 h-4 text-yellow-500" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'specifications' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-gray-900">Technical Specifications</h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            {Object.entries(bookData.specifications).map(([key, value]) => (
                                                <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                                                    <span className="font-medium text-gray-700 capitalize">{key}:</span>
                                                    <span className="text-gray-600">{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex justify-between py-3 border-b border-gray-100">
                                                <span className="font-medium text-gray-700">Format:</span>
                                                <span className="text-gray-600">{bookData.format.join(', ')}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-100">
                                                <span className="font-medium text-gray-700">Genre:</span>
                                                <span className="text-gray-600">{bookData.category}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-gray-100">
                                                <span className="font-medium text-gray-700">Rating:</span>
                                                <span className="text-gray-600">{bookData.rating}/5 stars</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                            Write Review
                                        </button>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-8">
                                        <div className="text-center">
                                            <div className="text-4xl font-bold text-gray-900">{bookData.rating}</div>
                                            <div className="flex justify-center space-x-1 my-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <FontAwesomeIcon icon={faStar} key={i} className={`w-5 h-5 ${i < Math.floor(bookData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                                ))}
                                            </div>
                                            <div className="text-gray-600">{bookData.reviews} reviews</div>
                                        </div>
                                        <div className="md:col-span-2 space-y-4">
                                            {[5, 4, 3, 2, 1].map((star) => (
                                                <div key={star} className="flex items-center space-x-3">
                                                    <span className="text-sm font-medium w-8">{star} ★</span>
                                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-yellow-400 h-2 rounded-full"
                                                            style={{ width: `${star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-sm text-gray-600 w-8">{star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 3 : 2}%</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Books */}
                    <div className="mt-16 innovation-section">
                        <RelatedBooksCarousel books={relatedBooks} />

                    </div>
                </div>
            </div>
        </>

    );
};

export default BookDetailsPage;