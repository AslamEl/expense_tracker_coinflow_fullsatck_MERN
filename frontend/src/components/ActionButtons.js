import React from 'react';
import { Icons } from '../utils/svgIcons';

const ActionButtons = ({ onAddExpense, onAddIncome, onSetSalary }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
      
      {/* Floating decorations */}
      <div className="absolute -top-6 -right-6 w-20 md:w-32 h-20 md:h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl">
              <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
          </div>
          <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2 md:mb-3">
            Quick Actions
          </h2>
          <p className="text-xs md:text-lg text-gray-600 font-medium">Manage your finances</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {/* Add Expense Button */}
          <button
            onClick={onAddExpense}
            className="group relative bg-gradient-to-br from-red-500 via-rose-500 to-pink-500 hover:from-red-600 hover:via-rose-600 hover:to-pink-600 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button content */}
            <div className="relative z-10">
              <div className="w-10 md:w-16 h-10 md:h-16 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 md:w-8 h-5 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2">Add Expense</h3>
              <p className="hidden md:block text-white/80 text-sm font-medium">Track your spending</p>
              <div className="mt-2 md:mt-4 flex items-center justify-center">
                <div className="w-5 md:w-6 h-5 md:h-6 text-white mr-1 md:mr-2">{Icons.creditCard}</div>
                <span className="group-hover:translate-x-1 transition-transform duration-300 text-xs md:text-base">→</span>
              </div>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          {/* Add Income Button */}
          <button
            onClick={onAddIncome}
            className="group relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button content */}
            <div className="relative z-10">
              <div className="w-10 md:w-16 h-10 md:h-16 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 md:w-8 h-5 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2">Add Income</h3>
              <p className="hidden md:block text-white/80 text-sm font-medium">Track income sources</p>
              <div className="mt-2 md:mt-4 flex items-center justify-center">
                <div className="w-5 md:w-6 h-5 md:h-6 text-white mr-1 md:mr-2">{Icons.money}</div>
                <span className="group-hover:translate-x-1 transition-transform duration-300 text-xs md:text-base">→</span>
              </div>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          {/* Set Salary Button */}
          <button
            onClick={onSetSalary}
            className="group relative bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 rounded-2xl md:rounded-3xl p-4 md:p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button content */}
            <div className="relative z-10">
              <div className="w-10 md:w-16 h-10 md:h-16 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 md:w-8 h-5 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2">Set Salary</h3>
              <p className="hidden md:block text-white/80 text-sm font-medium">Update salary info</p>
              <div className="mt-2 md:mt-4 flex items-center justify-center">
                <div className="w-5 md:w-6 h-5 md:h-6 text-white mr-1 md:mr-2">{Icons.user}</div>
                <span className="group-hover:translate-x-1 transition-transform duration-300 text-xs md:text-base">→</span>
              </div>
            </div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;