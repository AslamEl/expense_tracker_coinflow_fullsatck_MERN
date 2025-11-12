import React, { useState } from 'react';
import { Icons } from '../utils/svgIcons';
import { useCurrency } from '../contexts/CurrencyContext';

const ExpenseAnalytics = ({ expenses, incomes = [] }) => {
  const { currencySymbol, formatCurrencyWithDecimals } = useCurrency();
  const [analyticsView, setAnalyticsView] = useState('trends');

  // Get monthly trends
  const getMonthlyTrends = () => {
    const monthlyData = {};
    expenses.forEach(expense => {
      const date = new Date(expense.createdAt || expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { total: 0, count: 0 };
      }
      monthlyData[monthKey].total += expense.amount;
      monthlyData[monthKey].count += 1;
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        total: data.total,
        count: data.count,
        average: data.total / data.count
      }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  };

  // Get spending patterns
  const getSpendingPatterns = () => {
    const dayOfWeekSpending = Array(7).fill(0);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    expenses.forEach(expense => {
      const date = new Date(expense.createdAt || expense.date);
      dayOfWeekSpending[date.getDay()] += expense.amount;
    });

    const hourlySpending = Array(24).fill(0);
    expenses.forEach(expense => {
      const date = new Date(expense.createdAt || expense.date);
      hourlySpending[date.getHours()] += expense.amount;
    });

    return {
      dayOfWeek: dayOfWeekSpending.map((amount, index) => ({
        day: dayNames[index],
        amount
      })),
      hourly: hourlySpending.map((amount, hour) => ({
        hour,
        amount
      }))
    };
  };

  // Get category trends
  const getCategoryTrends = () => {
    const categoryMonthly = {};
    
    expenses.forEach(expense => {
      const date = new Date(expense.createdAt || expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!categoryMonthly[expense.category]) {
        categoryMonthly[expense.category] = {};
      }
      
      if (!categoryMonthly[expense.category][monthKey]) {
        categoryMonthly[expense.category][monthKey] = 0;
      }
      
      categoryMonthly[expense.category][monthKey] += expense.amount;
    });

    return categoryMonthly;
  };

  const monthlyTrends = getMonthlyTrends();
  const spendingPatterns = getSpendingPatterns();
  const categoryTrends = getCategoryTrends();

  const maxMonthlySpending = Math.max(...monthlyTrends.map(m => m.total));
  const maxDaySpending = Math.max(...spendingPatterns.dayOfWeek.map(d => d.amount));

  const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    return new Date(year, month - 1).toLocaleDateString('en-US', { 
      month: 'short', 
      year: '2-digit' 
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Floating decorations */}
      <div className="absolute -top-6 -right-6 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4 md:gap-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 bg-clip-text text-transparent">
                Expense Analytics
              </h2>
              <p className="text-xs md:text-base text-gray-600 font-medium">Deep insights into your spending patterns</p>
            </div>
          </div>

          {/* View Selector */}
          <div className="flex bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-1 border border-gray-200/50">
            {['trends', 'patterns', 'categories'].map((view) => (
              <button
                key={view}
                onClick={() => setAnalyticsView(view)}
                className={`px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold rounded-lg md:rounded-xl transition-all duration-300 capitalize whitespace-nowrap ${
                  analyticsView === view
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-white/80'
                }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        {/* Analytics Content */}
        {analyticsView === 'trends' && (
          <div className="space-y-6 md:space-y-8">
            {/* Monthly Trends */}
            <div className="bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-600/5 rounded-2xl md:rounded-3xl pointer-events-none"></div>
              
              <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-6 md:mb-8 flex items-center relative z-10">
                <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-3 md:mr-4 text-white text-xs shadow-lg">{Icons.analytics}</div>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Monthly Spending Trends</span>
              </h3>
              
              {monthlyTrends.length > 0 ? (
                <div className="space-y-4 md:space-y-5 relative z-10">
                  {monthlyTrends.map((month, index) => {
                    const percentage = maxMonthlySpending > 0 ? (month.total / maxMonthlySpending) * 100 : 0;
                    const isGrowing = index > 0 && month.total > monthlyTrends[index - 1].total;
                    const growthPercent = index > 0 ? ((month.total / monthlyTrends[index - 1].total - 1) * 100).toFixed(1) : 0;
                    
                    return (
                      <div key={month.month} className="group bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-blue-100/50 hover:border-blue-300/50 rounded-xl md:rounded-2xl p-4 md:p-5 transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="flex flex-col gap-3">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-300">
                                📅
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Month</p>
                                <p className="text-sm md:text-base font-bold text-gray-900">{formatMonth(month.month)}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <p className="text-xs text-gray-500 font-medium">Total Spent</p>
                                <p className="text-lg md:text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                  {formatCurrencyWithDecimals(month.total)}
                                </p>
                              </div>
                              {isGrowing ? (
                                <div className="bg-gradient-to-br from-red-100 to-rose-100 px-3 py-2 rounded-lg border border-red-200">
                                  <p className="text-xs text-red-600 font-bold">↗️ +{growthPercent}%</p>
                                </div>
                              ) : index > 0 ? (
                                <div className="bg-gradient-to-br from-green-100 to-emerald-100 px-3 py-2 rounded-lg border border-green-200">
                                  <p className="text-xs text-green-600 font-bold">↘️ -{(100 - (month.total / monthlyTrends[index - 1].total) * 100).toFixed(1)}%</p>
                                </div>
                              ) : null}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="flex-1">
                              <div className="relative h-3 md:h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full overflow-hidden shadow-inner">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-indigo-600 transition-all duration-700 ease-out group-hover:shadow-lg relative"
                                  style={{ width: `${percentage}%` }}
                                >
                                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                </div>
                              </div>
                            </div>
                            <span className="text-xs md:text-sm font-bold text-gray-700 min-w-fit">{Math.round(percentage)}%</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">{month.count} transactions</span>
                            <span className="text-gray-500">Avg: {formatCurrencyWithDecimals(month.average)}/transaction</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <p className="text-gray-500 text-sm md:text-base font-medium">No data available for trend analysis</p>
                </div>
              )}
            </div>
          </div>
        )}

        {analyticsView === 'patterns' && (
          <div className="space-y-6 md:space-y-8">
            {/* Day of Week Pattern */}
            <div className="bg-gradient-to-br from-white via-green-50/30 to-emerald-50/30 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-green-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-600/5 rounded-2xl md:rounded-3xl pointer-events-none"></div>
              
              <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-6 md:mb-8 flex items-center relative z-10">
                <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 md:mr-4 text-white text-xs shadow-lg">{Icons.budget}</div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Spending by Day of Week</span>
              </h3>
              
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 md:gap-5 relative z-10 mb-6">
                {spendingPatterns.dayOfWeek.map((day, index) => {
                  const percentage = maxDaySpending > 0 ? (day.amount / maxDaySpending) * 100 : 0;
                  const isWeekend = index === 0 || index === 6;
                  
                  return (
                    <div key={day.day} className="group flex flex-col items-center">
                      <div className="relative w-full mb-3">
                        <div className={`w-full h-16 sm:h-20 md:h-28 ${isWeekend ? 'bg-gradient-to-b from-red-300 to-red-600' : 'bg-gradient-to-b from-green-300 to-green-600'} rounded-xl md:rounded-2xl flex items-end justify-center relative overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 transform group-hover:-translate-y-1`}>
                          <div
                            className={`w-full ${isWeekend ? 'bg-red-500/40' : 'bg-green-500/40'} backdrop-blur-sm transition-all duration-700`}
                            style={{ height: `${Math.max(percentage, 15)}%` }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-xs md:text-sm font-black drop-shadow-lg">
                              {day.amount > 0 ? `$${Math.round(day.amount)}` : '—'}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-xl md:rounded-2xl"></div>
                        </div>
                      </div>
                      <p className={`text-xs md:text-sm font-bold ${isWeekend ? 'text-red-600' : 'text-green-600'} mb-1`}>
                        {day.day}
                      </p>
                      <p className="text-xs text-gray-600 font-semibold">
                        {formatCurrencyWithDecimals(day.amount)}
                      </p>
                      {day.amount > 0 && (
                        <div className="mt-1 px-2 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-xs font-bold text-orange-700">
                          {((day.amount / spendingPatterns.dayOfWeek.reduce((sum, d) => sum + d.amount, 0)) * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="relative z-10 pt-4 border-t border-green-100/50">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6">
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-red-300 to-red-600"></div>
                    <p className="text-sm text-gray-700"><span className="font-bold text-red-600">Weekend</span> Spending</p>
                  </div>
                  <div className="flex items-center gap-2 text-center sm:text-left">
                    <div className="w-4 h-4 rounded-md bg-gradient-to-br from-green-300 to-green-600"></div>
                    <p className="text-sm text-gray-700"><span className="font-bold text-green-600">Weekday</span> Spending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {analyticsView === 'categories' && (
          <div className="space-y-6 md:space-y-8">
            {/* Category Performance */}
            <div className="bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-pink-600/5 rounded-2xl md:rounded-3xl pointer-events-none"></div>
              
              <h3 className="text-sm md:text-xl font-bold text-gray-800 mb-6 md:mb-8 flex items-center relative z-10">
                <div className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mr-3 md:mr-4 text-white text-xs shadow-lg">{Icons.shopping}</div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Category Performance Over Time</span>
              </h3>
              
              {Object.keys(categoryTrends).length > 0 ? (
                <div className="space-y-6 md:space-y-7 relative z-10">
                  {Object.entries(categoryTrends).slice(0, 5).map(([category, months], catIndex) => {
                    const monthEntries = Object.entries(months).sort((a, b) => a[0].localeCompare(b[0])).slice(-4);
                    const maxAmount = Math.max(...monthEntries.map(([, amount]) => amount));
                    const totalAmount = Object.values(months).reduce((sum, amount) => sum + amount, 0);
                    
                    const categoryColors = [
                      'from-blue-400 to-blue-600',
                      'from-purple-400 to-purple-600',
                      'from-pink-400 to-pink-600',
                      'from-orange-400 to-orange-600',
                      'from-green-400 to-green-600'
                    ];
                    
                    return (
                      <div key={category} className="group bg-white/60 hover:bg-white/90 backdrop-blur-sm border border-purple-100/50 hover:border-purple-300/50 rounded-xl md:rounded-2xl p-5 md:p-6 transition-all duration-300 shadow-sm hover:shadow-md">
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4 justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${categoryColors[catIndex % categoryColors.length]} flex items-center justify-center text-white text-lg font-bold group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                📊
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Category</p>
                                <p className="text-base md:text-lg font-bold text-gray-900 capitalize">{category}</p>
                              </div>
                            </div>
                            <div className="text-right bg-gradient-to-r from-purple-50 to-pink-50 px-3 md:px-4 py-2 md:py-3 rounded-lg border border-purple-100">
                              <p className="text-xs text-gray-500 font-medium">Total</p>
                              <p className="text-lg md:text-xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {formatCurrencyWithDecimals(totalAmount)}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-3">Monthly Breakdown (Last 4 Months)</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {monthEntries.map(([month, amount]) => {
                                const percentage = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                                
                                return (
                                  <div key={month} className="group/bar text-center">
                                    <div className="relative mb-3">
                                      <div className={`w-full h-14 sm:h-16 md:h-20 bg-gradient-to-b ${categoryColors[catIndex % categoryColors.length]} rounded-lg md:rounded-xl flex items-end justify-center relative overflow-hidden shadow-md group-hover/bar:shadow-lg transition-all duration-300 group-hover/bar:scale-105 transform group-hover/bar:-translate-y-1`}>
                                        <div
                                          className={`w-full bg-${categoryColors[catIndex % categoryColors.length].split(' ')[1]}/30 backdrop-blur-sm transition-all duration-700`}
                                          style={{ height: `${Math.max(percentage, 15)}%` }}
                                        ></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                          <span className="text-white text-xs md:text-sm font-black drop-shadow-lg">
                                            ${Math.round(amount)}
                                          </span>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-lg md:rounded-xl"></div>
                                      </div>
                                    </div>
                                    <p className="text-xs md:text-sm font-bold text-gray-700">
                                      {formatMonth(month)}
                                    </p>
                                    <p className="text-xs text-gray-500 font-medium mt-1">
                                      {((amount / totalAmount) * 100).toFixed(0)}%
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 md:py-16 relative z-10">
                  <p className="text-gray-500 text-sm md:text-base font-medium">No category data available for analysis</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseAnalytics;