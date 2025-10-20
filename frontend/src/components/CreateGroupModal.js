import React, { useState, useEffect } from 'react';
import { Icons } from '../utils/svgIcons';

const CreateGroupModal = ({ onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    currency: 'USD'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Group name is required');
      return;
    }

    if (formData.name.trim().length < 3) {
      alert('Group name must be at least 3 characters long');
      return;
    }

    setIsSubmitting(true);

    try {
      await onCreate({
        name: formData.name.trim(),
        description: formData.description.trim(),
        currency: formData.currency
      });
    } catch (error) {
      console.error('Error creating group:', error);
      alert(error.message || 'Failed to create group. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 md:p-4 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-6 w-[90%] sm:w-full max-w-xs md:max-w-md relative overflow-hidden animate-scaleIn max-h-[90vh] overflow-y-auto m-auto">
        {/* Background decorations */}
        <div className="absolute -top-8 -right-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-6 -left-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-lg"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 md:top-4 right-3 md:right-4 z-50 w-8 md:w-10 h-8 md:h-10 bg-white hover:bg-red-50 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-red-300"
          type="button"
        >
          <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-700 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-4 md:mb-6">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3 text-white">
              <div className="w-5 md:w-6 h-5 md:h-6">{Icons.members}</div>
            </div>
            <h3 className="text-lg md:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
              Create Group
            </h3>
            <p className="text-gray-600 text-xs md:text-sm">
              Start splitting expenses
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            {/* Group Name */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-200/50 text-center">
              <label htmlFor="name" className="flex items-center justify-center text-xs md:text-sm font-bold text-blue-800 mb-2">
                <div className="w-4 md:w-5 h-4 md:h-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded flex items-center justify-center mr-2 text-white text-xs">{Icons.pdf}</div>
                Group Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Weekend Trip"
                className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-xs md:text-sm text-center"
                required
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-green-200/50 text-center">
              <label htmlFor="description" className="flex items-center justify-center text-xs md:text-sm font-bold text-green-800 mb-2">
                <div className="w-4 md:w-5 h-4 md:h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded flex items-center justify-center mr-2 text-white text-xs">{Icons.analytics}</div>
                Description (Optional)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="What's this group for?"
                className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 resize-none text-xs md:text-sm text-center"
                rows={2}
                maxLength={500}
              />
            </div>

            {/* Currency */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-orange-200/50 text-center">
              <label htmlFor="currency" className="flex items-center justify-center text-xs md:text-sm font-bold text-orange-800 mb-2">
                <div className="w-4 md:w-5 h-4 md:h-5 bg-gradient-to-br from-orange-500 to-yellow-600 rounded flex items-center justify-center mr-2 text-white text-xs">{Icons.shopping}</div>
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-300 appearance-none cursor-pointer text-xs md:text-sm text-center"
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2 md:pt-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`group relative w-full px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden text-xs md:text-sm ${
                  isSubmitting 
                    ? 'bg-gray-400/80 cursor-not-allowed text-white' 
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}
              >
                {/* Button background animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Button content */}
                <div className="relative z-10 flex items-center justify-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="hidden sm:inline">Creating...</span>
                    </>
                  ) : (
                    <>
                      <span className="mr-1 md:mr-2">✨</span>
                      <span className="hidden sm:inline">Create Group</span>
                      <span className="sm:hidden">Create</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {/* Info Box */}
          <div className="mt-4 md:mt-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-purple-200/50">
            <h4 className="text-xs md:text-sm font-bold text-purple-800 mb-2 flex items-center justify-center">
              <span className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded flex items-center justify-center mr-2 text-white text-xs">ℹ️</span>
              What Happens Next
            </h4>
            <div className="space-y-1 text-xs text-purple-700">
              <div className="flex items-start">
                <span className="font-bold mr-1">•</span>
                <span>Get a 6-character join key</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold mr-1">•</span>
                <span>Share key with friends</span>
              </div>
              <div className="flex items-start">
                <span className="font-bold mr-1">•</span>
                <span>Start splitting!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;