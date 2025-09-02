import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AddReviewer = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { token, userData } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        user_type: "3",
        journal_id:"",
    });
    // console.log("journal id: ",userData?.journal_id);
    
     // Use useEffect to set journal_id when userData is available
    useEffect(() => {
        if (userData && userData.journal_id) {
            setFormData(prev => ({
                ...prev,
                journal_id: userData.journal_id
            }));
        }
    }, [userData]);

    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // console.log("Form Data:", formData);
        try {

            const response = await axios.post(`${API_URL}api/editor/create-reviewer`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Add Reviewer Response:", response.data);
            
            if(response.data.flag === 1){
                toast.success(response.data.message || "Reviewer added successfully");
            }else{
                toast.error(response.data.message || "Failed to add reviewer");
            }


        } catch (error) {
            console.error("Error adding reviewer:", error);
            toast.error(error.message || "Failed to add reviewer");
        } finally {
            setIsLoading(false);
            // Reset form or redirect as needed
            setFormData({
                name: "",
                email: "",
                password: "",
                user_type: "3",
                journal_id: userData?.journal_id || "",
            });
        }

    }

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
                       Add Reviewer
                    </motion.h2>

                    

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

                    <div className="grid grid-cols-1  gap-4">
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
                            "Save Reviewer"
                        )}
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    )
}

export default AddReviewer
