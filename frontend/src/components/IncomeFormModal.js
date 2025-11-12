import React, { useState } from 'react';
import { Icons } from '../utils/svgIcons';
import { useCurrency } from '../contexts/CurrencyContext';

const IncomeFormModal = ({ onAddIncome, onClose, editingIncome = null, onUpdateIncome = null }) => {
  const { currencySymbol } = useCurrency();
  const [formData, setFormData] = useState({
    description: editingIncome?.description || '',
    amount: editingIncome?.amount || '',
    category: editingIncome?.category || 'Other',
    isRecurring: editingIncome?.isRecurring || false,
    recurringFrequency: editingIncome?.recurringFrequency || 'monthly'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Freelance',
    'Part-time Job',
    'Investment',
    'Bonus',
    'Gift',
    'Rental',
    'Business',
    'Dividend',
    'Interest',
    'Side Hustle',
    'Commission',
    'Royalty',
    'Other'
  ];

  const getIncomeIcon = (category) => {
    const iconMap = {
      'Freelance': Icons.freelance,
      'Part-time Job': Icons['part-time job'],
      'Investment': Icons.investment,
      'Bonus': Icons.bonus,
      'Gift': Icons.gift,
      'Rental': Icons.rental,
      'Business': Icons.business,
      'Dividend': Icons.dividend,
      'Interest': Icons.interest,
      'Side Hustle': Icons['side hustle'],
      'Commission': Icons.commission,
      'Royalty': Icons.royalty,
      'Other': Icons.other
    };
    return iconMap[category] || '📦';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be a positive number');
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (editingIncome && onUpdateIncome) {
        // Update mode
        await onUpdateIncome(editingIncome._id, {
          description: formData.description.trim(),
          amount: parseFloat(formData.amount),
          category: formData.category,
          isRecurring: formData.isRecurring,
          recurringFrequency: formData.isRecurring ? formData.recurringFrequency : undefined
        });
      } else {
        // Add mode
        await onAddIncome({
          description: formData.description.trim(),
          amount: parseFloat(formData.amount),
          category: formData.category,
          isRecurring: formData.isRecurring,
          recurringFrequency: formData.isRecurring ? formData.recurringFrequency : undefined
        });
      }
      
      // Reset form and close modal
      setFormData({
        description: '',
        amount: '',
        category: 'Other',
        isRecurring: false,
        recurringFrequency: 'monthly'
      });
      onClose();
    } catch (error) {
      console.error('Error processing income:', error);
      alert('Failed to process income. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="text-center mb-4 md:mb-6">
        <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-xl">
          <svg className="w-8 md:w-10 h-8 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">
          {editingIncome ? 'Edit Income' : 'Add Income'}
        </h3>
        <p className="text-xs md:text-base text-gray-600">
          {editingIncome ? 'Update your income details' : 'Record additional income sources like freelance work, bonuses, or investments'}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="group">
          <label htmlFor="description" className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
            <span className="mr-2 text-lg">📝</span>
            Description
          </label>
          <div className="relative">
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Freelance project, bonus, etc."
              className="w-full px-3 md:px-6 py-2 md:py-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl group-hover:bg-white/80 text-xs md:text-base"
              required
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-lg md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="group">
          <label htmlFor="amount" className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
            <span className="mr-2 text-lg">💰</span>
            Amount ({currencySymbol})
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 md:pl-6 flex items-center pointer-events-none">
              <span className="text-gray-500 font-bold text-xs md:text-base">{currencySymbol}</span>
            </div>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full pl-6 md:pl-12 pr-3 md:pr-6 py-2 md:py-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl group-hover:bg-white/80 text-xs md:text-base"
              required
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-lg md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      <div className="group">
        <label htmlFor="category" className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
          <span className="mr-2 text-lg">🏷️</span>
          Category
        </label>
        <div className="relative">
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 md:px-6 py-2 md:py-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-400 transition-all duration-300 text-gray-900 shadow-lg hover:shadow-xl group-hover:bg-white/80 appearance-none cursor-pointer text-xs md:text-base"
            required
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {getIncomeIcon(category)} {category}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-lg md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-blue-200">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="isRecurring"
              name="isRecurring"
              type="checkbox"
              checked={formData.isRecurring}
              onChange={handleChange}
              className="focus:ring-blue-500 h-3 md:h-4 w-3 md:w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-2 md:ml-3">
            <label htmlFor="isRecurring" className="font-medium text-xs md:text-base text-blue-900">
              Recurring Income
            </label>
            <p className="text-blue-700 text-xs md:text-sm">Check if this income repeats regularly</p>
          </div>
        </div>
        
        {formData.isRecurring && (
          <div className="mt-3 md:mt-4">
            <label htmlFor="recurringFrequency" className="flex items-center text-xs md:text-sm font-medium text-blue-900 mb-2">
              <span className="mr-2 text-lg">🔄</span>
              Frequency
            </label>
            <select
              id="recurringFrequency"
              name="recurringFrequency"
              value={formData.recurringFrequency}
              onChange={handleChange}
              className="w-full px-2 md:px-3 py-1 md:py-2 bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs md:text-base"
            >
              <option value="weekly">Weekly</option>
              <option value="bi-weekly">Bi-weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        )}
      </div>

      <div className="flex gap-3 md:gap-4 pt-2 md:pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 md:py-4 px-4 md:px-8 rounded-lg md:rounded-2xl font-bold text-xs md:text-lg transition-all duration-300 bg-gray-200/80 hover:bg-gray-300/80 text-gray-700 shadow-lg hover:shadow-xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 py-2 md:py-4 px-4 md:px-8 rounded-lg md:rounded-2xl font-bold text-xs md:text-lg transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] overflow-hidden ${
            isSubmitting 
              ? 'bg-gray-400/80 cursor-not-allowed backdrop-blur-sm' 
              : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {editingIncome ? 'Updating...' : 'Adding...'}
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-1 md:mr-2 text-base md:text-xl">💰</span>
              <span className="hidden xs:inline">{editingIncome ? 'Update Income' : 'Add Income'}</span>
              <span className="xs:hidden">{editingIncome ? 'Update' : 'Add'}</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default IncomeFormModal;