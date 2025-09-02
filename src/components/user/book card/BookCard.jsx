import { faArrowRight, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom';

const BookCard = ({ book, isListView = false }) => (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group ${isListView ? 'flex' : ''}`}>
        <div className={`relative ${isListView ? 'w-32 flex-shrink-0' : 'aspect-[2/2]'} overflow-hidden`}>
            <img
                src={book.image}
                alt={book.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {book.discount > 0 && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    -{book.discount}%
                </div>
            )}
            {book.isNewArrival && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    New
                </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
            </div>
        </div>

        <div className={`p-4 ${isListView ? 'flex-1' : ''}`}>
            <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer">
                    {book.title}
                </h3>
            </div>

            <p className="text-gray-600 text-sm mb-2">by {book.author}</p>

            <div className="flex items-center mb-2">
                <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                        <FontAwesomeIcon
                            icon={faStar}
                            key={i}
                            className={`text-sm ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">({book.buyers})</span>
                </div>
            </div>

            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">₹{book.discountPrice}</span>
                    {book.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">₹{book.price}</span>
                    )}
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{book.category}</span>
            </div>

            <Link
                to={`/products/${book.id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer">
                <span>View Details</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
        </div>
    </div>
);

export default BookCard
