import React, { useState, useEffect } from 'react';
import { Icons } from '../utils/svgIcons';
import { useCurrency } from '../contexts/CurrencyContext';

const Dashboard = ({ expenses, incomes, monthlySalary, groups = [] }) => {
  const { currencySymbol, formatCurrencyWithDecimals } = useCurrency();
  const [dashboardStats, setDashboardStats] = useState({
    totalExpenses: 0,
    totalIncome: 0,
    netBalance: 0,
    topCategory: '',
    monthlySpending: 0,
    groupExpenses: 0,
    savingsRate: 0
  });

  const [timeFilter, setTimeFilter] = useState('thisMonth'); // thisMonth, thisWeek, today, all

  const calculateDashboardStats = () => {
    const now = new Date();
    let filteredExpenses = expenses;
    let filteredIncomes = incomes;

    // Apply time filter
    switch (timeFilter) {
      case 'today':
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate.toDateString() === now.toDateString();
        });
        filteredIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.createdAt || income.date);
          return incomeDate.toDateString() === now.toDateString();
        });
        break;
      case 'thisWeek':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate >= startOfWeek;
        });
        filteredIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.createdAt || income.date);
          return incomeDate >= startOfWeek;
        });
        break;
      case 'thisMonth':
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.createdAt || expense.date);
          return expenseDate >= startOfMonth;
        });
        filteredIncomes = incomes.filter(income => {
          const incomeDate = new Date(income.createdAt || income.date);
          return incomeDate >= startOfMonth;
        });
        break;
      default:
        // 'all' - use all expenses and incomes
        break;
    }

    // Calculate total expenses
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Calculate total income (including salary)
    const totalIncomeFromSources = filteredIncomes.reduce((sum, income) => sum + income.amount, 0);
    let salaryToAdd = 0;
    if (timeFilter === 'thisMonth' || timeFilter === 'all') {
      salaryToAdd = monthlySalary;
    } else if (timeFilter === 'thisWeek') {
      // For weekly view, add proportional salary (weekly = monthly / 4.33)
      salaryToAdd = monthlySalary / 4.33;
    } else if (timeFilter === 'today') {
      // For daily view, add proportional salary (daily = monthly / 30)
      salaryToAdd = monthlySalary / 30;
    }
    const totalIncome = totalIncomeFromSources + salaryToAdd;

    // Calculate net balance
    const netBalance = totalIncome - totalExpenses;

    // Find top spending category
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});

    const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
      categoryTotals[a] > categoryTotals[b] ? a : b, 'N/A'
    );

    // Calculate group expenses
    const groupExpenses = (Array.isArray(groups) ? groups : []).reduce((total, group) => {
      return total + (group.totalExpenses || 0);
    }, 0);

    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100) : 0;

    setDashboardStats({
      totalExpenses,
      totalIncome,
      netBalance,
      topCategory,
      monthlySpending: totalExpenses,
      groupExpenses,
      savingsRate
    });
  };

  useEffect(() => {
    calculateDashboardStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, incomes, monthlySalary, groups, timeFilter]);

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'today': return 'Today';
      case 'thisWeek': return 'This Week';
      case 'thisMonth': return 'This Month';
      case 'all': return 'All Time';
      default: return 'This Month';
    }
  };

  const getBalanceColor = (balance) => {
    if (balance > 0) return 'text-green-600';
    if (balance < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getBalanceIcon = (balance) => {
    if (balance > 0) return Icons.analytics;
    if (balance < 0) return Icons.warning;
    return Icons.analytics;
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Floating decorations */}
      <div className="absolute -top-6 -right-6 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-3 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                Dashboard
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">Financial overview</p>
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex bg-white/60 backdrop-blur-sm rounded-lg md:rounded-2xl p-1 border border-gray-200/50 text-xs md:text-sm overflow-x-auto">
            {['today', 'thisWeek', 'thisMonth', 'all'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold rounded-lg md:rounded-xl whitespace-nowrap transition-all duration-300 ${
                  timeFilter === filter
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'
                }`}
              >
                {filter === 'today' ? 'Today' :
                 filter === 'thisWeek' ? 'Week' :
                 filter === 'thisMonth' ? 'Month' : 'All'}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          {/* Total Income */}
          <div className="group bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-2xl p-3 md:p-6 border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                <div className="w-5 md:w-6 h-5 md:h-6">{Icons.money}</div>
              </div>
              <span className="text-green-600 text-xs md:text-sm font-bold">+{((dashboardStats.totalIncome / (monthlySalary || 1)) * 100).toFixed(0)}%</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Income</p>
            <p className="text-lg md:text-2xl font-black text-green-600">{formatCurrencyWithDecimals(dashboardStats.totalIncome)}</p>
          </div>

          {/* Total Expenses */}
          <div className="group bg-gradient-to-br from-red-50 to-rose-50 rounded-lg md:rounded-2xl p-3 md:p-6 border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                <div className="w-5 md:w-6 h-5 md:h-6">{Icons.creditCard}</div>
              </div>
              <span className="text-red-600 text-xs md:text-sm font-bold">{dashboardStats.topCategory}</span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Total Expenses</p>
            <p className="text-lg md:text-2xl font-black text-red-600">{formatCurrencyWithDecimals(dashboardStats.totalExpenses)}</p>
          </div>

          {/* Net Balance */}
          <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-2xl p-3 md:p-6 border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                <div className="w-5 md:w-6 h-5 md:h-6">{getBalanceIcon(dashboardStats.netBalance)}</div>
              </div>
              <span className={`text-xs md:text-sm font-bold ${getBalanceColor(dashboardStats.netBalance)}`}>
                {dashboardStats.savingsRate.toFixed(1)}%
              </span>
            </div>
            <p className="text-gray-600 text-xs md:text-sm font-medium mb-1">Net Balance</p>
            <p className={`text-lg md:text-2xl font-black ${getBalanceColor(dashboardStats.netBalance)}`}>
              {formatCurrencyWithDecimals(dashboardStats.netBalance)}
            </p>
          </div>

          {/* Group Expenses */}
          <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg md:rounded-2xl p-3 md:p-6 border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                <div className="w-5 md:w-6 h-5 md:h-6">{Icons.members}</div>
              </div>
              <span className="text-purple-600 text-xs md:text-sm font-bold">{groups.length} groups</span>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Group Expenses</p>
            <p className="text-2xl font-black text-purple-600">{formatCurrencyWithDecimals(dashboardStats.groupExpenses)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200/50">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-2 text-white text-xs">{Icons.lightning}</div>
            Quick Actions - {getTimeFilterLabel()}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-black text-blue-600">{expenses.length}</p>
              <p className="text-sm text-gray-600 font-medium">Total Transactions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-green-600">{incomes.length}</p>
              <p className="text-sm text-gray-600 font-medium">Income Sources</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-purple-600">{groups.length}</p>
              <p className="text-sm text-gray-600 font-medium">Active Groups</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-orange-600">
                {dashboardStats.totalExpenses > 0 ? (dashboardStats.totalExpenses / expenses.length).toFixed(0) : 0}
              </p>
              <p className="text-sm text-gray-600 font-medium">Avg. per Transaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;