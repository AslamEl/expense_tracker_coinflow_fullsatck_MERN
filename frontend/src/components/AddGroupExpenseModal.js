import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';

const AddGroupExpenseModal = ({ group, onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Other',
    notes: ''
  });
  const [paidBy, setPaidBy] = useState(user?._id || user?.id || '');
  const [selectedMembers, setSelectedMembers] = useState(
    group.members.map(m => (typeof m.user === 'object' ? m.user._id : m.user))
  );
  const [splitMethod, setSplitMethod] = useState('equal');
  const [percentages, setPercentages] = useState({});
  const [customAmounts, setCustomAmounts] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    'Food', 'Transport', 'Shopping', 'Bills', 'Entertainment',
    'Healthcare', 'Education', 'Travel', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMemberToggle = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        const newMembers = prev.filter(id => id !== memberId);
        setPercentages(prev => {
          const copy = { ...prev };
          delete copy[memberId];
          return copy;
        });
        setCustomAmounts(prev => {
          const copy = { ...prev };
          delete copy[memberId];
          return copy;
        });
        return newMembers;
      } else {
        return [...prev, memberId];
      }
    });
  };

  const handlePercentageChange = (memberId, value) => {
    setPercentages(prev => ({
      ...prev,
      [memberId]: parseFloat(value) || 0
    }));
  };

  const handleCustomAmountChange = (memberId, value) => {
    setCustomAmounts(prev => ({
      ...prev,
      [memberId]: parseFloat(value) || 0
    }));
  };

  const getTotalPercentage = () => {
    return Object.values(percentages).reduce((sum, p) => sum + p, 0);
  };

  const getTotalCustom = () => {
    return Object.values(customAmounts).reduce((sum, a) => sum + a, 0);
  };

  const validateForm = () => {
    if (!formData.description.trim()) {
      setError('Please enter a description');
      return false;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (selectedMembers.length < 2) {
      setError('Please select at least 2 people to split the expense with');
      return false;
    }
    if (!paidBy) {
      setError('Please select who paid');
      return false;
    }

    // Validation for percentage split
    if (splitMethod === 'percentage') {
      const total = getTotalPercentage();
      if (Math.abs(total - 100) > 0.01) {
        setError(`Percentages must sum to 100%. Current: ${total.toFixed(2)}%`);
        return false;
      }
    }

    // Validation for custom split
    if (splitMethod === 'custom') {
      const total = getTotalCustom();
      const amount = parseFloat(formData.amount);
      if (Math.abs(total - amount) > 0.01) {
        setError(`Custom amounts must sum to ${amount.toFixed(2)}. Current: ${total.toFixed(2)}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        paidBy,
        splitAmong: selectedMembers,
        splitMethod,
        notes: formData.notes
      };

      // Add method-specific data
      if (splitMethod === 'percentage') {
        expenseData.percentages = percentages;
      } else if (splitMethod === 'custom') {
        expenseData.customAmounts = customAmounts;
      }

      await onSubmit(expenseData);
      setFormData({ description: '', amount: '', category: 'Other', notes: '' });
      setPercentages({});
      setCustomAmounts({});
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMemberName = (memberId) => {
    const member = group.members.find(m => {
      const id = typeof m.user === 'object' ? m.user._id : m.user;
      return id === memberId;
    });
    if (member && typeof member.user === 'object') {
      return `${member.user.firstName} ${member.user.lastName}`;
    }
    return 'Unknown';
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl max-w-2xl w-[90%] sm:w-full md:max-w-md lg:max-w-2xl max-h-[90vh] overflow-y-auto m-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 md:p-6 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold">Add Expense</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full w-8 md:w-10 h-8 md:h-10 flex items-center justify-center transition-colors flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg md:rounded-xl p-3 md:p-4 flex items-start gap-2 md:gap-3">
              <span className="text-red-400 text-lg md:text-xl flex-shrink-0">⚠️</span>
              <p className="text-red-700 text-xs md:text-sm">{error}</p>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
              What was this expense for?
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Lunch at Pizza Place"
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm md:text-base"
            />
          </div>

          {/* Amount */}
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                Total Amount ({group.currency})
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm md:text-base"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm md:text-base"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Paid By */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
              Who paid?
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-sm md:text-base"
            >
              <option value="">Select a member</option>
              {group.members.map(member => {
                const memberId = typeof member.user === 'object' ? member.user._id : member.user;
                return (
                  <option key={memberId} value={memberId}>
                    {getMemberName(memberId)}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Split Method */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2 md:mb-3">
              How to split?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {['equal', 'percentage', 'custom'].map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSplitMethod(method)}
                  className={`p-2 md:p-4 rounded-lg md:rounded-xl border-2 transition-all text-left font-semibold text-xs md:text-sm ${
                    splitMethod === method
                      ? 'border-purple-600 bg-purple-50 text-purple-900'
                      : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300'
                  }`}
                >
                  <div className="capitalize">{method === 'equal' ? 'Equally' : method}</div>
                  <div className="text-xs font-normal text-gray-600 mt-1 hidden md:block">
                    {method === 'equal' && 'Same for everyone'}
                    {method === 'percentage' && 'By percentages'}
                    {method === 'custom' && 'Specific amounts'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Members Selection */}
          <div>
            <div className="flex items-center justify-between mb-2 md:mb-3">
              <label className="block text-xs md:text-sm font-bold text-gray-700">
                Split with:
              </label>
              <span className={`text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full ${
                selectedMembers.length >= 2
                  ? 'bg-green-100 text-green-700'
                  : selectedMembers.length === 1
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {selectedMembers.length} / {group.members.length} selected
                {selectedMembers.length >= 2 ? ' ✓' : ''}
              </span>
            </div>

            {selectedMembers.length < 2 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg md:rounded-xl p-2 md:p-3 mb-3 md:mb-4 flex items-start gap-2">
                <span className="text-yellow-600 text-sm md:text-base flex-shrink-0">⚠️</span>
                <p className="text-yellow-700 text-xs md:text-sm">
                  Minimum 2 people required to split the expense
                </p>
              </div>
            )}

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {group.members.map(member => {
                const memberId = typeof member.user === 'object' ? member.user._id : member.user;
                const isSelected = selectedMembers.includes(memberId);

                return (
                  <div key={memberId} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMemberToggle(memberId)}
                      className="w-4 md:w-5 h-4 md:h-5 text-purple-600 rounded cursor-pointer flex-shrink-0"
                    />
                    <label className="flex-1 cursor-pointer text-xs md:text-sm font-medium text-gray-700">
                      {getMemberName(memberId)}
                    </label>

                    {/* Split amount input based on method */}
                    {isSelected && splitMethod === 'percentage' && (
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={percentages[memberId] || ''}
                        onChange={(e) => handlePercentageChange(memberId, e.target.value)}
                        placeholder="%"
                        className="w-16 md:w-20 px-2 py-1 border border-gray-300 rounded text-right text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    )}

                    {isSelected && splitMethod === 'custom' && (
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={customAmounts[memberId] || ''}
                        onChange={(e) => handleCustomAmountChange(memberId, e.target.value)}
                        placeholder={group.currency}
                        className="w-20 md:w-24 px-2 py-1 border border-gray-300 rounded text-right text-xs md:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Validation Messages */}
            {splitMethod === 'percentage' && getTotalPercentage() !== 100 && (
              <p className="text-xs md:text-sm text-orange-600 mt-2 font-medium">
                Total: {getTotalPercentage().toFixed(2)}% (need 100%)
              </p>
            )}
            {splitMethod === 'custom' && formData.amount && getTotalCustom() !== parseFloat(formData.amount) && (
              <p className="text-xs md:text-sm text-orange-600 mt-2 font-medium">
                Total: {group.currency} {getTotalCustom().toFixed(2)} (need {group.currency} {parseFloat(formData.amount).toFixed(2)})
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              rows="3"
              className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg md:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition resize-none text-sm md:text-base"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 md:gap-4 pt-3 md:pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 md:px-4 py-2 md:py-3 text-gray-700 bg-gray-100 rounded-lg md:rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-3 md:px-4 py-2 md:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg md:rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddGroupExpenseModal;
