import React, { useState } from 'react';
import { Icons } from '../utils/svgIcons';
import { useCurrency } from '../contexts/CurrencyContext';

const RecentTransactions = ({ expenses, incomes, onDeleteExpense, onEditExpense, onDeleteIncome, onEditIncome, loading }) => {
  const [activeTab, setActiveTab] = useState('expenses');
  const [viewMode, setViewMode] = useState('recent'); // 'recent', 'today', 'week'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'category'
  const { currencySymbol, formatCurrencyWithDecimals } = useCurrency();

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="relative z-10 flex flex-col justify-center items-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 relative">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-white/20 border-t-white"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Loading Your Transactions</h3>
          <p className="text-gray-600">Fetching your financial data...</p>
        </div>
      </div>
    );
  }

  const showExpenses = activeTab === 'expenses';
  const showIncomes = activeTab === 'incomes';

  // Filter based on view mode and tab
  const getFilteredData = () => {
    const now = new Date();
    const data = showExpenses ? expenses : incomes;
    let filtered = [...data];

    switch (viewMode) {
      case 'today':
        const today = new Date();
        filtered = data.filter(item => {
          const itemDate = new Date(item.createdAt || item.date);
          return itemDate.toDateString() === today.toDateString();
        });
        break;
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        now.setHours(23, 59, 59, 999);
        
        filtered = data.filter(item => {
          const itemDate = new Date(item.createdAt || item.date);
          return itemDate >= weekAgo && itemDate <= now;
        });
        break;
      }
      default:
        // 'recent' - show all
        break;
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return b.amount - a.amount;
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'date':
        default:
          return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
      }
    });

    return filtered;
  };

  const filteredData = getFilteredData();

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

  const getCategoryColor = (category, isExpense = true) => {
    if (isExpense) {
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
    } else {
      const colors = {
        'freelance': 'from-emerald-300 to-green-400',
        'job': 'from-teal-300 to-cyan-400',
        'part-time job': 'from-teal-300 to-cyan-400',
        'investment': 'from-yellow-300 to-amber-400',
        'bonus': 'from-rose-300 to-pink-400',
        'gift': 'from-purple-300 to-violet-400',
        'rental': 'from-blue-300 to-indigo-400',
        'business': 'from-orange-300 to-amber-400',
        'dividend': 'from-yellow-300 to-lime-400',
        'interest': 'from-cyan-300 to-sky-400',
        'side hustle': 'from-green-300 to-emerald-400',
        'commission': 'from-pink-300 to-rose-400',
        'royalty': 'from-purple-300 to-pink-400',
        'other': 'from-slate-300 to-gray-400'
      };
      return colors[category?.toLowerCase()] || 'from-slate-300 to-gray-400';
    }
  };

  const getCategoryIcon = (category, isExpense = true) => {
    if (isExpense) {
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
    } else {
      const categoryLower = category?.toLowerCase();
      const emojiMap = {
        'freelance': '💻',
        'job': '🏢',
        'part-time job': '🏢',
        'investment': '📈',
        'bonus': '🎁',
        'gift': '🎉',
        'rental': '🏠',
        'business': '💼',
        'dividend': '💵',
        'interest': '🏦',
        'side hustle': '🚀',
        'commission': '💰',
        'royalty': '👑',
        'other': '💸'
      };
      return emojiMap[categoryLower] || '💸';
    }
  };

  const handleDelete = async (id, isExpense = true) => {
    if (window.confirm(`Are you sure you want to delete this ${isExpense ? 'expense' : 'income'}?`)) {
      try {
        if (isExpense) {
          await onDeleteExpense(id);
        } else {
          await onDeleteIncome(id);
        }
      } catch (error) {
        alert(`Failed to delete ${isExpense ? 'expense' : 'income'}. Please try again.`);
      }
    }
  };

  const totalAmount = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const avgAmount = filteredData.length > 0 ? totalAmount / filteredData.length : 0;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Floating decorations */}
      <div className={`absolute -top-6 -right-6 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br ${
        showExpenses 
          ? 'from-orange-400/20 to-red-500/20' 
          : 'from-green-400/20 to-emerald-500/20'
      } rounded-full blur-xl`}></div>
      <div className={`absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br ${
        showExpenses 
          ? 'from-purple-400/20 to-pink-500/20' 
          : 'from-teal-400/20 to-cyan-500/20'
      } rounded-full blur-lg`}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`w-12 md:w-16 h-12 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl ${
              showExpenses 
                ? 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600' 
                : 'bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600'
            }`}>
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showExpenses ? "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" : "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
              </svg>
            </div>
            <div>
              <h2 className={`text-xl md:text-3xl font-black bg-clip-text text-transparent ${
                showExpenses 
                  ? 'bg-gradient-to-r from-gray-900 via-orange-800 to-red-900' 
                  : 'bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900'
              }`}>
                {showExpenses ? 'Recent Expenses' : 'Recent Income'}
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">
                {showExpenses ? 'Your latest spending activity' : 'Your latest income activity'}
              </p>
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
                      ? showExpenses
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white/80'
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
                      ? showExpenses
                        ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white/80'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 md:mb-8 flex bg-white/60 backdrop-blur-sm rounded-lg md:rounded-2xl p-1 border border-gray-200/50 overflow-x-auto w-fit">
          {[
            { id: 'expenses', label: 'Expenses', icon: '📊', count: expenses.length },
            { id: 'incomes', label: 'Income', icon: '💰', count: incomes.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setViewMode('recent');
                setSortBy('date');
              }}
              className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2 text-xs md:text-sm font-semibold rounded-lg md:rounded-xl transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? tab.id === 'expenses'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-700 hover:bg-white/80'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-bold ${
                activeTab === tab.id ? 'bg-white/30' : 'bg-gray-200'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        {filteredData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className={`bg-gradient-to-br rounded-xl md:rounded-2xl p-3 md:p-4 border ${
              showExpenses 
                ? 'from-blue-50 to-indigo-50 border-blue-200/50' 
                : 'from-blue-50 to-indigo-50 border-blue-200/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm font-medium text-blue-600">Total Transactions</p>
                  <p className="text-lg md:text-2xl font-black text-blue-700">{filteredData.length}</p>
                </div>
                <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.analytics}</div>
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br rounded-xl md:rounded-2xl p-3 md:p-4 border ${
              showExpenses 
                ? 'from-red-50 to-rose-50 border-red-200/50' 
                : 'from-green-50 to-emerald-50 border-green-200/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs md:text-sm font-medium ${showExpenses ? 'text-red-600' : 'text-green-600'}`}>
                    Total Amount
                  </p>
                  <p className={`text-lg md:text-2xl font-black ${showExpenses ? 'text-red-700' : 'text-green-700'}`}>
                    {formatCurrencyWithDecimals(totalAmount)}
                  </p>
                </div>
                <div className={`w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br rounded-lg md:rounded-xl flex items-center justify-center ${
                  showExpenses 
                    ? 'from-red-500 to-rose-600' 
                    : 'from-green-500 to-emerald-600'
                }`}>
                  <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.money}</div>
                </div>
              </div>
            </div>

            <div className={`bg-gradient-to-br rounded-xl md:rounded-2xl p-3 md:p-4 border ${
              showExpenses 
                ? 'from-green-50 to-emerald-50 border-green-200/50' 
                : 'from-teal-50 to-cyan-50 border-teal-200/50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs md:text-sm font-medium ${showExpenses ? 'text-green-600' : 'text-blue-600'}`}>
                    Average
                  </p>
                  <p className={`text-lg md:text-2xl font-black ${showExpenses ? 'text-green-700' : 'text-blue-700'}`}>
                    {formatCurrencyWithDecimals(avgAmount)}
                  </p>
                </div>
                <div className={`w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br rounded-lg md:rounded-xl flex items-center justify-center ${
                  showExpenses 
                    ? 'from-green-500 to-emerald-600' 
                    : 'from-teal-500 to-cyan-600'
                }`}>
                  <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.analytics}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items List - Table Format */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-200/50 overflow-hidden">
          <h3 className={`text-sm md:text-lg font-bold mb-4 md:mb-6 flex items-center gap-2 md:gap-3 ${
            showExpenses ? 'text-gray-800' : 'text-gray-800'
          }`}>
            <div className={`w-5 md:w-6 h-5 md:h-6 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${
              showExpenses 
                ? 'bg-gradient-to-r from-orange-500 to-red-600' 
                : 'bg-gradient-to-r from-green-500 to-emerald-600'
            }`}>
              <div className="w-3 md:w-4 h-3 md:h-4">{showExpenses ? Icons.alert : Icons.money}</div>
            </div>
            <span className="truncate">{showExpenses ? 'Expense' : 'Income'} List <span className="hidden sm:inline">({filteredData.length} items)</span></span>
          </h3>

          {filteredData.length === 0 ? (
            <div className="text-center py-8 md:py-12">
              <div className={`w-16 md:w-24 h-16 md:h-24 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 ${
                showExpenses 
                  ? 'bg-gradient-to-br from-orange-400 to-red-500' 
                  : 'bg-gradient-to-br from-green-400 to-emerald-500'
              }`}>
                <div className="w-8 md:w-12 h-8 md:h-12 text-white">
                  {showExpenses ? Icons.alert : '💰'}
                </div>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-4">
                No {showExpenses ? 'Expenses' : 'Incomes'} Found
              </h3>
              <p className="text-xs md:text-base text-gray-600">No {showExpenses ? 'expenses' : 'incomes'} match your current filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-3 md:gap-4 mb-3 md:mb-4 px-3 md:px-4 py-2 md:py-3 bg-white/60 rounded-lg md:rounded-xl border border-gray-200/50">
                <div className="col-span-3 md:col-span-3 text-xs md:text-sm font-bold text-gray-600">Category</div>
                <div className="col-span-4 md:col-span-4 text-xs md:text-sm font-bold text-gray-600">Date & Time</div>
                <div className="col-span-2 md:col-span-2 text-xs md:text-sm font-bold text-gray-600 text-right">Amount</div>
                <div className="col-span-3 md:col-span-3 text-xs md:text-sm font-bold text-gray-600 text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="space-y-2 md:space-y-3">
                {filteredData.map((item) => (
                  <div
                    key={item._id}
                    className="group grid grid-cols-12 gap-3 md:gap-4 bg-white/80 backdrop-blur-sm rounded-lg md:rounded-xl p-3 md:p-4 border border-gray-200/50 hover:shadow-lg transition-all duration-300 hover:bg-white/90 items-center"
                  >
                    {/* Category */}
                    <div className="col-span-3 md:col-span-3 min-w-0">
                      <div className="flex items-center gap-2">
                        {showExpenses ? (
                          <span className="text-lg md:text-xl flex-shrink-0">
                            {getCategoryIcon(item.category, true)}
                          </span>
                        ) : (
                          <span className="text-lg md:text-xl flex-shrink-0">
                            {getCategoryIcon(item.category, false)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <span className="text-xs md:text-sm font-semibold text-gray-700 capitalize truncate block">
                            {item.category}
                          </span>
                          {item.isRecurring && (
                            <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-600">
                              🔄 {item.recurringFrequency || 'Monthly'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="col-span-4 md:col-span-4">
                      <div className="flex flex-col">
                        <span className="text-xs md:text-sm font-semibold text-gray-800">
                          {new Date(item.createdAt || item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt || item.date).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="col-span-2 md:col-span-2 text-right">
                      <span className={`text-xs md:text-sm font-bold ${
                        showExpenses ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {showExpenses ? '-' : '+'}
                        {formatCurrencyWithDecimals(item.amount)}
                      </span>
                    </div>

                    {/* Actions - Always visible */}
                    <div className="col-span-3 md:col-span-3 flex items-center justify-end gap-1 transition-opacity duration-200">
                      <button
                        onClick={() => {
                          if (showExpenses) {
                            onEditExpense(item);
                          } else {
                            onEditIncome(item);
                          }
                        }}
                        className="w-7 md:w-8 h-7 md:h-8 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                        title="Edit"
                      >
                        <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, showExpenses)}
                        className="w-7 md:w-8 h-7 md:h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                        title="Delete"
                      >
                        <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;
