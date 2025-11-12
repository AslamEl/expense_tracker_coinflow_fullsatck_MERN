import React from 'react';
import { Icons } from '../utils/svgIcons';

const ExpenseItem = ({ expense, onDeleteExpense, onEditExpense }) => {
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
      year: 'numeric',
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
    <tr className="group hover:bg-white/80 transition-all duration-300 hover:shadow-lg">
      <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-lg md:rounded-xl flex items-center justify-center mr-2 md:mr-4 shadow-sm group-hover:shadow-md transition-shadow duration-300 text-gray-800 text-sm md:text-base">
            {getCategoryIcon(expense.category)}
          </div>
          <div className="min-w-0">
            <div className="text-xs md:text-sm font-bold text-gray-900 group-hover:text-indigo-700 transition-colors truncate">
              {expense.description}
            </div>
            <div className="text-xs text-gray-500 font-medium">Transaction</div>
          </div>
        </div>
      </td>
      <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
        <span className={`inline-flex items-center px-2 md:px-4 py-1 md:py-2 text-xs font-bold rounded-lg md:rounded-2xl shadow-lg ${getCategoryColor(expense.category)}`}>
          <span className="mr-1 w-3 md:w-4 h-3 md:h-4">{getCategoryIcon(expense.category)}</span>
          {expense.category}
        </span>
      </td>
      <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
        <div className="text-base md:text-lg font-black text-gray-900 group-hover:text-green-600 transition-colors">
          ${expense.amount.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 font-medium">USD</div>
      </td>
      <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap">
        <div className="text-xs md:text-sm font-semibold text-gray-700">
          {formatDate(expense.date)}
        </div>
      </td>
      <td className="px-4 md:px-8 py-4 md:py-6 whitespace-nowrap text-right">
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleEdit}
            className="w-9 md:w-10 h-9 md:h-10 bg-blue-100 hover:bg-blue-500 text-blue-600 hover:text-white rounded-lg md:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="w-9 md:w-10 h-9 md:h-10 bg-red-100 hover:bg-red-500 text-red-600 hover:text-white rounded-lg md:rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ExpenseItem;