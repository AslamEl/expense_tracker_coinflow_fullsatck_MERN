import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Icons } from '../utils/svgIcons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// No additional styles needed
// Using Tailwind CSS classes only for clean modern design

// Inject basic styles if needed
if (typeof document !== 'undefined') {
  // Clean modern design uses only Tailwind CSS
}

const Analytics = ({ expenses, monthlyIncome = 0 }) => {
  const categories = [
    'Food', 
    'Transport', 
    'Shopping', 
    'Bills',
    'Education',
    'Travel',
    'Other'
  ];
  
  const getCategoryTotals = () => {
    const totals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    return totals;
  };

  const categoryTotals = getCategoryTotals();

  // Pie Chart Data
  const pieData = {
    labels: categories.filter(cat => categoryTotals[cat] > 0),
    datasets: [
      {
        label: 'Expenses by Category',
        data: categories.filter(cat => categoryTotals[cat] > 0).map(cat => categoryTotals[cat]),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',   // Green
          'rgba(59, 130, 246, 0.8)',  // Blue  
          'rgba(147, 51, 234, 0.8)',  // Purple
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(99, 102, 241, 0.8)',  // Indigo
          'rgba(244, 63, 94, 0.8)',   // Pink
          'rgba(245, 158, 11, 0.8)',  // Amber
          'rgba(14, 165, 233, 0.8)',  // Sky
          'rgba(16, 185, 129, 0.8)',  // Emerald
          'rgba(251, 146, 60, 0.8)',  // Orange
          'rgba(100, 116, 139, 0.8)', // Slate
          'rgba(236, 72, 153, 0.8)',  // Pink
          'rgba(6, 182, 212, 0.8)',   // Cyan
          'rgba(34, 197, 94, 0.8)',   // Green
          'rgba(37, 99, 235, 0.8)',   // Blue
          'rgba(124, 58, 237, 0.8)',  // Violet
          'rgba(249, 115, 22, 0.8)',  // Orange
          'rgba(219, 39, 119, 0.8)',  // Pink
          'rgba(239, 68, 68, 0.8)',   // Red
          'rgba(251, 191, 36, 0.8)',  // Yellow
          'rgba(75, 85, 99, 0.8)',    // Gray
          'rgba(107, 114, 128, 0.8)', // Gray
          'rgba(156, 163, 175, 0.8)'  // Gray
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',     // Green
          'rgba(59, 130, 246, 1)',    // Blue  
          'rgba(147, 51, 234, 1)',    // Purple
          'rgba(239, 68, 68, 1)',     // Red
          'rgba(99, 102, 241, 1)',    // Indigo
          'rgba(244, 63, 94, 1)',     // Pink
          'rgba(245, 158, 11, 1)',    // Amber
          'rgba(14, 165, 233, 1)',    // Sky
          'rgba(16, 185, 129, 1)',    // Emerald
          'rgba(251, 146, 60, 1)',    // Orange
          'rgba(100, 116, 139, 1)',   // Slate
          'rgba(236, 72, 153, 1)',    // Pink
          'rgba(6, 182, 212, 1)',     // Cyan
          'rgba(34, 197, 94, 1)',     // Green
          'rgba(37, 99, 235, 1)',     // Blue
          'rgba(124, 58, 237, 1)',    // Violet
          'rgba(249, 115, 22, 1)',    // Orange
          'rgba(219, 39, 119, 1)',    // Pink
          'rgba(239, 68, 68, 1)',     // Red
          'rgba(251, 191, 36, 1)',    // Yellow
          'rgba(75, 85, 99, 1)',      // Gray
          'rgba(107, 114, 128, 1)',   // Gray
          'rgba(156, 163, 175, 1)'    // Gray
        ],
        borderWidth: 2,
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Amount ($)',
        data: categories.map(cat => categoryTotals[cat] || 0),
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',   // Green
          'rgba(59, 130, 246, 0.7)',  // Blue  
          'rgba(147, 51, 234, 0.7)',  // Purple
          'rgba(239, 68, 68, 0.7)',   // Red
          'rgba(99, 102, 241, 0.7)',  // Indigo
          'rgba(244, 63, 94, 0.7)',   // Pink
          'rgba(245, 158, 11, 0.7)',  // Amber
          'rgba(14, 165, 233, 0.7)',  // Sky
          'rgba(16, 185, 129, 0.7)',  // Emerald
          'rgba(251, 146, 60, 0.7)',  // Orange
          'rgba(100, 116, 139, 0.7)', // Slate
          'rgba(236, 72, 153, 0.7)',  // Pink
          'rgba(6, 182, 212, 0.7)',   // Cyan
          'rgba(34, 197, 94, 0.7)',   // Green
          'rgba(37, 99, 235, 0.7)',   // Blue
          'rgba(124, 58, 237, 0.7)',  // Violet
          'rgba(249, 115, 22, 0.7)',  // Orange
          'rgba(219, 39, 119, 0.7)',  // Pink
          'rgba(239, 68, 68, 0.7)',   // Red
          'rgba(251, 191, 36, 0.7)',  // Yellow
          'rgba(75, 85, 99, 0.7)',    // Gray
          'rgba(107, 114, 128, 0.7)', // Gray
          'rgba(156, 163, 175, 0.7)'  // Gray
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',     // Green
          'rgba(59, 130, 246, 1)',    // Blue  
          'rgba(147, 51, 234, 1)',    // Purple
          'rgba(239, 68, 68, 1)',     // Red
          'rgba(99, 102, 241, 1)',    // Indigo
          'rgba(244, 63, 94, 1)',     // Pink
          'rgba(245, 158, 11, 1)',    // Amber
          'rgba(14, 165, 233, 1)',    // Sky
          'rgba(16, 185, 129, 1)',    // Emerald
          'rgba(251, 146, 60, 1)',    // Orange
          'rgba(100, 116, 139, 1)',   // Slate
          'rgba(236, 72, 153, 1)',    // Pink
          'rgba(6, 182, 212, 1)',     // Cyan
          'rgba(34, 197, 94, 1)',     // Green
          'rgba(37, 99, 235, 1)',     // Blue
          'rgba(124, 58, 237, 1)',    // Violet
          'rgba(249, 115, 22, 1)',    // Orange
          'rgba(219, 39, 119, 1)',    // Pink
          'rgba(239, 68, 68, 1)',     // Red
          'rgba(251, 191, 36, 1)',    // Yellow
          'rgba(75, 85, 99, 1)',      // Gray
          'rgba(107, 114, 128, 1)',   // Gray
          'rgba(156, 163, 175, 1)'    // Gray
        ],
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  // Chart Options
  const pieOptions = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 14,
            weight: 500,
          },
          color: '#374151',
        },
      },
      title: {
        display: true,
        text: 'Spending Distribution',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#111827',
        padding: 20,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
          afterLabel: function(context) {
            return 'Click for details →';
          }
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Category Comparison',
        font: {
          size: 18,
          weight: 'bold',
        },
        color: '#111827',
        padding: 20,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
            return [`Amount: $${context.parsed.y.toFixed(2)}`, `Percentage: ${percentage}%`];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          },
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        }
      }
    },
  };

  // Weekly spending trend (last 7 days)
  const getWeeklyData = () => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: 0
      });
    }

    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date).toISOString().split('T')[0];
      const dayData = last7Days.find(day => day.date === expenseDate);
      if (dayData) {
        dayData.amount += expense.amount;
      }
    });

    return last7Days;
  };

  const weeklyData = getWeeklyData();

  const weeklyChartData = {
    labels: weeklyData.map(day => day.day),
    datasets: [
      {
        label: 'Daily Spending',
        data: weeklyData.map(day => day.amount),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 mb-6 md:mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute -top-8 -right-8 w-16 md:w-32 h-16 md:h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 text-center py-8 md:py-16">
          <div className="w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-xl">
            <div className="w-8 h-8 md:w-12 md:h-12">{Icons.analytics}</div>
          </div>
          <h3 className="text-xl md:text-3xl font-black text-gray-900 mb-2 md:mb-4">No Analytics Yet</h3>
          <p className="text-gray-600 text-xs md:text-lg font-medium px-2">Add expenses to see insights!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Analytics Header */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute -top-6 -right-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 md:gap-6">
          <div className="w-12 md:w-16 h-12 md:h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl md:rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xl">
            <svg className="w-6 md:w-8 h-6 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-lg md:text-3xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent mb-0.5 md:mb-2">
              Expense Analytics
            </h2>
            <p className="text-gray-600 text-xs md:text-lg font-medium">
              Visualize your spending patterns
            </p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Pie Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden group hover:shadow-2xl hover:border-white/40 transition-all duration-500 transform hover:scale-102">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -top-4 -left-4 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-pink-400/20 to-purple-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
          
          {/* Interactive overlay indicator */}
          <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chart
          </div>
          
          <div className="relative z-10">
            <div className="h-64 md:h-80 transition-transform duration-300 group-hover:scale-105">
              <Pie data={pieData} options={pieOptions} />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3 group-hover:text-gray-700 transition-colors">Hover over segments to see details</p>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden group hover:shadow-2xl hover:border-white/40 transition-all duration-500 transform hover:scale-102">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute -bottom-4 -right-4 w-16 md:w-20 h-16 md:h-20 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
          
          {/* Interactive overlay indicator */}
          <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Chart
          </div>
          
          <div className="relative z-10">
            <div className="h-64 md:h-80 transition-transform duration-300 group-hover:scale-105">
              <Bar data={barData} options={barOptions} />
            </div>
            <p className="text-center text-xs text-gray-500 mt-3 group-hover:text-gray-700 transition-colors">Hover over bars to compare</p>
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/20 p-4 md:p-8 relative overflow-hidden group hover:shadow-2xl hover:border-white/40 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        <div className="absolute -top-6 -left-6 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4 mb-4 md:mb-6">
            <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg md:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 md:w-6 h-5 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base md:text-2xl font-black text-gray-900">
                7-Day Spending Trend
              </h3>
              <p className="text-xs md:text-sm text-gray-600 font-medium">Your daily spending patterns</p>
            </div>
            <div className="ml-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Trend
            </div>
          </div>
          <div className="h-56 md:h-64 transition-transform duration-300 group-hover:scale-102">
            <Bar 
              data={weeklyChartData} 
              options={{
                ...barOptions,
                plugins: {
                  ...barOptions.plugins,
                  title: {
                    display: false,
                  },
                },
              }} 
            />
          </div>
          <p className="text-center text-xs text-gray-500 mt-3 group-hover:text-gray-700 transition-colors">Track your daily spending to identify patterns</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-green-100 group hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-xs md:text-sm font-semibold uppercase tracking-wider">Highest Category</p>
              <p className="text-lg md:text-2xl font-bold text-green-700 truncate mt-2 group-hover:text-green-800 transition-colors">
                {Object.keys(categoryTotals).reduce(
                  (a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, 
                  'None'
                )}
              </p>
              <p className="text-xs text-green-600 mt-1 font-medium">
                ${Object.keys(categoryTotals).length > 0 
                  ? Math.max(...Object.values(categoryTotals)).toFixed(2) 
                  : '0.00'}
              </p>
            </div>
            <div className="w-10 md:w-12 h-10 md:h-12 flex-shrink-0 text-green-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 opacity-80 group-hover:opacity-100">{Icons.analytics}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-blue-100 group hover:shadow-xl hover:border-blue-200 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-blue-100 hover:to-cyan-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-xs md:text-sm font-semibold uppercase tracking-wider">Avg per Transaction</p>
              <p className="text-lg md:text-2xl font-bold text-blue-700 mt-2 group-hover:text-blue-800 transition-colors">
                ${expenses.length > 0 ? (expenses.reduce((sum, exp) => sum + exp.amount, 0) / expenses.length).toFixed(2) : '0.00'}
              </p>
              <p className="text-xs text-blue-600 mt-1 font-medium">{expenses.length} transactions</p>
            </div>
            <div className="w-10 md:w-12 h-10 md:h-12 flex-shrink-0 text-blue-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 opacity-80 group-hover:opacity-100">{Icons.money}</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 md:p-6 rounded-lg md:rounded-xl border border-purple-100 group hover:shadow-xl hover:border-purple-200 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-purple-100 hover:to-violet-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-xs md:text-sm font-semibold uppercase tracking-wider">Today's Spending</p>
              <p className="text-lg md:text-2xl font-bold text-purple-700 mt-2 group-hover:text-purple-800 transition-colors">
                ${expenses
                  .filter(exp => new Date(exp.date).toDateString() === new Date().toDateString())
                  .reduce((sum, exp) => sum + exp.amount, 0)
                  .toFixed(2)}
              </p>
              <p className="text-xs text-purple-600 mt-1 font-medium">
                {expenses.filter(exp => new Date(exp.date).toDateString() === new Date().toDateString()).length} transactions today
              </p>
            </div>
            <div className="w-10 md:w-12 h-10 md:h-12 flex-shrink-0 text-purple-600 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 opacity-80 group-hover:opacity-100">{Icons.budget}</div>
          </div>
        </div>
      </div>

      {/* Budget Overview - Only show if income is set */}
      {monthlyIncome > 0 && (
        <div className="mt-6 md:mt-8">
          <div className="flex items-center mb-4 md:mb-6">
            <div className="w-5 h-5 mr-3 text-indigo-600 animate-pulse">{Icons.money}</div>
            <h3 className="text-base md:text-xl font-bold text-gray-800">Budget Overview</h3>
            <div className="ml-auto text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1 rounded-full font-semibold">
              Smart Analysis
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-indigo-100 group hover:shadow-lg hover:border-indigo-200 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-indigo-100 hover:to-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-600 text-xs md:text-sm font-semibold uppercase tracking-wider">Monthly Salary</p>
                  <p className="text-lg md:text-xl font-bold text-indigo-700 mt-2 group-hover:text-indigo-800 transition-colors">${monthlyIncome.toFixed(2)}</p>
                  <div className="w-full bg-indigo-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 h-full rounded-full" style={{width: '100%'}}></div>
                  </div>
                </div>
                <div className="w-6 md:w-8 h-6 md:h-8 flex-shrink-0 text-indigo-600 group-hover:scale-110 transition-transform">{Icons.budget}</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-red-100 group hover:shadow-lg hover:border-red-200 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-red-100 hover:to-pink-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-600 text-xs md:text-sm font-semibold uppercase tracking-wider">Total Expenses</p>
                  <p className="text-lg md:text-xl font-bold text-red-700 mt-2 group-hover:text-red-800 transition-colors">
                    ${expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
                  </p>
                  <div className="w-full bg-red-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-red-600 to-pink-600 h-full rounded-full transition-all duration-500" 
                      style={{width: `${Math.min(100, (expenses.reduce((sum, exp) => sum + exp.amount, 0) / monthlyIncome) * 100)}%`}}
                    ></div>
                  </div>
                </div>
                <div className="w-6 md:w-8 h-6 md:h-8 flex-shrink-0 text-red-600 group-hover:scale-110 transition-transform">{Icons.creditCard}</div>
              </div>
            </div>

            <div className={`bg-gradient-to-br p-3 md:p-4 rounded-lg md:rounded-xl border group hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer hover:-translate-y-1 ${
              (monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)) >= 0 
                ? 'from-green-50 to-emerald-50 border-green-100 hover:border-green-200 hover:bg-gradient-to-br hover:from-green-100 hover:to-emerald-100' 
                : 'from-red-50 to-rose-50 border-red-100 hover:border-red-200 hover:bg-gradient-to-br hover:from-red-100 hover:to-rose-100'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs md:text-sm font-semibold uppercase tracking-wider ${
                    (monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)) >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {(monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)) >= 0 ? 'Remaining' : 'Over Budget'}
                  </p>
                  <p className={`text-lg md:text-xl font-bold mt-2 transition-colors ${
                    (monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)) >= 0 
                      ? 'text-green-700 group-hover:text-green-800' 
                      : 'text-red-700 group-hover:text-red-800'
                  }`}>
                    ${Math.abs(monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)).toFixed(2)}
                  </p>
                  <div className={`w-full rounded-full h-2 mt-2 overflow-hidden ${
                    (monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)) >= 0 
                      ? 'bg-green-200' 
                      : 'bg-red-200'
                  }`}>
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        (monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)) >= 0 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                          : 'bg-gradient-to-r from-red-600 to-rose-600'
                      }`} 
                      style={{width: `${Math.min(100, (Math.abs(monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)) / monthlyIncome) * 100)}%`}}
                    ></div>
                  </div>
                </div>
                <div className="w-6 md:w-8 h-6 md:h-8 flex-shrink-0 group-hover:scale-110 transition-transform">
                  {(monthlyIncome - expenses.reduce((sum, exp) => sum + exp.amount, 0)) >= 0 ? <span className="text-green-600">{Icons.checkmark}</span> : <span className="text-red-600">{Icons.warning}</span>}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-3 md:p-4 rounded-lg md:rounded-xl border border-yellow-100 group hover:shadow-lg hover:border-yellow-200 transition-all duration-300 transform hover:scale-105 cursor-pointer hover:-translate-y-1 hover:bg-gradient-to-br hover:from-yellow-100 hover:to-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-600 text-xs md:text-sm font-semibold uppercase tracking-wider">Expense Ratio</p>
                  <p className="text-lg md:text-xl font-bold text-yellow-700 mt-2 group-hover:text-yellow-800 transition-colors">
                    {((expenses.reduce((sum, exp) => sum + exp.amount, 0) / monthlyIncome) * 100).toFixed(1)}%
                  </p>
                  <div className="w-full bg-yellow-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-600 to-amber-600 h-full rounded-full transition-all duration-500" 
                      style={{width: `${Math.min(100, ((expenses.reduce((sum, exp) => sum + exp.amount, 0) / monthlyIncome) * 100))}%`}}
                    ></div>
                  </div>
                  <p className="text-xs text-yellow-600 mt-1 font-medium">{((expenses.reduce((sum, exp) => sum + exp.amount, 0) / monthlyIncome) * 100) < 80 ? '✓ Healthy' : '⚠ High'}</p>
                </div>
                <div className="w-6 md:w-8 h-6 md:h-8 flex-shrink-0 text-yellow-600 group-hover:scale-110 transition-transform">{Icons.analytics}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;