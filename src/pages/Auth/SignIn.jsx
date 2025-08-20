import React, { useState } from "react";
import { motion } from 'framer-motion';
// import PageMeta from "../../components/common/PageMeta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faUserEdit, faUserCheck, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { login } from "../../features/auth/AuthSlice";
import { useDispatch } from "react-redux";
import axios from 'axios';
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: 'admin@gamil.com',
    password: 'password123',
    userRole: 'author',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({
    email: false,
    password: false
  });
  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, userRole: role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}api/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.flag === 1 || response.data) {
        dispatch(login({ userData: response.data.user, token: response.data.token }));
        toast.success(response.data.message);
        navigate('/dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      let errorMessage = "Something went wrong. Please try again.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <PageMeta
        title="Sign In | Your App Name"
        description="Sign in to your account"
      /> */}
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 h-3 w-full"
            />

            <div className="p-8 pt-4">
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

              {/* here design logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-10 mb-10"
              >
                <div className="relative">
                  {/* Rounded background container */}
                  <motion.div
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg"
                    whileHover={{ rotate: 2, scale: 1.05 }}
                  >
                    {/* Main journal icon */}
                    <FontAwesomeIcon
                      icon={faUserEdit}
                      className="h-10 w-10 text-indigo-600"
                    />

                    {/* Small badge icon in corner */}
                    <motion.div
                      className="absolute -bottom-1 -right-1 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: 'spring' }}
                    >
                      <FontAwesomeIcon
                        icon={faUserCheck}
                        className="h-3 w-3"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Optional animated rings for decoration */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-indigo-200 opacity-0"
                    animate={{ opacity: [0, 0.3, 0], scale: [1, 1.2, 1.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                  />
                </div>
              </motion.div>

              <form onSubmit={handleSubmit} className="mt-8">


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
                        ? '-top-[10px] -translate-y-1/2 bg-white px-2 text-sm text-indigo-600'
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
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-[50%] text-gray-500 hover:text-indigo-600 transition-colors"
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
                        ? '-top-[10px] -translate-y-1/2 bg-white px-2 text-sm text-indigo-600'
                        : 'top-3 text-gray-400'
                        }`}
                    >
                      Password
                    </label>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.5)",
                    backgroundPosition: "100% 0"
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full relative overflow-hidden text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 ${isLoading ? "cursor-not-allowed" : ""
                    }`}
                  disabled={isLoading}
                  style={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%)",
                    backgroundSize: "200% 100%",
                    border: "2px solid rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(2px)"
                  }}
                >
                  {isLoading ? (
                    <motion.div
                      className="flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="block h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </motion.div>
                  ) : (
                    <motion.span
                      initial={{ opacity: 0.9, textShadow: "0 0 0 rgba(255,255,255,0)" }}
                      whileHover={{
                        opacity: 1,
                        textShadow: "0 0 8px rgba(255,255,255,0.5)"
                      }}
                      className="block"
                    >
                      Sign In
                    </motion.span>
                  )}

                  {!isLoading && (
                    <motion.span
                      className="absolute inset-0 border-2 border-transparent rounded-xl"
                      initial={{
                        borderColor: "rgba(255,255,255,0)",
                        boxShadow: "inset 0 0 0 rgba(255,255,255,0)"
                      }}
                      whileHover={{
                        borderColor: "rgba(255,255,255,0.3)",
                        boxShadow: "inset 0 0 20px rgba(255,255,255,0.2)",
                        transition: { delay: 0.2 }
                      }}
                    />
                  )}
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
                  <Link
                    to="/signup"
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}