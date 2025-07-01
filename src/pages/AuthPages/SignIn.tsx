import React, { useState } from "react";
import { motion } from 'framer-motion';
import PageMeta from "../../components/common/PageMeta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUserEdit, faUserCheck, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { login } from "../../features/auth/AuthSlice";
import { useDispatch } from "react-redux";


// Define types for form data
interface FormData {
  email: string;
  password: string;
  userRole: 'author' | 'reviewer' | 'subscriber';
}

// Define types for focus state
interface FocusState {
  email: boolean;
  password: boolean;
}

export default function SignIn() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    userRole: 'author',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<FocusState>({
    email: false,
    password: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role: 'author' | 'reviewer' | 'subscriber') => {
    setFormData(prev => ({ ...prev, userRole: role }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({
      user: { email: formData.email },
      token: "dummy-token"
    }))
  };



  return (
    <>
      <PageMeta
        title="Sign In | Your App Name"
        description="Sign in to your account"
      />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Decorative header with animation */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 h-3 w-full"
            />

            <div className="p-8">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-center text-gray-800 mb-2"
              >
                Journal Manager
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-gray-600 mb-8"
              >
                Organize your thoughts and ideas
              </motion.p>

              <form onSubmit={handleSubmit}>
                {/* User Role Selection */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mb-6"
                >
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Login as:</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {/* Author */}
                    <motion.label
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.userRole === 'author'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="userRole"
                        value="author"
                        checked={formData.userRole === 'author'}
                        onChange={() => handleRoleChange('author')}
                        className="hidden"
                      />
                      <FontAwesomeIcon
                        icon={faUserEdit}
                        className={`h-6 w-6 mb-2 ${formData.userRole === 'author' ? 'text-indigo-600' : 'text-gray-500'
                          }`}
                      />
                      <span className={`text-sm font-medium ${formData.userRole === 'author' ? 'text-indigo-700' : 'text-gray-700'
                        }`}>Author</span>
                    </motion.label>

                    {/* Reviewer */}
                    <motion.label
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.userRole === 'reviewer'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="userRole"
                        value="reviewer"
                        checked={formData.userRole === 'reviewer'}
                        onChange={() => handleRoleChange('reviewer')}
                        className="hidden"
                      />
                      <FontAwesomeIcon
                        icon={faUserCheck}
                        className={`h-6 w-6 mb-2 ${formData.userRole === 'reviewer' ? 'text-indigo-600' : 'text-gray-500'
                          }`}
                      />
                      <span className={`text-sm font-medium ${formData.userRole === 'reviewer' ? 'text-indigo-700' : 'text-gray-700'
                        }`}>Reviewer</span>
                    </motion.label>

                    {/* Subscriber */}
                    <motion.label
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex flex-col items-center p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.userRole === 'subscriber'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="userRole"
                        value="subscriber"
                        checked={formData.userRole === 'subscriber'}
                        onChange={() => handleRoleChange('subscriber')}
                        className="hidden"
                      />
                      <FontAwesomeIcon
                        icon={faUserAlt}
                        className={`h-6 w-6 mb-2 ${formData.userRole === 'subscriber' ? 'text-indigo-600' : 'text-gray-500'
                          }`}
                      />
                      <span className={`text-sm font-medium ${formData.userRole === 'subscriber' ? 'text-indigo-700' : 'text-gray-700'
                        }`}>Subscriber</span>
                    </motion.label>
                  </div>
                </motion.div>

                <div className="mb-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="relative"
                  >
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({ ...isFocused, email: true })}
                      onBlur={() => setIsFocused({ ...isFocused, email: false })}
                      className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="email"
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${isFocused.email || formData.email
                        ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-indigo-600'
                        : 'top-3 text-gray-400'
                        }`}
                    >
                      Email Address
                    </label>
                  </motion.div>
                </div>

                <div className="mb-8">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="relative"
                  >
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setIsFocused({ ...isFocused, password: true })}
                      onBlur={() => setIsFocused({ ...isFocused, password: false })}
                      className="peer w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all pr-12"
                      placeholder=" "
                      required
                    />
                    <motion.span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2 text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      <motion.div
                        key={showPassword ? "visible" : "hidden"}
                        initial={{ rotate: -10, opacity: 0.6 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          className="h-5 w-5"
                        />
                      </motion.div>
                    </motion.span>
                    <label
                      htmlFor="password"
                      className={`absolute left-4 transition-all duration-200 pointer-events-none ${isFocused.password || formData.password
                        ? 'top-0 -translate-y-1/2 bg-white px-2 text-sm text-indigo-600'
                        : 'top-3 text-gray-400'
                        }`}
                    >
                      Password
                    </label>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <motion.span
                    initial={{ opacity: 0.9 }}
                    whileHover={{ opacity: 1 }}
                  >
                    Sign In
                  </motion.span>
                </motion.button>
              </form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-center"
              >
                <motion.a
                  href="#"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  whileHover={{ x: 2 }}
                >
                  Forgot password?
                </motion.a>
                <p className="text-gray-600 text-sm mt-2">
                  Don't have an account?{' '}
                  <motion.a
                    href="#"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                    whileHover={{
                      scale: 1.05,
                      textShadow: "0px 0px 5px rgba(79, 70, 229, 0.3)"
                    }}
                  >
                    Sign up
                  </motion.a>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

    </>
  );
}