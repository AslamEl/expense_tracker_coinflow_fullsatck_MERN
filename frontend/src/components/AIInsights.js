import React, { useState, useEffect } from 'react';
import ExpenseAI from '../utils/ExpenseAI';
import { Icons } from '../utils/svgIcons';
import { useCurrency } from '../contexts/CurrencyContext';

const AIInsights = ({ expenses, incomes = [], monthlyIncome = 0 }) => {
  const { formatCurrencyWithDecimals } = useCurrency();
  const [insights, setInsights] = useState(null);
  const [activeTab, setActiveTab] = useState('recommendations');

  useEffect(() => {
    if (expenses.length > 0) {
      // Pass original monthlyIncome (salary) and incomes array separately
      // ExpenseAI will calculate total = monthlyIncome + sum(incomes)
      const ai = new ExpenseAI(expenses, monthlyIncome, incomes);
      setInsights(ai.generateInsights());
    }
  }, [expenses, incomes, monthlyIncome]);

  if (!insights || expenses.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute -top-8 -right-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 text-center py-8 md:py-12">
          <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
            <div className="w-8 md:w-12 h-8 md:h-12">{Icons.ai}</div>
          </div>
          <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-2 md:mb-4">AI Assistant Ready</h3>
          <p className="text-gray-600 text-sm md:text-lg font-medium mb-6 md:mb-8">
            Add more expenses to unlock personalized insights and smart recommendations!
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mt-6 md:mt-8">
            <div className="bg-white/60 backdrop-blur-sm p-3 md:p-6 rounded-lg md:rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4">
                <div className="w-4 md:w-6 h-4 md:h-6 text-white">{Icons.alert}</div>
              </div>
              <p className="text-gray-700 font-semibold text-xs md:text-base">Smart Budget Tips</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-3 md:p-6 rounded-lg md:rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4">
                <div className="w-4 md:w-6 h-4 md:h-6 text-white">{Icons.analytics}</div>
              </div>
              <p className="text-gray-700 font-semibold text-xs md:text-base">Spending Predictions</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm p-3 md:p-6 rounded-lg md:rounded-2xl border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="w-8 md:w-12 h-8 md:h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg md:rounded-2xl flex items-center justify-center mx-auto mb-2 md:mb-4">
                <div className="w-4 md:w-6 h-4 md:h-6 text-white">{Icons.warning}</div>
              </div>
              <p className="text-gray-700 font-semibold text-xs md:text-base">Smart Alerts</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'recommendations', label: 'Smart Tips', icon: Icons.alert },
    { id: 'budget', label: 'Budget Guide', icon: Icons.budget },
    { id: 'predictions', label: 'Predictions', icon: Icons.analytics },
    { id: 'alerts', label: 'Alerts', icon: Icons.warning }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div className="absolute -top-8 -right-8 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-xl"></div>
      <div className="absolute -bottom-6 -left-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-indigo-400/20 to-blue-500/20 rounded-full blur-lg"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row justify-center items-center md:items-start mb-4 md:mb-6 gap-3 md:gap-4">
            <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-xl flex-shrink-0">
              <div className="w-6 md:w-8 h-6 md:h-8 text-white">{Icons.ai}</div>
            </div>
            <div>
              <h2 className="text-lg md:text-3xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-pink-900 bg-clip-text text-transparent">
                AI Financial Assistant
              </h2>
              <p className="text-xs md:text-lg text-gray-600 font-medium">
                Personalized insights and recommendations powered by AI
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-6 md:mb-8 bg-white/60 backdrop-blur-sm rounded-lg md:rounded-2xl p-2 md:p-3 shadow-lg border border-white/30 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group px-3 md:px-6 py-2 md:py-4 rounded-lg md:rounded-xl font-bold transition-all duration-300 mx-1 md:mx-2 mb-1 md:mb-2 relative overflow-hidden whitespace-nowrap text-xs md:text-sm flex items-center gap-1 md:gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl transform scale-105 border border-white/20'
                  : 'text-gray-700 hover:bg-white/80 hover:shadow-md hover:scale-102 border border-transparent hover:border-white/40'
              }`}
            >
              {/* Shine effect for active tab */}
              {activeTab === tab.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
              
              <div className="relative z-10 flex items-center">
                <div className="w-3 md:w-4 h-3 md:h-4">{tab.icon}</div>
                <span className="hidden sm:inline">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>

      {/* Content Sections */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4 md:space-y-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2 md:gap-3">
            <div className="w-4 md:w-5 h-4 md:h-5 text-blue-600">{Icons.alert}</div>
            Personalized Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {insights.personalizedTips.map((tip, index) => (
              <div key={index} className="group bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm p-4 md:p-6 rounded-lg md:rounded-2xl border border-white/40 shadow-lg hover:shadow-2xl hover:border-white/60 transition-all duration-300 relative overflow-hidden cursor-pointer transform hover:scale-105 hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full blur-2xl group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative z-10">
                  <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center mb-4 md:mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                    <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.alert}</div>
                  </div>
                  <p className="text-xs md:text-sm text-gray-800 leading-relaxed font-medium group-hover:text-gray-900">{tip}</p>
                  <div className="mt-4 pt-4 border-t border-gray-200 group-hover:border-blue-200 transition-colors">
                    <button className="w-full py-2 px-3 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-semibold text-xs transition-all duration-300">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Spending Patterns */}
          {insights.patterns.length > 0 && (
            <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/20">
              <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center gap-2 md:gap-3">
                <div className="w-4 md:w-5 h-4 md:h-5 text-orange-600">{Icons.analytics}</div>
                Spending Pattern Analysis
              </h4>
              <div className="space-y-3">
                {insights.patterns.map((pattern, index) => (
                  <div key={index} className={`group p-4 md:p-5 rounded-lg md:rounded-xl border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-102 cursor-pointer ${
                    pattern.severity === 'warning' ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-400 hover:border-orange-500' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-400 hover:border-blue-500'
                  }`}>
                    <div className="flex gap-3 items-start">
                      <div className={`mt-1 ${pattern.severity === 'warning' ? 'text-orange-600' : 'text-blue-600'}`}>
                        {pattern.severity === 'warning' ? '⚠️' : 'ℹ️'}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 group-hover:text-gray-900">{pattern.message}</p>
                        <p className="text-sm text-gray-600 mt-1 group-hover:text-gray-700">{pattern.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.budget}</div>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-black bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent">Smart Budget Allocation</h3>
              <p className="text-xs md:text-base text-gray-600 font-medium">AI-powered spending recommendations</p>
            </div>
          </div>
          {insights.budgetRecommendations.map((rec, index) => (
            <div key={index} className="group bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-8 border border-white/40 shadow-lg hover:shadow-2xl hover:border-white/60 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative z-10">
                <h4 className="text-base md:text-xl font-black text-gray-900 mb-2 md:mb-3 flex items-center">
                  <span className="w-6 md:w-8 h-6 md:h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center mr-2 md:mr-3 shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-3 md:w-4 h-3 md:h-4 text-white">{Icons.budget}</div>
                  </span>
                  {rec.title}
                </h4>
                
                {/* Guidelines and Total Budget Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-blue-200 mb-4 md:mb-6">
                  <p className="text-xs md:text-sm text-gray-700 mb-2">
                    <span className="font-semibold text-blue-700">📋 {rec.guidelines}</span>
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs md:text-sm font-medium text-gray-700">Total Monthly Budget:</span>
                    <span className="text-sm md:text-base font-black text-indigo-600">{formatCurrencyWithDecimals(rec.totalAllocated)}</span>
                  </div>
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {rec.suggestions.map((suggestion, idx) => {
                  const isOverBudget = suggestion.current > suggestion.recommended;
                  const percentage = suggestion.recommended > 0 
                    ? ((suggestion.current / suggestion.recommended) * 100).toFixed(0)
                    : 0;
                  const budgetPercentage = rec.totalAllocated > 0 
                    ? ((suggestion.recommended / rec.totalAllocated) * 100).toFixed(1)
                    : 0;

                  return (
                    <div key={idx} className={`group/card p-3 md:p-4 rounded-lg md:rounded-xl border-2 text-xs md:text-sm transition-all duration-300 cursor-pointer transform hover:scale-105 hover:shadow-lg ${
                      isOverBudget ? 'border-red-200 bg-gradient-to-br from-red-50 to-rose-50 hover:border-red-400' : 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-400'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h5 className="font-bold text-gray-900 group-hover/card:text-gray-900">{suggestion.category}</h5>
                          <p className={`text-xs ${isOverBudget ? 'text-red-600' : 'text-green-600'} font-semibold mt-0.5`}>{suggestion.description}</p>
                        </div>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap ml-2 ${
                          isOverBudget ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
                        }`}>
                          {budgetPercentage}%
                        </span>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-semibold">Current:</span>
                          <span className={`text-sm font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>{formatCurrencyWithDecimals(suggestion.current)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700 font-semibold">Recommended:</span>
                          <span className="text-sm font-bold text-blue-600">{formatCurrencyWithDecimals(suggestion.recommended)}</span>
                        </div>
                        <div className="mt-3 space-y-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-gray-600">Budget Usage</span>
                            <span className={`text-xs font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-300 rounded-full h-2.5 overflow-hidden">
                            <div 
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                isOverBudget ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-green-400 to-emerald-600'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-3 pt-3 border-t border-gray-200 group-hover/card:border-gray-300 transition-colors">
                        <button className={`w-full py-2 px-3 rounded-lg font-semibold text-xs transition-all duration-300 ${
                          isOverBudget 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}>
                          {isOverBudget ? '💡 See Ways to Reduce' : '✓ On Track'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'predictions' && (
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.analytics}</div>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-black bg-gradient-to-r from-gray-900 via-purple-800 to-indigo-900 bg-clip-text text-transparent">Spending Predictions</h3>
              <p className="text-xs md:text-base text-gray-600 font-medium">AI-powered financial forecasting</p>
            </div>
          </div>
          {insights.predictions ? (
            <div className="bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-sm rounded-lg md:rounded-2xl p-4 md:p-8 border border-white/40 shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"></div>
              <div className="relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6 rounded-lg md:rounded-xl border-2 border-blue-200 hover:border-blue-400 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-xs md:text-sm font-semibold text-blue-700">Next Month Prediction</span>
                      <div className="w-5 md:w-6 h-5 md:h-6 text-blue-600">{Icons.analytics}</div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-blue-600 mb-2">
                      {formatCurrencyWithDecimals(insights.predictions.predicted)}
                    </div>
                    <div className={`inline-block text-xs md:text-sm px-3 py-1 rounded-full font-bold ${
                      insights.predictions.confidence === 'high' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {insights.predictions.confidence} confidence
                    </div>
                  </div>

                  <div className="group bg-gradient-to-br from-purple-50 to-pink-50 p-4 md:p-6 rounded-lg md:rounded-xl border-2 border-purple-200 hover:border-purple-400 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-xs md:text-sm font-semibold text-purple-700">Spending Trend</span>
                      <div className={`w-5 md:w-6 h-5 md:h-6 ${
                        insights.predictions.trend === 'increasing' ? 'text-red-600' : 'text-green-600'
                      }`}>{insights.predictions.trend === 'increasing' ? Icons.analytics : Icons.checkmark}</div>
                    </div>
                    <div className={`text-2xl md:text-3xl font-black mb-2 ${
                      insights.predictions.trend === 'increasing' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {insights.predictions.trendPercentage}%
                    </div>
                    <span className={`text-sm font-semibold capitalize ${
                      insights.predictions.trend === 'increasing' ? 'text-red-700' : 'text-green-700'
                    }`}>{insights.predictions.trend}</span>
                  </div>

                  <div className="group bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-lg md:rounded-xl border-2 border-green-200 hover:border-green-400 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-xs md:text-sm font-semibold text-green-700">Avg Transaction</span>
                      <div className="w-5 md:w-6 h-5 md:h-6 text-green-600">{Icons.money}</div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-green-600 mb-2">
                      {formatCurrencyWithDecimals(insights.stats.avgPerTransaction)}
                    </div>
                    <span className="text-xs md:text-sm text-gray-600 font-medium">
                      Based on {insights.stats.transactionCount} transactions
                    </span>
                  </div>
                </div>
              
                <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg md:rounded-xl border-l-4 border-indigo-500 hover:shadow-lg transition-shadow duration-300">
                  <h4 className="font-bold text-sm md:text-base text-gray-900 mb-3 flex items-center gap-2">
                    <div className="w-5 md:w-6 h-5 md:h-6 text-indigo-600 animate-pulse">{Icons.checkmark}</div>
                    AI Recommendation
                  </h4>
                  <p className="text-xs md:text-sm text-gray-700 leading-relaxed mb-3">
                    {insights.predictions.trend === 'increasing' 
                      ? 'Your spending is trending upward. Consider reviewing your budget and identifying areas to cut back. Focus on your top spending categories and set daily spending limits.'
                      : 'Great job! Your spending is trending downward. Keep up the good financial habits! Consider reallocating your savings to your investment goals.'}
                  </p>
                  
                  {/* Income validation warning */}
                  {insights.predictions.totalIncome > 0 && (
                    <div className={`text-xs md:text-sm p-3 rounded-lg mb-3 ${
                      insights.predictions.predictedRatio > 80 
                        ? 'bg-red-100 text-red-700 border border-red-300' 
                        : 'bg-green-100 text-green-700 border border-green-300'
                    }`}>
                      <span className="font-semibold">📊 Income Impact:</span> Predicted spending is {insights.predictions.predictedRatio.toFixed(1)}% of your total monthly income ({formatCurrencyWithDecimals(insights.predictions.totalIncome)})
                    </div>
                  )}
                  
                  <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold text-xs md:text-sm hover:bg-indigo-700 transition-colors duration-300">
                    View Detailed Analysis
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white/80 to-white/40 rounded-lg md:rounded-xl p-6 md:p-8 border border-white/40 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 md:w-16 h-12 md:h-16 text-gray-400">{Icons.analytics}</div>
              </div>
              <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Need more transaction data to generate accurate predictions.</p>
              <p className="text-xs text-gray-500">Add at least 5 more expenses to unlock this feature.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs hover:bg-blue-700 transition-colors duration-300">
                Add Expense
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="w-5 md:w-6 h-5 md:h-6 text-white">{Icons.warning}</div>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-black bg-gradient-to-r from-gray-900 via-orange-800 to-red-900 bg-clip-text text-transparent">Smart Alerts</h3>
              <p className="text-xs md:text-base text-gray-600 font-medium">AI-powered financial warnings and notifications</p>
            </div>
          </div>
          {insights.alerts.length > 0 ? (
            <div className="space-y-2 md:space-y-3">
              {insights.alerts.map((alert, index) => (
                <div key={index} className={`group bg-gradient-to-r p-3 md:p-4 rounded-lg md:rounded-xl border-l-4 shadow-md hover:shadow-xl hover:scale-102 transition-all duration-300 cursor-pointer relative overflow-hidden ${
                  alert.severity === 'warning' 
                    ? 'from-orange-50 to-yellow-50 border-orange-500 hover:border-orange-600 hover:from-orange-100 hover:to-yellow-100' 
                    : 'from-blue-50 to-cyan-50 border-blue-500 hover:border-blue-600 hover:from-blue-100 hover:to-cyan-100'
                }`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 flex items-start gap-2 md:gap-3">
                    <div className={`w-8 md:w-10 h-8 md:h-10 rounded-lg flex items-center justify-center shadow-md flex-shrink-0 text-white font-bold text-sm md:text-base ${
                      alert.severity === 'warning' 
                        ? 'bg-gradient-to-br from-orange-500 to-red-600' 
                        : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                    }`}>
                      {alert.severity === 'warning' ? '!' : 'i'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="text-sm md:text-base font-bold text-gray-900">
                          {alert.title}
                        </h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold text-white whitespace-nowrap ${
                          alert.severity === 'warning' ? 'bg-orange-600' : 'bg-blue-600'
                        }`}>
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-700 mb-2">
                        {alert.type === 'high_daily_spending' 
                          ? `You've spent ${formatCurrencyWithDecimals(alert.amount)} today, which is above your average`
                          : alert.message}
                      </p>
                      
                      {/* Collapsible Action */}
                      <details className="group/details">
                        <summary className="cursor-pointer flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-800 hover:text-gray-900 mb-1">
                          <span className="inline-block transform group-open/details:rotate-90 transition-transform duration-300">▶</span>
                          <div className="w-3 md:w-4 h-3 md:h-4 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <div className="w-2 h-2 text-white">{Icons.checkmark}</div>
                          </div>
                          Recommended Action
                        </summary>
                        <div className="mt-2 ml-5 pl-3 border-l-2 border-green-400 py-1">
                          <p className="text-xs md:text-sm text-gray-700 font-medium">{alert.action}</p>
                        </div>
                      </details>

                      {/* Quick Actions */}
                      <div className="mt-2 flex gap-2 flex-wrap">
                        <button className={`px-2 md:px-3 py-1 text-xs font-semibold rounded-lg transition-all duration-300 ${
                          alert.severity === 'warning'
                            ? 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                            : 'bg-blue-200 text-blue-800 hover:bg-blue-300'
                        }`}>
                          Acknowledge
                        </button>
                        <button className="px-2 md:px-3 py-1 text-xs font-semibold rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-all duration-300">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white/80 to-white/40 rounded-lg md:rounded-xl p-6 md:p-8 border border-white/40 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 to-emerald-100/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="w-8 md:w-10 h-8 md:h-10 text-white">{Icons.checkmark}</div>
                </div>
                <h4 className="text-lg md:text-xl font-black text-gray-900 mb-2">All Clear!</h4>
                <p className="text-xs md:text-sm text-gray-700 font-medium mb-1">No unusual spending patterns detected.</p>
                <p className="text-xs md:text-sm text-gray-600">Keep up the great financial habits!</p>
                <button className="mt-3 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold text-xs md:text-sm hover:shadow-lg transition-all duration-300">
                  View Your Progress
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default AIInsights;