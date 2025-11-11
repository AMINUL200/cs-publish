import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: password reset, 3: success
  const [email, setEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const validateEmail = (e) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const validateResetCode = (code) => {
    return /^[A-Za-z0-9]{6}$/.test(code);
  };

  const handleEmailSubmit = async () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}api/forgot-password`, {
        email: email.trim()
      });

      if (response.data.status) {
        setStep(2);
        setErrors({});
        toast.success(response.data.message || 'Reset code sent to your email!');
      } else {
        setErrors({ email: response.data.message || 'Failed to send reset code' });
        toast.error(response.data.message || 'Failed to send reset code');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Something went wrong. Please try again.';
      setErrors({ email: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async () => {
    const newErrors = {};
    
    if (!resetCode.trim()) {
      newErrors.resetCode = 'Reset code is required';
    } else if (!validateResetCode(resetCode)) {
      newErrors.resetCode = 'Reset code must be 6 characters (letters and numbers only)';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}api/reset-password`, {
        email: email.trim(),
        reset_code: resetCode.trim(),
        password: password,
        password_confirmation: confirmPassword
      });

      if (response.data.status) {
        setStep(3);
        setErrors({});
        toast.success(response.data.message || 'Password updated successfully!');
      } else {
        setErrors({ resetCode: response.data.message || 'Failed to reset password' });
        toast.error(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Something went wrong. Please try again.';
      setErrors({ resetCode: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/signin';
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}api/forgot-password`, {
        email: email.trim()
      });

      if (response.data.status) {
        toast.success('Reset code sent again! Check your email.');
        setResetCode(''); // Clear the reset code field
      } else {
        toast.error(response.data.message || 'Failed to resend code');
      }
    } catch (error) {
      console.error('Resend code error:', error);
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative h-24 bg-gradient-to-r from-[#8B0000] to-[#ffba00] flex items-center justify-center">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, currentColor 0%, transparent 50%)'}} />
            </div>
            <Lock className="w-10 h-10 text-white relative z-10" />
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Step 1: Email Input */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                  <p className="text-gray-600 text-sm">No worries, we'll help you reset it.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({...errors, email: ''});
                      }}
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-yellow-300 focus:ring-yellow-500'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
                </div>

                <button
                  onClick={handleEmailSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#8B0000] to-[#ffba00] hover:from-yellow-700 hover:to-[#8B0000] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Continue'}
                  <ArrowRight className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <p className="text-gray-600 text-sm">Remember your password? <Link to="/signin" className="text-yellow-600 hover:text-yellow-700 font-semibold">Sign in</Link></p>
                </div>
              </div>
            )}

            {/* Step 2: Password Reset */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
                  <p className="text-gray-600 text-sm">Enter the reset code and create a new password</p>
                </div>

                {/* Reset Code Input */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">Reset Code</label>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="text-xs text-yellow-600 hover:text-yellow-700 font-medium disabled:opacity-50"
                    >
                      Resend Code
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={resetCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                        setResetCode(value.slice(0, 6));
                        if (errors.resetCode) setErrors({...errors, resetCode: ''});
                      }}
                      placeholder="Enter 6-digit code"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition text-center tracking-widest font-mono text-lg ${
                        errors.resetCode
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-yellow-300 focus:ring-yellow-500'
                      }`}
                      maxLength={6}
                    />
                  </div>
                  {errors.resetCode && <p className="text-red-500 text-sm mt-2">{errors.resetCode}</p>}
                  <p className="text-gray-500 text-xs mt-1">Enter the 6-character code sent to your email</p>
                </div>

                {/* New Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) setErrors({...errors, password: ''});
                      }}
                      placeholder="Enter new password"
                      className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.password
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-yellow-300 focus:ring-yellow-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                      }}
                      placeholder="Confirm new password"
                      className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${
                        errors.confirmPassword
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-yellow-300 focus:ring-yellow-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-2">{errors.confirmPassword}</p>}
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePasswordUpdate}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#8B0000] to-[#ffba00] hover:from-[#ffba00] hover:to-[#8B0000] text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>

                  <button
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition disabled:opacity-50"
                  >
                    Back to Email
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="space-y-6 text-center animate-fade-in">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
                  <p className="text-gray-600">Your password has been successfully updated.</p>
                </div>

                <button
                  onClick={handleBackToLogin}
                  className="w-full bg-gradient-to-r from-[#8B0000] to-[#ffba00] hover:from-[#ffba00] hover:to-[#8B0000] text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  Back to Login
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Need help? <Link to="/contact" className="text-yellow-600 hover:text-yellow-700 font-semibold">Contact support</Link>
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;