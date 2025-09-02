import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faMinus,
  faTrashAlt,
  faShoppingCart,
  faArrowRight,
  faLock
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from '../../../components/common/Breadcrumb';

const BookCartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      quantity: 2,
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop",
      isbn: "978-0-7432-7356-5"
    },
    {
      id: 2,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop",
      isbn: "978-0-06-112008-4"
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      price: 13.99,
      quantity: 3,
      image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop",
      isbn: "978-0-452-28423-4"
    },
    {
      id: 4,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 11.99,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      isbn: "978-0-14-143951-8"
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      <Breadcrumb items={[
        { label: 'Home', path: '/', icon: 'home' },
        { label: 'Book Store' }
      ]} 
       pageTitle="Your Cart"
      />

      <div className='pt-20 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
        <div className='max-w-6xl mx-auto px-4 py-4 pb-8'>
          {/* Header */}
          <div className='text-center mb-12'>
            <div className='flex items-center justify-center gap-3 mb-4'>
              <FontAwesomeIcon icon={faShoppingCart} className='w-8 h-8 text-indigo-600' />
              <h1 className='text-4xl font-bold text-gray-800'>Your Book Cart</h1>
            </div>
            <p className='text-lg text-gray-600'>
              {getTotalItems()} {getTotalItems() === 1 ? 'book' : 'books'} in your cart
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className='text-center py-16'>
              <FontAwesomeIcon icon={faShoppingCart} className='w-24 h-24 text-gray-300 mx-auto mb-6' />
              <h2 className='text-2xl font-semibold text-gray-500 mb-2'>Your cart is empty</h2>
              <p className='text-gray-400'>Add some books to get started!</p>
            </div>
          ) : (
            <div className='grid lg:grid-cols-3 gap-8'>
              {/* Cart Items */}
              <div className='lg:col-span-2 space-y-6'>
                {cartItems.map(item => (
                  <div key={item.id} className='bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1'>
                    <div className='flex flex-col md:flex-row p-6'>
                      {/* Book Image */}
                      <div className='flex-shrink-0 mb-4 md:mb-0 md:mr-6'>
                        <img
                          src={item.image}
                          alt={item.title}
                          className='w-32 h-40 object-cover rounded-lg shadow-md mx-auto md:mx-0'
                        />
                      </div>

                      {/* Book Details */}
                      <div className='flex-grow'>
                        <div className='flex flex-col md:flex-row md:justify-between md:items-start gap-4'>
                          <div className='flex-grow'>
                            <h3 className='text-xl font-bold text-gray-800 mb-2'>{item.title}</h3>
                            <p className='text-gray-600 mb-2'>by {item.author}</p>
                            <p className='text-sm text-gray-500 mb-4'>ISBN: {item.isbn}</p>
                            <div className='flex items-center justify-between md:justify-start gap-6'>
                              <span className='text-2xl font-bold text-indigo-600'>
                                ₹{item.price.toFixed(2)}
                              </span>
                              <span className='text-lg text-gray-600'>
                                Total: ₹{(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          {/* Quantity Controls */}
                          <div className='flex flex-col items-center gap-4'>
                            <div className='flex items-center bg-gray-100 rounded-full p-1'>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className='p-2 rounded-full hover:bg-gray-200 transition-colors'
                              >
                                <FontAwesomeIcon icon={faMinus} className='w-4 h-4 text-gray-600' />
                              </button>
                              <span className='px-4 py-2 font-semibold text-lg min-w-[3rem] text-center'>
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className='p-2 rounded-full hover:bg-gray-200 transition-colors'
                              >
                                <FontAwesomeIcon icon={faPlus} className='w-4 h-4 text-gray-600' />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className='p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors'
                            >
                              <FontAwesomeIcon icon={faTrashAlt} className='w-5 h-5' />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className='lg:col-span-1'>
                <div className='bg-white rounded-2xl shadow-lg p-6 sticky top-26'>
                  <h2 className='text-2xl font-bold text-gray-800 mb-6'>Order Summary</h2>

                  <div className='space-y-4 mb-6'>
                    <div className='flex justify-between text-gray-600'>
                      <span>Items ({getTotalItems()})</span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className='flex justify-between text-gray-600'>
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className='flex justify-between text-gray-600'>
                      <span>Tax</span>
                      <span>₹{(getTotalPrice() * 0.08).toFixed(2)}</span>
                    </div>
                    <hr className='border-gray-200' />
                    <div className='flex justify-between text-xl font-bold text-gray-800'>
                      <span>Total</span>
                      <span>₹{(getTotalPrice() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>

                  <button className='w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3'>
                    <span>Proceed to Checkout</span>
                    <FontAwesomeIcon icon={faArrowRight} className='w-5 h-5' />
                  </button>

                  <div className='mt-4 text-center'>
                    <p className='text-sm text-gray-500 flex items-center justify-center gap-1'>
                      <FontAwesomeIcon icon={faLock} className='w-3 h-3' />
                      Secure checkout with 256-bit SSL encryption
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>

  );
};

export default BookCartPage;