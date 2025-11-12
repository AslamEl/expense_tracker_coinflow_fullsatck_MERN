import React from 'react';
import { Icons } from '../utils/svgIcons';
import { useCurrency } from '../contexts/CurrencyContext';

const BalanceSummary = ({ monthlySalary, incomes, expenses }) => {
  const { currencySymbol } = useCurrency();
  
  const totalAdditionalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = monthlySalary + totalAdditionalIncome;
  const remainingBalance = totalIncome - totalExpenses;
  const isPositive = remainingBalance >= 0;
  const savingsRate = totalIncome > 0 ? ((remainingBalance / totalIncome) * 100) : 0;
  const expenseRatio = totalIncome > 0 ? ((totalExpenses / totalIncome) * 100) : 0;

  return (
    <div className="bg-gradient-to-br from-white/90 via-blue-50/50 to-indigo-50/30 backdrop-blur-2xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/40 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent"></div>
      
      {/* Animated floating decorations */}
      <div className={`absolute -top-12 -right-12 w-32 md:w-48 h-32 md:h-48 bg-gradient-to-br ${isPositive ? 'from-emerald-400/30 via-green-400/20 to-teal-400/10' : 'from-orange-400/30 via-red-400/20 to-rose-400/10'} rounded-full blur-3xl animate-pulse`}></div>
      <div className="absolute -bottom-8 -left-8 w-24 md:w-40 h-24 md:h-40 bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-pink-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="flex items-center gap-4">
            <div className={`w-14 md:w-18 h-14 md:h-18 bg-gradient-to-br ${isPositive ? 'from-emerald-600 via-green-600 to-teal-700' : 'from-orange-600 via-red-600 to-rose-700'} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300`}>
              <svg className="w-7 md:w-9 h-7 md:h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
                Financial Overview
              </h2>
              <p className="text-xs md:text-sm text-gray-600 font-semibold mt-1">Complete income & expense analysis</p>
            </div>
          </div>
          
          <div className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold ${isPositive ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 border border-emerald-200' : 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-200'} shadow-md`}>
            {isPositive ? '✓ Healthy Financial Status' : '⚠ Review Your Spending'}
          </div>
        </div>
        
        {/* Main Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5 mb-8 md:mb-10">
          {/* Salary Card */}
          <div className="group bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-cyan-400/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-7 border border-blue-200/40 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-4">
              <div className="w-12 md:w-14 h-12 md:h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow">
                <svg className="w-6 md:w-7 h-6 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2">Monthly Salary</p>
                <p className="text-xl md:text-2xl font-black text-gray-900">{currencySymbol}{monthlySalary.toLocaleString()}</p>
              </div>
              <div className="w-full bg-blue-200/40 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-full w-full"></div>
              </div>
            </div>
          </div>

          {/* Additional Income Card */}
          <div className="group bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-pink-400/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-7 border border-purple-200/40 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-4">
              <div className="w-12 md:w-14 h-12 md:h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow">
                <svg className="w-6 md:w-7 h-6 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2">Additional Income</p>
                <p className="text-xl md:text-2xl font-black text-gray-900">{currencySymbol}{totalAdditionalIncome.toLocaleString()}</p>
              </div>
              <div className="w-full bg-purple-200/40 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-400 to-purple-600 h-full" style={{width: `${Math.min((totalAdditionalIncome / (monthlySalary || 1)) * 100, 100)}%`}}></div>
              </div>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="group bg-gradient-to-br from-red-600/10 via-red-500/5 to-orange-400/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-7 border border-red-200/40 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <div className="flex flex-col gap-4">
              <div className="w-12 md:w-14 h-12 md:h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow">
                <svg className="w-6 md:w-7 h-6 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2">Total Expenses</p>
                <p className="text-xl md:text-2xl font-black text-gray-900">{currencySymbol}{totalExpenses.toLocaleString()}</p>
              </div>
              <div className="w-full bg-red-200/40 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-red-400 to-red-600 h-full" style={{width: `${Math.min((totalExpenses / (totalIncome || 1)) * 100, 100)}%`}}></div>
              </div>
            </div>
          </div>

          {/* Remaining Balance Card */}
          <div className={`group bg-gradient-to-br ${isPositive ? 'from-emerald-600/10 via-emerald-500/5 to-green-400/5 border-emerald-200/40' : 'from-orange-600/10 via-orange-500/5 to-amber-400/5 border-orange-200/40'} backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-7 border shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
            <div className="flex flex-col gap-4">
              <div className={`w-12 md:w-14 h-12 md:h-14 bg-gradient-to-br ${isPositive ? 'from-emerald-500 to-emerald-700' : 'from-orange-500 to-orange-700'} rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-shadow`}>
                <svg className="w-6 md:w-7 h-6 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2">Remaining Balance</p>
                <p className={`text-xl md:text-2xl font-black ${isPositive ? 'text-emerald-700' : 'text-orange-700'}`}>{currencySymbol}{remainingBalance.toLocaleString()}</p>
              </div>
              <div className="w-full bg-gray-200/50 h-2 rounded-full overflow-hidden">
                <div className={`bg-gradient-to-r ${isPositive ? 'from-emerald-400 to-emerald-600' : 'from-orange-400 to-orange-600'} h-full`} style={{width: `${isPositive ? '100' : '0'}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Metrics Row */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 mb-8 md:mb-10">
          {/* Total Income */}
          <div className="bg-gradient-to-br from-indigo-500/10 via-indigo-400/5 to-purple-400/5 backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-5 border border-indigo-200/40 hover:shadow-lg transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2">Total Income</p>
            <p className="text-lg md:text-2xl font-black text-gray-900">{currencySymbol}{totalIncome.toLocaleString()}</p>
            <div className="text-xs text-gray-500 mt-2">Salary + Additional</div>
          </div>
          
          {/* Savings Rate */}
          <div className="bg-gradient-to-br from-teal-500/10 via-teal-400/5 to-cyan-400/5 backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-5 border border-teal-200/40 hover:shadow-lg transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2">Savings Rate</p>
            <p className="text-lg md:text-2xl font-black text-gray-900">{savingsRate.toFixed(1)}%</p>
            <div className="text-xs text-gray-500 mt-2">{savingsRate > 20 ? '✓ Excellent' : savingsRate > 10 ? '◐ Good' : '⚠ Low'}</div>
          </div>
          
          {/* Expense Ratio */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-400/5 to-yellow-400/5 backdrop-blur-lg rounded-xl md:rounded-2xl p-3 md:p-5 border border-amber-200/40 hover:shadow-lg transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 font-semibold mb-2">Expense Ratio</p>
            <p className="text-lg md:text-2xl font-black text-gray-900">{expenseRatio.toFixed(1)}%</p>
            <div className="text-xs text-gray-500 mt-2">{expenseRatio > 80 ? '⚠ High' : expenseRatio > 60 ? '◐ Moderate' : '✓ Healthy'}</div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className={`flex items-center justify-center px-4 md:px-6 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold ${isPositive ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border border-emerald-200/60' : 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-800 border border-orange-200/60'} shadow-md`}>
          <span className="mr-2 text-lg">
            {isPositive ? '💡' : '⚡'}
          </span>
          {isPositive ? (
            <span>You're doing great! Keep maintaining this financial discipline.</span>
          ) : (
            <span>Time to review your spending and adjust your budget.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;