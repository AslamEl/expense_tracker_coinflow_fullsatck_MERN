import React, { useState } from 'react';
import { Icons } from '../utils/svgIcons';

const ExpenseFormModal = ({ onAddExpense, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Food', 
    'Transport', 
    'Shopping', 
    'Bills',
    'Education',
    'Travel',
    'Other'
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
    
    if (!formData.description.trim() || !formData.amount) {
      alert('Please fill in all fields');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('Amount must be a positive number');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddExpense({
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category
      });
      
      // Reset form and close modal
      setFormData({
        description: '',
        amount: '',
        category: 'Other'
      });
      onClose();
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="text-center mb-4 md:mb-6">
        <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-xl">
          <svg className="w-8 md:w-10 h-8 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Add Expense</h3>
        <p className="text-xs md:text-base text-gray-600">Track your spending and categorize expenses</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <div className="group">
          <label htmlFor="description" className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
            <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-2 text-white text-xs">{Icons.pdf}</div>
            Description
          </label>
          <div className="relative">
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What did you spend on?"
              className="w-full px-3 md:px-6 py-2 md:py-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-500/20 focus:border-red-400 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl group-hover:bg-white/80 text-xs md:text-base"
              required
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-rose-500/5 rounded-lg md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        <div className="group">
          <label htmlFor="amount" className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
            <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-2 text-white text-xs">{Icons.money}</div>
            Amount ($)
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="w-full px-3 md:px-6 py-2 md:py-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl group-hover:bg-white/80 text-xs md:text-base"
              required
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-lg md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      </div>

      <div className="group">
        <label htmlFor="category" className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
          <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-2 text-white text-xs">{Icons.shopping}</div>
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
            {categories.map(category => {
              const getCategoryIcon = (cat) => {
                const iconMap = {
                  'Food': 'food',
                  'Transport': 'transport',
                  'Shopping': 'shopping',
                  'Bills': 'bills',
                  'Education': 'education',
                  'Travel': 'travel',
                  'Other': 'other'
                };
                return Icons[iconMap[cat] || 'other'];
              };
              
              return (
                <option key={category} value={category}>
                  {getCategoryIcon(category)} {category}
                </option>
              );
            })}
          </select>
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
            <svg className="w-4 md:w-5 h-4 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-lg md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
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
              : 'bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:from-red-700 hover:via-rose-700 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-1 md:mr-2 text-base md:text-xl">✨</span>
              <span className="hidden xs:inline">Add Expense</span>
              <span className="xs:hidden">Add</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default ExpenseFormModal;