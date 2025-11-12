import React, { useState, useEffect } from 'react';
import { Icons } from '../utils/svgIcons';
import { useCurrency } from '../contexts/CurrencyContext';

const History = ({ expenses, incomes }) => {
  const { currencySymbol, formatCurrencyWithDecimals } = useCurrency();
  const [filteredData, setFilteredData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [dataType, setDataType] = useState('all'); // 'all', 'expenses', 'incomes'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'amount', 'category'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Get available years from data
  const getAvailableYears = () => {
    const allDates = [
      ...expenses.map(item => new Date(item.createdAt || item.date)),
      ...incomes.map(item => new Date(item.createdAt || item.date))
    ];
    
    const years = [...new Set(allDates.map(date => date.getFullYear()))];
    return years.sort((a, b) => b - a);
  };

  const months = [
    { value: 0, label: 'All Months' },
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  useEffect(() => {
    filterAndSortData();
  }, [expenses, incomes, selectedYear, selectedMonth, dataType, sortBy, sortOrder]);

  const filterAndSortData = () => {
    let combinedData = [];

    // Combine expenses and incomes based on dataType
    if (dataType === 'all' || dataType === 'expenses') {
      const expenseData = expenses.map(expense => ({
        ...expense,
        type: 'expense',
        displayAmount: -expense.amount, // Show expenses as negative
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200'
      }));
      combinedData = [...combinedData, ...expenseData];
    }

    if (dataType === 'all' || dataType === 'incomes') {
      const incomeData = incomes.map(income => ({
        ...income,
        type: 'income',
        displayAmount: income.amount, // Show incomes as positive
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200'
      }));
      combinedData = [...combinedData, ...incomeData];
    }

    // Filter by year and month
    const filtered = combinedData.filter(item => {
      const itemDate = new Date(item.createdAt || item.date);
      const yearMatch = itemDate.getFullYear() === selectedYear;
      const monthMatch = selectedMonth === 0 || itemDate.getMonth() + 1 === selectedMonth;
      return yearMatch && monthMatch;
    });

    // Sort data
    const sorted = filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'amount':
          aValue = Math.abs(a.amount);
          bValue = Math.abs(b.amount);
          break;
        case 'category':
          aValue = a.category || a.source || '';
          bValue = b.category || b.source || '';
          break;
        case 'date':
        default:
          aValue = new Date(a.createdAt || a.date);
          bValue = new Date(b.createdAt || b.date);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(sorted);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Food': 'food',
      'Transport': 'transport',
      'Shopping': 'shopping',
      'Bills': 'bills',
      'Entertainment': 'other',
      'Healthcare': 'other',
      'Education': 'education',
      'Travel': 'travel',
      'Other': 'other'
    };
    return Icons[iconMap[category] || 'other'];
  };

  const getTotalAmount = () => {
    return filteredData.reduce((total, item) => total + item.displayAmount, 0);
  };

  const getStatsForPeriod = () => {
    const totalExpenses = filteredData.filter(item => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const totalIncomes = filteredData.filter(item => item.type === 'income').reduce((sum, item) => sum + item.amount, 0);
    const netAmount = totalIncomes - totalExpenses;

    return { totalExpenses, totalIncomes, netAmount };
  };

  const stats = getStatsForPeriod();

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Floating decorations */}
      <div className="absolute -top-6 -right-6 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-3 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
                History
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">Transaction timeline</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4 mb-6 md:mb-8">
          {/* Year Filter */}
          <div className="group">
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-2 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-300"
            >
              {getAvailableYears().map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Month Filter */}
          <div className="group">
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="w-full px-2 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-300"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>

          {/* Data Type Filter */}
          <div className="group">
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Type</label>
            <select
              value={dataType}
              onChange={(e) => setDataType(e.target.value)}
              className="w-full px-2 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-300"
            >
              <option value="all">All</option>
              <option value="expenses">Expenses</option>
              <option value="incomes">Incomes</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="group">
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-300"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
              <option value="category">Category</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="group">
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1 md:mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full px-2 md:px-4 py-2 md:py-3 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg md:rounded-xl text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all duration-300"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Period Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-bold">Total Transactions</p>
                <p className="text-2xl font-black text-blue-800">{filteredData.length}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white">
                <div className="w-6 h-6">{Icons.analytics}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-bold">Total Income</p>
                <p className="text-2xl font-black text-green-800">{formatCurrencyWithDecimals(stats.totalIncomes)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white">
                <div className="w-6 h-6">{Icons.money}</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-200/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-bold">Total Expenses</p>
                <p className="text-2xl font-black text-red-800">{formatCurrencyWithDecimals(stats.totalExpenses)}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center text-white">
                <div className="w-6 h-6">{Icons.creditCard}</div>
              </div>
            </div>
          </div>

          <div className={`bg-gradient-to-br rounded-2xl p-6 border ${stats.netAmount >= 0 ? 'from-purple-50 to-pink-50 border-purple-200/50' : 'from-orange-50 to-red-50 border-orange-200/50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-bold ${stats.netAmount >= 0 ? 'text-purple-600' : 'text-orange-600'}`}>Net Amount</p>
                <p className={`text-2xl font-black ${stats.netAmount >= 0 ? 'text-purple-800' : 'text-orange-800'}`}>
                  {formatCurrencyWithDecimals(stats.netAmount)}
                </p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center text-white ${stats.netAmount >= 0 ? 'from-purple-500 to-pink-600' : 'from-orange-500 to-red-600'}`}>
                {stats.netAmount >= 0 ? <div className="w-6 h-6">{Icons.analytics}</div> : <div className="w-6 h-6">{Icons.warning}</div>}
              </div>
            </div>
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 overflow-hidden">
          <div className="p-6 border-b border-gray-200/50">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mr-2 text-white text-xs">{Icons.pdf}</div>
              Transactions ({filteredData.length})
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {filteredData.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <div className="w-10 h-10">{Icons.analytics}</div>
                </div>
                <p className="text-gray-500 text-lg font-medium">No transactions found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters</p>
              </div>
            ) : (
              filteredData.map((item, index) => (
                <div key={`${item.type}-${item._id}-${index}`} 
                     className={`p-4 border-b border-gray-100/50 last:border-b-0 hover:bg-white/60 transition-all duration-300 ${item.bgColor}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center shadow-sm text-gray-700">
                        {item.type === 'expense' ? getCategoryIcon(item.category) : <div className="w-6 h-6">{Icons.money}</div>}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{item.description || item.source}</h4>
                        <p className="text-sm text-gray-600">
                          {item.category || item.source} • {formatDate(item.createdAt || item.date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-black ${item.color}`}>
                        {formatCurrencyWithDecimals(item.displayAmount)}
                      </p>
                      <p className="text-sm text-gray-500 capitalize">{item.type}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;