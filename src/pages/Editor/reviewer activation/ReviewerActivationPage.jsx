import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEnvelope, faUserCheck, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ReviewerActivationPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 relative">
          {/* Header */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FontAwesomeIcon icon={faClock} className="text-indigo-600 text-3xl" />
            </motion.div>
            <h2 className="text-3xl font-bold text-indigo-700 mb-2">Account Pending Activation</h2>
            <p className="text-gray-600">Your reviewer account is awaiting administrator approval</p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-between items-center mb-8 relative">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
              <p className="text-sm mt-2 text-indigo-600 font-medium">Registration Complete</p>
            </div>
            
            <div className="h-1 bg-gray-300 flex-1 mx-2"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <FontAwesomeIcon icon={faEnvelope} />
              </div>
              <p className="text-sm mt-2 text-gray-500">Admin Approval</p>
            </div>
          </div>

          {/* Information Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-indigo-50 rounded-xl p-6 border border-indigo-100"
          >
            <h3 className="text-lg font-semibold text-indigo-800 mb-3">What happens next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-indigo-700 text-xs font-bold">1</span>
                </div>
                <p className="text-gray-700">Our admin team will review your application and credentials</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-indigo-700 text-xs font-bold">2</span>
                </div>
                <p className="text-gray-700">You'll receive an email notification once your account is approved</p>
              </li>
              <li className="flex items-start">
                <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center mr-3 mt-1 flex-shrink-0">
                  <span className="text-indigo-700 text-xs font-bold">3</span>
                </div>
                <p className="text-gray-700">This process typically takes 1-2 business days</p>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              to="/signin"
              className="flex items-center justify-center px-6 py-3 text-indigo-600 font-medium rounded-lg border border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
              Back to Login
            </Link>
            {/* <button className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Contact Support
            </button> */}
          </div>

          {/* Additional Info */}
          <div className="text-center text-sm text-gray-500 pt-4">
            <p>Have questions about the review process? <a href="#" className="text-indigo-600 hover:underline">Visit our help center</a></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewerActivationPage;