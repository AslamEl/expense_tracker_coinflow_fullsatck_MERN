import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = ({ onSwitchToSignup }) => {
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.emailOrUsername || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.emailOrUsername, formData.password);
    
    if (!result.success) {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center px-3 md:px-4 py-6 md:py-8 relative z-10 min-h-screen">
      <div className="max-w-lg w-full">
        {/* Floating background elements */}
        <div className="absolute -top-20 -left-20 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-32 md:w-40 h-32 md:h-40 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
        
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
                  <div className="absolute -top-2 -right-2 w-5 md:w-6 h-5 md:h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-2.5 md:w-3 h-2.5 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-2 md:mb-3">Welcome Back!</h2>
              <p className="text-xs md:text-lg text-gray-600">Continue your CoinFlow journey</p>
              
              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mt-4 md:mt-6">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-lg md:rounded-2xl p-3 md:p-5 mb-4 md:mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10"></div>
                <div className="flex items-center relative z-10 gap-2 md:gap-3">
                  <div className="w-6 md:w-8 h-6 md:h-8 bg-red-500 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 md:w-4 h-3 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-red-800 font-medium text-xs md:text-base">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
              <div className="space-y-3 md:space-y-6">
                <div className="group">
                  <label htmlFor="emailOrUsername" className="block text-xs md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">
                    Email or Username
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="emailOrUsername"
                      name="emailOrUsername"
                      value={formData.emailOrUsername}
                      onChange={handleChange}
                      className="w-full px-3 md:px-5 py-2 md:py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 text-xs md:text-base"
                      placeholder="Enter your email or username"
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center">
                      <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label htmlFor="password" className="block text-xs md:text-sm font-semibold text-gray-800 mb-2 md:mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 md:px-5 py-2 md:py-4 bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-lg md:rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 text-gray-900 placeholder-gray-500 group-hover:border-gray-300 text-xs md:text-base"
                      placeholder="Enter your password"
                      disabled={loading}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 md:pr-4 flex items-center">
                      <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-2 md:py-5 px-4 md:px-6 rounded-lg md:rounded-2xl hover:shadow-2xl transition-all duration-300 font-bold text-xs md:text-lg transform hover:scale-[1.02] hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-center">
                  {loading ? (
                    <>
                      <div className="w-4 md:w-6 h-4 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 md:mr-3"></div>
                      <span className="hidden sm:inline">Signing in...</span>
                      <span className="sm:hidden">Signing...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Sign In to CoinFlow</span>
                      <span className="sm:hidden">Sign In</span>
                      <svg className="w-4 md:w-5 h-4 md:h-5 ml-1 md:ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Switch to Signup */}
            <div className="mt-6 md:mt-10 text-center">
              <p className="text-gray-600 mb-2 md:mb-4 text-xs md:text-base">
                Don't have an account?
              </p>
              <button
                onClick={onSwitchToSignup}
                className="text-indigo-600 hover:text-indigo-700 font-bold text-xs md:text-lg transition-colors duration-200 bg-indigo-50 hover:bg-indigo-100 px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl"
              >
                Create Your CoinFlow Account
              </button>
            </div>

            {/* Quick Demo */}
            <div className="mt-4 md:mt-8 p-3 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-2xl border border-blue-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-10 transform translate-x-6 md:translate-x-8 -translate-y-6 md:-translate-y-8"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-2 md:mb-3">
                  <span className="text-xl md:text-2xl mr-2 md:mr-3">✨</span>
                  <p className="text-blue-800 font-bold text-xs md:text-base">Quick Start Demo</p>
                </div>
                <p className="text-blue-700 text-xs md:text-sm leading-relaxed">
                  New to CoinFlow? Create your account in under 2 minutes and start managing your finances like a pro!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;