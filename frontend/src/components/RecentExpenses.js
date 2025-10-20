import React, { useState } from 'react';
import { Icons } from '../utils/svgIcons';

const RecentExpenses = ({ expenses, onDeleteExpense, loading }) => {
  const [viewMode, setViewMode] = useState('recent'); // 'recent', 'today', 'week'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'category'

  // Filter expenses based on selected view mode
  const getFilteredExpenses = () => {
    const now = new Date();
    let filteredExpenses = [...expenses];

    switch (viewMode) {
      case 'today':
        const today = new Date();
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate.toDateString() === today.toDateString();
        });
        break;
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        now.setHours(23, 59, 59, 999);
        
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate >= weekAgo && expenseDate <= now;
        });
        break;
      }
      default:
        // 'recent' - show all expenses sorted by date
        break;
    }

    // Sort expenses
    filteredExpenses.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
        default:
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
      }
    });

    return filteredExpenses;
  };

  const filteredExpenses = getFilteredExpenses();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'food': 'from-orange-300 to-red-400',
      'transportation': 'from-blue-300 to-indigo-400',
      'entertainment': 'from-purple-300 to-pink-400',
      'shopping': 'from-green-300 to-emerald-400',
      'bills': 'from-slate-500 to-slate-700',
      'healthcare': 'from-red-300 to-rose-400',
      'education': 'from-indigo-300 to-blue-400',
      'other': 'from-teal-300 to-cyan-400'
    };
    return colors[category?.toLowerCase()] || 'from-slate-500 to-slate-700';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'food': Icons.food,
      'transportation': Icons.transport,
      'transport': Icons.transport,
      'entertainment': Icons.analytics,
      'shopping': Icons.shopping,
      'bills': Icons.bills,
      'healthcare': Icons.alert,
      'education': Icons.education,
      'travel': Icons.travel,
      'other': Icons.other
    };
    return icons[category?.toLowerCase()] || Icons.other;
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await onDeleteExpense(expenseId);
      } catch (error) {
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Floating decorations */}
      <div className="absolute -top-6 -right-6 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-orange-400/20 to-red-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-orange-800 to-red-900 bg-clip-text text-transparent">
                Recent Expenses
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">Your latest spending activity</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 md:gap-4 justify-end">
            {/* View Mode Selector */}
            <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
              {['recent', 'today', 'week'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-2 md:px-3 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 capitalize ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-white/80'
                  }`}
                >
                  {mode === 'recent' ? 'Latest' : mode}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex bg-white/60 backdrop-blur-sm rounded-2xl p-1 border border-gray-200/50">
              {['date', 'amount', 'category'].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-2 md:px-3 py-2 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 capitalize ${
                    sortBy === sort
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-purple-600 hover:bg-white/80'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-blue-600">Total Transactions</p>
                <p className="text-lg md:text-2xl font-black text-blue-700">{filteredExpenses.length}</p>
              </div>
              <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center">
                <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.analytics}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-red-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-red-600">Total Amount</p>
                <p className="text-lg md:text-2xl font-black text-red-700">
                  {formatCurrency(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
                </p>
              </div>
              <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg md:rounded-xl flex items-center justify-center">
                <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.money}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-green-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm font-medium text-green-600">Average</p>
                <p className="text-lg md:text-2xl font-black text-green-700">
                  {formatCurrency(filteredExpenses.length > 0 ? 
                    filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0) / filteredExpenses.length : 0
                  )}
                </p>
              </div>
              <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-xl flex items-center justify-center">
                <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.analytics}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/50 overflow-hidden">
          <h3 className="text-sm md:text-lg font-bold text-gray-800 mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <div className="w-5 md:w-6 h-5 md:h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
              <div className="w-3 md:w-4 h-3 md:h-4">{Icons.alert}</div>
            </div>
            <span className="truncate">Expense List <span className="hidden sm:inline">({filteredExpenses.length} items)</span></span>
          </h3>

          {loading ? (
            <div className="text-center py-8 md:py-12">
              <div className="w-12 md:w-16 h-12 md:h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3 md:mb-4"></div>
              <p className="text-xs md:text-base text-gray-600 font-medium">Loading expenses...</p>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <div className="w-8 md:w-12 h-8 md:h-12 text-white">{Icons.alert}</div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-4">No Expenses Found</h3>
              <p className="text-xs md:text-base text-gray-600">No expenses match your current filter criteria.</p>
            </div>
          ) : (
            <div className="space-y-2 md:space-y-3">
              {filteredExpenses.map((expense, index) => (
                <div
                  key={expense._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-lg md:rounded-2xl p-3 md:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:bg-white/90"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-4 flex-1">
                      {/* Category Icon */}
                      <div className={`w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br ${getCategoryColor(expense.category)} rounded-lg md:rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                        <div className="w-5 md:w-6 h-5 md:h-6 text-white">
                          {getCategoryIcon(expense.category)}
                        </div>
                      </div>

                      {/* Expense Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-1">
                          <p className="text-xs md:text-sm font-bold text-gray-900 truncate flex-1 min-w-0">
                            {expense.description || 'No description'}
                          </p>
                          <span className="text-sm md:text-base font-black text-red-600 flex-shrink-0">
                            {formatCurrency(expense.amount)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3 mt-2 flex-wrap">
                          <span className="inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 capitalize flex-shrink-0">
                            {expense.category}
                          </span>
                          <span className="text-xs md:text-sm text-gray-500 font-medium">
                            {formatDate(expense.createdAt || expense.date)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                        <button
                          onClick={() => handleDelete(expense._id)}
                          className="w-7 md:w-8 h-7 md:h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                          title="Delete expense"
                        >
                          <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentExpenses;