import React from 'react';
import Dashboard from './Dashboard';
import ActionButtons from './ActionButtons';
import BalanceSummary from './BalanceSummary';
import TotalExpenses from './TotalExpenses';
import AIInsights from './AIInsights';
import Analytics from './Analytics';
import ExpenseList from './ExpenseList';
import AIAssistant from './AIAssistant';

const Home = ({ 
  expenses, 
  incomes, 
  monthlySalary, 
  groups, 
  onDeleteExpense, 
  loading, 
  onAddExpense, 
  onAddIncome, 
  onSetSalary 
}) => {
  return (
    <div className="space-y-8">
      {/* Quick Actions Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
        
        {/* Floating decorations */}
        <div className="absolute -top-6 -right-6 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-lg"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 md:mb-8 gap-3 md:gap-0">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
                <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
                  Quick Actions
                </h2>
                <p className="text-xs md:text-base text-gray-600 font-medium">Manage finances</p>
              </div>
            </div>

            {/* AI Assistant Quick Access */}
            <div className="flex items-center bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-lg md:rounded-2xl px-3 md:px-6 py-2 md:py-3 text-sm md:text-base hover:shadow-lg transition-shadow duration-300">
              <div className="w-8 md:w-10 h-8 md:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg mr-2 md:mr-3">
                <svg className="w-4 md:w-5 h-4 md:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm font-bold text-purple-800">AI Assistant</p>
                <p className="hidden md:block text-xs text-purple-600">Get smart insights</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <ActionButtons 
            onAddExpense={onAddExpense}
            onAddIncome={onAddIncome}
            onSetSalary={onSetSalary}
          />
        </div>
      </div>

      {/* Dashboard Section */}
      <Dashboard 
        expenses={expenses}
        incomes={incomes}
        monthlySalary={monthlySalary}
        groups={groups}
      />

      {/* Balance Summary */}
      <BalanceSummary 
        monthlySalary={monthlySalary}
        incomes={incomes}
        expenses={expenses}
      />

      {/* Total Expenses Summary */}
      <TotalExpenses expenses={expenses} />

      {/* Premium Analytics Transition */}
      <div className="relative my-8 md:my-12">
        <div className="flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl px-3 md:px-12 py-4 md:py-8 shadow-xl border border-white/30 relative overflow-hidden group max-w-2xl">
            {/* Glassmorphism effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute -top-6 -left-6 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
            <div className="absolute -bottom-4 -right-4 w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-md group-hover:blur-lg transition-all duration-500"></div>
            
            <div className="relative z-10 text-center">
              <div className="flex items-center justify-center flex-wrap gap-2 md:gap-6 mb-3 md:mb-4">
                <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-3 md:w-4 h-3 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg md:rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-3 md:w-4 h-3 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg md:text-2xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent mb-1 md:mb-2">
                Intelligent Analysis
              </h3>
              <p className="text-xs md:text-base text-gray-600 font-medium">Powered by CoinFlow AI Engine</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Powered Insights */}
      <AIInsights expenses={expenses} monthlyIncome={monthlySalary} />

      {/* Analytics Dashboard */}
      <div data-section="analytics">
        <Analytics expenses={expenses} monthlyIncome={monthlySalary} />
      </div>

      {/* Premium Section Divider */}
      <div className="relative my-12 md:my-16">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl md:rounded-3xl px-3 md:px-8 py-4 md:py-6 shadow-2xl border border-white/30 relative overflow-hidden group">
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-indigo-400/30 to-purple-500/30 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3 md:gap-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <svg className="w-5 md:w-6 h-5 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h3 className="text-base md:text-xl font-black bg-gradient-to-r from-gray-900 via-indigo-800 to-purple-900 bg-clip-text text-transparent">
                  Recent Activity
                </h3>
                <p className="text-xs md:text-sm text-gray-600 font-medium">Your latest financial transactions</p>
              </div>
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <svg className="w-5 md:w-6 h-5 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <ExpenseList 
        expenses={expenses} 
        onDeleteExpense={onDeleteExpense}
        loading={loading}
      />

      {/* Floating AI Assistant */}
      <AIAssistant expenses={expenses} monthlyIncome={monthlySalary} />
    </div>
  );
};

export default Home;