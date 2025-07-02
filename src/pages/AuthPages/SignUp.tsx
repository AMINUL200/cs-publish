import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion, Variants } from "framer-motion";
import { useState, FormEvent, ChangeEvent } from "react";
import { Link } from "react-router";

type FormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  user_type: number; // 3: Author, 2: Reviewer, 4: Subscriber
  first_name: string;
  last_name: string;
  title: string;
  gender: string;
  phone: string;
  city: string;
  country: string;
};

type UserTypeOption = {
  value: number;
  label: string;
};

const SignUp = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    user_type: 3, // Default: Author
    first_name: "",
    last_name: "",
    title: "Mr",
    gender: "Male",
    phone: "",
    city: "",
    country: ""
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userTypeOptions: UserTypeOption[] = [
    { value: 3, label: "Author" },
    { value: 2, label: "Reviewer" },
    { value: 4, label: "Subscriber" }
  ];

  const titleOptions = ["Mr", "Mrs", "Miss", "Dr", "Prof"];
  const genderOptions = ["Male", "Female", "Other"];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Registration successful:", formData);
      // Here you would typically make an API call:
      // const response = await axios.post('/api/register', formData);
      // Handle successful registration
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.log(err);
      
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: number) => {
    setFormData(prev => ({ ...prev, user_type: value }));
  };
  // Password visibility state
  const [showPassword, setShowPassword] =  useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =  useState<boolean>(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5 // Adding duration makes it more type-safe
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[49rem]"
      >
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 relative"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold text-center text-indigo-700"
          >
            Create Account
          </motion.h2>

          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </motion.div>

            {/* Last Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </motion.div>
          </div>

          {/* User Type (Radio Buttons) */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {userTypeOptions.map((type) => (
                <motion.label
                  key={type.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center p-2 rounded-lg border cursor-pointer transition-all ${formData.user_type === type.value
                    ? "bg-indigo-100 border-indigo-500"
                    : "border-gray-300 hover:border-indigo-300"
                    }`}
                >
                  <input
                    type="radio"
                    name="user_type"
                    value={type.value}
                    checked={formData.user_type === type.value}
                    onChange={() => handleRadioChange(type.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{type.label}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title Dropdown */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {titleOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </motion.div>

            {/* Gender Dropdown */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              >
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          {/* Phone */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </motion.div>

            {/* Country */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            {/* Password */}
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-8 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                  style={{ top: '1.4rem' }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-8 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600"
                  style={{ top: '1.4rem' }}
                >
                  <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </motion.div>
          </div>
          {/* Already have an account? */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-4"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Login
              </Link>
            </p>
          </motion.div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 shadow-lg transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="block h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
                <span>Registering...</span>
              </div>
            ) : (
              "Register Now"
            )}
          </motion.button>

        </motion.form>
      </motion.div>
    </div>
  );
};

export default SignUp;