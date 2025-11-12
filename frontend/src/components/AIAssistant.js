import React, { useState, useEffect, useRef } from 'react';
import ExpenseAI from '../utils/ExpenseAI';
import { useCurrency } from '../contexts/CurrencyContext';
import { Icons } from '../utils/svgIcons';

const AIAssistant = ({ expenses, monthlyIncome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState('tips');
  const [insights, setInsights] = useState(null);
  const { formatCurrencyWithDecimals } = useCurrency();
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: "Hi! I'm your AI Financial Coach. Ask me anything about your expenses, budgeting, or financial health!",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatMessagesEndRef = useRef(null);

  useEffect(() => {
    if (expenses.length > 0) {
      const ai = new ExpenseAI(expenses, monthlyIncome);
      setInsights(ai.generateInsights());
    }
  }, [expenses, monthlyIncome]);

  // Auto-scroll to bottom of chat when new messages are added
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Prevent background scrolling when AI Assistant is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const generateChatResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expenseRatio = monthlyIncome > 0 ? (totalExpenses / monthlyIncome) * 100 : 0;
    
    // Analyze user intent and provide contextual responses
    if (message.includes('budget') || message.includes('spend')) {
      if (monthlyIncome > 0) {
        return `Based on your data, you've spent ${formatCurrencyWithDecimals(totalExpenses)} out of your ${formatCurrencyWithDecimals(monthlyIncome)} monthly salary (${expenseRatio.toFixed(1)}%). ${
          expenseRatio > 80 ? 'You might want to review your spending habits!' :
          expenseRatio > 50 ? 'You\'re on track, but keep monitoring your expenses.' :
          'Great job managing your budget!'
        }`;
      }
      return "I'd love to help with budgeting! Please add your monthly salary first so I can give you personalized advice.";
    }
    
    if (message.includes('save') || message.includes('saving')) {
      if (monthlyIncome > 0) {
        const savings = monthlyIncome - totalExpenses;
        const savingsRate = (savings / monthlyIncome) * 100;
        return `You're currently saving ${formatCurrencyWithDecimals(savings)} per month (${savingsRate.toFixed(1)}% savings rate). ${
          savingsRate >= 20 ? 'Excellent! You\'re exceeding the recommended 20% savings rate.' :
          savingsRate >= 10 ? 'Good progress! Try to increase to 20% if possible.' :
          'Consider reducing expenses to boost your savings rate to at least 10-20%.'
        }`;
      }
      return "To calculate your savings potential, please add your monthly salary in the settings.";
    }
    
    if (message.includes('category') || message.includes('spending')) {
      if (expenses.length > 0) {
        const categoryTotals = expenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {});
        const topCategory = Object.keys(categoryTotals).reduce((a, b) => 
          categoryTotals[a] > categoryTotals[b] ? a : b
        );
        return `Your highest spending category is "${topCategory}" with ${formatCurrencyWithDecimals(categoryTotals[topCategory])}. Consider if this aligns with your priorities and budget goals.`;
      }
      return "Add some expenses first, and I'll analyze your spending patterns for you!";
    }
    
    if (message.includes('help') || message.includes('what can you do')) {
      return "I can help you with:\n• Budget analysis and recommendations\n• Spending pattern insights\n• Savings goals and strategies\n• Financial health assessment\n• Category-wise expense breakdown\n• Personalized money-saving tips\n\nJust ask me anything about your finances!";
    }
    
    if (message.includes('goal') || message.includes('target')) {
      return "Setting financial goals is great! I recommend:\n• Emergency fund: 3-6 months of expenses\n• Savings rate: At least 20% of income\n• Housing costs: Under 30% of income\n• Debt payments: Under 36% of income\n\nWhat specific goal would you like to work towards?";
    }
    
    // Default responses for general queries
    const defaultResponses = [
      "That's an interesting question! Could you be more specific about your financial situation?",
      "I'd be happy to help! Try asking about your budget, savings, spending categories, or financial goals.",
      "Based on your expense data, I can provide personalized advice. What aspect of your finances would you like to explore?",
      "Feel free to ask me about budgeting tips, expense analysis, or saving strategies!",
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    
    // Simulate AI thinking time
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        message: generateChatResponse(chatInput),
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getQuickTips = () => {
    if (expenses.length === 0) {
      return [
        {
          icon: "hello",
          text: "Welcome! Start by adding your first expense to get personalized insights.",
          type: "welcome"
        },
        {
          icon: "budget",
          text: "Add your monthly salary to unlock advanced financial health analysis.",
          type: "income"
        },
        {
          icon: "analytics",
          text: "The more data you add, the smarter my recommendations become!",
          type: "data"
        }
      ];
    }

    const tips = [];
    
    if (insights) {
      // Add financial health tip
      if (monthlyIncome > 0) {
        tips.push({
          icon: insights.financialHealth.score >= 80 ? "checkmark" : insights.financialHealth.score >= 60 ? "analytics" : "warning",
          text: `Financial Health: ${insights.financialHealth.grade} (${insights.financialHealth.score}/100)`,
          type: "health",
          color: insights.financialHealth.color
        });
      }

      // Add personalized tips
      insights.personalizedTips.slice(0, 2).forEach(tip => {
        tips.push({
          icon: "alert",
          text: tip,
          type: "tip"
        });
      });

      // Add spending insights
      if (monthlyIncome > 0) {
        tips.push({
          icon: insights.stats.expenseRatio > 80 ? "warning" : "analytics",
          text: `You're spending ${insights.stats.expenseRatio.toFixed(1)}% of your income this month`,
          type: insights.stats.expenseRatio > 80 ? "warning" : "info"
        });
      }
    }

    return tips;
  };

  const tips = getQuickTips();

  const views = [
    { id: 'tips', label: 'Tips', icon: Icons.alert },
    { id: 'health', label: 'Health', icon: Icons.checkmark },
    { id: 'alerts', label: 'Alerts', icon: Icons.warning },
    { id: 'chat', label: 'Chat', icon: Icons.analytics }
  ];

  return (
    <>
      {/* Floating AI Button */}
      <div className="fixed bottom-6 sm:bottom-8 left-6 sm:left-8 z-40">
        <div className="relative group">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white rounded-full p-3 sm:p-5 shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 border border-gray-700/50 backdrop-blur-sm relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            
            <div className="relative z-10">
              <svg className="w-6 sm:w-8 h-6 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </button>

          {/* Health Score Badge */}
          {insights?.financialHealth && monthlyIncome > 0 && (
            <div className={`absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 sm:w-8 h-6 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
              insights.financialHealth.color === 'green' ? 'bg-green-500' :
              insights.financialHealth.color === 'blue' ? 'bg-blue-500' :
              insights.financialHealth.color === 'yellow' ? 'bg-yellow-500' :
              insights.financialHealth.color === 'orange' ? 'bg-orange-500' :
              'bg-red-500'
            }`}>
              {insights.financialHealth.grade}
            </div>
          )}

          {/* Alert Indicator */}
          {insights?.alerts && insights.alerts.some(alert => alert.severity === 'warning' || alert.severity === 'critical') && (
            <div className="absolute -top-0.5 -left-0.5 sm:-top-1 sm:-left-1 w-3 sm:w-4 h-3 sm:h-4 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>

        {/* Floating Tooltip */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            AI Financial Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-45"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 sm:bottom-28 left-1/2 sm:left-8 sm:right-auto transform sm:transform-none -translate-x-1/2 sm:translate-x-0 z-50 w-80 sm:w-96 max-w-[calc(100vw-2rem)] sm:max-w-[420px]">
          <div 
            className="bg-gray-900/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden relative mx-auto sm:mx-0 max-w-full"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Glassmorphism overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-transparent"></div>
            
            {/* Header */}
            <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-3 sm:p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent"></div>
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gray-600/20 rounded-full blur-xl"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                    <div className="w-10 sm:w-14 h-10 sm:h-14 bg-gray-700/50 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl border border-gray-600/30">
                      <div className="w-5 sm:w-7 h-5 sm:h-7">{Icons.ai}</div>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-base sm:text-xl break-words">CoinFlow AI Coach</h3>
                      <p className="text-xs sm:text-sm text-white/90 font-medium truncate">
                        {monthlyIncome > 0 ? 'Personalized insights ready' : 'Add salary for advanced tips'}
                      </p>
                    </div>
                  </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 sm:p-2 transition-colors duration-200 flex-shrink-0"
                >
                  <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* View Tabs */}
              <div className="flex mt-2 sm:mt-3 bg-gray-800 bg-opacity-50 rounded-lg p-0.5 sm:p-1 overflow-x-auto">
                  {views.map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveView(view.id)}
                    className={`flex-1 py-1 sm:py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-center whitespace-nowrap ${
                      activeView === view.id 
                        ? 'bg-gray-700 text-white shadow-sm border border-gray-600' 
                        : 'text-gray-300 hover:bg-gray-700 hover:bg-opacity-50'
                    }`}
                  >
                    <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 mr-0.5 sm:mr-1 flex-shrink-0">{view.icon}</div>
                    <span className="hidden sm:inline">{view.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 max-h-80 sm:max-h-96 overflow-y-auto bg-gray-900/50 relative">
              {activeView === 'tips' && (
                <div className="space-y-2 sm:space-y-3">
                  {tips.map((tip, index) => (
                    <div key={index} className={`p-2 sm:p-3 rounded-lg sm:rounded-xl border-l-4 ${
                      tip.type === 'health' ? 
                        `border-${tip.color}-400 bg-gray-800/50` :
                      tip.type === 'warning' ? 'border-red-400 bg-gray-800/50' :
                      tip.type === 'welcome' ? 'border-blue-400 bg-gray-800/50' :
                      'border-purple-400 bg-gray-800/50'
                    } border border-gray-700/50`}>
                      <div className="flex items-start gap-2">
                        <div className="w-5 sm:w-6 h-5 sm:h-6 mr-1 sm:mr-2 flex-shrink-0">{
                          tip.icon === 'hello' ? Icons.analytics :
                          tip.icon === 'budget' ? Icons.budget :
                          tip.icon === 'analytics' ? Icons.analytics :
                          tip.icon === 'checkmark' ? Icons.checkmark :
                          tip.icon === 'warning' ? Icons.warning :
                          tip.icon === 'alert' ? Icons.alert :
                          Icons.analytics
                        }</div>
                        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">{tip.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeView === 'health' && insights && monthlyIncome > 0 && (
                <div className="space-y-4">
                  {/* Financial Health Score */}
                  <div className={`text-center p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-${insights.financialHealth.color}-600/50`}>
                    <div className={`text-4xl font-bold text-${insights.financialHealth.color}-400 mb-2`}>
                      {insights.financialHealth.score}
                    </div>
                    <div className={`text-lg font-semibold text-${insights.financialHealth.color}-300 mb-1`}>
                      Grade: {insights.financialHealth.grade}
                    </div>
                    <p className="text-sm text-gray-300">{insights.financialHealth.status}</p>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800 p-3 rounded-lg text-center border border-gray-700">
                      <div className="text-lg font-bold text-gray-200">
                        {insights.stats.expenseRatio.toFixed(1)}%
                      </div>
                      <p className="text-xs text-gray-400">Expense Ratio</p>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center border border-gray-700">
                      <div className="text-lg font-bold text-gray-200">
                        {insights.stats.savingsRate.toFixed(1)}%
                      </div>
                      <p className="text-xs text-gray-400">Savings Rate</p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {insights.financialHealth.recommendations && (
                    <div className="space-y-2">
                                            <h4 className="text-xs md:text-sm font-semibold text-gray-200 flex items-center gap-2">
                        <div className="w-3 md:w-4 h-3 md:h-4 flex-shrink-0">{Icons.alert}</div>
                        Recommendations:
                      </h4>
                      {insights.financialHealth.recommendations.map((rec, index) => (
                        <div key={index} className={`p-3 rounded-lg text-xs ${
                          rec.priority === 'high' ? 'bg-red-900/30 border border-red-700' :
                          rec.priority === 'medium' ? 'bg-yellow-900/30 border border-yellow-700' :
                          'bg-blue-900/30 border border-blue-700'
                        }`}>
                          <div className="font-medium text-gray-200">{rec.title}</div>
                          <div className="text-gray-300 mt-1">{rec.message}</div>
                          <div className="text-gray-400 mt-1 italic">{rec.action}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeView === 'health' && monthlyIncome === 0 && (
                <div className="text-center py-8">
                  <div className="w-8 h-8 mx-auto mb-3 text-3xl">{Icons.budget}</div>
                  <h4 className="font-semibold text-gray-100 mb-2">Add Your Monthly Salary</h4>
                  <p className="text-sm text-gray-300 mb-4">
                    Unlock financial health analysis and personalized recommendations
                  </p>
                  <button
                    onClick={() => {
                      document.querySelector('.income-settings')?.scrollIntoView({behavior: 'smooth'});
                      setIsOpen(false);
                    }}
                    className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium border border-gray-600"
                  >
                    ➕ Add Income
                  </button>
                </div>
              )}

              {activeView === 'alerts' && insights && (
                <div className="space-y-3">
                  {insights.alerts.length > 0 ? (
                    insights.alerts.map((alert, index) => (
                      <div key={index} className={`p-3 rounded-xl border-l-4 ${
                        alert.severity === 'critical' ? 'border-red-500 bg-red-900/30' :
                        alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-900/30' :
                        'border-blue-500 bg-blue-900/30'
                      }`}>
                        <div className="flex items-start">
                          <div className="w-5 h-5 mr-2 flex-shrink-0">
                            {alert.severity === 'critical' ? Icons.warning :
                             alert.severity === 'warning' ? Icons.alert : Icons.analytics}
                          </div>
                          <div>
                            <div className="font-medium text-gray-200 text-sm">{alert.title}</div>
                            <div className="text-gray-300 text-xs mt-1">{alert.message}</div>
                            <div className="text-gray-400 text-xs mt-1 italic">{alert.action}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 mx-auto mb-3 text-3xl">{Icons.checkmark}</div>
                      <h4 className="font-semibold text-gray-200 mb-2">All Good!</h4>
                      <p className="text-sm text-gray-400">No alerts at this time. Keep up the great work!</p>
                    </div>
                  )}
                </div>
              )}

              {activeView === 'chat' && (
                <div className="flex flex-col h-80">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2" style={{scrollBehavior: 'smooth'}}>
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border border-gray-600' 
                            : 'bg-gray-800 text-gray-200 border border-gray-700'
                        }`}>
                          {message.type === 'bot' && (
                            <div className="flex items-center mb-1">
                              <div className="w-4 h-4 mr-2">{Icons.ai}</div>
                              <span className="text-xs font-medium opacity-70">AI Coach</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed whitespace-pre-line">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.type === 'user' ? 'text-white opacity-70' : 'text-gray-500'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Typing Indicator */}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-800 text-gray-200 px-4 py-2 rounded-2xl border border-gray-700">
                          <div className="flex items-center">
                            <div className="w-4 h-4 mr-2">{Icons.ai}</div>
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Auto-scroll target */}
                    <div ref={chatMessagesEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Ask me about your finances..."
                        className="flex-1 px-3 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-sm placeholder-gray-400"
                        disabled={isTyping}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isTyping || chatInput.trim() === ''}
                        className="bg-gradient-to-r from-gray-700 to-gray-600 text-white px-4 py-2 rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-200 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
                      >
                        Send
                      </button>
                    </div>
                    
                    {/* Quick Chat Suggestions */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {[
                        "How's my budget?",
                        "Savings tips?",
                        "Spending analysis",
                        "Help me save money"
                      ].map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (!isTyping) {
                              setChatInput(suggestion);
                              setTimeout(() => handleSendMessage(), 100);
                            }
                          }}
                          className="text-xs bg-gray-800 text-gray-300 px-3 py-1 rounded-full hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
                          disabled={isTyping}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions Footer */}
            <div className="p-3 md:p-4 bg-gradient-to-r from-gray-900 via-black to-gray-800 border-t border-gray-700 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-transparent"></div>
              <div className="relative z-10">
                <h4 className="text-xs md:text-sm font-bold text-gray-200 mb-2 md:mb-3 text-center">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <button 
                    onClick={() => {
                      document.getElementById('description')?.focus();
                      setIsOpen(false);
                    }}
                    className="group bg-gradient-to-r from-gray-700 to-gray-600 text-white text-xs md:text-sm py-2 md:py-2.5 px-2 md:px-3 rounded-lg md:rounded-xl hover:from-gray-600 hover:to-gray-500 transition-all duration-300 font-semibold shadow-md hover:shadow-lg relative overflow-hidden border border-gray-600"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center whitespace-nowrap">
                      <span className="mr-1">➕</span>
                      <span className="hidden sm:inline">Add Expense</span>
                      <span className="sm:hidden">Add</span>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      document.querySelector('[data-section="analytics"]')?.scrollIntoView({behavior: 'smooth'});
                      setIsOpen(false);
                    }}
                    className="group bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs md:text-sm py-2 md:py-2.5 px-2 md:px-3 rounded-lg md:rounded-xl hover:from-gray-500 hover:to-gray-600 transition-all duration-300 font-semibold shadow-md hover:shadow-lg relative overflow-hidden border border-gray-600"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center whitespace-nowrap">
                      <div className="w-3 md:w-4 h-3 md:h-4 mr-1">{Icons.analytics}</div>
                      <span className="hidden sm:inline">Analytics</span>
                      <span className="sm:hidden">Analyze</span>
                    </div>
                  </button>
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;