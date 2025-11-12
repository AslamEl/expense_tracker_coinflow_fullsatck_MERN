import React, { useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

const SalaryFormModal = ({ monthlySalary, onSalaryUpdate, onClose }) => {
  const { currencySymbol } = useCurrency();
  const [tempSalary, setTempSalary] = useState(monthlySalary);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const salary = parseFloat(tempSalary) || 0;
    
    try {
      // Call the parent's update function which handles the API call
      await onSalaryUpdate(salary);
      onClose();
    } catch (error) {
      console.error('Error updating salary:', error);
      const errorMessage = error.message || 'Failed to update salary. Please try again.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 md:space-y-6">
      <div className="text-center mb-4 md:mb-6">
        <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-xl">
          <svg className="w-8 md:w-10 h-8 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        </div>
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">Monthly Salary</h3>
        <p className="text-xs md:text-base text-gray-600">Set your monthly salary to get better AI insights and budget recommendations</p>
      </div>

      <div className="group">
        <label htmlFor="income" className="flex items-center text-xs md:text-sm font-bold text-gray-800 mb-2 md:mb-3">
          <span className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-2 text-white text-xs">💰</span>
          Monthly Salary ({currencySymbol})
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 md:pl-6 flex items-center">
            <span className="text-gray-500 font-semibold text-base md:text-lg">{currencySymbol}</span>
          </div>
          <input
            type="number"
            id="income"
            value={tempSalary}
            onChange={(e) => setTempSalary(e.target.value)}
            placeholder="5000"
            min="0"
            step="0.01"
            className="w-full pl-8 md:pl-12 pr-3 md:pr-6 py-2 md:py-4 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-400 transition-all duration-300 text-gray-900 placeholder-gray-500 shadow-lg hover:shadow-xl text-base md:text-lg font-medium"
            required
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-lg md:rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg md:rounded-xl p-3 md:p-4 border border-green-200">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-4 md:w-5 h-4 md:h-5 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-2 md:ml-3">
            <h4 className="text-xs md:text-sm font-medium text-green-800">Why add salary?</h4>
            <p className="text-xs md:text-sm text-green-700 mt-1">
              Our AI uses your salary to provide personalized budget recommendations, spending alerts, and savings insights.
            </p>
          </div>
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
          disabled={saving}
          className={`flex-1 py-2 md:py-4 px-4 md:px-8 rounded-lg md:rounded-2xl font-bold text-xs md:text-lg transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02] overflow-hidden ${
            saving 
              ? 'bg-gray-400/80 cursor-not-allowed backdrop-blur-sm' 
              : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-3xl'
          }`}
        >
          {saving ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <span className="mr-1 md:mr-2 text-base md:text-xl">💰</span>
              <span className="hidden xs:inline">{monthlySalary > 0 ? 'Update Salary' : 'Set Salary'}</span>
              <span className="xs:hidden">{monthlySalary > 0 ? 'Update' : 'Set'}</span>
            </div>
          )}
        </button>
      </div>
    </form>
  );
};

export default SalaryFormModal;