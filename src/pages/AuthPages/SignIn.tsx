import React, { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { signupBg, logo } from "../../assets";
import { Link } from "react-router";

interface FormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export default function SignIn() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <PageMeta
        title="Sign In | Your App Name"
        description="Sign in to your account"
      />
      <div
        style={{
          backgroundImage: `url(${signupBg})`,
          backgroundPosition: 'center',
          height: 'unset'
        }}
      >
        <div className="min-h-screen flex items-center justify-center  p-4">
          <div className="w-full max-w-md space-y-8 bg-gray-50 p-[3.12rem] rounded-lg shadow-lg dark:bg-gray-800">
            <div className="text-center">
              <div className="flex justify-center"> 
                <img src={logo} alt="logo" /> 
              </div>
              <h2 className="mt-6 text-xl font-semibold text-gray-900">Sign in your account</h2>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-[#321f69fc] focus:ring-indigo-500 border-gray-300 rounded"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Remember my preference
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-gray-400 hover:text-[#321f69fc]">
                      Forget Password?
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#3b247b] hover:bg-[#321f69fc] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign In
                </button>
              </div>
            </form>

            <div className="text-start text-sm text-gray-600">
              Already have an account?{" "}
              <Link  to={'/signup'} className="font-medium text-[#3b247b] hover:text-[#321f69fc]">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}