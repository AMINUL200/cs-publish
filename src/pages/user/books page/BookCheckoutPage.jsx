import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowRight, faTag } from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../../../components/common/Breadcrumb";
import Loader from "../../../components/common/Loader";

const BookCheckoutPage = () => {
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  // Form Data state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    state: "",
    zip: "",
    address: "",
    orderNote: "",
  });

  // Error state
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sample cart data
  const cartItems = [
    { id: 1, title: "The Great Gatsby", price: 12.99, quantity: 2 },
    { id: 2, title: "1984", price: 13.99, quantity: 1 },
  ];

  const getTotalPrice = () =>
    cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleApplyCoupon = () => {
    if (coupon.toLowerCase() === "book10") {
      setDiscount(0.1); // 10% discount
    } else {
      setDiscount(0);
      alert("Invalid coupon code");
    }
  };

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08;
  const total = subtotal + tax - subtotal * discount;

  // Validation function
  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";

    if (!formData.zip.trim()) {
      newErrors.zip = "Zip code is required";
    } else if (!/^\d{5,6}$/.test(formData.zip)) {
      newErrors.zip = "Zip must be 5-6 digits";
    }

    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Handle place order
  const handlePlaceOrder = () => {
    if (validateForm()) {
      console.log("✅ Order Placed Successfully");
      console.log("Form Data:", formData);
      console.log("Cart Items:", cartItems);
      console.log("Total Amount:", total.toFixed(2));
      alert("Order placed successfully!");
    } else {
      console.log("❌ Validation Failed", errors);
    }
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
        { label: 'Book Store', path: '/products', icon: 'file' },
        { label: 'Shopping Cart' }
      ]}
        pageTitle="Shopping Cart"
      />

      <div className=" min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-10">
          {/* Left: Shipping Form */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Shipping Address</h2>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 outline-none`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 outline-none`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 outline-none`}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 outline-none`}
                  placeholder="123456790"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.city ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 outline-none`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.state ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 outline-none`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${errors.zip ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-indigo-500 outline-none`}
                    placeholder="10001"
                  />
                  {errors.zip && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.address ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-indigo-500 outline-none resize-none`}
                  rows="3"
                  placeholder="Enter Your Address"
                ></textarea>
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* Order Note (Optional, no validation) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Order Note (Optional)
                </label>
                <textarea
                  name="orderNote"
                  value={formData.orderNote}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  rows="3"
                  placeholder="Add any special instructions for your order..."
                ></textarea>
              </div>
            </form>
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 self-start sticky top-24">
            {/* ... same summary code as before ... */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600 text-sm" >
                  <span> {item.title} × {item.quantity} </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span> </div>
              ))}
              <hr className="border-gray-200" />
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span> <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span> <span>₹{tax.toFixed(2)}</span>
              </div> {discount > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount</span> <span>-₹{(subtotal * discount).toFixed(2)}</span> </div>)}
              <hr className="border-gray-200" />
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span> <span className="text-indigo-600">₹{total.toFixed(2)}</span>
              </div>
              {/* Coupon Input */}
              <div className="flex gap-3 mb-6">
                <input type="text"
                  value={coupon} onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-1 min-w-0 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2 whitespace-nowrap"
                >
                  <FontAwesomeIcon icon={faTag} />
                  Apply </button> </div>
            </div>
            {/* Checkout Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-3"
            >
              <span>Place Order</span>
              <FontAwesomeIcon icon={faArrowRight} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

export default BookCheckoutPage;
