import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Signup = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    monthlySalary: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (errors.length > 0) setErrors([]);
  };

  const validateForm = () => {
    const newErrors = [];

    if (!formData.username.trim()) newErrors.push('Username is required');
    if (formData.username.length < 3) newErrors.push('Username must be at least 3 characters');
    
    if (!formData.email.trim()) newErrors.push('Email is required');
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.push('Please enter a valid email address');
    }
    
    if (!formData.password) newErrors.push('Password is required');
    if (formData.password.length < 6) newErrors.push('Password must be at least 6 characters');
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.push('Passwords do not match');
    }
    
    if (!formData.firstName.trim()) newErrors.push('First name is required');
    if (!formData.lastName.trim()) newErrors.push('Last name is required');

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    const userData = {
      username: formData.username.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      monthlySalary: parseFloat(formData.monthlySalary) || 0
    };

    const result = await signup(userData);
    
    if (!result.success) {
      setErrors(result.errors || [result.message]);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center px-3 md:px-4 py-6 md:py-8 relative z-10 min-h-screen">
      <div className="max-w-sm md:max-w-xl lg:max-w-2xl w-full">
        {/* Floating background elements */}
        <div className="absolute -top-20 -left-20 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 md:w-60 h-40 md:h-60 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
        
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl p-4 md:p-10 border border-white/20 relative overflow-hidden">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-6 md:mb-10">
              <div className="flex justify-center items-center mb-4 md:mb-6">
                <div className="relative">
                  <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    <span className="text-2xl md:text-3xl">💎</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-5 md:w-8 h-5 md:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-2.5 md:w-4 h-2.5 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 md:mb-3">Join CoinFlow</h2>
              <p className="text-xs md:text-lg text-gray-600 mb-3 md:mb-4">Start your financial transformation today</p>
              
              {/* Progress indicator */}
              <div className="flex justify-center items-center space-x-2 mb-4 md:mb-6">
                <div className="flex items-center bg-indigo-100 px-2 md:px-3 py-1 rounded-full">
                  <span className="w-1.5 md:w-2 h-1.5 md:h-2 bg-indigo-500 rounded-full mr-1.5 md:mr-2"></span>
                  <span className="text-xs md:text-sm font-medium text-indigo-700">Step 2 of 3</span>
                </div>
              </div>
              
              {/* Benefits preview */}
              <div className="hidden sm:grid grid-cols-3 gap-2 md:gap-4 mb-6 md:mb-8">
                <div className="text-center">
                  <div className="w-10 md:w-12 lg:w-14 h-10 md:h-12 lg:h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                    <span className="text-lg md:text-xl">🤖</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">AI Insights</p>
                </div>
                <div className="text-center">
                  <div className="w-10 md:w-12 lg:w-14 h-10 md:h-12 lg:h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                    <span className="text-lg md:text-xl">📊</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">Smart Analytics</p>
                </div>
                <div className="text-center">
                  <div className="w-10 md:w-12 lg:w-14 h-10 md:h-12 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg md:rounded-xl flex items-center justify-center mx-auto mb-1.5 md:mb-2">
                    <span className="text-lg md:text-xl">🎯</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">Goal Tracking</p>
                </div>
              </div>
            </div>

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-lg md:rounded-2xl p-3 md:p-6 mb-4 md:mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
                <div className="flex items-start relative z-10 gap-2 md:gap-3">
                  <div className="w-6 md:w-8 h-6 md:h-8 bg-red-500 rounded-lg md:rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0">
                    <svg className="w-3 md:w-4 h-3 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    {errors.map((error, index) => (
                      <p key={index} className="text-red-800 font-medium text-xs md:text-base">{error}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-3 md:space-y-6">
                <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs md:text-sm font-bold">1</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Personal Information</h3>
                </div>
                
                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-6">
                  <div className="group">
                    <label htmlFor="firstName" className="block text-xs md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 text-xs md:text-base"
                      placeholder="John"
                      disabled={loading}
                    />
                  </div>
                  <div className="group">
                    <label htmlFor="lastName" className="block text-xs md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 text-xs md:text-base"
                      placeholder="Doe"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="group">
                  <label htmlFor="username" className="block text-xs md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">
                    Username * <span className="text-indigo-600 text-xs font-medium">(3+ characters)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 pl-7 md:pl-10 text-xs md:text-base"
                      placeholder="johndoe"
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 left-0 pl-2 md:pl-3 flex items-center">
                      <span className="text-indigo-500 text-base md:text-lg">@</span>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group">
                  <label htmlFor="email" className="block text-xs md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 text-xs md:text-base"
                      placeholder="john@example.com"
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 md:pr-3 flex items-center">
                      <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Security Section */}
              <div className="space-y-3 md:space-y-6">
                <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs md:text-sm font-bold">2</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Account Security</h3>
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
                  <div className="group">
                    <label htmlFor="password" className="block text-xs md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">
                      Password * <span className="text-purple-600 text-xs font-medium">(6+ characters)</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 pr-10 md:pr-12 text-xs md:text-base"
                        placeholder="Create strong password"
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {showPassword ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.464 8.464m1.414 1.414L21.707 21.707" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="group">
                    <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 text-xs md:text-base"
                      placeholder="Confirm your password"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {/* Optional Information Section */}
              <div className="space-y-3 md:space-y-6">
                <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs md:text-sm font-bold">3</span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-gray-900">Financial Profile</h3>
                  <span className="text-xs bg-green-100 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full font-medium text-green-600">Optional</span>
                </div>

                {/* Monthly Salary */}
                <div className="group">
                  <label htmlFor="monthlySalary" className="block text-xs md:text-sm font-semibold text-gray-800 mb-1.5 md:mb-2">
                    Monthly Salary <span className="text-green-600 text-xs font-medium">(helps AI provide better insights)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 md:pl-4 flex items-center">
                      <span className="text-gray-500 font-semibold text-sm md:text-base">$</span>
                    </div>
                    <input
                      type="number"
                      id="monthlySalary"
                      name="monthlySalary"
                      value={formData.monthlySalary}
                      onChange={handleChange}
                      className="w-full pl-6 md:pl-8 pr-3 md:pr-4 py-2 md:py-3 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 text-xs md:text-base"
                      placeholder="5000"
                      min="0"
                      step="0.01"
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-1 md:mt-2">This helps our AI provide personalized budgeting recommendations. You can add additional income sources later.</p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 md:py-5 px-4 md:px-6 rounded-lg md:rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-xs md:text-lg transform hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center gap-1 md:gap-2">
                  {loading ? (
                    <>
                      <div className="w-4 md:w-6 h-4 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Creating Your Account...</span>
                      <span className="sm:hidden">Creating...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Create My CoinFlow Account</span>
                      <span className="sm:hidden">Create Account</span>
                      <svg className="w-4 md:w-5 h-4 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-4 md:mt-10 text-center">
              <p className="text-gray-600 mb-2 md:mb-4 text-xs md:text-base">
                Already part of the CoinFlow community?
              </p>
              <button
                onClick={onSwitchToLogin}
                className="text-indigo-600 hover:text-indigo-700 font-bold text-xs md:text-lg transition-colors duration-200 bg-indigo-50 hover:bg-indigo-100 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl"
              >
                Sign In to Your Account
              </button>
            </div>

            {/* Benefits reminder */}
            <div className="mt-4 md:mt-8 p-3 md:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg md:rounded-2xl border border-indigo-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-10 transform translate-x-6 md:translate-x-8 -translate-y-6 md:-translate-y-8"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-2 md:mb-3 gap-1 md:gap-2">
                  <span className="text-lg md:text-2xl">🚀</span>
                  <p className="text-indigo-800 font-bold text-xs md:text-base">You're seconds away from financial freedom!</p>
                </div>
                <p className="text-indigo-700 text-xs md:text-sm leading-relaxed">
                  Join thousands who've transformed their financial habits with CoinFlow's AI-powered insights and beautiful interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;