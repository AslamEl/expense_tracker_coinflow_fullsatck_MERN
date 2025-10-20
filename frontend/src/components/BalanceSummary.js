import React from 'react';
import { Icons } from '../utils/svgIcons';

const BalanceSummary = ({ monthlySalary, incomes, expenses }) => {
  const totalAdditionalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = monthlySalary + totalAdditionalIncome;
  const remainingBalance = totalIncome - totalExpenses;
  const isPositive = remainingBalance >= 0;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      
      {/* Floating decorations */}
      <div className={`absolute -top-8 -right-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br ${isPositive ? 'from-green-400/20 to-emerald-500/20' : 'from-red-400/20 to-orange-500/20'} rounded-full blur-xl`}></div>
      <div className="absolute -bottom-6 -left-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className={`w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br ${isPositive ? 'from-green-600 via-emerald-600 to-teal-600' : 'from-red-600 via-orange-600 to-yellow-600'} rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl`}>
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent mb-2 md:mb-3">
            Financial Overview
          </h2>
          <p className="text-xs md:text-lg text-gray-600 font-medium">Your financial position</p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {/* Monthly Salary */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg md:rounded-2xl p-3 md:p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-5 md:w-6 h-5 md:h-6 text-blue-600">{Icons.money}</div>
            </div>
            <div className="text-lg md:text-2xl font-black text-blue-700 mb-1">
              ${monthlySalary.toLocaleString()}
            </div>
            <p className="text-blue-600 text-xs md:text-sm font-medium">Salary</p>
          </div>

          {/* Additional Income */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg md:rounded-2xl p-3 md:p-6 border border-green-100">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-5 md:w-6 h-5 md:h-6 text-green-600">{Icons.budget}</div>
            </div>
            <div className="text-lg md:text-2xl font-black text-green-700 mb-1">
              ${totalAdditionalIncome.toLocaleString()}
            </div>
            <p className="text-green-600 text-xs md:text-sm font-medium">Add. Income</p>
          </div>

          {/* Total Expenses */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg md:rounded-2xl p-3 md:p-6 border border-red-100">
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className="w-5 md:w-6 h-5 md:h-6 text-red-600">{Icons.creditCard}</div>
            </div>
            <div className="text-lg md:text-2xl font-black text-red-700 mb-1">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-red-600 text-xs md:text-sm font-medium">Expenses</p>
          </div>

          {/* Remaining Balance */}
          <div className={`bg-gradient-to-br ${isPositive ? 'from-emerald-50 to-teal-50 border-emerald-100' : 'from-red-50 to-rose-50 border-red-100'} rounded-lg md:rounded-2xl p-3 md:p-6 border`}>
            <div className="flex items-center justify-between mb-2 md:mb-4">
              <div className={`w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br ${isPositive ? 'from-emerald-500 to-teal-600' : 'from-red-500 to-rose-600'} rounded-lg md:rounded-xl flex items-center justify-center shadow-lg`}>
                <svg className="w-4 md:w-6 h-4 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isPositive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  )}
                </svg>
              </div>
              <div className="w-5 md:w-6 h-5 md:h-6">{isPositive ? Icons.checkmark : Icons.warning}</div>
            </div>
            <div className={`text-lg md:text-2xl font-black mb-1 ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>
              ${Math.abs(remainingBalance).toLocaleString()}
            </div>
            <p className={`text-xs md:text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {isPositive ? 'Balance' : 'Over'}
            </p>
          </div>
        </div>

        {/* Financial Health Indicator */}
        <div className="mt-4 md:mt-6 text-center">
          <div className={`inline-flex items-center px-3 md:px-6 py-2 md:py-3 rounded-lg md:rounded-2xl text-xs md:text-base ${isPositive ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-red-100 text-red-800 border border-red-200'} font-medium`}>
            <div className="mr-1 md:mr-2 text-sm md:text-lg w-4 md:w-5 h-4 md:h-5">{isPositive ? Icons.analytics : Icons.alert}</div>
            {isPositive ? (
              `${((remainingBalance / totalIncome) * 100).toFixed(1)}% within budget`
            ) : (
              `You're ${(Math.abs(remainingBalance / totalIncome) * 100).toFixed(1)}% over budget`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSummary;