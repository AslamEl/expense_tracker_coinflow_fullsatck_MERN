import React, { useState } from 'react';
import { Icons } from '../utils/svgIcons';
import { useCurrency } from '../contexts/CurrencyContext';

const ExpenseSummary = ({ expenses, incomes = [], groupCurrency = null }) => {
  const { currencySymbol: defaultCurrencySymbol, formatCurrencyWithDecimals: defaultFormatCurrency } = useCurrency();
  const [timeFilter, setTimeFilter] = useState('thisMonth');

  // Use group currency if provided, otherwise use user's default currency
  const currencySymbols = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'AUD': 'A$',
    'CAD': 'C$',
    'CHF': '₣',
    'CNY': '¥',
    'INR': '₹',
    'LKR': 'Rs'
  };

  const currencySymbol = groupCurrency ? currencySymbols[groupCurrency] : defaultCurrencySymbol;
  
  const formatCurrencyWithDecimals = (amount) => {
    if (groupCurrency) {
      return `${currencySymbols[groupCurrency]}${parseFloat(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
    return defaultFormatCurrency(amount);
  };

  // Filter expenses based on selected time period
  const getFilteredExpenses = () => {
    const now = new Date();
    let filteredExpenses = expenses;

    switch (timeFilter) {
      case 'today':
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          const today = new Date();
          return expenseDate.toDateString() === today.toDateString();
        });
        break;
      case 'thisWeek':
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate >= startOfWeek && expenseDate <= today;
        });
        break;
      case 'thisMonth':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate >= monthStart && expenseDate <= now;
        });
        break;
      case 'thisYear':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        yearStart.setHours(0, 0, 0, 0);
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate >= yearStart && expenseDate <= now;
        });
        break;
      default:
        // 'all' - use all expenses
        break;
    }

    return filteredExpenses;
  };

  // Filter incomes based on selected time period
  const getFilteredIncomes = () => {
    const now = new Date();
    let filteredIncomes = incomes;

    switch (timeFilter) {
      case 'today':
        filteredIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.createdAt || income.date);
          const today = new Date();
          return incomeDate.toDateString() === today.toDateString();
        });
        break;
      case 'thisWeek':
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);
        
        filteredIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.createdAt || income.date);
          return incomeDate >= startOfWeek && incomeDate <= today;
        });
        break;
      case 'thisMonth':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        monthStart.setHours(0, 0, 0, 0);
        filteredIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.createdAt || income.date);
          return incomeDate >= monthStart && incomeDate <= now;
        });
        break;
      case 'thisYear':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        yearStart.setHours(0, 0, 0, 0);
        filteredIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.createdAt || income.date);
          return incomeDate >= yearStart && incomeDate <= now;
        });
        break;
      default:
        // 'all' - use all incomes
        break;
    }

    return filteredIncomes;
  };

  const filteredExpenses = getFilteredExpenses();
  const filteredIncomes = getFilteredIncomes();

  // Calculate summary statistics
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalTransactions = filteredExpenses.length;
  const averageAmount = totalTransactions > 0 ? totalAmount / totalTransactions : 0;

  // Get category breakdown
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const categories = Object.entries(categoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Get top spending category
  const topCategory = categories.length > 0 ? categories[0] : null;

  // Income calculations
  const totalIncomeAmount = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalIncomeTransactions = filteredIncomes.length;
  const averageIncomeAmount = totalIncomeTransactions > 0 ? totalIncomeAmount / totalIncomeTransactions : 0;

  // Get income category breakdown
  const incomeCategoryTotals = filteredIncomes.reduce((acc, income) => {
    acc[income.category] = (acc[income.category] || 0) + income.amount;
    return acc;
  }, {});

  const incomeCategories = Object.entries(incomeCategoryTotals)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Get top income category
  const topIncomeCategory = incomeCategories.length > 0 ? incomeCategories[0] : null;

  // Get daily average for current period
  const getDaysInPeriod = () => {
    const now = new Date();
    switch (timeFilter) {
      case 'today':
        return 1;
      case 'thisWeek': {
        const dayOfWeek = now.getDay();
        return dayOfWeek + 1; // Current day plus previous days in the week
      }
      case 'thisMonth':
        return now.getDate(); // Day of the month
      case 'thisYear': {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.floor((now - startOfYear) / msPerDay) + 1;
      }
      default: {
        // For 'all', calculate days from oldest expense to today
        if (filteredExpenses.length === 0) return 1;
        const oldestExpense = new Date(filteredExpenses[filteredExpenses.length - 1]?.createdAt || filteredExpenses[filteredExpenses.length - 1]?.date || now);
        const msPerDay = 1000 * 60 * 60 * 24;
        return Math.floor((now - oldestExpense) / msPerDay) + 1;
      }
    }
  };

  const dailyAverage = totalAmount / getDaysInPeriod();

  const getCategoryIcon = (categoryName) => {
    const iconMap = {
      'Food': Icons.food,
      'Transport': Icons.transport,
      'Shopping': Icons.shopping,
      'Bills': Icons.bills,
      'Education': Icons.education,
      'Travel': Icons.travel,
      'Other': Icons.other
    };
    return iconMap[categoryName] || Icons.other;
  };

  const getIncomeCategoryIcon = (categoryName) => {
    const categoryLower = categoryName?.toLowerCase();
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
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Floating decorations */}
      <div className="absolute -top-6 -right-6 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent">
                Expense Summary
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">Comprehensive overview of your spending</p>
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex bg-white/60 backdrop-blur-sm rounded-lg md:rounded-2xl p-1 border border-gray-200/50 overflow-x-auto">
            {['today', 'thisWeek', 'thisMonth', 'thisYear', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-2 md:px-3 py-1 md:py-2 text-xs font-semibold rounded-lg md:rounded-xl transition-all duration-300 whitespace-nowrap ${
                  timeFilter === filter
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-green-600 hover:bg-white/80'
                }`}
              >
                {filter === 'today' ? 'Today' :
                 filter === 'thisWeek' ? 'Week' :
                 filter === 'thisMonth' ? 'Month' :
                 filter === 'thisYear' ? 'Year' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {/* Total Amount */}
          <div className="group bg-gradient-to-br from-red-50 to-rose-50 rounded-lg md:rounded-2xl p-4 md:p-6 border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <div className="text-white w-5 h-5 md:w-6 md:h-6">{Icons.creditCard}</div>
              </div>
              <span className="text-red-600 text-xs md:text-sm font-bold">{totalTransactions} items</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Spent</p>
            <p className="text-lg md:text-2xl font-black text-red-600">{formatCurrencyWithDecimals(totalAmount)}</p>
          </div>

          {/* Average Amount */}
          <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-2xl p-4 md:p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <div className="text-white w-5 h-5 md:w-6 md:h-6">{Icons.analytics}</div>
              </div>
              <span className="text-blue-600 text-xs md:text-sm font-bold">per transaction</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Average</p>
            <p className="text-lg md:text-2xl font-black text-blue-600">{formatCurrencyWithDecimals(averageAmount)}</p>
          </div>

          {/* Daily Average */}
          <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-2xl p-4 md:p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <div className="text-white w-5 h-5 md:w-6 md:h-6">{Icons.budget}</div>
              </div>
              <span className="text-purple-600 text-xs md:text-sm font-bold">daily</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Daily Average</p>
            <p className="text-lg md:text-2xl font-black text-purple-600">{formatCurrencyWithDecimals(dailyAverage)}</p>
          </div>

          {/* Top Category */}
          <div className="group bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg md:rounded-2xl p-4 md:p-6 border border-orange-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <div className="text-white w-6 h-6">{Icons.shopping}</div>
              </div>
              <span className="text-orange-600 text-sm font-bold">top</span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Top Category</p>
            <p className="text-lg font-black text-orange-600">
              {topCategory ? topCategory.name : 'No data'}
            </p>
            {topCategory && (
              <p className="text-sm text-orange-500 mt-1">{formatCurrencyWithDecimals(topCategory.amount)}</p>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-gray-500 to-gray-700 rounded-lg flex items-center justify-center mr-3 text-white text-xs">{Icons.analytics}</div>
            Category Breakdown
          </h3>
          
          {categories.length > 0 ? (
            <div className="space-y-4">
              {categories.slice(0, 8).map((category, index) => {
                const percentage = (category.amount / totalAmount) * 100;
                const colors = [
                  'bg-gradient-to-r from-red-400 to-red-600',
                  'bg-gradient-to-r from-blue-400 to-blue-600',
                  'bg-gradient-to-r from-green-400 to-green-600',
                  'bg-gradient-to-r from-purple-400 to-purple-600',
                  'bg-gradient-to-r from-orange-400 to-orange-600',
                  'bg-gradient-to-r from-pink-400 to-pink-600',
                  'bg-gradient-to-r from-indigo-400 to-indigo-600',
                  'bg-gradient-to-r from-teal-400 to-teal-600'
                ];
                
                return (
                  <div key={category.name} className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <div className="w-5 h-5 text-white">{getCategoryIcon(category.name)}</div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700 capitalize">
                          {category.name}
                        </span>
                        <div className="text-right">
                          <span className="text-sm font-bold text-gray-900">
                            {formatCurrencyWithDecimals(category.amount)}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {categories.length > 8 && (
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500">
                    And {categories.length - 8} more categories...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-white text-2xl w-8 h-8">{Icons.analytics}</div>
              </div>
              <p className="text-gray-600 font-medium">No expenses found for this period</p>
            </div>
          )}
        </div>

        {/* Income Summary Section */}
        <div className="mt-8 md:mt-12 pt-8 md:pt-12 border-t border-gray-200/50">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
                <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent">
                  Income Summary
                </h2>
                <p className="text-xs md:text-base text-gray-600 font-medium">Comprehensive overview of your income</p>
              </div>
            </div>

            {/* Time Filter */}
            <div className="flex bg-white/60 backdrop-blur-sm rounded-lg md:rounded-2xl p-1 border border-gray-200/50 overflow-x-auto">
              {['today', 'thisWeek', 'thisMonth', 'thisYear', 'all'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-2 md:px-3 py-1 md:py-2 text-xs font-semibold rounded-lg md:rounded-xl transition-all duration-300 whitespace-nowrap ${
                    timeFilter === filter
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-green-600 hover:bg-white/80'
                  }`}
                >
                  {filter === 'today' ? 'Today' :
                   filter === 'thisWeek' ? 'Week' :
                   filter === 'thisMonth' ? 'Month' :
                   filter === 'thisYear' ? 'Year' : 'All'}
                </button>
              ))}
            </div>
          </div>

          {/* Income Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            {/* Total Income */}
            <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-2xl p-4 md:p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg md:text-xl">💰</span>
                </div>
                <span className="text-green-600 text-xs md:text-sm font-bold">{totalIncomeTransactions} items</span>
              </div>
              <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Income</p>
              <p className="text-lg md:text-2xl font-black text-green-600">{formatCurrencyWithDecimals(totalIncomeAmount)}</p>
            </div>

            {/* Average Income */}
            <div className="group bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg md:rounded-2xl p-4 md:p-6 border border-teal-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white w-5 h-5 md:w-6 md:h-6">{Icons.analytics}</div>
                </div>
                <span className="text-teal-600 text-xs md:text-sm font-bold">per transaction</span>
              </div>
              <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Average</p>
              <p className="text-lg md:text-2xl font-black text-teal-600">{formatCurrencyWithDecimals(averageIncomeAmount)}</p>
            </div>

            {/* Daily Income Average */}
            <div className="group bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg md:rounded-2xl p-4 md:p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-500 to-sky-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-lg md:text-xl">📈</span>
                </div>
                <span className="text-blue-600 text-xs md:text-sm font-bold">daily</span>
              </div>
              <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Daily Average</p>
              <p className="text-lg md:text-2xl font-black text-blue-600">{formatCurrencyWithDecimals(totalIncomeAmount / getDaysInPeriod())}</p>
            </div>

            {/* Top Income Category */}
            <div className="group bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg md:rounded-2xl p-4 md:p-6 border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg md:text-xl">{topIncomeCategory ? getIncomeCategoryIcon(topIncomeCategory.name) : '💸'}</span>
                </div>
                <span className="text-yellow-600 text-sm font-bold">top</span>
              </div>
              <p className="text-gray-600 text-sm font-medium mb-1">Top Category</p>
              <p className="text-lg font-black text-yellow-600">
                {topIncomeCategory ? topIncomeCategory.name : 'No data'}
              </p>
              {topIncomeCategory && (
                <p className="text-sm text-yellow-500 mt-1">{formatCurrencyWithDecimals(topIncomeCategory.amount)}</p>
              )}
            </div>
          </div>

          {/* Income Category Breakdown */}
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50">
            <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
              <span className="text-xl mr-3">{getIncomeCategoryIcon('other')}</span>
              Income Category Breakdown
            </h4>
            
            {incomeCategories.length > 0 ? (
              <div className="space-y-4">
                {incomeCategories.slice(0, 8).map((category, index) => {
                  const percentage = (category.amount / totalIncomeAmount) * 100;
                  const colors = [
                    'bg-gradient-to-r from-green-400 to-green-600',
                    'bg-gradient-to-r from-teal-400 to-teal-600',
                    'bg-gradient-to-r from-cyan-400 to-cyan-600',
                    'bg-gradient-to-r from-blue-400 to-blue-600',
                    'bg-gradient-to-r from-yellow-400 to-yellow-600',
                    'bg-gradient-to-r from-amber-400 to-amber-600',
                    'bg-gradient-to-r from-lime-400 to-lime-600',
                    'bg-gradient-to-r from-emerald-400 to-emerald-600'
                  ];
                  
                  return (
                    <div key={category.name} className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white">{getIncomeCategoryIcon(category.name)}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700 capitalize">
                            {category.name}
                          </span>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">
                              {formatCurrencyWithDecimals(category.amount)}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${colors[index % colors.length]} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {incomeCategories.length > 8 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-500">
                      And {incomeCategories.length - 8} more categories...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">💸</span>
                </div>
                <p className="text-gray-600 font-medium">No incomes found for this period</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSummary;