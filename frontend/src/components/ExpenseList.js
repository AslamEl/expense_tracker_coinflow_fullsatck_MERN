import React from 'react';
import ExpenseItem from './ExpenseItem';

const ExpenseList = ({ expenses, onDeleteExpense, onEditExpense, loading }) => {
  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-center items-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 relative">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Your Expenses</h3>
          <p className="text-gray-600">Fetching your financial data...</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 text-center py-12">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">!</span>
            </div>
          </div>
          <h3 className="text-2xl font-black text-gray-900 mb-3">No Expenses Yet</h3>
          <p className="text-gray-600 text-lg font-medium mb-4">Start tracking your spending with CoinFlow</p>
          <p className="text-gray-500">Add your first expense using the form above to begin your financial journey.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        <div className="px-4 md:px-8 py-6 md:py-8 border-b border-white/20 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-4 flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mr-0 sm:mr-4 shadow-xl flex-shrink-0">
              <svg className="w-5 md:w-6 h-5 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">
                Recent Expenses
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">
                Your latest transactions and spending history
              </p>
            </div>
          </div>
        </div>
        
        {/* Desktop Table View - Hidden on Mobile */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gradient-to-r from-gray-50/80 to-gray-100/80 backdrop-blur-sm">
              <tr>
                <th className="px-4 md:px-8 py-4 md:py-5 text-left text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Description
                  </div>
                </th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-left text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Category
                  </div>
                </th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-left text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Amount
                  </div>
                </th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-left text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                    Date
                  </div>
                </th>
                <th className="px-4 md:px-8 py-4 md:py-5 text-right text-xs md:text-sm font-bold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center justify-end">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Action
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-white/20">
              {expenses.map((expense) => (
                <ExpenseItem
                  key={expense._id}
                  expense={expense}
                  onDeleteExpense={onDeleteExpense}
                  onEditExpense={onEditExpense}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View - Visible on Mobile Only */}
        <div className="sm:hidden px-3 md:px-4 py-4 space-y-3">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <ExpenseItemCard 
                key={expense._id}
                expense={expense}
                onDeleteExpense={onDeleteExpense}
                onEditExpense={onEditExpense}
              />
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ExpenseItemCard = ({ expense, onDeleteExpense, onEditExpense }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await onDeleteExpense(expense._id);
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    if (onEditExpense) {
      onEditExpense(expense);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Food': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white',
      'Transport': 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
      'Shopping': 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
      'Bills': 'bg-gradient-to-r from-red-500 to-orange-500 text-white',
      'Education': 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
      'Travel': 'bg-gradient-to-r from-sky-500 to-blue-500 text-white',
      'Other': 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
    };
    return colors[category] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
  };

  const getCategoryIcon = (category) => {
    const { Icons } = require('../utils/svgIcons');
    const iconMap = {
      'Food': 'food',
      'Transport': 'transport',
      'Shopping': 'shopping',
      'Bills': 'bills',
      'Education': 'education',
      'Travel': 'travel',
      'Other': 'other'
    };
    return Icons[iconMap[category] || 'other'];
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm border border-white/30 rounded-xl p-4 hover:bg-white/80 hover:shadow-md transition-all duration-300 group">
      <div className="space-y-3">
        {/* Description and Category */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-700 text-sm">
                {getCategoryIcon(expense.category)}
              </div>
              <p className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-700 transition-colors">
                {expense.description}
              </p>
            </div>
            <span className={`inline-flex items-center px-2 py-1 text-xs font-bold rounded-lg shadow-md w-full justify-center mt-2 ${getCategoryColor(expense.category)}`}>
              <span className="mr-1 w-3 h-3">{getCategoryIcon(expense.category)}</span>
              {expense.category}
            </span>
          </div>
        </div>

        {/* Amount and Date */}
        <div className="flex items-end justify-between pt-2 border-t border-white/30">
          <div>
            <p className="text-xs text-gray-500 font-medium mb-1">Amount</p>
            <div className="text-lg font-black text-gray-900 group-hover:text-green-600 transition-colors">
              ${expense.amount.toFixed(2)}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium mb-1">Date</p>
            <p className="text-xs font-semibold text-gray-700">
              {formatDate(expense.date)}
            </p>
          </div>
        </div>

        {/* Edit and Delete Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleEdit}
            className="w-12 h-12 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-2xl flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg"
            title="Edit expense"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="w-12 h-12 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-2xl flex items-center justify-center transition-colors duration-200 shadow-md hover:shadow-lg"
            title="Delete expense"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;