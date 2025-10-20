import React from 'react';

const TotalExpenses = ({ expenses }) => {
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const getCategoryTotals = () => {
    const totals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    return totals;
  };

  const categoryTotals = getCategoryTotals();
  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Education', 'Travel', 'Other'];

  const getCategoryBgColor = (category) => {
    const colors = {
      Food: 'bg-green-500',
      Transport: 'bg-blue-500',
      Shopping: 'bg-purple-500',
      Bills: 'bg-red-500',
      Education: 'bg-yellow-500',
      Travel: 'bg-sky-500',
      Other: 'bg-gray-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      Food: '🍔',
      Transport: '🚗',
      Shopping: '🛒',
      Bills: '💡',
      Education: '📚',
      Travel: '✈️',
      Other: '📦'
    };
    return icons[category] || '📝';
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      
      {/* Floating decorations */}
      <div className="absolute -top-8 -right-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-6 -left-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center mb-6 md:mb-8 gap-3 md:gap-4">
          <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">
            <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl md:text-3xl font-black bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent">
              Expense Summary
            </h2>
            <p className="text-xs md:text-base text-gray-600 font-medium">Spending breakdown</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Total Amount - Centered */}
          <div className="lg:col-span-1 text-center">
            <div className="group bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm p-4 md:p-8 rounded-2xl md:rounded-3xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="w-14 md:w-20 h-14 md:h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 md:w-10 h-7 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                
                <div className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1 md:mb-3">
                  ${totalAmount.toFixed(2)}
                </div>
                <div className="text-base md:text-xl text-gray-800 font-bold mb-2 md:mb-4">
                  Total Expenses
                </div>
                <div className="flex items-center justify-center bg-white/60 backdrop-blur-sm rounded-lg md:rounded-2xl px-3 md:px-4 py-2 md:py-3 border border-white/30 text-xs md:text-base">
                  <svg className="w-4 md:w-5 h-4 md:h-5 mr-1 md:mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="text-gray-700 font-semibold">
                    {expenses.length} {expenses.length === 1 ? 'Tx' : 'Txs'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4 md:mb-6 gap-2 md:gap-4">
              <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-5 md:w-6 h-5 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900">Category Breakdown</h3>
                <p className="text-gray-600 font-medium">See where your money goes</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {categories.map(category => {
                const amount = categoryTotals[category] || 0;
                const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                
                return (
                  <div key={category} className="group bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/30 hover:border-white/50 transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-3 shadow-lg ${getCategoryBgColor(category)}`}>
                            <span className="text-xl text-white">{getCategoryIcon(category)}</span>
                          </div>
                          <div>
                            <span className="text-lg font-black text-gray-900 block">{category}</span>
                            <span className="text-sm text-gray-600 font-medium">Spending</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                            ${amount.toFixed(2)}
                          </div>
                          <div className="text-sm font-bold text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Progress bar */}
                      <div className="relative">
                        <div className="bg-gray-200/60 rounded-full h-3 overflow-hidden">
                          <div 
                            className={`h-3 rounded-full transition-all duration-700 ease-out ${getCategoryBgColor(category)} shadow-lg`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent rounded-full pointer-events-none"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
      </div>
      </div>
    </div>
  );
};

export default TotalExpenses;