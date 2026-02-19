import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../../features/auth/AuthSlice";
import Loader from "../../components/common/Loader";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { logo } from "../../assets";

const SignUp = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    user_type: "2",
    first_name: "",
    last_name: "",
    title: "Mr",
    gender: "Male",
    phone: "",
    city: "",
    country: "",

    // Reviewer specific fields
    qualification: "",
    university: "",
    affiliation: "",
    speciality: "",
    designation: "",
    journal_id: "",
    resume: null
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeFileName, setResumeFileName] = useState("");

  const userTypeOptions = [
    { value: "2", label: "Author" },
    { value: "3", label: "Reviewer" },
    { value: "4", label: "User" }
  ];

  const titleOptions = ["Mr", "Mrs", "Miss", "Dr", "Prof"];
  const genderOptions = ["Male", "Female", "Other"];

  // Check if current user type is reviewer
  const isReviewer = formData.user_type === "3";

  // Fetch journals
  const fetchJournals = async () => {
    try {
      const response = await axios.get(`${API_URL}api/journal`, {

      });

      if (response.status === 200 && response.data.success) {
        setJournals(response.data.data.map(journal => ({
          id: journal.id,
          name: journal.j_title
        })));


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
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    console.log("Form Data:", formData);

    // Define reviewer-specific fields
    const reviewerFields = ['qualification', 'university', 'affiliation', 'speciality', 'designation', 'journal_id', 'resume'];

    // Create FormData for file upload
    const submitData = new FormData();

    // Add form fields to FormData based on user type
    Object.keys(formData).forEach(key => {
      // Skip reviewer-specific fields if user is not a reviewer
      if (reviewerFields.includes(key) && formData.user_type !== "3") {
        return; // Skip this field
      }

      if (key === 'resume' && formData[key]) {
        submitData.append('resume', formData[key]);
      } else if (key !== 'resume') {
        submitData.append(key, formData[key]);
      }
    });

    // debugging: log FormData entries
    for (let pair of submitData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      const response = await axios.post(`${API_URL}api/register`, submitData);

      if (response.data.flag === 1) {
        // Check if user is reviewer
        if (formData.user_type === "3") {
          // For reviewers, show success message but don't login
          toast.success("Registration successful! Please wait for admin activation.");
          // Reset form or redirect to login
          setFormData({
            name: "",
            email: "",
            password: "",
            user_type: "2",
            first_name: "",
            last_name: "",
            title: "Mr",
            gender: "Male",
            phone: "",
            city: "",
            country: "",
            qualification: "",
            university: "",
            affiliation: "",
            speciality: "",
            designation: "",
            journal_id: "",
            resume: null
          });
          setResumeFileName("");
          navigate('/reviewer-activation');
        } else {
          // For non-reviewers, login immediately
          dispatch(login({ userData: response.data.user, token: response.data.token }));
          toast.success(response.data.message);
          navigate('/dashboard');
        }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (optional)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
        setFormData(prev => ({ ...prev, resume: file }));
        setResumeFileName(file.name);
      } else {
        toast.error("Please upload a PDF or Word document");
        e.target.value = "";
      }
    }
  };

  const handleRadioChange = (value) => {
    setFormData(prev => ({
      ...prev,
      user_type: String(value),
      // Clear reviewer-specific fields when changing from reviewer to other types
      ...(value !== "3" && {
        qualification: "",
        university: "",
        affiliation: "",
        speciality: "",
        designation: "",
        journal_id: "",
        resume: null
      })
    }));

    // Clear file name when switching away from reviewer
    if (value !== "3") {
      setResumeFileName("");
    }
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
            className="text-3xl font-bold text-center text-yellow-700"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </motion.div>

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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </motion.div>
          </div>

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
                    ? "bg-yellow-100 border-yellow-500"
                    : "border-gray-300 hover:border-yellow-300"
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
                Title
              </label>
              <select
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              >
                {titleOptions.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              >
                {genderOptions.map((gender) => (
                  <option key={gender} value={gender}>
                    {gender}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
              />
            </motion.div>
          </div>

          {/* Reviewer Specific Fields */}
          {isReviewer && (
            <>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Journal *
                </label>
                <select
                  name="journal_id"
                  value={formData.journal_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                >
                  <option value="">-- Select Journal --</option>
                  {journals.map((journal) => (
                    <option key={journal.id} value={journal.id}>
                      {journal.name}
                    </option>
                  ))}
                </select>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highest Qualification *
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required={isReviewer}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  placeholder="e.g., PhD in Computer Science"
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University *
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    required={isReviewer}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="Enter your university name"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    required={isReviewer}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                    placeholder="e.g., Professor, Associate Professor"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliation *
                </label>
                <input
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  required={isReviewer}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  placeholder="Enter your institutional affiliation"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Speciality *
                </label>
                <input
                  type="text"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  required={isReviewer}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
                  placeholder="Enter your area of expertise"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume/CV *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    required={isReviewer}
                    accept=".pdf,.doc,.docx"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-all bg-gray-50">
                    <div className="text-center">
                      <FontAwesomeIcon icon={faUpload} className="text-gray-400 mb-2" size="lg" />
                      <p className="text-sm text-gray-600">
                        {resumeFileName || "Click to upload your resume/CV"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
                {resumeFileName && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {resumeFileName} selected
                  </p>
                )}
              </motion.div>
            </>

          )}


          <div className="grid grid-cols-1 gap-4">
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-8 right-0 pr-3 flex items-center text-gray-500 hover:text-yellow-600"
                  style={{ top: '1.4rem' }}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="text-center mt-4"
          >
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="text-yellow-600 hover:text-yellow-800 font-medium"
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
            className={`w-full py-3 px-6 rounded-xl font-semibold custom-btn shadow-lg transition-all ${isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-xl"
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