import React, { useEffect, useState } from 'react'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loader from '../../../components/common/Loader';
import { useSelector } from 'react-redux';

const AddUser = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { token } = useSelector((state) => state.auth);
  const [journals, setJournals] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    user_type: "1",
    journal_id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const userTypeOptions = [
    { value: "1", label: "Editor" },
    { value: "5", label: "Publisher" },
    { value: "3", label: "Reviewer" }
  ];

  // Fetch journals
  const fetchJournals = async () => {
    try {
      const response = await axios.get(`${API_URL}api/admin/journals`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        console.log("Fetched journals:", response.data.data);
        
        setJournals(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch journals");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while fetching journals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data to submit - only include journal_id if user_type is 1
      const submitData = { ...formData };
      
      if (formData.user_type === "5") {
        delete submitData.journal_id;
      }

      console.log("Submitting data:", submitData);

      // Here you would typically make your API call
      const response = await axios.post(`${API_URL}api/admin/add-users`, submitData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.data.flag === 1){
        toast.success(response.data.message);
        setFormData({
          name: "",
          email: "",
          password: "",
          user_type: 1,
          journal_id: "",
        });
      }else{
        toast.error(response.data.message || "Failed to create user");
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error || "Something went wrong while creating user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

   const handleRadioChange = (value) => {
    setFormData(prev => ({ ...prev, user_type: String(value) }));
  };

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.5
      }
    }
  };

  if (loading) {
    return <Loader />
  }

  return (
    <div className="min-h-[82vh] bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
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
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
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

            {/* Conditionally render journal select only for Editors (type 1) */}
            {formData.user_type !== "5" && (
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Journal *
                </label>
                <select
                  name="journal_id"
                  value={formData.journal_id}
                  onChange={handleChange}
                  required={formData.user_type === 1}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                >
                  <option value="">Select a journal</option>
                  {journals.map((journal) => (
                    <option key={journal.id} value={journal.id}>
                      {journal.j_title}
                    </option>
                  ))}
                </select>
              </motion.div>
            )}
          </div>

          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(79, 70, 229, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white bg-blue-500 shadow-lg transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl cursor-pointer"
              }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="block h-5 w-5 border-2 border-white border-t-transparent rounded-full "
                />
                <span>Save...</span>
              </div>
            ) : (
              "Save User"
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  )
}

export default AddUser;