import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Settings = () => {
  const { user, updateUser, deleteAccount } = useAuth();
  const { getThemeClasses } = useTheme();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    monthlySalary: 0,
    currency: 'USD',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    deletePassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const themeClasses = getThemeClasses();

  // Initialize form data with user information
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        username: user.username || '',
        monthlySalary: user.monthlySalary || user.monthlyIncome || 0,
        currency: user.currency || 'USD',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        deletePassword: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'monthlySalary' ? parseFloat(value) || 0 : value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        monthlySalary: formData.monthlySalary,
        currency: formData.currency
      };

      const response = await axios.put('/api/auth/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        // Correctly access the nested user data
        const updatedUser = response.data.data?.user || response.data.user;
        updateUser(updatedUser);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters' });
      setIsLoading(false);
      return;
    }

    try {
      const passwordData = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };

      const response = await axios.put('/api/auth/update-password', passwordData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      }
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update password' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    // Use the app's navigation system
    if (window.showHome) {
      window.showHome();
    } else {
      window.history.back();
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.deletePassword) {
      setMessage({ type: 'error', text: 'Password is required to delete account' });
      setIsLoading(false);
      return;
    }

    try {
      const result = await deleteAccount(formData.deletePassword);
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Account deleted successfully. You will be logged out.' });
        // The user will be automatically logged out by the deleteAccount function
        setTimeout(() => {
          // Force page reload to ensure clean state
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      setMessage({ type: 'error', text: 'Failed to delete account. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themeClasses.gradient} relative overflow-hidden`}>
      {/* Background animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -top-10 -right-10 w-20 md:w-40 h-20 md:h-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-5 -left-5 w-16 md:w-32 h-16 md:h-32 bg-white/5 rounded-full blur-2xl"></div>
      
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 md:py-10 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mb-6 md:mb-8">
          <button
            onClick={goBack}
            className="flex items-center bg-white/20 backdrop-blur-xl rounded-lg md:rounded-2xl py-2 md:py-2.5 px-2 md:px-3 text-white hover:bg-white/30 transition-all duration-300 border border-white/20 shadow-xl hover:shadow-2xl w-fit"
          >
            <svg className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-xs md:text-base font-medium">Back</span>
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-white mb-1 md:mb-2 tracking-tight">Settings</h1>
            <p className="text-white/80 text-xs md:text-lg">Manage your account preferences</p>
          </div>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-4 md:mb-6 p-3 md:p-4 rounded-lg md:rounded-2xl text-xs md:text-base ${
            message.type === 'success' 
              ? 'bg-green-100/80 text-green-800 border border-green-200' 
              : 'bg-red-100/80 text-red-800 border border-red-200'
          } backdrop-blur-sm`}>
            {message.text}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 mb-4 md:mb-6 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold transition-all duration-300 border-b sm:border-b-0 sm:border-r ${
                activeTab === 'profile'
                  ? `${themeClasses.primaryBg} ${themeClasses.primaryText} border-b-2 sm:border-b-0 sm:border-r-2 border-current`
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Profile</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold transition-all duration-300 border-b sm:border-b-0 sm:border-r ${
                activeTab === 'password'
                  ? `${themeClasses.primaryBg} ${themeClasses.primaryText} border-b-2 sm:border-b-0 sm:border-r-2 border-current`
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="hidden sm:inline">Password</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('delete')}
              className={`flex-1 py-3 md:py-4 px-3 md:px-6 text-xs md:text-sm font-semibold transition-all duration-300 ${
                activeTab === 'delete'
                  ? 'bg-red-600 text-white border-b-2 sm:border-b-0 border-current'
                  : 'text-gray-600 hover:bg-red-50 hover:text-red-600'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Delete</span>
              </div>
            </button>
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800">Profile Information</h2>
                  <p className="text-xs md:text-base text-gray-600">Update your personal details</p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  <div className="group">
                    <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                      <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                      required
                    />
                  </div>

                  <div className="group">
                    <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                      <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                    <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                    required
                  />
                </div>

                <div className="group">
                  <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                    <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-indigo-500 to-blue-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                    required
                  />
                </div>

                <div className="group">
                  <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                    <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>
                    Monthly Salary ($)
                  </label>
                  <input
                    type="number"
                    name="monthlySalary"
                    value={formData.monthlySalary}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-yellow-500/20 focus:border-yellow-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                  />
                </div>

                <div className="group">
                  <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                    <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z"/></svg>
                    Currency
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                  >
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="EUR">EUR (€) - Euro</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                    <option value="JPY">JPY (¥) - Japanese Yen</option>
                    <option value="AUD">AUD (A$) - Australian Dollar</option>
                    <option value="CAD">CAD (C$) - Canadian Dollar</option>
                    <option value="CHF">CHF (₣) - Swiss Franc</option>
                    <option value="CNY">CNY (¥) - Chinese Yuan</option>
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="LKR">LKR (Rs) - Sri Lankan Rupee</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 md:py-4 px-4 md:px-6 rounded-lg md:rounded-2xl font-bold text-xs md:text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : `${themeClasses.button} text-white shadow-2xl hover:shadow-3xl`
                  }`}
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Password Tab */}
        {activeTab === 'password' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg md:text-2xl font-bold text-gray-800">Change Password</h2>
                  <p className="text-xs md:text-base text-gray-600">Update your password for security</p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4 md:space-y-6">
                <div className="group">
                  <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                    <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-gray-500 to-gray-600 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-gray-500/20 focus:border-gray-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                    required
                  />
                </div>

                <div className="group">
                  <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                    <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.75 9L15 5.25l-2.83 2.83L18.75 14.58 24 9.33 21.17 6.5 18.75 9z"/></svg>
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    minLength="6"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                    required
                  />
                </div>

                <div className="group">
                  <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                    <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                    className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 md:py-4 px-4 md:px-6 rounded-lg md:rounded-2xl font-bold text-xs md:text-lg transition-all duration-300 transform hover:scale-[1.02] ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-2xl hover:shadow-3xl'
                  }`}
                >
                  {isLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Delete Account Tab */}
        {activeTab === 'delete' && (
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6">
                <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-red-600 via-pink-600 to-red-700 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">
                  <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-gray-900">Delete Account</h3>
                  <p className="text-xs md:text-base text-gray-600 mt-1">Permanently delete your account</p>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-red-50/80 border-l-4 border-red-500 p-3 md:p-6 mb-4 md:mb-6 rounded-lg">
                <div className="flex gap-2 md:gap-3">
                  <svg className="w-5 md:w-6 h-5 md:h-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="text-red-800 font-bold text-xs md:text-lg mb-1 md:mb-2">
                      <svg className="w-5 md:w-6 h-5 md:h-6 inline mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                      Warning
                    </h4>
                    <ul className="text-red-700 space-y-0.5 md:space-y-1 text-xs md:text-sm">
                      <li>• Your account will be permanently deleted</li>
                      <li>• All your expense records will be deleted</li>
                      <li>• You will lose access to all data</li>
                      <li>• This action cannot be reversed</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Delete Confirmation */}
              {!showDeleteConfirm ? (
                <div className="text-center py-6 md:py-8">
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 md:py-3 px-4 md:px-8 rounded-lg md:rounded-xl font-semibold text-xs md:text-base transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Delete My Account
                  </button>
                </div>
              ) : (
                <form onSubmit={handleDeleteAccount} className="space-y-4 md:space-y-6">
                  <div className="bg-gray-50/80 p-4 md:p-6 rounded-lg md:rounded-xl border-2 border-dashed border-red-300">
                    <h4 className="text-red-800 font-bold text-sm md:text-lg mb-2 md:mb-3">Final Confirmation Required</h4>
                    <p className="text-gray-700 mb-3 md:mb-4 text-xs md:text-base">
                      Enter your current password to confirm deletion:
                    </p>
                    
                    <div className="group">
                      <label className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
                        <svg className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded flex items-center justify-center mr-2 text-white p-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.75 9L15 5.25l-2.83 2.83L18.75 14.58 24 9.33 21.17 6.5 18.75 9z"/></svg>
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="deletePassword"
                        value={formData.deletePassword}
                        onChange={handleChange}
                        placeholder="Enter your password to confirm deletion"
                        className="w-full px-3 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-red-200/50 rounded-lg md:rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 transition-all duration-300 text-gray-900 text-xs md:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 md:gap-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setFormData(prev => ({ ...prev, deletePassword: '' }));
                      }}
                      className="flex-1 py-2 md:py-3 px-3 md:px-6 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg md:rounded-xl font-semibold text-xs md:text-base transition-all duration-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 py-2 md:py-3 px-3 md:px-6 rounded-lg md:rounded-xl font-bold text-xs md:text-base transition-all duration-300 transform hover:scale-[1.02] ${
                        isLoading 
                          ? 'bg-gray-400 cursor-not-allowed text-white' 
                          : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-xl hover:shadow-2xl'
                      }`}
                    >
                      {isLoading ? 'Deleting...' : 'Delete Forever'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;